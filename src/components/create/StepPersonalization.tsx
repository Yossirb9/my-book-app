'use client'

import Button from '@/components/ui/Button'
import CreateShell from '@/components/create/CreateShell'
import { Input, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { BookParams, JOURNAL_TIME_LABELS } from '@/types'

const languageLevels = [
  { id: 'toddler' as const, label: 'פעוטות', hint: 'קצב רגוע ומשפטים קצרים מאוד' },
  { id: 'kindergarten' as const, label: 'גן', hint: 'שפה ביתית וקריאה זורמת בהקראה' },
  { id: 'early_reader' as const, label: 'ראשית קריאה', hint: 'טקסט עשיר יותר לילדים גדולים יותר' },
]

const timePeriods = Object.entries(JOURNAL_TIME_LABELS) as Array<['year' | 'quarter' | 'month', string]>

export default function StepPersonalization() {
  const { nextStep, params, prevStep, setPersonalization } = useCreateBookStore()
  const isJournal = params.template === 'emotional_journal'

  const isValid = isJournal
    ? Boolean(params.journalTimePeriod && params.journalChildTraits?.trim())
    : Boolean(params.relationship?.trim())

  return (
    <CreateShell
      step={4}
      onBack={prevStep}
      badge={isJournal ? 'תוכן היומן' : 'דיוק רגשי'}
      footer={
        <div className="lg:min-w-[18rem]">
          <Button size="lg" onClick={nextStep} disabled={!isValid} className="w-full lg:min-w-[18rem]">
            המשיכו לתצוגה ואישור
          </Button>
        </div>
      }
    >
      {isJournal ? (
        <JournalPersonalization params={params} setPersonalization={setPersonalization} timePeriods={timePeriods} />
      ) : (
        <BookPersonalization params={params} setPersonalization={setPersonalization} languageLevels={languageLevels} />
      )}
    </CreateShell>
  )
}

function JournalPersonalization({
  params,
  setPersonalization,
  timePeriods,
}: {
  params: Partial<BookParams>
  setPersonalization: (data: Partial<BookParams>) => void
  timePeriods: Array<['year' | 'quarter' | 'month', string]>
}) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-black/5 bg-white px-5 py-5 shadow-sm">
          <p className="text-lg font-black text-[#161625]">מה נכניס ליומן?</p>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            הפרטים האלו יעצבו את האישורים, השאלות והמסרים שיופיעו ביומן — כך שירגיש אישי לחלוטין.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Textarea
              label="מה מיוחד בילד/ה שלכם?"
              rows={4}
              placeholder="כוחות, תכונות, תחביבים, דברים שהילד/ה אוהב/ת לעשות..."
              value={params.journalChildTraits || ''}
              onChange={(event) => setPersonalization({ journalChildTraits: event.target.value })}
              helperText="יעזור לנו לכתוב אישורים אישיים שמרגישים אמיתיים."
              required
            />
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Textarea
              label="מה תרצו לומר לילד/ה בפתיחת היומן?"
              rows={4}
              placeholder="מסר אישי מהלב — מה חשוב לכם שהילד/ה ידע/תדע עליכם ועליו/ה..."
              value={params.journalParentMessage || ''}
              onChange={(event) => setPersonalization({ journalParentMessage: event.target.value })}
              helperText="יופיע בעמוד הפתיחה של היומן."
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <Textarea
            label="רגעים חשובים מהתקופה"
            rows={4}
            placeholder="אירועים, הישגים, שינויים, מסעות, חברויות חדשות — כל מה שהיה משמעותי..."
            value={params.journalKeyMoments || ''}
            onChange={(event) => setPersonalization({ journalKeyMoments: event.target.value })}
            helperText={`${(params.journalKeyMoments || '').length}/300 — ישמשו לפרק 'רגעים של גדילה'.`}
            maxLength={300}
          />
        </div>
      </section>

      <aside className="space-y-5">
        <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-black text-[#161625]">לאיזו תקופה היומן מיועד?</h2>
            <p className="mt-1 text-sm leading-7 text-gray-500">
              קובע את הטון, ההיקף ואת סוג הזיכרונות שנייצר.
            </p>
          </div>
          <div className="grid gap-3">
            {timePeriods.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPersonalization({ journalTimePeriod: id })}
                className={cn(
                  'rounded-[1.75rem] border p-4 text-right transition-all',
                  params.journalTimePeriod === id
                    ? 'border-[#1a1a2e] bg-[linear-gradient(160deg,#f0f0ff_0%,#e8e8ff_100%)] shadow-[0_18px_32px_rgba(26,26,46,0.12)]'
                    : 'border-black/5 bg-[#FFF9F0] hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(23,25,37,0.08)]'
                )}
              >
                <p className="text-lg font-black text-[#161625]">{label}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[#1a1a2e] p-5 text-white shadow-[0_20px_40px_rgba(26,26,46,0.22)]">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-white/90">היומן כולל 5 פרקים, 30 עמודים</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-white/70">
              <li>מי אני — אישורים ושאלות על זהות</li>
              <li>רגעים של גדילה — הישגים וזיכרונות</li>
              <li>שיחות עם אמא ואבא — שאלות לשיח</li>
              <li>תמונות ורגעים — מסגרות להדבקה</li>
              <li>העתיד שלי — חלומות ומטרות</li>
            </ul>
          </div>
        </section>
      </aside>
    </div>
  )
}

function BookPersonalization({
  params,
  setPersonalization,
  languageLevels,
}: {
  params: Partial<BookParams>
  setPersonalization: (data: Partial<BookParams>) => void
  languageLevels: { id: 'toddler' | 'kindergarten' | 'early_reader'; label: string; hint: string }[]
}) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1.08fr_0.92fr]">
      <section className="space-y-5">
        <div className="rounded-[2rem] border border-black/5 bg-white px-5 py-5 shadow-sm">
          <p className="text-lg font-black text-[#161625]">מה חשוב שייכנס לסיפור?</p>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            כאן אנחנו מוסיפים את הלב של הספר: הקשר בין הדמויות, המסר והפרטים הקטנים שהופכים את התוצאה למשהו שמרגיש אישי באמת.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Input
              label="מה הקשר בין הדמויות?"
              placeholder="למשל: אחות גדולה ואח קטן, ילדה וסבא, שני אחים עם כלב"
              value={params.relationship || ''}
              onChange={(event) => setPersonalization({ relationship: event.target.value })}
              helperText="המידע הזה ישפיע על האינטראקציה, הטון והקשר בסיפור."
              required
            />
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Textarea
              label="איזה מסר תרצו שהספר יעביר?"
              rows={5}
              placeholder="למשל: שגם כשיש שינוי בבית, תמיד נשאר מקום לאהבה, ביטחון והומור."
              value={params.desiredMessage || ''}
              onChange={(event) => setPersonalization({ desiredMessage: event.target.value })}
              helperText="לא חובה, אבל זה עוזר לנו לדייק את הלב של העלילה."
            />
          </div>
        </div>

        <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <Textarea
            label="פרטים אישיים שנרצה לשלב"
            rows={5}
            placeholder="תחביבים, חיות מחמד, בדיחות פנימיות, מאכל אהוב, מקום אהוב או כל פרט שיגרום לסיפור להרגיש אמיתי."
            value={params.personalDetails || ''}
            onChange={(event) => setPersonalization({ personalDetails: event.target.value })}
            helperText={`${(params.personalDetails || '').length}/200`}
            maxLength={200}
          />
        </section>
      </section>

      <aside className="space-y-5">
        <section className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-black text-[#161625]">רמת השפה</h2>
            <p className="mt-1 text-sm leading-7 text-gray-500">
              מתאימים את אורך המשפטים, הקצב ורמת המורכבות לקוראים הצפויים.
            </p>
          </div>
          <div className="grid gap-3">
            {languageLevels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setPersonalization({ languageLevel: level.id })}
                className={cn(
                  'rounded-[1.75rem] border p-4 text-right transition-all',
                  params.languageLevel === level.id
                    ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_18px_32px_rgba(232,124,83,0.12)]'
                    : 'border-black/5 bg-[#FFF9F0] hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(23,25,37,0.08)]'
                )}
              >
                <p className="text-lg font-black text-[#161625]">{level.label}</p>
                <p className="mt-2 text-sm leading-7 text-gray-500">{level.hint}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-[#171925] p-5 text-white shadow-[0_20px_40px_rgba(23,25,37,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">ניקוד בטקסט</h2>
              <p className="mt-2 text-sm leading-7 text-white/70">מומלץ בעיקר לקהל צעיר או להקראה משותפת.</p>
            </div>
            <button
              type="button"
              onClick={() => setPersonalization({ includeNikud: !params.includeNikud })}
              className={cn(
                'relative h-8 w-16 shrink-0 rounded-full transition-colors',
                params.includeNikud ? 'bg-coral-500' : 'bg-white/20'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all',
                  params.includeNikud ? 'right-1' : 'left-1'
                )}
              />
            </button>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm leading-7 text-white/75">
              אם אתם מקריאים לילד צעיר או רוצים טקסט נגיש יותר, ניקוד יכול להפוך את הקריאה להרבה יותר נעימה.
            </p>
          </div>
        </section>
      </aside>
    </div>
  )
}
