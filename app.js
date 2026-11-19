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
  finance:     { nazev: 'Peníze a úřady' },
  auto:        { nazev: 'Auto a doprava' },
  doklady:     { nazev: 'Doklady' },
  nakupy:      { nazev: 'Nákupy a záruky' },
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
  finance: '<path d="M3 10 12 4l9 6z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  nakupy: '<path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  faktury: '<path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  ostatni: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};
function ikona(kat) {
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IKONY[kat] || IKONY.ostatni}</svg>`;
}

// typ: 'platba' = něco platím, 'platnost' = hlídám konec platnosti (STK, doklady),
//      'termin' = něco musím udělat do data (revize, přezutí, záruka)
// hlavni: true = ukáže se hned, ostatní až po „Další šablony“
const SABLONY = [
  // Bydlení
  { hlavni: true, nazev: 'Nájem', kategorie: 'bydleni', opakovani: 1, typ: 'platba', popis: 'každý měsíc' },
  { nazev: 'Hypotéka', klic: 'úvěr bydlení banka', kategorie: 'bydleni', opakovani: 1, typ: 'platba', vypoved: { lhuta: 3, jednotka: 'mesice' }, popis: 'splátka + konec fixace', vyrociLabel: 'Konec fixace sazby', poznamka: 'Nabídky jiných bank si projděte aspoň 3 měsíce před koncem fixace.' },
  { nazev: 'Poplatek za odpad', kategorie: 'bydleni', opakovani: 12, typ: 'platba', popis: 'jednou ročně obci' },
  { nazev: 'Televizní a rozhlasový poplatek', klic: 'ČT ČRo televize rádio', kategorie: 'bydleni', opakovani: 1, typ: 'platba', popis: 'Česká televize a rozhlas' },
  { nazev: 'Revize komína', klic: 'kominík', kategorie: 'bydleni', opakovani: 12, typ: 'termin', popis: 'povinná kontrola jednou ročně', pripomenout: 30 },
  { nazev: 'Servis plynového kotle', klic: 'kotel plyn topení', kategorie: 'bydleni', opakovani: 12, typ: 'termin', popis: 'jednou ročně', pripomenout: 30 },
  // Energie
  { hlavni: true, nazev: 'Elektřina – zálohy', kategorie: 'energie', opakovani: 1, typ: 'platba', vypoved: { lhuta: 1, jednotka: 'mesice' }, popis: 'zálohy + konec fixace', poznamka: 'Lhůtu před koncem fixace si ověřte ve smlouvě.' },
  { nazev: 'Plyn – zálohy', kategorie: 'energie', opakovani: 1, typ: 'platba', vypoved: { lhuta: 1, jednotka: 'mesice' }, popis: 'zálohy + konec fixace', poznamka: 'Lhůtu před koncem fixace si ověřte ve smlouvě.' },
  // Telefon a internet
  { hlavni: true, nazev: 'Mobilní tarif', klic: 'telefon operátor', kategorie: 'telefon', opakovani: 1, typ: 'platba', popis: 'T-Mobile, O2, Vodafone' },
  { nazev: 'Internet', kategorie: 'telefon', opakovani: 1, typ: 'platba', popis: 'každý měsíc' },
  // Předplatná
  { hlavni: true, nazev: 'Netflix', kategorie: 'predplatne', opakovani: 1, typ: 'platba', castka: 259, popis: 'od 259 Kč měsíčně' },
  { nazev: 'Spotify', kategorie: 'predplatne', opakovani: 1, typ: 'platba', castka: 185, popis: '185 Kč měsíčně' },
  { nazev: 'YouTube Premium', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'bez reklam' },
  { nazev: 'Disney+', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'filmy a seriály' },
  { nazev: 'HBO Max', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'filmy a seriály' },
  { nazev: 'iCloud / Google One', klic: 'cloud Apple fotky', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'úložiště fotek a záloh' },
  { nazev: 'Posilovna', klic: 'fitness gym sport', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'členství, permanentka' },
  { nazev: 'Jiné předplatné', kategorie: 'predplatne', opakovani: 1, typ: 'platba', popis: 'aplikace a další' },
  // Pojištění
  { hlavni: true, nazev: 'Povinné ručení', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { nazev: 'Havarijní pojištění', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { nazev: 'Pojištění domácnosti', kategorie: 'pojisteni', opakovani: 12, typ: 'platba', vypoved: { lhuta: 6, jednotka: 'tydny' }, popis: 'výpověď 6 týdnů před výročím' },
  { nazev: 'Životní pojištění', kategorie: 'pojisteni', opakovani: 1, typ: 'platba', popis: 'pravidelná platba' },
  { nazev: 'Cestovní pojištění', klic: 'dovolená cesta', kategorie: 'pojisteni', opakovani: 0, typ: 'termin', popis: 'sjednat před dovolenou', datumLabel: 'Datum odjezdu', pripomenout: 7 },
  // Peníze a úřady
  { nazev: 'Půjčka / leasing', klic: 'úvěr splátka', kategorie: 'finance', opakovani: 1, typ: 'platba', popis: 'měsíční splátka' },
  { nazev: 'Daň z nemovitosti', kategorie: 'finance', opakovani: 12, typ: 'platba', popis: 'splatná do 31. 5.', pripomenout: 14 },
  { nazev: 'Daňové přiznání', klic: 'daně finanční úřad', kategorie: 'finance', opakovani: 12, typ: 'termin', popis: 'každé jaro', datumLabel: 'Termín podání', pripomenout: 30 },
  { nazev: 'Zdravotní pojištění OSVČ', kategorie: 'finance', opakovani: 1, typ: 'platba', popis: 'měsíční záloha' },
  { nazev: 'Sociální pojištění OSVČ', kategorie: 'finance', opakovani: 1, typ: 'platba', popis: 'měsíční záloha' },
  { nazev: 'Stavební spoření', klic: 'spoření', kategorie: 'finance', opakovani: 1, typ: 'platba', popis: 'měsíční vklad' },
  { nazev: 'Penzijní spoření', klic: 'důchod DIP', kategorie: 'finance', opakovani: 1, typ: 'platba', popis: 'měsíční vklad' },
  // Auto a doprava
  { hlavni: true, nazev: 'STK', kategorie: 'auto', opakovani: 24, typ: 'platnost', popis: 'osobní auto každé 2 roky' },
  { nazev: 'Dálniční známka', kategorie: 'auto', opakovani: 12, typ: 'platba', castka: 2440, popis: 'roční 2 440 Kč' },
  { nazev: 'Servis auta', kategorie: 'auto', opakovani: 12, typ: 'platba', popis: 'olej, prohlídka' },
  { nazev: 'Přezutí pneumatik', klic: 'pneu zimní letní gumy', kategorie: 'auto', opakovani: 6, typ: 'termin', popis: 'na podzim a na jaře', pripomenout: 14 },
  { nazev: 'Parkovací karta', kategorie: 'auto', opakovani: 12, typ: 'platba', popis: 'rezidentní parkování' },
  { nazev: 'Jízdenka na MHD', klic: 'lítačka autobus tramvaj vlak doprava', kategorie: 'auto', opakovani: 1, typ: 'platba', popis: 'měsíční nebo roční kupón' },
  // Doklady
  { hlavni: true, nazev: 'Občanský průkaz', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  { nazev: 'Cestovní pas', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  { nazev: 'Řidičský průkaz', kategorie: 'doklady', opakovani: 0, typ: 'platnost', popis: 'konec platnosti' },
  // Nákupy a záruky
  { nazev: 'Konec záruky', klic: 'reklamace účtenka nákup', kategorie: 'nakupy', opakovani: 0, typ: 'termin', popis: '24 měsíců od nákupu', datumLabel: 'Konec záruky (datum nákupu + 2 roky)', pripomenout: 30, poznamka: 'Co jste koupili a kde, kde je účtenka.' },
  { nazev: 'Vrácení zboží', klic: 'e-shop reklamace', kategorie: 'nakupy', opakovani: 0, typ: 'termin', popis: 'z e-shopu do 14 dní', datumLabel: 'Poslední den pro vrácení', pripomenout: 3 },
  // Faktury a ostatní
  { nazev: 'Faktura', klic: 'platba', kategorie: 'faktury', opakovani: 0, typ: 'platba', popis: 'jednorázová splatnost' },
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
    .filter((p) => p.typ !== 'platnost' && p.castka > 0)
    .reduce((s, p) => s + vyskyty(p, doData).length * p.castka, 0);
}

function prumerMesicne() {
  return aktivni()
    .filter((p) => p.typ !== 'platnost' && p.castka > 0 && p.opakovani > 0)
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

// ---------- Spodní lišta ----------
function nastavTab(view) {
  document.querySelectorAll('.tabbar button').forEach((b) => {
    const je = b.dataset.view === view;
    b.classList.toggle('active', je);
    if (je) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
}

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
    const castka = p.typ !== 'platnost' && p.castka > 0 ? ` – ${kc(p.castka)}` : '';
    vyskyty(p, konec).forEach((d) => {
      const kdy = vHodinu(new Date(d.getTime() - predem * DEN));
      if (kdy > ted) {
        const za = predem === 1 ? 'Zítra' : `Za ${predem} ${dnyText(predem)}`;
        const nadpis = p.typ === 'platnost' ? `${za} končí: ${p.nazev}`
          : p.typ === 'termin' ? `${za}: ${p.nazev}`
          : `${za} platíš: ${p.nazev}`;
        const text = p.typ === 'platnost' ? `Platnost končí ${hezkeDatum(d)}`
          : p.typ === 'termin' ? `Termín ${hezkeDatum(d)}${castka}`
          : `Splatnost ${hezkeDatum(d)}${castka}`;
        plan.push({ kdy, nadpis, text });
      }
      const vDen = vHodinu(d);
      if (p.typ === 'platba' && vDen > ted) plan.push({ kdy: vDen, nadpis: `Dnes platíš: ${p.nazev}`, text: `Splatnost dnes${castka}` });
      if (p.typ === 'termin' && vDen > ted) plan.push({ kdy: vDen, nadpis: `Dnes: ${p.nazev}`, text: `Termín je dnes${castka}` });
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
const NAZVY = { prehled: 'Přehled', seznam: 'Moje povinnosti', kalendar: 'Kalendář', pridat: 'Přidat', nastaveni: 'Nastavení' };
let posledniView = 'prehled'; // kam se vrátit po úpravě položky
function ukaz(view) {
  if (['prehled', 'seznam', 'kalendar'].includes(view)) posledniView = view;
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
  nastavTab(view);
  $('#page-title').textContent = NAZVY[view];
  if (view === 'pridat') { delete $('#seznam-sablon').dataset.vse; $('#hledat-sablonu').value = ''; zobrazSablony(); }
  if (view === 'prehled') vykresliPrehled();
  if (view === 'seznam') vykresliSeznam();
  if (view === 'kalendar') vykresliKalendar();
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
  const castka = p.typ !== 'platnost' && p.castka > 0 ? kc(p.castka) : (p.typ === 'platnost' ? 'platnost' : p.typ === 'termin' ? 'termín' : '');
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
  if (aktivniView === 'kalendar') vykresliKalendar();
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

  // Upozornění: karta s ikonou, nadpisem a řádky položek
  const box = $('#upozorneni');
  box.innerHTML = '';
  const IKONA_POZOR = '<path d="M12 8v5"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="9"/>';
  const IKONA_SMLOUVA = '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>';
  const IKONA_DOKLAD = '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.4 1.6-2.1 3-2.1s2.5.7 3 2.1M15 10h3M15 14h2"/>';
  // „ · za 3 dny“ jen když je to blízko, jinak by se datum opakovalo
  const zaKolik = (d) => { const n = rozdilDni(d, t); return n <= 14 ? ` · ${kdy(d)}` : ''; };
  const karta = (cls, ikonaSvg, nadpis, popis, radky) => {
    const el = document.createElement('section');
    el.className = 'alert ' + cls;
    el.innerHTML = `
      <div class="alert-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ikonaSvg}</svg></div>
      <div class="alert-obsah">
        <div class="alert-nadpis">${nadpis}</div>
        ${popis ? `<p class="alert-popis">${popis}</p>` : ''}
      </div>
      <ul class="alert-radky"></ul>`;
    const ulA = el.querySelector('.alert-radky');
    radky.forEach(({ p, vlevo, vpravo, akce }) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="ar-text"><span class="ar-nazev">${esc(p.nazev)}</span><span class="ar-meta">${vpravo ? `<b>${vpravo}</b> · ` : ''}${vlevo}</span></div>`;
      if (akce) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ar-btn'; b.textContent = akce.text;
        b.addEventListener('click', akce.fn);
        li.appendChild(b);
      }
      ulA.appendChild(li);
    });
    if (!radky.length) ulA.remove();
    box.appendChild(el);
  };

  // 1) Po termínu – nejstarší první, s tlačítkem Zaplaceno / Hotovo
  const po = aktivni().filter((p) => p.typ !== 'platnost' && zText(p.datum) < t)
    .sort((a, b) => zText(a.datum) - zText(b.datum));
  if (po.length) {
    const dluh = po.reduce((s, p) => s + (p.castka || 0), 0);
    karta('danger', IKONA_POZOR,
      po.length === 1 ? 'Jedna platba je po termínu' : `${po.length} ${po.length < 5 ? 'platby jsou' : 'plateb je'} po termínu`,
      dluh > 0 ? `Celkem ${kc(dluh)}` : '',
      po.map((p) => {
        const dny = rozdilDni(t, zText(p.datum));
        return {
          p,
          vlevo: dny === 1 ? 'včera' : `před ${dny} dny`,
          vpravo: p.castka > 0 ? kc(p.castka) : '',
          akce: { text: p.typ === 'platba' ? 'Zaplaceno' : 'Hotovo', fn: () => oznacHotovo(p) },
        };
      }));
  }

  // 2) Výpovědní lhůty do 45 dní
  const lhuty = aktivni().map((p) => ({ p, v: vypoved(p) })).filter(({ v }) => v && rozdilDni(v.posledniDen, t) <= 45)
    .sort((a, b) => a.v.posledniDen - b.v.posledniDen);
  if (lhuty.length) {
    const nejblizsi = rozdilDni(lhuty[0].v.posledniDen, t);
    karta(nejblizsi <= 7 ? 'danger' : 'warn', IKONA_SMLOUVA,
      lhuty.length === 1 ? 'Blíží se výpovědní lhůta' : 'Blíží se výpovědní lhůty',
      'Chcete-li smlouvu změnit nebo zrušit, výpověď musí dorazit včas. Jinak se prodlouží.',
      lhuty.map(({ p, v }) => ({ p, vlevo: `výpověď do ${hezkeDatum(v.posledniDen)}${zaKolik(v.posledniDen)}` })));
  }

  // 3) Končící doklady a STK do 60 dní
  const konci = aktivni().filter((p) => p.typ === 'platnost' && rozdilDni(zText(p.datum), t) <= 60)
    .sort((a, b) => zText(a.datum) - zText(b.datum));
  if (konci.length) {
    karta('warn', IKONA_DOKLAD, konci.length === 1 ? 'Brzy končí platnost' : 'Brzy končí platnost dokladů', '',
      konci.map((p) => ({ p, vlevo: zText(p.datum) < t ? 'platnost už skončila' : `platí do ${hezkeDatum(zText(p.datum))}${zaKolik(zText(p.datum))}` })));
  }

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

// ---------- Kalendář ----------
let kalMesic = (() => { const t = dnes(); return new Date(t.getFullYear(), t.getMonth(), 1); })();
let kalVybrany = dnes();

// Všechno, co připadá na dny mezi od a do: splatnosti, konce platnosti, termíny a poslední dny výpovědí.
function udalostiMezi(od, doData) {
  const out = [];
  aktivni().forEach((p) => {
    vyskyty(p, doData).forEach((d) => { if (d >= od) out.push({ p, d, druh: p.typ }); });
    const v = vypoved(p);
    if (v && v.posledniDen >= od && v.posledniDen <= doData) out.push({ p, d: v.posledniDen, druh: 'vypoved' });
  });
  return out;
}

function vykresliKalendar() {
  const prvni = kalMesic;
  const posledni = new Date(prvni.getFullYear(), prvni.getMonth() + 1, 0);
  $('#kal-mesic').textContent = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(prvni);

  // Mřížka začíná pondělím
  const posun = (prvni.getDay() + 6) % 7;
  const start = new Date(prvni.getFullYear(), prvni.getMonth(), 1 - posun);
  const konec = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 41);
  const udalosti = udalostiMezi(start, konec);
  const naDen = {};
  udalosti.forEach((u) => { (naDen[naText(u.d)] ||= []).push(u); });

  const vMesici = udalosti.filter((u) => u.d >= prvni && u.d <= posledni);
  const soucet = vMesici.filter((u) => u.druh === 'platba' || u.druh === 'termin').reduce((s, u) => s + (u.p.castka || 0), 0);
  $('#kal-soucet').textContent = soucet > 0
    ? `V tomto měsíci zaplatíte ${kc(soucet)}`
    : vMesici.length ? 'V tomto měsíci nic neplatíte, jen hlídáte termíny.' : 'V tomto měsíci nic nemáte.';

  const mrizka = $('#kal-mrizka');
  mrizka.innerHTML = '';
  const t = dnes();
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (i >= 35 && d.getMonth() !== prvni.getMonth()) break; // šestý řádek jen když je potřeba
    const klic = naText(d);
    const den = document.createElement('button');
    den.type = 'button';
    den.className = 'kal-den'
      + (d.getMonth() !== prvni.getMonth() ? ' jiny' : '')
      + (+d === +t ? ' dnes' : '')
      + (+d === +kalVybrany ? ' vybrany' : '');
    const u = naDen[klic] || [];
    const tecky = u.slice(0, 3).map((x) => `<i class="${x.druh === 'vypoved' || (x.druh !== 'platnost' && x.d < t) ? 'cervena' : ''}"></i>`).join('');
    den.innerHTML = `<span>${d.getDate()}</span><span class="kal-tecky">${tecky}</span>`;
    den.setAttribute('aria-label', `${d.getDate()}. ${d.getMonth() + 1}.${u.length ? `, ${u.length} ${u.length === 1 ? 'položka' : u.length < 5 ? 'položky' : 'položek'}` : ''}`);
    den.addEventListener('click', () => {
      kalVybrany = d;
      if (d.getMonth() !== kalMesic.getMonth()) kalMesic = new Date(d.getFullYear(), d.getMonth(), 1);
      vykresliKalendar();
    });
    mrizka.appendChild(den);
  }

  // Seznam pro vybraný den
  const vybrane = naDen[naText(kalVybrany)] || [];
  const tenDen = +kalVybrany === +t ? 'Dnes' : `${kalVybrany.getDate()}. ${kalVybrany.getMonth() + 1}. ${kalVybrany.getFullYear()}`;
  $('#kal-den-nadpis').textContent = tenDen;
  const ul = $('#kal-den-seznam');
  ul.innerHTML = '';
  vybrane.forEach(({ p, druh }) => {
    const kat = KATEGORIE[p.kategorie] || KATEGORIE.ostatni;
    const popis = druh === 'vypoved' ? 'poslední den pro výpověď'
      : druh === 'platnost' ? 'konec platnosti'
      : druh === 'termin' ? 'termín' : 'splatnost';
    const castka = druh !== 'vypoved' && druh !== 'platnost' && p.castka > 0 ? kc(p.castka) : '';
    const li = document.createElement('li');
    li.className = 'item kal-radek';
    li.innerHTML = `
      <div class="ico">${ikona(p.kategorie)}</div>
      <div class="name">${esc(p.nazev)}</div>
      <div class="meta">${kat.nazev} · <span class="${druh === 'vypoved' ? 'danger' : ''}">${popis}</span></div>
      <div class="right"><div class="amount">${castka}</div></div>`;
    li.addEventListener('click', () => otevriFormular(p));
    ul.appendChild(li);
  });
  $('#kal-den-prazdno').hidden = vybrane.length > 0;
}
$('#kal-zpet').addEventListener('click', () => { kalMesic = new Date(kalMesic.getFullYear(), kalMesic.getMonth() - 1, 1); vykresliKalendar(); });
$('#kal-dal').addEventListener('click', () => { kalMesic = new Date(kalMesic.getFullYear(), kalMesic.getMonth() + 1, 1); vykresliKalendar(); });

// ---------- Přidání / úprava ----------
const bezDiakritiky = (s) => String(s).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

function dlazdiceSablony(s) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'tpl';
  b.innerHTML = `<span class="ico">${ikona(s.kategorie)}</span><span class="t">${esc(s.nazev)}</span><span class="d">${esc(s.popis)}</span>`;
  b.addEventListener('click', () => otevriFormular(null, s));
  return b;
}

function zobrazSablony() {
  $('#sablony').hidden = false;
  $('#formular').hidden = true;
  const box = $('#seznam-sablon');
  const hledat = $('#hledat-sablonu');
  box.innerHTML = '';
  const vse = box.dataset.vse === '1';
  hledat.hidden = !vse;

  // Nejdřív jen nejčastější šablony, ostatní po rozbalení.
  if (!vse) {
    const mrizka = document.createElement('div');
    mrizka.className = 'templates';
    SABLONY.filter((s) => s.hlavni).forEach((s) => mrizka.appendChild(dlazdiceSablony(s)));
    box.appendChild(mrizka);
    const dalsi = document.createElement('button');
    dalsi.type = 'button';
    dalsi.className = 'btn full tpl-more';
    dalsi.textContent = `Další šablony (${SABLONY.filter((s) => !s.hlavni).length})`;
    dalsi.addEventListener('click', () => { box.dataset.vse = '1'; zobrazSablony(); });
    box.appendChild(dalsi);
    return;
  }

  // Všechny šablony ve skupinách podle kategorie, s vyhledáváním.
  // Hledá bez háčků a čárek a toleruje jiný konec slova (záruka / záruky, daň / daně).
  const slova = bezDiakritiky(hledat.value.trim()).split(/\s+/).filter(Boolean)
    .map((w) => (w.length > 3 ? w.slice(0, -1) : w));
  const odpovida = (s) => {
    const text = bezDiakritiky(`${s.nazev} ${s.popis} ${s.klic || ''} ${KATEGORIE[s.kategorie].nazev}`);
    return slova.every((w) => text.includes(w));
  };
  let nalezeno = 0;
  Object.keys(KATEGORIE).forEach((kat) => {
    const sablony = SABLONY.filter((s) => s.kategorie === kat && odpovida(s));
    if (!sablony.length) return;
    nalezeno += sablony.length;
    const nadpis = document.createElement('h2');
    nadpis.textContent = KATEGORIE[kat].nazev;
    box.appendChild(nadpis);
    const mrizka = document.createElement('div');
    mrizka.className = 'templates';
    sablony.forEach((s) => mrizka.appendChild(dlazdiceSablony(s)));
    box.appendChild(mrizka);
  });
  if (!nalezeno) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Nic takového tu není. Přidejte to jako vlastní:';
    box.appendChild(p);
    const mrizka = document.createElement('div');
    mrizka.className = 'templates';
    mrizka.appendChild(dlazdiceSablony(SABLONY.find((s) => s.nazev === 'Vlastní')));
    box.appendChild(mrizka);
  }
}
$('#hledat-sablonu').addEventListener('input', zobrazSablony);

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
    pripomenout: sablona.pripomenout || (sablona.typ === 'platnost' ? 30 : 3), poznamka: sablona.poznamka || '',
    datumLabel: sablona.datumLabel, vyrociLabel: sablona.vyrociLabel,
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
  $('#f-datum-label').textContent = p.datumLabel || (p.typ === 'platnost' ? 'Platnost do' : p.typ === 'termin' ? 'Datum' : 'Datum splatnosti (nejbližší)');
  $('#f-vyroci-label').textContent = p.vyrociLabel || 'Výročí / konec smlouvy nebo fixace';
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
$('#f-zrusit').addEventListener('click', () => ($('#f-id').value ? ukaz(posledniView) : zobrazSablony()));

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
  ukaz(id ? posledniView : 'prehled');
});

$('#f-smazat').addEventListener('click', async () => {
  const id = $('#f-id').value;
  if (!id || !(await potvrd('Opravdu smazat tuto povinnost?', 'Smazat'))) return;
  data.polozky = data.polozky.filter((p) => p.id !== id);
  uloz();
  toast('Smazáno');
  ukaz(posledniView);
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
    const castka = p.typ !== 'platnost' && p.castka ? ` – ${kc(p.castka)}` : '';
    const nazev = (p.typ === 'platnost' ? `Konec platnosti: ${p.nazev}` : p.typ === 'termin' ? `Termín: ${p.nazev}` : `Zaplatit: ${p.nazev}`) + castka;
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
      const co = p.typ === 'platnost' ? 'končí platnost' : p.typ === 'termin' ? (n < 0 ? 'termín uplynul' : 'termín') : (n < 0 ? 'je po splatnosti' : 'je splatné');
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

// Když je otevřený formulář, schová se spodní lišta (tlačítko Uložit je pak vždy vidět).
function aktualizujFormular() {
  const vidim = (sel) => { const el = $(sel); return el && !el.hidden && el.closest('.view').classList.contains('active'); };
  document.body.classList.toggle('formular', vidim('#formular'));
}
new MutationObserver(aktualizujFormular).observe($('#app'), { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });

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
  naplanujUpozorneni();
}
ukaz('prehled');
if (!NATIVNI) zkontrolujUpozorneni();
if (!NATIVNI && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  // Když se nainstaluje nová verze aplikace, stránka se jednou sama obnoví.
  const meliJsmeStarou = !!navigator.serviceWorker.controller;
  let obnoveno = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (meliJsmeStarou && !obnoveno) { obnoveno = true; location.reload(); }
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' })
    .then((reg) => {
      // Zkontrolovat novou verzi i při návratu do aplikace (iPhone ji drží otevřenou na pozadí).
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    })
    .catch(() => {});
}
