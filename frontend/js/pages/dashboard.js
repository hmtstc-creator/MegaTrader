window.HMTSTC_PAGES = window.HMTSTC_PAGES || {};

window.HMTSTC_PRODUCT_UI = window.HMTSTC_PRODUCT_UI || {
  esc: function (value) { return HMTSTC_APP.escapeHtml(value === undefined || value === null ? "" : value); },
  num: function (value, fallback) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : (fallback || 0); },
  money: function (value) { return this.num(value, 0).toFixed(2) + " USDT"; }
};

window.HMTSTC_DASHBOARD_JARVIS = window.HMTSTC_DASHBOARD_JARVIS || {
  activateOpenMode: async function () { if (window.HMTSTC_APP && HMTSTC_APP.startBot) await HMTSTC_APP.startBot(); },
  activateClosedMode: async function () { if (window.HMTSTC_APP && HMTSTC_APP.stopBot) await HMTSTC_APP.stopBot(); }
};

(function () {
  const ui = window.HMTSTC_PRODUCT_UI;
  function esc(v) { return ui.esc(v); }
  function money(v) { return ui.money(v); }
  function card(title, value, sub) {
    return '<div class="dash-jarvis-panel compact-card"><span>' + esc(title) + '</span><b>' + esc(value) + '</b><em>' + esc(sub || '') + '</em></div>';
  }
  function table(rows) {
    if (!rows.length) return '<div class="jarvis-empty-mini"><b>Kayıt yok</b><span>Henüz işlem oluşmadı.</span></div>';
    return '<table class="dashboard-trade-table"><thead><tr><th>Zaman</th><th>Coin</th><th>Giriş</th><th>Güncel/Çıkış</th><th>PnL</th><th>Mod</th></tr></thead><tbody>' + rows.map(function (r) {
      return '<tr><td>' + esc((r.exit_time || r.entry_time || r.time || '-').replace('T',' ').slice(0,16)) + '</td><td><b>' + esc(r.symbol || '-') + '</b></td><td>' + esc(r.entry || '-') + '</td><td>' + esc(r.exit || r.current || '-') + '</td><td><b>' + esc(Number(r.pnl || 0).toFixed(2)) + '</b></td><td>' + esc(r.execution_mode || '-') + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  function rulesMini(rules) {
    const filters = Array.isArray(rules.selected_filter_ids) ? rules.selected_filter_ids : [];
    const strategies = Array.isArray(rules.selected_strategy_ids) ? rules.selected_strategy_ids : [];
    return '<div class="dashboard-rules-mini"><b>Aktif JSON Filtre</b><span>' + esc(filters.join(', ') || '-') + '</span><b>Aktif JSON Strateji</b><span>' + esc(strategies.join(', ') || '-') + '</span><button class="btn btn-main btn-small" onclick="HMTSTC_APP.set({page:\'ruleEditor\'})">Düzenle</button></div>';
  }

  window.HMTSTC_PAGES.dashboard = function () {
    const d = HMTSTC_DATA.dashboard || {};
    const bot = HMTSTC_DATA.botStatus || {};
    const settings = HMTSTC_DATA.settings || {};
    const mode = String(((settings.api || {}).mode) || bot.mode || 'test') === 'live' ? 'live' : 'test';
    const positions = Array.isArray(HMTSTC_DATA.positions) ? HMTSTC_DATA.positions : [];
    const history = Array.isArray(HMTSTC_DATA.history) ? HMTSTC_DATA.history : [];
    const logs = Array.isArray(HMTSTC_DATA.logs) ? HMTSTC_DATA.logs.slice(-80).reverse() : [];
    const scan = HMTSTC_DATA.botScan || {};
    const rules = HMTSTC_DATA.rules || {};
    return '<div class="dashboard-jarvis-shell dashboard-fit-inner">' +
      '<section class="dashboard-hero-card"><div><span>HMTSTC SIMPLE BOT</span><h1>Test / Canlı JSON Filtre + JSON Strateji</h1><p>CoinFilter sayfası yok. Binance verisi alınır, seçili JSON filtre adayları çıkarır, seçili JSON strateji sinyal üretir.</p></div>' +
      '<div class="dashboard-mode-card"><label>İşlem Modu</label><select id="hmtstc-trade-mode-select" onchange="HMTSTC_APP.setTradeMode(this.value)"><option value="test" ' + (mode === 'test' ? 'selected' : '') + '>Test Modu</option><option value="live" ' + (mode === 'live' ? 'selected' : '') + '>Canlı Mod</option></select><div><button class="btn btn-main" onclick="HMTSTC_APP.startBot()">Bot Başlat</button><button class="btn btn-ghost" onclick="HMTSTC_APP.stopBot()">Bot Durdur</button></div></div></section>' +
      '<section class="dashboard-grid-main">' +
        card('Bot', bot.bot_running ? 'Çalışıyor' : 'Kapalı', bot.engine_status || '-') +
        card('Bütçe', money(d.allocated_usdt || ((settings.bot || {}).allocated_usdt)), 'Ayarlar sayfasındaki bot bütçesi') +
        card('USDT / Pozisyon', money(d.usdt_per_position || ((settings.bot || {}).usdt_per_position)), 'Lot büyüklüğü') +
        card('Aday Coin', scan.candidates_count || 0, 'Son JSON filtre taraması') +
        card('Açık Pozisyon', positions.length, 'Anlık takip') +
        card('PnL', money(d.total_pnl || 0), 'Açık + gerçekleşmiş') +
      '</section>' +
      '<section class="dashboard-grid-two"><div class="dash-jarvis-panel"><h3>Aktif Filtre / Strateji</h3>' + rulesMini(rules) + '</div><div class="dash-jarvis-panel"><h3>Son Scan</h3><p>Son zaman: ' + esc(scan.time || '-') + '</p><p>Taranan: ' + esc(scan.scanned || 0) + ' / Aday: ' + esc(scan.candidates_count || 0) + ' / Elenen: ' + esc(scan.rejected_count || 0) + '</p></div></section>' +
      '<section class="dash-jarvis-panel"><h3>Açık Pozisyonlar</h3><div class="dashboard-trade-table-wrap">' + table(positions) + '</div></section>' +
      '<section class="dash-jarvis-panel"><h3>İşlem Geçmişi</h3><div class="dashboard-trade-table-wrap">' + table(history.slice(-80).reverse()) + '</div></section>' +
      '<section class="dash-jarvis-panel"><h3>Canlı Log</h3><div class="dashboard-log-list">' + (logs.length ? logs.map(function(l){return '<div><b>' + esc((l.time || '').replace('T',' ').slice(11,19)) + '</b><span>' + esc(l.message || '') + '</span></div>';}).join('') : '<div class="jarvis-empty-mini"><b>Log yok</b><span>Bot işlemleri burada görünecek.</span></div>') + '</div></section>' +
    '</div>';
  };
})();
