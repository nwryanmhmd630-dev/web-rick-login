(() => {
  'use strict';
  const KEY = 'webric-draft';
  const DEF = window.WEBRIC_CONFIG;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let draft;
  try { draft = JSON.parse(localStorage.getItem(KEY)) || clone(DEF); } catch (e) { draft = clone(DEF); }
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getP = (o, p) => p.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
  const setP = (o, p, v) => { const ks = p.split('.'); let x = o; ks.slice(0, -1).forEach((k) => { x = x[k]; }); x[ks[ks.length - 1]] = v; };
  const uid = () => Math.random().toString(36).slice(2, 8);
  const GROUPS = ['ظاهر', 'سایت', 'ناوبری', 'دکمه‌ها', 'احراز هویت', 'فرم ثبت‌نام', 'صفحات'];
  const PAGE_NAMES = { home: 'صفحه‌ی اصلی', login: 'ورود', register: 'ثبت‌نام', reset: 'بازیابی', demo: 'نمونه‌ها' };
  const LABELS = {
    title: 'عنوان', eyebrow: 'عنوان کوچک', heading: 'تیتر', text: 'متن', ctaPrimary: 'دکمه‌ی اصلی', ctaSecondary: 'دکمه‌ی دوم',
    previewTitle: 'تیتر پیش‌نمایش', previewText: 'متن پیش‌نمایش', sectionEyebrow: 'عنوان کوچک بخش کارت‌ها', sectionTitle: 'تیتر بخش کارت‌ها', sectionText: 'متن بخش کارت‌ها',
    loginTitle: 'تیتر فرم ورود', loginText: 'متن فرم ورود', passwordLabel: 'برچسب فیلد رمز', tabLogin: 'تب ورود', tabRegister: 'تب ثبت‌نام', registerTitle: 'تیتر تب ثبت‌نام', registerText: 'متن تب ثبت‌نام',
    termsText: 'متن پذیرش قوانین', noticeText: 'متن هشدار', forgotText: 'لینک فراموشی رمز', rememberText: 'متن مرا به خاطر بسپار', sideEyebrow: 'عنوان کوچک کادر کناری', sideTitle: 'تیتر کادر کناری', sideText: 'متن کادر کناری', sideCta: 'دکمه‌ی کادر کناری',
    formTitle: 'تیتر فرم', formText: 'متن فرم',
    step1: 'برچسب مرحله ۱', step2: 'برچسب مرحله ۲', step3: 'برچسب مرحله ۳', s1Title: 'تیتر مرحله ۱', s1Text: 'متن مرحله ۱', s1Label: 'برچسب ورودی مرحله ۱', backText: 'لینک بازگشت',
    s2Title: 'تیتر مرحله ۲', s2Text: 'متن مرحله ۲', s2Label: 'برچسب ورودی مرحله ۲', s2Result: 'پیام مرحله ۲', prevText: 'دکمه‌ی مرحله‌ی قبل', nextText: 'دکمه‌ی مرحله‌ی بعد',
    s3Title: 'تیتر مرحله ۳', s3Text: 'متن مرحله ۳', s3Result: 'پیام مرحله ۳', doneText: 'دکمه‌ی پایان', againText: 'دکمه‌ی مرور دوباره',
    t1Title: 'تیتر کارت ۱', t1Text: 'متن کارت ۱', t2Title: 'تیتر کارت ۲', t2Text: 'متن کارت ۲', t3Title: 'تیتر کارت ۳', t3Text: 'متن کارت ۳',
    boxEyebrow: 'عنوان کوچک کادر', boxTitle: 'تیتر کادر', boxText: 'متن کادر', boxCta: 'دکمه‌ی کادر'
  };
  let tab = GROUPS[0];
  let frameTimer;

  function status(t) { const el = $('#status'); if (el) el.textContent = t; }

  function save(msg) {
    try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch (e) { /* ignore */ }
    status(msg || 'پیش‌نویس ذخیره شد');
    clearTimeout(frameTimer);
    frameTimer = setTimeout(() => { const f = $('#preview'); if (f && f.contentWindow) f.contentWindow.location.reload(); }, 350);
  }

  const setV = (p, v) => { setP(draft, p, v); save(); };

  function schema() {
    const out = [];
    const add = (g, p, l, t, extra) => out.push(Object.assign({ g, p, l, t }, extra || {}));
    add('ظاهر', 'theme.mode', 'تم پیش‌فرض', 'select', { opts: [['dark', 'تیره'], ['light', 'روشن']] });
    add('ظاهر', 'theme.accent', 'رنگ تأکیدی', 'color');
    add('ظاهر', 'theme.radius', 'گردی گوشه‌ها', 'range', { min: 12, max: 36 });
    add('ظاهر', 'theme.blur', 'محوشدگی شیشه', 'range', { min: 0, max: 32 });
    add('سایت', 'site.name', 'نام سایت', 'text');
    add('سایت', 'site.brandMark', 'حرف لوگو', 'text');
    add('سایت', 'site.description', 'توضیح سایت (برای موتورهای جستجو)', 'text');
    add('سایت', 'site.footer', 'متن فوتر', 'text');
    add('سایت', 'site.license', 'متن لایسنس (زیر فوتر)', 'text');
    draft.nav.forEach((n, i) => {
      add('ناوبری', `nav.${i}.label`, `برچسب: ${n.id}`, 'text');
      add('ناوبری', `nav.${i}.visible`, `نمایش: ${n.id}`, 'toggle');
    });
    Object.keys(draft.buttons).forEach((k) => {
      add('دکمه‌ها', `buttons.${k}.text`, `متن دکمه: ${k}`, 'text');
      add('دکمه‌ها', `buttons.${k}.visible`, `نمایش دکمه: ${k}`, 'toggle');
    });
    add('احراز هویت', 'auth.rememberMe', 'نمایش «مرا به خاطر بسپار»', 'toggle');
    add('احراز هویت', 'auth.forgotPassword', 'نمایش لینک فراموشی رمز', 'toggle');
    add('احراز هویت', 'auth.terms', 'نمایش پذیرش قوانین', 'toggle');
    add('احراز هویت', 'auth.register', 'نمایش تب ثبت‌نام در صفحه‌ی ورود', 'toggle');
    Object.keys(draft.pages).forEach((pg) => {
      Object.keys(draft.pages[pg]).forEach((k) => {
        if (typeof draft.pages[pg][k] === 'string') add('صفحات', `pages.${pg}.${k}`, `${PAGE_NAMES[pg] || pg} · ${LABELS[k] || k}`, 'text');
      });
    });
    return out;
  }

  function control(it) {
    const v = getP(draft, it.p);
    const row = document.createElement('div');
    row.className = 'ctl';
    const label = `<span class='lbl'>${esc(it.l)}</span>`;
    if (it.t === 'toggle') {
      row.innerHTML = label + `<input type='checkbox' ${v ? 'checked' : ''}>`;
      row.querySelector('input').addEventListener('change', (e) => setV(it.p, e.target.checked));
    } else if (it.t === 'select') {
      row.innerHTML = label + `<select>${it.opts.map(([val, txt]) => `<option value='${val}' ${val === v ? 'selected' : ''}>${txt}</option>`).join('')}</select>`;
      row.querySelector('select').addEventListener('change', (e) => setV(it.p, e.target.value));
    } else if (it.t === 'range') {
      row.innerHTML = label + `<input type='range' min='${it.min}' max='${it.max}' value='${v}'><output>${v}</output>`;
      row.querySelector('input').addEventListener('input', (e) => { row.querySelector('output').textContent = e.target.value; setV(it.p, Number(e.target.value)); });
    } else if (it.t === 'color') {
      row.innerHTML = label + `<input type='color' value='${esc(v)}'>`;
      row.querySelector('input').addEventListener('change', (e) => setV(it.p, e.target.value));
    } else {
      row.innerHTML = label + `<input type='text' value='${esc(v)}'>`;
      row.querySelector('input').addEventListener('change', (e) => setV(it.p, e.target.value));
    }
    return row;
  }

  function listEditor(title, path, fields, make) {
    const arr = getP(draft, path);
    const wrap = document.createElement('div');
    wrap.className = 'listed';
    const rows = arr.map((item, i) => `<div class='item' data-i='${i}'>` + fields.map((f) => f.t === 'toggle'
      ? `<label class='chk'><input type='checkbox' data-k='${f.k}' ${item[f.k] ? 'checked' : ''}>${esc(f.l)}</label>`
      : `<input type='text' data-k='${f.k}' value='${esc(item[f.k])}' placeholder='${esc(f.l)}'>`).join('') + `<button class='ghost' type='button' data-del='${i}'>حذف</button></div>`).join('');
    wrap.innerHTML = `<h3>${esc(title)}</h3>` + rows + `<div class='add'><input type='text' data-new placeholder='نام مورد جدید'><button class='btn primary' type='button' data-add>افزودن</button></div>`;
    wrap.addEventListener('change', (e) => {
      const k = e.target.dataset.k;
      if (!k) return;
      const i = Number(e.target.closest('.item').dataset.i);
      setV(`${path}.${i}.${k}`, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    });
    wrap.addEventListener('click', (e) => {
      const del = e.target.closest('[data-del]');
      if (del) { arr.splice(Number(del.dataset.del), 1); save('حذف شد'); render(); return; }
      if (e.target.closest('[data-add]')) {
        const name = wrap.querySelector('[data-new]').value.trim();
        if (!name) { status('اول یه اسم بنویس'); return; }
        arr.push(make(name));
        save('اضافه شد');
        render();
      }
    });
    return wrap;
  }

  function render() {
    $('#tabs').innerHTML = GROUPS.map((g) => `<button class='tab ${g === tab ? 'on' : ''}' type='button' data-g='${g}'>${g}</button>`).join('');
    const ed = $('#editor');
    ed.innerHTML = '';
    schema().filter((s) => s.g === tab).forEach((s) => ed.appendChild(control(s)));
    if (tab === 'احراز هویت') {
      ed.appendChild(listEditor('روش‌های ورود', 'auth.methods', [{ k: 'label', l: 'برچسب' }, { k: 'enabled', t: 'toggle', l: 'فعال' }], (name) => ({ id: 'm' + uid(), label: name, type: 'text', enabled: true })));
      ed.appendChild(listEditor('ورود با شبکه‌های اجتماعی', 'auth.social', [{ k: 'label', l: 'برچسب' }, { k: 'enabled', t: 'toggle', l: 'فعال' }], (name) => ({ id: 's' + uid(), label: name, enabled: true })));
    }
    if (tab === 'فرم ثبت‌نام') {
      ed.appendChild(listEditor('فیلدهای فرم ثبت‌نام', 'fields.register', [{ k: 'label', l: 'برچسب' }, { k: 'required', t: 'toggle', l: 'اجباری' }, { k: 'enabled', t: 'toggle', l: 'فعال' }], (name) => ({ id: 'f' + uid(), label: name, type: 'text', required: false, enabled: true })));
    }
    if (tab === 'صفحات') {
      ed.appendChild(listEditor('کارت‌های صفحه‌ی اصلی', 'pages.home.tiles', [{ k: 'title', l: 'تیتر' }, { k: 'text', l: 'متن' }, { k: 'href', l: 'لینک' }], (name) => ({ title: name, text: '', href: 'index.html', icon: '★' })));
    }
  }

  function download(name, text) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/javascript;charset=utf-8' }));
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const asConfig = () => 'window.WEBRIC_CONFIG = ' + JSON.stringify(draft, null, 2) + ';\n';

  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (b) { tab = b.dataset.g; render(); }
  });
  $('#export').addEventListener('click', () => { download('config.js', asConfig()); status('config.js دانلود شد. اون رو توی پوشه‌ی js گیت‌هاب جایگزین کن.'); });
  $('#copy').addEventListener('click', () => {
    navigator.clipboard.writeText(asConfig()).then(() => status('کپی شد')).catch(() => status('مرورگر اجازه‌ی کپی نداد'));
  });
  $('#import').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then((t) => {
      const m = t.match(/=\s*([\s\S]*?);?\s*$/);
      draft = JSON.parse(m[1]);
      save('فایل وارد شد');
      render();
    }).catch(() => status('فایل معتبر نبود'));
  });
  $('#reset').addEventListener('click', () => { draft = clone(DEF); save('به تنظیمات اصلی برگشت'); render(); });
  document.querySelectorAll('[data-page-link]').forEach((b) => {
    b.addEventListener('click', () => { $('#preview').src = b.dataset.pageLink + '?preview=1'; });
  });
  render();
})();
