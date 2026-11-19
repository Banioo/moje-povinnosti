/* =========================================================
   Moje povinnosti – verze 0.1
   Vše běží v telefonu, data se ukládají do localStorage.
   ========================================================= */

// ---------- Kategorie a šablony ----------
const KATEGORIE = {
  bydleni:     { nazev: 'Bydlení' },
  energie:     { nazev: 'Energie' },
  telefon:     { nazev: 'Telefon a internet' },
  predplatne:  { nazev: 'Předplatná' },
  pojisteni:   { nazev: 'Pojištění' },
  auto:        { nazev: 'Auto' },
  doklady:     { nazev: 'Doklady' },
  faktury:     { nazev: 'Faktury' },
  ostatni:     { nazev: 'Ostatní' },
};

// Ikony kategorií (čárové, 24×24). Barva se bere z CSS podle kategorie.
const IKONY = {
  bydleni: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  energie: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  telefon: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  predplatne: '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10.5 9 5 3-5 3z"/>',
  pojisteni: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  auto: '<path d="M5 17H3v-4.5l2-5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5l2 5V17h-2"/><path d="M3 12.5h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
  doklady: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.5-1.5 1.7-2.3 3-2.3s2.5.8 3 2.3"/><path d="M14 10h5M14 14h3"/>',
  faktury: '<path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  ostatni: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};
function ikona(kat) {
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IKONY[kat] || IKONY.ostatni}</svg>`;
}

// typ: 'platba' = něco platím, 'platnost' = hlídám jen datum (STK, doklady)
const SABLONY = [
  { hlavni: true, nazev: 'Nájem', kategorie: 'bydleni', opakovani: 1, typ: 'platba', popis: 'každý měsíc' },
  { hlavni: true, nazev: 'Mobilní tarif', kategorie: 'telefon', opakovani: 1, typ: 'platba', popis: 'T-Mobile, O2, Vodafone' },
  { nazev: 'Internet', kategorie: 'telefon', opakovani: 1, typ: 'platba', popis: 'každý měsíc' },
  { hlavni: true, nazev: 'Elektřina – zálohy', kategorie: 'energie', opakovani: 1, typ: 'platba', vypoved: { lhuta: 1, jednotka: 'mesice' }, popis: 'zálohy + konec fixace', poznamka: 'Lhůtu před koncem fixace si ověřte ve smlouvě.' },
  { nazev: 'Plyn – zálohy', kategorie: 'energie', opakovani: 1, typ: 'platba', vypoved: { lhuta: 1, jednotka: 'mesice' }, popis: 'zálohy + konec fixace', poznamka: 'Lhůtu před koncem fixace si ověřte ve smlouvě.' },
  { hlavni: true, nazev: 'Netflix', kategorie: 'predplatne', opakovani: 1, typ: 'platba', castka: 259, popis: 'od 259 Kč měsíčně' },
  { nazev: 'Spotify', kategorie: 'predplatne', opakovani: 1, typ: 'platba', castka: 185, popis: '185 Kč měsíčně' },
  { nazev: 'Jiné předplatné', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'aplikace, cloud, posilovna' },
  { hlavni: true, nazev: 'Povinné ručení', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { nazev: 'Havarijní pojištění', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { nazev: 'Pojištění domácnosti', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { hlavni: true, nazev: 'STK', kategorie: 'auto', opakovani: 24, typ: 'platnost', popis: 'osobní auto každé 2 roky' },
  { nazev: 'Dálniční známka', kategorie: 'auto', opakovani: 12, typ: 'platba', castka: 2440, popis: 'roční 2 440 Kč' },
  { nazev: 'Servis auta', kategorie: 'auto', opakovani: 12, typ: 'platba', popis: 'olej, prohlídka' },
  { hlavni: true, nazev: 'Občanský průkaz', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  { nazev: 'Cestovní pas', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  { nazev: 'Řidičský průkaz', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  { nazev: 'Faktura', kategorie: 'faktury', opakovani: 0, typ: 'platba', popis: 'jednorázová splatnost' },
  { hlavni: true, nazev: 'Vlastní', kategorie: 'ostatni', opakovani: 0, typ: 'platba', popis: 'cokoli dalšího' },
];

// ---------- Ukládání dat ----------
const KLIC = 'moje-povinnosti-v1';
let data = nacti();

function nacti() {
  try {
    const raw = localStorage.getItem(KLIC);
    if (raw) {
      const d = JSON.parse(raw);
      return { polozky: d.polozky || [], nastaveni: d.nastaveni || {}, upozorneno: d.upozorneno || {} };
    }
  } catch (e) { /* prázdné nebo nedostupné úložiště */ }
  return { polozky: [], nastaveni: {}, upozorneno: {} };
}
function uloz() {
  try { localStorage.setItem(KLIC, JSON.stringify(data)); }
  catch (e) { toast('Data se nepodařilo uložit.'); }
  if (typeof naplanujUpozorneni === 'function') naplanujUpozorneni();
}

// ---------- Práce s datem ----------
const DEN = 86400000;
function dnes() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function zText(s) { // 'YYYY-MM-DD' -> Date (místní půlnoc)
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function naText(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function posunMesice(d, n, kotva) { // kotva = původní den v měsíci (např. 31)
  const den = kotva || d.getDate();
  const cil = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const posledni = new Date(cil.getFullYear(), cil.getMonth() + 1, 0).getDate();
  cil.setDate(Math.min(den, posledni));
  return cil;
}
function rozdilDni(a, b) { return Math.round((a - b) / DEN); } // a - b ve dnech
function hezkeDatum(d) {
  const letos = d.getFullYear() === new Date().getFullYear();
  return `${d.getDate()}. ${d.getMonth() + 1}.${letos ? '' : ' ' + d.getFullYear()}`;
}
function kdy(d) {
  const n = rozdilDni(d, dnes());
  if (n === 0) return 'dnes';
  if (n === 1) return 'zítra';
  if (n === -1) return 'včera';
  if (n > 1 && n <= 14) return `za ${n} ${n < 5 ? 'dny' : 'dní'}`;
  if (n < -1 && n >= -14) return `před ${-n} dny`;
  return hezkeDatum(d);
}

// ---------- Výpočty ----------
const kc = (n) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n || 0)) + ' Kč';

function aktivni() { return data.polozky.filter((p) => !p.hotovo); }

// Všechny splatnosti položky od jejího aktuálního data do 'do' (včetně).
function vyskyty(p, doData) {
  const vysledek = [];
  let d = zText(p.datum);
  if (!d) return vysledek;
  if (!p.opakovani) { if (d <= doData) vysledek.push(d); return vysledek; }
  let i = 0;
  while (d <= doData && i < 500) {
    vysledek.push(d);
    d = posunMesice(d, p.opakovani, p.kotva);
    i++;
  }
  return vysledek;
}

function sumaDo(doData) {
  return aktivni()
    .filter((p) => p.typ === 'platba' && p.castka > 0)
    .reduce((s, p) => s + vyskyty(p, doData).length * p.castka, 0);
}

function prumerMesicne() {
  return aktivni()
    .filter((p) => p.typ === 'platba' && p.castka > 0 && p.opakovani > 0)
    .reduce((s, p) => s + p.castka / p.opakovani, 0);
}

function pristiVyplata() {
  const den = Number(data.nastaveni.vyplata);
  if (!den) return null;
  const t = dnes();
  let d = posunMesice(new Date(t.getFullYear(), t.getMonth(), 1), 0, den);
  if (d <= t) d = posunMesice(new Date(t.getFullYear(), t.getMonth() + 1, 1), 0, den);
  return d;
}

// Výročí smlouvy – u ročních smluv se samo posune na další rok.
function aktualniVyroci(p) {
  if (!p.hlidatVypoved || !p.vyroci) return null;
  let v = zText(p.vyroci);
  const t = dnes();
  if (p.opakovani === 12) {
    let i = 0;
    while (posledniDenVypovedi(v, p) < t && i < 50) { v = posunMesice(v, 12); i++; }
  }
  return v;
}
function posledniDenVypovedi(vyroci, p) {
  const n = Number(p.lhuta) || 0;
  if (p.lhutaJednotka === 'mesice') return posunMesice(vyroci, -n);
  const dny = p.lhutaJednotka === 'dny' ? n : n * 7;
  return new Date(vyroci.getTime() - dny * DEN);
}
function vypoved(p) { // { vyroci, posledniDen, odeslatDo } nebo null
  if (p.vypovedOdeslana) return null;
  const v = aktualniVyroci(p);
  if (!v) return null;
  const posledni = posledniDenVypovedi(v, p);
  if (posledni < dnes()) return null;
  return { vyroci: v, posledniDen: posledni, odeslatDo: new Date(posledni.getTime() - 7 * DEN) };
}

// ---------- Pomocné ----------
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const noveId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}
// Vlastní potvrzovací okno (funguje všude, i tam, kde prohlížeč blokuje systémová okna).
function potvrd(text, ano = 'Ano') {
  return new Promise((hotovo) => {
    const bg = document.createElement('div');
    bg.className = 'dialog-bg';
    bg.innerHTML = `<div class="dialog" role="dialog" aria-modal="true"><p></p>
      <div class="actions"><button class="btn danger" type="button" data-a="1"></button><button class="btn" type="button" data-a="0">Zrušit</button></div></div>`;
    bg.querySelector('p').textContent = text;
    bg.querySelector('[data-a="1"]').textContent = ano;
    bg.addEventListener('click', (e) => {
      const b = e.target.closest('[data-a]');
      if (!b && e.target !== bg) return;
      bg.remove();
      hotovo(b ? b.dataset.a === '1' : false);
    });
    document.body.appendChild(bg);
    bg.querySelector('[data-a="0"]').focus();
  });
}
// V náhledu (artifact) prohlížeč nedovolí stahovat soubory.
function lzeStahovat() {
  if (window.NAHLED) { toast('V náhledu stahování nefunguje. V nainstalované aplikaci ano.'); return false; }
  return true;
}
function textOpakovani(m) {
  return { 0: 'jednorázově', 1: 'měsíčně', 3: 'čtvrtletně', 6: 'pololetně', 12: 'ročně', 24: 'každé 2 roky' }[m] || `každých ${m} měs.`;
}

// ---------- Spodní lišta: přesun zeleného kroužku ----------
function nastavTab(view) {
  const lista = $('.tabbar');
  let aktivni = null;
  lista.querySelectorAll('button').forEach((b) => {
    const je = b.dataset.view === view;
    b.classList.toggle('active', je);
    if (je) { aktivni = b; b.setAttribute('aria-current', 'page'); } else b.removeAttribute('aria-current');
  });
  lista.classList.toggle('bez-vyberu', !aktivni);
  if (aktivni) {
    const x = aktivni.offsetLeft + aktivni.offsetWidth / 2 - 26;
    lista.style.setProperty('--ind-x', x + 'px');
  }
  // První zobrazení bez animace, pak už kroužek přejíždí.
  if (!lista.classList.contains('pripraveno')) requestAnimationFrame(() => requestAnimationFrame(() => lista.classList.add('pripraveno')));
}
window.addEventListener('resize', () => {
  const a = document.querySelector('.tabbar button.active');
  if (a) nastavTab(a.dataset.view);
});

// =========================================================
// Upozornění přímo v telefonu (jen v aplikaci z Google Play / App Store)
// Aplikace si připomínky naplánuje sama v telefonu, bez serveru.
// =========================================================
const NATIVNI = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const PLUGINY = NATIVNI ? window.Capacitor.Plugins : {};
const HODINA_UPOZORNENI = 9;   // v kolik hodin chodí připomínky
const MAX_UPOZORNENI = 60;     // telefony mají limit naplánovaných upozornění

function dnyText(n) { return n === 1 ? 'den' : n < 5 ? 'dny' : 'dní'; }
function vHodinu(d) { const x = new Date(d); x.setHours(HODINA_UPOZORNENI, 0, 0, 0); return x; }

// Seznam upozornění na příští rok, nejbližší první.
function planUpozorneni(ted = new Date()) {
  const t = dnes();
  const konec = new Date(t.getFullYear() + 1, t.getMonth(), t.getDate());
  const plan = [];
  aktivni().forEach((p) => {
    const predem = Number(p.pripomenout) || 3;
    const castka = p.typ === 'platba' && p.castka > 0 ? ` – ${kc(p.castka)}` : '';
    vyskyty(p, konec).forEach((d) => {
      const kdy = vHodinu(new Date(d.getTime() - predem * DEN));
      if (kdy > ted) {
        const nadpis = p.typ === 'platnost'
          ? `Za ${predem} ${dnyText(predem)} končí: ${p.nazev}`
          : predem === 1 ? `Zítra platíš: ${p.nazev}` : `Za ${predem} ${dnyText(predem)} platíš: ${p.nazev}`;
        const text = p.typ === 'platnost' ? `Platnost končí ${hezkeDatum(d)}` : `Splatnost ${hezkeDatum(d)}${castka}`;
        plan.push({ kdy, nadpis, text });
      }
      const vDen = vHodinu(d);
      if (p.typ === 'platba' && vDen > ted) plan.push({ kdy: vDen, nadpis: `Dnes platíš: ${p.nazev}`, text: `Splatnost dnes${castka}` });
    });
    const v = vypoved(p);
    if (v) {
      [21, 7, 1].forEach((n) => {
        const kdy = vHodinu(new Date(v.posledniDen.getTime() - n * DEN));
        if (kdy > ted) plan.push({ kdy, nadpis: `Výpověď: ${p.nazev}`, text: `Výpověď musí dorazit do ${hezkeDatum(v.posledniDen)} (za ${n} ${dnyText(n)}). Jinak se smlouva prodlouží.` });
      });
    }
  });
  plan.sort((a, b) => a.kdy - b.kdy);
  return plan.slice(0, MAX_UPOZORNENI);
}

let _planTimer = null;
function naplanujUpozorneni() {
  if (!NATIVNI || !PLUGINY.LocalNotifications) return;
  clearTimeout(_planTimer);
  _planTimer = setTimeout(async () => {
    const LN = PLUGINY.LocalNotifications;
    try {
      const perm = await LN.checkPermissions();
      if (perm.display !== 'granted') return;
      const cekajici = await LN.getPending();
      if (cekajici.notifications.length) await LN.cancel({ notifications: cekajici.notifications.map((n) => ({ id: n.id })) });
      const plan = planUpozorneni();
      if (plan.length) {
        await LN.schedule({
          notifications: plan.map((n, i) => ({
            id: i + 1, title: n.nadpis, body: n.text,
            schedule: { at: n.kdy, allowWhileIdle: true },
          })),
        });
      }
    } catch (e) { console.warn('Upozornění se nepodařilo naplánovat', e); }
  }, 400);
}

async function povolUpozorneniNativne(tichy = false) {
  const LN = PLUGINY.LocalNotifications;
  if (!LN) return false;
  try {
    let perm = await LN.checkPermissions();
    if (perm.display !== 'granted') perm = await LN.requestPermissions();
    const ok = perm.display === 'granted';
    if (!tichy) toast(ok ? 'Upozornění zapnuta' : 'Upozornění jsou vypnutá. Zapnete je v Nastavení telefonu → Aplikace → Moje povinnosti.');
    if (ok) naplanujUpozorneni();
    return ok;
  } catch { return false; }
}

// Uložení souboru (záloha, kalendář) – v aplikaci přes nabídku Sdílet.
async function ulozSoubor(jmeno, obsah, typ) {
  if (NATIVNI && PLUGINY.Filesystem && PLUGINY.Share) {
    try {
      const f = await PLUGINY.Filesystem.writeFile({ path: jmeno, data: obsah, directory: 'CACHE', encoding: 'utf8' });
      await PLUGINY.Share.share({ title: jmeno, url: f.uri, dialogTitle: 'Uložit nebo poslat' });
    } catch (e) { if (!String(e).includes('cancel')) toast('Soubor se nepodařilo uložit.'); }
    return;
  }
  if (!lzeStahovat()) return;
  const blob = new Blob([obsah], { type: typ });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = jmeno;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

// ---------- Navigace ----------
const NAZVY = { prehled: 'Přehled', seznam: 'Moje povinnosti', pridat: 'Přidat', nastaveni: 'Nastavení', vypoved: 'Výpověď' };
function ukaz(view) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
  nastavTab(view);
  $('#page-title').textContent = NAZVY[view];
  if (view === 'pridat') { delete $('#seznam-sablon').dataset.vse; zobrazSablony(); }
  if (view === 'prehled') vykresliPrehled();
  if (view === 'seznam') vykresliSeznam();
  if (view === 'nastaveni') $('#n-vyplata').value = data.nastaveni.vyplata || '';
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tabbar button').forEach((b) => b.addEventListener('click', () => ukaz(b.dataset.view)));

// ---------- Řádek seznamu ----------
function radek(p) {
  const kat = KATEGORIE[p.kategorie] || KATEGORIE.ostatni;
  const d = zText(p.datum);
  const n = rozdilDni(d, dnes());
  const tridaKdy = p.hotovo ? '' : n < 0 ? 'late' : n <= (p.pripomenout || 3) ? 'soon' : '';
  const v = p.hotovo ? null : vypoved(p);
  let meta = p.typ === 'platnost' && !p.opakovani ? kat.nazev : `${kat.nazev} · ${textOpakovani(p.opakovani)}`;
  if (v) {
    const zbyva = rozdilDni(v.posledniDen, dnes());
    const cls = zbyva <= 7 ? 'danger' : zbyva <= 45 ? 'warn' : '';
    meta += ` · <span class="${cls}">výpověď do ${hezkeDatum(v.posledniDen)}</span>`;
  }
  if (p.vypovedOdeslana && !p.hotovo) meta += ` · <span>výpověď odeslána ${hezkeDatum(zText(p.vypovedOdeslana))}</span>`;
  if (p.hotovo) meta += ' · vyřízeno';
  const castka = p.typ === 'platba' && p.castka > 0 ? kc(p.castka) : (p.typ === 'platnost' ? 'platnost' : '');
  const textKdy = p.typ === 'platnost' ? `do ${hezkeDatum(d)}` : kdy(d);

  const li = document.createElement('li');
  li.className = 'item';
  if (p.hotovo) li.style.opacity = '.55';
  li.innerHTML = `
    <div class="ico k-${KATEGORIE[p.kategorie] ? p.kategorie : 'ostatni'}">${ikona(p.kategorie)}</div>
    <div class="name" title="${esc(p.nazev)}">${esc(p.nazev)}</div>
    <div class="meta">${meta}</div>
    <div class="right"><div class="amount">${castka}</div><div class="when ${tridaKdy}">${textKdy}</div></div>`;
  li.addEventListener('click', (e) => {
    if (e.target.closest('.item-actions')) return;
    const otevreno = li.querySelector('.item-actions');
    document.querySelectorAll('.item-actions').forEach((a) => a.remove());
    if (!otevreno) li.appendChild(akce(p));
  });
  return li;
}

function akce(p) {
  // Uspořádání: informace → vedlejší akce stejně velké v řadě → jedna hlavní akce přes celou šířku.
  const box = document.createElement('div');
  box.className = 'item-actions';
  const text = (t, cls) => {
    const el = document.createElement('p');
    el.className = cls;
    el.textContent = t;
    box.appendChild(el);
  };
  const tlacitko = (t, fn, cls = '') => {
    const b = document.createElement('button');
    b.className = 'btn ' + cls;
    b.type = 'button';
    b.textContent = t;
    b.addEventListener('click', fn);
    return b;
  };
  const v = vypoved(p);
  if (v) text(`Výpověď musí dorazit do ${hezkeDatum(v.posledniDen)} (výročí ${hezkeDatum(v.vyroci)}). Odešlete ji raději do ${hezkeDatum(v.odeslatDo)}`, 'hint');
  if (p.poznamka) text(p.poznamka, 'muted small');

  const vedlejsi = document.createElement('div');
  vedlejsi.className = 'act-row';
  if (lzeVypovedet(p) && !p.vypovedOdeslana) vedlejsi.appendChild(tlacitko('Výpověď', () => otevriVypoved(p)));
  if (p.vypovedOdeslana) vedlejsi.appendChild(tlacitko('Zrušit odeslání', () => { delete p.vypovedOdeslana; uloz(); obnov(); }));
  vedlejsi.appendChild(tlacitko('Upravit', () => otevriFormular(p)));
  if (!NATIVNI) vedlejsi.appendChild(tlacitko('Kalendář', () => stahniIcs([p], `${p.nazev}.ics`)));
  box.appendChild(vedlejsi);

  if (!p.hotovo) {
    const textHotovo = p.typ === 'platba' ? 'Zaplaceno' : (p.opakovani ? 'Hotovo, posunout' : 'Vyřízeno');
    box.appendChild(tlacitko(textHotovo, () => oznacHotovo(p), 'primary'));
  } else {
    box.appendChild(tlacitko('Vrátit zpět', () => { p.hotovo = false; uloz(); obnov(); }, 'primary'));
  }
  return box;
}

function oznacHotovo(p) {
  if (p.opakovani) {
    const dalsi = posunMesice(zText(p.datum), p.opakovani, p.kotva);
    p.datum = naText(dalsi);
    toast(`Další termín: ${hezkeDatum(dalsi)}`);
  } else {
    p.hotovo = true;
    toast('Označeno jako vyřízené');
  }
  uloz();
  obnov();
}

function obnov() {
  const aktivniView = document.querySelector('.view.active').id.replace('view-', '');
  if (aktivniView === 'prehled') vykresliPrehled();
  if (aktivniView === 'seznam') vykresliSeznam();
}

// ---------- Přehled ----------
function vykresliPrehled() {
  const t = dnes();
  const konecMesice = new Date(t.getFullYear(), t.getMonth() + 1, 0);
  $('#stat-mesic').textContent = kc(sumaDo(konecMesice));

  const vyplata = pristiVyplata();
  if (vyplata) {
    $('#stat-vyplata-label').textContent = `Do výplaty (${hezkeDatum(vyplata)})`;
    $('#stat-vyplata').textContent = kc(sumaDo(new Date(vyplata.getTime() - DEN)));
  } else {
    $('#stat-vyplata-label').textContent = 'Příštích 30 dní';
    $('#stat-vyplata').textContent = kc(sumaDo(new Date(t.getTime() + 30 * DEN)));
  }
  const prumer = prumerMesicne();
  $('#stat-prumer').textContent = prumer > 0 ? `Pravidelné platby vás stojí průměrně ${kc(prumer)} měsíčně.` : '';

  // Upozornění
  const box = $('#upozorneni');
  box.innerHTML = '';
  const pridej = (cls, nadpis, text) => {
    const div = document.createElement('div');
    div.className = 'alert ' + cls;
    div.innerHTML = `<strong>${nadpis}</strong>${text}`;
    box.appendChild(div);
  };
  const po = aktivni().filter((p) => p.typ === 'platba' && zText(p.datum) < t);
  if (po.length) pridej('danger', 'Po splatnosti', po.map((p) => `${esc(p.nazev)} (${hezkeDatum(zText(p.datum))})`).join(', '));

  aktivni().forEach((p) => {
    const v = vypoved(p);
    if (!v) return;
    const zbyva = rozdilDni(v.posledniDen, t);
    if (zbyva <= 45) {
      pridej(zbyva <= 7 ? 'danger' : '', `Výpověď: ${esc(p.nazev)}`,
        `Pokud chcete změnit nebo zrušit, výpověď musí dorazit do ${hezkeDatum(v.posledniDen)} (${kdy(v.posledniDen)}). Jinak se smlouva prodlouží.`);
    }
  });
  const konci = aktivni().filter((p) => p.typ === 'platnost' && rozdilDni(zText(p.datum), t) <= 60);
  if (konci.length) pridej('', 'Končí platnost', konci.map((p) => `${esc(p.nazev)} ${zText(p.datum) < t ? 'už skončila' : 'do ' + hezkeDatum(zText(p.datum))}`).join(', '));

  // Nejbližší termíny
  const ul = $('#seznam-nejblizsi');
  ul.innerHTML = '';
  const serazene = aktivni().sort((a, b) => zText(a.datum) - zText(b.datum)).slice(0, 8);
  serazene.forEach((p) => ul.appendChild(radek(p)));
  $('#prazdno-prehled').hidden = data.polozky.length > 0;
}

// ---------- Seznam ----------
let filtr = 'vse';
function vykresliSeznam() {
  const f = $('#filtry');
  f.innerHTML = '';
  const pouzite = new Set(data.polozky.map((p) => p.kategorie));
  const moznosti = [['vse', 'Vše'], ...Object.entries(KATEGORIE).filter(([k]) => pouzite.has(k)).map(([k, v]) => [k, v.nazev])];
  moznosti.forEach(([k, n]) => {
    const b = document.createElement('button');
    b.className = 'chip' + (filtr === k ? ' active' : '');
    b.textContent = n;
    b.addEventListener('click', () => { filtr = k; vykresliSeznam(); });
    f.appendChild(b);
  });
  const ul = $('#seznam-vse');
  ul.innerHTML = '';
  const vybrane = data.polozky
    .filter((p) => filtr === 'vse' || p.kategorie === filtr)
    .sort((a, b) => (a.hotovo - b.hotovo) || (zText(a.datum) - zText(b.datum)));
  vybrane.forEach((p) => ul.appendChild(radek(p)));
  $('#prazdno-seznam').hidden = vybrane.length > 0;
}

// ---------- Přidání / úprava ----------
function zobrazSablony() {
  $('#sablony').hidden = false;
  $('#formular').hidden = true;
  const box = $('#seznam-sablon');
  box.innerHTML = '';
  // Nejdřív jen nejčastější šablony, ostatní po rozbalení.
  const vse = box.dataset.vse === '1';
  const zobrazit = vse ? SABLONY : SABLONY.filter((s) => s.hlavni);
  zobrazit.forEach((s) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tpl';
    b.innerHTML = `<span class="ico k-${s.kategorie}">${ikona(s.kategorie)}</span><span class="t">${esc(s.nazev)}</span><span class="d">${esc(s.popis)}</span>`;
    b.addEventListener('click', () => otevriFormular(null, s));
    box.appendChild(b);
  });
  if (!vse) {
    const dalsi = document.createElement('button');
    dalsi.type = 'button';
    dalsi.className = 'btn full tpl-more';
    dalsi.textContent = `Další šablony (${SABLONY.length - zobrazit.length})`;
    dalsi.addEventListener('click', () => { box.dataset.vse = '1'; zobrazSablony(); });
    box.appendChild(dalsi);
  }
}

function naplnKategorie() {
  $('#f-kategorie').innerHTML = Object.entries(KATEGORIE).map(([k, v]) => `<option value="${k}">${v.nazev}</option>`).join('');
}

let aktualniTyp = 'platba';
function otevriFormular(polozka, sablona) {
  ukazJenFormular();
  const p = polozka || {
    id: '', nazev: sablona.nazev === 'Vlastní' ? '' : sablona.nazev, kategorie: sablona.kategorie,
    castka: sablona.castka || '', opakovani: sablona.opakovani, typ: sablona.typ,
    datum: naText(dnes()), hlidatVypoved: !!sablona.vypoved, vyroci: '',
    lhuta: sablona.vypoved ? sablona.vypoved.lhuta : 6, lhutaJednotka: sablona.vypoved ? sablona.vypoved.jednotka : 'tydny',
    pripomenout: sablona.typ === 'platnost' ? 30 : 3, poznamka: sablona.poznamka || '',
  };
  aktualniTyp = p.typ;
  $('#f-id').value = p.id;
  $('#f-nazev').value = p.nazev;
  $('#f-kategorie').value = p.kategorie;
  $('#f-castka').value = p.castka || '';
  $('#f-opakovani').value = String(p.opakovani);
  $('#f-datum').value = p.datum;
  $('#f-hlidat-vypoved').checked = !!p.hlidatVypoved;
  $('#f-vyroci').value = p.vyroci || '';
  $('#f-lhuta').value = p.lhuta ?? 6;
  $('#f-lhuta-jednotka').value = p.lhutaJednotka || 'tydny';
  $('#f-pripomenout').value = String(p.pripomenout || 3);
  $('#f-poznamka').value = p.poznamka || '';
  $('#f-smazat').hidden = !p.id;
  $('#f-datum-label').textContent = p.typ === 'platnost' ? 'Platnost do' : 'Datum splatnosti (nejbližší)';
  $('#f-castka').closest('label').style.display = p.typ === 'platnost' ? 'none' : '';
  $('#page-title').textContent = p.id ? 'Upravit' : p.nazev || 'Přidat';
  prepniVypoved();
}
function ukazJenFormular() {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-pridat'));
  nastavTab('pridat');
  $('#sablony').hidden = true;
  $('#formular').hidden = false;
  window.scrollTo(0, 0);
}

function prepniVypoved() {
  const zap = $('#f-hlidat-vypoved').checked;
  $('#vypoved-pole').hidden = !zap;
  if (zap && !$('#f-vyroci').value) $('#f-vyroci').value = $('#f-datum').value;
  nahledVypovedi();
}
function nahledVypovedi() {
  const el = $('#vypoved-nahled');
  if (!$('#f-hlidat-vypoved').checked || !$('#f-vyroci').value) { el.textContent = ''; return; }
  const p = { hlidatVypoved: true, vyroci: $('#f-vyroci').value, lhuta: $('#f-lhuta').value, lhutaJednotka: $('#f-lhuta-jednotka').value, opakovani: Number($('#f-opakovani').value) };
  const v = vypoved(p);
  el.textContent = v
    ? `Poslední den pro doručení výpovědi: ${hezkeDatum(v.posledniDen)} (${kdy(v.posledniDen)}).`
    : 'Lhůta pro výpověď už uplynula.';
}
['#f-vyroci', '#f-lhuta', '#f-lhuta-jednotka', '#f-opakovani'].forEach((s) => $(s).addEventListener('input', nahledVypovedi));
$('#f-hlidat-vypoved').addEventListener('change', prepniVypoved);
$('#f-zrusit').addEventListener('click', () => ($('#f-id').value ? ukaz('seznam') : zobrazSablony()));

$('#formular').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = $('#f-id').value;
  const datum = $('#f-datum').value;
  const p = {
    id: id || noveId(),
    nazev: $('#f-nazev').value.trim(),
    kategorie: $('#f-kategorie').value,
    castka: Math.max(0, Number($('#f-castka').value) || 0),
    opakovani: Number($('#f-opakovani').value),
    typ: aktualniTyp,
    datum,
    kotva: zText(datum).getDate(),
    hlidatVypoved: $('#f-hlidat-vypoved').checked,
    vyroci: $('#f-hlidat-vypoved').checked ? $('#f-vyroci').value : '',
    lhuta: Number($('#f-lhuta').value) || 0,
    lhutaJednotka: $('#f-lhuta-jednotka').value,
    pripomenout: Number($('#f-pripomenout').value),
    poznamka: $('#f-poznamka').value.trim(),
    hotovo: false,
  };
  if (!p.nazev) { toast('Vyplňte název.'); return; }
  const i = data.polozky.findIndex((x) => x.id === id);
  if (i >= 0) data.polozky[i] = p; else data.polozky.push(p);
  uloz();
  toast(id ? 'Uloženo' : 'Přidáno');
  if (NATIVNI && !id) povolUpozorneniNativne(true);
  ukaz('prehled');
});

$('#f-smazat').addEventListener('click', async () => {
  const id = $('#f-id').value;
  if (!id || !(await potvrd('Opravdu smazat tuto povinnost?', 'Smazat'))) return;
  data.polozky = data.polozky.filter((p) => p.id !== id);
  uloz();
  toast('Smazáno');
  ukaz('seznam');
});

// ---------- Výpověď na 1 klik ----------
// Vzory jsou obecné. Konkrétní podmínky (lhůty, forma doručení) má každá smlouva své.
function druhVypovedi(p) {
  if (p.kategorie === 'pojisteni') return /ručení|havarij/i.test(p.nazev) ? 'pojisteni-auto' : 'pojisteni';
  if (p.kategorie === 'energie') return 'energie';
  if (p.kategorie === 'telefon') return 'telefon';
  if (p.kategorie === 'bydleni' && /nájem|najem/i.test(p.nazev)) return 'najem';
  return 'obecna';
}
function lzeVypovedet(p) {
  return !p.hotovo && (p.hlidatVypoved || ['pojisteni', 'energie', 'telefon', 'predplatne', 'bydleni'].includes(p.kategorie));
}
const EXTRA = {
  'pojisteni-auto': 'SPZ vozidla',
  energie: 'EAN / EIC kód odběrného místa (najdete na faktuře)',
  telefon: 'Telefonní číslo',
  najem: 'Adresa pronajatého bytu',
};
const czDatum = (s) => { const d = zText(s); return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`; };

let vypovedPolozka = null;
function otevriVypoved(p) {
  vypovedPolozka = p;
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-vypoved'));
  nastavTab(null);
  $('#page-title').textContent = 'Výpověď: ' + p.nazev;
  const o = data.nastaveni.osoba || {};
  $('#v-jmeno').value = o.jmeno || '';
  $('#v-adresa').value = o.adresa || '';
  $('#v-narozeni').value = o.narozeni || '';
  $('#v-firma').value = p.firma || '';
  $('#v-firma-adresa').value = p.firmaAdresa || '';
  $('#v-cislo').value = p.cisloSmlouvy || '';
  $('#v-extra').value = p.extra || '';
  const druh = druhVypovedi(p);
  $('#v-extra-wrap').hidden = !EXTRA[druh];
  $('#v-extra-label').textContent = EXTRA[druh] || '';
  const v = vypoved(p);
  $('#v-ke-dni').value = v ? naText(v.vyroci) : (p.vyroci || p.datum);
  $('#v-info').textContent = v
    ? `Výpověď musí dorazit do ${hezkeDatum(v.posledniDen)} Odešlete ji nejpozději ${hezkeDatum(v.odeslatDo)}`
    : 'Vyplňte údaje a vytvořím text výpovědi.';
  $('#v-form').hidden = false;
  $('#v-vysledek').hidden = true;
  window.scrollTo(0, 0);
}

function textVypovedi(p, u) {
  const druh = druhVypovedi(p);
  const cislo = u.cislo ? ` č. ${u.cislo}` : '';
  const keDni = czDatum(u.keDni);
  let vec, telo;
  const potvrzeni = 'Prosím o písemné potvrzení přijetí této výpovědi a o sdělení data ukončení smlouvy.';
  if (druh === 'pojisteni' || druh === 'pojisteni-auto') {
    const auto = druh === 'pojisteni-auto' && u.extra ? ` (vozidlo RZ ${u.extra})` : '';
    vec = `Výpověď pojistné smlouvy${cislo}`;
    telo = `tímto vypovídám pojistnou smlouvu${cislo}${auto} ke konci pojistného období, tj. k výročnímu dni ${keDni}.\n\n${potvrzeni}`;
    if (druh === 'pojisteni-auto') telo += '\n\nZároveň Vás žádám o vystavení potvrzení o škodním průběhu pojištění.';
    telo += '\n\nPřípadný přeplatek pojistného prosím vraťte na účet, ze kterého bylo pojistné hrazeno.';
  } else if (druh === 'energie') {
    const komodita = /plyn/i.test(p.nazev) ? 'plynu' : 'elektřiny';
    const misto = u.extra ? ` pro odběrné místo ${u.extra}` : '';
    vec = `Výpověď smlouvy o dodávce ${komodita}${cislo}`;
    telo = `tímto vypovídám smlouvu o dodávce ${komodita}${cislo}${misto} ke dni ${keDni}, případně k nejbližšímu možnému dni podle smlouvy.\n\n${potvrzeni}\n\nZároveň Vás žádám o vystavení konečného vyúčtování.`;
  } else if (druh === 'telefon') {
    const tel = u.extra ? ` pro telefonní číslo ${u.extra}` : '';
    vec = `Výpověď smlouvy o poskytování služeb${cislo}`;
    telo = `tímto vypovídám smlouvu o poskytování služeb elektronických komunikací${cislo}${tel} ke dni ${keDni}, případně k nejbližšímu možnému dni podle smlouvy.\n\n${potvrzeni}\n\nZároveň Vás žádám o vystavení konečného vyúčtování.`;
  } else if (druh === 'najem') {
    const byt = u.extra ? ` k bytu na adrese ${u.extra}` : '';
    vec = `Výpověď nájemní smlouvy${cislo}`;
    telo = `tímto vypovídám nájemní smlouvu${cislo}${byt}. Žádám o ukončení nájmu ke dni ${keDni}, případně uplynutím výpovědní doby podle smlouvy a zákona.\n\n${potvrzeni} Rád(a) se domluvím na termínu předání bytu a vrácení jistoty.`;
  } else {
    vec = `Výpověď smlouvy${cislo}`;
    telo = `tímto vypovídám smlouvu${cislo} (${p.nazev}) ke dni ${keDni}, případně k nejbližšímu možnému dni podle smlouvy.\n\n${potvrzeni}`;
  }
  const odesilatel = [u.jmeno, u.adresa, u.narozeni ? `Datum narození: ${czDatum(u.narozeni)}` : ''].filter(Boolean).join('\n');
  const prijemce = [u.firma, u.firmaAdresa].filter(Boolean).join('\n');
  return {
    vec,
    text: `${odesilatel}\n\n${prijemce}\n\nDne ${czDatum(naText(dnes()))}\n\nVěc: ${vec}\n\nDobrý den,\n\n${telo}\n\nS pozdravem\n\n\n${u.jmeno}\n(podpis)`,
  };
}

let posledniVypoved = null;
$('#v-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const p = vypovedPolozka;
  const u = {
    jmeno: $('#v-jmeno').value.trim(), adresa: $('#v-adresa').value.trim(), narozeni: $('#v-narozeni').value,
    firma: $('#v-firma').value.trim(), firmaAdresa: $('#v-firma-adresa').value.trim(),
    cislo: $('#v-cislo').value.trim(), extra: $('#v-extra').value.trim(), keDni: $('#v-ke-dni').value,
  };
  // Zapamatovat údaje pro příště (jen v telefonu).
  data.nastaveni.osoba = { jmeno: u.jmeno, adresa: u.adresa, narozeni: u.narozeni };
  Object.assign(p, { firma: u.firma, firmaAdresa: u.firmaAdresa, cisloSmlouvy: u.cislo, extra: u.extra });
  uloz();
  posledniVypoved = textVypovedi(p, u);
  $('#v-text').textContent = posledniVypoved.text;
  const v = vypoved(p);
  $('#v-rada').textContent = (v ? `Výpověď musí firmě dorazit do ${hezkeDatum(v.posledniDen)} ` : '')
    + 'Rozhoduje den doručení, ne odeslání. Nejjistější je doporučený dopis s dodejkou nebo datová schránka. E-mail přijímá jen část firem – ověřte si to ve smlouvě nebo obchodních podmínkách.';
  $('#v-form').hidden = true;
  $('#v-vysledek').hidden = false;
  window.scrollTo(0, 0);
});
$('#v-zpet').addEventListener('click', () => ukaz('seznam'));
$('#v-upravit').addEventListener('click', () => { $('#v-form').hidden = false; $('#v-vysledek').hidden = true; });
$('#v-kopirovat').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(posledniVypoved.text); toast('Text zkopírován'); }
  catch {
    const r = document.createRange(); r.selectNodeContents($('#v-text'));
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast('Text je označený, zkopírujte ho');
  }
});
$('#v-email').addEventListener('click', () => {
  location.href = `mailto:?subject=${encodeURIComponent(posledniVypoved.vec)}&body=${encodeURIComponent(posledniVypoved.text)}`;
});
$('#v-tisk').addEventListener('click', async () => {
  if (NATIVNI && PLUGINY.Share) {
    try { await PLUGINY.Share.share({ title: posledniVypoved.vec, text: posledniVypoved.text, dialogTitle: 'Poslat výpověď' }); } catch {}
    return;
  }
  if (window.NAHLED) { toast('V náhledu tisk nefunguje. V nainstalované aplikaci ano.'); return; }
  window.print();
});
$('#v-odeslano').addEventListener('click', () => {
  vypovedPolozka.vypovedOdeslana = naText(dnes());
  uloz();
  toast('Označeno. Připomínky výpovědi se vypnuly.');
  ukaz('prehled');
});

// ---------- Kalendář (.ics) ----------
function icsDatum(d) { return naText(d).replace(/-/g, ''); }
function icsText(s) { return String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n'); }
function alarm(dniPredem) { // připomenutí v 9:00 daný počet dní předem
  const hodin = dniPredem * 24 - 9;
  const trigger = hodin >= 0 ? `-PT${hodin}H` : `PT${-hodin}H`;
  return ['BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Připomínka', `TRIGGER:${trigger}`, 'END:VALARM'];
}
function udalost(uid, datum, nazev, popis, dniPredem, opakovani) {
  const konec = new Date(datum.getTime() + DEN);
  const radky = [
    'BEGIN:VEVENT', `UID:${uid}@moje-povinnosti`, `DTSTAMP:${icsDatum(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${icsDatum(datum)}`, `DTEND;VALUE=DATE:${icsDatum(konec)}`,
    `SUMMARY:${icsText(nazev)}`,
  ];
  if (popis) radky.push(`DESCRIPTION:${icsText(popis)}`);
  if (opakovani) {
    // Den 29–31: v kratších měsících použít poslední den měsíce (jinak by kalendář měsíc přeskočil).
    const den = datum.getDate();
    const dny = den >= 29 ? `;BYMONTHDAY=${Array.from({ length: den - 27 }, (_, i) => 28 + i).join(',')};BYSETPOS=-1` : '';
    radky.push(`RRULE:FREQ=MONTHLY;INTERVAL=${opakovani}${dny}`);
  }
  dniPredem.forEach((n) => radky.push(...alarm(n)));
  radky.push('END:VEVENT');
  return radky;
}
function stahniIcs(polozky, jmeno) {
  const radky = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Moje povinnosti//CS', 'CALSCALE:GREGORIAN'];
  polozky.filter((p) => !p.hotovo).forEach((p) => {
    const castka = p.typ === 'platba' && p.castka ? ` – ${kc(p.castka)}` : '';
    const nazev = (p.typ === 'platnost' ? `Konec platnosti: ${p.nazev}` : `Zaplatit: ${p.nazev}`) + castka;
    radky.push(...udalost(p.id, zText(p.datum), nazev, p.poznamka, [p.pripomenout || 3], p.opakovani));
    const v = vypoved(p);
    if (v) {
      radky.push(...udalost(p.id + '-vypoved', v.posledniDen, `Poslední den pro výpověď: ${p.nazev}`,
        `Výpověď musí dorazit do tohoto dne, jinak se smlouva prodlouží. Výročí: ${hezkeDatum(v.vyroci)}`, [21, 7], p.opakovani === 12 ? 12 : 0));
    }
  });
  radky.push('END:VCALENDAR');
  ulozSoubor(jmeno.replace(/[^\p{L}\p{N} ._-]/gu, '') || 'povinnosti.ics', radky.join('\r\n'), 'text/calendar;charset=utf-8');
}

// ---------- Nastavení ----------
$('#n-vyplata').addEventListener('change', (e) => {
  const v = Math.min(31, Math.max(1, Number(e.target.value) || 0));
  data.nastaveni.vyplata = e.target.value ? v : null;
  e.target.value = data.nastaveni.vyplata || '';
  uloz();
  toast('Uloženo');
});
$('#n-kalendar').addEventListener('click', () => {
  if (!aktivni().length) { toast('Zatím nemáte žádné povinnosti.'); return; }
  stahniIcs(aktivni(), 'moje-povinnosti.ics');
});
$('#n-export').addEventListener('click', () => {
  ulozSoubor(`moje-povinnosti-zaloha-${naText(dnes())}.json`, JSON.stringify(data, null, 2), 'application/json');
});
$('#n-import').addEventListener('change', async (e) => {
  const soubor = e.target.files[0];
  if (!soubor) return;
  try {
    const d = JSON.parse(await soubor.text());
    if (!Array.isArray(d.polozky)) throw new Error();
    if (!(await potvrd(`Obnovit ${d.polozky.length} položek? Současná data se přepíšou.`, 'Obnovit'))) return;
    data = { polozky: d.polozky, nastaveni: d.nastaveni || {}, upozorneno: {} };
    uloz();
    toast('Data obnovena');
    ukaz('prehled');
  } catch { toast('Soubor není platná záloha.'); }
  e.target.value = '';
});
$('#n-smazat-vse').addEventListener('click', async () => {
  if (!(await potvrd('Smazat všechna data? Tohle nejde vrátit.', 'Smazat vše'))) return;
  data = { polozky: [], nastaveni: {}, upozorneno: {} };
  uloz();
  toast('Vše smazáno');
  ukaz('prehled');
});
$('#n-notifikace').addEventListener('click', async () => {
  if (NATIVNI) { povolUpozorneniNativne(); return; }
  if (!('Notification' in window)) { toast('Tento prohlížeč upozornění nepodporuje. Na iPhonu nejdřív přidejte aplikaci na plochu.'); return; }
  const r = await Notification.requestPermission();
  toast(r === 'granted' ? 'Upozornění povolena' : 'Upozornění nejsou povolena');
  if (r === 'granted') zkontrolujUpozorneni();
});

// ---------- Upozornění při otevření ----------
async function posliNotifikaci(titulek, text) {
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) reg.showNotification(titulek, { body: text, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' });
    else new Notification(titulek, { body: text });
  } catch (e) { /* nepodstatné */ }
}
function zkontrolujUpozorneni() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const t = dnes();
  const klicDne = naText(t);
  aktivni().forEach((p) => {
    const d = zText(p.datum);
    const n = rozdilDni(d, t);
    if (n <= (p.pripomenout || 3) && data.upozorneno[p.id] !== klicDne) {
      const co = p.typ === 'platnost' ? 'končí platnost' : (n < 0 ? 'je po splatnosti' : 'je splatné');
      posliNotifikaci(p.nazev, `${co} ${kdy(d)}${p.castka && p.typ === 'platba' ? ' – ' + kc(p.castka) : ''}`);
      data.upozorneno[p.id] = klicDne;
    }
    const v = vypoved(p);
    if (v && rozdilDni(v.posledniDen, t) <= 14 && data.upozorneno[p.id + '-v'] !== klicDne) {
      posliNotifikaci(`Výpověď: ${p.nazev}`, `Poslední den pro doručení výpovědi je ${hezkeDatum(v.posledniDen)}`);
      data.upozorneno[p.id + '-v'] = klicDne;
    }
  });
  uloz();
}

// ---------- Ukázková data (jen v náhledu) ----------
function ukazkovaData() {
  const t = dnes();
  const za = (dny) => naText(new Date(t.getTime() + dny * DEN));
  const p = (nazev, kategorie, castka, opakovani, datum, typ = 'platba', extra = {}) => ({
    id: noveId(), nazev, kategorie, castka, opakovani, datum, typ, kotva: zText(datum).getDate(),
    hlidatVypoved: false, vyroci: '', lhuta: 6, lhutaJednotka: 'tydny', pripomenout: 3, poznamka: '', hotovo: false, ...extra,
  });
  return [
    p('Nájem', 'bydleni', 12500, 1, za(9)),
    p('Mobilní tarif', 'telefon', 399, 1, za(14)),
    p('Netflix', 'predplatne', 259, 1, za(2)),
    p('Spotify', 'predplatne', 185, 1, za(21)),
    p('Elektřina – zálohy', 'energie', 1800, 1, za(19), 'platba', { hlidatVypoved: true, vyroci: za(85), lhuta: 1, lhutaJednotka: 'mesice' }),
    p('Povinné ručení', 'pojisteni', 4200, 12, za(45), 'platba', { hlidatVypoved: true, vyroci: za(45) }),
    p('STK', 'auto', 0, 24, za(55), 'platnost', { pripomenout: 30 }),
    p('Občanský průkaz', 'doklady', 0, 0, za(150), 'platnost', { pripomenout: 30 }),
    p('Faktura za opravu kola', 'faktury', 950, 0, za(-4)),
  ];
}

// ---------- Start ----------
naplnKategorie();
if (window.NAHLED) {
  if (!data.polozky.length) { data.polozky = ukazkovaData(); data.nastaveni.vyplata = 15; uloz(); }
  const b = document.createElement('div');
  b.className = 'banner';
  b.textContent = 'Náhled s ukázkovými daty. Klidně je upravte nebo smažte v Nastavení.';
  $('#app').prepend(b);
}
// V nainstalované aplikaci (z obchodu nebo z plochy) návod k instalaci nepotřebujeme.
const NAINSTALOVANO = NATIVNI || window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
$('#n-instalace').hidden = NAINSTALOVANO;
if (NATIVNI) {
  $('#n-upoz-nativni').hidden = false;
  $('#n-upoz-web').hidden = true;
  $('#n-kalendar').hidden = true;
  $('#n-notifikace').textContent = 'Zapnout upozornění';
  $('#v-tisk').textContent = 'Sdílet';
  naplanujUpozorneni();
}
ukaz('prehled');
if (!NATIVNI) zkontrolujUpozorneni();
if (!NATIVNI && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
