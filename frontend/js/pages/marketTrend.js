window.HMTSTC_PAGES = window.HMTSTC_PAGES || {};
window.HMTSTC_PAGES.marketTrend = function () {
  const app = window.HMTSTC_APP || {};
  const trend = window.HMTSTC_DATA.marketTrend || {};
  const rows = Array.isArray(trend.rows) ? trend.rows : [];
  function esc(v){ return (app.escapeHtml || String)(v === undefined || v === null ? "" : v); }
  return '<div class="dashboard-jarvis-shell dashboard-fit-inner"><section class="dashboard-hero-card"><div><span>Binance Piyasa Özeti</span><h1>Piyasa Trend</h1><p>Bot kararından bağımsızdır. Binance public 24h verisi ile yön, BTC ağırlığı, altcoin iştahı ve hacim özeti verir.</p></div><button class="btn btn-main" onclick="HMTSTC_APP.syncApiData()">Yenile</button></section><section class="dash-jarvis-panel"><h3>Özet</h3><p><b>' + esc(trend.direction || '-') + '</b> — ' + esc(trend.summary || '-') + '</p></section><section class="dash-jarvis-panel"><h3>Tablo</h3><table class="dashboard-trade-table"><thead><tr><th>Metrik</th><th>Değer</th><th>Yorum</th></tr></thead><tbody>' + rows.map(function(r){return '<tr><td><b>' + esc(r.metrik) + '</b></td><td>' + esc(r.değer) + '</td><td>' + esc(r.yorum) + '</td></tr>';}).join('') + '</tbody></table></section></div>';
};
