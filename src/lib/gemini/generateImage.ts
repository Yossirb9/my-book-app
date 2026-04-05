import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCharacterPromptDescriptor } from '@/lib/characters'
import { BookParams, Character } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

type CharacterImageRef = { name: string; base64: string; mimeType: string }

function buildImagePrompt(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  relevantRefs: CharacterImageRef[],
  mode: 'primary' | 'fallback'
) {
  const charList = characters
    .map((character) => {
      const hasRef = relevantRefs.some(
        (ref) => ref.name.trim().toLowerCase() === character.name.trim().toLowerCase()
      )
      const desc = [character.gender, getCharacterPromptDescriptor(character)].filter(Boolean).join(', ')
      return `- ${character.name}${desc ? ` (${desc})` : ''}${hasRef ? ' -> REFERENCE PHOTO ATTACHED' : ''}`
    })
    .join('\n')

  const format = params.format === 'square' ? 'square 1:1 ratio' : 'portrait A4 ratio'

  const fallbackInstruction =
    mode === 'fallback'
      ? `
FALLBACK SIMPLIFICATION:
- If the original scene is too complex, keep the same emotional meaning but simplify the composition
- Use a clean background and fewer visual elements
- Keep the exact listed characters only
- Prioritize correct faces, correct ages, and a stable composition over visual complexity`
      : ''

  return `TASK: Create a HIGH-QUALITY PHOTOREALISTIC photograph-style illustration for a personalized children's book.

SCENE TO ILLUSTRATE:
${sceneDescription}

CHARACTERS IN THIS SCENE (ONLY these characters should appear - do NOT add any other people):
${charList}

CRITICAL: Only the characters listed above should appear in the image. Do not add strangers, extra children, or background people.

${
  relevantRefs.length > 0
    ? `REFERENCE PHOTOS: I am attaching ${relevantRefs.length} real reference photo(s) of the characters.
YOU MUST:
- Make each character's face look IDENTICAL to their reference photo
- Match EXACT age, facial features, skin tone, eye color, hair color, and hair style
- Do NOT make characters younger or older than they appear in the reference photo
- The people in this book are REAL - parents will show this to their children
- Character likeness and correct age is the #1 priority of this illustration`
    : ''
}

STYLE REQUIREMENTS (ABSOLUTELY MANDATORY - NO EXCEPTIONS):
- PHOTOREALISTIC style ONLY - like a high-end professional photograph
- STRICTLY FORBIDDEN: cartoon, illustration, animation, watercolor, painting, sketch, comic, drawing, 3D render, CGI
- If you feel tempted to add any illustrated or stylized elements - DON'T. Stay purely photographic.
- Cinematic warm lighting, soft depth of field, bokeh background
- Rich detail in faces, clothing, textures, and environment
- Professional DSLR photography quality

COMPOSITION:
- Format: ${format}
- Warm, inviting family atmosphere
- Child-friendly scene with beautiful natural or home setting
- NO text, words, letters, numbers, or writing anywhere in the image
- Faces clearly visible, well-lit, and sharp
${fallbackInstruction}`
}

export async function generatePageImage(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  characterImageBase64s: CharacterImageRef[],
  charactersInScene?: string[],
  mode: 'primary' | 'fallback' = 'primary'
): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' })

  const refs =
    charactersInScene && charactersInScene.length > 0
      ? characterImageBase64s.filter((ref) =>
          charactersInScene.some((name) => name.trim().toLowerCase() === ref.name.trim().toLowerCase())
        )
      : characterImageBase64s

  const relevantRefs = refs.length > 0 ? refs : characterImageBase64s

  const sceneCharacters =
    charactersInScene && charactersInScene.length > 0
      ? characters.filter((character) =>
          charactersInScene.some((name) => name.trim().toLowerCase() === character.name.trim().toLowerCase())
        )
      : characters

  const prompt = buildImagePrompt(sceneDescription, sceneCharacters, params, relevantRefs, mode)

  const imageParts = relevantRefs.map((ref) => ({
    inlineData: {
      data: ref.base64,
      mimeType: ref.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
    },
  }))

  const result = await model.generateContent([prompt, ...imageParts])
  const response = result.response

  const parts = response.candidates?.[0]?.content?.parts
  if (!parts) throw new Error('No image generated')

  const imagePart = parts.find((part) => part.inlineData?.mimeType?.startsWith('image/'))
  if (!imagePart?.inlineData) throw new Error('No image in response')

  return Buffer.from(imagePart.inlineData.data, 'base64')
}

export async function generatePageImageWithFallback(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  characterImageBase64s: CharacterImageRef[],
  charactersInScene?: string[]
) {
  let lastError: unknown = null

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await generatePageImage(
        sceneDescription,
        characters,
        params,
        characterImageBase64s,
        charactersInScene,
        'primary'
      )
    } catch (error) {
      lastError = error
      console.error(`Primary image generation attempt ${attempt} failed:`, error)
    }
  }

  const fallbackPrompt = `${sceneDescription}

גרסת fallback: אם הסצנה מורכבת מדי, שמרו על אותן דמויות ואותה משמעות רגשית, אבל פשטו את הקומפוזיציה, את הרקע ואת מספר האלמנטים.`

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await generatePageImage(
        fallbackPrompt,
        characters,
        params,
        characterImageBase64s,
        charactersInScene,
        'fallback'
      )
    } catch (error) {
      lastError = error
      console.error(`Fallback image generation attempt ${attempt} failed:`, error)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Image generation failed after fallback attempts')
}
