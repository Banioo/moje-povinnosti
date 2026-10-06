# Moje povinnosti – verze 0.3

Mobilní aplikace (PWA) na hlídání plateb, smluv, výpovědních lhůt, STK a dokladů.
Data zůstávají jen v telefonu uživatele, bez registrace.

## Co je ve složce

| Soubor | K čemu slouží |
| --- | --- |
| `index.html` | Obrazovky aplikace (Přehled, Seznam, Přidat, Nastavení) |
| `style.css` | Vzhled, světlý i tmavý režim |
| `app.js` | Veškerá logika: šablony, výpočty, lhůty, připomínky, kalendář, záloha |
| `manifest.json` | Říká telefonu, že jde o aplikaci (název, ikona, barva) |
| `sw.js` | Service worker – aplikace funguje i bez internetu |
| `icons/` | Ikony aplikace |

## Jak ji dostat na internet (zdarma, bez příkazové řádky)

1. Otevřete https://app.netlify.com/drop
2. Přetáhněte celou složku `moje-povinnosti` do okna.
3. Za pár sekund dostanete odkaz typu `https://neco.netlify.app`.
   (Pro trvalý odkaz si založte bezplatný účet.)

Aplikace musí běžet přes `https://`, jinak se nedá nainstalovat. Otevření `index.html` přímo z disku funguje jen na zkoušku.

## Jak ji nainstalovat do telefonu

- **iPhone:** otevřete odkaz v Safari → Sdílet → Přidat na plochu.
- **Android:** otevřete odkaz v Chrome → menu ⋮ → Instalovat aplikaci.

## Jak fungují připomínky

- Při otevření aplikace se ukážou upozornění na blížící se platby a lhůty.
- Spolehlivé připomínky i se zavřenou aplikací: tlačítko **Do kalendáře** (nebo v Nastavení **Přidat vše do kalendáře**) vytvoří soubor `.ics`, který se uloží do kalendáře v telefonu i s připomenutím v 9:00.
- Upozornění na pozadí bez otevření aplikace vyžadují server (push notifikace) – to přijde v další verzi.

## Když něco změníte

V souboru `sw.js` zvyšte číslo verze (`moje-povinnosti-v1` → `moje-povinnosti-v2`) a nahrajte složku znovu. Jinak si telefony nechají starou verzi.

## Výpověď na 1 klik

U smlouvy klepněte na položku → **Napsat výpověď**. Vyplníte jméno, adresu, firmu a číslo smlouvy a aplikace vytvoří hotový dopis (vzory pro pojištění, povinné ručení, energie, operátory, nájem a ostatní smlouvy). Text jde zkopírovat, poslat e-mailem nebo vytisknout či uložit jako PDF. Vaše jméno a adresa se zapamatují jen v telefonu. Po odeslání klepněte na **Výpověď jsem odeslal(a)** a připomínky výpovědi se vypnou.

Vzory jsou obecné, nejsou právní poradenství. Rozhoduje den doručení, proto doporučeně s dodejkou nebo datovou schránkou.

## Výpovědní lhůty v šablonách

- Povinné ručení, havarijní pojištění, pojištění domácnosti: výpověď musí pojišťovně **dorazit** 6 týdnů před výročím. Aplikace radí odeslat ji ještě o týden dřív.
- Elektřina a plyn: předvyplněn 1 měsíc před koncem fixace – skutečnou lhůtu si každý ověří ve své smlouvě.

## Další kroky (podle průzkumu)

1. Vyzkoušet s 10–20 lidmi z okolí a sbírat připomínky.
2. AI sken faktury → částka, splatnost, QR platba.
3. Sdílená domácnost a přihlášení (synchronizace mezi zařízeními).
4. Zabalení do App Store / Google Play (Capacitor) a placený tarif.
