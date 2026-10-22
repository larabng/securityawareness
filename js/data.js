/* =========================================================================
   Inside the Mind of a Hacker – Inhalte
   -------------------------------------------------------------------------
   Lernformat nach dem Konzept: Angreiferperspektive, aber erkennungs- und
   abwehrorientiert. Die Missionen fragen NICHT, wie man einen echten Angriff
   baut, sondern lassen die Teilnehmenden den Mechanismus durchschauen und
   die passende Schutzhandlung wählen. Fiktive Firma, keine echten Werkzeuge.
   Inhalte anpassen = nur diese Datei bearbeiten.
   ========================================================================= */

window.APP_DATA = {

  config: {
    title: "Inside the Mind of a Hacker",
    subtitle: "Cybersecurity Awareness aus Angreifersicht",
    company: "TalentBridge AG (fiktiver Personaldienstleister)",
    topTeamsVisible: 3,
    adminPin: "2026",
    teams: ["Team Firewall", "Team Patch", "Team Bitlocker", "Team Captcha", "Team Sandbox", "Team Honeypot"]
  },

  /* ---------- Umfragen (Vorher / Nachher) ----------
     Parallele, gleich schwere Fragen. Die Lösung (correct) wird den
     Teilnehmenden NIE angezeigt – sie dient nur der Auswertung im Export. */
  surveys: {
    profileQuestions: [
      { id: "bereich", text: "In welchem Bereich arbeitest du?", options: ["Recruiting / Personalberatung", "Payroll / Administration", "Sales / Key Account", "IT", "Andere"] },
      { id: "erfahrung", text: "Hast du schon einmal eine Cybersecurity-Schulung besucht?", options: ["Nein", "Ja, vor über einem Jahr", "Ja, im letzten Jahr"] }
    ],
    pre: [
      { id: "pre1", topic: "Phishing",
        text: "Du erhältst eine Mail: «Ihr Bewerberportal-Konto läuft heute um 17:00 ab. Jetzt anmelden.» Was tust du?",
        options: ["Den Link in der Mail öffnen und schauen, ob die Seite echt aussieht", "Nicht klicken, das Portal über das bekannte Lesezeichen öffnen und die Mail melden", "Die Mail an eine Kollegin weiterleiten und fragen, ob sie das auch bekommen hat", "Die Mail löschen und nichts weiter tun"],
        correct: 1 },
      { id: "pre2", topic: "Präparierte Bewerbung",
        text: "Eine Bewerberin schickt ihren Lebenslauf als passwortgeschützte ZIP-Datei, das Passwort steht in der Mail. Wie gehst du vor?",
        options: ["Die ZIP-Datei öffnen, Bewerbungen müssen schliesslich bearbeitet werden", "Die Datei auf dem privaten Laptop öffnen, damit der Firmenrechner sicher bleibt", "Die Bewerberin bitten, die Unterlagen über das Bewerberportal hochzuladen, und die Mail der IT melden", "Die Mail ignorieren"],
        correct: 2 },
      { id: "pre3", topic: "CEO-Fraud",
        text: "Der CEO schreibt dir (richtiger Name, aber fremde Adresse): «Vertraulich. Ich brauche in 30 Minuten alle Kandidatenprofile für Kunde X.» Was tust du?",
        options: ["Die Profile schicken, es ist schliesslich der CEO", "Direkt auf die Mail antworten und fragen, ob die Anfrage echt ist", "Den CEO über einen bekannten zweiten Kanal (Nummer aus dem Verzeichnis) kontaktieren und den Fall melden", "Nur einen Teil der Profile schicken"],
        correct: 2 },
      { id: "pre4", topic: "Fake-Kandidat / Deepfake",
        text: "Im Video-Interview sind Bild und Ton leicht versetzt, Lippen und Stimme passen nicht ganz zusammen. Der Kandidat lehnt es ab, kurz die Hand vor das Gesicht zu halten. Was tust du?",
        options: ["Normal weitermachen, die Verbindung ist einfach schlecht", "Die Identität mit einem zusätzlichen Schritt prüfen (z. B. Ausweis live oder Treffen vor Ort) und die Auffälligkeit dokumentieren", "Das Gespräch abbrechen und den Kandidaten auf LinkedIn öffentlich warnen", "Den Kandidaten sofort an den Kunden vermitteln"],
        correct: 1 },
      { id: "pre5", topic: "Ransomware",
        text: "Auf deinem Bildschirm erscheint: «Ihre Dateien wurden verschlüsselt. Zahlen Sie 2 Bitcoin.» Was ist der erste richtige Schritt?",
        options: ["Den Rechner neu starten", "Netzwerkverbindung trennen, Rechner nicht ausschalten und sofort die IT informieren", "Die Dateien selbst aus dem Backup zurückspielen", "Das Lösegeld zahlen, damit der Betrieb weiterläuft"],
        correct: 1 },
      { id: "pre6", topic: "Melden",
        text: "Du hast vor einer Stunde auf einen Link in einer seltsamen Mail geklickt und bist jetzt unsicher. Was tust du?",
        options: ["Abwarten, ob etwas passiert", "Das Passwort ändern und niemandem etwas sagen", "Sofort der IT melden, auch wenn es unangenehm ist", "Die Mail löschen, damit niemand sonst darauf klickt"],
        correct: 2 }
    ],
    post: [
      { id: "post1", topic: "Phishing",
        text: "Eine SMS: «LinkedIn: Ihr Recruiter-Konto wurde gesperrt. Bestätigen Sie Ihre Identität.» Mit Link. Was tust du?",
        options: ["Den Link öffnen und die Daten eingeben, damit das Konto wieder läuft", "Auf die SMS antworten und fragen, ob sie echt ist", "Nicht klicken, LinkedIn direkt in der App öffnen und die SMS melden", "Die SMS ignorieren und weiterarbeiten"],
        correct: 2 },
      { id: "post2", topic: "Präparierte Bewerbung",
        text: "Ein Kandidat schickt über LinkedIn einen Link zu «Lebenslauf_final.zip» auf einem unbekannten Filehoster. Wie gehst du vor?",
        options: ["Herunterladen und öffnen, der Kandidat klingt vielversprechend", "Den Kandidaten bitten, die Unterlagen über das Bewerberportal einzureichen, und die Nachricht melden", "Die Datei auf einem USB-Stick an einen anderen Rechner bringen", "Den Link ans Recruiting-Team weiterleiten"],
        correct: 1 },
      { id: "post3", topic: "CEO-Fraud",
        text: "Ein Anrufer stellt sich als Finanzchef vor, die Stimme klingt echt. Er verlangt, dass du heute noch CHF 48'000 an einen neuen Lieferanten überweisen lässt. Was tust du?",
        options: ["Die Zahlung sofort veranlassen, die Stimme war eindeutig", "Um eine schriftliche Bestätigung per Mail bitten und dann zahlen", "Auflegen, den Finanzchef über die bekannte Nummer zurückrufen und den Freigabeprozess einhalten", "Die Hälfte überweisen und den Rest morgen"],
        correct: 2 },
      { id: "post4", topic: "Fake-Kandidat / Deepfake",
        text: "Ein Kandidat hat einen perfekten Lebenslauf, aber das LinkedIn-Profil ist zwei Wochen alt. Er will nur remote arbeiten und den Lohn auf ein Konto im Ausland. Was tust du?",
        options: ["Ihn vermitteln, die Qualifikationen passen", "Die Identität zusätzlich prüfen (Referenzen, Ausweis live, Treffen) und die Auffälligkeiten dokumentieren", "Ihm sofort absagen, ohne Begründung", "Ihn bitten, ein neues LinkedIn-Profil zu erstellen"],
        correct: 1 },
      { id: "post5", topic: "Ransomware",
        text: "Eine Kollegin sagt, auf dem Teamlaufwerk enden plötzlich viele Dateien auf «.locked». Was ist der erste richtige Schritt?",
        options: ["Versuchen, die Dateien umzubenennen", "Den eigenen Rechner vom Netz trennen und sofort die IT informieren", "Abwarten, vielleicht ist es ein Update", "Die Dateien auf den eigenen Desktop kopieren"],
        correct: 1 },
      { id: "post6", topic: "Abwägen",
        text: "Ein bekannter Kunde schickt über die gewohnte Adresse die Rechnung, die ihr letzte Woche telefonisch besprochen habt. Was tust du?",
        options: ["Die Rechnung normal bearbeiten", "Die Mail sicherheitshalber der IT melden", "Den Kunden über einen zweiten Kanal zurückrufen", "Die Rechnung ablehnen"],
        correct: 0 }
    ],
    feedback: [
      { id: "fb_spass", text: "Wie viel Spass hat dir die Schulung gemacht?" },
      { id: "fb_verstaendlich", text: "Wie verständlich waren die Inhalte?" },
      { id: "fb_relevant", text: "Wie relevant ist das Gelernte für deinen Arbeitsalltag?" },
      { id: "fb_perspektive", text: "Hat dir der Perspektivwechsel geholfen, Angriffe zu verstehen?" }
    ],
    confidenceLabels: ["Geraten", "Eher unsicher", "Teils/teils", "Eher sicher", "Ganz sicher"]
  }
};
