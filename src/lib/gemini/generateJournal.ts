import { GoogleGenerativeAI } from '@google/generative-ai'
import { BookParams, JournalPageType } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface JournalPage {
  pageNumber: number
  pageType: JournalPageType
  chapterNumber: number
  chapterTitle: string
  title: string
  prompt: string
  sceneDescription?: string
  charactersInScene: string[]
  needsImage: boolean
}

const JOURNAL_STRUCTURE: Array<{
  pageType: JournalPageType
  chapterNumber: number
  chapterTitle: string
  needsImage: boolean
}> = [
  // Page 1: Cover
  { pageType: 'cover', chapterNumber: 0, chapterTitle: '', needsImage: true },
  // Chapter 1: מי אני (pages 2–7)
  { pageType: 'chapter_divider', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: true },
  { pageType: 'affirmation', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: true },
  { pageType: 'affirmation', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: true },
  { pageType: 'affirmation', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: true },
  { pageType: 'question', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: false },
  { pageType: 'question', chapterNumber: 1, chapterTitle: 'מי אני', needsImage: false },
  // Chapter 2: רגעים של גדילה (pages 8–13)
  { pageType: 'chapter_divider', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: true },
  { pageType: 'growth', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: true },
  { pageType: 'growth', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: true },
  { pageType: 'growth', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: true },
  { pageType: 'memory', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: false },
  { pageType: 'memory', chapterNumber: 2, chapterTitle: 'רגעים של גדילה', needsImage: false },
  // Chapter 3: שיחות עם אמא ואבא (pages 14–19)
  { pageType: 'chapter_divider', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: true },
  { pageType: 'question', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: false },
  { pageType: 'question', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: false },
  { pageType: 'question', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: false },
  { pageType: 'question', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: false },
  { pageType: 'question', chapterNumber: 3, chapterTitle: 'שיחות עם אמא ואבא', needsImage: false },
  // Chapter 4: תמונות ורגעים (pages 20–24)
  { pageType: 'chapter_divider', chapterNumber: 4, chapterTitle: 'תמונות ורגעים', needsImage: true },
  { pageType: 'photo_placeholder', chapterNumber: 4, chapterTitle: 'תמונות ורגעים', needsImage: false },
  { pageType: 'photo_placeholder', chapterNumber: 4, chapterTitle: 'תמונות ורגעים', needsImage: false },
  { pageType: 'photo_placeholder', chapterNumber: 4, chapterTitle: 'תמונות ורגעים', needsImage: false },
  { pageType: 'photo_placeholder', chapterNumber: 4, chapterTitle: 'תמונות ורגעים', needsImage: false },
  // Chapter 5: העתיד שלי (pages 25–29)
  { pageType: 'chapter_divider', chapterNumber: 5, chapterTitle: 'העתיד שלי', needsImage: true },
  { pageType: 'dream', chapterNumber: 5, chapterTitle: 'העתיד שלי', needsImage: true },
  { pageType: 'dream', chapterNumber: 5, chapterTitle: 'העתיד שלי', needsImage: true },
  { pageType: 'dream', chapterNumber: 5, chapterTitle: 'העתיד שלי', needsImage: true },
  { pageType: 'dream', chapterNumber: 5, chapterTitle: 'העתיד שלי', needsImage: true },
  // Page 30: Closing
  { pageType: 'closing', chapterNumber: 0, chapterTitle: '', needsImage: true },
]

export async function generateJournal(params: BookParams): Promise<JournalPage[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

  const mainChar = params.characters.find((c) => c.role === 'main')
  const childName = mainChar?.name || params.characters[0]?.name || 'הילד'
  const ageGroup = params.ageGroup
  const timePeriodLabel =
    params.journalTimePeriod === 'year'
      ? 'שנה שלמה'
      : params.journalTimePeriod === 'quarter'
        ? 'רבעון'
        : 'חודש'

  const context = [
    `שם הילד/ה: ${childName}`,
    `גיל: ${ageGroup}`,
    `תקופת היומן: ${timePeriodLabel}`,
    params.journalChildTraits ? `מה מיוחד ב${childName}: ${params.journalChildTraits}` : '',
    params.journalParentMessage ? `מסר מהורה: ${params.journalParentMessage}` : '',
    params.journalKeyMoments ? `רגעים חשובים מהתקופה: ${params.journalKeyMoments}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const structureJson = JSON.stringify(
    JOURNAL_STRUCTURE.map((s, i) => ({
      pageNumber: i + 1,
      pageType: s.pageType,
      chapterNumber: s.chapterNumber,
      chapterTitle: s.chapterTitle,
      needsImage: s.needsImage,
    }))
  )

  const systemPrompt = `אתה יוצר יומן העצמה משפחתי בעברית. קבל מידע וצור תוכן ל-30 עמודי יומן בדיוק לפי המבנה שניתן.

**מידע על הילד/ה:**
${context}

**סוגי עמודים ומה לכתוב:**
- cover: שם היומן (title) + מסר פתיחה חם הכולל את שם הילד (prompt)
- chapter_divider: שם הפרק (title) + משפט קצר ומחמם על הפרק (prompt)
- affirmation: כותרת קצרה (title) + משפט מעצים בגוף ראשון על ${childName} (prompt)
- question: כותרת השאלה (title) + שאלה פתוחה לשיח הורה-ילד (prompt)
- growth: כותרת (title) + משפט גדילה ומסוגלות להשלמה עצמית (prompt)
- memory: כותרת (title) + הנחיה לתיעוד רגע מיוחד בכתב או בתמונה (prompt)
- photo_placeholder: כותרת ליד התמונה (title) + הנחיה קצרה מה להדביק כאן (prompt)
- dream: כותרת (title) + משפט על חלום או מטרה עתידית (prompt)
- closing: כותרת סיום (title) + מסר חם לסיום מהמשפחה לילד (prompt)

**sceneDescription**: רק לעמודים עם needsImage=true. תיאור ויזואלי מפורט לאיור בסגנון ריאליסטי וחם — ילד/ה, צבעים, אווירה.

**המבנה לתוכן:**
${structureJson}

**החזר JSON בלבד — מערך של 30 אובייקטים, ללא markdown:**
[
  {
    "pageNumber": 1,
    "pageType": "cover",
    "chapterNumber": 0,
    "chapterTitle": "",
    "title": "...",
    "prompt": "...",
    "sceneDescription": "...",
    "charactersInScene": ["${childName}"],
    "needsImage": true
  },
  ...
]`

  const result = await model.generateContent(systemPrompt)
  const responseText = result.response.text().trim()

  const jsonText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const pages = JSON.parse(jsonText) as JournalPage[]
  return pages
}
