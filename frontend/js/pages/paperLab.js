window.HMTSTC_PAGES = window.HMTSTC_PAGES || {};
window.HMTSTC_PAGES.paperLab = function () {
  const app = window.HMTSTC_APP || {};
  const rules = window.HMTSTC_DATA.rules || {};
  const lab = window.HMTSTC_DATA.paperLab || {};
  const filters = Array.isArray(rules.filters) ? rules.filters : [];
  const strategies = Array.isArray(rules.strategies) ? rules.strategies : [];
  const combos = Array.isArray(lab.combinations) ? lab.combinations : [];
  const ranking = Array.isArray(lab.ranking) ? lab.ranking : combos.slice().sort(function(a,b){ return Number(b.pnl||0)-Number(a.pnl||0); });
  const logs = Array.isArray(lab.logs) ? lab.logs.slice(-120).reverse() : [];
  function esc(v){ return (app.escapeHtml || String)(v === undefined || v === null ? "" : v); }
  function options(items){ return items.map(function(x){ return '<option value="' + esc(x.id) + '">' + esc(x.name || x.id) + '</option>'; }).join(''); }
  return '<div class="paper-lab-simple-wrap"><div class="paper-lab-simple-toolbar"><select id="paper-filter-id">' + options(filters) + '</select><select id="paper-strategy-id">' + options(strategies) + '</select><input id="paper-max-positions" type="number" min="1" value="1" placeholder="Max pozisyon" /><input id="paper-lot-usdt" type="number" min="1" value="25" placeholder="Lot USDT" /><button class="btn btn-main" onclick="HMTSTC_APP.createPaperLabCombination()">Kombinasyon Başlat</button><button class="btn btn-ghost" onclick="HMTSTC_APP.refreshPaperLab()">Yenile/Tick</button></div>' +
    '<div class="dashboard-grid-two"><section class="dash-jarvis-panel"><h3>Kazanç Sıralaması</h3>' + (ranking.length ? '<table class="dashboard-trade-table"><thead><tr><th>Filtre</th><th>Strateji</th><th>PnL</th><th>Win%</th><th>Açık</th></tr></thead><tbody>' + ranking.map(function(c){return '<tr><td>' + esc(c.filter_id) + '</td><td>' + esc(c.strategy_id) + '</td><td><b>' + esc(Number(c.pnl||0).toFixed(2)) + '</b></td><td>' + esc(c.win_rate || 0) + '</td><td>' + esc((c.open_positions||[]).length) + '</td></tr>';}).join('') + '</tbody></table>' : '<div class="jarvis-empty-mini"><b>Kombinasyon yok</b><span>Filtre + strateji seç ve başlat.</span></div>') + '</section>' +
    '<section class="dash-jarvis-panel"><h3>Paper Lab Log</h3><div class="dashboard-log-list">' + (logs.length ? logs.map(function(l){ return '<div><b>' + esc((l.time||'').replace('T',' ').slice(11,19)) + '</b><span>' + esc(l.message || '') + '</span></div>'; }).join('') : '<div class="jarvis-empty-mini"><b>Log yok</b><span>İlk kombinasyon sonrası dolacak.</span></div>') + '</div></section></div></div>';
};
