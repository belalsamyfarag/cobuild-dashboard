// CoBuild PropTech Dashboard Controller

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

let currentGaugeIndex = 0;
const gaugeMetrics = [
  { title: "نسبة الإنجاز الكلي", value: 90, subtext: "المشروع متقدم بنسبة 4% عن الجدول" },
  { title: "نسبة الهيكل الإنشائي", value: 100, subtext: "تم استلام كافة الأعمال الخرسانية" },
  { title: "نسبة التشطيبات الداخلية", value: 68, subtext: "جاري أعمال التمديدات والدهان" }
];

let currentCameraIndex = 0;

// Web Audio API Synth for Interactive Sound Effects
let audioCtx = null;
function playUiSound(type = 'click') {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.28);
    } else if (type === 'camera') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    }
  } catch (e) {
    // Graceful fallback if audio context blocked by browser
  }
}

async function initDashboard() {
  // 1. Check backend API connection
  if (window.CoBuildAPI) {
    const isConnected = await CoBuildAPI.checkHealth();
    const badge = document.getElementById('backend-status-badge');
    const text = document.getElementById('backend-status-text');
    if (badge && text) {
      if (isConnected) {
        badge.classList.remove('hidden', 'bg-amber-50', 'text-amber-700', 'border-amber-200');
        badge.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
        text.innerText = 'SQLite API Live';
      } else {
        badge.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
        badge.classList.add('bg-slate-100', 'text-slate-600', 'border-slate-200');
        text.innerText = 'Offline Mode';
      }
    }
  }

  // 2. Start live clock for camera
  startLiveClock();

  // 3. Initialize Charts
  if (typeof initBudgetChart === 'function') {
    initBudgetChart('budgetChart');
  }
  if (typeof initCircularGauge === 'function') {
    initCircularGauge('gaugeChart', gaugeMetrics[0].value);
  }

  // 4. Initialize 3D Isometric Building Model
  if (typeof initBuildingModel === 'function') {
    initBuildingModel('buildingModelContainer');
  }

  // 5. Render Dynamic Lists from API/Mock
  await renderMonthlyReports();
  await renderMilestonesList();
  renderNotifications();

  // 6. Setup Event Listeners
  setupEventListeners();

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Live Time & Milliseconds Simulator for Camera feed
function startLiveClock() {
  const clockEl = document.getElementById('camera-live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const centiseconds = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    
    // Format: 15:32:99 - 23-11-23 س matching the reference image format
    clockEl.innerText = `${hours}:${minutes}:${centiseconds} - 23-11-23 س`;
    requestAnimationFrame(updateClock);
  }

  requestAnimationFrame(updateClock);
}

// Render Monthly Reports List
async function renderMonthlyReports() {
  const container = document.getElementById('reports-list-container');
  if (!container) return;

  const reports = window.CoBuildAPI ? await CoBuildAPI.getReports() : dashboardData.reports;

  container.innerHTML = reports.map((rep, idx) => `
    <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all border border-slate-100/80 group">
      <!-- Download Action -->
      <button onclick="downloadReport('${rep.id}')" class="p-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all shadow-sm flex items-center justify-center" title="تحميل التقرير">
        <i data-lucide="download" class="w-4 h-4"></i>
      </button>

      <!-- Title & Year -->
      <div class="flex-1 text-right px-3 cursor-pointer" onclick="previewReport('${rep.id}')">
        <div class="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">${rep.title}</div>
        <div class="text-xs text-slate-400 mt-0.5">${rep.year || '2023'} • ${rep.size || '5.0 MB'}</div>
      </div>

      <!-- PDF Icon Badge -->
      <div class="flex items-center justify-center px-2 py-1 bg-red-50 text-red-500 rounded-md text-[10px] font-extrabold tracking-wider border border-red-100">
        PDF
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// Render Upcoming Milestones List
async function renderMilestonesList() {
  const container = document.getElementById('upcoming-milestones-container');
  if (!container) return;

  const events = window.CoBuildAPI ? await CoBuildAPI.getMilestones() : dashboardData.upcomingEvents;

  container.innerHTML = events.map(ev => `
    <div class="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-all group">
      <!-- Status Dot -->
      <div class="mt-1.5 w-2.5 h-2.5 rounded-full ${ev.priority === 'urgent' ? 'bg-rose-500 ring-rose-100' : 'bg-emerald-500 ring-emerald-100'} ring-4 shrink-0"></div>
      
      <!-- Content -->
      <div class="flex-1 text-right">
        <div class="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
          ${ev.title}
        </div>
        <div class="text-xs text-slate-500 leading-relaxed mt-0.5">
          ${ev.subtitle}
        </div>
      </div>
    </div>
  `).join('');
}

// Render Notifications
function renderNotifications() {
  const container = document.getElementById('notifications-container');
  if (!container) return;

  container.innerHTML = dashboardData.notifications.map(n => `
    <div class="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all border-b border-slate-100 last:border-0 text-right">
      <div class="p-2 rounded-lg bg-teal-50 text-teal-600 shrink-0 mt-0.5">
        <i data-lucide="${n.icon}" class="w-4 h-4"></i>
      </div>
      <div class="flex-1">
        <div class="text-xs font-bold text-slate-800">${n.title}</div>
        <div class="text-[11px] text-slate-500 mt-0.5 leading-snug">${n.desc}</div>
        <div class="text-[10px] text-slate-400 mt-1">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// Interactive PDF Preview & Download
window.previewReport = function(repId) {
  playUiSound('click');
  const rep = dashboardData.reports.find(r => r.id === repId) || dashboardData.reports[0];
  const modal = document.getElementById('report-modal');
  const title = document.getElementById('modal-report-title');
  const desc = document.getElementById('modal-report-desc');
  const date = document.getElementById('modal-report-date');
  const size = document.getElementById('modal-report-size');

  if (modal && title) {
    title.innerText = rep.title;
    desc.innerText = rep.summary;
    date.innerText = rep.date;
    size.innerText = rep.size;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeReportModal = function() {
  playUiSound('click');
  const modal = document.getElementById('report-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.downloadReport = function(repId) {
  playUiSound('success');
  const rep = dashboardData.reports.find(r => r.id === repId) || dashboardData.reports[0];
  
  // Show toast notification
  showToast(`جاري تنزيل ${rep.title} (${rep.size})...`);

  // Generate downloadable mock text/pdf file
  const reportContent = `
===================================================
CoBuild PropTech - مركز شفافية البناء
مشروع: ${dashboardData.projectInfo.name} (${dashboardData.projectInfo.code})
${rep.title}
تاريخ الإصدار: ${rep.date}
الحالة: ${rep.status}
---------------------------------------------------
الملخص التنفيذي:
${rep.summary}

مؤشرات المشروع الرئيسية:
- نسبة الإنجاز الإجمالية: ${dashboardData.projectInfo.completionPercentage}%
- سجل السلامة المهنية: ${dashboardData.projectInfo.safeDays} يوم بدون إصابات
- تقييم الاستدامة البيئية: ${dashboardData.projectInfo.sustainabilityScore}
===================================================
  `;

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${rep.title.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Gallery Lightbox Modal
window.openLightbox = function(imageIndex) {
  playUiSound('click');
  const item = dashboardData.gallery[imageIndex] || dashboardData.gallery[0];
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const dateEl = document.getElementById('lightbox-date');
  const descEl = document.getElementById('lightbox-desc');

  if (modal && imgEl) {
    imgEl.src = item.imageUrl;
    titleEl.innerText = `${item.title} - ${item.subtitle}`;
    dateEl.innerText = item.date;
    descEl.innerText = item.description;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeLightbox = function() {
  playUiSound('click');
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Live Camera Switcher
window.switchCamera = function() {
  playUiSound('camera');
  currentCameraIndex = (currentCameraIndex + 1) % dashboardData.liveCameras.length;
  const cam = dashboardData.liveCameras[currentCameraIndex];
  
  const camNameEl = document.getElementById('current-camera-name');
  const camScreen = document.getElementById('live-stream-container');

  if (camNameEl) {
    camNameEl.innerText = cam.name;
  }
  if (camScreen) {
    camScreen.style.background = cam.bgGradient;
  }

  showToast(`تم التبديل إلى ${cam.name}`);
};

// Radial Gauge Navigation Pager
window.nextGaugeMetric = function() {
  currentGaugeIndex = (currentGaugeIndex + 1) % gaugeMetrics.length;
  updateGaugeDisplay();
};

window.prevGaugeMetric = function() {
  currentGaugeIndex = (currentGaugeIndex - 1 + gaugeMetrics.length) % gaugeMetrics.length;
  updateGaugeDisplay();
};

function updateGaugeDisplay() {
  const metric = gaugeMetrics[currentGaugeIndex];
  const labelEl = document.getElementById('gauge-metric-label');
  const valueEl = document.getElementById('gauge-metric-value');

  if (labelEl) labelEl.innerText = metric.title;
  if (valueEl) valueEl.innerText = `${metric.value}%`;

  if (typeof initCircularGauge === 'function') {
    initCircularGauge('gaugeChart', metric.value);
  }
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3000);
}

// Add Milestone Modal Handlers
window.openAddMilestoneModal = function() {
  const modal = document.getElementById('add-milestone-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const dateInput = document.getElementById('milestone-date-input');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }
};

window.closeAddMilestoneModal = function() {
  const modal = document.getElementById('add-milestone-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleAddMilestone = async function(e) {
  e.preventDefault();
  const title = document.getElementById('milestone-title-input').value.trim();
  const desc = document.getElementById('milestone-desc-input').value.trim();
  const date = document.getElementById('milestone-date-input').value;
  const priority = document.getElementById('milestone-priority-input').value;

  if (!title || !desc) return;

  const newEvent = {
    id: `ev-${Date.now()}`,
    title: title,
    subtitle: desc,
    date: date,
    status: "مجدول",
    priority: priority
  };

  // Persist to SQLite Database via REST API
  if (window.CoBuildAPI) {
    await CoBuildAPI.addMilestone(newEvent);
  }

  dashboardData.upcomingEvents.unshift(newEvent);
  await renderMilestonesList();
  closeAddMilestoneModal();
  triggerConfetti();
  showToast(`تم حفظ المعلم "${title}" في قاعدة البيانات بنجاح!`);
  
  // Clear form
  document.getElementById('add-milestone-form').reset();
};

// Floor BIM Inspector Modal Handlers
window.openBimFloorModal = function(floorNum) {
  const modal = document.getElementById('bim-floor-modal');
  const details = dashboardData.floorBimDetails[floorNum] || dashboardData.floorBimDetails[3];
  
  if (!modal || !details) return;

  document.getElementById('bim-floor-title').innerText = details.name;
  document.getElementById('bim-concrete-val').innerText = details.concreteTest;
  document.getElementById('bim-mep-val').innerText = details.mepStatus;
  document.getElementById('bim-finishing-val').innerText = details.finishingStatus;
  
  const snagList = document.getElementById('bim-snag-list');
  if (snagList) {
    snagList.innerHTML = details.snagItems.map(item => `<li>${item}</li>`).join('');
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
};

window.closeBimFloorModal = function() {
  const modal = document.getElementById('bim-floor-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Budget Ledger Modal Handlers
window.openBudgetModal = function() {
  const modal = document.getElementById('budget-ledger-modal');
  const tbody = document.getElementById('budget-ledger-tbody');
  
  if (!modal || !tbody) return;

  tbody.innerHTML = dashboardData.budgetLedger.map(item => `
    <tr class="hover:bg-slate-50/80 transition-colors">
      <td class="py-2.5 px-2.5">
        <div class="font-bold text-slate-800">${item.item}</div>
        <div class="text-[10px] text-slate-400 font-sans">${item.supplier}</div>
      </td>
      <td class="py-2.5 px-2.5">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
          item.category === 'المواد' ? 'bg-teal-50 text-teal-700' :
          item.category === 'العمالة' ? 'bg-sky-50 text-sky-700' :
          item.category === 'المقاولين' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
        }">${item.category}</span>
      </td>
      <td class="py-2.5 px-2.5 font-bold font-mono text-slate-800">${item.amount}</td>
      <td class="py-2.5 px-2.5 text-slate-400 font-mono">${item.date}</td>
      <td class="py-2.5 px-2.5">
        <span class="inline-flex items-center gap-1 text-[11px] font-semibold ${
          item.status === 'مدفوع' ? 'text-emerald-600' : 'text-amber-600'
        }">
          <span class="w-1.5 h-1.5 rounded-full ${item.status === 'مدفوع' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
          ${item.status}
        </span>
      </td>
    </tr>
  `).join('');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeBudgetModal = function() {
  const modal = document.getElementById('budget-ledger-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Blueprint Theme Switcher
window.toggleBlueprintTheme = function() {
  document.body.classList.toggle('blueprint-mode');
  const isDark = document.body.classList.contains('blueprint-mode');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
  
  showToast(isDark ? 'تم تفعيل نمط المخططات الهندسية (Blueprint Mode)' : 'تم تفعيل النمط النهاري (Daylight Mode)');
};

// Confetti Celebration Trigger
window.triggerConfetti = function() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  }
};

// AI Vision Detection Overlay Handlers
let isAiVisionActive = false;
window.toggleAiVision = function() {
  isAiVisionActive = !isAiVisionActive;
  const overlay = document.getElementById('ai-vision-overlay');
  const btn = document.getElementById('ai-vision-btn');
  const label = document.getElementById('ai-vision-label');

  if (overlay) {
    if (isAiVisionActive) {
      overlay.classList.remove('hidden');
      if (btn) btn.classList.add('bg-emerald-600', 'text-white');
      if (btn) btn.classList.remove('bg-emerald-50', 'text-emerald-700');
      showToast('تم تفعيل تحليل الذكاء الاصطناعي لمعدات السلامة (AI PPE Detection: 98.5% Safe)');
    } else {
      overlay.classList.add('hidden');
      if (btn) btn.classList.remove('bg-emerald-600', 'text-white');
      if (btn) btn.classList.add('bg-emerald-50', 'text-emerald-700');
      showToast('تم إيقاف طبقة الذكاء الاصطناعي');
    }
  }
};

// Drone Survey Modal Handlers
window.openDroneModal = function() {
  const modal = document.getElementById('drone-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }
};

window.closeDroneModal = function() {
  const modal = document.getElementById('drone-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// 360 VR Tour Handlers
let panoOffset = 0;
window.openTour360Modal = function() {
  const modal = document.getElementById('tour-360-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }
};

window.closeTour360Modal = function() {
  const modal = document.getElementById('tour-360-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.panPanorama = function(delta) {
  panoOffset += delta;
  const img = document.getElementById('pano-img');
  if (img) {
    img.style.transform = `translateX(${panoOffset}%)`;
  }
};

// Time-Lapse Slider Handlers
window.openTimelapseModal = function() {
  const modal = document.getElementById('timelapse-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }
};

window.closeTimelapseModal = function() {
  const modal = document.getElementById('timelapse-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleTimelapseSlider = function(val) {
  const clip = document.getElementById('before-img-clip');
  if (clip) {
    clip.style.width = `${val}%`;
  }
};

// Engineering RFIs & Submittals Handlers
window.openRfiModal = function() {
  playUiSound('click');
  const modal = document.getElementById('rfi-modal');
  const container = document.getElementById('rfi-list-container');
  
  if (!modal || !container) return;

  container.innerHTML = dashboardData.rfiSubmittals.map(rfi => `
    <div class="p-3 bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-100 transition-all flex items-start justify-between gap-3">
      <div class="flex-1 text-right">
        <div class="flex items-center gap-2">
          <span class="font-bold text-slate-800">${rfi.subject}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            rfi.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'
          }">${rfi.id}</span>
        </div>
        <div class="text-slate-400 text-[11px] mt-1">${rfi.contractor} • ${rfi.date}</div>
      </div>
      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
        rfi.status.includes('معتمد') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
      }">
        ${rfi.status}
      </span>
    </div>
  `).join('');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeRfiModal = function() {
  playUiSound('click');
  const modal = document.getElementById('rfi-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Language Toggle (AR / EN)
let currentLanguage = 'ar';
window.toggleLanguage = function() {
  currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
  const html = document.documentElement;
  const label = document.getElementById('lang-label');
  const t = dashboardData.translations[currentLanguage];
  
  if (currentLanguage === 'en') {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    if (label) label.innerText = 'عربي';
    showToast('Switched to English (LTR Mode)');
  } else {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    if (label) label.innerText = 'EN';
    showToast('تم التبديل إلى اللغة العربية (RTL)');
  }

  // Update DOM text elements with data-i18n attributes or direct element lookups
  const searchInput = document.getElementById('dashboard-search-input');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Re-render lists with current language
  renderMonthlyReports();
  renderMilestonesList();
  if (typeof initBudgetChart === 'function') {
    initBudgetChart('budgetChart');
  }
};

// Setup Event Listeners & Interactions
function setupEventListeners() {
  // Project Selector
  const projSelector = document.getElementById('project-selector');
  if (projSelector) {
    projSelector.addEventListener('change', (e) => {
      showToast(`تم التبديل إلى: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // Search input filter
  const searchInput = document.getElementById('dashboard-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      // Filter reports
      const reportCards = document.querySelectorAll('#reports-list-container > div');
      reportCards.forEach(card => {
        if (card.textContent.toLowerCase().includes(q) || q === '') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      // Filter milestones
      const milestoneCards = document.querySelectorAll('#upcoming-milestones-container > div');
      milestoneCards.forEach(card => {
        if (card.textContent.toLowerCase().includes(q) || q === '') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Notification Bell Toggle
  const notifBtn = document.getElementById('notif-bell-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      notifDropdown.classList.add('hidden');
    });
  }
}
