# Strategische Referenzpersona\_ Planungsabteilung

_Converted from: Strategische Referenzpersona\_ Planungsabteilung.pdf_  
_Document Version: 2.0_  
_Last Updated: 2025-11-10_

**⚡ Relevante Spezifikationen für Planning-Rolle:**

- **Rollengrenzen (GAP-JOURNEY-004):** Siehe RBAC_PERMISSION_MATRIX.md §9
  - **Planungsabteilung** = Execution-Rolle (Post-Sales): Projekt-Planung, Ressourcen, Umsetzung
  - **Übernahme-Punkt:** Opportunity "Won" → Projekt von INNEN übergeben → PLAN ist Projektmanager
  - **Klar definiert:** PLAN zuständig für Projekt-Execution (nicht INNEN), INNEN nur beratend bei Changes
- **RBAC-Berechtigungen:** Siehe RBAC_PERMISSION_MATRIX.md §3-4
  - Zugewiesene Projekte: Voller Zugriff (CRUD)
  - Team-Projekte: Update-Zugriff (Fortschritt, Kommentare)
  - Alle Projekte: Lesezugriff (für Kapazitätsplanung)
  - Kunden: Lese-/Update-Zugriff (projekt-bezogen)
  - Opportunities: Lesezugriff (nicht editierbar)
  - Rechnungen: Lesezugriff (projekt-bezogen)
- **User Journeys:** Siehe USER_JOURNEY_MAPS.md
  - Journey 1: Angebots-Review (PLAN-Rolle: Technische Prüfung, Kapazitätsbestätigung)
  - Journey 2: Projekt → Rechnung (PLAN-Hauptrolle: Execution, Abschluss, Rechnungs-Trigger)
  - Journey 3: Änderungsanfrage (PLAN-Rolle: Impact-Assessment, Machbarkeit)
- **Offline:** Typischerweise Office-basiert, 102 MB bei Voll-Offline (über iOS-Limit, benötigt Prompt oder Reduzierung auf 5 statt 10 Files)

---

# Strategische Referenzpersona: Planungsabteilung

### Einleitung & Kontext

Im Zuge der Einführung eines integrierten CRM- und Projektmanagement-Tools soll die **Planungsabteilung**
als zentrale Nutzerrolle verstanden und optimiert werden. Die Planungsabteilung (Innenarchitektur/
Ladenplanung) spielt im Projektablauf eine Schlüsselrolle: Sie übernimmt nach der Kundenakquise vom
Vertrieb (Außendienst) die Ausarbeitung von Gestaltungskonzepten, Detailplanungen und die Koordination
der Umsetzung. Aktuell erfolgen viele Abläufe noch **manuell** oder in **Insellösungen** (z. B. Dateiablagen, E-
Mails), was zu Informationsbrüchen und Mehraufwand führt
. Das Gesamtkonzept des neuen Tools
zielt darauf ab, diese Lücken zu schließen, die Zusammenarbeit zwischen Vertrieb, Planung, Kalkulation und
Grafik zu verbessern und die Effizienz über alle Projektphasen hinweg zu steigern. In diesem Bericht wird
die Planungsabteilung als strategische Persona beschrieben – mit ihren Aufgaben, Zielen, Anforderungen
und Herausforderungen – um die Anforderungen an die neue Anwendung präzise abzuleiten.

# Persona-Übersicht

**Rolle:** Die Planungsabteilung (Team aus Innenarchitekt:innen/Planer:innen) verantwortet die Planung und
Gestaltung von Projekten (z. B. Ladenbau, Innenausbau), vom ersten Konzept bis zur Ausführungsplanung.
Dieses Team agiert als **interne Dienstleister** für Vertrieb und Kunden, indem es Kundenanforderungen in
funktionale und ästhetische Entwürfe übersetzt.

**Team & Struktur:** Typischerweise besteht die Abteilung aus mehreren Planer:innen mit einer
Abteilungsleitung. Die Planer:innen arbeiten eng zusammen und tauschen sich regelmäßig mit anderen
Abteilungen aus (Vertrieb/Außendienst, Kalkulation, Grafik, Produktion). Jede/r Planer:in betreut meist
**mehrere Projekte parallel** , was ein gutes Zeitmanagement und Priorisierung erfordert.

**Mission:** _"Aus einer Kundenidee ein umsetzbares Konzept entwickeln, das wirtschaftlich, technisch machbar und_
_attraktiv ist."_ – Das Planungsteam sieht sich als **Problemlöser** und **Koordinator** : Es sorgt dafür, dass
Kundenvorgaben und Markenstandards eingehalten werden, während es praktikable Lösungen entwirft,
die später reibungslos gefertigt und umgesetzt werden können. Ihr Erfolg wird daran gemessen, wie
zufrieden Kunden mit dem Design sind, ob Projekte im Zeit- und Budgetrahmen bleiben und wie gut die
internen Abläufe (z. B. Übergaben an Produktion) funktionieren.

**Ziele der Persona:** Die Planungsabteilung strebt an, **hochwertige Entwürfe** termingerecht zu liefern,
**änderungsbedingte Schleifen**
minimal zu halten und eine
**reibungslose Projektumsetzung**
sicherzustellen. Sie möchte eng mit dem Vertrieb zusammenarbeiten, um Kunden frühzeitig zu
überzeugen, und mit der Produktion, um Machbarkeit und Qualität zu gewährleisten. Zudem hat sie das
Ziel, **interne Prozesse zu optimieren** – z. B. Informationen digital zu bündeln statt mehrfach manuell zu
pflegen – damit mehr Zeit für kreative Planungsarbeit bleibt.

# Aufgaben & Prozesse

Die Planungsabteilung ist in **alle Projektphasen** eingebunden, von der Konzeptentwicklung bis zur
Übergabe an die Ausführung. Ihr Arbeitsprozess lässt sich – angelehnt an klassische Planungsphasen – wie
folgt beschreiben:

**Projektübergabe & Briefing:** Nachdem der Außendienstmitarbeiter (ADM) einen Kundenauftrag
akquiriert hat, übergibt er alle gesammelten Informationen an die Planungsabteilung
. Aktuell
geschieht dies durch Ablegen von Notizen, Fotos und Grundriss-Skizzen in einer Ordnerstruktur und
ein persönliches Gespräch zwischen ADM und Planer:in
. In diesem Briefing werden
Anforderungen, Kundenwünsche, Maße und erste Ideen besprochen. Der/die Planer:in stellt
Rückfragen und verschafft sich ein vollständiges Bild vom Projekt und den beteiligten Personen
(Kunde, Filialteam etc.).

1.

# Konzept- und Entwurfsplanung: Auf Basis des Briefings erstellen die Planer:innen einen ersten

2.

# Abstimmung & interne Freigabe:

3.

# Kalkulation & Angebotserstellung: Die finalen Entwurfsunterlagen übergibt die Planungsabteilung

4.

# Präsentation beim Kunden: Mit den Planungsunterlagen (Grundrisse, Visualisierungen) und dem

5.

# Überarbeitung & Freigabe: Die Planungsabteilung übernimmt Kundenfeedback und passt die

6.

Budgetoptimierungen betreffen. Jede Änderung wird erneut mit dem Innendienst abgestimmt – das
Angebot wird angepasst (oft vom ursprünglichen Kalkulator)
– und dem Kunden präsentiert.
Dieser Zyklus wiederholt sich, bis der Kunde final zustimmt. Die Planungsabteilung muss hierbei
**schnell reagieren** und sorgfältig dokumentieren, welche Version die aktuelle ist.

# Werk- und Ausführungsplanung: Nach Kundenzusage wechselt das Projekt von der Entwurfs- in

7.

# Begleitung der Umsetzung:

8.

**Zusammengefasst** folgt die Planungsabteilung einem Ablauf, der klassischen Architekturphasen ähnelt –
von Grundlagenermittlung über Entwurf zu Ausführungsplanung (vgl. HOAI Leistungsphasen 1–5
).
Allerdings laufen manche Phasen in der Praxis parallel oder iterativ ab (z. B. Entwurf <-> Kalkulation in
Schleifen), anstatt strikt nacheinander. Jede Phase endet idealerweise mit einer **Zwischenabnahme**
(Meilenstein), an dem Ergebnisse vorliegen und intern freigegeben werden, ähnlich dem Vorgehen nach
VDI 5200 in der Fabrikplanung
. Die Planungsabteilung arbeitet bereichsübergreifend: Sie ist
**Knotenpunkt** zwischen Vertrieb, Kalkulation, Grafik, Kunde und (später) Produktion. Dadurch sind
**Kommunikation und Informationsmanagement** wesentliche Bestandteile ihrer täglichen Arbeit neben
der rein planerischen Tätigkeit.

# Anforderungen & Erwartungen

Aus den Aufgaben und Zielen der Planungsabteilung lassen sich klare Anforderungen an das neue
integrierte CRM/PM-Tool ableiten. Diese umfassen **funktionale** Aspekte (was das System leisten soll)
ebenso wie **nicht-funktionale** (wie das System beschaffen sein muss, damit es akzeptiert wird).

**Funktionale Anforderungen:**

- **Zentrale Projektdaten** : Alle relevanten Informationen (Kundenbriefing, Anforderungen, Maße, Fotos,
  Grundrisse) müssen zentral im Tool hinterlegt sein. Die Planer:innen erwarten, dass sie nicht mehr in
  verschiedenen Ordnern oder E-Mails nach Infos suchen müssen – das Tool soll als _“Single Source of Truth”_
  dienen, wo vom ADM erfasste Daten direkt verfügbar sind
  .
- **Aufgabenmanagement & Workflows:** Das System soll automatisch **Aufgaben ableiten** können. Wenn
  der ADM z. B. im Kundenprotokoll bestimmte To-Dos festhält („Angebot erstellen“, „Layout zeichnen“), sollen
  diese als Aufgaben für die Planungsabteilung sichtbar werden. Eine integrierte Aufgabenliste mit Fristen,
  Verantwortlichen und Status ist erforderlich, um die Vielzahl an Schritten zu koordinieren. Priorisierungen
  und Abhängigkeiten (z. B. „Plan fertig **vor** Angebotserstellung“) sollten darstellbar sein.
- **Status- und Fortschrittsvisualisierung:** Das Tool sollte den Planer:innen ermöglichen, den

**Projektfortschritt** einfach zu dokumentieren und für andere sichtbar zu machen. Anstelle abendlicher E-
Mails oder Chat-Nachrichten an den Vertrieb
, könnte das System automatisiert Status-Updates
anzeigen (z. B. „Entwurf fertiggestellt am …, liegt bei Kalkulation“). Der Vertrieb soll jederzeit den Stand
einsehen können, ohne manuell nachfragen zu müssen – das erhöht die Transparenz.

- **Kollaboration & Kommunikation:** Eine interne **Kommentarfunktion** oder ein Projekt-Chat innerhalb des
  Tools wäre hilfreich, damit Rückfragen (zwischen ADM, Planer:in, Kalkulator etc.) kontextbezogen beim
  Projekt gestellt und beantwortet werden können. So bleiben Entscheidungsgründe und Absprachen
  nachvollziehbar.
- **Datei- und Dokumentenmanagement:** Die Planungsabteilung arbeitet mit vielen Dateien (CAD-
  Zeichnungen, PDFs, Bilder). Das neue System muss eine **Ablage** dafür bieten – idealerweise versioniert. So
  können Planstände hochgeladen und z. B. der Kalkulation und Grafik zur Verfügung gestellt werden. Alle
  Beteiligten sollen stets auf die aktuelle Planversion zugreifen können.
- **Integration von CAD/BIM-Tools:**
  Wünschenswert wäre eine Schnittstelle zu gängigen
  Planungsprogrammen (AutoCAD, Revit o.ä.), um z. B. Grundrisse oder Möblierungspläne direkt ins System
  zu exportieren, statt händisch PDF-Stände hochzuladen. Zumindest sollte das System gängige Dateiformate
  (DWG, PDF, JPG) problemlos managen.
- **Termin- und Kapazitätsplanung:** Da Planer:innen mehrere Projekte parallel betreuen, sollte das Tool
  einen **Kalender** oder eine Kapazitätsübersicht bieten. So kann die Abteilungsleitung sehen, wer wie
  ausgelastet ist, und neue Projekte realistisch terminieren. Gantt-Chart-Ansichten oder Kanban-Boards für
  die Planungsschritte könnten helfen, den Überblick zu bewahren (viele Architektur-Projektmanagement-
  Tools bieten so etwas bereits standardmäßig an
  ).
- **Schnittstellen zu Angebot/Abrechnung:** Das CRM/PM-Tool sollte nach Möglichkeit den Übergang zur
  Angebotserstellung erleichtern. Beispielsweise könnte es Positionen aus einer hinterlegten
  Artikeldatenbank vorschlagen oder zumindest die Zusammenarbeit mit der Kalkulations-Software
  verbessern. Integrierte Lösungen wie Troi zeigen, dass von der Projektplanung bis zur Rechnungsstellung
  alles nahtlos ineinandergreifen kann
  .
- **Benachrichtigungen & Erinnerungen:** Die Planer:innen wünschen sich, dass das System sie _proaktiv_
  unterstützt – etwa durch Erinnerungen an Deadlines (z. B. „Entwurf für Projekt X muss bis Freitag fertig
  sein“) oder Benachrichtigungen, wenn der ADM neue Infos zum Projekt hinzugefügt hat. So geht nichts
  unter, und alle bleiben auf dem aktuellen Stand.

# Nicht-funktionale Anforderungen (Qualitäts- & Akzeptanzkriterien):

Doppelarbeit zu vermeiden. Beispielsweise könnten Kundendaten aus dem CRM-Teil auch für die
Newsletter-Datenbank genutzt werden oder Projektstammdaten ans ERP übergeben werden.

- **Flexibilität und Anpassbarkeit:** Die Planungsabteilung wünscht sich ein Werkzeug, das **ihre Sprache**
  spricht – also Prozesse so abbildet, wie sie tatsächlich arbeiten. Starre Tools, die nur einen bestimmten
  Ablauf zulassen, wären ungünstig. Ideal ist eine Lösung, die man anpassen kann (Customizing der Felder,
  Workflows). So können z. B. spezifische Felder für Ladenplanung (wie Filialtyp, Inventarlisten,
  Genehmigungsstatus) ergänzt werden.
- **Transparenz und Nachvollziehbarkeit:** Ein Qualitätskriterium ist, dass alle Projektschritte lückenlos
  dokumentiert sind. Wer hat wann welche Änderung gemacht? Welche Version ist aktuell freigegeben? Das
  System muss Historien speichern, damit bei Fehlern oder Nachfragen der Verlauf nachvollzogen werden
  kann.
- **Akzeptanzfaktoren:** Letztlich wird die Anwendung akzeptiert, wenn sie den Planer:innen **echte**
  **Erleichterung** bringt. Dazu gehört, dass Routinearbeiten (z. B. Wiedervorlagen, Protokollablage)
  abgenommen werden, die Kommunikation flüssiger läuft und sich insgesamt **weniger Zeitdruck** durch
  bessere Planung ergibt. Wichtig ist auch das Commitment des Managements: klare Vorgaben zur Nutzung
  (damit nicht manche im Tool arbeiten und andere parallel doch wieder per E-Mail, was zu Doppelarbeit
  führt). Eine **gute Schulung** und schrittweise Einführung erhöhen ebenfalls die Akzeptanz.

# Best Practices & Industriestandards

Bei der Gestaltung der Planungsprozesse und -werkzeuge lohnt ein Blick auf branchenübliche Standards
sowie Tools in vergleichbaren Bereichen (Innenarchitektur, Projektsteuerung, Ladenplanung). Die
Planungsabteilung kann von folgenden Best Practices profitieren:

**Strukturierte Planungsphasen (HOAI & Co.):** In Architektur und Innenarchitektur sind die
Leistungsphasen der HOAI als **De-facto-Standard** etabliert
. Sie gliedern Planungsprojekte in sinnvolle
Abschnitte: von der **Grundlagenermittlung** (Bedarfsanalyse) über **Vor- und Entwurfsplanung** bis zur
**Ausführungsplanung** und Bauüberwachung. Auch wenn HOAI primär ein Honorarrecht ist, bietet es einen
klaren Rahmen für Aufgaben und Verantwortlichkeiten je Phase. Für eine Ladenbau-Planungsabteilung
bedeutet das: Bereits in Phase 1–2 sollten alle Anforderungen vollständig erhoben und dokumentiert
werden; Phase 3 (Entwurf) ist kreativ, muss aber mit Phase 4 (Genehmigungen, falls nötig) und Phase 5
(Detailplanung) verzahnt werden. Ein integriertes Tool sollte diese Phasen sichtbar machen oder zumindest
unterstützen (z. B. Meilensteine nach Abschluss jeder Leistungsphase), um **Qualitätssicherung** zu
betreiben. Best Practice ist, **keine Phase vorschnell zu überspringen** – gründliche Vorbereitung verhindert
spätere Änderungsschleifen.

# VDI-Richtlinien & Lean Principles: Moderne Planungsabteilungen orientieren sich zunehmend an

des Gesamtprojekts (inkl. HOAI-Leistungen) sieht
– sprich: Planungsabteilungen sollten immer das
_große Ganze_ (Zeitplan, Kosten, Schnittstellen) mitdenken, nicht nur ihre Fachplanung isoliert.

# Rollenmodelle in Projekten: In größeren Bau- und Innenausbauprojekten sind die Rollen oft feiner

# Werkzeuge & Tools: In vergleichbaren Branchen setzen Unternehmen auf integrierte Softwarelösungen ,

# Agile und hybride PM-Modelle: Traditionell läuft Planungsarbeit eher sequenziell (Wasserfallmodell).

**Qualitätssicherung & Standards:**
Planungsabteilungen orientieren sich häufig an externen
Qualitätsstandards. Beispielsweise sind **VDI 6022** (Raumlufttechnik) oder **DIN-Normen** zu Fluchtwegen etc.
relevant im Ladenbau – d.h. Planer:innen müssen stets Normkonformität prüfen. Best Practice ist hier,
Prüfpunkte in den Prozess zu integrieren (z. B. automatisierte Checklisten im Tool vor Abschluss der
Planung). **Checklisten** (z. B. „Sind alle gesetzlichen Anforderungen erfüllt?“, „Wurden alle Kundenvorgaben
berücksichtigt?“) können im System hinterlegt werden, um nichts zu übersehen. Zudem sollte das System
ermöglichen, **Lessons Learned** zu dokumentieren – so kann die Planungsabteilung aus jedem Projekt
Standards ableiten und kontinuierlich verbessern.

**Zusammenarbeit & Kommunikation:** In anderen Unternehmen hat sich gezeigt, dass **interdisziplinäre**
**Teams** und frühe Einbindung aller Beteiligten Fehler reduzieren. Z. B. setzt die Methode _„Big Room“_ (aus
dem Lean Construction) auf gemeinsame Planungsworkshops aller Gewerke. Übertragen hieße das: der
Vertrieb, die Planer:innen, die Kalkulation und ggf. die Montageplanung sitzen (physisch oder virtuell)
regelmäßig zusammen, um den Projektstand zu prüfen. Tools mit **Echtzeit-Collaboration** (ähnlich Google
Docs, aber für Pläne) könnten zukünftig eine Rolle spielen, sodass mehrere Personen gleichzeitig an einem
Plan arbeiten bzw. Kommentare hinterlassen können.

Zusammengefasst zeigen die Best Practices, dass eine **ganzheitliche Betrachtung** der Planung –
organisatorisch wie digital – der Schlüssel zum Erfolg ist. Eine Planungsabteilung sollte ihre Prozesse an
etablierten Modellen ausrichten, aber auch flexibel genug bleiben, um iterativ auf Veränderungen zu
reagieren. Ein integriertes CRM- und PM-System, das diese Balance unterstützt, ist State-of-the-Art.

# Rollenprofil (komplettes Persona-Profil)

**Name der Persona:** _"Planungsabteilung – Interior Design Team"_ (Team-Persona)
**Überblick:** Interne Abteilung, zuständig für Ladenplanung und Innenarchitekturprojekte, fungiert als
Schnittstelle zwischen Vertrieb, Kunde und Umsetzung.

**Team-Komposition:** X Planer:innen (Innenarchitekt:innen, Technische Zeichner:innen) unter Leitung eines/
einer Planungsleiters/in. Sitz in der Zentrale, arbeitet deutschlandweit für alle Kundenprojekte.

**Hauptaufgaben:**

- Kundenvorgaben in Raum- und Einrichtungskonzepte übersetzen (Grundrisse, Möblierungspläne,
  Visualisierungen).
- Technische Detailplanung erstellen (Maße, Materialauswahl, Anschlüsse) bis hin zur Ausführungsreife.
- Abstimmung mit Vertrieb (Auftragsklärung, Präsentationen) und Innendienst (Kalkulation Angebote).
- Koordination mit Grafik (Renderings, Präsentationsunterlagen) und Produktion/Montage
  (Machbarkeitsprüfung, Änderungsmanagement).
- Qualitätssicherung während der Umsetzung (Klärung offener Punkte, ggf. Baustellenbesuche,
  Abnahmen).

**Ziele & Motivation:**

- **Kundenzufriedenheit:** Räume gestalten, die den Kunden begeistern und funktional überzeugen.
- **Termintreue:** Projekte im geplanten Zeitrahmen realisieren (pünktliche Eröffnung).
- **Budgeteinhaltung:** Mit Kalkulation gemeinsam wirtschaftliche Lösungen finden, die im Kostenrahmen
  bleiben.
- **Effizienz:** Möglichst wenig Reibungsverluste im Prozess – klare Informationen, wenig Doppelarbeit,

schnelle Kommunikationswege.

- **Weiterentwicklung:** Aus jedem Projekt lernen, interne Standards optimieren (z. B. Detailkataloge,
  Materialbibliotheken) und neue Tools/Methoden (BIM, Lean) integrieren, um künftig noch besser zu
  werden.

**Wichtige Systeme/Tools aktuell:**

- Office-Tools (E-Mail, Excel für Ausstattungslisten, PowerPoint für Präsentationen).
- CAD-Software (z. B. AutoCAD, Vectorworks) für Zeichnungen; evtl. SketchUp oder 3ds Max für
  Visualisierungen.
- File-Server für Ablage von Projektdaten (Ordnerstruktur nach Projekt).
- Kein dediziertes PM-Tool vorhanden – Projektpläne werden ggf. manuell in Excel oder mit To-Do-Listen
  organisiert.
- CRM-System bisher rudimentär oder getrennt (Kundendaten evtl. in Excel/Access oder nur im ERP);
  Außendienst nutzt ggf. eigene Berichte.

**Herausforderungen (Pain Points):**

- **Informationsbrüche:** Wichtige Details aus Kundenterminen gehen verloren, wenn sie nicht richtig
  übergeben werden (z. B. handschriftliche Notizen, schwer lesbar).
- **Mehrarbeit durch Insellösungen:** Daten müssen mehrfach eingepflegt werden (Kundeninfo in Angebot
  **und** in Planungsliste), weil Systeme nicht verbunden sind.
- **Unklare Verantwortlichkeiten bei Änderungen:** Wenn Kunde Änderungen wünscht, fehlt manchmal
  Transparenz, wer das aktuell bearbeitet (Planung oder Kalkulation?) – Risiko von Fehlern.
- **Zeitdruck & Priorisierung:** Viele Projekte gleichzeitig, häufig ad-hoc Prioritätswechsel wenn ein
  Großkunde drängt – Planer:innen fühlen sich hin- und hergerissen.
- **Kommunikation:** Der Status der Planung ist für andere oft nicht sichtbar; Vertrieb fragt regelmäßig nach
  („Wie weit seid ihr?“), was zusätzlichen Aufwand erzeugt.
- **Dokumentenmanagement:** Versionierung von Plänen ist manuell; Gefahr, dass ein veralteter Plan
  versehentlich verwendet wird.
- **Akzeptanz neuer Tools:** Gewisse Skepsis gegenüber einer neuen Software („wieder etwas, das gepflegt
  werden muss“) – das Team muss vom Nutzen überzeugt werden.

**Bedürfnisse an neue Lösung:**

- **Zuverlässigkeit:** Das Tool muss stabil laufen und alle Daten sicher verwalten – Vertrauen in das System ist
  essenziell.
- **Benutzerzentrierung:** Es soll Arbeitsabläufe erleichtern, nicht verkomplizieren. Idealerweise spart es den
  Planer:innen täglich Zeit (Automatisierung von Routine, schnellere Abstimmungen).
- **Schulung & Support:** Das Team braucht anfängliche Schulung und laufende Unterstützung (ggf. Super-
  User in der Abteilung), um das volle Potential der Software auszuschöpfen.
- **Flexibilität:** Anpassbar an spezifische Projekte (kleiner Shop vs. großer Umbau) – das Tool sollte nicht starr
  vorschreiben, wie man zu planen hat, sondern sich an den existierenden Best Practice orientieren.
- **Transparenz & Kontrolle:** Jeder im Team möchte den Überblick behalten – wer macht gerade was, wie ist
  der Stand? Gleichzeitig möchte die Abteilungsleitung Auswertungen ziehen können (z. B.
  Kapazitätsauslastung, durchschnittliche Planungszeit pro Projekt, Nacharbeiten-Quote etc., also KPIs).
- **Integration:** Das Tool sollte die Brücke bauen zwischen **Kunden-CRM und Projekt-PM** . Beispielsweise aus
  Kundentermin => direkt neuer Projekt-Datensatz mit Aufgaben, aus Planung => direkter Input für Angebot.
  Diese Durchgängigkeit würde einen großen Mehrwert bieten (vgl. integrierte Plattformen, die genau das
  leisten
  ).

**KPIs (Erfolgsindikatoren):**

- _Durchlaufzeit_ pro Planungsprojekt (von Briefing bis Angebotsabgabe) – soll kürzer werden.
- _Anzahl Iterationsschleifen_ bis Kundenfreigabe – Ziel: reduzieren durch bessere Abstimmung und
  Visualisierung (viele Schleifen = Ineffizienz).
- _Termintreue_ der Planung – z. B. Anteil der Projekte, in denen Planungsabgabe gemäß Plan erfolgte.
- _Budgettreue_ – Abweichung Plan vs. Angebot vs. Realisierungskosten (Planung soll Kosten gut treffen).
- _Zufriedenheit_ der internen Kunden (Vertrieb, Montage) – wird deren Informationsbedarf erfüllt?
- _Nutzung des Tools_ – z. B. Login-Quote, gepflegte Datenfelder; hohe Nutzung signalisiert Akzeptanz.
- _Fehlerquote/Nacharbeiten_ – z. B. Anzahl Planungsfehler, die zu Änderungen während Bau führen; soll gegen
  Null gehen.

**Motto:** _"Gute Planung ist die halbe Umsetzung"_ . – Dieses Motto spiegelt das Selbstverständnis wider: Eine
sorgfältige, integrierte Planungsarbeit legt den Grundstein dafür, dass am Ende ein erfolgreiches Projekt
steht. Die neue Software soll dabei als **Rückgrat** dienen, nicht als bürokratisches Hindernis.

# Schlussbetrachtung

Die Analyse der Planungsabteilung als Persona zeigt klar, dass diese Rolle weit mehr ist als nur „Zeichnen
von Grundrissen“. Die Planer:innen bewegen sich an der **Nahtstelle zwischen Kunde, Kreativität und**
**Technik** , was hohe Anforderungen an Prozesse und Kommunikation stellt. Entsprechend vielfältig sind die
Erwartungen an ein integriertes CRM- und PM-Tool: Es muss sowohl die **Kreativarbeit unterstützen** (durch
flexible Informationsablage, visuelle Dokumentation) als auch **Struktur und Transparenz** in das
Projektmanagement bringen (durch Aufgaben-, Termin- und Datenmanagement).

Die Best-Practice-Recherche verdeutlicht, dass vergleichbare Branchen bereits erfolgreich **ganzheitliche**
**Systeme** nutzen, die vom Erstkontakt bis zur Ausführung reichen und dabei **operative und**
**kaufmännische Abläufe vereinen**
. Standards wie HOAI und VDI bieten einen Orientierungsrahmen,
den das neue System abbilden kann – sei es durch Phasen, Meilensteine oder Lean-Tools zur
Effizienzsteigerung. Gleichzeitig sollten agile Methoden soweit integriert werden, dass das Planungsteam
im Tagesgeschäft flexibel und responsiv bleibt (z. B. durch Kanban-Boards, kurze Feedbackzyklen).

# Für die Praxis bedeutet dies: Die Planungsabteilung wird das neue System dann voll akzeptieren, wenn es

Management und IT sollten diese Persona-Perspektive bei jeder Entscheidungsphase berücksichtigen – von
der Auswahl der Software über die Konfiguration bis zur Schulung. Die hier erarbeiteten Erkenntnisse
liefern eine Grundlage, um das System passgenau zuzuschneiden. Letztlich profitiert nicht nur die
Planungsabteilung, sondern das gesamte Unternehmen: **Gut geplante Projekte** bedeuten zufriedene
Kunden, effizientere Abläufe und am Ende auch wirtschaftlichen Erfolg.

In der folgenden Tabelle sind die wichtigsten Erkenntnisse je Kategorie zusammengefasst, um einen
schnellen Überblick für Entscheidungen zu bieten:

**Kategorie**
**Zentrale Erkenntnisse**

Planungsabteilung (Innenarchitektur/Ladenplanung) – Team aus X
Planer:innen unter eigener Leitung. Verantwortlich für Konzept- bis
Ausführungsplanung, Schnittstelle zw. Vertrieb, Kunde, Kalkulation,
Umsetzung. Arbeiten parallel an mehreren Projekten, hoher
Abstimmungsaufwand.

**Persona (Team)**

Hochwertige, funktionale Ladenkonzepte liefern; Kundenzufriedenheit
erzielen; Termine und Budgets einhalten; interne Effizienz steigern;
reibungslose Umsetzung ermöglichen. Stetige Verbesserung von Standards
und Prozessen.

**Ziele**

Projektbriefing vom Vertrieb übernehmen; Entwurfsplanung (Grundriss,
Design, Visualisierung); Abstimmung mit Kalkulation (Angebot);
Präsentationsvorbereitung; Änderungsmanagement mit Kunden; Detail-/
Werkplanung für Fertigung; Begleitung Montage bis Abnahme. Iterative
Schleifen mit Kundenfeedback einplanen.

**Aufgaben/Prozesse**

Aktuell: CAD-Software für Zeichnungen, Office (E-Mail, Excel, PPT) für
Kommunikation, Listen, Präsentation; Dateien auf Server abgelegt. Kein
integriertes PM-System – Koordination über persönliche Absprachen/Excel.
Best Practice: Einsatz integrierter Plattform (CRM+PM+ERP-Funktionen) wie
Troi
für durchgängige Abläufe und Transparenz.

**Tools & Systeme**

# Infobrüche und manuelle Doppelarbeit (Ordner, E-Mails); fehlende

**Herausforderungen**

_Funktional:_ zentrale Datenablage, Aufgabenmanagement mit automatischer
Aufgabenableitung, Status-Tracking für alle sichtbar, Kollaboration
(Kommentare, Benachrichtigungen), Dokumentenversionierung,
Terminplanung, Schnittstellen zu CAD/Kalkulation. _Nicht-funktional:_ intuitiv
bedienbar, performant, anpassbar an Abläufe, rollenbasierte Rechte,
zuverlässig (kein Datenverlust), fördert echte Zeitersparnis.

**Anforderungen ans**
**Tool**

Phasenstruktur (HOAI) nutzen
– klare Meilensteine; Lean/VDI-Prinzipien
anwenden – gesamte Wertschöpfung betrachten, verschwendungsfrei planen
; agile Methoden punktuell einsetzen – kurze Sprints, Daily Meetings für
komplexe Projekte
; Rollen klar definieren (Planer vs. Projektsteuerer),
Verantwortung verteilen; integrierte Software einsetzen, die Planung,
Controlling und Ausführung verknüpft
.

# Best Practices

# Projekt-Durchlaufzeit Planungsphase; Anzahl Iterationen bis Freigabe;

**KPIs**

---

_Page 11_

---

# Quellen

**Mitarbeiter-Interview (Planungsprozess)** – Transkript (2025), Ausschnitte: Aktueller Workflow von
Vertriebs-Übergabe über Planung bis Angebot
, Kommunikationswege und tägliche Status-
Updates
, Einbindung der Kalkulation und Angebotslegung
, Präsentation und
Kunden-Iteration bis Werkplanung
.
**HOAI Leistungsphasen – Wikipedia (de)** : Beschreibung der 9 Leistungsphasen nach HOAI für
Gebäude und Innenräume
, Orientierung für Planungsaufgaben von Grundlagenermittlung bis
Ausführungsplanung.
**WSM – Fabrikplanung nach VDI 5200** : Erläuterung des 8-phasigen Planungsmodells gemäß VDI
5200 und Integration von PM-Aufgaben
– zeigt standardisierte, aber iterative Vorgehensweise
für Planung und Umsetzung.
**VDI 2553 Lean Construction** (VDI.de): Beschreibung des Lean-Construction-Ansatzes als Adaption

1.

# 2.

# 3.

# 4.

von Lean Management im Bauwesen
, Ziel: Projekte im Kostenrahmen, mit minimalem
Mehraufwand und gewünschter Qualität fertigstellen (Kooperation und Effizienz im
Planungsprozess).
**DBZ – Agile Planung in der Architektur** (2022): Fachartikel über Einführung agiler Methoden in
Architekturprojekten, z. B. iterative Planung in Sprints, Visualisierung von Aufgaben und Daily
Scrums
– zeigt Vorteile für komplexe Projekte (Transparenz, Anpassungsfähigkeit).
**KRAMER Ladenbau – Planung & Konzept** (Unternehmenswebsite): Praxisbeispiel Ladenbau-Prozess
mit definierten Schritten _Definieren – Kreieren – Entwickeln – Ausführen_ , inkl. Zusammenarbeit von
Innenarchitekten, technischen Planern und Produktion von Idee bis Schlüsselübergabe
.
Verdeutlicht integratives Vorgehen und Kundennutzen durch Planung aus einer Hand.
**Troi – ERP-System für Architektur & Ingenieurwesen** (Anbieterwebsite): Beispiel für integrierte
Projektplattform, die Planungs-, Ressourcen- und Finanzprozesse vereint. Vorteile: operative Abläufe
und kaufmännische Prozesse in einem System, maximale Transparenz in jeder Projektphase
–
Benchmark für gesuchte CRM/PM-Integration.

# 5.

# 6.

# 7.

# sg_interview_31.10.25_deu.txt

## file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### Planung & Konzeption ihres Ladenbau-Projektes mit KRAMER

## https://kramer-gmbh.com/ladenbau/planung/

### Leistungsphasen nach HOAI – Wikipedia

## https://de.wikipedia.org/wiki/Leistungsphasen_nach_HOAI

### Fabrikplanung als Wissenschaft | WSM

## https://www.wsm.eu/de/fabrikplanung-als-wissenschaft/

### Planungs- & Controlling-Software für Bau & Architektur | Troi

## https://www.troi.de/erp-system-fuer-bau-architektur-ingenieurwesen/

### Richtlinie VDI 2553 Lean Construction | VDI

## https://www.vdi.de/mitgliedschaft/vdi-richtlinien/vdi-2553

### VDI 7001 - Wikipedia

## https://de.wikipedia.org/wiki/VDI_7001

### 11

Normen und Richtlinien - buildingSMART Deutschland

## https://www.buildingsmart.de/normen-und-richtlinien

### Vom Wasserfall zum Daily Scrum – Agile Planung in der Architektur - Deutsche

## https://www.dbz.de/artikel/dbz_Vom_Wasserfall_zum_Daily_Scrum_Agile_Planung_in_der_Architektur-3583255.html

---

# Erweiterungen 2025: Predictive Project Intelligence & Knowledge Management

Die folgenden Funktionen erweitern die Werkzeuge der Planungsabteilung um **vorausschauende Kapazitäts- und Timeline-Planung, RAG-basierte Wissenssuche und Team-Auslastungs-Dashboards**.

## 📊 Projekt-Timeline-Prognosen & Ressourcenplanung

### Predictive Timeline Forecasting

Die Planungsabteilung benötigt **realistische Timeline-Prognosen** um Projekte termingerecht zu liefern und Engpässe frühzeitig zu erkennen[^1].

**Kernanforderungen:**

**ML-basierte Fertigstellungsprognosen:**

- **Predictive Models** analysieren aktuelle Projekte und schätzen Fertigstellungsdatum[^2]
  - Projekt A: Geplant KW 16, ML-Forecast: KW 17 (1 Woche Verzögerung wahrscheinlich: 75%)
  - Grund: "CAD-Phase 80% Zeit verbraucht, aber erst 60% fertig → Restdauer überschritten"
  - Projekt B: Geplant KW 18, ML-Forecast: KW 18 (On Track: 92% Wahrscheinlichkeit)
- **Feature Engineering**: Modell berücksichtigt[^3]
  - Projekttyp & Komplexität (Hofladen Standard vs. Vinothek Custom)
  - Team-Erfahrung (Planer X bearbeitet 3. Hofladen-Projekt → schneller)
  - Historische Durchschnitte (ähnliche Projekte brauchten Ø 12 Tage CAD-Zeit)
  - Parallele Workload (Planer hat 2 andere Projekte → Verzögerung wahrscheinlicher)
- **Confidence Intervals**: Best Case (10%), Most Likely (50%), Worst Case (90%)
  - Projekt A: Best Case KW 16, Most Likely KW 17, Worst Case KW 19 (+3 Wochen)

**Kritischer-Pfad-Analyse & Bottleneck-Detection:**

- System identifiziert **kritische Meilensteine** die Projekt-Fertigstellung gefährden[^4]
  - Projekt A: Meilenstein "CAD-Erstellung" 5 Tage überfällig → **kritisch** (blockiert Produktion)
  - Projekt B: "Kundenfrei

gabe Design" noch nicht erteilt → **nicht-kritisch** (kann parallel vorbereitet werden)

- **Dependency Chains**: Visualisierung welche Tasks andere blockieren
  ```
  CAD-Erstellung (ÜBERFÄLLIG!)
       ↓ blockiert
  Produkt-Stückliste
       ↓ blockiert
  Material-Bestellung
       ↓ blockiert
  Produktion Start → Liefertermin gefährdet!
  ```
- **Proaktive Alerts**: "⚠️ Projekt A: CAD-Phase überfällig → Liefertermin KW 16 gefährdet (89% Risiko)"

**Kapazitäts-Prognose & Team-Auslastung:**

- **Resource Allocation Forecast**: Welche Projekte benötigen wann wie viel Kapazität?[^5]
  - KW 15: 3 Projekte in CAD-Phase → 45h Bedarf (Team: 3 Planer × 35h = 105h → 43% ausgelastet, grün)
  - KW 18: 7 Projekte parallel (4 CAD, 2 Revision, 1 Kundenpräsentation) → 98h Bedarf (93% ausgelastet, gelb)
  - KW 20: 8 Projekte + 2 Notfall-Rush-Jobs → 125h Bedarf (119% ausgelastet, **rot - Überlastung!**)
- **Bottleneck-Alerts**: "WARNUNG: KW 20 Kapazitätsgrenze um 19% überschritten → Empfehlung: Externe Planer-Unterstützung oder Projektverschiebung"
- **Skill-Matrix**: System berücksichtigt Spezialisierungen
  - 3D-Visualisierung: Nur Planer A kann → Bottleneck bei vielen Visualisierungs-Anforderungen
  - CAD-Zeichnung: Alle Planer → gut verteilt

**Technische Umsetzung**:

- **Timeline Prediction**: Random Forest oder XGBoost trainiert auf historischen Projekt-Timelines[^2][^3]
- **Critical Path Method (CPM)**: Algorithmus aus klassischem Projektmanagement[^4]
- **Resource Leveling**: Optimierungs-Algorithmus für Team-Auslastung[^5]

[^1]: Quelle: Research "Forecasting Methods" – Project Timeline Prediction

[^2]: Quelle: Research "ML Models" – XGBoost für Timeline Forecasting

[^3]: Quelle: Research "Forecasting Methods" – Feature Engineering für Projektprognosen

[^4]: Quelle: Research "Forecasting Methods" – Critical Path Analysis

[^5]: Quelle: Research "Capacity Forecasting" – Resource Allocation & Leveling

**Szenario-Analysen:**

- **What-If-Simulationen**[^6]:
  - "Was passiert wenn Kunde Y Freigabe um 2 Wochen verzögert?" → Projekt verschiebt sich auf KW 20, kollidiert mit 2 anderen Projekten → Überlastung
  - "Was passiert wenn wir Projekt A priorisieren?" → Projekt B & C verzögern sich um je 3 Tage
  - "Können wir 2 zusätzliche Rush-Jobs in KW 18 annehmen?" → Nein, Kapazität bereits 93% ausgelastet
- **Impact-Berechnung**: System zeigt Auswirkungen auf andere Projekte
  - "Wenn Projekt A 1 Woche früher fertig sein soll → Planer muss 15h von Projekt B abziehen → Projekt B verzögert sich"

[^6]: Quelle: Research "Forecasting Methods" – Monte Carlo Simulation für What-If-Analysen

## 📈 Auslastungs-Dashboards & Workload-Visualisierung

### Planning Department Command Center

Ein **zentrales Dashboard** gibt der Planungsabteilung Echtzeit-Überblick über Workload, Priorities und Timeline-Risiken[^7].

**Dashboard-Struktur:**

**Top-Level KPIs (Always Visible):**

- **Aktive Projekte**: 8 Stück (davon 2 überfällig, 3 kritische Timeline)
- **Team-Auslastung**: 87% (diese Woche), Prognose nächste Woche: 119% (rot)
- **Avg. Projekt-Dauer**: 18 Tage (Ziel: <21 Tage, grün ✓)
- **On-Time-Delivery-Rate**: 82% (Ziel: >85%, leicht unter Ziel)
- **Offene Change-Requests**: 5 Stück (davon 2 blockieren Fertigstellung)

**Projekt-Timeline-Übersicht:**

- **Gantt-Chart-View**: Zeigt alle aktiven Projekte mit Meilensteinen
  ```
  KW 14  KW 15  KW 16  KW 17  KW 18
  Projekt A: ████████▓▓▓▓░░ (CAD überfällig! ⚠️)
  Projekt B: ░░░░████████░░ (On Track ✓)
  Projekt C: ░░░░░░████████ (Start verzögert 🟡)
  Projekt D: ████████████░░ (Fertigstellung KW 17)
  ```
- **Color-Coding**: Grün = on-time, Gelb = leichte Verzögerung, Orange = kritisch, Rot = überfällig
- **Drag & Drop**: Projekte verschieben → System berechnet automatisch Auswirkungen auf Kapazität

**Team-Auslastungs-Matrix:**

- **Per-Planner-View**:
  - Planer A: 92% ausgelastet (diese Woche), 3 Projekte (2 CAD, 1 Revision)
  - Planer B: 78% ausgelastet, 2 Projekte (1 Visualisierung, 1 Kundenpräsentation)
  - Planer C: 95% ausgelastet (fast am Limit!), 4 Projekte (Warnung: Überbelastung)
- **Skill-Breakdown**: Wer arbeitet an was?
  - CAD-Erstellung: Planer A & C (75% ihrer Zeit)
  - 3D-Visualisierung: Nur Planer A (Bottleneck!)
  - Kundenpräsentationen: Planer B (50% seiner Zeit)
- **Heatmap**: Farbcodierung zeigt auf einen Blick wer über-/unterlastet
  ```
  Planer A: ████████░░ 92% (gelb, nähert sich Limit)
  Planer B: ███████░░░ 78% (grün)
  Planer C: █████████▓ 95% (orange, fast überlastet)
  ```

**Projekt-Prioritäten-Queue:**

- **Sortiert nach Dringlichkeit & Impact**[^8]:
  1. 🔴 **Projekt A**: CAD 5 Tage überfällig, blockiert Produktion (höchste Priorität!)
  2. 🔴 **Projekt D**: Kunde-VIP, Deadline KW 17 (nur 3 Tage Puffer)
  3. 🟡 **Projekt C**: Change-Request vom Kunden (muss geprüft werden)
  4. 🟢 **Projekt B**: On Track, keine Intervention nötig
- **Smart Sorting**: ML-Algorithmus berücksichtigt
  - Timeline-Risiko (überfällig? kritischer Pfad?)
  - Business Impact (Großkunde? Hoher Auftragswert?)
  - Dependencies (blockiert Projekt X andere?)
  - SLAs (vertraglich vereinbarte Fristen)

[^7]: Quelle: Research "BI Solutions" – Grafana/Metabase für Team Dashboards

[^8]: Quelle: Research "ML Models" – Priority Scoring via Multi-Criteria Decision Analysis

**Meilenstein-Tracker:**

- **Upcoming Milestones** (nächste 2 Wochen):
  - Projekt A: "CAD-Freigabe" (überfällig seit 5 Tagen) ⚠️
  - Projekt D: "Kundenpräsentation" (in 2 Tagen) 🟢
  - Projekt B: "Produktion Start" (in 5 Tagen) 🟢
- **Risk Indicators**: ML-Modell markiert gefährdete Meilensteine
  - "Projekt C: 70% Wahrscheinlichkeit dass 'Materialfreigabe' verzögert wird (Grund: Lieferant X hat Historie von Verspätungen)"

**Change-Request-Management:**

- **Offene Change-Requests** (Liste):
  - CR #42 (Projekt A): Kunde möchte Theke breiter → Impact: +2 Tage CAD, +€1.200 Kosten
  - CR #45 (Projekt C): Material-Wechsel Holz → Glas → Impact: +5 Tage (Neukalkulation), +€3.500
  - CR #48 (Projekt B): Beleuchtung-Upgrade → Impact: +1 Tag, +€800 (minor)
- **Impact-Analyse**: System berechnet automatisch Auswirkungen auf Timeline & Budget
  - "CR #42 annehmen? → Projekt A verschiebt sich auf KW 18, aber innerhalb SLA"
- **Approval-Workflow**: Change-Requests >€2.000 oder >3 Tage Delay benötigen GF-Freigabe

**Real-Time Collaboration Indicators:**

- **Live-Status**: Zeigt wer gerade an welchem Projekt arbeitet
  - Planer A: "Bearbeitet CAD für Projekt A" (seit 45 Min)
  - Planer B: "Kundentermin Projekt D" (abwesend bis 15 Uhr)
- **Lock Mechanism**: Verhindert gleichzeitiges CAD-Editing (CouchDB-Konflikte)
- **Recent Activity**: "Planer C hat vor 10 Minuten Visualisierung für Projekt B fertiggestellt"

**Export & Reporting:**

- **One-Click-Export**: Gantt-Chart als PDF für Kundenpräsentationen oder GF-Meetings
- **Scheduled Reports**: Wöchentlicher Team-Status-Report via E-Mail
  - "KW 15: 8 aktive Projekte, 6 on-time, 2 verzögert. Team-Auslastung Ø 87%."
- **Mobile View**: Planer können Dashboard auf Smartphone/Tablet checken (PWA)

[^9]: Quelle: Research "Real-Time Dashboards" – WebSocket für Live-Updates

## 🔍 RAG-basierte Wissenssuche & KI-Assistenz

### Knowledge Base Q&A für Planungsabteilung

Die Planungsabteilung profitiert von **RAG-gestützter Wissenssuche** für schnellen Zugriff auf historische Projekte, Best Practices und Design-Patterns[^10].

**Semantic Project Search:**

**Natural Language Queries:**

- Planer fragt: **"Zeige mir ähnliche Hofläden-Projekte mit regionalem Sortiment"**
- **RAG-System** (LlamaIndex)[^11]:
  1. **Vector Search** findet semantisch ähnliche Projekte (Embeddings: "Hofladen", "regional", "Direktvermarkter")
  2. System retrieviert: 8 Projekte (2022-2024)
  3. **LLM-Antwort**: "Gefunden: 8 Hofladen-Projekte mit regionalem Sortiment:
     - Projekt A (2024): Hofladen Müller, 60qm, Schwerpunkt Obst/Gemüse
     - Projekt B (2023): Bauernladen Schmidt, 55qm, Käse & Wurst-Fokus
     - Projekt C (2023): Bio-Hofladen Grün, 70qm, Vollsortiment
       **Häufige Design-Elemente**: Holz-Regale (8/8), Kühltheken (7/8), Verkostungsbereich (6/8)
       **Durchschnitt-Timeline**: 18 Tage CAD-Phase, 12 Tage Produktion
       **Quelle**: Projekt-Datenbank 2022-2024 [Links zu CRM]"

**Weitere Beispiel-Queries:**

- "Welche 3D-Visualisierungs-Software haben wir bei Vinothek-Projekten verwendet?" → Aggregation & Ranking
- "Zeige mir Design-Trends bei Floristen-Läden 2024" → Automatische Trendanalyse
- "Wo hatten wir Probleme mit Material X?" → Durchsucht Projekt-Notizen, Protokolle
- "Welcher Lieferant liefert Holz-Regale am schnellsten?" → Historische Lieferzeiten-Analyse

**Quellenangaben & Verifikation:**

- **Immer mit Quellen**: Jede KI-Antwort referenziert Ursprungsdokumente (Projekt-IDs, CAD-Dateien)
- **Confidence Scores**: "Diese Antwort basiert auf 8 Projekten (Konfidenz: 91%)"
- **Visual Previews**: Thumbnails von Referenz-CAD-Zeichnungen/Visualisierungen inline

[^10]: Quelle: Research "RAG Architecture" – Semantic Search für Projekt-Knowledge Base

[^11]: Quelle: Research "LlamaIndex" – Optimiert für Document Retrieval in Enterprise

**Design-Pattern-Library:**

**Automatische Pattern-Extraktion:**

- System analysiert historische Projekte und identifiziert **wiederkehrende Design-Patterns**[^12]
  - Pattern "Standard-Hofladen-Layout": U-förmige Regal-Anordnung, zentrale Kasse, Verkostungsbereich rechts
    - Verwendet in: 12 von 15 Hofladen-Projekten
    - Durchschnittliche Kundenzufriedenheit: 4,8/5 ⭐
  - Pattern "Vinothek-Präsentations-Wand": Rückwand mit Weinregalen + Beleuchtung, Verkostungstheke vorne
    - Verwendet in: 9 von 10 Vinothek-Projekten
  - Pattern "Floristen-Kühlwand": Glas-Kühlschränke entlang einer Wand, Arbeitstisch zentral
    - Verwendet in: 7 von 8 Floristen-Projekten
- **Pattern-Suche**: Planer kann Patterns durchsuchen & als Basis für neues Projekt verwenden
  - "Gib mir das Standard-Hofladen-Layout als CAD-Template" → System exportiert Basis-Layout

**Template-Vorschläge:**

- Planer startet neues Projekt: "Hofladen, 60qm, regionales Sortiment"
- **KI schlägt Templates vor**:
  - Template A (Standard-Hofladen-Layout): Ähnlichkeit 94%, verwendet in 12 Projekten
  - Template B (Bio-Laden-Variante): Ähnlichkeit 87%, verwendet in 5 Projekten
  - Template C (Klein-Hofladen <50qm): Ähnlichkeit 82%, verwendet in 4 Projekten
- **Quick-Start**: Planer wählt Template A → CAD-Basis-Layout wird automatisch geladen → 2-3h Zeitersparnis

[^12]: Quelle: Research "ML Models" – Pattern Recognition in Design Documents

**Material- & Produkt-Suche:**

**Semantic Product Search:**

- Planer sucht: **"Nachhaltiges Holz-Regalsystem, 3m Breite"**
- **Vector Search** (Pinecone/Weaviate)[^13] findet semantisch ähnliche Produkte:
  - "Massivholz-Regal FSC-zertifiziert, 3m" (Lieferant A, €2.800)
  - "Eichen-Regalsystem, 2,8m ausziehbar auf 3m" (Lieferant B, €3.200)
  - "Regal-System aus recyceltem Holz, modular 3m" (Lieferant C, €2.500)
- **Kein exaktes Keyword-Matching nötig**: KI versteht "nachhaltig" = FSC / recycelt
- **Lieferanten-Vergleich**: System zeigt Preise, Lieferzeiten, historische Zuverlässigkeit
  - Lieferant A: Ø 12 Tage Lieferzeit (95% pünktlich)
  - Lieferant B: Ø 18 Tage Lieferzeit (70% pünktlich)
  - Lieferant C: Ø 10 Tage Lieferzeit (90% pünktlich) → **Empfohlen**

[^13]: Quelle: Research "Vector Databases" – Semantic Search für Produkt-Kataloge

**Best-Practice-Recommendations:**

**KI-generierte Empfehlungen:**

- System analysiert Projekt-Kontext und schlägt Best Practices vor[^14]
  - Projekt: "Vinothek, 80qm, Premium-Segment"
  - **Empfehlungen**:
    - "Best Practice: Weinpräsentations-Wand mit LED-Beleuchtung (verwendet in 9/10 Premium-Vinotheken)"
    - "Tipp: Eiche-Holz statt Kiefer (höhere Wahrnehmung Qualität, +€800 aber lohnt sich bei Premium)"
    - "Warnung: Projekt-Typ dauert Ø 22 Tage → Timeline-Puffer einplanen"
- **Learning from Success**: System identifiziert was bei ähnlichen Projekten gut funktioniert hat
  - "Projekt X hatte hohe Kundenzufriedenheit (5/5 ⭐) → Verwendete Material-Kombi: Eiche + Glas + LED"

[^14]: Quelle: Research "RAG Architecture" – Recommendation Engine via Historical Data

**Automated Design Review:**

**AI Quality Checks:**

- Planer lädt CAD-Zeichnung hoch → KI prüft automatisch[^15]
  - **Vollständigkeits-Check**: "Fehlt: Materialangaben für Position 12 (Regal-System)"
  - **Plausibilitäts-Check**: "Ungewöhnlich: Theke nur 80cm breit (Standard: 100-120cm) → Prüfung empfohlen"
  - **Compliance-Check**: "Barrierefreiheit: Gangbreite 85cm (Minimum: 90cm DIN 18040) → Anpassung erforderlich"
- **Clash Detection**: Erkennt Überschneidungen im CAD-Modell
  - "Konflikt erkannt: Regal Position 3 überschneidet sich mit Türöffnungsbereich"
- **Cost-Estimation**: Automatische Kostenschätzung basierend auf Materialien
  - "Grobe Kostenabschätzung: €35.000-€42.000 (basierend auf ähnlichen Projekten)"

[^15]: Quelle: Research "RAG Architecture" – Automated Document Quality Checks via LLM

**Conversational Design Assistant:**

**Gemini-Style Inline Suggestions:**

- Planer schreibt Projekt-Beschreibung: "Hofladen mit regionalem Sortiment, Kunde legt Wert auf..."
- **AI Auto-Complete**: "...Nachhaltigkeit und lokale Produkte. Empfehlung: FSC-zertifiziertes Holz, Energiespar-Beleuchtung, flexible Regal-Systeme für saisonale Anpassungen."
- **Accept/Reject**: Planer kann Vorschlag annehmen oder modifizieren
- **Context-Aware**: KI berücksichtigt Projekttyp, Budget, Kundenwünsche

**Interactive Q&A während CAD-Arbeit:**

- Planer fragt während CAD-Erstellung: **"Welche Standard-Maße haben Kühltheken?"**
- **RAG-Antwort**: "Standard-Kühltheken: 2,0m oder 2,5m Breite, 80cm Tiefe, 1,2m Höhe. In Hofladen-Projekten am häufigsten: 2,0m (12 Projekte) vs. 2,5m (5 Projekte). **Quelle**: Produkt-Katalog & historische Projekte."
- **Follow-Up**: "Welcher Lieferant liefert am schnellsten?" → "Lieferant Kühl-Tech GmbH: Ø 8 Tage (beste Quote)"

**DSGVO-Konformität & Security:**

**Datenschutz-Maßnahmen:**

- **On-Premise LLM Option**: Lokales Llama 70B für 100% datenschutzkonforme Wissenssuche[^16]
- **Access Control**: RAG-System respektiert RBAC-Rollen (Planer sieht nur Projekte mit Lesezugriff)
- **Audit Trails**: Alle KI-Queries geloggt (Wer hat was gesucht? Welche Daten wurden abgerufen?)
- **Data Filtering**: Sensitive Kundendaten (Margen, Preise) nur für berechtigte Rollen sichtbar

**Explainability & Trust:**

- **Reasoning Traces**: Planer kann nachvollziehen wie KI zu Empfehlung kam
- **Human-in-the-Loop**: Bei kritischen Design-Entscheidungen → Planer muss manuell bestätigen
- **Hallucination Detection**: System warnt wenn Antwort-Konfidenz <70% ("Antwort unsicher, manuelle Prüfung empfohlen")

[^16]: Quelle: Research "DSGVO Compliance for LLMs" – On-Premise Hosting für Knowledge Base

**Neo4j-basierte Beziehungs-Analysen:**

**Projekt-Netzwerk-Graph:**

- **Graph Database** (Neo4j)[^17] speichert Beziehungen zwischen Projekten, Kunden, Materialien, Lieferanten
- **Query-Beispiele**:
  - "Welche Projekte verwendeten Material X von Lieferant Y?" → Cypher-Query findet 8 Projekte
  - "Zeige Einfluss-Kette: Kunde A → Projekte → Materialien → Lieferanten" → Visualisierung im Graph
  - "Wer sind die einflussreichsten Lieferanten?" → Page-Rank auf Lieferanten-Netzwerk
- **Use Case**: "Lieferant X hat Lieferprobleme → Welche Projekte sind betroffen?" → Sofortige Antwort via Graph-Traversierung

[^17]: Quelle: Research "Neo4j" – Knowledge Graphs für CRM/PM Relationship Modeling

**Collaborative Knowledge Building:**

**Crowd-Sourced Best Practices:**

- Planer können **Lessons Learned** nach Projektabschluss eingeben
  - "Projekt X: Material Y war schwer zu verarbeiten → Alternative Z empfehlen"
  - "Vinothek-Projekte: Immer 20% Zeitpuffer für Kundenfreigabe-Schleifen einplanen"
- **KI-System aggregiert** diese Insights & macht sie durchsuchbar
  - Nächster Planer sucht "Vinothek Timeline" → KI schlägt automatisch 20% Puffer vor (basierend auf Lesson Learned)
- **Upvoting**: Team kann nützliche Insights upvoten → höhere Priorität in Empfehlungen

**Document Versioning & History:**

- **RAG-System** durchsucht auch historische Versionen von CAD-Zeichnungen
  - "Zeige mir alle Versionen von Projekt A Design" → 5 Iterationen mit Änderungs-Highlights
  - "Was hat sich zwischen Version 2 und 3 geändert?" → KI erklärt: "Theke von 100cm auf 120cm verbreitert, Regal-Position verschoben"

---

# Phase 2: AI-Risikofrüherkennung & Echtzeit-Kollaboration

**Relevant für:** Planungsabteilung – Proaktive Projektsteuerung & bessere Team-Koordination

## 🤖 AI-gestützte Projekt-Risikoanalyse (Phase 2.1)

**Problem:** Projekte geraten "plötzlich" in Verzug (CAD-Zeichnung dauert länger, Schreinerei liefert zu spät) → Reaktives Firefighting.

**Lösung - Predictive Risk Dashboard:**

- **ML-Modell** (XGBoost) trainiert auf historischen Projekten → erkennt Risk-Patterns
- **Risk Indicators:**
  - Verzögerungs-Risiko: "Projekt X hat 75% Wahrscheinlichkeit für >5 Tage Delay"
  - Lieferanten-Risiko: "Schreinerei Müller liefert in 60% der Fälle zu spät"
  - Ressourcen-Engpass: "Planer überlastet (3 parallele Projekte) → Bottleneck"
- **Proaktive Alerts:** Planer bekommt Real-Time-Warnung (Socket.IO): "Projekt Y Risiko 85% - Intervention empfohlen"
- **Explainable AI:** SHAP zeigt WHY: "CAD-Phase 80% Zeit verbraucht, aber erst 50% fertig → Delay-Risiko"

**Impact:**

- -30% weniger Projekt-Verspätungen
- 2-3 Wochen frühere Intervention
- Weniger "Wo bleibt Projekt X?"-Anrufe von Kunden (-40%)

---

## 🔔 Real-Time Project Collaboration (Phase 2.1)

**Activity Feed für Planer:**

- "Innendienst hat Projekt Z beauftragt – CAD-Erstellung fällig in 3 Tagen"
- "Schreinerei Müller hat Liefertermin bestätigt – 2 Tage früher als geplant"
- "Kunde hat Design-Änderung angefragt – bitte alternative Grundrisse entwerfen"

**@-Mentions & Contextual Commenting:**

- Innendienst: "@Planer: Kunde möchte Theke 20cm breiter – machbar?"
- Planer antwortet direkt AN Design-Dokument → Kontext bleibt erhalten

**Presence Indicators (Phase 2.2):**

- Planer sieht WHO editiert gerade welches Projekt → Keine CouchDB-Konflikte mehr

**Impact:**

- -50% weniger CouchDB-Konflikte (von 10/Woche → 5/Woche)
- 2-3x schnellere Abstimmungen (vorher 1 Tag E-Mail → jetzt 2h Real-Time)

---

**Siehe auch:**

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 1 (AI Risk Assessment), Pillar 2 (Collaboration)
- `docs/product-vision/Produktvision Projektmanagement & -durchführung.md` → Phase 2 Erweiterungen

---

### 12
