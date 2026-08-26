// CoBuild PropTech - Frontend REST API Client
const API_BASE_URL = "https://cobuild-dashboard.onrender.com/api";
const SERVER_ROOT_URL = "https://cobuild-dashboard.onrender.com/";

const CoBuildAPI = {
  isBackendConnected: false,

  async checkHealth() {
    try {
      const res = await fetch(SERVER_ROOT_URL, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        this.isBackendConnected = true;
        return true;
      }
    } catch (e) {
      // Fallback check to local server if render is sleeping or offline
      try {
        const localRes = await fetch("http://127.0.0.1:5000/", { signal: AbortSignal.timeout(1000) });
        if (localRes.ok) {
          this.isBackendConnected = true;
          return true;
        }
      } catch (localErr) {
        this.isBackendConnected = false;
      }
    }
    return this.isBackendConnected;
  },

  async getProject() {
    try {
      const res = await fetch(`${API_BASE_URL}/project`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.projectInfo;
  },

  async getReports() {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.reports;
  },

  async getMilestones() {
    try {
      const res = await fetch(`${API_BASE_URL}/milestones`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.upcomingEvents;
  },

  async addMilestone(milestone) {
    try {
      const res = await fetch(`${API_BASE_URL}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestone),
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: false, fallback: true };
  },

  async getFloors() {
    try {
      const res = await fetch(`${API_BASE_URL}/floors`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.floors;
  },

  async getFloorDetails(floorNum) {
    try {
      const res = await fetch(`${API_BASE_URL}/floors/${floorNum}`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.floorBimDetails[floorNum];
  },

  async getBudget() {
    try {
      const res = await fetch(`${API_BASE_URL}/budget`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      totalBudgetSAR: dashboardData.budget.totalBudgetSAR,
      currency: dashboardData.budget.currency,
      invoices: dashboardData.budgetLedger
    };
  },

  async getRfis() {
    try {
      const res = await fetch(`${API_BASE_URL}/rfis`, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return dashboardData.rfiSubmittals;
  },

  async getLiveTelemetry() {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry/live`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      concrete_temp: 28.4,
      crane_tilt: 0.18,
      noise_db: 68.0,
      air_quality_aqi: 28
    };
  }
};
