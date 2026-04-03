import { GoogleGenerativeAI } from '@google/generative-ai'
import { Character, BookParams } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generatePageImage(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  characterImageBase64s: { name: string; base64: string; mimeType: string }[],
  charactersInScene?: string[] // if provided, only send refs for these characters
): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' })

  // Filter reference photos: only characters that appear in this scene
  const relevantRefs = charactersInScene && charactersInScene.length > 0
    ? characterImageBase64s.filter((ref) =>
        charactersInScene.some((name) =>
          name.trim().toLowerCase() === ref.name.trim().toLowerCase()
        )
      )
    : characterImageBase64s

  const format = params.format === 'square' ? 'square 1:1' : 'portrait A4'

  // Build character description list
  const charDescriptions = (charactersInScene && charactersInScene.length > 0
    ? characters.filter((c) => charactersInScene.some((n) => n.trim().toLowerCase() === c.name.trim().toLowerCase()))
    : characters
  ).map((c) => {
    const hasRef = relevantRefs.some((r) => r.name.trim().toLowerCase() === c.name.trim().toLowerCase())
    return `- ${c.name}${c.description ? ': ' + c.description : ''}${hasRef ? ' [reference photo provided]' : ''}`
  }).join('\n')

  const prompt = `Create a photorealistic children's book illustration.

SCENE:
${sceneDescription}

CHARACTERS IN THIS SCENE:
${charDescriptions}

CRITICAL INSTRUCTIONS:
${relevantRefs.length > 0
  ? `- The ${relevantRefs.length} reference photo(s) provided show the REAL people — you MUST make the characters look EXACTLY like them
- Match their face, skin tone, hair color/style, age, and facial features with precision
- This is a personalized book — character likeness is the most important requirement`
  : '- Draw the characters based on their descriptions'}
- Style: photorealistic, warm and cinematic lighting, high quality
- Mood: warm, loving, child-friendly atmosphere
- Format: ${format} aspect ratio
- NO text or words in the image
- Background: detailed, cozy, story-appropriate setting`

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
