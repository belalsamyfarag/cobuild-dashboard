// 3D Isometric Building Model & Floor Inspector

function initBuildingModel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render SVG Isometric multi-level tower
  const totalFloors = 6;
  const completedFloors = [1, 2, 3];
  const inProgressFloors = [4, 5];
  const plannedFloors = [6];

  let activeFloor = 3;

  function renderBuilding() {
    container.innerHTML = `
      <div class="relative w-full h-72 flex items-center justify-center select-none overflow-visible">
        <!-- 3D SVG Isometric Building -->
        <svg viewBox="0 0 400 360" class="w-full h-full max-h-72 drop-shadow-2xl overflow-visible" style="transform: scale(1.05);">
          <defs>
            <!-- Linear Gradients for 3D Faces -->
            <linearGradient id="grad-podium-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <linearGradient id="grad-podium-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#94a3b8" />
              <stop offset="100%" stop-color="#64748b" />
            </linearGradient>
            <linearGradient id="grad-podium-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>

            <!-- Completed Floor Emerald/Teal Glass -->
            <linearGradient id="grad-completed-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#047857" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="grad-completed-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#34d399" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#059669" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="grad-completed-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.85" />
            </linearGradient>

            <!-- In-Progress Floor Grey/Glass Frame -->
            <linearGradient id="grad-prog-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e2e8f0" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="grad-prog-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-prog-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#e2e8f0" />
            </linearGradient>

            <!-- Grid Wireframe Pattern -->
            <pattern id="grid-pattern-completed" width="16" height="12" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 12" fill="none" stroke="#047857" stroke-width="1.2" />
            </pattern>
            <pattern id="grid-pattern-columns" width="12" height="18" patternUnits="userSpaceOnUse">
              <rect x="2" y="2" width="8" height="14" rx="1" fill="#059669" opacity="0.6" stroke="#065f46" stroke-width="0.8" />
            </pattern>
          </defs>

          <!-- Foundation Ground Shadow -->
          <ellipse cx="200" cy="305" rx="130" ry="40" fill="#0f172a" opacity="0.12" />

          <!-- BASE PODIUM (Isometric Prism) -->
          <!-- Left Face -->
          <polygon points="90,265 200,320 200,345 90,290" fill="url(#grad-podium-left)" />
          <!-- Right Face -->
          <polygon points="200,320 310,265 310,290 200,345" fill="url(#grad-podium-right)" />
          <!-- Top Face -->
          <polygon points="90,265 200,210 310,265 200,320" fill="url(#grad-podium-top)" />

          <!-- TOWER FLOORS -->
          <!-- Floor 1 (Completed - Emerald Grid) -->
          <g class="floor-group cursor-pointer transition-all duration-300" onclick="window.selectBuildingFloor(1)">
            <!-- Left Face -->
            <polygon points="120,230 200,270 200,245 120,205" fill="url(#grad-completed-left)" stroke="#047857" stroke-width="1" />
            <!-- Pillars inside left face -->
            <line x1="140" y1="220" x2="140" y2="200" stroke="#065f46" stroke-width="3" />
            <line x1="160" y1="230" x2="160" y2="210" stroke="#065f46" stroke-width="3" />
            <line x1="180" y1="240" x2="180" y2="220" stroke="#065f46" stroke-width="3" />
            <!-- Right Face -->
            <polygon points="200,270 280,230 280,205 200,245" fill="url(#grad-completed-right)" stroke="#047857" stroke-width="1" />
            <!-- Pillars inside right face -->
            <line x1="220" y1="240" x2="220" y2="220" stroke="#059669" stroke-width="3" />
            <line x1="240" y1="230" x2="240" y2="210" stroke="#059669" stroke-width="3" />
            <line x1="260" y1="220" x2="260" y2="200" stroke="#059669" stroke-width="3" />
            <!-- Slab Top -->
            <polygon points="120,205 200,165 280,205 200,245" fill="url(#grad-completed-top)" stroke="#047857" stroke-width="1" opacity="0.6" />
          </g>

          <!-- Floor 2 (Completed - Emerald Grid) -->
          <g class="floor-group cursor-pointer transition-all duration-300" onclick="window.selectBuildingFloor(2)">
            <!-- Left Face -->
            <polygon points="120,205 200,245 200,215 120,175" fill="url(#grad-completed-left)" stroke="#047857" stroke-width="1" />
            <line x1="140" y1="195" x2="140" y2="170" stroke="#065f46" stroke-width="3" />
            <line x1="160" y1="205" x2="160" y2="180" stroke="#065f46" stroke-width="3" />
            <line x1="180" y1="215" x2="180" y2="190" stroke="#065f46" stroke-width="3" />
            <!-- Right Face -->
            <polygon points="200,245 280,205 280,175 200,215" fill="url(#grad-completed-right)" stroke="#047857" stroke-width="1" />
            <line x1="220" y1="215" x2="220" y2="190" stroke="#059669" stroke-width="3" />
            <line x1="240" y1="205" x2="240" y2="180" stroke="#059669" stroke-width="3" />
            <line x1="260" y1="195" x2="260" y2="170" stroke="#059669" stroke-width="3" />
            <!-- Slab Top -->
            <polygon points="120,175 200,135 280,175 200,215" fill="url(#grad-completed-top)" stroke="#047857" stroke-width="1" opacity="0.6" />
          </g>

          <!-- Floor 3 (Completed - Emerald Grid) -->
          <g class="floor-group cursor-pointer transition-all duration-300" onclick="window.selectBuildingFloor(3)">
            <!-- Left Face -->
            <polygon points="120,175 200,215 200,185 120,145" fill="url(#grad-completed-left)" stroke="#047857" stroke-width="1" />
            <line x1="140" y1="165" x2="140" y2="140" stroke="#065f46" stroke-width="3" />
            <line x1="160" y1="175" x2="160" y2="150" stroke="#065f46" stroke-width="3" />
            <line x1="180" y1="185" x2="180" y2="160" stroke="#065f46" stroke-width="3" />
            <!-- Right Face -->
            <polygon points="200,215 280,175 280,145 200,185" fill="url(#grad-completed-right)" stroke="#047857" stroke-width="1" />
            <line x1="220" y1="185" x2="220" y2="160" stroke="#059669" stroke-width="3" />
            <line x1="240" y1="175" x2="240" y2="150" stroke="#059669" stroke-width="3" />
            <line x1="260" y1="165" x2="260" y2="140" stroke="#059669" stroke-width="3" />
            <!-- Slab Top -->
            <polygon points="120,145 200,105 280,145 200,185" fill="url(#grad-completed-top)" stroke="#047857" stroke-width="1" opacity="0.6" />
          </g>

          <!-- Floor 4 & 5 (In-Progress Framework / Concrete Skeleton) -->
          <g class="floor-group cursor-pointer transition-all duration-300" onclick="window.selectBuildingFloor(4)">
            <!-- Left Face Framework -->
            <polygon points="120,145 200,185 200,120 120,80" fill="url(#grad-prog-left)" stroke="#94a3b8" stroke-width="1.2" />
            <!-- Vertical & Horizontal Concrete Columns/Beams -->
            <line x1="140" y1="135" x2="140" y2="90" stroke="#64748b" stroke-width="2.5" />
            <line x1="160" y1="145" x2="160" y2="100" stroke="#64748b" stroke-width="2.5" />
            <line x1="180" y1="155" x2="180" y2="110" stroke="#64748b" stroke-width="2.5" />
            <line x1="120" y1="112" x2="200" y2="152" stroke="#64748b" stroke-width="2" />
            <!-- Right Face Framework -->
            <polygon points="200,185 280,145 280,80 200,120" fill="url(#grad-prog-right)" stroke="#94a3b8" stroke-width="1.2" />
            <line x1="220" y1="155" x2="220" y2="110" stroke="#94a3b8" stroke-width="2.5" />
            <line x1="240" y1="145" x2="240" y2="100" stroke="#94a3b8" stroke-width="2.5" />
            <line x1="260" y1="135" x2="260" y2="90" stroke="#94a3b8" stroke-width="2.5" />
            <line x1="200" y1="152" x2="280" y2="112" stroke="#94a3b8" stroke-width="2" />
          </g>

          <!-- ROOF PENTHOUSE & ELEVATOR SHAFT -->
          <!-- Roof Slab -->
          <polygon points="120,80 200,40 280,80 200,120" fill="url(#grad-prog-top)" stroke="#64748b" stroke-width="1.5" />
          
          <!-- Penthouse Cube -->
          <polygon points="170,55 210,75 210,48 170,28" fill="#64748b" />
          <polygon points="210,75 235,62 235,35 210,48" fill="#94a3b8" />
          <polygon points="170,28 195,15 235,35 210,48" fill="#cbd5e1" stroke="#475569" stroke-width="0.8" />
        </svg>

        <!-- Floor Quick Info Hover Card -->
        <div id="floor-detail-overlay" class="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-100 text-xs hidden animate-fade-in">
          <div class="font-bold text-slate-800" id="floor-overlay-title">الدور الثالث</div>
          <div class="text-emerald-600 font-semibold flex items-center gap-1 mt-0.5" id="floor-overlay-status">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            منتهي بالكامل 100%
          </div>
        </div>
      </div>
    `;
  }

  window.selectBuildingFloor = function(floorNum) {
    activeFloor = floorNum;
    const floorInfo = dashboardData.floors.find(f => f.floorNumber === floorNum) || {
      name: `الدور ${floorNum}`,
      status: floorNum <= 3 ? "completed" : "in-progress",
      progress: floorNum <= 3 ? 100 : (floorNum === 4 ? 75 : 40),
      label: floorNum <= 3 ? "منتهي بالكامل" : "تحت التنفيذ"
    };

    const overlay = document.getElementById("floor-detail-overlay");
    const title = document.getElementById("floor-overlay-title");
    const status = document.getElementById("floor-overlay-status");

    if (overlay && title && status) {
      title.innerText = floorInfo.name;
      status.innerHTML = `
        <span class="w-2 h-2 rounded-full ${floorInfo.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
        ${floorInfo.label} (${floorInfo.progress}%)
      `;
      overlay.classList.remove("hidden");
    }

    // Also open the rich BIM inspection modal
    if (typeof openBimFloorModal === 'function') {
      openBimFloorModal(floorNum);
    }
  };

  renderBuilding();
}
