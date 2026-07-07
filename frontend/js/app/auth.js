window.HMTSTC_APP_AUTH = {
  restoreAuth: async function () {
    const app = window.HMTSTC_APP;

    if (!app || !app.state) {
      return true;
    }

    localStorage.setItem("hmtstc_user", "public");
    localStorage.setItem("hmtstc_token", "public-access");
    localStorage.setItem("hmtstc_role", "admin");
    localStorage.setItem("hmtstc_force_password_change", "false");

    Object.assign(app.state, {
      auth: true,
      token: "public-access",
      user: "public",
      role: "admin",
      forcePasswordChange: false,
      authRestorePending: false,
      authRestoreChecked: true,
      authRestoreError: "",
      loginError: "",
      loginInProgress: false,
      page: app.state.page || "dashboard",
      apiReady: true,
      apiSyncReady: true,
      lastSyncBlockReason: "",
      heavySyncAllowedAtMs: Date.now(),
      authDiagnostics: {
        tokenExists: true,
        authMeStatus: 200,
        lastRestoreAt: new Date().toLocaleTimeString("tr-TR"),
        lastBlockReason: ""
      }
    });

    return true;
  },

  login: async function () {
    const app = window.HMTSTC_APP;

    if (!app || !app.state) {
      return;
    }

    localStorage.setItem("hmtstc_user", "public");
    localStorage.setItem("hmtstc_token", "public-access");
    localStorage.setItem("hmtstc_role", "admin");
    localStorage.setItem("hmtstc_force_password_change", "false");

    Object.assign(app.state, {
      auth: true,
      token: "public-access",
      user: "public",
      role: "admin",
      forcePasswordChange: false,
      authRestorePending: false,
      authRestoreChecked: true,
      authRestoreError: "",
      loginError: "",
      loginInProgress: false,
      page: "dashboard",
      apiReady: true,
      apiSyncReady: true,
      lastSyncBlockReason: ""
    });

    if (app.render) {
      app.render();
    }
  },

  changeOwnPassword: async function () {
    const app = window.HMTSTC_APP;

    if (!app || !app.state) {
      return;
    }

    app.state.forcePasswordChange = false;
    app.state.loginError = "";

    if (app.render) {
      app.render();
    }
  },

  logout: async function () {
    const app = window.HMTSTC_APP;

    if (!app || !app.state) {
      return;
    }

    localStorage.setItem("hmtstc_user", "public");
    localStorage.setItem("hmtstc_token", "public-access");
    localStorage.setItem("hmtstc_role", "admin");
    localStorage.setItem("hmtstc_force_password_change", "false");

    Object.assign(app.state, {
      auth: true,
      token: "public-access",
      user: "public",
      role: "admin",
      forcePasswordChange: false,
      authRestorePending: false,
      authRestoreChecked: true,
      authRestoreError: "",
      loginError: "",
      page: "dashboard",
      apiReady: true,
      apiSyncReady: true,
      lastSyncBlockReason: ""
    });

    if (app.render) {
      app.render();
    }
  },

  renderPasswordChange: function () {
    return "";
  },

  renderLogin: function () {
    return "";
  }
};