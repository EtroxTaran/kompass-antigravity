# Referenzpersona\_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte)

_Converted from: Referenzpersona\_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte).pdf_  
_Document Version: 2.0 – Updated with Gap Resolutions_  
_Last Updated: 2025-11-10_

**⚡ Relevante Spezifikationen für ADM-Rolle:**

- **Offline-Speicher:** 31 MB ✅ (unter iOS 50MB-Limit) – Siehe data-model.md §8.1
  - Eigene Kunden (150): 300 KB, Opportunities (20): 100 KB, Activities (100): 100 KB, Pinned Files (3×10MB): 30 MB
  - 3-Tier-Strategie: Essential (5MB) + Recent (10MB) + Pinned (35MB)
- **RBAC-Berechtigungen:** Siehe RBAC_PERMISSION_MATRIX.md §4
  - Eigene Kunden: Voller Zugriff (CRUD)
  - Fremde Kunden: Lesezugriff (Basis-Felder), keine Margen
  - Opportunities: Eigene (CRUD), fremde (summary)
  - Projekte: Lesezugriff (kunden-bezogen)
  - Rechnungen: Status sichtbar (Bezahlt/Offen), keine Beträge
- **User Journeys:** Siehe USER_JOURNEY_MAPS.md
  - Journey 1: Cold Lead → Won Project (ADM-Hauptrolle: Lead Capture, Qualification, Closing)
  - Journey 5: Offline Work → Sync → Conflict Resolution (ADM-Szenario: 4h offline, 5 Änderungen, 1 Konflikt)
- **Konfliktauflösung:** Siehe CONFLICT_RESOLUTION_SPECIFICATION.md §4.1-4.2
  - Training-Modul: "ADM Conflict Resolution" (10 Minuten)
  - Typische Konflikte: Kundenadresse, Telefonnummer, Opportunity-Status
  - Erwartung: 90%+ ADMs lösen Konflikte selbstständig in <5 Minuten

---

# Referenzpersona: Außendienstmitarbeiter

### Einleitung & Kontext

Der Außendienstmitarbeiter (ADM) im Vertrieb von Ladenbau-Projekten übernimmt eine Schlüsselrolle in
einem aktuellen Digitalisierungsprojekt. Es geht um die Einführung eines **integrierten CRM- und**
**Projektmanagement-Tools** , das den gesamten Vertriebs- und Projektprozess abbildet. Ziel dieser Persona-
Dokumentation ist es, **eine ausführliche, strategisch nutzbare Referenzpersona** zu erstellen – als
verbindliche Richtschnur für Produktentscheidungen, UX-Konzeption und Qualitätssicherung im Projekt.
Die Persona hilft dem interdisziplinären Team (Produktmanagement, UX, IT-Projektsteuerung), die
Perspektive des wichtigsten Endnutzers einzunehmen und Anforderungen konsistent an dessen
Bedürfnissen auszurichten.

Stellen wir uns **Markus Müller (35)** vor: Er ist seit über 8 Jahren als Außendienstmitarbeiter im Ladenbau
tätig und betreut Kunden von der ersten Akquise bis zur finalen Projektübergabe. Markus ist täglich in ganz
Deutschland unterwegs – seine Kundschaft sind **Direktvermarkter** wie Hofläden, Gärtnereien, Floristen
oder Vinotheken, die ihre Ladenfläche neu gestalten oder ausbauen möchten. Er fungiert als **„Face to the**
**Customer“** , d.h. der alleinige Ansprechpartner des Kunden über die gesamte Projektdauer
. Für das
Unternehmen bedeutet das: Markus repräsentiert die Firma nach außen und muss gleichzeitig intern alle
Fäden zwischen Kunde, Planung, Kalkulation, Innendienst, Marketing und Geschäftsführung
zusammenhalten. Diese Persona-Beschreibung liefert Kontext und Details zu Markus’ Motivation,
Arbeitsweise, Anforderungen und Herausforderungen. Sie soll sicherstellen, dass die geplante Anwendung
– mobil wie am Desktop – ihn optimal unterstützt und so zum Erfolg des Gesamtprojekts beiträgt.

# Persona-Übersicht

**Rolle:** Markus Müller ist Außendienstmitarbeiter (ADM) im Vertrieb von Ladenbau-Projekten. Er akquiriert
und betreut eigenständig Projekte im Bereich individueller Ladeneinrichtungen – vom ersten
Kundenkontakt über Beratung, Angebotserstellung bis hin zur Übergabe der fertigen Ladeneinrichtung. Als
Vertriebsprofi im Außendienst verbringt er einen Großteil seiner Arbeitszeit außer Haus bei
Kundenterminen oder auf der Straße. Gleichzeitig hält er engen Kontakt zum Innendienst und
verschiedenen Fachabteilungen, um Kundenanforderungen intern abzustimmen.

**Motivation:** Markus ist ein vertriebsorientierter Mensch, der an **abschlusssicherem Vertrieb und hoher**
**Kundenzufriedenheit** gemessen wird. Er hat Freude daran, **passgenaue Lösungen für seine Kunden zu**
**finden** – etwa den Hofladen eines Obstbauern mit optimaler Einrichtung auszustatten – und am Ende den
erfolgreichen Ladenumbau präsentieren zu können. Ihn motiviert das positive Feedback seiner Kunden und
der **sichtbare Erfolg** (ein neu eröffneter Laden, der durch seine Beratung entstanden ist). Zudem ist er
erfolgsgetrieben: Er möchte Umsatzziele erreichen oder übertreffen und neue Kunden gewinnen. Ein
weiterer Antrieb ist seine **Autonomie und Abwechslung** im Job: Er schätzt es, eigenverantwortlich zu
arbeiten, viel herumzukommen und jeden Tag andere Menschen und Orte kennenzulernen.

**Umfeld & Arbeitsweise:** Markus’ Arbeitsplatz ist **„im Auto und beim Kunden“** – er ist in ländlichen
Regionen und Städten unterwegs, oft mehrere Tage pro Woche auf Reisen. Morgens prüft er seine Termine
und Tourenplanung, dann fährt er zu Kundenstandorten, führt Beratungsgespräche und Besichtigungen
durch. Er arbeitet viel **mobil mit Smartphone, Tablet und Laptop** , hat aber auch klassische Hilfsmittel wie
Notizblock, Maßband und Kamera dabei (z.B. fotografiert er die Ausgangssituation im Laden). Zwischen
Terminen und abends im Hotel versucht er, **Notizen und Informationen ins System einzupflegen** – bisher
oft manuell in verschiedene Tools (Excel-Listen, ein altes CRM-System, E-Mails) oder sogar handschriftlich,
was zu Doppelarbeit führte. Dieses fragmentierte Arbeiten ist zeitaufwändig und fehleranfällig, wie es im
traditionellen Außendienst leider üblich ist
. Gerade im stressigen Tagesgeschäft bleibt wenig Zeit für
administrative Aufgaben, was dazu führt, dass Berichte häufig erst spät nachgetragen werden. Markus
wünscht sich daher eine **zentralisierte Lösung** , die ihn entlastet: Alle kunden- und projektbezogenen
Informationen sollen gebündelt und leicht zugänglich sein, idealerweise **ohne abendliches Nacharbeiten**
**im Büro oder Hotel**
.

# Herausforderungen: Zu Markus’ größten Herausforderungen zählen die Informationsorganisation und

# Relevante Systeme & Tools: Aktuell nutzt Markus eine Mischung aus Microsoft Office (Outlook, Excel)

# Aufgaben & Prozesse

Markus’ Aufgaben erstrecken sich über den gesamten Vertriebszyklus im Ladenbau – vom ersten
Kundenkontakt bis zur Übergabe des fertigen Ladenprojekts. Im Folgenden werden seine **zentralen**
**Aufgaben und Prozesse** beschrieben:

**Akquise & Erstkontakt:** Markus identifiziert potenzielle Neukunden (z.B. ein Hofladen, der
erweitern will) über verschiedene Kanäle – Empfehlungen, Messen, Online-Anfragen oder
Kaltakquise. Er kontaktiert den Interessenten telefonisch oder per E-Mail und stellt das
Unternehmen sowie Referenzprojekte vor. Sein Ziel: einen **Vor-Ort-Termin** zu vereinbaren, um das
Projekt persönlich zu besprechen. Bereits in dieser Phase sammelt er erste Informationen: **Wer ist**
**der Entscheider? Was ist der Bedarf?** – diese werden idealerweise gleich im CRM erfasst.

**Kundenbesuch & Bedarfsanalyse:** Beim ersten Termin vor Ort nimmt Markus eine **Beratungsrolle**
ein. Er betrachtet die vorhandene Ladenfläche, fragt gezielt nach den Wünschen des Kunden
(Designvorstellungen, Budgetrahmen, Sortimentsschwerpunkte) und misst ggf. Räumlichkeiten aus.
Er hört aufmerksam zu und beantwortet Fragen des Kunden. Hierbei hilft ihm Erfahrung – und
künftig auch das Tool: **Briefing-Informationen oder Branchentrends** , die für diesen Kundentyp
relevant sind, könnten ihm vorab angezeigt werden (z.B. besondere Anforderungen bei einem
Spargelhof vs. einer Vinothek)
. Markus dokumentiert die wichtigsten Punkte des Gesprächs –
bisher oft auf Papier oder im Laptop. In Zukunft soll er diese **Kontaktprotokolle direkt digital**
**erfassen** können, idealerweise noch während oder direkt nach dem Gespräch, sodass nichts
vergessen geht
. Fotos vom Ist-Zustand oder Skizzen fügt er den Kundendaten hinzu. Wichtig ist
ihm, den **persönlichen Draht** zum Kunden aufzubauen: Viele seiner Kunden sind Inhaber-geführte
Betriebe; Markus gewinnt ihr Vertrauen durch authentisches Auftreten, Fachkenntnis und das
Gefühl, verstanden zu werden.

# Interne Abstimmung & Angebotserstellung: Nach dem Termin bereitet Markus intern alles für ein

**Präsentation & Verhandlung:**
Markus vereinbart einen
**zweiten Kundentermin** , um
Konzeptvorschlag und Angebot zu besprechen. Hier präsentiert er dem Kunden die Ladenplanung
(häufig als ausgedrucktes Booklet oder digitale Präsentation) und erläutert die Kosten. Idealerweise
hat er alle Details parat – Materialien, Maße, Lieferzeiten – um kompetent zu wirken. Falls der Kunde
Änderungswünsche hat, notiert Markus diese und klärt intern eine Anpassung (Iteration). Oft folgt
eine **Verhandlungsphase** : Der Kunde möchte vielleicht einen besseren Preis oder alternative
Ausführungen. Markus versucht, innerhalb seines Ermessensspielraums Lösungen zu finden.
Kleinere **Nachlässe oder Änderungen** kann er selbst entscheiden; für größere Zugeständnisse hält
er Rücksprache mit seinem Vertriebsleiter oder der Geschäftsführung. Hier zahlt sich aus, wenn er
über **aktuelle Kundendaten und Verkaufschancen** verfügt – z.B. ob der Kunde strategisch wichtig
ist, wie wahrscheinlich der Abschluss ist etc. Das CRM sollte ihn dabei unterstützen, z.B. durch eine
**Opportunity-Pipeline** , die den Status und Wert der Verkaufschance visualisiert
. Markus’ Ziel in
dieser Phase ist klar: den **Abschluss** zu erzielen, also den unterschriebenen Auftrag für das
Ladenbau-Projekt. Im Idealfall wird der Vertrag direkt beim Termin unterzeichnet, was alle
Projektbeteiligten einen großen Schritt voranbringt.

# Projektübergabe & Betreuung: Nach erfolgreichem Abschluss wird das Projekt an die

# Nachbereitung & Kundenbeziehungsmanagement: Auch nach Projektabschluss bleibt Markus im

# Administrative Aufgaben & Reporting: Neben dem operativen Geschäft muss Markus auch

das oft zeitverzögert (z.B. abends vom Hotel aus), was zu Informationslücken führte
. Mit der
neuen Lösung soll dies möglichst **in Echtzeit oder zeitnah** nach jedem Termin erfolgen. Ein gutes
Tool erlaubt es ihm z.B., **direkt nach dem Kundenbesuch im Auto die Gesprächsnotizen ins**
**Tablet einzusprechen oder einzugeben** , wodurch die Zentrale sofort informiert ist. Weiterhin muss
Markus
**Spesenabrechnung & Ausgabenverwaltung (Phase 2):** Markus muss monatlich alle Geschäftsausgaben abrechnen. Die neue Lösung macht dies deutlich einfacher:

**Unterwegs Ausgaben erfassen:**

- **Belege fotografieren:** Nach dem Mittagessen fotografiert Markus die Quittung direkt mit der App. Die **OCR-Funktion** (Tesseract.js) erkennt automatisch Betrag, Datum und Händler. Markus prüft die erkannten Daten und korrigiert bei Bedarf.
- **Automatische Zuordnung:** Die App schlägt automatisch vor, welche Tour oder welcher Kunde mit dieser Ausgabe verknüpft werden soll (basierend auf Datum und GPS-Standort).
- **Kategorisierung:** Markus wählt die Kategorie (Mahlzeit, Parken, Maut, etc.) und die App speichert alles lokal (offline-fähig).

**Kilometer automatisch erfassen:**

- **GPS-Tracking:** Wenn Markus eine Tour startet, zeichnet die App automatisch seine Route auf (GPS-Tracking). Am Ende der Tour wird automatisch ein **Kilometerlog** erstellt mit:
  - Gesamte gefahrene Distanz
  - Route als GeoJSON (für Steuerprüfung)
  - Automatische Kostenberechnung (€0.30/km, deutscher Standard)
- **Manuelle Eingabe:** Falls GPS-Tracking nicht gewünscht ist (Datenschutz), kann Markus die Kilometer manuell eingeben.
- **Validierung:** Die App vergleicht die eingegebene Distanz mit der GPS-Route (±5% Toleranz). Bei größeren Abweichungen kann der GF eine manuelle Übernahme genehmigen.

**Hotelübernachtungen:**

- **Vergangene Hotels:** Die App zeigt eine Liste aller Hotels, in denen Markus bereits übernachtet hat, mit Bewertungen und Preisen. Beim Planen einer neuen Tour kann er schnell ein bekanntes Hotel auswählen.
- **Hotel-Suche:** Über die integrierte **Google Maps/Places API** kann Markus Hotels in der Nähe seiner Termine suchen. Die App zeigt Preise, Bewertungen und Entfernung zu seinen Kundenstandorten.
- **Hotel hinzufügen:** Markus fügt das Hotel zu seiner Tour hinzu und die App erstellt automatisch einen **Expense-Eintrag** für die Übernachtung.

**Monatliche Abrechnung:**

- **Report-Generator:** Am Monatsende öffnet Markus die "Monatliche Spesenübersicht" und wählt den Zeitraum (z.B. Juni 2025). Die App generiert automatisch einen **PDF-Report** mit:
  - Alle Ausgaben nach Kategorie gruppiert
  - Kilometerpauschalen pro Tour
  - Hotelkosten
  - Gesamtsumme
  - Alle Belege als Anhang (PDF mit allen Quittungen)
- **Einreichung:** Markus kann den Report direkt per E-Mail an die Buchhaltung senden oder als PDF exportieren.
- **Genehmigungsworkflow:** Ausgaben über €100 erfordern GF-Genehmigung. Die App zeigt den Status jeder Ausgabe (Entwurf, eingereicht, genehmigt, abgelehnt, bezahlt).

**Zeitersparnis:** Durch mobile Spesenerfassung spart Markus **ca. 2-3 Stunden pro Monat** (statt Zettelwirtschaft und manueller Excel-Listen). Die monatliche Abrechnung dauert nur noch **5-10 Minuten** statt 2-3 Stunden. Schließlich berichtet Markus
in Vertriebs-Meetings an die Geschäftsführung: z.B. über seine Umsätze, neu gewonnene Projekte,
Angebotspipeline und Marktbeobachtungen. Diese **KPIs und Berichte** wird das neue System
idealerweise automatisch mit aufbereiten – etwa in Form von Dashboards, die Umsatzziele vs. Ist
anzeigen, oder Auswertungen seiner Kundenbesuchsfrequenz. Damit kann Markus seine Leistung
belegen und gemeinsam mit dem Management strategische Entscheidungen (z.B. welche
Kundensegmente verstärkt angegangen werden sollen) fundiert treffen.

# Zusammengefasst ist Markus’ Arbeitsalltag geprägt von multitasking über verschiedene Prozesse

# Anforderungen & Erwartungen

Aus den Aufgaben und dem Arbeitskontext von Markus lassen sich klare **fachliche und technische**
**Anforderungen** an das integrierte CRM- und PM-Tool ableiten. Markus’ Erwartungen an die neue Lösung
sind hoch – sie soll spürbare Erleichterung im Alltag bringen. Im Detail sind folgende Anforderungen
relevant:

**Funktionale Anforderungen:**

**Offline-Fähigkeit & Synchronisation:**
Da Markus häufig in Regionen ohne stabile
Internetverbindung arbeitet, ist ein Offline-Modus unabdingbar. Die App muss **alle wichtigen**
**Kundendaten, Kontakte, Termine und Projektdetails offline verfügbar halten** und Eingaben
zwischenspeichern
. Sobald eine Verbindung besteht, sollen die Daten automatisch
synchronisieren, ohne dass Markus manuell eingreifen muss. Diese Offline-Funktionalität ist ein
anerkannter Branchenstandard im mobilen Vertrieb, besonders in Deutschland mit seinen
ländlichen Räumen
. Sie stellt sicher, dass Markus auch „im Funkloch“ arbeiten kann, ohne
Datenverluste oder Verzögerungen.

# Mobile Tourenplanung & Routenoptimierung (Phase 2):

**Wöchentliche Tourenplanung:** Markus plant seine Woche am Sonntagabend oder Montagmorgen. Er öffnet die KOMPASS-App und erstellt eine neue Tour für die kommende Woche (z.B. "Bayern Süd, 15.-17. Juni"). Das System analysiert automatisch:

- **Kundenprioritäten:** Welche Kunden haben seit längerem keinen Besuch? (basierend auf `lastVisitDate` und `visitFrequencyDays`)
- **Geografische Nähe:** Welche Kunden liegen in der gewählten Region?
- **Umsatzpotenzial:** Welche Opportunities sind aktiv und benötigen einen Vor-Ort-Termin?
- **Öffnungszeiten:** Berücksichtigung von Kundenöffnungszeiten für realistische Terminplanung

Das System schlägt automatisch **8-12 Kundenbesuche** vor, die Markus mit einem Klick zu seiner Tour hinzufügen kann. Er kann Vorschläge ablehnen oder manuell weitere Termine hinzufügen.

**Automatische Routenoptimierung:** Sobald Markus mehrere Termine zu seiner Tour hinzugefügt hat, optimiert das System die Route automatisch (TSP-Algorithmus). Die optimierte Route zeigt:

- **Reihenfolge der Besuche** (nummeriert: 1, 2, 3, ...)
- **Geschätzte Fahrtzeiten** zwischen den Stopps
- **Gesamte Distanz** der Tour (z.B. 450 km)
- **Geschätzte Gesamtkosten** (Fahrtkosten + Übernachtungen + Verpflegung)

Markus kann die Route manuell anpassen (z.B. wenn er einen Kunden zuerst besuchen möchte) und das System berechnet die neue Route neu.

**GPS-gestützte Navigation:** Während der Tour zeigt die App eine **interaktive Karte** mit:

- **Aktueller Standort** (blauer Punkt)
- **Geplante Besuche** (nummerierte Marker)
- **Route** (gestrichelte Linie zwischen Stopps)
- **Nächster Termin** (hervorgehoben)

Markus kann direkt aus der App heraus zur **Google Maps Navigation** wechseln ("Zum nächsten Termin navigieren"). Die App erkennt automatisch, wenn Markus am Zielort ankomft (GPS-basiert) und bietet einen **Check-In-Button** an.

**Tourenverwaltung:** Markus kann mehrere Touren gleichzeitig planen (z.B. diese Woche Bayern, nächste Woche Norddeutschland). Die App zeigt eine **Kalenderansicht** mit allen geplanten Touren und Terminen. Beim Erstellen eines neuen Termins schlägt das System automatisch passende Touren vor (gleicher Tag ±1 Tag, Region <50km entfernt). Falls keine passende Tour existiert, bietet das System an, eine neue Tour zu erstellen.

**Effizienzgewinn:** Durch automatisierte Tourenplanung spart Markus **ca. 20-30 Minuten pro Woche** bei der Planung und reduziert Fahrtkosten um **10-15%** durch optimierte Routen.

# Kunden- und Kontaktmanagement (CRM): Das Herzstück bildet eine zentrale Kundendatenbank ,

# Integriertes Projektstatus-Tracking: Da Vertrieb und Projektabwicklung im Ladenbau eng verzahnt

# Vertriebsprozess-Unterstützung & Angebotsmanagement: Das Tool soll Markus im gesamten

der Pipeline sind und wo Handlungsbedarf besteht. Zudem wünscht er sich eine **mobile**
**Angebotserstellung** : Vorlagen für Angebote, die bereits Produkt- und Preisdaten enthalten und
schnell anpassbar sind
. Im Idealfall könnte er direkt beim Kunden ein Angebot konfigurieren,
doch realistischerweise passiert dies meist im Nachgang – dennoch sollte die Software ihn dabei
unterstützen, etwa durch hinterlegte Module, automatische Kalkulation bestimmter
Standardpositionen oder digitale Unterschrift-Funktionen. Auch **Dokumente** (Angebote, Verträge,
technische Zeichnungen) sollten verwaltet werden: Markus möchte sie dem Kunden auf dem Tablet
zeigen können und sie dem Datensatz zuordnen. Eine Versionierung oder zumindest geordnete
Ablage (damit z.B. immer die aktuelle Angebotsversion klar erkennbar ist) ist nötig. Schließlich ist
**Vertrags- und Compliance-Management** wichtig: Im Ladenbau gibt es z.B. standardisierte AGBs,
Widerrufsbelehrungen oder Datenschutzformulare, die korrekt eingebunden sein müssen – die
Lösung sollte hierbei unterstützen, um Markus rechtlich abzusichern
.

# Kommunikation und Kollaboration: Als Schnittstelle zwischen Innen- und Außendienst braucht

# Analytics & Kundenbeziehungsanalyse: Markus legt Wert darauf, aus seinen Daten Lernen und

# Nicht-funktionale Anforderungen und Erwartungen:

**Usability & Mobil-Optimierung:** Da Markus kein IT-Spezialist ist und unterwegs oft wenig Zeit hat,
erwartet er eine **intuitive und einfache Bedienung** . Die Benutzeroberfläche muss übersichtlich
sein, mit klarem Fokus auf die wichtigsten Tagesaufgaben (z.B. „heutige Termine“, „aktuelle

Aufgaben“ auf dem Startbildschirm). Mobil sind **Offline-Bedienung, schnelle Ladezeiten und eine**
**klare Navigation** entscheidend – er darf nicht fünf Mal klicken müssen, um z.B. einen
Kundenbericht zu öffnen. **Spracheingabe** oder Diktierfunktionen für Notizen wären ein großer
Vorteil, da er so im Auto per Sprachnotiz ein Gespräch protokollieren könnte, anstatt zu tippen. Das
Design soll auf Smartphones wie Tablets angepasst sein (responsive oder native Apps). Insgesamt
muss Markus das Gefühl haben, **dass das Tool ihm Zeit spart und nicht zusätzlich Zeit kostet** . Nur
dann wird er es gern und konsequent nutzen (Akzeptanz). Branchenbest Practices zeigen, dass
Außendienstler produktiver sind, wenn sie Informationen direkt mobil erfassen können statt abends
noch Berichte zu schreiben
.

# Performance & Stabilität: Im Kundentermin hat Markus oft nur Sekunden, um z.B. eine

**Integrationen & Flexibilität:** Wie erwähnt sollte die Lösung sich gut in bestehende Infrastruktur
einfügen: **Kalender- und E-Mail-Integration** (Outlook)
, vielleicht eine Schnittstelle zum ERP (z.B.
um Auftragsstatus aus der Fertigung zu sehen) oder zu Buchhaltung (wegen Auftrags- und
Rechnungsdaten) wäre wünschenswert. Falls das Unternehmen Office 365 nutzt, soll das CRM
darauf Rücksicht nehmen (Authentifizierung, Nutzung von SharePoint/OneDrive für Dokumente
etc.). Zudem sollte die Software **anpassbar und zukunftssicher** sein – d.h. neue Felder oder
Prozesse (etwa falls das Unternehmen in neue Branchen geht) sollten konfigurierbar sein. Auch
**Skalierbarkeit** ist ein Punkt: Wenn mehr ADMs dazukommen oder mehr Daten anfallen, muss das
System mithalten können.

# Akzeptanzkriterien & Change Management: Markus’ Erwartung (und die der Geschäftsleitung) ist,

# Best Practices & Industriestandards

Die Rolle des Außendienst-Vertrieblers wie Markus ist in vielen Branchen bekannt – entsprechend gibt es
**bewährte Industriestandards und Best Practices** , die in dieses Projekt einfließen sollten. Im Folgenden
einige relevante Standards, Modelle und vergleichbare Ansätze:

**Mobile CRM als neuer Standard:** In den letzten Jahren hat sich mobile CRM-Software für
Außendienstteams weltweit durchgesetzt. Papierbasierte Prozesse und abgekoppelte Systeme
gelten als überholt, da sie zu Zeitverlust und Informationslücken führen
. Der Trend – gerade in
Deutschland – geht klar zur **Digitalisierung des Vertriebsaußendienstes** : Informationen jederzeit
verfügbar, sofortige Erfassung nach Kundenterminen und nahtlose Synchronisation mit dem
Backoffice. Dadurch verbessern sich nicht nur die Produktivität der Verkäufer, sondern auch die
**Kundenbeziehungen nachhaltig**
. Moderne Vertriebsteams erwarten eine
**360°-**

# Kundensicht in Echtzeit , um professionell auftreten zu können. Unternehmen, die ihren ADM

# Ganzheitlicher Vertriebsprozess & Account-Management: Etablierte Sales-Methoden wie

# Integrierte Touren- und Visit-Planung: Ein wiederkehrendes Thema im Außendienst ist die

Anforderungen von Markus (offline, Touren, Spesen) heutzutage technisch lösbar und in
erfolgreichen Tools umgesetzt sind.

**Datenzentralisierung & 360°-Sicht als Prinzip:** In vielen Projekten zur CRM-Einführung hat sich
gezeigt, dass nur ein zentrales System die gewünschte Transparenz bringt. Der Grundsatz „ **eine**
**zentrale Datenquelle** “ (Single Source of Truth) ist ein Muss, um Doppelarbeit und Inkonsistenzen zu
vermeiden. Alle Teammitglieder – vom Vertrieb über die Planung bis zur Geschäftsführung – sollen
mit denselben aktuellen Kundendaten arbeiten
. Das umfasst Kontaktdaten, aber auch
Projektfortschritt, Dokumente und Kommunikation. Dieser Standard spiegelt sich z.B. in Lösungen
wie Salesforce oder Microsoft Dynamics 365 wider, die **mehrere Persona-Profile** innerhalb eines
Systems abbilden und doch gemeinsame Datenpools nutzen
. Für Markus bedeutet das: Was
immer er im System dokumentiert, steht unmittelbar allen relevanten Kollegen zur Verfügung (und
umgekehrt). Ein etabliertes Framework ist hier auch das **Customer 360** -Modell, das alle
Interaktionen und Datenpunkte pro Kunde zentral vereint – ein Konzept, das bei der Einführung
kommuniziert werden sollte, damit alle Beteiligten verstehen, warum sie ihre Informationen in
dieses System einspeisen sollen.

# Nutzerakzeptanz & Change Management: Industriestandards betonen, dass die Einführung einer

# Technologie & Sicherheit:

# 10

---

_Page 11_

---

Zusammengefasst orientiert sich diese Persona und das Gesamtprojekt an dem, was in modernen
Vertriebsorganisationen funktioniert: **Mobile, integrierte Systeme, die offlinefähig, benutzerfreundlich**
**und prozessorientiert** sind. Vergleichbare Rollen – ob im Außendienst eines Konsumgüterherstellers, eines
Anlagenbauers oder eben im Ladenbau – profitieren von denselben Prinzipien: Effiziente Tourenplanung,
aktuelle Kundendaten, einfache Angebotserstellung, Kollaboration in Echtzeit und analytische Auswertung.
Diese Referenzpersona verbindet die unternehmensspezifischen Erkenntnisse mit den allgemeinen Best
Practices, um ein stimmiges Bild zu zeichnen.

# Rollenprofil des ADMs

In diesem Abschnitt wird Markus’ **Profil** zusammengefasst – von seinen Kompetenzen und Werkzeugen bis
zu den KPIs, an denen er gemessen wird, sowie seinem Kommunikations- und Entscheidungsverhalten:

**Kompetenzen & Fähigkeiten:** Markus verfügt über ausgeprägte **Verkaufs- und Beratungsfähigkeiten** . Er
kann sich gut auf verschiedene Kundentypen einstellen – vom traditionellen Landwirt bis zur designaffinen
Floristin – und komplexe technische Sachverhalte (Materialien, Baupläne) verständlich vermitteln. Zu seinen
Stärken gehören **Beziehungsmanagement, Verhandlungsgeschick und Präsentationsfähigkeit** . Er ist es
gewohnt, eigenständig zu arbeiten und **seine Zeit effizient zu organisieren** . Als „Kümmerer“ hat er auch
die Fähigkeit, Projekte zu orchestrieren und im Hintergrund verschiedene Abteilungen zu koordinieren,
ohne dass der Kunde etwas davon mitbekommt. Fachlich kennt er sich im Ladenbau-Bereich aus: Er hat
Grundwissen in Inneneinrichtung, Materialkunde und baulichen Abläufen, was ihm hilft, Kunden
kompetent zu beraten. Zudem bringt Markus digitale Grundkompetenzen mit – er nutzt täglich Office-
Programme, Smartphone-Apps und hat Erfahrung mit einem einfachen CRM. Wichtig ist aber, dass neue
Tools **einfach und praxisnah** sind, da er kein IT-Experte ist. Er lernt vor allem durch machen, weniger durch
dicke Handbücher.

**Arbeitsmittel & genutzte Tools:** Aktuell nutzt Markus **Smartphone, Tablet und Laptop** als Hardware.
Softwareseitig sind Outlook (für E-Mail, Kalender) und Excel/Word seine hauptsächlichen Tools, ergänzt
durch eine CRM-Software (die aber veraltet und mobil unhandlich ist) sowie diverse eigenentwickelte Excel-
Listen für Dinge wie Angebotstracking oder Spesen. Für die Routenplanung verlässt er sich bisher auf
Google Maps und seine Erfahrung; ein spezialisiertes Tool hat er nicht. Er führt ein Fahrtenbuch (teils noch
auf Papier) und sammelt Quittungen für Spesen in einem Umschlag. Für Produktpräsentationen beim
Kunden hat er PDF-Kataloge und manchmal physische Muster dabei. Zukünftig soll das **integrierte CRM/**
**PM-System** viele dieser Hilfsmittel ablösen bzw. bündeln: Es wird die zentrale App auf seinem Smartphone/
Tablet sein, mit der er Kundeninfos nachschlägt, Notizen eingibt, Angebote erstellt und seine Tour plant. Es
wird vermutlich auch **mit Office 365 verknüpft** sein, sodass E-Mails und Termine automatisch
dokumentiert werden. Außerdem könnte Markus ein digitales Spesen-Tool (entweder Bestandteil des
Systems oder eine angebundene App) nutzen, um unterwegs Belege zu erfassen – damit würde das
Papierchaos entfallen. Sein Auto und Navigationssystem sind indirekt ebenfalls „Tools“, da sein Auto quasi
sein Büro darstellt. Eventuell bekommt Markus im Zuge der Digitalisierung ein aktualisiertes **Dienst-Tablet**
**mit SIM-Karte** oder ein ruggedized Device, um unterwegs optimal arbeiten zu können.

**Leistungskennzahlen (KPIs):** Als Vertriebler wird Markus an **harten Zielen** gemessen. Übliche KPIs in
seinem Umfeld sind z.B. **Umsatz pro Quartal/Jahr** , **Anzahl neuer Projekte** (Abschlüsse), **Angebotsquote**
(Anzahl Angebote vs. Aufträge), **Durchlaufzeiten** (wie lange von Erstkontakt bis Abschluss) und
**Deckungsbeitrag/Marge der gewonnenen Projekte** . Zusätzlich können **Aktivitäts-KPIs** herangezogen
werden: Anzahl Kundenbesuche pro Woche/Monat, Anzahl neuer Leads generiert, Besuchsfrequenz bei A-

Kunden etc. Sein Unternehmen verfolgt vermutlich eine Mischung daraus – primär zählen Umsatz und
Projektabschlüsse, doch man achtet auch auf langfristige Faktoren wie Kundenzufriedenheit. Letztere wird
evtl. qualitativ erfasst (Feedbackbögen nach Projektende) oder an Wiederbeauftragungen gemessen.
Markus persönlich setzt sich Ziele wie „X neue Kunden im Bereich Hofläden dieses Jahr“ oder
„Umsatzsteigerung um Y% gegenüber Vorjahr“. Das neue System wird helfen, viele dieser KPIs
**automatisch zu tracken und transparent zu machen** , z.B. über ein Vertriebs-Dashboard für das
Management. Ein positiver Nebeneffekt: Markus kann selbst immer sehen, wo er steht und ggf.
gegensteuern (etwa mehr Akquise betreiben, wenn die Pipeline für das nächste Quartal noch dünn ist).

**Werte & Arbeitskultur:** Markus verkörpert gewisse Werte, die in der Branche und für die Rolle typisch sind.
Er glaubt an **Kundenzufriedenheit und langfristige Partnerschaft** – ein Ladenbau-Projekt ist kein
kurzfristiges Produktverkaufen, sondern oft der Beginn einer langfristigen Beziehung (Inhaber empfehlen
ihn vielleicht weiter oder beauftragen später Erweiterungen). Daher legt Markus Wert auf **Zuverlässigkeit,**
**Ehrlichkeit und Qualität** . Er würde dem Kunden nichts versprechen, was nicht haltbar ist, und steht zu
seinem Wort. Intern schätzt er eine **offene Kommunikation und Teamwork** : Obwohl er viel allein draußen
ist, weiß er, dass er ohne die Leistung der Planer, Monteure etc. den Kunden nicht bedienen könnte. Respekt
und Professionalität im Umgang mit Kollegen sind ihm wichtig. Er hat einen **pragmatischen,**
**lösungsorientierten** Arbeitsstil – statt lange zu theoretisieren, probiert er Dinge aus und lernt daraus. Auch
in Entscheidungen ist er eher pragmatisch: Er entscheidet vieles auf Basis seiner Erfahrung und
„Bauchgefühl“, insbesondere was Prioritäten angeht (z.B. welchem Interessenten er mehr Nachfass-
Aufmerksamkeit schenkt). Bei größeren Entscheidungen (Rabatte, Strategie für einen wichtigen Kunden)
holt er sich jedoch die Meinung seines Chefs oder von Kollegen ein. Markus ist **zielstrebig** , aber nicht um
jeden Preis – er würde einen Auftrag auch ablehnen, wenn die Rahmenbedingungen riskant sind oder nicht
zu den Firmenwerten passen.

**Kommunikationsverhalten:** Gegenüber Kunden tritt Markus **freundlich, verbindlich und kompetent** auf.
Er hört aktiv zu und spricht die Sprache des Kunden (bei Landwirten z.B. eher bodenständig, bei
designorientierten Kunden etwas fachlicher mit Trend-Begriffen). Er bevorzugt das persönliche Gespräch –
deshalb fährt er ja weite Strecken –, denn er weiß, dass Vertrauen am besten vis-à-vis aufgebaut wird.
Telefon und E-Mail nutzt er unterstützend, aber ein Ladenbau verkauft sich nur schwer am Telefon allein.
Mit seinen Kollegen kommuniziert Markus bislang viel per Telefon und E-Mail. Kurze Absprachen erledigt er
auch gern mündlich, wenn er im Büro ist. In Zukunft könnte sich das mit der neuen Kollaborationsplattform
etwas ändern: Er wird vermutlich mehr kurze Chatnachrichten oder Kommentare im System schreiben
(„@Planer: Kunde wünscht Änderung X“) statt anzurufen. Grundsätzlich hat Markus kein Problem damit,
**moderne Kommunikationsmittel** zu nutzen, solange sie zuverlässig funktionieren. In Meetings (z.B.
wöchentliche Vertriebsrunde) präsentiert er sachlich seine Pipeline und teilt Markt-Feedback. Er kann seine
Punkte klar rüberbringen, mag aber keine langen PowerPoints – lieber Fakten auf den Tisch und
diskutieren. Gegenüber der Geschäftsführung vertritt er auch mal die Kundenperspektive und setzt sich
intern für deren Wünsche ein, auch wenn es unbequeme Botschaften sind. Diese **Brückenfunktion**
zwischen Kunden und Firma macht einen großen Teil seiner Kommunikation aus.

**Entscheidungsverhalten:** In seinem Tagesgeschäft entscheidet Markus relativ autonom, **wie er seine Zeit**
**einteilt und welche Kunden er besucht** . Er priorisiert nach Dringlichkeit (wer wartet auf ein Angebot?) und
Potential. Dabei verlässt er sich stark auf seine Erfahrung – er kennt „seine“ Branche inzwischen gut.
Strategische Entscheidungen wie Preisgestaltung, Angebotskonditionen oder besondere Versprechen
spricht er im Zweifelsfall mit Vorgesetzten ab, um Rückendeckung zu haben. Er sammelt vor
Entscheidungen gern genügend Informationen: Das neue CRM hilft ihm z.B. dabei, vor einem wichtigen

Kundentermin nochmal alle offenen Punkte zu sehen und informiert zu wirken. **Risikoabwägung** gehört
auch dazu: Verspricht er dem Kunden einen Eröffnungstermin, prüft er intern die Machbarkeit bevor er
zusagt. Im Zweifel kommuniziert er lieber transparent eine Herausforderung, als falsche Erwartungen zu
setzen. Insgesamt ist sein Entscheidungsstil ein **Mix aus datenbasiert (Fakten aus dem CRM,**
**Rückmeldungen der Kollegen) und empathisch (was ist dem Kunden wichtig?)** . Durch die Einführung
smarter Analysen (z.B. Umsatzprognosen, Warnungen bei überschrittenen Budgets) könnte sein
Entscheiden künftig noch faktengetriebener werden. Dennoch bleibt in der Vertriebspraxis oft ein Moment,
wo Markus auf sein Gespür hört – beispielsweise ob er einem schwierigen Kunden entgegenkommt oder
hart verhandelt. Hier vertraut er seiner Ausbildung und Intuition, was in den meisten Fällen erfolgreich ist.

# Schlussbetrachtung

Die Persona **„Markus Müller – Außendienstmitarbeiter Ladenbau“** verdeutlicht die strategische

Bedeutung dieser Rolle für das Unternehmen und das Digitalisierungsprojekt. Als Schnittstelle zum Kunden
und als Umsatztreiber braucht Markus ein Arbeitsumfeld, das ihm den Rücken frei hält für das Wesentliche:
**Kundenkontakte und Verkaufsabschlüsse** . Die hier ausgearbeitete Persona-Dokumentation zeigt
detailliert, welche Bedürfnisse, Pain Points und Ziele ein solcher Außendienstler hat. Sie dient dem
Projektteam als **kompassgenaue Orientierung** – bei jeder Produktexperience-Entscheidung kann gefragt
werden: „Hilft das Markus in seinem Alltag? Passt es zu seinem Workflow?“

Für die strategischen Entscheidungsträger bedeutet das: Investitionen in Offline-Fähigkeit, Usability oder
Tourenoptimierung sind keine „nice-to-haves“, sondern entscheidend dafür, ob die Lösung von der
Vertriebsorganisation akzeptiert wird. Gelingt es, Markus und seine Kollegen mit einer hervorragenden
Lösung auszustatten, hat das Unternehmen vielfältigen Nutzen: Die Vertriebseffizienz steigt (mehr
Kundenbesuche, weniger Leerlauf), die **Datenqualität** verbessert sich (alle Infos zentral verfügbar), und
Kunden erhalten ein professionelleres Erlebnis – was wiederum die Abschlussquoten und Kundentreue
erhöht
. Studien und Praxisbeispiele belegen, dass Unternehmen mit mobil vernetzten Vertriebsteams
**Wettbewerbsvorteile** erzielen: Schnellere Reaktionszeiten, proaktiver Service und informierte Mitarbeiter
führen zu höherem Umsatz und zufriedeneren Kunden
.

# In der Schlussbetrachtung sei auch betont, dass diese Persona nicht statisch ist. Sie sollte während des

# Schnellreferenz Persona (Überblick)

**Persona-Name**
_Markus Müller_ (Beispielname) – Außendienstmitarbeiter Vertrieb Ladenbau

**Alter / Erfahrung**
35 Jahre, >8 Jahre Vertriebserfahrung im B2B-Ladenbau (bundesweit)

Akquise und Betreuung von Ladenbau-Projekten von Erstkontakt bis
Abschluss. Umsatzverantwortung für seine Region; Schnittstelle zw. Kunde und
internem Team (Planung, Kalkulation, Montage).

**Rolle &**
**Verantwortung**

**Motivation & Ziele**
Kunden begeistern, Projekte erfolgreich abschließen, Umsatzziele erreichen.
Aufbau langfristiger Kundenbeziehungen; persönlicher Stolz, gelungene
Ladenprojekte zu sehen.

Viele manuelle Prozesse (Notizen, Spesenabrechnung) → Zeitaufwand abends.
Informationsinseln verhindern 360°-Sicht. Unterwegs oft kein Internet (Offline-
Problem). Tourenplanung bisher suboptimal (viel Fahrzeit). Koordination mit
Innendienst mühsam via E-Mail/Telefon.

**Challenges**
**(Schmerzpunkte)**

Meist unterwegs (Auto) in ganz Deutschland; Kundentermine vor Ort
(Hofläden, Fachgeschäfte). Homeoffice für Nachbereitung; gelegentlich Büro-
Meetings. Kommuniziert täglich mit Kunden, Kollegen (Planer, Innendienst)
und Vorgesetzten.

**Arbeitsumfeld**

**Aktuelle Tools**
Outlook (Kalender/Mails), Excel/Word (Angebote, Listen), Telefon, Kamera.
Einfache CRM-Software (stationär, wenig genutzt). Papier für Notizen,
Fahrtenbuch, Belegsammlung. Navigation via Google Maps.

Integrierte CRM-&PM-App (mobil & Desktop) mit Offline-Modus. Funktionen:
Zentrale Kundendatenbank, Tourenplanung & Routenoptimierung, Kontakt-
und Besuchsberichte, Angebotsmanagement, Aufgaben-/Projektübersicht,
Spesen- und Kilometererfassung, Analytics (Pipeline, KPI-Dashboards).
Integration mit Outlook/Office 365.

**Zukünftige Tools**
**(Anforderungen)**

Vertriebsstark (Abschlussicherheit, Verhandlung), fachkundige Beratung
(Ladenbau-Know-how), Beziehungsmanagement, Selbstorganisation,
technischen Verständnis für Pläne/Material. Digital-affin (nutzt Smartphone/
Tablet), lernbereit für neue Tools.

**Kompetenzen**

**Werte**
Kundenorientierung, Zuverlässigkeit, Ehrlichkeit. Lösungsorientiert,
pragmatisch. Teamplayer intern, aber eigenverantwortlich im Feld.

Bevorzugt persönlich vor Ort; sonst Telefon/E-Mail. Offen und klar in der
Abstimmung. Künftig vermehrt Chat/Kommentare im System für schnelle
interne Klärungen. Passt Tonfall ans Gegenüber an (vom bodenständigen
Plausch bis zur Management-Präsentation).

**Kommunikation**

Kombination aus datenbasiert (Fakten aus CRM, Umsatzanalysen) und
erfahrungsgeleitet (Bauchgefühl bei Kundenpriorität). Trifft
Alltagsentscheidungen autonom (Touren, Angebote innerhalb Rahmen); zieht
Vorgesetzte bei größeren Entscheidungen hinzu.

**Entscheidungsstil**

**Persona-Name**
_Markus Müller_ (Beispielname) – Außendienstmitarbeiter Vertrieb Ladenbau

Umsatz (Quartal/Jahr), gewonnene Projekte, Angebots-Konversionsrate,
Kundenbesuchsanzahl, Reiseaufwand vs. Ertrag.
Kundenzufriedenheitsindikatoren (Feedback, Folgeaufträge). Auch intern:
CRM-Nutzungsgrad und Datenqualität könnten gemessen werden (für
Projekterfolg).

**KPIs**

# Quellenübersicht

**Interne Projektinputs:** _Gesamtkonzept Integriertes CRM- und PM-Tool (Interview-Auszüge, 2025)._ –
Enthält Anforderungen der verschiedenen Rollen (ADM, Planer, GF etc.), z.B. zum Bedarf an
Kundenüberblick, Aufgaben-Tracking, Offline-Fähigkeit
. Diese Inputs flossen maßgeblich in
die Persona-Gestaltung ein.

# Bitrix24 (2025): Mobiles CRM im Außendienst: 7 revolutionäre Funktionen – Artikel über Digitalisierung

# Krauss GmbH (2024): Außendienst Tourenplanung: Mehr Effizienz im Außeneinsatz – Blog-Beitrag über

# L-Mobile (o.J.): Mobile Vertriebslösung – einfach, digital und effizient im Außendienst – Produktseite

# Offline-Mobilität und vor-Ort-Datenerfassung, die für Markus’ Persona wichtig sind.

**Weitere Best Practices:** Branchentypische Konzepte wie **Sales Playbooks** für Außendienst,
**Account-Based Selling** und **KI-Unterstützung im Vertrieb** wurden ergänzend berücksichtigt. Zum
Beispiel beschreibt ein Whitepaper von Qmarketing (2025) die Dokumentation von wichtigen
Vertriebsprozessen und Best Practices in Vertriebs-Apps
. Auch die Rolle der Nutzerakzeptanz und
Schulung wird in CRM-Einführungsratgebern (z.B. Salesforce, 2025) hervorgehoben
. Diese
Quellen untermauern, dass technische Lösung und menschliche Faktoren zusammengedacht
werden müssen, um Erfolg zu haben.

# sg_interview_31.10.25_deu.txt

## file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### 15

| 3   | 44  |
| --- | --- |
| 6 , |     |

Mobiles CRM im Außendienst: 7
revolutionäre Funktionen, die Ihren Vertrieb in Deutschland antreiben

## https://www.bitrix24.de/articles/

mobiles_crm_im_aussendienst_revolutionaere_funktionen_die_ihren_vertrieb_in_deutschland_antreiben.php

### Außendienst Tourenplanung: Mehr Effizienz im Außeneinsatz

## https://www.krauss-gmbh.com/blog/au%C3%9Fendienst-tourenplanung

### Tourenplaner-Software im Außendienst - portatour

## https://www.portatour.com/Tourenplaner

### Mobile Vertriebslösung: Einfach, digital und effizient im Außendienst

## https://l-mobile.com/geschaeftsfelder/mobiler-vertrieb/

### Sales personas to include in UI/UX design - Dynamics 365

## https://learn.microsoft.com/en-us/dynamics365/guidance/develop/ui-ux-guidance-sales-personas

### Whitepaper #05 Von Vertriebs-Apps und Sales-Playbooks

## https://www.qmarketing.de/marketinginsights/whitepaper/von-vertriebs-apps-und-sales-playbooks/

---

# Erweiterungen 2025: Prognosen, KI-Assistenz & Pipeline-Intelligenz

Die folgenden Funktionen erweitern Markus' Werkzeugkasten um **vorausschauende Analysen, automatisierte Recherche und intelligente Pipeline-Visualisierung**, basierend auf modernen CRM-AI-Systemen wie Salesforce Einstein und Microsoft Dynamics 365 Copilot.

## 📊 Prognosen & Opportunities

### Anforderungen an Prognosefunktionen

Markus profitiert von **präzisen Forecasts seiner Verkaufschancen**, die ihm helfen, seine Pipeline realistisch einzuschätzen und proaktiv zu steuern.

**Kernanforderungen:**

**Opportunity-Wahrscheinlichkeitsberechnung:**

- Das System berechnet für jedes Angebot die **Abschlusswahrscheinlichkeit** basierend auf:
  - **Historischen Daten**: Vergangene Win-Rates pro Kundensegment (Hofläden: 65%, Vinotheken: 45%)
  - **Engagement-Signalen**: Antwortzeit des Kunden, Anzahl Meetings, E-Mail-Interaktionen
  - **Deal-Attributen**: Projektgröße, Budget-Range, Entscheider-Involvement
  - **Wettbewerbsfaktoren**: Konkurrenzsituation, Dringlichkeit des Projekts
- **ML-Modelle** (Random Forest, logistische Regression) analysieren historische Abschlüsse und identifizieren Erfolgsmuster[^1]
- Beispiel: "Hofladen Müller: 72% Abschlusswahrscheinlichkeit (Grund: Ähnliche Projekte 70% Win-Rate, schnelle Responses, Budget passt)"

**Umsatzprognose-Aggregation:**

- **Gewichtete Pipeline**: Jede Opportunity wird mit ihrer Wahrscheinlichkeit multipliziert
  - Projekt A: €50.000 × 80% = €40.000 erwarteter Umsatz
  - Projekt B: €30.000 × 40% = €12.000 erwarteter Umsatz
  - **Monatsprognose**: Summe aller gewichteten Opportunities
- **Zeitliche Projektion**: Dashboard zeigt erwarteten Umsatz pro Monat/Quartal[^2]
- **Visualisierung**: Kurvendiagramm "Voraussichtlicher Umsatz Q1-Q4 2025"

**Frühwarnsignale für Markus:**

- **Dünnstellenwarnungen**: "Pipeline für Q3 nur bei €120K (Ziel: €200K) – 3 zusätzliche Leads benötigt"
- **At-Risk-Deals**: "Projekt XY: Keine Aktivität seit 14 Tagen, Wahrscheinlichkeit von 60% auf 35% gefallen"
- **Opportunity-Aging**: Warnung wenn Deals zu lange in einer Phase verharren (>30 Tage in "Proposal")

**Persönliche Leistungsmetriken:**

- Forecast Accuracy Tracking: Vergleich "prognostizierter Umsatz" vs. "tatsächlicher Umsatz"
- Win-Rate-Trends: "Deine Conversion-Rate ist von 55% (Q1) auf 62% (Q2) gestiegen"
- Pipeline-Velocity: Durchschnittliche Zeit von Lead zu Abschluss (aktuell 45 Tage, Ziel: <40 Tage)

**Technische Umsetzung** basiert auf bewährten Ansätzen:

- Predictive Analytics wie bei Salesforce Einstein Lead Scoring[^3]
- ML-Opportunity Scoring mit Features aus CRM-Historie (ähnlich HubSpot's Predictive Lead Scoring)
- Probability-basierte Forecasting-Methoden aus der Vertriebspraxis[^2]

[^1]: Quelle: Research "ML Models for Opportunity Scoring" – Random Forests und logistische Regression sind Standard für CRM-Scoring

[^2]: Quelle: Research "Sales Pipeline Forecasting Methods" – Weighted Pipeline als Best Practice

[^3]: Quelle: Competitive Analysis Salesforce Einstein – Lead/Opportunity Scoring Mechanismen

## 🔍 KI-gestützte Kundenrecherche

### Automatisierte Kundenvorbereitung

Vor jedem Kundentermin erhält Markus **automatisch zusammengestellte Recherche-Briefings**, die ihm helfen, informiert und vorbereitet aufzutreten.

**Funktionsumfang:**

**Automatische Unternehmensrecherche:**

- **Trigger**: Neuer Termin wird angelegt → KI startet Recherche-Workflow (n8n-Automation)[^4]
- **Datenquellen**:
  - Unternehmensregister (Handelsregister, Creditreform)
  - Öffentliche News & Social Media (Filiale-Eröffnungen, Management-Wechsel)
  - Branchentrends (z.B. "Bio-Hofläden: +15% Wachstum 2024")
- **Output**: 5-Minuten-Briefing mit:
  - Unternehmensprofil (Größe, Umsatz, Mitarbeiter)
  - Aktuelle News ("Hofladen Müller eröffnet zweite Filiale in Stadt X")
  - Relevante Branchentrends ("Trend: Regionale Lebensmittel +20% Nachfrage")
  - Potenzielle Pain Points ("Hofladen hat alte Ladeneinrichtung aus 1998")

**Wettbewerbsanalyse:**

- Identifikation von Konkurrenzprojekten: "Konkurrent Y hat ähnlichen Hofladen in Region Z ausgestattet"
- Preispositionierung: "Marktüblicher Preis für 80qm Hofladen: €40-60K"
- Unique Selling Points: "Unsere Stärke vs. Konkurrent: Nachhaltige Materialien"

**Referenzprojekt-Matching:**

- KI durchsucht interne Projektdatenbank nach ähnlichen Abschlüssen
- **RAG-basiert**: Semantische Suche findet "Hofladen mit Weinregal und Kühltheke" in Projekt-Historie
- Markus sieht: "3 ähnliche Projekte: Hofladen Schmidt (€45K, 2023), Obstgut Wagner (€38K, 2024)"
- **Vorteile**: Realistische Kalkulation, bewährte Konzepte als Inspiration

**Risiko-Assessment:**

- **Bonitätsprüfung**: Automatischer Check via Creditreform API
- **Zahlungshistorie**: Falls Bestandskunde → Warnung bei überfälligen Rechnungen
- **Projektrisiken**: "Achtung: Kunde hat unrealistische Zeitvorstellung (4 Wochen für 120qm Umbau)"

**Conversation Intelligence:**

- **Nach Kundengespräch**: Transkription + KI-Analyse (wie bereits in Phase 2 beschrieben)
- **Zusätzlich**: Sentiment-Erkennung ("Kunde wirkt skeptisch bzgl. Preis"), Intent-Detection ("Kunde plant zweite Filiale in 2026")
- **Actionable Insights**: "Empfehlung: Finanzierungsoptionen ansprechen"

**Implementierung** folgt Best Practices:

- n8n "Customer Monitoring Agent" läuft täglich und scannt relevante Datenquellen[^4]
- RAG-System (LlamaIndex) für semantische Suche in Projektdatenbank[^5]
- LLM (GPT-4 oder lokales Llama) generiert Briefing-Zusammenfassungen

[^4]: Quelle: Research "n8n Automation Patterns" – Customer Monitoring Agent, automatisierte Recherche-Workflows

[^5]: Quelle: Research "LlamaIndex" – Optimiert für schnelle semantische Dokumenten-Retrieval

## 📈 Pipeline-Visualisierung

### Interaktive Forecast-Dashboards

Markus benötigt eine **visuelle, leicht verständliche Darstellung seiner Vertriebspipeline** mit Prognose-Funktionen.

**Dashboard-Komponenten:**

**Pipeline-Kanban-Board:**

- **Spalten**: New → Qualifying → Proposal → Negotiation → Won/Lost
- **Opportunities als Karten** mit:
  - Kundennamen, Projektwert, Wahrscheinlichkeit (farbcodiert: >70% grün, 40-70% gelb, <40% rot)
  - Letzter Kontakt ("Vor 3 Tagen"), Next Action ("Angebot nachfassen bis 15.02")
- **Drag & Drop**: Markus verschiebt Karten zwischen Phasen → System aktualisiert Status automatisch
- **Aggregierte Zahlen**: Summe pro Phase (z.B. "Proposal: 5 Opportunities, €180K gewichtet")

**Forecast-Kurvendiagramm:**

- **X-Achse**: Zeit (Monate/Quartale)
- **Y-Achse**: Erwarteter Umsatz in €
- **Kurven**:
  - Prognostizierter Umsatz (basierend auf Wahrscheinlichkeiten)
  - Zielvorgabe (z.B. €200K/Monat)
  - Tatsächlicher Umsatz (rückblickend)
- **Confidence Intervals**: Markierung von Best-Case/Worst-Case-Szenarien (Monte Carlo Simulation)

**Funnel-Analyse:**

- **Conversion-Trichter**: Wie viele Leads → Opportunities → Wins
- Beispiel: "Von 20 Leads → 12 Opportunities (60%) → 7 Wins (58% Close-Rate)"
- **Engpass-Identifikation**: "Viele Opportunities stagnieren in 'Proposal' → Empfehlung: Nachfass-Automation"

**Aktivitäten-Heatmap:**

- Kalendersicht zeigt "Besuchsfrequenz pro Kunde"
- Farbcodierung: Grün = regelmäßiger Kontakt, Rot = "Kunde wurde >60 Tage nicht kontaktiert"
- **Automatische Erinnerungen**: "A-Kunde Müller nicht seit 45 Tagen besucht → Termin vorschlagen?"

**What-If-Szenarien:**

- Markus kann spielen: "Was passiert wenn ich 2 zusätzliche Leads/Woche akquiriere?"
- System berechnet: "Bei +2 Leads/Woche → +€25K Umsatz in Q3 (bei 55% Conversion)"
- Hilft bei Ressourcenplanung und Zielsetzung

**Mobile-Optimierung:**

- **Kompakte Ansicht** für Smartphone: "Meine Top 5 Deals diese Woche"
- **Offline-Verfügbar**: Pipeline-Daten gecacht, Änderungen synchronisieren bei Verbindung
- **Push-Notifications**: "Deal XY: Abschlusswahrscheinlichkeit auf 85% gestiegen (Kunde hat Vertrag angefordert)"

**Technische Umsetzung**:

- BI-Dashboard mit **Metabase** (für einfache Self-Service-Analysen) oder **Grafana** (für Echtzeit-Metriken)[^6]
- Integration mit **PowerBI** für Management-Reporting
- Data Warehouse (Star Schema) aggregiert CRM-Daten für schnelle Abfragen[^6]

[^6]: Quelle: Research "BI & Reporting Solutions" – Metabase für Business User, Grafana für Real-Time, PowerBI für Enterprise Reporting

**Best Practices aus der Industrie:**

- Salesforce Einstein Analytics: Predictive Dashboards mit Abschlusswahrscheinlichkeiten[^7]
- Microsoft Dynamics 365 Copilot: AI-gestützte Pipeline-Insights und Next-Best-Action-Empfehlungen[^7]
- HubSpot AI Lead Scoring: Automatische Priorisierung + Conversion-Prognosen[^7]

[^7]: Quelle: Competitive Analysis – Salesforce Einstein, Dynamics 365 Copilot, HubSpot AI Features

---

# Phase 2: AI-Features für Außendienst-Effizienz

**Relevant für:** Außendienstmitarbeiter (Markus) – Zeitersparnis & bessere Lead-Priorisierung

## 🎤 Audio-Transkription & Auto-Protokoll (Phase 2.1 - Q3 2025)

**Aktuelles Problem:** Markus verbringt 15-30 Min NACH Kundengespräch mit manueller Protokollierung → Zeitverschwendung, Details gehen verloren.

**Lösung:**

- **Während Kundengespräch:** Markus nimmt Sprachmemo auf (PWA-App, 1-Click-Start)
- **Automatisch:** Whisper transkribiert Audio → GPT-4 generiert 5-Zeilen-Zusammenfassung
- **Intelligente Task-Generierung:** KI erkennt "Ich schicke nächste Woche Muster" → Auto-Task "Muster versenden" mit Due-Date
- **Real-Time-Progress:** Markus sieht auf Smartphone "Transkription läuft... 60% fertig" (Socket.IO WebSocket)

**Zeitersparnis:**

- Von 20 Min manuelle Protokollierung → 2 Min Review + Approve = **18 Min/Besuch gespart**
- Bei 4 Besuchen/Tag = **1,2h/Tag** = **6h/Woche** = **24h/Monat** = **~3 Arbeitstage/Monat**

**DSGVO-Konform:**

- Kunde muss Aufnahme zustimmen (1-Click-Consent im CRM)
- Optional: Lokales Whisper (keine Cloud-Daten)
- Automatische Löschung nach 30 Tagen (nur Transkript bleibt)

---

## 🎯 AI Lead Scoring & Priorisierung (Phase 2.1)

**Aktuelles Problem:** Markus priorisiert Leads mit "Bauchgefühl" → oft Zeit bei Low-Value-Leads verschwendet.

**Lösung:**

- **ML-Modell** (XGBoost/LightGBM) berechnet **Conversion-Score** (0-100%) für jeden Lead basierend auf:
  - Firmographics (Branche, Unternehmensgröße, Budget-Range)
  - Interaction History (Wie oft Kontakt? Response-Zeit?)
  - Sentiment-Analyse aus Protokollen ("Kunde sehr interessiert" vs. "Kunde zögerlich")
- **Dashboard:** Markus sieht "Top 10 Leads dieser Woche" mit Score + Reasoning
  - Lead A: 87% Score (Grund: "Branche 'Lebensmittel' hat 75% Conversion-Rate, Kunde hat schnell geantwortet")
  - Lead B: 32% Score (Grund: "Unternehmensgröße <5 Mitarbeiter, Budget <€20K → niedrige Chance")

**Impact:**

- +15-20% höhere Conversion Rate (Fokus auf High-Value-Leads)
- -30% Zeit für "Dead-End"-Leads
- Bessere Tourenplanung (High-Score-Leads geografisch clustern)

---

## 🗺️ Intelligent Route Planning (Phase 2.2)

**Problem:** Markus plant Touren manuell → suboptimale Reihenfolge, hohe Spritkosten.

**Lösung:**

- **Multi-Stop Route Optimization** (Traveling Salesman Problem)
  - Input: Markus wählt 5 Kunden für morgen → KI berechnet beste Route (Zeit/Distanz optimiert)
- **Nearby Lead Mapping:** "Auf deiner Route liegt Lead XY (Score 75%) nur 2km entfernt – möchtest du auch besuchen?"
- **Automated Check-Ins:** Geofencing → Auto-Prompt "Check-In bei Kunde Z?" → 1-Click-Protokoll

**Einsparungen:**

- 1-2h/Woche Zeitersparnis
- €50-100/Monat weniger Sprit = €600-1200/Jahr pro Außendienstler

---

**Siehe auch:**

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 1 (AI-Transkription), Pillar 3 (Route Planning)
- `docs/architectur/` → KI-Integrationsarchitektur (BullMQ + n8n + Whisper)

---

### 16
