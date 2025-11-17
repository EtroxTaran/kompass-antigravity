# Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final

_Converted from: Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf_  
_Last Updated: 2025-11-10 – Vollständig integriert mit allen Gap-Resolutionen_  
_Document Version: 2.0_

**⚡ Verknüpfte Spezifikationen:**

- **NFR-Spezifikation:** `docs/reviews/NFR_SPECIFICATION.md` – Performance, Skalierung, Verfügbarkeit, Offline-Speicher, Monitoring
- **Datenmodell:** `docs/specifications/data-model.md` – ERD, Entities, Validierung, ID-Strategien, GoBD, Deduplizierung
- **RBAC-Matrix:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` – Rollenberechtigungen (ADM/INNEN/PLAN/BUCH/GF), Feldebene-Zugriffsregeln
- **Benutzerreisen:** `docs/reviews/USER_JOURNEY_MAPS.md` – 5 End-to-End-Journeys: Lead→Projekt, Projekt→Rechnung, Änderungsanfrage, GF-Review, Offline-Sync
- **Konfliktauflösung:** `docs/reviews/CONFLICT_RESOLUTION_SPECIFICATION.md` – Hybrid-Strategie (70% auto, 25% nutzergeführt, 5% eskaliert), UX-Mockups, Training
- **Teststrategie:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` – 70/20/10-Pyramide, 50+ E2E-Szenarien, Offline-Tests, 6+ Browser-Kombinationen
- **API-Spezifikation:** `docs/reviews/API_SPECIFICATION.md` – OpenAPI 3.0, RESTful, JWT-Auth, Header-Versionierung
- **Lieferplan:** `docs/reviews/DELIVERY_PLAN.md` – 16 Wochen MVP, 6.75 FTE, €230k Budget, Training & Rollout

**📋 Clarified Scope (GAP-SCOPE-001, GAP-SCOPE-003):**

- **MVP:** CRM-Kern (Customer/Contact/Opportunity/Protocol) + Import/Export – **Keine KI-Features in MVP**
- **Phase 2:** KI-Transkription (Whisper), KI-Analyse, Lexware-API-Sync, erweiterte PM-Features
- **i18n:** Deutsch-only für MVP, Architektur i18n-ready für Phase 2 (Aufwand dann: 2-3 Wochen)
- **Begründung:** Fokus auf Kern-Geschäftsprozesse, schneller ROI, technische Komplexität reduziert

---

# Executive Summary

Das Ziel der geplanten Lösung ist ein integriertes **CRM- und Projektmanagement-Tool** , das die
abteilungsübergreifenden Arbeitsprozesse eines Ladenbau-/Innenausbau-Unternehmens nahtlos
unterstützt. Alle relevanten **Kundeninformationen und Projektdaten** sollen zentral verfügbar sein, um
eine 360°-Sicht auf jeden Kunden und jedes Projekt zu ermöglichen. Damit sollen **Vertriebsprozesse (CRM)**
und **Projektabwicklung** in einem System vereint werden, sodass die Übergabe vom Verkauf an die
Umsetzung reibungslos verläuft und **Doppelarbeit sowie Medienbrüche entfallen**
. Die
wichtigsten Erkenntnisse der Analyse sind:

# Klare Definition von Personas (Außendienst, Innendienst/Kalkulation, Planung, Buchhaltung,

spezifische Anforderungen des Ladenbau-Bereichs wie Grundriss-Handling, Lieferzeiten-Tracking)
bieten **Differenzierungschancen** für eine maßgeschneiderte Lösung.
Offene Punkte und Risiken bestehen v.a. in der weiteren Detailklärung von Anforderungen (z.B.
Umfang der Integration mit bestehenden Buchhaltungssystemen) sowie im **Change Management** –
die Einführung eines solchen Systems erfordert Akzeptanz und Schulung der Nutzer.
Erfahrungsgemäß sind ohne adäquates Training die Nutzungsraten von CRMs
branchenübergreifend niedrig (~26 % durchschnittliche Adoption)
. Daher wird empfohlen,
frühzeitig Key User einzubeziehen und auf Usability zu achten, um einen erfolgreichen Rollout
sicherzustellen.

# Insgesamt zeichnet die Analyse das Zielbild eines zentralen, benutzerfreundlichen CRM/PM-Systems, das

# Rahmenbedingungen & Annahmen

Aus dem Chat-Kontext und Interview lassen sich folgende Rahmenbedingungen und Annahmen ableiten:

**Branche & Geschäftsmodell:** Es handelt sich um ein Unternehmen im **Ladenbau/Innenausbau**
(Planung und Umsetzung von Ladeneinrichtungen). Projekte sind meist kundenspezifische
Einrichtungen von Ladenlokalen, inkl. Entwurf, Fertigung (über Partner wie Schreinereien) und
Montage vor Ort. Der Vertrieb erfolgt teils über _Kaltakquise_ und persönliche Beratung durch
Außendienstmitarbeiter. Projekte können sich über mehrere Monate erstrecken und oft über den
Jahreswechsel hinaus laufen
.

# Organisatorischer Rahmen:

# Technische Rahmenbedingungen: Technologische Entscheidungen sind explizit ausgeklammert .

# Compliance & Datenschutz: Da Kundendaten verarbeitet werden, muss das System DSGVO-

nötige personenbezogene Daten erhoben und gespeichert)
, Zweckbindung (Nutzung der Daten
nur für den ursprünglich vorgesehenen Zweck) und Nachweis von Einwilligungen (für
Marketingkontakte)
. Außerdem muss das Recht auf Auskunft und Löschung umsetzbar sein
(Export aller personenbezogenen Daten eines Kunden auf Anfrage; vollständige Löschung, sofern
keine gesetzlichen Aufbewahrungspflichten entgegenstehen)
. Parallel ist **GoBD-Compliance**
erforderlich, da Projektdokumente (z.B. Angebote, Rechnungen) steuerrelevant sind. Dies bedeutet
u.a. **revisionssichere Speicherung** (Unveränderbarkeit von Archivdaten), **Nachvollziehbarkeit** von
Änderungen und eine Aufbewahrung von 10 Jahren für relevante Dokumente
. Wir nehmen an,
dass das Unternehmen diese Vorgaben erfüllen
_muss_ , und daher Funktionen wie
Änderungsprotokolle (Audit Trails)
, Zugriffsberechtigungen und Daten-Backups vorhanden sein
müssen. BITV/WCAG-konforme Barrierefreiheit ist keine explizite Anforderung (keine öffentliche
Behörde); dennoch wird Wert auf **Usability und grundsätzliche Zugänglichkeit** gelegt – d.h. das UI
sollte klare Kontraste, gut lesbare Schriften und Fokus-Indikatoren bieten, um allen Mitarbeitern die
Nutzung zu erleichtern (Best Practice).

# Benutzer und Kapazität: Das Tool richtet sich an interne Nutzer aus den genannten Abteilungen

**Projektumfang & Vision:** Der Schwerpunkt liegt auf **Produktvision und fachlichem Konzept** .
Technische Umsetzungen (Datenbanken, Frameworks etc.) werden nicht beschlossen. Ebenso sind
_keine Entscheidungen zu konkreten Anbietern oder Tools_ gefällt – der Marktvergleich dient nur der
Orientierung. Es wird angenommen, dass eine Make-or-Buy-Entscheidung noch aussteht, d.h. die
Ideallösung könnte durch Anpassung eines bestehenden Systems oder als Neuentwicklung erfolgen.
Für die Analyse wird vom Optimum („Greenfield“-Ansatz) ausgegangen, um alle fachlichen
Anforderungen zu sammeln, die Lösung jedoch möglichst technologieoffen beschrieben.

**Abgrenzungen:** Nicht betrachtet werden tiefgehende _ERP-Funktionen_ jenseits des Projektgeschäfts
(z.B. Lagerhaltung, Personalplanung außerhalb der Projektzuordnung). Die **Finanzintegration**
beschränkt sich auf die bedarfsgerechte Rechnungserstellung und Zahlungskontrolle für Projekte,
jedoch _nicht_ auf vollständige Buchhaltungssoftware – es wird angenommen, dass hierfür ggf. eine
Schnittstelle zur bestehenden Buchhaltung (Datev o.ä.) geschaffen wird, falls notwendig. Ferner wird
kein eigenständiges CAD- oder Grafikmodul entwickelt; die Planer nutzen weiter ihre spezialisierten
Tools für Zeichnungen/Entwürfe, das neue System verwaltet Metadaten und Dateien daraus, ersetzt
aber keine Design-Software.

**Ziele** (rekapituliert): Erhöhung der **Effizienz** (Vermeidung redundanter Arbeiten, automatische
Workflows), bessere **Zusammenarbeit** zwischen Abteilungen (einheitliche Datenbasis, Transparenz),
verbesserte **Kundenbetreuung** durch aktuellen Informationsstand und Nachfass-Aufgaben, sowie
**Management-Sichtbarkeit** über Vertriebspipeline und Projektstatus in Echtzeit. Diese Ziele wurden
im Kontext klar benannt und leiten die Priorisierung der Anforderungen.

# Personas

Im Folgenden die **Haupt-Personas** des Systems, inklusive ihrer Ziele, Aufgaben und Pain Points, wie aus
dem Kontext abgeleitet und mit Best Practices ergänzt:

# Außendienstmitarbeiter (ADM) – Vertrieb im Außendienst

**Rolle & Verantwortlichkeiten:** Der Außendienstmitarbeiter ist für die **Akquise und Beratung von Kunden**
vor Ort zuständig. Er besucht neue und bestehende Kunden (Einzelhändler, Filialisten etc.), führt
Beratungsgespräche und verfolgt Angebote bis zum Abschluss. Er ist die **zentrale Schlüsselpersona** , die
das CRM am intensivsten nutzen wird, da er die meisten Kundendaten zuerst erfasst und initiiert
.

# Umgebung & Arbeitsweise: Der ADM ist viel unterwegs (im Auto) und häufig beim Kunden. Er hat zwar

# aufbereitet – ein umständlicher Prozess

# Ziele: - Umsatz abschließen: Mehr Verkaufsabschlüsse generieren durch gute Beratung und zeitnahes

# Pain Points: - Medienbrüche & Nacharbeit: Er muss Notizen vom Papier erst später ins System

| 34  |     |     | 35  |
| --- | --- | --- | --- |
|     | 11  |     | .   |

(Adoptionsrisiko: CRMs werden oft schlecht angenommen, wenn sie als bürokratische Last empfunden
werden
.)

# Erfolgsmetriken: Anzahl und Wert gewonnener Projekte (Aufträge), Konversionsrate Angebote zu Auftrag,

**Relevante Best Practices:** - **Mobile CRM mit Offline-Modus:** Für Außendienstler gilt als Best Practice der
Einsatz einer **mobilen CRM-App** , die auch offline funktioniert
. Dies erlaubt dem ADM, unterwegs
Kundendaten einzusehen und neue Infos sofort (ggf. offline) einzutragen, die bei nächster Verbindung
synchronisieren. Studien zeigen, dass 65% der Vertriebsmitarbeiter, die Mobile CRM nutzen, ihre
Verkaufsziele erreichen, verglichen mit nur 22% ohne mobile CRM
– mobile Zugriffsmöglichkeiten
steigern also deutlich die Produktivität und Verkaufschancen. - **Spracherfassung & Fotos:** Das CRM sollte
Eingaben per **Spracheingabe oder Diktat** unterstützen. Beispielsweise könnte der ADM nach dem Termin
eine Sprachnotiz aufnehmen und diese durch die App in Text umwandeln lassen. Auch das Anhängen von
**Fotos der handschriftlichen Notizen** sollte möglich sein
. Dadurch werden die im Termin
gewonnenen Informationen sofort festgehalten, ohne langen Tipaufwand. Moderne CRM-Apps bieten teils
solche Funktionen der Sprachmemos oder Scan-to-Text. - **Automatische Kontaktanreicherung:** Best
Practice im Vertrieb ist, Leads so schnell wie möglich mit allen relevanten Informationen anzureichern. Hier
kann das System helfen, indem es öffentlich verfügbare Firmendaten automatisiert sammelt (z.B.
Firmengröße, Branche, Website-Infos). Lösungen wie Nimble CRM bieten etwa **automatisches Kontakt-**
**Profiling** und Social-Media-Abgleich, um Vertriebsmitarbeitern manuelle Recherche abzunehmen
. In
unserem Kontext würde das bedeuten: Der ADM gibt z.B. nur den Firmennamen und Ansprechpartner ein,
das System füllt weitere Felder (Adresse, Hintergrundinfos) soweit möglich automatisch – eine Aufgabe, die
bisher die Marketingassistenz per Internetrecherche erledigt
. - **Tourenplanung & Geodaten:**
Außendienst-Best-Practice ist die effiziente Routenplanung. Ein CRM kann z.B. Kunden auf einer Karte
darstellen und Touren optimieren. Auch das Protokollieren von Besuchszeiten lässt sich erleichtern (z.B.
Check-in/out per App). Das erleichtert dem ADM die Planung und liefert gleichzeitig Daten für
Spesenabrechnungen. - **Erinnerungsfunktionen & Aufgabenlisten:** Der ADM sollte automatisch
Erinnerungen erhalten, z.B. „in 1 Woche bei Kunde X nachfassen“ oder „Anruf wegen Angebot Y steht aus“.
Durch CRM-gestütztes _Task-Management_ werden Folgeaktivitäten klar und für ihn priorisiert sichtbar
. Das verhindert, dass Interessenten vergessen werden, und erhöht die Abschlussquote. - **360°**
**Kundensicht für Vertrieb:** Eine zentrale Empfehlung ist, dass der Vertriebsmitarbeiter _alle_ relevanten Infos
zu einem Kunden an einer Stelle sieht
. Dazu zählen Kontakt- und Firmendaten,
Gesprächsprotokolle, laufende und vergangene Projekte, Angebote sowie ggf. Service-Vorfälle. Diese
„Customer 360“ Sicht ermöglicht personalisierte Ansprache und zeigt dem ADM schnell, wo Potentiale
liegen oder welche Historie der Kunde hat
. Beispielsweise sollte er auf einen Blick sehen können,
welche Projekte der Kunde schon umgesetzt hat, welche Materialien dabei verwendet wurden (wichtig für
Folgegespräche)
, und ob es irgendwelche Reklamationen gab (um vorbereitet ins Gespräch zu
gehen). Eine solche umfassende Kundenhistorie fördert langfristig die Kundenbindung und Erfolg im
Vertrieb
.

# Innendienst (Vertriebsinnendienst & Kalkulation)

**Rolle & Verantwortlichkeiten:** Der Innendienst umfasst im Kontext mehrere Aufgabenbereiche: -
**Kalkulator(en):** Diese Mitarbeiter erstellen detaillierte **Kostenvoranschläge/Angebote** auf Basis der vom
Außendienst und Planer gelieferten Informationen. Sie brechen Material- und Leistungskosten detailliert

herunter und pflegen Preise. Im Interview werden sie oft als „Kalkulator“ oder Teil des Innendiensts
bezeichnet
. - **Vertriebsinnendienst:** Möglicherweise Personen, die den Außendienst administrativ
unterstützen, z.B. Termine koordinieren, Standarddokumente vorbereiten, Informationen nachhalten. -
**Projektkoordination:** Anscheinend übernimmt der Innendienst auch die **Auftragsabwicklung** nach
Auftragseingang: Bestellung bei Lieferanten, Terminierung der Montage, etc., oder unterstützt zumindest
dabei. (Im Interview war nicht explizit ein Projektmanager benannt – es liegt nahe, dass Innendienst diese
Rolle mit ausfüllt, ggf. zusammen mit dem Außendienst.)

# Im Zusammenspiel erhält der Innendienst nach einer gewonnenen Anfrage vom Außendienst und Planer

# Ziele: - Schnelle und präzise Angebote: Auf Basis der Planung soll der Innendienst dem Kunden ein

# Pain Points: - Datensilos & Übergabeverluste: Aktuell erhält der Innendienst die Infos oft per Ordner oder

# Erfolgsmetriken: Anteil der Angebote, die zu Auftrag werden (Hit-Rate), Durchlaufzeit vom Anfrageeingang

Lieferantenperformance (z.B. % Reklamationen pro Lieferant). Intern: Arbeitsaufkommen pro Mitarbeiter vs.
Anzahl Projekte (Effizienz).

**Relevante Best Practices:** - **Zentrales Opportunity-& Angebotsmodul:** Eine Best Practice ist, dass aus
jeder Verkaufschance (Opportunity) direkt ein Angebot im System erstellt wird, und bei Änderungen das
System unterstützt. So können z.B. Preislisten oder Kalkulationsvorlagen hinterlegt sein. Moderne CRMs mit
Projektfokus (wie Insightly, Zoho) erlauben es, eine **Opportunity in ein Projekt zu überführen**
– in
unserem Fall heißt das: Der Innendienst kann, sobald der Kunde zusagt, per Knopfdruck alle Daten
(Kundendaten, benötigte Leistungen/Materialien etc.) vom Vertriebsstatus ins aktive Projekt übertragen.
Das spart Zeit und eliminiert Übertragungsfehler. Best Practice hierbei: _Kopieren aller zugehörigen Details,_
_Aufgaben, Notizen von der Verkaufschance ins Projekt_
. - **Versionierung und Iterationsmanagement:** Das
System sollte _Angebotsversionen_ verwalten, sodass keine manuelle Suche nötig ist, was aktuell gilt. Best
Practice ist, Änderungen im Angebot klar nachzuverfolgen und ältere Stände historisch zu behalten
(Stichwort: Audit Trail). So kann der Innendienst jederzeit sagen, was gegenüber vorher geändert wurde –
das erhöht Professionalität und Transparenz gegenüber dem Kunden. - **Automatisierte Workflows:** Viele
Routineaufgaben des Innendiensts können durch CRM-Workflows unterstützt werden. Z.B. könnte bei
Statuswechsel "Auftrag erteilt" automatisch eine **Aufgabenliste** generiert werden: „Bestellung Material bei
Lieferant A auslösen“, „Montage-Team einplanen“, „16 Wochen vor Montage Abschlagsrechnung stellen“
etc. So eine Automatisierung stellt sicher, dass nichts vergessen wird und alle wissen, was zu tun ist. Gerade
im Zusammenspiel mit Buchhaltung: Das System kann z.B. die **Rechnungstermine** basierend auf dem
geplanten Montagezeitpunkt timen (im Interview genannt: 16 Wochen vorher, 4 Wochen vorher, Rest bei
Lieferung)
, und entsprechende Aufgaben/Aufträge an die Buchhaltung geben. - **Lieferanten- &**
**Qualitätsmanagement:** Eine Best Practice ist, im System auch **Lieferantendaten** zu pflegen und sie mit
Projekten zu verknüpfen (z.B. welcher Schreiner für welches Projekt beauftragt wurde). Dann lassen sich
Auswertungen fahren: welcher Lieferant hatte wie viele Aufträge, wie oft gab es Probleme. Wie im Interview
diskutiert, könnte der Innendienst so feststellen, ob z.B. **Reklamationen gehäuft bei einem bestimmten**
**Lieferanten** auftreten
. Das System sollte daher die Möglichkeit bieten, Reklamationen als Vorfall zu
erfassen und dem entsprechenden Lieferanten/Projekt zuzuordnen. Best Practice im Qualitätsmanagement
ist, solche Daten zu sammeln, um fundierte Entscheidungen (Lieferant wechseln, Zusatzkontrollen
einführen) zu treffen. - **Echtzeit-Status und Kollaboration:** Für den Innendienst ist es ideal, wenn alle
Beteiligten (Vertrieb, Planung, etc.) in Echtzeit in einem System arbeiten. Wenn der Planer z.B. einen
Entwurf fertigstellt, kann er im Projekt den Status ändern oder Datei hochladen – der Innendienst sieht es
sofort und kann kalkulieren, ohne auf ein Meeting oder E-Mail warten zu müssen. **Team-**
**Kommunikationstools** innerhalb des Systems (Kommentare, @Mention) helfen, Rückfragen transparent zu
stellen, statt persönlicher Zuruf. Das erhöht die Effizienz und alle sehen den Projektstatus auf einen Blick
. -
**Aufwands- und Kapazitätsplanung:** Eine weitere Best Practice (für Innendienst/
Projektkoordinator) ist, Projekte in Hinblick auf Ressourcen planen zu können. Das heißt, im System sollte
erkennbar sein, wie ausgelastet Planer und ggf. Montageteams sind
. So kann der Innendienst bei
vielen gleichzeitigen Projekten den Überblick behalten und Überlast vermeiden. Dies kann durch einfache
Ansicht passieren, wer an welchem Projekt beteiligt ist und welche Deadlines anstehen. - **Standardisierte**
**Angebotspräsentation:** Da der Innendienst Angebote erstellt, sollte das System dabei helfen, diese auch
**ansprechend zu präsentieren** . Momentan übernimmt das die Grafikabteilung in einer separaten
Präsentation
. Best Practice könnte sein, das CRM generiert zumindest ein gut formatiertes PDF-
Angebot mit Logo etc., sodass einfache Fälle ohne separate Gestaltung auskommen. Die Zusammenarbeit
mit Grafik ließe sich so auf besondere Fälle beschränken.

# Planer / Planungsabteilung

**Rolle & Verantwortlichkeiten:** Die Planungsabteilung (Planer/Planerin) erstellt das **raumplanerische**
**Konzept** für das Ladenbau-Projekt. Basierend auf den vom Vertrieb erhaltenen Informationen (Laden-
Größe, Kundenwünsche, ggf. vorhandene Grundrisse und Fotos) entwickelt der Planer ein **Design- und**
**Einrichtungskonzept** . Das umfasst Grundrisszeichnungen, Visualisierungen und Materialauswahl. Die
Planer arbeiten eng mit dem Vertrieb zusammen: nach der Übergabe der Kundenanforderungen findet ein
internes Meeting statt, in dem ADM und Planer alle Informationen durchgehen, um sicherzustellen, dass
nichts übersehen wurde
. Der Planer übernimmt dann und erstellt einen ersten Planungsentwurf.
Gegen Ende eines Tages melden Planer dem Vertrieb den Fortschritt (aktuell oft per E-Mail/Chat mit
Screenshot)
. Sobald Planung und Kalkulation stehen, werden diese dem Kunden präsentiert; bei
Änderungen durchläuft der Planer die Iterationsschleife und passt den Entwurf an
. Nach
Auftragsvergabe geht der Planer in die **Werkplanung** (Detailplanung für Fertigung/Montage) und finalisiert

# gemeinsam mit dem Kunden das Ausführungsdesign

# Ziele: - Kreative, kundengerechte Planung: Ein Ladenbau-Projekt soll funktional und ästhetisch

# Pain Points: - Infoverlust bei Übergabe: Aktuell bekommt der Planer die Informationen vom ADM teils

**Erfolgsmetriken:** Anzahl erfolgreich abgeschlossener Projekte, Kundenzufriedenheit mit Design,
durchschnittliche Iterationsrunden bis Freigabe, Einhaltung geplanter Design-Fertigstellungs-Termine.
Intern auch Arbeitsauslastung vs. Kapazität.

**Relevante Best Practices:** - **Zentrale Projektdatenbank:** Der Planer sollte im CRM/PM-System sofort auf
alle **kunden- und projektbezogenen Informationen** zugreifen können
. Dazu gehört eine klare
Projektakte mit Grunddaten (Größe des Ladens, Branche/verkaufte Waren, gewünschter Stil,
Budgetrahmen, Fotos, Grundrissdateien). Best Practice ist, dass der Vertrieb diese Infos strukturiert im
System erfasst und ggf. Dateien hochlädt, statt sie informell zu übergeben. So hat der Planer eine
verlässliche Informationsquelle. - **Datei- und Versionsmanagement:** Das System sollte ermöglichen,
**Planungsdateien**
(Zeichnungen, Renderings) beim Projekt abzulegen. Optimalerweise mit
**Versionskontrolle** oder zumindest Upload-Historie, damit immer klar ist, welches die aktuelle Zeichnung
ist. Manche PM-Tools bieten Integrationen zu CAD oder zumindest einen Viewer. Einfache Lösung: der
Planer lädt z.B. PDFs oder Bilder der Pläne in das Projekt, damit der Vertrieb (und ggf. Kunde, falls geteilt)
diese einsehen kann. - **Aufgabenverwaltung für Änderungswünsche:** Wenn der Kunde Änderungen will,
sollte das systematisch erfasst werden. Best Practice wäre z.B. ein **Change-Request** -Feature: Der Vertrieb
oder Planer legt einen Änderungseintrag an („Regal A in anderer Farbe“), sodass klar ist, was beschlossen
wurde. So kann nichts vergessen werden und es ist dokumentiert, auch für spätere Projekte (Lerneffekt). -
**Ressourcenplanung:** Für das Planer-Team empfiehlt sich ein **Kapazitätskalender** . Best Practice in
Projektmanagement-Tools ist, dass Projekte einen Zeitplan/Milestones haben und Ressourcen (Planer)
zugewiesen sind. Das System könnte z.B. zeigen: Planer Alice hat Projekt X (Deadline in 2 Wochen) und
Projekt Y (Deadline in 6 Wochen). So sieht die Abteilungsleitung oder der Planer selbst seine Pipeline. Sollte
ein neuer Auftrag reinkommen, sieht man, wer noch Kapazität hat. - **Wissensmanagement:** Die Idee der
**Projektfilter nach Planer** wurde erwähnt
. Best Practice hierfür: im System sind Projekte mit
verantwortlichem Planer markiert, sodass man auswerten kann, wer was gemacht hat. Das erleichtert
Austausch von Best Practices im Team (Planer können sich gezielt zu ähnlichen Projekten austauschen) und
ermöglicht der Geschäftsführung Auswertungen (z.B. _Produktivität pro Planer_ – wie viel Volumen hat ein
Planer geplant
). - **Integration mit Kalkulation:** Planer und Kalkulator sollten eng im System
verzahnt arbeiten. Z.B. könnte der Planer Materiallisten erzeugen, die der Kalkulator direkt im System
weiterverarbeitet. Ein Best Practice-Ansatz ist hier das Konzept von **Stücklisten** : Wenn der Planer z.B. im
System eine Liste der benötigten Möbel/Konstruktionen erfasst (ggf. aus seinem CAD-Tool importiert), kann
der Innendienst darauf basierend Angebote von Lieferanten einholen oder Preise kalkulieren. So erspart
man Doppelerfassung der gleichen Informationen in Planung und Kalkulation. - **Visuelle Projektübersicht:**
Da Planer visuell arbeiten, ist es hilfreich, wenn das PM-Tool visuelle Planungsübersichten bietet – z.B. ein
Kanban-Board der Projekte oder Timeline-Übersichten. Tools wie Monday.com bieten projektübergreifende
Timeline/Gantt-Ansichten, die Planern helfen, **Abgabetermine** im Auge zu behalten und Prioritäten zu
setzen
.

# Buchhaltung

**Rolle & Verantwortlichkeiten:** Die Buchhaltung (Buchhalterin) ist zuständig für die **Fakturierung und**
**Zahlungsüberwachung** der Projekte. Im beschriebenen Prozess erstellt sie **Abschlagsrechnungen und**
**Schlussrechnungen** zu definierten Zeitpunkten und überwacht den **Zahlungseingang**
. Konkret im
Ladenbau werden Zahlungen typischerweise in _drei Raten_ aufgeteilt: ein Teil weit vor Lieferung, ein Teil kurz
vor Montage, und der Rest bei Abschluss
. Die Buchhaltung muss diese Rechnungen rechtzeitig
stellen und ggf. das Mahnwesen übernehmen, falls Zahlungen ausbleiben
. Außerdem ist sie für die
**Einhaltung von GoBD** zuständig – also ordnungsgemäße Archivierung der Belege und Dokumentation.

**Ziele:** - **Rechtzeitige Rechnungsstellung:** Sicherstellen, dass alle vereinbarten Abschläge und
Schlusszahlungen **termingerecht in Rechnung gestellt** werden, um den Cashflow des Unternehmens zu
sichern. Sie möchte automatische Hinweise, wann welche Rechnung fällig ist (um nicht vom Vertrieb
manuell erinnert werden zu müssen)
. - **Minimierung offener Posten:** Ziel ist, dass Kunden
fristgerecht zahlen. Dazu überwacht sie Zahlungen und informiert Vertrieb/Projektteam bei Verzug, um
nachfassen zu können
. - **Saubere Dokumentation & Audit-Sicherheit:** Alle Rechnungen und
Zahlungen müssen lückenlos dokumentiert und bei Prüfungen leicht auffindbar sein. Die Buchhaltung will
sicherstellen, dass das System die **Unveränderbarkeit** von buchungsrelevanten Daten gewährleistet
(z.B. keine nachträgliche Manipulation von Rechnungen ohne Protokoll). -
**Entlastung von**
**Routinekommunikation:** Im bisherigen Prozess muss oft der Vertrieb der Buchhaltung sagen, wann eine
Rechnung raus soll, oder umgekehrt informiert die Buchhaltung Vertrieb über Zahlungseingänge
.
Das Ziel ist, diese Informationsflüsse zu **automatisieren und standardisieren** , damit nichts „vergessen in
der mündlichen Absprache“ bleibt.

# Pain Points: - Intransparenz der Projekttermine: Ohne System muss die Buchhaltung manuell oder via

# Erfolgsmetriken: Durchschnittliche Zeit zwischen Leistungsdatum und Rechnungsstellung (soll kurz sein),

**Relevante Best Practices:** - **Automatische Rechnungsterminierung:** Das CRM/PM-System sollte die
**Rechnungsintervalle pro Projekt hinterlegen** . Best Practice ist, schon bei Projektanlage festzulegen: z.B.
30% bei Auftrag, 50% 4 Wochen vor Lieferung, 20% nach Fertigstellung (anpassbar je nach Vertrag). Daraus
kann das System automatisch Aufgaben/Erinnerungen für die Buchhaltung generieren, inkl. aller nötigen
Details. So wird der Prozess konsistent und weniger fehleranfällig
. - **Integration oder Schnittstelle**
**zur FIBU:** Ideal ist eine **Integration mit dem Buchhaltungssystem** . D.h. die im CRM erzeugten
Rechnungsdaten werden direkt ins Buchhaltungsprogramm übertragen oder das CRM ist selbst in der
Lage, Rechnungen mit fortlaufender Nummer zu erzeugen. Viele CRM/ERP-Lösungen (z.B. WeClapp, Odoo)
sind GoBD-konform und erlauben das Erstellen von Rechnungen nach den Regeln (inkl. unveränderbarer
Archivierung)
. Falls das CRM kein eigenes Rechnungsmodul hat, sollte zumindest eine saubere
_Schnittstelle_ existieren, um Doppelerfassung zu vermeiden. - **Zahlungseingangs-Tracking:** Best Practice ist,
dass der Zahlungsstatus im System sichtbar ist – entweder durch automatische Rückmeldung aus der
Buchhaltung oder händisch gepflegt. So kann z.B. der Vertrieb in der Projektübersicht sehen „Abschlag 1:
bezahlt am…, Abschlag 2: offen (7 Tage überfällig)“ und entsprechend agieren
. Das erhöht die
Transparenz und Team kann gemeinsam an schneller Begleichung arbeiten. - **Revisionssicherheit & Audit**
**Trail:** Für GoBD muss das System **Änderungen protokollieren** (z.B. wenn ein Rechnungsdatum angepasst

# 10

---

_Page 11_

---

wird oder Beträge geändert werden, muss das nachvollziehbar sein)
. Außerdem sollten wichtige
Dokumente (Angebote, Auftragsbestätigungen, Rechnungen) im System versioniert und gegen Löschung
geschützt abgelegt sein (z.B. durch Schreibschutz nach Freigabe). Ein PDF-Export ins Archiv sollte
unveränderbar sein. Best Practice: _digitale Signaturen_ oder Hashwerte können die Unversehrtheit von
archivierten PDFs garantieren. - **Berechtigungskonzept:** Sensible Finanzdaten sollten nur von Berechtigten
einsehbar sein. Best Practice ist ein **rollenbasiertes Berechtigungssystem**
: Buchhaltung sieht
Zahlungskonditionen, Summen etc., während z.B. nicht jeder Nutzer Gehälter oder Margen einsehen kann
(falls solche im System wären). Im Kontext geht es eher um Projektbeträge, die dürften dem Vertrieb und
GF auch bekannt sein; aber evtl. interne Kalkulationsdetails könnten geschützt sein. - **Automatisiertes**
**Mahnwesen:** Das System könnte Regeln haben: wenn Zahlung X Tage überfällig, Erinnerung/
Mahnschreiben generieren. Das entlastet die Buchhaltung. Zumindest eine Erinnerung an den zuständigen
Vertriebler („Zahlung Kunde Y 1 Woche drüber – bitte anrufen“) wäre Best Practice, damit kein Fall
durchrutscht.

# Geschäftsführer

**Rolle & Verantwortlichkeiten:** Der Geschäftsführer hat die Gesamtverantwortung und interessiert sich
besonders für **strategische Kennzahlen und Prognosen** . Er ist kein operativer Hauptnutzer, aber ein
wichtiger Stakeholder für das System, weil es ihm **Echtzeit-Einblick in Vertriebspipeline und**
**Projektlaufzeiten** geben soll. Laut Kontext möchte er verschiedene Analysen: z.B. wie viele Angebote vs.
Aufträge, Umsatz pro Quartal, Auslastung der Ressourcen, Forecast kommende Monate
. Er wird
immer mal in Vertriebs- oder Projektmeetings einbezogen, etwa bei wichtigen Kundenentscheidungen
. Seine Perspektive ist übergreifend: sowohl Vertriebsperformance als auch Projektumsetzung
(Termintreue, Umsatzrealisierung) sind für ihn relevant.

# Ziele: - Pipeline-Transparenz: Der GF will wissen, was an Geschäft in der Pipeline ist , mit

# Pain Points: - Datensammlung dauert: Bisher muss er sich Zahlen von verschiedenen Personen/Listen

| 99  |     | 100 |     |
| --- | --- | --- | --- |
| st) | 101 |     | ,   |

wenn z.B. die Planungsabteilung überlastet ist oder wenn sich Projektabschlüsse stauen. Ohne Einblick
riskiert er, Engpässe zu spät zu bemerken. - **Reporting-Aufwand:** Monatliche Reports erstellen (z.B. für
Gesellschafter) erfordert manuelle Arbeit aus vielen Quellen. Das ist fehleranfällig und aufwendig.

**Erfolgsmetriken:** Er erhält letztlich alle o.g. Zahlen konsolidiert: Auftragswert Pipeline, Win/Loss Rate,
Umsatzrealisierung vs. Plan, Termintreue Projekte, Kundenzufriedenheit (wenn gemessen),
Ressourceneffizienz. Sein Erfolg misst sich an der Gesamtperformance der Firma – das System soll ihm
dafür **verlässliche Daten** liefern.

**Relevante Best Practices:** - **Dashboard für Geschäftsführung:** Best Practice ist ein **Management-**
**Dashboard** , das auf einen Blick die wichtigsten KPI zeigt. Das könnten Grafiken sein: z.B. Sales Funnel
(Anzahl Leads, Angebote, Abschlüsse), Umsatz nach Quartal, Top 5 Kunden, Auslastungsgrad der Planung,
etc. Viele CRM bieten out-of-box Dashboards; diese sollten wir auf die GF-Bedürfnisse zuschneiden. So hat
der GF jederzeit den „Gesamtüberblick“
, den er fordert. - **Opportunity-Scoring & Forecast:** Der GF
profitiert von **systematischem Opportunity-Management** . Best Practice: Jede Verkaufschance erhält eine
**Wahrscheinlichkeit** (ggf. automatisch je nach Phase) und ein voraussichtliches Abschlussdatum. Das
System kann daraus einen **Weighted Forecast** berechnen (z.B. Pipeline für Q4: 200k€ mit 70%
Wahrscheinlichkeit = 140k€ erwartet)
. Solche Prognosen sind in modernen CRMs Standard und
geben dem GF eine quantifizierte Aussicht statt vager Annahmen. - **Auswertungen über Zeiträume:** Der
GF möchte insbesondere **zeitbezogene Analysen** : Umsatz nach Monaten, Vergleich Vorjahr, etc. Das
System soll daher ermöglicht, Projekte und Angebote zeitlich auszuwerten (nach Erstelldatum, Lieferdatum
usw.). Ein Best Practice ist hier die Verwendung von **Zeitfiltern und Trendcharts** . Beispielsweise eine
Pipeline-Kurve, die zeigt, wie sich der erwartete Auftragsbestand in nächsten 12 Monaten entwickelt,
basierend auf laufenden Projekten und Wahrscheinlichkeiten
. - **Projektportfolio-Übersicht:** Neben
Vertrieb will GF das **Projektportfolio** im Blick: Welche Projekte laufen, in welcher Phase sind sie, gibt es
Risiken (z.B. Verzug, Budgetüberschreitung)? Ein Kanban- oder Ampelstatus-Board aller aktiven Projekte
wäre hilfreich. Best Practice im PM-Portfolio-Management: ein **Statusreport je Projekt** (Ampel für Zeit/
Kosten/Qualität). Eventuell kann das System den GF warnen bei Projekten im kritischen Zustand. -
**Profitabilitätsanalyse:** Das System könnte Best-Practice-Reports liefern wie _Projekt-Nachkalkulationen_ :
Geplanter vs. tatsächlicher Aufwand/Kosten. Falls das integriert ist, sieht GF welche Projekttypen profitabler
sind. - **Zugriff auf Details:** Zwar sieht GF primär aggregierte Daten, aber Best Practice ist, dass er bei
Bedarf **ins Detail „durchklicken“** kann. Etwa vom Umsatzchart ins konkrete Projekt, um Infos zu sehen
(z.B. wer war Planer, was war Budget). Damit kann er sich adhoc informieren, falls Fragen von
Gesellschaftern oder Kunden kommen. - **Erfolgsgeschichten & Referenzen:** GF und Marketing möchten
erfolgreiche Projekte dokumentieren. Das System sollte daher ermöglichen, ein Projekt nach Abschluss als
„Referenz“ zu markieren und relevante Daten einfach zu extrahieren (Branche, Fläche, besondere
Merkmale). So kann Marketing daraus einen Case bauen. Best Practice: Felder wie „Projektfotos“ und
„Kurzbeschreibung“ im Projekt, die Marketing dann wiederverwenden kann. Tatsächlich wurde erwähnt,
dass Marketing **Erfolgsgeschichten** erstellt, sobald ein Projekt fertig ist
. Diese Info liesse sich mit
dem CRM unterstützen, indem alle Daten & Bilder zentral verfügbar sind.

# Marketing/Grafik

**Rolle & Verantwortlichkeiten:** Diese Persona kümmert sich zum einen um **Marketingunterlagen und**
**Erfolgsgeschichten** , zum anderen erfüllt sie im jetzigen Prozess eine Assistenzfunktion beim
_Kundenkontakt-Protokoll_ . Konkret: - Bei _neuen Leads_ erstellt Marketing aus den vom ADM gelieferten Infos
ein **Kundenkontaktprotokoll** in Word
. Dazu recherchiert sie weitere Infos (z.B. von der Website des

# 12

Kunden) und pflegt eine Liste aller Anfragen. Danach schickt sie das Dokument an den ADM und dieser legt
es manuell in seinem Ordner ab
. - Weiterhin erstellt die Grafikabteilung (als Teil Marketing)
**Projekt-Präsentationen** für die Angebotspräsentation an Kunden
. Sie bereitet also Layout, Bilder,
Texte ansprechend auf (oft gedruckt und gebunden mitgenommen zum Kundentermin). - Nach
Projektabschluss generiert Marketing **Erfolgsgeschichten** (Case Studies) für eigene Marketingzwecke, d.h.
sie dokumentieren das Projekt mit Bildern und Text, um es auf der Website oder Broschüren als Referenz zu
nutzen
.

# Ziele: - Effiziente Lead-Dokumentation: Marketing will, dass neue Leads rasch und vollständig im System

# Pain Points: - Hoher manueller Aufwand für Lead-Doku: Das Word-Kundenprotokoll und die doppelte

# Erfolgsmetriken: Anzahl generierter Leads (und deren Qualität), Zeit vom Lead bis zur Erfassung, Qualität

**Relevante Best Practices:** - **Lead-Management im CRM:** Die manuelle Word-Erstellung soll entfallen. Best
Practice: Der ADM erfasst den Lead direkt im CRM mit allen relevanten Feldern (Ansprechpartner, Branche,
Quelle etc.). Marketing kann dann diese Daten prüfen und anreichern, aber eben **im System selbst** . Eine
**automatische Anreicherung** (siehe Außendienst Best Practices) kann Marketing die Web-Recherche

abnehmen
. Außerdem hat man damit eine _Echtzeit-Leads-Liste_ im CRM – Marketing sieht jederzeit den
Stand aller Anfragen, ohne manuell Listen führen zu müssen. - **Kategorisierung & Segmentierung:** Das
System sollte erlauben, jedem Kontakt/Unternehmen **Kategorien** zu geben (Branche, Region,
Verbandsmitgliedschaften usw.). Best Practice ist, diese Daten dann für Marketingaktionen filtern zu
können (z.B. alle Mode-Einzelhändler in Bayern). Diese Segmentierungsmöglichkeit ist in CRM-Tools
Standard und für Marketing wertvoll. - **Templates & Branding:** Für Angebotspräsentationen könnte das
System oder angeschlossene Tools **Templates** bereitstellen, sodass der Außendienst direkt aus dem CRM
einen automatisch befüllten Bericht erzeugen kann. Einige CRM haben Reporting-Engines, wo man
definierte Vorlagen (mit Logo, Farben) nutzt. Alternativ lässt sich eine _Content-Bibliothek_ integrieren:
Marketing stellt aktuelle Logos, Design-Elemente im System bereit, und Vertrieb kann sich bedienen. Best
Practice: Minimierung manueller Layout-Arbeit durch Automatisierung, damit Marketing nur noch das
Feintuning oder spezielle Projekte machen muss. - **Erfolgsmessung Leads:** Marketing kann CRM-Daten
nutzen, um z.B. zu sehen, welche Kampagnen oder Quellen Leads generieren und wie erfolgreich diese
konvertieren. Wenn z.B. ein Lead über eine Messe kam, kann man im CRM vermerken und später
auswerten, ob Messe-Leads häufiger zu Aufträgen werden. Dies hilft dem Marketingbudget gezielt
einzusetzen. - **Referenzprojekte kennzeichnen:** Im System sollten Felder vorhanden sein wie
"Referenzstory erstellt (Ja/Nein)" oder "Zufriedenheit/Erfolg". Best Practice: nach Projektabschluss fragt
man evtl. den Kunden nach einem Statement. Diese Info kann im CRM gespeichert werden. Marketing hat
dann eine **Pipeline an Success Stories** . Zudem kann man später filtern "zeige alle Projekte im Bereich
<Branche> mit Fotos vorhanden" – ideal für die nächste Broschüre. - **Zugriff auf Medien:** Möglicherweise
will Marketing auf Projektbilder zugreifen können. Ein integriertes **Medien-Management** (oder
Verknüpfung zu DAM-System) wäre nützlich. Dann können Fotos/Videos, die evtl. beim Projekt gemacht
wurden (z.B. vom fertig eingerichteten Laden), direkt im CRM abgelegt sein und Marketing kann sie
weiterverwenden.

# Zusammenfassung: Jede Persona bringt spezifische Anforderungen ein, die das System bedienen muss.

# Fachliche Domänen

Die Analyse hat mehrere **fachliche Domänen** identifiziert, die von der Lösung abgedeckt werden müssen.
Eine Domäne entspricht dabei einem thematisch abgegrenzten Funktionsbereich des Tools, inkl. der
Hauptobjekte (Datenentitäten) und ihrer Beziehungen, sowie der Schnittstellen zu anderen Domänen. Für
jede Domäne werden typische Best Practices genannt und potenzielle Stolpersteine aus fachlicher Sicht.

# 1. Kontakt- & Kundenverwaltung (CRM-Basis)

**Beschreibung:** Diese Domäne umfasst die **Verwaltung aller Kontakte** des Unternehmens – Kunden
(Unternehmen und Ansprechpartner), Leads, Lieferanten, Partner und Verbände. Hier werden Stammdaten
geführt (Namen, Adressen, Kontaktinformationen, Kategorien) sowie Relationen zwischen Kontakten (z.B.

_Kunde X gehört zu Konzern Y_ , _Lieferant Z beliefert Kunde X_ oder _Kontakt A ist Mitglied im Verband B_ ). Ebenfalls
beinhaltet sind Aktivitäten auf Kontaktebene: Gesprächsnotizen, Anrufe, E-Mails, Aufgaben, die einem
Kontakt zugeordnet sind. Diese Domäne ist quasi das Herz des CRM-Teils: Sie liefert die 360°-Sicht auf jeden
Kunden für alle Nutzer.

**Hauptobjekte/Begriffe:** - _Kundenkonto_ (Account): repräsentiert ein Kundenunternehmen oder -filiale.
Attribute: Name, Adresse, Branche, Unternehmensgröße, Verbandsmitgliedschaften, ggf. Kundentyp (Neu-/
Bestandskunde). - _Kontaktperson_ : individueller Ansprechpartner, verknüpft mit einem Account (z.B.
Geschäftsführer des Ladenbesitzers). Attribute: Name, Position, Telefon, E-Mail, etc. - _Lead_ : ein potentieller
Kunde (Account oder Person) in der Akquise-Phase, der noch qualifiziert wird. - _Lieferant/Partner_ : analog
Kunden als Firma mit Ansprechpartnern, jedoch mit Rolle “Lieferant”. Mögliche spezielle Felder: Gewerke/
Leistungen die dieser liefert. - _Verband/Netzwerk_ : Eine Organisation, die Kunden verbindet. Könnte als
eigener Typ geführt werden. Beziehungen: Account X ist Mitglied in Verband Y (n:m Beziehung). - _Aktivität_ :
z.B. ein Besuchsbericht, Telefonat, E-Mail, Meeting – mit Datum, Notizen, und Verknüpfung zu beteiligten
Kontakten. - _Datei/Anhang_ : Dokumente auf Kontaktebene (z.B. Verträge, Briefe).

**Schnittstellen/Abhängigkeiten:** - Enge Verbindung zur _Vertriebs-Domäne_ : Aus Kontakten werden
Opportunities generiert, Leads werden in Kunden umgewandelt. - Verknüpfung zur _Projekt-Domäne_ : Ein
Projekt hat einen oder mehrere Kundenkontakte verknüpft (Auftraggeber, Bauherr etc.). Ebenso werden
Lieferanten aus der Kontaktverwaltung einem Projekt als Ausführende zugewiesen. - _Marketing_ : greift auf
Segmentierung der Kontakte zu, z.B. Export aller Kontakte einer Branche. - _Compliance_ : DSGVO-
Anforderungen sind hier zentral (Datenspeicherung, Einwilligungen). Auch GoBD falls z.B. Geschäftsbriefe
hinterlegt. - Integrationen: evtl. Anbindung an E-Mail/Calendar, damit Kommunikation automatisch als
Aktivitäten erfasst wird.

**Best Practices & Stolpersteine:** - **360°-Kundenprofil:** Wie erwähnt, Best Practice ist, an einem
Kundendatensatz alle relevanten Infos zu bündeln
. Das umfasst Vertriebschancen, Projekte,
Rechnungen, Supportfälle etc. Dies erhöht die Servicequalität, da jeder Mitarbeiter mit einem Blick die
Historie sieht. Stolperstein: Daten müssen konsequent gepflegt werden, sonst ist das Profil unvollständig.
Schulung und ggf. Automatismen (E-Mail-Logging etc.) sind nötig. - **Dubletten vermeiden:** In der
Kontaktverwaltung ist **Dublettenmanagement** kritisch – Best Practice: das System erkennt, wenn ein
neuer Kontakt eingegeben wird, der einem bestehenden ähnelt, und warnt bzw. ermöglicht Merge. Sonst
könnten z.B. dieselbe Firma leicht doppelt angelegt werden (eine unter GmbH, eine unter
ausgeschriebenem Namen). Das würde die 360°-Sicht stören. - **Kategorisierung & Tagging:** Best Practice
ist, Kontakte nach sinnvollen Kriterien zu taggen (Branche, Region, Status etc.). Dies erlaubt zielgenaue
Filter. Stolperstein: zu viele oder unscharfe Kategorien führen zu Chaos. Es sollte also ein klar definiertes
_Datenmodell_ geben (z.B. Branchenschlüssel). - **Relationen abbilden:** In vielen CRM wird die Hierarchie
_Firma–Kontakt_ abgebildet sowie ggf. Firma–Muttergesellschaft. Bei uns kommen noch Verbände oder
Netzwerke hinzu. Man sollte Best Practice folgend flexible Beziehungstypen erlauben (z.B. “gehört zu”,
“Mitglied von”), um das **Netzwerk sichtbar** zu machen
. Das hilft später im Marketing und Vertrieb
(z.B. wenn man weiß, zwei Kunden sind im selben Verband, kann man das im Gespräch nutzen). - **Lead-**
**Konvertierung:** Ein Lead sollte im System in einen Account/Kontakt umgewandelt werden können, sobald
qualifiziert. Best Practice: dabei sollen keine Daten verloren gehen. Beispiel: Das Word-Leadprofil wird
obsolet, stattdessen füllt der ADM ein Lead-Formular im System aus; wenn daraus ein echtes Projekt wird,
konvertiert er es zu einem Kundenkonto und Opportunity, die Historie (z.B. “Kaltakquise Messe 2025”) bleibt
erhalten. - **Datenqualität & Aktualisierung:** CRM-Daten “leben”. Best Practice ist, Mechanismen zur **Pflege**
vorzusehen – z.B. Erinnerung alle X Monate, einen wichtigen Kontakt zu aktualisieren (noch richtige

# 15

Telefonnummer?). Oder Integrationen zu Firmenregister-APIs, um Adressen automatisch zu aktualisieren.
Hauptstolperstein ist veraltete Daten; das mindert den Nutzen enorm. - **Datenschutz:** Kontaktverwaltung
ist DSGVO-Kernzone. Das System muss Einwilligungen verwalten (z.B. ob ein Kontakt Newsletter erhalten
darf) und **Löschkonzepte** haben (Recht auf Vergessenwerden)
. Stolperstein: Ein Kontakt hängt an
vielen Projekten = Buchhaltungspflicht -> dann darf er nicht komplett gelöscht werden, sondern muss
pseudonymisiert werden. Hier muss fachlich entschieden werden, wie mit solchen Fällen umzugehen ist,
damit Datenschutz und GoBD gleichermaßen gewahrt bleiben. - **Zugriffsrechte:** Nicht jeder Nutzer sollte
jeden Kontakt sehen dürfen (z.B. Lieferantendaten könnten teilweise vertraulich sein). Aber in unserem
mittelständischen Kontext vermutlich offene Datenhaltung außer vllt. Personalinfos. Dennoch Best Practice:
_Role-Based Access Control_ auf Kontakte, um im Zweifel einschränken zu können (z.B. Marketing darf
Lieferanten-Bankdaten nicht ändern). Ohne zu granular zu werden – Stolperstein hier ist
Überadministration, was unnötig Komplexität bringt. - **Integration E-Mail/Telefon:** Um Aktivitäten
lückenlos zu erfassen, koppelt man idealerweise E-Mail-Server (so werden E-Mails an einen Kunden
automatisch zum Kontakt gespeichert) und evtl. Telefondienste (Call-Logging). Das kann immens helfen
(Vertrieb hat Gesprächsverlauf, Support sieht E-Mails etc.). Stolperstein: Datenschutz bei automatischem E-
Mail-Logging (privat vs. geschäftlich trennen), sowie technischer Aufwand. Fachlich sollte geklärt werden,
welche Kommunikation wie aufgezeichnet werden soll.

# 2. Vertriebs- & Opportunity-Management

**Beschreibung:** Diese Domäne deckt den **Vertriebsprozess von der ersten Anfrage bis zum Auftrag** ab.
Sie beinhaltet die Verwaltung von Verkaufschancen ( _Opportunities_ ), Angebotswesen und die Pipeline-
Übersicht. Hier werden Fragen beantwortet wie: Welche **Phase** hat ein Interessent erreicht? Welches
**Angebot** liegt vor und zu welchem Preis? Wie hoch ist die Abschlusswahrscheinlichkeit? Wer ist zuständig?
Der Prozess startet typischerweise mit einem Lead/Kontakt (siehe Domäne 1), der zum **Potential** wird.
Durch Beratung und Angebotserstellung entwickelt es sich zur Opportunity mit einem bestimmten Wert,
und endet entweder als _gewonnen_ (wird Projekt/Auftrag) oder _verloren_ (abgelehnt oder nicht genommen).

**Hauptobjekte/Begriffe:** - _Opportunity (Verkaufschance):_ Ein Datensatz, der einen möglichen Auftrag
repräsentiert. Attribute: Verknüpfter Kunde/Kontakt, Beschreibung (Projektname), aktuell angebotenes
Volumen (€), Phase (z.B. Qualifizierung, Angebot präsentiert, Verhandlung, Abschluss),
Abschlusswahrscheinlichkeit (%) und voraussichtliches Abschlussdatum. - _Angebot:_ Konkrete Offerte an den
Kunden. Kann als Teil der Opportunity geführt werden oder separate Entität. Enthält Positionsliste mit
Leistungen/Produkten und Preisen, Gesamtbetrag, Gültigkeitsdatum, Angebotsdokument (PDF). -
_Opportunity-Phase:_ Vordefinierte Stufen im Vertriebsprozess. Z.B.: Lead, Bedarf ermittelt, Angebot
abgegeben, Verhandlung, Verloren/Gewonnen. Jede Stufe kann eine Standard-Wahrscheinlichkeit haben
(z.B. “Angebot abgegeben” = 50%). - _Verkaufsaktivität:_ Aktivitäten speziell mit Fokus auf Sales, z.B. Nachfass-
Telefonat geplant am…, Demo durchgeführt etc., oft als Teil der Opportunity-Historie. - _Umsatzprognose:_
Aggregat, kein einzelnes Objekt, aber als Ergebnis aus allen Opportunities kalkuliert (für Pipeline-Reports). -
_Vertriebsziel:_ Möglicherweise definierte Soll-Zahlen (z.B. Quartalsziel Umsatz 500k), um Performance zu
messen. (Könnte optional als Referenzwert in Berichten hinterlegt sein.)

**Schnittstellen/Abhängigkeiten:** - Baut auf _Kontakt-Domäne_ auf (jeder Opportunity ist ein Kunde
zugeordnet). - Übergibt an _Projektmanagement-Domäne_ : Wenn Opportunity gewonnen, wird daraus ein
Projekt mit Planungs- und Ausführungsphasen. - Verknüpft mit _Buchhaltung_ : Preise aus Angeboten fließen
in Rechnungen; außerdem steuert Opportunity den Auftragsbestand (für Finanzforecast). - Feedback-
Schleife zu _Marketing_ : Gründe für verlorene Opportunities könnten festgehalten werden (z.B. “Budget zu

hoch”, “Konkurrenzangebot”) – wertvoll fürs Marketing. - Abhängigkeit von _Planung_ : Der Angebotsinhalt
(Leistungen) entsteht aus der Planungsarbeit. Es muss hier Schnittstellen geben, dass Planungs-Output ins
Angebot einfließt.

**Best Practices & typische Stolpersteine:** - **Sales-Funnel Definition:** Best Practice ist, klare **Opportunity-**
**Stages** zu definieren, die zum Vertriebsvorgehen passen (z.B. 5-6 Stufen vom initialem Kontakt bis
Abschluss)
. Das Team muss ein gemeinsames Verständnis haben, wann eine Chance welche Phase
erreicht – nur so sind Pipelinezahlen konsistent. Stolperstein: Zu komplexe oder zu viele Phasen verwirren;
zu wenige Phasen geben kein differenziertes Bild. Hier muss im Workshop mit Vertrieb eine passende Skala
erarbeitet werden. - **Abschlusswahrscheinlichkeit & Forecast:** In Verbindung mit Phasen wird oft eine %-
Chance hinterlegt. Best Practice: Das CRM berechnet den **gewichteten Umsatz** (Opportunity Wert *
Wahrscheinlichkeit) für Forecasts
. Fortgeschritten: dynamische Anpassung je nach Kundenfeedback
(aber meist manuell justiert). Stolperstein ist, dass Wahrscheinlichkeiten subjektiv sein können; daher am
besten Phase-gebunden definieren, um Subjektivität zu reduzieren (z.B. Angebot abgegeben = 50% per
default, außer Vertriebler passt an bei besonderen Infos). - **Opportunity = Projekt in spe:** Im Kontext
Ladenbau entspricht eine Opportunity im Grunde einem potenziellen Projekt (Ladenbau-Vorhaben). Best
Practice ist, so früh wie möglich alle relevanten Daten in der Opportunity zu sammeln, die für die spätere
Projektausführung nötig sein könnten. So gehen keine Infos verloren. Beispiel: der ADM notiert schon in
der Opportunity “Laden hat 100m², Umbau geplant für Q3 nächsten Jahres”. Wenn Auftrag kommt, hat das
Projekt diese Info bereits. **Nahtloser Übergang** ist das Ziel
. Stolperstein: Wenn Vertriebler nur
Minimalinfos pflegen und Rest offline notiert, geht Benefit verloren. - **Angebotsmanagement:** Es ist Best
Practice, Angebote *im System* zu erstellen oder zumindest zu verwalten (Angebotsnummer, -datum, Betrag).
Optimal: Das System generiert ein Angebotsdokument aus eingegebenen Positionen. So sind alle Angebote
nachvollziehbar und mit Opportunity verknüpft
. Bei Iterationen entweder aktualisieren (Version 2)
oder mehrere Angebote referenzieren (je nach Vorgehen, aber alle sollten im Datensatz sichtbar sein).
Stolperstein: Erfasst der Innendienst Angebote weiter extern (z.B. Excel), verliert man Tracking. Daher sollte
das System genug Flexibilität haben, auch komplexe Angebote abzubilden, sonst weicht man aus. - **Win/**
**Loss-Grund:** Best Practice ist, bei Abschluss einer Opportunity (gewonnen oder verloren) einen **Grund** zu
dokumentieren. Z.B. verloren wegen “Preis”, “Konkurrent XY”, “Bedarf verschoben”. Diese Auswertung kann
dem Vertrieb helfen, sich zu verbessern und dem GF strategische Infos liefern (z.B. 30% der Verluste wegen
Preis -> eventuell Kalkulation checken). Stolperstein: Vertriebler geben diese Gründe nicht gerne an (bei
verloren) oder sind nicht objektiv. Hier hilft eine Pflichtauswahl beim Schließen im System. - **Aktivitäten &**
**Reminder:** In der Opportunity sollten alle Aktivitäten protokolliert sein (Termine, Mails etc.). Best Practice:
Das System generiert Folgeaufgaben – z.B. *“Angebot vor 10 Tagen geschickt – jetzt automatisch Aufgabe:\*
_nachtelefonieren”_ . Solche CRM-Aufgaben erhöhen die Abschlussquote, weil nichts vergessen wird
.
Stolperstein ist, bei zu vielen automatischen Tasks kann es unübersichtlich werden, aber für kritische
Schritte (Nachfassen, Fristende Angebot) sind sie sinnvoll. - **Team-Verkauf & Berechtigungen:** Es könnte
sein, dass mehrere Vertriebler beteiligt sind (z.B. Key Account + ADM). System sollte mehrere Besitzer oder
Beteiligte zulassen. Berechtigungen: Evtl. will man Opportunities nur firmenweit sichtbar machen, oder pro
Vertriebsgebiet einschränken. In KMU meist offen, aber je nach Kultur. Best Practice in CRM: Transparenz
fördern, aber man kann filtern nach Zuständigkeit. - **Reporting & KPIs:** Die Vertriebsdomäne liefert
Kennzahlen wie _Pipeline-Wert_ , _Forecast_ , _Quote (Hit-Rate)_ , _Durchschnittliche Verkaufsdauer_ etc. Best Practice:
vordefinierte Berichte hierfür. Z.B. _Conversion Funnel: 100 Leads -> 10 Angebote -> 4 Aufträge (40% Hit-Rate)_ .
Das System sollte diese Berechnung ermöglichen. - **Überlapp mit Projektstart:** In unserem Kontext
werden oft schon Planungsleistungen erbracht, bevor der Auftrag 100% sicher ist (Vorleistung in Akquise).
Best Practice: Dies innerhalb der Opportunityphase belassen, bis unterschrieben ist. Stolperstein: Sonst
könnte es passieren, dass man ein Projekt anlegt vor Bestellung, und dann bei Nicht-Erteilung

# 17

rückabwickeln muss. Also klarer Cut definieren: “Gewonnen” erst, wenn Auftrag erteilt (schriftlich). Davor
bleibt es im Sales-Funnel. - **Integration E-Signature:** Könnte erwogen werden: Angebot per CRM senden
und digital unterschreiben lassen. Das würde die _Auftragserteilung_ beschleunigen und direkt
dokumentieren. Nicht zwingend, aber Best Practice in vielen modernisierten Vertriebsprozessen.

# 3. Projektmanagement & -durchführung

**Beschreibung:** Diese Domäne beginnt, sobald eine Opportunity _gewonnen_ wurde – es entsteht ein **Projekt** .
Sie deckt die Planung, Ausführung bis Abschluss des Projektes ab. Hier werden das Projekt selbst, seine
Aufgaben, Zeitpläne, Beteiligten und Status verwaltet. Im Ladenbau umfasst das: Detailplanung/
Werkplanung, Fertigung (über Lieferanten), Logistik, Montage bis zur Laden-Eröffnung, sowie eventuelle
Nacharbeiten/Reklamationen. Fachlich ist es eine Mischung aus klassischem
**Aufgaben- und**
**Terminmanagement** und branchenspezifischer Projektsteuerung (Lieferzeiten, Montagekoordination).

**Hauptobjekte/Begriffe:** - _Projekt:_ Kernobjekt für jedes beauftragte Vorhaben. Attribute: Projekttitel (z.B.
"Neuer Shop für Kunde X in Stadt Y"), verknüpfter Kunde, Projektleiter/Verantwortlicher (z.B. der ADM oder
Innendienstler), aktueller Status (Planung, in Produktion, Montage, Abgeschlossen etc.), Start- und
Enddatum (geplant und Ist), Budget/Kostenschätzung, Beschreibung. - _Projektphase/Milestone:_ Grobe
Phasen wie Planung abgeschlossen, Auftrag an Lieferanten erteilt, Montage fertig – als Meilensteine
definierbar. - _Aufgaben (Tasks):_ Feinere Einheiten – einzelne To-Dos mit Verantwortlichem und
Fälligkeitsdatum. Z.B. "Grundriss zeichnen (Planer, bis 01.05)", "Montagetrupp buchen (Innendienst, bis
01.08)". Aufgaben können in Hierarchie (Work-Breakdown) oder flach sein. - _Ressourcen:_ Die Personen oder
Firmen, die Aufgaben ausführen. Intern z.B. Planer, Extern z.B. Schreiner-Firma. Diese können dem Projekt
oder einzelnen Aufgaben zugewiesen sein. - _Dateien:_ Alle projektbezogenen Dokumente (Pläne, Fotos,
Verträge, Genehmigungen,…) – verwaltet in einer Struktur oder Liste am Projekt. - _Risiken/Issues:_ Optional:
Eintrag für Probleme, die auftreten (z.B. "Lieferverzug Material", "Baustelle nicht zugänglich bis Datum").
Hilfreich für professionelle PM-Methodik. - _Reklamationen:_ Falls nach Abschluss Mängel gemeldet werden,
könnten diese hier erfasst sein (oder in separatem Modul, aber fachlich gehört es zur Projekt-Nachphase). -
_Projekt-Statusbericht:_ Eine Zusammenfassung der wichtigsten Infos (Ampel für Zeit/Kosten/Qualität), oft
manuell aktualisiert für GF – könnte als Attribut Status (OK/Verzögert etc.) realisiert sein.

**Schnittstellen/Abhängigkeiten:** - Input von _Vertrieb/Opportunity_ : Projekt wird aus gewonnenem
Verkaufsprozess erzeugt, übernimmt relevante Daten (Kunde, Umfang, Angebotssumme). - Verknüpft mit
_Kontaktverwaltung_ : Projekt hat Kunde und Lieferanten als verknüpfte Kontakte; Projektaufgaben können
Kontakte referenzieren (z.B. "warte auf Rückruf von Kunde" als Aufgabe). - Verbindung zur _Buchhaltung_ :
Projekt kennt das Budget/den Auftragswert und die Rechnungspläne, und sollte Info zum Rechnungsstatus
bekommen (für den Status "finanziell abgeschlossen"). - Überschneidung mit _Planung_ : Projekt enthält
Planungs-Tasks und die Ausgabe (Pläne) werden hier dokumentiert. - _Lieferantenmanagement:_ Externe
Lieferaufträge könnten im System als Teil des Projekts auftauchen (z.B. Bestellung an Schreiner – evtl. als
Unterobjekt oder einfach als Aufgabe mit Lieferant). - _Reporting an GF_ : Der Projektstatus fließt in
Management-Übersichten (z.B. welche Projekte sind in Verzug). - _Marketing_ : Projektabschluss markiert, dass
Daten für Erfolgsgeschichte bereit stehen.

**Best Practices & Stolpersteine:** - **Projektstruktur & Workflows abbilden:** Best Practice ist,
wiederkehrende Abläufe in **Standard-Workflows** zu gießen. Z.B. ein _Projekt-Template_ "Ladenbauprojekt" mit
vordefinierten Phasen und Aufgaben (Planungsphase -> Fertigungsphase -> Montagephase), inkl. typischer
Aufgaben (“Material bestellen”, “Bauabnahme durchführen”). Das System könnte solche Templates

hinterlegen, sodass bei neuem Projekt automatisch die generische Struktur erstellt wird. Das sichert, dass
an wichtige Schritte gedacht wird. Stolperstein: Starr vs. flexibel – jedes Projekt ist etwas anders, also muss
Template anpassbar sein. Zu rigide Workflows könnten eher behindern. - **Aufgabentracking &**
**Verantwortlichkeiten:** Jede Aufgabe sollte einen **Owner** und Deadline haben, klar sichtbar im System
. Best Practice: Aufgabenliste mit Filter "meine Aufgaben" je Nutzer, und Projekt-Taskboard (Kanban
nach Status ToDo/In Progress/Done). Transparenz, wer woran arbeitet, verhindert das Fallenlassen von
Bällen. Stolperstein: Wenn Aufgabenpflege schlampig ist (Leute erledigen was aber haken nicht ab),
spiegelt System nicht Realität. Hier muss eine gute Nutzungskultur etabliert werden. - **Zeitplanung &**
**Gantt:** Bei projektspezifischen Terminen (z.B. Montage KW 40) ist eine **Terminplanung** nötig. Best Practice:
Einsatz eines **Gantt-Charts** oder Kalenderplans, wo Meilensteine und abhängige Aufgaben dargestellt sind.
Gerade Abhängigkeiten sind wichtig (Lieferung von Schreiner muss vor Montage fertig sein usw.). Tools wie
Wrike oder Monday bieten interaktive Gantt-Diagramme für solche Planungen
. Stolperstein:
Erfordert initialen Aufwand vom Projektleiter, diesen Plan einzupflegen und bei Änderungen zu
aktualisieren. Das muss als Mehrwert erkannt werden – etwa indem das System automatische Warnungen
bei Plan-Abweichungen gibt oder einfach visuell unterstützt. - **Kapazitätssteuerung:** Wenn mehrere
Projekte parallel laufen, Best Practice: **Ressourcenübersicht** – z.B. eine Person (Planer A) hat 100% in
Projekt X bis Datum Y, erst danach kann Projekt Z begonnen werden. So etwas kann komplex sein; evtl.
genügt es, dass die Auslastung qualitativ ersichtlich ist (z.B. Planer gibt im Statusreport an "aktuell
ausgelastet bis Ende Sept"). In größeren Tools kann man Personalkapazitäten hinterlegen. Für unseren
Umfang evtl. Overkill, aber sinnvoll ist zumindest, dass Projekte einen verantwortlichen Planer haben und
GF/PM sehen, wer wie viele laufende Projekte betreut. - **Lieferanten & externe Aufgaben:** Best Practice: im
Projekt einen Bereich für **Lieferantenbestellungen** einführen. Evtl. als Unterobjekt "Bestellung" mit
Lieferant, was bestellt, Kosten, Lieferdatum. Das wäre ideal um den Überblick zu haben. Alternativ als
Aufgaben "Lieferant X: Theke fertigen, Lieferung bis 01.08". Wichtig ist, dass Lieferzeiten klar sichtbar sind
und ggf. im Zeitplan berücksichtigt (Lead Time). Stolperstein: Wenn diese Infos nur extern (z.B. separate
Excel oder ERP) gehandhabt werden, verliert das CRM-PM den Wert als zentrale Quelle. Besser, zumindest
die Termine und Verantwortlichen einzupflegen, auch wenn Details (Kosten) in ERP sind. - **Status &**
**Fortschritt:** Das System sollte den **Projektfortschritt** erfassbar machen – z.B. % abgeschlossen oder
Meilenstein erreicht. Im Interview kam Wunsch nach täglicher Zusammenfassung vom Planer für den ADM
. Best Practice: statt manueller E-Mails kann der Planer den Taskstatus updaten oder einen kurzen
Kommentar im Projekt hinterlassen ("Plan 50% fertig"). Der ADM kann das im System einsehen oder
bekommt automatisch Benachrichtigung. Moderne Tools erlauben auch, dem Kunden einen
_eingeschränkten View_ zu geben, damit er Fortschritte sieht – aber das ist eventuell hier nicht gefordert
(intern fokussiert). - **Reklamationsprozess:** Falls nach Projekt Fertigstellung Mängel auftreten, sollte es
dokumentiert werden (ggf. separate Domäne "Service" oder als Teil des Projekts). Best Practice: _After-Sales/_
_Service Modul_ , aber minimal könnte man ein abgeschlossenes Projekt wieder öffnen mit Typ "Reklamation:
Ersatzteillieferung defekt" etc. Da im Interview angesprochen, dass sich aus Dokumentation der
Reklamationen Entscheidungen zu Lieferanten ableiten
, ist es gut, diese Daten nicht unstrukturiert
zu lassen. Stolperstein: Ohne dedizierte Stelle neigt man dazu, es per E-Mail zu klären und nicht ins System
zu tragen. Daher ein einfacher Mechanismus (Checkbox "Reklamation vorhanden" + Beschreibung) würde
schon helfen. - **Projektabschluss & Lessons Learned:** Best Practice in PM: nach Abschluss **Projekt**
**bewerten** (was lief gut/schlecht) und ggf. Zeit/Kosten Soll-Ist vergleichen. Für unser System hieße das:
Felder "Geplanter Aufwand", "Tatsächlicher Aufwand", Abweichungsgrund. Das kann optional sein, aber
wäre für GF toll zur Analyse profitabler vs. unprofitabler Projekte. Stolperstein: Zusatzaufwand, wird oft
vernachlässigt, aber sollte zumindest bei großen Projekten gemacht werden. - **Benachrichtigungen &**
**Eskalation:** Das System kann so konfiguriert sein, dass es **Warnungen** gibt – z.B. wenn eine Deadline
überschritten wird ohne Erledigung, Info an Projektleiter. Oder wenn ein Projekt vom Plan abweicht
(Meilenstein verpasst), könnte GF Benachrichtigung erhalten. Best Practice: definierte Eskalationsregeln im

# 19

Projektmanagement, jedoch pragmatisch implementiert (nicht zu viele Alarme, sonst werden sie ignoriert). -
**Usability für PM-Team:** Planer und Innendienst werden vorauss. Desktop im Büro nutzen – die Oberfläche
sollte **übersichtlich** sein: z.B. Kanban oder Tabellenansicht der Projekte mit Ampel. Eventuell Integration
mit bestehenden Tools (Planer könnten z.B. aus AutoCAD heraus in Projekt direkt PDF hochladen via Plugin
– high-end). - **Tool Overkill vermeiden:** Stolperstein ist, zu viel PM-Methodik zu verlangen, was die Nutzer
überfordert. Hier müssen wir den richtigen Detaillierungsgrad finden: genug Struktur, damit nichts
vergessen geht, aber nicht so kompliziert wie komplexe Projektmanagementsoftware für Bauprojekte, da
die Nutzer kein dedizierter PM-Office sind, sondern Vertrieb/Planer. Eine **einfache Bedienung** (z.B.
Aufgaben abhaken per Handy, Drag&Drop Termine verschieben) wird die Akzeptanz sichern.

# 4. Finanz- & Compliance-Management

**Beschreibung:** Diese Domäne umfasst die finanzbezogenen fachlichen Anforderungen des Systems, primär

**Rechnungsstellung und Zahlungsstatus** im Kontext der Projekte, sowie die **Einhaltung von Richtlinien**
(GoBD, DSGVO). Zwar soll das Tool keine vollständige Buchhaltungssoftware sein, aber es muss den
fachlichen Prozess der Abschlags- und Schlussrechnung orchestrieren und compliance-relevante Daten
korrekt behandeln.

**Hauptobjekte/Begriffe:** - _Rechnung:_ Forderung an den Kunden, mit eindeutiger Nummer, Betrag,
Leistungszeitraum, Fälligkeitsdatum. Typen: Abschlagsrechnung, Schlussrechnung. Verknüpft mit Projekt
und Kunde. - _Rechnungsplan:_ Zeitplan, welche Rechnungen zu welchem Zeitpunkt/Meilenstein gestellt
werden (z.B. 30% bei Auftrag, 50% vor Lieferung, 20% nach Fertigstellung). - _Zahlung:_ Eingangsmeldung
(Datum, Betrag, Rechnungsnr.), Verknüpft mit Rechnung. - _Offene Posten:_ Abgeleiteter Status, ob Zahlung
eingegangen oder wie lange überfällig. - _Audit-Trail:_ Änderungs- und Zugriffshistorie von Datensätzen –
wichtig für GoBD/DSGVO Nachvollziehbarkeit. - _Archivierung:_ Markierung, dass Datensatz für Aufbewahrung
gesperrt ist (nicht löschbar vor Datum X). - _Einwilligung:_ DSGVO-Einwilligungsdatensatz per Kontakt, mit
Zweck, Datum, Art der Zustimmung.

**Schnittstellen/Abhängigkeiten:** - Verknüpft mit _Projektmanagement:_ Projekte liefern die Daten, wann was
in Rechnung gehen soll (Meilensteine). Projektabschluss und Rechnungsabschluss korrelieren. - _Vertrieb:_
Übergibt Auftragswert an Finanzmodul. Bei Änderungen (z.B. Nachträge) muss das nachgezogen werden. -
_Buchhaltungssystem:_ Evtl. Integration, wenn vorhandenes Fibu-System Rechnungen faktisch erstellt. -
_Compliance:_ DSGVO betrifft alle personenbezogenen Daten (v.a. in Kontakt-Domäne), GoBD v.a.
Projektdokumente und Rechnungen. - _Reporting:_ Finanzauswertungen (Umsätze, Forderungsstand) fließen
in GF-Dashboard.

**Best Practices & Stolpersteine:** - **Rechnungsworkflow steuern:** Best Practice: Hinterlegung von
**Rechnungsterminen** direkt im Projektplan oder Rechnungsplan, sodass nichts vom menschlichen Erinnern
abhängt
. Das System sollte automatisch Aufgaben "Rechnung erstellen" erzeugen und ggf. gleich
eine vorgefertigte Rechnung generieren, die Buchhaltung nur noch prüft/sendt. Stolperstein: Wenn das
System keine Fibu-Funktion hat, muss zumindest eine Erinnerung rausgehen, sonst verfällt man wieder in
manuellen Zuruf. - **Unveränderbarkeit von Reisedaten:** GoBD verlangt, dass einmal erstellte
rechnungsrelevante Daten nicht einfach gelöscht oder unbemerkt geändert werden können
. Best
Practice: _Revision-sichere Archivierung_ , z.B. durch Schreibschutz oder Archivmodus. Rechnungen als PDF
sollten nach Erzeugung abgelegt und nicht mehr modifizierbar sein (Storno nur mit neuer Stornorechnung).
Stolperstein: CRM-Systeme ohne Fokus auf Finance könnten Änderungen zulassen – hier muss Konzeption
sicherstellen, dass zumindest Logging erfolgt
. - **Nachvollziehbarkeit und Dokumentation:** Jede

# 20

---

_Page 21_

---

Buchung/Rechnung sollte im System mit einem Pfad dokumentiert sein. Best Practice: _Audit Log_ für wichtige
Felder (wer hat Betrag geändert und wann)
. Außerdem sollte klar nachvollziehbar sein, welche
Leistungen eine Rechnung umfasst (Verknüpfung zum Angebot/Projektphase). Stolperstein: Wenn Teile
offline passieren, geht diese Kette verloren. - **Datenschutzprinzipien implementieren:** Das System muss
_Privacy by Design_ haben: Nur notwendige Daten speichern (Datenminimierung)
, Nutzungszweck klar
definieren (z.B. keine zweckfremde Nutzung ohne neue Einwilligung)
, Einwilligungen dokumentieren
. Best Practice: Eingebaute Funktionen für **Export/Löschung** von Personendaten auf Anfrage (Right to
Data Portability & Erasure)
. Beispielsweise ein Button "Person löschen" der checkt, ob
Aufbewahrungspflichten bestehen und sonst anonymisiert, oder "Datenauszug erstellen". Stolperstein:
Wenn diese Features fehlen, wird es später sehr aufwendig, manuell Daten zu entfernen im Falle eines
Requests. Also früh dran denken. - **Zugriffssicherheit:** Sensible Daten (z.B. Kundenpreise, Rechnungen)
sollten nur berechtigte sehen. Das schließt datenschutz auch intern ein (Need-to-know-Prinzip). Best
Practice: Rollen, die z.B. normales Team keine Rohertragsanalysen sehen lässt, GF schon. Da aber kleine
Firma, ist hier vielleicht flacher. Trotzdem sollte man technisch trennen können (z.B. falls mal externen
Support Nutzer zugriff haben, der nicht alle Personendaten sehen darf). - **GoBD-Zertifizierung:** Manche
Software lassen sich GoBD zertifizieren, was oft voraussetzt: unveränderbare Protokolle, klare
Benutzerrechte, Verfahrensdokumentation. Best Practice: Ein **Verfahrensverzeichnis** für dieses System
anlegen, wie Daten verarbeitet werden – hilft bei Prüfung. Stolperstein: Nicht fachlich in der Software, aber
eine Aufgabe bei Einführung. - **Integration Fibu:** Falls z.B. Datev genutzt wird, Best Practice: eine
_Schnittstelle (z.B. DATEV-Export)_ aus den im CRM erfassten Rechnungen, sodass Buchhaltung nicht doppelt
bucht. Oder gleich die Buchhaltung ins System ziehen (ERP-Ansatz). Das muss strategisch entschieden
werden. Fachlich sollte die Domäne so gestaltet sein, dass entweder das System einfache
Buchhaltungsfunktionen hat oder Datenexport bereitstellt. - **Zahlungstracking:** Best Practice, wie erwähnt,
Rückmeldung der Zahlung an Vertriebs/Projekt-Teams, damit diese gegebenenfalls eingreifen (z.B. Montage
erst nach Zahlung durchführen?). Ein Ampelsystem pro Rechnung: Grün bezahlt, Gelb fällig bald, Rot
überfällig, hilft im Projektmodul Übersicht (evtl. eine Regel: "wenn Abschlag nicht bezahlt, keine Produktion
starten" – das könnte ein Hinweis im System sein). Stolperstein: Ohne disziplinierte Pflege (d.h. Buchhaltung
muss Zahlungseingänge eintragen) bleibt Anzeige rot obwohl Kunde gezahlt hat -> falscher Alarm. Also
Prozess definieren. - **Kostenverfolgung:** Optional, aber relevant: Während Buchhaltung vor allem Ertrag/
Rechnung sieht, könnte man auch Kosten im Projekt notieren (z.B. Lieferantenangebot 50k, unsere Marge
20k). Das wäre advanced controlling. Best Practice in Projekt-Controlling: _Earned Value Management_ etc.,
aber vermutlich Overkill. Einfache Variante: Innendienst pflegt nach Abschluss "Ist-Kosten" vs.
"Verkaufspreis" – und GF bekommt Marge. Das nur, wenn gewünscht; könnte aber helfen, unprofitable
Projektarten zu identifizieren. Stolperstein: Ohne Integration Finanzen ist das händisch und evtl. ungenau. -
**Archivierung & Löschfristen:** GoBD erfordert 10 Jahre Aufbewahrung. Das System sollte Daten nicht vor
Ablauf automatisch löschen. DSGVO verlangt aber nicht irrelevante Daten zu löschen. Konflikt:
Kundendaten aus Projekten sind geschäftsrelevant -> 10 Jahre aufheben. Best Practice: System hält sich an
längste Frist (Geschäftsdaten 10J). Nach 10J sollte es eine Funktion geben, diese archivierten Projekte zu
entfernen oder zu anonymisieren. Evtl. automatischer Archivstatus nach Abschluss +10J, dann
Löschvorschlag. Das ist oft vernachlässigt, bis 10 Jahre rum sind, aber definieren schadet nicht. -
**Compliance-Updates:** Gesetzeslage ändert sich (z.B. DSGVO-Novellen). Das System sollte flexibel
anpassbar sein (neue Felder, neue Prozesse). Best Practice: Wartungskonzept haben, wer prüft, ob System
noch regelkonform ist, und wie man anpasst (z.B. wenn neue Dokumentationspflicht kommt). Nicht direkt
im System implementierbar, aber organisatorisch.

# Zusammenfassend definieren diese Domänen die fachlichen Säulen der Lösung: CRM-Kontakte ,

konsistent zusammenspielen (z.B. Kunde in Kontakt-Domäne -> Opportunity -> Projekt -> Rechnung ->
Analysen). Best Practices empfehlen integrierte Ansätze, die genau dieses Zusammenspiel ermöglichen
. Typische Stolpersteine liegen in Datenqualität und Benutzerakzeptanz – hier sind klare Prozesse und
Schulungen erforderlich, um die Domänen reibungslos zu nutzen.

# Anforderungen

Auf Basis des Kontextes (Interview, Auswertung, Workflows, Standards) wurden die fachlichen
**Anforderungen** an die CRM-/PM-Lösung abgeleitet. Sie sind in **funktionale** und **nicht-funktionale**
unterteilt und nach Muss/Should/Nice priorisiert. Dabei sind Muss-Kriterien zwingend für die Kern-Use-
Cases, Should sind wichtig aber notfalls iterierbar, Nice-to-have ergänzen die Vision.

# Funktionale Anforderungen

**(F1) Zentrale Kontakt- und Kundenverwaltung –** **_Muss_**
Die Anwendung muss eine zentrale Datenbank für alle **Kunden, Interessenten, Lieferanten und**
**Ansprechpartner** bereitstellen
. Pro Kunde sollen Stammdaten (Name, Adresse, Branche etc.) sowie
verknüpfte Kontakte (Personen) gespeichert werden. **Dublettenprüfung** bei Neuanlage und **Suche/Filter**
(nach Name, Ort, Branche) sind erforderlich. Alle relevanten Beziehungen müssen abbildbar sein: z.B.
Kunde gehört zu Konzern/Verband
, Lieferant beliefert bestimmte Kunden etc. Zudem sollen
**Vertriebsregion oder Zuständigkeit** (welcher ADM betreut den Kunden) hinterlegt sein. _Best Practice:_ Eine

# 360°-Sicht pro Kunde: D.h. im Kundenprofil werden auch zugehörige Aktivitäten, Opportunities, Projekte

# (F2) Lead-Management und Qualifizierung – Muss

# (F3) Opportunity- und Angebotsmanagement – Muss

# 22

ist
. Bei Änderungen muss entweder eine neue Angebotsversion erfasst oder der Betrag aktualisiert
werden (inkl. Historie). **Dateiupload** des tatsächlich an Kunden gesendeten Angebotsdokuments (PDF) soll
möglich sein. Wird eine Opportunity als _verloren_ geschlossen, soll ein **Verlustgrund** ausgewählt werden
(z.B. _Preis zu hoch_ , _Kunde verschoben_ , _Konkurrenz erhalten_ ). Wird sie als _gewonnen_ markiert, muss (F4) greifen.
_Priorität:_ Muss, da Kern des Vertriebs und Voraussetzung für Forecasts. Ohne diese Funktion kein
strukturiertes Angebots-Tracking.

# (F4) Nahtlose Umwandlung gewonnener Opportunity in Projekt – Muss

# (F5) Projektakte mit Stammdaten und Status – Muss

# (F6) Aufgaben- und Workflow-Management – Muss

# 23

fällig"
(ggf. an Buchhaltung, vgl. F11), etc. Solche generierten Tasks müssen relevant und nicht
überfrachtend sein; sie sollen dem jeweiligen Verantwortlichen zugewiesen werden.
Außerdem wünschenswert: **Aufgabenübersicht pro Nutzer** (damit jeder seine ToDo-Liste sieht, ggf. über
Projekte hinweg) und **Benachrichtigungen** (z.B. E-Mail oder App Push), wenn neue Aufgabe zugewiesen
oder Deadline nah/überfällig.
_Muss_ , da klare Aufgaben- und Verantwortlichkeitsverfolgung essentiell ist (eine der Hauptforderungen war,
dass jeder schnell sieht, wer was im Projekt tut und wie der Stand ist
).

# (F7) Dokumentenmanagement & Anhänge – Muss

# (F8) Lieferanten- und Partnerintegration – Should

# (F9) Kalender- und Terminverwaltung – Should

# 24

sein, um Teamkoordination zu erleichtern. Priorität Should, weil Kalenderfeatures oft in CRM/PM integriert
sind, aber zur Not könnte man manuell arbeiten.

**(F10) Reporting & Dashboards –** **_Muss_**
Es muss umfangreiche **Reporting-Funktionen** geben, um die Daten auszuwerten – insbesondere für
Geschäftsführung und Team Leads. Konkret: - **Vertriebs-Dashboard:** Pipeline-Übersicht (Anzahl
Opportunities pro Phase, Summe wertgewichtet)
; Abschlussrate (Angebote vs. gewonnen); Umsatz-
Forecast nach Monat/Quartal
; Top-10 offene Opportunities nach Wert; Vertriebsleistung pro ADM
(Umsatz gewonnen). - **Projekt-Dashboard:** Liste laufender Projekte mit Status (Fertigstellungsgrad, Ampel)
; ggf. visualisiert auf Zeitachse. Kennzahlen: % Projekte fristgerecht, durchschnittliche Durchlaufzeit,
Auslastung Planer (z.B. Anzahl Projekte pro Planer). - **Finanz-Reports:** Umsatz realisiert YTD,
Auftragseingang YTD, Auftragsbestand (Summe offener Projekte), Rechnungsausstände (Alter der offenen
Posten), etc. Ziel ist, was GF bisher manuell aus unterschiedlichen Quellen sammeln musste, auf Klick zu
haben. - **Marketing/CRM-Reports:** z.B. Anzahl neue Leads pro Monat, Konversionsquote Lead-

> Opportunity->Auftrag; Segmentanalysen (Umsatz nach Branche, Region). Das System sollte ermöglichen,
> **interaktive Filter** zu setzen (z.B. Zeitraum, Verantwortlicher) und die Reports möglichst grafisch
> darzustellen (Charts, Tabellen) zum schnellen Erfassen. _Muss_ , da dies für Managemententscheidungen
> essentiell und explizit gefordert ist (GF will Statistiken und klare Prognosen
> ).

# (F11) Rechnungs- und Zahlungsmanagement – Muss

# (F12) Änderungslog und Nachvollziehbarkeit – Muss

# 25

hochgeladen am 12.05.25”). Muss-Kriterium, da es sowohl compliance-seitig (GoBD Nachvollziehbarkeit
)
als auch zur Vermeidung von Missverständnissen (wer hat was geändert) unabdingbar ist.

# (F13) Erweiterte Funktionen: Versionsverwaltung, mobile App, etc. – Nice

# Die Priorisierung erfolgte streng nach den Kern-Use-Cases des Interviews: z.B. 360° Kundeninfo (Muss),

# Nicht-funktionale Anforderungen (fachlich)

Dies sind Anforderungen, die nicht direkt eine Fach-Funktion beschreiben, sondern Qualitäten und
Rahmenbedingungen, insb. Usability, Zugänglichkeit und Compliance-Vorgaben.

**(NF1) Benutzerfreundlichkeit & UI-Design:** _Muss_ . Die Anwendung muss für alle Nutzergruppen leicht
bedienbar und übersichtlich sein. **Usability-Priorität** hat hohe Bedeutung im Zielbild (”Produktvision &
Usability – keine technischen Entscheidungen”). Konkret: - **Intuitive Navigation:** Klare Struktur nach den
Domänen (z.B. Module Kunden, Projekte, Dashboard). Wenige Klicks, um wichtige Infos zu finden (z.B.
Kunde -> direkt sehen offene Projekte und Angebote). - **Konsistentes Design:** Einheitliche UI-Elemente,
beschriftete Buttons, sinnvolle Icons. Einarbeitungszeit soll minimal sein. - **Mobile responsiv:** Das UI soll
auf Tablets/Laptops gut funktionieren, für Smartphones eine vereinfachte Ansicht bieten (für ADM im Feld).
Key-Funktionen (Kontaktdetails einsehen, Notiz erstellen) müssen mobil möglich sein. - **Schnelligkeit:**
Bedienungsabläufe wie Datensuchen oder Speichern sollten zügig vonstattengehen, um Frustration zu
vermeiden. Offline-Modus (Eingaben zwischenspeichern) ist stark gewünscht seit ADM oft offline ist
.

- **Mehrsprachigkeit:** In diesem Fall wohl nicht kritisch (deutsche Nutzer), aber zumindest Zeichensatz-
  Unterstützung etc. - **Personalisierung:** Nice-to-have sub-aspekt: Nutzer können sich z.B. Dashboard
  anpassen oder Favoritenkunden markieren, um noch effizienter zu arbeiten. Usability ist insofern Muss, da
  Adoption davon abhängt: _"If your users are not properly trained and can’t use the system effectively, they won’t_
  _use it."_
  .

# 26

**(NF2) Barrierefreiheit & Zugänglichkeit:** _Should_ . Obwohl BITV nicht vorgeschrieben, soll Best-Practice
**Accessibility** eingehalten werden. Das bedeutet: - **Klare Kontraste** in Farben und ausreichend große
Schrift
. - **Tastaturbedienbarkeit** aller Funktionen (falls z.B. ein Mitarbeiter motorische Einschränkung
hat oder einfach Tastenkürzel nutzen möchte). - **Vermeidung von rein farbcodierter Info** (Farben immer
mit Text/Symbol unterstützen)
– z.B. Statusampeln auch mit Symbol oder Label. - **Responsivität** auch
als Teil der Zugänglichkeit (Nutzung auf verschiedenen Geräten). - **Fehlermeldungen verständlich** , Labels
an Formularfeldern etc. Da aktuell keine konkrete Anforderung an Screenreader-Unterstützung kam (und
interne Business-Apps oft nicht 100% WCAG erfüllen), ist dies als "Should" markiert – es wird angestrebt
nach Möglichkeit, aber leichte Abweichungen sind tolerabel solange allgemeine Nutzbarkeit gegeben ist.

# (NF3) Performance und Skalierbarkeit: Should . Für die aktuelle Firmengröße wird kein riesiger Datenload

**(NF4) Security & Berechtigungen:** _Muss_ . Das System muss **sicherstellen, dass Daten geschützt** sind vor
unbefugtem Zugriff (besonders personenbezogene Daten nach DSGVO). Fachlich bedeutet das: - **Login mit**
**Berechtigungsstufen** : z.B. normale User, Administratoren. - **Rechtemanagement** : Es sollte möglich sein,
falls gewünscht, den Zugriff auf sensible Module einzuschränken (etwa Buchhaltungsdaten nur für
Buchhalter). Standardmäßig kann die Firma aber entscheiden, viel offen zu lassen – aber das System muss
es _können_ . Ein Minimum: Rollen wie _Vertrieb_ , _Planer_ , _Buchhaltung_ , _GF_ mit entsprechenden Lese-/
Schreibrechten definieren. Z.B. _Buchhaltung_ darf Finanzdaten bearbeiten, _Vertrieb_ darf das nicht ändern
aber sehen etc. - **Datensicherheit** : Datenübertragung verschlüsselt (HTTPS), Passwörter sicher, etc. (Das
sind tech Details, aber ein Muss aus fachlicher Sicht, weil sonst DSGVO nicht erfüllt). Ebenso sollte das
System **Verschlüsselung sensibler Felder** vorsehen (z.B. falls Bankdaten gespeichert würden). - **Pen-Tests**
**& Schutz vor externen Angriffen** : Nicht-funktional technical, wird aber als Muss in einer Compliance-
Betrachtung genannt (DSGVO verlangt "Stand der Technik" Sicherheitsmaßnahmen). - **Datensicherung** :
Regelmäßige Backups, damit bei Systemausfall keine Daten verloren gehen. Fachlich relevant in dem Sinne,
dass Verfahrensvorschriften dies fordern. Kurz: Das System darf keine unbefugte Herausgabe ermöglichen
und muss stabil und sicher sein. Muss, da DSGVO/GoBD sonst verletzt würden.

**(NF5) DSGVO-Compliance:**
_Muss_ . Einige Punkte wurden schon in F11 und NF4 erwähnt, aber
zusammenfassend: - **Einwilligungs-Tracking:** Das System muss speichern können, ob und wofür ein
Kontakt die Verwendung seiner Daten erlaubt hat
. Z.B. Checkbox "Einwilligung für Marketing-E-Mails
am [Datum] durch [Quelle]" am Kontakt. - **Auskunft und Löschung:** Auf Anforderung muss das
Unternehmen dem Kunden alle über ihn gespeicherten Daten geben können
. Das System muss daher
Exportfunktionen (z.B. komplette Kontakt- und Historie als PDF/Excel) pro Person bereitstellen. Ebenso
muss es ermöglichen, Daten zu löschen oder anonymisieren, außer es besteht Aufbewahrungspflicht. Z.B.
könnte beim Löschbefehl eine Person in Kontakten anonymisiert werden (Name -> "entfernt"), während in
Projekten der Datensatz aus Gründen der Buchhaltung bleibt, aber ohne Personenbezug. - **Privacy by**
**Design:** Minimierung (keine unnötigen Felder), Zugang nur für notwendige Nutzer (Rollenkonzept, siehe
NF4), Sicherheitsmaßnahmen (siehe NF4). - **Auftragsdatenverarbeitung & Hosting:** Falls Cloud, Server in
EU o. mit Standardvertragsklauseln. (Organisatorisch). Im Großen und Ganzen muss das System so

# 27

gestaltet sein, dass es die Einhaltung der DSGVO erleichtert, nicht erschwert. Dieses Muss ist
geschäftskritisch (Vermeidung von Strafen, Vertrauensverlust).

**(NF6) GoBD-Compliance:** _Muss_ . Das System muss die **Grundsätze ordnungsgemäßer Buchführung**
**(GoBD)** für elektronische Aufzeichnungen erfüllen, soweit anwendbar. Konkret: - **Unveränderbarkeit von**
**originären Buchungsdaten** : Sobald z.B. eine Rechnung erstellt und versendet ist, darf sie nicht einfach
geändert oder gelöscht werden
. Korrekturen nur via Storno/Neu. Das System soll also Mechanismen
haben, Rechnungsdatensätze nach Finalisierung zu sperren (schreibgeschützt) oder Änderungen zumindest
lückenlos zu protokollieren
. - **Nachvollziehbarkeit und Protokollierung** : Jede Änderung an
rechnungsrelevanten Daten muss dokumentiert (wer wann was) sein. Siehe F12 Änderungslog. -
**Datensicherung und Aufbewahrung** : Das System sollte Möglichkeiten bieten, Daten 10 Jahre unverändert
aufzubewahren. Z.B. Archivfunktion für Projekte/Rechnungen, die verhindert, dass nachträglich Inhalte
gelöscht werden. - **Export für Prüfer** : Im Prüfungsfall sollten Daten in gängigem Format ausgeleitet
werden
können
(CSV,
PDF)
und
zusammenhängend
(Verknüpfungen
erhalten).

- **Verfahrensdokumentation** : Das System sollte ein Vorgehen vorsehen, wie z.B. Änderungen protokolliert
  und archiviert werden, damit man es beschreiben kann. (Das ist mehr ein Doku-Thema für uns, aber System
  muss die Funktionen bieten). Muss, weil ohne diese Einhaltung die Verwendung riskant wäre und BWL/
  Steuer-Seite es nicht akzeptiert.

# (NF7) Interoperabilität & Erweiterbarkeit: Should . Es ist wünschenswert, dass die Lösung Schnittstellen

Zusammengefasst legen diese nicht-funktionalen Anforderungen den Rahmen fest: Das System muss
**nutzbar, sicher und regelkonform** sein. Gerade **Compliance (DSGVO, GoBD)** hat Muss-Charakter, was
durch entsprechende Logging-, Berechtigungs- und Archivierungsfunktionen abgedeckt wird
.
**Usability** ist ein Schlüsselfaktor für Akzeptanz – eine intuitive, schnelle Oberfläche, die mobil unterstützt
wird, ist daher einzuhalten, auch wenn bestimmte Extras (Spracherkennung, KI) nur Nice-to-have sind.

# Arbeitsprozesse & Workflows

Die bestehenden **Arbeitsprozesse (Workflows)** wurden aus dem Interview-Kontext extrahiert und sollen
vom neuen System zu ~90% unverändert abgebildet werden. Hier werden die **IST-Workflows** beschrieben,
gefolgt von identifizierten **minimal notwendigen Anpassungen** , die auf Best Practices beruhen. Jede
Anpassung wird begründet und mit Quelle untermauert. Insgesamt zeigt sich, dass viele der bisherigen
manuellen Schritte im neuen Tool digital abgebildet werden, ohne den Ablauf an sich fundamental zu
ändern – außer dort, wo die Digitalisierung ausdrücklich Vorteile bringt (z.B. Eliminierung doppelter
Dateneingaben).

# Ist-Workflows

**Workflow 1: Leadgenerierung & Erstkontakt**
_Auslöser:_ Ein potentieller Kunde (Lead) entsteht – etwa durch Kaltakquise (Telefon, Messe) oder Empfehlung.
_Schritte:_ 1. **Lead-Erfassung:** Bisher notiert der ADM die Kontaktdaten und Basisinfos des Leads (z.B.
Branche, grober Bedarf) handschriftlich oder in eigener Liste. Anschließend sendet er diese Informationen
per E-Mail an die Marketingabteilung
. 2.
**Lead-Aufbereitung:**
Marketing erstellt ein
**Kundenkontaktprotokoll** in Word mit allen erhaltenen Infos und ergänzt durch eigene Internetrecherche
(z.B. Firmengröße, Hintergrund)
. Dieses Dokument wird in eine Excel-Liste aller Anfragen
eingetragen und dem ADM zugeschickt
. 3. **Lead-Qualifizierung:** Der ADM legt das Dokument in
seiner Ordnerstruktur ab (nach Region/Kategorie sortiert)
. Er kontaktiert den Lead (z.B.
Terminvereinbarung). Wenn der Lead interessiert und qualifiziert ist (Budget, Zeitrahmen passen
grundsätzlich), geht es zum ersten Kundenbesuch (Workflow 2). Falls der Lead kein Potenzial hat, erfolgt

# evtl. keine weitere Verfolgung (bleibt in Liste als "ruhend").

_(Im neuen System würde dieser Workflow digitalisiert: Lead direkt ins CRM eingeben, Marketing und ADM greifen_
_auf selben Datensatz zu. Siehe Anpassung A1.)_

**Workflow 2: Kundenbesuch & Bedarfsaufnahme**
_Auslöser:_ Ein erster Termin beim Interessenten ist vereinbart (durch Kaltakquise oder nach Lead-Workflow).
_Schritte:_ 1. **Terminvorbereitung:** ADM plant seine Route und Termin. (Derzeit manuell/Kalender, im neuen
System optional via Kalenderfunktion – Nice-to-have). 2. **Kundengespräch:** Vor Ort beim Kunden führt der
ADM ein Beratungsgespräch. **Er nimmt den Bedarf auf** : Wünsche des Kunden, räumliche Gegebenheiten,
Budgetvorstellungen, Zeitplan. Wichtig: Der ADM nutzt _Papier und Stift_ , um Notizen zu machen
. Er
vermeidet Tippen am Tablet/Phone, um den Kunden nicht zu irritieren
. Falls vorhanden, macht er
Fotos (z.B. vom Ladenlokal) und skizziert Grundrisse. 3. **Direkt im Gespräch** verkauft er noch nichts Finales,
sondern sammelt Infos. Er könnte erste grobe Lösungen ansprechen, aber ohne Planer keine konkreten
Entwürfe. 4. **Nach dem Gespräch:** Sobald er wieder allein ist (z.B. im Auto danach), **dokumentiert der ADM**
**die Ergebnisse** . Aktuell zwei Varianten: (a) Er diktiert eine Sprachnotiz mit allen Punkten
; (b) er
wartet bis ins Büro und tippt seine Notizen ab. Manchmal fotografiert er die handschriftlichen Notizen. 5.
**Interne Zusammenfassung:** Wieder im Büro, bereitet der ADM die Übergabe an die Planungsabteilung
vor. Bislang geschieht dies in einem **Übergabegespräch** persönlich: ADM trifft Planer (oder Team) und **geht**
**alle Notizen durch**
. Er erläutert mündlich, was der Kunde will, zeigt ggf. Fotos/Skizzen, um
sicherzustellen, dass der Planer alles versteht. Parallel übergibt er auch digitale Unterlagen (z.B. schickt E-
Mail mit Fotos). 6. **Lead -> Opportunity:** Intern wird aus dem Interessenten ein "Projekt in Akquise". Bisher
geschieht das informell (Ordner anlegen etc.), im neuen System wäre jetzt eine Opportunity angelegt (s.
Anpassung A2).

# Workflow 3: Angebotserstellung (Planung & Kalkulation)

# 29

| 134 |     | .   |
| --- | --- | --- |
| kt  | 109 |     |

unformalisiert ("nicht eindeutig geregelt"
). - Nach einigen Tagen/Wochen ist ein Planungsentwurf fertig. 2. **Kalkulationsphase:** Parallel oder anschließend kalkuliert der Innendienst die Kosten. Der ADM/Planer
liefern der Kalkulation die Planungsdetails: Materiallisten, Möbelliste etc. Aktuell wahrscheinlich via
Gespräch oder E-Mail mit Planungs-PDF. Der **Kalkulator** erstellt ein detailliertes Angebot mit allen
Positionen
. Dies geschieht in Excel oder einem Kalkulationstool. Das Angebot listet alle Elemente
(Möbel, Service) und Preise
. - Falls Planer und Kalkulator parallel arbeiten, erfolgt Abstimmung bei
Unklarheiten (z.B. falls etwas nicht planmäßig ausführbar, schlägt Kalkulator Alternativen vor). 3.
**Präsentationsvorbereitung:**
Die
Grafik/Marketingabteilung
(oder
Planer)
erstellt
eine
**Präsentationsmappe** für den Kunden
. Enthalten: Visualisierungen, Grundriss, das Angebot in
schön, ggf. Unternehmensinfos – quasi ein Verkaufsdossier. Diese Mappe wird ausgedruckt und gebunden
für den Termin vorbereitet
. 4. **Interne Abstimmung vor Präsentation:** ADM, Planer und evtl. GF
sehen das Angebot durch. GF wird manchmal involviert, etwa wenn es strategisch wichtig oder teuer ist
. Der ADM vergewissert sich, das Angebot deckt alles ab und ist im Rahmen. 5. **Kundenpräsentation:**
Der ADM geht mit der Mappe zum Kunden (ggf. zusammen mit Planer, falls sehr technisch). Er stellt das
Konzept vor (Pläne, Materialien) und bespricht das **Angebot im Detail** . - Idealfall: Kunde ist begeistert und
**erteilt sofort den Auftrag** durch Unterschrift
. Dann wäre der Vertriebsprozess abgeschlossen
(Gewonnen) und es geht zu Workflow 4. - Oft: **Iterationsschleifen:** Der Kunde hat Änderungen/Feedback.
Z.B. andere Materialien, Kostenreduktion, Layoutanpassungen. Dann wird kein Abschluss erzielt, sondern
eine Überarbeitung vereinbart
. 6. **Iteration (falls nötig):** Planer passt den Entwurf gemäß
Feedback an, Innendienst passt das Angebot an
. Es kann mehrere Runden geben. Typischerweise
läuft es so: Kunde -> Änderung, Team -> neues Angebot, Kunde -> nochmal Feinschliff, bis Kunde OK gibt. -
Dabei nicht immer der gleiche Kalkulator: "muss nicht mehr der ursprüngliche Kalkulator sein, jeder
Innendienstler kann Angebot anpassen"
, auch wenn meist derselbe es macht
. - GF wird bei
größeren Änderungen evtl. involviert (Rabatte etc.). 7. **Auftragserteilung:** Der Kunde unterschreibt das
final angepasste Angebot. Damit wird es zum Auftrag.

# Workflow 4: Auftrag & Umsetzung

# 30

---

_Page 31_

---

Also Projektkalender wird auf Monate im Voraus gelegt. 5. **Durchführung/Montage:** Wenn Lieferobjekte
fertig, werden sie zum Kunden transportiert. Die **Montage** findet vor Ort statt (durch Monteure, evtl. vom
Lieferanten oder eigene). Der ADM oder Projektleiter koordiniert das Timing mit dem Kunden (Laden
zeitweise geschlossen etc.). - Während Montage hält man Kontakt, ob Probleme auftreten. - Abschluss:
**Abnahme** mit dem Kunden. 6. **Schlussrechnung:** Nach erfolgreicher Fertigstellung stellt Buchhaltung die
Schlussrechnung (bzw. letzte Rate). Im Ist teilt der Innendienst oder ADM mit, wenn Projekt fertig für
Rechnung – dieser Prozess war "unklar/unkonsistent" und soll standardisiert werden
. - Buchhaltung
überwacht Zahlungseingang, meldet ggf. wenn Nachhaken nötig
. 7. **Projektabschluss &**
**Feedback:** Das Projekt wird intern abgeschlossen. Oft gibt es eine Nachkalkulation/Beurteilung intern (ist
man im Budget geblieben? War Kunde zufrieden?). Marketing fragt eventuell nach Referenzfreigabe, macht
Fotos vom fertigen Laden für Erfolgsgeschichte
. - Falls **Reklamationen** (Mängel) kommen: Der
Innendienst kümmert sich um Nachbesserung (z.B. Ersatzlieferung vom betroffenen Lieferant). Solche Fälle
werden bearbeitet, aber bisher nicht systematisch ausgewertet – das System würde es erfassbar machen
(Lieferant X hat Fehler -> siehe vorher Lieferanten Mgmt Workflow). - GF möchte am Ende Kennzahlen aus
dem Projekt: War es profitabel? wie lange dauerte es? welcher Planer hat wie viel Volumen geplant
,
etc., um Personalentscheidungen abzuleiten.

# Dies deckt die Kern-Use-Cases: von Lead bis Projektabschluss. Ergänzende Prozesse: - Spesen-/

# Minimale notwendige Anpassungen

Trotz Fokus, die Workflows weitgehend beizubehalten, wurden einige **Änderungen/Aktualisierungen**
identifiziert, die Best Practices zufolge deutliche Vorteile bringen **und** nicht im Widerspruch zum
Kernprozess stehen. Diese Anpassungen sind "minimal-invasiv": sie verändern nicht das _Ziel_ oder _Ergebnis_
eines Schritts, aber oft _wie_ er erreicht wird (nämlich effizienter/digitaler). Hier die vorgeschlagenen
Änderungen mit Begründung:

**A1: Wegfall der doppelten Lead-Dokumentation (Marketing-Word-Dokument)** – _Begründung:_ Der
aktuelle Prozess mit Kundenkontaktprotokoll in Word und manueller Listenpflege ist zeitaufwändig
und fehleranfällig
. Best Practice ist, Leads direkt im CRM zu erfassen und dort anzureichern
. _Anpassung:_ Der ADM trägt neue Leads sofort ins System ein (Basisdaten per mobil/PC).
Marketing greift diesen Datensatz und ergänzt fehlende Infos (Web-Recherche) direkt dort. Dadurch
existiert _eine einheitliche Datenquelle_ , auf die beide zugreifen – kein Hin- und Herschicken von
Dokumenten. Diese Änderung verkürzt den Prozess (keine Dokumenterstellung nötig) und reduziert
Übertragungsfehler. Sie widerspricht nicht dem definierten Prozessziel (Lead vollständig erfassen),
sondern erreicht es effizienter. _Quelle:_ Nimble CRM zeigt, dass automatisches Kontaktprofiling
möglich ist
, was hier den manuellen Schritt ersetzt. Das Interview selbst stellt fest, dass das
Ordner/Word-Protokoll "sehr aufwendig und fehleranfällig" ist
– unsere Anpassung schafft das
ab, was ja "Ziel der Applikation" ist
.

# 31

**A2: Einführung eines strukturierten Opportunity-Prozesses** – _Begründung:_ Im Ist gibt es keinen
formal definierten Opportunity-Funnel; ein Interessent wird irgendwann zum "Auftrag", dazwischen
ist viel implizit. Best Practice empfiehlt einen klaren Vertriebsprozess mit Pipeline-Stages
.
_Anpassung:_ Nach dem ersten Kundenbesuch (Workflow 2), legt der ADM eine **Opportunity** im
System an, Phase z.B. "Bedarf ermittelt". So wird aus dem Lead ein verfolgbares Verkaufsprojekt. Alle
weiteren Schritte (Planung, Angebot) werden in dieser Opportunity dokumentiert. Die **Phasen**
werden dem bestehenden Vorgehen nachempfunden: z.B. "Angebot erstellt", "In Verhandlung",
"Warten auf Entscheidung" etc. Dies macht den Vorgang transparenter für alle (GF sieht Pipeline)
. Es ändert nicht den Prozess an sich (man hat auch bisher Angebote und Verhandlungen
gemacht), aber formalisiert ihn. _Quelle:_ Insightly betont die Vorteile, Opportunities im CRM zu
managen und dann in Projekte umzuwandeln
. Unser Kontext wünscht sich bessere Prognosen –
dies geht nur mit Pipeline-Tracking
, daher diese Anpassung.

# A3: Digitales Briefing statt ausschließlich persönliches Meeting – Begründung: Derzeit verlässt

# A4: Aufgaben-Tracking für Follow-ups und Iterationen – Begründung: Im Ist müssen Vertriebler

# A5: Automatisierter Rechnungsworkflow statt ad-hoc Zuruf – Begründung: Momentan erfolgt die

# 32

vorgeschlagenem Rechnungsdokument. Beispiel: "16 Wochen vor Montage: 2. Teilrechnung über
50% erstellen"
. Die Buchhalterin muss nur prüfen und freigeben. Dadurch wird der Ablauf
standardisiert und es geht keine Rechnung vergessen. _Quelle:_ Der Interviewpartner selbst sagt,
dieser Infofluss soll klar über ein System abgebildet werden, "macht natürlich Sinn"
. Unsere
Änderung erfüllt genau diese Forderung, mit minimaler Umstellung (Buchhaltung folgt nun
Systemtask statt auf Zuruf).

# A6: Lieferantenleistung erfassen & Qualitätsfeedback – Begründung: Bislang werden Lieferanten

# A7: Wegfall physischer Angebotsmappen (langfristig) – Begründung: Derzeit druckt man

# A8: Erfolgsmessung & Lessons Learned im System – Begründung: Derzeit erfolgen Projekt-

# Zusammenfassung Änderungen: Die Änderungen A1–A6 sind als notwendig identifiziert, da sie klaren

**Auswirkung auf Usability:** Diese Änderungen wurden auch unter Usability-Aspekt geprüft: - A1, A2, A4, A5
verringern manuelle Schritte und steigern Klarheit – positive Wirkung auf Usability (weniger Tools, weniger
Vergessen). - A3 (digitales Briefing zusätzlich) fügt etwas Doku-Aufwand hinzu, aber spart evtl. Rückfragen;
insgesamt dürfte es Effizienz steigern, weil Planer Infos nachlesen können. Mit guter UI (Dropdowns etc.)
wird es nicht zu belastend. - A6 und A8 fügen geringe Zusatz-Aufgaben (Häkchen/Notiz) hinzu – das muss
im Team als wichtig kommuniziert werden, sonst wird's evtl. ignoriert. Wenn aber integraler Teil der
Abschlussroutine, geringes Problem.

Insgesamt sind die vorgeschlagenen Änderungen moderat und folgen dem Prinzip " _digitalisieren, was_
_analog umständlich läuft_ ", ohne die bewährten menschlichen Absprachen (z.B. Meetings) komplett zu
eliminieren, außer wo eindeutig sinnvoll (Folder zu digitaler Ablage). Sie stützen sich alle auf Best Practice
Empfehlungen und adressieren Schwachstellen, die im Interview selbst identifiziert wurden (z.B.
Fehleranfälligkeit, Intransparenz) – jeweils mit nachvollziehbarer Quelle.

# Marktvergleich (fachlich)

Im Folgenden ein
**fachlicher Marktvergleich**
mit ausgewählten relevanten Alternativen und
Referenzprodukten. Basierend auf dem Kontext (CRM- und PM-Kombination im Projektgeschäft Ladenbau)
wurden vor allem Lösungen betrachtet, die **CRM-Funktionalität mit Projektmanagement** vereinen. Wir
analysieren, wie diese Alternativen ähnliche Anforderungen lösen und welche Lücken oder
Differenzierungs-Chancen sich im Vergleich zu unserem Ansatz zeigen.

**Relevante Lösungen/Anbieter:** 1. **Insightly** – Ein CRM mit integriertem Projektmanagement-Modul,
gezielt für Vertrieb + Projektausführung in einem Tool
. 2. **vTiger / SugarCRM** (bzw. deren Forks) – Open-
Source-CRM mit Erweiterungen, teils Projekt-Addons. 3. **Dynamics 365 (Microsoft)** mit **Project Operations**
Modul – Enterprise-Lösung, abdeckend CRM bis Ressourcenplanung. 4. **Salesforce** (mit z.B. _Salesforce PSA_
oder Integration zu e.g. FinancialForce) – High-end CRM, das via Drittmodul Projektaufgaben steuern kann. 5. **Monday.com / Wrike / Asana** – Moderne Work-Management-Tools, die CRM-ähnliche Sales-Tracking an
Bord haben oder durch Apps ergänzen (z.B. Monday hat Sales-CRM-Templates). 6. **Insightly** (siehe 1) und
**Insightly** bereits genannt – doppelt, statt dessen **Insightly, Insightly** einmal, ich korrigiere: Ein weiteres: 7.
**Zoho One (CRM + Projects)** – Zoho bietet sowohl CRM als auch ein Projects-Modul, integriert im gleichen
Ecosystem. 8. **Branchenspezifische Software** : Möglicherweise gibt es spezielle Ladenbau/Einrichtungs-
Branchenlösungen (z.B. pCon.planner for design, aber CRM-Koppel? Unklar). Im Handwerk/Projekt-Bau gibt
es z.B. _pds_ Software
mit CRM+Auftragsabwicklung – allerdings oft mehr ERP-lastig.

# Wir fokussieren auf die, die dem Bedürfnis "CRM + PM" am ehesten entsprechen: Insightly, Monday, und

**Insightly (CRM+Projekt):** - _Ansatz:_ "Work and win deals, then manage those projects – all in the same
tool"
. Das entspricht exakt unserer Vision. Insightly ermöglicht es, aus Opportunities direkt Projekte zu
machen
. - _How it solves Anforderungen:_ Es hat Module für Leads, Contacts, Opportunities (inkl. pipelines)
und Projects. Die Projektfunktion umfasst Aufgaben, Milestones, Kanban-Boards, etc., jedoch primär für
interne Nutzung, nicht komplexes Gantt. Für unser Szenario (viele parallele kleinere Projekte) dürfte es
ausreichen. - _Stärken:_ Einfache, einheitliche UI für beides; umfassende **Reporting** (Dashboards und custom
reports) – sie werben mit "Noble Biomaterials close deals faster... entire team collaborates... capture info,
close opps, then seamlessly push data to each project"
. Also Kollaboration und Infofluss sind top.

# 34

| 174 | . D |
| --- | --- |
| en  | 60  |

Außerdem Schnittstellen (Insightly API) und moderate Kosten. - _Schwächen:_ Evtl. nicht speziell auf Finanz-/
Rechnungswesen fokussiert. Es hat Möglichkeit, z.B. _Payment tracking_ muss man ggf. custom machen oder
via Integration. Unsere Anforderungen wie GoBD wären in Standard-Insightly so nicht 100% (man könnte
Anpassungen, aber kein offizielles Statement). - _Lücke:_ Insightly deckt z.B. **Lieferantenmanagement** nicht
spezifisch – es ist CRM, aber speziell Lieferanten/Qualität? Wohl nur als normale Contact + notizen. Unser
Konzept, Lieferantenleistung zu tracken, wäre custom. - _Usability:_ Gelobt, "easy to adopt and use across
entire org"
. D.h. hohe Erfolgschance, dass Team es annimmt. - _Differenzierungschance:_ Wir könnten uns
von Standard-Insightly differenzieren, indem wir unser System gezielt auf **unsere Branche** zuschneiden –
z.B. Terminierung dreier Rechnungen, Lieferantenbewertung – das kann Insightly nicht out-of-box. - _Quelle_
_Vergleich:_ Insightly Webseite und Customer stories
zeigen, dass _Integration von CRM+Projects_ ein
Trend ist und uns mit unserem Plan auf einer Linie liegt.

# Monday.com (Work OS mit CRM) : - Ansatz: Monday ist primär ein flexibles Work-Management, aber sie

# vTiger/Zoho CRM: - Ansatz: vTiger und Zoho CRM sind klassische CRM (Vertrieb, Marketing, Support) aber

# Microsoft Dynamics 365 Project Operations: - Ansatz: Enterprise-level, deckt von Sales (via Dynamics

komplexe Projekte (mit Aufwandserfassung, Finanzen, sogar Buchhaltung). Wenn wir z.B. ein größeres
Unternehmen wären, wäre das eine Option. - _Schwächen:_ Kosten und Implementierungsaufwand extrem
hoch für KMU. Overkill für unsere Anforderungen. - _Dennoch relevant:_ Es zeigt was möglich ist: komplette
Integration in ERP. Unser Focus aber: keine technischen Arch. - _Differenzierung:_ Wir wollen eine leichtere
Lösung, mit mehr Fokus auf Usability und genau unserem Scope, statt generischem ERP. Also unsere
Chance: _Einfachheit und schnelle Einführung_ . - _Trends:_ Mit Dynamics kann man theoretisch auch IFRS etc.
abbilden, aber wir brauchen das nicht.

**Salesforce + PSA:** - Ähnlich Dynamics in Enterprise. - Würde erfüllen: CRM top notch, plus modul für
Projects (z.B. FinancialForce PSA oder Mission Control). - Aber Implementierung teuer, Bedienung eher für
geübte CRM-User, Anpassung nötig. - Für uns als mittelständischer Ladenbauer wohl zu viel. - Also, diese
Big Guns sind keine echten Alternativen, aber nice to measure against: Wir können sagen, wir bieten 80%
Funktion mit 20% Komplexität.

**Zusammenfassung Vergleich** :

**Funktionsdeckung:** Lösungen wie Insightly und Zoho decken einen großen Teil unserer
Anforderungen ab: 360° Kontakt mgmt, Pipeline, Aufgaben, Projekte, Kollaboration. Zum Teil gibt es
auch Integrationen für Rechnungen (Zoho Books). Sie sind **generisch** und müssen an Branche
angepasst werden (custom fields, workflows). Unsere Ideallösung kennt von Haus aus die
branchenspezifischen Workflows (z.B. _3-teilige Zahlungen_ , _Ladenbau-spezifische Felder wie Ladenfläche,_
_Eröffnungsdatum_ etc.). Das ist ein Differenzierungsmerkmal: ein _vorkonfiguriertes Branchen-CRM-PM_ .
**Usability:** Modern Tools (Monday, Insightly, Nimble) setzen stark auf Nutzerfreundlichkeit – bunte
UI, Drag&Drop, mobile apps. Unsere Lösung sollte hier mithalten. Wir haben den Vorteil, dass wir
unnötigen Ballast weglassen können, was die UI übersichtlicher macht für Nutzer.
**Integrationsfähigkeit:** Gängige CRMs bieten API und viele vorgefertigte Integrationen (MailChimp,
Accounting Softwares). Unsere Lösung müsste zumindest gängige Imports/Exports bieten. Ein
Nachteil, wenn wir eigen entwickeln: weniger sofort verfügbare Integrationen. Das muss durch klare
definierte Schnittstellen (CSV, Rest-API) abgefedert werden.
**DSGVO/GoBD:** Hier haben wir in DE einen speziellen Fokus. Manche US-Software (Monday, Asana)
denken da weniger dran (z.B. kein Konzept von 10-jähriger Archivierung). Unsere Lösung legt darauf
wert, was im hiesigen Markt ein Plus ist.
**Preis & ROI:** Open-Source wie vTiger ist günstig, aber erfordert In-house Setup. SaaS wie Insightly
kostet ~29 USD/User/Mon
, Monday ~10-16 USD/User/Mon
. Unser eigenes System hat
zunächst Entwicklungskosten, aber keine Lizengebühren. Auf Dauer könnte es günstiger sein, v.a.
wenn wir viele Anpassungen bräuchten.
**Fokus Ladenbau (Branchen-Templates):** Keine Mainstream-CRM hat out-of-box Module
"Lieferantenqualität" oder "Montageplanung" speziell. Wir identifizieren das als Lücke, die wir füllen:
z.B. modulare Meilensteinpläne für Filialbau etc. Damit könnten wir am Markt hervorstechen (auch
vlt. später unser Tool an ähnliche Firmen verkaufen).
**Benutzerakzeptanz:** Tools wie Salesforce sind oft gefürchtet wegen Komplexität (Adoption ~26% im
Schnitt
). Wir haben die Chance, unser System genau an die Anwenderbedürfnisse auszurichten,
was adoption erhöht. Und da im Prozessdesign alle Abteilungen einbezogen sind, können wir eine
Lösung liefern, die jeder als Hilfe statt Belastung sieht.

# Gap-Analyse: Unsere Kernanforderungen werden größtenteils von den erwähnten Systemen adressiert,

einen Gap füllt. - **Lieferanten/Reklamations-Tracking** : Standard-CRM würde das nur als Cases abbilden.
Bei uns ist es integraler Bestandteil der Projekt-Nachphase. Das ist ein Alleinstellungsmerkmal für
Branchen, wo Qualitätssicherung wichtig ist. - **Offline-Fähigkeit** : Einige SaaS (Insightly mobile app) bieten
offline read/write für Kontakte und tasks. Monday? Not sicher. Wir sollten es explizit einplanen. - **Deep 360°** :
Manche CRM sind primär Sales-getrieben; sie haben nicht unbedingt Sicht für Planer auf "Materialien" oder
so. Wir definieren Domänen, sodass Planer im CRM Infos finden, die sonst in ERP/CAD stünden (z.B.
Materialwunsch des Kunden). Das cross-funktionale 360° (Vertrieb & Projekt & Finanzen) in einer Lösung ist
auf dem Markt nicht häufig komplett abgedeckt. Tools wie Insightly nähern sich, aber z.B. Financials muss
man an anderer Stelle machen. Unsere Vision umfasst ja zumindest grundlegende Finanz-Infos
(Teilzahlungen etc.). _Marktzitat:_ "Other CRMs that offer project management include Salesforce, Zoho,
Insightly, Dynamics 365"
– aber oft mit Abstrichen in Integrationstiefe. Wir wollen schlank aber
hochintegriert.

# Fazit Marktvergleich: Die Idee, CRM und Projektmanagement zu vereinen, ist zeitgemäß und im Markt

# Offene Punkte & Risiken (fachlich)

Trotz der detaillierten Ausarbeitung gibt es einige **offene Punkte** und **Risiken** auf fachlicher Ebene, die
weiter geklärt oder im Projektverlauf besonders beachtet werden müssen:

**1. Unklare Anforderungen / Detailfragen:**
Einige Anforderungen konnten aus dem Kontext nur implizit abgeleitet werden und bedürfen Präzisierung:

- **Umfang des Finanzmoduls:** Sollen im System auch Einkaufskosten, Margen etc. abgebildet werden? Oder
  nur Rechnungsstellung an Kunden? Aktuell fokussierten wir auf Ausgangsrechnungen. Falls Margen-
  Controlling gewünscht, müsste das ergänzt werden (und Anforderungen entsprechend angepasst). -
  **Rollen- und Rechtekonzept im Detail:** Wir wissen, welche Abteilungen es gibt, aber noch nicht, ob wirklich
  z.B. ein Vertriebsmitarbeiter _keine_ Projekte sehen soll, die er nicht betreut, etc. Wahrscheinlich offene Kultur,
  aber abzustimmen (z.B. darf Innendienst Preise ändern ohne GF-Freigabe? Im Ist wohl ja, aber das System
  könnte Freigabeprozesse unterstützen – Bedarf abklären). - **Dritt-Systeme:** Gibt es ein vorhandenes
  Buchhaltungssystem (Datev oder ERP), mit dem wir _verbindlich_ integrieren müssen? Im Interview erwähnte
  Systeme: DSGVO, GoBD, BITV, aber kein Wort zu existierender Software. Evtl. nutzt Buchhaltung Datev oder
  Lexware. Falls ja, Schnittstellen-Details sind offen (z.B. Import Stammkunden, Export Buchungen). -
  **Datenmigration:** Aus dem Kontext wissen wir nur von Ordnern und Excel-Listen. Offen: Müssen historische
  Daten (alte Projekte, Kundenlisten) ins neue System übernommen werden, oder Neustart? Diese
  Entscheidung beeinflusst Aufwand und Systemeinrichtung erheblich. - **Kapazitätsplanungstiefe:** Sollen
  Planer zeitlich genau geplant werden (z.B. Auslastung in Stunden), oder reicht qualitatives "hat viele
  Projekte parallel"? Der Kontext deutet an, man möchte Überblick, aber kein tiefes Ressourcenmanagement

(daher wurden Planer-KPIs qualitativ genannt
). Offene Frage: braucht man ggf. eine einfache
Kapazitätsanzeige (Ampel pro Person), oder gar nichts? - **Mobile Offline Details:** Der Bedarf ist klar (ADM
offline)
, aber offene Frage: Welche Module offline? Nur Kontakte und Notizen, vermutlich ja. Dies ist
eher tech, aber fachlich: Was macht der ADM, wenn offline? Vermutlich nur Notizen eingeben und
bestehende Kundendaten einsehen. Das definieren hilft, Prioritäten zu setzen (z.B. kein offline Gantt nötig).

- **Wording und UI-Language:** Deutsch vermutlich (da Nutzer deutsch). Aber falls mal Tochter in Ausland,
  Mehrsprachigkeit? Derzeit kein Hinweis, aber im Hinterkopf behalten.

# Wir sollten diese Punkte früh mit Stakeholdern klären, um Missverständnisse zu vermeiden.

**2. Risiken bei Benutzerakzeptanz:**
Ein CRM/PM-System steht und fällt mit der Nutzung durch alle Mitarbeiter. Risiken: -
**Änderungswiderstand:** Mitarbeiter könnten die neuen Prozesse als Mehraufwand sehen (z.B. ADM muss
nach Termin alles im System eintippen statt nur auf Papier). Gerade ältere Kollegen oder solche, die mit
aktuellen manuellen Methoden gut klarkommen, könnten zögern. - **Unvollständige Dateneingabe:** Wenn
z.B. ADMs Leads nicht einpflegen, Marketing aber auf System wartet, entstehen Lücken. Oder Planer
aktualisieren Aufgaben nicht -> Status falsch. Um den _Single Source of Truth_ zu erreichen, muss konsequent
alles ins System – das ist eine Verhaltensänderung. - **Usability-Risiko:** Wenn die Oberfläche oder
Arbeitsfluss nicht gut durchdacht sind, könnten Nutzer frustriert abspringen und wieder Schattenprozesse
(Excel, Notizen) nutzen. Wir haben dem mit Usability-Anforderungen vorgebeugt, doch es bleibt ein Risiko.
Schulung und ggf. Anpassungen nach User-Feedback werden nötig sein. - _Mitigierung:_ Frühzeitige
Einbindung der Key-User in Entwicklung (um Akzeptanz zu erhöhen) und ausreichende Schulungen sind
empfohlen
. CRM-Einführung schlägt oft an Nutzerakzeptanz fehl – das ist uns bewusst und muss
gemanagt werden.

# 3. Datenqualität und -pflege:

# 4. Projektumfang-Ausweitung:

**5. Technische Risiken, die fachlich relevant werden:**

- **Integration Externer Software:** Wenn wir auf Standardsoftware setzen (z.B. anpassen statt eigen
  entwickeln), stellt sich die Frage, ob alle fachl. Anforderungen dort konfigurierbar sind. Bsp: vTiger Projekt-
  Modul – kann es 3-fache Rechnungen? Falls wir Limitierungen feststellen, müssten wir Workarounds
  erarbeiten (Risiko erhöhter Implementierungsaufwand). - **Datenschutz-Umsetzung:** Ein praktisches Risiko:
  Implementierung von "Recht auf Vergessenwerden". Evtl. sind wir rechtlich verpflichtet, Daten zu löschen,
  aber GoBD verpflichtet uns, bestimmte 10 Jahre zu behalten – da kann fachlicher Konflikt entstehen. Z.B. wir

sollten definieren, dass wir Personendaten pseudonymisieren statt komplett löschen in solchen Fällen
(Kompromiss). Das ist sensibel – ein falscher Umgang (zu früh löschen oder gar nicht löschbar) wäre
Regelverstoß. - **GoBD Audit:** Falls die Software mal von Betriebsprüfern angeschaut wird, muss unsere
Verfahrensdokumentation stichhaltig sein. Das ist neu für uns (bisher gab's Papierablage, da gelten
Standardregeln). Wir müssen intern klären, wer diese Doku erstellt und pflegt – ein offener Punkt, aber
relevant.

**6. Zeit- und Kostenschätzungen unklar:** (Zwar nicht rein fachlich, aber Planungs-Risiko) - Wir wissen noch
nicht, ob die Stakeholder eher eine _konfigurierte Standardlösung_ oder eine _Neuentwicklung_ bevorzugen.
Davon hängt vieles ab (Resourcen, Timeline). Fachlich würde Standard evtl. Kompromisse bei
Anforderungen bedeuten, Neuentwicklung Risiko von Kinderkrankheiten. Dieses strategische
Entscheidungsrisiko ist noch offen.

**7. Branchenspezifische Besonderheiten, noch unbeleuchtet:**

- Eventuell gibt es in Ladenbau spezielle Compliance (Arbeitsschutz-Doku? behördliche Genehmigungen?),
  die in Workflows eingeplant werden müssten. Wurde im Interview nicht erwähnt, aber z.B. Montage in
  Laden könnte mit Verantwortlichen und Abnahmen einhergehen. Sollten wir proaktiv prüfen, ob unser
  System dafür Felder braucht (z.B. "Abnahmeprotokoll hochladen" – haben wir generisch unter Dateien,
  okay). - Garantie-/Wartungsprozesse: Machen wir Ladenbau, gibt es evtl. Garantiefristen. Wollen wir z.B. 1
  Jahr nach Abschluss eine Erinnerung, dass alles okay ist (Kundenzufriedenheitsanruf)? Nicht erwähnt, aber
  könnte ein Nice-to-have Service sein.

Wir sollten diese Risiken transparent ansprechen und bei nächsten Schritten priorisieren, welche zu
adressieren sind. Einige – v.a. Nutzerakzeptanz – können wir durch Change Management stark
beeinflussen. Andere – wie Integration vs. Eigenbau – müssen auf Entscheiderebene geklärt werden.

# Empfehlungen für nächste Vertiefung

Um das Konzept in Richtung Umsetzung weiter voranzubringen, sind **vertiefende Recherchen und**
**Validierungen** in folgenden priorisierten Bereichen empfehlenswert:

**Bereich 1: Benutzeranforderungen & Usability-Tests**
_Fragen:_ Wie arbeiten die Endanwender genau und wo sehen sie den größten Nutzen/Hürden? Welche UI-
Designs werden von ihnen bevorzugt?
_Empfehlung:_ Durchführen von **Workshops mit den Persona-Gruppen** (ADM, Planer, Innendienst etc.), um
das Feinkonzept mit echten Nutzungsszenarien zu testen. Beispielsweise ein Klick-Dummy durchspielen
lassen: Kann der ADM in 5 Minuten seinen Kundenbesuch dokumentieren? Was fehlt ihm? Besonders bei
mobilen Use-Cases sollte tatsächliches Feedback eingeholt werden (evtl. mal ADM im Auto "simulieren").
Dies verifiziert unsere Annahmen zu A3 (digitales Briefing), A4 (Task-Handling) etc.
Zudem könnten _Usability-Best-Practices_ für interne Tools tiefer recherchiert werden (aktuelle UI/UX Pattern
für CRM, z.B. von Nielsen Norman Group oder Material Design guidelines). Ziel: Das UI so gestalten, dass
Adoption erleichtert wird (z.B. Eingabe so weit wie möglich vor-ausfüllen, gamification-Elemente für CRM-
Pflege vielleicht).

**Bereich 2: Datenschutz & Compliance Details**
_Fragen:_ Wie genau muss z.B. eine GoBD-Verfahrensdoku aussehen? Welche technischen Maßnahmen sind

minimal erforderlich für DSGVO (z.B. Verschlüsselung, 2-Faktor Auth)?
_Empfehlung:_ Rücksprache mit einem **Datenschutzbeauftragten** bzw. Rechtsberater, um unser Konzept zu
validieren. Insbesondere der Mechanismus zur Datenlöschung (Pseudonymisierung vs. Löschen) muss
abgenommen werden. Eine Checkliste "GDPR features every CRM must provide"
haben wir bereits
– die Umsetzung jedes Punktes sollte mit IT-Security abgestimmt werden. Ebenso GoBD: eventuell ein IT-
Prüfer oder Steuerberater zu Rate ziehen, um sicherzustellen, dass z.B. unser Änderungslog auditorisch
akzeptiert wird. Evtl. bestehende Normen (IDW PS 880 Zertifizierungskriterien) heranziehen. Diese
Vertiefung minimiert Risiko späterer Beanstandungen.

# Bereich 3: Technische Machbarkeit & Tool-Auswahl

**Bereich 4: Detail-Konfiguration der Workflows**
_Fragen:_ Welche Felder genau brauchen wir pro Modul? Wie nennen wir Phasen? Welche Regeln (z.B.
Angebot muss genehmigt werden >50k€)?
_Empfehlung:_ Erstellen von **Field- und Workflow-Definitionsdokumenten** gemeinsam mit Key-Usern. Etwa:
Opportunity-Phase Definition Workshop – Ziel: Auf alle einigen, wann Phase wechselt und welche
Wahrscheinlichkeit dran hängt (so wird Forecast belastbar). Ebenso für Projekt-Template: eine Sitzung mit
Planern und Innendienst, um Standardaufgaben und Meilensteine festzulegen. Dies stellt sicher, dass das
System zum Go-Live optimal eingestellt ist und alle Begriffe verstehen (Change-Management Aspekt).
Ergebnis könnte eine Art **Playbook** sein, das dann für Schulungen genutzt wird ("Bei Status X musst du Y
tun im System").

**Bereich 5: Testlauf & Pilotierung**
Nach Konzept-Finalisierung und ggf. Umsetzung in einem System, ist eine _Pilotphase_ ratsam. Hier Fragen:
Greifen alle Teile sauber ineinander? Tauchen unerwartete Lücken auf (z.B. "wir haben vergessen, dass wir
zwei parallele Angebote pro Kunde manchmal haben!")?
_Empfehlung:_ Einen **Probebetrieb mit einem Projektteam** machen. Beispiel: Der nächste neu akquirierte
Kunde wird komplett im System abgewickelt, parallel führen wir alt noch in Ordner falls was schief geht.
Dabei beobachten: Wurden alle Infos gefunden? Hat jeder gewusst, was zu tun ist? Kamen widersprüchliche
Daten?
Insbesondere den **Rechnungslauf** einmal simulieren (Testkunde, fiktive Summen) – damit Buchhaltung
checkt, ob Formate stimmen, und GF sieht ob Auswertungen plausibel rauskommen. Die Pilot-Erkenntnisse
fließen dann in Feinjustierung (vielleicht Felder hinzufügen, Reports anpassen).

**Bereich 6: Ausbaufähigkeit und Zukunftsideen validieren**
Zwar sollen wir scope klein halten, aber ein Auge auf Zukunft: Falls das Unternehmen wächst oder neue

---

_Page 41_

---

Anforderungen (z.B. Service/Wartungsverträge) kommt, wie flexibel ist unser Modell?
_Empfehlung:_
Mit Geschäftsführung durchgehen: Welche zukünftigen Geschäftsmodelle oder
Organisationänderungen könnten kommen? (z.B. bieten wir später Wartung an? Dann bräuchten wir Ticket-
System; oder expandieren wir geographisch? Dann Multi-Language/UI Zeitzonen?). Solche "was wäre
wenn"-Gedanken helfen, die Architektur so zu gestalten, dass Erweiterung möglich ist (Beispiel: Ein Feld
"Servicevertrag vorhanden?" könnte man schon vorsehen, falls geplant).
Auch mal KI-Einsatz evaluieren: z.B. könnte man KI-gestützt Notizen analysieren oder Forecast verbessern.
Noch nicht im MVP, aber potenzieller Wettbewerbsvorteil mittelfristig.

Jede dieser Vertiefungen zielt darauf, **Risiken zu minimieren** und die Lösung optimal passend zu machen,
bevor wir in umfangreiche Implementierung gehen. Prioritär sehe ich **User-Involvement (Bereich 1)** und
**Compliance-Check (Bereich 2)** , da hier die größten Stolperfallen liegen – Nutzerakzeptanz und rechtl.
Korrektheit. Bereich 3 (Tech) ist ebenfalls wichtig, denn wenn wir z.B. auf Insightly setzen wollen, müssen
wir früh wissen, ob es passt oder nicht. Die Ergebnisse all dieser Vertiefungen sollten in ein endgültiges
Feinkonzept sowie einen Implementierungsplan einfließen.

# Quellen

**Nimble Blog –** **_Expert Picks: 5 Best CRMs for Project Management_** (Gabrielle Lohr, Nimble, 9. Jan. 2024) – _Übersichtsartikel zu CRM-Systemen mit Projektmanagement. Enthält Vorteile von CRM-PM-_
_Integration und nennt Beispiele wie Nimble, Wrike, Monday, Insightly, vTiger. Relevant für Best Practices_
_und Marktvergleich._

1.

# Insightly (Website) – CRM with Project Management Built In (Insightly Inc., abgerufen Nov. 2025) –

2.

# Interview-Transkript „SG_Interview_31.10.25 (deutsch)“ (Firmenintern, Oktober 2025) – Wörtliches

3.

# Zendesk Blog – What is a 360 customer view? (Jacqueline Janes, Zendesk, 27. März 2024) –

4.

# AgileCRM Blog – 14 mind-blowing statistics that prove the need for a CRM (AgileCRM, 28. Feb. 2019)

5.

# Interview-Zusammenfassung/Auswertung (Firmenintern) – Verdichtete Zusammenfassung des

6.

# 41

**GoBD-Leitfaden –** **_Zentrale GoBD-Anforderungen_** (TeamDrive Whitepaper, 2023) – _Fasst deutsche_
_GoBD-Grundsätze zusammen. Wichtig für uns: Unveränderbarkeit, Nachvollziehbarkeit und_
_revisionssichere Archivierung elektronischer Belege._

7.

# Zeeg Blog – CRM GDPR Compliance: A Guide (Doğa Kaplan, Zeeg, 22. Juli 2025) – Guide zu DSGVO-

8.

# Insightly Help Center/Blog – Mehrere Insightly-Artikel (2023) – Beschreiben Integration von Sales und

9.

# PickMyCRM Survey (zitiert im Nimble Blog) – Statistik: 87% der befragten Unternehmen sehen bessere

10.

_186_

# Hinweis: Die firmeninternen Interview-Quellen (Nr. 3 und 6) sind nicht öffentlich, wurden aber als Basis aller

CRM Project Management | Insightly

## https://www.insightly.com/crm-project-management/

# sg_interview_31.10.25_deu.txt

file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### GoBD: Die Grundsätze für elektronische Buchführung - TeamDrive

## https://teamdrive.com/wissen/gobd/

### CRM GDPR Compliance: A Guide to Customer Data Management -

## https://zeeg.me/en/blog/post/crm-gdpr

### Expert Picks: 5 Best CRMs for Project

## https://www.nimble.com/blog/crm-for-marketing-campaigns/

### 14 mind-blowing statistics that prove the need for a CRM - Agile CRM Blog

## https://www.agilecrm.com/blog/statistics-that-prove-the-need-for-a-crm/

### What is a 360 customer view? (+ 3 tips for creating your own)

## https://www.zendesk.com/blog/why-a-360-degree-customer-view-is-key-to-customer-service/

### 42

| 3   | 4   | 5       | 6     | 7 51 84 |     | 8 52 85 | 9 53 86 | 10  |     | 11  |     | 12  |     | 13  | 14 58 91 | 15 59 94 | 16  | 22      | 23  |     | 28  |     | 29  |     | 30  |     | 31  |     |     | 32  |     |     | 33  |     |     |     | 34  | 35 71 |     | 36  |     |     | 37  |     | 38  |     | 39  |     |     | 41  |     | 42  |
| --- | --- | ------- | ----- | ------- | --- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 44  | 45  | 48      | 49    |         |     |         |         | 54  |     | 55  |     | 56  |     | 57  |          |          | 61  | 62      | 63  |     | 64  |     | 65  |     | 66  |     | 67  |     |     | 68  |     |     | 69  |     |     |     | 70  |       |     | 72  |     |     | 73  |     | 74  |     | 75  |     |     | 76  |     | 77  |
| 78  | 79  | 80      | 81    |         |     |         |         | 87  |     | 88  |     | 89  |     | 90  |          |          | 95  | 96      | 97  |     | 98  |     | 99  |     | 100 |     | 101 |     |     | 102 |     |     |     | 103 |     |     | 104 |       | 105 |     |     | 106 |     | 1   | 07  | 1   | 08  |     | 109 |     |     | 110 |
| 111 | 112 | 117 150 | 12 15 | 2 1     | 123 | 124 153 | 12 15   | 5 4 | 12  | 6 5 | 12  | 7 6 | 128 |     | 129      | 130      | 131 | 134 161 |     | 135 |     | 13  | 6 4 | 13  | 7 5 | 138 |     |     | 139 |     |     | 140 |     |     |     | 141 |     | 142   |     | 143 |     |     | 144 |     | 145 |     |     |     |     |     | 14  |     |
| 148 | 149 |         |       |         | 152 |         |         |     | 15  |     | 15  |     | 157 |     | 158      | 159      | 160 |         |     | 163 |     | 16  |     | 16  |     | 166 |     |     | 167 |     |     | 168 |     |     |     | 169 |     | 172   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |

Can Your CRM Help You With GDPR Compliance? - Cookie Law Info

## https://www.cookielawinfo.com/crm-gdpr-compliance/

### Designing for Web Accessibility – Tips for Getting Started - W3C

## https://www.w3.org/WAI/tips/designing/

### GoBD: Anforderungen und Nutzen für das Handwerk - pds GmbH

## https://pds.de/unternehmen/blog/beitrag/gobd-anforderungen-nutzen

### 43

# Projektkonzept: Integriertes CRM- und

### 1. Executive Summary

Das Ziel der geplanten Lösung ist ein integriertes CRM- und Projektmanagement-Tool, das die
abteilungsübergreifenden Arbeitsprozesse eines Ladenbau-/Innenausbau-Unternehmens nahtlos
unterstützt
. Alle relevanten Kundeninformationen und Projektdaten sollen zentral in einer Anwendung
verfügbar sein, um eine 360°-Sicht auf jeden Kunden und jedes Projekt zu ermöglichen
. Damit
werden Vertriebsprozesse (CRM) und Projektabwicklung in _einem_ System vereint, sodass die Übergabe vom
Verkauf an die Umsetzung reibungslos verläuft und Doppelarbeit sowie Medienbrüche entfallen
.

# Die wichtigsten Neuerungen gegenüber dem heutigen Zustand sind die Erweiterung des Finanzmoduls um

# Eine vollständige Anforderungsübersicht wurde erarbeitet, priorisiert in Muss-, Soll- und Kann-Kriterien.

# Ein Marktvergleich zeigt, dass bereits Lösungen existieren, die CRM und Projektmanagement vereinen (z.B.

schaffen wir eine 360°-Kundensicht und Projektsteuerung unter einem Dach, was die Effizienz steigert und
langfristig Wettbewerbsvorteile bringt
.

# 2. Rahmenbedingungen & Annahmen

**Branche & Geschäftsmodell:** Die Anwendung richtet sich an ein Unternehmen im Ladenbau/Innenausbau
mit Spezialisierung auf Hofläden, Winotheken, Gärtnereien, Selbstbedienungsläden (Container-24/7),
Hofcafés und gastronomische Direktvermarkter. Projekte sind meist kundenspezifische Einrichtungen von
Ladenlokalen, inkl. Entwurf, Fertigung (über Partner wie Schreinereien) und Montage vor Ort
. Die
Projektlaufzeiten betragen oft mehrere Monate und können auch über einen Jahreswechsel hinausgehen
. Der Vertrieb erfolgt teils über Kaltakquise und persönliche Beratung durch Außendienstmitarbeiter. Es
gibt wiederkehrende Branchentermine (z.B. Fachmessen für Direktvermarkter oder die “grüne Branche”),
bei denen gezielt passende Kunden eingeladen werden sollen
.

# Organisatorischer Rahmen: Das Unternehmen ist in mehrere Abteilungen aufgeteilt (entsprechend den

# Technische Rahmenbedingungen: Technologische Entscheidungen sind explizit ausgeklammert. Es geht

# Compliance & Datenschutz: Da Kundendaten verarbeitet werden, muss das System DSGVO-konform sein.

**Nutzer & Mehrsprachigkeit:** Die Hauptnutzer sind deutschsprachig, daher wird die erste Auslieferung auf
Deutsch erfolgen. Das Systemdesign soll jedoch mehrsprachig ausgelegt sein, damit z.B. eine englische
Version (für eventuell internationale Partner oder eine Expansion) ohne größere Umbauten bereitgestellt
werden kann. Technisch bedeutet dies, dass UI-Texte in Ressourcen hinterlegt und dynamisch austauschbar
sind. Viele etablierte CRM-Systeme unterstützen mehrere Sprachen out-of-the-box (SugarCRM z.B. über 30)
– unsere Anwendung soll hier mittelfristig mithalten. Dateninhalte (z.B. Projektnotizen) werden
voraussichtlich weiterhin in Deutsch sein, aber Feldnamen, Buttons etc. sollen lokalisierbar sein.

# Weitere Annahmen: Die Einführung des Systems wird in enger Abstimmung mit den Nutzern erfolgen. Es

# 3. Personas

**Außendienstmitarbeiter (ADM) – Vertrieb im Außendienst:**
_Rolle & Aufgaben:_ Der Außendienstmitarbeiter ist für die Akquise und Betreuung von Kunden vor Ort
zuständig. Er besucht neue und bestehende Kunden (Einzelhändler, Direktvermarkter etc.), führt
Beratungsgespräche und verfolgt Angebote bis zum Abschluss. Er ist die zentrale Schlüsselpersona, die das
CRM am intensivsten nutzen wird, da er die meisten Kundendaten zuerst erfasst und initiiert
.
Umgebung & Arbeitsweise: Der ADM ist viel unterwegs (mit dem Auto) und häufig beim Kunden. Er hat
zwar ein Laptop dabei, dieser ist aber nicht immer verfügbar oder online
. Während Kundenterminen
vermeidet er aus Höflichkeit die aktive Dateneingabe am Gerät, sondern macht handschriftliche Notizen auf
Papier. Unmittelbar nach Terminen (z.B. im Auto) dokumentiert er die gewonnenen Informationen oft per
Sprache (Diktiergerät oder Sprachmemo am Handy)
, um nichts zu vergessen, bis er die Notizen später
digital nachpflegen kann. Touren und Kundenbesuche plant er eigenständig im Voraus und er erfasst sie
nachträglich für die Statistik und Spesenabrechnung (derzeit in Excel/Spesenformularen)
. Aktuell
werden neue Kontaktberichte per E-Mail an die Marketingabteilung geschickt, die sie in Word aufbereitet –
ein umständlicher Prozess
, den der ADM als fehleranfällig empfindet (mehrfache
Informationsübergaben, manuelle Ablage).

# Ziele:

_Pain Points:_

- **Medienbrüche & Nacharbeit:** Er muss Notizen vom Papier erst später ins System übertragen
  (Doppelarbeit) und aktuelle Ordnerstrukturen pflegen. Das führt oft zu Verzögerungen und der Gefahr, dass
  Infos verlorengehen oder Kollegen sie nicht rechtzeitig erhalten
  .
- **Unterwegs offline:** Schlechte Internetverbindung unterwegs erschwert den Zugriff auf digitale
  Informationen in Echtzeit. Aktuell hat er kein mobiles CRM – d.h. wichtige Daten stehen ihm unterwegs
  nicht direkt zur Verfügung, was z.B. spontane Kundenanfragen schwierig macht
  .
- **Aufgaben-Flut:** Follow-Ups (z.B. versprochener Rückruf, Angebot nachfassen) muss er sich selbst merken
  oder separat notieren. Es fehlt ein systematisches Aufgabenmanagement; nichts darf „durchrutschen“
  .
- **Reporting-Druck:** Er muss intern Bericht erstatten (z.B. Pipeline, Besuchsberichte, Spesen). Ohne
  zentrales System bedeutet das viel manuellen Aufwand (Excel-Listen, Word-Berichte erstellen)
  .
- **Vertriebsfokus vs. Doku:** Er möchte lieber verkaufen als dokumentieren. Wenn die CRM-Nutzung zu
  umständlich ist, könnte er sie umgehen
  .

# Neue Bedürfnisse: Der ADM benötigt mobile, offline-fähige Funktionen – er will unterwegs Kundendaten

# Innendienst (Backoffice & Kalkulation):

# Ziele:

aktuelle Grundrisse vom Planer oder auf Lieferzusagen der Partner. Ziel ist, dass er Kunden oder Kollegen
unmittelbar Auskunft geben kann, ohne lange suchen zu müssen.

- **Lieferantenmanagement:** Er pflegt Beziehungen zu verlässlichen Lieferanten. Ein Ziel ist, die Leistung
  der Partner einschätzen zu können (Termintreue, Qualität), um bei zukünftigen Projekten die besten
  auszuwählen. Daten wie Reklamationsraten sollen auswertbar sein
  .

# Pain Points:

_Neue Bedürfnisse:_ Der Innendienst braucht ein **zentrales Aufgaben- und Projektmanagement-Tool** . Alle
Vorgänge eines Projekts – von _“Lieferant ABC beauftragen”_ über _“Montagetermin koordinieren”_ bis _“Rechnung_
_anstoßen”_ – sollen im System geplant und mit Fristen versehen sein. Das System soll automatisch erinnern,
wenn Fristen nahen oder überschritten werden
. Außerdem wünscht sich der IDM ein **Projektcockpit** , in
dem er auf einen Blick sieht: aktuelle Phase, nächste Meilensteine, offene Punkte, Status der Lieferungen.
Besonders wichtig: eine Art _“Ampel”_ für kritische Aufgaben (wenn z.B. ein Lieferant überfällig ist, wird das
Projekt gelb/rot markiert). Auch die teamübergreifende Kommunikation soll vereinfacht werden: ein
Kommentar- oder Chat-System im Kontext eines Projekts wäre hilfreich, damit nicht alles per E-Mail laufen
muss. **Zeiterfassung:** Der Innendienst stempelt derzeit seine Zeiten projektbezogen in TimeCard und muss
Berichte daraus ziehen – künftig möchte er direkt im CRM seine Stunden eingeben können, was
Doppeleingaben eliminiert. Schließlich erwartet er durch das System eine Entlastung bei Routineaufgaben:
z.B. automatische Generierung von standardisierten Dokumenten (Angebotsvorlagen, Bestellungen) mit
allen hinterlegten Daten, anstatt sie manuell zu schreiben.

# Planer (Technische Planung/Design):

# Ziele:

keine unrealistischen Entwürfe zu erstellen.

- **Effiziente Zusammenarbeit:** Der Planer ist darauf angewiesen, rechtzeitig alle nötigen Inputs vom
  Vertrieb zu bekommen (Maße, Produktwünsche, Markenrichtlinien des Kunden). Ebenso will er dem
  Innendienst seine Ergebnisse (Pläne, Stücklisten) leicht verfügbar machen, damit diese weiterverwendet
  werden können.
- **Versionierung & Dokumentation:** Bei Änderungen (und die gibt es fast immer) möchte er nicht den
  Überblick verlieren. Sein Ziel ist, alle Planungsstände sauber zu dokumentieren, damit ersichtlich bleibt,
  welche Version freigegeben wurde.
- **Kapazitätsauslastung im Griff:** Planer arbeiten oft an mehreren Projekten parallel. Er wünscht sich
  Transparenz über seine eigene Aufgabenlast und die des Planungsteams insgesamt, um Prioritäten bei
  Engpässen klar zu kommunizieren.

_Pain Points:_

- **Verteilte Arbeitsmittel:** Aktuell werden Zeichnungen in _pCon.planner_ oder CAD-Programmen erstellt und
  dann als PDFs in Ordnern abgelegt. Es gibt kein zentrales Projektinformationssystem, in dem z.B. der
  aktuelle Grundriss für alle abrufbar wäre – stattdessen müssen Kollegen den Planer direkt fragen. Das
  kostet Zeit und birgt die Gefahr, dass mit veralteten Plänen gearbeitet wird.
- **Unklare Anforderungen zu Projektstart:** Nicht immer fließen alle vertrieblichen Infos strukturiert an den
  Planer. Wenn z.B. im Kundengespräch schon bestimmte Materialpräferenzen geäußert wurden, erfährt er
  das evtl. nur mündlich. Fehlende Infos führen zu Rückfragen und Verzögerungen.
- **Keine formale Änderungsverfolgung:** Änderungen am Design oder in der Ausführung (z.B. Kunde
  wünscht kurzfristig anderes Dekor) werden nicht einheitlich erfasst. Dadurch können Missverständnisse
  auftreten, wer was beschlossen hat.
- **Überlastungsspitzen:** Ohne Überblick über die Pipeline kann es passieren, dass mehrere Projekte
  gleichzeitig in die heiße Phase gehen und das kleine Planungsteam überlastet ist. Frühwarnindikatoren für
  solche Situationen fehlen aktuell.

_Neue Bedürfnisse:_ Der Planer benötigt ein integriertes **Projekt-Repository** . Alle projektbezogenen Dateien –
vom ersten Entwurf bis zu Fotos des fertigen Ladens – sollten im System versioniert und geordnet abgelegt
sein, anstatt in einer losen Ordnerstruktur
. So könnten z.B. der Innendienst oder Marketing jederzeit
die aktuellen Pläne einsehen, ohne Rückfrage. Änderungen sollten dokumentiert werden (Wer hat wann
was aktualisiert?), um Nachvollziehbarkeit zu garantieren. Für das **Projektmanagement** wünscht sich der
Planer klare Meilensteine und Aufgabenlisten, damit er weiß, bis wann er welche Planungsleistungen
liefern muss. Branchenüblich wäre ein _Phasenmodell_ (Entwurf -> Werkplanung -> Fertigung -> Montage) mit
definierten Outputs je Phase
. Das System sollte diese Struktur bereitstellen. Zudem ist eine
**Kapazitätsplanung** hilfreich: Der Planer würde gerne sehen, wie viele Projektstunden ihm in den
kommenden Wochen zugeteilt sind (ggf. visualisiert als Kalender oder Auslastungsbalken), um Engpässe zu
erkennen. Mittelfristig erwartet er, dass er seine Projektzeiten nicht doppelt (im Planungsbericht _und_ in
TimeCard) erfassen muss, sondern nur noch an einer Stelle – idealerweise direkt auf Aufgaben im Projekt.
So kann er am Projektende einfach Bericht erstatten, ob der Planungsaufwand im Rahmen blieb.

# Buchhaltung:

prüfen. Die Buchhaltung arbeitet eng mit dem Steuerberater (Datev-Export) zusammen und verwaltet
intern auch Personalabrechnungen etc., was aber außerhalb des CRM/PM-Scopes liegt (Lexware deckt dies
ab).

_Ziele:_

- **Rechtzeitige Rechnungsstellung:** Sicherstellen, dass alle vereinbarten Abschläge und Schlusszahlungen
  termingerecht in Rechnung gestellt werden, um den Cashflow des Unternehmens zu sichern
  . Das
  System soll automatische Hinweise geben, wann welche Rechnung fällig ist, statt dass der Vertrieb die
  Buchhaltung manuell erinnern muss
  .
- **Minimierung offener Posten:** Ziel ist, dass Kunden zügig zahlen und offene Forderungen nicht aus dem
  Ruder laufen. Die Buchhaltung möchte auf einen Blick sehen, welche Rechnungen überfällig sind, um
  Mahnungen auszulösen.
- **Transparenz der Projektfinanzen:** Alle projektrelevanten Kosten und Erlöse sollen im System
  nachvollziehbar sein. Die Buchhalterin will am Ende eines Projekts ohne manuelle Sammelarbeit sehen
  können, wie die Marge ausfällt (Angebot vs. tatsächliche Kosten).
- **Compliance & Dokumentation:** Steuerprüfungen sollen problemlos bestanden werden. Dazu müssen
  alle Rechnungen und Belege lückenlos dokumentiert und auf Knopfdruck abrufbar sein. Änderungen an
  finanzrelevanten Daten müssen historisiert werden
  (z.B. keine nachträgliche Manipulation von
  Rechnungen ohne Protokoll). Auch intern will sie eine saubere Trennung: Der Vertrieb soll z.B. Angebote
  erstellen können, aber Preise nicht ohne Rücksprache nachträglich ändern.

# Pain Points:

# Neue Bedürfnisse: Die Buchhaltung profitiert erheblich von einer engen Verzahnung zwischen CRM/PM-

---

_Page 51_

---

sie eine Aufgabe “Schlussrechnung stellen”, anstatt vom Vertrieb per Mail erinnert werden zu müssen
.
Für das **Mahnwesen** wären automatische Vorschläge wünschenswert (Liste überfälliger Posten mit
vorbereiteten Mahnschreiben). Nicht zuletzt denkt Buchhaltung an
**Auswertungen** : z.B.
Zahlungseingangsquoten, Projektmargen, Umsatz pro Quartal – vieles davon kann Lexware liefern, aber sie
würde solche Kennzahlen gern auch im CRM sehen, damit die Geschäftsführung diese selbst abrufen kann.

# Geschäftsführung (GF):

_Ziele:_

- **Transparenz in Pipeline & Auftragslage:** Der GF möchte stets wissen, wie viele Leads und Opportunities
  im Rennen sind und wie hoch die Wahrscheinlichkeit ist, die Quartalsziele zu erreichen
  . Ebenso
  interessiert ihn der aktuelle Auftragsbestand und ob genügend Folgeprojekte in der Pipeline sind, um die
  Fertigungsteams auszulasten.
- **Projektstatus-Kontrolle:** Für jedes wichtige Projekt will er bei Bedarf den Status abrufen können: _“Ist der_
  _neue Hofladen für Kunde X im Plan? Gibt es Risiken wegen Lieferverzug?”_ . Idealerweise sieht er in einer
  Ampelübersicht alle Projekte mit ihrem Fortschritt und kann bei roten Ampeln nachfragen
  .
- **Finanzielle Steuerung:** Die GF benötigt aktuelle Zahlen: Umsatz laufendes Jahr vs. Vorjahr, Kosten,
  Gewinn und Cashflow-Prognosen. Auch projektbezogene Profitabilität interessiert ihn – z.B. welche
  Projekttypen bringen hohe Margen, wo liegen häufig Überziehungen. Diese Daten möchte er ohne langes
  Zusammenstellen einsehen.
- **Strategische Entscheidungen stützen:** Er möchte anhand der Daten entscheiden können, wo investiert
  oder gegengesteuert wird. Etwa: lohnt es sich, in ein bestimmtes Kundensegment mehr Marketing zu
  stecken? Müssen Preise angepasst werden, weil mehrere Projekte nur mit geringer Marge abgeschlossen
  wurden? Hierzu braucht er verlässliche Auswertungen und Zeitvergleiche.

# Pain Points:

formlos (per Zuruf/E-Mail). Dadurch fehlt manchmal die Nachvollziehbarkeit, wer was genehmigt hat, was
bei Fehlern problematisch sein kann.

_Neue Bedürfnisse:_ Für die GF ist ein **Management-Dashboard** unabdingbar. Dieses sollte übersichtlich die
wichtigsten KPIs anzeigen: Vertriebsstand (z.B. Summe Angebote und deren Wahrscheinlichkeit),
Projektstatus (Ampel je Projekt, vielleicht gefiltert nach Größe), Finanzübersicht (Umsatz, offene Posten,
Kostenstruktur). Sie möchte aus dem Dashboard bei Bedarf in Details springen können – etwa in die 360°-
Sicht eines bestimmten Kunden, um dessen komplette Historie und aktuelle Vorgänge zu sehen
. Ein
zentrales **Projektcontrolling-Modul** ist der GF besonders wichtig: Plan-/Ist-Vergleiche pro Projekt auf
Knopfdruck, inklusive Visualisierungen der Abweichungen
. So erkennt sie _“Projekt A hat 15% mehr_
_Stunden verbraucht als geplant – warum?”_ und kann Gegenmaßnahmen einleiten oder bei neuen Projekten
andere Kalkulationsansätze wählen. Sie legt Wert darauf, dass das System **mehrsprachigkeitsfähig** ist –
falls die Firma expandiert oder internationale Mitarbeiter einstellt, dürfen keine technischen Hürden
bestehen (mehrsprachige UI und Dokumente). Optional möchte sie mittelfristig **Freigabeprozesse**
definieren können, z.B. dass größere Rabattentscheidungen im System durch sie abgenickt werden müssen
(aktuell vertraut sie dem Team hier, aber es soll eine Kontrollmöglichkeit geben)
. Insgesamt erwartet
der GF, dass das System zu einem _“Single Source of Truth”_ für alle Geschäftsbereiche wird und so die
Abhängigkeit von personengebundenem Wissen reduziert. Er möchte nicht mehr Stunden aufwenden
müssen, um sich anhand von separaten Listen zu _“verstehen, was hier los ist”_ , sondern Informationen _schnell_
_erfassen_ können
.

# Marketing/Grafik:

# Ziele:

# Pain Points:

Projekt-Story zusammenzustellen. Fotos liegen auf dem Netzlaufwerk, technische Details beim Innendienst,
Kundenzitate werden per E-Mail erfragt. Dieser Prozess ist mühsam und führt teils zu Verzögerungen, bis
Material fertig wird.

- **Segmentierung nur mit manuellen Listen:** Für Einladungen und Mailings führt Marketing Excel-Listen
  (z.B. aller Winzer-Kunden). Diese Listen aktuell zu halten, ist aufwändig – oftmals muss Marketing doch
  beim Vertrieb nachfragen, ob z.B. Kunde X noch aktiv ist oder wer zur Kategorie Y gehört.
- **Kein Feedback-Loop:** Marketing erfährt derzeit nur sporadisch, ob aus einem Lead tatsächlich ein Auftrag
  wurde. Mangels CRM-Einblick kann sie den Erfolg einer Messe oder Kampagne kaum beziffern. Dadurch
  fällt eine gezielte Steuerung des Marketingbudgets schwer.
- **Aufwand für Content-Erstellung:** Geschichten schreiben, Bilder bearbeiten etc. kostet viel Zeit. Wenn
  parallel drängende Aufgaben kommen (neue Angebote, Messevorbereitung), bleibt oft wenig Raum, die
  schönen Erfolgsgeschichten zu produzieren – obwohl sie fürs Branding wichtig wären.

_Neue Bedürfnisse:_ Das CRM-System soll Marketing in die Lage versetzen, **Zielgruppenlisten** einfach auf
Basis der Kundendatenbank zu erstellen. Beispielsweise soll eine Abfrage möglich sein: _“Alle Kunden vom Typ_
_Gärtnerei in einem Umkreis von 200 km”_ – das System generiert eine Liste, ohne dass händisch Excel-Listen
gepflegt werden müssen
. Zudem sollte bei jedem Lead/Kunden hinterlegt sein, über welche **Quelle**
er ins Unternehmen kam (z.B. _Leadquelle = “Messe Agrar 2025”_ ). So kann später ausgewertet werden, wie
viele Aufträge aus welcher Quelle resultierten, um Marketingmaßnahmen besser zu bewerten
. Für die
Referenzaufbereitung wird erwartet, dass Marketing **Zugriff auf Projektdaten** hat – konkret: Ist ein Projekt
abgeschlossen, kann Marketing im System alle zugehörigen Bilder, Grundrisse und Kennzahlen finden,
ohne extra den Innendienst fragen zu müssen
. Das System könnte dazu z.B. pro Projekt einen Satz
“Marketingdaten” aufnehmen (Projektgröße, besonderes Highlight, Zitat des Kunden), den Marketing dann
für Texte nutzen kann. Außerdem wünscht sich Marketing, dass **Dokumentvorlagen** zentral gepflegt
werden: z.B. eine Angebots-PDF-Schablone, die sie einmal im Corporate Design gestaltet und die das CRM
für alle Angebote verwendet. So ist sichergestellt, dass alle Kunden ein konsistentes Bild der Firma erhalten.
Letztlich soll das CRM es Marketing erleichtern, ihren Erfolg intern darzustellen – etwa durch Berichte wie
_“Anzahl neuer Leads pro Monat”_ oder _“Opportunities nach Kampagne”_ . Damit kann sie der GF belegen, welche
Aktivitäten sich lohnen.

# 4. Fachliche Domänen

Die fachlichen Funktionen der Lösung lassen sich in mehrere Domänen gliedern, welche die End-to-End-
Prozesse vom ersten Kundenkontakt bis zum Projektabschluss abbilden
. Diese Module sind nahtlos
verzahnt und ermöglichen gemeinsam die gewünschte 360°-Sicht. Im Folgenden die Übersicht der
Domänen und ihrer zentralen Features:

# Kontakt- & Kundenverwaltung: Dieses Modul bildet die Grundlage (CRM-Kern). Es verwaltet alle

# 10

Wissensinseln zu vermeiden
. Funktionen wie Schnellsuche, Filter (nach Region, Branche etc.) und
Tags erleichtern das Finden von Kunden für Marketing und Vertrieb.

# Lead- & Opportunity-Management (Vertrieb): Dieser Bereich unterstützt den Verkaufsprozess

# Angebotswesen & Kalkulation: Dieses Modul unterstützt die Erstellung und Verwaltung von

# Projektplanung & -durchführung: Dieses Modul bildet die operative Umsetzung der Aufträge ab.

Vertrags-/Auftragswert, geplanter Start- und Endtermin, Projekttyp, zuständiger Projektleiter etc.)
und Verknüpfungen (zugehöriges Angebot, verantwortliche Mitarbeiter, Lieferanten). Wichtig: Wenn
das Projekt aus einer Opportunity generiert wurde, entfallen manuelle Doppeleingaben – alle
zentralen Infos sind schon vorhanden
. **Projektstruktur & Aufgaben:** Das System bietet
Vorlagen für typische Ladenbau-Projektstrukturen
. Beispielsweise können Phasen definiert sein
(Planung, Fertigung, Montage, Nachbereitung) mit jeweils standardisierten Aufgaben (z.B.
_“Werkplanung erstellen”_ ,
_“Material bestellen”_ ,
_“Bauabnahme durchführen”_ ). Diese Vorlagen
beschleunigen die Planung, sind aber anpassbar. Jeder Aufgabe wird ein Verantwortlicher (Benutzer
oder Rolle) und ein Fälligkeitsdatum zugewiesen. Abhängigkeiten können eingestellt werden (z.B.
Aufgabe “Möbel bestellen” muss spätestens 8 Wochen vor Montage erledigt sein) – das System soll
den Planer warnen, falls Termine kollidieren oder _“Deadline verpasst!”_ -Situationen drohen
. Die
Visualisierung kann über Gantt-Charts oder Kanban-Boards erfolgen, ist aber in erster Linie
zweckmäßig (für KMU ausreichend ist oft eine sortierbare Aufgabenliste mit Ampel-Status).
**Meilensteine:** Wichtige Etappen (z.B. “Entwurf freigegeben”, “Montage fertig”) werden als
Meilensteine im Projekt festgehalten. Der Gesamtprojektstatus (grün/gelb/rot) kann vom
Projektleiter gepflegt werden, um der GF einen schnellen Eindruck zu geben. **Kollaboration:** Das
Team kann innerhalb des Projekts kommunizieren – z.B. Kommentare an Aufgaben hinterlassen
oder Dateien anhängen. Alle projektbezogenen Dokumente (Pläne, Angebote, Abnahmeprotokolle,
Fotos) werden in der Projektakte versioniert gespeichert, was die bisher verteilte Dateiverwaltung
ablöst
. **Beteiligte & Ressourcen:** Im Projekt ist ersichtlich, welche internen und externen
Akteure beteiligt sind (inkl. Kontaktinfos). Eine Ressourcenübersicht zeigt, welche Mitarbeiter dem
Projekt zugeteilt sind und in welchem Zeitraum (für grobe Kapazitätsbetrachtungen). Detaillierte
Ressourcenplanung (mit Auslastungsdiagrammen pro Person) ist als Erweiterung denkbar, aber
nicht zwingend im MVP. **Fortschrittstracking:** Erledigte Aufgaben werden abgehakt, das System
kann einen prozentualen Fortschritt schätzen (z.B. 12 von 20 Aufgaben erledigt = 60%). Überfällige
Aufgaben werden rot markiert und erscheinen ggf. im Dashboard der Verantwortlichen. Insgesamt
dient das Modul dazu, Projekte effizient zu steuern und allen Beteiligten Klarheit über den Stand und
die nächsten Schritte zu geben.

# Lieferanten- & Partnermanagement: Dieses Modul verwaltet die externen

# 12

Bestell-E-Mails durchsuchen, sondern sieht im CRM/PM, welche Bestellungen offen sind und welche
erfüllt. Darüber hinaus kann das Management strategische Entscheidungen treffen, indem es z.B.
erkennt, welcher Lieferant ständig teurer wird oder wiederholt spät liefert, und entsprechend
Alternativen suchen.

**Finanzmanagement & Projektcontrolling:** Dieses Modul erweitert die Lösung um finanzielle
Planungs- und Kontrollfunktionen. Es umfasst zwei Hauptaspekte: **Rechnungswesen** und
**Projektcontrolling** . Im Bereich Rechnungswesen werden die Ausgangsrechnungen an Kunden und
die Eingangsrechnungen von Lieferanten verwaltet. Bereits bei Projektstart wird ein **Zahlungsplan**
hinterlegt (z.B. 30% Anzahlung nach Auftrag, 60% nach Lieferung, 10% Schlussrechnung), aus dem
das System automatisch Fälligkeitsdaten generiert. Die Buchhaltung erhält entsprechende Aufgaben
zur Rechnungsstellung, wenn Meilensteine erreicht sind
. Über eine Lexware-Schnittstelle kann
entweder das CRM die Rechnung mit fortlaufender Nummer erzeugen oder Lexware meldet dem
CRM die erstellte Rechnung zurück – in jedem Fall sind im Projekt alle gestellten Rechnungen
sichtbar, inkl. Datum, Betrag und Zahlungsstatus
. Offene Posten werden so auch im CRM
ersichtlich. Auf Lieferantenseite können Bestellungen und Eingangsrechnungen erfasst werden, um
die Verbindlichkeiten pro Projekt zu dokumentieren. Das Finanzmodul garantiert GoBD-Konformität,
indem es alle Rechnungsdokumente unveränderbar archiviert und Änderungen protokolliert
.
Der zweite Aspekt, **Projektcontrolling** , kombiniert nun die Plandaten aus der Kalkulation mit den
Ist-Daten aus der Durchführung. Das System stellt Plan-Umsatz und Plan-Kosten eines Projekts den
aktuell erfassten Ist-Werten gegenüber (laufend aktualisiert). Unter **Ist-Kosten** fallen z.B.:
summierte Lieferantenrechnungen, Gehälter/Stundensätze für gebuchte Arbeitszeit, spontane
Zusatzkosten etc. Unter **Ist-Erlöse** : alle gestellten Rechnungen. Dadurch kann jederzeit die Marge
fortgeschrieben werden. Abweichungen vom Plan werden deutlich – z.B. sieht man, dass
Materialkosten 5.000€ über Plan liegen, was die Marge drückt. Am Projektende wird ein **Soll-Ist-**
**Abgleich** durchgeführt (Nachkalkulation), der essentiell für das Lernen aus Projekten ist
. Das
System sollte diesen Abgleich auf Knopfdruck erstellen und idealerweise Abweichungsgründe
dokumentierbar machen. Die GF kann damit sofort sehen, welche Projekte profitabel waren und
welche nicht – und warum. **Integration mit Lexware:** Das Finanzmodul ersetzt nicht das
Finanzbuchhaltungsprogramm, sondern ergänzt es um projektspezifisches Controlling. Es wird
angenommen, dass Stammdaten (Kunden, ggf. Artikel) und Bewegungsdaten (Rechnungen,
Zahlungen) regelmäßig mit Lexware synchronisiert werden
. So bleiben beide Systeme
konsistent, ohne dass z.B. die Debitoren doppelt gepflegt werden müssen. Insgesamt liefert das
Finanzmodul jene Transparenz, die bisher fehlte: Es zeigt dem Team _während_ des Projektverlaufs, ob
man im Plan ist, und erlaubt der GF im Nachgang eine fundierte Bewertung jedes Auftrags.

# Auswertungen & Reporting: Dieses Modul bietet flexible Abfragen und Dashboards für alle

# 13

aufbereitet – z.B. als Tortendiagramm für Umsatzanteile nach Kundensegment oder als Zeitstrahl/
Liniendiagramm für den Sales-Funnel-Verlauf. Visuelle Aufbereitung ermöglicht es, Trends schneller
zu erfassen
. **Export & Weiterverarbeitung:** Alle Berichte sind als Excel, PDF etc. exportierbar,
damit sie in Meetings verwendet oder weiter analysiert werden können. Das Reporting-Modul stellt
damit sicher, dass Entscheidungen datenbasiert getroffen werden können. Im Unterschied zur
bisherigen Situation (manuelle Zahlenaggregation aus verschiedenen Exceln) hat die GF nun stets
aktuelle Zahlen zur Hand – was die Steuerung deutlich verbessert. Speziell Marketing und Vertrieb
können ihren ROI belegen (z.B. Conversion-Rate pro Kampagne)
, und die GF kann Engpässe
erkennen (z.B. Überlast eines Teams anhand der Aufgabenverteilung).

# 5. Anforderungen

Nachfolgend sind alle identifizierten Anforderungen zusammengefasst und nach Priorität eingestuft. _Muss_ -

Kriterien sind essentielle Funktionen, _Soll_ -Kriterien wichtige aber notfalls aufschiebbare Erweiterungen, und
_Kann_ -Kriterien optionale Nice-to-have-Features.

**Muss-Kriterien (Priorität 1):**

_Zentrale Kontaktverwaltung:_ Eine gemeinsame Datenbank für alle Kunden, Interessenten und
Lieferanten mit vollständigen Stammdaten. Jeder neue Kontakt wird auf Dubletten geprüft, um
redundante Einträge zu vermeiden
. Pro Kunde sollen alle zugehörigen Personen und
Beziehungen (Filialen, Verbundgruppen etc.) abbildbar sein. Im Kundenprofil werden sämtliche
Aktivitäten, Opportunities, Projekte und Dokumente des Kunden übersichtlich angezeigt (360°-Sicht)
.

# Lead- und Opportunity-Management: Möglichkeit, neue Leads (potentielle Kunden) mit Quelle,

# Angebotserstellung und -kalkulation: Erstellung von Angeboten direkt im System, mit Positionen

# Angebote in Projekte ohne erneute Dateneingabe (nahtloser Übergang Vertrieb → Projekt)

# Projektverwaltung und -durchführung: Anlage eines neuen Projekts (Projektakte) aus einer

# 14

_Aufgaben- und Kapazitätsmanagement:_ Zentrales Aufgabenmodul mit persönlichen To-Do-Listen für
Mitarbeiter (filterbar nach Projekt, Priorität, Fälligkeit). Aufgaben können einander zugeordnet sein
(Abhängigkeiten) und erzeugen Benachrichtigungen bei Fristüberschreitung. Eine Übersicht der
Ressourcenauslastung zeigt an, wer wie vielen Aufgaben/Projekten zugeteilt ist (zur Not per Ampel:
grün = Luft, rot = Überlast). Dieses Feature ist für MVP rudimentär ausreichend, kann aber
ausgebaut werden.

_Lieferanten- und Bestellmanagement:_ Verwaltung aller Lieferantenstammdaten. Möglichkeit, pro
Projekt externe Bestellungen zu erfassen: Welche Leistung wurde bei welchem Lieferanten zu
welchem Termin beauftragt. Das System soll Liefertermine überwachen und erinnern, falls
Lieferungen überfällig sind. Verknüpfung von Lieferanten mit Projekten (Historie) und ggf.
Bewertung (z.B. _Lieferzuverlässigkeit_ als Kennzahl).

_Finanzmodul (Rechnungen & Controlling):_ Integration eines Projektcontrollings mit laufendem Soll/Ist-
Vergleich. **Rechnungsstellung:** Hinterlegung von Zahlungsplänen je Projekt (Termin und Betrag/
Prozentsatz) und Ausgabe von Aufgaben/Alerts an die Buchhaltung, wenn eine Rechnung fällig wird
. Erstellung von Rechnungen (als PDF) aus dem System oder Erfassung bereits gestellter
Rechnungen; Synchronisation der Rechnungdaten mit Lexware (Nummernkreis, Zahlungsstatus)
.
**Kostenverfolgung:** Erfassung aller projektrelevanten Kosten – interne Stunden (mit hinterlegten
Kostensätzen) und externe Ausgaben (Lieferantenrechnungen) – im System. Automatische
Summierung und Gegenüberstellung mit dem Kostenvoranschlag. **Nachkalkulation:** Muss-
Kriterium, da Kern der Erfolgskontrolle. Am Projektende muss auf Knopfdruck ein Bericht erstellbar
sein, der Plan- vs. Ist-Kosten und Erlöse sowie die Abweichungen zeigt
. Diese Nachkalkulation
wird pro Projekt gespeichert.

# Reporting & Dashboard: Konfigurierbare Dashboard-Ansichten für unterschiedliche Rollen (Vertrieb,

# Rollen- und Rechtekonzept: Granulare Steuerung, welche Benutzer welche Daten sehen/bearbeiten

# Offline-Fähigkeit: Zwingend erforderlich ist ein Offline-Modus für Außendienstnutzer. Kernfunktionen

# 15

_Usability & Performance:_ Das System muss eine intuitive, aufgeräumte Benutzeroberfläche bieten, die
auf die unterschiedlichen Nutzergruppen abgestimmt ist (z.B. vereinfachte mobile Ansicht für
ADMs). Kurze Ladezeiten und flüssige Interaktion auch bei größeren Datenmengen (1000+ Kunden,
100+ Projekte) sind Voraussetzung. Funktionen wie Schnellsuche, Filter, Inline-Bearbeitung,
Drag&Drop (für Aufgaben) werden erwartet, um den Arbeitsaufwand gering zu halten. Die Lösung
sollte “einfach funktionieren”, damit die Mitarbeiter sie gerne nutzen und nicht als Belastung
empfinden.

_Compliance & Sicherheit:_ Umsetzung der DSGVO-Anforderungen (z.B. Recht auf Vergessen:
Möglichkeit, einen Kunden auf _“inaktiv/anonymisiert”_ zu setzen, ohne historische Berichte zu
verfälschen). GoBD-konforme Archivierung aller steuerlich relevanten Daten (Änderungslog,
Unveränderbarkeit von Rechnungen nach Faktura etc.)
. Rollenbasierte Datenzugriffskontrollen
und Verschlüsselung sensibler Daten (z.B. Offline-Datenspeicher auf mobilen Geräten) zum Schutz
vor unbefugtem Zugriff. Regelmäßige Backups und ein Notfallkonzept gehören ebenfalls zu den
Muss-Kriterien im Hintergrund.

# Soll-Kriterien (Priorität 2):

_Mehrsprachigkeit:_ Unterstützung mehrerer UI-Sprachen. Deutsch ist primär, aber das System soll auf
Englisch (und ggf. weiteren Sprachen) umschaltbar sein
. Dies umfasst Menüs, Fehlermeldungen,
Feldbezeichnungen etc. – Dateninhalte (Notizen) werden nicht automatisch übersetzt.
Mehrsprachigkeit ist kein sofort kritischer Bedarf (aktuell rein deutsch), aber für zukünftige
Erweiterungen und internationale Mitarbeiter wünschenswert.

# Erweiterte Ressourcenplanung: Graphische Darstellung der Auslastung pro Mitarbeiter (z.B. Kalender-

_Freigabe-Workflows:_
Einrichtung von Genehmigungsprozessen für bestimmte Aktionen.
Beispielsweise könnte ein Rabatt über X % automatisch einen Genehmigungsrequest an den
Vertriebsleiter oder GF schicken. Solche Workflows erhöhen die Kontrolle, sind derzeit aber kein
Muss, da das Unternehmen kurze Entscheidungswege hat. Sie sollten jedoch konfigurierbar sein,
um bei Bedarf aktiviert werden zu können
.

# Zeitwirtschaft-Integration: Falls die direkte Zeiterfassung im CRM zum Start noch nicht voll entwickelt

_Schnittstelle Finanzbuchhaltung (erweitert):_ Über die Muss-Schnittstelle hinaus könnte eine _tiefere_
Integration mit Lexware umgesetzt werden. Im Soll-Fall werden z.B. Kundenstammdaten synchron
gehalten (Neukunden im CRM werden automatisch in Lexware angelegt, und umgekehrt) und
Zahlungseingänge aus Lexware in das CRM zurückgemeldet. So hätten Vertrieb/PM stets aktuelle

Zahlungsinformationen, ohne in Lexware nachsehen zu müssen
. Auch ein Abgleich der
Artikelstammdaten oder von Kostenstellen wäre denkbar, falls relevant.

# Outlook/Exchange-Integration: Synchronisation von Kalender und E-Mails mit dem System. Z.B.

_Mobile Erweiterungen:_
Nutzung spezieller Handy-Funktionen. Z.B.
**Spracherkennung**
für
Kontaktnotizen (der ADM spricht ins Telefon, das CRM speichert Text)
, oder **Foto-Upload via**
**App-Kamera** (z.B. Kunde unterschreibt auf dem Tablet und das PDF wird direkt abgelegt). Solche
Features verbessern die User Experience und Datenqualität (man erhält z.B. gleich Bilder zur
Projektakte), sind aber nicht kriegsentscheidend zum Start und können schrittweise ergänzt werden.

# Erweiterte Auswertungen & BI: Zusätzlich zu den Standardberichten könnten tiefergehende Analysen

**Kann-Kriterien (Nice-to-have, Zukunft):**

_Kundenportal:_ Ein Self-Service-Portal, in dem Kunden z.B. den Projektfortschritt verfolgen oder
Supportanfragen stellen können, ist eine mögliche zukünftige Ergänzung. Aktuell wurde so ein
Portal nicht gefordert, da die Kunden eher telefonisch betreut werden. Perspektivisch – etwa bei
einem wachsenden Servicegeschäft – könnte es aber sinnvoll sein, Tickets oder Wartungsanfragen
online zu erfassen.

_Service-/Wartungsmodul:_ Sollte das Unternehmen in Zukunft auch Service-Leistungen nach
Projektabschluss anbieten (Wartungsverträge, Reparaturservice), könnte ein Modul für
Vorgangsverwaltung/Tickets implementiert werden. Derzeit liegt der Fokus jedoch auf
Neuprojekten; Servicefälle werden ad-hoc gelöst. Dennoch sollte die Architektur offen dafür sein,
später ein solches Modul zu integrieren (z.B. Ticket-Entity mit Bezug auf Kunden/Projekt)
.

# Erweiterte KI-/Automationsfeatures: Denkbar, aber nicht konkret geplant, sind KI-gestützte Funktionen

_Gamification-Elemente:_ Zur Motivation der Nutzer ließen sich spielerische Elemente einführen, z.B. ein
Punkte-System für erledigte Aufgaben oder ein Vertriebs-Leaderboard. Dies kann helfen, die

---

_Page 61_

---

Nutzungsrate hochzuhalten, steht aber nicht im Vordergrund und wird nur umgesetzt, wenn
Ressourcen frei sind und das Team einen Bedarf dafür sieht.

Alle Anforderungen leiten sich direkt aus den Bedürfnissen der Personas und den Zielen des Unternehmens
ab. Die Muss-Kriterien definieren den Kern der Lösung und sollten in der ersten Iteration unbedingt erfüllt
sein. Die Soll-Kriterien sind für den langfristigen Erfolg wichtig, können aber bei Engpässen zeitlich
gestreckt oder in Phase 2 verschoben werden. Die Kann-Kriterien runden die Vision ab und bieten
Entwicklungspotential für die Zukunft, ohne für den Go-Live erforderlich zu sein. Durch diese Priorisierung
wird sichergestellt, dass zunächst die wichtigsten Funktionen bereitgestellt werden und das System schnell
produktiv Nutzen stiftet, während Erweiterungen planvoll nachgezogen werden können.

# 6. Workflows & Prozesse

**Datenmigration (Initiale Überführung):** Vor Einführung des neuen Systems müssen die bestehenden
Datenbestände aus verschiedenen Quellen konsolidiert und importiert werden. Hauptquellen sind Excel-
Listen mit Kundenkontakten sowie Word-Dokumente mit tabellarischen Kontakt- und Besuchsprotokollen.
Der Migrationsprozess sieht vor, zunächst alle Kunden und Ansprechpartner aus Excel zu übernehmen.
Dabei wird eine Dublettenprüfung durchgeführt – das System oder ein Migrationsskript erkennt doppelte
Einträge (z.B. anhand von Namen, E-Mail oder Adresse) und führt sie zusammen, um redundante Kunden zu
vermeiden
. Anschließend werden die historischen Kontaktprotokolle importiert: Falls diese strukturiert
vorliegen, können sie automatisiert jedem Kunden als chronologische Notizen oder Aktivitäteneinträge
hinzugefügt werden. Wo das nicht möglich ist, müssen relevante Alt-Dokumente manuell als Datei im CRM
hochgeladen und der jeweiligen Kundenakte (oder Projektakte) zugeordnet werden. Das Unternehmen
muss entscheiden, welche historischen Daten wirklich migriert werden (z.B. Kundenstammdaten der letzten
10 Jahre, aber Protokolle vielleicht nur der letzten 3 Jahre)
. Diese Entscheidung beeinflusst Aufwand und
Systemeinrichtung erheblich. Wichtig ist, frühzeitig _Datenbereinigung_ zu betreiben – etwa einheitliche
Schreibweisen herzustellen und veraltete Datensätze (z.B. Karteileichen) auszusondern, bevor sie ins neue
System gelangen. So startet das CRM mit einem konsistenten, aktuellen Datenstamm. Nach der Migration
(idealerweise testweise in einer Sandbox und dann produktiv) sollten Alt-Systeme in den Nur-Lese-Modus
versetzt werden, um die **Datenführerschaft** eindeutig beim neuen Tool zu haben. Mögliche Risiken in
diesem Prozess (fehlgeschlagene Zuordnungen, Zeichensatzprobleme, Dubletten) müssen durch Tests und
ggf. manuelle Nachkorrektur aufgefangen werden.

**Datenimport/Export (Laufender Betrieb):** Neben der initialen Migration ist Import/Export eine **laufende Funktion** für den täglichen Betrieb, nicht nur eine einmalige Migrationsfunktion:

- **Kundenimport:** PLAN/ADM/GF können jederzeit Kunden aus Excel/CSV-Dateien importieren mit automatischer/manueller Feldzuordnung, Validierung, Duplikatsprüfung und Fehlerbehandlung. Nützlich für: Bulk-Kundenimporte (z.B. aus Marketing-Kampagnen), Datenaktualisierungen von externen Quellen, Migration zusätzlicher Datenbestände.
- **Kontaktprotokoll-Import:** PLAN/ADM/GF können Word-Dokumente mit tabellarischen Kontaktprotokollen importieren. Das System extrahiert Tabellen, parst verschiedene Datumsformate (mit Fallback auf manuelle Eingabe), ordnet Protokolle Kunden zu und validiert die Daten. Nützlich für: Import historischer Protokolle, regelmäßige Protokoll-Importe von externen Quellen, Migration zusätzlicher Protokoll-Datenbestände.
- **Datenexport:** PLAN/ADM/GF/BUCH können jederzeit Daten exportieren (CSV/Excel/JSON/DATEV für Kunden, CSV/Excel/Word/JSON für Protokolle) mit Feldauswahl, Datumsbereichs-Filterung und RBAC-Berechtigungen. Nützlich für: Backups, DSGVO-Exporte, DATEV-Integration (Lexware), Datenanalyse in externen Tools, Audit-Trails.
- **Vollständige Spezifikation:** Siehe [Import/Export Specification](../specifications/IMPORT_EXPORT_SPECIFICATION.md) und [API Specification](../specifications/api-specification.md) (Section 22) für vollständige Details.

# Kontaktbericht- und Angebotsprozess (Vertrieb): Im heutigen Prozess schreibt der ADM nach

# 18

Produktdatenbank geht das schneller als bisher in Word. Falls ein interner Freigabeprozess definiert ist (z.B.
bei Rabatt über 10%), löst das System diesen jetzt aus: Der Vertriebsleiter erhält eine Benachrichtigung,
prüft das Angebot online und gibt es per Klick frei. Sobald freigegeben, kann der Innendienst das Angebot
direkt per E-Mail aus dem CRM an den Kunden senden (das System nutzt die hinterlegte E-Mail-Vorlage,
fügt das PDF an und protokolliert den Versand). Nach Versand wird automatisch eine Wiedervorlage gesetzt
(z.B. _“in 7 Tagen nachfassen”_ ), die im Aufgabenmodul des ADM erscheint. Sollte der Kunde rückfragen oder
Änderungen wünschen, versioniert der Innendienst das Angebot und schickt eine überarbeitete Fassung –
alles immer nachvollziehbar im System. Im Erfolgsfall wandelt er das Angebot per Klick in ein Projekt um,
was die Basisdaten überträgt (Kunde, Angebotssumme, Kurzbeschreibung etc.). Insgesamt wird der
Vertriebsprozess vom Erstkontakt bis zum Auftrag durch das System stringenter, schneller und
transparenter, was eine wichtige Grundlage für mehr Abschlüsse ist.

**Projektabwicklung und Controlling-Prozess:** Nach Auftragsgewinn startet der definierte Projektworkflow.
**Projektplanung:** Der Innendienst überprüft bzw. ergänzt die automatisch erzeugte Projektakte. Er legt das
Projektteam fest (zuständige Planer, Monteur-Teamleiter, etc.) und passt den generierten Phasen- und
Aufgabenplan an. Beispielsweise definiert er konkrete Termine: _Montage geplant vom 10.05. bis 12.05._ ,
_Lieferant X liefert am 08.05._ etc. Das System erinnert an diese Meilensteine (bzw. warnt, wenn bis Stichtag die
Lieferung nicht als “erledigt” markiert ist). Wöchentliche Team-Meetings können anhand der
Projektübersicht gestaltet werden – man sieht dort alle Projekte und ggf. rote Ampeln, wo Handlungsbedarf
besteht. **Leistungserfassung:** Parallel starten die Mitarbeiter ihre Stunden auf das Projekt zu buchen. Ein
Planer sieht z.B. die Aufgabe _“Detailplanung durchführen”_ , erledigt diese und gibt an: 20 Stunden investiert
(ggf. verteilt über 2 Wochen). Das System summiert diese Stunden und bewertet sie mit dem hinterlegten
Kostensatz – so steigen die Ist-Personalkosten im Projektcontrolling modulweise an. Dasselbe passiert mit
Eingangsrechnungen: Die Buchhaltung erfasst z.B. die Schreiner-Rechnung über 50.000€ im System und
ordnet sie dem Projekt zu. Dadurch füllt sich der **Controlling-Soll/Ist-Vergleich** : Das System kennt den
kalkulierten Wert “Schreinerkosten = 45.000€“ und sieht nun Ist = 50.000€. Es markiert diese Kostenposition
z.B. rot (Überschreitung). Der GF oder Projektleiter kann dies in Echtzeit sehen und würde ggf.
nachverhandeln oder Sparmaßnahmen anstoßen. **Projekt-Durchführung & Kollaboration:** Während der
Umsetzung aktualisieren alle Beteiligten den Fortgang: Der Planer lädt seine finalen Pläne hoch und
markiert _“Werkplanung abgeschlossen”_ . Der Außendienst ergänzt vielleicht einen Kommentar nach einem
Baustellenbesuch. Die Monteure schicken über die mobile App ein Foto der fertig montierten Einrichtung,
das der Innendienst direkt dem Projekt anhängen kann. Bei Unklarheiten oder Problemen kann im
Projektraum diskutiert werden (statt in untransparenten E-Mail-Threads). **Rechnungsstellung &**
**Nachkalkulation:** Erreicht ein Projekt einen Rechnungsmeilenstein (z.B. _“50% nach Lieferung”_ ), generiert
das System automatisch eine Aufgabe _“Rechnung 2 stellen: 50.000 € fällig zum 15.05.”_ für die Buchhaltung
. Diese erstellt die Rechnung in Lexware (oder direkt aus dem CRM) und markiert sie als gesendet.
Sobald die Zahlung eingeht, wird der _Ist-Erlös_ im Projekt aktualisiert. Nach Abschluss des Projekts erstellt
die Buchhaltung den Nachkalkulationsreport: Das System listet Plan vs. Ist für Erlöse und Kosten auf, zeigt
z.B. _+5.000 € Mehrumsatz durch Zusatzauftrag, -7.000 € Mehrkosten Schreiner_ etc. Die Marge wird mit dem
ursprünglich kalkulierten Wert verglichen. Dieser Report wird im Projekt abgelegt und in einem
Abschlussmeeting besprochen – etwaige Lehren (z.B. _“Schreinerkosten künftig höher ansetzen”_ ) können als
Kommentar erfasst werden. Gemäß Best Practice sollte _jedes_ Projekt so ausgewertet werden
, was durch
die Software erstmals praktikabel wird (früher wurde das nur bei Problemprojekten gemacht, weil es
manuell sehr aufwendig war). Der Controlling-Prozess ist damit nahtlos in den Projektworkflow integriert.

# Benutzerverwaltung, Rechte & Freigaben: Die Einführung des Systems bringt auch neue Abläufe in der

Benutzerkonto im CRM an. Er ordnet diesem eine Rolle zu (z.B. _Außendienst_ ), woraufhin das System
automatisch die vordefinierten Rechte dieser Rolle zuweist. Der Mitarbeiter erhält initiale Zugangsdaten
und muss beim ersten Login sein Passwort ändern. Ändert sich die Abteilungszugehörigkeit eines Nutzers
(z.B. Innendienst-Mitarbeiter wechselt in Vertrieb), passt der Admin einfach die Rolle an – das System
entzieht und vergibt damit automatisch Rechte gemäß dem neuen Profil. **Rechteverwaltung im Alltag:**
Standardmäßig sind Kunden- und Projektdaten im Vertrieb vollständig sichtbar (Offene Kultur). Sollte
jedoch z.B. ein Key-Account vertraulich behandelt werden müssen (evtl. bei Konkurrenz zwischen ADM-
Gebieten), kann der Admin den Zugriff auf dieses Objekt einschränken. Ebenso könnten Finanzdaten
ausgeblendet werden für Nutzer außerhalb Buchhaltung/GF. Solche Sonderfälle werden in der Rechte-
Matrix festgelegt. Das System protokolliert Rechteänderungen, um im Nachhinein nachvollziehen zu
können, falls etwa jemand unbefugt Zugriff hatte (was vermieden werden soll). **Genehmigungs-**
**Workflows:** Wenn eine Regelverletzung droht (z.B. Rabatt >10%), löst das System einen vordefinierten
Freigabeprozess aus. Im Beispiel
_Rabatt >10%_ : Der zuständige Verkaufsleiter/GF erhält eine
Benachrichtigung mit Angebotsdetails und klickt auf “Freigeben” oder “Ablehnen”. Der ADM sieht im
Angebot den Status _“Warten auf Freigabe”_ und wird benachrichtigt, sobald genehmigt. Bei Ablehnung kann
ein Kommentar (Grund) hinterlegt werden. Alle Aktionen werden im Angebot vermerkt (wer hat wann
genehmigt/abgelehnt). Dieser Prozess ersetzt formloses Abnicken per Telefon und schafft
Nachvollziehbarkeit. Da das Unternehmen aktuell kurze Entscheidungswege hat, können solche Workflows
anfangs deaktiviert bleiben – aber die Infrastruktur ist vorhanden, falls die Organisation wächst oder Audits
es erfordern. **Benutzer-Support & Governance:** Der Admin behält den Überblick über Login-Aktivitäten,
kann Passwörter zurücksetzen und Nutzer sperren (z.B. beim Austritt). Regelmäßige Rechte-Audits (z.B. 1x
jährlich Überprüfung, ob Rechte noch passen) sind empfohlen, um _Least Privilege_ sicherzustellen. Insgesamt
wird durch diese Mechanismen eine sichere, aber flexible Zusammenarbeit ermöglicht, die sich an
veränderte Organisationsstrukturen schnell anpassen lässt.

# 7. Marktvergleich (fachlich)

Ein Vergleich mit bestehenden Lösungen zeigt, dass die Idee, **CRM und Projektmanagement zu vereinen** ,
bereits von mehreren Anbietern verfolgt wird
. Beispiele: **Insightly** (Cloud-CRM mit Projekten), **vTiger/**
**SugarCRM** (Open-Source-CRM mit Projekt-Modulen), **Zoho One** (CRM plus Projects), oder in der Enterprise-
Klasse **Dynamics 365** mit Project Operations und **Salesforce** mit PSA-Add-ons
. Diese Tools
bestätigen, dass unser Grundkonzept State-of-the-Art ist. Die meisten decken die Kernfunktionen ab – von
Kontaktverwaltung über Sales-Pipeline bis zu Aufgaben- und Projektlisten
. So wirbt Insightly z.B.
damit: _“Work and win deals, then manage those projects – all in the same tool”_
, was exakt unserem Ziel
entspricht.

# Allerdings richten sich Standard-Lösungen oft an breite Zielgruppen und erfordern Anpassungen, um

# Funktionsabgleich: Unsere Anforderungen entsprechen in vielen Punkten dem, was bekannte CRM/PM-

| 100 |     | 101 |     |
| --- | --- | --- | --- |
| ol” | 13  |     | ,   |

Außendienst. **Differenzierung:** Einige Bereiche gehen über das hinaus, was typische KMU-Lösungen
standardmäßig liefern:

**Projektcontrolling & Zeiterfassung:** Hier liegen wir näher an Software für Professional-Services
(z.B. Beratungs-Tools wie Mavenlink oder ERP-Lösungen wie Haufe X360 mit integriertem
Projektcontrolling). Klassische CRM-Systeme haben oft _keine_ tiefe Kosten-/Margenverfolgung. Diese
Lücke schließen wir bewusst. Zwar kann man etwa bei **Zoho** über das Modul _“Books”_ Finanzen
integrieren oder in **Salesforce** via AppExchange ein Controlling-Paket anflanschen – aber in der
Basisausführung sind die meisten CRM+PM-Tools eher _task-orientiert_ als _kostenorientiert_ . Unsere
Lösung mit vollständigem Soll/Ist-Abgleich und Stundenerfassung pro Projekt ist hier ein
Alleinstellungsmerkmal im KMU-Segment. Das erhöht den Mehrwert, erfordert aber auch mehr
Implementierungsaufwand und Disziplin bei der Dateneingabe.

**Offline-Fähigkeit:** Viele moderne SaaS-Tools setzen ständige Internetkonnektivität voraus. Zwar gibt
es Offline-Modi bei einigen (Insightly erlaubt z.B. in der mobilen App das Offline-Lesen/-Bearbeiten
von Kontakten und Aufgaben)
, aber das ist nicht bei allen durchgängig gelöst. Unser
Außendienst arbeitet oft in ländlichen Gebieten ohne Netz – deshalb priorisieren wir Offline-
Nutzbarkeit höher als es ein generisches CRM tun würde. Dieser Aspekt ist ein Vorteil unserer
spezialisierten Lösung, denn wir schließen damit einen praktischen Schwachpunkt vieler
Wettbewerber (z.B. **Monday.com** oder **Asana** bieten ohne Netz kaum Funktionalität). Entsprechend
wird in unserem Konzept in Offline-Technologie investiert, was ein Wettbewerbsvorteil in unserem
Nutzungskontext ist.

# Lokale Integration (Lexware): International ausgerichtete CRM-Systeme konzentrieren sich eher

# Mehrsprachigkeit: Hier liegen wir auf Linie des Marktes. Große CRM-Lösungen sind meist

# Best Practices & Usability: Etablierte Lösungen bringen erprobte UX-Konzepte mit. Wir orientieren

**Risiken im Vergleich:** Natürlich haben etablierte Tools den Vorteil jahrelanger Entwicklung und Support-
Teams. Unsere maßgeschneiderte Lösung muss diesen Reifegrad erst erreichen. Wir haben jedoch den
Vorteil, exakt unsere Prozesse abbilden zu können, ohne Kompromisse. Während ein generisches System
eventuell 80% passt und 20% Workarounds nötig wären, zielen wir auf 100% Passgenauigkeit
. Das
erkaufen wir mit eigenem Aufwand (Implementierung, Wartung). Insgesamt scheint das für uns sinnvoll:
Die internen Effizienzgewinne und die Vermeidung von Insellösungen rechtfertigen den höheren
Initialaufwand. Wir sollten aber die Erfahrungen des Marktes nutzen – z.B. evaluierten wir prototypisch
**vTiger** und **Monday.com** während der Konzeptionsphase, um abzuschätzen, ob wir nicht doch ein
bestehendes Tool anpassen können. Ergebnis: Keines erfüllte ohne erheblichen Custom Code alle Muss-
Kriterien (vTiger fehlte modern UI und Offline, Monday kein tiefes CRM-Modul). Daher setzen wir auf die
Eigenentwicklung bzw. ein stark angepasstes System. Im Bewusstsein, dass dies Pflege erfordert, planen
wir entsprechende Ressourcen ein.

# Zusammengefasst lässt sich sagen: Unsere Ideallösung bewegt sich funktional auf Augenhöhe mit den Top-

# 8. Offene Punkte & Risiken

Trotz der detaillierten Ausarbeitung gibt es einige offene Punkte und Risiken auf fachlicher Ebene, die im
Projektverlauf besonders beachtet werden müssen:

**Datenqualität bei Migration:** Wie oben beschrieben, ist die **Migration der Alt-Daten** ein kritischer
Schritt. Es besteht das Risiko, dass beim Import Dubletten entstehen oder Daten falsch zugeordnet
werden. Eine unbereinigte Übernahme könnte die Nutzerakzeptanz von Beginn an schmälern (“das
System ist ja voller Doppel und Fehler”). Maßnahmen: Vor dem Go-Live intensive Datenbereinigung
durchführen, Dublettenlisten prüfen, eventuell externe Unterstützung bei der Migration einplanen.
Außerdem sollte klar entschieden werden, welche historischen Daten wirklich ins neue System
übernommen werden und was ggf. im Altsystem belassen/archiviert wird
. Unklare
Verantwortlichkeiten bei der Migration sind ebenfalls ein Risiko – es braucht einen Data Steward im
Team.

# Nutzerakzeptanz & Change-Management: Das System entfaltet seinen Nutzen nur, wenn es von

Gamification (Leaderboard für gepflegte Leads o.ä.), um die Nutzung attraktiv zu machen. Zudem
sollte das Management die Nutzung aktiv einfordern (Führung _lebt es vor_ ).

**Offline-Synchronisation & Konflikte:** Zwar fordern wir einen Offlinemodus, doch ist die **technische**
**Umsetzung komplex** . Offene Frage: Wie werden Datenkonflikte gelöst, wenn z.B. zwei ADMs offline
dieselbe Kundenadresse ändern? Hier muss die Feinkonzeption Regeln definieren (z.B. _“Zuletzt_
_synchronisierte Änderung gewinnt, vorherige wird überschrieben”_ oder Merge-Dialoge). Ungeklärt ist
auch, welche Datenmengen offline vorgehalten werden – vermutlich nicht das gesamte DMS (Fotos
etc.), sondern Kernstammdaten und Aktivitäten. Dies muss technisch prototypisiert werden. Ein
Risiko besteht, dass die Offline-Funktion in der ersten Version eingeschränkt ausfällt (z.B. nur
Lesezugriff), was die Anwender enttäuschen könnte. Hier heißt es Erwartungsmanagement
betreiben. Weiterer Punkt: Offline-Daten auf mobilen Geräten bergen ein Sicherheitsrisiko (bei
Geräteverlust könnten vertrauliche Infos in falsche Hände gelangen). Deshalb sind ggf. Mobile-
Device-Management (MDM) oder zumindest Gerätesperren/verschlüsselte Caches einzuplanen. Alles
in allem ist Offline einer der riskantesten (weil komplexen) Anforderungen, die wir aber als Muss
definiert haben. Eine Möglichkeit zur Risikominimierung ist, den Offlinemodus zunächst auf
wesentliche Module zu begrenzen (z.B. Kontakte, Aktivitäten)
und nicht gleich alles (z.B. Gantt)
offline verfügbar zu machen.

# Integrationsdetails (Lexware & Co.): Wir wissen, dass wir Lexware integrieren müssen, aber die

**Umfang des Finanzmoduls:** In der ursprünglichen Analyse war der Finanzbereich nur auf
Ausgangsrechnungen fokussiert – nun haben wir entschieden, auch Einkaufskosten, interne
Stunden und Margen-Controlling aufzunehmen
. Das erhöht den Projektumfang. Es besteht das
Risiko der _Überfrachtung_ : Möglicherweise werden die PM-User anfangs vom vollen Controlling
erschlagen oder die Datenpflege (Stunden buchen, Belege scannen) überfordert das Team. Hier gilt
es, Prioritäten zu managen: Ggf. wird man einige Controlling-Features “stumm schalten” können,
falls die Nutzung zu wünschen übrig lässt. Außerdem muss noch geklärt werden, wie allgemeine
Gemeinkosten oder indirekte Kosten (wie Fahrtkosten, die nicht einzeln pro Projekt erfasst werden)
im System behandelt werden – diese Frage blieb offen und beeinflusst die Aussagekraft der
Nachkalkulation. Das Controlling-Modul sollte so implementiert werden, dass es notfalls modular
erweitert oder vereinfacht werden kann, falls in der Praxis zu viel Aufwand entsteht.

# Zeit- & Budgetrahmen: Die umfangreichen Anforderungen bedeuten einen erheblichen

Budgetverzug gerät, wenn man versucht, alles auf einmal umzusetzen. Um dies abzufedern, sollte
unbedingt eine Priorisierung (wie oben erfolgt) konsequent in der Umsetzung berücksichtigt werden
– MVP-Fokus auf den Muss-Kriterien. Features wie Offline und Controlling könnten sich als
schwieriger erweisen als gedacht; falls nötig, müssen wir bereit sein, in Absprache mit dem
Auftraggeber Scope-Adjustments vorzunehmen (z.B. Offline erst als Nachlieferung in Version 1.x).
Die Gefahr, sich technisch zu verzetteln, ist real – dem begegnen wir mit Prototyping und agiler
Vorgehensweise (lieber iterative Verbesserungen als Big Bang).

Zusammengefasst liegen die Hauptunsicherheiten weniger im _Was_ , sondern im _Wie_ . Das inhaltliche Konzept
ist valide, aber die Umsetzung erfordert sorgfältige Planung, Testing und Change-Management. Besonders
der Faktor Mensch (Akzeptanz) und die technisch kniffligen Punkte Offline & Schnittstellen verdienen
Aufmerksamkeit. Durch frühe Pilotierungen, schrittweisen Roll-out und Flexibilität bei der Priorisierung
können wir die meisten dieser Risiken mitigieren. Eine kontinuierliche Beobachtung nach Go-Live
(Feedbackrunden, Nutzungsauswertung) hilft, verbleibende Stolpersteine schnell zu erkennen und
nachzusteuern.

# 9. Empfehlungen

Um das Projekt erfolgreich in die nächste Phase (Umsetzung) zu überführen, werden folgende
Empfehlungen ausgesprochen:

**Integration der Zeiterfassung früh konzeptionell klären:** Die vollständige Ablösung von _TimeCard_
ist strategisch gewollt, sollte aber schrittweise erfolgen. Wir empfehlen, in der nächsten Phase einen
Workshop mit Vertretern der Buchhaltung, Innendienst und Mitarbeiterführung durchzuführen, um
die Anforderungen an die **interne Zeiterfassung** im Detail festzulegen. Dabei sind Fragen zu klären
wie: _Erfassen wir Arbeitszeiten minutengenau oder in Stundenblöcken? Brauchen wir Funktionen wie_
_Kommen/Gehen (Arbeitszeitkonto) oder rein projektbezogene Leistungserfassung?_ Das Ergebnis sollte ein
klarer Soll-Prozess sein, der im CRM abgebildet wird. Ggf. kann die bestehende TimeCard-Lösung
übergangsweise angebunden werden (Datenexport), um die Mitarbeiter nicht sofort umgewöhnen
zu müssen. Langfristig ist aber eine vollständige Integration ratsam, da nur so Echtzeit-Controlling
möglich ist. Mögliche _Quick Win_ -Empfehlung: Bereits jetzt die Mitarbeiter anhalten, bei TimeCard
exakt projektbezogen zu buchen (gleiche Projektnamen verwenden), damit die Datenübernahme
vereinfacht wird.

**Schnittstellenstrategie für Lexware ausarbeiten:** Da die Anbindung der Finanzbuchhaltung
kritisch ist, sollte zeitnah ein technischer Plan dafür erstellt werden. Empfohlen wird, einen
Entwickler oder Integrationspartner hinzuzuziehen, der Erfahrung mit der **Lexware Office API** hat.
In einem Proof-of-Concept könnte z.B. getestet werden, einen neuen Kunden vom CRM nach
Lexware zu übertragen und eine Rechnung aus Lexware ins CRM zu importieren
. So erkennen
wir früh eventuelle Hürden (z.B. Datenfelder, die nicht abgebildet werden können). Parallel sollte
abgestimmt werden, welche Daten automatisch synchronisiert werden _müssen_ und was evtl. manuell
bleibt. Vorschlag: Kundendaten und Ausgangsrechnungen via API synchron (weil hier Redundanz
sehr kritisch), Zahlungseingänge eventuell über einen täglichen Import (falls API-Webhook nicht
verfügbar). Wichtig ist, klare Zuständigkeiten festzulegen – z.B. _“Kundendaten werden nur im CRM_
_gepflegt, Lexware erhält Read-only-Kundendaten vom CRM”_ . Dadurch vermeiden wir widersprüchliche
Updates. Abschließend empfiehlt sich eine gemeinsame Testphase von Buchhaltung und IT, um die
Schnittstelle unter realen Bedingungen zu erproben, bevor sie live geht.

# 24

**Schulungs- und Change-Management-Plan erstellen:** Um die im Risikoabschnitt angesprochene
Nutzerakzeptanz sicherzustellen, sollte frühzeitig ein Change-Management-Konzept entwickelt
werden. Wir empfehlen, **Key User** pro Abteilung zu bestimmen, die bereits während der
Entwicklungs-/Testphase Feedback geben und später als Multiplikatoren dienen. Für den Roll-out
sollte es einen gestuften Schulungsplan geben: Zuerst Basics (Kontaktpflege, einfache
Angebotslegung) – nachdem diese sitzen, Aufbau-Schulungen für Controlling-Features etc. Wichtig
ist, die Schulungen praxisnah zu gestalten (Use Cases aus dem Alltag). Außerdem sollte ein Support-
Konzept definiert sein (wer ist erster Ansprechpartner bei Fragen? Gibt es ein FAQ-Wiki?). Ein
begleitendes Kommunikationsmanagement (regelmäßige Updates, Erfolgsmeldungen) unterstützt
die Adoption. Z.B. könnte man 3 Monate nach Einführung einen Workshop durchführen, in dem
jeder Bereich berichtet, wie das System seinen Arbeitsalltag verbessert hat – um die _Quick Wins_
sichtbar zu machen.

**Prototyping kritischer Funktionen:** Für technisch anspruchsvolle Themen (insb. Offline und mobile
Nutzung) empfehlen wir, vor der eigentlichen Entwicklung kleine Prototypen bzw.
Machbarkeitsstudien umzusetzen. Beispielsweise könnte man eine Test-App bauen, die
grundlegende CRM-Daten offline verfügbar macht und beim Wieder-Onlinegehen synchronisiert,
um die Konfliktlösung zu testen
. Erkenntnisse daraus fließen dann ins Architekturdesign ein.
Ebenso könnte man die Spracherkennung via vorhandener APIs (z.B. Google Speech-to-Text) vorab
ausprobieren – etwa in Form einer separaten Handy-App, um zu prüfen, wie gut die Erkennungsrate
bei Außendienst-typischen Notizen ist. Diese Vorarbeit reduziert das Risiko von teuren
Fehlentwicklungen und schafft ggf. sogar Demos, mit denen man das Team früh begeistern kann
(“Schaut mal, so könnte das klingen, wenn ihr Notizen einfach diktieren könnt!”). Auch ein UI-
Prototype (Klick-Dummy) für das Dashboard und die wichtigsten Screens wird empfohlen, um schon
vor dem Coding Feedback der Endnutzer einzuholen und Usability-Probleme rechtzeitig zu
erkennen.

# Phasenweise Umsetzung & Pilotbetrieb: Aufgrund des großen Umfangs empfehlen wir dringend,

# Kontinuierliche Verbesserung & Ausblick: Nach dem Go-Live ist das Projekt nicht “zu Ende”,

Schulungsnachbesserungen erfolgen. Ebenso sollte rechtzeitig geprüft werden, ob sich geplante
zukünftige Anforderungen konkretisieren. Beispiel: Falls das Geschäftsjahr 2026 verstärkt
Wartungsservices beinhaltet, könnte man frühzeitig ein Konzept für ein Ticketmodul entwerfen,
damit dieses ggf. 2026 implementiert werden kann. Oder wenn absehbar ist, dass eine Zweigstelle
im Ausland eröffnet wird, sollte die Mehrsprachigkeit und ggf. Multi-Währungsfähigkeit schon
getestet/bereitgestellt werden. Auch datenschutzrechtliche Themen sind kontinuierlich im Auge zu
behalten – es empfiehlt sich, das Konzept nach Feinspezifikation einmal von einem
Datenschutzbeauftragten prüfen zu lassen (Themen: Auftragsverarbeitung Cloud, Löschkonzept,
Rollen und least privilege etc.)
. Insgesamt lautet die Empfehlung, das System **agil**
**weiterzuentwickeln** , statt es starr einzufrieren. So kann es mit dem Unternehmen mitwachsen und
bleibt langfristig ein passgenaues Werkzeug.

---

# Strategischer Ausblick: Phase 2 & Phase 3 (2025-2026)

**Hinweis:** Dieses Gesamtkonzept fokussiert auf das **MVP (Phase 1)** – CRM-Kern mit Kunden-, Kontakt-, Opportunity- und Protokoll-Management. Die nachfolgenden Phasen sind bereits **vollständig spezifiziert** und in der **Nordstern-Produktvision** (`Produktvision für Projekt KOMPASS (Nordstern-Direktive).md`) detailliert dokumentiert. Dieser Abschnitt gibt einen **Executive Summary** der zukünftigen Erweiterungen.

## Phase 2 (Q3-Q4 2025): Intelligente Automatisierung & Echtzeit-Kollaboration

### 🤖 KI-gestützte Funktionen (Pillar 1: Intelligent Co-Pilot)

**Audio-Transkription & Summarization (Whisper + GPT-4/Llama 3):**

- **Problem gelöst**: Außendienst muss 15-30 Min/Besuch für manuelle Protokollierung aufwenden
- **Lösung**: Sprachmemos während Kundengespräch → automatische Transkription (Whisper) → KI-generierte 5-Zeilen-Zusammenfassung → automatische Task-Generierung
- **Zeitersparnis**: 13-28 Min/Besuch = 2-3h/Woche pro Außendienstler
- **Technologie**: BullMQ (Job-Queue) + n8n (Workflow-Orchestrierung) + Socket.IO (Real-Time-Progress) + MinIO (Audio-Storage)
- **DSGVO**: Opt-In erforderlich, lokales Whisper möglich (keine Cloud-Daten)

**Predictive Lead Scoring (ML-basierte Opportunity-Bewertung):**

- **Problem gelöst**: Vertrieb priorisiert mit "Bauchgefühl" statt Daten → ineffiziente Akquise
- **Lösung**: ML-Modell (XGBoost/LightGBM) berechnet Conversion-Wahrscheinlichkeit (0-100 Score) basierend auf Firmographics, Interaction History, Sentiment
- **Erwarteter Impact**: +10-20% höhere Conversion Rate (Benchmark: Salesforce Einstein)
- **Explainability**: SHAP/LIME für transparente KI-Entscheidungen (DSGVO-konform)

**Project Risk Assessment (Risikofrüherkennung):**

- **Problem gelöst**: Projekte geraten "plötzlich" in Schieflage (Budget/Verzug)
- **Lösung**: KI-Dashboard mit automatischen Risk Indicators (Budget >80%, Zeitplan >10% Verzug, ML-Modell "Delay Prediction")
- **Nutzen**: Proaktive Steuerung statt Reaktion, weniger Überraschungen beim Kunden

**Siehe auch:** `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 1 (Seiten 110-341)

---

### 🔔 Echtzeit-Kollaboration (Pillar 2: Active Collaboration)

**Activity Feed & Smart Notifications:**

- **Problem gelöst**: Wichtige Updates (Task-Assignments, Status-Änderungen) gehen in E-Mail-Flut unter
- **Lösung**: Echtzeit-Activity-Stream + Push-Notifications (@-Mentions, Task-Assignments, Approvals)
- **Technologie**: Socket.IO + Redis Adapter (horizontale Skalierung), WebSocket für Real-Time
- **Intelligent Filtering**: Nur relevante Events notifizieren (kein Spam)

**Contextual Commenting:**

- **Problem gelöst**: Diskussionen über Angebots-Positionen/Tasks laufen in E-Mail/Slack → Kontext verloren
- **Lösung**: Kommentare direkt AN Entitäten (Offer-Position, Task, Document) → Kontext bleibt erhalten
- **Audit Trail**: Alle Diskussionen nachvollziehbar (GoBD-konform)

**Presence Indicators (Phase 2.2):**

- **Vision**: Nutzer sehen in Echtzeit, wer gerade welchen Kunden/Projekt öffnet → Kollisions-Vermeidung (weniger CouchDB-Konflikte)

**Siehe auch:** `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 2 (Seiten 343-567)

---

### 🌐 Customer Portal (Pillar 2: B2B2C Engagement)

**Project Status Dashboard für Kunden:**

- **Problem gelöst**: Kunde muss ständig anrufen "Wie weit ist das Projekt?" → Planer schreibt manuell Statusberichte
- **Lösung**: Sicheres Kunden-Portal (Magic Link Authentication) → Kunde sieht Projekt-Status, Budget, Zeitplan, Phasen live
- **Features**: Document Download (Angebote/Rechnungen), Approval-Workflow, Secure Communication Channel, Photo Gallery (Baufortschritt)
- **Security**: Kunde sieht NUR eigene Projekte, keine internen Kalkulationen, Audit Log für Compliance

**Erwarteter Impact:**

- -40% weniger "Wo bleibt ihr?"-Anrufe
- NPS (Net Promoter Score) >60 bei Portal-Nutzern
- Angebots-Freigabe 2 Tage schneller (vorher 5 Tage)

**Siehe auch:** `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 2.2 (Seiten 480-567)

---

## Phase 2.2 (Q4 2025): Advanced Analytics & Self-Service BI

### 📊 Customizable Dashboards (Pillar 3: Data-Driven Insights)

**Drag & Drop Dashboard-Builder:**

- **Problem gelöst**: GF will unterschiedliche KPIs tracken → muss Developer beauftragen → 3 Tage Wartezeit
- **Lösung**: Low-Code Dashboard-Editor → GF baut eigene KPI-Views in 5 Min (Widget Library: Umsatz, Pipeline, Top Deals, Team-Performance)
- **Custom Filters & Drill-Downs**: "Zeige nur Opportunities >€50K aus Q1 2025" + Detail-Tabellen
- **Sharing**: Dashboards mit Team teilen, Permissions konfigurieren

**CQRS für High-Performance Analytics:**

- **Problem gelöst**: CouchDB MapReduce-Views zu langsam (10-30s für "Umsatz pro Quartal pro Branche")
- **Lösung**: CQRS Pattern → CouchDB (Write Store) + PostgreSQL (Read Store) → 10-100x schnellere Queries
- **Performance**: Dashboard-Load <2s (P95) statt >10s
- **Eventual Consistency**: 1-5s Replikations-Latenz (akzeptabel für Reports)
- **BI-Tool-Integration**: Grafana, Metabase, Apache Superset können PostgreSQL anbinden

**Siehe auch:**

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 3 (Seiten 569-753)
- `docs/architectur/` → ADR-017 (CQRS für Analytics)

---

### 🗺️ Advanced Route Planning (Pillar 3: Außendienst-Effizienz)

**Intelligent Route Optimization:**

- **Problem gelöst**: Außendienst plant Touren manuell → suboptimale Reihenfolge → Zeitverschwendung, hohe Spritkosten
- **Lösung**: Multi-Stop Route Optimization (Traveling Salesman Problem) + Nearby Lead Mapping (opportunistische Zusatzbesuche)
- **Automated Check-Ins**: Geofencing → Auto-Prompt "Check-In bei Kunde X?" → One-Click-Protokoll (Voice-Memo + Whisper)
- **Erwartete Einsparungen**: 1-2h/Woche + €50-100/Monat Sprit pro Außendienstler = €600-1200/Jahr Gesamtersparnis

**Siehe auch:** `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 3.1 (Seiten 580-644)

---

## Phase 3 (Q1-Q2 2026): Autonomous Actions & Advanced AI

**Automated Sales Summarization:**

- System generiert automatisch Wochen-/Monatsberichte für GF ("Top 5 Deals", "Umsatzprognose Q1", "Risiken & Chancen")
- LLM-basiert (GPT-4 oder selbst-gehostetes Llama 3 70B)

**Predictive Forecasting:**

- Umsatzprognose mit Time-Series-ML (ARIMA, Prophet, LightGBM)
- "Wie viel Umsatz machen wir voraussichtlich in Q2?" → Confidence Intervals (z.B. €250K-€350K mit 80% Konfidenz)

**Collaborative Editing (Real-Time):**

- Live-Editing von Angeboten/Projekten mit CRDTs (Conflict-Free Replicated Data Types)
- Google Docs-ähnliche Collaboration, offline-fähig

**Siehe auch:** `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 1 Phase 3 (Seiten 276-301)

---

## Technische Enabler (Phase 2+)

### Observability & Monitoring (Phase 1.5 - parallel zum MVP)

**Grafana Stack für Production-Ready Operations:**

- **Problem**: Keine Sichtbarkeit in Systemverhalten → reaktives Firefighting bei Problemen
- **Lösung**: Prometheus (Metrics) + Grafana Loki (Logs) + Grafana Tempo (Distributed Tracing) + Grafana (Dashboards)
- **OpenTelemetry**: Standardisierte Instrumentation (NestJS + React)
- **SLI/SLO-Definition**: API Response Time (P95 <1,5s), Error Rate (<1%), Availability (>95%)
- **Alerting**: Grafana-Alerts bei SLO-Bruch (z.B. "API P95 überschreitet 2s")

**Siehe auch:**

- `docs/architectur/` → "Observability & Monitoring (Production-Ready Operations)"
- `docs/reviews/OBSERVABILITY_STRATEGY.md`
- ADR-015 (Observability-Stack)

---

### Real-Time-Kommunikationsarchitektur (Phase 2)

**Socket.IO + Redis Adapter:**

- Bidirektionale Echtzeit-Kommunikation für AI-Job-Status-Updates, Notifications, Presence Indicators
- Horizontale Skalierung via Redis Pub/Sub (2+ Backend-Instanzen)
- Automatische Reconnection, Room-basierte Broadcasting

**Siehe auch:**

- `docs/architectur/` → "Real-Time-Kommunikationsarchitektur (Phase 2+)"
- ADR-016 (Real-Time-Kommunikationslayer)

---

### CQRS-Datenbankarchitektur (Phase 2.2)

**CouchDB → PostgreSQL Replication:**

- Trennung OLTP (CouchDB - Write Store) vs. OLAP (PostgreSQL - Read Store)
- NestJS Replication Service via CouchDB `_changes` Feed
- 10-100x Performance-Gewinn für Analytics-Queries

**Siehe auch:**

- `docs/architectur/` → "Erweiterte Datenbankarchitektur & Skalierung (CQRS Pattern)"
- ADR-017 (CQRS für Analytics)

---

## Erfolgsmetriken (KPIs für Phase 2/3)

| Phase   | Feature                | Ziel-Metrik                                       | Messung                    |
| ------- | ---------------------- | ------------------------------------------------- | -------------------------- |
| **2.1** | Audio-Transkription    | 70% Adoption (Außendienst nutzt bei Besuchen)     | CouchDB Analytics          |
| **2.1** | Lead Scoring           | +15% höhere Conversion Rate                       | A/B-Test (mit vs. ohne KI) |
| **2.1** | Activity Feed          | -30% weniger "Hab ich nicht gesehen"-Eskalationen | Support-Tickets            |
| **2.2** | Customer Portal        | 50% aller aktiven Projekte nutzen Portal          | CouchDB Analytics          |
| **2.2** | Custom Dashboards      | 60% Self-Service-Rate (ohne Dev-Involvement)      | Support-Tickets            |
| **2.2** | Route Planning         | 1,5h/Woche Zeitersparnis pro Außendienstler       | User-Survey                |
| **2.2** | CQRS Analytics         | Dashboard-Load <2s (P95)                          | Performance-Monitoring     |
| **3**   | Predictive Forecasting | <10% Abweichung Prognose vs. Ist-Umsatz           | Quartals-Vergleich         |
| **3**   | Project Risk Precision | >70% korrekte Vorhersagen (keine False Alarms)    | Historical Validation      |

---

## Empfehlung: Inkrementeller Rollout

**Phase 2 nicht als "Big Bang", sondern als iterative Releases:**

1. **Phase 2.1 (Q3 2025):**
   - Audio-Transkription (Pilotgruppe: 3 Außendienstler)
   - Activity Feed (alle Nutzer)
   - Observability-Stack (produktionsreif)

2. **Phase 2.2 (Q4 2025):**
   - Lead Scoring (A/B-Test mit 5 Nutzern)
   - Customer Portal (MVP: 5 Pilotkunden)
   - CQRS + Custom Dashboards (GF + 2 Teamleiter)

3. **Phase 3 (Q1-Q2 2026):**
   - Vollständiger Rollout aller Phase 2-Features
   - Predictive Forecasting
   - Collaborative Editing (Beta)

**Change Management:** Jede Phase benötigt **Training** (2h Workshop + Dokumentation) + **Feedback-Loops** (wöchentliche Retrospektiven in ersten 4 Wochen).

---

**Siehe auch:**

- **Vollständige Vision**: `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md`
- **Technische Architektur**: `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md`
- **ADRs**: ADR-015 (Observability), ADR-016 (Real-Time), ADR-017 (CQRS), ADR-018 (AI Integration)

---

# Mit diesen Empfehlungen – insbesondere der schrittweisen Einführung, dem frühzeitigen Testen kritischer

# 10. Quellen

**Nimble Blog –** _Expert Picks: 5 Best CRMs for Project Management_ (Gabrielle Lohr, Nimble, 9. Jan. 2024) –
Übersichtsartikel zu CRM-Systemen mit Projektmanagement. Enthält Vorteile der CRM-PM-
Integration und nennt Beispiele (Nimble, Wrike, Monday, Insightly, vTiger). Relevant für Best
Practices und Marktvergleich
.

# Insightly (Website) – CRM with Project Management Built In (Insightly Inc., abgerufen im Nov. 2025) –

# Interview-Transkript „SG_Interview_31.10.25 (deutsch)“ (firmenintern, Oktober 2025) – Wörtliches

# Zendesk Blog – What is a 360 customer view? (Jacqueline Janes, Zendesk, 27. März 2024) – Fachartikel

# AgileCRM Blog – 14 mind-blowing statistics that prove the need for a CRM (AgileCRM, 28. Feb. 2019) –

# Interview-Zusammenfassung/Auswertung (firmenintern, 2025) – Verdichtete Zusammenfassung

# 26

**Lexware Office Public API –** _Offene Schnittstelle für individuelle Anwendungen_ (Haufe-Lexware GmbH,
abgerufen im Nov. 2025) – Produktseite zur Lexware Office API. Beschreibt verfügbare Funktionen
(Lesen/Anlegen von Angeboten, Rechnungen, Kontakten etc.) und ermöglicht die Integration von
Lexware mit CRM-, Shop- oder Branchensoftware
.

# BuddyCRM Blog – The Importance of Mobile CRM: Boosting Sales Productivity On-the-Go (BuddyCRM,

# SugarCRM (Website) – Unterstützung für mehrere Sprachen und mehrere Währungen (SugarCRM Inc.,

# Pipedrive (Website) – Mehrsprachig und multiwährungsfähig (Pipedrive, abgerufen Nov. 2025) –

# ControllingPortal – Kosten- und Leistungsrechnung – Teil   5: Nachkalkulation (Jörgen Erichsen,

# p17 GmbH – cobra CRM in Kombination mit einer Lexware Schnittstelle (Integrationsanbieter,

# ERP.de –

# 27

| 2   | 3   | 4   |     | 5   |     |     | 6   |     |     | 8   |     |     | 9   |     | 10  |     |     | 11  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 28  | 29  | 30  |     | 31  |     |     | 32  |     |     | 33  |     |     | 34  |     | 35  |     |     | 36  |     |
| 51  | 52  | 53  |     | 54  |     |     | 55  |     |     | 58  |     |     | 59  |     | 51  |     |     | 56  |     |
| 105 | 63  | 107 |     |     | 106 |     |     | 97  |     |     | 109 |     | 110 |     |     | 111 |     |     |     |

| 25 49 | 26  |     |
| ----- | --- | --- |
|       | 50  |     |
| 102   | 103 |     |

---

_Page 71_

---

# Executive Summary.pdf

## file://file_00000000ccc07243a204aa1796638251

# sg_interview_31.10.25_deu.txt

file://file_00000000d55c7243b1e3ef266ec6ed0e

### CRM Project Management | Insightly

## https://www.insightly.com/crm-project-management/

### The Importance of Mobile CRM: Boosting Sales Productivity On-the-Go - BuddyCRM

## https://buddycrm.com/crm-advice/importance-of-mobile-crm/

### Public API

## https://www.lexware.de/partner/public-api/

### Unterstützung für mehrere Sprachen und mehrere Währungen | SugarCRM DE

## https://www.sugarcrm.com/de/platform-features/multilingual-multicurrency-support/

### KLR Teil 5: Nachkalkulation und Kennzahlenauswahl zu Kostenrechnung und Kalkulation

## https://www.controllingportal.de/Fachinfo/Kostenrechnung/Kosten-und-Leistungsrechnung-Aus-der-Praxis-fuer-die-Praxis-Teil-5-

Nachkalkulation-und-Kennzahlenauswahl-zu-Kostenrechnung-und-Kalkulation.html

### cobra CRM in Kombination mit einer Lexware Schnittstelle

## https://www.cobra.de/crm-cxm-software/schnittstellen-zusatzmodule/lexware

### Mehrsprachig und Multiwährungsfähig | Pipedrive

## https://www.pipedrive.com/de/features/multilingual-multi-currency

### Projektverwaltung mit der ERP-Software - ERP.de

## https://www.erp.de/erp-software/projektmanagement/projektverwaltung-mit-der-erp-software

### 28

| 1   | 2   | 3   |
| --- | --- | --- |
| 44  | 45  | 46  |
| 96  | 97  | 98  |

| 6   | 7   | 8   |     | 9   |     |     | 10  |     |     | 11  |     |     |     | 12  |     |     |     | 14  |     |     | 16  |     |     | 17  |     |     | 18  | 23  | 25  | 26  | 27  |     | 28  |     |     | 32  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48  | 49  | 50  |     | 58  |     |     | 60  |     |     | 62  |     |     |     | 63  |     |     |     | 64  |     |     | 65  |     |     | 66  |     |     | 67  | 71  | 77  | 81  | 82  |     | 83  |     |     | 84  |
| 100 | 101 | 102 |     |     | 103 |     |     | 106 |     |     |     | 107 |     |     |     | 108 |     |     |     | 109 |     |     | 110 |     |     | 111 |     | 112 | 113 | 114 | 115 |     |     | 119 |     | Ex  |
