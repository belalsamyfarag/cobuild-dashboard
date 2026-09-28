// CoBuild PropTech - Adaptive Cloud & Local REST API Client (Google Cloud Ready)

// Intelligent Base URL resolution:
// - When deployed on Google Cloud Run (or any web domain), automatically uses the current origin (/api)
// - When opened locally via file://, tries local dev ports 8080 and 5000
function resolveApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const proto = window.location.protocol;
    const origin = window.location.origin;
    if (proto === 'http:' || proto === 'https:') {
      return `${origin}/api`;
    }
  }
  return "http://127.0.0.1:8080/api";
}

const CoBuildAPI = {
  isBackendConnected: false,
  activeBaseUrl: resolveApiBaseUrl(),

  async checkHealth() {
    // 1. Try active origin first (instantaneous on Cloud Run or same-origin deployment)
    try {
      const probeUrl = this.activeBaseUrl.replace('/api', '') || '/';
      const res = await fetch(`${probeUrl}/`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        this.isBackendConnected = true;
        return true;
      }
    } catch (e) {}

    // 2. If opened via file:// or different port, check standard local ports (8080 then 5000)
    const localFallbacks = ["http://127.0.0.1:8080", "http://127.0.0.1:5000"];
    for (const host of localFallbacks) {
      try {
        const localRes = await fetch(`${host}/`, { signal: AbortSignal.timeout(600) });
        if (localRes.ok) {
          this.isBackendConnected = true;
          this.activeBaseUrl = `${host}/api`;
          return true;
        }
      } catch (err) {}
    }

    this.isBackendConnected = false;
    return false;
  },

  async getProject() {
    if (!this.isBackendConnected) return dashboardData.projectInfo;
    try {
      const res = await fetch(`${this.activeBaseUrl}/project`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.projectInfo;
  },

  async getReports() {
    if (!this.isBackendConnected) return dashboardData.reports;
    try {
      const res = await fetch(`${this.activeBaseUrl}/reports`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.reports;
  },

  async getMilestones() {
    if (!this.isBackendConnected) return dashboardData.upcomingEvents;
    try {
      const res = await fetch(`${this.activeBaseUrl}/milestones`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.upcomingEvents;
  },

  async addMilestone(milestone) {
    if (!this.isBackendConnected) {
      dashboardData.upcomingEvents.unshift(milestone);
      return { success: true, localOnly: true };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestone),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false, fallback: true };
  },

  async getFloors() {
    if (!this.isBackendConnected) return dashboardData.floors;
    try {
      const res = await fetch(`${this.activeBaseUrl}/floors`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.floors;
  },

  async getFloorDetails(floorNum) {
    if (!this.isBackendConnected) return dashboardData.floorBimDetails[floorNum];
    try {
      const res = await fetch(`${this.activeBaseUrl}/floors/${floorNum}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.floorBimDetails[floorNum];
  },

  async getBudget() {
    if (!this.isBackendConnected) {
      return {
        totalBudgetSAR: dashboardData.budget.totalBudgetSAR,
        currency: dashboardData.budget.currency,
        invoices: dashboardData.budgetLedger
      };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/budget`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      totalBudgetSAR: dashboardData.budget.totalBudgetSAR,
      currency: dashboardData.budget.currency,
      invoices: dashboardData.budgetLedger
    };
  },

  async getRfis() {
    if (!this.isBackendConnected) return dashboardData.rfiSubmittals;
    try {
      const res = await fetch(`${this.activeBaseUrl}/rfis`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.rfiSubmittals;
  },

  async getLiveTelemetry() {
    if (!this.isBackendConnected) {
      return {
        concrete_temp: 28.4,
        crane_tilt: 0.18,
        noise_db: 68.0,
        air_quality_aqi: 28
      };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/telemetry/live`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      concrete_temp: 28.4,
      crane_tilt: 0.18,
      noise_db: 68.0,
      air_quality_aqi: 28
    };
  },

  // Daily Logs ("يوم بيوم")
  async getDailyLogs() {
    if (!this.isBackendConnected) return dashboardData.dailyLogs || [];
    try {
      const res = await fetch(`${this.activeBaseUrl}/daily-logs`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.dailyLogs || [];
  },

  async getTodayDailyLog() {
    if (!this.isBackendConnected) return (dashboardData.dailyLogs && dashboardData.dailyLogs[0]) || null;
    try {
      const res = await fetch(`${this.activeBaseUrl}/daily-logs/today`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return (dashboardData.dailyLogs && dashboardData.dailyLogs[0]) || null;
  },

  async addDailyLog(logData) {
    if (!this.isBackendConnected) {
      if (!dashboardData.dailyLogs) dashboardData.dailyLogs = [];
      dashboardData.dailyLogs.unshift(logData);
      return { success: true, localOnly: true, log_id: logData.id };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/daily-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    if (!dashboardData.dailyLogs) dashboardData.dailyLogs = [];
    dashboardData.dailyLogs.unshift(logData);
    return { success: true, fallback: true, log_id: logData.id };
  },

  // Units & Co-Development Booking
  async getUnits(status) {
    if (!this.isBackendConnected) {
      if (!status) return dashboardData.units || [];
      return (dashboardData.units || []).filter(u => u.status === status);
    }
    try {
      const url = status ? `${this.activeBaseUrl}/units?status=${status}` : `${this.activeBaseUrl}/units`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.units || [];
  },

  async getUnitDetails(unitId) {
    if (!this.isBackendConnected) {
      return (dashboardData.units || []).find(u => u.id === unitId || u.unit_num === unitId) || null;
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/units/${unitId}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return (dashboardData.units || []).find(u => u.id === unitId || u.unit_num === unitId) || null;
  },

  async reserveUnit(reserveData) {
    if (!this.isBackendConnected) {
      const unit = (dashboardData.units || []).find(u => u.id === reserveData.unit_id);
      if (unit) {
        unit.status = "reserved";
        unit.buyer_name = reserveData.buyer_name;
      }
      return { success: true, localOnly: true, unit_num: unit ? unit.unit_num : "302" };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/units/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserveData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  },

  // Buyer Portal ("شقتي")
  async getMyUnit(reservationId = "RES-302-BELAL") {
    if (!this.isBackendConnected) return dashboardData.buyerReservation;
    try {
      const res = await fetch(`${this.activeBaseUrl}/buyer/my-unit?id=${reservationId}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.buyerReservation;
  },

  // Syndicate Votes
  async getSyndicateVotes() {
    if (!this.isBackendConnected) return dashboardData.syndicateVotes || [];
    try {
      const res = await fetch(`${this.activeBaseUrl}/syndicate/votes`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.syndicateVotes || [];
  },

  async submitSyndicateVote(voteId, optionId) {
    if (!this.isBackendConnected) {
      const vote = (dashboardData.syndicateVotes || []).find(v => v.id === voteId);
      if (vote && vote.options) {
        const opt = vote.options.find(o => o.id === optionId);
        if (opt) opt.votes = (opt.votes || 0) + 1;
        const total = vote.options.reduce((sum, o) => sum + (o.votes || 0), 0);
        vote.options.forEach(o => o.pct = Math.round((o.votes / total) * 100));
        vote.total_votes = total;
      }
      return { success: true, localOnly: true };
    }
    try {
      const res = await fetch(`${this.activeBaseUrl}/syndicate/votes/${voteId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_id: optionId }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false };
  }
};
