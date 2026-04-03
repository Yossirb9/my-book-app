import { GoogleGenerativeAI } from '@google/generative-ai'
import { Character, BookParams } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const STYLE_PROMPTS = {
  realistic:
    'photorealistic illustration style, warm colors, children book aesthetic, soft lighting, detailed faces matching reference photos',
  illustrated:
    'colorful illustrated children book style, vibrant colors, friendly cartoon aesthetic, detailed characters',
}

export async function generatePageImage(
  sceneDescription: string,
  characters: Character[],
  params: BookParams,
  characterImageBase64s: { name: string; base64: string; mimeType: string }[]
): Promise<Buffer> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-image-preview' })

  const characterDescriptions = characters
    .map((c) => {
      const ref = characterImageBase64s.find((r) => r.name === c.name)
      return `${c.name}: ${c.description || 'as shown in reference photo'}`
    })
    .join('\n')

  const prompt = `Create a children's book illustration for the following scene:

Scene: ${sceneDescription}

Characters in this scene:
${characterDescriptions}

Style: ${STYLE_PROMPTS[params.visualStyle]}
Format: ${params.format === 'square' ? 'square 1:1 aspect ratio' : 'portrait A4 aspect ratio'}

CRITICAL: The characters must look EXACTLY like the reference photos provided.
- Match faces, hair color, age, and general appearance precisely
- Keep character appearance consistent with the reference images
- Create a warm, child-friendly atmosphere
- No text in the image
- Hebrew children book aesthetic`

  const imageParts = characterImageBase64s.map((ref) => ({
    inlineData: {
      data: ref.base64,
      mimeType: ref.mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
    },
  }))

  const result = await model.generateContent([prompt, ...imageParts])
  const response = result.response

  // Extract image from response
  const parts = response.candidates?.[0]?.content?.parts
  if (!parts) throw new Error('No image generated')

  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'))
  if (!imagePart?.inlineData) throw new Error('No image in response')

  return Buffer.from(imagePart.inlineData.data, 'base64')
}
