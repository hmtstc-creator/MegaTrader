window.HMTSTC_APP_RULES = {
  normalizeIdList: function (list) {
    const seen = {};
    return (Array.isArray(list) ? list : []).map(String).map(function (x) { return x.trim(); }).filter(function (x) { if (!x || seen[x]) return false; seen[x] = true; return true; });
  },
  getRuleDraft: function (type) {
    const key = type === "strategy" ? "strategyRuleDraft" : "filterRuleDraft";
    if (this.state[key] === undefined || this.state[key] === null) this.state[key] = "";
    return this.state[key];
  },
  setRuleDraft: function (type, value) {
    const key = type === "strategy" ? "strategyRuleDraft" : "filterRuleDraft";
    this.state[key] = value;
    this.state.ruleEditorDirty = true;
  },
  defaultRuleDraft: function (type) {
    if (type === "strategy") {
      return JSON.stringify({ id: "my_strategy", name: "Benim Stratejim", type: "strategy", enabled: true, buy: { min_change_percent: 0.5, min_quality_score: 45 }, sell: { take_profit_percent: 1.2, stop_loss_percent: 0.7 } }, null, 2);
    }
    return JSON.stringify({ id: "my_filter", name: "Benim Filtrem", type: "filter", enabled: true, rules: { min_quote_volume: 1000000, min_trade_count: 1000, max_spread_percent: 0.35, excluded_symbols: "USDCUSDT,FDUSDUSDT,BUSDUSDT,TUSDUSDT" } }, null, 2);
  },
  newRuleDraft: function (type) {
    const cleanType = type === "strategy" ? "strategy" : "filter";
    const key = cleanType === "strategy" ? "strategyRuleDraft" : "filterRuleDraft";
    this.state[key] = this.defaultRuleDraft(cleanType);
    this.state.ruleEditorTab = cleanType;
    this.state.ruleEditorMode = "new";
    this.state.ruleEditorActiveId = "";
    this.state.ruleEditorDirty = false;
    this.render();
  },
  newSimpleRuleDraft: function () {
    const selector = document.getElementById("simple-rule-type");
    this.newRuleDraft(selector && selector.value === "strategy" ? "strategy" : "filter");
  },
  switchSimpleRuleType: function (type) {
    const cleanType = type === "strategy" ? "strategy" : "filter";
    this.state.ruleEditorTab = cleanType;
    if (!this.state.ruleEditorMode) this.newRuleDraft(cleanType); else this.render();
  },
  loadRuleToEditor: function (id) {
    const rules = HMTSTC_DATA.rules || {};
    const all = [].concat(rules.filters || [], rules.strategies || []);
    const found = all.find(function (item) { return String(item.id) === String(id); });
    if (!found) return;
    const type = found.type === "strategy" ? "strategy" : "filter";
    this.state.ruleEditorTab = type;
    this.state.ruleEditorMode = "edit";
    this.state.ruleEditorActiveId = found.id;
    this.setRuleDraft(type, JSON.stringify(found, null, 2));
    this.state.ruleEditorDirty = false;
    this.render();
  },
  saveSimpleRuleDraft: async function () {
    const type = this.state.ruleEditorTab === "strategy" ? "strategy" : "filter";
    let rule;
    try { rule = JSON.parse(this.getRuleDraft(type)); } catch (error) { alert("JSON geçersiz: " + error.message); return false; }
    rule.type = type;
    const result = await this.fetchJson("/api/rules/save", { method: "POST", requestKind: "mutation", timeoutMs: 10000, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rule: rule }) });
    HMTSTC_DATA.rules = result;
    this.state.ruleEditorMode = "";
    this.state.ruleEditorDirty = false;
    this.render();
    return true;
  },
  deleteRule: async function (id) {
    if (!confirm("Silinsin mi?")) return false;
    const result = await this.fetchJson("/api/rules/delete", { method: "POST", requestKind: "mutation", timeoutMs: 10000, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: id }) });
    HMTSTC_DATA.rules = result;
    this.render();
    return true;
  },
  toggleRuleSelection: function (type, id, checked) {
    const rules = HMTSTC_DATA.rules || {};
    const key = type === "strategy" ? "selected_strategy_ids" : "selected_filter_ids";
    const current = this.normalizeIdList(rules[key] || []);
    const next = current.filter(function (x) { return x !== String(id); });
    if (checked) next.push(String(id));
    rules[key] = this.normalizeIdList(next);
    HMTSTC_DATA.rules = rules;
    this.render();
  },
  saveRuleSelection: async function () {
    const rules = HMTSTC_DATA.rules || {};
    const result = await this.fetchJson("/api/rules/selection", { method: "POST", requestKind: "mutation", timeoutMs: 10000, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ selected_filter_ids: rules.selected_filter_ids || [], selected_strategy_ids: rules.selected_strategy_ids || [] }) });
    HMTSTC_DATA.rules = result;
    this.render();
    return true;
  },
  createPaperLabCombination: async function () {
    const payload = {
      filter_id: (document.getElementById("paper-filter-id") || {}).value || "",
      strategy_id: (document.getElementById("paper-strategy-id") || {}).value || "",
      max_positions: Number((document.getElementById("paper-max-positions") || {}).value || 1),
      lot_usdt: Number((document.getElementById("paper-lot-usdt") || {}).value || 25)
    };
    const result = await this.fetchJson("/api/paper-lab/combination", { method: "POST", requestKind: "mutation", timeoutMs: 15000, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    HMTSTC_DATA.paperLab = result;
    this.render();
    return true;
  },
  refreshPaperLab: async function () {
    const result = await this.fetchJson("/api/paper-lab", { requestKind: "core_read", timeoutMs: 15000 });
    HMTSTC_DATA.paperLab = result;
    this.render();
    return true;
  }
};
