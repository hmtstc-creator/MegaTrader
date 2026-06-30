window.HMTSTC_APP_BOT = {
  normalizeTradeMode: function (value) {
    return String(value || "test").toLowerCase() === "live" ? "live" : "test";
  },

  getSelectedTradeMode: function () {
    const select = document.getElementById("hmtstc-trade-mode-select");
    if (select && select.value) return this.normalizeTradeMode(select.value);
    const settings = HMTSTC_DATA.settings || {};
    const bot = HMTSTC_DATA.botStatus || {};
    return this.normalizeTradeMode(((settings.api || {}).mode) || bot.mode || "test");
  },

  setTradeMode: async function (mode) {
    const cleanMode = this.normalizeTradeMode(mode);
    const settings = this.clone ? this.clone(HMTSTC_DATA.settings || {}) : JSON.parse(JSON.stringify(HMTSTC_DATA.settings || {}));
    settings.api = Object.assign({}, settings.api || {}, { mode: cleanMode });
    settings.bot = Object.assign({}, settings.bot || {}, { default_mode: cleanMode });
    HMTSTC_DATA.settings = settings;
    this.pushOperationLine((cleanMode === "live" ? "Canlı Mod" : "Test Modu") + " seçildi.");
    try {
      const result = await this.fetchJson("/api/settings", {
        method: "POST",
        requestKind: "mutation",
        preventGlobalAbort: true,
        timeoutMs: 10000,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: JSON.stringify(settings)
      });
      HMTSTC_DATA.settings = result.settings || settings;
      this.render();
      return true;
    } catch (error) {
      this.pushOperationLine("HATA: İşlem modu kaydedilemedi.");
      this.render();
      return false;
    }
  },

  beginBotCommand: function (command) {
    if (this.state.botCommandPending) {
      this.pushOperationLine("Bot komutu zaten işleniyor.");
      return false;
    }
    this.state.botCommandPending = command;
    this.state.botCommandPendingSince = Date.now();
    this.render();
    return true;
  },

  endBotCommand: function (command) {
    if (!command || this.state.botCommandPending === command) {
      this.state.botCommandPending = "";
      this.state.botCommandPendingSince = 0;
      this.render();
    }
  },

  pushOperationLine: function (line) {
    const operation = HMTSTC_DATA.operation || { lines: [] };
    const lines = operation.lines || [];
    lines.push(new Date().toLocaleTimeString("tr-TR") + "  " + line);
    HMTSTC_DATA.operation = {
      message: line,
      lines: lines.slice(-4),
      updated_at: new Date().toLocaleTimeString("tr-TR")
    };
    this.render();
  },

  startBot: async function () {
    if (!this.state.auth) {
      this.pushOperationLine("BEKLE: Oturum açılmadan bot başlatılamaz.");
      return;
    }
    if (!this.state.apiReady && !this.state.apiSyncReady) {
      this.pushOperationLine("BEKLE: Backend API online doğrulanmadan bot başlatılamaz.");
      return;
    }
    if ((HMTSTC_DATA.botStatus || {}).requested_running) {
      this.pushOperationLine("Bot çalışma isteği zaten aktif.");
      return;
    }
    if (!this.beginBotCommand("start")) return;

    const mode = this.getSelectedTradeMode();
    this.pushOperationLine((mode === "live" ? "CANLI MOD" : "TEST MODU") + " ile bot başlatılıyor...");

    try {
      const result = await this.fetchJson("/api/bot/start?mode=" + encodeURIComponent(mode), {
        method: "POST",
        requestKind: "mutation",
        preventGlobalAbort: true,
        timeoutMs: 15000
      });
      HMTSTC_DATA.botStatus = Object.assign({}, HMTSTC_DATA.botStatus || {}, result || {}, {
        mode: result.mode || mode,
        execution_mode: result.mode || mode,
        engine_status: result.engine_status || "running"
      });
      this.pushOperationLine((mode === "live" ? "Canlı al-sat komutu gönderildi." : "Test simülasyonu gerçek verilerle çalıştı."));
      await this.syncApiData();
    } catch (error) {
      console.error("Bot başlatma hatası:", error);
      HMTSTC_DATA.botStatus = Object.assign({}, HMTSTC_DATA.botStatus || {}, {
        engine_status: "error",
        last_error: this.apiErrorMessage(error, "Bot başlatılamadı.")
      });
      this.pushOperationLine("HATA: " + this.apiErrorMessage(error, "Bot başlatılamadı."));
    } finally {
      this.endBotCommand("start");
    }
  },

  stopBot: async function () {
    if (!this.state.apiSyncReady) {
      this.pushOperationLine("BEKLE: Sistem doğrulanmadan bot durdurulamaz.");
      return;
    }
    if (!(HMTSTC_DATA.botStatus || {}).bot_running && !(HMTSTC_DATA.botStatus || {}).requested_running) {
      this.pushOperationLine("Bot zaten pasif.");
      return;
    }
    if (!this.beginBotCommand("stop")) return;
    this.pushOperationLine("Bot kapatılıyor...");
    try {
      const result = await this.fetchJson("/api/bot/stop", {
        method: "POST",
        requestKind: "mutation",
        preventGlobalAbort: true,
        timeoutMs: 10000
      });
      HMTSTC_DATA.botStatus = Object.assign({}, HMTSTC_DATA.botStatus || {}, result || {}, {
        bot_running: false,
        requested_running: false,
        engine_status: "stopped",
        stop_reason: result.stop_reason || "user_requested_stop"
      });
      this.pushOperationLine("Bot kapalı.");
      await this.syncApiData();
    } catch (error) {
      console.error("Bot durdurma hatası:", error);
      this.pushOperationLine("HATA: Bot durdurulamadı.");
    } finally {
      this.endBotCommand("stop");
    }
  },

  resetBotData: function () {
    this.set({ resetModal: true });
  },

  confirmResetBotData: async function () {
    try {
      const result = await this.fetchJson("/api/bot/reset", { method: "POST", requestKind: "mutation", timeoutMs: 10000 });
      HMTSTC_DATA.botStatus = result || {};
      HMTSTC_DATA.positions = [];
      HMTSTC_DATA.history = [];
      HMTSTC_DATA.logs = [];
      this.set({ resetModal: false });
      this.pushOperationLine("Bot verileri sıfırlandı.");
      await this.syncApiData();
    } catch (error) {
      this.pushOperationLine("HATA: Bot verileri sıfırlanamadı.");
    }
  }
};
