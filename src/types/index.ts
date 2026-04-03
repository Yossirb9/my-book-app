export type BookTemplate =
  | 'new_sibling'
  | 'birthday_child'
  | 'potty_training'
  | 'family_love'

export type EmotionalDirection =
  | 'emotional'
  | 'funny'
  | 'empowering'
  | 'adventurous'

export type AgeGroup = '0-2' | '3-5' | '6-8' | '9+'

export type BookLength = 'short' | 'medium' | 'long'

export type BookFormat = 'square' | 'portrait'

export type VisualStyle = 'realistic' | 'illustrated'

export type BookStatus = 'draft' | 'generating' | 'ready' | 'failed'

export type RegenerationType = 'image' | 'text'

export interface Character {
  id: string
  name: string
  role: 'main' | 'secondary'
  imageUrl?: string
  description?: string
  characterPrompt?: string
}

export interface BookParams {
  template: BookTemplate
  emotionalDirection: EmotionalDirection
  ageGroup: AgeGroup
  length: BookLength
  format: BookFormat
  visualStyle: VisualStyle
  characters: Character[]
  relationship?: string
  desiredMessage?: string
  personalDetails?: string
  languageLevel: 'toddler' | 'kindergarten' | 'early_reader'
  includeNikud: boolean
}

export interface BookPage {
  id: string
  bookId: string
  pageNumber: number
  text: string
  imageUrl?: string
  imagePrompt?: string
  regenerationsLeft: number
}

export interface Book {
  id: string
  userId: string
  title: string
  status: BookStatus
  params: BookParams
  pages: BookPage[]
  pdfDigitalUrl?: string
  pdfPrintUrl?: string
  createdAt: string
  imageRegenerationsLeft: number
  textRegenerationsLeft: number
}

export interface CreateBookPayload {
  params: BookParams
}

// Pricing
export const BOOK_PRICES: Record<BookLength, number> = {
  short: 89,
  medium: 129,
  long: 159,
}

export const REGEN_LIMITS: Record<'standard' | 'premium', { image: number; text: number }> = {
  standard: { image: 3, text: 3 },
  premium: { image: 8, text: 8 },
}

export const TEMPLATE_LABELS: Record<BookTemplate, string> = {
  new_sibling: '👶 אח חדש',
  birthday_child: '🎂 יום הולדת',
  potty_training: '🌟 גמילה',
  family_love: '❤️ ספר אהבה',
}

export const DIRECTION_LABELS: Record<EmotionalDirection, string> = {
  emotional: '🥹 מרגש ומיוחד',
  funny: '😄 מצחיק ומשפחתי',
  empowering: '💪 מעצים לגיבור',
  adventurous: '🌈 הרפתקני-דמיוני',
}

export const LENGTH_PAGES: Record<BookLength, { min: number; max: number; label: string }> = {
  short: { min: 8, max: 12, label: 'קצר 8–12 עמ׳' },
  medium: { min: 16, max: 20, label: 'בינוני 16–20 עמ׳' },
  long: { min: 24, max: 32, label: 'ארוך 24–32 עמ׳' },
}
