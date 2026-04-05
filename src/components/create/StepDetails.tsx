'use client'

import Button from '@/components/ui/Button'
import CreateShell from '@/components/create/CreateShell'
import { Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useCreateBookStore } from '@/store/createBookStore'
import { AgeGroup, BookFormat, BookParams, JOURNAL_TIME_LABELS } from '@/types'

// ---------------------------------------------------------------
// נתוני בחירה
// ---------------------------------------------------------------

const ageGroups: { id: AgeGroup; label: string; hint: string }[] = [
  { id: '0-2', label: '0–2',  hint: 'משפטים קצרים מאוד' },
  { id: '3-5', label: '3–5',  hint: 'הקראה ביתית פשוטה' },
  { id: '6-8', label: '6–8',  hint: 'יותר עלילה ועומק' },
  { id: '9+',  label: '9+',   hint: 'סיפור עשיר ומורכב' },
]

const formats: { id: BookFormat; label: string; hint: string }[] = [
  { id: 'square',   label: 'מרובע',   hint: 'נוח למסך ולמתנה אישית.' },
  { id: 'portrait', label: 'לאורך',   hint: 'מרגיש כמו ספר ילדים קלאסי.' },
]

const timePeriods = Object.entries(JOURNAL_TIME_LABELS) as Array<['year' | 'quarter' | 'month', string]>

// ---------------------------------------------------------------
// קומפוננטה ראשית
// ---------------------------------------------------------------

export default function StepDetails() {
  const { nextStep, prevStep, params, setAgeGroup, setFormat, setPersonalization } =
    useCreateBookStore()

  const isJournal = params.template === 'emotional_journal'

  const isValid = isJournal
    ? Boolean(params.ageGroup && params.journalTimePeriod && params.journalChildTraits?.trim())
    : Boolean(params.ageGroup && params.format)

  return (
    <CreateShell
      step={3}
      onBack={prevStep}
      badge="התאמה אישית"
      footer={
        <div className="lg:min-w-[18rem]">
          <Button size="lg" onClick={nextStep} disabled={!isValid} className="w-full lg:min-w-[18rem]">
            המשיכו לתצוגה ואישור
          </Button>
        </div>
      }
    >
      {isJournal ? (
        <JournalDetails
          params={params}
          setPersonalization={setPersonalization}
          setAgeGroup={setAgeGroup}
          timePeriods={timePeriods}
        />
      ) : (
        <BookDetails
          params={params}
          setPersonalization={setPersonalization}
          setAgeGroup={setAgeGroup}
          setFormat={setFormat}
        />
      )}
    </CreateShell>
  )
}

// ---------------------------------------------------------------
// ספר רגיל
// ---------------------------------------------------------------

function BookDetails({
  params,
  setPersonalization,
  setAgeGroup,
  setFormat,
}: {
  params: Partial<BookParams>
  setPersonalization: (data: Partial<BookParams>) => void
  setAgeGroup: (a: AgeGroup) => void
  setFormat: (f: BookFormat) => void
}) {
  return (
    <div className="space-y-10">

      {/* גיל + פורמט */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* גיל יעד */}
        <div className="space-y-3">
          <SectionHeader title="גיל יעד" hint="מותאמת רמת השפה, קצב הקריאה ואורך המשפטים." />
          <div className="grid grid-cols-2 gap-3">
            {ageGroups.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAgeGroup(a.id)}
                className={cn(
                  'rounded-[1.75rem] border p-4 text-right transition-all',
                  params.ageGroup === a.id
                    ? 'border-coral-300 bg-coral-50 shadow-[0_16px_28px_rgba(232,124,83,0.12)]'
                    : 'border-black/5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(23,25,37,0.08)]'
                )}
              >
                <p className="text-xl font-black text-[#161625]">{a.label}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{a.hint}</p>
              </button>
            ))}
          </div>
        </div>

        {/* פורמט */}
        <div className="space-y-3">
          <SectionHeader title="פורמט הספר" hint="כך הספר ירגיש במסך ובקובץ הסופי." />
          <div className="grid gap-3">
            {formats.map((f) => (
              <OptionCard
                key={f.id}
                selected={params.format === f.id}
                onClick={() => setFormat(f.id)}
                title={f.label}
                hint={f.hint}
              />
            ))}
          </div>
        </div>
      </section>

      {/* לב הסיפור */}
      <section className="space-y-4">
        <SectionHeader title="לב הסיפור" hint="הפרטים האלו הם מה שגורם לספר להרגיש אמיתי ואישי." />

        <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <Textarea
            label="איזה מסר תרצו שהספר יעביר?"
            rows={4}
            placeholder="למשל: שגם כשיש שינוי בבית, תמיד נשאר מקום לאהבה."
            value={params.desiredMessage || ''}
            onChange={(e) => setPersonalization({ desiredMessage: e.target.value })}
            helperText="לא חובה, אבל עוזר לנו לדייק את הלב של העלילה."
          />
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
          <Textarea
            label="פרטים אישיים שנרצה לשלב"
            rows={4}
            placeholder="תחביבים, חיות מחמד, בדיחות פנימיות, מאכל אהוב, מקום אהוב..."
            value={params.personalDetails || ''}
            onChange={(e) => setPersonalization({ personalDetails: e.target.value })}
            helperText={`${(params.personalDetails || '').length}/200`}
            maxLength={200}
          />
        </div>
      </section>

      {/* ניקוד */}
      <section>
        <div className="rounded-[2rem] border border-black/5 bg-[#171925] p-5 text-white shadow-[0_20px_40px_rgba(23,25,37,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">ניקוד בטקסט</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">מומלץ בעיקר לקהל צעיר או להקראה משותפת.</p>
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
            <p className="text-sm leading-7 text-white/70">
              אם אתם מקריאים לילד צעיר או רוצים טקסט נגיש יותר, ניקוד יכול להפוך את הקריאה להרבה יותר נעימה.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

// ---------------------------------------------------------------
// יומן רגשי
// ---------------------------------------------------------------

function JournalDetails({
  params,
  setPersonalization,
  setAgeGroup,
  timePeriods,
}: {
  params: Partial<BookParams>
  setPersonalization: (data: Partial<BookParams>) => void
  setAgeGroup: (a: AgeGroup) => void
  timePeriods: Array<['year' | 'quarter' | 'month', string]>
}) {
  return (
    <div className="space-y-10">

      {/* גיל + תקופה */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-3">
          <SectionHeader title="גיל הילד/ה" hint="רמת השפה והתוכן מותאמים לגיל." />
          <div className="grid grid-cols-2 gap-3">
            {ageGroups.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAgeGroup(a.id)}
                className={cn(
                  'rounded-[1.75rem] border p-4 text-right transition-all',
                  params.ageGroup === a.id
                    ? 'border-coral-300 bg-coral-50 shadow-[0_16px_28px_rgba(232,124,83,0.12)]'
                    : 'border-black/5 bg-white shadow-sm hover:-translate-y-0.5'
                )}
              >
                <p className="text-xl font-black text-[#161625]">{a.label}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{a.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <SectionHeader title="לאיזו תקופה היומן מיועד?" hint="קובע את הטון, ההיקף ואת סוג הזיכרונות." />
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
                    : 'border-black/5 bg-[#FFF9F0] hover:-translate-y-0.5'
                )}
              >
                <p className="text-lg font-black text-[#161625]">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* פרטי ילד */}
      <section className="space-y-4">
        <SectionHeader title="מה נכניס ליומן?" hint="הפרטים האלו יעצבו את האישורים, השאלות והמסרים שיופיעו." />

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Textarea
              label="מה מיוחד בילד/ה שלכם?"
              rows={4}
              placeholder="כוחות, תכונות, תחביבים, דברים שהילד/ה אוהב/ת לעשות..."
              value={params.journalChildTraits || ''}
              onChange={(e) => setPersonalization({ journalChildTraits: e.target.value })}
              helperText="יעזור לנו לכתוב אישורים אישיים שמרגישים אמיתיים."
              required
            />
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm">
            <Textarea
              label="מה תרצו לומר לילד/ה בפתיחת היומן?"
              rows={4}
              placeholder="מסר אישי מהלב — מה חשוב לכם שהילד/ה ידע/תדע..."
              value={params.journalParentMessage || ''}
              onChange={(e) => setPersonalization({ journalParentMessage: e.target.value })}
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
            onChange={(e) => setPersonalization({ journalKeyMoments: e.target.value })}
            helperText={`${(params.journalKeyMoments || '').length}/300`}
            maxLength={300}
          />
        </div>
      </section>

      {/* תוכן היומן */}
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

    </div>
  )
}

// ---------------------------------------------------------------
// רכיבי עזר
// ---------------------------------------------------------------

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-black text-[#161625]">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">{hint}</p>
    </div>
  )
}

function OptionCard({
  selected,
  onClick,
  title,
  hint,
}: {
  selected: boolean
  onClick: () => void
  title: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-[2rem] border p-5 text-right transition-all',
        selected
          ? 'border-coral-300 bg-[linear-gradient(160deg,#fff8f1_0%,#fde7dd_100%)] shadow-[0_22px_40px_rgba(232,124,83,0.14)]'
          : 'border-black/5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(23,25,37,0.09)]'
      )}
    >
      <p className="text-lg font-black text-[#161625]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-500">{hint}</p>
    </button>
  )
}
