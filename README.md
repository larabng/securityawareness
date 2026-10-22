# Inside the Mind of a Hacker

Prototyp der Schulungswebseite für das WI-Projekt HS26 (Thema 10 – Cybersecurity Clinic, CyrenZH).
Auftraggeber: ManpowerGroup Schweiz · Team: Michele, Daniele, Lara.

Gamifizierte Cybersecurity-Awareness-Schulung aus Angreiferperspektive – aber **erkennungs- und
abwehrorientiert**: Die Teilnehmenden durchschauen den Mechanismus eines Angriffs und üben die
Schutzhandlung. Es werden bewusst keine echten Werkzeuge, Vorlagen oder Angriffsanleitungen vermittelt
(Leitplanke aus dem Konzept: „Man lernt den Mechanismus, keine Anleitung").

## Was drin ist

- **Vorher-Umfrage** (Pflicht) mit Selbsteinschätzung pro Frage
- **Expertenvideos** pro Modul (Platzhalter, bis die echten Videos vorliegen)
- **Hacker-Missionen** in dunkler Terminal-Oberfläche + die beiden Balken (Beutewert / Unternehmensschaden)
- **Auflösung** „Was hätte dich gestoppt?" pro Modul
- **Verteidigungslevel**: Posteingang mit Angriffen und harmlosen Nachrichten
- **Nachher-Umfrage** + Feedback
- **Team-Rangliste** (nur Top 3 sichtbar) und persönliche Auswertung
- **CSV-Export** aller Antworten für die Testleitung

Für die Testphase freigeschaltet: **Modul 1 (Phishing)** und **Modul 3 (CEO-Fraud)**.

## Lokal ansehen

Einfach `index.html` im Browser öffnen – kein Build, keine Installation nötig.
(Für den Video-Einbettungstest am besten über einen kleinen lokalen Server, z. B. `python -m http.server`.)

## Online stellen (GitHub Pages)

1. Dateien ins Repo `larabng/securityawareness` pushen (Branch `main`).
2. Auf GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. Nach ein paar Minuten ist die Seite unter `https://larabng.github.io/securityawareness/` erreichbar.

## Inhalte anpassen

Alles steht in zwei Dateien, kein Code nötig:

- `js/data.js` – Umfragen (Vorher/Nachher), Feedback, Teams, Firmenname
- `js/modules.js` – Module (Videos, Missionen, Auflösungen) und der Verteidigungs-Posteingang

### Video eintragen
In `js/modules.js` beim jeweiligen Modul `video.url` ausfüllen:
- YouTube: `url: "https://www.youtube.com/embed/VIDEO_ID"`
- eigene Datei: Video z. B. nach `media/modul1.mp4` legen und `url: "media/modul1.mp4"`

### Modul freischalten
Beim Modul `available: true` setzen.

## Struktur

```
index.html          Grundgerüst + Abschnitte
css/style.css       Design in ManpowerGroup-Farben
js/data.js          Umfragen & Konfiguration
js/modules.js       Module & Verteidigungslevel
js/app.js           Ablauflogik (Vanilla JS)
```

## Hinweise

- Firma und alle Daten sind **fiktiv** (TalentBridge AG).
- Der Fortschritt wird nur im Browser (sessionStorage) gehalten; die Auswertung läuft über den CSV-Export.
- Die Balkenwerte sind fiktiv und veranschaulichen nur die Grössenordnung.
