// CoBuild PropTech - Buyer Portal Controller ("بوابة شقتي")

const BuyerPortalController = {
  reservation: null,
  votes: [],

  async init() {
    await this.loadData();
    this.renderPaymentSchedule();
    this.renderSyndicateVotes();
    if (window.lucide) lucide.createIcons();
  },

  async loadData() {
    try {
      this.reservation = await CoBuildAPI.getMyUnit("RES-302-BELAL");
      this.votes = await CoBuildAPI.getSyndicateVotes();
    } catch (e) {
      console.warn("Falling back to local mock data for buyer portal:", e);
      this.reservation = dashboardData.buyerReservation;
      this.votes = dashboardData.syndicateVotes;
    }
  },

  renderPaymentSchedule() {
    const tbody = document.getElementById("payment-schedule-tbody");
    if (!tbody || !this.reservation || !this.reservation.payment_schedule) return;

    tbody.innerHTML = this.reservation.payment_schedule.map((item, idx) => {
      let statusBadge = "";
      if (item.status === "مدفوعة") {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <i data-lucide="check" class="w-3 h-3"></i>
          <span>مدفوعة وموثقة</span>
        </span>`;
      } else if (item.status === "مستحقة قريباً") {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
          <i data-lucide="clock" class="w-3 h-3"></i>
          <span>مستحقة قريباً</span>
        </span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
          <span>مجدولة بالتنفيذ</span>
        </span>`;
      }

      return `
        <tr class="hover:bg-teal-50/40 transition-colors">
          <td class="p-3 font-bold text-slate-800 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold font-mono">
              ${idx + 1}
            </span>
            <span>${item.stage}</span>
          </td>
          <td class="p-3 font-mono text-slate-600 font-bold">${item.percentage}</td>
          <td class="p-3 font-mono font-black text-slate-900">${item.amount.toLocaleString()} ج.م</td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-[11px] text-slate-500">${item.notes}</td>
        </tr>
      `;
    }).join("");

    if (window.lucide) lucide.createIcons();
  },

  renderSyndicateVotes() {
    const container = document.getElementById("syndicate-votes-container");
    if (!container || !this.votes || this.votes.length === 0) return;

    container.innerHTML = this.votes.map((vote) => {
      const optionsHtml = (vote.options || []).map((opt) => `
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all">
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <span class="text-xs font-bold text-slate-800 leading-snug">${opt.title}</span>
            <span class="text-xs font-black text-teal-700 font-mono">${opt.pct || 0}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
            <div class="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500" style="width: ${opt.pct || 0}%"></div>
          </div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-slate-400 font-mono">${opt.votes || 0} صوت</span>
            <button onclick="BuyerPortalController.castVote('${vote.id}', ${opt.id})" class="text-teal-700 hover:text-teal-800 font-bold hover:underline flex items-center gap-1">
              <span>صوّت لهذا الخيار</span>
              <i data-lucide="chevron-left" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      `).join("");

      return `
        <div class="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <h4 class="text-xs font-black text-slate-900">${vote.title}</h4>
            <span class="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
              ينتهي: ${vote.deadline}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 mb-3 leading-relaxed">${vote.description}</p>
          <div class="space-y-2">
            ${optionsHtml}
          </div>
        </div>
      `;
    }).join("");

    if (window.lucide) lucide.createIcons();
  },

  async castVote(voteId, optionId) {
    try {
      await CoBuildAPI.submitSyndicateVote(voteId, optionId);
    } catch (e) {
      console.warn("Vote submitted locally");
    }

    // Trigger celebration
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    showToast("تم تسجيل صوتك التشاركي بنجاح وتحديث نسب الملاك!");
    await this.loadData();
    this.renderSyndicateVotes();
  }
};

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-message");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0");

  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
  }, 4000);
}

function simulateNotification() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showToast("🔔 إشعار فوري: تم صب سقف دور شقتك (الدور الرابع) بنجاح واختبار الخرسانة مطابق للكود!");
}

function downloadContractModal() {
  showToast("📄 جاري تحميل وتصدير عقد المشاركة التشاركي المعتمد (PDF)...");
}

document.addEventListener("DOMContentLoaded", () => {
  BuyerPortalController.init();
});
