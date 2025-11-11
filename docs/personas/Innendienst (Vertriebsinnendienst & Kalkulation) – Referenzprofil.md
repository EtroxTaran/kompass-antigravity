# Innendienst (Vertriebsinnendienst & Kalkulation) – Referenzprofil

*Converted from: Innendienst (Vertriebsinnendienst & Kalkulation) – Referenzprofil.pdf*  
*Document Version: 2.0*  
*Last Updated: 2025-11-10*

**⚡ Relevante Spezifikationen für Innendienst-Rolle:**
- **Rollengrenzen (GAP-JOURNEY-004):** Siehe RBAC_PERMISSION_MATRIX.md §9
  - **Innendienst** = Vertriebsrolle (Pre-Sales): Angebotserstellung, Pricing, Kunden-Koordination
  - **Handoff-Punkt:** Opportunity "Won" → Projekt erstellt → Planning übernimmt
  - **Klar definiert:** INNEN nicht für Projekt-Execution zuständig (nur beratend bei Änderungen)
- **RBAC-Berechtigungen:** Siehe RBAC_PERMISSION_MATRIX.md §3-4
  - Alle Kunden: Voller Zugriff (CRUD)
  - Alle Opportunities: Voller Zugriff (CRUD)
  - Alle Angebote: Voller Zugriff (CRUD), inkl. Margen-Sichtbarkeit
  - Projekte: Lesezugriff (alle), inkl. Budgets (aber keine Detail-Kosten)
  - Rechnungen: Lesezugriff (alle), Status + Beträge sichtbar
- **User Journeys:** Siehe USER_JOURNEY_MAPS.md
  - Journey 1: Lead → Won (INNEN-Rolle: Angebotserstellung, Kalkulation, Approval-Koordination)
  - Journey 3: Änderungsanfrage (INNEN-Rolle: Change-Order-Pricing)
- **Offline:** Typischerweise Office-basiert (weniger Offline-Bedarf als ADM), 56 MB bei vollständiger Offline-Nutzung

---

# Innendienst (Vertriebsinnendienst & Kalkulation)

### Einleitung & Kontext

In diesem Referenzprofil wird die Persona **„Innendienst (Vertriebsinnendienst & Kalkulation)“** in einem
Ladenbau-/Innenausbau-Unternehmen beschrieben. Das Unternehmen plant und realisiert individuelle
Ladeneinrichtungen für Direktvermarkter (z. B. Hofläden, Vinotheken, Blumengeschäfte), inklusive Entwurf,
Fertigung (über Partner wie Schreinereien) und Montage vor Ort
. Die Projekte sind typischerweise B2B-
Aufträge mit längerer Laufzeit (mehrere Monate, teils über Jahreswechsel) und erfordern ein enges
Zusammenspiel verschiedener Abteilungen.

# Vor dem Hintergrund der Einführung eines integrierten CRM- und Projektmanagement-Systems sollen die

# In diesem Kontext nimmt der Vertriebsinnendienst & Kalkulation eine Schlüsselrolle ein. Diese Persona bildet

# Persona-Übersicht

**Rollenbeschreibung:** Die Persona **Innendienst (Vertriebsinnendienst & Kalkulation)** umfasst mehrere
Funktionen im Unternehmen. Zum einen gehört die **Kalkulation** dazu: *Kalkulator* ‐Mitarbeiter im
Innendienst erstellen detaillierte Kostenvoranschläge und Angebote auf Basis der vom Außendienst und
der Planung gelieferten Informationen
. Sie brechen Material- und Leistungskosten fein säuberlich
herunter und
**pflegen Preislisten**
mit aktuellen Konditionen
. Daneben gibt es den
**Vertriebsinnendienst** im engeren Sinne: Diese Personen unterstützen den Außendienst administrativ,
koordinieren z. B. Termine, bereiten Standarddokumente vor und halten Informationen nach
. Drittens
übernimmt der Innendienst auch Aufgaben der **Projektkoordination** nach Auftragseingang – er stößt
Bestellungen bei Lieferanten an, plant Montagetermine und kümmert sich um die Auftragsabwicklung
.
(Im Interview wurde kein eigener Projektmanager genannt; es liegt nahe, dass der Innendienst diese Rolle
mit ausfüllt, ggf. in Zusammenarbeit mit dem Außendienst
.) Je nach Unternehmensgröße können diese
Aufgabengebiete auf mehrere Mitarbeiter verteilt sein (im Interview ist von **„Kalkulatoren“** als Teil des


Innendienst-Teams die Rede)
. Für das Referenzprofil werden sie zusammengefasst, da all diese
Tätigkeiten eng verzahnt sind.

# Position im Prozess: Der Innendienst ist zentraler Knotenpunkt im Gesamtprozess . Er bildet die

# Ziele & Motivation: Hauptziel dieser Persona ist es, Kundenanfragen schnell und präzise in Angebote

# Pain Points: Der aktuelle Prozess bringt aus Sicht des Innendienstes einige Schmerzen und


problematischen Lieferanten frühzeitig zu identifizieren)
. Schließlich leidet der Innendienst unter
**Doppelarbeit** : Angebote werden in Word/Excel erstellt und müssen bei Auftrag teils **nochmals in ein ERP/**
**Buchhaltungssystem eingetippt** werden
. Diese doppelte Datenerfassung kostet Zeit und birgt
Fehlerpotenzial. All das führt zu Frustration – wertvolle Zeit geht für Verwaltung drauf, statt für
wertschöpfende Arbeit mit Fokus auf Kunden und Projekte.

# Erfolgskennzahlen: Um den Erfolg der Innendienst-Tätigkeiten zu messen, dienen einige KPIs. Wichtig ist

# Aufgaben & Prozesse

Der Innendienst begleitet einen Projektauftrag **von der Angebotsphase bis zur Umsetzung** . Im Folgenden
werden die zentralen Aufgaben und Prozessschritte dieser Persona erläutert – von der Kalkulation über die
Projektverfolgung bis hin zu Kommunikation und Dokumentation.

### Kalkulation & Angebotserstellung

Eine Kernaufgabe des Innendienstes ist der **Kalkulations- und Angebotsprozess** . Sobald der
Außendienstmitarbeiter (ADM) einen potenziellen Kunden beraten und erste Anforderungen aufgenommen
hat, fließen diese Informationen in die Planung und anschließend in die Kalkulation ein. **Nachdem die**
**Planungsabteilung einen Ladenbau-Entwurf fertiggestellt hat, kommt der Innendienst ins Spiel: Er**
**erhält die Planungsunterlagen und die gesammelten Infos vom Vertrieb, um daraus ein konkretes**
**Angebot zu erstellen**
**.** Idealerweise gibt der ADM beim Übergabegespräch noch Details (z. B.
Materialpräferenzen des Kunden) an den Kalkulator weiter
. Der Innendienst erstellt nun einen
**detaillierten Kostenvoranschlag**
– alle Materialkosten (Regale, Theken, Beleuchtung usw.),
Dienstleistungsanteile (Planung, Montage) und eventuelle Fremdleistungen werden **in Positionen**
**aufgeschlüsselt**
. Wichtig ist, dass das Angebot **vollständig, korrekt kalkuliert und nachvollziehbar**
für den Kunden ist
. Der Preis muss stimmen (korrekte Lieferantenpreise, richtige Margen) und alle
gewünschten Elemente sollen enthalten sein. Oft greift der Innendienst dabei auf hinterlegte Preislisten
und Kalkulationsvorlagen zurück, oder holt aktuelle Angebote von Lieferanten ein, falls Sonderteile benötigt
werden. In der aktuellen Situation erfolgt die Angebotserstellung meist in Office-Tools (Excel/Word), wobei
später die Daten nochmals ins ERP eingegeben werden müssen
– ein doppelter Schritt, der im
zukünftigen System entfallen soll.


| 32 | . W |
| --- | --- |
| ist | 16 |

**Angebotspräsentation & Iterationen:** Ist das erste Angebot erstellt, wird es intern geprüft und dann vom
ADM dem Kunden präsentiert – häufig in Form einer *gebundenen Projektmappe* mit Visualisierungen der
Planung
. Der Innendienst arbeitet hierfür eng mit der **Grafik/Marketing-Abteilung** zusammen, die
ansprechende **Projekt-Präsentationen** gestaltet (Layouts, Bilder, Texte), damit der Kunde einen
professionellen Eindruck erhält
. Der ADM übergibt dem Kunden also **Planungsmappe +**
**detailliertes Angebot** . Im Idealfall wird das Angebot sofort vom Kunden angenommen und unterzeichnet
. Häufiger jedoch folgen **Iterationen** : Der Kunde wünscht Änderungen (andere Materialien, Umfang
reduzieren/erweitern, etc.), sodass Planer und Innendienst Anpassungen vornehmen. In solchen Fällen
erstellt der Innendienst **zügig eine neue Angebotsversion** , angepasst an die geänderten Anforderungen
. Jede Version wird sauber nummeriert und datiert. Eine Herausforderung ist es aktuell, den Überblick
zu behalten, damit **immer die neueste Version** verwendet wird und alte Versionen archiviert sind
.
Ohne spezielles Tool passiert es leicht, dass jemand versehentlich mit einer veralteten PDF arbeitet. Der
Innendienst muss daher sehr sorgfältig versionieren. Im neuen System soll dieser Prozess stark vereinfacht
werden: Angebotsversionen werden im CRM direkt verwaltet, Änderungen sind nachvollziehbar markiert
und ältere Stände bleiben einsehbar (Audit-Trail)
. So kann der Innendienst dem Kunden oder internen
Nachfragern jederzeit genau sagen, **was sich gegenüber der Vorversion geändert hat** – das erhöht die
Professionalität und Transparenz
. Nachdem der Kunde final zusagt, wandelt der Innendienst das
Angebot in einen Auftrag um. Im bisherigen Prozess bedeutet das: Auftrag im ERP/Buchhaltungssystem
anlegen, Bestellungen auslösen etc. – im neuen System soll das **auf Knopfdruck** gehen, indem alle
relevanten Daten aus dem Verkaufsprojekt ins Ausführungsprojekt übertragen werden
.

# Projektfortschrittsüberwachung & Koordination

Nach der Auftragsbestätigung übernimmt der Innendienst verstärkt die **Rolle des Projektkoordinators** .
Sein Ziel: die **reibungslose Abwicklung** des Projekts bis zur Fertigstellung
. Dazu zählt zunächst die
**Bestellung der benötigten Materialien und Möbel** bei externen Lieferanten (z. B. regionale Schreinereien,
Metallbauer). Der Innendienst erstellt Bestelllisten basierend auf dem Angebot und gibt die Aufträge an die
Lieferanten heraus
. Er muss dabei **Lieferzeiten** im Blick haben – oft haben z. B. individuell gefertigte
Möbel 6–8 Wochen Produktionszeit. Entsprechende Termine werden vom Innendienst notiert und
überwacht
. Parallel plant er die **Montage beim Kunden vor Ort** : Entweder wird ein eigenes
Montageteam eingeteilt oder externe Monteure werden koordiniert. Hierbei stimmt sich der Innendienst
eng mit der Planungsabteilung (für technische Details) und dem Kunden ab, um einen passenden
Einbautermin zu finden.

# Die Projektfortschrittsüberwachung gehört ebenfalls zu seinen Aufgaben. Der Innendienst beobachtet


Sobald ein Projekt in die **Umsetzungsphase** geht, bleibt der Innendienst Ansprechperson für interne und
externe Beteiligte. Er **hält den Kunden auf dem Laufenden** über Fortschritte und etwaige
Terminänderungen
. Intern fragt die Geschäftsführung oder der Vertrieb gelegentlich den Status ab –
der Innendienst soll dann schnell Auskunft geben können („Projekt X ist zu 80% fertig, Montage in 2
Wochen geplant“). Nach Fertigstellung koordiniert der Innendienst die **Abnahme** beim Kunden und stellt
sicher, dass eventuell noch ausstehende Restarbeiten erledigt werden. Sollte der Kunde Mängel melden
(Reklamation), nimmt der Innendienst diese auf, dokumentiert sie und leitet **Maßnahmen zur Behebung**
ein (z. B. Nachbesserung durch Lieferant oder Monteur). In der aktuellen Situation gehen solche
Reklamationsinfos häufig **verloren** bzw. werden nicht zentral ausgewertet
. Best Practice wäre,
Reklamationen systematisch im CRM zu erfassen und dem entsprechenden Projekt/Lieferanten
zuzuordnen, um aus der Häufung von Problemen zu lernen
. Insgesamt sorgt der Innendienst also
dafür, dass vom Auftrag bis zur Übergabe alles seinen Gang geht und am Ende **Projekt- und Kundenerfolg**
stehen.

# Ein weiterer Aspekt ist die Rechnungsstellung : Der Innendienst arbeitet hierbei eng mit der Buchhaltung

# Kommunikation und Zusammenarbeit

Kommunikation ist ein zentrales Element der Innendienst-Rolle, da diese Persona viele Schnittstellen hat.
Der Innendienst kommuniziert täglich mit dem **Außendienst** (z. B. um Rückfragen zum Kundenbriefing zu
klären oder um dem ADM den Stand der Angebotskalkulation mitzuteilen) und mit den **Planern** (etwa wenn
Unklarheiten zu Zeichnungen bestehen oder wenn Kosten durch bestimmte Designwünsche aus dem
Ruder laufen). Aktuell erfolgen diese Abstimmungen häufig persönlich, telefonisch oder per E-Mail/Chat.
Dabei gehen Informationen leicht verloren oder erreichen nicht alle relevanten Personen. So kann es
passieren, dass der Planer Änderungen am Entwurf vornimmt, aber der Kalkulator nicht sofort informiert
wird und mit veralteten Daten kalkuliert.

Der Innendienst wünscht sich daher **transparente, zentrale Kommunikationskanäle** . Im neuen System
soll es möglich sein, *projektbezogen* zu kommunizieren – z. B. via Kommentarfunktionen direkt in der
Projektakte, mit @Mention der verantwortlichen Kollegen
. Wenn der Planer also einen neuen Entwurf
hochlädt, könnte er den Innendienst taggen: „@Innendienst Neuer Grundriss hochgeladen, bitte
Kalkulation updaten“. Der Vorteil: Alle Beteiligten sehen die Kommunikation im Kontext des Projekts, nichts
geht unter, und es entsteht eine **lückenlose Historie** . Rückfragen werden so **transparent** gestellt und
beantwortet, statt als Einzelgespräche „unter vier Augen“
. Dies erhöht die Nachvollziehbarkeit und
vermeidet doppelte Nachfragen. Auch mit **Lieferanten** kommuniziert der Innendienst – hier meist per E-
Mail/Telefon bei Bestellungen oder Reklamationen. Eine Anbindung von Lieferanten ans System (z. B. über
ein Lieferantenportal) ist perspektivisch denkbar, aber kurzfristig nicht im Fokus. Wichtig ist dem
Innendienst jedoch, intern stets zu wissen, *wer zuletzt was mit welchem Lieferanten besprochen hat* , um im
Vertretungsfall schnell einsteigen zu können.


Wenn es um den **Kundenkontakt** geht, ist zwar primär der Außendienst zuständig, doch gerade in der
Auftragsabwicklung meldet sich der Kunde oft direkt beim Innendienst (z. B. um einen Liefertermin zu
ändern oder eine Frage zur Rechnung zu klären). Der Innendienst übernimmt dann die Rolle eines
*kompetenten Ansprechpartners* am Telefon. Dafür muss er schnell auf alle **Kundendaten und Projektinfos**
zugreifen können. Mit der geplanten 360°-Kundensicht im neuen CRM kann der Innendienst-Mitarbeiter im
Kundenanruf beispielsweise sofort sehen, welche Projekte und Angebote der Kunde laufen hat, welchen
Status sie haben, und ob es offene Punkte gibt
. So kann er professionell Auskunft geben, ohne erst
Rücksprache halten zu müssen. Diese bereichsübergreifende Transparenz verbessert den Kundenservice
deutlich.

# Zusammenarbeit findet auch mit der Marketing/Grafik-Abteilung statt. Wie erwähnt, bereitet Marketing

# Dokumentation & Versionsmanagement

Die sorgfältige **Dokumentation** ist für den Innendienst essenziell. In der bestehenden Prozesslandschaft
wird viel über *Dateiablagen* (Netzlaufwerk-Ordner) organisiert
. Für jedes Projekt existiert typischerweise
ein Ordner mit Unterordnern für Angebot, Planung, Schriftverkehr etc. Dieses manuelle Ablagesystem ist
fehleranfällig – Informationen können falsch abgelegt oder bei E-Mail-Kommunikation gar nicht erst im
Ordner gesichert werden. Der Innendienst verbringt derzeit einiges an Zeit damit, Daten aus E-Mails zu
kopieren, Protokolle in Word abzulegen und sicherzustellen, dass der Ordner aktuell ist. Das neue System
verfolgt hier den Ansatz „ **eine Applikation statt Ordnerstruktur** “
. Alle relevanten Informationen –
Kontakte, Notizen, Angebote, Auftragsdetails, Lieferanteninfos, Rechnungen – sollen im CRM/PM-System
erfasst und verknüpft werden, anstatt dezentral in verschiedenen Dateien. Dadurch entsteht eine zentrale,
durchsuchbare **Wissensdatenbank pro Projekt** , was die Nachverfolgbarkeit massiv erhöht.

# Ein besonderes Augenmerk liegt auf der Versionsverwaltung von Angeboten und Dokumenten . Wie

# Neben Angeboten fallen auch andere Dokumente an – z. B. technische Zeichnungen der Planer,

Dateien vorliegen (etwa Bestellungen als Daten im Beschaffungsmodul, Rechnungen als Einträge im
Finanzmodul). Wichtig für den Innendienst ist, dass eine **lückenlose Projekthistorie** entsteht: Vom ersten
Kundenkontaktbericht über Angebote, Auftragsbestätigung, Änderungen, bis hin zur Abschlussrechnung
und etwaigen Reklamationen. Im Nachhinein soll nachvollziehbar sein, **wer wann was entschieden oder**
**geändert hat** . Dies erhöht die Transparenz gegenüber dem Kunden und intern (Stichwort: Audit-Trail)
.
Beispielsweise kann man dem Kunden bei Unsicherheit zeigen, welche Version seines Ladenausbaus
letztlich beauftragt wurde und welche Änderungen auf seinen Wunsch hin vorgenommen wurden – das
schafft Vertrauen.

# Zusammenfassend entlastet ein gutes Dokumentations- und Versionsmanagement den Innendienst

# Anforderungen & Erwartungen

Aus den beschriebenen Aufgaben und Pain Points lassen sich klare **Anforderungen an ein**
**unterstützendes System** sowie Erwartungen des Innendiensts formulieren. Die zukünftige CRM-/PM-
Lösung sollte folgende funktionale und nicht-funktionale Anforderungen erfüllen:

**Integrierte Datenbasis & 360°-Sicht:** Alle kunden- und projektbezogenen Informationen müssen
zentral und abteilungsübergreifend verfügbar sein
. Der Innendienst erwartet eine *einheitliche*
*Plattform* statt diverser Einzellösungen. Medienbrüche – etwa zwischen CRM, Excel-Listen und
Ordnerablage – sind zu vermeiden. Jeder im Team sollte den gleichen aktuellen Informationsstand
abrufen können (Single Source of Truth). Dadurch entfällt das mühsame Zusammenführen
verstreuter Daten, und **Übergabeverluste** werden minimiert
.

# Effizientes Angebotsmodul mit Versionierung: Das System soll die Erstellung von Angeboten

# Automatisierte Workflows & Erinnerungen: Viele Routineaufgaben des Innendiensts sollten durch


(z. B. automatisch erinnern, wenn ein Angebot 10 Tage ohne Kundenreaktion offen ist)
– dies
erhöht die Abschlussquote. Der Innendienst erwartet, dass das System solche Erinnerungen
bereitstellt, aber nicht mit zu vielen unwichtigen Tasks überflutet (Fokus auf kritische Schritte)
.
Insgesamt soll die Workflow-Automatisierung Routinearbeit abnehmen, sodass sich der Innendienst
auf inhaltliche Themen konzentrieren kann.

# Nahtlose Übergabe Verkauf -> Projekt: Sobald ein Angebot vom Kunden angenommen wird, sollte

# Auftragsabwicklung & Lieferantenmanagement: Für die Phase nach Auftragseingang benötigt

# Echtzeit-Status & Kollaboration: Das neue Tool muss bereits während der Angebotserstellung

# Ressourcen- und Kapazitätsübersicht: Der Innendienst möchte Projekte auch hinsichtlich interner


(z. B. keinen Montagetermin einplanen, wenn das Montageteam schon ausgebucht ist). In der
aktuellen Struktur fehlt so eine Übersicht – man ist auf Zuruf oder manuelle Excel-Pläne angewiesen.
Das neue Tool soll hier **Transparenz über die interne Auslastung** schaffen, was letztlich zu
besserer Planung und höherer Termintreue führt
.

# Benutzerfreundlichkeit & Akzeptanz: Eine grundlegende Erwartung ist, dass das System intuitiv

# Compliance & Datensicherheit: Da der Innendienst kundendatenlastig arbeitet und auch

# Zusammengefasst soll die neue Lösung dem Innendienst ermöglichen, schneller, genauer und mit

# Best Practices & Industriestandards

In der Ladenbau-/Projektbranche sowie allgemein im B2B-Vertrieb haben sich für vergleichbare Rollen wie
den Innendienst einige **Best Practices** und Industriestandards etabliert. Diese flossen auch in das
Gesamtkonzept ein und sollen hier hervorgehoben werden:

**Integriertes CRM+PM als Standard:** Moderne Unternehmen setzen auf Software, die Vertrieb und
Projektmanagement **nahtlos verbindet** . Am Markt gibt es bereits Lösungen (z. B. Insightly, Zoho,
Salesforce mit Projektmodul, Monday.com), die genau dieses Prinzip verfolgen
. Eine gewonnene
Verkaufschance lässt sich dabei mit einem Klick in ein Projekt umwandeln, ohne Medienbruch
.
*Best Practice* ist es, sämtliche Daten aus der Akquise ins Projekt zu übertragen (Kundendaten,


Angebote, Notizen), sodass kein Informationsverlust entsteht
. Dieser durchgängige Prozess wird
mittlerweile als Standard angesehen, weil er Effizienz und Datenqualität erheblich steigert.

# Zentrales Angebots- und Auftragsmanagement: Es gilt als Best Practice, Angebote im CRM-

# Audit-Trail & Versionierung: In regulierten Branchen (und auch im Innenausbau-Projektgeschäft

# Automatisierung von Workflows: Routinetätigkeiten überlässt man idealerweise dem System.

# Lieferanten- und Qualitätskontrolle:

# 10


---

*Page 11*

---

Technik, aus vergangenen Projektdaten zu lernen, um kontinuierlich besser zu werden.
Unternehmen, die das vernachlässigen, verspielen leicht Chancen zur Qualitätssteigerung.

**Echtzeit-Zusammenarbeit & Transparenz:** In Zeiten verteilter Teams (Außendienst unterwegs,
Innendienst im Büro, ggf. Homeoffice) ist Echtzeit-Kollaboration ein Muss. **Cloud-basierte Lösungen**
sind zum Standard geworden, da sie ortsunabhängigen Zugriff ermöglichen
. Tools wie
gemeinsame Kanban-Boards, Activity-Feeds oder @Mentions sind inzwischen gängig in
Projektmanagement-Software und fördern die bereichsübergreifende Zusammenarbeit. Anstatt in
Silos zu arbeiten, sieht jeder beteiligte Mitarbeiter den *aktuellen Status aller seiner Projekte* . Das
erhöht die **Reaktionsgeschwindigkeit** – z. B. kann der Innendienst sofort mit der Kalkulation
starten, wenn der Planer den Entwurf fertig markiert, ohne auf Meetings warten zu müssen
.
Transparenz gilt heute als Kulturmerkmal: Informationen sollen grundsätzlich eher geteilt als
verborgen werden (natürlich unter Wahrung von Berechtigungen). Im CRM-Kontext wird deshalb
empfohlen, **Zugriffsrechte großzügig** zu definieren, sodass zumindest intern ein umfassender
Überblick möglich ist
. Das verhindert, dass Wissen an Einzelpersonen „hängt“ und fördert Team-
Synergien.

# Ressourcen- und Kapazitätsplanung: In projektorientierten Betrieben hat sich die kapazitive

# Standardisierte Angebots-Outputs: Ein oft unterschätzter Aspekt ist die Präsentation von

# Zusammengefasst orientiert sich das angestrebte System und die Arbeitsweise des Innendienstes an dem,

# 11

# Rollenprofil: Innendienst (Vertriebsinnendienst & Kalkulation)

**Persona-Name/Rolle:** *Claudia Beispiel* (stellvertretend für den **Innendienst – Vertriebsinnendienst &**
**Kalkulation** in einem Ladenbau-Unternehmen).

**Kurzbeschreibung:** Claudia arbeitet im Vertriebsinnendienst eines Innenausbau-Projektgeschäfts. Sie ist
zentraler Ansprechpartner im Büro, der Angebote kalkuliert und Aufträge koordiniert. Mit über 5 Jahren
Erfahrung kennt sie die Produkte, Preise und Abläufe genau. Ihr Arbeitstag ist geprägt vom Jonglieren
mehrerer Projekte gleichzeitig – während sie für Kunde A eine Detailkalkulation fertigstellt, organisiert sie
für Projekt B bereits die Bestellung der Möbel und beantwortet eine Anfrage des Außendienstes zu Projekt
C. Sie ist sehr **detailorientiert** , versiert in Excel und ERP-Systemen, und kommuniziert viel per Telefon und
E-Mail mit Kollegen und Partnern.

**Hauptaufgaben und Verantwortlichkeiten:** Claudias Kernaufgabe liegt in der **Kalkulation von**
**Angeboten** . Sie erhält vom Außendienst und der Planung alle nötigen Infos, um **maßgeschneiderte**
**Angebote** für Kunden zu erstellen
. Dabei achtet sie darauf, dass alle Positionen vollständig und
kostendeckend erfasst sind. Sie aktualisiert Angebote bei Kundenänderungen und behält den Überblick
über verschiedene Angebotsversionen
. Sobald ein Kunde bestellt, wechselt Claudia in den
**Abwicklungsmodus** : Sie **übergibt die Projektdaten in die Umsetzung** , stößt Bestellungen bei Lieferanten
an, plant die Montageeinsätze und überwacht die Termine
. Sie fungiert als **Koordinatorin** , die
sicherstellt, dass jeder (Kunde, Lieferant, Monteur, Planer) zur richtigen Zeit die richtigen Informationen hat.
Wenn Probleme auftreten – z. B. Lieferverzögerungen oder Reklamationen – ergreift Claudia Maßnahmen:
Sie organisiert Ersatz, informiert den Kunden und dokumentiert den Vorfall intern
. Zusätzlich
übernimmt sie organisatorische Aufgaben im Vertrieb: Sie koordiniert etwa Kundentermine für den
Außendienst, bereitet Präsentationsunterlagen vor und pflegt die Kundendaten im System
. Als
**Informationshub** im Büro beantwortet sie Anrufe von Kunden, wenn der zuständige Außendienstler
unterwegs ist, und gibt Auskunft zum Projektstatus
. Intern steht sie in regem Austausch mit Planung,
Buchhaltung und Marketing, um einen reibungslosen Informationsfluss zu gewährleisten.

# Ziele und Motivation: Claudia ist motiviert, Aufträge zu gewinnen und erfolgreich abzuwickeln . Sie

**Pain Points & Frustrationen:** Was Claudia am meisten frustriert, sind **unnötige Hindernisse im**
**Arbeitsablauf** . Dazu zählen Informationsverluste („Warum habe ich diese wichtige Änderung vom Kunden
erst so spät erfahren?“) und **Doppelarbeit** (Daten mehrfach eingeben zu müssen)
. Sie ärgert sich, wenn
handschriftliche Notizen des Außendienstes kaum lesbar sind oder wenn sie stundenlang E-Mails
durchsuchen muss, um den aktuellen Stand herauszufinden
. Zeitdruck durch **schlechte Abstimmung** –
etwa wenn ein Lieferant verspätet liefert und sie im letzten Moment einen neuen Montageplan erstellen

# 12

muss – verursacht ihr Stress
. Auch die Angst, etwas zu übersehen (z. B. eine Frist oder eine
Kundenanfrage), begleitet sie in Stoßzeiten. Wenn es keine transparente Übersicht gibt, ob alle Aufgaben
erledigt sind, fühlt Claudia sich unwohl. Sie möchte **die Zügel in der Hand halten** , doch die derzeitige Tool-
Landschaft macht es ihr nicht leicht: Intransparente Ordnerstrukturen und isolierte Excel-Listen passen
nicht zu ihrem Anspruch an Professionalität. Zudem empfindet sie es als Rückschritt, dass viele Daten
bereits digital vorliegen, aber nicht vernetzt sind – sie wünscht sich, diese Inseln zu einem großen Ganzen
zusammenzuführen. Schließlich frustriert es sie, wenn sie **für den Kunden keinen Mehrwert aus Daten**
**ziehen kann** , weil diese nicht aufbereitet sind – z. B. würde sie gern proaktiv dem Vertrieb Feedback geben
können, welcher Produkttyp häufig Probleme macht, aber momentan fehlt ihr die Zeit, sowas manuell zu
analysieren.

# Wichtige Schnittstellen: Claudia interagiert mit nahezu allen Abteilungen. Am engsten ist die Verbindung

# Kompetenzen & Tools: Claudia verfügt über ausgeprägte analytische Fähigkeiten und mathematisches

**KPIs & Erfolgsmessung:** Claudias Leistung spiegelt sich in mehreren Kennzahlen wider. An erster Stelle
steht die **Angebots-Erfolgsquote (Hit-Rate)** – wie viele ihrer Angebote ziehen einen Auftrag nach sich? Eine
steigende Quote ist ein Indikator dafür, dass Qualität und Timing der Angebote stimmen
. Ebenso
beobachtet sie die **Durchlaufzeit** von der Kundenanfrage bis zum fertigen Angebot. Hier zielt sie auf
wenige Tage bis maximal wenige Wochen, je nach Projektgröße – ein Wert, der durch
Prozessverbesserungen immer weiter gesenkt werden soll. Intern achtet man auch auf die **Anzahl von**

# 13

**Angebotsversionen pro Auftrag** : Viele Iterationen könnten bedeuten, dass initial etwas nicht klar war;
ideal sind wenige Schleifen. Während der Projektabwicklung gilt **Termintreue** als entscheidender KPI:
Claudia misst, ob Liefer- und Fertigstellungstermine eingehalten werden
. Jede Verzögerung fließt in
eine Statistik ein (z. B. % der Projekte, die planmäßig fertig wurden). Ein weiterer Erfolgsindikator ist die
**Zufriedenheit der Kunden** – auch wenn diese schwer quantitativ messbar ist, holt der Vertrieb oder die GF
oft Feedback ein. Geringe Reklamationszahlen wertet Claudia als Erfolg ihrer Qualitätskontrolle. Daneben
können **interne KPIs** wie „Angebote pro Monat erstellt“ oder „Projekte pro Innendienst-Mitarbeiter“
herangezogen werden, um Effizienz zu beurteilen
. Eine sinnvolle Kennzahl ist hier z. B. das Verhältnis
*Anzahl Projekte zu Innendienst-Personalstunden* , um die Produktivität zu tracken. Schließlich dienen
**Lieferanten-KPIs** (Reklamationsquote, Durchschnittliche Lieferzeit) als indirektes Maß für Claudias Erfolg
im Lieferantenmanagement
. Insgesamt hat Claudia den Anspruch, in all diesen Kennzahlen gute Werte
zu erreichen, denn sie spiegeln die Qualität ihrer Arbeit wider.

# Aktuelle Herausforderungen & Bedürfnisse: Derzeit kämpft Claudia mit ineffizienten Abläufen – sie

**Zukunftsperspektive:** Mit dem neuen integrierten System in Aussicht, blickt Claudia optimistisch nach
vorn. Sie stellt sich vor, wie in einigen Monaten Angebote direkt im CRM entstehen, per Klick ins Projekt
übergehen und sie jederzeit weiß, in welchem Status jedes Projekt ist – ob Planung, in Produktion oder
Montage
. Ihre Rolle könnte sich dadurch noch strategischer ausrichten: Statt Informationen
hinterherzulaufen, kann sie proaktiv Kunden beraten, Projekte optimieren und Daten auswerten (z. B.
Erfolgsraten, Bottlenecks). Möglicherweise wird sie zum Key-User des neuen Systems und hilft mit, es stetig
zu verbessern. Sie weiß, dass erfolgreiche Digitalisierung kein einmaliges Projekt, sondern ein fortlaufender
Prozess ist. Daher ist sie bereit, Feedback zu geben und Best Practices aus anderen Unternehmen zu
adaptieren. Letztlich sieht Claudia ihre Rolle als unverzichtbares **Bindeglied** im Unternehmen – mit
besseren Tools kann sie dieses Bindeglied noch stärker machen und damit zum Wachstum und Erfolg des
Betriebs beitragen.

# Schlussbetrachtung

Der Innendienst (Vertriebsinnendienst & Kalkulation) erweist sich in diesem Ladenbau-Unternehmen als
**Schlüsselfigur für Vertriebserfolg und operative Exzellenz** . Das strategische Referenzprofil zeigt, dass

diese Persona weit mehr leistet als „nur“ Zahlen zu drehen: Sie verbindet Kundenwünsche, kaufmännische
Kalkulation und organisatorische Umsetzung zu einem stimmigen Gesamtprozess. Gerade in Branchen wie
dem individuellen Innenausbau für Direktvermarkter, wo Projekte Unikate sind und viele Parteien
koordiniert werden müssen, steht und fällt der Erfolg mit der Effizienz des Innendienstes.

Die Analyse verdeutlicht einerseits die **aktuellen Schmerzpunkte** – Medienbrüche, Informationssilos,
manuelle Arbeit – und andererseits das **enorme Verbesserungspotenzial** durch ein integriertes CRM-/
Projektmanagement-System. Durch die Umsetzung der identifizierten Anforderungen kann der Innendienst
entscheidend entlastet werden: Angebote können schneller erstellt und verfolgt werden, iterative
Abstimmungen werden transparenter, und die Auftragsabwicklung wird durch automatisierte Workflows
lückenlos unterstützt. **Best Practices** aus vergleichbaren Kontexten untermauern die vorgeschlagenen
Lösungen und zeigen, dass die angestrebten Verbesserungen realistisch und erprobt sind. Die Persona-
Beschreibung macht auch deutlich, dass die Einführung des Systems nur erfolgreich sein wird, wenn sie die
Arbeitsrealität der Innendienstler berücksichtigt – User Experience, Flexibilität und Zuverlässigkeit sind
keine „nice-to-haves“, sondern ausschlaggebend für die Akzeptanz.

Strategisch gesehen ermöglicht ein starker Innendienst dem Unternehmen, **skalierbarer und**
**kundenorientierter** zu agieren. Höhere Angebots-Hit-Rates, bessere Termintreue und gezielte
Qualitätskontrolle (z. B. bei Lieferanten) wirken sich unmittelbar auf Umsatz und Kundenzufriedenheit aus.
Zudem gewinnt die Geschäftsführung dank zentraler Daten an Steuerungsmöglichkeiten – etwa durch
Echtzeit-Einblick in Pipeline und Projekte, oder durch Auswertungen, die vorher mangels Datenbasis nicht
möglich waren. Dies schafft die Grundlage für fundierte Entscheidungen (beispielsweise in welche Bereiche
investiert werden sollte oder wo Prozessengpässe liegen).

Abschließend lässt sich festhalten: Das Referenzprofil „Innendienst (Vertriebsinnendienst & Kalkulation)“
liefert eine
**umfassende Sicht auf die Rolle** , ihre Anforderungen und ihren Beitrag zum
Unternehmenserfolg. Es dient als Leitfaden bei der Gestaltung des neuen CRM-/PM-Systems, indem es
sicherstellt, dass die Bedürfnisse dieser Persona – Geschwindigkeit, Präzision, Übersicht und Kollaboration –
gezielt adressiert werden. Indem das Unternehmen den Innendienst mit den richtigen Werkzeugen
ausstattet und die Prozessstruktur entsprechend ausrichtet, schafft es die Voraussetzungen dafür, dass aus
interessierten Hofladen-Betreibern begeisterte Kunden werden, deren Ladenbau-Projekte effizient und zur
vollsten Zufriedenheit realisiert werden. Das kommt letztlich allen zugute: dem Vertrieb (leichtere
Abschlüsse), der Planung (klarere Vorgaben, weniger Chaos), der Buchhaltung (pünktliche Rechnungen,
weniger Fehler), der Geschäftsführung (Transparenz, Steuerbarkeit) – und natürlich dem Innendienst selbst,
der vom „Feuerwehrmodus“ hin zu einer proaktiven, strategischen Arbeitsweise wechseln kann. Dieses
Profil stellt somit einen **strategisch nutzbaren Referenzrahmen** dar, um den Innendienst als zentrale
Persona im digitalen Transformationsprojekt erfolgreich mitzunehmen.

# Quellen

**Interview-Transkript (31.10.2025)** – Experteninterview zum aktuellen Prozess und Anforderungen,
u. a. Aussagen zur Rollenverteilung, bestehenden Problemen und Wünschen an ein neues System
.
**Gesamtkonzept „Integriertes CRM- und PM-Tool“ (Finale Fassung, 2025)** – Konzeptdokument mit
Analyse der Personas, Best Practices und Anforderungskatalog. Enthält ausführliches Profil der
Persona Innendienst (Ziele, Pain Points, KPIs, Best Practices)
.

1.

# 2.

# 15

# Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf

## file://file_00000000ba60720ab13f9a40ad0725dc

### sg_interview_31.10.25_deu.txt

## file://file-X2N7Fg6zoo5PYBYJFQ9SaR

---

# Erweiterungen 2025: Predictive Workload Management & Automated Intelligence

Die folgenden Funktionen erweitern die Werkzeuge des Innendiensts um **vorausschauende Kapazitätsplanung, automatisierte Workflows und KI-gestützte Assistenz** für effizientere Angebotsprozesse.

## 📊 Prognosen & Workload-Übersicht

### Kapazitätsprognose & Resource Management

Der Innendienst benötigt **transparente Einblicke in kommende Arbeitslast** um Engpässe zu vermeiden und Prioritäten zu setzen.

**Kernanforderungen:**

**Angebots-Pipeline-Prognose:**
- **Gewichtete Incoming-Pipeline**: System zeigt erwartete Angebots-Requests basierend auf Opportunity-Status[^1]
  - Nächste 2 Wochen: 8 Opportunities in "Proposal"-Phase → voraussichtlich 5 Angebotsanfragen (Ø 62% Conversion)
  - Nächste 4 Wochen: 15 Opportunities gesamt → Forecast: 9 konkrete Anforderungen
- **Arbeitsaufwand-Schätzung**: ML-Modell berechnet voraussichtlichen Zeitbedarf pro Angebot[^2]
  - Einfaches Angebot (Standard-Hofladen, <50qm): ~3-4h Kalkulation
  - Komplexes Angebot (Vinothek mit Kühlsystemen, >80qm): ~8-12h
  - System lernt aus historischen Daten: "Ähnliche Projekte brauchten durchschnittlich 6,5h"
- **Team-Kapazität**: Verfügbare Stunden vs. erwarteter Bedarf
  - Team Innendienst: 3 Personen × 35h/Woche = 105h verfügbar
  - Prognose KW 15: 78h Bedarf (grün, 74% Auslastung)
  - Prognose KW 18: 125h Bedarf (rot, 119% → Warnung: Überlastung!)
- **Bottleneck-Alerts**: "WARNUNG: KW 18 Kapazitätsgrenze um 19% überschritten → Empfehlung: Externe Kalkulator-Unterstützung buchen"

**Projekt-Staffing-Prognose:**
- **Resource Allocation Forecast**: Welche Projekte wann starten (aus Won Opportunities)
  - Projekt A (Hofladen Müller): Start voraussichtlich KW 16 → Innendienst-Koordination 5h/Woche für 8 Wochen
  - Projekt B (Vinothek Schmidt): Start KW 18 → 8h/Woche für 12 Wochen
- **Verfügbarkeits-Check**: System warnt wenn zu viele Projekte gleichzeitig koordiniert werden müssen
  - "KRITISCH: KW 20-22: 4 aktive Projekte parallel (Maximum: 3) → Engpass in Lieferanten-Koordination"
- **Priorisierung**: Dashboard zeigt welche Projekte **kritischen Pfad** haben
  - Projekt A: Meilenstein "Materialbestellung" überfällig (3 Tage) → höchste Priorität!
  - Projekt C: Noch 2 Wochen Puffer → niedrigere Priorität

**Workload-Visualisierung:**
- **Gantt-Chart-Style-Ansicht**: Zeigt geplante Arbeitsbelastung pro Woche
  ```
  KW 14: ████░░░░░░ 40% (42h / 105h) – Ruhige Woche
  KW 15: ███████░░░ 74% (78h / 105h) – Normal ausgelastet
  KW 16: ██████████ 96% (101h / 105h) – Fast am Limit
  KW 17: ████████░░ 82% (86h / 105h)
  KW 18: █████████████ 119% (125h / 105h) – ÜBERLASTUNG!
  ```
- **Farbcodierung**: Grün (<80%), Gelb (80-95%), Orange (95-105%), Rot (>105%)
- **Drill-Down**: Klick auf Woche → Details: Welche Angebote/Projekte treiben Workload?

**Technische Umsetzung**:
- **Predictive Models**: Random Forest für Angebots-Complexity-Scoring[^3]
- **Resource Capacity Planning**: Algorithmus aus Project Management Best Practices[^4]
- **Real-Time Updates**: CDC (Change Data Capture) triggert Neuberechnung bei Opportunity-Änderungen[^5]

[^1]: Quelle: Research "Sales Forecasting Methods" – Opportunity-to-Proposal Conversion Rates
[^2]: Quelle: Research "Forecasting Methods" – ML-Based Workload Estimation
[^3]: Quelle: Research "ML Opportunity Scoring" – Complexity Scoring via Random Forest
[^4]: Quelle: Research "Capacity Forecasting" – Resource Allocation Best Practices
[^5]: Quelle: Research "Real-Time Dashboards" – CDC für Live-Updates

## 📈 Dashboard & Alerts

### Innendienst Command Center

Ein **zentrales Dashboard** gibt dem Innendienst-Team Echtzeit-Überblick über Workload, Priorities und Bottlenecks.

**Dashboard-Struktur:**

**Top-Level KPIs (Always Visible):**
- **Offene Angebotsanfragen**: 12 Stück (davon 3 überfällig >48h ⚠️)
- **Aktive Projekte**: 8 Stück in Koordinationsphase
- **Team-Auslastung**: 87% (diese Woche), Prognose nächste Woche: 119% (rot)
- **Avg. Response Time**: 18h (Ziel: <24h, grün ✓)
- **Angebots-Conversion-Rate**: 58% (letzten 30 Tage)

**Priority Queue:**
- **Sortiert nach Dringlichkeit**:
  1. 🔴 **Hofladen Müller**: Angebot überfällig (3 Tage), Kunde wartet
  2. 🔴 **Projekt Y**: Materialbestellung blockiert, Lieferanten-Eskalation erforderlich
  3. 🟡 **Vinothek Schmidt**: Angebots-Iteration V3 angefordert (noch 1 Tag Puffer)
  4. 🟢 **Florist Blume**: Neues Angebot angefordert (noch 5 Tage Zeit)
- **Smart Sorting**: ML-Algorithmus berücksichtigt
  - SLA-Fristen (vertraglich vereinbarte Response-Zeiten)
  - Opportunity-Wert (höherer Umsatz = höhere Priorität)
  - Kundenstatus (VIP-Kunden zuerst)
  - Interne Abhängigkeiten (blockiert Projekt X andere Tasks?)

**Angebots-Status-Übersicht:**
- **Kanban-Board-View**:
  ```
  Neu (4) | In Kalkulation (6) | Warte auf Freigabe (3) | Gesendet (8) | Angenommen (2)
  ```
- **Drag & Drop**: Angebotsanfragen zwischen Spalten verschieben
- **Color-Coding**: Rot = überfällig, Gelb = läuft bald ab, Grün = im Zeitplan
- **Quick Actions**: Rechtsklick → "Angebot als PDF exportieren", "Version anlegen", "Kunde kontaktieren"

**Projekt-Koordinations-Dashboard:**
- **Active Projects Overview**:
  - Projekt A: Material bestellt ✓, Montage geplant KW 16, Team zugewiesen
  - Projekt B: Lieferanten-Problem (Verzögerung 1 Woche) ⚠️
  - Projekt C: On Track, nächster Meilenstein in 3 Tagen
- **Meilenstein-Timeline**: Zeigt kritische Termine für alle Projekte
- **Team Assignments**: Wer koordiniert welches Projekt? Überlastet jemand?

**Automated Alerts:**
- **Proaktive Warnungen**[^6]:
  - "⚠️ Angebot 'Hofladen Müller' seit 72h ohne Bearbeitung"
  - "🔴 Projekt Y: Liefertermin gefährdet – Material-Lieferung verzögert"
  - "🟡 Nächste Woche: Kapazitätsgrenze um 19% überschritten – externe Hilfe prüfen"
  - "✅ Angebot 'Vinothek Schmidt' vom Kunden angenommen – Projekt anlegen?"
- **Delivery per Slack/E-Mail/In-App**: Konfigurierbar pro User
- **Escalation Rules**: Bei kritischen Delays → Auto-Benachrichtigung an Teamleiter

**Real-Time Collaboration Indicators:**
- **Live-Status**: Zeigt wer gerade an welchem Angebot arbeitet ("Julia bearbeitet gerade Kalkulation X")
- **Lock Mechanism**: Verhindert gleichzeitiges Bearbeiten desselben Angebots
- **Recent Activity**: "Markus hat vor 5 Minuten Kommentar hinzugefügt"

[^6]: Quelle: Research "n8n Automation" – Automated Alert Systems für Team-Coordination

## 🤖 n8n-gestützte Automation

### Intelligent Workflow Automation

Der Innendienst profitiert von **n8n-gesteuerten Automatisierungen**, die repetitive Tasks übernehmen und proaktiv assistieren.

**Automated Quote Reminders:**

**Trigger**: Angebot versendet, aber keine Rückmeldung nach X Tagen
- **Tag 3**: System sendet freundliche Nachfass-E-Mail an Kunde[^7]
  - "Guten Tag Herr Müller, haben Sie Gelegenheit gehabt unser Angebot zu prüfen? Bei Fragen stehen wir gerne zur Verfügung."
- **Tag 7**: Zweite Erinnerung + Benachrichtigung an Innendienst
  - "⚠️ Angebot 'Hofladen Müller' seit 7 Tagen ohne Feedback – Empfehlung: Telefonische Nachfrage"
- **Tag 14**: Eskalation an Außendienst
  - "🔴 Angebot seit 2 Wochen offen → @Markus bitte Kundenkontakt herstellen"

**Personalisierbar**: Innendienst kann Zeitintervalle und Templates konfigurieren

**Supplier Auto-Inquiry:**

**Trigger**: Neues Angebot benötigt Sonderteile (nicht in Preisliste)
- **n8n Workflow**[^8]:
  1. Erkennt: "Position 'Spezial-Kühltheke 2,5m' nicht in Standardpreisliste"
  2. Extrahiert Spezifikationen aus Angebot
  3. Sendet automatisch Anfrage an 3 Lieferanten via E-Mail/API
  4. Sammelt Antworten und erstellt Vergleichstabelle
  5. Benachrichtigt Innendienst: "Lieferantenangebote eingetroffen, bitte prüfen"
- **Time Savings**: 2-3h manuelle Arbeit → 15 Min Review
- **Consistency**: Anfragen immer vollständig (keine vergessenen Specs)

**Automated Project Kickoff:**

**Trigger**: Angebot wird vom Kunden angenommen (Status → "Won")
- **n8n Auto-Actions**[^9]:
  1. **Projekt anlegen**: Aus Opportunity automatisch Projekt erstellen (alle Daten übertragen)
  2. **Team benachrichtigen**: Planungsabteilung + Montage-Team informieren
     - "@Planung: Projekt 'Hofladen Müller' startet – Produktionszeichnungen vorbereiten"
     - "@Montage: Voraussichtlicher Termin KW 16 – Kapazität reservieren"
  3. **Tasks generieren**: Standard-Tasks automatisch anlegen
     - "Materialbestellung prüfen"
     - "Liefertermine koordinieren"
     - "Kundenkommunikation: Projektstart-Bestätigung"
  4. **Calendar Sync**: Meilensteine in Teamkalender eintragen
  5. **Dokumente vorbereiten**: Templates für Auftragsbestätigung, Projektmappe generieren

**Human-in-the-Loop**: Innendienst kann Auto-Actions vor Ausführung reviewen (optional)

**Supplier Performance Tracking:**

**Continuous Monitoring**: n8n überwacht Lieferanten-Zuverlässigkeit[^10]
- **Liefertermin-Tracking**: Vergleich "zugesagt" vs. "tatsächlich geliefert"
  - Lieferant A: 95% pünktlich (grün, zuverlässig)
  - Lieferant B: 68% pünktlich (gelb, Verzögerungen häufig)
  - Lieferant C: 42% pünktlich (rot, kritisch!)
- **Automated Alerts**: "⚠️ Lieferant C hat erneut Verzögerung gemeldet – Alternative Quelle prüfen?"
- **Auto-Recommendations**: System schlägt bessere Lieferanten vor
  - "Tipp: Position 'Regalsystem X' von Lieferant A statt C bestellen (historisch 2 Wochen schneller)"

**Price Update Monitoring:**

**Trigger**: Lieferanten-Preislisten ändern sich
- **n8n Webhook**: Empfängt Preisänderungen von Lieferanten-APIs[^11]
- **Auto-Update**: Interne Preislisten werden aktualisiert
- **Impact Analysis**: System berechnet Auswirkungen auf offene Angebote
  - "⚠️ Material X: Preiserhöhung +8% → Angebot 'Hofladen Müller' betroffen (Marge sinkt von 28% auf 24%)"
- **Alert**: Innendienst erhält Benachrichtigung + Empfehlung
  - "Empfehlung: Angebot neu kalkulieren oder Kunde kontaktieren vor Freigabe"

**Automated Report Generation:**

**Weekly Innendienst Performance Report**:
- **Trigger**: Jeden Freitagabend 17 Uhr
- **n8n Workflow** aggregiert Wochendaten:
  - Anzahl erstellte Angebote (diese Woche: 12)
  - Durchschnittliche Response Time (18h, Ziel: <24h ✓)
  - Conversion Rate (58%, leicht unter Vorwoche 62%)
  - Top Bottlenecks (3 Angebote >48h in "Warte auf Freigabe")
  - Team-Auslastung (Durchschnitt: 84%)
- **LLM-generierte Zusammenfassung**:
  - "Diese Woche wurden 12 Angebote erstellt, 7 versendet, 4 angenommen. Response Time im Ziel. Auffällig: 3 Angebote warten seit >48h auf Planer-Freigabe → Bottleneck identifiziert."
- **Export**: PDF-Report via E-Mail an Team + GF

[^7]: Quelle: Research "n8n Automation" – Automated Follow-Up Workflows
[^8]: Quelle: Research "n8n CRM Automation" – Supplier Inquiry Automation Pattern
[^9]: Quelle: Research "n8n Agent Orchestration" – Multi-Step Project Kickoff Workflows
[^10]: Quelle: Research "n8n Monitoring" – Continuous Supplier Performance Tracking
[^11]: Quelle: Research "n8n Integration Patterns" – Webhook-Based Price Update Monitoring

## 💡 KI-gestützte Angebotserstellung

### AI-Powered Quote Assistant

Künstliche Intelligenz unterstützt den Innendienst bei der **schnelleren, präziseren Angebotserstellung**.

**Smart Quote Templates:**

**KI-Vorschlagsengine**:
- Innendienst wählt Projekttyp: "Hofladen, 60qm, Standard"
- **LLM-System** (LlamaIndex)[^12] sucht ähnliche historische Projekte via **Vector Search**
- **Top 3 ähnlichste Projekte** werden vorgeschlagen:
  - Projekt A (2024): Hofladen Müller, 58qm → Ähnlichkeit: 94%
  - Projekt B (2023): Hofladen Schmidt, 65qm → Ähnlichkeit: 89%
  - Projekt C (2023): Bio-Laden Grün, 55qm → Ähnlichkeit: 87%
- **Template Auto-Population**: System kopiert typische Positionen automatisch ins neue Angebot
  - Standard-Regalsystem (Position aus Projekt A)
  - Kühltheke 2m (Position aus Projekt B)
  - LED-Beleuchtung (Standard bei allen 3 Projekten)
- **Zeitersparnis**: Statt 3h Neu-Kalkulation → 45 Min Review & Anpassung

**Semantic Search für Positionen:**
- Innendienst sucht: **"Weinregal mit Beleuchtung"**
- Vector Search (Pinecone/Weaviate)[^13] findet semantisch ähnliche Positionen:
  - "Premium-Weinregal mit integrierter LED-Beleuchtung" (Projekt X)
  - "Holz-Weinständer beleuchtet" (Projekt Y)
  - "Regalsystem Vinothek mit Spots" (Projekt Z)
- **Kein exaktes Keyword-Matching nötig**: KI versteht Synonyme, Konzepte
- **Preisvergleich**: System zeigt historische Preise + aktuelle Lieferantenpreise

**Margin Optimization Suggestions:**

**KI-Marge-Analyse**:
- System analysiert Angebot während Erstellung
- **Alerts bei niedrigen Margen**:
  - "⚠️ Position 'Spezial-Kühltheke': Marge nur 12% (Ziel: >25%) → Preis zu niedrig oder Kosten zu hoch?"
- **Optimierungs-Vorschläge**[^14]:
  - "Tipp: Alternative Lieferant B für Position X spart €380 → Marge steigt von 22% auf 28%"
  - "Warnung: Material-Aufschlag nur 1,5x (Standard: 1,8x) → Korrektur empfohlen"
- **Comparative Analysis**: "Ähnliche Projekte hatten Durchschnitts-Marge 30% → Dein Angebot: 24% (6% unter Durchschnitt)"

**Automated Quality Checks:**
- **Vollständigkeits-Check**: "Fehlt: Transportkosten, Montagekosten (in 95% ähnlicher Angebote enthalten)"
- **Plausibilitäts-Check**: "Ungewöhnlich: Position 'Regalsystem' nur €2.200 (Durchschnitt bei ähnlichen Projekten: €4.500) → Prüfung empfohlen"
- **Fehler-Detection**: "Duplikat erkannt: Position 14 und 28 sind identisch"

**Natural Language Query für Preise:**

**Conversational Interface**:
- Innendienst fragt: **"Was hat eine 3m-Kühltheke beim letzten Vinothek-Projekt gekostet?"**
- **RAG-System** (LlamaIndex)[^15]:
  1. Vector Search findet relevante Projekte (Embeddings: "Kühltheke", "Vinothek", "3m")
  2. Retrieviert: Projekt "Vinothek am Marktplatz" (2024)
  3. **LLM-Antwort**: "Im Projekt 'Vinothek am Marktplatz' (April 2024) kostete eine 3m-Kühltheke €4.850 (Lieferant: KühlTech GmbH). Aktuelle Preisliste: €5.200 (+7,2% Inflation). **Quelle**: Angebot V-2024-0042 [Link]"
- **Follow-Up Queries**: "Gab es bei dem Projekt Probleme?" → KI durchsucht Projekt-Notizen, Protokolle
- **Confidence Scores**: "Diese Antwort basiert auf 1 konkretem Datenpunkt (Konfidenz: 85%)"

**Weiteres Use Case: "Welche Materialien haben wir bei Hofläden am häufigsten verbaut?"** → Automatische Aggregation & Ranking

**Automated Proposal Generation (Experimental):**

**End-to-End AI Assistant**:
- **Input**: Opportunity-Daten + Kundenbriefing + Planungsunterlagen
- **n8n Workflow** orchestriert LLM-Chain[^16]:
  1. **Analyse**: LLM extrahiert Kernanforderungen aus Kundenbriefing
     - "Kunde wünscht: 60qm Hofladen, Schwerpunkt regionale Produkte, Budget ~€50K"
  2. **Template Selection**: Vector Search findet 3 beste Referenzprojekte
  3. **Position Generation**: LLM schlägt Positionen vor basierend auf Templates
  4. **Price Lookup**: System holt aktuelle Preise aus Lieferanten-APIs / Preisliste
  5. **Margin Calculation**: Auto-Berechnung mit Ziel-Marge 28%
  6. **Draft Generation**: Vollständiges Angebots-PDF wird erstellt (inkl. Text-Intro, Positionen, Summen)
- **Human Review**: Innendienst prüft & adjustiert (wichtig: nicht blind versenden!)
- **Zeitersparnis**: Erst-Entwurf in 10 Min statt 2h

**DSGVO-Konformität**:
- **On-Premise LLM Option**: Lokales Llama 70B für sensible Kundendaten[^17]
- **Data Filtering**: Nur nicht-personenbezogene Daten an Cloud-LLMs
- **Audit Trails**: Alle KI-Generierungen geloggt (wer, wann, was)

[^12]: Quelle: Research "LlamaIndex" – Optimiert für Document Retrieval in CRM
[^13]: Quelle: Research "Vector Databases" – Semantic Search für Produkt-Positionen
[^14]: Quelle: Research "ML Models" – Margin Optimization via Comparative Analysis
[^15]: Quelle: Research "RAG Architecture" – Conversational Query über Geschäftsdaten
[^16]: Quelle: Research "LangChain Agents" – Multi-Step Workflow Orchestration für Proposal Generation
[^17]: Quelle: Research "DSGVO Compliance for LLMs" – On-Premise Hosting für Datenschutz

**Collaborative AI Editing:**

**Gemini-Style Inline Suggestions**:
- Innendienst tippt in Angebots-Beschreibung: "Regalsystem für..."
- **AI Auto-Complete**: "...regionale Produkte, 3m Breite, Massivholz Eiche, inkl. LED-Beleuchtung"
- **Accept/Reject**: Innendienst kann Vorschlag annehmen oder modifizieren
- **Context-Aware**: KI berücksichtigt Projektkontext (Hofladen vs. Vinothek → andere Vorschläge)

**Tone & Style Assistance**:
- Innendienst schreibt technische Angebots-Beschreibung: "Regalsystem 3m, Holz, LED"
- **LLM poliert auf**: "Hochwertiges Regalsystem aus massiver Eiche, 3 Meter Breite, mit integrierter LED-Beleuchtung für optimale Produktpräsentation"
- **Mehrsprachig**: Auto-Übersetzung für internationale Kunden (Englisch, Französisch)

**Learning from Feedback:**
- System trackt: Welche KI-Vorschläge wurden angenommen/abgelehnt?
- **Continuous Improvement**: ML-Modell lernt Präferenzen des Teams
- Beispiel: "Team lehnt immer 'Massivholz' ab bei Budget <€40K → KI schlägt künftig 'Furnierholz' vor"

---

# Phase 2: Echtzeit-Kollaboration & Reduzierung von Medienbrüchen

**Relevant für:** Innendienst – Team-Synchronisation & weniger E-Mail-Overhead

## 🔔 Activity Feed & Smart Notifications (Phase 2.1)

**Problem:** Wichtige Updates (Angebots-Freigabe, Task-Assignment, Außendienst hat neuen Lead übergeben) gehen in E-Mail-Flut unter.

**Lösung:**
- **Real-Time Activity Stream:** Innendienst sieht LIVE was passiert (Socket.IO WebSocket)
  - "Außendienst Markus hat Lead 'Hofladen Schmidt' übergeben – bitte Angebot erstellen"
  - "Planer hat Design für Projekt XY fertiggestellt – bereit für Kalkulation"
  - "Kunde hat Angebot freigegeben – Projekt kann starten"
- **@-Mentions:** "@Innendienst: Kunde möchte Alternativ-Angebot mit anderem Holz"
- **Intelligent Filtering:** Nur relevante Events (konfigurierbar per Rolle)
- **Mobile Push:** PWA-Benachrichtigungen auf Smartphone (auch offline-fähig)

**Impact:**
- -40% weniger "Hab ich nicht mitbekommen"-Eskalationen
- 2-3x schnellere Reaktionszeit (vorher 1 Tag → jetzt <4h)
- Weniger E-Mail-Overhead (von 50 E-Mails/Tag → 20 E-Mails/Tag)

---

## 💬 Contextual Commenting (Phase 2.1)

**Problem:** Diskussionen über Angebots-Positionen laufen in E-Mail/Slack → Kontext verloren, nicht nachvollziehbar.

**Lösung:**
- **Kommentare direkt AN Entitäten:**
  - Angebots-Position: "Kann man hier günstigeres Material verwenden?"
  - Task: "Warum dauert Lieferung 3 Wochen statt 1 Woche?"
  - Projekt-Meilenstein: "Kunde hat Freigabe verweigert - Grund: Design gefällt nicht"
- **Threaded Discussions:** Antworten auf Kommentare → strukturierte Threads
- **Audit Trail:** Alle Entscheidungen nachvollziehbar (GoBD-konform)
- **@-Mentions:** "@Planer: Bitte alternative Grundriss-Variante entwerfen"

**Impact:**
- 100% Transparenz (keine "Lost E-Mails")
- GoBD-konform: Änderungsrechtfertigungen dokumentiert
- Weniger Missverständnisse (Kontext bleibt erhalten)

---

**Siehe auch:**
- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` → Pillar 2 (Collaboration)
- `docs/architectur/` → Real-Time-Kommunikationsarchitektur (Socket.IO)

---

### 16

