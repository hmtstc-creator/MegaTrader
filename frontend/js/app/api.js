window.HMTSTC_APP_API = {
  API_REQUEST_KIND: { CORE_READ: "core_read", HEAVY_READ: "heavy_read", MUTATION: "mutation", AUTH_RESTORE: "auth_restore" },
  getApiUrl: function (path) { return (window.HMTSTC_API_BASE || "") + path; },
  getAuthHeaders: function (extraHeaders) {
    const headers = Object.assign({}, extraHeaders || {});
    const token = (this.state && this.state.token) || localStorage.getItem("hmtstc_token") || "";
    if (token) headers.Authorization = "Bearer " + token;
    return headers;
  },
  requestOptions: function (options) {
    const cleanOptions = Object.assign({ cache: "no-store" }, options || {});
    cleanOptions.headers = this.getAuthHeaders(cleanOptions.headers || {});
    return cleanOptions;
  },
  clone: function (value) { return JSON.parse(JSON.stringify(value || {})); },
  apiErrorMessage: function (error, fallback) { return (error && (error.userMessage || error.message || error.detail)) || fallback || "İşlem başarısız."; },
  fetchJson: async function (path, options) {
    const request = this.requestOptions(options || {});
    delete request.requestKind; delete request.preventGlobalAbort;
    const timeoutMs = Number(request.timeoutMs || 10000); delete request.timeoutMs;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    let timer = null;
    if (controller) { request.signal = controller.signal; timer = setTimeout(function () { controller.abort(); }, timeoutMs); }
    try {
      const response = await fetch(this.getApiUrl(path), request);
      const text = await response.text();
      let payload = {};
      try { payload = text ? JSON.parse(text) : {}; } catch (error) { payload = { raw: text }; }
      if (!response.ok) {
        const err = new Error(payload.detail || payload.message || response.statusText || "API hatası");
        err.status = response.status; err.detail = payload.detail || payload.message || response.statusText; err.userMessage = this.apiErrorMessage(err, "API hatası");
        if (response.status === 401 && this.handleUnauthorized) this.handleUnauthorized();
        throw err;
      }
      return payload;
    } catch (error) {
      if (!error.userMessage) error.userMessage = this.apiErrorMessage(error, "Backend erişilemiyor.");
      throw error;
    } finally { if (timer) clearTimeout(timer); }
  },
  handleUnauthorized: function () {
    localStorage.removeItem("hmtstc_user"); localStorage.removeItem("hmtstc_token"); localStorage.removeItem("hmtstc_role"); localStorage.removeItem("hmtstc_force_password_change");
    this.state.auth = false; this.state.token = null; this.state.user = null; this.state.role = "user"; this.state.loginError = "Oturum süresi doldu, tekrar giriş yap."; this.render();
  },
  applySettingsPayload: function (payload) {
    const source = payload && payload.settings ? payload.settings : (payload || {});
    const normalized = this.normalizeSettings ? this.normalizeSettings(source) : source;
    HMTSTC_DATA.settings = normalized;
    return normalized;
  },
  getSettings: function () {
    if (this.normalizeSettings) HMTSTC_DATA.settings = this.normalizeSettings(HMTSTC_DATA.settings || {});
    return HMTSTC_DATA.settings || {};
  },
  renderAfterSync: function () { if (this.render) this.render(); },
  syncNow: async function () { this.state.syncInProgress = false; return this.syncApiData(); },
  syncApiData: async function () {
    if (this.state.authRestorePending || !this.state.auth || this.state.loginInProgress || this.state.forcePasswordChange) return false;
    if (this.isUserEditing() || this.state.syncInProgress) return false;
    this.state.syncInProgress = true;
    try {
      const bundled = await this.fetchJson("/api/dashboard/bundle", { requestKind: this.API_REQUEST_KIND.CORE_READ, timeoutMs: 12000 });
      if (bundled && bundled.status === "ok") {
        if (bundled.build && bundled.build.label) { window.HMTSTC_BUILD_LABEL = bundled.build.label; localStorage.setItem("hmtstc_build_label", bundled.build.label); }
        HMTSTC_DATA.dashboard = bundled.dashboard || {};
        HMTSTC_DATA.positions = Array.isArray(bundled.positions) ? bundled.positions : [];
        HMTSTC_DATA.history = Array.isArray(bundled.history) ? bundled.history : [];
        HMTSTC_DATA.logs = Array.isArray(bundled.logs) ? bundled.logs : ((bundled.logs || {}).logs || []);
        HMTSTC_DATA.logsPayload = bundled.logs || { status: "ok", logs: HMTSTC_DATA.logs };
        HMTSTC_DATA.settings = this.applySettingsPayload(bundled.settings || {});
        HMTSTC_DATA.botStatus = bundled.botStatus || {};
        HMTSTC_DATA.botScan = bundled.botScan || { status: "idle", candidates: [], scan_rows: [] };
        HMTSTC_DATA.rules = bundled.rules || { status: "ok", filters: [], strategies: [] };
        HMTSTC_DATA.paperLab = bundled.paperLab || { status: "idle", combinations: [], ranking: [], logs: [] };
        HMTSTC_DATA.marketTrend = bundled.marketTrend || { status: "idle", rows: [] };
        HMTSTC_DATA.systemStatus = Object.assign({}, HMTSTC_DATA.systemStatus || {}, { backend_api: "online", bundle_status: "ok" });
        this.state.settingsLoaded = true; this.state.apiReady = true; this.state.apiSyncReady = true; this.state.lastSyncAt = new Date().toLocaleTimeString("tr-TR");
      }
      this.renderAfterSync(); return true;
    } catch (error) {
      HMTSTC_DATA.systemStatus = Object.assign({}, HMTSTC_DATA.systemStatus || {}, { backend_api: "error", last_api_error_message: this.apiErrorMessage(error, "Sync başarısız") });
      this.state.apiReady = false; this.state.apiSyncReady = false; this.renderAfterSync(); return false;
    } finally { this.state.syncInProgress = false; }
  },
  syncHeavyApiData: async function () { return this.syncApiData(); }
};
