// CoBuild PropTech - High Performance Frontend REST API Client
const API_BASE_URL = "https://cobuild-dashboard.onrender.com/api";
const SERVER_ROOT_URL = "https://cobuild-dashboard.onrender.com/";
const LOCAL_API_URL = "http://127.0.0.1:5000/api";
const LOCAL_ROOT_URL = "http://127.0.0.1:5000/";

const CoBuildAPI = {
  isBackendConnected: false,
  activeBaseUrl: API_BASE_URL,

  async checkHealth() {
    // 1. Try local server first (instant if running locally)
    try {
      const localRes = await fetch(LOCAL_ROOT_URL, { signal: AbortSignal.timeout(800) });
      if (localRes.ok) {
        this.isBackendConnected = true;
        this.activeBaseUrl = LOCAL_API_URL;
        return true;
      }
    } catch (e) {}

    // 2. Try remote Render server with short timeout to avoid UI freeze
    try {
      const res = await fetch(SERVER_ROOT_URL, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendConnected = true;
        this.activeBaseUrl = API_BASE_URL;
        return true;
      }
    } catch (e) {}

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
  }
};
