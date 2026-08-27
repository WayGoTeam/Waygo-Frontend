export interface Strings {
  brand: { name: string; tagline: string }
  nav: {
    liveMap: string
    analytics: string
    incidents: string
    transport: string
    weather: string
    adminPanel: string
    ecoWallet: string
    profile: string
  }
  topbar: {
    searchPlaceholder: string
    filters: string
    menu: string
    liveIncidents: string
    notifications: string
    noNotifications: string
    viewAll: string
  }
  systemStatus: {
    healthy: string
    healthySubtitle: string
    degraded: string
    degradedSubtitle: string
    checking: string
  }
  legend: {
    flowing: string
    slow: string
    heavy: string
    jammed: string
    incident: string
  }
  layers: {
    title: string
    street: string
    satellite: string
    traffic: string
    incidents: string
    liveIncidents: string
  }
  mapControls: {
    zoomIn: string
    zoomOut: string
    locate: string
    locateError: string
    fullscreen: string
    exitFullscreen: string
  }
  routePlanner: {
    title: string
    origin: string
    destination: string
    originPlaceholder: string
    destinationPlaceholder: string
    swap: string
    fastest: string
    eco: string
    showOnMap: string
    clear: string
    distance: string
    trafficLight: string
    trafficModerate: string
    trafficHeavy: string
    routeLabel: Record<string, string>
    reopen: string
    forecastTitle: string
    now: string
    min: string
    searching: string
    noResults: string
    calculating: string
    pickBoth: string
    error: string
    minutesShort: string
    startTrip: string
    endTrip: string
  }
  chat: {
    title: string
    subtitle: string
    online: string
    offline: string
    inputPlaceholder: string
    greeting: string
    quickPrompts: [string, string, string]
    thinking: string
    errorReply: string
    open: string
    close: string
    clear: string
  }
  cityBar: {
    citywideStatus: string
    avgCongestion: string
    avgSpeed: string
    activeIncidents: string
    liveIncidents: string
    lastUpdated: string
    refresh: string
  }
  weather: {
    pageTitle: string
    pageSubtitle: string
    temperature: string
    windSpeed: string
    precipitation: string
    trafficImpact: string
    trafficImpactHint: string
    dataSource: string
    conditions: Record<string, string>
  }
  incidentTypes: Record<string, string>
  incidentSource: Record<string, string>
  incidentsPage: {
    title: string
    subtitle: string
    empty: string
    emptyHint: string
    reportButton: string
    liveBadge: string
  }
  reportModal: {
    title: string
    subtitle: string
    type: string
    description: string
    descriptionPlaceholder: string
    location: string
    locationHint: string
    useMapPin: string
    segment: string
    submit: string
    submitting: string
    cancel: string
    success: string
    error: string
  }
  aiAnalytics: {
    pageTitle: string
    pageSubtitle: string
    esgTitle: string
    esgSubtitle: string
    esgTotal: string
    esgSaved: string
    securityStatus: string
    securityDesc: string
    timeSavedTitle: string
    timeSavedSubtitle: string
    timeSavedUnit: string
    timeSavedDesc: string
    peakTitle: string
    peakSubtitle: string
    peakLoad: string
    roadsTitle: string
    roadsSubtitle: string
    live: string
    weatherTitle: string
    weatherSubtitle: string
    weatherTime: string
    predictionTitle: string
    predictionSubtitle: string
    road: string
    day: string
    hour: string
    calculate: string
    predictedSpeed: string
    predictedCongestion: string
    modelConfidence: string
    days: Record<string, string>
  }
  analyticsPage: {
    title: string
    subtitle: string
    avgSpeed: string
    avgCongestion: string
    activeVehicles: string
    last24h: string
    districts: string
    districtsHint: string
    criticalSegments: string
    criticalSegmentsHint: string
    speedColumn: string
    congestionColumn: string
    trendColumn: string
    aiPredictionTitle: string
    dailyPeakTitle: string
    dailyPeakSubtitle: string
    dailyPeakHint: string
    districtWeatherTitle: string
    currentHour: string
    dataLoading: string
    now: string
  }
  transportPage: {
    title: string
    subtitle: string
    metro: string
    buses: string
    stations: string
    stops: string
  }
  adminPage: {
    title: string
    subtitle: string
    loginTitle: string
    loginSubtitle: string
    username: string
    password: string
    signIn: string
    signingIn: string
    signOut: string
    invalidCredentials: string
    pendingTitle: string
    pendingEmpty: string
    approve: string
    reject: string
    loggedInAs: string
  }
  common: {
    loading: string
    error: string
    retry: string
    close: string
    cancel: string
    save: string
    minutes: string
    km: string
    kmh: string
    vehicles: string
    ago: string
    justNow: string
    pickOnMap: string
    pickingOnMapHint: string
  }
  walletPage: {
    loggedOutTitle: string
    loggedOutDesc: string
    title: string
    subtitle: string
    errorLoad: string
    errorVoucher: string
    balanceTitle: string
    totalCo2: string
    monetizationTitle: string
    monetizationDesc: string
    progress: string
    generateVoucher: string
    myVouchers: string
    fuelCard: string
    issuedAt: string
    ecoXpTotal: string
    streakDays: string
    co2SavedKg: string
    currentRank: string
    maxRank: string
    rankLeft: string
    totalRoutes: string
    totalDistance: string
    longestStreak: string
    badgeCount: string
    achievements: string
    badgesEarned: string
  }
  profilePage: {
    loggedOutTitle: string
    loggedOutDesc: string
    totalKm: string
    totalCo2: string
    ecoPoints: string
    contactInfo: string
    email: string
    phone: string
    add: string
    vehicleInfo: string
    engineType: string
    multiplier: string
    ecoPointGain: string
    plateNumber: string
    ecoDriver: string
    logout: string
    logoutConfirmTitle: string
    logoutConfirmDesc: string
    logoutConfirmYes: string
    logoutConfirmNo: string
    vehicleTypes: {
      PETROL: string
      DIESEL: string
      HYBRID: string
      ELECTRIC: string
      NONE: string
    }
  }
}

export const az: Strings = {
  brand: { name: 'WayGo', tagline: 'Bakı Mobiliti' },
  nav: {
    liveMap: 'Canlı Xəritə',
    analytics: 'Analitika',
    incidents: 'Hadisələr',
    transport: 'Nəqliyyat',
    weather: 'Hava Məlumatı',
    adminPanel: 'Admin Paneli',
    ecoWallet: 'Eko-Cüzdan',
    profile: 'Profil',
  },
  topbar: {
    searchPlaceholder: 'Bakıda yer, küçə axtar...',
    filters: 'Filtrlər',
    menu: 'Menyu',
    liveIncidents: 'Aktiv hadisələr',
    notifications: 'Bildirişlər',
    noNotifications: 'Hələ yeni bildiriş yoxdur',
    viewAll: 'Hamısına bax',
  },
  systemStatus: {
    healthy: 'Sistem normaldır',
    healthySubtitle: 'Bütün xidmətlər aktivdir',
    degraded: 'Bağlantı problemi',
    degradedSubtitle: 'Backend serverini yoxlayın',
    checking: 'Sistem yoxlanılır...',
  },
  legend: {
    flowing: 'Axıcı yol',
    slow: 'Yavaş hərəkət',
    heavy: 'Ağır tıxac',
    jammed: 'Çox sıx tıxac',
    incident: 'Hadisə',
  },
  layers: {
    title: 'Xəritə',
    street: 'Xəritə',
    satellite: 'Peyk',
    traffic: 'Tıxac',
    incidents: 'Hadisələr',
    liveIncidents: 'Canlı hadisələr',
  },
  mapControls: {
    zoomIn: 'Yaxınlaşdır',
    zoomOut: 'Uzaqlaşdır',
    locate: 'Məni tap',
    locateError: 'Məkan tapılmadı',
    fullscreen: 'Tam ekran',
    exitFullscreen: 'Tam ekrandan çıx',
  },
  routePlanner: {
    title: 'Marşrut Planlayıcısı',
    origin: 'Başlanğıc nöqtəsi',
    destination: 'Gediş nöqtəsi',
    originPlaceholder: 'Başlanğıc yeri axtar...',
    destinationPlaceholder: 'Gediş yerini axtar...',
    swap: 'Yerini dəyiş',
    fastest: 'Sürətli',
    eco: 'Eco',
    showOnMap: 'Marşrutu Xəritədə Göstər',
    clear: 'Marşrutu Təmizlə',
    distance: 'məsafə',
    trafficLight: 'Yüngül trafik',
    trafficModerate: 'Orta trafik',
    trafficHeavy: 'Ağır trafik',
    routeLabel: { fastest: 'Ən sürətli marşrut', eco: 'Eco marşrut (şəbəkə bazalı)' },
    reopen: 'Marşrut planla',
    forecastTitle: 'Trafik proqnozu',
    now: 'İndi',
    min: 'dəq',
    searching: 'Axtarılır...',
    noResults: 'Nəticə tapılmadı',
    calculating: 'Marşrut hesablanır...',
    pickBoth: 'Marşrutu görmək üçün hər iki nöqtəni seçin',
    error: 'Marşrut hesablana bilmədi. Yenidən cəhd edin.',
    minutesShort: 'dəq',
    startTrip: 'Səfərə Başla',
    endTrip: 'Səfəri Bitir',
  },
  chat: {
    title: 'WayGo AI',
    subtitle: 'Bakı Mobility Assistant',
    online: 'Onlayn',
    offline: 'Oflayn',
    inputPlaceholder: 'Sualınızı yazın...',
    greeting: 'Salam! 👋 Bakıda yol vəziyyəti, marşrutlar, hadisələr və hava haqqında sizə necə kömək edə bilərəm?',
    quickPrompts: ['Hazırda harada tıxac var?', 'Hava limanına necə gedim?', 'Ən sürətli marşrut hansıdır?'],
    thinking: 'WayGo AI yazır...',
    errorReply: 'Bağlantı xətası baş verdi. Backend serverinin işlədiyinə əmin olun.',
    open: 'WayGo AI-ı aç',
    close: 'Bağla',
    clear: 'Söhbəti təmizlə',
  },
  cityBar: {
    citywideStatus: 'Şəhər üzrə vəziyyət',
    avgCongestion: 'Orta tıxac',
    avgSpeed: 'Orta sürət',
    activeIncidents: 'Aktiv hadisələr',
    liveIncidents: 'Canlı hadisələr',
    lastUpdated: 'Son yenilənmə',
    refresh: 'Yenilə',
  },
  weather: {
    pageTitle: 'Hava Məlumatı',
    pageSubtitle: 'Bakı üzrə cari hava şəraiti və onun trafikə təsiri',
    temperature: 'Temperatur',
    windSpeed: 'Külək sürəti',
    precipitation: 'Yağıntı',
    trafficImpact: 'Trafikə təsiri',
    trafficImpactHint: 'Hava şəraitinin cari tıxaca hesablanmış təsir dərəcəsi',
    dataSource: 'Mənbə',
    conditions: {
      clear: 'Açıq və günəşli',
      'partly-cloudy': 'Qismən buludlu',
      overcast: 'Tutqun',
      fog: 'Duman',
      drizzle: 'Çiskin',
      rain: 'Yağışlı',
      snow: 'Qarlı',
      showers: 'Sağanaq yağış',
      thunderstorm: 'Tufan',
      'fallback-weather': 'Təxmini hava',
      unknown: 'Naməlum',
    },
  },
  incidentTypes: {
    ACCIDENT: 'Qəza',
    ROADWORKS: 'Yol təmiri',
    POLICE: 'Polis nəzarəti',
    HAZARD: 'Təhlükə',
    ROAD_CLOSED: 'Yol bağlıdır',
    HEAVY_TRAFFIC: 'Ağır tıxac',
    OTHER: 'Digər',
    STATISTICAL_ANOMALY: 'Qeyri-adi tıxac (sistem aşkarlaması)',
  },
  incidentSource: {
    USER_REPORT: 'İstifadəçi hesabatı',
    ANOMALY_DETECTION: 'Avtomatik aşkarlama',
  },
  incidentsPage: {
    title: 'Hadisələr',
    subtitle: 'Bakı yollarında aktiv hadisələr və sistem tərəfindən aşkarlanan anomaliyalar',
    empty: 'Hazırda aktiv hadisə yoxdur',
    emptyHint: 'Yeni hadisələr avtomatik olaraq burada görünəcək',
    reportButton: 'Hadisə bildir',
    liveBadge: 'CANLI',
  },
  reportModal: {
    title: 'Yol hadisəsini bildir',
    subtitle: 'Hesabatınız admin tərəfindən təsdiqləndikdən sonra xəritədə görünəcək',
    type: 'Hadisə növü',
    description: 'Təsvir',
    descriptionPlaceholder: 'Nə baş verdiyini qısaca izah edin...',
    location: 'Yol seqmenti',
    locationHint: 'Hesabatın aid olduğu yol seqmentini seçin',
    useMapPin: 'Koordinatları özüm daxil edim',
    segment: 'Seqment',
    submit: 'Göndər',
    submitting: 'Göndərilir...',
    cancel: 'Ləğv et',
    success: 'Təşəkkürlər! Hesabatınız admin təsdiqini gözləyir.',
    error: 'Hesabat göndərilə bilmədi. Yenidən cəhd edin.',
  },
  aiAnalytics: {
    pageTitle: 'İntellektual Analitika',
    pageSubtitle: '/api/v1/analytics/stats - Canlı AI Göstəriciləri',
    esgTitle: 'Verra ESG Analitikası',
    esgSubtitle: 'Karbon və Ekologiya Qeydləri',
    esgTotal: 'Ümumi ESG Qeydləri',
    esgSaved: 'Nəfər tıxacdan xilas olub',
    securityStatus: 'Təhlükəsizlik Statusu',
    securityDesc: 'Blokçeyn məntiqi ilə qorunan dəyişdirilə bilməz sənədlər.',
    timeSavedTitle: 'Qənaət Edilən Vaxt',
    timeSavedSubtitle: 'AI alternativ marşrutlarının faydası',
    timeSavedUnit: 'Dəqiqə / Səfər',
    timeSavedDesc: 'Bu gün hər bir sürücü AI sayəsində orta hesabla 18 dəqiqə tıxacdan xilas olub.',
    peakTitle: 'Pik Tıxac Saatları',
    peakSubtitle: 'AI analizinə görə ən qorxulu saatlar (8, 9, 18, 19)',
    peakLoad: 'Yük %',
    roadsTitle: 'Yolların Vəziyyəti',
    roadsSubtitle: 'ML Modeli - 9 Əsas Magistral',
    live: 'CANLI',
    weatherTitle: 'Canlı Hava Şəraiti',
    weatherSubtitle: 'Sürücünün GPS-inə əsasən cari hava durumu',
    weatherTime: 'Saat:',
    predictionTitle: 'AI Tıxac Proqnozu',
    predictionSubtitle: 'CatBoost ML Modeli ilə gələcəyi görün',
    road: 'Yol / Küçə',
    day: 'Gün',
    hour: 'Saat',
    calculate: 'Nəticəni Hesabla',
    predictedSpeed: 'Təxmin Edilən Sürət',
    predictedCongestion: 'Sıxlıq Dərəcəsi',
    modelConfidence: 'Model Güvəni (Confidence)',
    days: {
      MONDAY: 'Bazar ertəsi',
      TUESDAY: 'Çərşənbə axşamı',
      WEDNESDAY: 'Çərşənbə',
      THURSDAY: 'Cümə axşamı',
      FRIDAY: 'Cümə',
      SATURDAY: 'Şənbə',
      SUNDAY: 'Bazar'
    }
  },
  analyticsPage: {
    title: 'Analitika',
    subtitle: 'Bakı şəhərinin canlı trafik göstəriciləri & AI proqnozları',
    avgSpeed: 'Orta sürət',
    avgCongestion: 'Orta tıxac',
    activeVehicles: 'Aktiv nəqliyyat',
    last24h: 'Son 24 saat',
    districts: 'Rayonlar üzrə tıxac',
    districtsHint: 'Canlı axın məlumatı əsasında',
    criticalSegments: 'Kritik Yollar (Top 5)',
    criticalSegmentsHint: 'Hazırda ən çox yüklənmiş yol seqmentləri',
    speedColumn: 'Sürət',
    congestionColumn: 'Tıxac',
    trendColumn: 'Proqnoz',
    aiPredictionTitle: 'AI Proqnozu',
    dailyPeakTitle: 'Günlük Trafik Piki',
    dailyPeakSubtitle: 'Tıxac & Sürət (24 saat)',
    dailyPeakHint: 'Tipik iş günü, Bakı mərkəzi',
    districtWeatherTitle: 'Rayon Hava Şəraiti',
    currentHour: 'İndiki saat',
    dataLoading: 'Məlumat yüklənir...',
    now: 'İndi',
  },
  transportPage: {
    title: 'Nəqliyyat',
    subtitle: 'Bakı Metrosu və avtobus marşrut şəbəkəsi',
    metro: 'Metro xətləri',
    buses: 'Avtobus marşrutları',
    stations: 'stansiya',
    stops: 'dayanacaq',
  },
  adminPage: {
    title: 'Admin Paneli',
    subtitle: 'İstifadəçi hesabatlarını təsdiqləyin və ya rədd edin',
    loginTitle: 'Admin girişi',
    loginSubtitle: 'Davam etmək üçün daxil olun',
    username: 'İstifadəçi adı',
    password: 'Şifrə',
    signIn: 'Daxil ol',
    signingIn: 'Daxil olunur...',
    signOut: 'Çıxış',
    invalidCredentials: 'İstifadəçi adı və ya şifrə yanlışdır',
    pendingTitle: 'Təsdiq gözləyən hesabatlar',
    pendingEmpty: 'Təsdiq gözləyən hesabat yoxdur',
    approve: 'Təsdiqlə',
    reject: 'Rədd et',
    loggedInAs: 'Daxil olub',
  },
  common: {
    loading: 'Yüklənir...',
    error: 'Xəta baş verdi',
    retry: 'Yenidən cəhd et',
    close: 'Bağla',
    cancel: 'Ləğv et',
    save: 'Yadda saxla',
    minutes: 'dəq',
    km: 'km',
    kmh: 'km/s',
    vehicles: 'vasitə',
    ago: 'əvvəl',
    justNow: 'indicə',
    pickOnMap: 'Xəritədə seç',
    pickingOnMapHint: 'Xəritədə nöqtəni seçin',
  },
  walletPage: {
    loggedOutTitle: 'Eko-Cüzdana baxmaq üçün giriş etməlisiniz',
    loggedOutDesc: 'Təbiətə verdiyiniz töhfələri izləmək, yığdığınız Eco-Points balansını görmək və topladığınız xalları SOCAR yanacaq vaoçerinə çevirmək üçün zəhmət olmasa sistemə daxil olun.',
    title: 'Eko-Cüzdan',
    subtitle: 'Təbiətə verdiyiniz töhfələr və qazandığınız SOCAR vaoçerləri.',
    errorLoad: 'Balans yüklənərkən xəta baş verdi.',
    errorVoucher: 'Vaoçer yaradılarkən xəta baş verdi.',
    balanceTitle: 'Eco-Points Balansı',
    totalCo2: 'Ümumi CO₂ Qənaəti',
    monetizationTitle: 'SOCAR Vaoçeri',
    monetizationDesc: '1000 XP = 10 AZN Yanacaq Vaoçeri',
    progress: 'Tərəqqi',
    generateVoucher: 'Vaoçer Yarat',
    myVouchers: 'Aktiv Vaoçerlərim',
    fuelCard: 'SOCAR Yanacaq Kartı',
    issuedAt: 'Yaradıldı',
    ecoXpTotal: 'ümumi xal',
    streakDays: 'gün seriyası',
    co2SavedKg: 'kiloqram',
    currentRank: 'Cari Rütbə',
    maxRank: 'Maksimum Rütbə 🏆',
    rankLeft: 'Növbəti rütbəyə {0} XP qalır',
    totalRoutes: 'Ümumi Marşrut',
    totalDistance: 'Ümumi Məsafə',
    longestStreak: 'Ən Uzun Seriya',
    badgeCount: 'Badge Sayı',
    achievements: 'Nailiyyətlər',
    badgesEarned: '{0}/{1} badge qazanılmış',
  },
  profilePage: {
    loggedOutTitle: 'Profilə baxmaq üçün giriş etməlisiniz',
    loggedOutDesc: 'Şəxsi məlumatlarınızı idarə etmək, avtomobil parametrlərinizi görmək və AI tərəfindən hesablanmış Eko-Çarpan reytinqinizi izləmək üçün zəhmət olmasa sistemə daxil olun.',
    totalKm: 'Ümumi km',
    totalCo2: 'CO₂ qənaəti',
    ecoPoints: 'EcoPoints',
    contactInfo: 'Əlaqə məlumatları',
    email: 'E-poçt',
    phone: 'Telefon',
    add: 'Əlavə et',
    vehicleInfo: 'Avtomobil məlumatları',
    engineType: 'Mühərrik növü',
    multiplier: 'Çarpan',
    ecoPointGain: 'Eko-Xal qazancı',
    plateNumber: 'Dövlət nömrə nişanı',
    ecoDriver: 'Eco-Sürücü',
    logout: 'Hesabdan çıx',
    logoutConfirmTitle: 'Hesabdan çıxış',
    logoutConfirmDesc: 'Sistemdən çıxmaq istədiyinizə əminsiniz?',
    logoutConfirmYes: 'Bəli, çıx',
    logoutConfirmNo: 'Xeyr, qal',
    vehicleTypes: {
      PETROL: 'Benzin',
      DIESEL: 'Dizel',
      HYBRID: 'Hibrid',
      ELECTRIC: 'Elektrik',
      NONE: 'Avtomobil yoxdur',
    },
  },
}

export const en: Strings = {
  brand: { name: 'WayGo', tagline: 'Baku Mobility' },
  nav: {
    liveMap: 'Live Map',
    analytics: 'Analytics',
    incidents: 'Incidents',
    transport: 'Transport',
    weather: 'Weather',
    adminPanel: 'Admin Panel',
    ecoWallet: 'Eco-Wallet',
    profile: 'Profile',
  },
  topbar: {
    searchPlaceholder: 'Search a place or street in Baku...',
    filters: 'Filters',
    menu: 'Menu',
    liveIncidents: 'Live incidents',
    notifications: 'Notifications',
    noNotifications: 'No new notifications yet',
    viewAll: 'View all',
  },
  systemStatus: {
    healthy: 'All systems normal',
    healthySubtitle: 'All services are active',
    degraded: 'Connection issue',
    degradedSubtitle: 'Check the backend server',
    checking: 'Checking system...',
  },
  legend: {
    flowing: 'Free flow',
    slow: 'Slow moving',
    heavy: 'Heavy traffic',
    jammed: 'Gridlock',
    incident: 'Incident',
  },
  layers: {
    title: 'Map',
    street: 'Map',
    satellite: 'Satellite',
    traffic: 'Traffic',
    incidents: 'Incidents',
    liveIncidents: 'Live incidents',
  },
  mapControls: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    locate: 'Find me',
    locateError: 'Could not find location',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
  },
  routePlanner: {
    title: 'Route Planner',
    origin: 'Starting point',
    destination: 'Destination',
    originPlaceholder: 'Search starting point...',
    destinationPlaceholder: 'Search destination...',
    swap: 'Swap',
    fastest: 'Fastest',
    eco: 'Eco',
    showOnMap: 'Show Route on Map',
    clear: 'Clear Route',
    distance: 'distance',
    trafficLight: 'Light traffic',
    trafficModerate: 'Moderate traffic',
    trafficHeavy: 'Heavy traffic',
    routeLabel: { fastest: 'Fastest route', eco: 'Eco route (network-based)' },
    reopen: 'Plan a route',
    forecastTitle: 'Traffic forecast',
    now: 'Now',
    min: 'min',
    searching: 'Searching...',
    noResults: 'No results found',
    calculating: 'Calculating route...',
    pickBoth: 'Choose both points to see the route',
    error: 'Could not calculate the route. Please try again.',
    minutesShort: 'min',
    startTrip: 'Start Trip',
    endTrip: 'End Trip',
  },
  chat: {
    title: 'WayGo AI',
    subtitle: 'Baku Mobility Assistant',
    online: 'Online',
    offline: 'Offline',
    inputPlaceholder: 'Type your question...',
    greeting: "Hi! 👋 I'm the WayGo assistant. Ask me about traffic, routes, incidents, or weather in Baku.",
    quickPrompts: ['Where is traffic right now?', "How do I get to the airport?", "What's the fastest route?"],
    thinking: 'WayGo AI is typing...',
    errorReply: 'Connection error — make sure the backend server is running.',
    open: 'Open WayGo AI',
    close: 'Close',
    clear: 'Clear chat',
  },
  cityBar: {
    citywideStatus: 'Citywide status',
    avgCongestion: 'Avg. congestion',
    avgSpeed: 'Avg. speed',
    activeIncidents: 'Active incidents',
    liveIncidents: 'Live incidents',
    lastUpdated: 'Last updated',
    refresh: 'Refresh',
  },
  weather: {
    pageTitle: 'Weather',
    pageSubtitle: 'Current conditions in Baku and their effect on traffic',
    temperature: 'Temperature',
    windSpeed: 'Wind speed',
    precipitation: 'Precipitation',
    trafficImpact: 'Traffic impact',
    trafficImpactHint: "The engine's estimate of how much weather is adding to current congestion",
    dataSource: 'Source',
    conditions: {
      clear: 'Clear and sunny',
      'partly-cloudy': 'Partly cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      drizzle: 'Drizzle',
      rain: 'Rain',
      snow: 'Snow',
      showers: 'Showers',
      thunderstorm: 'Thunderstorm',
      'fallback-weather': 'Estimated weather',
      unknown: 'Unknown',
    },
  },
  incidentTypes: {
    ACCIDENT: 'Accident',
    ROADWORKS: 'Roadworks',
    POLICE: 'Police checkpoint',
    HAZARD: 'Hazard',
    ROAD_CLOSED: 'Road closed',
    HEAVY_TRAFFIC: 'Heavy traffic',
    OTHER: 'Other',
    STATISTICAL_ANOMALY: 'Unusual congestion (system-detected)',
  },
  incidentSource: {
    USER_REPORT: 'User report',
    ANOMALY_DETECTION: 'Automatic detection',
  },
  incidentsPage: {
    title: 'Incidents',
    subtitle: 'Active incidents on Baku roads and anomalies detected by the engine',
    empty: 'No active incidents right now',
    emptyHint: 'New incidents will appear here automatically',
    reportButton: 'Report an incident',
    liveBadge: 'LIVE',
  },
  reportModal: {
    title: 'Report a road incident',
    subtitle: 'Your report appears on the map once an admin approves it',
    type: 'Incident type',
    description: 'Description',
    descriptionPlaceholder: 'Briefly describe what happened...',
    location: 'Road segment',
    locationHint: 'Choose which road segment this report is about',
    useMapPin: "I'll enter coordinates myself",
    segment: 'Segment',
    submit: 'Submit',
    submitting: 'Submitting...',
    cancel: 'Cancel',
    success: 'Thanks! Your report is pending admin approval.',
    error: 'Could not submit the report. Please try again.',
  },
  aiAnalytics: {
    pageTitle: 'Intelligent Analytics',
    pageSubtitle: '/api/v1/analytics/stats - Live AI Metrics',
    esgTitle: 'Verra ESG Analytics',
    esgSubtitle: 'Carbon & Ecology Records',
    esgTotal: 'Total ESG Records',
    esgSaved: 'People saved from traffic',
    securityStatus: 'Security Status',
    securityDesc: 'Immutable records secured by blockchain logic.',
    timeSavedTitle: 'Time Saved',
    timeSavedSubtitle: 'Benefit of AI alternative routes',
    timeSavedUnit: 'Minutes / Trip',
    timeSavedDesc: 'Today, each driver saved an average of 18 minutes from traffic thanks to AI.',
    peakTitle: 'Peak Traffic Hours',
    peakSubtitle: 'Most severe hours based on AI analysis (8, 9, 18, 19)',
    peakLoad: 'Load %',
    roadsTitle: 'Road Conditions',
    roadsSubtitle: 'ML Model - 9 Main Highways',
    live: 'LIVE',
    weatherTitle: 'Live Weather',
    weatherSubtitle: 'Current conditions based on Driver GPS',
    weatherTime: 'Time:',
    predictionTitle: 'AI Traffic Forecast',
    predictionSubtitle: 'See the future with CatBoost ML Model',
    road: 'Road / Street',
    day: 'Day',
    hour: 'Hour',
    calculate: 'Calculate Result',
    predictedSpeed: 'Predicted Speed',
    predictedCongestion: 'Congestion Level',
    modelConfidence: 'Model Confidence',
    days: {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday'
    }
  },
  analyticsPage: {
    title: 'Analytics',
    subtitle: 'Baku city live traffic metrics & AI forecasts',
    avgSpeed: 'Average speed',
    avgCongestion: 'Average congestion',
    activeVehicles: 'Active vehicles',
    last24h: 'Last 24 hours',
    districts: 'Congestion by district',
    districtsHint: 'Based on live flow data',
    criticalSegments: 'Critical Segments (Top 5)',
    criticalSegmentsHint: 'Currently most congested road segments',
    speedColumn: 'Speed',
    congestionColumn: 'Congestion',
    trendColumn: 'Forecast',
    aiPredictionTitle: 'AI Prediction',
    dailyPeakTitle: 'Daily Traffic Peak',
    dailyPeakSubtitle: 'Congestion & Speed (24h)',
    dailyPeakHint: 'Typical workday, Central Baku',
    districtWeatherTitle: 'District Weather Conditions',
    currentHour: 'Current hour',
    dataLoading: 'Loading data...',
    now: 'Now',
  },
  transportPage: {
    title: 'Transport',
    subtitle: 'Baku Metro and bus route network',
    metro: 'Metro lines',
    buses: 'Bus routes',
    stations: 'stations',
    stops: 'stops',
  },
  adminPage: {
    title: 'Admin Panel',
    subtitle: 'Approve or reject community incident reports',
    loginTitle: 'Admin sign in',
    loginSubtitle: 'Sign in to continue',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    signOut: 'Sign out',
    invalidCredentials: 'Incorrect username or password',
    pendingTitle: 'Reports awaiting review',
    pendingEmpty: 'No reports awaiting review',
    approve: 'Approve',
    reject: 'Reject',
    loggedInAs: 'Signed in as',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    minutes: 'min',
    km: 'km',
    kmh: 'km/h',
    vehicles: 'vehicles',
    ago: 'ago',
    justNow: 'just now',
    pickOnMap: 'Pick on map',
    pickingOnMapHint: 'Select a point on the map',
  },
  walletPage: {
    loggedOutTitle: 'Please log in to view Eco-Wallet',
    loggedOutDesc: 'Log in to track your contributions to nature, see your Eco-Points balance, and convert your points into a SOCAR fuel voucher.',
    title: 'Eco-Wallet',
    subtitle: 'Your contributions to nature and earned SOCAR vouchers.',
    errorLoad: 'An error occurred while loading the balance.',
    errorVoucher: 'An error occurred while generating the voucher.',
    balanceTitle: 'Eco-Points Balance',
    totalCo2: 'Total CO₂ Saved',
    monetizationTitle: 'SOCAR Voucher',
    monetizationDesc: '1000 XP = 10 AZN Fuel Voucher',
    progress: 'Progress',
    generateVoucher: 'Generate Voucher',
    myVouchers: 'My Active Vouchers',
    fuelCard: 'SOCAR Fuel Card',
    issuedAt: 'Issued',
    ecoXpTotal: 'total xp',
    streakDays: 'day streak',
    co2SavedKg: 'kilograms',
    currentRank: 'Current Rank',
    maxRank: 'Max Rank 🏆',
    rankLeft: '{0} XP left to next rank',
    totalRoutes: 'Total Routes',
    totalDistance: 'Total Distance',
    longestStreak: 'Longest Streak',
    badgeCount: 'Badge Count',
    achievements: 'Achievements',
    badgesEarned: '{0}/{1} badges earned',
  },
  profilePage: {
    loggedOutTitle: 'Please log in to view your profile',
    loggedOutDesc: 'Log in to manage your personal information, view vehicle parameters, and track your AI-calculated Eco-Multiplier rating.',
    totalKm: 'Total km',
    totalCo2: 'CO₂ Saved',
    ecoPoints: 'EcoPoints',
    contactInfo: 'Contact information',
    email: 'Email',
    phone: 'Phone',
    add: 'Add',
    vehicleInfo: 'Vehicle information',
    engineType: 'Engine type',
    multiplier: 'Multiplier',
    ecoPointGain: 'Eco-Point gain',
    plateNumber: 'Plate number',
    ecoDriver: 'Eco-Driver',
    logout: 'Log out',
    logoutConfirmTitle: 'Log out',
    logoutConfirmDesc: 'Are you sure you want to log out?',
    logoutConfirmYes: 'Yes, log out',
    logoutConfirmNo: 'No, stay',
    vehicleTypes: {
      PETROL: 'Petrol',
      DIESEL: 'Diesel',
      HYBRID: 'Hybrid',
      ELECTRIC: 'Electric',
      NONE: 'No vehicle',
    },
  },
}
