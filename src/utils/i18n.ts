import type { Language } from '../types'

type Translations = Record<string, string>

const ar: Translations = {
  // App
  appName: 'قرار',
  appTagline: 'مساعدك الذكي لقرارات الشراء',

  // Nav
  navDecision: 'قرار',
  navHistory: 'السجل',
  navGoals: 'الأهداف',
  navSettings: 'الإعدادات',

  // Onboarding
  onboardingTitle: 'مرحباً بك في قرار',
  onboardingSubtitle: 'دعنا نتعرف عليك لنساعدك في قراراتك المالية',
  monthlyIncome: 'الدخل الشهري',
  monthlyExpenses: 'المصاريف الثابتة الشهرية',
  currency: 'العملة',
  addGoal: 'إضافة هدف',
  goalName: 'اسم الهدف',
  targetAmount: 'المبلغ المستهدف',
  deadline: 'الموعد النهائي',
  removeGoal: 'حذف',
  getStarted: 'ابدأ الآن',
  savingsGoals: 'أهداف الادخار',
  upTo3Goals: 'أضف حتى 3 أهداف ادخار',
  language: 'اللغة',
  arabic: 'العربية',
  english: 'English',

  // Decision
  decisionTitle: 'هل تشتري؟',
  itemName: 'اسم المنتج',
  price: 'السعر',
  category: 'الفئة',
  notes: 'ملاحظات (اختياري)',
  notesPlaceholder: 'مثال: رأيته على نون، أحتاجه للعمل...',
  analyzeDecision: 'تحليل القرار',
  analyzing: 'جاري التحليل...',
  decisionScore: 'نتيجة القرار',
  reasoning: 'التحليل',
  installmentPlan: 'خطة التقسيط',
  months3: '3 أشهر',
  months6: '6 أشهر',
  months12: '12 شهر',
  goalImpact: 'أثر على أهدافك',
  monthsDelay: 'شهر تأخير',
  ofGoal: 'من الهدف',
  newDecision: 'قرار جديد',
  perMonth: '/شهر',

  // Categories
  electronics: 'إلكترونيات',
  furniture: 'أثاث',
  clothing: 'ملابس',
  food: 'طعام',
  transport: 'مواصلات',
  other: 'أخرى',

  // Verdicts
  buyNow: 'اشترِ الآن',
  wait: 'انتظر',
  skip: 'تجاهل',

  // History
  historyTitle: 'سجل القرارات',
  noHistory: 'لا توجد قرارات بعد',
  noHistoryDesc: 'ابدأ بتحليل قرارك الأول',
  totalEvaluated: 'إجمالي القرارات',
  totalSaved: 'إجمالي المُوفَّر',
  viewDetails: 'التفاصيل',

  // Goals
  goalsTitle: 'أهداف الادخار',
  noGoals: 'لا توجد أهداف',
  noGoalsDesc: 'أضف أهدافاً في الإعدادات',
  savedFromDecisions: 'مُوفَّر من القرارات',
  progress: 'التقدم',
  editAmount: 'تعديل المبلغ',
  currentSaved: 'المبلغ الحالي',
  save: 'حفظ',
  cancel: 'إلغاء',

  // Settings
  settingsTitle: 'الإعدادات',
  profileSettings: 'معلومات الحساب',
  appSettings: 'إعدادات التطبيق',
  dangerZone: 'منطقة الخطر',
  clearData: 'مسح جميع البيانات',
  clearDataConfirm: 'هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmClear: 'نعم، امسح كل شيء',
  saveSettings: 'حفظ الإعدادات',
  settingsSaved: 'تم الحفظ بنجاح',

  // Errors
  apiKeyMissing: 'مفتاح API غير موجود. يرجى إضافته في ملف .env',
  analysisError: 'حدث خطأ أثناء التحليل. حاول مرة أخرى.',
  fillRequired: 'يرجى ملء جميع الحقول المطلوبة',

  // Misc
  monthly: 'شهرياً',
  of: 'من',
  close: 'إغلاق',
}

const en: Translations = {
  // App
  appName: 'Qarar',
  appTagline: 'Your smart purchase decision assistant',

  // Nav
  navDecision: 'Decision',
  navHistory: 'History',
  navGoals: 'Goals',
  navSettings: 'Settings',

  // Onboarding
  onboardingTitle: 'Welcome to Qarar',
  onboardingSubtitle: 'Tell us about your finances to help with your purchase decisions',
  monthlyIncome: 'Monthly Income',
  monthlyExpenses: 'Monthly Fixed Expenses',
  currency: 'Currency',
  addGoal: 'Add Goal',
  goalName: 'Goal Name',
  targetAmount: 'Target Amount',
  deadline: 'Deadline',
  removeGoal: 'Remove',
  getStarted: 'Get Started',
  savingsGoals: 'Savings Goals',
  upTo3Goals: 'Add up to 3 savings goals',
  language: 'Language',
  arabic: 'العربية',
  english: 'English',

  // Decision
  decisionTitle: 'Should You Buy?',
  itemName: 'Item Name',
  price: 'Price',
  category: 'Category',
  notes: 'Notes (optional)',
  notesPlaceholder: 'e.g., saw it on noon.com, need it for work...',
  analyzeDecision: 'Analyze Decision',
  analyzing: 'Analyzing...',
  decisionScore: 'Decision Score',
  reasoning: 'Analysis',
  installmentPlan: 'Installment Plan',
  months3: '3 Months',
  months6: '6 Months',
  months12: '12 Months',
  goalImpact: 'Impact on Your Goals',
  monthsDelay: 'mo delay',
  ofGoal: 'of goal',
  newDecision: 'New Decision',
  perMonth: '/mo',

  // Categories
  electronics: 'Electronics',
  furniture: 'Furniture',
  clothing: 'Clothing',
  food: 'Food',
  transport: 'Transport',
  other: 'Other',

  // Verdicts
  buyNow: 'Buy Now',
  wait: 'Wait',
  skip: 'Skip',

  // History
  historyTitle: 'Decision History',
  noHistory: 'No decisions yet',
  noHistoryDesc: 'Start by analyzing your first purchase',
  totalEvaluated: 'Total Evaluated',
  totalSaved: 'Total Saved',
  viewDetails: 'Details',

  // Goals
  goalsTitle: 'Savings Goals',
  noGoals: 'No goals yet',
  noGoalsDesc: 'Add goals in Settings',
  savedFromDecisions: 'Saved from decisions',
  progress: 'Progress',
  editAmount: 'Edit Amount',
  currentSaved: 'Current Amount Saved',
  save: 'Save',
  cancel: 'Cancel',

  // Settings
  settingsTitle: 'Settings',
  profileSettings: 'Profile Settings',
  appSettings: 'App Settings',
  dangerZone: 'Danger Zone',
  clearData: 'Clear All Data',
  clearDataConfirm: 'Are you sure? This action cannot be undone.',
  confirmClear: 'Yes, Clear Everything',
  saveSettings: 'Save Settings',
  settingsSaved: 'Settings saved successfully',

  // Errors
  apiKeyMissing: 'API key missing. Please add it to your .env file.',
  analysisError: 'Analysis failed. Please try again.',
  fillRequired: 'Please fill in all required fields',

  // Misc
  monthly: 'monthly',
  of: 'of',
  close: 'Close',
}

const translations: Record<Language, Translations> = { ar, en }

export function t(key: string, lang: Language): string {
  return translations[lang][key] ?? key
}
