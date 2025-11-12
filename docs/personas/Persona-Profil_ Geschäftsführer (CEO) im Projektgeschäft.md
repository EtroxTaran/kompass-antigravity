# Persona-Profil_ Geschäftsführer (CEO) im Projektgeschäft

*Converted from: Persona-Profil_ Geschäftsführer (CEO) im Projektgeschäft.pdf*  
*Document Version: 2.0*  
*Last Updated: 2025-11-10*

**⚡ Relevante Spezifikationen für Geschäftsführer-Rolle:**
- **Offline-Speicher:** 240 KB ✅ (minimal) – Nur Dashboard-Aggregat-Daten (100 Summary-Docs×2KB), keine großen Dateien
- **RBAC-Berechtigungen (RISK-JOURNEY-001):** Siehe RBAC_PERMISSION_MATRIX.md §3-6
  - **Voller Zugriff** auf alle Business-Daten (alle Kunden, Opportunities, Projekte, Rechnungen)
  - **Exklusiver Zugriff** auf strategische Daten: profitMargin, actualMargin, competitorInfo
  - **Approval-Rechte:** Rabatte >10%, Opportunities >€50k, Konflikt-Eskalationen, Rechnungs-Korrekturen
  - **Audit-Sichtbarkeit:** Zugriff auf alle Audit-Logs und Compliance-Dashboards
- **User Journeys:** Siehe USER_JOURNEY_MAPS.md
  - Journey 1: Approval-Rolle (Rabatt-Freigabe bei hohen Opportunities)
  - Journey 3: Eskalations-Rolle (Entscheidung bei komplexen Änderungsanfragen)
  - Journey 4: Executive Review (monatliches Dashboard-Review, 15-30 Minuten, Export für Vorstand)
  - Konflikt-Eskalation: Endgültige Entscheidung bei €50k+ Conflicts
- **Dashboard:** Siehe NFR_SPECIFICATION.md §1.2
  - Load-Zeit: P95 ≤3-4s (komplex mit vielen Widgets)
  - Real-Time-Updates (kein wöchentliches Excel-Warten)
  - Mobile-optimiert (iPad/iPhone-Zugriff unterwegs)

---

# Persona-Profil: Geschäftsführer (CEO) im

### Einleitung & Kontext

Der Geschäftsführer (CEO) eines mittelständischen Ladenbau-/Innenausbau-Unternehmens nimmt im
Gesamtkonzept des integrierten CRM- und Projektmanagement-Tools eine zentrale Rolle ein. Als oberste
Managementfigur ist er für die strategische Ausrichtung und den Unternehmenserfolg verantwortlich
.
Im Kontext dieses Tools repräsentiert die Persona „Geschäftsführer“ die Sicht der Geschäftsleitung, die
jederzeit den **Gesamtüberblick** über Kunden, Projekte und Kennzahlen benötigt
. Das Persona-Profil
dient dazu, die Anforderungen und Erwartungen des Geschäftsführers an das System klar zu definieren.
Dadurch wird sichergestellt, dass die Entwicklung des CRM/PM-Tools strategisch fundiert ist und die
Bedürfnisse der Führungsebene genauso berücksichtigt wie die der operativen Nutzer. Insbesondere in
einem projektorientierten Unternehmen im Ladenbau müssen Entscheidungen oft schnell und auf Basis
aktueller Daten getroffen werden. Eine gut ausgearbeitete Geschäftsführer-Persona hilft, diese
Entscheidungsprozesse bei der Tool-Konzeption abzubilden und das **Warum** hinter den Funktionen zu
verstehen.

# Im vorliegenden Gesamtkonzept wird der Geschäftsführer als wichtiger Stakeholder gesehen, der durch

# Persona-Übersicht: Rolle, Verantwortungsbereich, Motivation, Pain

**Rolle & Verantwortungsbereich:**
Der Geschäftsführer ist oberster Entscheidungsträger des
Unternehmens. Seine Hauptaufgaben umfassen die **strategische Planung** , die **operative Leitung** des
Geschäfts und die Überwachung des Tagesbetriebs
. In einem mittelständischen Projektfertiger
bedeutet dies, dass er sowohl die Umsatz- und Gewinnziele verantwortet als auch nah am operativen
Geschehen bleibt
. Er vertritt die Firma nach außen gegenüber Kunden, Partnern und Gesellschaftern
und trifft alle geschäftskritischen Entscheidungen – von Investitionen über Budgetverteilung bis hin zur
Kundenakquise. Im Ladenbau/Innenarchitektur-Kontext ist der GF typischerweise auch in wichtige
Kundenprojekte involviert, etwa bei Großaufträgen oder kritischen Verhandlungen.

# Motivation & Ziele: Der GF ist motiviert, das Unternehmen erfolgreich und nachhaltig zu führen. Er strebt


Berichte angewiesen zu sein. Ihm ist wichtig, **jederzeit den Überblick** zu haben – sowohl über den
Vertriebs-Trichter (Pipeline, Angebote, Auftragsstand) als auch über laufende Projekte und
Ressourcenauslastungen
. Außerdem ist er motiviert, interne Prozesse effizient zu gestalten und
silofreie Zusammenarbeit zu fördern, da dies letztlich die Unternehmensleistung verbessert.

# Pain Points (Schmerzpunkte): Aktuell kämpft der GF oft mit verteilten Datenquellen und Intransparenz .

# Mangelnder Echtzeit-Überblick : Der GF erhält Informationen oft zeitverzögert. Ohne aktuelle


**Stakeholder & Schnittstellen:** Der Geschäftsführer ist eng verflochten mit praktisch allen Stakeholdern
des Unternehmens. Intern zählen dazu die Abteilungsleiter (Vertriebsleiter, Projektleiter, Leiter Innendienst/
Planung, Finanzleitung/Buchhaltung). Er muss Informationen aus Vertrieb, Planung und Finance bündeln

| 9 |  | . |
| --- | --- | --- |
| t | 5 |  |

und gegenüber den **Gesellschaftern/Eigentümern** und ggf. dem Beirat vertreten. Extern ist der GF
Ansprechpartner für **Schlüsselkunden** – gerade bei größeren Projekten erwarten manche Kunden, den
Geschäftsführer in wichtigen Meetings präsent zu haben
. Zudem interagiert er mit Banken (bei
Investitionen), Lieferanten (z.B. bei strategischen Partnerschaften) und Branchennetzwerken. Im Alltag
wirken die Entscheidungen des GF auf alle Unternehmensbereiche: von der Priorisierung bestimmter
Angebote über die Freigabe von Budgets bis zur Personalplanung. Daher sind **alle Prozess-Touchpoints**
relevant: Vertriebspipeline, Angebotslegung, Auftragsmanagement, Projektplanung, Ressourcenallokation,
Controlling. Der GF benötigt an all diesen Touchpoints zumindest Übersichtsinformationen, um seine
Stakeholder informieren und steuern zu können.

# Relevante Prozesse & Touchpoints: Typische Berührungspunkte des GF mit dem CRM/PM-System sind:

**Sales Pipeline Review:** Der GF schaut regelmäßig (z.B. wöchentlich) auf die Vertriebsübersicht. Er
prüft offene Leads, laufende Angebote und deren Wahrscheinlichkeiten. Hier braucht er ein
**Dashboard für Vertriebskennzahlen** , das z.B. zeigt: *Pipeline-Wert nach Wahrscheinlichkeit* , *Anzahl*
*Angebote vs. Aufträge* , *erwarteter Umsatz bis Jahresende*
. Touchpoint: Vertriebs-Dashboard.
**Projektstatus-Meetings:** In Projekt-Review-Meetings (monatlich oder ad-hoc bei Problemen) nutzt
der GF Berichte aus dem PM-Tool. Er verschafft sich einen Überblick über **alle laufenden Projekte** :
Ampel-Status, Budget vs. Ist, Meilensteine, Risiken. Wichtig ist ihm, kritische Projekte zu
identifizieren. Touchpoint: Projektportfolio-Übersicht.
**Strategische Entscheidungen zu Leads/Projekten:** Wenn ein akquirierter potenzieller Auftrag sehr
aufwändig wird oder ins Stocken gerät, wird der GF oft einbezogen, um zu entscheiden, ob weiter
investiert wird oder ob man einen „Schritt zurückgeht“
. Er benötigt dann aus dem System
auf Knopfdruck die bisherigen Aufwendungen (z.B. bereits investierte Planer-Stunden aus der
Zeiterfassung) und den Verlauf der Kundenkommunikation, um abzuwägen, ob das Projekt noch
rentabel oder aussichtsreich ist. Touchpoint: Kunden-/Opportunity-Detailansicht mit Historie.
**Eskalationsstufe bei Kundenverhandlungen:** Bei wichtigen Angeboten kann es vorkommen, dass
der GF persönlich beim Kundentermin anwesend ist, um das Vertrauen zu stärken oder bei
schwierigen Verhandlungen zu überzeugen
. In solchen Fällen muss er sich kurzfristig in das
CRM-System einloggen können, um **alle Kundendaten und die Angebotsdetails** schnell zu
erfassen
. Touchpoint: Kundenakte/CRM mit Gesprächsnotizen, Angebotshistorie.
**Ressourcen- und Kapazitätsplanung:** Der GF beteiligt sich an der übergreifenden
Ressourcenplanung, insbesondere wenn es um die mittelfristige Auslastung geht. Er will sehen, **in**
**welchen Monaten/Quartalen wie viele Projekte** voraussichtlich umgesetzt werden, um Engpässe
zu erkennen
. Gemeinsam mit Innendienst- und Planungsleitung achtet er darauf, dass
ausreichend Personal verfügbar ist bzw. rechtzeitig Neueinstellungen oder Outsourcing erfolgen.
Touchpoint: Kapazitätsplanung/Forecast im PM-Tool.
**Finanz-Controlling:** Zusammen mit der Buchhaltung überprüft der GF regelmäßig Umsatz, Kosten
und Margen pro Projekt. Falls das CRM/PM-System hier integriert ist, möchte er Reportings daraus
ziehen (z.B. *Umsatz pro Kunde* , *Deckungsbeitrag je Projekt* , *Offene Forderungen* ). Häufig exportiert er
diese Zahlen für Quartalsberichte. Touchpoint: Controlling-Reports (evtl. BI-Integration).

**Tour-Kosten-Übersicht (Phase 2):** Der GF benötigt Transparenz über die Kosten der Außendienst-Touren, um die Effizienz des Vertriebs zu bewerten. Im Dashboard sieht er:
- **Monatliche Tour-Kosten:** Gesamtausgaben für Touren (Fahrtkosten, Übernachtungen, Verpflegung) pro Monat
- **Kosten pro Tour:** Durchschnittliche Kosten pro Tour (z.B. €450/Tour) mit Trendanalyse
- **Kosten pro Kundenbesuch:** Berechnung: Tour-Kosten ÷ Anzahl besuchter Kunden (z.B. €45/Besuch)
- **Tour-ROI (zukünftig):** Vergleich Tour-Kosten vs. gewonnene Opportunities/Umsatz pro Tour
- **Ausgaben-Genehmigungen:** Anzahl ausstehender Genehmigungen für Ausgaben >€100
- **Top-Kostenverursacher:** Welche ADM-Mitarbeiter haben die höchsten Tour-Kosten? (zur Effizienzanalyse)

Diese Metriken helfen dem GF zu erkennen, ob Touren kosteneffizient sind und wo Optimierungspotenzial besteht (z.B. Routenoptimierung, Hotelauswahl). Touchpoint: Dashboard-Widget "Tour-Kosten-Übersicht" und monatlicher Expense-Report.
**Qualitäts- und Risiko-Management:** Der GF hat Interesse an aggregierten **Statistiken** aus dem
System, die über das Tagesgeschäft hinausgehen. Beispielsweise möchte er auswerten können,
**welche Vertriebskanäle** besonders erfolgreich sind (Messekontakte vs. Telefonakquise vs. E-Mail-
Leads)
oder wie viele Kundenkontakte durchschnittlich nötig sind bis zum Abschluss
.
Solche Auswertungen fließen in strategische Überlegungen (Marketingbudget, Vertriebsansätze)
ein. Touchpoint: Analytics/BI-Modul des CRM.


Zusammenfassend ist der Geschäftsführer in viele Prozesse involviert, jedoch meist auf **Entscheider-Ebene** .
Er benötigt keine Detailbearbeitung einzelner Datensätze, aber **Übersicht, Kennzahlen und Alerts** an allen
wichtigen Touchpoints, um seiner Steuerungsfunktion gerecht zu werden.

# Aufgaben & Prozesse: Workflows, Entscheidungswege,

**Typische Workflows des Geschäftsführers:**

**Strategische Jahresplanung:** Zu Beginn des Jahres (oder Geschäftsjahres) definiert der GF
zusammen mit dem Führungsteam Ziele und Budgets. Hierbei analysiert er die Vorjahresdaten und
Pipeline im System: *Wie viel Umsatz ist realistisch? Welche Großprojekte stehen an?* Aus dem CRM/PM-

1.

Tool möchte er Prognosen entnehmen können, z.B. den Wert aller Angebote mit hoher
Wahrscheinlichkeit und geplante Projektvolumina je Quartal
. Entscheidungsweg: GF prüft Daten
-> stimmt sich mit Vertrieb/Planung ab -> setzt Ziele (abhängig von Datenqualität im System).
**Vertriebssteuerung & Pipeline-Review:** Wöchentlich oder monatlich prüft der GF die Sales-Pipeline.
Er identifiziert z.B. die **Top 10 offenen Angebote** nach Volumen und fragt den Vertriebsleiter nach
deren Status. Wenn ein Quartalsziel gefährdet scheint, entscheidet er über Maßnahmen (z.B.
Marketingaktionen, Umverteilung von Leads). Dieser Workflow hängt stark von aktuellen CRM-Daten
ab – der GF ist darauf angewiesen, dass alle Verkaufschancen im System gepflegt sind.
Abhängigkeiten: Außendienst muss Daten einpflegen; ohne vollständige Pipeline-Daten kann der GF
keine fundierten Entscheidungen treffen.
**Projektportfoliosteuerung:** Der GF lässt sich monatlich einen Überblick über alle laufenden
Projekte geben (in einem Portfolio-Meeting mit dem Projektleiter/Innendienstleiter). Vorab ruft er im
PM-Tool ein **Portfolio-Dashboard** auf, das Projektstatus, Budgetabweichungen und
Fertigstellungsgrade zeigt. In der Sitzung werden Projekte mit gelbem/rotem Status besprochen.
Entscheidungspfad: GF entscheidet ggf. über Extra-Ressourcen oder über Prioritätsänderungen (z.B.
ein neuer Großauftrag erfordert Umplanung). Abhängigkeit: Er ist darauf angewiesen, dass
Projektleiter ihre Meilensteine, Kosten und Risiken im System aktuell halten, sonst basiert seine
Steuerung auf falschen Annahmen.
**Eskalations-Entscheidungen in Akquisephase:** Bei schwierigen Verkaufsverhandlungen oder
Großprojekten wird der GF punktuell eingebunden. Z.B. wenn ein Angebot die Kompetenz des
Vertriebslers übersteigt (etwa komplexe Vertragskonditionen), springt der GF ein. Er bereitet sich
kurzfristig vor, indem er im CRM alle Kundeninteraktionen, Anforderungen und bereits angebotenen
Leistungen nachliest
. Danach nimmt er an einem Kundentermin teil und hilft, den Abschluss
herbeizuführen
. Hier ist der Entscheidungsweg kurz: GF wird vom Vertrieb um Unterstützung
gebeten -> GF informiert sich im System -> GF trifft vor Ort (mit dem Kunden) Entscheidungen, z.B.
gewährt er besondere Konditionen oder bestätigt Projektumfang, um den Auftrag zu sichern.
**Freigabe und Priorisierung von Projekten:** Nicht jedes angefragte Projekt wird automatisch
angenommen. Der GF evaluiert potenzielle Projekte strategisch (Rentabilität, Referenzwert,
Kapazitätsauslastung). Im System schaut er sich die *Vor-Kalkulation* und *Kundenhistorie* an. Falls z.B.
ein Bestandskunde ein Projekt will, das knapp kostendeckend ist, entscheidet der GF, ob es aus
Beziehungsgründen dennoch angenommen wird. Entscheidungsweg: Vertrieb legt Projektantrag im
System an -> GF prüft Kennzahlen (pot. Umsatz, erwartete Marge, strategischer Wert) -> GF gibt
grünes Licht oder lehnt ab. Abhängigkeiten: Er braucht verlässliche Kalkulationsdaten und ggf.
Ratings (Kunde A = strategisch wichtig), die das System bereitstellen sollte.

# 2.

3.

4.

# 5.


**Kontrolle von Meilensteinen und kritischen Aufgaben:** Bei Projekten mit langen Vorlaufzeiten
gibt es kritische Punkte (z.B. Bestellung individueller Kühlgeräte mit >12 Wochen Lieferzeit). Der GF
will sicherstellen, dass solche Deadlines eingehalten werden. Normalerweise liegt die operative
Verantwortung beim Innendienst, aber der GF möchte eine *Sicht oder Benachrichtigung* , wenn etwas
kritisch wird
. Z.B. könnte das System alarmieren: „Bestellung für Bauteil X noch nicht erfolgt –
Projekt Y gefährdet Eröffnungstermin“. Workflow: System generiert Alert -> Innendienst reagiert
oder eskaliert -> GF wird informiert und kann bei Bedarf intervenieren (z.B. Priorisierung beim
Lieferanten veranlassen). Diese übergreifende Prozessaufsicht ist neu durch das Tool möglich und
verbessert die Reaktionsgeschwindigkeit.
**Reporting und Review mit Gesellschaftern:** Quartalsweise oder jährlich bereitet der GF Berichte
für Gesellschafter/Beirat vor. Hier fließen Zahlen aus CRM/PM ein: *Akquise-Quote, Auftragseingang,*
*Umsatz, Projektrendite, Pipeline für nächstes Quartal* . Bisher war dies ein manuelles Zusammenführen;
im neuen System sollte er idealerweise Standardreports abrufen können. Workflow: GF generiert
Bericht aus Tool -> ergänzt ggf. Kommentare -> stellt in Meeting vor. Abhängigkeit: Die
**Datenqualität** und Aktualität im System bestimmen die Glaubwürdigkeit des Reports. Wenn das
Tool unvollständige Daten liefert, muss der GF doch wieder manuell nacharbeiten – was die
Akzeptanz des Systems gefährden würde.

6.

# 7.

**Entscheidungswege & Abhängigkeiten:** Der Geschäftsführer trifft Entscheidungen oft in Abstimmung mit
seinem Führungsteam, doch letztlich verantwortet er sie alleine. Seine Entscheidungswege sind geprägt
von **Dateninput aus verschiedenen Bereichen** : Vertrieb (Pipeline, Aufträge), Finanzen (Ergebnisse,
Cashflow), Projekte (Status, Risiken). Das integrierte Tool wird hier zum **Dreh- und Angelpunkt** , da es
idealerweise all diese Daten vereint. Schnelle Entscheidungen – etwa bei drohender Zielverfehlung im
Vertrieb – hängen davon ab, dass der GF *in kurzer Zeit die relevanten Informationen erfassen* kann
. Ist
er z.B. kurzfristig in ein Projektgespräch involviert, muss er ohne lange Einarbeitung den Projektstand
verstehen können
. Hier zeigt sich eine Abhängigkeit von der **Usability** des Tools: Nur wenn die
Aufbereitung der Daten übersichtlich ist, kann er effizient entscheiden.

# Ein weiterer Punkt ist die Abhängigkeit von Mitarbeiter-Inputs : Das beste System nützt nichts, wenn die

# Zusammengefasst sind die Arbeitsprozesse des GF stark auf

# Anforderungen & Erwartungen: Funktionale und nicht-funktionale

**Funktionale Anforderungen an das Tool (aus Sicht des GF):**

**Echtzeit-Dashboard & Gesamtüberblick:** Oberste Priorität hat ein **zentrales Management-**
**Dashboard** , das dem GF „auf Knopfdruck“ alle wesentlichen Kennzahlen liefert
. Dieses


Dashboard muss **alle relevanten KPIs** bündeln – von Finanzen über Vertrieb bis Projekte
.
Konkret erwartet der GF Kennzahlen wie *Auftragseingang vs. Ziel* , *Umsatz (Ist vs. Plan)* , *Offene Angebote*
*mit Wahrscheinlichkeit* , *Anzahl laufender Projekte nach Status* , *Fertigstellungsgrad wichtiger Projekte* etc. Ab Phase 2 ergänzt um **Tour-Kosten-Metriken**: *Monatliche Tour-Ausgaben* , *Kosten pro Kundenbesuch* , *Ausstehende Expense-Genehmigungen* (für Ausgaben >€100).
Auf einen Blick will er erkennen: *Wo stehen wir insgesamt diesen Monat/Quartal?* Entscheidungen
sollen schneller und faktenbasiert möglich sein
. Das Dashboard sollte visuell ansprechend und
verständlich sein, idealerweise mit grafischer Aufbereitung komplexer Daten
(z.B.
Umsatztrend als Liniendiagramm, Pipeline nach Quartal als Balkendiagramm).
**Kunden- & Vertriebsübersicht:** Das CRM-Modul muss dem GF erlauben, **die Pipeline nach**
**Vertriebler und Zeitraum** auszuwerten. Er möchte z.B. sehen können, welcher
Außendienstmitarbeiter wieviel potentiellen Umsatz in der Pipeline hat und wer evtl. Unterstützung
braucht
. Ebenso erwartet er, nachschauen zu können, welche *Top 10 Kunden* zum Jahresumsatz
beitragen und wo evtl. Handlungsbedarf besteht (z.B. *Key Account X hat rückläufigen Umsatz* ).
Funktional heißt das: Filter- und Drill-down-Funktionen im Dashboard (von Gesamtumsatz auf
Regionen oder einzelne Mitarbeiter herunterbrechen)
. Zudem wünscht er die Möglichkeit,
Kundenhistorien einzusehen: *Wie oft hat Kunde Y angefragt, wie viele Angebote, wie viele Abschlüsse?* –
um erfolglose Leads zu identifizieren
.
**Projektportfolio-Management:** Das PM-Modul soll eine **Projektportfolio-Ansicht** bieten, in der alle
laufenden (und geplanten) Projekte mit Kerninformationen gelistet sind: Projektname, Kunde,
Volumen, Start-/Enddatum, Status (Ampel), Budget vs. Ist-Kosten, Verantwortlicher Projektleiter. Der
GF will Projekte nach *Fertigstellungsgrad* oder *Status* sortieren können, um kritische Projekte zu
finden. Auch die zeitliche Verteilung der Projekte über das Jahr sollte sichtbar sein (etwa ein Kalender
oder Timeline, um zu sehen, in welchen Monaten Ballungen auftreten)
. Dies hilft ihm bei
strategischen Kapazitätsentscheidungen.
**Frühwarnsystem & Alerts:** Eine wichtige Anforderung ist die Implementierung von
**automatisierten Benachrichtigungen** bei definierten Schwellenwerten oder Ereignissen. Beispiele:
*“Projekt A ist 2 Wochen im Verzug”* , *“Kosten von Projekt B haben 90% des Budgets erreicht”* , *“Deadline für*
*Bestellung in Projekt C in 5 Tagen”* . Insbesondere will der GF informiert werden, wenn Ereignisse
eintreten, die den Unternehmenserfolg gefährden könnten (z.B. drohende Projektverzögerung vor
Shop-Eröffnung). Laut Interview sollte der GF bei solchen kritischen Aufgaben mit Überblick haben
und informiert werden, wenn es kritisch wird
. Die Alerts sollten im Dashboard sichtbar und per
E-Mail/Push an den GF gehen, da er nicht ständig im System ist.
**Zeiterfassung und Kostenintegration:** Da im Unternehmen bereits ein Zeiterfassungstool
(„Timecard“) genutzt wird, das alle Mitarbeiterstunden projektspezifisch erfasst
, erwartet der
GF, dass diese Daten im neuen System integriert oder angebunden werden. Er will *im CRM/PM-Tool*
*sehen* , wieviel Zeit in ein Angebot oder ein Projekt investiert wurde, ohne separate Excel-
Auswertungen. Diese Kennzahl „bereits investierte Stunden vs. Projektstatus“ ist
entscheidungsrelevant, um ggfs. unrentable Projekte abzubrechen
. Das System sollte also
die **Kostenseite** (Aufwände, Fremdkosten) mit abbilden, zumindest auf aggregierter Ebene, damit
der GF ein vollständiges Bild der Projektwirtschaftlichkeit hat.
**Vertriebsstatistiken und Conversion Rates:** Der GF möchte **Konversionskennzahlen** sehen: *Von*
*wie vielen Leads werden Angebote? Wie viele Angebote führen zu Aufträgen?*
. Das System muss
daher in der Lage sein, die Sales Funnel-Stufen zu tracken (Lead > Angebot > Auftrag) und
entsprechende Statistiken bereitzustellen. Ebenso will er Trends erkennen, z.B. *“Angebotsvolumen vs.*
*tatsächlicher Auftrag”* – Abweichungen daraus helfen ihm, die Schätzgenauigkeit der
Vertriebsmitarbeiter zu beurteilen
. Idealerweise kann er auch *Ablehnungsgründe* von
Angeboten analysieren, um daraus strategische Maßnahmen abzuleiten.
**Planungs- und Forecast-Modul:** Für die mittelfristige Planung erwartet der GF Funktionen zur
**Umsatz- und Auslastungsplanung** . Er will im System sehen können, welche Projekte für die


kommenden z.B. 6-12 Monate fix beauftragt sind und welche mit Wahrscheinlichkeit in Aussicht
stehen (Forecast). Daraus soll das Tool eine **Quartalsvorschau** generieren: *x Projekte geplant in Q1*
*(Volumen Y €), ggf. davon Z€ noch unbestätigt* . Diese Sicht ermöglicht es dem GF zu planen, ob genug
Aufträge vorhanden sind oder ob eine Akquise-Offensive nötig ist. Außerdem müssen
*jahresübergreifende Effekte* erkennbar sein (z.B. wenn Umsatz ins nächste Jahr rutscht)
, damit
er finanzielle Auswirkungen antizipieren kann.
**Benutzerrechte & Filter für Management:** Der GF möchte im System **auf alle Daten Zugriff**
haben, allerdings ohne von Details erschlagen zu werden. Das System sollte ihm ermöglichen,
**gefilterte Sichten** zu nutzen: z.B. *nur Gesamtübersichten* standardmäßig, mit Option zum Drill-down
in Detailtabellen bei Bedarf. Ein persönliches Management-Cockpit sollte konfigurierbar sein. Zudem
muss die **Berechtigungsstruktur** sicherstellen, dass vertrauliche Daten (wie Gesamtfinanzen,
Gehälter, Gewinn) nur für ihn oder die Geschäftsleitung sichtbar sind. Er erwartet vom System hohe
Datensicherheit trotz breiter Verfügbarkeit.
**Einfaches Reporting & Export:** Obwohl vieles direkt im Dashboard sichtbar ist, möchte der GF
Berichte (PDF, PPT-Export) für Meetings erstellen können. Das Tool sollte vorgefertigte **Report-**
**Vorlagen** für Geschäftsführung bieten, die er mit wenigen Klicks erzeugen kann – z.B. einen
Monatsbericht mit Umsatz, Pipeline, Projektstatus und Soll-Ist-Vergleich. Diese Berichte müssen
**konsistente, valide Zahlen** liefern, die mit der Buchhaltung übereinstimmen. Damit würde die
Akzeptanz enorm steigen, denn der GF könnte die Zahlen direkt an Gesellschafter weitergeben,
anstatt manuell nachzubessern.


**Nicht-funktionale Anforderungen:**

**Datenqualität und -aktualität:** Für den GF ist es entscheidend, dass die Datenbasis **zuverlässig,**
**vollständig und in Echtzeit aktuell** ist. Er verlässt sich darauf, dass Kennzahlen im Dashboard
stimmen. Daher muss das System Mechanismen haben, Datenfehler zu minimieren (Pflichtfelder,
Plausibilitätsprüfungen) und schnelle Updates (Automatismen, Syncs) gewährleisten. *Veraltete oder*
*falsche Daten würden zu falschen Entscheidungen führen* , was ein hohes Risiko darstellt
. Außerdem
sollte die Lösung offline gepflegte Excel-Listen möglichst ersetzen, um Silos aufzulösen.
**Usability & Übersichtlichkeit:** Der GF wird das System nur begrenzt und eher unregelmäßig aktiv
bedienen. Daher erwartet er **maximale Benutzerfreundlichkeit** im Management-Cockpit. Die
Informationen müssen klar, auf das Wesentliche reduziert und intuitiv verständlich präsentiert sein
. Komplexe Detaildaten sollten optional sein, nicht auf der ersten Ebene. Grafiken, Ampeln
und Drill-Down statt Zahlenwüsten – so lautet die Devise. Ein zentrales KPI-Dashboard **gibt dem GF**
**den Überblick zurück** , statt ihn mit Rohdaten zu überfrachten
. Auch mobil oder auf dem Tablet
sollte er die wichtigsten Infos bequem abrufen können (z.B. während Reisen oder Meetings).
**Performance:** Das System muss schnelle Ladezeiten haben, besonders für Aggregationen und
Dashboards. Wenn der GF im Meeting spontan eine Zahl nachschauen will, darf er nicht durch lange
Ladezeiten oder komplizierte Logins ausgebremst werden. „Echtzeit“ bedeutet hier auch *gefühlte*
*Echtzeit* . Ein **KPI-Dashboard** sollte innerhalb von Sekunden aktualisiert sein, wenn es aufgerufen
wird. Außerdem muss das System stabil laufen; Downtime während entscheidender Phasen
(Monatsabschluss etc.) wäre kritisch.
**Integration in bestehende Systemlandschaft:** Ein Muss ist die **Kompatibilität mit bestehenden**
**Systemen** wie ERP (für Finanzdaten) und der erwähnten Zeiterfassung. Das Dashboard sollte
möglichst ohne Medienbrüche Daten aus Buchhaltung, CRM und PM vereinen
. Falls
komplette Integration nicht sofort möglich ist, sollten zumindest Schnittstellen (Exporte/Imports
oder BI-Tool-Anbindungen) bereitstehen. Der GF legt Wert darauf, dass keine Doppelarbeit entsteht


– er will nicht Daten aus drei Systemen manuell zusammenführen müssen. Eine durchgängige
**einheitliche Datenbasis** ist das Ziel.
**Sicherheit & Zugriffsrechte:** Da unternehmensweit vertrauliche Daten im System stehen
(Kundendetails, Umsätze, interne Kalkulationen), erwartet der GF höchste Sicherheitsstandards.
Zugriffskontrollen müssen sicherstellen, dass etwa *nur er und berechtigte Führungskräfte* sämtliche
KPI sehen können (z.B. Umsatzzahlen aller Mitarbeiter), während normale Nutzer nur ihre Daten
sehen. Ebenso sind **Datenschutz** -Aspekte relevant: Kundendaten dürfen nur intern genutzt werden.
Ein Audit-Trail (Wer hat was geändert?) wäre für die Revision wichtig. Diese Sicherheitsfeatures sind
für die Akzeptanz in der GF essentiell, da ein Datenleck gravierende Folgen hätte.
**Skalierbarkeit & Zukunftssicherheit:** Der GF denkt strategisch – das System sollte mit dem
Unternehmen mitwachsen können. Falls neue Geschäftsbereiche oder höhere Datenvolumina
kommen, soll das Tool nicht zum Flaschenhals werden. Nicht-funktional heißt das: modulare
Erweiterbarkeit, regelmäßige Updates und die Möglichkeit, zukünftige Anforderungen (z.B.
Einbindung von KI-Analytics) umzusetzen
. Er möchte sicher sein, dass die Investition in das
System langfristig trägt und es modern bleibt.
**Akzeptanz & Usability für andere Rollen:** Obwohl es die GF-Persona betrifft, hat der GF ein
Interesse daran, dass *alle* Abteilungen das System akzeptieren. Nur wenn Außendienst, Innendienst,
Planer etc. aktiv das Tool nutzen, bekommt er als GF die gewünschte Datentransparenz. Daher
fordert er, dass das System **anwenderfreundlich für alle Rollen** ist und Schulungen/Change
Management betrieben wird. Dies ist mehr organisatorisch, aber auch eine Anforderung: Das Tool
muss *so gestaltet sein, dass Mitarbeiter es nicht als Belastung empfinden* , sonst droht Ablehnung
.
Für den GF ist klar: *“Die beste Lösung bringt nichts, wenn die Anwender sie ablehnen.”*
– daher
knüpft er die Einführung eng an die Bedürfnisse aller Stakeholder.

# Akzeptanzkriterien (Definition of Done aus GF-Sicht): Wann würde der GF das System als Erfolg

**Schneller Überblick gewährleistet:** Er kann **innerhalb von Minuten** die aktuelle Geschäftslage
erfassen, ohne weitere Nachfragen. Z.B. Montagmorgen meldet er sich im Dashboard an und sieht
sofort die wichtigsten Zahlen der letzten Woche (neue Leads, gewonnene Aufträge, Probleme in
Projekten) – genau das war ein Kernziel. *Kriterium:* Alle relevanten Zahlen sind auf einer Seite
konsolidiert und stimmen mit den Abteilungsberichten überein
.
**Entscheidungen beschleunigt:** In der Praxis stellt sich heraus, dass wichtige Entscheidungen nun
schneller getroffen werden können, weil die Vorarbeit (Zahlen zusammentragen) entfällt. Ein
Erfolgskriterium wäre z.B., dass der GF eine strategische Entscheidung (etwa zusätzliches Budget für
Vertrieb einplanen) **eine Woche früher** treffen konnte als früher, dank Echtzeit-Daten. Messbar auch
über verkürzte Report-Erstellzeit und schnellere Reaktion auf Abweichungen
.
**Datengetriebene Kultur:** Ein weiches Kriterium: Der GF bemerkt, dass Diskussionen im
Führungsteam jetzt **objektiver und faktenbasierter** ablaufen. Man streitet nicht mehr über
unterschiedliche Zahlenquellen, sondern nutzt das gemeinsame Dashboard als „Single Source of
Truth“
. Die Organisation kann aufgrund einheitlicher Daten schneller handeln. Die GF-
Persona akzeptiert das System voll, wenn diese Kulturveränderung spürbar wird.
**Reduzierung manueller Berichte:** Ein konkretes Akzeptanzkriterium ist, dass zum Monatsende
keine aufwändigen Excel-Zusammenstellungen mehr nötig sind. Der GF sollte **keine E-Mails mehr**
**schreiben müssen** , um aktuelle Kennzahlen aus verschiedenen Abteilungen einzufordern –
stattdessen zieht er sie aus dem System. Wenn er feststellt, dass Berichte, die früher z.B. 2 Tage
dauerten, nun per Knopfdruck in Minuten erstellt sind, gilt das als Erfolg.


**Verlässlichkeit der KPIs:** Der GF vertraut den Zahlen im System. Das bedeutet: Die Abweichung
zwischen Systemreport und offiziellem Finanzabschluss ist minimal. Akzeptanz heißt hier, dass die GF
nicht mehr „zur Sicherheit“ parallel eigene Schattenrechnungen führt. Ein Kriterium könnte sein:
*100% Übereinstimmung der Umsatzzahlen im Dashboard mit denen der Buchhaltung (nach Integration)* .
**Positives Feedback der Stakeholder:** Der GF wird das Tool als erfolgreich ansehen, wenn auch
seine Stakeholder zufriedener sind. Z.B. wenn Gesellschafter die neue **Transparenz** loben („Sehr gut,
jetzt haben wir immer aktuelle Zahlen im Meetingbuch“) oder wenn Vertriebsleiter berichten, dass
Probleme früher erkannt wurden. Insbesondere die **Zeitersparnis** in der Führung und die bessere
Abstimmung im Team sind Indikatoren für Akzeptanz.


**Risiken und wie sie minimiert werden:**

**Datenrisiko (Garbage in, Garbage out):** Falls Mitarbeiter das System falsch oder unvollständig
befüllen, bekommt der GF ein verzerrtes Bild. Dieses Risiko ist real, besonders in der
Einführungsphase. Um dem zu begegnen, sollten *Verantwortlichkeiten* klar definiert sein (wer pflegt
welche Daten bis wann) und ggf. automatisierte Plausibilitätschecks eingebaut werden. Der GF
selbst muss als Sponsor auftreten und das Nutzen des Systems einfordern (Change Management).
**Komplexität & Überforderung:** Ein Risiko besteht, wenn das Dashboard zu viele Informationen
zeigt oder die Bedienung zu kompliziert ist. Dann nutzt der GF es nicht regelmäßig – „zu viel
Klickerei“ – und fällt zurück auf altbewährte Methoden. Dieses Risiko wird minimiert durch
**rollenspezifische Cockpits**
: Das Cockpit für GF ist vorkonfiguriert und filtert auf
Management-relevante Infos. Außerdem helfen Schulungen und evtl. ein Support, um den GF und
das Management-Team einzuarbeiten.
**Akzeptanzverweigerung:** Manche Führungskräfte könnten skeptisch sein gegenüber neuen Tools
(„Brauchen wir nicht, haben wir immer so gemacht“). Insbesondere wenn die ersten Zahlen
Unstimmigkeiten aufdecken, kann Widerstand entstehen („Das System stimmt nicht, meine Excel
sagte was anderes“). Dieses Risiko wird adressiert, indem man das System *schrittweise einführt* , Quick
Wins präsentiert und die GF-Persona früh einbindet. Da wir annehmen, dass unser GF die treibende
Kraft hinter dem Projekt ist, ist sein persönliches Commitment hoch – das senkt die
Wahrscheinlichkeit interner Blockaden.
**Sicherheitslücken:** Sollte das integrierte System Schwachstellen haben (z.B. unbefugter Zugriff auf
sensible Daten), wäre das vertrauens- und imageschädigend. Der GF hat hier ein Auge drauf.
Minimierung: Auswahl eines Systems mit modernen Sicherheitszertifikaten, regelmäßige Audits und
Rechtekonzepte. Dieses Risiko ist eher technisch, aber für den GF bedeutsam, weil ein Datenleck im
Kundenstamm fatal wäre.
**Projektverzögerungen und Kosten:** Aus GF-Sicht ist auch das Risiko real, dass die Einführung des
CRM/PM-Tools länger dauert oder teurer wird als geplant (wie bei vielen Digitalprojekten). Um dies
kleinzuhalten, achtet er auf *klare Anforderungen* (daher dieses Persona-Profil) und Meilensteine. Er
wird hier methodisch vorgehen – ggf. mit agiler Einführung in Iterationen – um nicht am Ende mit
einem halbfertigen System dazustehen.
**Änderung der Geschäftsstrategie:** Falls sich strategisch etwas ändert (neue Märkte, anderes
Geschäftsmodell), könnte das System unpassend werden. Der GF minimiert dieses Risiko, indem er
auf **Flexibilität** achtet: modulare Software, anpassbare Dashboards und einen Anbieter, der
Weiterentwicklung unterstützt.


Insgesamt erwartet der GF von dem neuen Tool, dass es **seine Anforderungen in Nutzen umwandelt** : Ein
zentralisiertes, integriertes Cockpit, das **Echtzeit-Analysen** ermöglicht, um fundierte Entscheidungen zu

treffen und Umsatzpotential voll auszuschöpfen
. Gelingt dies, sieht er das Risiko, in turbulentem
Marktumfeld falsche Entscheidungen zu treffen, deutlich reduziert.

# Best Practices & Industriestandards: Rollenmodelle, Methoden,

Die Rolle „Geschäftsführer“ in mittelständischen projektorientierten Unternehmen ist gut untersucht, und
es gibt etablierte **Best Practices** , wie Führungsinformationssysteme gestaltet sein sollten, um dieser
Persona gerecht zu werden.

**Ähnliche Personas & Branchenbeispiele:** In vielen KMU wird für die Geschäftsführung ein sogenanntes
**Management-Cockpit** oder KPI-Dashboard eingesetzt. Branchenunabhängig gilt: *“Ein zentrales KPI-*

*Dashboard gibt Geschäftsführern den Überblick zurück: Alle relevanten Zahlen in Echtzeit, statt mühsamer Excel-*
*Reports.”*
. Dieser Leitsatz spiegelt genau die Anforderungen unserer Persona wider. Beispielsweise hat
die Beratung SCHAFFSCH Prozessberatung berichtet, dass KMU-Geschäftsführer selten alle Zahlen auf
Knopfdruck parat haben und stattdessen mit Excel und verstreuten Daten kämpfen – eine Beobachtung, die
deckungsgleich mit unseren Pain Points ist
. Der Zielzustand dort ist ein *einziges Dashboard* , auf das
sowohl Geschäftsführung als auch Führungskräfte jederzeit und überall zugreifen können
. Diese Praxis
– ein **einheitliches Führungscockpit** – ist mittlerweile ein Quasi-Standard in gut geführten
Mittelstandsunternehmen, da es Entscheidungen beschleunigt und objektiviert
.

# In vergleichbaren Branchen (Innenausbau, Ladenbau, Projektfertigung) setzen Unternehmen zunehmend

# Frameworks & Methoden: Ein bekannter Management-Framework ist die Balanced Scorecard (BSC) , die

# 10


---

*Page 11*

---

**Rollenmodelle & Vergleich:** Ein vergleichbares Rollenprofil ist etwa der *Vertriebsleiter* in einem
Unternehmen – auch er braucht Übersicht, aber stärker fokussiert auf Vertriebsteam-Performance. In
einem **CRM-Dashboard-Guide** wird empfohlen, dass Leitungsfunktionen sowohl operative Performance-
Daten als auch langfristige Trends sehen müssen
. Für unseren GF heißt das: ein Mix aus *aktuellen*
*Ist-Zahlen* und *Trendanalysen* (z.B. Umsatzentwicklung, Forecast). Methoden wie das **Sales Funnel**
**Management** und **Projektportfolio-Management** liefern jeweils Best Practices für Darstellungen: z.B.
Pipeline als Trichtergrafik, Projekte als Gantt-Übersicht mit Ampeln. Der GF-Persona wird im System von
solchen etablierten Visualisierungen profitieren, da sie branchenweit erprobt und verstanden sind.

# Technologische Standards: In der Software-Branche hat sich herausgebildet, dass Management-

# Benchmarks & Kennzahlenvergleiche: Branchen-Benchmarking ist für GFs relevant. Beispielsweise

# Zusammengefasst orientiert sich das Rollenprofil GF an folgenden Best Practices:

**Single Source of Truth:** Alle wichtigen Unternehmensdaten in einem System bzw. Dashboard
konsolidiert
– Minimierung von Datensilos
.
**Echtzeit und Self-Service Analytics:** Der GF kann selbständig Analysen fahren, ohne IT-Support,
und hat in Echtzeit Zugriff
. Führungskräfte und GF greifen auf dieselben Zahlen zu, was
Konsistenz schafft.
**KPI-Fokussierung:** Im Sinne von *Weniger ist mehr* werden zunächst die wichtigsten KPIs abgebildet –
üblich sind Finanz-KPIs (Umsatz, Marge, Cashflow) und Vertriebs-KPIs (Leads, Conversion) sowie
Projektkennzahlen
. Später kann man erweitern, aber zum Start muss das Wesentliche sitzen.
**Benutzerfreundlichkeit & Visualisierung:** Daten werden in **Grafiken und Statistiken verständlich**
**aufbereitet** , damit Entscheidern das Verständnis leichtfällt
. Das beinhaltet z.B. Ampel-Status,
Trenddiagramme, Tortendiagramme für Anteile etc. Viele mittelständische Geschäftsführer
bevorzugen eine visuelle Aufbereitung, um komplexe Sachverhalte schneller zu begreifen
.
**Integriertes Multiprojektmanagement:** Speziell im Projektgeschäft gilt als Standard, alle
Projektinformationen (Kosten, Zeit, Ressourcen, Risiken) in einer Übersicht zu integrieren
.

# 11

Dashboards für Multiprojekt-Management helfen, Transparenz über verschiedene Projekte hinweg
zu schaffen und so Fehlentwicklungen schneller zu erkennen
.
**Iterative Einführung & Change Management:** Ein Soft-Success-Faktor aus der Praxis: neue Tools
werden schrittweise eingeführt und eng mit den Nutzern abgestimmt, um hohe Akzeptanz
sicherzustellen
. Unser GF-Persona legt daher Wert darauf, dass bei der Umsetzung des Tools
regelmäßig Feedback eingeholt und die Lösung ggf. angepasst wird – ein „Lessons Learned“-Ansatz,
der in der IT-Branche üblich ist.

# Diese Best Practices und Industriestandards untermauern das erstellte Persona-Profil. Sie zeigen, dass

# Rollenprofil: Kompetenzen, Informationsbedarf,

**Kompetenzen & Fähigkeiten:** Ein Geschäftsführer im beschriebenen Kontext verfügt über ein breites
Kompetenzprofil. Strategisches Denken und operative Exzellenz gehen Hand in Hand
. Er ist
**unternehmerisch versiert** , erkennt Marktchancen und Risiken und kann Unternehmensstrategien
entwickeln. Im Mittelstand muss er zudem **flexibel** und anpassungsfähig sein, weil er näher am operativen
Geschäft ist
. Weitere Kompetenzen: - **Finanzverständnis:** Der GF beherrscht betriebswirtschaftliche
Auswertungen, kennt Bilanzen, GuV und Kalkulationen. Er kann Kennzahlen interpretieren und weiß,
welche Hebel den Gewinn beeinflussen. Diese Kompetenz setzt voraus, dass er mit dem Zahlenmaterial des
Tools umgehen kann – was er kann, sofern es richtig aufbereitet ist. - **Leadership & Kommunikation:** Als
oberster Chef führt er Führungskräfte und Mitarbeiter, motiviert sein Team und vermittelt Visionen. Er
kommuniziert mit unterschiedlichsten Stakeholdern (von Montage-Mitarbeitern bis zum Großkunden).
Daher schätzt er klare, transparente Informationen, um diese sinnvoll weiterzugeben. Sein
Kommunikationsstil ist oft **faktenorientiert** , besonders in Berichten an Gesellschafter – entsprechend liebt
er gut belegte Aussagen und Daten. - **Entscheidungsstärke:** Der GF zeichnet sich dadurch aus, auch in
Unsicherheit entscheiden zu können. Allerdings bevorzugt er datenbasierte Entscheidungen, wo möglich.
Er kann Prioritäten setzen und notfalls unpopuläre Maßnahmen ergreifen (z.B. Projektstopp,
Budgetkürzung), wenn es dem Unternehmenswohl dient. Seine Erfahrung hilft ihm, schnell zu erfassen,
worauf es ankommt – ein Grund mehr, warum er ein kompaktes Dashboard so wichtig findet. - **Branchen-**
**Know-how:**
Im Ladenbau/Innenausbau kennt der GF die Besonderheiten: z.B. Projektrisiken,
Lieferantenthemen (Lieferzeiten, Qualitätsstandards), Erwartungen der Retail-Kunden. Diese Fachkenntnis
fließt in sein Nutzungsverhalten ein: Er achtet im Tool etwa auf Termineinhaltung von Gewerken (wie
Schreiner, Kühlmöbel-Lieferanten) und weiß, dass 12-16 Wochen Vorlauf normal sind
. Seine
Fachkompetenz lässt ihn die richtigen Fragen stellen – das System soll ihm dazu die Fakten liefern. -
**Analytische und methodische Fähigkeiten:** Viele GFs entwickeln im Laufe ihrer Karriere eigene
Methoden, um Komplexität zu bewältigen (z.B. SWOT-Analysen, Risikomatrizen). Unser GF wird auch das
CRM/PM-Tool methodisch nutzen: z.B. filtert er Kunden nach Branche, um Wachstumspotential je Segment
zu sehen, oder nutzt ABC-Analysen (A-Kunden) basierend auf Umsatzstatistiken. Er hat die Fähigkeit, aus
den Zahlen Geschichten abzuleiten und Aktionen zu planen.

# Informationsbedarf: Der GF braucht verdichtete, strategisch relevante Informationen . Sein Bedarf

Cashflow-Prognosen. Diese Infos zeigen ihm, ob das Geschäft profitabel läuft. Er benötigt sie auf Monats-
und Quartalsbasis und für Prognosen. Besonders interessiert ihn die *Deckungsbeitragsrechnung pro Projekt* ,
um unprofitable Projekte zu identifizieren. - **Vertriebsinformationen:** Pipeline-Volumen, Abschlussquoten,
Umsatz nach Kunden und Vertrieblern, Auftragsbestand. Diese Infos sagen ihm, ob die Vertriebsziele
erreicht werden und wo er eingreifen muss (z.B. zusätzliche Marketingaktionen bei zu dünner Pipeline).
Auch *Kundeninformationen* gehören hier dazu: Top-Kunden, Auftragsvolumen pro Kunde, ggf. offene
Angebote. - **Projekt- & Operationsinformationen:** Anzahl laufender Projekte, deren Status (im Plan/
verzögert), Fertigstellungsgrad, Engpässe (Material oder Personal). Er will wissen: *Liefern wir pünktlich?*
*Halten wir das Budget?* Auch Kapazitätsauslastung der Teams fällt hierunter – ob z.B. die Planungsabteilung
überlastet ist oder Leerlauf hat. - **Mitarbeiter- und Ressourceninfos:** Nicht so detailliert wie HR, aber der
GF will z.B. Kennzahlen zur **Produktivität** (Umsatz pro Kopf, Stunden pro Projekt) oder zum Personaleinsatz
(Überstunden, Urlaubstage kumuliert) um die Organisation im Griff zu haben. Er schaut auch auf *Leistung*
*der Vertriebler* in Zahlen (z.B. Durchschnittlicher Auftragswert, Anzahl Kundenbesuche pro Monat). - **Markt-**
**und Umfeldinformationen:** Diese sind oft außerhalb des internen Systems (z.B. Branchentrends,
Benchmarks). Aber wenn das CRM z.B. Wettbewerbsinformationen mit erfasst (welche Projekte hat
Konkurrent X bekommen), würde ihn das interessieren. Ebenso Messekontakte und Marketingaktionen: Wie
wirken sie sich aus (Leadquelle Messe => Auftragsquote xy%
)? Solche Insights möchte er bei der
Planung berücksichtigen. - **Qualitäts- und Risikokennzahlen:** Der GF möchte schlussendlich wissen, ob
das Unternehmen in sicheren Bahnen läuft. Dazu gehören Infos wie *Reklamationsquote* , *Kundenzufriedenheit*
*(ggf. aus Feedback erfasst)* , *Projekt Nacharbeiten/Kulanzkosten* , *Liquiditätsstatus* etc. Nicht alle dieser Infos
kommen aus dem CRM/PM-Tool, manche aus ERP, aber ein integrierter Überblick wäre optimal.

# Entscheidungsverhalten:

**Key Performance Indicators (KPIs) für den GF:** Wie bereits angedeutet, gibt es eine Reihe von
Kennzahlen, die für unseren GF zentral sind. Eine Auswahl der wichtigsten KPIs: - *Umsatz (monatlich,*

*quartalsweise, jährlich)* – absolut und im Vergleich zum Plan (Zielvorgabe). - *Auftragseingang* – Wert neuer
Aufträge pro Monat, sowie kumuliert YTD (year-to-date). Ggf. aufgeteilt nach Geschäftsbereichen oder
Kundensegmenten. - *Pipeline-Volumen* – Summe der offenen Verkaufschancen, oft gewichtet mit
Abschlusswahrscheinlichkeit (Forecasted Sales). Dies zeigt den “Auftragsvorrat” für die kommenden
Perioden. - *Conversion Rate* – Prozentualer Anteil der Leads, die zu Aufträgen wurden, bzw. Angebote-zu-
Auftrag-Quote. Diese KPI misst Vertriebseffizienz und wurde in Interview und Konzept als wichtig erachtet
. - *Deckungsbeitrag/Marge* – Erwirtschafteter Deckungsbeitrag insgesamt und pro Projekt. Auch eine
Durchschnittsmarge über alle Projekte könnte ihn interessieren, um Preisstrategien anzupassen. - *Projekt*
*KPI:* z.B. *Projektdurchlaufzeit* (von Auftrag bis Fertigstellung, Schnitt), *Terminqualität* (% der Projekte im Plan
beendet), *Budgettreue* (% Projekte im Budget), *Nachtragsquote* (wie oft Nachträge nötig waren). -
*Kundenzufriedenheit/NPS* – falls gemessen, wichtig um Kundenbindung zu verfolgen. - *Top 5 Kunden Umsatz* –
welche Kunden bringen den Löwenanteil Umsatz (Konzentrationsrisiko?). - *Liquidität/Kassenstand* – oft
Aufgabe der Buchhaltung, aber GF schaut zumindest auf den Cashflow oder Liquiditätsstatus, um Engpässe
vorab zu sehen. - *Personalauslastung* – evtl. in %, z.B. durchschnittlich 85% Auslastung der Planer in Q2; zeigt
ob Überlastung droht oder Unterauslastung (Kostenineffizienz). - *Angebotsvolumen vs. tatsächlicher*
*Auftragswert* – wie sehr weicht der erste Kostenvoranschlag vom erteilten Auftrag ab (gab es viele
Kürzungen?), wie im Interview erwähnt um Schätzqualität zu prüfen
. - *Kennzahlen zu*
*Vertriebskanälen* – z.B. *Messe-Lead Conversion* , *Online-Anfrage Conversion* , etc. um Marketinginvestments zu
steuern
.

# Natürlich wird nicht alles davon sofort im System sein, aber diese KPIs rahmen das Informationsbedürfnis

# Werte & Haltung:

# Abschließend zeichnet sich das Rollenprofil „GF“ durch diese Mischung aus Hard Skills (Analytik,

Entscheidungsverhalten passen – d.h. schnelle, fundierte Entscheidungen ermöglichen. Gelingt dies, wird
der GF seine Ziele – profitables Wachstum, zufriedene Kunden, gesteuerte Prozesse – besser erreichen
können.

# Schlussbetrachtung: Bedeutung der Persona für Strategie,

Die Persona **Geschäftsführer** bildet einen zentralen Referenzpunkt für die strategische Ausrichtung des
geplanten CRM- und PM-Tools. Als oberster Entscheider beeinflusst der GF nicht nur die **Kaufentscheidung**
für ein solches System (ohne sein Buy-in würde das Projekt gar nicht erst realisiert), sondern auch die
**Akzeptanz im gesamten Unternehmen** . Ist der GF von Nutzen und Qualität des Tools überzeugt, wird er
es zur Pflicht und zur gelebten Praxis machen – was wesentlich zum Erfolg der Implementierung beiträgt.

Daher hat diese Persona für die Produktentwicklung eine doppelte Bedeutung:

Einerseits fungiert sie als **Primär-Stakeholder** , der klare Erwartungen hat, die erfüllt werden müssen,
damit das Produkt als erfolgreich gilt (siehe Akzeptanzkriterien). Andererseits wirkt der GF intern als
Sponsor und **Change Champion** . Sein Verhalten und Nutzen-Erleben mit dem System setzen den Ton:
Wenn er positive Ergebnisse sieht (schnellere Entscheidungen, bessere Kontrolle), wird er dies im
Unternehmen kommunizieren und so auch zögerliche Nutzer überzeugen.

Für die **Strategie des Produkts** bedeutet das: Funktionen, die dem GF Nutzen stiften, sollten in der Priorität
weit oben stehen. Beispielsweise rechtfertigt sich die Entwicklung eines anspruchsvollen Dashboards nicht
nur durch die GF-Persona, sondern auch, weil dadurch das gesamte Unternehmen datengesteuerter agiert.
Die GF-Persona verlangt im Grunde nach einem System, das *Management by Facts* unterstützt – was in
heutiger Unternehmensführung als Qualitätskriterium gilt. Indem wir an den Bedürfnissen dieser Persona
ausrichten, stellen wir sicher, dass das Tool **strategiekonform** ist: Es fördert Transparenz, Effizienz und
Kundenzentrierung, alles Elemente, die vermutlich auch in der Unternehmensstrategie vorkommen.

Aus Produktentwicklungssicht liefert die Persona konkrete **User Stories** : z.B. „Als Geschäftsführer möchte
ich alle Vertriebsprojekte nach Wahrscheinlichkeit geordnet sehen, um entscheiden zu können, wo wir
nachfassen müssen.“ Solche Anforderungen fließen direkt in den Backlog ein. Durch die Persona-
Beschreibung können Entwickler und Designer nachvollziehen, *warum* eine Funktion wichtig ist. Das fördert
zielgerichtete Entscheidungen im Entwicklungsprozess (Stichwort: **Entscheidungsfilter** – passt eine
geplante Funktion zu einer Persona und ihren Zielen?). Gerade bei begrenzten Ressourcen priorisiert man
besser, wenn man die Persona im Blick hat: Features ohne Mehrwert für GF & Co. können zurückgestellt
werden.

Hinsichtlich **Qualitätskriterien** für das Produkt liefert die GF-Persona einige klare Vorgaben: -
**Gebrauchstauglichkeit** : Das System muss für die GF-Persona intuitiv und effizient nutzbar sein. Ein
Geschäftsführer hat wenig Zeit für Schulungen oder komplizierte Abläufe. „Simplicity“ und hohe **UI/UX-**
**Qualität** sind hier ein Qualitätsmerkmal. Diese Persona akzeptiert kein sperriges Tool. - **Zuverlässigkeit** :
Daten und Funktionen müssen zuverlässig funktionieren. Wenn ein GF beim Vorstand plötzlich falsche
Zahlen präsentiert wegen eines Systemfehlers, ist das Vertrauen zerstört. Qualität bedeutet hier auch
**Datenintegrität und korrekte Berechnungen** in allen Reports. - **Performance** : Wie erwähnt, zählt
Schnelligkeit. Für die GF-Persona ist ein performantes System (kurze Ladezeiten, sofortige Drilldowns) ein
Zeichen von Qualität. Latenz oder Ausfälle sind inakzeptabel auf dieser Ebene. - **Support &**

**Weiterentwicklung** : Der GF wird ein System positiv bewerten, wenn es mitdenkt – z.B. durch
kontinuierliche Verbesserungen (etwa neue KPIs, die Branche-Standards adaptieren). Er erwartet einen
gewissen *Servicegrad* vom Produkt (z.B. dass Updates reibungslos eingespielt werden, Support bei
Problemen vorhanden ist). Die Produktentwicklung muss also auch an **Wartbarkeit und Skalierbarkeit** als
Qualitätskriterium denken, um den GF langfristig zufriedenzustellen. - **Nutzenstiftung** : Ein etwas weicheres
Kriterium, aber letztlich der entscheidende: Das Tool muss zur **Verbesserung der Geschäftsleistung**
beitragen. Für die GF-Persona heißt Qualität des Produkts nicht nur „wenig Bugs“, sondern vor allem
„spürbarer Mehrwert“. Dieser zeigt sich in Kennzahlen (z.B. Planungsgenauigkeit, Entscheidungsdauer) und
in subjektiver Zufriedenheit. Als Erfolg kann man z.B. werten, wenn der GF sagt: *„Ich kann mir die Führung*
*ohne dieses System nicht mehr vorstellen“* – dann hat das Produkt seinen Platz gefunden.

Abschließend unterstreicht die Persona Geschäftsführer die **strategische Relevanz** des CRM/PM-Tools: Es
ist nicht bloß eine Software für Dateneingabe, sondern ein **Steuerungsinstrument für die**
**Unternehmensführung**
. Indem wir ein belastbares Rollenprofil erstellt haben, stellen wir sicher,
dass das Endprodukt genau diese Rolle erfüllt. Jede wesentliche Produktentscheidung kann gegen die
Persona validiert werden: Hilft es dem GF in seinen Zielen? Entspricht es seinen Best Practices? Wenn ja, ist
es vermutlich auch für das Unternehmen insgesamt wertvoll.

# Die GF-Persona zeigt zudem die Wechselwirkung zwischen Strategie und Produkt : Das Tool muss

# Persona-Steckbrief (tabellarische Übersicht)

**Persona-Name**
*„Martin Mustermann“* (Geschäftsführer) – 50 Jahre, Diplom-Kaufmann, 20+
Jahre Branchenerfahrung im Ladenbau

**Rolle/Funktion**
Geschäftsführer/CEO des Unternehmens, verantwortlich für Gesamtleitung,
Strategie und Geschäftserfolg.

*Strategische Planung:* Definiert Jahresziele, Budget und
Wachstumsschwerpunkte. <br> *Operative Steuerung:* Überwacht
Vertriebspipeline, Projektportfolio und Finanzen, trifft finale Entscheidungen
bei wichtigen Projekten/Deals. <br> *Personal & Kultur:* Führt das
Führungsteam, repräsentiert die Firma extern, treibt Digitalisierung und
Prozessoptimierung voran.

**Verantwortlichkeiten**

**Persona-Name**
*„Martin Mustermann“* (Geschäftsführer) – 50 Jahre, Diplom-Kaufmann, 20+
Jahre Branchenerfahrung im Ladenbau

- **Unternehmenserfolg sichern:** Umsatz- und Margenziele erreichen,
  Marktposition ausbauen.<br>- **Transparenz:** Stets Überblick über Kunden,
  Projekte, Finanzen haben, um fundierte Entscheidungen zu treffen
  .<br>-
  **Effizienz steigern:** Silos aufbrechen, Datenflüsse integrieren, Zeit bei
  Reports/Abstimmungen sparen
  .<br>- **Kundenzufriedenheit:**
  Hochwertige Projektumsetzung gewährleisten, gute Beziehungen zu
  Schlüsselkunden pflegen (Repeat Business).<br>- **Risiken managen:**
  Frühwarnindikatoren nutzen, um Problemen proaktiv zu begegnen (keine
  bösen Überraschungen).

# Motivation/Ziele

# - Dateninseln & Reportaufwand: Aktuell viele Excel, getrennte Systeme –

# Pain Points

# - Intern: Vertriebsleiter/Außendienst, Innendienst/Projektleiter,

**Primäre Stakeholder**

- **Pipeline-Review:** Prüft regelmäßig offene Leads/Angebote, leitet
  Vertriebsmaßnahmen ein
  .<br>- **Projekt-Review:** Überwacht laufende
  Projekte via Statusberichte, interveniert bei roten Ampeln (Prioritäten,
  Ressourcen umschichten).<br>- **Entscheidungsmeetings:** Gibt Go/No-Go
  für große Angebote oder kritische Projekte, oft basierend auf Systemdaten
  (Wirtschaftlichkeit, Kapazität).<br>- **Reporting:** Erstellt Monats- und
  Quartalsberichte für Eigentümer; bereitet Management-Meetings vor mit
  KPIs aus dem System.<br>- **Strategieanpassung:** Analysiert Trends
  (Umsatz, Markt) und justiert Strategie (neue Ziele, neue Märkte) – gestützt
  durch Auswertungen (z.B. Absatz je Segment).

# Typische Aufgaben

**Persona-Name**
*„Martin Mustermann“* (Geschäftsführer) – 50 Jahre, Diplom-Kaufmann, 20+
Jahre Branchenerfahrung im Ladenbau

- **Sales-Prozess:** Finale Freigabe großer Angebote, Eskalationsstufe bei VIP-
  Kunden
  .<br>- **Projekt-Prozess:** Kickoff-Freigabe wichtiger Projekte,
  Stage-Gate bei Meilensteinen, Abschlussabnahme strategischer
  Projekte.<br>- **Finanz-Prozess:** Budgetplanung Anfang Jahr, Budget-
  Controlling vierteljährlich, Investitionsentscheidungen (z.B. Personalaufbau)
  anhand Forecasts
  .<br>- **Personal & Organisation:** Genehmigt
  Einstellungen basierend auf Auslastungsdaten; initiiert
  Organisationsänderungen wenn Daten Engpässe zeigen.

# Prozesseinbindung

# - KPI-Dashboard: Umsatz, Auftragseingang, Pipeline nach

# Wichtige

# - Datenbasiert: Verlässt sich auf Zahlen, Trends und Fakten aus dem System

# Entscheidungsfindung

- **Aktuell:** Excel-Dashboards, ERP-System (für Finanzdaten), separates CRM
  (rudimentär), Zeiterfassungstool (Timecard) – wenig integriert, hoher
  manuellem Aufwand.<br>- **Zukünftig (Ziel):** Integriertes CRM/PM-Tool als
  zentrale Plattform. Evtl. angebundene BI-Tools für erweiterte Analysen,
  Mobilzugriff via Tablet/Smartphone-App auf KPI-Dashboard, Cloud-Speicher
  für Reports.<br>- **Weitere Quellen:** Branchenreports (für Benchmarking),
  CRM für Wettbewerbsinfos, persönliche Netzwerke (Austausch mit anderen
  GFs).
**Tools & Quellen**

**Persona-Name**
*„Martin Mustermann“* (Geschäftsführer) – 50 Jahre, Diplom-Kaufmann, 20+
Jahre Branchenerfahrung im Ladenbau

- **Analytisch & faktenorientiert:** Schätzt klare Zahlen, geringe Toleranz für
  Ungenauigkeiten; neugierig auf Daten-Insights.<br>- **Entschlossen &**
  **ergebnisorientiert:** Setzt Ziele hoch an, fordert Performance, scheut sich
  nicht, unbequeme Schritte zu gehen für Erfolg.<br>- **Integrität &**
  **Verantwortungsgefühl:** Steht zu seinem Wort, trägt Verantwortung für
  Entscheidungen; erwartet auch vom System Verlässlichkeit (z.B.
  Datensicherheit).<br>- **Offen für Wandel:** Innovativ denkend, treibt
  Digitalisierung voran, aber verlangt praktischen Nutzen (kein Tech um der
  Technik willen).<br>- **Teamspieler top-down:** Sucht Austausch, lobt gute
  Leistungen, aber hat klare Autorität. Wertschätzt Mitarbeiter und deren
  Input, sofern durch Daten untermauert.
**Werte &**
**Persönlichkeit**

„Ich brauche alle Fäden in der Hand – **jederzeit den vollen Überblick** , sonst
steuern wir das Unternehmen blind.“
<br> „Lieber Fakten auf den Tisch
als Schönfärberei: **Gute Entscheidungen** kann ich nur mit **guten Daten**
treffen.“

# Zitate (Motto)

# Quellen

**Interview-Transkript:** *SG Interview 31.10.25 (deutsch)* – Internes Interview mit einem Mitarbeiter
über Personas und Anforderungen für ein CRM/PM-Tool, insbesondere Aussagen zur Rolle des
Geschäftsführers
.
**Gesamtkonzept Integriertes CRM & PM-Tool (2025):** Interne Projektdokumentation (PDF) mit
Beschreibung des geplanten Systems, Rollen und Prozesse – diente zur Ableitung der Persona-
Anforderungen (z.B. Nennung relevanter Module, Projektziele).
**Mission Mittelstand (Blog 2023):** "Aufgaben einer Geschäftsführung – Ein umfassender
Leitfaden"
– beschreibt allgemeine Aufgaben und Unterschiede der GF-Rolle im Mittelstand,
zur Einordnung der Verantwortlichkeiten und der Nähe zum operativen Geschäft.
**Schaffsch Prozessberatung (Use Case 2024):** "KPI Dashboard für Geschäftsführer"
–

1.

# 2.

3.

# 4.

Fallstudie über KMU-Geschäftsführer, die ein zentrales Dashboard einführen. Bestätigt Pain Points
(Excel-Chaos, verzögerte Entscheidungen) und Zielzustand (Echtzeit-KPIs, faktenbasierte
Entscheidungen).
**Ritter Digital (Webseite 2025):** *Digitale Transformation für den Mittelstand* – Abschnitt
*Geschäftsführer-Dashboard*
, der hervorhebt, dass Echtzeit-Analysen Geschäftsführern erlauben,
fundierte Entscheidungen zu treffen und Umsatzpotenziale auszuschöpfen. Unterstreicht die
Wichtigkeit von BI/Dashboards für die GF-Persona.
**PwC Deutschland (Artikel 2019):** "Großprojekte mit Dashboards effizient steuern" – Insights zu
Business Intelligence im Multiprojektmanagement
. Relevant sind Aussagen zu Entscheider-
Informationen: **Echtzeit, Vollständigkeit, Verständlichkeit** der Daten als Erfolgsfaktoren sowie die
Betonung von Integration und Akzeptanz. Diente als Benchmark für non-funktionale Anforderungen
(Datenqualität, Einführung).
**SOL4 IT (Blog 2025):** "CRM-Dashboards, die überzeugen: Welche Metriken für welche Rolle wichtig
sind"
– liefert Best Practices zu rollenbasierten Dashboards (v.a. Vertriebsleiter, aber indirekt

5.

# 6.

# 7.

# 19

auch GF relevant). Zitat: Vertriebsleiter brauchen Transparenz und Frühwarnsysteme, was analog GF
gilt. Half bei der Ableitung, welche Metriken im GF-Dashboard zentral sein sollten.
**EHI Laden-Monitor und Branchendaten:** (z.B. *EHI-Studie Laden-Monitor 2023* )
–
Branchenbenchmark-Studie für Ladenplanung und -bau. Ließ Rückschlüsse zu, welche Kennzahlen
in der Ladenbau-Branche üblich sind (z.B. Investitionssummen, Projektgrößen). Diese flossen
indirekt ein, um sicherzustellen, dass das Persona-Profil branchentypische KPIs (wie Projektvolumen,
Umsätze) berücksichtigt.
**Balanced Scorecard im Mittelstand (Literatur):** Hans-Jörg Vohl, *Balanced Scorecard im Mittelstand* ,
2. Aufl. – Ein Framework, das relevant ist, um dem GF-Persona ein ganzheitliches
Steuerungsinstrument bereitzustellen. Zwar keine direkte Quelle im Text, aber als Hintergrund
genutzt, um die KPI-Perspektiven (Finanzen, Kunden, Prozesse) nicht einseitig zu gestalten.
**Weitere interne Best Practices:** Erfahrungen aus ähnlichen CRM-/ERP-Projekten (z.B. Controlling-
Cockpit für KMU
), die zeigen, dass die Einbindung der GF-Anforderungen (Filter, Drill-Down,
Echtzeit) zum Projekterfolg beiträgt. Diese sind in die Erwartungen und Qualitätskriterien
eingeflossen, auch wenn sie nicht einzeln zitiert wurden.

8. 54
9.

10.

# Aufgaben einer Geschäftsführung: Ein umfassender Leitfaden

## https://www.mission-mittelstand.de/blog/aufgaben-einer-geschaftsfuehrung

# sg_interview_31.10.25_deu.txt

file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### KPI Dashboard für Geschäftsführer | SCHAFFSCH Prozessberatung

## https://www.schaffsch.de/use-case/kpi-dashboard

### Großprojekte mit Dashboards effizient steuern - PwC

## https://www.pwc.de/de/branchen-und-markte/oeffentlicher-sektor/grossprojekte-effizient-steuern-dashboards-im-oeffentlichen-

multiprojekt-management.html

### Vom Excel Chaos zum Vertriebs Cockpit und CRM-, ERP

## https://www.evarlinkstudios.com/blog/vom-excel-chaos-zum-vertriebs-cockpit-und-crm-erp-und-excel-daten-im-mittelstand-

effizient-vereinen

### CRM-Dashboards, die überzeugen: Welche Metriken für welche Rolle wichtig sind –

## https://www.sol4.at/19-crm/501-nuetzliche-crm-dashboards

### Digitale Transformation für den Mittelstand | Ritter Digital

## https://www.ritterdigital.de/

### [PDF] EHI-Studie Laden-Monitor 2023

## https://www.ehi.org/wp-content/uploads/Downloads/Leseproben/EHI-Studie_Laden-Monitor_2023_Leseprobe.pdf

### Controlling Cockpit: Wird Ihr KMU effektiv unterstützt? [Check]

## https://integri.de/controlling-cockpit-kmu-check/

---

# Erweiterungen 2025: Executive Intelligence & Predictive Governance

Die folgenden Funktionen erweitern die Management-Werkzeuge des Geschäftsführers um **vorausschauende Finanzanalysen, Frühwarnsysteme und KI-gestützte Entscheidungsunterstützung**, basierend auf Best Practices führender Enterprise-CRM-Systeme.

## 💰 Prognose & Finanzübersicht

### Executive Forecast Dashboard

Der Geschäftsführer benötigt **präzise, actionable Finanzprognosen** für strategische Entscheidungen und Stakeholder-Kommunikation.

**Kernanforderungen:**

**Quartals-Umsatzprognose:**
- **Gewichtete Pipeline-Prognose**: Alle offenen Opportunities werden mit ihrer ML-basierten Abschlusswahrscheinlichkeit multipliziert[^1]
  - Q1 2025: €450K gewichtet (aus €720K Pipeline bei Ø 62% Wahrscheinlichkeit)
  - Q2 2025: €380K gewichtet (noch dünn, Warnung: -15% vs. Ziel)
  - **Konfidenzintervalle**: Best Case (+20%), Most Likely, Worst Case (-20%)
- **Historische Trefferquote**: System zeigt "Forecast-Genauigkeit letzte 4 Quartale: 92%"
- **Visualisierung**: Balkendiagramm mit Zielvorgabe-Linie, Prognose, und tatsächlichem Verlauf

**Liquiditätsentwicklung:**
- **Rolling 6-Month Cash Flow Forecast**[^2]:
  - **Erwartete Zahlungseingänge**: Basierend auf Invoice-Aging & Kundenverhalten
    - Offene Rechnungen: €120K fällig diese Woche, €85K überfällig (>30 Tage)
    - Zahlungswahrscheinlichkeit: ML-Modell berechnet "Kunde X zahlt mit 85% Wahrscheinlichkeit pünktlich" (Historie-basiert)
  - **Geplante Ausgaben**: Gehälter, Lieferanten, Mieten, Investitionen
  - **Liquiditätskurve**: Zeigt prognostizierte Kontostände Monat für Monat
- **Frühwarn-Schwellenwerte**:
  - Warnung bei <€50K Puffer
  - Kritisch bei <€20K (rote Markierung, Alert an GF)
- **Szenario-Analyse**: "Was passiert wenn Projekt Y sich um 2 Monate verzögert?"

**Deckungsbeitrag pro Projekt:**
- **Echtzeit-Projektmargen**[^3]:
  - Projekt A: €85K Umsatz, €52K Kosten → **38,8% Marge** (grün, über Ziel)
  - Projekt B: €120K Umsatz, €105K Kosten → **12,5% Marge** (gelb, unter Ziel)
  - Warnung: "Projekt B Marge gefährdet durch Materialkosten-Überschreitungen"
- **Drill-Down**: Klick auf Projekt → Detaillierte Kostenaufstellung (Material, Personal, Subunternehmer)
- **Gesamt-Portfolio-View**: Durchschnittliche Marge über alle Projekte: "Ziel: 30%, Ist: 27,5%"
- **Trendanalyse**: "Margen-Entwicklung 2024: -2,3% vs. 2023 (Ursache: Materialkosten +15%)"

**Strategische Kennzahlen:**
- **Customer Lifetime Value (CLV)**: Durchschnittlicher Kundenwert über 5 Jahre: €85K
- **Cost per Acquisition (CPA)**: Akquisekosten pro Neukunde: €4.200
- **Return on Investment**: "Jeder in Vertrieb investierte Euro bringt €5,20 Umsatz"
- **Break-Even-Analysen**: "Bei aktueller Kostenstruktur: Break-Even bei €38K Monatsumsatz"

**Technische Umsetzung**:
- Data Warehouse mit **Star Schema** für schnelle Aggregationsabfragen[^4]
- **Monte Carlo Simulation** für Konfidenzintervalle bei Prognosen[^5]
- Cash Flow Prediction mit Invoice-Aging-Analyse und Payment Pattern Recognition[^2]

[^1]: Quelle: Research "Sales Forecasting Methods" – Weighted Pipeline als Best Practice für CEO Dashboards
[^2]: Quelle: Research "Cash Flow Prediction Techniques" – Invoice Aging & Payment Pattern Analysis
[^3]: Quelle: Research "BI Solutions" – Real-Time Dashboard für Contribution Margin Tracking
[^4]: Quelle: Research "Data Warehouse Design" – Star Schema für Operational BI
[^5]: Quelle: Research "Forecasting Methods" – Monte Carlo für Confidence Intervals

## 📊 Dashboard & Liquidität

### Interaktives Executive Dashboard

Ein **intuitives, Echtzeit-fähiges Dashboard** mit Drill-Down-Funktionalität für tiefgehende Analysen.

**Dashboard-Struktur:**

**Top-Level KPIs (Always Visible):**
- **Umsatz MTD/QTD/YTD** mit Sparkline-Trends (↗ +12% vs. Vormonat)
- **Pipeline-Wert** (gewichtet): €1,2M mit Wahrscheinlichkeitsverteilung
- **Aktuelle Liquidität**: €87K (grün, Puffer: €37K über Minimum)
- **Team-Auslastung**: 87% (gelb, nähert sich Kapazitätsgrenze)
- **Offene Rechnungen**: 12 Stück, €145K Volumen (3 überfällig)

**Drill-Down-Hierarchien:**
```
Umsatz €320K (Q1 2025)
  └─> Nach Branche:
       ├─ Hofläden: €180K (56%)
       ├─ Vinotheken: €85K (27%)
       └─ Floristen: €55K (17%)
  └─> Nach Verkäufer:
       ├─ Markus M.: €140K (44%)
       ├─ Julia S.: €110K (34%)
       └─> Nach Projekt (Julia):
            ├─ Projekt X: €45K (Abgeschlossen)
            ├─ Projekt Y: €35K (In Durchführung)
            └─> Projekt Y Details:
                 ├─ Budget: €35K, Kosten: €28K → Marge: 20%
                 ├─ Timeline: On Track (85% Complete)
                 └─ Team: 3 Personen, 120h Aufwand
```

**Payment Forecast-Widget:**
- **Zahlungskalender** (nächste 90 Tage):
  - Woche 1: €42K erwartet (Konfidenz: 85%)
  - Woche 2: €28K erwartet (Konfidenz: 90%)
  - Woche 5: €65K erwartet (Konfidenz: 70%, Kunde Y hat Historie von Verspätungen)
- **Risiko-Flagging**: Überfällige Rechnungen rot markiert mit "Days Past Due: 42"
- **Automated Collection Reminders**: "3 Mahnungen ausstehend → n8n sendet automatisch"

**Pipeline-Funnel-Visualisierung:**
- **Conversion-Trichter**:
  - 45 Leads → 28 Opportunities (62% Conversion) → 12 Proposals → 7 Negotiation → 4 Won (14% Close-Rate)
- **Engpass-Identifikation**: "Bottleneck in 'Proposal'-Phase: Ø 21 Tage Verweildauer (Ziel: <14 Tage)"
- **Win-Loss-Analyse**: "Gewonnen: 4 (€180K), Verloren: 3 (€95K), Gründe: Preis (2x), Timing (1x)"

**Team-Performance-Matrix:**
- **Verkäufer-Ranking**: Sortiert nach gewichtetem Pipeline-Wert, Conversion-Rate, Umsatz
- **Projekt-Manager-Auslastung**: Wer ist über-/unterlastet? (Basis: geplante vs. verfügbare Stunden)
- **Heatmap**: Farbcodierung zeigt auf einen Blick "Wer braucht Unterstützung?"

**Real-Time-Updates:**
- **Change Data Capture (CDC)**: Änderungen in CouchDB triggern sofort Dashboard-Updates[^6]
- **WebSocket-Push**: GF sieht neue Opportunities/Projekte innerhalb <5 Sekunden nach Erfassung
- **Live-Indikator**: Grüner Punkt "● Live" oben rechts

**Mobile & Desktop-Optimierung:**
- **Responsive Design**: Automatische Anpassung Smartphone/Tablet/Desktop
- **Touch-Optimiert**: Swipe-Gesten für Charts, Pinch-to-Zoom für Drill-Downs
- **Offline-Snapshot**: Letzte 48h Daten gecacht für Offline-Zugriff

**Export & Sharing:**
- **One-Click-Export**: PDF, Excel, PowerPoint für Board-Meetings
- **Scheduled Reports**: Automatischer E-Mail-Versand jeden Freitagabend
- **Embedding**: Dashboard kann in Vorstandspräsentation eingebettet werden

[^6]: Quelle: Research "Real-Time Dashboards" – CDC/Streaming für Live-Updates

## 🚨 Frühwarnsysteme

### Proaktive Risiko-Erkennung

Automatisierte **Früh-warnindikatoren** identifizieren Probleme, bevor sie kritisch werden.

**Projekt-Verzögerungs-Alerts:**

**Kritische Pfad-Analyse:**
- System überwacht alle aktiven Projekte auf **kritische Meilensteine**
- Alert-Trigger:
  - "Projekt Y: Meilenstein 'Materialbeschaffung' 5 Tage überfällig → Gefährdung Fertigstellungstermin"
  - "Projekt Z: 3 Dependencies blockiert → Empfehlung: Eskalation an Planungsleiter"
- **Predictive Delay Forecasting**: ML-Modell berechnet Verzögerungsrisiko basierend auf:
  - Aktuellem Fortschritt vs. Plan
  - Team-Verfügbarkeit
  - Historischen Projekten mit ähnlichen Mustern
- Beispiel: "Projekt A: 68% Wahrscheinlichkeit für 2-Wochen-Verzögerung (Grund: Unterbesetzung)"

**Budget-Überschreitungs-Warnungen:**

**Kosten-Tracking mit Schwellenwerten:**
- **Stufe 1 (Gelb)**: Bei 80% Budget-Auslastung aber <60% Projektfortschritt
  - "Projekt B: €32K von €40K Budget verbraucht (80%), aber erst 55% fertig → Gefahr Überschreitung"
- **Stufe 2 (Orange)**: Bei 90% Budget, Projektion zeigt Überschreitung
  - "Projekt C: Hochrechnung auf Basis aktueller Burn-Rate: €52K Endkosten bei €45K Budget (-16%)"
- **Stufe 3 (Rot)**: Budget überschritten
  - "KRITISCH: Projekt D: Budget um €8K überschritten (18%), GF-Freigabe erforderlich"

**Granulare Kosten-Analysen:**
- Aufschlüsselung: Welche Kategorie verursacht Überschreitung? (Material +25%, Personal -5%, Subunternehmer +10%)
- **Root-Cause-Vorschläge**: "Ursache: Änderungsanforderung Kunde vom 15.01 nicht kalkuliert"
- **Automated Approval-Workflows**: Bei Überschreitung >10% → Auto-Ticket an GF mit Begründung

**Sales Pipeline Alerts:**

**Dünnstellen-Warnungen:**
- **Forecasting Gap**: "Q3 Pipeline nur €280K, Ziel: €450K → Gap: €170K (38%)"
- **Empfehlungen**: "Zur Zielerreichung benötigt: +8 Opportunities à Ø €21K"
- **Lead-Velocity-Tracking**: "Lead-Input gesunken: 12 Leads/Monat (Ø 18), Warnung: Pipeline-Risiko Q4"

**Opportunity-Aging-Alerts:**
- "5 Opportunities seit >45 Tagen in 'Proposal' → Empfehlung: Nachfass-Kampagne"
- "Opportunity X: Wahrscheinlichkeit von 70% auf 35% gefallen (keine Aktivität seit 3 Wochen)"
- **Win-Probability-Drop**: Auto-Alert wenn Opportunities "kälter" werden

**Team-Auslastungs-Warnungen:**

**Überlastungs-Detection:**
- **Kapazitätsgrenzen**: "Team Planung: 112% Auslastung nächste 3 Wochen → Risiko Qualitätsverlust"
- **Burnout-Prävention**: "Mitarbeiter Y: Überstunden 48h/Woche letzte 4 Wochen (Durchschnitt: 40h)"
- **Skillset-Bottlenecks**: "3D-Visualisierer ausgelastet bis KW 28 → Neue Projekte müssen warten"

**Unterlastungs-Detection:**
- "Team Montage: Nur 62% ausgelastet nächsten 2 Wochen → Potenzial für Zusatzprojekte"
- **Opportunity**: "Leerlauf-Kosten: €8K/Woche bei aktueller Auslastung"

**Technische Umsetzung**:
- **n8n Monitoring Agents** laufen stündlich und prüfen Schwellenwerte[^7]
- **Rule Engine** (z.B. Drools) für komplexe Bedingungen
- **Push Notifications** via Slack/E-Mail/In-App bei kritischen Alerts

[^7]: Quelle: Research "n8n Automation" – Scheduled Monitoring Agents, Proaktive System-Benachrichtigungen

## 🤖 KI-gestützte Analysen

### RAG-basierte Entscheidungsunterstützung

Der Geschäftsführer erhält **KI-unterstützte Insights** durch natürlichsprachliche Abfragen und automatisierte Analysen.

**RAG-basiertes Q&A-System:**

**Natural Language Queries:**
- GF tippt oder spricht: **"Welche Projekte haben wir letztes Jahr für Hofläden gemacht?"**
- **RAG-Retrieval** (LlamaIndex)[^8]:
  1. Vector Search findet semantisch ähnliche Projekte (Embeddings: "Hofladen", "Direktvermarkter", "Landwirtschaft")
  2. System retrieviert: 12 Projekte, Ø Umsatz €42K, Ø Marge 28%
  3. **LLM-Generierung**: "Im Jahr 2024 wurden 12 Ladenbau-Projekte für Hofläden durchgeführt:
     - Durchschnittlicher Projektwert: €42.000
     - Durchschnittliche Marge: 28%
     - Größtes Projekt: Hofladen Müller (€85K, 120qm Verkaufsfläche)
     - Häufigste Anforderungen: Kühltheken (10x), Weinregale (7x), Beleuchtungskonzepte (12x)
     - **Quelle**: Projekt-Datenbank 2024 [Link zu CRM-Einträgen]"

**Weitere Beispiel-Queries:**
- "Warum ist unser Umsatz in Q1 gesunken?" → KI analysiert Daten + liefert Hypothesen
- "Welche Branche hat die höchsten Margen?" → Automatische Auswertung mit Begründung
- "Zeige mir ähnliche Projekte zu Kunde X" → Semantische Ähnlichkeits-Suche
- "Wo verlieren wir die meisten Deals?" → Loss-Reason-Aggregation

**Quellenangaben & Verifikation:**
- **Immer mit Quellen**: Jede KI-Antwort referenziert Ursprungsdokumente (CRM-IDs, Projekt-Nummern)
- **Confidence Scores**: "Diese Antwort basiert auf 12 Datenpunkten (Konfidenz: 92%)"
- **Explainability**: "So kam ich zur Antwort: [Reasoning-Trace]"

**Automated Report Summaries:**

**Wöchentliche Executive Summaries:**
- **Trigger**: Jeden Montagmorgen 7 Uhr
- **n8n Workflow**[^9]:
  1. Aggregiere Daten der Vorwoche (Umsatz, Opportunities, Projekte)
  2. LLM generiert 1-Seiten-Zusammenfassung:
     - **Highlights**: "3 neue Projekte gewonnen (€95K), 2 Opportunities in Negotiation"
     - **Risiken**: "Projekt Y 5 Tage verzögert, Budget-Warnung Projekt Z"
     - **Chancen**: "8 warme Leads in Pipeline (Ø 65% Close-Wahrscheinlichkeit)"
     - **Actions**: "Empfehlung: Nachfassen bei 3 stagnierten Opportunities"
  3. PDF-Export + E-Mail an GF

**Meeting-Briefings:**
- Vor Vorstands-Sitzung: Auto-generierte Präsentationsfolien mit KPIs & Highlights
- Vor Kundentermin: "Kunde X - Letzte 3 Projekte, offene Rechnungen, nächste Opportunity"

**Benchmark-Detection:**

**Automatische Anomalie-Erkennung:**
- **Positive Abweichungen**: "Verkäufer Julia: Conversion-Rate 75% (Team-Ø: 58%) → Best Practice identifiziert"
- **Negative Abweichungen**: "Projekt-Typ 'Vinothek': Marge 18% (Gesamt-Ø: 28%) → Kalkulation prüfen"
- **Seasonal Patterns**: "Q4 historisch +22% Umsatz → Erwartung für Q4 2025: €420K"

**Industry Benchmarks:**
- **Externe Datenquellen**: Vergleich mit Branchen-KPIs (z.B. via Creditreform, Statista API)
- Beispiel: "Ihre Marge 27,5% liegt über Branchen-Durchschnitt (24%) im Ladenbau"
- **Competitive Intelligence**: "Trends: Nachhaltige Materialien +35% Nachfrage 2024"

**What-If-Analysen:**

**Szenario-Simulationen:**
- GF fragt: **"Was passiert wenn wir 2 weitere Verkäufer einstellen?"**
- **KI-Modell berechnet**:
  - Kosten: +€120K/Jahr (2 × €60K Gehalt + €20K Onboarding)
  - Erwarteter Zusatzumsatz: +€380K/Jahr (bei 55% Conversion-Rate)
  - **ROI**: 216% nach 12 Monaten, Break-Even nach 4,5 Monaten
- **Sensitivity Analysis**: "Bei pessimistischem Szenario (40% Conversion): ROI 105%"

**Weitere What-If-Szenarien:**
- "Auswirkung wenn Materialkosten um 10% steigen?"
- "Wie viele Projekte können wir mit aktuellem Team bewältigen?"
- "Break-Even bei neuer Produktlinie 'Büroeinrichtung'?"

**Technische Umsetzung**:
- **RAG-Architektur**: LlamaIndex für Retrieval + GPT-4/Llama für Generation[^8][^10]
- **Vector Database**: Pinecone oder Weaviate für semantische Suche[^11]
- **LangChain Agents**: Orchestrierung komplexer Multi-Step-Queries[^12]
- **On-Premise LLM Option**: Lokales Llama 70B für DSGVO-Konformität[^13]

[^8]: Quelle: Research "LlamaIndex" – Optimiert für Knowledge Base Q&A in Enterprise
[^9]: Quelle: Research "n8n Automation" – Automated Report Generation Workflows
[^10]: Quelle: Research "RAG Architecture" – Best Practices für Enterprise RAG
[^11]: Quelle: Research "Vector Databases" – Pinecone/Weaviate für Production RAG
[^12]: Quelle: Research "LangChain" – Agent Orchestration for Complex Workflows
[^13]: Quelle: Research "DSGVO Compliance for LLMs" – On-Premise Hosting für Datenschutz

**DSGVO-Konformität & Transparenz:**

**Datenschutz-Maßnahmen:**
- **Lokales LLM-Hosting**: Option für 100% On-Premise (Llama 70B auf eigener Hardware)
- **Data Filtering**: Sensitive Felder (Margen, Gehälter) nur für GF-Rolle sichtbar
- **Audit Trails**: Jede KI-Query wird geloggt (Wer hat was gefragt? Welche Daten wurden abgerufen?)
- **Consent Management**: KI-Features optional aktivierbar pro User

**Explainability & Trust:**
- **Reasoning Traces**: GF kann nachvollziehen wie KI zur Antwort kam
- **Human-in-the-Loop**: Bei kritischen Entscheidungen (>€50K) → GF muss manuell bestätigen
- **Hallucination Detection**: System warnt wenn Antwort-Konfidenz <70% ("Antwort unsicher, manuelle Prüfung empfohlen")

---

# Phase 2/3: AI-Powered Insights & Self-Service BI für GF

**Relevant für:** Geschäftsführer (CEO) – Data-Driven Decision Making

## 🤖 Predictive Analytics & AI-Dashboard (Phase 2.2)

**Was bekommt GF?**
- **Lead Conversion Forecasting:** "Sie werden voraussichtlich €280K-€350K Umsatz in Q2 machen" (80% Konfidenz)
- **Project Risk Heatmap:** Alle aktiven Projekte mit Risiko-Score (0-100%) → Rot = Intervention nötig
- **Automated Weekly Summaries:** LLM-generierter Bericht "Top 5 Deals, Risiken, Chancen" → Keine manuelle Excel-Arbeit mehr
- **Churn Prediction:** "Kunde Hofladen Müller: 65% Risiko für Abwanderung nächste 3 Monate" (wegen sinkender Interaction Frequency)

**Erwarteter Impact:**
- -70% Zeit für Report-Erstellung (von 4h/Woche → 1h/Woche)
- 2-3 Wochen frühere Intervention bei Risiko-Projekten
- +15% höhere Deal-Closure-Rate durch bessere Priorisierung

---

## 📊 Custom Dashboard Builder (Phase 2.2)

**Problem aktuell:** GF muss Developer beauftragen für jede neue KPI-Ansicht → 3 Tage Wartezeit.

**Lösung:**
- **Drag & Drop Dashboard-Editor** → GF baut eigene Dashboards in 5 Min:
  - Widget-Library: Umsatz-Trend, Pipeline-Funnel, Top 10 Deals, Team-Performance, Budget-vs-Actual
  - Custom Filters: "Zeige nur Opportunities >€50K aus Q1 2025 für Branche 'Lebensmittel'"
  - Drill-Downs: Klick auf "Umsatz €320K" → Detail-Tabelle aller Projekte
- **Dashboard-Sharing:** Mit Teamleitern teilen, Permissions konfigurieren
- **Scheduled Reports:** Auto-E-Mail jeden Montag 8 Uhr mit aktuellen Zahlen

**Technologie:** CQRS Pattern (PostgreSQL Read Store) → 10-100x schnellere Queries vs. CouchDB MapReduce

---

## 🗺️ Advanced Analytics & Self-Service (Phase 2.2)

**GF kann selbst analysieren:**
- "Welche Branche hat höchste Profitabilität?" → Self-Service-Query
- "Wo verlieren wir die meisten Deals?" → Loss-Reason-Analysis
- "Welcher Verkäufer hat beste Conversion Rate?" → Team-Benchmarking
- "Wie entwickelt sich Umsatz pro Quartal im 3-Jahres-Vergleich?" → Trend-Analysis

**BI-Tool-Integration (Phase 3):**
- Grafana / Metabase / Apache Superset können CQRS PostgreSQL anbinden
- GF baut komplexe Analysen mit visueller SQL-Oberfläche

---

**Siehe auch:**
- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 3 (Advanced Analytics Vision)
- `docs/product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md` → Phase 2.2 KPIs

---

### 20

