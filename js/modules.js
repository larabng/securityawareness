/* =========================================================================
   Module – Expertenvideo, Hacker-Mission (erkennungsorientiert), Auflösung
   -------------------------------------------------------------------------
   Jede Mission ist ein Verständnis-Spiel: Die Teilnehmenden versetzen sich
   in die Angreiferperspektive, indem sie EINSCHÄTZEN, welcher Baustein einen
   Angriff wirksam macht – und sehen danach sofort die Schutzhandlung.
   Es werden keine echten Werkzeuge, Vorlagen oder Schritt-für-Schritt-
   Anleitungen vermittelt. Fiktive Firma: TalentBridge AG.

   video.url: leer lassen, bis das Expertenvideo vorliegt. Dann YouTube-Link
   (z. B. https://www.youtube.com/embed/XXXX) oder Pfad zu einer .mp4 eintragen.
   available: true = in der Testphase spielbar (laut Konzept Module 1 und 3).
   ========================================================================= */

window.MODULES = [
  {
    id: "m1", number: 1, title: "Phishing und Kontoübernahme", icon: "✉️", available: true,
    loot: "Zugangsdaten zum Postfach", lootLevel: 5,
    why: "Häufigster Einstieg. Bei rund 60 % der Datenpannen ist der Mensch beteiligt.",
    video: {
      expert: "IT-Security", duration: "ca. 1 Min.", url: "media/modul1_phishing.mp4",
      summary: "Die Fachperson erklärt, warum Phishing funktioniert und woran man es erkennt.",
      points: [
        ["Was will der Angriff?", "An Zugangsdaten für Postfach oder Bewerberportal kommen – und damit an CVs, Ausweise und interne Mails."],
        ["Welche Schwachstelle?", "Vertrauter Kontext und Routine: Recruiter erhalten täglich Portal-Benachrichtigungen."],
        ["Warum wirkt die Täuschung?", "Autorität, Zeitdruck und ein bekanntes Logo senken die Aufmerksamkeit."],
        ["Wer ist betroffen?", "Bewerber:innen, Kund:innen und die ganze Firma, wenn im Namen weiterverschickt wird."],
        ["Was stoppt den Angriff?", "Portale nur über Lesezeichen öffnen, Absender genau prüfen, MFA nutzen, Verdacht melden."]
      ]
    },
    mission: {
      intro: "Versetz dich in die Angreiferin. Schätze bei jedem Schritt ein, welche Wahl einen Phishing-Versuch am gefährlichsten macht. Danach siehst du, woran genau man ihn erkannt hätte.",
      target: "Postfach einer Recruiterin",
      steps: [
        { q: "Welcher Köder erzeugt am meisten Druck?", options: [
            { t: "«Ihr Konto läuft heute um 17:00 ab»", risk: 3, why: "Künstlicher Zeitdruck ist das klassische Warnsignal – echte Portale sperren nicht mit Minuten-Countdown." },
            { t: "«Monatlicher Newsletter»", risk: 1, why: "Ohne Handlungsdruck fällt der Köder kaum auf." },
            { t: "«Bitte um Feedback zur Website»", risk: 1, why: "Kein Druck, kaum Klickwirkung." } ] },
        { q: "Welches Detail macht den Absender glaubwürdiger – und ist zugleich das Erkennungsmerkmal?", options: [
            { t: "Eine Adresse, die dem Portal ähnelt, aber nicht exakt stimmt", risk: 3, why: "Fast-identische Absender sind das wichtigste Prüfmerkmal: Adresse immer Zeichen für Zeichen lesen." },
            { t: "Eine offensichtliche Wegwerf-Adresse", risk: 1, why: "Zu plump – wird sofort erkannt und gemeldet." },
            { t: "Gar kein Absendername", risk: 1, why: "Wirkt unseriös und wird ignoriert." } ] },
        { q: "Was erhöht die Trefferquote am stärksten?", options: [
            { t: "Ein Link auf eine nachgebaute Login-Seite", risk: 3, why: "Darum gilt: nie über Links in Nachrichten anmelden, sondern das Portal selbst öffnen." },
            { t: "Eine Bitte, zurückzurufen", risk: 2, why: "Ein zweiter Kanal gibt der Zielperson Zeit zum Nachdenken." },
            { t: "Ein Anhang zum Ausdrucken", risk: 1, why: "Umständlich, geringe Wirkung." } ] }
      ]
    },
    reveal: {
      question: "Was hätte diesen Angriff gestoppt?",
      answer: "Das Portal über das eigene Lesezeichen öffnen statt über den Link, die Absenderadresse Zeichen für Zeichen prüfen und bei Zeitdruck misstrauisch werden. MFA hätte gestohlene Passwörter zusätzlich entwertet.",
      stops: ["Zeitdruck → innehalten statt sofort klicken", "Fast-echter Absender → Adresse genau lesen", "Link zur Login-Seite → Portal selbst öffnen, nicht über den Link"]
    }
  },

  {
    id: "m2", number: 2, title: "Schadsoftware in Bewerbungsunterlagen", icon: "📎", available: false,
    loot: "Fernzugriff auf HR-Rechner", lootLevel: 5,
    why: "Recruiter müssen Anhänge von Unbekannten öffnen. 2025 gezielte Kampagnen gegen HR.",
    video: { expert: "IT-Security", duration: "3–5 min", url: "", summary: "Wie präparierte Dateien wirken und wie man Anhänge sicher behandelt.", points: [] },
    mission: { intro: "In der Testphase noch nicht freigeschaltet.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  },

  {
    id: "m3", number: 3, title: "CEO-Fraud", icon: "👔", available: true,
    loot: "Kandidatenprofile, ggf. Zahlung", lootLevel: 4,
    why: "In der Schweiz stark steigend: 970 Meldungen beim BACS 2025 (2023: 484).",
    video: {
      expert: "Finanzen", duration: "3–5 min", url: "",
      summary: "Warum eine Anweisung «von oben» so schwer zu hinterfragen ist – und wie der Freigabeprozess schützt.",
      points: [
        ["Was will der Angriff?", "Eine dringende Herausgabe von Daten oder eine Zahlung auslösen, bevor jemand nachfragt."],
        ["Welche Schwachstelle?", "Hierarchie und Hilfsbereitschaft: Einer Chef-Anweisung widerspricht man ungern."],
        ["Warum wirkt die Täuschung?", "Echter Name, Vertraulichkeit, Zeitdruck und oft ein Anruf, der die Mail «bestätigt»."],
        ["Wer ist betroffen?", "Kandidat:innen (Datenabfluss) und die Firma (direkter Finanzschaden)."],
        ["Was stoppt den Angriff?", "Rückfrage über einen bekannten zweiten Kanal und der Vier-Augen-Freigabeprozess."]
      ]
    },
    mission: {
      intro: "Versetz dich in den Angreifer. Schätze ein, welche Wahl eine gefälschte Chef-Anweisung am überzeugendsten macht. Danach siehst du, was sie entlarvt hätte.",
      target: "Kandidatenprofile für «Kunde X»",
      steps: [
        { q: "Welche Rolle gibt der Anfrage am meisten Gewicht?", options: [
            { t: "CEO / Geschäftsleitung", risk: 3, why: "Autorität ist der Hebel – genau deshalb gilt sie als Warnsignal, nicht als Freifahrtschein." },
            { t: "Eine Kollegin aus dem Nachbarteam", risk: 1, why: "Wenig Druck, leicht zu hinterfragen." },
            { t: "Ein externer Bewerber", risk: 1, why: "Hat keine Weisungsbefugnis." } ] },
        { q: "Welcher Zusatz erhöht den Druck am stärksten?", options: [
            { t: "«Vertraulich» plus knappe Frist", risk: 3, why: "Vertraulichkeit soll die normale Rückfrage verhindern – ein typisches Muster." },
            { t: "Eine freundliche Begrüssung", risk: 1, why: "Erhöht den Druck nicht." },
            { t: "Ein Hinweis auf die Kaffeepause", risk: 1, why: "Irrelevant." } ] },
        { q: "Was lässt die Anfrage am echtesten wirken?", options: [
            { t: "Ein Anruf, der die Mail «bestätigt»", risk: 3, why: "Zwei Kanäle vom selben Angreifer sind keine echte Bestätigung – darum muss die Rückfrage über einen unabhängig bekannten Kanal laufen." },
            { t: "Ein langer Textbaustein", risk: 1, why: "Macht eher misstrauisch." },
            { t: "Mehrere Rechtschreibfehler", risk: 1, why: "Senken die Glaubwürdigkeit." } ] }
      ]
    },
    reveal: {
      question: "Was hätte diesen Angriff gestoppt?",
      answer: "Eine Rückfrage über einen unabhängig bekannten Kanal (Durchwahl aus dem Verzeichnis, persönlich) und das Einhalten des Freigabeprozesses. Dringlichkeit und Vertraulichkeit sind Warnsignale, keine Gründe, den Prozess zu überspringen.",
      stops: ["Autorität → Weisung trotzdem über zweiten Kanal prüfen", "Zeitdruck + «vertraulich» → bewusst innehalten", "Bestätigungsanruf → nur ein unabhängiger Kanal zählt"]
    }
  },

  {
    id: "m4", number: 4, title: "Fake-Kandidaten und Deepfakes", icon: "🎭", available: false,
    loot: "Zugang zu Kundensystemen, Lohn", lootLevel: 4,
    why: "Wächst stark. Personaldienstleister vermitteln an Kunden und haften mit.",
    video: { expert: "HR / Recruiting", duration: "3–5 min", url: "", summary: "Woran man gefälschte Profile und Deepfake-Interviews erkennt.", points: [] },
    mission: { intro: "In der Testphase noch nicht freigeschaltet.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  },

  {
    id: "m5", number: 5, title: "Ransomware und Datenabfluss", icon: "🔒", available: false,
    loot: "Gesamter Datenbestand, Lösegeld", lootLevel: 5,
    why: "Grösster Schaden. ManpowerGroup-Franchise Lansing 2025 mit rund 145'000 Betroffenen.",
    video: { expert: "Datenschutz", duration: "3–5 min", url: "", summary: "Wie Ransomware ins Haus kommt und was im Ernstfall zu tun ist.", points: [] },
    mission: { intro: "In der Testphase noch nicht freigeschaltet. Baut auf den anderen Modulen auf und zeigt die ganze Angriffskette.", target: "", steps: [] },
    reveal: { question: "", answer: "", stops: [] }
  }
];

/* ---------- Verteidigungslevel (Posteingang) ----------
   Gemischte Nachrichten: Angriffe + harmlose echte Nachrichten.
   action: richtige Handlung. attack: true/false.  */
window.DEFENSE_INBOX = [
  { id: "d1", from: "Bewerberportal-Service", subject: "Konto läuft in 2 Stunden ab – jetzt anmelden", preview: "Melden Sie sich sofort über den folgenden Link an, sonst wird Ihr Zugang gelöscht.", attack: true, type: "Phishing", action: "melden", why: "Zeitdruck und Anmeldung über einen Link – Portal stattdessen selbst öffnen und melden." },
  { id: "d2", from: "Sandra Meier (Kollegin)", subject: "Mittagessen Donnerstag?", preview: "Hast du Donnerstag Zeit für einen schnellen Lunch?", attack: false, type: "Harmlos", action: "bearbeiten", why: "Normale interne Nachricht ohne Risiko." },
  { id: "d3", from: "M. Keller, CEO", subject: "VERTRAULICH – dringend Kandidatenprofile", preview: "Brauche in 20 Min alle Profile für Kunde X. Bitte nicht mit dem Team besprechen.", attack: true, type: "CEO-Fraud", action: "zurückfragen", why: "Autorität + Druck + Geheimhaltung: über bekannten zweiten Kanal prüfen." },
  { id: "d4", from: "Lukas B. (Bewerber)", subject: "Lebenslauf_final.zip", preview: "Mein CV liegt im Anhang als ZIP, Passwort: 1234. Bitte rasch anschauen.", attack: true, type: "Präparierte Bewerbung", action: "melden", why: "Passwort-ZIP von unbekannt umgeht den Virenscanner: über Bewerberportal einreichen lassen." },
  { id: "d5", from: "Kunde Zattoo AG", subject: "Rechnung wie besprochen", preview: "Anbei die gestern telefonisch vereinbarte Rechnung.", attack: false, type: "Harmlos", action: "bearbeiten", why: "Erwarteter Kontext über die gewohnte Adresse – normal bearbeiten." },
  { id: "d6", from: "IT-Support (extern)", subject: "Bitte Code durchgeben", preview: "Zur Wartung brauchen wir Ihren SMS-Anmeldecode. Bitte antworten.", attack: true, type: "Phishing / Vishing", action: "melden", why: "Echter Support fragt nie nach deinem Anmeldecode." }
];
