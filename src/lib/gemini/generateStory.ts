import { GoogleGenerativeAI } from '@google/generative-ai'
import { BookParams, BookLength } from '@/types'
import { TEMPLATE_CONTEXT } from '@/lib/bookTemplates'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const PAGE_COUNT: Record<BookLength, number> = {
  short: 10,
  medium: 18,
  long: 28,
}

const AGE_INSTRUCTIONS = {
  '0-2': 'כתוב משפטים קצרים מאוד (עד 8 מילים). שפה פשוטה ביותר. חזרות מרגיעות. ניקוד מלא.',
  '3-5': 'משפטים קצרים (עד 12 מילים). שפה פשוטה וצבעונית. הרבה דיאלוג. ניקוד אם נדרש.',
  '6-8': 'משפטים בינוניים (עד 18 מילים). שפה עשירה יותר. עלילה ברורה עם שיא.',
  '9+': 'משפטים ארוכים יותר. מלים מתוחכמות. עלילה מורכבת עם מסר עמוק.',
}

const DIRECTION_INSTRUCTIONS = {
  emotional: 'כתוב בטון רגשי ומרגש, עם רגעים של אהבה וקשר משפחתי.',
  funny: 'כתוב בטון קליל ומצחיק, עם הומור עדין ורגעים מחייכים.',
  empowering: 'כתוב בטון מעצים, שמדגיש את הגבורה והיכולות של הדמות הראשית.',
  adventurous: 'כתוב בטון הרפתקני ודמיוני, עם עולמות קסומים ומסע מרגש.',
}

// TEMPLATE_CONTEXT מיובא מ-src/lib/bookTemplates.ts — ערוך שם

export interface StoryPage {
  pageNumber: number
  text: string
  sceneDescription: string
  charactersInScene: string[] // names of characters appearing in this page
}

export async function generateStory(params: BookParams): Promise<StoryPage[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

  const pageCount = PAGE_COUNT[params.length]
  const characterNames = params.characters.map((c) => c.name).join(', ')
  const mainChar = params.characters.find((c) => c.role === 'main')

  const prompt = `אתה סופר ספרי ילדים מוכשר בעברית.

כתוב ספר ילדים מאויר עם ${pageCount} עמודים.

**פרטי הסיפור:**
- נושא: ${TEMPLATE_CONTEXT[params.template]}
- דמויות: ${characterNames}
- קשר: ${params.relationship || 'לא צוין'}
- מסר: ${params.desiredMessage || 'לא צוין'}
- פרטים אישיים: ${params.personalDetails || 'לא צוין'}
- כיוון רגשי: ${DIRECTION_INSTRUCTIONS[params.emotionalDirection]}
- גיל יעד: ${AGE_INSTRUCTIONS[params.ageGroup]}
- ניקוד: ${params.includeNikud ? 'כתוב עם ניקוד מלא' : 'ללא ניקוד'}

**חובה להחזיר JSON בלבד (ללא טקסט נוסף, ללא קוד בלוק markdown) בפורמט:**
{
  "pages": [
    {
      "pageNumber": 1,
      "text": "הטקסט לדף",
      "sceneDescription": "תיאור הסצנה לאיור: מה קורה, היכן, מה עושות הדמויות, אווירה, צבעים מומלצים",
      "charactersInScene": ["שם דמות 1", "שם דמות 2"]
    }
  ]
}

**לגבי charactersInScene:** רשימת שמות הדמויות שמופיעות פיזית בסצנה הזו (רק מהרשימה: ${params.characters.map((c) => c.name).join(', ')})

**הנחיות:**
- הטקסט לכל דף: קצר ומדויק לפי גיל היעד
- תיאור הסצנה: מפורט מאוד (3-4 משפטים), כדי שאפשר לצייר אותו
- הדמות הראשית: ${mainChar?.name || characterNames.split(',')[0]}
- הסיפור צריך לזרום בצורה טבעית מתחילה לסוף
- הכנס ${params.characters.map((c) => c.name).join(' ו')} לתוך הסיפור
- החזר JSON בלבד — ללא שום טקסט לפני או אחרי`

  const result = await model.generateContent(prompt)
  const responseText = result.response.text().trim()

  // Strip markdown code blocks if present
  const jsonText = responseText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const parsed = JSON.parse(jsonText)
  return parsed.pages as StoryPage[]
}
