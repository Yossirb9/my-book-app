import Anthropic from '@anthropic-ai/sdk'
import { getCharacterDisplayRole, getStoryFocusInstruction } from '@/lib/characters'
import { TEMPLATE_CONTEXT, TEMPLATE_DIRECTION } from '@/lib/bookTemplates'
import { BookLength, BookParams } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PAGE_COUNT: Record<BookLength, number> = {
  short: 12,
  medium: 12,
  long: 12,
}

const AGE_INSTRUCTIONS = {
  '0-2': 'כתוב משפטים קצרים מאוד (עד 8 מילים). שפה פשוטה ביותר. חזרות מרגיעות. ניקוד מלא.',
  '3-5': 'משפטים קצרים (עד 12 מילים). שפה פשוטה וצבעונית. הרבה דיאלוג. ניקוד אם נדרש.',
  '6-8': 'משפטים בינוניים (עד 18 מילים). שפה עשירה יותר. עלילה ברורה עם שיא.',
  '9+': 'משפטים ארוכים יותר. מילים מתוחכמות. עלילה מורכבת עם מסר עמוק.',
}

const DIRECTION_INSTRUCTIONS = {
  emotional: 'כתוב בטון רגשי ומרגש, עם רגעים של אהבה וקשר משפחתי.',
  funny: 'כתוב בטון קליל ומצחיק, עם הומור עדין ורגעים מחייכים.',
  empowering: 'כתוב בטון מעצים, שמדגיש את הגבורה והיכולות של הדמות הראשית.',
  adventurous: 'כתוב בטון הרפתקני ודמיוני, עם עולמות קסומים ומסע מרגש.',
}

export interface StoryPage {
  pageNumber: number
  text: string
  sceneDescription: string
}

export async function generateStory(params: BookParams): Promise<StoryPage[]> {
  const pageCount = PAGE_COUNT[params.length]
  const characterNames = params.characters.map((character) => `${character.name} (${getCharacterDisplayRole(character)})`).join(', ')

  const prompt = `אתה סופר ספרי ילדים מוכשר בעברית.

כתוב ספר ילדים מאויר עם ${pageCount} עמודים.

פרטי הסיפור:
- נושא: ${TEMPLATE_CONTEXT[params.template]}
- דמויות: ${characterNames}
- מסר: ${params.desiredMessage || 'לא צוין'}
- פרטים אישיים: ${params.personalDetails || 'לא צוין'}
- כיוון רגשי: ${DIRECTION_INSTRUCTIONS[TEMPLATE_DIRECTION[params.template]]}
- גיל יעד: ${AGE_INSTRUCTIONS[params.ageGroup]}
- ניקוד: ${params.includeNikud ? 'כתוב עם ניקוד מלא' : 'ללא ניקוד'}

חובה להחזיר JSON בלבד בפורמט:
{
  "pages": [
    {
      "pageNumber": 1,
      "text": "הטקסט לדף",
      "sceneDescription": "תיאור הסצנה לאיור"
    }
  ]
}

הנחיות:
- הטקסט לכל דף צריך להיות קצר ומדויק לגיל היעד
- תיאור הסצנה צריך להיות מפורט מאוד (3-4 משפטים)
- ${getStoryFocusInstruction(params)}
- הסיפור צריך לזרום בצורה טבעית מתחילתו ועד סופו
- הכנס את ${params.characters.map((character) => character.name).join(' ו')} לתוך הסיפור`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonText = content.text.trim()
  const parsed = JSON.parse(jsonText)
  return parsed.pages as StoryPage[]
}
