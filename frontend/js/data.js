window.HMTSTC_RUNTIME_CONFIG = window.HMTSTC_RUNTIME_CONFIG || {};
window.HMTSTC_API_BASE = window.HMTSTC_RUNTIME_CONFIG.apiBase || window.HMTSTC_API_BASE || "";
window.HMTSTC_BUILD_LABEL = window.HMTSTC_RUNTIME_CONFIG.buildLabel || localStorage.getItem("hmtstc_build_label") || "local";

window.HMTSTC_DATA = {
  menu: [
    ["dashboard", "Dashboard", null, "Bot"],
    ["ruleEditor", "Strateji ve Filtreler", null, "Bot"],
    ["paperLab", "Paper Lab", ["owner", "admin"], "Admin"],
    ["marketTrend", "Piyasa Trend", null, "Bilgi"],
    ["settings", "Ayarlar", null, "Bot"]
  ],
  dashboard: {},
  settings: {},
  botStatus: {},
  botScan: { status: "idle", candidates: [], scan_rows: [] },
  positions: [],
  history: [],
  logs: [],
  operation: { lines: [] },
  rules: { status: "idle", filters: [], strategies: [], selected_filter_ids: [], selected_strategy_ids: [], activation_log: [] },
  paperLab: { status: "idle", combinations: [], ranking: [], logs: [] },
  marketTrend: { status: "idle", rows: [] },
  systemStatus: { backend_api: "unknown" }
};
