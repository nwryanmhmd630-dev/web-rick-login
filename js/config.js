window.WEBRIC_CONFIG = {
  version: '4.0.0',
  site: {
    name: 'وب‌ریک',
    brandMark: 'و',
    description: 'قالب فارسی، راست‌چین و واکنش‌گرا برای صفحات ورود و ثبت‌نام.',
    footer: '© وب‌ریک · قالب نمایشی فارسی و RTL',
    license: 'این محصول تحت لایسنس پولی است. استفاده، کپی و توزیع بدون خرید مجاز نیست.'
  },
  theme: { mode: 'dark', accent: '#d5f36a', radius: 24, blur: 18 },
  nav: [
    { id: 'home', label: 'معرفی', href: 'index.html', visible: true },
    { id: 'login', label: 'ورود', href: 'login.html', visible: true },
    { id: 'register', label: 'ثبت‌نام', href: 'register.html', visible: true },
    { id: 'reset', label: 'بازیابی', href: 'reset-password.html', visible: true },
    { id: 'demo', label: 'نمونه‌ها', href: 'demo.html', visible: true }
  ],
  buttons: {
    login: { text: 'ورود به حساب', visible: true },
    register: { text: 'ساخت حساب کاربری', visible: true },
    reset: { text: 'ادامه‌ی نمایشی', visible: true },
    customize: { text: 'شخصی‌سازی', visible: true }
  },
  auth: {
    methods: [
      { id: 'email', label: 'ایمیل', type: 'email', enabled: true },
      { id: 'mobile', label: 'شماره موبایل', type: 'tel', enabled: true },
      { id: 'username', label: 'نام کاربری', type: 'text', enabled: false }
    ],
    social: [
      { id: 'google', label: 'ورود با گوگل', enabled: false },
      { id: 'github', label: 'ورود با گیت‌هاب', enabled: false }
    ],
    rememberMe: true,
    forgotPassword: true,
    terms: true,
    register: true
  },
  fields: {
    register: [
      { id: 'name', label: 'نام و نام خانوادگی', type: 'text', required: true, enabled: true },
      { id: 'email', label: 'ایمیل', type: 'email', required: true, enabled: true },
      { id: 'mobile', label: 'شماره‌ی موبایل', type: 'tel', required: false, enabled: true },
      { id: 'password', label: 'رمز عبور', type: 'password', required: true, enabled: true }
    ]
  },
  pages: {
    home: {
      title: 'صفحه‌ی اصلی',
      eyebrow: 'قالب رابط کاربری · نسخه ۴',
      heading: 'ورود، با شخصیتِ برند شما.',
      text: 'یک تجربه‌ی فارسی و راست‌چین برای صفحات احراز هویت؛ خلوت، دقیق و آماده‌ی شخصی‌سازی.',
      ctaPrimary: 'دیدن صفحه‌ی ورود',
      ctaSecondary: 'شخصی‌سازی قالب',
      previewTitle: 'خوش آمدید',
      previewText: 'برای ادامه، وارد حساب نمایشی شوید.',
      sectionEyebrow: 'یک بسته‌ی منسجم',
      sectionTitle: 'ظاهر تمیز، رفتار روشن.',
      sectionText: 'هر صفحه یک کار مشخص دارد؛ متن‌ها و دکمه‌ها از پنل قابل تغییرند.',
      tiles: [
        { title: 'صفحه‌ی ورود', text: 'چیدمان دو تب و کنترل‌های نمایشی.', href: 'login.html', icon: '↗' },
        { title: 'ثبت‌نام', text: 'فرم کامل ساخت حساب، قابل تنظیم از پنل.', href: 'register.html', icon: '＋' },
        { title: 'بازیابی مرحله‌ای', text: 'سه گام قابل کلیک برای مرور بازیابی رمز.', href: 'reset-password.html', icon: '⌁' },
        { title: 'گالری تم‌ها', text: 'حالت تیره و روشن را همین‌جا عوض کنید.', href: 'demo.html', icon: '◫' },
        { title: 'شخصی‌سازی زنده', text: 'رنگ، متن، دکمه و احراز هویت را تنظیم کنید.', href: 'admin.html', icon: '⚙' },
        { title: 'نصب ساده', text: 'فایل‌ها را روی هر هاست استاتیک بگذارید.', href: 'docs/INSTALLATION.md', icon: '⌘' }
      ]
    },
    login: {
      title: 'ورود',
      eyebrow: 'پیش‌نمایش احراز هویت',
      heading: 'ورود به حساب',
      text: 'ساختار ورود و ثبت‌نام را ببینید. این نسخه فقط فرانت‌اند است و اطلاعات ورود یا رمز عبور دریافت یا ارسال نمی‌کند.',
      loginTitle: 'خوش آمدید',
      loginText: 'برای دیدن نسخه‌ی واقعی، این رابط را به بک‌اند امن خود وصل کنید.',
      passwordLabel: 'رمز عبور',
      tabLogin: 'ورود',
      tabRegister: 'ساخت حساب',
      registerTitle: 'ساخت حساب تازه',
      registerText: 'فرم ثبت‌نام، در حالت نمایشی.',
      termsText: 'پذیرش قوانین و مقررات',
      noticeText: 'دموی ایمن: هیچ فرم یا داده‌ی حساسی فعال نیست؛ دکمه فقط همین پیام را نشان می‌دهد.',
      forgotText: 'فراموشی رمز؟',
      rememberText: 'مرا به خاطر بسپار',
      sideEyebrow: 'همراه قالب',
      sideTitle: 'امنیت، بخشی از طراحی است.',
      sideText: 'این نسخه عمداً اطلاعات حساب را نمی‌گیرد. ظاهر رابط آماده‌ی توسعه است، اما ورود واقعی به بک‌اند امن نیاز دارد.',
      sideCta: 'صفحه‌ی کامل ثبت‌نام'
    },
    register: {
      title: 'ثبت‌نام',
      eyebrow: 'ایجاد حساب',
      heading: 'صفحه‌ی ثبت‌نام',
      text: 'طرحی کامل برای شروع؛ فیلدها فقط به‌صورت نمایشی هستند.',
      formTitle: 'حساب تازه بسازید',
      formText: 'چیدمان را بررسی کنید و سپس به بک‌اند واقعی متصلش کنید.',
      termsText: 'پذیرش قوانین و مقررات',
      noticeText: 'فقط ظاهر: این فرم داده‌ای دریافت، ذخیره یا ارسال نمی‌کند.',
      sideTitle: 'به‌سادگی برای محصول خودتان',
      sideText: 'نام‌گذاری، رنگ و تجربه را در پنل شخصی‌سازی تغییر دهید.',
      sideCta: 'بازکردن تنظیمات'
    },
    reset: {
      title: 'بازیابی رمز',
      eyebrow: 'بازنشانی دسترسی · نمایشی',
      heading: 'بازیابی مرحله‌به‌مرحله',
      text: 'گام‌ها و حالت‌های رابط را مرور کنید؛ کد واقعی ارسال نمی‌شود.',
      step1: 'شناسه',
      step2: 'کد',
      step3: 'پایان',
      s1Title: 'شناسه‌ی حساب',
      s1Text: 'مرحله‌ی ورود به جریان بازیابی.',
      s1Label: 'ایمیل یا شماره‌ی موبایل',
      backText: 'بازگشت به ورود',
      s2Title: 'کد تأیید',
      s2Text: 'در محصول واقعی، این مرحله باید توسط بک‌اند تأیید شود.',
      s2Label: 'کد یک‌بارمصرف',
      s2Result: 'کد نمونه یا پیامک واقعی در این پیش‌نمایش وجود ندارد.',
      prevText: 'مرحله‌ی قبل',
      nextText: 'مرحله‌ی بعد',
      s3Title: 'جریان بازیابی آماده‌ی اتصال است',
      s3Text: 'برای تعیین رمز جدید، بک‌اند امن و توکن بازیابی معتبر لازم است.',
      s3Result: 'هیچ رمز یا اطلاعاتی دریافت یا تغییر داده نشد.',
      doneText: 'بازگشت به صفحه‌ی ورود',
      againText: 'مرور دوباره'
    },
    demo: {
      title: 'نمونه‌ها',
      eyebrow: 'نمایش زنده',
      heading: 'یک قالب، چند حال‌وهوا.',
      text: 'تم روشن و تیره در تمام صفحه‌ها ذخیره می‌شود.',
      t1Title: 'تغییر تم',
      t1Text: 'همین دکمه ظاهر روشن و تیره را جابه‌جا می‌کند.',
      t2Title: 'ورود',
      t2Text: 'صفحه‌ی نمونه‌ی ورود و تب تعاملی.',
      t3Title: 'جریان بازیابی',
      t3Text: 'سه مرحله‌ی نمایشی را کلیک کنید.',
      boxEyebrow: 'مرز روشن',
      boxTitle: 'نمونه است، نه سامانه‌ی ورود.',
      boxText: 'تعاملات این سایت برای نمایش طراحی هستند.',
      boxCta: 'شخصی‌سازی قالب'
    }
  }
};
