export const CREATE_STEP_LABELS = [
  'סוג ספר',
  'דמויות',
  'פרטי הספר',
  'תצוגה ואישור',
] as const

export const CREATE_STEP_DETAILS = [
  {
    eyebrow: 'ספרייה אישית',
    title: 'בוחרים את כיוון הספר',
    description: 'עוברים בין קטגוריות, רואים מה כל תבנית נותנת, ובוחרים התחלה שמרגישה נכונה למשפחה שלכם.',
  },
  {
    eyebrow: 'ליהוק',
    title: 'מכניסים את המשפחה לספר',
    description: 'דמות ראשית, דמויות נוספות ותמונה אחת ברורה לכל אחת. מכאן ה-AI כבר יודע על מי לספר.',
  },
  {
    eyebrow: 'התאמה אישית',
    title: 'מגדירים את הספר',
    description: 'גיל, פורמט, מסר ופרטים אישיים שיהפכו את הספר לאמיתי.',
  },
  {
    eyebrow: 'רגע האישור',
    title: 'רואים את התמונה המלאה',
    description: 'סיכום, זמן יצירה צפוי, מה כלול ומה יקרה מיד אחרי שתתנו אור ירוק.',
  },
] as const

export const CREATE_TOTAL_STEPS = CREATE_STEP_LABELS.length
