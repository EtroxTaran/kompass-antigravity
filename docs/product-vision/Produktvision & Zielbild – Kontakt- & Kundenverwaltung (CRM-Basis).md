# Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis)

_Converted from: Produktvision & Zielbild – Kontakt- & Kundenverwaltung (CRM-Basis).pdf_  
_Last Updated: 2025-11-10 – Vollständig integriert mit allen Spezifikationen_  
_Document Version: 2.0_

**⚡ Verknüpfte Spezifikationen:**

- **NFRs:** `docs/reviews/NFR_SPECIFICATION.md` – Performance (API P95 ≤1,5s), Offline-Speicher (ADM=31MB ✅), 20 Nutzer, 95% Verfügbarkeit
- **Datenmodell:** `docs/reviews/DATA_MODEL_SPECIFICATION.md` – ERD, Customer/Contact/Location-Entities, Validierung, Deduplizierungs-Algorithmen
- **RBAC:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` – ADM sieht eigene Kunden (voll), fremde Kunden (Basis), keine Margen
- **Journeys:** `docs/reviews/USER_JOURNEY_MAPS.md` – Journey 1 (Lead→Won), Journey 5 (Offline-Sync mit Konflikten)
- **Konfliktauflösung:** `docs/reviews/CONFLICT_RESOLUTION_SPECIFICATION.md` – Hybrid-Auto-Resolution, Duplikat-Erkennung-UX
- **Tests:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` – E2E-CRM-001 bis E2E-CRM-010, Duplikat-Tests, Import/Export-Tests
- **API:** `docs/reviews/API_SPECIFICATION.md` – GET/POST/PUT/DELETE /customers, /contacts, /locations, Bulk-Import-Endpoints

**✅ Gap-Resolutionen (diese Dokument):**

- **GAP-REQ-FUNC-001:** Abnahmekriterien präzisiert (siehe §3 Anforderungen - quantifiziert)
- **GAP-REQ-FUNC-002:** Bulk-Operationen spezifiziert (siehe neue §8 Import/Export-Spezifikation)
- **GAP-REQ-FUNC-003:** Sucheanforderungen definiert (siehe neue §9 Such-Spezifikation)
- **GAP-REQ-FUNC-004:** Benachrichtigungen/Erinnerungen detailliert (siehe neue §10 Notification-Spezifikation)
- **GAP-REQ-FUNC-005:** Export/Import-Formate festgelegt (siehe neue §8)
- **GAP-REQ-FUNC-006:** Reporting-Anforderungen vervollständigt (siehe neue §11 Reporting-Spezifikation)

---

# Produktvision & Zielbild – Kontakt- &

### 0. Executive Summary

**Vision:** Die Kontakt- und Kundenverwaltung bildet das **Herzstück des CRM-Teils** unseres integrierten
CRM-/Projektmanagement-Tools. Ziel ist eine **zentrale Plattform (“Single Source of Truth”)** für alle
Kontaktdaten – von Erstkontakt/Lead bis Bestandskunde – in der **alle Abteilungen mit denselben**
**aktuellen Informationen arbeiten**
. Kunden werden dadurch **durchgängig und professionell**
**betreut** , von der Akquise über Angebot und Projekt bis zum Abschluss und Aftersales
. Die
Geschäftsführung erhält jederzeit einen 360°-Überblick über **Kunden, Pipeline und Projekte** , was die
Steuerung der Geschäftsentwicklung erleichtert
.

# Ziele: Wir etablieren eine 360°-Kundensicht – sämtliche kundenbezogenen Aktivitäten, Projekte, Angebote

# Kern-Ergebnisse & Entscheidungen: Alle im Projektkontext analysierten Anforderungen wurden

| 8   |     |     |
| --- | --- | --- |
|     | 9   |     |

# 1. Kontext & Abgrenzung der Domäne

**Domänenbeschreibung:** Die Domäne _Kontakt- & Kundenverwaltung_ umfasst die **Verwaltung aller**
**externen Kontakte** unseres Unternehmens – also Kunden (Firmen **und** ihre Ansprechpartner), Leads
(potenzielle Kunden), sowie Lieferanten, Partner und ggf. Verbände
. Es handelt sich um die CRM-
Grundlage, in der **Stammdaten** wie Namen, Adressen, Kontaktdaten und Kategorien zentral gepflegt
werden
. Ebenso werden **Relationen zwischen Kontakten** abgebildet, z.B. Firmenhierarchien (Kunde X
ist Tochter von Konzern Y), Mitgliedschaften (Kunde Z gehört zum Verband W) oder Lieferantenbeziehungen
. Die Domäne beinhaltet außerdem alle **Aktivitäten auf Kontaktebene** : Gesprächsnotizen,
Besuchsberichte, Anrufe, E-Mails, Anhänge etc., jeweils mit dem entsprechenden Kontakt verknüpft
.
Damit liefert die Kontaktverwaltung die oft erwähnte **360°-Sicht** : Jeder berechtigte Nutzer kann zu einem
Kunden **an einer Stelle alle relevanten Informationen** einsehen – von Basisdaten über vergangene
Interaktionen bis zu laufenden Projekten oder offenen Angeboten
.

# Abgrenzung: Die Kontaktverwaltung ist eng verzahnt mit benachbarten Domänen , überschneidet sich

# Terminologie & Struktur: In unserem Kontext entspricht ein Kunde typischerweise einem Unternehmen

# 2. Domänen-Challenge (Annahmen, Lücken, Risiken)

Die Kontaktverwaltung wurde anhand des Projektkontexts kritisch hinterfragt, um **Unklarheiten und**
**Risiken früh auszuräumen** . Wichtigste Aspekte:

**Vereinheitlichung vs. Spezialfälle:** Eine Herausforderung war, alle Kontaktarten (Kunden, Leads,
Lieferanten, Verbände) in _einer_ Domäne konsistent abzubilden. Der Projektkontext deutet an, dass
dies gewünscht ist, um **“eine gemeinsame Datenbank für alle Kunden, Interessenten und**
**Lieferanten”** zu haben
. **Entscheidung:** Wir führen daher ein einheitliches **Kontaktmodul** ein, in
dem es unterschiedliche Typen/Kategorien gibt, aber keine separaten Adressbücher. Damit sehen
alle Nutzer alle relevanten externen Kontakte an einer Stelle – z.B. auch Lieferantenkontakte, die für
Projekte wichtig sind
. _Risiko:_ anfängliche Verwirrung, wenn z.B. Vertrieb plötzlich Lieferanten in
der Kontaktliste sieht. _Mitigation:_ Klare UI-Kennzeichnung nach Typ (Filteroption nach „Kunde“,

# „Lieferant“ etc.) und Berechtigungen, sodass z.B. Vertriebsmitarbeiter Lieferanten zwar sehen aber

**Dubletten & Datenqualität:** Ein zentrales Risiko bei einer großen gemeinsamen Kontaktliste ist
**Datenredundanz** . Der Außendienst arbeitet aktuell in Eigenlisten (z.B. Excel) und Marketing pflegt
parallel Word-Kontaktprotokolle – hier gibt es teils doppelte oder veraltete Einträge
.
**Anforderung (Muss):** Das neue System **erkennt doppelte Kontakte** bereits bei der Eingabe und
warnt bzw. verhindert dies
. Best Practice ist eine fuzzy-Suche nach gleichem Namen/Adresse
.
Zudem wird es eine **Merge-Funktion** geben, um bestehende Dubletten zusammenzuführen. _Risiko:_
Wenn Nutzer unsauber eingeben (z.B. Schreibvarianten), könnten Dubletten dennoch entstehen.
_Mitigation:_ regelmäßige Datenpflege durch definierte Verantwortliche (siehe unten), sowie technisch
z.B. ein Dubletten-Bericht und strikte Schreibkonventionen (z.B. Firmen immer mit
Rechtsformzusatz).

# Klare Zuständigkeiten & Pflege: Bisher fühlte sich speziell der Außendienst für „seine“ Kontakte

# übernimmt die Rolle des „Datenverwalters“ für Kontaktdaten? Sollte es z.B. einen CRM-Manager

**Abgrenzung Lead vs. Account:** Im Interview war teils unklar, wann ein Interessent als
eigenständiges Kundenkonto geführt wird. **Annäherung aus Best Practice:** Ein _Lead_ bleibt so lange
im Leads-Status, bis klar ist, dass ein echtes Projekt oder Verkaufschancen besteht. Dann erst erfolgt
die **Konvertierung in einen Kunden (Account)**
. Dabei sollen **keine Informationen verloren**
**gehen** – alle bisher erfassten Notizen/Quellen werden übernommen
. Diese Umwandlung
wird im Tool per Klick unterstützt (siehe Anforderungen). _Risiko:_ ohne klare Regeln könnten zu früh
Accounts angelegt werden oder umgekehrt Leads zu lange „vergessen“ werden. _Mitigation:_

Vertriebsprozess-Definition: z.B. jede neue Anfrage als Lead erfassen; wöchentliche Pipeline-Review,
bei der entschieden wird, welche Leads qualifiziert und umgewandelt oder verworfen werden (vgl.
Opportunity-Management-Prozess).

**Beziehungsgeflecht & Verbände:** Ein **ungelöstes Problem** im Altsystem: Die Beziehungen
zwischen Kontakten (z.B. Filialbetrieb gehört zu Konzern XYZ, oder zwei Kunden sind Mitglieder im
selben Verband) waren bisher nirgendwo dokumentiert – Außendienstler wussten solche
Zusammenhänge nur individuell
. Das neue System soll dieses „Netzwerk“ sichtbar machen
. **Lösung:** Wir führen flexible Beziehungstypen ein, z.B. _„gehört zu“_ , _„Mitglied von“_ , _„empfohlen_
_durch“_ etc., sodass ein Kontaktdatensatz Links zu anderen haben kann
. Damit kann man z.B.
bei einem Kunden sehen: gehört zu Franchise-Gruppe X, Mitglied im Regionalverband Y, Lieferant Z
hat Projekte für ihn ausgeführt, etc. _Offene Detailfrage:_ **<Verband als eigener Kontakt?>** – Soll

# ein Verband als eigener Account-Typ angelegt werden oder nur als Attribut/Beziehung? Vorschlag:

# Offline & Synchronisation: Für den Außendienst ist Offline-Zugriff ein Muss

- 7

# Compliance & Datenschutz: Kundendaten unterliegen DSGVO – das System muss Lösch- und

# Qualität & User Experience: Ein erkanntes Risiko ist, dass das System von den Mitarbeitern nicht

**intuitive, schnelle UI** , mobil-optimiert für den Außendienst und mit Komfortfunktionen
(Schnellsuche ≤500ms, Filter, wenige Klicks ≤5 pro Workflow)
. Auch bei ~1.000-5.000 Kunden und zahlreichen Projekten muss die
Performance flüssig bleiben (quantifiziert: API P95 ≤1,5s, Listen-Laden ≤2s, siehe NFR*SPECIFICATION.md)
. \_Mitigation:* Wir orientieren uns an modernen CRM-Oberflächen,
testen früh mit Key-Usern und via k6-Lasttests (20 gleichzeitige Nutzer, getestet bei 25); priorisieren Performance
beim Design (Caching von Kontaktdaten lokal, effiziente Suche über Index etc.). Das Ziel “eine
Applikation statt Ordnerchaos” soll erlebbar positiv sein
.

# Zusammenfassend wurden alle Annahmen aus dem Projektkontext überprüft und präzisiert. Offene

Lösungsvorschlag und Rückfrage aufgeführt, um eine eindeutige Entscheidung herbeizuführen.

# 3. Personas-Mapping (Needs → Konzept-Fit/Gaps → Entscheidung)

Wir betrachten alle relevanten Personas aus dem Projektkontext und prüfen, wie deren **Ziele und**
**Anforderungen** in der Domäne Kontaktverwaltung erfüllt werden. Bei jeder Persona wurden **Lücken**
**identifiziert** und geschlossen:

**Außendienst-Mitarbeiter (Vertrieb):** Diese Persona ist viel unterwegs, akquiriert neue Kunden und
pflegt die Kundenbeziehung vor Ort.
**Needs/Ziele:** Schneller Zugriff auf **Kundendaten von unterwegs** , auch ohne Internet
. Neue
Kontakte (Interessenten) **einfach erfassen** können – idealerweise direkt nach einem Gespräch per
Spracheingabe oder offline Notiz, ohne späteren Papierkram
. Übersicht über **eigene Touren,**
**Kontakte und To-Dos** , damit kein Follow-up vergessen wird
. Möglichkeit, **Besuchsberichte**
gleich digital festzuhalten (statt Diktiergerät + Abtippen)
. **Historie einsehen:** Was wurde dem
Kunden zuletzt angeboten, wer hat zuletzt gesprochen, offene Angebote/Probleme etc., um beim
Gespräch informiert zu sein
.
**Konzept-Fit:** Die Kontaktverwaltung liefert genau diese 360°-Historie pro Kunde (alle Aktivitäten,
Projekte, Angebote sichtbar)
. Über eine **mobile App** oder responsive UI kann der ADM
Kundenprofile einsehen, **Notizen anlegen (auch offline)** und neue Leads erfassen
. Die **Offline-**
**Fähigkeit** und Synchronisation sind als Muss umgesetzt (siehe oben), sodass z.B. ein neuer
Messekontakt sofort unterwegs erfasst werden kann, selbst ohne Netz
. Aufgaben und Follow-
ups werden zwar im Aufgabenmodul verwaltet, sind aber mit Kontakten verknüpft, sodass der ADM
in der Kontaktansicht z.B. “Nächster Anruf am <Datum>” sieht. **Einfachheit:** Das UI wird für den
Außendienst vereinfacht (Mobile-optimierte Masken, wichtige Felder zuerst). Die Eingabe neuer
Kontakte erfordert minimal notwendige Felder, um Hürden gering zu halten. Eventuell vorgesehene
Komfortfunktion: **Visitenkartenscan oder Sprachnotiz-Transkription** (Nice-to-have), um die
Datenerfassung weiter zu erleichtern (der Projektkontext erwähnt automatische Erfassung als Best
Practice
).
**Gaps & Entscheidungen:** Im Interview kam hervor, dass der ADM bisher neue Kontakte per E-Mail
an Marketing meldete und Word-Profile erstellt werden – ein _langsamer, fehleranfälliger Prozess_
.
Diese Lücke schließen wir durch den **direkten Lead-Workflow im System** : Der ADM erfasst den
Lead selbst (per Laptop oder Mobilgerät); Marketing bekommt automatisch Einsicht und muss nichts
mehr abtippen. Ein Gap war auch die **Lead-Quellen-Nachverfolgung** : Der ADM möchte
kennzeichnen können, woher ein Kontakt stammt (Messe, Kaltakquise, Empfehlung)
, zum
einen für Marketingauswertungen, zum anderen weil die Provisionsabrechnung das honoriert
.
**Umsetzung:** Im Lead-Erfassungsformular gibt es ein Pflichtfeld “Akquisequelle” (Dropdown mit z.B.
Messe, Eigenakquise, Empfehlung etc.). Diese Info wird ins Kundenprofil übernommen und steht der

| 30  |     | .   |
| --- | --- | --- |
|     | 30  |     |

Buchhaltung für Provisionen zur Verfügung
. Auch später kann der ADM noch sehen, welche
Leads er selbst eingebracht hat (Motivation durch Transparenz der eigenen Provision
). Eine
weitere Anforderung: **Netzwerk-Kontakte pflegen** – der ADM arbeitet auch mit Multiplikatoren (z.B.
Architekten, Verbände) zusammen
. Unser Konzept ermöglicht, solche Kontakte als
eigenständige Einträge zu führen und mit Kunden zu verknüpfen (Beziehungstyp “empfiehlt/
projektvermittelt”). Somit kann ein ADM z.B. sehen, welche Kunden ihm ein bestimmter Architekt
vermittelt hat. _Entscheidung:_ Diese Feature ist enthalten, obwohl es in Standard-CRMs selten out-of-
the-box ist – wir priorisieren es, da im Interview der Nutzen solcher Netzwerke betont wurde
.
Insgesamt deckt das Konzept die Außendienst-Needs voll ab; kritische Erfolgsfaktoren sind v.a.
Offline-Performance und Usability, denen entsprechend hohe Priorität eingeräumt ist
.

# Vertriebs-Innendienst & Kalkulation: Diese Persona erstellt Angebote, koordiniert intern nach

eines Kundentyps filtern kann (dies ist eher Reporting, aber die Datenbasis kommt aus Kontakt/
Projekt-Modul). Insgesamt passt das Konzept gut – die Persona Innendienst profitiert stark von der
zentralen Datenbasis
.

# Planungsabteilung (Innenarchitekten): Die Planer erhalten nach Vertragsabschluss vom Vertrieb

# Vertrieb an Planung digital über das System erfolgt (z.B. als Lead → Opportunity → Projekt

**Buchhaltung:** Diese Persona ist verantwortlich für Rechnungsstellung, Zahlungsüberwachung und
finanzielle Integrität, inkl. Provisionsabrechnung
.
**Needs/Ziele: Korrekte Kundenstammdaten** für Rechnungen – die Buchhaltung braucht die
offiziellen Firmierungen, Adressen, Steuernummern etc. auf Knopfdruck, um Fehler bei Rechnungen
zu vermeiden. Außerdem muss die Buchhaltung wissen, **wer betreut den Kunden** , um bei
Zahlungsverzug den richtigen Vertriebsmitarbeiter zu informieren
. Wichtig ist auch, dass im
CRM festgehalten ist, **ob es ein Neukunde oder Bestandskunde** ist und wer ihn akquiriert hat, da
dies die Provisionshöhe beeinflusst
. Generell sollen Vertriebsprovisionen belegbar und
nachvollziehbar sein – d.h. die _Akquisequelle und der verantwortliche Verkäufer_ je Auftrag müssen

dokumentiert sein
. Schließlich erwartet die Buchhaltung **Auswertungen** (z.B. Umsatz pro
Kunde, offene Posten) – das fällt ins Reporting, basiert aber auf korrekter Kontakt-/
Kundenzuordnung.
**Konzept-Fit:** Die Kontaktverwaltung stellt vollständige **Kundenstammdaten (Account-Daten)**
bereit, die zentral vom Vertrieb angelegt und vom Innendienst validiert werden. Das System wird
Plausibilitätschecks vorsehen (z.B. Pflichtfelder Firmenname, Rechnungsadresse), sodass
Buchhaltung bei Rechnungsstellung aus dem Finanzmodul die Daten nur noch auswählen muss. Da
im Kundenprofil alle Projekte des Kunden verlinkt sind, kann die Buchhaltung bei einer Zahlung auch
direkt sehen, welcher Auftrag betroffen ist und welcher Vertriebsmitarbeiter zuständig war (im
Projekt ist der verantwortliche Verkäufer hinterlegt, was aus der Opportunity kommt). Die
**Provisionserfassung** wird wie folgt unterstützt: Beim Projekt/Auftrag wird im System hinterlegt,
welcher Vertriebler ihn hereingeholt hat und ob es ein Neukunde war
. Aus diesen Angaben
kann das System einen Provisionsbericht generieren. Die Buchhaltung kann diese Daten prüfen und
hat somit eine belastbare Grundlage (z.B. Lead kam von Messe = 10% Provision, o.Ä., je nach Regel).
**Auswertungen** wie Umsatz nach Kunde oder Zahlungsausfälle pro Kunde werden im Dashboard/
Reporting-Modul verfügbar sein – hierfür ist entscheidend, dass **jede Rechnung einem**
**Kundenkonto zugeordnet** ist (was unser System sicherstellt, da Rechnungen entweder aus einem
Projekt -> Kunde entstehen oder manuell einem Kunden zugeordnet werden müssen).
**Gaps & Entscheidungen:** Im alten Prozess war die Kommunikation zwischen Vertrieb und
Buchhaltung oft ad-hoc (“Zuruf, wann Rechnung raus soll”)
. Das neue System verbessert das
(Rechnungs-Termine und -Pläne im Projektmodul), aber das greift die Kontaktverwaltung wenig. Ein
potentielles Gap: **Synchronisation mit der Finanzbuchhaltung (Lexware)** . Der Kontext sieht vor,
Rechnungsdaten mit Lexware zu synchronisieren
. Für Kontakte bedeutet das, dass z.B.
Debitorenkonten dort angelegt werden.

**⚡ Update (2025-11-10) - Phasenstrategie:**

**MVP (Phase 1 - 0-6 Monate):** Manueller Export/Import-Workflow zur Risikominimierung. Lexware bleibt führendes FiBu-System. KOMPASS bietet CSV-Export-Funktion für Kundenstammdaten und Rechnungen. Buchhaltung importiert wöchentlich oder bei Bedarf in Lexware. Zahlungsstatus wird manuell zwischen Systemen abgeglichen. **Vorteil:** Schneller MVP-Start, bewährte Prozesse bleiben, 4-6 Wochen Timeline-Einsparung.

**Phase 2 (Nach MVP-Validierung, ab 3-6 Monate):** Automatische bidirektionale Synchronisation via Lexware REST API (bereits recherchiert und dokumentiert). **Kundenstammdaten** werden automatisch aus CRM nach Lexware übertragen. Rechnungsnummern und Zahlungsstatus kommen automatisch von Lexware zurück. Nächtlicher Batch-Sync (00:00-02:00 Uhr). **Konfliktlösung:** CRM führend für Kundendaten, Lexware führend für Finanztransaktionen. Buchhaltung muss Kunden nicht mehr doppelt pflegen - "keine Doppelarbeit" vollständig erreicht. Ein weiterer Punkt: DSGVO – falls ein Kunde Löschung verlangt, muss Buchhaltung
prüfen, ob offene Posten etc. dem entgegenstehen (Aufbewahrungsfristen). Das System bietet hier
Unterstützung (Status “nicht löschbar, hat Finanzdaten”). _Kein_ relevanter Bedarf der Buchhaltung ist
ein Kundenportal o.ä., was wie erwähnt nicht kommt. Insgesamt sind die Buchhaltungs-Needs
erfüllt, insbesondere durch die Kombination aus sauberem **Datenstamm, Provisionsfeldern und**
**Reporting** .

# Geschäftsführer (Management): Die GF-Persona möchte das große Ganze sehen und strategische

Konzept sieht dedizierte Management-Dashboards vor, etwa mit Sales Funnel Grafiken etc.
.
Die GF kann aber auch direkt ins System schauen, z.B. in ein Kundenprofil, um zu sehen welche
Projekte und Umsätze ein bestimmter Kunde hatte (360°-Profil)
. Damit muss sie nicht mehr
alle Infos aus verschiedenen Quellen zusammensuchen
. Die **Datenqualität** wird durch die
beschriebenen Maßnahmen (Pflichtfelder, Dublettencheck, Verantwortlichkeiten) gewährleistet,
sodass Berichte belastbar sind. Zudem schätzt die GF den **Wegfall von Medienbrüchen** – alle
Abteilungen nutzen ein System, was die Zusammenarbeit verbessert und Transparenz schafft
. Im Kontext der Kontaktverwaltung heißt das: jeder Kunde wird einheitlich betreut, egal wer
(Vertrieb, Innendienst, Planung) gerade mit ihm spricht, alle haben denselben Wissensstand.
**Gaps & Potenziale:** Die GF denkt strategisch: Im Interview kam die Frage, ob zukünftige
Geschäftsmodelle (z.B. Wartungsverträge) geplant sind und wie das System darauf vorbereitet ist
. Dies betrifft zwar eine mögliche _Service-/Ticket-Domäne_ in der Zukunft, aber man kann es als
Potential vermerken: **Sollte das Unternehmen später Service-Leistungen anbieten,** ließe sich die
Kontaktverwaltung erweitern, indem z.B. Tickets oder Servicekontakte ebenfalls dem Kundenprofil
hinzugefügt werden. Aktuell ist das out of scope (Nicht-Ziel), aber das Datenmodell (Kundenkonto
mit Aktivitäten) könnte es bereits aufnehmen. Ein weiteres Anliegen der GF ist Compliance und
Sicherheit – hier konnten wir aufzeigen, dass Audit-Trails, Zugriffskontrolle und DSGVO-Maßnahmen
eingeplant sind
. Kein spezifisches Gap, sondern eher Vertrauen schaffen: die Lösung folgt
Best Practices und gesetzlichen Vorgaben, was die GF als Voraussetzung sieht. Insgesamt erfüllt das
Konzept die GF-Anforderungen, da es die nötige **Transparenz und Steuerungsinformationen**
bereitstellt und gleichzeitig operativ praktikabel ist.

# Marketing/Grafik: (Im Projektkontext wurden Marketing und Grafik teils zusammen betrachtet.)

Hier müssen wir die Kontaktverwaltung befähigen, pro Kontakt ein Feld “Einwilligung für Marketing
vorhanden (Ja/Nein, Datum)” zu speichern. Dies wurde als Muss aufgenommen (gehört zu DSGVO-
Compliance) und deckt den Need ab. Insgesamt dürfte Marketing sehr zufrieden sein mit der neuen
Lösung, da sie endlich alle Kontakte strukturiert vorliegen hat und Auswertungen fahren kann (z.B.
Leads pro Monat, Conversion-Rate
).

# Zusammenfassung Persona-Fit: Alle analysierten Personas finden ihre Kernbedürfnisse in der Kontakt-/

# 4. Fachliche Anforderungen (Liste, Priorisierung,

Aus Interview, Gesamtkonzept und Personas wurde eine vollständige Liste fachlicher Anforderungen der
Kontakt- & Kundenverwaltung abgeleitet. Sie ist **dedupliziert** (Mehrfachnennungen zusammengefasst) und
nach Priorität **Muss (essenziell für MVP)** , **Soll (wichtig, evtl. Iteration)** , **Kann (Nice-to-have)** kategorisiert
. Jede Anforderung wird mit einem kurzen _Abnahmekriterium_ ergänzt, das beschreibt, wann sie
erfüllt ist. Außerdem klären wir _Nicht-Ziele_ (bewusst Ausgegrenztes).

# Muss-Anforderungen (Priorität 1 – essentiell, MVP-Scope)

**Zentrale Kontaktdatenbank für alle Kontaktarten**
: Alle Kundenunternehmen,
Ansprechpartner, Leads, Lieferanten usw. werden in **einem gemeinsamen System** verwaltet.
_Abnahme:_ Ein neuer Kontakt lässt sich anlegen mit mindestens Name und Typ (z.B. “Firma” vs.
“Person”) und ist für berechtigte Nutzer auffindbar. Bestehende Kontaktlisten (Excel/Word) sind
obsolet.
**Kontakt-Stammdatenverwaltung** : Erfassung und Bearbeitung aller relevanten **Stammdatenfelder**
pro Kontakt. Dazu gehören bei Firmen: Name, Adresse, Branche, ggf. Firmengruppe; bei Personen:
Name, Titel, Position, Telefon, E-Mail etc.; bei Leads: zumindest Name und Kontaktmöglichkeit; bei
Lieferanten: zusätzlich angebotene Leistungen/Gewerke. _Abnahme:_ In der Maske für einen Kontakt
sind alle im Konzept vorgesehenen Felder vorhanden und editierbar; Änderungen werden
gespeichert und sind in Versionshistorie sichtbar.
**Ansprechpartner & Firmenhierarchien** : Möglichkeit, **mehrere Personen mit einer Firma zu**
**verknüpfen** (1:n zwischen Account und Kontaktperson)
, sowie **Firmengruppen abzubilden** (n:m
oder Hierarchie “Tochter gehört zu Mutterkonzern”)
. _Abnahme:_ Im Kundenkonto können
Benutzer neue Ansprechpartner hinzufügen; Beziehungen “gehört zu” können gesetzt werden (z.B.
Firma A gehört zu Konzern B wird im UI angezeigt).
**Aktivitäten-Log (360°-Sicht)**
: Alle Aktivitäten zu einem Kontakt werden chronologisch
erfasst: Gesprächsnotizen, Besuche, Telefonate, E-Mails (Betreff/Kurznotiz), Meetings etc. inkl.
Datum und verantwortlicher Person. Auch abgeschlossene **Opportunities, Projekte und Angebote**
des Kunden werden im Profil verlinkt angezeigt
. _Abnahme:_ Öffnet man ein Kundenprofil, sieht

1. 9
2.

3.

# 4.

# 10

---

_Page 11_

---

man eine Liste aller zugehörigen Aktivitäten und Verweise auf Opportunities/Projekte; Test: Ein vom
Vertrieb erstellter Besuchsbericht erscheint unmittelbar im Kunden-Activity-Log.
**Dokumente & Anhänge** : Möglichkeit, **Dateien auf Kontaktebene** zu hinterlegen (z.B.
Vertragsdokumente, Briefe)
. _Abnahme:_ Im Kontaktprofil gibt es einen Bereich “Dokumente”, in
den Dateien hochgeladen werden können; die Datei ist danach für berechtigte Nutzer abrufbar.
(Hinweis: Projekt- und Angebotsdokumente werden bei den jeweiligen Objekten gespeichert, nicht
redundant hier, es sei denn als Kopie notwendig.)
**Dubletten-Prüfung bei Neuanlage**
: Das System prüft automatisch, ob ein neu eingegebener
Kontakt evtl. schon existiert (z.B. gleicher Name, Adresse oder Telefonnummer). Es gibt einen
Warnhinweis und die Möglichkeit, den neuen Eintrag abzubrechen oder trotzdem anzulegen.
_Abnahme:_ Testcase: Benutzer versucht “Firma X GmbH” anzulegen, obwohl “X GmbH” existiert –
System meldet Dublette mit Vorschau auf bestehenden Datensatz.
**Beziehungsmanagement & Netzwerk** : Erfassung von **Relationen zwischen Kontakten** außerhalb
der direkten Firmenhierarchie. Insbesondere: _Mitgliedschaften_ (Firma A ist Mitglied in Verband Y),
_Empfehlungen_ (Kontakt Z hat uns Kontakt X vermittelt), oder generische Verknüpfungen zu Partnern/
Lieferanten (Lieferant Q beliefert Kunde A). Diese Relationen sollen im Kontaktprofil sichtbar sein.
_Abnahme:_ Ein Kontaktprofil “Kunde A” zeigt z.B. “Mitglied im Verband XY” und “Empfohlen durch
Architekt Z” nachdem diese Beziehungen im System erfasst wurden. Mindestens die vordefinierten
Beziehungstypen aus dem Konzept sind verfügbar (Mitglied von, gehört zu, etc.).
**Lead-Management mit Qualifizierung**
: Möglichkeit, **neue Leads** (Interessenten) mit wenigen
Angaben anzulegen, inkl. Attribut “Quelle” (Akquiseweg)
und ersten Notizen. Leads können einen
Status haben (z.B. “neu”, “in Qualifizierung”). _Abnahme:_ Benutzer kann Lead erfassen mit Name und
Quelle; Lead erscheint in einer Lead-Liste.
**Lead-Konvertierung**
: Ein qualifizierter Lead kann **auf Knopfdruck in ein Kundenkonto +**
**Opportunity umgewandelt** werden
. Dabei werden alle erfassten Daten übernommen (kein
Doppelerfassen). _Abnahme:_ Im Lead-Datensatz gibt es die Funktion “Lead umwandeln”; nach
Ausführen entsteht ein neuer Kunde und eine neue Opportunity, die Lead-Daten (Name, Quelle,
Notizen) sind im Kunden/Opportunity-Datensatz sichtbar.

5.

# 6.

7.

8. 32

# 9.

# Kontakt → Opportunity Übergabe : (Übergang zur Vertriebsdomäne) Aus einem bestehenden

10.

**Kontakt** **→** **Projekt Verknüpfung**
: (Übergang zur Projekt-Domäne) Ein Projekt kann einen oder
mehrere Kundenkontakte als Auftraggeber/Beteiligte zugeordnet haben. Abgeleitet: Im
Kontaktprofil sollte ersichtlich sein, welche Projekte mit diesem Kontakt verknüpft sind (Projekt-
Historie)
. _Abnahme:_ Projekt anlegen mit Auswahl eines Kunden aus Kontaktliste ist möglich; im
Kundenprofil erscheint das Projekt unter “Projekte”.

11. 18

# Kontakt → Lieferantennutzung

12. 18
13.

**Reporting-Grundlagen** : (Übergänge zu Reporting-Domäne) Relevante Felder für **CRM-Reports**
werden erfasst, etwa _Erstelldatum des Leads_ , _Konversionsdatum_ , _Neukunde/Jahr_ , etc., sodass KPI wie

14.

“Anzahl neue Leads/Monat, Konversionsquote Lead → Auftrag” berechnet werden können
.
_Abnahme:_ Beispielsweise ein Report “Leads pro Monat” lässt sich mit den Daten erzeugen (Test durch
BI-Team, liegt aber etwas außerhalb Kontaktdomain – Daten müssen eben vorhanden sein).
**Offline-Zugriff auf Kontaktdaten**
: Außendienst-Nutzer können die Kontaktdatenbank offline
(ohne Netz) einsehen und neue Einträge (Notizen, Leads) hinzufügen
. _Abnahme:_ Im Test wird das
WLAN getrennt; der Nutzer kann dennoch einen bestehenden Kunden finden und eine Notiz
hinzufügen. Bei Wiederverbinden wird die Notiz ins zentrale System übernommen. (Konfliktfälle
werden entsprechend Handbuch geregelt.)
**Berechtigungssteuerung für Kontakte**
: Umsetzung eines Rollen- und Rechtekonzepts: z.B.
Finanzdaten (Zahlungsstatus, Umsätze) eines Kunden sieht nur Buchhaltung/GF; Kontakte können
grundsätzlich von allen gelesen werden (offene Datenkultur) aber es muss Einschränkungen geben
können (z.B. ein spezielles Kundenprojekt nur für bestimmtes Team sichtbar, inkl. zugehöriger
Kontakte). _Abnahme:_ Admin kann für Rollen Rechte setzen, z.B. Rolle “Vertrieb” darf Kontakte
anlegen/bearbeiten, Rolle “Leser” nur lesen. Test: Ein Benutzer ohne Rechte versucht einen Kontakt
zu löschen -> fehlgeschlagen + protokolliert
.
**DSGVO-Funktionen**
: Export und Löschung von Kontaktdaten. _Abnahme:_ In der Admin-
Oberfläche o.Ä. gibt es die Funktion “Personendaten exportieren” (liefert maschinenlesbaren Bericht
aller Daten einer Person) und “Löschen” (Kontakt wird gem. DSGVO gelöscht oder anonymisiert,
wenn zulässig). Zudem gibt es Felder für Einwilligungen (z.B. Marketing erlaubt, Ja/Nein mit Datum).
**GoBD-Protokollierung relevante Änderungen** : (Auch domain-übergreifend) Änderungen an
kritischen Feldern wie Kundenname, Adressdaten, Löschvorgänge etc. werden **audit-logging**
betrieben
. _Abnahme:_ Es existiert ein Änderungsprotokoll, wo nachvollziehbar ist, wenn z.B.
ein Kundenname geändert wurde, inkl. Timestamp und Benutzer.

**Multi-Location Customer Management** : Kunden mit mehreren physischen Standorten (z.B.
Franchise, Filialbetriebe, Hauptsitz + Außenlager) können **mehrere Lieferstandorte** verwalten.
Jeder Standort hat eine eigene Lieferadresse, getrennt von der Rechnungsadresse. _Abnahme:_
Ein Kunde kann mehrere Locations (Standorte) haben; im Kundenprofil ist ein Tab "Standorte"
sichtbar mit Liste aller Lieferadressen. Beim Anlegen eines Angebots/Projekts kann der Nutzer
den gewünschten Lieferstandort auswählen. Die Rechnungsadresse bleibt unabhängig davon im
Kundenstamm hinterlegt.

**Delivery Address Separate from Billing** : Das System unterscheidet klar zwischen
**Rechnungsadresse** (eine zentrale Adresse pro Kunde für Abrechnungszwecke) und
**Lieferadressen** (eine oder mehrere Standorte für physische Lieferungen/Montagen).
_Abnahme:_ Im Kundenstamm gibt es ein Pflichtfeld "Rechnungsadresse" und optional mehrere
"Lieferstandorte". Bei Projektanlage muss der Nutzer explizit auswählen, wohin geliefert wird –
Standard ist Rechnungsadresse oder ein vom Kunden festgelegter Hauptstandort.

**Contact Decision-Making Role Assignment** : Ansprechpartner können mit
**Entscheidungsrollen** versehen werden: _Decision Maker_ (finale Entscheidungsbefugnis),
_Key Influencer_ (starker Einfluss), _Recommender_ (gibt Empfehlungen), _Gatekeeper_
(kontrolliert Zugang), _Operational Contact_ (operative Ebene), _Informational_ (nur informiert).
Zusätzlich können **funktionale Rollen** zugewiesen werden (z.B. Geschäftsführer,
Einkaufsleiter, Filialleiter). _Abnahme:_ Beim Bearbeiten eines Kontakts gibt es Felder für
"Entscheidungsrolle" und "Funktionale Rolle(n)". Im Kontaktprofil wird die Rolle prominent
angezeigt (z.B. Badge "Decision Maker"). Beim Filtern von Kontakten kann nach
Entscheidungsrolle gefiltert werden.

**Approval Limit Tracking and Opportunity Warnings** : Kontakte mit Entscheidungsbefugnis
erhalten ein **Genehmigungslimit in EUR** (z.B. "kann Aufträge bis €50.000 genehmigen"). Beim
Erstellen einer Opportunity/eines Angebots zeigt das System eine **Warnung**, wenn der
geschätzte Auftragswert das Genehmigungslimit des zugewiesenen Ansprechpartners
überschreitet. _Abnahme:_ Im Kontaktprofil ist das Feld "Genehmigungslimit (€)" editierbar. Bei
Opportunity-Anlage: Wenn Auftragswert > Limit des Ansprechpartners, erscheint Warnung
"Dieser Auftrag überschreitet das Genehmigungslimit des Ansprechpartners (€50.000).
Zusätzliche Genehmigung erforderlich."

# 15.

# 16.

# 17.

18.

19.

20.

21.

22.

# (Abnahmekriterien werden in der Spezifikationsphase noch detaillierter ausgearbeitet, dienen hier als indikative

### Soll-Anforderungen (Priorität 2 – wichtig, kann in nächsten Iterationen folgen)

**Erweiterte Dublettenbereinigung:** Komfort-Tool zum Zusammenführen bereits bestehender
doppelter Kontakte (Merge-Funktion mit Auswahl, welche Felder zu übernehmen sind). _Abnahme:_
z.B. zwei Datensätze “Muster GmbH” können zusammengeführt werden, danach existiert nur einer
mit kombinierten Infos.
**Automatisierte Kontaktanreicherung:** Integration externer Quellen zur **Datenanreicherung** (z.B.
Firmeninfos via API, Social Media-Links)
. _Abnahme:_ Bei Eingabe eines neuen Unternehmens
schlägt das System basierend auf Name ggf. gefundene Firmendaten (Adresse, Webseite) vor.
**Schnittstelle Finanzbuchhaltung (Lexware) – Kundenstamm** ⚡ **[PHASE 2]**
: Automatische Synchronisation
der Kundenstammdaten mit der FiBu-Software via REST API. _Abnahme:_ Legt man im CRM einen neuen Kunden an,
erscheint dieser innerhalb eines Tages auch in Lexware (via nächtliche API-Synchronisation). Umgekehrt
werden Änderungen aus Lexware zurückgespielt oder zumindest gemeldet.
**MVP-Ansatz (Phase 1):** CSV-Export aus CRM für manuellen Lexware-Import (wöchentlich).
**Phase 2 (automatisiert):** REST API Integration nach MVP-Validierung (ca. 3-6 Monate nach Go-Live).
(In MVP/Muss ist nur CSV-Export enthalten; automatische Synchronisation in Phase 2.)
**Erweiterte Kategorisierung** : Einführung eines vordefinierten **Branchenschlüssel/**
**Kundenkategorisierungssystems** (z.B. NACE-Code oder eigene Klassifizierung für Direktvermarkter,
Größenklassen etc.), um Kontakte noch gezielter zu segmentieren. _Abnahme:_ Nutzer kann aus einer
vorgegebenen Liste die Branche auswählen; Datenmodell erlaubt Mehrfachkategorien (Tags) mit
definierter Liste.

# •

**Netzwerkgrafische Darstellung:** Visualisierung des Beziehungsnetzwerks eines Kunden (Graph-
View). _Abnahme:_ Für einen gegebenen Kunden kann man eine Graph-Ansicht öffnen, die z.B. alle
verbundenen Kontakte (Filialen, Verbände, Vermittler) als Netz zeigt. (Nice UX Feature für später,
nicht kritisch.)
**Mobile App (native):** Zusätzlich zur responsive Web-App ggf. native App mit Offline-Speicher, falls
Performance/UX dadurch verbessert werden kann. _Abnahme:_ Außendienstler haben eine App im
App-Store verfügbar, die die genannten Offline-Funktionen bietet. (Soll, da Web zuerst ausreichend
sein könnte.)
**Mehrsprachigkeit intern:** Falls das Unternehmen Personal in anderssprachigen Regionen
bekommt, Option zur Übersetzung der UI (derzeit nicht nötig
). _Abnahme:_ Umschaltbare
Oberfläche DE/EN. (Nur vorgesehen, falls Unternehmensentwicklung es erfordert.)

# (Soll-Features bringen zusätzlichen Nutzen, sind aber nicht kritisch für den Go-Live. Sie werden nach MVP

_100_

# Kann-/Nice-to-have (Priorität 3 – optional)

**E-Mail-Integration (automatisches Logging):** Möglichkeit, das System mit dem E-Mail-Server zu
verbinden, sodass eingehende/ausgehende E-Mails an einen Kunden automatisch im Aktivitätenlog
auftauchen
. _Abnahme:_ Wenn der Vertrieb z.B. eine Mail an kunde@firma.de sendet, wird diese
im CRM unter Kontakt “Firma” vermerkt. (Komfortfunktion, Datenschutz/Tech sind hier zu prüfen –
daher Nice.)
**Visitenkartenscanner:** Integration eines Tools, um Visitenkarten per Smartphone einzuscannen
und automatisch einen neuen Kontakt zu erstellen (OCR). _Abnahme:_ Foto einer Visitenkarte erzeugt
neuen Kontakt mit ausgefüllten Feldern (Name etc. überprüfbar).
**KI-gestützte Dublettenerkennung:** Fortgeschrittene Mechanismen, die Tippfehler erkennen
(Musterbau GmbH vs Muster Bau-GmbH) und vorschlagen, diese zu mergen.
**Kundenbewertung/Scoring:** Möglichkeit, Kontakte nach Attraktivität/Potential zu bewerten (Punkte
oder A/B/C-Klassifizierung), um Vertriebsfokus zu steuern.
**Portal-Option für Zukunft:** Falls doch einmal ein Kundenportal gewünscht wird (z.B. Kunde kann
Adressänderung selbst eingeben), könnte die Kontaktverwaltung dafür APIs bereitstellen. (Derzeit
ausdrücklich kein Ziel).

### Nicht-Ziele (Expliziter Ausschluss)

**Ersatz der Finanzbuchhaltung als Ganzes:** Das System soll **nicht** die vollumfängliche
Finanzbuchhaltungs-Software ablösen. Es werden zwar Rechnungsdaten synchronisiert
, aber
Buchhaltung bleibt in Lexware bzw. extern. (Kein eigenes FiBu-Modul außer Projektcontrolling.)
**Öffentliches CRM/Marketing-Tool:** Die Lösung ist _intern_ fokussiert – Funktionen wie Massen-E-Mail-
Versand, Marketing-Automation oder ein Kundenwebportal sind **nicht Bestandteil** . Kontaktdaten
können exportiert werden für externe Tools, aber es gibt kein Newsletter-Modul etc.
**Technologieentscheidungen:** Ob Cloud oder On-Premise, welche Datenbank, etc., ist nicht Teil
dieser Vision (steht auch im Gesamtkonzept so
). Wir beschreiben nur fachliche Anforderungen,
keine technischen Implementation-Details.
**Personalverwaltung:** Kontakte im Sinne von internen Mitarbeiterdaten werden hier nicht verwaltet
– das CRM bezieht sich nur auf **externe Kontakte** (Kunden, Partner...). Mitarbeiter und
Zugriffsrechte werden separat gehandhabt.

**Aufgaben- und Terminmanagement** : Zwar gibt es Verknüpfungen (Aufgaben zu Kontakt), aber ein
Kalender/Ticket-System für z.B. Serviceeinsätze ist nicht enthalten. (Sollte in Zukunft Service
kommen, wäre das neue Domäne.)

Diese klare Abgrenzung der Nicht-Ziele stellt sicher, dass wir uns in der Entwicklung auf die tatsächliche
Produktvision konzentrieren und Erwartungsmanagement betreiben.

# 5. Produktvision & Zielbild

**Vision Statement**

**“Eine zentrale Kundenplattform, die alle Abteilungen verbindet und jedem Mitarbeiter in Sekunden**
**den vollen Überblick über unsere Kunden und Kontakte ermöglicht – für nahtlose Vertriebsprozesse**
**und exzellenten Service.”**

Diese Vision fasst zusammen, was die Kontakt- & Kundenverwaltung leisten soll:
**Alle**
**Kundeninformationen an einem Ort, abteilungsübergreifend verfügbar, 360°-Sicht**
. Dadurch
werden Kunden vom ersten Kontakt bis zum Projektabschluss durchgängig betreut
, ohne
Informationsverluste oder Medienbrüche. Die Anwendung soll dabei so einfach und schnell sein, dass sie
von allen gerne genutzt wird – der _Single Source of Truth_ für Kundenbeziehungen
.

# Wertversprechen (Value Proposition)

**Für Vertrieb (Außendienst & Innendienst):** Ihr spart Zeit und erhöht eure Abschlusschancen, weil
**alle Kundenhistorien sofort griffbereit** sind und keine Anfrage mehr verloren geht. Statt E-Mail-
Chaos habt ihr eine **strukturierte Pipeline und Kontaktliste** , könnt unterwegs arbeiten und Leads
schneller in Aufträge umwandeln. Das System erinnert an Follow-ups, ihr behaltet **alle Kontakte im**
**Blick** – was zu mehr Umsatz und weniger Stress führt.
**Für Projekt- und Fachabteilungen:** Ihr profitiert von reibungslosen **Übergaben** : Alle
Kundenanforderungen und -absprachen liegen dokumentiert im System, keine Info geht zwischen
Vertrieb und Planung verloren. Ihr könnt eigenständig Kunden kontaktieren (Ansprechpartnerdaten
zentral verfügbar) und müsst nicht in zig Ordnern suchen. Insgesamt arbeitet ihr **effizienter und**
**transparenter** mit Vertrieb zusammen, was die Projektdurchführung beschleunigt.
**Für Buchhaltung & Management:** Ihr erhaltet **zuverlässige Daten** auf Knopfdruck.
Rechnungsinformationen greifen auf korrekte Kundenstammdaten zurück – weniger Fehler,
schnellere Abrechnung. Die **Provisionsabrechnung** wird nachvollziehbar durch erfasste
Akquisequellen
. Management sieht **Echtzeit-Reports** über Leads, Umsätze, Top-Kunden etc. und
kann fundierte Entscheidungen treffen
. Durch die lückenlose Dokumentation entstehen Audit-
Trails und Compliance-Sicherheit (GDPR, GoBD) aus dem System heraus, was Vertrauen schafft.
**Für die Kunden (indirekter Nutzen):** Sie erleben uns als **organisiertes, gut informiertes**
**Unternehmen** . Egal mit wem der Kunde spricht – jeder ist im Bilde über Vorgeschichte und aktuelle
Themen. Anfragen werden **zeitnah und konsistent** verfolgt (kein “Hat Ihnen Kollege X das nicht
gesagt?”). Das stärkt die Kundenbindung und Zufriedenheit, da wir professionell auftreten.

Zusammengefasst verspricht die Produktvision: **Erhöhte Effizienz intern, bessere Kundenbeziehungen**
**extern.** Wir arbeiten mit _einem_ System statt fünf Insellösungen, was die Zusammenarbeit verbessert und
letztlich mehr Erfolg im Vertrieb und in der Projektausführung ermöglicht
.

# 14

| 4   | .   |
| --- | --- |
| ut  | 2   |

### Zielarchitektur (fachlich) und -prozesse

Fachlich gliedert sich die Lösung in Module entlang der Domänen – für diese Vision besonders relevant:
**Kontaktverwaltung, Vertriebsmanagement, Projektmanagement, Lieferanten, Finance, Reporting.**

Die **Kontaktverwaltung bildet das Fundament** : Vertriebsprozesse starten hier (Lead->Opportunity) und
münden in Projekte; alle anderen Module referenzieren Kontakte statt eigene Stammdaten zu führen
.

# Ziel-Prozess “Vom Erstkontakt zum Auftrag”: Ein Beispiel-Zielbild:

# Ziel-Prozess “Kundenbetreuung & Folgegeschäft”: Durch die zentrale Sicht entgeht uns kein Potential:

**Fachliche Zielarchitektur:** Die Datenobjekte sind so gestaltet, dass **Redundanz vermieden** wird: Ein
_Kundenkonto_ wird einmal angelegt und dann in allen relevanten Modulen referenziert (Opportunity hat Feld
Kunde; Projekt hat Feld Kunde; Rechnung hat Feld Kunde etc.). Änderungen am Kunden (Adressupdate)
sind somit überall wirksam – Single Source of Truth. Über **Relationstabellen** werden n:m-Beziehungen
(Kontakt <-> Verband, Kunde <-> Lieferant im Projekt etc.) abgebildet. Das fachliche Datenmodell orientiert
sich an gängigen CRM-Strukturen (Account, Contact, Lead, Opportunity… siehe Domänenbeschreibung) und
wurde um branchenspezifische Entitäten erweitert (z.B. Verband).

**Prozesse auf Fachebene:** Es werden **Standard-Workflows** im System hinterlegt, z.B.:

- _Lead-Handhabung:_ neu eingehende Leads werden auf einem Dashboard angezeigt. Vertriebsinnendienst
  checkt wöchentlich die Liste, qualifiziert oder lehnt Leads (Status setzen). Konvertierte Leads verschwinden
  aus der Liste (werden zu Kunden).
- _Opportunity-Pipeline:_ Vertriebsmeetings nutzen den Pipeline-Report aus dem System, man aktualisiert
  Phasen/Abschlusswahrscheinlichkeiten direkt dort, statt in Excel.
- _Kundenkommunikation:_ Jeder Kundenkontakt (Anruf, Meeting) wird möglichst direkt nach Gespräch als

Aktivität erfasst. Im Best Practice sollen ADM evtl. direkt ins Handy diktieren können – aber notfalls tut es
ein kurzer manueller Eintrag.

- _Auftrag_ _→_ _Rechnung:_ Sobald ein Projekt beauftragt ist, legt das System automatisch die vorgesehenen
  Rechnungsstellungen als Aufgaben für Buchhaltung an (z.B. “16 Wochen vor Montage Abschlag 1”)
  . Die
  Buchhaltung nutzt die Kundendaten (Rechnungsempfänger-Adresse) aus dem Kontaktmodul beim Erstellen
  der Rechnung.
  - _Datenpflege-Prozess:_ Alle 6 Monate wird automatisch eine Aufgabe “Kundendaten überprüfen” generiert für
    wichtige Kunden (Umsatz > xy), damit Vertrieb die Aktualität der Daten checkt (Telefonnummern noch gültig
    etc.). Dies folgt der Empfehlung, CRM-Daten aktiv zu pflegen
    .

# Die Vision sieht also keine radikale Änderung der fachlichen Abläufe , sondern eine Digitalisierung und

# 6. Lösungsweg (fachliches Design, Alternativen, Trade-offs)

Auf Basis der Anforderungen wurde ein fachliches Lösungsdesign für die Kontaktverwaltung erstellt.

**Kern des Designs** ist ein **zentrales Datenmodell** mit den Entitäten: _Kundenkonto (Account)_ , _Kontaktperson_ ,
_Lead_ , _Lieferant/Partner_ , _Verband_ , _Aktivität_ , _Dokument_ . Diese sind durch Relationen verknüpft (siehe Abschnitt
Domänenbeschreibung und Beziehungen). Die **Regeln** : Jeder Kontakt kann einen Typ haben (z.B. Kunde,
Lead, Lieferant), Personen sind immer mit einer Organisation verknüpft (außer evtl. Lead-Personen), jede
Aktivität muss mindestens einen Kontaktbezug haben etc. Das System erzwingt bestimmte Pflichtfelder
(Name, bei Person zugehörige Firma oder “Einzelperson” markieren).

**Visual Design (UX) Überlegungen:** Die UI wird in Module gegliedert: z.B. **"Kontakte"** als eigenes Modul
mit Liste und Filter, neben "Opportunities", "Projekte" etc.
. Im Kontaktmodul hat man Tabs oder
Bereiche für _Alle Kontakte_ , _Leads_ , _Lieferanten_ usw. – oder man nutzt Filter innerhalb einer Liste. Beim Klick
auf einen Kontakt öffnet sich die Detailansicht mit Stammdaten oben, Aktivitäten-Timeline rechts,
verknüpfte Elemente (Projekte, Opportunities) unten, etc. Jede Rolle kann sich Dashboards oder Listen
konfigurieren (z.B. Marketing öffnet direkt "Leads offen"). Wichtig ist **Konsistenz** : Die Terminologie im
System folgt den bekannten Begriffen aus dem Unternehmen (z.B. "Kalkulator" statt generischem
"Innendienstler", etc., gemäß Personasprache).

### UI/UX für Multi-Location und Decision-Making (NEU)

**Customer Detail View - Tab-Struktur:**

Die Kundendetailansicht erhält eine **3-Tab-Struktur** für bessere Übersichtlichkeit:

1. **Tab "Stammdaten"** : Zeigt Firmendaten, Rechnungsadresse (Billing Address), Kontaktinformationen,
   Kategorisierung. Dies ist die Hauptansicht mit den klassischen Kundenstammdaten. Die
   Rechnungsadresse wird prominent dargestellt als zentrale Abrechnungsadresse.

2. **Tab "Standorte"** : Liste aller Lieferstandorte (Locations) des Kunden. Jeder Standort wird als Card
   angezeigt mit:
   - Standortname (z.B. "Filiale München", "Hauptlager")
   - Standorttyp-Badge (Headquarter, Branch, Warehouse, Project Site)
   - Lieferadresse
   - Status-Indikator (aktiv/inaktiv)
   - Zugewiesene Kontaktpersonen
   - "Edit" und "Delete" Buttons

   Ein Button "Standort hinzufügen" ermöglicht das Anlegen neuer Lieferstandorte. Wenn der Kunde
   nur die Rechnungsadresse hat (kein separater Standort), zeigt der Tab eine Info "Keine separaten
   Lieferstandorte definiert – Lieferung erfolgt an Rechnungsadresse".

3. **Tab "Kontakte"** : Liste aller Ansprechpartner mit **hervorgehobenen Entscheidungsrollen**. Jede
   Kontaktperson wird mit folgenden Informationen dargestellt:
   - Name, Position, Kontaktdaten
   - **Entscheidungsrollen-Badge** (farbcodiert):
     - Decision Maker (dunkelgrün)
     - Key Influencer (hellgrün)
     - Recommender (blau)
     - Gatekeeper (orange)
     - Operational Contact (grau)
   - Genehmigungslimit (falls vorhanden): "Genehmigt bis €50.000"
   - Funktionale Rollen als kleine Icons/Tags (CEO, Purchasing, Facility Manager, etc.)
   - Zugeordnete Standorte (falls der Kontakt bestimmten Locations zugewiesen ist)

**Location Management:**

- **Formular "Standort anlegen/bearbeiten":**
  - Standortname (Pflichtfeld, eindeutig pro Kunde)
  - Standorttyp (Dropdown: Headquarter, Branch, Warehouse, Project Site, Other)
  - Lieferadresse (vollständig: Straße, PLZ, Stadt, Land; getrennt von Rechnungsadresse)
  - Aktiv/Inaktiv Toggle
  - Primäre Kontaktperson (Dropdown aus Kundenkontakten)
  - Zugewiesene Kontaktpersonen (Multi-Select)
  - Lieferhinweise (Textarea für spezielle Anweisungen)
  - Öffnungszeiten, Parkanweisungen (optional)
- **Standard-Lieferstandort markieren:** Kunde kann einen Standort als "Standard" festlegen – dieser wird
  bei neuen Angeboten/Projekten vorausgewählt.

**Contact Management - Decision-Making Roles:**

- **Visuelle Badges/Icons für Entscheidungsrollen:**
  - Entscheidungsrollen werden als farbige Badges prominent dargestellt
  - Icons verdeutlichen die Rolle (z.B. Krone für Decision Maker, Schlüssel für Gatekeeper)
  - In Kontaktlisten wird die Rolle immer sichtbar, um schnell Entscheidungsträger zu identifizieren

- **Filter nach Authority Level:**
  - In der Kontaktübersicht kann nach "Nur Entscheidungsträger" gefiltert werden (Decision Maker +
    Key Influencer)
  - Filter nach funktionaler Rolle (z.B. "Zeige nur Einkaufsleiter")
  - Filter nach Genehmigungslimit (z.B. "Kann mind. €50.000 genehmigen")

- **Bearbeitungsdialog für Decision-Making:**
  - Nur ADM+ Nutzer (PLAN, GF) sehen die Felder zur Bearbeitung der Entscheidungsrolle
  - ADM Nutzer sehen die Rollen read-only mit Hinweis "Nur Planung/GF kann Entscheidungsrollen
    ändern"
  - Formular enthält:
    - Entscheidungsrolle (Dropdown)
    - Authority Level (Dropdown: Low, Medium, High, Final Authority)
    - "Kann Aufträge genehmigen" (Checkbox)
    - Genehmigungslimit in € (Zahlenfeld, Pflicht wenn Checkbox aktiviert)
    - Funktionale Rollen (Multi-Select)
    - Einflussbereiche/Departments (Multi-Select: Einkauf, Operations, Finanzen, etc.)

**Opportunity/Quote Workflow - Location Selection:**

- **Beim Anlegen eines Angebots/einer Opportunity:**
  - Nach Auswahl des Kunden erscheint ein Dropdown "Lieferstandort"
  - Dropdown zeigt alle aktiven Standorte des Kunden:
    - Option 1: "Rechnungsadresse" (Standard)
    - Option 2-n: Alle definierten Locations (z.B. "Filiale München", "Lager Nürnberg")
  - Bei Auswahl eines Standorts wird die Lieferadresse als Vorschau angezeigt
  - System filtert automatisch Kontaktpersonen nach zugewiesenem Standort (falls Location-spezifische
    Kontakte existieren)

- **Approval Limit Warning:**
  - Bei Eingabe des geschätzten Auftragswerts prüft das System das Genehmigungslimit des
    ausgewählten Ansprechpartners
  - **Warnung (gelb)** erscheint oberhalb des Formulars:
    - "⚠️ Achtung: Dieser Auftragswert (€75.000) überschreitet das Genehmigungslimit des
      Ansprechpartners Thomas Schmidt (€50.000). Zusätzliche Genehmigung durch
      Entscheidungsträger erforderlich."
    - System schlägt alternative Kontakte mit höherem Limit vor (falls vorhanden)
  - Warnung blockiert NICHT das Erstellen der Opportunity (nur Hinweis)
  - Im Opportunity-Datensatz wird ein Flag "Requires Higher Approval" gesetzt, sichtbar in Listen

**Mobile-First Considerations:**

- Standort-Cards sind touch-optimiert (min. 44px Höhe)
- Entscheidungsrollen-Badges sind auch auf kleinen Bildschirmen gut lesbar
- Standortauswahl im Opportunity-Workflow als großes Touch-Target
- Adresseingabe mit Autofill-Unterstützung für mobile Geräte

# Integrationen: Fachlich haben wir entschieden, einige Integrationen vorzusehen:

Standard-Connector) ist noch zu klären – wir präferieren initial den manuellen Abgleich (Export), was
simpler ist.

**Datenmigration (Initiale Überführung):** Als Teil des Lösungswegs planen wir, die **bestehenden Kontaktlisten** (Excel, Word,
Outlook-Kontakte) einmalig ins System zu importieren. Dazu ist ein Bereinigungs-Lauf vorgesehen: wir
extrahieren alle vorhandenen Kontakte aus Altdateien, führen Dublettenchecks durch und importieren sie
als Startbestand. Dieser Schritt ist kritisch für Akzeptanz – wenn Nutzer ihre Daten nicht wiederfinden, sinkt
Vertrauen. Wir definieren daher Migrations-Abnahmekriterien (z.B. "100% der in Word-Leadliste
vorhandenen 120 Kontakte sind im neuen System, validiert durch Vertrieb").

**Datenimport/Export (Laufender Betrieb):** Neben der initialen Migration ist Import/Export eine **laufende Funktion** für den täglichen Betrieb:

- **Kundenimport:** PLAN/ADM/GF können jederzeit Kunden aus Excel/CSV-Dateien importieren. Das System unterstützt automatische und manuelle Feldzuordnung, Validierung, Duplikatsprüfung und Fehlerbehandlung. Dies ist nützlich für: Bulk-Kundenimporte (z.B. aus Marketing-Kampagnen), Datenaktualisierungen von externen Quellen, Migration zusätzlicher Datenbestände nach der initialen Migration.
- **Kontaktprotokoll-Import:** PLAN/ADM/GF können Word-Dokumente mit tabellarischen Kontaktprotokollen importieren. Das System extrahiert automatisch Tabellen, parst verschiedene Datumsformate (mit Fallback auf manuelle Eingabe), ordnet Protokolle Kunden zu und validiert die Daten. Dies ist nützlich für: Import historischer Protokolle aus Word-Dokumenten, regelmäßige Protokoll-Importe von externen Quellen, Migration zusätzlicher Protokoll-Datenbestände.
- **Datenexport:** PLAN/ADM/GF/BUCH können jederzeit Daten exportieren (CSV/Excel/JSON/DATEV für Kunden, CSV/Excel/Word/JSON für Protokolle). Exporte unterstützen Feldauswahl, Datumsbereichs-Filterung, Kunden-Filterung und RBAC-basierte Berechtigungen. Dies ist nützlich für: Backups, DSGVO-Exporte, DATEV-Integration (Lexware), Datenanalyse in externen Tools, Audit-Trails.
- **Vollständige Spezifikation:** Siehe [Import/Export Specification](../../specifications/IMPORT_EXPORT_SPECIFICATION.md) für vollständige Details zu Import/Export-Endpoints, Business Rules, Date Parsing, Field Mapping und Performance-Überlegungen.

**Trade-offs & Alternativen innerhalb des Kontexts:**

- _Make vs Buy:_ Ein erwähnter Punkt war der Marktvergleich mit bestehenden CRM+PM-Tools
  . Trotz
  brauchbarer Standardlösungen (Insightly, etc.) hat man sich bewusst für **Eigenentwicklung** entschieden
  (bzw. stark angepasste eigene Lösung)
  , da diese die Vision am besten abbildet (insb. Offline und
  spezifische Anforderungen etwa an Kalkulation). Die Konsequenz: Wir designen vollständig fachlich frei,
  müssen aber Entwicklungsaufwand bedenken. Der Trade-off Standard vs. Custom wurde abgewogen:
  vTiger fehlte z.B. moderne UI/offline, Monday kein tiefes CRM
  – daher eigener Weg.
- _Beziehungsmanagement:_ Eine Alternative war, das Thema Verbände/Multiplikatoren zunächst wegzulassen
  (Scope Cut). Wir haben uns **dagegen entschieden** , weil gerade im Ladenbau-Netzwerk diese Beziehungen
  verkaufsfördernd sind
  . Trade-off: minimal erhöhter Modellierungsaufwand (n:m Beziehungen), aber
  hoher Nutzen – also behalten wir es im Scope.
- _Dubletten-Handling:_ Hier gab es Alternativen beim Merge: vollautomatisch (System entscheidet) vs.
  manuell. Wir priorisieren
  **Warnung + manueller Merge** , um Fehler (falsches Verschmelzen
  unterschiedlicher Kunden) zu vermeiden. Das ist simpler umzusetzen und datensicherer.
- _Datenfelder Umfang:_ Best Practice sagt “so viel wie nötig, so wenig wie möglich”. Wir haben uns
  entschieden, **Branchen, Region, Kundentyp** als Kategorien aufzunehmen, da sie für Marketing/Vertrieb
  relevant sind (Segmentierung, Berichte)
  . Andere mögliche Felder (z.B. Umsatzklasse des Kunden,
  Kreditrating) wurden als zu detailreich verworfen, da nicht im Kontext genannt. Trade-off hier zwischen
  Datenqualität vs. Datentiefe: Wir beschränken uns auf wirklich genutzte Felder, damit Pflegeaufwand gering
  bleibt.
- _Offline-Umsetzung:_ Alternative Ansätze waren diskutiert: Komplett offline-fähige App mit lokalem DB-Cache
  vs. schrittweise Synchronisation nur bestimmter Daten. Wir haben als **Lösung** : Kontakte, Aufgaben,
  Opportunities werden für Offline bereitgestellt (gecacht), große Datenmengen wie Dokumente eher nicht.
  Trade-off: Der Außendienst hat Kerninfos offline (wichtig), aber z.B. keine 100MB PDFs. Das halten wir für
  pragmatisch. Sollte mehr Offline nötig sein, kann man ausbauen (Soll-Funktion).

# Nachvollziehbarkeit von Entscheidungen: Alle obigen Entscheidungen leiten sich stringent aus dem

**Entscheidungsgrundlagen:** sind transparent im Dokument erläutert (siehe Domänen-Challenge und diese
Sektion). Wir haben jeweils begründet, warum ein Feature enthalten ist oder nicht. Für die weitere

Umsetzung werden diese Entscheidungen noch mit Stakeholdern validiert, aber auf Basis des Kontexts sind
sie so stimmig und konsistent. Wichtig war auch die Priorisierung: MVP fokussiert Muss-Kriterien
–
wir haben in diesem Lösungsweg betont, welche Features sofort nötig sind (z.B. 360°-Profil,
Dublettencheck) und was warten kann (soziale Netz-Integration, etc.), was auch ein Teil der Strategie ist, um
**schnell Nutzen zu generieren** ohne auf Perfektion zu warten
.

# 7. Schnittstellen (Domänen, Prozesse, Verantwortungen)

Die Kontakt- & Kundenverwaltung steht im Zentrum mehrerer Schnittstellen, da sie Querschnittsdaten
liefert. Hier klare Definition der **Übergaben, Verantwortlichkeiten und Abhängigkeiten** zu anderen
Domänen und externen Systemen:

**Vertrieb / Opportunity-Management:** _Übergabe:_ Leads und Kontakte werden vom Kontaktmodul

an das Vertriebsmodul übergeben, wenn eine Verkaufschance angelegt wird. Das Vertriebsteam ist
verantwortlich, einen Lead zu qualifizieren (Status ändern) und als Opportunity weiterzuführen
.
_Verantwortung:_ Außendienst/Vertriebsinnendienst pflegen die Felder, die für Opportunities relevant
sind (z.B. Abschlusswahrscheinlichkeit), während die Kontaktdaten an sich weiterhin zentral
verwaltet bleiben (d.h. Änderungen an Adresse passieren in Kontaktmodul, nicht in Opportunity).
_Abhängigkeit:_ Die Opportunity-Pipeline hängt von aktuellen Kontaktdaten ab; umgekehrt hat
Kontaktverwaltung keine fachliche Abhängigkeit, außer dass ein Lead-Konvertierungsprozess
existiert. Wir definieren, dass ohne vorhandenen Kontakt keine Opportunity erstellt werden kann –
es muss immer ein Kunde/Lead aus dem Kontaktmodul ausgewählt werden (Vermeidung von
“losen” Opportunities).

# Projektmanagement: Übergabe: Sobald ein Deal gewonnen ist, wird ein Projekt erstellt, wobei das

Kundenprofil und die Opportunity-Daten übernommen werden. **NEU: Location-Integration:** Bei
Projektanlage kann nun explizit ein **Lieferstandort** ausgewählt werden. Für Multi-Location-Kunden
(z.B. Franchise mit mehreren Filialen) wird der Projektlieferort aus der Location-Entity des Kunden
gezogen. Im Projekt wird der gewählte Lieferstandort referenziert (Location-ID), sodass die
Planungsabteilung weiß, wohin die Montage erfolgen soll. Die Lieferadresse aus der Location wird
für Logistik und Montageplanung verwendet. _Verantwortung:_ Projektmanager (PLAN) können den
Lieferstandort bei Bedarf ändern oder einen projektspezifischen Ort anlegen (z.B. temporäre Baustelle).
_Abhängigkeit:_ Projekt benötigt gültige Location-Referenz oder fällt auf Rechnungsadresse des Kunden
zurück, wenn kein spezifischer Standort gewählt wurde.

# Lieferantenmanagement: Übergabe: Lieferanten und Partner werden im Kontaktmodul verwaltet,

# 18

**Finance (Rechnungsstellung & Controlling):** Hier gibt es zwei Aspekte: **internes Finanzmodul**
(Projektcontrolling, Rechnungsplan) und **externe FiBu-Software (Lexware)** . _Übergabe intern:_ Die
Rechnungslegung im System zieht die **Rechnungsadresse vom Kundenkontakt** . Ebenso fließen
Kundendaten ins Projektcontrolling (Umsatz je Kunde, etc.). _Verantwortung:_ Buchhaltung muss vor
Rechnungsversand prüfen, ob Kundendaten vollständig sind (z.B. Rechnungsanschrift =
Angebotsempfänger = im System vorhanden). Das CRM wird Tools bieten, aber Verantwortung bleibt
menschlich. _Übergabe extern:_ Wir richten eine Schnittstelle ein, sodass **Kundenstammdaten und**
**Rechnungsdaten regelmäßig an Lexware übertragen**
werden
. Verantwortlich ist
Buchhaltung, diesen Abgleich (z.B. monatlich) zu initiieren. _Abhängigkeit:_ Das CRM vergibt
Rechnungsnummern nur, wenn es mit Lexware abgestimmt ist (entweder Lexware vergibt sie und
CRM holt sie, oder CRM sendet an Lexware – je nach Implementationsentscheidung). Wir definieren
für MVP: Rechnungen werden zwar im CRM erstellt, aber noch ohne Nummer, Buchhaltung trägt
nach Fakturierung in Lexware die Nummer ins CRM ein. (Ein Muss-Szenario war Nummernkreis-Sync
– falls wir das doch vollautomatisch schaffen, umso besser.) Wichtig: **GoBD** – es darf kein
Nummern-Duplikat geben, daher strenge Koordination. _Eskalation:_ Sollte Sync fehlschlagen (z.B.
Kunde nicht in Lexware vorhanden), hat Buchhaltung die Aufgabe, dies zu erkennen (durch
Prüfbericht) und manuell nachzupflegen.

# Reporting & Analytics: Übergabe: Das Reporting-Modul greift auf die Kontakt- und vorgelagerte

# Benutzerverwaltung/Rechte: Eher technische Domäne, aber Schnittstelle: Das Rollenkonzept

# Nachbar-Domänen Kommunikation: Wir stellen sicher, dass für jeden bereichsübergreifenden Ablauf klar

# Verantwortlichkeiten im Betrieb:

- _IT/Admin:_ verwaltet Rechte, Backups, sorgt für DSGVO-konforme Löschkonzepte, etc., aber inhaltlich wenig
  Eingriff.
  Diese Aufteilung verhindert Zuständigkeitslücken: Jeder Kontakt hat “seinen Besitzer” im Vertriebsteam,
  und für die Gesamtqualität gibt es eine Stelle (Marketing/CRM) die drüberschaut.

# 8. Qualität, Risiken und Annahmen

In der Vision sind mehrere **Qualitätsmerkmale** explizit angesprochen, allen voran **Usability, Mobilität,**
**Sicherheit und Datenschutz** . Wir fassen diese sowie identifizierte **Risiken mit Gegenmaßnahmen** ,
getroffene **Annahmen** und bereits entschiedene Punkte zusammen:

### Qualitätsmerkmale (nach Projektkontext)

**Benutzerfreundlichkeit (Usability):** Schlüssel zum Erfolg, da Akzeptanz davon abhängt
.
Das System hat eine **intuitive UI** , angepasst an Nutzergruppen – z.B. vereinfachte mobile
Oberfläche für den Außendienst
. **Kurze Ladezeiten** sind Pflicht, auch bei größeren
Datenmengen (genannt: 1000+ Kunden, 100+ Projekte)
. Features wie **Schnellsuche, Filter,**
**Drag&Drop, Inline-Editierung** sind vorgesehen, um den Arbeitsaufwand gering zu halten
.
Außerdem klare Struktur nach Domänen (Kunden, Projekte, etc.)
. _Maßnahme:_ Ein UX-Designer
wird früh eingebunden; Prototyp-Tests mit Nutzern der verschiedenen Persona-Gruppen (z.B. einem
Außendienstler, einem Innendienstler) stellen sicher, dass Navigation und Funktionen verständlich
sind.
**Mobilität & Offline-Fähigkeit:** Das System muss **uneingeschränkt mobil nutzbar** sein –
Smartphone/Tablet-Unterstützung und insbesondere Offline-Modus für Außendienst sind Muss-
Kriterien
. Qualität hier: nahtlose Synchronisation (100 Änderungen in ≤30s, P95), keine Datenverluste, schnelle Offline-
Suche (≤1s lokal via Lunr.js). _Maßnahme:_ PouchDB/IndexedDB als lokale Datenbank; **Speicher-Limits beachtet** (iOS 50MB Design-Constraint, ADM=31MB passt ✅, siehe NFR*SPECIFICATION.md §4.1); 10 definierte Offline-Testszenarien (siehe NFR_SPECIFICATION.md §9: 7-Tage-Offline, Konflikte, Storage-Limit, Sync-Fehler, etc.).
**Leistung & Skalierung:** Nutzerzahl: 20 gleichzeitige (bis zu ~50 gesamt); Datenvolumen moderat (1.000-5.000 Kontakte über Jahre)
. Quantifizierte **Performanz-Ziele (NFR_SPECIFICATION.md):** API-Antworten P50 ≤400ms / P95 ≤1,5s; Suchen P95 ≤500ms; Listen-Laden ≤2s; alle Ziele validiert via Lasttest mit realistischem Volumen (5.000 Dokumente, 20 gleichzeitige Nutzer). **Skalierung:** Vertikal bis 50 Nutzer (CPU/RAM erhöhen), horizontal (Clustering) erst bei >50 Nutzern nötig. Design modular, so dass
bei Wachstum (siehe 5-Jahres-Kapazitätsplan NFR_SPECIFICATION.md §2.2) keine Neuarchitektur nötig ist.
\_Annahme:* Globalisierung ist vorerst kein Thema (primär deutschsprachig)
, sodass wir uns auf
diese Nutzerbasis konzentrieren können. Sollte das Unternehmen stark wachsen, ist evtl.
Optimierung (Indexierung etc.) einzuplanen – aber kein unmittelbares Risiko.
**Sicherheit (IT-Security):** Das System enthält vertrauliche Geschäfts- und personenbezogene Daten,
deshalb hohe Sicherheitsstandards. **Zugriff nur für authentifizierte Mitarbeiter** (Login mit MFA
optional). **Rechteverwaltung** granular (siehe Anforderungen) damit z.B. Vertriebler A nicht die
Provision von B sieht etc. Alle **Zugriffe auf sensible Daten protokollieren** (Audit-Trail)
.
_Maßnahme:_ Implementierung OWASP-geprüft, regelmäßige Berechtigungsaudits. Zudem physische
Sicherheit (bei Cloud): wir gehen von einer Cloud-Lösung aus, d.h. Rechenzentrum mit Zertifizierung
etc. (Annahme aus Kontext
).
**Datenschutz (DSGVO):** Vollständige **DSGVO-Konformität** : Datenminimierung (wir erheben nur
erforderliche Daten, keine unnötigen Personaldetails)
, Zweckbindung (Nutzung der Daten
nur für CRM-Zwecke), Nachweis von Einwilligungen (Marketing-Opt-in wird im Kontakt gespeichert)
, **Auskunftsrecht und Löschung** umgesetzt
. Außerdem werden externe Kontakte als solche
gekennzeichnet (z.B. kein Zugriff für unberechtigte). Keine Veröffentlichung der Daten nach außen

- 122

# 20

---

_Page 21_

---

(kein Portal, kein ungesicherter Export). _Maßnahme:_ Zusammenarbeit mit Datenschutzbeauftragtem
bei Design der Funktionen Export/Löschung; Schulung der Nutzer, was zulässig ist (z.B. keine
Privatdaten ohne Grund erfassen).
**Compliance (GoBD):** Gerade für die Buchhaltung relevant: revisionssichere Archivierung von
relevantem Schriftverkehr (Angebote, Rechnungen) für 10 Jahre
. Die Kontaktverwaltung beteiligt
sich daran insoweit, als Kundendatenänderungen protokolliert werden (damit nachvollziehbar bleibt,
z.B. wenn Adresse geändert wurde nach Angebotserstellung)
. Außerdem verhindern wir
unzulässige Änderungen: z.B. wenn ein Kontakt mit einer Rechnung verknüpft ist, kann man ihn
nicht einfach komplett löschen (erst nach Archivierung/Storno). _Maßnahme:_ Archivmodus für
abgeschlossene Vorgänge, und enge Abstimmung mit Finance bei solchen Löschanforderungen.
**Barrierefreiheit & Zugänglichkeit:** Nicht explizit gefordert (keine öffentliche Anwendung)
, aber
wir achten auf **grundlegende Zugänglichkeit** : Bedienung mit Tastatur, saubere Kontraste,
Schriftgrößen anpassbar. Das kommt allen Nutzern zugute (z.B. älteren Mitarbeitern).
**Qualität der Daten (Data Quality):** Neben Dublettenprävention sind Mechanismen geplant, um
Daten aktuell zu halten (z.B. “Kunde seit 3 Jahren inaktiv” Markierung). _Maßnahme:_ Erinnerungen
(Wiedervorlagen) an Vertrieb, wichtige Kontakte zu überprüfen
. Auch ein Bericht “Kontakte ohne
Aktivität >1 Jahr” kann erstellt werden, damit Vertrieb reagiert (entweder reaktivieren oder
archivieren). Dies stellt sicher, dass die 360°-Sicht tatsächlich verlässlich ist.

# •

# Risiken & Mitigations

Bereits in Domänen-Challenge wurden viele Risiken erwähnt. Hier noch einmal **wichtigste Projektrisiken**
und wie wir ihnen begegnen:

**Akzeptanzrisiko:** Nutzer nutzen das System nicht voll, führen Parallel-Listen weiter (insb. Vertrieb).
_Ursachen:_ Gewohnheit, Anfangsaufwand, evtl. Performanceprobleme. _Mitigation:_ Intensive
**Einbindung der Key-User** während Entwicklung (Feedback schleifen), **Schulungen** zum Go-Live, und
vor allem eine **spürbar bessere Usability** als die alte Methode. Gerade Außendienst muss Vorteile
sehen: z.B. einfachere Eingabe als E-Mail/Excel – hierfür eventuell Gamification: Dashboard zeigt
“Ihre Leads diesen Monat” etc., sodass persönlicher Nutzen sichtbar ist. Außerdem **Management**
**Support:** die Geschäftsführung sollte Erwartung setzen, dass das CRM die führende Lösung ist
(“wenn’s nicht im System steht, zählt es nicht”). Dieser Kulturwandel wird durch Erfolge untermauert
– wir tracken z.B. Zeitersparnis Geschichten.
**Datenmigrationsrisiko:** Wie bekomme ich alle bestehenden Kontakte korrekt ins System?
_Mitigation:_ Vor Projektstart definieren wir eine Migrationsstrategie. Wahrscheinlich: Export aus
Outlook, Excel, Word durch Skripte, Bereinigung, Import. _Risikoaspekt:_ mögliche **Datenverluste oder**
**falsche Zusammenführungen** . Daher testweise Migration mit kleinem Satz, Validierung mit
Mitarbeitern (“Stimmt diese Kundenliste?”). Auch nach Livegang evtl. eine Phase, wo Altdaten noch
nachgepflegt werden müssen – dafür Ressourcen einplanen (Marketing z.B. tippt fehlende ein).
**Funktionaler Umfang/Komplexität:** Es besteht die Gefahr, zu viel auf einmal umzusetzen (Scope
Creep). Die Vision deckt viele Module ab. Für die Kontaktverwaltung haben wir aber klar eingegrenzt,
was im MVP sein muss und was warten kann. _Mitigation:_ **Priorisierung strikt einhalten** – Muss-
Kriterien zuerst fertigstellen
. Features wie E-Mail-Integration verschieben, falls Kernfunktionen
länger dauern. Ein MVP-Fokus wird auch im Konzept empfohlen
– dem folgen wir. Falls während
Entwicklung neue Wünsche aufkommen, werden sie als Change Request nach MVP behandelt.
**Offline/Sync technisches Risiko:** Die Offline-Funktion haben wir als kritisch identifiziert, aber auch
als technisch anspruchsvoll. _Mitigation:_ Evaluierung bewährter Techniken (z.B. PouchDB/CouchDB or
andere offline sync frameworks) früh im Projekt. Zudem definieren wir Minimalkern offline

(Kontaktdaten, Notizen), um die Komplexität einzugrenzen. Worst Case haben wir im Hinterkopf:
Falls Offline sich als extrem schwierig erweist, muss man Prioritäten neu sortieren (der Kontext sagt,
man müsse im Zweifel bereit sein zu verschieben, aber offline wurde als entscheidend genannt
–
also sehr ungern). Wir könnten als Plan B eine read-only Offline-Lösung und Write erst bei
Verbindung umsetzen, was simpler wäre, aber noch nicht ideal.
**Schnittstellenrisiko (Lexware):** ✅ **MITIGIERT (2025-11-10)** - Die Kopplung mit externer Finanzsoftware wurde als Phase 2 eingestuft.
_Entscheidung:_ MVP nutzt minimal viable Integration (CSV-Export). Lexware REST API wurde recherchiert und dokumentiert (verfügbar, gut dokumentiert, OAuth 2.0). Phase 2 Implementation nach MVP-Validierung geplant (4-6 Wochen Aufwand, €20-30k Budget).
_Benefit:_ MVP-Risiko eliminiert, Timeline um 4-6 Wochen verkürzt, Core-CRM-Validierung vor Integrationskomplexität. Händische Export/Import-Workflows in Phase 1 akzeptiert (wöchentlich 30-60 Min Aufwand Buchhaltung).
_Status:_ Nicht mehr GoLive-gefährdend – deshalb ist es
Soll, nicht Muss, den vollen Sync zu haben
. Wichtig: in diesem Fall prozessual abfangen, damit
keine Rechnungen vergessen gehen.
**Compliance-Risiko:** DSGVO/GoBD-Fehler könnten teuer werden (Strafen). _Mitigation:_ Externe
Prüfung der Anwendung vor Livegang (Datenschutz-Folgenabschätzung), und Schulung aller Nutzer
in datenschutzkonformer Nutzung (z.B. kein wildes Sammeln privater Daten).
**Projektabhängigkeiten:** Die Kontaktverwaltung bringt nur was, wenn auch das Angebots-/
Projektmodul existiert, sonst hätten wir zwar Kontakte, aber keine Integration. Glücklicherweise
sollen alle Module entwickelt werden; die Abhängigkeit ist mehr synchron: CRM-Teil und PM-Teil
müssen zusammenpassen. _Mitigation:_ Agile Entwicklung mit bereichsübergreifenden Teams,
regelmäßige Integrationstests über Module hinweg.

### Wichtige Annahmen

**Sprach- und Länderumfang:** Es wird angenommen, dass die Anwendung **hauptsächlich in**
**deutscher Sprache** genutzt wird und keine sofortige Mehrsprachigkeit benötigt
. Ebenso gehen
wir vom aktuellen Geschäftsmodell (Ladenbau im DACH-Raum) aus – keine speziellen
Anforderungen für andere Länder (z.B. keine anderen Rechtswährungen in Kontakten, außer mal
Auslandslieferant in EU -> DSGVO bleibt ähnlich).
**IT-Infrastruktur:** Annahme aus Konzept: Das System wird als **Cloud-Lösung** bereitgestellt
.
Damit setzen wir voraus, dass die Nutzer über Internetzugang verfügen; Offline deckt Funklöcher
ab, aber grundsätzlich arbeiten sie mit Web/App. Cloud erleichtert auch Wartung und mobilen
Zugriff. Sollte das Unternehmen On-Premise bevorzugen, müsste man Annahme revidieren – aber
kein Hinweis darauf im Kontext (eher im Gegenteil).
**Datenbereitschaft der Nutzer:** Wir nehmen an, dass **alle relevanten Kontaktdaten im**
**Unternehmen vorhanden** und verfügbar sind, um sie ins System zu übernehmen. (Z.B. man hat
Excel-Listen aller Kunden, kein kompletter Neubeginn.) Falls es hier Lücken gibt, wird es im Projekt
noch Aufwand sein, sie zu füllen.
**Keine externe Nutzung:** Wir nehmen an, dass **Kunden selbst keinen Zugriff** aufs System
verlangen (wurde ausgeschlossen)
. Sollte es strategisch doch gewünscht werden (z.B. Key
Accounts kriegen Portalzugang), wäre das ein späterer Projektschritt mit neuen Anforderungen.
**Rechtliche Einwilligungen vorhanden:** Annahme: Für die Marketingkontakte, die wir ins System
übernehmen (Newsletter-Listen etc.), liegen bereits Einwilligungen vor oder sie werden eingeholt.
Das System bietet die technische Möglichkeit zu verwalten, aber das rechtliche Einholen liegt beim
Unternehmen.

# •

Diese Annahmen wurden im Konzept genannt oder logisch daraus abgeleitet und müssen vom
Auftraggeber bestätigt werden. Sie bilden die Grundlage, unter der die Planung steht. Änderungen (z.B.
doch internationaler Rollout) könnten Anpassungen im Scope erfordern.

# 9. Offene Punkte (<span style="color:red">Platzhalter</span> &

Trotz gründlicher Analyse bleiben einige Detailfragen offen, die im Projektkontext nicht eindeutig
beantwortet wurden. Wir markieren diese als **Platzhalter in spitzen Klammern** und stellen **präzise**
**Rückfragen** , ergänzt um einen Lösungsvorschlag auf Basis unserer Annahmen:

**Kontakt-Datenpflege-Rollen** – _Platzhalter:_ <Datenpflege-Rollen> – **Frage:** Wer soll im Betrieb

hauptverantwortlich die Pflege der Kontaktstammdaten übernehmen (z.B. Dubletten bereinigen,
Kategorisierungen konsistent halten)? Vertrieb, Marketing oder eine dedizierte Rolle? **Vorschlag:**
Marketing/Vertriebsinnendienst könnte die “CRM-Owner”-Rolle übernehmen, da dort das Interesse
an sauberen Daten hoch ist (für Kampagnen) und sie nicht im Tagesstress vor Ort sind. Alternativ

könnte man regional Vertriebsleiter dafür verantwortlich machen. Diese Entscheidung beeinflusst
Berechtigungseinstellungen (wer darf löschen/mergen) und Schulungsbedarf. Bitte um Bestätigung
der bevorzugten Variante.

**Umgang mit Verbänden/Netzwerken** – _Platzhalter:_
<Verband als eigener Kontakt?> –

**Frage:** Sollen Verbände oder Netzwerkorganisationen, denen Kunden angehören, als eigene
Kontakt-Entitäten erfasst werden (mit eigenem Datensatz), oder lediglich als Attribut bei Kunden?
**Vorschlag:** Sie als eigene Entität anzulegen (Kontakt-Typ “Verband”) mit Beziehung “Mitglied von”
scheint flexibler. So können wir z.B. einen Verband “Landwirtschaftsverein X” anlegen und zehn
Kunden als Mitglieder verknüpfen, statt bei jedem Kunden einen Freitext zu pflegen. Das wurde im
Konzept angedeutet
. Wir würden dem folgen, sofern das Datenvolumen überschaubar ist (ein
Dutzend Verbände max.). Bitte um Feedback, ob es viele solche Verbände gibt und ob diese Lösung
passt.

# Kategorie-Systematik Branchen

# Lead-Qualifizierungsprozess – Frage: Wie genau wird entschieden, wann ein Lead zum

**E-Mail-Integration Priorität** – **Frage:** Ist die automatische E-Mail-Erfassung für Kundenkontakte
gewünscht zum Go-Live oder reicht manuelles Protokollieren? **Vorschlag:** Aufgrund von Datenschutz
und Aufwand würden wir MVP nur eine manuelle Zuordnung vorsehen (Mitarbeiter klickt “E-Mail
anfügen” und kopiert Inhalt oder nutzt BCC). Wenn jedoch im Vertrieb der Wunsch stark ist, jede

Kundenmail automatisch zu tracken, sollten wir das früh wissen, da es die Systemarchitektur
beeinflusst (Server-Zugriff auf Mailboxen etc.). Bitte Priorität klären: Nice-to-have (später) oder Must-
have?

**Zusammenführung Altdaten** – **Frage:** In welcher Form liegen derzeit die Kontakt-/Kundendaten
vor? (Excel-Listen, CRM-Teile in Lexware, Outlook-Kontakte einzelner MA, etc.) **Vorschlag:** Ein
Workshop vor Entwicklungsstart, wo alle bestehenden Datenquellen gesammelt werden, wäre
sinnvoll. Wir haben Mechanismen für Dubletten, aber je “schmutziger” die Inputdaten, desto mehr
müssen wir vorab reinigen. Die Entscheidung hier: Wer übernimmt die Vorabreinigung? Das
Projektteam IT oder die Fachabteilungen? Evtl. sollte Vertrieb/Marketing selbst ihre Excel-Listen
bereinigen, da sie die Kunden am besten kennen. Wir bitten um Auflistung der Datenquellen und
Vorschlag, wer die Datenbereinigung verantwortet, damit wir das im Projektplan berücksichtigen.

**Schulungskonzept** – **Frage (organisatorisch):** Soll das Projektteam ein Konzept für die Schulung/
Onboarding der Benutzer erstellen (gehört streng genommen zum PM, nicht zur Domäne, aber
beeinflusst den Erfolg der Kontaktverwaltung enorm)? **Vorschlag:** Eine “Train-the-Trainer”-Struktur:
Key-User aus jeder Abteilung werden intensiv geschult und tragen es in ihre Teams. Zusätzlich evtl.
kurze Manuals oder In-App-Hilfen. Wenn hier bereits Vorstellungen existieren, können wir das
Produkt (z.B. Terminologie oder Tooltipps) darauf abstimmen.

_(Jeder offene Punkt wurde so präzise wie möglich formuliert. Die vorgeschlagenen Lösungen sind konform mit_
_dem Projektkontext und sollen als Diskussionsgrundlage dienen, um eine endgültige Entscheidung_
_herbeizuführen. Ziel ist, keine offenen Fragen in die Entwicklungsphase mitzunehmen.)_

# 10. Verweise auf Projektkontext-Artefakte

Zur Erarbeitung dieser Vision und der Anforderungen wurden folgende Projektkontext-Quellen
herangezogen (alle Informationen stammen **ausschließlich aus diesen Quellen** ):

**Interview-Transkript (31.10.25)** – Gespräche mit einem Vertriebsmitarbeiter, der detailliert die
aktuellen Prozesse, Personas und Pain Points beschrieb. Zentrale Stellen: Außendienst-Bedürfnisse
(z.B. **Offline & mobile Datenerfassung**
, **Kontaktpflege über Jahre**
), Marketing-Lead-
Prozess (z.B. **Word-Kontaktprotokolle, kein Lead darf verloren gehen**
), Networking (z.B.
**Verbandskontakte als Multiplikatoren**
) und Buchhaltungsinput (z.B.
**Rechnungsabwicklung und Provisionsinfo**
). Dieses Interview lieferte die **Empirie hinter**
**den Anforderungen** .
**Gesamtkonzept “Integriertes CRM- und PM-Tool” (final)** – Umfassendes Konzeptdokument mit
Executive Summary und detaillierter Ausarbeitung pro Domäne. Daraus stammen die **Beschreibung**
**der Domäne Kontakt-&Kundenverwaltung**
, die **Muss-/Soll-Anforderungen** (Priorisierung)
, Best Practices (z.B. 360°-Profil, Dubletten-Check
, DSGVO-Vorgaben
) und
Schnittstellen-Definitionen
. Das Gesamtkonzept bestätigte viele Interview-Infos und ergänzte
branchentypische Standards (z.B. **Opportunity-Phasen mit Abschlusswahrscheinlichkeit** ). Wir
haben eng an diesen Vorgaben argumentiert.
**Persona-Profile Berichte** – Insbesondere:
_Außendienstmitarbeiter (Vertrieb Ladenbau)_ – lieferte tiefe Einblicke in den Tagesablauf des ADMs und
seine Anforderungen an ein mobiles CRM (z.B. **“nicht immer Internet verfügbar, braucht**

# •

**offline”**
, **Kontaktberichte direkt eingeben statt diktieren** ). Viele Zitate im Visionstext
referenzieren diese Pain Points.
_Innendienst & Kalkulation_ – zeigte die Probleme mit verteilten Dateien und den Wunsch nach **“einer**
**Applikation statt Ordnerstruktur”**
. Auch der Bedarf nach lückenloser Dokumentation
(“wer hat wann was entschieden” im Kundenkontakt) kommt von dort
.
_Buchhaltung_ – definierte Anforderungen wie **Rechnungspläne statt Zuruf**
und
Provisionsdokumentation
. Unsere Lösung zur Kontaktquelle speist sich daraus.
_Planungsabteilung_ – Fokus lag auf Projektdurchführung, aber es wurde deutlich, dass **Briefing-**
**Übergaben** und Infoflüsse verbessert werden müssen
. Dies floss in Schnittstellen und
Persona-Mapping ein.
_Geschäftsführer_ – braucht Übersicht (im Konzept erwähnt: **KPI-Dashboards**
). Auch strategische
Weitsicht (Wartung als Option) kam hier, die wir als Zukunftsnotiz aufnahmen.
(Jede Persona-Präsentation aus dem Kontext wurde abgeglichen, um sicherzustellen, dass kein
Widerspruch entsteht – z.B. AD und Buchhaltung verlangen teils gegenläufige Dinge wie “Daten
möglichst frei” vs “Daten kontrolliert”, was wir durch Rollenrechte gelöst haben.)
**Rollenkonzepte** – Im Kontext erwähnt sind Rollen und Rechte. Die Anforderungen dazu
(feingranulare Rechte, Standard Offenheit) haben wir dem Gesamtkonzept entnommen
. Diese
beeinflussen Qualität und Schnittstellengestaltung.
**Branchen-Best-Practice-Beispiele** – Das Konzept streute auch externe Best Practices (z.B.
**Kontaktanreicherung durch öffentliche Firmendaten**
, **Lead-Konvertierung ohne**
**Informationsverlust**
). Wir haben diese nur aufgegriffen, wenn sie im Projektkontext als sinnvoll
erachtet wurden.
**Marktvergleich** – Kurzer Abriss im Konzept, z.B. Insightly hat Module Leads, Contacts, Opps
.
Unsere Vision deckt die Kernfunktion genauso ab. Diese Vergleiche bestätigten, dass wir auf dem
richtigen Feature-Set sind und nichts Essenzielles fehlt.

# •

# •

# •

_(Alle Quellen stammen aus dem bereitgestellten Projektkontext, es wurden keine externen Informationen darüber_

_hinaus verwendet. Die eckigen Klammer-Zitate_ _【】_ _verweisen auf die jeweiligen Stellen in den Dokumenten: [1]_
_Interview-Transkript, [2] Gesamtkonzept-PDF, [3–6] Persona-PDFs etc., jeweils mit Zeilenangaben. Diese dienen der_
_Nachvollziehbarkeit der Herleitung.)_

# Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf

## file://file-FbKUtfPLzdQxRsRczADzbb

### Innendienst (Vertriebsinnendienst & Kalkulation) –

## file://file-VJq3pNESEg3T8GTAkojg96

### sg_interview_31.10.25_deu.txt

## file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### Persona-Bericht\_ Buchhaltung (Integriertes CRM- und

## file://file-5kxnSBcJVyuurRbCQXGsXN

### 25

| 1   | 2   | 3   |     | 4   |     |     | 6   |     |     | 7   |     |     | 8   |     | 9   |     | 10 45 | 11 46 | 12  | 13 54 |     | 14  | 1 6 | 5 0 | 16  |     | 17  |     | 18  | 19  | 20  | 21 83 | 22  |     | 23  |     |     | 24  |     | 28  | 29  |     | 30  |     | 31  |     | 32  | 33  | 34  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ----- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 37  | 38  | 39  |     | 40  |     |     | 41  |     |     | 42  |     |     | 43  |     | 44  |     |       |       | 47  |       |     | 56  |     |     | 78  |     | 79  |     | 80  | 81  | 82  |       | 84  |     | 85  |     |     | 86  |     | 87  | 88  |     | 89  |     | 90  |     | 91  | 92  | 93  |
| 94  | 95  | 96  |     | 97  |     |     | 98  |     |     | 99  |     |     | 100 |     | 101 |     | 102   |       |     |       | 107 |     |     |     |     | 110 |     | 111 |     | 112 | 113 |       | 115 |     |     | 116 |     |     | 117 |     |     |     |     |     |     | 123 |     |     | 125 |
| 126 | 127 | 128 |     |     | 129 |     |     | 130 |     |     | 132 |     |     | 134 |     | 1   | 38    |       |     |       |     |     |     |     |     |     |     |     |     |     |     |       |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |

Strategische Referenzpersona\_ Planungsabteilung.pdf

## file://file-GxpTjQDiWJAktETtNZy3Nr

### 26
