import { GoogleGenerativeAI } from '@google/generative-ai'
import { BookParams } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export type JournalPageType = 'affirmation' | 'question' | 'memory' | 'growth' | 'dream'

export interface JournalPage {
  pageNumber: number
  pageType: JournalPageType
  title: string           // e.g. "מה שאני אוהב בעצמי"
  prompt: string          // The main text / question / statement on the page
  sceneDescription: string // For image generation
  charactersInScene: string[]
}

export async function generateJournal(params: BookParams): Promise<JournalPage[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

  const mainChar = params.characters.find((c) => c.role === 'main')
  const childName = mainChar?.name || params.characters[0]?.name || 'הילד'
  const ageGroup = params.ageGroup

  const prompt = `אתה יוצר יומן רגשי-משפחתי מעצים בעברית עבור ילד/ה בשם ${childName}, גיל ${ageGroup}.

היומן נועד לחזק ביטחון עצמי, לעודד שיח בין הורה לילד, ולתעד רגעי גדילה.

צור 18 עמודי יומן מגוונים מהסוגים הבאים:
- affirmation: משפט חיזוק אישי מעצים על הילד
- question: שאלה פתוחה לשיח בין ילד להורה
- memory: הנחיה לתיעוד רגע מיוחד ("כתוב/י או הדבק/י תמונה מהרגע שבו...")
- growth: "דבר שפעם היה קשה לי ועכשיו אני יכול/ה..."
- dream: חלום, משאלה או מטרה עתידית של הילד

**פורמט:**
{
  "pages": [
    {
      "pageNumber": 1,
      "pageType": "affirmation",
      "title": "מה שמיוחד בי",
      "prompt": "אני, ${childName}, ייחודי/ת כי...",
      "sceneDescription": "תיאור מפורט לאיור: ילד/ה שמח/ה, מסביב ניצנים וכוכבים...",
      "charactersInScene": ["${childName}"]
    }
  ]
}

**הנחיות:**
- שמור על מגוון: לפחות 3 מכל סוג
- שפה: מותאמת לגיל ${ageGroup}
- טון: חם, מעצים, אוהב
- כל עמוד ייחודי ומרגש
- השתמש בשם ${childName} בחלק מהעמודים
- החזר JSON בלבד`

  const result = await model.generateContent(prompt)
  const responseText = result.response.text().trim()

  const jsonText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed = JSON.parse(jsonText)
  return parsed.pages as JournalPage[]
}
