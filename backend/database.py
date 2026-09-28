# CoBuild PropTech - SQLite Database & Models (Co-Development / Crowd-Building Platform)
import sqlite3
import json
import os
import time

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cobuild.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed=False):
    conn = get_connection()
    cursor = conn.cursor()

    if force_reseed:
        cursor.execute("DROP TABLE IF EXISTS projects")
        cursor.execute("DROP TABLE IF EXISTS reports")
        cursor.execute("DROP TABLE IF EXISTS milestones")
        cursor.execute("DROP TABLE IF EXISTS floor_inspections")
        cursor.execute("DROP TABLE IF EXISTS budget_invoices")
        cursor.execute("DROP TABLE IF EXISTS iot_telemetry")
        cursor.execute("DROP TABLE IF EXISTS rfis")
        cursor.execute("DROP TABLE IF EXISTS units")
        cursor.execute("DROP TABLE IF EXISTS daily_logs")
        cursor.execute("DROP TABLE IF EXISTS buyer_reservations")
        cursor.execute("DROP TABLE IF EXISTS syndicate_votes")

    # 1. Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        location TEXT,
        client TEXT,
        contractor TEXT,
        completion_pct REAL DEFAULT 90.0,
        safe_days INTEGER DEFAULT 200,
        sustainability_score TEXT DEFAULT 'A+ (معتمد ترشيد وبناء أخضر)',
        co_building_target_units INTEGER DEFAULT 12,
        co_building_reserved_units INTEGER DEFAULT 10,
        escrow_bank TEXT DEFAULT 'البنك الأهلي المصري - حساب ضمان المشروعات المشتركة رقم 492001928'
    )
    """)

    # 2. Monthly Reports Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        month TEXT,
        year TEXT,
        size TEXT,
        date TEXT,
        summary TEXT,
        status TEXT DEFAULT 'معتمد',
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 3. Milestones Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        subtitle TEXT,
        date TEXT,
        status TEXT DEFAULT 'مجدول',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 4. BIM Floor Inspections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS floor_inspections (
        floor_num INTEGER PRIMARY KEY,
        project_id TEXT,
        name TEXT,
        status TEXT,
        progress INTEGER,
        concrete_test TEXT,
        mep_status TEXT,
        finishing_status TEXT,
        snag_items TEXT,
        engineer_approval TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 5. Budget Invoices Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budget_invoices (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        category TEXT,
        item TEXT,
        amount TEXT,
        amount_num REAL,
        supplier TEXT,
        date TEXT,
        status TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 6. IoT Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS iot_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        concrete_temp REAL,
        crane_tilt REAL,
        noise_db REAL,
        air_quality_aqi INTEGER
    )
    """)

    # 7. RFIs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rfis (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        subject TEXT,
        contractor TEXT,
        date TEXT,
        status TEXT,
        priority TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 8. Units Table (Apartments for Co-development / Crowd-building)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS units (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        unit_num TEXT NOT NULL,
        floor_num INTEGER NOT NULL,
        area_sqm INTEGER NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        price_egp REAL NOT NULL,
        market_price_egp REAL NOT NULL,
        status TEXT DEFAULT 'available', -- 'available', 'reserved', 'sold'
        buyer_name TEXT,
        completion_pct REAL DEFAULT 0.0,
        facade TEXT,
        floorplan_desc TEXT,
        features TEXT,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 9. Daily Logs Table (Day-by-Day Construction Diary)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS daily_logs (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        date TEXT NOT NULL,
        day_name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        workforce_count INTEGER DEFAULT 18,
        engineer_name TEXT NOT NULL,
        weather TEXT NOT NULL,
        concrete_test TEXT,
        stage TEXT NOT NULL,
        photos_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 10. Buyer Reservations Table (My Unit & Milestone Payment Schedule)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS buyer_reservations (
        id TEXT PRIMARY KEY,
        unit_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        buyer_email TEXT,
        total_price REAL NOT NULL,
        market_price REAL NOT NULL,
        savings_amount REAL NOT NULL,
        paid_amount REAL NOT NULL,
        next_milestone TEXT NOT NULL,
        next_amount REAL NOT NULL,
        contract_status TEXT DEFAULT 'معتمد وموثق',
        escrow_account_num TEXT NOT NULL,
        reservation_date TEXT NOT NULL,
        payment_schedule_json TEXT,
        FOREIGN KEY (unit_id) REFERENCES units (id),
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # 11. Syndicate Votes Table (Co-Owner Decisions & Governance)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS syndicate_votes (
        id TEXT PRIMARY KEY,
        project_id TEXT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        deadline TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        options_json TEXT NOT NULL,
        total_votes INTEGER DEFAULT 0,
        FOREIGN KEY (project_id) REFERENCES projects (id)
    )
    """)

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        seed_data(cursor)
    else:
        # Check if units table is seeded
        cursor.execute("SELECT COUNT(*) FROM units")
        if cursor.fetchone()[0] == 0:
            seed_co_development_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    # Seed Project
    cursor.execute("""
    INSERT INTO projects (id, name, code, location, client, contractor, completion_pct, safe_days, sustainability_score, co_building_target_units, co_building_reserved_units, escrow_bank)
    VALUES ('CB-2023-NRG-01', 'برج النرجس التشاركي (اتحاد الملاك الذكي)', 'CB-2023-NRG-01', 'القاهرة الجديدة - التجمع الخامس، النرجس الجديدة عمارة 14B', 'اتحاد ملاك النرجس التشاركي (إدارة CoBuild)', 'المصرية للإنشاءات الهندسية وضبط الجودة', 78.5, 214, 'A+ (معتمد ترشيد وبناء أخضر)', 12, 10, 'البنك الأهلي المصري - حساب ضمان المشروعات المشتركة رقم 492001928')
    """)

    # Seed Reports
    reports = [
        ('rep-01', 'CB-2023-NRG-01', 'تقرير يناير 2023', 'يناير 2023', '2023', '4.2 ميجابايت', '2023-01-31', 'تقرير الإنجاز الشهري لأعمال حفر الموقع ودك التربة وصب اللبشة المسلحة وأعمدة البدروم مع نتائج تكسير مكعبات الخرسانة.', 'معتمد'),
        ('rep-02', 'CB-2023-NRG-01', 'تقرير فبراير 2023', 'فبراير 2023', '2023', '5.8 ميجابايت', '2023-02-28', 'استلام حديد وصب أسقف وأعمدة الدور الأرضي والأول، وتقارير السلامة الإنشائية ومطابقة تسليح حديد عز المعتمد.', 'معتمد'),
        ('rep-03', 'CB-2023-NRG-01', 'تقرير مارس 2023', 'مارس 2023', '2023', '6.1 ميجابايت', '2023-03-31', 'الملحق الفني متضمناً نتائج اختبارات الكور تيست ومطابقة لوحات الشوب دروينج مع تمديدات الكهرباء والسباكة.', 'معتمد'),
        ('rep-04', 'CB-2023-NRG-01', 'تقرير إبريل 2023', 'إبريل 2023', '2023', '7.4 ميجابايت', '2023-04-30', 'متابعة أعمال المباني والعزل المائي، تمديد خطوط الحريق والصرف، وتركيب قطاعات الألوميتال والواجهات الزجاجية.', 'معتمد')
    ]
    cursor.executemany("INSERT INTO reports VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", reports)

    # Seed Milestones
    milestones = [
        ('ev-1', 'CB-2023-NRG-01', '28 سبتمبر: صب خرسانة سقف الدور الرابع C40', 'استلام حديد التسليح من الاستشاري المشرف وتشغيل مضخة 42 متر', '28 سبتمبر 2026', 'جاري التنفيذ اليوم', 'urgent', '2026-09-28 08:00:00'),
        ('ev-2', 'CB-2023-NRG-01', '30 سبتمبر: فحص تمديدات السباكة واختبار الضغط بالدور الثالث', 'كبس شبكة التغذية على 12 بار وفحص غرف التفتيش والعوازل', '30 سبتمبر 2026', 'مجدول', 'high', '2026-09-28 09:00:00'),
        ('ev-3', 'CB-2023-NRG-01', '03 أكتوبر: بدء بناء جدران الدور الرابع (طوب مصمت ومفرغ)', 'توريد 25 ألف طوبة معتمدة وبدء أعمال البؤج والأوتار والطرطشة', '03 أكتوبر 2026', 'مجدول', 'medium', '2026-09-28 10:00:00')
    ]
    cursor.executemany("INSERT INTO milestones VALUES (?, ?, ?, ?, ?, ?, ?, ?)", milestones)

    # Seed Floors
    floors = [
        (0, 'CB-2023-NRG-01', 'البدروم والجراج وغرف الخدمات', 'completed', 100, '42 ميجاباسكال (ناجح بنسبة 100%)', 'تمديدات السباكة والكهرباء 100%', 'أرضيات خرسانة هليكوبتر وإيبوكسي معتمد', json.dumps(["فحص مصارف تصريف الأمطار", "اعتماد لوحات التوزيع وقواطع الكهرباء الرئيسية"]), 'معتمد بالكامل من الاستشاري المشرف'),
        (1, 'CB-2023-NRG-01', 'الدور الأرضي (مدخل فندقي + شقتين بحديقة)', 'completed', 100, '39.5 ميجاباسكال (ناجح بنسبة 100%)', 'تمديدات السباكة والكهرباء 95%', 'محارة وبؤج وأوتار جاهزة للدهان', json.dumps(["معاينة مخارج وأبواب الطوارئ", "اختبار ضغط شبكة التغذية"]), 'معتمد - شهادة استلام المرحلة صادرة'),
        (2, 'CB-2023-NRG-01', 'الدور الأول (شقتين سكنيتين)', 'completed', 100, '38.8 ميجاباسكال (ناجح بنسبة 100%)', 'تمديدات الكهرباء والسباكة 90%', 'اكتمال أعمال المباني والطرطشة', json.dumps(["فحص ميول تصريف مياه البلكونات", "استلام شرب الكهرباء"]), 'معتمد من استشاري المشروع'),
        (3, 'CB-2023-NRG-01', 'الدور الثاني (شقتين سكنيتين)', 'completed', 100, '38.0 ميجاباسكال (ناجح بنسبة 100%)', 'تمديدات خراطيم الكهرباء والصرف 85%', 'أعمال مباني الطوب والطرطشة', json.dumps(["مطابقة قطاعات الألوميتال مع فتحات الحوائط"]), 'معتمد - جاري متابعة التشطيب الداخلي'),
        (4, 'CB-2023-NRG-01', 'الدور الثالث (شقتين سكنيتين - شقة 302)', 'completed', 95, '37.5 ميجاباسكال (ناجح بنسبة 100%)', 'تأسيس مواسير التغذية والكهرباء 80%', 'بدء أعمال المحارة والتأسيس الداخلي', json.dumps(["فحص سمك طبقة اللياسة والمحارة", "تأكيد عوازل الحمامات"]), 'معتمد مع متابعة الملاحظات'),
        (5, 'CB-2023-NRG-01', 'الدور الرابع (قيد التنفيذ - صب السقف اليوم)', 'in-progress', 70, 'جاري انتظار اختبار كسر 7 أيام للخرسانة الجاهزة C40', 'تأسيس الجلب والمواسير داخل الكمرات والسقف', 'مرحلة صب السقف الخرساني والأعمدة', json.dumps(["فحص وزنة وشاقولية الشدات المعدنية", "استلام حديد التسليح من الاستشاري قبل الصب"]), 'قيد التنفيذ الميداني المباشر'),
        (6, 'CB-2023-NRG-01', 'الرووف والحديقة المعلقة وخدمات الملاك', 'upcoming', 15, 'مرحلة التجهيز والربط الإنشائي', 'تأسيس مسارات المصعد وغرفة الحراسة والطاقة الشمسية', 'لم تبدأ بعد', json.dumps(["اعتماد عينات العزل الحراري والمائي المزدوج (فوم وبولي يوريثان)"]), 'مخطط للتنفيذ الشهر القادم')
    ]
    cursor.executemany("INSERT INTO floor_inspections VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", floors)

    # Seed Invoices
    invoices = [
        ('inv-101', 'CB-2023-NRG-01', 'المواد الخام', 'توريد 45 طن حديد تسليح عز أقطار 12، 16، 18 مم', '1,890,000 ج.م', 1890000, 'مجموعة حديد عز المعتمدة', '2026-09-12', 'مدفوع من حساب الضمان'),
        ('inv-102', 'CB-2023-NRG-01', 'المواد الخام', 'توريد 320 م³ خرسانة جاهزة مجهدة C40 لصب الأسقف', '1,120,000 ج.م', 1120000, 'الشركة الحديثة للخرسانة الجاهزة', '2026-09-20', 'مدفوع من حساب الضمان'),
        ('inv-103', 'CB-2023-NRG-01', 'المصنعيات والعمالة', 'مصنعيات فرق النجارة المسلحة والحدادة ومضخات الصب', '680,000 ج.م', 680000, 'فريق التنفيذ والتشييد الميداني', '2026-09-25', 'مدفوع'),
        ('inv-104', 'CB-2023-NRG-01', 'الإشراف وضبط الجودة', 'أتعاب المكتب الاستشاري الهندسي واختبارات معمل الخرسانة', '140,000 ج.م', 140000, 'مكتب الاستشارات الهندسية وضبط الجودة', '2026-09-26', 'مدفوع'),
        ('inv-105', 'CB-2023-NRG-01', 'أتعاب إدارة التطوير التشاركي', 'عمولة إدارة CoBuild الشفافة للمرحلة الثالثة (10%)', '280,000 ج.م', 280000, 'منصة CoBuild PropTech للتطوير التشاركي', '2026-09-27', 'معتمد للصرف')
    ]
    cursor.executemany("INSERT INTO budget_invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", invoices)

    # Seed RFIs
    rfis = [
        ('RFI-201', 'CB-2023-NRG-01', 'تعديل مسار مزاريب المطر والتهوية لتفادي كمرات الدور الثالث', 'المصرية للإنشاءات', '2026-09-22', 'معتمد بملاحظات', 'high'),
        ('MAT-304', 'CB-2023-NRG-01', 'اعتماد عينات الطوب الأسمنتي المصمت والطفلي المفرغ للحوائط الخارجية', 'توريدات البناء الحديث', '2026-09-24', 'معتمد بالكامل', 'medium'),
        ('EIR-112', 'CB-2023-NRG-01', 'طلب استلام حديد تسليح سقف الدور الرابع قبل فتح إذن الصب اليوم', 'فريق الحدادة المسلحة', '2026-09-28', 'تم الاستلام والاعتماد للصب', 'urgent')
    ]
    cursor.executemany("INSERT INTO rfis VALUES (?, ?, ?, ?, ?, ?, ?)", rfis)

    # Seed Co-development data
    seed_co_development_data(cursor)

def seed_co_development_data(cursor):
    # 8. Seed Units
    units = [
        ('unit-101', 'CB-2023-NRG-01', '101', 1, 140, 3, 2, 1250000, 1900000, 'reserved', 'د. أحمد عبد الرحمن', 100.0, 'واجهة بحرية مع حديقة خاصة 60م', '3 غرف + ريسيبشن 3 قطع + حديقة', 'حديقة خاصة، مدخل خاص، جراج تحت الأرض'),
        ('unit-102', 'CB-2023-NRG-01', '102', 1, 135, 2, 2, 1180000, 1800000, 'reserved', 'م. سارة كمال', 100.0, 'واجهة قبلية على مساحة خضراء', 'غرفتين ماستر + ريسيبشن قطعتين + تراس', 'غرفة ملابس ماستر، حديقة جانبية 45م'),
        ('unit-201', 'CB-2023-NRG-01', '201', 2, 160, 3, 2, 1400000, 2150000, 'reserved', 'أ. كريم محمود', 95.0, 'واجهة بحرية شرقية ناصية صريحة', '3 غرف نوم + ليفنج مستقل + 2 حمام', 'ناصية بحري، تراس عريض 12م، جراج مخصص'),
        ('unit-202', 'CB-2023-NRG-01', '202', 2, 155, 3, 2, 1370000, 2100000, 'reserved', 'د. منى الشاذلي', 95.0, 'واجهة غربية بحرية', '3 غرف نوم + مطبخ أمريكي + ريسيبشن', 'إطلالة مفتوحة على الشارع الرئيسي'),
        ('unit-301', 'CB-2023-NRG-01', '301', 3, 165, 3, 3, 1470000, 2250000, 'reserved', 'م. شريف عادل', 90.0, 'واجهة بحرية تطل على ميدان وحديقة', '3 غرف نوم (منهم ماستر بدريسنج) + 3 حمامات', 'دريسنج روم، حمام ضيوف منفصل، بلكونة رئيسية'),
        ('unit-302', 'CB-2023-NRG-01', '302', 3, 165, 3, 3, 1450000, 2200000, 'reserved', 'أ. بلال فاروق (حساب المشتري التجريبي)', 85.0, 'واجهة بحرية مميزة غير مجروحة', '3 غرف نوم + ريسيبشن واسع + مطبخ كبير + 3 حمامات', 'توفير 750,000 ج.م بسعر التكلفة التشاركية، جراج خاص'),
        ('unit-401', 'CB-2023-NRG-01', '401', 4, 170, 3, 3, 1500000, 2300000, 'reserved', 'مستثمر تشاركي - م. إيهاب', 70.0, 'واجهة بحرية شرقية', '3 غرف نوم + ريسيبشن 3 قطع + تراس بانوراما', 'بانوراما زجاجية، حصة في الأرض والرووف'),
        ('unit-402', 'CB-2023-NRG-01', '402', 4, 170, 3, 3, 1490000, 2280000, 'reserved', 'أ. وائل القاضي', 70.0, 'واجهة بحرية غربية', '3 غرف نوم + مطبخ كبير + 2 بلكونة', 'تصميم مودرن، نظام تكييف مركزي مجهز'),
        ('unit-501', 'CB-2023-NRG-01', '501', 5, 180, 4, 3, 1600000, 2450000, 'available', None, 40.0, 'واجهة بحرية عليا بانورامية', '4 غرف نوم + ليفنج مستقل + 3 حمامات', 'فرصة تشاركية متبقية: توفير 850,000 ج.م عن سعر السوق!'),
        ('unit-502', 'CB-2023-NRG-01', '502', 5, 180, 4, 3, 1600000, 2450000, 'available', None, 40.0, 'واجهة بحرية غربية بانورامية', '4 غرف نوم + ريسيبشن كبير + تراس واسع', 'فرصة تشاركية متبقية: توفير 850,000 ج.م، تمويل مرحلي'),
        ('unit-601', 'CB-2023-NRG-01', 'بنتهاوس 1', 6, 220, 3, 3, 1950000, 3100000, 'reserved', 'د. حازم القاضي', 25.0, 'رووف بانوراما 360 درجة مع حديقة معلقة', '3 غرف نوم + روف جاردن 90م + جاكوزي خارجي', 'حديقة رووف خاصة، إطلالة مفتوحة على التجمع الخامس'),
        ('unit-602', 'CB-2023-NRG-01', 'بنتهاوس 2', 6, 210, 3, 3, 1890000, 2980000, 'reserved', 'م. تامر فريد', 25.0, 'رووف بانوراما بحري مع تراس مشمس', '3 غرف نوم + روف جاردن 80م + منطقة شواء', 'حديقة رووف، مساحة شواء، عزل مزدوج معتمد')
    ]
    cursor.executemany("INSERT INTO units VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", units)

    # 9. Seed Daily Logs (Day-by-Day construction journal)
    daily_logs = [
        (
            'log-2026-09-28',
            'CB-2023-NRG-01',
            '2026-09-28',
            'الإثنين',
            'صب خرسانة سقف الدور الرابع C40 وتشغيل المضخة 42 متر واستلام تسليح الاستشاري',
            'بدأ العمل في تمام الساعة 7:00 صباحاً بتجهيز الموقع ووصول مضخة الخرسانة 42م و3 سيارات خرسانة جاهزة من محطة الخلط المعتمدة. تم عمل اختبار الهبوط (Slump Test) لكل سيارة بمعدل 12 سم ودرجة حرارة 27° مئوية وهي مطابقة تماماً للمواصفات. تم الانتهاء من صب 65% من مسطح السقف حتى الآن وجاري استخدام الهزازات الميكانيكية لضمان عدم وجود أي تعشيش. حضور طاقم المهندس الاستشاري المشرف وتسجيل شهادة الصب بالدفتر.',
            26,
            'م. حسام الشربيني (مهندس التنفيذ وضبط الجودة)',
            '27°C - مشمس ومعتدل، رياح هادئة مناسبة لأعمال الصب',
            'اختبار الهبوط Slump: 12 سم (ناجح) | أخذ 6 مكعبات خرسانية لاختبار الكسر عند 7 و 28 يوماً',
            'الهيكل الخرساني - سقف الدور الرابع',
            json.dumps([
                {"title": "وصول مضخة الخرسانة وبدء الصب", "time": "08:15 ص", "caption": "مضخة 42 متر تعمل بكفاءة على سقف الدور الرابع"},
                {"title": "فحص شاقولية الشدة واستلام الحديد", "time": "09:30 ص", "caption": "تسليح حديد عز قطر 16 و18 مم طبقاً للمخطط المعتمد"},
                {"title": "اختبار الهبوط Slump Test في الموقع", "time": "11:00 ص", "caption": "قوام الخرسانة متجانس ومطابق تماماً للمواصفات"}
            ])
        ),
        (
            'log-2026-09-27',
            'CB-2023-NRG-01',
            '2026-09-27',
            'الأحد',
            'استكمال نجارة وحدادة سقف الدور الرابع وتركيب علب الكهرباء والجرابات بالكمرات',
            'قام فريق الحدادة المسلحة بإنهاء فرش وغطاء حديد السقف للباكيات الرئيسية بالدور الرابع، وقام مقاول الكهرباء بتمديد خراطيم ومواسير الإنارة وعلب الماجيك وتثبيتها بشكل آمن. كما تم تدعيم الشدات الخشبية والمعدنية بالقوائم الإضافية والتأكد من وزنة الليزر للأركان. تم حجز موعد سيارات الخرسانة للغد صباحاً.',
            22,
            'م. حسام الشربيني (مهندس التنفيذ)',
            '28°C - صافٍ ومعتدل',
            'تم فحص البسكويت الخرساني لضمان سمك الغطاء الخرساني (Cover 2.5 سم)',
            'النجارة والحدادة وتمديدات الكهرباء',
            json.dumps([
                {"title": "تمديد شبكة خراطيم الكهرباء بالسقف", "time": "10:00 ص", "caption": "توزيع مسارات الإنارة واللوحات الفرعية"},
                {"title": "تقوية الشدات المعدنية بالبدروم والأرضي", "time": "02:30 م", "caption": "فحص وزنة القوائم المعدنية وركائز الأمان"}
            ])
        ),
        (
            'log-2026-09-26',
            'CB-2023-NRG-01',
            '2026-09-26',
            'السبت',
            'توريد 22 طن حديد تسليح عز وفحص عزل الرطوبة بالدور الثالث',
            'تم استلام دفعة جديدة من حديد التسليح مشرشر عالي المقاومة (عز الدخيلة) بأقطار 16 و 12 مم مع شهادات المنشأ والاختبار، وتم تفريغها وتخزينها على قوائم خشبية لمنع الرطوبة. في نفس اليوم، استكمل مقاول العزل اختبار الغمر بالمياه لحمامات الدور الثالث لمدة 48 ساعة دون رصد أي تسريب أو رشح.',
            18,
            'م. خالد البدري (مهندس الموقع والمكتب الفني)',
            '29°C - مشمس',
            'اختبار الغمر المائي لحمامات الدور الثالث: ناجح 100%',
            'التوريدات والعزل المائي',
            json.dumps([
                {"title": "تفريغ شحنة حديد التسليح", "time": "09:00 ص", "caption": "مطابقة قطر وتخانات الحديد مع الفاتورة المعتمدة"},
                {"title": "معاينة اختبار العزل المائي بالدور الثالث", "time": "01:15 م", "caption": "طبقات الممبرين 4 مم معالجة بالبيتومين الساخن"}
            ])
        ),
        (
            'log-2026-09-25',
            'CB-2023-NRG-01',
            '2026-09-25',
            'الجمعة',
            'أعمال صيانة ومعايرة الرافعة البرجية ورش الخرسانة بالمياه (Curing)',
            'إجازة العمالة الميدانية مع استمرار أعمال المعالجة المائية (رش الخرسانات للأعمدة والأسقف المصبوبة بمعدل 3 مرات يومياً بواسطة خفير الموقع). تمت الصيانة الدورية لموتور الرافعة البرجية وفحص حساسات الميل والرياح لضمان أعلى معايير السلامة المهنية.',
            4,
            'م. حسام الشربيني (مناوبة السلامة وضبط الجودة)',
            '30°C - معتدل',
            'حساس إماهة الخرسانة: 28.4°C ومعدل الرطوبة ممتاز',
            'المعالجة المائية والصيانة الدورية',
            json.dumps([
                {"title": "رش الأعمدة بالمياه وتغطيتها بالخيش", "time": "07:30 ص", "caption": "معالجة الخرسانة لضمان الوصول لأقصى إجهاد كسر"},
                {"title": "معايرة حساسات الرافعة البرجية", "time": "11:45 ص", "caption": "شاقولية البرج 0.18 درجة ضمن النطاق الآمن"}
            ])
        )
    ]
    cursor.executemany("""
    INSERT INTO daily_logs (id, project_id, date, day_name, title, description, workforce_count, engineer_name, weather, concrete_test, stage, photos_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, daily_logs)

    # 10. Seed Buyer Reservation (For the buyer portal simulation: Unit 302)
    payment_schedule = [
        {"stage": "دفعة جدية الحجز والتعاقد", "amount": 290000, "percentage": "20%", "status": "مدفوعة", "date": "2026-01-15", "notes": "تم إيداعها بحساب الضمان البنكي وتوثيق العقد التشاركي"},
        {"stage": "دفعة إتمام أعمال الحفر والأساسات واللبشة", "amount": 290000, "percentage": "20%", "status": "مدفوعة", "date": "2026-03-20", "notes": "صُرفت للمقاول بعد اعتماد تقرير استشاري التربة والأساسات"},
        {"stage": "دفعة صب الهيكل حتى سقف الدور الثاني", "amount": 290000, "percentage": "20%", "status": "مدفوعة", "date": "2026-06-10", "notes": "صُرفت بعد نتائج كسر المكعبات 38 ميجاباسكال"},
        {"stage": "دفعة سقف دور شقتي (الدور الرابع) وبدء المباني", "amount": 290000, "percentage": "20%", "status": "مستحقة قريباً", "date": "2026-10-05", "notes": "تستحق بعد إتمام صب سقف الدور الرابع واعتماد الاستشاري"},
        {"stage": "دفعة أعمال المحارة والواجهات والمصاعد", "amount": 217500, "percentage": "15%", "status": "مجدولة", "date": "2027-01-15", "notes": "مربوطة باكتمال تركيب قطاعات الألوميتال والمصعد"},
        {"stage": "دفعة الاستلام النهائي والمفتاح والصك الملكي", "amount": 72500, "percentage": "5%", "status": "مجدولة", "date": "2027-04-30", "notes": "تُسدد عند المعاينة النهائية واستلام شهادة الصلاحية وتوثيق الملكية"}
    ]

    cursor.execute("""
    INSERT INTO buyer_reservations (
        id, unit_id, project_id, buyer_name, buyer_phone, buyer_email,
        total_price, market_price, savings_amount, paid_amount, next_milestone, next_amount,
        contract_status, escrow_account_num, reservation_date, payment_schedule_json
    ) VALUES (
        'RES-302-BELAL', 'unit-302', 'CB-2023-NRG-01', 'أ. بلال فاروق', '+20 100 123 4567', 'belal.buyer@cobuild.eg',
        1450000, 2200000, 750000, 870000, 'صب سقف الدور الرابع واستلام حديد المباني', 290000,
        'عقد تشاركي معتمد وموثق بالشهر العقاري وبنك الضمان', '492001928-EGP (البنك الأهلي المصري)', '2026-01-15',
        ?
    )
    """, (json.dumps(payment_schedule),))

    # 11. Seed Syndicate Votes (Co-Owner Collective Decisions)
    syndicate_votes = [
        (
            'vote-01',
            'CB-2023-NRG-01',
            'اختيار نوع وتصميم رخام المدخل الرئيسي ودرج السلم',
            'ضمن خيارات التشطيب التشاركي، يرجى من الملاك التصويت على نوع الرخام المفضل لمدخل العمارة الرئيسي لتعميده مع المورد بسعر الجملة المباشر دون أي هامش ربح إضافي.',
            'تشطيبات ومداخل',
            '2026-10-10',
            'active',
            json.dumps([
                {"id": 1, "title": "رخام كرارة إيطالي أبيض مع تطعيمات جرانيت أسود دبل بلاك وإضاءة خفية", "votes": 7, "pct": 70},
                {"id": 2, "title": "رخام تريستا بيج مصري كلاسيكي مع براويز خشبية معالجة ضد الرطوبة", "votes": 3, "pct": 30}
            ]),
            10
        ),
        (
            'vote-02',
            'CB-2023-NRG-01',
            'اعتماد نظام المراقبة الذكية والدخول بالبصمة (Smart Intercom & Access)',
            'طرحت إدارة CoBuild عرضين من كبرى شركات الأنظمة الأمنية لتركيب إنتركم مرئي وبوابات دخول بالبصمة وكروت NFC وكاميرات ذكية مرتبطة بتطبيق الموبايل لكل مالك.',
            'أنظمة وأمن',
            '2026-10-15',
            'active',
            json.dumps([
                {"id": 1, "title": "نظام هيكفيجن (Hikvision IP) مع كاميرات 4K وتطبيق للملاك للتحكم عن بُعد في البوابات", "votes": 8, "pct": 80},
                {"id": 2, "title": "نظام داهوا (Dahua Smart) مع شاشات لمس 7 بوصة داخل كل شقة", "votes": 2, "pct": 20}
            ]),
            10
        ),
        (
            'vote-03',
            'CB-2023-NRG-01',
            'استغلال وتوزيع خدمات الرووف المشترك (Co-Living Roof Garden)',
            'مقترح استغلال مساحة الرووف لإنشاء منطقة جلوس عائلية، مساحة شواء، ومنطقة ألعاب أطفال خفيفة مظللة ببرجولات خشبية.',
            'الرووف والمرافق المشتركة',
            '2026-10-20',
            'active',
            json.dumps([
                {"id": 1, "title": "حديقة رووف خضراء (Roof Garden) مع برجولات خشبية ومنطقة شواء مشتركة", "votes": 9, "pct": 90},
                {"id": 2, "title": "صالة جيمانيزيوم صغيرة ومغلقة مع مساحة جلوس مكشوفة", "votes": 1, "pct": 10}
            ]),
            10
        )
    ]
    cursor.executemany("INSERT INTO syndicate_votes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", syndicate_votes)

if __name__ == "__main__":
    init_db(force_reseed=True)
    print("Database successfully initialized and seeded with Co-Development & Day-by-Day dataset.")
