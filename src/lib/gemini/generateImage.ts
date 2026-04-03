import { GoogleGenerativeAI } from '@google/generative-ai'
import { Character, BookParams } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generatePageImage(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  characterImageBase64s: { name: string; base64: string; mimeType: string }[],
  charactersInScene?: string[]
): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' })

  // Use all refs unless a specific scene filter is provided
  const refs = (charactersInScene && charactersInScene.length > 0)
    ? characterImageBase64s.filter((ref) =>
        charactersInScene.some((n) => n.trim().toLowerCase() === ref.name.trim().toLowerCase())
      )
    : characterImageBase64s

  // Fall back to all refs if filter produced nothing
  const relevantRefs = refs.length > 0 ? refs : characterImageBase64s

  const charList = characters.map((c) => {
    const hasRef = relevantRefs.some((r) => r.name.trim().toLowerCase() === c.name.trim().toLowerCase())
    return `- ${c.name}${c.description ? ' (' + c.description + ')' : ''}${hasRef ? ' ← REFERENCE PHOTO ATTACHED' : ''}`
  }).join('\n')

  const format = params.format === 'square' ? 'square 1:1 ratio' : 'portrait A4 ratio'

  const prompt = `TASK: Create a HIGH-QUALITY PHOTOREALISTIC photograph-style illustration for a personalized children's book.

SCENE TO ILLUSTRATE:
${sceneDescription}

CHARACTERS:
${charList}

${relevantRefs.length > 0 ? `REFERENCE PHOTOS: I am attaching ${relevantRefs.length} real reference photo(s) of the characters.
YOU MUST:
- Make each character's face look IDENTICAL to their reference photo
- Match exact facial features, skin tone, eye color, hair color, hair style, and age
- The people in this book are REAL — parents will show this to their children
- Character likeness is the #1 priority of this illustration` : ''}

STYLE REQUIREMENTS (MANDATORY):
- PHOTOREALISTIC style — like a high-end photograph or hyper-realistic digital art
- NOT cartoon, NOT illustrated, NOT animated, NOT watercolor, NOT painterly
- Cinematic warm lighting, soft depth of field
- Rich detail in faces, clothing, and environment
- Professional photography quality

COMPOSITION:
- Format: ${format}
- Warm, inviting family atmosphere
- Child-friendly scene with beautiful natural or home setting
- NO text, words, letters, or writing anywhere in the image
- Faces clearly visible and well-lit`

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

  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'))
  if (!imagePart?.inlineData) throw new Error('No image in response')

  return Buffer.from(imagePart.inlineData.data, 'base64')
}
