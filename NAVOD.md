# Moje povinnosti – verze 1.3.2

Aplikace na hlídání plateb, smluv, výpovědních lhůt, STK, dokladů a dalších termínů.
Data zůstávají jen v telefonu uživatele, bez registrace.

Webová verze: https://banioo.github.io/moje-povinnosti/

## Co je ve složce

| Soubor / složka | K čemu slouží |
| --- | --- |
| `index.html` | Obrazovky aplikace (Přehled, Seznam, Přidat, Nastavení) |
| `style.css` | Vzhled, světlý i tmavý režim |
| `app.js` | Veškerá logika: šablony, výpočty, lhůty, upozornění, záloha |
| `manifest.json` | Říká telefonu, že jde o aplikaci (název, ikona, barva) |
| `sw.js` | Aplikace funguje i bez internetu |
| `icons/` | Ikony webové aplikace |
| `zasady-ochrany-udaju.html` | Zásady ochrany osobních údajů (potřeba pro Google Play) |
| `.nojekyll` | Aby GitHub Pages zobrazil všechny soubory |
| `package.json`, `capacitor.config.json` | Nastavení Android aplikace |
| `assets/` | Ikona a úvodní obrazovka Android aplikace |
| `.github/workflows/android.yml` | Sestavení Android aplikace na GitHubu |

## Jak nahrát novou verzi na GitHub

1. Rozbalte zip. Ve Windows zapněte **Zobrazit → Skryté položky** (kvůli `.github`, `.nojekyll`, `.gitignore`).
2. Na GitHubu v repozitáři: **Add file → Upload files**, přetáhněte celý obsah složky.
3. **Commit changes**.
4. Na iPhonu aplikaci jednou zavřete a znovu otevřete, načte se nová verze.

Aplikace si s internetem vždy načte nejnovější verzi z webu (uložená kopie se použije jen bez internetu). Po nahrání nové verze stačí aplikaci zavřít a znovu otevřít.

## Instalace webové verze

- **iPhone:** otevřete odkaz v Safari → Sdílet → Přidat na plochu.
- **Android:** otevřete odkaz v Chrome → menu ⋮ → Instalovat aplikaci.

Ve webové verzi se upozornění ukážou při otevření aplikace. Na připomínky se zavřenou aplikací
slouží tlačítko **Kalendář** u položky nebo v Nastavení **Přidat vše do kalendáře**.

## Android aplikace s upozorněními přímo v telefonu

Po každém nahrání souborů se na GitHubu sama sestaví aplikace pro Android (soubor `.apk`).
Ta si připomínky naplánuje přímo v telefonu, takže chodí v 9:00 i se zavřenou aplikací, bez serveru.

1. Na GitHubu otevřete záložku **Actions** → nejnovější běh **Android aplikace** (5–10 minut).
2. Zelená fajfka = hotovo. Dole v části **Artifacts** stáhněte `moje-povinnosti-android` (zip s `app-debug.apk`).
3. Pošlete `.apk` do telefonu s Androidem, otevřete ho a povolte instalaci z neznámého zdroje.
4. Po přidání první položky aplikace požádá o povolení upozornění – dejte **Povolit**.

Kdy chodí připomínky:
- platby: X dní předem (podle položky) a v den splatnosti,
- doklady a STK: X dní předem (u dokladů 30 dní),
- termíny (revize, přezutí, záruka): X dní předem a v ten den,
- výpovědní lhůty: 21, 7 a 1 den před posledním dnem pro výpověď.

Červený křížek v Actions = sestavení selhalo. Klikněte na něj → Details → řádek s křížkem a pošlete screenshot chyby.

Tahle verze je na testování. Pro Google Play je potřeba podepsaná verze (`.aab`).

## Výpovědní lhůty v šablonách

- Povinné ručení, havarijní pojištění, pojištění domácnosti: výpověď musí pojišťovně **dorazit** 6 týdnů před výročím. Aplikace radí odeslat ji o týden dřív.
- Elektřina a plyn: předvyplněn 1 měsíc před koncem fixace – skutečnou lhůtu si každý ověří ve své smlouvě.
- Hypotéka: připomínka 3 měsíce před koncem fixace, aby byl čas porovnat nabídky bank.

## Další kroky

1. Otestovat Android verzi a sehnat 12 testerů s Androidem.
2. Podepsaná verze a zveřejnění v Google Play.
3. AI sken faktury → částka, splatnost, QR platba.
4. Sdílená domácnost a synchronizace mezi zařízeními.
5. Verze pro iPhone v App Store.
