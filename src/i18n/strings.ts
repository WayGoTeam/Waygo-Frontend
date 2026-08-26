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
    issuedAt: 'Issued at',
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
