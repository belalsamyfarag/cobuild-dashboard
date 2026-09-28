# CoBuild PropTech — مركز شفافية البناء
> **Modern Construction Transparency & PropTech Web Platform**

A high-fidelity, interactive, modern Arabic (RTL) & English (LTR) PropTech web dashboard built to provide full transparency into construction project progress, financials, site telemetry, BIM floors, and live site streams.

---

## 📸 Key Features & Modules

### 1. Header & Quick Controls
- **Brand Identity**: CoBuild PropTech with 3D isometric building cube icon.
- **Multi-Project Switcher**: Switch between active projects (*Riyadh - Al-Yasmin Tower, Jeddah - Al-Narjis, Khobar - Shore Towers*).
- **Bilingual Mode (AR / EN)**: Instant layout and language direction switching (RTL / LTR).
- **Blueprint Dark Mode**: Toggle between Daylight Studio mode and high-contrast Blueprint dark mode.
- **Executive Print / PDF Export**: 1-click clean printable executive report (`window.print()`).
- **Live Search**: Instant filtering across reports, milestones, and contractor entries.
- **Notification Dropdown**: Real-time site alerts and quality inspection approvals.

### 2. Live IoT Telemetry Ticker
- **Concrete Curing Sensor**: Real-time hydration temperature (`28.4°C / 36 MPa`).
- **Tower Crane Tilt Safety**: Structural tilt sensor (`0.18° < 0.5° safe limit`).
- **Environmental Noise Level**: Ambient decibel monitor (`68 dB`).
- **Air Quality & Dust**: Real-time PM2.5 / AQI index (`AQI 28 - Excellent`).

### 3. Row 1: Reports, Progress Gallery & Live Feed
- **Monthly Reports ("التقارير الشهرية")**: Downloadable PDF reports (Jan, Feb, Feb Rev, Mar) with formatted text/PDF report generators and modal previews.
- **Evolution Milestones & Time-Lapse ("معالم التطور")**:
  - Construction site photography grid with dates.
  - Interactive **Before / After Dual-Image Comparison Slider**.
  - High-resolution Lightbox viewer with zoom & engineer remarks.
- **Live Stream Player ("البث المباشر")**:
  - Dynamic centisecond running clock (`HH:mm:ss.ms - 23-11-23 س`).
  - Animated pulsing live badge & glowing radar signal `((•))`.
  - Multi-camera switcher (Site Cam 1, Crane View, Gate, Foundation).
  - **Interactive 360° Panoramic Virtual Site Tour (Matterport/VR View)** with clickable engineering hotspots.

### 4. Row 2: Financials, 3D Building & Finishing Tracker
- **Budget Structure ("هيكل الموازنة")**:
  - Interactive Chart.js doughnut chart (Materials 30%, Labor 20%, Contractors 10%, Permits 40%).
  - **Itemized Expenditure Ledger Modal**: Breakdown of contractor invoices, SABIC steel, C40 concrete, and payment states.
- **Completed Floors & 3D Isometric Model ("الأدوار المكتملة")**:
  - Interactive 3D building visualization with completed floor indicators.
  - **BIM Floor Inspector Modal**: Click any floor to inspect concrete cube break tests (MPa), MEP completion %, checklist items, and engineer sign-offs.
- **Finishing Stages ("مراحل التشطيب")**:
  - Vertical milestone stepper (Structure 100%, Finishing active, Fit-out, Handover).
  - Dated site progression cards.

### 5. Row 3: Weather, Upcoming Milestones & Compliance
- **Weather Station ("حالة الطقس")**: 20°C sunny display, 5-day forecast, and crane wind safety advisory.
- **Upcoming Milestones ("المعالم القادمة")**:
  - Prioritized schedule with interactive **"+ إضافة معلم" (Add Milestone)** modal and celebration confetti.
- **Transparency & Safety Badges ("مؤشرات الشفافية")**:
  - 90% completion circular gauge with navigation controls (`< >`).
  - 200 safe days incident-free badge.
  - Environmental sustainability rating (Mostadam / LEED Silver).

---

## 📂 File Structure

```
cobuild-proptech-dashboard/
├── index.html            # Main HTML layout, modals, and CDN dependencies
├── README.md             # Project documentation & user guide
├── css/
│   └── styles.css        # Glassmorphism, animations, 3D isometric & blueprint styling
└── js/
    ├── app.js            # Main dashboard controller, modals, clock, and event listeners
    ├── mockData.js       # Reports, gallery, IoT telemetry, BIM details, and translations
    ├── charts.js         # Chart.js budget doughnut and circular progress gauge
    └── building3d.js     # 3D isometric building renderer and floor click handlers
```

---

## 🗄️ Backend REST API & SQLite Database

The platform includes a zero-dependency Python REST API backend paired with a relational SQLite database:

### Database File: `backend/cobuild.db`
- **`projects`**: Project metadata, completion %, safe days, and green building score.
- **`reports`**: Monthly executive progress reports with approval status.
- **`milestones`**: Real-time project milestones with database persistence.
- **`floor_inspections`**: BIM inspection records with concrete tests (MPa) and checklist items.
- **`budget_invoices`**: Itemized contractor invoice ledger with payment status.
- **`rfis`**: Engineering Requests for Information (RFIs) and approvals.
- **`iot_telemetry`**: Concrete curing temperature, crane tilt, noise, and air quality telemetry.

### 🔌 REST API Endpoints
- **Production (Render)**: `https://cobuild-dashboard.onrender.com/api`
- **Local Development**: `http://127.0.0.1:5000/api`

Endpoints:
- `GET /api/project` — Active project summary
- `GET /api/reports` — Monthly reports list
- `GET /api/milestones` & `POST /api/milestones` — CRUD milestones (persisted to SQLite)
- `GET /api/floors` & `GET /api/floors/<id>` — BIM floor details
- `GET /api/budget` — Category breakdown & itemized invoice ledger
- `GET /api/rfis` — Engineering approvals and RFI log
- `GET /api/telemetry/live` — Live IoT sensor stream

### 🚀 Starting the Backend Server
```powershell
# Method A: Double-click backend/start_backend.bat
.\backend\start_backend.bat

# Method B: PowerShell direct run
python backend/app.py
```

## 🌐 Full-Stack Application Pages
1. **`index.html`** — Arabic RTL Construction Transparency Dashboard (9 interactive cards, 3D BIM tower, IoT live telemetry, AI vision bounding overlay, audio synth, and bilingual switcher).
2. **`marketplace.html`** — CoBuild Project Marketplace (3-column co-investment grid, glassmorphism filters, search, and investment pledge modal).
3. **`project-view.html`** — CoBuild Project View (Architectural hero, interactive unit floorplan map, 73% circular funding gauge, construction timeline, metrics dashboard, and embedded location map).

---

## ☁️ Google Cloud Ecosystem Deployment (Google Cloud Run)

The entire CoBuild PropTech platform is optimized to run as a unified serverless container on **Google Cloud Run**, eligible for Google Cloud's **Always Free Tier** (2M requests/month free).

```
[User Browser]
       │ (HTTPS / Auto SSL)
       ▼
[Google Cloud Run Container (Port 8080)]
  ├── / ──────────────────► Transparency Dashboard (index.html)
  ├── /marketplace ───────► Co-Investment Marketplace (marketplace.html)
  ├── /project-view ──────► Detailed Unit Floorplan View (project-view.html)
  ├── /healthz ───────────► Container Health & Liveness Probe
  └── /api/* ─────────────► Python REST API + SQLite Database
```

### 🚀 Option 1: 1-Click via Google Cloud Console (No CLI Required)
1. Go to the **[Google Cloud Run Console](https://console.cloud.google.com/run)**.
2. Click **"Create Service"** (إنشاء خدمة).
3. Choose **"Continuously deploy from a repository"** (النشر المستمر من مستودع).
4. Link your GitHub repository: `belalsamyfarag/cobuild-dashboard` and select **Dockerfile**.
5. Settings:
   - **Service Name**: `cobuild-proptech`
   - **Region**: `me-central1` (Doha) or `europe-west1` (Belgium).
   - **Authentication**: Check **"Allow unauthenticated invocations"**.
   - **Container Port**: `8080`.
6. Click **"Create"**. Cloud Build will build the container and issue a live HTTPS URL (e.g. `https://cobuild-proptech-xxx.a.run.app`).

### ⚡ Option 2: 1-Click via Cloud Shell (In-Browser Terminal)
1. Open **[shell.cloud.google.com](https://shell.cloud.google.com)** in your browser.
2. Clone your repository:
   ```bash
   git clone https://github.com/belalsamyfarag/cobuild-dashboard.git
   cd cobuild-dashboard
   ```
3. Run the automated script:
   ```bash
   chmod +x deploy-gcp.sh
   ./deploy-gcp.sh
   ```

### 💻 Option 3: PowerShell Script from Your PC
```powershell
.\deploy-gcp.ps1
```
*(Requires Google Cloud SDK `gcloud`)*

---

## 🧪 Automated Testing
Run the automated test suite against the local or cloud backend:
```powershell
python -m unittest tests/test_api.py
```
**Test Coverage**:
- Relational schema & SQLite table verification
- `GET /api/project` response verification
- `GET /api/reports` listing verification
- `POST /api/milestones` creation & persistence roundtrip
- `GET /api/floors` BIM inspection verification

### Method 3: Python Local Web Server (Port 8080)
```powershell
python server.py
```
Then visit `http://localhost:8080` in your browser.


