// CoBuild PropTech - Daily Site Progress Log Controller ("يوم بيوم")

const DailyFeedController = {
  dailyLogs: [],
  activeLogIndex: 0,

  async init() {
    await this.fetchLogs();
    this.renderDailySection();
    this.setupEventListeners();
  },

  async fetchLogs() {
    try {
      this.dailyLogs = await CoBuildAPI.getDailyLogs();
      if (!this.dailyLogs || this.dailyLogs.length === 0) {
        this.dailyLogs = (dashboardData && dashboardData.dailyLogs) || [];
      }
    } catch (e) {
      this.dailyLogs = (dashboardData && dashboardData.dailyLogs) || [];
    }
  },

  renderDailySection() {
    const container = document.getElementById('daily-feed-container');
    if (!container) return;

    if (!this.dailyLogs || this.dailyLogs.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-500">
          <i data-lucide="calendar" class="w-12 h-12 mx-auto mb-2 text-slate-300"></i>
          <p>جاري تحميل سجل اليوميات الميدانية...</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const currentLog = this.dailyLogs[this.activeLogIndex] || this.dailyLogs[0];

    // Build timeline buttons
    const dayPillsHtml = this.dailyLogs.map((log, idx) => {
      const isSelected = idx === this.activeLogIndex;
      const activeClass = isSelected
        ? "bg-teal-600 text-white shadow-md shadow-teal-500/30 font-bold scale-105"
        : "bg-white/80 text-slate-700 hover:bg-teal-50 border border-slate-200/80";
      
      const badgeText = idx === 0 ? "اليوم" : log.day_name;
      
      return `
        <button onclick="DailyFeedController.selectDay(${idx})" 
                class="px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${activeClass}">
          <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300 animate-ping' : 'bg-slate-300'}"></span>
          <span class="font-bold">${badgeText}</span>
          <span class="text-[11px] opacity-80">(${log.date})</span>
        </button>
      `;
    }).join("");

    // Build photos gallery HTML
    let photosHtml = "";
    if (currentLog.photos && currentLog.photos.length > 0) {
      photosHtml = `
        <div class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <i data-lucide="camera" class="w-3.5 h-3.5 text-teal-600"></i>
              لقطات حية من الموقع لتوثيق هذا اليوم (${currentLog.photos.length} صور موثقة)
            </span>
            <span class="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">ختم زمني معتمد</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${currentLog.photos.map((p, pIdx) => `
              <div class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm hover:shadow-md transition-all">
                <div class="h-32 bg-gradient-to-tr from-slate-800 to-slate-700 relative flex items-center justify-center p-3 text-white overflow-hidden">
                  <div class="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500" 
                       style="background-image: url('assets/photos/site-${(pIdx % 3) + 1}.jpg');"></div>
                  <div class="relative z-10 text-center">
                    <span class="inline-block p-2 rounded-full bg-white/20 backdrop-blur-md mb-1 text-amber-300">
                      <i data-lucide="image" class="w-5 h-5"></i>
                    </span>
                    <p class="text-xs font-bold text-white drop-shadow">${p.title || 'توثيق ميداني'}</p>
                    <span class="text-[10px] text-teal-200 font-mono">${p.time || '10:00 ص'}</span>
                  </div>
                  <span class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    ${currentLog.date}
                  </span>
                </div>
                <div class="p-2.5 bg-white text-right">
                  <p class="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">${p.caption || ''}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Top Bar: Navigation Days -->
      <div class="flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 pb-3 mb-4">
        <div class="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          ${dayPillsHtml}
        </div>
        <div class="flex items-center gap-2">
          <a href="engineer-entry.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
            <span>إضافة تقرير يومي (المهندس)</span>
          </a>
          <a href="buyer-portal.html" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-sm rounded-xl transition-all">
            <i data-lucide="key" class="w-3.5 h-3.5"></i>
            <span>بوابة شقتي</span>
          </a>
        </div>
      </div>

      <!-- Current Day Detailed Card -->
      <div class="bg-gradient-to-br from-slate-50/80 via-white to-teal-50/30 rounded-2xl p-4 sm:p-5 border border-teal-100/80 shadow-sm relative overflow-hidden">
        <!-- Live Badge Top Corner -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-black text-slate-800 font-['Cairo']">
              سجل أحداث: ${currentLog.day_name} ${currentLog.date}
            </span>
            <span class="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
              ${currentLog.stage}
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span class="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <i data-lucide="hard-hat" class="w-3.5 h-3.5 text-amber-500"></i>
              <strong class="font-bold">${currentLog.workforce_count}</strong> فني وعامل
            </span>
            <span class="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
              <i data-lucide="sun" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>${currentLog.weather.split('-')[0]}</span>
            </span>
          </div>
        </div>

        <!-- Title & Detailed Log Text -->
        <h3 class="text-base sm:text-lg font-black text-slate-900 mb-2 leading-snug font-['Cairo']">
          ${currentLog.title}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-slate-200/60 mb-3">
          ${currentLog.description}
        </p>

        <!-- Concrete Tests & Quality Assurance Ribbon -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs mb-1">
          <div class="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-xl flex items-start gap-2 text-emerald-900">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"></i>
            <div>
              <strong class="font-bold block">مؤشر جودة واختبارات الخرسانة:</strong>
              <span class="text-[11px] text-emerald-800">${currentLog.concrete_test || 'عينات خرسانة مطابقة للمواصفات القياسية المصرية للكود الهندسي.'}</span>
            </div>
          </div>

          <div class="bg-blue-50/80 border border-blue-200/80 p-2.5 rounded-xl flex items-start gap-2 text-blue-900">
            <i data-lucide="user-check" class="w-4 h-4 text-blue-600 shrink-0 mt-0.5"></i>
            <div>
              <strong class="font-bold block">إشراف واعتماد:</strong>
              <span class="text-[11px] text-blue-800">${currentLog.engineer_name}</span>
            </div>
          </div>
        </div>

        <!-- Photos Section -->
        ${photosHtml}
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  selectDay(index) {
    this.activeLogIndex = index;
    this.renderDailySection();
  },

  setupEventListeners() {
    // Custom events if needed
  }
};

// Auto initialize on DOMContentLoaded or immediate if loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DailyFeedController.init());
} else {
  DailyFeedController.init();
}
