window.HMTSTC_APP = {
  state: window.HMTSTC_APP_STATE || {},

  set: function (changes) {
    Object.assign(this.state, changes || {});
    this.render();
  },

  safeRenderAfterSync: function () {
    this.render();
  },

  isUserEditing: function () {
    const activeElement = document.activeElement;

    return !!(
      activeElement &&
      ["INPUT", "SELECT", "TEXTAREA"].includes(activeElement.tagName)
    );
  },

  clearRestrictedData: function () {
    try {
      if (window.HMTSTC_DATA) {
        window.HMTSTC_DATA.user = null;
        window.HMTSTC_DATA.users = [];
        window.HMTSTC_DATA.positions = [];
        window.HMTSTC_DATA.logs = [];
        window.HMTSTC_DATA.history = [];
        window.HMTSTC_DATA.dashboard = null;
        window.HMTSTC_DATA.botStatus = null;
        window.HMTSTC_DATA.settings = null;
        window.HMTSTC_DATA.rules = null;
        window.HMTSTC_DATA.paperLab = null;
        window.HMTSTC_DATA.marketTrend = null;
      }

      if (window.HMTSTC_APP_STATE) {
        window.HMTSTC_APP_STATE.authenticated = false;
        window.HMTSTC_APP_STATE.auth = false;
        window.HMTSTC_APP_STATE.user = null;
        window.HMTSTC_APP_STATE.token = "";
        window.HMTSTC_APP_STATE.activeUser = null;
        window.HMTSTC_APP_STATE.syncInProgress = false;
        window.HMTSTC_APP_STATE.heavySyncInProgress = false;
      }

      if (window.HMTSTC_STATE) {
        window.HMTSTC_STATE.authenticated = false;
        window.HMTSTC_STATE.auth = false;
        window.HMTSTC_STATE.user = null;
        window.HMTSTC_STATE.token = "";
        window.HMTSTC_STATE.activeUser = null;
        window.HMTSTC_STATE.syncInProgress = false;
        window.HMTSTC_STATE.heavySyncInProgress = false;
      }

    } catch (err) {
      console.warn("clearRestrictedData failed:", err);
    }
  }
};

Object.assign(
  window.HMTSTC_APP,
  window.HMTSTC_APP_API || {},
  window.HMTSTC_APP_AUTH || {},
  window.HMTSTC_APP_SETTINGS || {},
  window.HMTSTC_APP_BOT || {},
  window.HMTSTC_APP_RULES || {},
  window.HMTSTC_APP_RENDER || {}
);

if (typeof window.HMTSTC_APP.render !== "function") {
  window.HMTSTC_APP.render = function () {
    if (
      window.HMTSTC_APP_RENDER &&
      typeof window.HMTSTC_APP_RENDER.render === "function"
    ) {
      return window.HMTSTC_APP_RENDER.render.call(window.HMTSTC_APP);
    }

    console.warn("HMTSTC_APP.render bulunamadı");
  };
}