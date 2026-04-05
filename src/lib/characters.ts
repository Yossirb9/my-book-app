import { BookParams, BookTemplate, Character, CharacterGender, CharacterRoleOption } from '@/types'

export const CHARACTER_ROLE_OPTIONS: Array<{
  value: CharacterRoleOption
  label: string
  promptLabel: string
  gender?: CharacterGender
}> = [
  { value: 'father', label: 'אבא', promptLabel: 'father', gender: 'male' },
  { value: 'mother', label: 'אמא', promptLabel: 'mother', gender: 'female' },
  { value: 'boy', label: 'ילד', promptLabel: 'boy', gender: 'male' },
  { value: 'girl', label: 'ילדה', promptLabel: 'girl', gender: 'female' },
  { value: 'male_friend', label: 'חבר', promptLabel: 'male friend', gender: 'male' },
  { value: 'female_friend', label: 'חברה', promptLabel: 'female friend', gender: 'female' },
  { value: 'other', label: 'אחר', promptLabel: 'other' },
]

const ENSEMBLE_TEMPLATES = new Set<BookTemplate>(['family_love'])

export function isEnsembleTemplate(template?: BookTemplate | null) {
  return Boolean(template && ENSEMBLE_TEMPLATES.has(template))
}

export function normalizeCharacterRoles(template: BookTemplate | undefined, characters: Character[]) {
  const isEnsemble = isEnsembleTemplate(template)

  return characters.map((character, index) => ({
    ...character,
    role: (isEnsemble ? 'secondary' : index === 0 ? 'main' : 'secondary') as Character['role'],
  }))
}

export function getCharacterRoleMeta(role?: CharacterRoleOption | null) {
  return CHARACTER_ROLE_OPTIONS.find((option) => option.value === role) ?? null
}

export function getCharacterDisplayRole(character: Pick<Character, 'familyRole' | 'customRole'>) {
  if (character.familyRole === 'other') {
    return character.customRole?.trim() || 'אחר'
  }

  return getCharacterRoleMeta(character.familyRole)?.label || 'לא נבחר תפקיד'
}

export function syncCharacterRoleFields(character: Character) {
  const meta = getCharacterRoleMeta(character.familyRole)

  return {
    ...character,
    gender: meta?.gender,
    customRole: character.familyRole === 'other' ? character.customRole : undefined,
  }
}

export function getPrimaryCharacter(params: Pick<BookParams, 'template' | 'characters'>) {
  if (isEnsembleTemplate(params.template)) {
    return null
  }

  return params.characters.find((character) => character.role === 'main') || params.characters[0] || null
}

export function getBookTitlePreview(params: Pick<BookParams, 'template' | 'characters'>) {
  if (params.template === 'family_love') {
    return 'הסיפור המשפחתי שלכם'
  }

  const primaryCharacter = getPrimaryCharacter(params)
  const primaryName = primaryCharacter?.name?.trim()

  if (params.template === 'emotional_journal') {
    return primaryName ? `היומן של ${primaryName}` : 'היומן שלכם'
  }

  return primaryName ? `הספר של ${primaryName}` : 'הספר שלכם'
}

export function getCharacterNamesSummary(characters: Character[]) {
  const named = characters.map((character) => character.name.trim()).filter(Boolean)

  if (!named.length) return 'נוסיף אותם בשלב הבא'
  if (named.length <= 2) return named.join(' · ')
  return `${named[0]} · ${named[1]} · +${named.length - 2}`
}

export function getStoryFocusInstruction(params: Pick<BookParams, 'template' | 'characters'>) {
  if (isEnsembleTemplate(params.template)) {
    return 'אין דמות ראשית אחת. כל הדמויות שוות בחשיבותן, והסיפור צריך לחלק את הפוקוס ביניהן בצורה משפחתית ומאוזנת.'
  }

  const primaryCharacter = getPrimaryCharacter(params)
  return `הדמות הראשית: ${primaryCharacter?.name || params.characters[0]?.name || 'לא צוינה'}`
}

export function getCharacterPromptDescriptor(
  character: Pick<Character, 'familyRole' | 'customRole' | 'description'>
) {
  const roleMeta = getCharacterRoleMeta(character.familyRole)
  const parts = [
    character.familyRole === 'other' ? character.customRole?.trim() : roleMeta?.promptLabel,
    character.description?.trim(),
  ].filter(Boolean)

  return parts.join(', ')
}
