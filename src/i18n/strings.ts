export interface Strings {
  brand: { name: string; tagline: string }
  nav: {
    liveMap: string
    analytics: string
    incidents: string
    transport: string
    weather: string
    adminPanel: string
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
    shortest: string
    alternative: string
    showOnMap: string
    clear: string
    distance: string
    trafficLight: string
    trafficModerate: string
    trafficHeavy: string
    routeLabel: Record<'fastest' | 'shortest' | 'alternative', string>
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
    shortest: 'Qısa',
    alternative: 'Alternativ',
    showOnMap: 'Marşrutu Xəritədə Göstər',
    clear: 'Marşrutu Təmizlə',
    distance: 'məsafə',
    trafficLight: 'Yüngül trafik',
    trafficModerate: 'Orta trafik',
    trafficHeavy: 'Ağır trafik',
    routeLabel: { fastest: 'Ən sürətli marşrut', shortest: 'Ən qısa marşrut', alternative: 'Alternativ marşrut' },
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
  analyticsPage: {
    title: 'Analitika',
    subtitle: 'Bakı üzrə tıxac tendensiyaları və rayonlar üzrə real-vaxt göstəricilər',
    avgSpeed: 'Orta sürət',
    avgCongestion: 'Orta tıxac',
    activeVehicles: 'Aktiv nəqliyyat',
    last24h: 'Son 24 saat',
    districts: 'Rayonlar üzrə tıxac',
    districtsHint: 'TomTom canlı axın məlumatı əsasında',
    criticalSegments: 'Kritik Yollar (Top 5)',
    criticalSegmentsHint: 'Hazırda ən çox yüklənmiş yol seqmentləri',
    speedColumn: 'Sürət',
    congestionColumn: 'Tıxac',
    trendColumn: 'Proqnoz',
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
    shortest: 'Shortest',
    alternative: 'Alternative',
    showOnMap: 'Show Route on Map',
    clear: 'Clear Route',
    distance: 'distance',
    trafficLight: 'Light traffic',
    trafficModerate: 'Moderate traffic',
    trafficHeavy: 'Heavy traffic',
    routeLabel: { fastest: 'Fastest route', shortest: 'Shortest route', alternative: 'Alternative route' },
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
  analyticsPage: {
    title: 'Analytics',
    subtitle: 'Citywide congestion trends and real-time district breakdowns',
    avgSpeed: 'Average speed',
    avgCongestion: 'Average congestion',
    activeVehicles: 'Active vehicles',
    last24h: 'Last 24 hours',
    districts: 'Congestion by district',
    districtsHint: 'Based on live TomTom flow data',
    criticalSegments: 'Critical Segments (Top 5)',
    criticalSegmentsHint: 'Currently most congested road segments',
    speedColumn: 'Speed',
    congestionColumn: 'Congestion',
    trendColumn: 'Forecast',
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
  },
}
