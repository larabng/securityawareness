# Inside the Mind of a Hacker – Schriftliche Arbeit WI-Projekt HS26

Entwurf vom 06.11.2026

## Titelblatt

**Inside the Mind of a Hacker**

Konzept und Prototyp einer gamifizierten Cybersecurity-Awareness-Schulung für den Recruiting-Bereich von ManpowerGroup Schweiz

Michele \[Nachname\] · Daniele \[Nachname\] · Lara Bangerter

Schriftliche Arbeit verfasst an der School of Management, Zürcher Hochschule für Angewandte Wissenschaften

WI-Projekt HS26, Thema 10 – Cybersecurity Clinic Project (CyrenZH) · Betreuung: Christian Weber · Auftraggeberin: ManpowerGroup Schweiz

Winterthur, \[Abgabedatum Januar 2027\]

*Hinweis zum Entwurf: Stellen in eckigen Klammern \[ \] ergänzt das Team. Ergebnisse der Testphase folgen nach deren Durchführung. Für die Abgabe wird der Text in die SML-Berichtsvorlage übertragen.*

## Management Summary

Personaldienstleister wie ManpowerGroup verarbeiten grosse Mengen sensibler Daten: Lebensläufe, Ausweiskopien, AHV-Nummern sowie Bank- und Lohndaten. Gleichzeitig öffnen Recruiter täglich Nachrichten und Dateien von Unbekannten. Der Mensch ist bei rund 60 % aller Datenpannen beteiligt (Verizon, 2025). Der Angriff auf die ManpowerGroup-Franchise in Lansing (2024/25) mit rund 145’000 Betroffenen zeigt, dass das Risiko real ist.

Klassische Awareness-Massnahmen wirken kaum. In zwei grossen Feldstudien mit 19’500 bzw. 14’773 Mitarbeitenden hatten Pflichtschulungen und Lernseiten nach einem Fehlklick keinen oder nur einen minimalen Effekt (Ho et al., 2025; Lain et al., 2022). ManpowerGroup suchte deshalb ein Format, an dem Mitarbeitende aktiv teilnehmen und das ihnen in Erinnerung bleibt.

Unsere Lösung ist die Schulungswebseite *Inside the Mind of a Hacker*. Die Teilnehmenden wechseln kurz die Seite und denken wie ein Angreifer. In fünf Modulen zu den wichtigsten Risiken im Recruiting (Phishing, Schadsoftware in Bewerbungen, CEO-Fraud, Fake-Kandidaten und Deepfakes, Ransomware) sehen sie ein Expertenvideo, spielen eine Hacker-Mission und erfahren, welche Schutzmassnahme den Angriff gestoppt hätte. Danach wechseln die Rollen: Im Abwehr-Level trennen sie in einem Posteingang echte Angriffe von harmlosen Nachrichten. Die Module werden in Zweierteams gespielt. In einem Workshop fügen danach 2–6 Personen ihre Hinweise zusammen, sodass Angriffe nur gemeinsam erkannt werden. Die Leitplanke lautet: Gelernt wird der Mechanismus, nicht die Anleitung.

Der Ansatz stützt sich auf die Inokulationstheorie. Rollenspiele aus Angreifersicht verbesserten die Phishing-Erkennung in einer Studie um 36,7 %, während herkömmliche Trainings keinen Effekt zeigten (Wen et al., 2019). Der Lernerfolg wird mit einem Vorher-Nachher-Fragebogen gemessen, der parallele, gleich schwere Situationen ohne Lösungsanzeige enthält und zusätzlich die Selbstsicherheit erfasst. Ein funktionsfähiger Prototyp mit allen fünf Modulen ist online verfügbar.

&#91;Ergebnisse der Testphase in zwei bis drei Sätzen ergänzen.\]

Wir empfehlen ManpowerGroup, die Schulung als Kick-off mit anschliessender Freigabe eines Moduls alle drei bis vier Wochen einzuführen. Im Alltag soll eine einzige Gewohnheit verankert werden: innehalten, den Kontext prüfen, über einen unabhängigen Kanal verifizieren und melden.

## 1 Einleitung

Dieses Kapitel beschreibt den Auftrag, die Problemstellung und das Ziel der Arbeit.

### 1.1 Ausgangslage

Das Projekt entstand im Rahmen von CyrenZH, dem Cyber Resilience Network Zürich, als Cybersecurity Clinic Project. Auftraggeberin ist ManpowerGroup Schweiz, eines der grössten Personaldienstleistungsunternehmen des Landes. Die Leitfrage der Auftraggeberin lautet: «How can we design an engaging cybersecurity awareness experience that employees will actively participate in and remember?»

Personaldienstleister sind ein attraktives Ziel. Sie verarbeiten Lebensläufe, Ausweiskopien, AHV-Nummern sowie Bank- und Lohndaten in grosser Zahl. Recruiter müssen zudem ständig mit Unbekannten kommunizieren und deren Dateien öffnen. Ihr Arbeitsalltag macht sie damit zum bevorzugten Einfallstor.

### 1.2 Problemstellung

Viele Unternehmen setzen auf jährliche E-Learnings und simulierte Phishing-Mails. Die Forschung zeigt, dass diese Formate wenig bewirken. In einer Studie mit 19’500 Mitarbeitenden hatte die jährliche Pflichtschulung keinen messbaren Effekt. Lernseiten nach einem Fehlklick senkten die Klickrate nur um 2 %, und drei Viertel der Betroffenen verbrachten höchstens eine Minute darauf (Ho et al., 2025). Eine Studie der ETH Zürich mit 14’773 Mitarbeitenden über 15 Monate fand ebenfalls keinen Nutzen solcher Lernseiten (Lain et al., 2022).

Die Themenausschreibung nennt vier Schwächen bestehender Massnahmen: geringe Interaktivität, fehlende Anpassung an HR-Prozesse, begrenzte Nachhaltigkeit und geringe Motivation. Hinzu kommt eine Forschungslücke: Zu Angriffen, die gezielt den Recruiting-Prozess ausnutzen, gibt es kaum wissenschaftliche Studien.

### 1.3 Fragestellung und Ziel

Die Arbeit beantwortet folgende Frage: *Wie lässt sich eine gamifizierte Awareness-Schulung gestalten, die Mitarbeitende im Recruiting aktiv einbindet, die spezifischen Risiken ihres Arbeitsalltags abbildet und deren Lernerfolg messbar ist?*

Ziel ist ein strukturiertes und umsetzbares Konzept, das ManpowerGroup als Grundlage für eine spätere Einführung dient. Gemäss Vorgabe des Betreuers umfasst die Arbeit zusätzlich einen testbaren Prototyp, ein Testkonzept mit Vorher-Nachher-Fragebogen und die Durchführung einer Testphase. Im Einzelnen verfolgen wir fünf Projektziele:

1. Konzept für eine Schulungswebseite aus Angreiferperspektive, zugeschnitten auf die fünf wichtigsten Cyberrisiken im Recruiting
2. Testbarer Prototyp mit Modulen, Abwehr-Level und den beiden Balken für Beutewert und Unternehmensschaden
3. Testkonzept mit Vorher-Nachher-Fragebogen ohne Lösungsanzeige
4. Beschreibung einer Online- und einer Vor-Ort-Variante
5. Durchgeführte und ausgewertete Testphase, mit Problemen und Zusammenarbeit im Projekttagebuch dokumentiert

### 1.4 Abgrenzung

Die Arbeit konzentriert sich auf Mitarbeitende in HR und Recruiting. Technische Schutzmassnahmen wie E-Mail-Filter oder Endpoint-Schutz sind nicht Teil der Arbeit, ebenso wenig die Integration in eine bestehende Lernplattform. Der Prototyp ist eine statische Webseite für Tests und keine produktive Lösung. Firma und Daten in der Schulung sind fiktiv. Aus Sicherheitsgründen vermittelt die Schulung keine echten Angriffswerkzeuge oder Vorlagen.

### 1.5 Bedeutung für die Praxis

Die Bedrohung ist konkret. Zwischen Dezember 2024 und Januar 2025 griff die Gruppe RansomHub die ManpowerGroup-Franchise in Lansing (USA) an. Knapp 145’000 Personen waren betroffen, die Angreifer beanspruchten rund 500 GB Daten inklusive Ausweiskopien (Gatlan, 2025). In der Schweiz stiegen die CEO-Fraud-Meldungen beim Bundesamt für Cybersicherheit von 484 (2023) auf 970 (2025) (Netzwoche, 2026). Eine Datenpanne kostet weltweit durchschnittlich 4,44 Mio. USD (IBM, 2025). Nach dem Schweizer Datenschutzgesetz drohen den verantwortlichen Personen zudem Bussen bis CHF 250’000 (PwC Schweiz, o. J.).

### 1.6 Aufbau der Arbeit

Kapitel 2 beschreibt das Vorgehen, die Literaturrecherche, die theoretischen Grundlagen und das Messdesign. Kapitel 3 stellt die Resultate vor: die Bedrohungslage, das Schulungskonzept, den Prototyp und die Testphase. Kapitel 4 diskutiert die Ergebnisse und ihre Grenzen. Kapitel 5 und 6 schliessen mit einem Rückblick und den nächsten Schritten ab.

## 2 Material und Methoden

Dieses Kapitel zeigt, wie wir vom Auftrag zum Konzept und zum Prototyp gelangt sind und wie wir den Lernerfolg messen.

### 2.1 Projektvorgehen

Das Projekt lief von September 2026 bis Januar 2027 in vier Phasen:

1. **Analyse** (September 2026): Auftragsklärung, Literaturrecherche zu den Cyberrisiken im Recruiting und zur Wirkung von Awareness-Trainings
2. **Konzeption** (September bis Oktober 2026): zwei alternative Grundkonzepte, Besprechung mit dem Betreuer am 01.10.2026, Entscheid für ein Konzept
3. **Prototyping** (Oktober bis November 2026): Umsetzung der Schulungswebseite, Zwischenpräsentation
4. **Test und Auswertung** (\[Zeitraum ergänzen\]): Testphase, Auswertung, Bericht und Schlusspräsentation

In der Besprechung vom 01.10.2026 legte der Betreuer sechs verbindliche Vorgaben fest: Bis zur Testphase muss alles umgesetzt sein; Probleme werden laufend in einem Projekttagebuch dokumentiert; die Zusammenarbeit wird als Spielelement eingebaut; es braucht ein eigenes Testkonzept; die Schulung muss auch vor Ort durchführbar sein; der Lernerfolg wird mit einem Vorher-Nachher-Fragebogen ohne Lösungen gemessen. Das Projekttagebuch (Anhang A) hält Besprechungen, Entscheide, Probleme und die Aufgabenteilung fest.

### 2.2 Literaturrecherche

Die Recherche verfolgte zwei Fragen: Welches sind die wichtigsten Cyberrisiken für Personaldienstleister? Und welche Trainingsformen wirken nachweislich? Gesucht wurde in Google Scholar, IEEE Xplore, ACM Digital Library, SpringerLink und arXiv. Ergänzt wurden Lageberichte von Behörden (BACS, FBI IC3, ENISA) und Branchenberichte (Verizon, IBM).

Die Quellen wurden nach ihrem Zweck gewichtet. Peer-reviewed Studien bilden die theoretische Grundlage. Behördenberichte liefern aktuelle Fallzahlen. Branchen- und Medienquellen dienen nur für Fallbeispiele, etwa den Angriff auf ManpowerGroup Lansing. Aus der Recherche ergab sich eine Rangliste der fünf wichtigsten Risiken, die die Module der Schulung bilden (Kapitel 3.1).

### 2.3 Theoretische Grundlagen

Vier Erkenntnisse aus der Forschung prägen das Design.

**Klassisches Training reicht nicht.** Pflichtschulungen und Lernseiten nach einem Fehlklick zeigen kaum Wirkung (Ho et al., 2025; Lain et al., 2022). Gut funktioniert dagegen das Melden: Mitarbeitende meldeten Phishing-Mails schnell und zu 68 % korrekt (Lain et al., 2022). Daraus folgt, dass die Teilnehmenden handeln statt lesen müssen und dass Melden ein zentrales Lernziel ist.

**Perspektivenwechsel wirkt wie eine Impfung.** Nach der Inokulationstheorie werden Menschen widerstandsfähiger gegen Manipulation, wenn sie eine abgeschwächte Form der Technik selbst erleben. Im Spiel *Bad News* übernahmen 15’000 Teilnehmende die Rolle von Fake-News-Produzenten. Nach 15 Minuten stuften sie Falschnachrichten im Schnitt 21 % weniger glaubwürdig ein, ohne echte Nachrichten schlechter zu bewerten (Roozenbeek & van der Linden, 2019). Das Rollenspiel *What.Hack* verbesserte die Phishing-Erkennung um 36,7 %, zwei herkömmliche Trainings hatten keinen signifikanten Effekt (Wen et al., 2019).

**Motivation braucht Autonomie, Kompetenz und Eingebundenheit.** Gemäss Selbstbestimmungstheorie entsteht Motivation, wenn diese drei Grundbedürfnisse erfüllt sind. Eine Metaanalyse von 35 Interventionen zeigt, dass Gamification vor allem Eingebundenheit und Autonomie stärkt, das Kompetenzerleben aber kaum (Li et al., 2024). Kompetenz muss deshalb über klares Feedback und steigende Schwierigkeit vermittelt werden, nicht nur über Punkte.

**Wiederholung wirkt gegen das Vergessen.** Die Wirkung von Awareness-Trainings hält etwa vier Monate und nimmt nach sechs Monaten deutlich ab. Videos und interaktive Beispiele wirken am längsten (Reinheimer et al., 2020). Gamifizierte Formate mit Storytelling und Team-Ranglisten steigern Wissen und Engagement, ihre Langzeitwirkung ist jedoch kaum untersucht (Gwenhure & Rahayu, 2024).

### 2.4 Konzeptentwicklung und Konzeptwahl

Das Team entwickelte zwei Grundkonzepte. Der *Cybersecurity Escape Room «Der stille Alarm»* lässt die Teilnehmenden einen Arbeitstag als Recruiter erleben. An fünf Stationen müssen sie Angriffe erkennen, bevor ein «Sicherheitslevel» sinkt. *Inside the Mind of a Hacker* lässt sie dagegen zuerst die Angreiferrolle einnehmen und erst danach als Mitarbeitende verteidigen.

Wir entschieden uns für *Inside the Mind of a Hacker*. \[Begründung durch das Team prüfen und ergänzen.\] Der Perspektivenwechsel ist durch die Inokulationstheorie und die Studie zu *What.Hack* empirisch gestützt. Zudem nutzt er die Neugier auf das Verbotene als Motivator. Der Abwehr-Level enthält weiterhin die Verteidigungssicht des Escape Rooms. Aus dem Escape Room übernommen wurden ausserdem die gestaffelte Freigabe im Abstand von drei bis vier Wochen sowie das dreistufige Anreizsystem.

### 2.5 Prototyping

Der Prototyp ist eine statische Webseite in HTML, CSS und JavaScript ohne Build-Schritt und ohne Server. Sie läuft in jedem Browser und ist über GitHub Pages öffentlich erreichbar (Anhang D). Alle Inhalte wie Module, Fragebogen und Abwehr-Posteingang liegen in separaten Datendateien. So lassen sie sich ohne Programmierkenntnisse anpassen. Ein automatisierter Browsertest spielt einen vollständigen Durchlauf und prüft die Sperren zwischen den Schritten sowie den Datenexport. Die Gestaltung folgt den Farben von ManpowerGroup, die Sprache ist gemäss Auftrag Englisch.

Die kooperative Team-Mission entstand zuerst als separater Prototyp mit drei Rollen und geschwärzten Informationen. Danach wurde sie zu einer Workshop-Runde für 2–6 Personen ausgebaut (Kapitel 3.5). Sie kommt ohne Server aus: Ein gemeinsamer Laptop zeigt den Teamtisch, jede Person ruft ihre Hinweiskarten per QR-Code auf dem eigenen Handy auf, und ein Abschlusscode überträgt das Ergebnis in die App jedes Teams.

### 2.6 Messdesign und Testkonzept

Der Lernerfolg wird mit einem Vorher-Nachher-Vergleich gemessen. Der Vorher-Fragebogen ist Pflicht, bevor die Module öffnen. Der Nachher-Fragebogen öffnet erst nach dem Abwehr-Level. Beide sind anonym.

Damit der Vergleich sauber ist, gelten folgende Regeln:

- **Parallele Formen:** Es gibt zwei Formen A und B mit je acht Situationen: fünf Angriffe (einer pro Modul), ein eigener Fehler und zwei harmlose Nachrichten. Jede Situation prüft denselben Mechanismus wie ihr Gegenstück, aber in einem anderen Kontext. Keine ist eine Kopie aus dem Training. Die Reihenfolge der Formen wird pro Durchlauf zufällig bestimmt. So kann eine schwerere Form keinen Effekt vortäuschen.
- **Gleiche Antwortoptionen:** Wie im Abwehr-Level stehen «Process», «Verify», «Report» und «Reject» zur Wahl. Bewertet wird mit 2 Punkten für die beste, 1 für eine vertretbare und 0 für eine unsichere Handlung. Lösungen werden nie angezeigt.
- **Selbstsicherheit:** Zu jeder Situation geben die Teilnehmenden an, wie sicher sie sind (1–5). Daraus lässt sich berechnen, ob die Selbsteinschätzung zur Leistung passt. Das ist wichtig, weil sich Menschen gerade bei Deepfakes stark überschätzen (Köbis et al., 2021).
- **Gleiche Einstellungsfragen:** Selbsteinschätzung pro Bedrohung, empfundene Attraktivität als Ziel und Einstellung zu Sicherheitsregeln werden vorher und nachher identisch gefragt.
- **Ankerfrage:** Nur eine zufällige Hälfte sieht einen Ankerwert von 80 Mio. USD. So lässt sich der Ankereffekt bei Schadenschätzungen vergleichen.

Am Ende jedes Durchlaufs exportiert die Testleitung die Antworten als CSV-Datei. Ein Skript führt alle Exporte zu einer Tabelle zusammen. Ausgewertet werden nur Durchläufe mit ausgefülltem Vorher- und Nachher-Fragebogen. Für den Vergleich der Paare eignet sich der Wilcoxon-Vorzeichen-Rang-Test mit Angabe der Effektstärke.

Geplant sind \[Anzahl Testrunden und Testpersonen festlegen; Konzept: zwei Runden mit je 6–10 Personen, online und vor Ort\]. Neben den Fragebogen beobachten wir die Dauer pro Schritt, Abbrüche und Verständnisprobleme. Das vollständige Testkonzept findet sich in Anhang C.

### 2.7 Zusammenarbeit und Arbeitsweise

Das Team arbeitete iterativ: Ideen wurden rasch umgesetzt, im Team geprüft und in kleinen Schritten verbessert.

**Werkzeuge und Ablage.** Kurze Absprachen liefen über einen Gruppenchat. Für die gemeinsame Ablage schlug das Team zunächst einen Ordner im Microsoft-Teams-Kanal vor, damit alle am selben Stand arbeiten. Am 22.10.2026 einigte es sich darauf, alle Projektdaten zusätzlich im GitHub-Repository abzulegen. Der Grund: Die KI-Assistenten der Teammitglieder können auf das Repository zugreifen, nicht aber auf den Teams-Ordner. Das Repository wurde damit zur zentralen Quelle für Prototyp, Präsentation und Dokumentation. Die Commit-Historie zeigt zudem nachvollziehbar, wer wann was beigetragen hat.

**Einsatz von KI.** Das Team nutzte den KI-Assistenten Claude (Anthropic) als Werkzeug: für die Literaturrecherche, für das Ausarbeiten von Umsetzungsvorschlägen, beim Programmieren des Prototyps (in den Commits als Co-Autor vermerkt) und für einen ersten Entwurf dieses Berichts. Ein Beispiel für den Ablauf: Am 22.10.2026 übernahm das Team die Idee eines Schlüsselsystems von einer bestehenden Webseite. Die KI passte sie ans Narrativ an – pro Modul ein Schlüssel für eine durchschaute Schwachstelle, am Ende öffnen alle Schlüssel das «Tor zur Firma» und der Rollenwechsel beginnt. Ausserdem listete sie die nötigen Änderungen pro Datei auf. Das Team prüfte den Vorschlag, liess ihn umsetzen und testete das Ergebnis. Inhaltliche Entscheide, Quellenprüfung und Bewertung lagen beim Team. \[KI-Deklaration mit den Vorgaben des Betreuers abgleichen.\]

**Entwicklung des Prototyps.** Tabelle 2-1 zeigt die wichtigsten Schritte aus der Versionsverwaltung.

| Datum | Schritt | Beitrag |
| --- | --- | --- |
| 05.11.2026 | Team-Mission als Workshop-Runde für 2–6 Personen mit QR-Codes und Abschlusscode | Maniamic |
| 03.11.2026 | Vorher-Nachher-Umfrage neu aufgebaut, App in Module aufgeteilt und neu gestaltet | Maniamic |
| 03.11.2026 | Prototyp der kooperativen Team-Mission mit geschwärzten Informationen | larabng |
| 28.10.2026 | Expertenvideo Modul 3 (CEO-Fraud) | Maniamic |
| 26.10.2026 | Module 2, 4 und 5 fertiggestellt, Missionen, Abwehr-Level und Auswertung verbessert | Maniamic |
| 23.10.2026 | Vorher-Umfrage mit 23 Fragen, anonymisiert | Daniele |
| 22.10.2026 | Gamification (Punkte, Schlüssel, Company Gate, Badges, Hinweise, Streaks), Präsentation | larabng |
| 22.10.2026 | Schulungswebseite mit Modul 1 und Phishing-Video, Übersetzung ins Englische | larabng |
| 01.10.2026 | Repository angelegt | larabng |

*Tabelle 2-1: Entwicklungsschritte des Prototyps (GitHub-Benutzernamen; Zuordnung zu Personen siehe Kapitel 9)*

## 3 Resultate

Dieses Kapitel stellt das erarbeitete Konzept, den Prototyp und die Ergebnisse der Testphase dar. Die Unterkapitel folgen den Anforderungen aus der Themenausschreibung.

### 3.1 Bedrohungslage im Recruiting

Die Literaturrecherche ergab fünf Risiken, die für Personaldienstleister am wichtigsten sind. Tabelle 3-1 zeigt sie mit ihrer Begründung. Sie bilden die fünf Module der Schulung.

| # | Risiko | Warum es im Recruiting zählt | Beleg |
| --- | --- | --- | --- |
| 1 | Phishing und Kontoübernahme | Häufigster Einstieg; Recruiter schreiben ständig mit Unbekannten. In der ETH-Studie klickten 32,1 % mindestens einmal auf eine simulierte Phishing-Mail | Lain et al. (2022); Verizon (2025) |
| 2 | Schadsoftware in Bewerbungsunterlagen | Recruiter müssen Anhänge öffnen; 2025 verbreitete eine Kampagne über gefälschte Bewerbungen eine Hintertür | CSO Online (2025); SHRM (2025) |
| 3 | CEO-Fraud | Autorität und Zeitdruck verhindern Rückfragen; 970 Meldungen beim BACS 2025 gegenüber 484 im Jahr 2023 | Buo (2020); Netzwoche (2026) |
| 4 | Fake-Kandidaten und Deepfakes | Personaldienstleister vermitteln an Kunden und haften mit; Menschen erkennen Deepfakes schlecht, überschätzen sich aber | Köbis et al. (2021); FBI IC3 (2022) |
| 5 | Ransomware und Datenabfluss | Höchster Schaden; meist Folge von Phishing oder Schadsoftware. Fall ManpowerGroup Lansing mit rund 145’000 Betroffenen | Oz et al. (2022); Gatlan (2025) |

*Tabelle 3-1: Die fünf wichtigsten Cyberrisiken im Recruiting*

Gemeinsam ist allen Angriffen, dass sie menschliche Eigenschaften ausnutzen: Hilfsbereitschaft gegenüber Bewerbenden, Respekt vor Vorgesetzten und Zeitdruck. Eine Analyse von 887 Phishing-Mails zeigt, dass Dringlichkeit und der Bezug auf bekannte Tools über die Jahre zunehmen (Zielinska et al., 2016). Die Schulung muss diese psychologischen Hebel deshalb sichtbar machen und nicht nur technische Merkmale abfragen.

&#91;Ergänzung nötig: Risiken beim Einsatz von KI im Recruiting, insbesondere Bias in automatisierten Auswahlverfahren, werden in der Themenausschreibung ausdrücklich genannt. Das Team entscheidet, ob sie als sechstes Modul oder als Erweiterung von Modul 4 behandelt werden.\]

### 3.2 Lernziele und Zielgruppe

Zielgruppe sind Mitarbeitende von ManpowerGroup Schweiz in Recruiting und HR, die täglich mit Kandidat:innen, Kunden und Personendaten arbeiten. Nach der Schulung können sie:

1. erklären, was ein Angriff erreichen will und welche menschliche oder organisatorische Schwachstelle er nutzt
2. die Wirkung von Autorität, Zeitdruck und vertrautem Kontext erkennen
3. Phishing, schädliche Bewerbungsunterlagen, CEO-Fraud und Fake-Kandidaten an typischen Warnsignalen erkennen
4. einschätzen, welche Daten für Angreifer wertvoll sind und was ein Datenabfluss für Kandidat:innen, Kunden und das Unternehmen bedeutet
5. in neuen Situationen richtig handeln: über einen zweiten Kanal verifizieren, nichts öffnen oder herausgeben, Verdachtsfälle melden
6. ihre eigene Sicherheit realistisch einschätzen, statt sich zu überschätzen

### 3.3 Übergeordnetes Szenario und Narrativ

Die Schulung spielt in der fiktiven Personalvermittlung *TalentBridge Ltd*. Kern des Narrativs ist der Reiz des Verbotenen: Die meisten Mitarbeitenden haben nie darüber nachgedacht, wie ein Angreifer denkt. Diese Neugier holt sie ab. Das Debriefing nach jeder Mission verwandelt sie in Schutzwissen.

Zwei visuelle Welten tragen die Geschichte. Die Hacker-Missionen laufen in einer dunklen «Terminal»-Oberfläche. Umfragen, Abwehr-Level und Auswertung spielen in einer hellen Bürowelt. Der Wechsel der Welten markiert den Rollenwechsel vom Angreifer zur Verteidigerin.

Der Ablauf besteht aus sieben Schritten:

1. **Vorher-Umfrage** (ca. 10 Min.): anonyme Ausgangsmessung, Pflicht vor dem Start
2. **Intro** (ca. 3 Min.): fiktive Firma, Rolle, Missionen und die beiden Balken; als Aufhänger der reale Fall ManpowerGroup Lansing
3. **Module 1–5** (je 10–12 Min., in Zweierteams): pro Schwachstelle Expertenvideo, Hacker-Mission und Auflösung. Jedes Modul bringt einen Schlüssel. Mit allen Schlüsseln öffnet sich das «Company Gate»
4. **Team-Mission im Workshop** (ca. 15 Min., 2–6 Personen): Das in den Modulen allein erworbene Wissen wird in der Gruppe zusammengeführt
5. **Abwehr-Level** (ca. 10 Min.): Rollenwechsel zur Mitarbeiterin bzw. zum Mitarbeiter
6. **Nachher-Umfrage** (ca. 10 Min.): parallele Situationen und Feedback
7. **Auswertung** (ca. 3 Min.): persönliches Ergebnis, verhinderter Schaden, Top-3-Teams, Badges

Am Stück dauert die Schulung 80 bis 90 Minuten. Empfohlen wird jedoch eine gestaffelte Durchführung (Kapitel 3.6).

### 3.4 Modularer Aufbau

Jedes Modul folgt demselben Dreischritt:

1. **Expertenvideo:** Eine Fachperson erklärt die Schwachstelle: was der Angriff will, warum die Täuschung funktioniert, wer betroffen ist und was den Angriff stoppt. Die Videos sind animierte Erklärfilme von 6 bis 10 Minuten.
2. **Hacker-Mission:** In drei Schritten beurteilen die Teilnehmenden aus Angreifersicht, welcher Baustein einen Angriff am gefährlichsten macht, etwa welcher Köder am meisten Druck erzeugt. Nach jeder Wahl sehen sie sofort, warum die Option wirkt und woran man sie erkennt. Ein Risikobalken steigt mit der Gefährlichkeit der gewählten Bausteine.
3. **Auflösung:** Die Frage «What would have stopped this attack?» verbindet jeden Baustein mit der Schutzmassnahme, die ihn unterbricht.

Im Konzept war vorgesehen, dass die Teilnehmenden einen Angriff aus Bausteinen zusammenstellen. Im Prototyp wurde daraus ein Bewertungsspiel. Damit lernen sie den Mechanismus zu erkennen, ohne eine Anleitung zu üben.

| Modul | Expertin/Experte | Schwierigkeit | Beute bei Erfolg | Kernhandlung |
| --- | --- | --- | --- | --- |
| 1 Phishing und Kontoübernahme | IT-Sicherheit | leicht | Zugangsdaten zum Postfach | Portal selbst öffnen statt Link, Absender Zeichen für Zeichen prüfen |
| 2 Schadsoftware in Bewerbungen | IT-Sicherheit | mittel | Fernzugriff auf HR-Rechner | Bewerbungen nur über das Portal, nie «Enable content» |
| 3 CEO-Fraud | Finanzen | mittel | Kandidatenprofile, evtl. Zahlung | Rückfrage über einen bekannten zweiten Kanal |
| 4 Fake-Kandidaten und Deepfakes | HR/Recruiting | mittel | Zugang zu Kundensystemen, Lohn | Identität live prüfen, Referenzen abgleichen |
| 5 Ransomware und Datenabfluss | Datenschutz | schwer | gesamter Datenbestand, Lösegeld | Gerät vom Netz, sofort IT informieren |

*Tabelle 3-2: Übersicht der fünf Module*

Modul 5 zeigt die vollständige Angriffskette: ein Klick, dann Zugang, Datenabfluss, Erpressung und betroffene Kandidat:innen. Es öffnet sich deshalb erst, wenn vier Schlüssel gesammelt sind. Alle fünf Module und Videos sind im Prototyp umgesetzt.

### 3.5 Interaktionsmechaniken

Die Mechaniken setzen die Grundbedürfnisse der Selbstbestimmungstheorie um (Kapitel 2.3). Tabelle 3-3 ordnet sie zu.

| Bedürfnis / Anreiz | Umsetzung im Prototyp |
| --- | --- |
| Neugier und Spannung | Rollenwechsel zum Hacker, dunkle Terminal-Welt, Risikobalken, Balken für Beutewert und Unternehmensschaden |
| Autonomie | Wahl zwischen Angriffsbausteinen; Module in beliebiger Reihenfolge, nur Modul 5 ist gesperrt |
| Kompetenz | Sofortiges Feedback zu jeder Wahl, Schwierigkeitsstufen leicht bis schwer, Hinweise auf Wunsch, die Punkte kosten |
| Eingebundenheit | Spiel im Team, Team-Mission mit verteilten Informationen, Team-Rangliste |
| Anerkennung | Schlüssel und Badge pro Modul, Bonus für Serien richtiger Entscheide («Streaks») |

*Tabelle 3-3: Interaktionsmechaniken und ihre Begründung*

**Die beiden Balken.** Der Balken *Beutewert* zeigt in fiktiven «CyberCoins», wie wertvoll die erbeuteten Daten für den Angreifer sind. Der Balken *Unternehmensschaden* zeigt in fiktiven Franken, was der Angriff das Unternehmen kosten würde: Datenpanne, Betriebsunterbruch, Wiederherstellung, Meldepflicht, Bussen und Reputation. Die Grössenordnung orientiert sich an den durchschnittlichen Kosten einer Datenpanne von 4,44 Mio. USD (IBM, 2025). Im Abwehr-Level kehrt sich die Logik um: Jeder abgewehrte Angriff zeigt den verhinderten Schaden.

**Abwehr-Level.** Die Teilnehmenden bearbeiten einen Posteingang mit neun Nachrichten. Sechs davon sind Angriffe aus allen fünf Modulen, drei sind harmlos, etwa eine Einladung zum Mittagessen oder eine Wartungsankündigung. Nicht jede ungewöhnliche Nachricht ist ein Angriff. Für jede Nachricht stehen vier Handlungen zur Wahl: bearbeiten, über einen zweiten Kanal verifizieren, melden oder ablehnen. Bewertet wird die beste Handlung mit 2 Punkten, eine sichere, aber nicht optimale mit 1 Punkt und eine unsichere mit 0 Punkten.

**Team-Mission.** Auf Wunsch des Betreuers fördert die Schulung die Zusammenarbeit. Die Team-Mission folgt der Jigsaw-Methode: Wissen wird zuerst allein aufgebaut und dann in der Gruppe zusammengesetzt (Aronson et al., 1978). Im Workshop sitzen 2–6 Personen an einem Tisch, zum Beispiel zwei oder drei Zweierteams. Ein Laptop zeigt den Teamtisch mit einem QR-Code pro Person. Jede Person sieht auf ihrem Handy nur ihre eigenen Hinweiskarten, etwa die Absenderadresse oder den Link einer verdächtigen E-Mail, während andere Teile geschwärzt sind. Die Handys sind nicht verbunden: Die Gruppe kann die Hinweise nur im Gespräch kombinieren.

In drei Runden (Phishing, CEO-Fraud, Fake-Kandidat) beantwortet die Gruppe je drei Fragen und trifft eine Entscheidung: bearbeiten, verifizieren, melden oder löschen. Die Auflösung zeigt, wer welche Karte hatte. Niemand kann allein antworten, unabhängig von der Gruppengrösse: Die Karten werden reihum verteilt, und jede Frage braucht zwei benachbarte Karten, die immer bei zwei verschiedenen Personen liegen. Die Antwortoptionen kombinieren je eine Tatsache von beiden Karten, sodass eine Karte allein mindestens zwei Optionen offenlässt. Damit bildet die Mission nach, dass Warnsignale im Alltag oft auf mehrere Personen verteilt sind. Am Ende zeigt der Tisch einen Abschlusscode mit acht Zeichen, den jedes Team in seiner App eingibt. Das Ergebnis zählt in die Punkte und öffnet den Abwehr-Level.

**Leitplanken.** Die Schulung folgt dem Grundsatz «You learn the mechanism, not the instructions». Angriffe bestehen nur aus vorbereiteten Bausteinen in einer fiktiven Firma. Es gibt keine echten Werkzeuge und keine Vorlagen für Phishing-Mails. Die Rangliste belohnt Abwehr und Begründung, nicht die Beute. Sonst würde «wer am besten hackt, gewinnt» zum Lernziel. Öffentlich sind nur die drei besten Teams sichtbar, damit niemand blossgestellt wird.

### 3.6 Durchführungsvarianten

**Online:** Die Teilnehmenden spielen die Webseite im Browser, allein oder im Team. Es ist keine Installation nötig.

**Vor Ort:** Die Schulung eignet sich auch als Kick-off an einem Standort. Anstelle der Videos präsentieren Fachpersonen ihr Thema live: IT-Sicherheit (Module 1 und 2), Finanzen (Modul 3), HR (Modul 4) und Datenschutz (Modul 5). Die Teams spielen die Missionen auf Laptops. Nach jeder Mission besprechen die Fachpersonen die Ergebnisse mit der Gruppe und ergänzen echte Fälle aus der Praxis. Die Balken aller Teams erscheinen auf einem gemeinsamen Bildschirm. Die Team-Mission ist für diese Situation gebaut: ein Laptop als Teamtisch, die Handys der Teilnehmenden für die Hinweiskarten.

**Zeitlicher Ablauf:** Um dem Vergessen entgegenzuwirken (Reinheimer et al., 2020), wird die Schulung gestaffelt eingeführt:

| Zeitpunkt | Inhalt |
| --- | --- |
| Kick-off (ca. 30 Min.) | Vorher-Umfrage, Intro, Modul 1, kurze Abwehrrunde |
| Alle 3–4 Wochen | Freigabe des nächsten Moduls (je 10–12 Min.), die Geschichte geht weiter |
| Nach Modul 5 | Vollständiger Abwehr-Level, Nachher-Umfrage, Auswertung |
| Nach ca. 3 Monaten (optional) | Erneute Befragung, um zu sehen, was hängen geblieben ist |

*Tabelle 3-4: Gestaffelte Einführung*

**Sprache:** Gemäss Auftrag ist die Schulung auf Englisch umgesetzt. Weil alle Texte in separaten Datendateien liegen, lassen sie sich automatisch ins Deutsche und Französische übersetzen und als Sprachvarianten hinterlegen. \[Prüfen, ob eine Übersetzung im Prototyp umgesetzt werden soll.\]

### 3.7 Einbindung in bestehende Awareness-Massnahmen

&#91;Abschnitt mit Informationen von ManpowerGroup ergänzen: bestehende Schulungen, Phishing-Simulationen, Meldeprozess und Kanäle für Bewerbungen.\]

Die Schulung soll bestehende Massnahmen nicht ersetzen, sondern ergänzen. Folgende Anknüpfungspunkte schlagen wir vor:

- **Meldeprozess:** Die Handlung «Report» im Abwehr-Level verweist auf den internen Meldeweg von ManpowerGroup. So wird im Spiel genau das geübt, was im Alltag gilt.
- **Bestehende Kennzahlen:** Langfristig wird die Zahl gemeldeter Verdachtsfälle und die Klickrate bei Phishing-Simulationen vor und nach der Einführung verglichen.
- **Onboarding:** Neue Mitarbeitende im Recruiting absolvieren die Schulung in den ersten Wochen.
- **Interne Kommunikation:** Ein «Cyber Champion of the Month» wird im Intranet oder Newsletter genannt.

### 3.8 Messgrössen (KPIs)

Die Wirksamkeit wird mit sieben Kennzahlen gemessen. Zielwerte legen wir erst nach dem Pilot fest, weil eine Ausgangsbasis fehlt.

| KPI | Messung | Kennzahl im Export |
| --- | --- | --- |
| Wissenszuwachs | Punkte in den parallelen Situationen vorher und nachher (0–16) | `score_delta`, `attack_score_*` |
| Realistische Selbsteinschätzung | Abstand zwischen Selbstsicherheit und tatsächlicher Leistung | `calibration_*` (0 = gut kalibriert) |
| Abwehrquote | Anteil korrekt erkannter und gemeldeter Angriffe im Abwehr-Level | `def_quality_*` |
| Kein Übermelden | Harmlose Nachrichten werden weiterhin normal bearbeitet | `harmless_ok_*` (soll nicht sinken) |
| Zusammenarbeit | Richtige Antworten und Entscheide der Gruppe in der Team-Mission; Einstellung «zuerst im Team besprechen» vorher und nachher | `team_*`, `discuss_first` |
| Abschlussquote | Anteil der Teilnehmenden, die alle Schritte abschliessen | `modules_done`, `post_done` |
| Motivation | Kurze Feedbackumfrage nach der Schulung (1–5), inkl. Teamarbeit | `post_fb_*` |

*Tabelle 3-5: KPIs zur Messung des Lernerfolgs*

Ergänzend erfasst der Fragebogen, ob die Teilnehmenden Warnsignale erkennen, sich besser vorbereitet fühlen und ihre Einstellung zu Sicherheitsregeln verändert haben.

### 3.9 Prototyp

Der Prototyp ist unter [larabng.github.io/securityawareness](https://larabng.github.io/securityawareness/) öffentlich verfügbar, der Quellcode im Repository [larabng/securityawareness](https://github.com/larabng/securityawareness). Er umfasst:

- Vorher- und Nachher-Umfrage mit gesperrter Reihenfolge
- fünf spielbare Module mit Expertenvideos, Missionen und Auflösungen
- Gamification mit Schlüsseln, Company Gate, Punkten, Badges, Hinweisen und Streaks
- die Team-Mission als Workshop-Runde mit Teamtisch, QR-Codes, Hinweiskarten auf dem Handy und Abschlusscode
- den Abwehr-Level mit neun Nachrichten
- die persönliche Auswertung und eine Team-Rangliste mit den drei besten Teams
- einen CSV-Export für die Testleitung sowie ein Skript, das alle Exporte zusammenführt

Der Fortschritt bleibt nur im Browser gespeichert, übersteht aber das Schliessen des Tabs zwischen Modulen und Workshop. Auf geteilten Laptops kann ein Durchlauf fortgesetzt oder neu gestartet werden. Es werden keine Daten an einen Server übertragen. Ein automatisierter Browsertest bestätigt, dass ein vollständiger Durchlauf mit allen Sperren und dem Export funktioniert. \[Screenshots als Abbildungen 3-1 bis 3-4 einfügen: Start, Hacker-Mission, Abwehr-Level, Auswertung.\]

### 3.10 Ergebnisse der Testphase

&#91;Nach der Testphase ergänzen. Nur darstellen, noch nicht deuten:\]

- Anzahl Teilnehmende und Durchläufe, Varianten (online / vor Ort), Datum
- Vorher-Nachher-Vergleich der KPIs aus Tabelle 3-5 mit Median, Wilcoxon-Test und Effektstärke
- Beobachtungen: Dauer pro Schritt, Abbrüche, Verständnisprobleme
- Feedback der Teilnehmenden zu Spass, Verständlichkeit und Verbesserungen
- Verlässlichkeit der Ergebnisse (Stichprobengrösse, fehlende Daten)

## 4 Diskussion

Dieses Kapitel deutet die Ergebnisse und benennt die Grenzen der Arbeit.

### 4.1 Beantwortung der Fragestellung

Die Arbeit zeigt, wie sich eine gamifizierte Awareness-Schulung auf die Risiken im Recruiting zuschneiden lässt. Drei Gestaltungsentscheide sind zentral. Erstens nutzt der Perspektivenwechsel zum Angreifer die Neugier als Motivation und stützt sich auf die Inokulationstheorie. Zweitens verankern Abwehr-Level und Team-Mission die eigentliche Zielhandlung: verifizieren und melden statt nur erkennen. Drittens macht das Messdesign mit parallelen Formen und Selbstsicherheitsfragen den Lernerfolg überprüfbar.

&#91;Nach der Testphase ergänzen: Haben sich Punktzahl, Kalibrierung und Abwehrquote verbessert? Wie gross ist der Effekt im Vergleich zu What.Hack (+36,7 %; Wen et al., 2019) und zu klassischen Trainings (Ho et al., 2025)? Wurden harmlose Nachrichten weiterhin korrekt bearbeitet?\]

### 4.2 Was neu ist

Bestehende Rollenspiele wie *What.Hack* behandeln Phishing allgemein. Unser Konzept überträgt den Ansatz auf Angriffe, die den Recruiting-Prozess gezielt ausnutzen: schädliche Bewerbungen, Fake-Kandidaten und CEO-Fraud mit Kandidatendaten als Beute. Dazu gibt es kaum Forschung. Neu ist auch die Kombination von Angreiferperspektive und Zusammenarbeit mit verteilten Informationen. Sie bildet nach, dass Warnsignale im Alltag oft auf mehrere Personen verteilt sind.

### 4.3 Kritische Einordnung und Grenzen

- **Keine Kontrollgruppe:** Ein Teil des Zuwachses kann daher kommen, dass die Teilnehmenden den Fragebogen ein zweites Mal ausfüllen. Die parallelen Formen mildern diesen Effekt, beseitigen ihn aber nicht.
- **Kleine Stichprobe:** Mit \[Anzahl\] Testpersonen lassen sich Tendenzen zeigen, aber keine verallgemeinerbaren Aussagen treffen.
- **Teams statt Einzelpersonen:** Wird ein Durchlauf zu zweit gespielt, beschreibt ein Export ein Team und nicht eine Person.
- **Simulation ist nicht Alltag:** Gutes Verhalten in einer Übung beweist noch keine nachhaltige Verhaltensänderung. Dafür braucht es Langzeitdaten wie gemeldete Verdachtsfälle.
- **Gamification und Kompetenz:** Gamification stärkt das Kompetenzerleben kaum (Li et al., 2024). Wir setzen deshalb auf sofortiges Feedback und steigende Schwierigkeit. Ob das reicht, muss sich im Test zeigen.
- **Fiktive Zahlen:** Die Werte der Balken veranschaulichen nur die Grössenordnung und sind keine echten Marktpreise.
- **Offene Themen:** KI-Risiken im Recruiting und die Einbindung in die bestehenden Massnahmen von ManpowerGroup sind noch nicht vollständig ausgearbeitet.

### 4.4 Ausblick

Wir vermuten, dass die Wirkung stärker ist, wenn die Module gestaffelt freigegeben werden statt an einem Tag. Belegt ist das für unser Format noch nicht. Prüfen liesse es sich mit einer erneuten Befragung nach drei Monaten.

## 5 Schlusswort

&#91;Vom Team zu verfassen, kurz und persönlich: Erfahrungen im Projekt, Abgleich von Erwartungen und erreichten Zielen, wichtigste Learnings aus der Zusammenarbeit, z. B. aus dem Problemlog des Projekttagebuchs.\]

## 6 Planung der nächsten Schritte

Für eine Einführung bei ManpowerGroup empfehlen wir folgende Schritte:

1. **Offene Punkte mit ManpowerGroup klären:** Kanäle für Bewerbungen (Portal, E-Mail, LinkedIn), interne Melde- und Freigabeprozesse, verfügbare Fachpersonen für Videos oder Vor-Ort-Durchführung, Budget für Sachpreise
2. **Inhalte erweitern:** KI-Risiken im Recruiting ergänzen, Szenarien an echte Rollen und Prozesse von ManpowerGroup anpassen (fiktiv nachgebaut), Übersetzungen ins Deutsche und Französische
3. **Pilot ausweiten:** Test mit 20–30 Personen, wenn möglich mit Kontrollgruppe, und Festlegen der Zielwerte für die KPIs
4. **Technische Umsetzung:** Integration in die interne Lernplattform, Datenschutzprüfung der Auswertung, zentrale Speicherung statt CSV-Export
5. **Rollout:** Kick-off pro Standort, danach ein Modul alle drei bis vier Wochen, neue Saisons mit aktualisierten Szenarien
6. **Langzeitmessung:** Befragung nach drei Monaten sowie Vergleich der gemeldeten Verdachtsfälle und Phishing-Klickraten vor und nach der Einführung

## 7 Literatur- und Quellenverzeichnis

Die Angaben folgen APA 7 gemäss Zitierleitfaden des Studiengangs Wirtschaftsinformatik. \[Vor der Abgabe DOIs und Seitenzahlen in Google Scholar prüfen und die mit «ergänzen» markierten Angaben vervollständigen.\]

### Wissenschaftliche Quellen

- Aronson, E., Blaney, N., Stephan, C., Sikes, J., & Snapp, M. (1978). *The jigsaw classroom*. Sage.
- Buo, S. A. (2020). *An application of cyberpsychology in business email compromise*. arXiv. https://arxiv.org/abs/2011.11112
- Gwenhure, A. K., & Rahayu, F. S. (2024). Gamification of cybersecurity awareness for non-IT professionals: A systematic literature review. *International Journal of Serious Games, 11*(1). https://journal.seriousgamessociety.org/index.php/IJSG/article/view/719
- Ho, G., Mirian, A., Luo, E., Tong, K., Lee, E., Liu, L., Longhurst, C. A., Dameff, C., Savage, S., & Voelker, G. M. (2025). Understanding the efficacy of phishing training in practice. In *2025 IEEE Symposium on Security and Privacy*. IEEE. https://sysnet.ucsd.edu/\~voelker/pubs/phishtrain-oakland25.pdf
- Köbis, N. C., Doležalová, B., & Soraperra, I. (2021). Fooled twice: People cannot detect deepfakes but think they can. *iScience, 24*(11), Article 103364. https://doi.org/10.1016/j.isci.2021.103364
- Lain, D., Kostiainen, K., & Čapkun, S. (2022). Phishing in organizations: Findings from a large-scale and long-term study. In *2022 IEEE Symposium on Security and Privacy* (S. 842–859). IEEE. https://arxiv.org/abs/2112.07498
- Li, L., Hew, K. F., & Du, J. (2024). Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency: A meta-analysis and systematic review. *Educational Technology Research and Development*. https://doi.org/10.1007/s11423-023-10337-7
- Oz, H., Aris, A., Levi, A., & Uluagac, A. S. (2022). A survey on ransomware: Evolution, taxonomy, and defense solutions. *ACM Computing Surveys, 54*(11s), 1–37. https://doi.org/10.1145/3514229
- Reinheimer, B., Aldag, L., Mayer, P., Mossano, M., Duezguen, R., Lofthouse, B., von Landesberger, T., & Volkamer, M. (2020). An investigation of phishing awareness and education over time: When and how to best remind users. In *Sixteenth Symposium on Usable Privacy and Security (SOUPS 2020)*. USENIX. https://www.usenix.org/conference/soups2020/presentation/reinheimer
- Roozenbeek, J., & van der Linden, S. (2019). Fake news game confers psychological resistance against online misinformation. *Palgrave Communications, 5*, Article 65. https://doi.org/10.1057/s41599-019-0279-9
- Wen, Z. A., Lin, Z., Chen, R., & Andersen, E. (2019). What.Hack: Engaging anti-phishing training through a role-playing phishing simulation game. In *Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems*. ACM. https://doi.org/10.1145/3290605.3300338
- Zielinska, O. A., Welk, A. K., Mayhorn, C. B., & Murphy-Hill, E. (2016). The persuasive phish: Examining the social psychological principles hidden in phishing emails. In *Proceedings of the Symposium and Bootcamp on the Science of Security (HotSoS ’16)*. ACM. https://doi.org/10.1145/2898375.2898382

### Behörden-, Branchen- und Medienquellen

- Bundesamt für Cybersicherheit BACS. (2026). *Halbjahresbericht 2025/2*. https://www.ncsc.admin.ch/dam/ncsc/de/dokumente/dokumentation/lageberichte/BACS-HJB-2025-2\_DE.pdf.download.pdf/BACS-HJB-2025-2\_DE.pdf
- CSO Online. (2025, Mai). \[Titel, Autor:in und URL zum Artikel über Venom Spider / More\_eggs ergänzen\]
- Federal Bureau of Investigation, Internet Crime Complaint Center. (2022). *Deepfakes and stolen PII utilized to apply for remote work positions* (PSA I-062822-PSA). https://www.ic3.gov/PSA/2022/psa220628
- Gatlan, S. (2025). Manpower staffing agency discloses data breach after attack claimed by RansomHub. *BleepingComputer*. https://www.bleepingcomputer.com/news/security/manpower-staffing-agency-discloses-data-breach-after-attack-claimed-by-ransomhub/
- IBM Security. (2025). *Cost of a data breach report 2025*. IBM. \[Primärquelle statt Zusammenfassung verlinken\]
- Netzwoche. (2026, Januar). \[Titel und URL zum Artikel über die BACS-Zahlen 2025 ergänzen\]
- PwC Schweiz. (o. J.). *Verletzung der Datensicherheit: Was tun?* https://www.pwc.ch/de/insights/regulierung/verletzung-datensicherheit.html
- SHRM. (2025, Mai). \[Titel und URL ergänzen\]
- Verizon. (2025). *2025 Data breach investigations report*. \[URL ergänzen\]

## 8 Abkürzungsverzeichnis und Glossar

| Begriff | Bedeutung |
| --- | --- |
| AHV | Alters- und Hinterlassenenversicherung; die AHV-Nummer ist die Schweizer Sozialversicherungsnummer |
| BACS | Bundesamt für Cybersicherheit (früher NCSC) |
| BEC | Business E-Mail Compromise: Betrug per gefälschter oder übernommener Geschäfts-E-Mail |
| CEO-Fraud | Betrug, bei dem sich Angreifer als Geschäftsleitung ausgeben, um Zahlungen oder Daten zu erhalten |
| CyrenZH | Cyber Resilience Network Zürich |
| Deepfake | Mit KI gefälschtes Video, Bild oder Audio einer realen Person |
| Doppelte Erpressung | Ransomware-Taktik: Daten werden verschlüsselt und zusätzlich gestohlen, mit Drohung der Veröffentlichung |
| EDÖB | Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter |
| Gamification | Einsatz von Spielelementen wie Punkten, Badges oder Ranglisten in spielfremden Kontexten |
| Inokulationstheorie | Theorie, nach der Menschen durch das Erleben einer abgeschwächten Manipulation widerstandsfähiger werden |
| KPI | Key Performance Indicator, Messgrösse für die Zielerreichung |
| MFA | Multi-Faktor-Authentifizierung |
| Phishing | Gefälschte Nachrichten, die zur Preisgabe von Zugangsdaten oder zu schädlichen Klicks verleiten |
| Ransomware | Schadsoftware, die Daten verschlüsselt und Lösegeld fordert |

## 9 Gruppenmitglieder und ihre Rolle im Projekt

&#91;Vom Team zu prüfen und zu ergänzen.\]

| Mitglied | Rolle und Verantwortung |
| --- | --- |
| Michele \[Nachname\] | Grundkonzept «Cybersecurity Escape Room»; Vorschlag zur gemeinsamen Ablage; \[falls GitHub-Konto «Maniamic»: Module 2, 4 und 5, Expertenvideo Modul 3, Neuaufbau der Vorher-Nachher-Umfrage, Neugestaltung der App, Team-Mission als Workshop-Runde\] |
| Daniele \[Nachname\] | Vorher-Umfrage mit 23 Fragen und deren Anonymisierung, \[ergänzen\] |
| Lara Bangerter | Literaturrecherche, Konzept «Inside the Mind of a Hacker», erste Version der Schulungswebseite mit Modul 1, Gamification, Präsentation, Prototyp der Team-Mission, Projekttagebuch |

## 10 Anhang

Der Anhang hat ein eigenes Inhaltsverzeichnis. Die Arbeit ist auch ohne Anhang vollständig verständlich.

- **Anhang A:** Projekttagebuch mit Besprechungen, Entscheiden, Problemlog und Zusammenarbeit
- **Anhang B:** Literaturrecherche «Top-5 Cyberrisiken im Recruiting» mit Angreiferperspektive pro Risiko
- **Anhang C:** Testkonzept mit Vorher- und Nachher-Fragebogen (Formen A und B)
- **Anhang D:** Prototyp: Link zur Webseite und zum Repository, Screenshots, Liste der Expertenvideos
- **Anhang E:** Grundkonzept «Cybersecurity Escape Room – Der stille Alarm»
- **Anhang F:** Zwischenpräsentation «Inside the Mind of a Hacker»
- **Anhang G:** Auswertungstabellen der Testphase

## Eigenständigkeitserklärung

«Unsere Gruppe erklärt hiermit, dass sie die vorliegende Arbeit eigenständig und ohne unerlaubte fremde Hilfe erstellt hat sowie dass alle Quellen, Hilfsmittel und Internetseiten wahrheitsgetreu verwendet wurden und belegt sind.»

&#91;Eingesetzte KI-Werkzeuge gemäss den Vorgaben der ZHAW bzw. des Betreuers deklarieren.\]

Unterschriften: Michele \[Nachname\] · Daniele \[Nachname\] · Lara Bangerter
