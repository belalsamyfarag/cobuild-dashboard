// Mock Data for CoBuild PropTech Construction Transparency Dashboard

const dashboardData = {
  projectInfo: {
    name: "برج الياسمين الإسكاني والمهني",
    code: "CB-2023-YAS-01",
    location: "الرياض - طريق الملك سلمان",
    client: "شركة التطوير العقاري المتقدمة",
    generalContractor: "شركة البناء الحديث للإنشاءات",
    completionPercentage: 90,
    safeDays: 200,
    sustainabilityScore: "A+ (مستدام متقدم)"
  },

  reports: [
    {
      id: "rep-01",
      title: "تقرير يناير 2023",
      month: "يناير 2023",
      year: "2023",
      size: "4.2 MB",
      date: "2023-01-31",
      summary: "تقرير الإنجاز الشهري لأعمال الأساسات وصب اللبشة المسلحة وأعمدة القبو مع اختبارات جودة الخرسانة.",
      status: "معتمد"
    },
    {
      id: "rep-02",
      title: "تقرير فبراير 2023",
      month: "فبراير 2023",
      year: "2023",
      size: "5.8 MB",
      date: "2023-02-28",
      summary: "تقرير فحص صب أسقف الطابقين الأول والثاني، وتقارير السلامة الإنشائية ومطابقة حديد التسليح.",
      status: "معتمد"
    },
    {
      id: "rep-03",
      title: "تقرير فبراير 2023 (المعدل)",
      month: "فبراير 2023",
      year: "2023",
      size: "6.1 MB",
      date: "2023-03-05",
      summary: "الملحق الفني لتقرير فبراير متضمناً نتائج فحوصات الكور والمطابقة الهندسية للتمديدات الميكانيكية.",
      status: "معتمد"
    },
    {
      id: "rep-04",
      title: "تقرير مارس 2023",
      month: "مارس 2023",
      year: "2023",
      size: "7.4 MB",
      date: "2023-03-31",
      summary: "تقرير متابعة أعمال التشطيبات الأولية، تمديد خطوط الإطفاء، وتركيب قطاعات الألومنيوم والزجاج.",
      status: "معتمد"
    }
  ],

  gallery: [
    {
      id: "gal-1",
      title: "يناير",
      date: "2023-02-23",
      subtitle: "أنجزت مكتبية البناء مع الخطوات النفيس للفنيات",
      description: "صورة توضح أعمال تجهيز وصب سقف الطابق المتكرر مع تواجد طاقم المهندسين وفريق الجودة ومضخات الخرسانة الجاهزة.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80",
      tag: "الخرسانة المسلحة"
    },
    {
      id: "gal-2",
      title: "فبراير",
      date: "2023-02-15",
      subtitle: "أندين مكتبية البناء مع الملاوي النفس للفنيات",
      description: "اكتمال أعمال الهيكل الخرساني للأدوار السفلية والبدء بتركيب الشدات المعدنية لرفع الأعمدة للأدوار العليا مع الرافعة البرجية.",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
      tag: "الهيكل والأعمدة"
    },
    {
      id: "gal-3",
      title: "مارس",
      date: "2023-03-21",
      subtitle: "الموقع تصوير الإجمالي للدهان والتشييد",
      description: "نظرة علوية شاملة لموقع المشروع توضح ترتيب المواد الخام، مسارات الرافعات، وتقدم أعمال التسليح في كافة المحاور.",
      imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
      tag: "الموقع العام"
    },
    {
      id: "gal-4",
      title: "أعمال الحفر والأساسات",
      date: "2023-01-10",
      subtitle: "أعمال العزل والخرسانة العادية",
      description: "صورة دقيقة للمحاور الإنشائية وتمديد شبكات الصرف الأرضية مع تطبيق طبقات العزل المائي المعتمدة.",
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
      tag: "الأساسات"
    },
    {
      id: "gal-5",
      title: "الشدات والحديد",
      date: "2023-02-05",
      subtitle: "تركيب شبكات التسليح",
      description: "فحص مهندسي ضبط الجودة لاستلام حديد التسليح ومباعدات البسكويت قبل اعتماد إذن الصب الخرساني.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      tag: "التسليح"
    }
  ],

  liveCameras: [
    {
      id: "cam-1",
      name: "كاميرا البرج الرئيسي (HD)",
      location: "الزاوية الشمالية - البرج A",
      streamStatus: "مباشر - 1080p 60fps",
      bgGradient: "radial-gradient(circle at 50% 40%, #162a45 0%, #09101d 100%)"
    },
    {
      id: "cam-2",
      name: "كاميرا الرافعة العلوية",
      location: "مقصورة الرافعة البرجية",
      streamStatus: "مباشر - 4K 30fps",
      bgGradient: "radial-gradient(circle at 60% 30%, #1a3644 0%, #06151f 100%)"
    },
    {
      id: "cam-3",
      name: "كاميرا بوابة الدخول والإمداد",
      location: "البوابة الرئيسية رقم 1",
      streamStatus: "مباشر - 1080p 30fps",
      bgGradient: "radial-gradient(circle at 40% 50%, #201e38 0%, #0d0c1c 100%)"
    },
    {
      id: "cam-4",
      name: "كاميرا منطقة الصب المركزية",
      location: "القطاع الأوسط - الطابق 3",
      streamStatus: "مباشر - 1080p 60fps",
      bgGradient: "radial-gradient(circle at 50% 50%, #142f36 0%, #081318 100%)"
    }
  ],

  budget: {
    totalBudgetSAR: 15000000,
    currency: "ر.س",
    categories: [
      { name: "المواد", percentage: 30, amount: 4500000, color: "#0d9488", description: "الخرسانة، حديد التسليح، البلك والأسمنت" },
      { name: "العمالة", percentage: 20, amount: 3000000, color: "#0284c7", description: "أجور الفرق الميدانية والفنيين والمهندسين" },
      { name: "المقاولين", percentage: 10, amount: 1500000, color: "#f59e0b", description: "مقاولين الباطن للأعمال الكهروميكانيكية والعزل" },
      { name: "التراخيص والاحتياطي", percentage: 40, amount: 6000000, color: "#94a3b8", description: "رسوم الاعتماد، التراخيص الحكومية ومخصص الطوارئ" }
    ]
  },

  floors: [
    {
      floorNumber: 6,
      name: "طابق الخدمات والسطح",
      status: "upcoming",
      progress: 0,
      label: "مرحلة التجهيز",
      color: "#cbd5e1"
    },
    {
      floorNumber: 5,
      name: "الطابق الخامس",
      status: "in-progress",
      progress: 40,
      label: "أعمال الشدات والحديد",
      color: "#f59e0b"
    },
    {
      floorNumber: 4,
      name: "الطابق الرابع",
      status: "in-progress",
      progress: 75,
      label: "صب الأسقف والأعمدة",
      color: "#f59e0b"
    },
    {
      floorNumber: 3,
      name: "الطابق الثالث",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 2,
      name: "الطابق الثاني",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 1,
      name: "الطابق الأول",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 0,
      name: "الطابق الأرضي والمواقف",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#0d9488"
    }
  ],

  milestonesTimeline: [
    {
      id: "stage-1",
      title: "مرحلة الهيكل",
      status: "completed",
      date: "2023-01-15",
      desc: "اكتمال الأساسات وصب الأعمدة الخرسانية"
    },
    {
      id: "stage-2",
      title: "مرحلة التشطيب",
      status: "active",
      date: "2023-02-20",
      desc: "جاري تنفيذ أعمال اللياسة والتمديدات"
    },
    {
      id: "stage-3",
      title: "مرحلة التجهيز",
      status: "pending",
      date: "2023-04-10",
      desc: "تركيب الواجهات الزجاجية والمصاعد"
    },
    {
      id: "stage-4",
      title: "مرحلة التسليم",
      status: "upcoming",
      date: "2023-06-30",
      desc: "الفحص النهائي وتسليم المفاتيح"
    }
  ],

  progressCards: [
    {
      month: "مارس",
      date: "21-05-2023",
      summary: "الموقع تصوير الإجمالي للدهان والتشييد.",
      img: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80"
    },
    {
      month: "فبراير",
      date: "11-05-2023",
      summary: "الموقع تصوير الأعمال الأساسية للرسائل...",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      month: "يناير",
      date: "22-05-2023",
      summary: "المعايير المتميزة بالدفع المقاول للشماعة...",
      img: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80"
    }
  ],

  upcomingEvents: [
    {
      id: "ev-1",
      title: "27 عون العروبة",
      subtitle: "التشطيب في المساحة المعاني 2022 وشق البناء",
      date: "27 مارس 2023",
      status: "مجدول",
      priority: "high"
    },
    {
      id: "ev-2",
      title: "28 حمود العضمة",
      subtitle: "صيانة حقول وتثبيت الشدات والخرسانة المسلحة",
      date: "28 مارس 2023",
      status: "قيد المراجعة",
      priority: "medium"
    },
    {
      id: "ev-3",
      title: "30 علند المناسب",
      subtitle: "فحص ومطابقة معايير مركز الشفافية للبناء والسلامة",
      date: "30 مارس 2023",
      status: "معتمد",
      priority: "high"
    }
  ],

  weather: {
    currentTemp: 20,
    condition: "مشمس",
    conditionEn: "Sunny",
    advice: "طقس مثالي لأعمال الصب والرافعات",
    windSpeed: "14 كم/س (آمن)",
    humidity: "42%",
    pressure: "1013 hPa",
    airQuality: "ممتاز (AQI 28)",
    forecast: [
      { day: "الأحد", temp: "17°", icon: "sun" },
      { day: "الإثنين", temp: "12°", icon: "sun" },
      { day: "الثلاثاء", temp: "13°", icon: "sun" },
      { day: "الأربعاء", temp: "17°", icon: "sun" },
      { day: "الخميس", temp: "18°", icon: "sun" }
    ],
    skyForecast: [
      { day: "الخميس", temp: "15°", desc: "مشمس" },
      { day: "الجمعة", temp: "16°", desc: "مشمس" },
      { day: "السبت", temp: "20°", desc: "صافي" }
    ]
  },

  iotSensors: [
    { id: "sens-1", name: "مستشعر نضج الخرسانة (سقف 3)", value: "28.4°C", status: "optimal", desc: "درجة حرارة الإماهة مثالية - قوة الخرسانة 36 MPa" },
    { id: "sens-2", name: "ميلان الرافعة البرجية", value: "0.18°", status: "optimal", desc: "ضمن الحدود المسموح بها كودياً (< 0.5°)" },
    { id: "sens-3", name: "مستوى الضجيج البيئي", value: "68 dB", status: "normal", desc: "متوافق مع المعايير البلدية للأحياء السكنية" },
    { id: "sens-4", name: "مؤشر نقاوة الهواء والغبار", value: "18 µg/m³", status: "optimal", desc: "رش المياه مستمر للحد من انبعاثات الأتربة" }
  ],

  floorBimDetails: {
    0: {
      name: "الطابق الأرضي والمواقف",
      concreteTest: "42 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%",
      mepStatus: "تمديدات السباكة والكهرباء منجزة بنسبة 100%",
      finishingStatus: "أرضيات إيبوكسي وعزل مائي معتمد",
      snagItems: ["فحص مصارف تصريف السيول", "اعتماد لوحات التوزيع الرئيسية"],
      engineerApproval: "معتمد بالكامل من مكتب خطيب وعلمي للاستشارات"
    },
    1: {
      name: "الطابق الأول (تجاري / مكتبي)",
      concreteTest: "38.5 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%",
      mepStatus: "مجاري التكييف ومكافحة الحريق منجزة بنسبة 95%",
      finishingStatus: "أعمال القواطع الجبسية والواجهات الزجاجية",
      snagItems: ["معاينة مخارج الطوارئ", "فحص ضغط شبكة مكافحة الحريق"],
      engineerApproval: "معتمد - تم إصدار شهادة استلام المرحلة"
    },
    2: {
      name: "الطابق الثاني (سكني)",
      concreteTest: "39.1 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%",
      mepStatus: "تمديدات التغذية والصرف والتكييف منجزة بنسبة 90%",
      finishingStatus: "اكتمال أعمال اللياسة والدهانات التأسيسية",
      snagItems: ["فحص ميول تصريف الشرفات", "استلام علب الكهرباء"],
      engineerApproval: "معتمد من استشاري المشروع"
    },
    3: {
      name: "الطابق الثالث (سكني)",
      concreteTest: "37.8 MPa (المطلوب: 35 MPa) - ناجح بنسبة 100%",
      mepStatus: "تمديدات الكهرباء والأنابيب منجزة بنسبة 85%",
      finishingStatus: "بدء أعمال البلوك واللياسة الداخلية",
      snagItems: ["استلام شبكات الإنذار المبكر", "مطابقة العوازل الحرارية"],
      engineerApproval: "معتمد جزئياً - جاري فحص أعمال التمديدات"
    },
    4: {
      name: "الطابق الرابع (قيد الإنشاء)",
      concreteTest: "جاري انتظار نتيجة كسر المكعبات (عمر 28 يوم)",
      mepStatus: "تأسيس مسارات الأنابيب والفتحات الإنشائية (Sleeves)",
      finishingStatus: "مرحلة صب الأعمدة والجسور الخرسانية",
      snagItems: ["فحص شاقولية الأعمدة", "استلام حديد التسليح للسقف"],
      engineerApproval: "قيد المتابعة الميدانية"
    },
    5: {
      name: "الطابق الخامس (أعمال الشدات)",
      concreteTest: "لم يتم الصب بعد - اعتماد خلطة الخرسانة C40",
      mepStatus: "مراجعة المخططات التنفيذية (Shop Drawings)",
      finishingStatus: "تركيب السقالات والشدات الخشبية والمعدنية",
      snagItems: ["مطابقة أبعاد الجسور الساقطة", "فحص مباعدات حديد التسليح"],
      engineerApproval: "مجدول للاستلام خلال 3 أيام"
    },
    6: {
      name: "السطح وغرفة المصاعد والخدمات",
      concreteTest: "مرحلة التجهيز والربط الإنشائي",
      mepStatus: "تأسيس قواعد غرف التكييف المركزية والمصاعد",
      finishingStatus: "لم تبدأ بعد",
      snagItems: ["اعتماد مواصفات عزل السطح المائي والحراري"],
      engineerApproval: "مخطط ضمن الربع القادم"
    }
  },

  budgetLedger: [
    { id: "inv-101", category: "المواد", item: "توريد حديد تسليح سابك (Grade 60)", amount: "1,850,000 ر.س", supplier: "شركة الراجحي للصلب", date: "2023-01-12", status: "مدفوع" },
    { id: "inv-102", category: "المواد", item: "خرسانة جاهزة مقاومة للكبريتات (C40)", amount: "2,650,000 ر.س", supplier: "شركة الخرسانة السعودية", date: "2023-02-04", status: "مدفوع" },
    { id: "inv-103", category: "العمالة", item: "أجور فرق النجارة والحدادة والصب", amount: "1,900,000 ر.س", supplier: "إدارة العمليات الميدانية", date: "2023-02-28", status: "مدفوع" },
    { id: "inv-104", category: "العمالة", item: "رواتب الفريق الهندسي وضبط الجودة", amount: "1,100,000 ر.س", supplier: "الكادر الاستشاري", date: "2023-03-01", status: "مدفوع" },
    { id: "inv-105", category: "المقاولين", item: "مقاول التكييف ومجاري الهواء (MEP)", amount: "850,000 ر.س", supplier: "المتحدة للأنظمة الكهروميكانيكية", date: "2023-03-15", status: "معتمد للصرف" },
    { id: "inv-106", category: "المقاولين", item: "مقاول المصاعد والسلالم الكهربائية", amount: "650,000 ر.س", supplier: "أوتيس السعودية", date: "2023-03-20", status: "دفعة مقدمة" },
    { id: "inv-107", category: "التراخيص والاحتياطي", item: "رسوم الإشراف والدفاع المدني والبلدية", amount: "1,200,000 ر.س", supplier: "أمانة منطقة الرياض", date: "2023-01-05", status: "مدفوع" },
    { id: "inv-108", category: "التراخيص والاحتياطي", item: "مخصص الطوارئ وتقلبات الأسعار", amount: "4,800,000 ر.س", supplier: "صندوق الضمان المالي للمشروع", date: "2023-03-30", status: "محجوز بنكياً" }
  ],

  droneSurvey: {
    lastFlightDate: "2023-03-24",
    resolution: "0.8 cm/px GSD",
    totalAreaM2: 12500,
    droneModel: "DJI Matrice 300 RTK + Zenmuse P1",
    orthoImageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    thermalImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    elevationStats: "منسوب الحفر: -12.40م | أعلى نقطة بالهيكل: +28.60م"
  },

  aiSafetyDetections: [
    { id: "ai-1", type: "worker", label: "مهندس الموقع - أحمد", ppe: "خوذة: معتمدة | سترة: معتمدة | حذاء أمان: معتمد", status: "safe", box: { top: "35%", left: "28%", width: "12%", height: "24%" } },
    { id: "ai-2", type: "worker", label: "فني الشدات - خالد", ppe: "حزام أمان: مربوط | خوذة: معتمدة", status: "safe", box: { top: "32%", left: "55%", width: "11%", height: "22%" } },
    { id: "ai-3", type: "machine", label: "الرافعة البرجية TC-01", ppe: "نطاق الدوران: آمن | حمل الرفع: 4.2 طن (65%)", status: "safe", box: { top: "15%", left: "40%", width: "20%", height: "35%" } }
  ],

  rfiSubmittals: [
    { id: "RFI-104", subject: "تعديل مسارات دكتات التكييف في ممرات الطابق 2", contractor: "المتحدة للميكانيك", date: "2023-03-20", status: "معتمد بملاحظات", priority: "high" },
    { id: "MAT-218", subject: "اعتماد عينات رخام الواجهات والجرانيت للأرضيات", contractor: "العامة للتشطيبات", date: "2023-03-22", status: "معتمد بالكامل", priority: "medium" },
    { id: "EIR-089", subject: "طلب فحص حديد تسليح سقف الطابق الرابع قبل الصب", contractor: "البناء الحديث", date: "2023-03-24", status: "جاري المعاينة الميدانية", priority: "urgent" }
  ],

  translations: {
    ar: {
      siteTitle: "مركز شفافية البناء",
      searchPlaceholder: "البحث في التقارير والمعالم...",
      monthlyReports: "التقارير الشهرية",
      evolutionMilestones: "معالم التطور",
      liveBroadcast: "البث المباشر",
      budgetBreakdown: "هيكل الموازنة",
      budgetSubtext: "التماسك الصندوق والتكلفة",
      completedFloors: "الأدوار المكتملة",
      floorsCompletedBadge: "الأدوار المكتملة",
      floorsInProgressBadge: "الأدوار قيد الإنجاز",
      floorsDoneCount: "طوابق منجزة",
      finishingStages: "مراحل التشطيب",
      weatherTitle: "حالة الطقس",
      upcomingMilestones: "المعالم القادمة",
      transparencyMetrics: "مؤشرات الشفافية",
      completionRate: "نسبة الإنجاز الكلي",
      safetyRecord: "سجل الأمان",
      safeDays: "200 يوم سلامة",
      environmentalImpact: "تأثير البيئة",
      ecoSustainability: "الاستدامة في البيئة",
      addMilestoneBtn: "إضافة معلم",
      exportPrintBtn: "طباعة التقرير",
      vrTourBtn: "360° VR",
      timelapseBtn: "مقارنة زمنية",
      materials: "المواد",
      labor: "العمالة",
      contractors: "المقاولين",
      permits: "التراخيص"
    },
    en: {
      siteTitle: "Construction Transparency Hub",
      searchPlaceholder: "Search reports & milestones...",
      monthlyReports: "Monthly Reports",
      evolutionMilestones: "Evolution Milestones",
      liveBroadcast: "Live Stream",
      budgetBreakdown: "Budget Allocation",
      budgetSubtext: "Fund Integrity & Cost Control",
      completedFloors: "Completed Floors",
      floorsCompletedBadge: "Completed Floors",
      floorsInProgressBadge: "In-Progress Floors",
      floorsDoneCount: "Floors Done",
      finishingStages: "Finishing Stages",
      weatherTitle: "Weather Station",
      upcomingMilestones: "Upcoming Milestones",
      transparencyMetrics: "Transparency Metrics",
      completionRate: "Overall Completion Rate",
      safetyRecord: "Safety Record",
      safeDays: "200 Safe Days",
      environmentalImpact: "Environmental Impact",
      ecoSustainability: "Eco Sustainability",
      addMilestoneBtn: "Add Milestone",
      exportPrintBtn: "Print Report",
      vrTourBtn: "360° VR",
      timelapseBtn: "Time-Lapse",
      materials: "Materials",
      labor: "Labor",
      contractors: "Contractors",
      permits: "Permits"
    }
  },

  notifications: [
    {
      id: "notif-1",
      title: "اعتماد صب السقف الثالث",
      time: "منذ 15 دقيقة",
      type: "success",
      icon: "check-circle",
      desc: "تم اعتماد عينات الخرسانة بنجاح من مكتب الاستشاري الهندسي."
    },
    {
      id: "notif-2",
      title: "تحديث البث المباشر للرافعة",
      time: "منذ 45 دقيقة",
      type: "info",
      icon: "video",
      desc: "تمت صيانة الكاميرا 2 وإعادة تشغيل البث بدقة فائقة 4K."
    },
    {
      id: "notif-3",
      title: "إيداع دفعة المستخلص الشهري",
      time: "منذ ساعتين",
      type: "warning",
      icon: "dollar-sign",
      desc: "تمت معالجة صرف مستخلص مقاول الأعمال الكهروميكانيكية."
    }
  ]
};
