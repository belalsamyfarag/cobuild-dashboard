// Mock Data for CoBuild PropTech Construction Transparency Dashboard (Egyptian Arabic Edition)

const dashboardData = {
  projectInfo: {
    name: "برج النرجس السكني والتجاري",
    code: "CB-2023-NRG-01",
    location: "القاهرة الجديدة - التجمع الخامس، شارع التسعين الشمالي",
    client: "شركة التطوير العقاري وإدارة المشروعات",
    generalContractor: "شركة المقاولات والأعمال الهندسية المتكاملة",
    completionPercentage: 90,
    safeDays: 200,
    sustainabilityScore: "A+ (معتمد ترشيد وبناء أخضر)"
  },

  reports: [
    {
      id: "rep-01",
      title: "تقرير يناير 2023",
      month: "يناير 2023",
      year: "2023",
      size: "4.2 ميجابايت",
      date: "2023-01-31",
      summary: "تقرير الإنجاز الشهري لأعمال حفر الموقع ودك التربة وصب اللبشة المسلحة وأعمدة البدروم مع نتائج تكسير مكعبات الخرسانة.",
      status: "معتمد"
    },
    {
      id: "rep-02",
      title: "تقرير فبراير 2023",
      month: "فبراير 2023",
      year: "2023",
      size: "5.8 ميجابايت",
      date: "2023-02-28",
      summary: "استلام حديد وصب أسقف وأعمدة الدور الأرضي والأول، وتقارير السلامة الإنشائية ومطابقة تسليح حديد عز المعتمد.",
      status: "معتمد"
    },
    {
      id: "rep-03",
      title: "تقرير فبراير 2023 (المعدل)",
      month: "فبراير 2023",
      year: "2023",
      size: "6.1 ميجابايت",
      date: "2023-03-05",
      summary: "الملحق الفني متضمناً نتائج اختبارات الكور تيست ومطابقة لوحات الشوب دروينج مع تمديدات الكهرباء والسباكة.",
      status: "معتمد"
    },
    {
      id: "rep-04",
      title: "تقرير مارس 2023",
      month: "مارس 2023",
      year: "2023",
      size: "7.4 ميجابايت",
      date: "2023-03-31",
      summary: "متابعة أعمال المباني والعزل المائي، تمديد خطوط الحريق والصرف، وتركيب قطاعات الألوميتال والواجهات الزجاجية.",
      status: "معتمد"
    }
  ],

  gallery: [
    {
      id: "gal-1",
      title: "يناير",
      date: "2023-02-23",
      subtitle: "صب خرسانة سقف الدور المتكرر",
      description: "تجهيز وصب خرسانة السقف مع تشغيل مضخات الخرسانة الجاهزة وهزازات الدمك بحضور طاقم المهندسين وفريق ضبط الجودة.",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80",
      tag: "الخرسانة المسلحة"
    },
    {
      id: "gal-2",
      title: "فبراير",
      date: "2023-02-15",
      subtitle: "شدات الأعمدة والونش البرجي",
      description: "اكتمال أعمال الهيكل الخرساني للأدوار السفلية وتجهيز الشدات المعدنية لرفع الأعمدة للأدوار العليا بواسطة الونش البرجي.",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80",
      tag: "الأعمدة والشدات"
    },
    {
      id: "gal-3",
      title: "مارس",
      date: "2023-03-21",
      subtitle: "الموقع العام وتشوينات المواد",
      description: "نظرة عامة للموقع توضح مسارات الأوناش وتشوينات حديد عز والأسمنت وتقدم أعمال النجارة والحدادة في كافة القطاعات.",
      imageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1000&q=80",
      tag: "الموقع العام"
    },
    {
      id: "gal-4",
      title: "الحفر والأساسات",
      date: "2023-01-10",
      subtitle: "الخرسانة العادية وعزل الرطوبة",
      description: "صورة دقيقة للمحاور الإنشائية وتمديد شبكات الصرف وتطبيق طبقات العزل المائي والبيتومين المعتمد للأساسات.",
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
      tag: "الأساسات"
    },
    {
      id: "gal-5",
      title: "حدادة التسليح",
      date: "2023-02-05",
      subtitle: "استلام حديد السقف والبسكويت",
      description: "استلام استشاري المشروع لحديد التسليح ومطابقة الأقطار والوصلات ورص البسكويت الخرساني قبل فتح إذن الصب.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      tag: "التسليح"
    }
  ],

  liveCameras: [
    {
      id: "cam-1",
      name: "كاميرا البرج والواجهة (HD)",
      location: "الواجهة الأمامية - البرج A",
      streamStatus: "بث مباشر - 1080p 60fps",
      bgGradient: "radial-gradient(circle at 50% 40%, #162a45 0%, #09101d 100%)"
    },
    {
      id: "cam-2",
      name: "كاميرا الونش البرجي (Tower Crane)",
      location: "مقصورة الونش العلوي",
      streamStatus: "بث مباشر - 4K 30fps",
      bgGradient: "radial-gradient(circle at 60% 30%, #1a3644 0%, #06151f 100%)"
    },
    {
      id: "cam-3",
      name: "كاميرا البوابة وتشوينات الموقع",
      location: "البوابة الرئيسية رقم 1",
      streamStatus: "بث مباشر - 1080p 30fps",
      bgGradient: "radial-gradient(circle at 40% 50%, #201e38 0%, #0d0c1c 100%)"
    },
    {
      id: "cam-4",
      name: "كاميرا صب الخرسانة المركزية",
      location: "القطاع الأوسط - الدور الثالث",
      streamStatus: "بث مباشر - 1080p 60fps",
      bgGradient: "radial-gradient(circle at 50% 50%, #142f36 0%, #081318 100%)"
    }
  ],

  budget: {
    totalBudgetSAR: 15000000,
    currency: "ج.م",
    categories: [
      { name: "المواد الخام", percentage: 30, amount: 4500000, color: "#0d9488", description: "حديد عز، أسمنت لافارج، سن ورمل وطوب أحمر" },
      { name: "المصنعيات والعمالة", percentage: 20, amount: 3000000, color: "#0284c7", description: "أجور النجارين والحدادين والبنائين والمهندسين المشرفين" },
      { name: "مقاولي الباطن", percentage: 10, amount: 1500000, color: "#f59e0b", description: "أعمال الكهرباء، السباكة، العزل، والتكييف المركزي" },
      { name: "التراخيص والاحتياطي", percentage: 40, amount: 6000000, color: "#94a3b8", description: "رسوم مجمع التراخيص، إشراف الجهاز، واحتياطي تقلبات الأسعار" }
    ]
  },

  floors: [
    {
      floorNumber: 6,
      name: "الرووف وغرفة المصاعد والخدمات",
      status: "upcoming",
      progress: 0,
      label: "مرحلة التجهيز والربط الإنشائي",
      color: "#cbd5e1"
    },
    {
      floorNumber: 5,
      name: "الدور الخامس",
      status: "in-progress",
      progress: 40,
      label: "أعمال الشدات والحدادة",
      color: "#f59e0b"
    },
    {
      floorNumber: 4,
      name: "الدور الرابع",
      status: "in-progress",
      progress: 75,
      label: "صب الأسقف والأعمدة",
      color: "#f59e0b"
    },
    {
      floorNumber: 3,
      name: "الدور الثالث",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 2,
      name: "الدور الثاني",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 1,
      name: "الدور الأول",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#10b981"
    },
    {
      floorNumber: 0,
      name: "الدور الأرضي والبدروم (الجراج)",
      status: "completed",
      progress: 100,
      label: "مكتمل بالكامل",
      color: "#0d9488"
    }
  ],

  milestonesTimeline: [
    {
      id: "stage-1",
      title: "مرحلة الهيكل الخرساني",
      status: "completed",
      date: "2023-01-15",
      desc: "اكتمال الأساسات وصب الأعمدة والأسقف الخرسانية"
    },
    {
      id: "stage-2",
      title: "مرحلة المباني والتأسيس",
      status: "active",
      date: "2023-02-20",
      desc: "جاري أعمال مباني الطوب وتأسيس السباكة والكهرباء"
    },
    {
      id: "stage-3",
      title: "مرحلة التشطيبات والواجهات",
      status: "pending",
      date: "2023-04-10",
      desc: "تركيب الواجهات الزجاجية والمصاعد والمحارة والدهانات"
    },
    {
      id: "stage-4",
      title: "مرحلة التسليم النهائي",
      status: "upcoming",
      date: "2023-06-30",
      desc: "المعاينة النهائية وتسليم الوحدات للعملاء"
    }
  ],

  progressCards: [
    {
      month: "مارس",
      date: "21-05-2023",
      summary: "الموقع العام وتجهيز أعمال المحارة والتأسيس.",
      img: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80"
    },
    {
      month: "فبراير",
      date: "11-05-2023",
      summary: "صب خرسانات الأعمدة وشدات الأسقف.",
      img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80"
    },
    {
      month: "يناير",
      date: "22-05-2023",
      summary: "اكتمال اللبشة المسلحة وأساسات البدروم.",
      img: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=400&q=80"
    }
  ],

  upcomingEvents: [
    {
      id: "ev-1",
      title: "27 مارس: استلام عزل الحمامات والأسطح",
      subtitle: "اختبار الغمر بالمياه لمدة 48 ساعة والتأكد من جودة طبقات الممبرين",
      date: "27 مارس 2023",
      status: "مجدول",
      priority: "high"
    },
    {
      id: "ev-2",
      title: "28 مارس: صب خرسانة سقف الدور الرابع",
      subtitle: "استلام حديد التسليح من الاستشاري وطلب مضخات الخرسانة الجاهزة C40",
      date: "28 مارس 2023",
      status: "قيد المراجعة",
      priority: "medium"
    },
    {
      id: "ev-3",
      title: "30 مارس: اختبار ضغط شبكة السباكة ومواسير الصرف",
      subtitle: "كبس خطوط التغذية وفحص غرف التفتيش والتأكد من مطابقة الكود المصري",
      date: "30 مارس 2023",
      status: "معتمد",
      priority: "high"
    }
  ],

  weather: {
    currentTemp: 20,
    condition: "مشمس ومناسب للعمل",
    conditionEn: "Sunny & Optimal",
    advice: "طقس مثالي لأعمال الصب وتشغيل الأوناش البرجية",
    windSpeed: "14 كم/س (آمنة تماماً للأوناش)",
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
    { id: "sens-1", name: "مستشعر إماهة ونضج الخرسانة (سقف الدور 3)", value: "28.4° مئوية", status: "optimal", desc: "درجة حرارة الشك طبيعية - المقاومة الحالية 36 ميجاباسكال" },
    { id: "sens-2", name: "حساس ميل واتزان الونش البرجي", value: "0.18°", status: "optimal", desc: "ضمن الحدود الآمنة المسموحة كودياً (< 0.5°)" },
    { id: "sens-3", name: "مستوى الضوضاء البيئية بالموقع", value: "68 ديسيبل", status: "normal", desc: "مطابق للاشتراطات واللوائح البلدية للمناطق السكنية" },
    { id: "sens-4", name: "مؤشر نقاوة الهواء والغبار", value: "18 ميكروجرام/م³", status: "optimal", desc: "رش المياه مستمر للحد من انبعاثات الأتربة والغبار" }
  ],

  floorBimDetails: {
    0: {
      name: "الدور الأرضي والبدروم (الجراج)",
      concreteTest: "42 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%",
      mepStatus: "تمديدات السباكة والكهرباء منجزة بنسبة 100%",
      finishingStatus: "أرضيات خرسانة هليكوبتر وإيبوكسي وعزل رطوبة معتمد",
      snagItems: ["فحص مصارف تصريف الأمطار", "اعتماد لوحات التوزيع وقواطع الكهرباء الرئيسية"],
      engineerApproval: "معتمد بالكامل من الاستشاري المشرف على المشروع"
    },
    1: {
      name: "الدور الأول (تجاري / إداري)",
      concreteTest: "38.5 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%",
      mepStatus: "دكتات التكييف المركزي وشبكة الحريق منجزة بنسبة 95%",
      finishingStatus: "أعمال قواطع الجبس بورد وتركيب قطاعات الواجهات الزجاجية",
      snagItems: ["معاينة مخارج وأبواب الطوارئ المقاومة للحريق", "اختبار ضغط شبكة مكافحة الحريق"],
      engineerApproval: "معتمد - تم إصدار شهادة استلام المرحلة"
    },
    2: {
      name: "الدور الثاني (سكني)",
      concreteTest: "39.1 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%",
      mepStatus: "تمديدات تغذية المياه والصرف وخراطيم الكهرباء منجزة بنسبة 90%",
      finishingStatus: "اكتمال بؤج وأوتار المحارة والطرطشة والدهانات التأسيسية",
      snagItems: ["فحص ميول تصريف مياه البلكونات", "استلام شرب وعُلب الكهرباء من الاستشاري"],
      engineerApproval: "معتمد من استشاري المشروع"
    },
    3: {
      name: "الدور الثالث (سكني)",
      concreteTest: "37.8 ميجاباسكال (المطلوب: 35 ميجاباسكال) - ناجح بنسبة 100%",
      mepStatus: "تمديدات شبكة الكهرباء ومواسير التغذية منجزة بنسبة 85%",
      finishingStatus: "بدء أعمال مباني الطوب المصمت والمفرغ والطرطشة",
      snagItems: ["استلام شبكات الإنذار المبكر", "مطابقة العوازل الحرارية والصوتية للواجهات"],
      engineerApproval: "معتمد جزئياً - جاري فحص أعمال التمديدات"
    },
    4: {
      name: "الدور الرابع (قيد التنفيذ)",
      concreteTest: "جاري انتظار نتيجة كسر مكعبات الخرسانة لعمر 28 يوم",
      mepStatus: "تأسيس مسارات الجلب والفتحات الإنشائية (Sleeves) بالكمرات",
      finishingStatus: "مرحلة صب الأعمدة والكمرات الخرسانية",
      snagItems: ["فحص وزنة وشاقولية الأعمدة", "استلام حديد التسليح للسقف قبل الصب"],
      engineerApproval: "قيد المتابعة الميدانية"
    },
    5: {
      name: "الدور الخامس (أعمال الشدات)",
      concreteTest: "لم يتم الصب بعد - تم اعتماد تصميم الخلطة الخرسانية C40",
      mepStatus: "مراجعة لوحات الشوب دروينج للميكانيكا والكهرباء",
      finishingStatus: "تركيب السقالات والشدات المعدنية والخشبية",
      snagItems: ["مطابقة قطاعات وتخانة الكمرات الساقطة", "فحص البسكويت الخرساني والتخانة"],
      engineerApproval: "مجدول للاستلام الميداني خلال 3 أيام"
    },
    6: {
      name: "الرووف وغرفة المصاعد والخدمات",
      concreteTest: "مرحلة التجهيز والربط الإنشائي",
      mepStatus: "تأسيس قواعد غرف التكييف المركزية ومصاعد الركاب",
      finishingStatus: "لم تبدأ بعد",
      snagItems: ["اعتماد عينات ومواصفات عزل السطح المائي والحراري المزدوج"],
      engineerApproval: "مخطط للتنفيذ ضمن الربع القادم"
    }
  },

  budgetLedger: [
    { id: "inv-101", category: "المواد الخام", item: "توريد حديد تسليح عز (أقطار مختلفة مشرشر)", amount: "1,850,000 ج.م", supplier: "مجموعة حديد عز", date: "2023-01-12", status: "مدفوع" },
    { id: "inv-102", category: "المواد الخام", item: "خرسانة جاهزة مقاومة للكبريتات والسيول (C40)", amount: "2,650,000 ج.م", supplier: "الشركة المصرية للخرسانة الجاهزة", date: "2023-02-04", status: "مدفوع" },
    { id: "inv-103", category: "المصنعيات والعمالة", item: "مصنعيات فرق النجارة المسلحة والحدادة والصب", amount: "1,900,000 ج.م", supplier: "إدارة العمليات والتنفيذ الميداني", date: "2023-02-28", status: "مدفوع" },
    { id: "inv-104", category: "المصنعيات والعمالة", item: "رواتب ومكافآت الطاقم الهندسي وضبط الجودة", amount: "1,100,000 ج.م", supplier: "الإدارة الهندسية والمكتب الفني", date: "2023-03-01", status: "مدفوع" },
    { id: "inv-105", category: "مقاولي الباطن", item: "مقاول دكتات التكييف والتهوية ومكافحة الحريق", amount: "850,000 ج.م", supplier: "المصرية للأعمال الكهروميكانيكية", date: "2023-03-15", status: "معتمد للصرف" },
    { id: "inv-106", category: "مقاولي الباطن", item: "دفعة مقدمة لتوريد وتركيب مصاعد الركاب والخدمات", amount: "650,000 ج.م", supplier: "شركة شندلر للمصاعد مصر", date: "2023-03-20", status: "دفعة مقدمة" },
    { id: "inv-107", category: "التراخيص والاحتياطي", item: "رسوم تراخيص الحفر والبناء والدفاع المدني والإشراف", amount: "1,200,000 ج.م", supplier: "جهاز تنمية القاهرة الجديدة", date: "2023-01-05", status: "مدفوع" },
    { id: "inv-108", category: "التراخيص والاحتياطي", item: "احتياطي الطوارئ ومخصص فروق أسعار الخامات", amount: "4,800,000 ج.م", supplier: "حساب الضمان البنكي للمشروع", date: "2023-03-30", status: "محجوز بنكياً" }
  ],

  droneSurvey: {
    lastFlightDate: "2023-03-24",
    resolution: "0.8 سم/بكسل (دقة فائقة GSD)",
    totalAreaM2: 12500,
    droneModel: "درون مساحي DJI Matrice 300 RTK + كاميرا Zenmuse P1",
    orthoImageUrl: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    thermalImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    elevationStats: "منسوب قاع الحفر: -12.40م | أعلى منسوب بالهيكل: +28.60م"
  },

  aiSafetyDetections: [
    { id: "ai-1", type: "worker", label: "مهندس الموقع - أحمد مصطفى", ppe: "خوذة الأمان: معتمدة ✓ | سترة فسفورية: معتمدة ✓ | حذاء سيفتي: معتمد ✓", status: "safe", box: { top: "35%", left: "28%", width: "12%", height: "24%" } },
    { id: "ai-2", type: "worker", label: "فني الشدات - خالد إبراهيم", ppe: "حزام الأمان (لايف لاين): مربوط ومثبت ✓ | خوذة: معتمدة ✓", status: "safe", box: { top: "32%", left: "55%", width: "11%", height: "22%" } },
    { id: "ai-3", type: "machine", label: "الونش البرجي (Tower Crane TC-01)", ppe: "دائرة الدوران: آمنة وخالية من العوائق ✓ | حمل الرفع: 4.2 طن (65% من السعة)", status: "safe", box: { top: "15%", left: "40%", width: "20%", height: "35%" } }
  ],

  rfiSubmittals: [
    { id: "RFI-104", subject: "تعديل مسارات دكتات التكييف لتفادي سقوط الكمرات بممرات الدور الثاني", contractor: "المصرية للأعمال الكهروميكانيكية", date: "2023-03-20", status: "معتمد بملاحظات", priority: "high" },
    { id: "MAT-218", subject: "اعتماد عينات رخام المداخل وكسوة الواجهات وسيراميك الحمامات المعتمد", contractor: "شركة الدلتا للتشطيبات والمقاولات", date: "2023-03-22", status: "معتمد بالكامل", priority: "medium" },
    { id: "EIR-089", subject: "طلب استلام حديد تسليح سقف الدور الرابع قبل فتح إذن الصب الخرساني", contractor: "شركة البناء الحديث للمقاولات", date: "2023-03-24", status: "جاري المعاينة الميدانية", priority: "urgent" }
  ],

  translations: {
    ar: {
      siteTitle: "مركز شفافية البناء",
      searchPlaceholder: "البحث في التقارير والمهام ومستخلصات الموقع...",
      monthlyReports: "التقارير الشهرية",
      evolutionMilestones: "تطور الموقع ومراحل البناء",
      liveBroadcast: "البث المباشر",
      budgetBreakdown: "توزيع الميزانية والتكاليف",
      budgetSubtext: "المصروفات الفعلية والتحكم في التكلفة",
      completedFloors: "الأدوار المكتملة",
      floorsCompletedBadge: "أدوار تم صبها وتشطيبها",
      floorsInProgressBadge: "أدوار تحت التنفيذ",
      floorsDoneCount: "أدوار منتهية",
      finishingStages: "مراحل التنفيذ والتشطيب",
      weatherTitle: "حالة الطقس بالموقع",
      upcomingMilestones: "المهام والتسليمات القادمة",
      transparencyMetrics: "مؤشرات الجودة والسلامة",
      completionRate: "نسبة الإنجاز الكلية للمشروع",
      safetyRecord: "سجل السلامة المهنية",
      safeDays: "200 يوم بدون إصابات",
      environmentalImpact: "التوافق البيئي والاستدامة",
      ecoSustainability: "معتمد وفق اشتراطات البناء الأخضر",
      addMilestoneBtn: "إضافة مهمة جديدة",
      exportPrintBtn: "طباعة التقرير التنفيذي",
      vrTourBtn: "360° جولة افتراضية",
      timelapseBtn: "مقارنة زمنية",
      materials: "المواد الخام",
      labor: "المصنعيات والعمالة",
      contractors: "مقاولي الباطن",
      permits: "التراخيص والاحتياطي"
    },
    en: {
      siteTitle: "Construction Transparency Hub",
      searchPlaceholder: "Search reports, milestones & invoices...",
      monthlyReports: "Monthly Reports",
      evolutionMilestones: "Evolution Milestones",
      liveBroadcast: "Live Stream",
      budgetBreakdown: "Budget Allocation",
      budgetSubtext: "Cost Control & Expenditure Ledger",
      completedFloors: "Completed Floors",
      floorsCompletedBadge: "Completed Floors",
      floorsInProgressBadge: "In-Progress Floors",
      floorsDoneCount: "Floors Done",
      finishingStages: "Execution Stages",
      weatherTitle: "Site Weather Station",
      upcomingMilestones: "Upcoming Milestones",
      transparencyMetrics: "Quality & Safety Metrics",
      completionRate: "Overall Completion Rate",
      safetyRecord: "Safety Record",
      safeDays: "200 Safe Days",
      environmentalImpact: "Environmental Sustainability",
      ecoSustainability: "Green Building Certified",
      addMilestoneBtn: "Add Milestone",
      exportPrintBtn: "Print Report",
      vrTourBtn: "360° VR",
      timelapseBtn: "Time-Lapse",
      materials: "Raw Materials",
      labor: "Labor & Workmanship",
      contractors: "Subcontractors",
      permits: "Permits & Contingency"
    }
  },

  notifications: [
    {
      id: "notif-1",
      title: "اعتماد صب سقف الدور الثالث",
      time: "منذ 15 دقيقة",
      type: "success",
      icon: "check-circle",
      desc: "تم اعتماد عينات كسر مكعبات الخرسانة بنجاح من الاستشاري الهندسي."
    },
    {
      id: "notif-2",
      title: "تحديث كاميرا الونش البرجي",
      time: "منذ 45 دقيقة",
      type: "info",
      icon: "video",
      desc: "تمت صيانة الكاميرا رقم 2 وإعادة تشغيل البث المباشر بدقة 4K."
    },
    {
      id: "notif-3",
      title: "صرف مستخلص الأعمال الكهروميكانيكية",
      time: "منذ ساعتين",
      type: "warning",
      icon: "dollar-sign",
      desc: "تم اعتماد وصرف مستخلص مقاول أعمال الكهرباء والتكييف والحريق."
    }
  ]
};
