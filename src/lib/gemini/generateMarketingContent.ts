import { GoogleGenerativeAI } from '@google/generative-ai'
import { MarketingAssetType, MarketingGoal } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

type GenerateMarketingContentInput = {
  type: MarketingAssetType
  topic: string
  goal?: MarketingGoal
  segmentDescription?: string
}

export async function generateMarketingContent(input: GenerateMarketingContentInput) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

  const prompt = `אתה קופירייטר ושיווקיסט למותג ספרי ילדים אישיים בעברית.

צור תוכן שיווקי בפורמט JSON בלבד.

סוג נכס: ${input.type}
נושא: ${input.topic}
מטרה: ${input.goal || 'sales'}
סגמנט: ${input.segmentDescription || 'קהל כללי של הורים לילדים'}

החזר JSON בלבד במבנה:
{
  "title": "כותרת",
  "summary": "תקציר קצר",
  "content": {
    "sections": [],
    "metaTitle": "",
    "metaDescription": "",
    "socialOptions": [],
    "newsletterSubject": "",
    "newsletterBody": "",
    "upsellCopy": ""
  }
}

כל התוכן בעברית, קצר, ברור ושמיש מיידית.`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const jsonText = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(jsonText) as {
    title: string
    summary: string
    content: {
      sections?: string[]
      metaTitle?: string
      metaDescription?: string
      socialOptions?: string[]
      newsletterSubject?: string
      newsletterBody?: string
      upsellCopy?: string
    }
  }
}
