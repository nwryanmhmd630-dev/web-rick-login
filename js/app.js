(() => {
  'use strict';
  const base = window.WEBRIC_CONFIG || {};
  const params = new URLSearchParams(location.search);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let cfg = clone(base);
  if (params.get('preview') === '1') {
    try { const d = JSON.parse(localStorage.getItem('webric-draft')); if (d) cfg = d; } catch (e) { /* ignore */ }
  }
  const page = document.body.dataset.page || 'home';
  const root = document.documentElement;
  const prefKey = 'webric-v4-preferences';
  let prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(prefKey) || '{}'); } catch (e) { prefs = {}; }
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), cfg);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mode = () => prefs.mode || cfg.theme.mode;

  function accentInk(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 155 ? '#182016' : '#fff';
  }

  function applyTheme() {
    const m = mode();
    root.dataset.theme = m;
    root.style.setProperty('--accent', cfg.theme.accent);
    root.style.setProperty('--accent-ink', accentInk(cfg.theme.accent));
    root.style.setProperty('--radius', cfg.theme.radius + 'px');
    root.style.setProperty('--blur', cfg.theme.blur + 'px');
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-label', m === 'dark' ? 'فعال‌کردن تم روشن' : 'فعال‌کردن تم تیره'));
    document.querySelectorAll('[data-theme-label]').forEach((x) => { x.textContent = m === 'dark' ? 'تم تیره' : 'تم روشن'; });
  }

  function fieldHtml(label, type, required) {
    return `<div class='demo-field'><label>${esc(label)}${required ? ' *' : ''}</label><input class='fake-input' type='${esc(type)}' data-required='${required ? 1 : 0}' aria-label='${esc(label)}'></div>`;
  }

  function renderDynamic() {
    document.querySelectorAll('[data-login-fields]').forEach((c) => {
      const rows = cfg.auth.methods.filter((m) => m.enabled).map((m) => fieldHtml(m.label, m.type, true));
      rows.push(fieldHtml(get('pages.login.passwordLabel') || '', 'password', true));
      c.innerHTML = rows.join('');
    });
    document.querySelectorAll('[data-register-fields]').forEach((c) => {
      c.innerHTML = cfg.fields.register.filter((f) => f.enabled).map((f) => fieldHtml(f.label, f.type, f.required)).join('');
    });
    document.querySelectorAll('[data-social]').forEach((c) => {
      const list = cfg.auth.social.filter((s) => s.enabled);
      c.hidden = !list.length;
      c.innerHTML = list.map((s) => `<button class='btn full' type='button' style='margin-top:10px' data-demo-notice='${esc(s.label)}: این نسخه‌ی نمایشی است.'>${esc(s.label)}</button>`).join('');
    });
    document.querySelectorAll('[data-tiles]').forEach((c) => {
      c.innerHTML = (get('pages.home.tiles') || []).map((t) => `<a class='tile' href='${esc(t.href)}'><span class='tile-icon'>${esc(t.icon)}</span><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p></a>`).join('');
    });
  }

  function fill() {
    const pg = get('pages.' + page) || {};
    document.title = (pg.title ? pg.title + ' | ' : '') + (get('site.name') || '');
    const meta = document.querySelector('meta[name=description]');
    if (meta && get('site.description')) meta.content = get('site.description');
    document.querySelectorAll('[data-cfg]').forEach((el) => { const v = get(el.dataset.cfg); if (v !== undefined && v !== null) el.textContent = v; });
    document.querySelectorAll('[data-cfg-attr]').forEach((el) => { const parts = el.dataset.cfgAttr.split(':'); const v = get(parts[1]); if (v !== undefined) el.setAttribute(parts[0], v); });
    document.querySelectorAll('[data-nav]').forEach((el) => {
      const it = cfg.nav.find((n) => n.id === el.dataset.nav);
      if (!it) return;
      el.textContent = it.label; el.setAttribute('href', it.href); el.hidden = !it.visible;
    });
    document.querySelectorAll('[data-btn]').forEach((el) => {
      const b = cfg.buttons[el.dataset.btn];
      if (!b) return;
      el.textContent = b.text; el.hidden = !b.visible;
    });
    document.querySelectorAll('[data-show]').forEach((el) => { el.hidden = !get(el.dataset.show); });
    renderDynamic();
  }

  function goStep(host, to) {
    host.dataset.current = to;
    host.querySelectorAll('[data-demo-step]').forEach((el) => { el.hidden = Number(el.dataset.demoStep) !== to; });
    host.querySelectorAll('[data-step-marker]').forEach((el) => el.classList.toggle('active', Number(el.dataset.stepMarker) <= to));
  }

  let toastTimer;
  function toast(text) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }

  document.addEventListener('click', (e) => {
    const theme = e.target.closest('[data-theme-toggle]');
    if (theme) {
      prefs.mode = mode() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(prefKey, JSON.stringify(prefs)); } catch (err) { /* ignore */ }
      applyTheme();
      return;
    }
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      const parent = tab.closest('[data-tabs]');
      if (parent) {
        parent.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === tab)));
        document.querySelectorAll('[data-tab-panel]').forEach((p) => { p.hidden = p.dataset.tabPanel !== tab.dataset.tab; });
      }
      return;
    }
    const next = e.target.closest('[data-next-step]');
    if (next) {
      const host = next.closest('[data-reset-demo]');
      const to = Math.min(3, Number(host.dataset.current || 1) + 1);
      goStep(host, to);
      toast(to === 3 ? 'نمایش نمونه کامل شد' : 'به مرحله‌ی بعد رفتید');
      return;
    }
    const back = e.target.closest('[data-back-step]');
    if (back) {
      const host = back.closest('[data-reset-demo]');
      goStep(host, Math.max(1, Number(host.dataset.current || 1) - 1));
      return;
    }
    const restart = e.target.closest('[data-restart]');
    if (restart) { goStep(restart.closest('[data-reset-demo]'), 1); return; }
    const notice = e.target.closest('[data-demo-notice]');
    if (notice) { toast(notice.dataset.demoNotice); return; }
    const submit = e.target.closest('[data-auth-submit]');
    if (submit) {
      const panel = submit.closest('.panel');
      const inputs = [...panel.querySelectorAll('input[data-required]')].filter((i) => i.dataset.required === '1' && i.offsetParent !== null);
      if (inputs.some((i) => !i.value.trim())) { toast('لطفاً همه‌ی فیلدها را پر کنید'); return; }
      const terms = panel.querySelector('[data-terms]');
      if (terms && terms.offsetParent !== null && !terms.checked) { toast('ابتدا قوانین را بپذیرید'); return; }
      toast(submit.textContent.trim() + ' انجام شد؛ این نسخه ایستاست و چیزی ذخیره نشد.');
    }
  });

  function init() {
    const st = document.createElement('style');
    st.textContent = 'input.fake-input{width:100%;color:var(--ink);font:inherit;outline:none;direction:rtl}input.fake-input::placeholder{color:var(--muted)}input.fake-input:focus{border-color:var(--accent)}label{display:flex;gap:8px;align-items:center;cursor:pointer}label input{accent-color:var(--accent)}';
    document.head.appendChild(st);
    applyTheme();
    fill();
  }
  init();
})();
