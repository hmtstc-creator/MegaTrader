window.HMTSTC_PAGES = window.HMTSTC_PAGES || {};

window.HMTSTC_PAGES.ruleEditor = function () {
  const data = window.HMTSTC_DATA || {};
  const app = window.HMTSTC_APP || {};
  const rulesPayload = data.rules || {};
  const filters = Array.isArray(rulesPayload.filters) ? rulesPayload.filters : [];
  const strategies = Array.isArray(rulesPayload.strategies) ? rulesPayload.strategies : [];
  const selectedFilters = Array.isArray(rulesPayload.selected_filter_ids) ? rulesPayload.selected_filter_ids.map(String) : [];
  const selectedStrategies = Array.isArray(rulesPayload.selected_strategy_ids) ? rulesPayload.selected_strategy_ids.map(String) : [];
  const activeType = app.state.ruleEditorTab === "strategy" ? "strategy" : "filter";
  const editorActive = ["new", "edit"].indexOf(app.state.ruleEditorMode) !== -1;
  const draft = editorActive && app.getRuleDraft ? app.getRuleDraft(activeType) : "";
  function esc(value) { return (app.escapeHtml || function(v){ return String(v || ''); })(value === undefined || value === null ? "" : value); }
  function js(value) { return JSON.stringify(String(value === undefined || value === null ? "" : value)); }
  function list(items, type, selected) {
    if (!items.length) return '<div class="simple-rule-empty"><b>Kayıt yok</b><span>Yeni butonu ile kayıt ekle.</span></div>';
    return '<div class="simple-rule-list">' + items.map(function (item) {
      const id = String(item.id || "");
      const checked = selected.indexOf(id) !== -1 ? ' checked' : '';
      return '<div class="simple-rule-item"><label><input type="checkbox" ' + checked + ' onchange="HMTSTC_APP.toggleRuleSelection(\'' + type + '\',' + js(id) + ',this.checked)" /> <b>' + esc(item.name || id) + '</b><span>' + esc(id) + '</span></label><div class="simple-rule-actions"><button class="btn btn-ghost btn-small" onclick="HMTSTC_APP.loadRuleToEditor(' + js(id) + ')">Düzelt</button><button class="btn btn-ghost btn-small danger-outline" onclick="HMTSTC_APP.deleteRule(' + js(id) + ')">Sil</button></div></div>';
    }).join('') + '</div>';
  }
  return '<div class="paper-lab-simple-wrap">' +
    '<div class="paper-lab-simple-toolbar"><button class="btn btn-main" onclick="HMTSTC_APP.newSimpleRuleDraft()">Yeni JSON</button><button class="btn btn-main" onclick="HMTSTC_APP.saveRuleSelection()">Seçimi Kaydet</button><button class="btn btn-ghost" onclick="HMTSTC_APP.syncApiData()">Yenile</button></div>' +
    '<div class="paper-lab-simple-page"><section class="paper-lab-simple-lists"><div class="simple-rule-column"><div class="simple-rule-column-title"><span>JSON Filtreler</span><b>' + filters.length + '</b></div>' + list(filters, 'filter', selectedFilters) + '</div><div class="simple-rule-column"><div class="simple-rule-column-title"><span>JSON Stratejiler</span><b>' + strategies.length + '</b></div>' + list(strategies, 'strategy', selectedStrategies) + '</div></section>' +
    '<section class="paper-lab-simple-editor ' + (editorActive ? 'active' : 'disabled') + '"><div class="simple-editor-head"><div><span>Editör</span><b>' + esc(editorActive ? (app.state.ruleEditorActiveId || 'Yeni kayıt') : 'Pasif') + '</b></div><select id="simple-rule-type" onchange="HMTSTC_APP.switchSimpleRuleType(this.value)"><option value="filter" ' + (activeType === 'filter' ? 'selected' : '') + '>Filtre</option><option value="strategy" ' + (activeType === 'strategy' ? 'selected' : '') + '>Strateji</option></select></div><textarea class="simple-rule-code-editor" ' + (editorActive ? '' : 'disabled') + ' spellcheck="false" oninput="HMTSTC_APP.setRuleDraft(document.getElementById(\'simple-rule-type\').value,this.value)">' + esc(draft) + '</textarea><div class="simple-editor-footer"><button class="btn btn-main" ' + (editorActive ? '' : 'disabled') + ' onclick="HMTSTC_APP.saveSimpleRuleDraft()">Kaydet</button></div></section></div>' +
  '</div>';
};
