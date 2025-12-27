export type Language = 'en' | 'ru' | 'kz';

export interface Translations {
  navbar: {
    home: string;
    map: string;
    locations: string;
    safetyTips: string;
    profile: string;
    login: string;
    logout: string;
    getStarted: string;
  };
  hero: {
    title: string;
    subtitle: string;
    subtitleKz: string;
    getStarted: string;
    exploreMap: string;
    interactiveMap: string;
    interactiveMapDesc: string;
    sosSystem: string;
    sosSystemDesc: string;
    safetyTips: string;
    safetyTipsDesc: string;
    forTourists: string;
    forTouristsDesc: string;
    exploreLocations: string;
    forResidents: string;
    forResidentsDesc: string;
    viewSafetyTips: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    welcomeBack: string;
    signInTo: string;
    signingIn: string;
    joinSafeAlmaty: string;
    createAccount: string;
    creatingAccount: string;
    iAmA: string;
    tourist: string;
    resident: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
  };
  map: {
    police: string;
    hospital: string;
    hospitals: string;
    touristSpots: string;
    safeZones: string;
  };
  common: {
    loading: string;
    error: string;
    readMore: string;
    verified: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navbar: {
      home: 'Home',
      map: 'Map',
      locations: 'Locations',
      safetyTips: 'Safety Tips',
      profile: 'Profile',
      login: 'Login',
      logout: 'Logout',
      getStarted: 'Get Started',
    },
    hero: {
      title: 'Safe Almaty',
      subtitle: 'Your trusted safety guide and emergency response system for Almaty, Kazakhstan',
      subtitleKz: 'Алматы қауіпсіздік нұсқаулығы',
      getStarted: 'Get Started',
      exploreMap: 'Explore Map',
      interactiveMap: 'Interactive Map',
      interactiveMapDesc: 'Explore safe zones & locations',
      sosSystem: 'SOS System',
      sosSystemDesc: 'Emergency response at your fingertips',
      safetyTips: 'Safety Tips',
      safetyTipsDesc: 'Expert guidance for Almaty',
      forTourists: 'For Tourists',
      forTouristsDesc: 'Discover safe locations, get cultural tips, and navigate Almaty with confidence. Find the best tourist spots, restaurants, and hotels with safety ratings.',
      exploreLocations: 'Explore Locations',
      forResidents: 'For Residents',
      forResidentsDesc: 'Access emergency contacts, report issues, and stay informed about your neighborhood. Get real-time safety updates and connect with local services.',
      viewSafetyTips: 'View Safety Tips',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      welcomeBack: 'Welcome Back',
      signInTo: 'Sign in to Safe Almaty',
      signingIn: 'Signing in...',
      joinSafeAlmaty: 'Join Safe Almaty',
      createAccount: 'Create Account',
      creatingAccount: 'Creating account...',
      iAmA: 'I am a',
      tourist: 'Tourist',
      resident: 'Resident',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
    },
    map: {
      police: 'Police',
      hospital: 'Hospital',
      hospitals: 'Hospitals',
      touristSpots: 'Tourist Spots',
      safeZones: 'Safe Zones',
    },
    common: {
      loading: 'Loading',
      error: 'Error',
      readMore: 'Read More',
      verified: 'Verified',
    },
  },
  ru: {
    navbar: {
      home: 'Главная',
      map: 'Карта',
      locations: 'Места',
      safetyTips: 'Советы по безопасности',
      profile: 'Профиль',
      login: 'Войти',
      logout: 'Выйти',
      getStarted: 'Начать',
    },
    hero: {
      title: 'Безопасный Алматы',
      subtitle: 'Ваш надежный гид по безопасности и система экстренного реагирования для Алматы, Казахстан',
      subtitleKz: 'Алматы қауіпсіздік нұсқаулығы',
      getStarted: 'Начать',
      exploreMap: 'Исследовать карту',
      interactiveMap: 'Интерактивная карта',
      interactiveMapDesc: 'Исследуйте безопасные зоны и места',
      sosSystem: 'SOS Система',
      sosSystemDesc: 'Экстренная помощь у вас под рукой',
      safetyTips: 'Советы по безопасности',
      safetyTipsDesc: 'Экспертные рекомендации для Алматы',
      forTourists: 'Для туристов',
      forTouristsDesc: 'Откройте для себя безопасные места, получите культурные советы и уверенно ориентируйтесь в Алматы. Найдите лучшие туристические места, рестораны и отели с рейтингами безопасности.',
      exploreLocations: 'Исследовать места',
      forResidents: 'Для жителей',
      forResidentsDesc: 'Получите доступ к экстренным контактам, сообщайте о проблемах и будьте в курсе событий в вашем районе. Получайте обновления о безопасности в реальном времени и связывайтесь с местными службами.',
      viewSafetyTips: 'Просмотреть советы',
    },
    auth: {
      signIn: 'Войти',
      signUp: 'Регистрация',
      register: 'Регистрация',
      email: 'Электронная почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      fullName: 'Полное имя',
      welcomeBack: 'Добро пожаловать',
      signInTo: 'Войдите в Safe Almaty',
      signingIn: 'Вход...',
      joinSafeAlmaty: 'Присоединиться к Safe Almaty',
      createAccount: 'Создать аккаунт',
      creatingAccount: 'Создание аккаунта...',
      iAmA: 'Я',
      tourist: 'Турист',
      resident: 'Житель',
      dontHaveAccount: 'Нет аккаунта?',
      alreadyHaveAccount: 'Уже есть аккаунт?',
    },
    map: {
      police: 'Полиция',
      hospital: 'Больница',
      hospitals: 'Больницы',
      touristSpots: 'Туристические места',
      safeZones: 'Безопасные зоны',
    },
    common: {
      loading: 'Загрузка',
      error: 'Ошибка',
      readMore: 'Читать далее',
      verified: 'Проверено',
    },
  },
  kz: {
    navbar: {
      home: 'Басты',
      map: 'Карта',
      locations: 'Орындар',
      safetyTips: 'Қауіпсіздік кеңестері',
      profile: 'Профиль',
      login: 'Кіру',
      logout: 'Шығу',
      getStarted: 'Бастау',
    },
    hero: {
      title: 'Қауіпсіз Алматы',
      subtitle: 'Алматы, Қазақстан үшін сенімді қауіпсіздік нұсқаулығы және төтенше жағдайларға жауап беру жүйесі',
      subtitleKz: 'Алматы қауіпсіздік нұсқаулығы',
      getStarted: 'Бастау',
      exploreMap: 'Картаны зерттеу',
      interactiveMap: 'Интерактивті карта',
      interactiveMapDesc: 'Қауіпсіз аймақтар мен орындарды зерттеңіз',
      sosSystem: 'SOS Жүйесі',
      sosSystemDesc: 'Төтенше көмек қолыңызда',
      safetyTips: 'Қауіпсіздік кеңестері',
      safetyTipsDesc: 'Алматыға арналған маман кеңестері',
      forTourists: 'Туристтер үшін',
      forTouristsDesc: 'Қауіпсіз орындарды ашыңыз, мәдени кеңестер алыңыз және Алматыда сенімді навигациялаңыз. Қауіпсіздік рейтингтері бар ең жақсы туристік орындарды, ресторандарды және қонақ үйлерді табыңыз.',
      exploreLocations: 'Орындарды зерттеу',
      forResidents: 'Тұрғындар үшін',
      forResidentsDesc: 'Төтенше контактілерге қол жеткізіңіз, мәселелер туралы хабарлаңыз және ауданыңыз туралы ақпарат алыңыз. Нақты уақытта қауіпсіздік жаңартуларын алыңыз және жергілікті қызметтермен байланысыңыз.',
      viewSafetyTips: 'Кеңестерді көру',
    },
    auth: {
      signIn: 'Кіру',
      signUp: 'Тіркелу',
      register: 'Тіркелу',
      email: 'Электрондық пошта',
      password: 'Құпия сөз',
      confirmPassword: 'Құпия сөзді растау',
      fullName: 'Толық аты',
      welcomeBack: 'Қош келдіңіз',
      signInTo: 'Safe Almaty-ға кіріңіз',
      signingIn: 'Кіру...',
      joinSafeAlmaty: 'Safe Almaty-ға қосылу',
      createAccount: 'Тіркелгі жасау',
      creatingAccount: 'Тіркелгі жасалуда...',
      iAmA: 'Мен',
      tourist: 'Турист',
      resident: 'Тұрғын',
      dontHaveAccount: 'Тіркелгі жоқ па?',
      alreadyHaveAccount: 'Тіркелгі бар ма?',
    },
    map: {
      police: 'Полиция',
      hospital: 'Аурухана',
      hospitals: 'Ауруханалар',
      touristSpots: 'Туристік орындар',
      safeZones: 'Қауіпсіз аймақтар',
    },
    common: {
      loading: 'Жүктелуде',
      error: 'Қате',
      readMore: 'Одан әрі оқу',
      verified: 'Тексерілген',
    },
  },
};

