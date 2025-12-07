# Produktvision „Finanz- & Compliance-Management“

> **Status:** 🗄️ Archiviert. Diese PDF-Konvertierung wird nicht mehr gepflegt und wurde durch die konsolidierte Version [„Produktvision Finanz- und Compliance-Management“](./Produktvision%20Finanz-%20und%20Compliance-Management.md) (v2.0) ersetzt. Neue Inhalte oder Korrekturen bitte ausschließlich dort einpflegen.

_Converted from: Produktvision „Finanz- & Compliance-Management“.pdf_

---

# Produktvision „Finanz- & Compliance-

### Executive Summary

Die fachliche Domäne **Finanz- & Compliance-Management** bildet das finanzielle Rückgrat des geplanten
integrierten CRM- und Projektmanagement-Tools für ein Ladenbau-/Innenausbau-Unternehmen. Ziel ist es,
**Vertriebs- und Projektprozesse nahtlos mit den Finanzprozessen zu verzahnen** . Sämtliche kunden- und
projektbezogenen Finanzdaten – von Angeboten über Teil- und Schlussrechnungen bis zu Zahlungen –
sollen zentral verfügbar und GoBD-konform archiviert sein. Dadurch entsteht eine _360°-Sicht_ auf jeden
Auftrag, die es allen Beteiligten ermöglicht, jederzeit den aktuellen finanziellen Projektstand und offene
Posten einzusehen.

Im derzeitigen Prozess bestehen Medienbrüche und manuelle Abstimmungen zwischen Vertrieb,
Innendienst und Buchhaltung (z. B. informelle Zurufe per E-Mail/Telefon), was zu **Intransparenz,**
**Verzögerungen und Fehlerpotential** führt. Die Vision für das Finanz- & Compliance-Modul ist ein
**einheitliches System als „Single Source of Truth“** für alle finanzrelevanten Vorgänge. Dieses Modul soll
**Rechnungsplanung, -stellung und -verfolgung automatisieren** , die **Datenintegrität sicherstellen** und
gesetzlichen Vorgaben (GoBD, DSGVO) „by design“ genügen.

Alle relevanten **Personas** – von der Buchhalterin über den Geschäftsführer bis zum Vertriebsaußendienst
und Innendienst – werden in ihren jeweiligen Zielen und Pain Points adressiert. Beispielsweise garantiert
das System der Buchhaltung fristgerechte Rechnungsstellung ohne händische Erinnerungen, der
Geschäftsführung einen Echtzeit-Überblick über Umsatz und offene Forderungen, dem Außendienst eine
einfache Erfassung von Auslagen unterwegs und dem Innendienst konsistente Abläufe ohne
Informationsverluste an Abteilungsgrenzen.

Die nachfolgende Ausarbeitung liefert zunächst eine **Domänen-Analyse** , klärt Begriffe, Abgrenzungen und
Ziele und löst Widersprüche aus dem Input auf. Anschließend werden die **Anforderungen der relevanten**
**Personas** detailliert dem Finanzmodul zugeordnet und etwaige Gaps mit Lösungsentscheidungen
dokumentiert. Darauf folgt eine **vollständige Anforderungsliste** (funktional und nicht-funktional) mit
Priorisierung, Abnahmekriterien und Nicht-Zielen. Darauf aufbauend beschreibt das Dokument die
**Produktvision und das Zielbild** der Lösung, skizziert den **Lösungsansatz** mit Prozessen, Regeln und
Automatisierungen, definiert **Schnittstellen** zu benachbarten Domänen, erläutert **Qualitätsmerkmale**
**und Risiken** (inkl. Maßnahmen) und listet abschließend **offene Punkte** samt Klärungsvorschlägen.
Sämtliche Aussagen und Entscheidungen beruhen ausschließlich auf den bereitgestellten
Projektmaterialien (Interview, Gesamtkonzept, Persona-Dokumente), um ein
**konsistentes,**
**beleggestütztes Gesamtbild** der Domäne Finanz- & Compliance-Management im geplanten CRM/PM-
System zu zeichnen.

# 1. Domänen-Challenge (Finanz- & Compliance-Management)

**Definition & Umfang:** Die Domäne _Finanz- & Compliance-Management_ umfasst alle finanziellen Abläufe im
Zusammenhang mit Kundenprojekten sowie die Einhaltung einschlägiger Richtlinien (v. a. GoBD und
DSGVO). Wichtig ist die Abgrenzung: Das neue System soll **keine vollumfängliche Buchhaltungssoftware**
ersetzen. Stattdessen konzentriert sich die Domäne darauf, den
**fachlichen Prozess der**
**Rechnungsstellung und -verfolgung** in Projekten zu orchestrieren und Daten so aufzubereiten, dass sie
den gesetzlichen Anforderungen genügen. Die eigentliche Finanzbuchhaltung (Hauptbuch, Steuer, Lohn)
bleibt in der bestehenden Software (hier: Lexware) verankert, welche als führendes System bestehen bleibt.
Das CRM/PM-Tool übernimmt also die **Projektfinanzen (Auftragswert, Teilrechnungen, Zahlungen,**
**Offene Posten)** und stellt Schnittstellen zur Übergabe an die Finanzbuchhaltung bereit.

**Begriffe & Hauptobjekte:** Zentrale Fachbegriffe der Domäne sind klar zu definieren, um Missverständnisse

zu vermeiden:

_Rechnung_ : Forderung an den Kunden mit eindeutiger Nummer, Betrag, Leistungszeitraum und
Fälligkeitsdatum. Es gibt **Abschlagsrechnungen** (Teilzahlungen während des Projekts) und
**Schlussrechnungen** (Endabrechnung nach Fertigstellung). Jede Rechnung gehört zu einem Projekt
und einem Kunden.
_Rechnungsplan_ : Zeitplan für zu stellende Rechnungen pro Projekt, typischerweise in Raten (z. B. „30 %
bei Auftrag, 50 % 4 Wochen vor Montage, 20 % nach Abschluss“). Der Plan wird zu Projektbeginn
festgelegt und soll im System hinterlegt werden.
_Zahlung_ : Erfasster Zahlungseingang zu einer Rechnung (Datum, Betrag), der mit der Rechnung
verknüpft ist. Daraus leitet sich der **Offene-Posten-Status** ab – also ob und wie lange eine Rechnung
überfällig ist.
_Offene Posten_ : Offene Forderungen gegenüber Kunden. Das System soll auf einen Blick zeigen,
welche Rechnungen noch unbezahlt sind und wie viele Tage die Fälligkeit überschritten ist.
_Audit-Trail_ : Änderungs- und Zugriffshistorie wichtiger Datensätze (z. B. Rechnungen), um
**Nachvollziehbarkeit** sicherzustellen. Dies ist ein GoBD-Erfordernis, um nachzuweisen, wer wann
welche Änderungen vorgenommen hat.
_Archivierung_ : Markierung eines Datensatzes als aufbewahrungspflichtig für einen bestimmten
Zeitraum (i.d.R. 10 Jahre für steuerrelevante Belege, gemäß GoBD). Archivierte Daten dürfen vor
Ablauf der Frist nicht gelöscht oder verändert werden.
_Einwilligung_ : Zustimmungsdatensatz pro Kontakt bezüglich DSGVO (z. B. wofür und wann ein Kunde
der Datenverarbeitung zugestimmt hat). Dieser Begriff spielt im Finanzmodul indirekt eine Rolle, da
Kundendaten (z. B. auf Rechnungen) nur mit gültiger Einwilligung für bestimmte Zwecke (Newsletter
etc.) genutzt werden dürfen.

**Aktuelle Herausforderungen:** Die Analyse der Projektmaterialien zeigt mehrere Pain Points und
Inkonsistenzen im Ist-Zustand, die durch die neue Lösung adressiert werden müssen:

_Medienbrüche und manuelle Prozesse:_ Derzeit existiert **kein durchgängiges System** – Vertrieb,
Innendienst und Buchhaltung arbeiten mit separaten Werkzeugen (Excel-Listen, Word-Dokumente,
E-Mails, Lexware) und kommunizieren Vorgänge oft formlos per Zuruf. Beispielsweise muss die
Buchhalterin aktuell **manuell vom Innendienst erfahren, wann welche Rechnung gestellt**
**werden soll** , etwa wenn ein Montage-Termin ansteht (Fälligkeit der 2. Rate). Diese informellen
Absprachen sind unklar geregelt und führen zu **Verspätungen oder Unsicherheit** in der

Rechnungsstellung. Ein Interview-Zitat bestätigt: _„Im aktuellen Prozess gibt der Außendienst oft per_
_Zuruf Bescheid, wann eine Rechnung raus soll, was inkonsistent ist“_ . Dieses Vorgehen soll durch das
System **standardisiert und automatisiert** werden, damit nichts „in der mündlichen Absprache
vergessen“ wird.
_Doppelte Datenhaltung:_ Die Finanzbuchhaltung nutzt ein getrenntes Programm (Lexware) ohne
direkte Verknüpfung zum Projektmanagement. Rechnungen müssen dort **manuell anhand von**
**Innendienst-Infos** (Betrag, Fälligkeit aus dem Angebot) neu angelegt werden. Jede manuelle
Übertragung birgt Fehlergefahr (z. B. Tippfehler beim Datum oder Betrag). Dieses
Redundanzproblem – Daten mehrfach in verschiedenen Systemen pflegen – soll durch **Integration**
**oder Schnittstellen** gelöst werden. Ziel ist: _Keine_ doppelte Erfassung von Rechnungsdaten mehr,
sondern **einmalige Eingabe mit zentraler Weiterverwendung** .
_Intransparenz beim Forderungsmanagement:_ Aktuell erfolgt das Mahnwesen und die
Zahlungsverfolgung unstrukturiert. Wenn Kunden nicht fristgerecht zahlen, ist unklar geregelt, **wer**
**nachfasst** – Vertrieb oder Buchhaltung. Oft „passiert die Koordination informell“, so dass mitunter
**niemand erinnert** , weil jeder annimmt, der andere tue es. Dadurch kann es vorkommen, dass
offene Rechnungen zu spät oder gar nicht nachverfolgt werden – ein Risiko für die Liquidität. Das
neue System muss hier klare Verantwortlichkeiten schaffen und **automatisierte Mahn-Hinweise**
generieren, damit kein Vorgang untergeht.
_Unsicherheit bei Compliance:_ Die Buchhaltung äußert **Bedenken hinsichtlich der Digitalisierung**
**und Archivierung** wichtiger Belege. Momentan liegen unterschriebene Angebote/Aufträge oft nur
in Papierordnern; bei der Umstellung auf ein digitales System muss gewährleistet sein, dass solche
Dokumente **revisionssicher** abgelegt werden (Unveränderbarkeit, Nachvollziehbarkeit). Ohne
geeignete Funktionen könnte die Nachvollziehbarkeit leiden, „wer was genehmigt oder geändert
hat“ – was im Fehlerfall problematisch wäre
. Die Herausforderung besteht also darin, _digitale_
_Prozesse so zu gestalten, dass sie den GoBD entsprechen_ , etwa durch ein vollständiges
Änderungsprotokoll und Archivierungsmechanismen.
_Zielkonflikt DSGVO vs. GoBD:_ Eine weitere Domänen-Besonderheit ist das Spannungsfeld zwischen
**Datenschutz und Aufbewahrungspflichten** . DSGVO verlangt, personenbezogene Daten _nicht_
_länger als nötig_ vorzuhalten bzw. auf Verlangen zu löschen, während die GoBD für steuerrelevante
Daten eine **Aufbewahrung von 10 Jahren** vorschreibt. Im Kontext von Projektdaten (Kundendaten
in Rechnungen) gilt geschäftlich die längere Frist (10 Jahre). Das System muss also sicherstellen, dass
Kunden- und Projektdaten **mindestens 10 Jahre unverändert gespeichert** bleiben, bevor sie
gelöscht oder anonymisiert werden dürfen. Best Practice ist hier, die längste Frist anzuwenden und
z. B. automatische Archivstatus nach +10 Jahren zu setzen mit einem Löschvorschlag. Diese
Anforderungen sind im Konzept eingeplant, erfordern aber klare Prozesse, um dem Grundsatz
_„Privacy by Design“_ zu genügen (siehe Compliance-Funktionen unten).

**Ziele der Domäne:** Aus den genannten Herausforderungen leiten sich die Kernziele des Finanz- &
Compliance-Moduls ab:

**Standardisierung und Automatisierung** der Finanzprozesse rund um Projekte: Das Tool soll z. B.
Rechnungstermine automatisch einplanen und Aufgaben zur Rechnungserstellung generieren,
anstatt sich auf Zuruf oder manuelles Nachhalten zu verlassen. Nichts darf „vergessen“ werden –
jede Teilrechnung wird systematisch zum richtigen Zeitpunkt gestellt.
**Durchgängige Transparenz** über alle finanziellen Projektaspekte: Jeder berechtigte Nutzer
(Vertrieb, Innendienst, GF) soll in der Projektansicht sofort sehen können, welche Rechnungen
gestellt wurden, welche Beträge bezahlt sind und was ggf. überfällig ist. Dadurch werden

Verzögerungen erkannt und **Chancen oder Risiken rechtzeitig sichtbar** , z. B. wenn ein Kunde im
Verzug ist und der Vertrieb reagieren muss.
**Integration statt Insellösungen:** Das Finanzmodul muss eng mit den anderen Domänen verzahnt
arbeiten (Vertrieb & Pipeline, Projektabwicklung, ggf. Zeiterfassung). So sollen Vertriebsdaten (z. B.
Auftragswert) nahtlos ins Finanzmodul fließen und umgekehrt Finanzdaten (z. B. Zahlungsstatus) ins
Projektcontrolling und Management-Reporting. Zudem soll eine **Schnittstelle zur bestehenden**
**Buchhaltung** bestehen, um Doppelerfassungen zu vermeiden. Langfristig entsteht ein einziger
Datenpool, der alle Abteilungen informiert (Stichwort _“Single Source of Truth“_ ).
**Compliance by Design:** Alle relevanten **GoBD-Prinzipien (Nachvollziehbarkeit,**
**Unveränderbarkeit, Aufbewahrung)** und **DSGVO-Grundsätze** (Datenminimierung, Zweckbindung,
Recht auf Löschung/Auskunft) müssen von Anfang an im Systemkonzept verankert sein. Beispiel:
Sobald eine Rechnung final erstellt ist, darf sie nicht mehr stillschweigend geändert oder gelöscht
werden – Korrekturen nur über Storno mit neuer Belegnummer. Alle Änderungen an
rechnungsrelevanten Daten sind zu protokollieren (Audit-Trail). Kundendaten können auf Anfrage
exportiert oder anonymisiert werden, sofern keine Aufbewahrungspflicht entgegensteht. Diese
Features sollen sicherstellen, dass das Unternehmen **ohne Zusatzaufwand gesetzeskonform**
**arbeitet** – das System erzwingt die Einhaltung, anstatt sich auf manuelle Disziplin zu verlassen.

**Auflösung von Inkonsistenzen:** Im Projektkontext traten teils widersprüchliche Annahmen oder fehlende
Details zutage, die im Konzept bereinigt wurden:

Das Interview ließ offen, ob bereits ein Buchhaltungssystem existiert – im Konzept wird klargestellt,
dass **Lexware** als Finanzsystem genutzt wird und angebunden werden muss. Dieser Widerspruch
(unbekannt vs. bekanntes FiBu-System) wurde aufgelöst, indem Lexware als Integrationsfaktor
eingeplant ist.
Einerseits soll das CRM/PM-Tool Rechnungen idealerweise **selbst erzeugen** können (inkl.
fortlaufender Nummer und PDF-Ausgabe), andererseits darf es nicht gegen GoBD verstoßen oder
die Buchhaltung doppeln. Die Lösung: Das System kann Rechnungsdaten erfassen und pdf-
generieren, **synchronisiert diese aber mit Lexware** (bzw. übergibt sie via Schnittstelle), um den
offiziellen Nummernkreis und die Buchhaltung zu bedienen. So wird _Automation_ ermöglicht, ohne
die Ordnungsmäßigkeit zu gefährden.
Ein weiteres Beispiel: Die Buchhaltung wünscht sich streng genommen, dass **alle projektrelevanten**
**Kosten** erfasst werden (für Nachkalkulation), während das initiale Konzept nur die
Ausgangsrechnungen fokussiert. Hier wurde die Annahme getroffen, fortgeschrittenes
Kostencontrolling zunächst _optional_ zu behandeln, da es für den MVP eventuell zu komplex wäre.
Stattdessen könnte simpel die Ist-Marge je Projekt am Ende erfasst werden. Dieses Spannungsfeld
wird in den _Offenen Punkten_ (Umfang des Finanzmoduls) nochmals aufgegriffen und ein
Lösungsvorschlag skizziert.

**Identifizierte Risiken (Domäne):** Bei der Domänenanalyse wurden Risiken erkannt, die es im
Lösungsdesign zu mitigieren gilt:

_Abhängigkeit von Disziplin:_ Automatisierung hilft nur, wenn die Nutzer die erforderlichen Eingaben
machen. Beispielsweise muss die Buchhaltung **Zahlungseingänge zeitnah im System markieren** ,
sonst würde das System zu Unrecht offene Posten anzeigen und evtl. Mahnalarme schicken. Dieses
Risiko erfordert klare Prozesse und Verantwortlichkeiten: Wer pflegt welche Daten bis wann (z. B.
Zahlung innerhalb 1 Werktag verbuchen) und regelmäßige Schulungen.

_Komplexität vs. Nutzen:_ Die Domäne bietet Spielraum für umfangreiche Funktionen (z. B.
vollumfängliches Projektcontrolling, automatische Provisionierung, etc.). Ein Risiko ist _Feature Creep_ :
dass immer mehr Funktionen gewünscht werden und das System überfrachtet wird. So könnte
jemand rufen „Können wir nicht auch gleich die Lagerverwaltung mit reinnehmen?“. Um dem
vorzubeugen, wurden **Nicht-Ziele** klar definiert (siehe Abschnitt 3 und 8) und die Vision auf die
wirklich nötigen Kernfunktionen fokussiert.
_Benutzerakzeptanz:_ Finanzprozesse sind oft formal und können von Mitarbeitern als Bürokratie
wahrgenommen werden. Es besteht das Risiko, dass Außendienst oder Projektbeteiligte das
Finanzmodul umgehen, wenn es zu kompliziert ist (z. B. weiterhin „Schattensysteme“ in Excel
führen). Das würde die Datenqualität und damit die Vision vom Single Source of Truth gefährden.
Daher liegt ein starker Fokus auf **Usability und Schulung** , um hohe Nutzungsraten sicherzustellen –
_„die beste Lösung nützt nichts, wenn die Anwender sie ablehnen“_ .
_Technische Integrität:_ Die Anbindung an Lexware bringt Synchronisationsrisiken: Ändert z. B. ein
Nutzer Kundendaten im CRM und gleichzeitig ändert die Buchhaltung etwas in Lexware (zwischen
zwei Sync-Läufen), könnten **Datenkonflikte** entstehen
. Dieses Risiko erfordert ein durchdachtes
Schnittstellen-Konzept (Master-System definieren oder Änderungen protokollieren) und evtl.
Unterstützung eines Lexware-Experten bei der Umsetzung
. Das Projekt nimmt dieses Risiko
bewusst in Kauf, da Integration essenziell ist, und plant entsprechende Maßnahmen (siehe
Schnittstellen und Qualität/Risiken).

# In Summe ist die Domäne Finanz- & Compliance-Management herausfordernd , aber beherrschbar: Sie stellt

# 2. Personas-Mapping: Anforderungen & Pain Points pro Rolle

Im Folgenden werden die relevanten Personas – **Buchhaltung, Geschäftsführung, Außendienst und**
**Innendienst** – mit ihrem Bezug zum Finanz- & Compliance-Modul betrachtet. Für jede Persona werden
Ziele, Anforderungen und Schmerzpunkte herausgearbeitet, basierend auf den Persona-Profilen und dem
Interview. Abschließend werden identifizierte Gaps zwischen Persona-Erwartungen und dem bisherigen
Konzept benannt und Entscheidungen dazu dokumentiert.

### Persona Buchhaltung (Finanzverantwortliche)

**Rolle & Ziele:** Die _Buchhalterin_ ist verantwortlich für alle finanziellen Vorgänge und die Einhaltung
gesetzlicher Vorgaben im Unternehmen. Sie sorgt dafür, dass **Einnahmen und Ausgaben korrekt**
**verbucht** werden und die finanzielle Stabilität gewährleistet ist. Im Projektgeschäft bedeutet das konkret:
_Rechnungen_ müssen zum richtigen Zeitpunkt gestellt, _Zahlungen_ überwacht und _Kosten_ den Projekten
zugeordnet werden, damit jedes Projekt wirtschaftlich ausgewertet werden kann. Ein zentrales Ziel der
Buchhaltung ist **Zuverlässigkeit und Pünktlichkeit** in der Rechnungslegung – Fehler oder Verzögerungen
können Liquiditätsprobleme oder Prüferbeanstandungen nach sich ziehen. Außerdem möchte sie
**Transparenz für die Geschäftsführung** schaffen: die GF soll jederzeit korrekte Kennzahlen zu Umsatz,
offenen Posten und Projektmargen abrufen können, ohne händisch nacharbeiten zu müssen.

**Aktuelle Pain Points:** Laut Interview und Persona-Bericht arbeitet die Buchhaltung derzeit mit _separater_
_Software (Lexware)_ , die **nicht in den Projektablauf integriert** ist. Sie erfährt oft nur _per Zuruf_ von

anstehenden Rechnungen oder Projektmeilensteinen. Dieses reaktive Vorgehen empfindet sie als
ineffizient und fehleranfällig: _„Im aktuellen Prozess gibt der Außendienst oft per Zuruf Bescheid, wann eine_
_Rechnung raus soll“_ – was zu Inkonsistenzen führt. Es fehlt ein systematischer Plan. Zudem muss sie
Rechnungen in Lexware
**manuell auf Basis der Innendienst-Informationen erstellen** , was
Doppelerfassung bedeutet und Fehlerrisiken birgt. Auch das Mahnwesen läuft manuell: Sie überwacht
Zahlungseingänge durch regelmäßige Kontrolle der Kontoauszüge außerhalb des CRM und erinnert den
Vertrieb „informell“ an ausstehende Zahlungen. Hierbei kann es passieren, dass **niemand mahnt** , weil
unklar ist, wer zuständig ist. Ein weiterer Schmerzpunkt ist die **Papier- und E-Mail-Flut** : Eingehende Belege
(z. B. Lieferantenrechnungen, Quittungen von Außendienstlern) werden teils auf Papier weitergereicht oder
als Scan per E-Mail, was die Gefahr birgt, dass etwas verlorengeht. Die Buchhaltung vermisst ein zentrales
digitales Belegmanagement im aktuellen Setup. Schließlich betont sie die Notwendigkeit der **GoBD-**
**konformen Archivierung** : Sie sorgt sich, dass bei der Digitalisierung evtl. die formalen Anforderungen
(Unveränderbarkeit, Protokollierung) nicht erfüllt werden und will hier Sicherheit.

**Anforderungen an das System:** Aus Sicht der Buchhalterin muss das neue Tool folgende Anforderungen
erfüllen (vgl. Persona-Bericht Buchhaltung):

**Integrierte Rechnungsplanung:** Schon bei Projektanlage soll ein **Rechnungsplan mit zeitlichen**
**Fälligkeiten** hinterlegt werden (z. B. 16 Wochen vor Montage, 4 Wochen vor Montage, bei
Lieferung). Das System soll daraus automatisch Termine/Aufgaben „Rechnung stellen“ erzeugen,
damit keine Erinnerung per Zuruf mehr nötig ist. Die Buchhalterin möchte, dass sie _proaktiv vom_
_System benachrichtigt_ wird, wann welche Rechnung fällig ist, statt hinterherlaufen zu müssen.
Dadurch wird die bisher inkonsistente Abstimmung standardisiert.
**Fristgerechte Rechnungsstellung & Teilzahlungen:** Das System soll sicherstellen, dass
**Abschlagsrechnungen und Schlussrechnungen fristgerecht gestellt** werden, damit der Cashflow
gesichert ist. Im jetzigen Prozess gingen Teilrechnungen teils verspätet raus; künftig soll die
Verteilung (z. B. 30/50/20 %) fix eingeplant sein. Die Buchhalterin erwartet von der Lösung, dass
keine Rechnung „vergessen oder falsch terminiert“ wird – dies wird ausdrücklich als GoBD-konforme
Abwicklung und Qualitätsverbesserung gesehen.
**Zahlungseingang und Mahnwesen im Blick:** Die Buchhaltung will im System **markieren können,**
**wenn Zahlungen eingegangen sind** , und auf einen Blick sehen, welche Rechnungen noch offen
bzw. überfällig sind. Konkret: Sie registriert z. B. „Rechnung #1001 bezahlt am 10.11.“ – das System
zeigt allen Beteiligten den Status (z. B. _„1. Rate bezahlt, 2. Rate 7 Tage überfällig“_ ). Bleibt eine Zahlung
aus, soll automatisch nach vordefinierten Fristen ein **Mahnalarm** erfolgen – idealerweise eine
automatische Aufgaben- oder E-Mail-Benachrichtigung an Vertrieb/Buchhaltung, um die nächste
Mahnstufe einzuleiten. Die Buchhalterin wünscht sich außerdem, dass Mahntexte oder -dokumente
im System hinterlegt werden können, um das Mahnwesen zu _standardisieren_ . Momentan laufen
Zahlungserinnerungen und Mahnungen weitgehend manuell; das Tool soll hier unterstützen, z. B.
durch Eskalation nach X Tagen Verzug.
**Projektbezogene Kosten- und Erlöserfassung:** Ein wichtiges Bedürfnis der Buchhaltung ist, **alle**
**Kosten und Erlöse pro Projekt nachhalten** zu können, um die Rentabilität zu beurteilen. Aktuell
verbucht sie Eingangsrechnungen von Lieferanten manuell und ordnet sie Projekten zu, oft mittels
Papierbelegen. Künftig soll das System ermöglichen, dass solche _Belege digital erfasst und direkt dem_
_Projekt zugeordnet_ werden. Sie stellt sich vor, dass Außendienst/Innendienst Auslagen (z. B.
Materialkauf beim Kundenbesuch) per App fotografieren und hochladen, statt Zettel zu sammeln. So
gehen keine Belege verloren und Nachfragen reduzieren sich. Die Buchhalterin möchte, dass am
Ende eines Projekts **alle zugehörigen Kosten im System sichtbar** sind, um den tatsächlich erzielten

Gewinn zu berechnen. Dazu zählt auch der Personaleinsatz: Über die integrierte Zeiterfassung (siehe
unten) will sie sehen, wie viele Stunden das Team auf das Projekt gebucht hat, um interne Kosten zu
kalkulieren.
**Provisions- und Umsatzabrechnung:** Da das Unternehmen Vertriebsprovisionen zahlt, achtet die
Buchhalterin auf die korrekte Erfassung von Provisionsansprüchen. Sie verlangt, dass das CRM-Teil
des Systems **markiert, auf welche Vertriebsperson und -initiative ein Auftrag zurückgeht** (z. B.
eigener Neukunde vs. übernommener Bestandskunde), weil dies die Provisionshöhe beeinflusst.
Konkret: Holt ein ADM durch Kaltakquise einen neuen Auftrag, bekommt er einen höheren Bonus –
die Buchhaltung muss diese Info erhalten. Das Tool soll also Verkaufschancen/Kundenkontakte
entsprechend kennzeichnen. Langfristig ermöglicht das, dass der Vertrieb eigene Provisions-
Statistiken einsehen kann, während die Buchhaltung die offizielle Berechnung vornimmt. Diese
Anforderung ist in den Personas deutlich genannt; im Konzept wurde sie noch nicht als separates
Feature spezifiziert (Gap, siehe unten).
**Integration Zeiterfassung:** Aktuell nutzt die Firma für Arbeitszeiten ein externes Programm
(TimeCard), aus dem die Stunden am Monatsende exportiert werden. Die Buchhalterin muss diese
CSV-Daten weiterverarbeiten, um Überstunden, Reisekosten etc. abzurechnen – parallel zur
Lohnbuchhaltung in Lexware. Ihr Wunsch ist, dass im integrierten System **alle Projektarbeitszeiten**
**erfasst und für sie einsehbar** sind. So könnte sie sehen, wie viel interner Aufwand (Personalkosten)
in ein Projekt geflossen ist, um die Rentabilität abzuschätzen. Außerdem würde es die Vorbereitung
der Lohnbuchhaltung erleichtern. Für die Buchhalterin wäre es ideal, wenn das neue System
TimeCard ersetzen kann bzw. die **Zeiten automatisch den Projekten zuordnet** und übergibt. (Diese
Integration ist perspektivisch im Konzept vorgesehen, da TimeCard ablösen werden soll.)

**Interaktionen:** Die Buchhaltung steht an der Schnittstelle zwischen allen Abteilungen. Mit dem **Vertrieb/**
**Außendienst** kommuniziert sie bisher, um Info über neue Aufträge oder Zahlungseingänge auszutauschen
(„der ADM informiert sie, wenn Zahlung da ist“ – umgekehrt informiert sie den ADM, wenn Zahlung _nicht_ da
ist). Künftig übernimmt das System diesen Informationsfluss (Status „bezahlt“ sichtbar für alle). Mit dem
**Innendienst** arbeitet sie eng bei der Rechnungsstellung zusammen – der Innendienst liefert ihr die
notwendigen Projektinfos (Auftragswert, Meilensteine), oft telefonisch oder per Excel. Diese Schnittstelle
soll digitalisiert werden, indem der Innendienst alle Daten im System pflegt und das System die
**Rechnungsobjekte vorbereitet** , sodass die Buchhaltung sie nur noch freigeben und versenden muss.
Außerdem erhält die Buchhalterin vom Innendienst alle Bestellungen an Lieferanten, um
Eingangsrechnungen zu prüfen. Künftig könnte der Innendienst solche Bestellvorgänge im System
dokumentieren, sodass die Buchhaltung auf einen Blick alle erwarteten Lieferantenrechnungen pro Projekt
sieht. Mit der **Geschäftsführung** interagiert die Buchhaltung in Form von Reports – bisher liefert sie Zahlen
zu Umsatz, Kosten, Forderungen in Excel aufbereitet. Das System soll hier entlasten, indem es der GF direkt
Dashboards bietet (die Buchhaltung fungiert mehr als _Data Steward_ , der die Richtigkeit der Eingaben
sicherstellt). Schließlich ist die Buchhalterin auch Ansprechpartnerin für externe **Prüfer und Steuerberater**
– sie muss im Falle einer Betriebsprüfung alle Nachweise lückenlos erbringen können. Das System soll diese
Zusammenarbeit erleichtern, indem es z. B. einen Datenexport aller Buchungsdaten bereitstellt.

### Persona Geschäftsführer (CEO)

**Rolle & Ziele:** Der _Geschäftsführer_ (GF) ist oberster Entscheidungsträger und verantwortet strategische
Ausrichtung sowie wirtschaftlichen Erfolg des Unternehmens. Im Kontext des CRM/PM-Systems
repräsentiert er die Sicht des Managements, das **jederzeit einen Gesamtüberblick** über Kunden,
Vertriebspipeline, laufende Projekte und Finanzen benötigt. Sein zentrales Ziel ist **Transparenz über alle**
**Unternehmensbereiche** , um fundierte, datengestützte Entscheidungen treffen zu können. Insbesondere

will er _Chancen frühzeitig erkennen_ (z. B. vielversprechende Leads) und _Risiken rechtzeitig gegensteuern_ (z. B.
Budgetüberschreitungen). Für die Finanzdomäne bedeutet das: Der GF möchte **stets aktuelle Kennzahlen**
sehen – Auftragseingang vs. Ziel, Ist-Umsätze, offene Forderungen, Margen – ohne auf monatliche Reports
warten zu müssen. Außerdem legt er Wert auf **Compliance und Sicherheit** : Regelkonforme Abläufe
(GoBD), Datenschutz und keine bösen Überraschungen bei Prüfungen. Letztlich misst er den Erfolg des
Tools daran, ob es ihm hilft, das Unternehmen _effektiver zu steuern_ , Entscheidungen zu beschleunigen und
das Wachstum planbar zu machen.

**Aktuelle Pain Points:** Der GF klagt über verteilte Datenquellen und mangelnde Echtzeit-Informationen.
Bislang liegen wichtige Finanzdaten in separaten Systemen: Umsatz in Lexware, Pipeline in Excel,
Projektfortschritt in E-Mails usw.. Daraus resultiert ein hoher manueller Aufwand, um ein Gesamtbild zu
erhalten – Abteilungsleiter liefern unterschiedliche Zahlenwerke, die der GF mühsam konsolidiert. _„Der GF_
_muss diese am Monatsende mühsam zusammenführen – der Überblick kostet Stunden“_ . Entscheidungen
verzögern sich dadurch, Chancen werden verpasst und Risiken mitunter zu spät erkannt. Dies empfindet
der GF als unhaltbar; er spricht davon, dass Wachstum sonst zum „Blindflug“ wird. Ein weiterer Pain Point
sind **verzögerte Informationen** : Der GF erfährt z. B. oft erst im Nachhinein, wenn ein Projekt budgetär aus
dem Ruder läuft oder wenn ein Großkunde spät zahlt, da kein Echtzeit-Reporting existiert. Zudem gibt es
derzeit keine integrierten KPI-Dashboards – alles ist reaktiv (Excel-Listen). Der GF bemängelt auch fehlende
**Nutzungsdisziplin** : „Jeder muss erst Zahlen zusammensuchen“ – er vermutet, dass ohne System viel
Wissenskapital personengebunden ist und _Intransparenz_ herrscht. Schließlich ist er sich bewusst, dass
manuelle Prozesse fehleranfällig sind: Er vertraut den händisch aggregierten Zahlen nicht voll. Diese
Unsicherheit soll dringend behoben werden, damit er Entscheidungen nicht mehr „nach Bauchgefühl“
treffen muss.

**Anforderungen an das System:** Aus GF-Sicht muss das integrierte System – und speziell das Finanzmodul –
die folgenden Anforderungen erfüllen:

**Management-Dashboard mit Finanz-KPIs:** Der GF benötigt ein _übersichtliches Dashboard_ , das **alle**
**relevanten Kennzahlen bündelt – von Finanzen über Vertrieb bis Projekte** . Im Finanzbereich
erwartet er Kennzahlen wie _Umsatz Ist vs. Plan_ , _Auftragseingang_ , _Auftragsbestand_ , _Offene Posten_
_(Forderungen)_ und _Margen_ auf Knopfdruck. Das Dashboard soll Ampel-Indikatoren bieten (z. B.
„Projekt X rot wegen Budgetüberschreitung“) und Drill-Down-Möglichkeiten bis ins Detail (etwa in
ein bestimmtes Projekt oder die 360°-Kundensicht)
. Besonders wichtig ist ihm ein
_Projektcontrolling-Modul_ : Er möchte Plan/Ist-Vergleiche pro Projekt sehen, inkl. Visualisierung der
Abweichungen – etwa „Projekt A hat 15 % mehr Stunden verbraucht als geplant“ – um
Gegenmaßnahmen einleiten zu können
. Diese Anforderungen zeigen, dass Finanzdaten und
operative Projektdaten verknüpft im System verfügbar sein müssen.
**Echtzeit-Reporting & Verlässlichkeit:** Der GF will **aktuelles Zahlenmaterial in Echtzeit** . Das
bedeutet, wenn er Montag morgens ins System schaut, sieht er die neuesten Umsätze, Zahlungen
und Probleme ohne weitere Nachfragen. Er erwartet, dass das System _ihm Minuten statt Stunden_ für
einen Überblick abverlangt. Ganz zentral: Er muss den Zahlen **vertrauen können** . Die Abweichung
zwischen System-Report und offiziellem Finanzabschluss sollte minimal sein – idealerweise 0 %.
Akzeptanz bedeutet hier laut GF: Er will keine „Schattenrechnungen“ mehr in Excel führen, um
sicherzugehen. Ein Kriterium formuliert er so: _„100 % Übereinstimmung der Umsatzzahlen im_
_Dashboard mit denen der Buchhaltung (nach Integration)“_ . Dies erfordert, dass das System lückenlos
mit Lexware abgestimmt ist und alle Buchhaltungsdaten korrekt spiegelt.

**Finanzplanung und Forecasts:** Der GF denkt strategisch und will mit dem System _vorausschauend_
_planen_ . Dazu gehören Finanzprognosen (Forecasts) auf Basis der Pipeline und Projekte. Das CRM/
PM-System soll z. B. aus den Opportunities einen **Auftragsforecast** generieren
(Wahrscheinlichkeiten * Auftragswert) – diese summierten Werte dienen der Finanz- und
Kapazitätsplanung der Firma. Ebenso möchte er Auswertungen wie *Auftragsvolumen YTD, Umsatz YTD,\*
_Auftragsbestand, Forderungsstand_ etc. im System abrufen können. Der GF erwartet, dass er damit
bessere Entscheidungen treffen kann, z. B. ob Investitionen (neueinstellungen, Maschinen)
basierend auf den Forecast-Daten sinnvoll sind.
**Berechtigungs- und Sicherheitskonzept:** Als Geschäftsführer verlangt er höchste **Datensicherheit**
**und Zugriffskontrolle** , da im System vertrauliche Informationen stehen (Umsätze, Kundendaten,
Kalkulationen). Er möchte zwar selbst auf _alle_ Daten zugreifen können, aber sicherstellen, dass nicht
jeder Mitarbeiter alles sieht. Beispielsweise sollen **detaillierte Finanzdaten** (Gesamtumsätze,
Gewinn, Gehälter) nur für ihn bzw. die GF-Ebene sichtbar sein. Ein _rollenbasiertes Berechtigungssystem_
wird gefordert: Etwa die Buchhaltung darf Finanzdaten bearbeiten, der Vertrieb vielleicht sehen aber
nicht ändern, etc.. Wichtig ist ihm auch ein **Audit-Trail** (Wer hat was geändert?), um bei
Unregelmäßigkeiten nachvollziehen zu können, was passiert ist. Zusammengefasst: Der GF erwartet
modernste Sicherheitsstandards (verschlüsselte Übertragung, Passworthärte,
Berechtigungssteuerung) – ein Datenleck wäre für ihn inakzeptabel.
**Integration in Systemlandschaft:** Der GF weiß, dass bereits Tools wie Lexware (FiBu) und TimeCard
(Zeiterfassung) existieren. Er fordert daher, dass das CRM/PM-System **kompatibel mit diesen**
**Systemen** ist. Idealerweise sollen Buchhaltungsdaten, CRM-Daten und Projektdaten _ohne_
_Medienbrüche vereint_ werden. Falls eine vollständige Echtzeit-Integration nicht sofort möglich ist,
erwartet er zumindest **Schnittstellen für Im- und Export** (z. B. CSV-Exporte für Buchhaltung oder
eine BI-Tool-Anbindung). Wichtig ist ihm, dass **keine Doppelarbeit** entsteht – Daten sollen möglichst
einmalig erfasst und dann überall verfügbar sein. Sein Ziel: eine **einheitliche Datenbasis**
unternehmensweit. Speziell nennt er, dass das Dashboard Daten aus der Buchhaltung (z. B. Kosten
aus dem ERP) enthalten sollte – also eine Integration der Finanzdaten ins Management-Reporting
erfolgen muss.
**Performance & Usability:** Der GF betont, dass das System **schnell und einfach bedienbar** sein
muss, sonst nutzt er es nicht regelmäßig. In Meetings will er spontan Zahlen nachschlagen können,
ohne lange Ladezeiten. „Echtzeit“ bedeutet für ihn gefühlte Echtzeit – ein KPI-Dashboard soll sich in
Sekunden aktualisieren. Ebenso achtet er darauf, dass **alle Abteilungen das System akzeptieren** :
Nur wenn Außendienst, Innendienst, etc. konsequent Daten pflegen, bekommt er als GF verlässliche
Auswertungen. Daher fordert er, dass die Lösung _anwenderfreundlich für alle Rollen_ ist (intuitive UI,
mobile Nutzung) und ein Change-Management betrieben wird. Der GF selbst will möglichst wenig
„Klickerei“ – ein vorkonfiguriertes Management-Cockpit, das ihn nicht mit Details erschlägt, ist sein
Ideal.

**Interaktionen:** Der GF als oberster Entscheidungsträger bezieht Informationen von Buchhaltung, Vertrieb
und anderen Bereichen. Mit der neuen Lösung sollen viele dieser Interaktionen _digital und in Echtzeit_
erfolgen. Beispielsweise erhält er bisher Monatsreports von der Buchhaltung – zukünftig schaut er ins
Dashboard, wo diese Zahlen bereits aufbereitet sind. Bei Unklarheiten kann er selbst per Drill-Down Details
anschauen (z. B. in eine einzelne Rechnung oder ein Projekt) anstatt Rückfragen stellen zu müssen
.
Er wird weiterhin Regelmeetings (z. B. Vertriebs- und Projekt-Updates) abhalten, aber die Grundlage dafür –
Pipeline-Status, Finanzübersicht – liefert das System nahezu live. Die GF-Persona erwähnt auch
**Stakeholder-Zufriedenheit** : Der GF berichtet an Gesellschafter und spricht mit Abteilungsleitern. Diese
Stakeholder werden das Tool laut GF dann akzeptieren, wenn es _sichtbare Verbesserungen_ bringt (z. B. loben
Gesellschafter die neue Transparenz, Vertriebsleiter sehen Probleme früher). Intern muss der GF weiterhin

als Sponsor agieren – er wird das **Einhalten der Datendisziplin einfordern** und das Projekt aktiv
unterstützen.

### Persona Außendienstmitarbeiter (ADM) – Vertrieb Ladenbau-Projekte

**Rolle & Ziele:** _Markus Müller_ als Referenzpersona steht für den **Vertriebsaußendienst** im Projektgeschäft
Ladenbau. Er akquiriert Kunden, begleitet Projekte vom ersten Kontakt bis zur Abnahme und fungiert als
„Face to the Customer“ – der alleinige Kundenansprechpartner über die gesamte Projektdauer. Markus’
Ziele sind **Umsatzabschlüsse und Kundenzufriedenheit** . Er ist erfolgsgetrieben: möchte Vertriebsziele
erreichen oder übertreffen und neue Kunden gewinnen. Gleichzeitig ist ihm wichtig, dass seine Kunden
eine optimale Lösung erhalten und am Ende zufrieden sind – der sichtbare Erfolg (ein neu eröffneter Laden)
motiviert ihn. In Bezug auf das Finanzmodul bedeutet das: Markus will, dass **Angebote zügig in Aufträge**
**und Rechnungen münden** , damit er seinen Umsatz realisiert und ggf. Provision erhält. Er möchte
außerdem _unterwegs nicht von Administration aufgehalten_ werden – d.h. alles Finanzielle sollte so einfach wie
möglich im Hintergrund laufen, damit er sich auf Verkauf und Kundenbeziehung konzentrieren kann.

**Aktuelle Pain Points:** Markus verbringt viel Zeit unterwegs („Arbeitsplatz im Auto“), hat aber **unterwegs**
**oft schlechten oder keinen Internetzugang** . Das erschwert es ihm, mobil auf aktuelle Kundendaten oder
Finanzinfos zuzugreifen. Häufig macht er Notizen analog und trägt sie abends nach, was zu Verzögerungen
führt. Finanzspezifisch spürt Markus folgende Probleme: **Spesenabrechnung und Reisekosten** sind für ihn
lästig – er sammelt Belege (Hotel, Essen, km-Pauschalen) über den Monat und reicht sie dann stapelweise
ein
. Diese „Zettelwirtschaft“ am Monatsende kostet Zeit und es besteht das Risiko, Belege zu verlieren.
Markus wünscht sich ein einfacheres Verfahren, idealerweise _digital per App_ , um unterwegs Spesen zu
erfassen. Ein weiterer Punkt: Markus ist in den Vertriebsprozess eingebunden, aber nach Auftragserteilung
wenig in die Finanzabwicklung – dennoch betrifft es ihn: Wenn ein Kunde nicht zahlt, muss meistens er als
Kundenbetreuer nachhaken. Momentan erfährt er verspätet oder zufällig von Zahlungsproblemen. Er hätte
aber gerne **Transparenz, ob seine Kunden pünktlich zahlen** , um gegebenenfalls gleich reagieren zu
können. Das Fehlen dieser Transparenz (da das bisher im Lexware steckt) ist ein Pain Point: er bekommt
keine automatische Info, sondern nur wenn die Buchhaltung ihn anruft. Zusätzlich beeinflusst das
Finanzmodul seine **Provision** : Markus erhält Boni für abgeschlossene Aufträge – aktuell muss er dafür teils
selbst Listen führen oder auf Rückmeldung der Buchhaltung warten, wie viel Umsatz er generiert hat. Ein
dediziertes Provisionsmodul gibt es nicht, was für ihn intransparent ist. Auch das würde er begrüßen, um
seinen Leistungsstand zu sehen (z. B. wie viel Bonus habe ich dieses Quartal bereits verdient?).
Zusammengefasst: Markus’ Schmerzpunkte liegen in _Aufwänden für Administration_ (Spesen, Berichte) und
_fehlender Integration_ , die ihn zwingen, mehrere Tools/Listen zu pflegen – was doppelte Dateneingabe
bedeutet und Zeit frisst, die er lieber im Verkauf hätte.

# Anforderungen an das System: Aus Sicht des Außendienstlers Markus sind folgende Anforderungen

**Mobile Erfassung von Ausgaben (Spesen):** Markus möchte unterwegs **seine Spesen direkt digital**
**erfassen können** . Konkret stellt er sich vor, Belege einfach mit dem Smartphone zu fotografieren
und an den Vorgang anzuhängen, sowie die gefahrenen Kilometer automatisiert miterfassen zu
lassen. So müsste er nicht mehr am Monatsende alle Zettel sammeln. Diese Forderung ergibt sich
klar aus seiner Persona-Beschreibung: _„Hierfür wäre eine mobile Lösung ideal, bei der er Belege einfach_
_fotografiert und digital anhängt, sowie die gefahrenen Kilometer pro Tour automatisch erfasst werden.“_ .
Das neue System soll ihm also ermöglichen, **Reisekosten und Auslagen on-the-fly** zu

---

_Page 11_

---

dokumentieren. (Im Gesamtkonzept war dieser Aspekt bislang implizit; wir nehmen es als _Should_ -
Anforderung auf, siehe Abschnitt 3.)
**Einfache Angebots- und Auftragsabwicklung:** Als Verkäufer benötigt Markus einen fließenden
Übergang von Angebot zu Auftrag und Rechnung. Er erwartet, dass wenn ein Kunde „Ja“ sagt, er mit
wenigen Klicks aus dem Angebot einen Auftrag/Projekt erstellen kann und das System ggf. direkt
einen Rechnungsplan vorschlägt (Standardraten). Er will sich nicht in Finanzdetails verlieren, aber
sicher sein, dass nach Auftragserteilung alles Weitere (Rechnungen stellen etc.) zuverlässig läuft.
Seine Anforderung wäre: _„Ich möchte, dass das CRM/PM mir den administrativen Teil abnimmt, sodass_
_ich nach dem Abschluss nicht noch Excel-Formulare ausfüllen muss.“_ Tatsächlich wird im Best-Practice
beschrieben, dass das System die Rechnungsintervalle pro Projekt hinterlegen und Aufgaben für
Buchhaltung generieren soll – was Markus indirekt entlastet.
**Transparenz über Zahlungsstatus:** Markus möchte **in der Projektübersicht sehen können, ob**
**der Kunde seine Rechnungen bezahlt hat oder im Verzug ist** . Best Practice laut Konzept: _„der_
_Vertrieb kann sehen ‘Abschlag 1 bezahlt am…, Abschlag 2 offen (7 Tage überfällig)’ und entsprechend_
_agieren“_ . Dies unterstützt Markus enorm, da er proaktiv auf säumige Zahler zugehen kann, anstatt
es zufällig zu erfahren. Außerdem sieht er seinen Beitrag zum Umsatz realisiert (wenn bezahlt).
Diese Anforderung ist wichtig für ihn, um die Kundenbeziehung auch in heiklen Situationen
(Zahlungsverzug) managen zu können.
**Provisionsübersicht:** Markus erwartet langfristig, dass das System _seine Erfolge_ sichtbar macht. Er
wünscht sich z. B. **Statistiken zu seinen erzielten Umsätzen und den daraus resultierenden**
**Provisionen** . Im Persona-Bericht steht: _„Langfristig ermöglicht dies (Erfassung von Umsatz je_
_Vertriebsinitiative) auch, dass der Vertrieb eigene Provisionsstatistiken einsehen kann“_ . Das bedeutet,
Markus hätte gern ein persönliches Dashboard oder Report, wo er sieht: X € Umsatz dieses Jahr,
davon Y € Bonus – um seine Leistung zu verfolgen. Zwar wird die offizielle Berechnung durch die
Buchhaltung gemacht, aber Transparenz für ihn motiviert und schafft Vertrauen. Diese Anforderung
wurde im Konzept noch nicht konkret umgesetzt (Gap). In der ersten Version könnte zumindest eine
Umsatzübersicht pro Vertriebsmitarbeiter realisiert werden.
**Offline-Fähigkeit & schnelle Infozugriff:** Generell fordert Markus – wie alle Außendienstler – eine
**Offline-Funktion** des Tools, damit er unterwegs arbeiten kann. Relevanz fürs Finanzmodul: Er sollte
auch offline z. B. eine Notiz erfassen können „Kunde will Zahlungsziel verlängern“ und diese wird
synchronisiert, sobald er Netz hat. Außerdem möchte er mobil schnell auf Kundendaten zugreifen
(inkl. Historie, offene Angebote/Bestellungen, ggf. letzte Rechnungen), um im Kundengespräch
informiert zu sein. Das heißt, auch Rechnungsinformationen sollten mobil abrufbar sein (z. B. falls
der Kunde fragt “Haben wir die Anzahlung schon bezahlt?” kann er nachschauen).
**Weniger Administrativer Aufwand:** Markus’ Erwartungen an das System sind allgemein, dass es
_seinen Alltag spürbar erleichtert_ . Viele seiner Pain Points (Notizen abends schreiben, Spesen
abrechnen, Daten doppelt pflegen) sollen reduziert werden. Für das Finanzmodul bedeutet das: statt
Excel-Listen oder E-Mails nutzt er künftig das System, was hoffentlich schneller geht. Beispielsweise
könnte das System ihn automatisch an _Follow-Ups_ erinnern (Vertrieb) oder _Rechnungs-Freigaben_
vereinfachen. Markus will weniger Zeit am Schreibtisch und mehr beim Kunden verbringen – das
System muss also so gestaltet sein, dass es ihm nicht als Belastung erscheint, sondern als
Unterstützung (z. B. durch Automatisierungen wie Tourenplanung, Wiedervorlagen, siehe Persona-
Doku).

**Interaktionen:** Der Außendienstler ist in viele Schnittstellen eingebunden. Er arbeitet mit dem
**Innendienst** eng zusammen – bislang via Telefon/E-Mail, künftig über das System. Z. B. erstellt der
Innendienst das Angebot und Markus wartet auf die Kalkulation; das System soll hier Status-Transparenz
bieten (wer bearbeitet was, wo hakt es). Mit der **Buchhaltung** interagiert er bei Rechnungen und

Zahlungen: bisher meldet er der Buchhaltung, wann eine Rechnung raus soll oder fragt nach dem
Zahlungseingang. In Zukunft übernimmt das System diese Kommunikation: Markus sieht einfach den
Zahlungseingangs-Status selbst. Bei Zahlungsverzug wird er automatisch informiert und kann beim Kunden
nachhaken. Seine **Kunden** schätzen ihn als zuverlässigen Ansprechpartner – dafür muss er auch
Finanzfragen beantworten können (z. B. “Können wir Zahlung in zwei Raten machen?”). Mit dem System
könnte er solche Infos schneller intern klären (Absprache mit Buchhaltung via verknüpfter Aufgabe oder
Chat). In Vertriebs-Meetings berichtet Markus an die **Geschäftsführung** über Umsätze und Pipeline.
Idealerweise liefert das System diese KPIs automatisch, sodass Markus nur noch kommentieren muss.
Insgesamt wird das Finanzmodul Markus stärker _involvieren_ , indem es ihn über finanzielle Vorgänge auf
dem Laufenden hält, gleichzeitig aber Routineaufgaben (Spesen, Remindern) abnimmt.

### Persona Innendienst (Vertriebsinnendienst & Kalkulation)

**Rolle & Ziele:** Die Persona _Innendienst & Kalkulation_ repräsentiert die zentrale **Drehscheibe zwischen**
**Vertrieb und Projektabwicklung** . Mitarbeiter im Innendienst erstellen Angebote (Kalkulatoren) und
unterstützen den Vertrieb administrativ, koordinieren aber auch nach Auftragseingang die weitere
Auftragsabwicklung (Bestellungen, Montageplanung). In unserer Kontextfirma gibt es keinen dedizierten
Projektleiter – der Innendienst übernimmt Teile dieser Rolle zusammen mit dem Außendienst. Ziele des
Innendienstes sind **effiziente Abläufe ohne Medienbrüche** , **korrekte Kalkulationen** und **reibungsloses**
**Auftragsmanagement** , damit Projekte profitabel und zur Zufriedenheit der Kunden umgesetzt werden.
Für das Finanzmodul heißt das: Der Innendienst möchte, dass die **Übergabe vom Vertrieb (Opportunity)**
**an die Auftragsphase inkl. Rechnungsstellung nahtlos** erfolgt. Er will nicht mit mehreren Excel-Tabellen
hantieren müssen, sondern in einem System alle relevanten Daten pflegen. Ein konkretes Ziel ist, dass der
Innendienst **nicht mehr manuell Termine oder Zahlungen nachhalten** muss, sondern das System ihn
unterstützt – damit kann das Team vom reaktiven „Feuerwehrmodus“ zu einem proaktiven Arbeiten
wechseln.

**Aktuelle Pain Points:** Der Innendienst arbeitet derzeit mit verschiedenen Tools und vielen manuellen
Schritten. Angebote werden z. T. in Word/Excel erstellt, Projektdaten in Ordnern abgelegt; es gibt
Redundanzen und Informationsverluste beim Übergang vom Verkauf in die Abwicklung. Speziell zur
Rechnungsstellung: Laut Interview muss der Innendienst **der Buchhaltung Bescheid geben, wenn z. B.**
**eine Montage ansteht, damit die 2. Rate berechnet wird** . Diese Abstimmung ist unklar geregelt („oft per
Zuruf“) und führt mitunter zu Unsicherheit oder verspäteten Rechnungen. Das ist ein Pain Point: Der
Innendienst hat ohnehin viele Aufgaben – wenn er zusätzlich Termine im Kopf behalten muss, wann eine
Rechnung fällig wäre, steigt die Fehlergefahr. Ein weiterer Schmerz war, dass **Dokumente und**
**Informationen**
**verteilt**
sind:
Kontakte,
Notizen,
Angebote,
Auftragsbestätigungen,
Lieferantenbestellungen, Rechnungen – all das liegt an verschiedenen Orten (Dateiserver, E-Mails, Papier).
Es fehlt eine **lückenlose Projekthistorie** in einem System. Dadurch ist es z. B. schwierig, auf
Kundenanfragen schnell zu antworten („Wie war nochmal der Zahlungsplan?“) – man muss erst in Ordnern
suchen. Das neue Tool soll dieses Chaos beenden. Zudem ist der Innendienst in die Kommunikation
zwischen Abteilungen involviert: Rückfragen vom Kunden zu einer Rechnung landen oft beim Innendienst
zuerst. Der möchte dann als kompetenter Ansprechpartner auftreten, aber dafür braucht er **schnellen**
**Zugriff auf alle Infos** (Kunde, Projekt, Rechnung). Momentan kostet das Zeit, falls Infos fehlen. Insgesamt
empfindet der Innendienst die Situation als hektisch und fehleranfällig – „viele Fäden laufen zusammen,
doch es fehlt ein übersichtliches Dashboard“. Gerade praktische Umstände (viele E-Mails, parallele Excel-
Listen) erschweren die Arbeit. All das will die Persona verbessern.

**Anforderungen an das System:** Die Innendienst-Persona hat diverse Anforderungen, u.a. an das
Finanzmodul:

**Nahtloser Übergang Opportunity -> Auftrag -> Rechnung:** Sobald eine Verkaufschance gewonnen
wird, muss der Innendienst **ein Projekt/Auftrag im System anlegen können, aus dem**
**automatisch der Finanzprozess angestoßen wird** . In der Praxis heißt das: Der Angebotswert wird
übernommen, ein Rechnungsplan wird hinterlegt, und es entstehen Aufgaben für Buchhaltung (z. B.
„erste Abschlagsrechnung stellen am Datum X“). Der Innendienst fordert, dass er nicht separate
Systeme bedienen muss – das CRM wandelt die Opportunity in einen Auftrag um (diese Anforderung
ist als Muss definiert). Dabei sollen **alle relevanten Daten mitwandern** , damit nichts neu erfasst
werden muss. Die Persona will, dass die **Rechnungsstellung eng mit der Projektplanung**
**verknüpft** ist: z. B. basierend auf dem Montage-Datum soll das System selbst die Fälligkeiten der
Zahlungen timen.
**Automatisierte Rechnungstermine & Aufgaben:** Der Innendienst wünscht sich (und es wird als
Best Practice genannt), dass das System **Rechnungstermine automatisch einplant und Aufgaben**
**generiert** . Konkret: Bei Projekterstellung gibt er die vereinbarten Zahlungszeitpunkte ein (z. B. „50%
6 Wochen vor Montage“). Ab dann erzeugt das System _selbstständig_ zum richtigen Zeitpunkt eine
Aufgabe „Teilrechnung stellen“ für die Buchhaltung. So muss der Innendienst **nicht alles im Kopf**
**behalten** – das Risiko menschlichen Vergessens wird eliminiert. Diese Automatisierung stellt sicher,
dass Anzahlungs- und Schlussrechnungen **fristgerecht** rausgehen. Der Innendienst sieht darin auch
einen Compliance-Vorteil: es wird gewährleistet, dass keine Rechnung übersehen wird, was im Sinne
einer ordnungsgemäßen Abwicklung ist.
**Zentrale Informationsplattform:** Alle _vertriebs- und projektrelevanten Daten_ – von Kontakten über
Angebote und Bestellungen bis zu Rechnungen – sollen im System **erfasst und verknüpft** sein. Der
Innendienst fordert quasi eine 360°-Projektsicht. Beispielsweise sollen im Kunden- oder Projektprofil
**sämtliche Dokumente** (Angebot, Auftrag, Lieferscheine, Rechnungen) hinterlegt sein. Das System
speichert diese idealerweise als Datensätze, nicht nur als unstrukturierte Dateiablage. Damit
entsteht eine **lückenlose Projekthistorie** : vom ersten Kontaktbericht über Angebot und
Auftragsbestätigung bis hin zur Abschlussrechnung und eventuellen Reklamation. Für den
Innendienst ist wichtig, dass im Nachhinein klar nachvollziehbar ist, _wer wann was entschieden oder_
_geändert hat_ – gerade bei Änderungen im Projektverlauf oder Nachträgen. Das neue CRM/PM-
System soll diese Transparenz bieten. Insbesondere muss es **Versionsstände von Angeboten**
verwalten können (da oft mehrere Revisionen erstellt werden, will man später wissen, welche
Version beauftragt wurde). Änderungen an Angebotspositionen sollten protokolliert sein – das ist
Teil der Nachvollziehbarkeit und für Innendienst wie Buchhaltung relevant (z. B. Preisänderungen
nach GF-Freigabe).
**Effiziente Zusammenarbeit & Kommunikation:** Im Arbeitsalltag bedeutet das: Wenn der Kunde
anruft, um z. B. etwas an der Rechnung zu klären, muss der Innendienst **sofort alle nötigen Infos**
**parat haben** . Er fordert daher schnelle Such- und Zugriffsmöglichkeiten im System (z. B.
Kundenname -> direkt alle offenen Posten sehen). Auch interne Kommunikation soll unterstützt
werden: Der Innendienst soll z. B. Aufgaben an den Außendienst delegieren können („Kunde XY
wegen Zahlung anrufen“) und umgekehrt, ohne E-Mails schreiben zu müssen – idealerweise im
System via Aufgabenmodul (dies betrifft eher allgemeine Anforderungen F6 Aufgabenmanagement).
Für das Finanzmodul spezifisch will der Innendienst, dass **alle Beteiligten ihre To-Dos kennen** ,
insbesondere im Angebots- und Abrechnungsprozess. Das heißt z. B., wenn eine Teilrechnung
gestellt wurde, bekommt der Vertrieb eine automatische Erinnerung nach 14 Tagen nachzufassen,

falls unbezahlt (Vertriebs-Nachfassaktion). Solche _prozessgesteuerten Aufgaben_ helfen dem
Innendienst, nicht ständig manuell nachhalten zu müssen, wer als nächstes dran ist.
**Integration Lieferanten & Einkauf:** Zwar Schwerpunkt einer anderen Domäne, aber berührt
Finanzen: Der Innendienst stößt Bestellungen bei Lieferanten an und muss Lieferantenrechnungen
tracken. Das CRM/PM-System sollte nach Möglichkeit **Lieferanteninfos und Eingangsrechnungen**
ebenfalls verwalten oder zumindest verlinken. So weiß der Innendienst z. B., ob alle Fremdkosten im
Projekt erfasst sind. Hier wird im Konzept angeschnitten, dass Lieferantenmanagement eine Rolle
spielt (z. B. externe Partner in Projektphasen). Für uns heißt das: Das System sollte vorsehen,
_Lieferantenkosten dem Projekt zuzuordnen_ , was im Finanzmodul abgebildet wäre (ggf. als optionales
Feature).
**Qualitätssicherung & Controlling:** Der Innendienst denkt auch an die Qualitätsziele: Pünktliche
Rechnungen, weniger Fehler, Transparenz für die GF. Im Persona-Dokument wird erwähnt, dass das
integrierte System dem Innendienst selbst hilft, **vom „Feuerwehrmodus“ zu einer proaktiven**
**Arbeitsweise** zu wechseln, was ihn entlastet und strategischer arbeiten lässt. Das neue Tool soll also
Routineaufgaben abnehmen und die Datenqualität erhöhen, sodass der Innendienst mehr Zeit für
wertschöpfende Aufgaben hat (z. B. Kundenbetreuung, Prozessoptimierung).

**Interaktionen:** Der Innendienst kommuniziert mit **fast allen Bereichen** . Mit dem Außendienst tauscht er
täglich Infos aus: Kundentermine, Angebotsstatus, Projektänderungen. Früher per Telefon/E-Mail, jetzt soll
vieles im System passieren (Status-Updates, gemeinsame Sicht auf Kundendaten). Mit der
**Planungsabteilung** (Grafik/Technik) koordiniert er z. B. Zeichnungen und technische Klärungen, was im
Projektmodul abgebildet wird. Relevant fürs Finanzmodul: Planänderungen können Kostenänderungen
verursachen, die der Innendienst dann im System nachpflegen muss (Nachtrag => Anpassung des
Auftragswerts und evtl. neue Rechnung). Hier überschneidet sich _Planung mit Finanzen_ – das System muss
solche Änderungen konsistent behandeln (z. B. Warnung, wenn Auftragswert im Projekt geändert wird:
„Bitte Rechnungsplan prüfen“). Mit der **Buchhaltung** arbeitet der Innendienst Hand in Hand bei
Rechnungen: Der Innendienst **stimmt Zahlungspläne ab, gibt Infos weiter und klärt Rückfragen** .
Künftig passiert das weitgehend systemgestützt (Rechnungsplan im Projekt hinterlegt; wenn Buchhaltung
eine Rechnung stellt, sieht der Innendienst das im Projektstatus). Sollte ein Kunde den Innendienst anrufen
wegen einer Rechnung, kann dieser direkt im System nachschauen statt Rückfrage bei Buchhaltung zu
halten. Das erhöht die Kompetenz des Innendienstes nach außen. Mit der **Geschäftsführung** hat der
Innendienst indirekt zu tun, indem er Zahlen und Status liefert. In wöchentlichen Projekt-Updates-Meetings
fungiert er laut Persona oft als _Drehscheibe, die den aktuellen Stand berichtet_ und Aufgaben verteilt. Mit dem
neuen System wird er solche Berichte einfacher erstellen können, da die Kennzahlen (z. B. Projektfortschritt,
offene Posten) auf Knopfdruck vorliegen. Insgesamt ermöglicht das Finanzmodul dem Innendienst, **enger**
**mit allen Beteiligten verzahnt** zu arbeiten, weil jeder im selben System agiert – was bisher über E-Mail
und separate Listen lief, wird transparent in einer Anwendung abgebildet.

### Gaps & getroffene Entscheidungen pro Persona

Auf Basis des Persona-Mappings wurden einige **Lücken (Gaps)** zwischen den Persona-Erwartungen und
dem bisherigen Konzept identifiziert. Hier sind die wichtigsten Gaps samt Entscheidungsfindung
dokumentiert:

**Gap 1 – Provisionsabrechnung für Vertrieb:** Die Buchhaltung und der Außendienst wünschen sich
Funktionen zur Unterstützung der Provisionsberechnung (Markierung der Kundenherkunft,
Provisionsstatistiken für Verkäufer). Im Gesamtkonzept wurde dies bislang nicht als eigenständige
Anforderung spezifiziert – es fokussiert auf Auftrags- und Rechnungsprozesse. **Entscheidung:**

Vorläufig wird die Provision _außerhalb_ des Kernsystems berechnet (weiterhin in der Buchhaltung/
Lohnsoftware). Das CRM/PM-System soll jedoch alle dafür nötigen Daten bereitstellen: Also im
Kontakt/Opportunity markieren, ob ein Kunde selbst akquiriert oder übernommen ist, und Umsätze
je Vertriebsmitarbeiter auswertbar machen. Eine direkte Provisionsberechnung im System wird
zunächst als _Nicht-Ziel_ definiert, um Komplexität zu vermeiden. Stattdessen wird als _Lösungsvorschlag_
ein regelmäßiger Provisionsreport vorgesehen (den die Buchhaltung aus den CRM-Daten ziehen
kann). Damit wird das Bedürfnis nach Transparenz erfüllt, ohne die erste Version zu überfrachten.

**Gap 2 – Erfassung von Einkaufskosten/Margen (Projektcontrolling):** Die Personas Buchhaltung
und Geschäftsführung legen Wert auf Projektprofitabilität und würden gerne _alle Kosten im System_
_nachvollziehen_ (Lieferantenrechnungen, Arbeitszeiten etc.). Das Konzept erwähnt dies als optional
(„advanced controlling“), fokussiert aber aktuell auf Ausgangsrechnungen. **Entscheidung:** Im MVP
wird das Finanzmodul primär _Ausgangsrechnungen_ und Zahlungen abdecken. _Margen-Controlling_
wird als **„Should-have“ Erweiterung** betrachtet. Konkret: Es soll möglich sein, am Projekt einen
_Soll-/Ist-Vergleich_ zu erfassen – z. B. tatsächliche Gesamtkosten vs. Umsatz – um eine Marge zu
berechnen (für GF-Berichte). Die detaillierte Erfassung jeder Lieferantenrechnung im System ist
optional; als pragmatischer Vorschlag könnte die Buchhaltung am Projektende die Gesamtkosten
oder wichtigste Kostenpositionen einpflegen. Damit ist zumindest ein einfaches Controlling möglich.
Falls tiefergehendes Controlling (z. B. nach Kostenarten) gewünscht wird, muss das
Anforderungspaket entsprechend in einer späteren Phase erweitert werden. Diese Entscheidung
hält die Komplexität der ersten Version niedrig, ohne das strategische Ziel (Transparenz der
Projektmargen) aus den Augen zu verlieren.

**Gap 3 – Mobile Spesenerfassung für Außendienst:** Markus Müller erwartet eine mobile Lösung für
Reisekosten. Im bisherigen Anforderungskatalog wurde dieses Feature nicht explizit genannt (der
Fokus lag auf CRM, Projekt und Rechnung). **Entscheidung:** Die Spesen-/Reisekostenerfassung wird
als **zusätzliche Anforderung** aufgenommen (Priorität _Should_ ). Lösungsvorschlag: Eine mobile
Eingabemaske, mit der der ADM Belegfotos hochladen und einer Reise bzw. einem Projekt zuordnen
kann. Diese Daten können dann von der Buchhaltung geprüft und exportiert werden. Durch diese
Integration wird ein realer Pain Point des Außendiensts adressiert und der Nutzen des Systems für
ihn erhöht – was wiederum der Akzeptanz dient. Sollte die Umsetzung im MVP zu aufwendig sein,
wird zumindest das Dokumenten-Upload-Modul so erweitert, dass der ADM Belege dem Projekt
anhängen kann (zur Not als Übergangslösung).

**Gap 4 – Detailliertes Berechtigungsmodell:** Die GF-Persona wünscht differenzierte Rechte (z. B.
Innendienst darf Preise ändern?) und ggf. Freigabeprozesse für Rabatte
. Das Gesamtkonzept hat
Rollen grob umrissen (Vertrieb, Innendienst, Buchhaltung, GF) und vorgeschlagen, dass das System
diese abbilden kann. Konkrete Regeln (wer darf was sehen/ändern) sind aber noch offen.
**Entscheidung:** Das Berechtigungskonzept wird in Zusammenarbeit mit den Stakeholdern im Detail
geklärt (Offener Punkt). Tendenziell hat das Unternehmen eine _offene Kultur_ , d.h. die meisten Daten
sollen sichtbar sein, mit Ausnahme sensibler Finanzdaten. Wir nehmen an: **Standardmäßig** sieht
jeder Innendienst/Vertriebler _seine_ Projekte/Kunden und zugehörige Finanzdaten; der GF sieht alles;
Buchhaltung kann alle Rechnungen bearbeiten; interne Kalkulationsdetails (wie interne
Stundensätze, Marge) bleiben vertraulich für GF/Buchhaltung. Freigabeprozesse (z. B. Rabatt über X
% nur mit GF-Okay) werden vorerst nicht implementiert, da im Ist auch nicht praktiziert
– das
System soll aber _vorbereitet_ sein, solche Prozesse später abzubilden (z. B. Genehmigungs-Workflows
als Nice-to-have).

# 15

**Gap 5 – Integrationstiefe Lexware (Buchhaltungssystem):** Während die Buchhalter-Persona klar
Lexware nutzt, war im Konzept initial unklar, mit welchem System integriert werden muss.
Inzwischen wissen wir: Lexware mit öffentlicher API ist vorhanden. **Entscheidung:** Die Integration
wird so geplant, dass **Rechnungsdaten aus dem CRM per API an Lexware übertragen** werden
(min. als Buchungssatz oder Entwurf), um Doppelarbeit zu eliminieren. Offene Frage bleibt, ob
Lexware oder das CRM den PDF-Rechnungsdruck übernimmt – Vorschlag: Das CRM erstellt die
Rechnung als PDF nach Unternehmenslayout und übergibt die Buchungsdaten an Lexware. Die
Lexware-Nummernkreise werden dabei respektiert (ggf. bekommt das CRM die fortlaufende
Rechnungsnummer von Lexware zurückgemeldet). Ebenso soll der **Zahlungsstatus** entweder via
Schnittstelle zurück ins CRM fließen oder – falls technisch simpler – durch Buchhaltung manuell im
CRM gepflegt werden. Diese Details sind noch zu klären (siehe Offene Punkte). Wichtig ist: Alle
Beteiligten haben sich auf die Beibehaltung von Lexware als FiBu verständigt, sodass keine
komplette Neuentwicklung eines FiBu-Moduls nötig ist, was ein hohes Projektrisiko eliminiert.

Weitere kleinere Gaps (wie z. B. _Mehrsprachigkeit_ der UI, die der GF für die Zukunft anregt
, oder
_Datenmigration historischer Projekte_ , siehe Offene Punkte) werden an geeigneter Stelle behandelt. Die oben
genannten Entscheidungen stellen sicher, dass **keine kritischen Anforderungen der Personas unter den**
**Tisch fallen** und dass bewusste Priorisierungen vorgenommen wurden, um ein machbares Release zu
schnüren. Damit fließen die Persona-Einblicke direkt in den Anforderungskatalog ein, der als nächstes folgt.

# 3. Fachliche Anforderungen (Finanz & Compliance)

Aus Interview, Gesamtkonzept und Persona-Dokumenten wurde eine **vollständige Liste der fachlichen**
**Anforderungen** an das Finanz- & Compliance-Modul abgeleitet. Die Anforderungen sind konsolidiert und
redundanzbereinigt, priorisiert nach _Muss_ (essentiell für das Kernzielbild), _Should_ (wichtig, aber notfalls in
späterer Iteration umsetzbar) und _Nice-to-have_ (wünschenswert, optional). Zu jeder Anforderung wird die
Herkunft im Projektkontext angegeben. Außerdem werden zentrale **Abnahmekriterien** genannt, die erfüllt
sein müssen, damit die Anforderung als umgesetzt gilt. Am Ende werden die **Nicht-Ziele** aufgeführt, um
abzugrenzen, was bewusst _nicht_ Teil des Projekts ist.

### Funktionale Anforderungen (Finanz-Management):

**(F11) Rechnungs- und Zahlungsmanagement – Muss**
: Das System muss den Prozess der
**Rechnungsstellung für Projekte vollständig unterstützen** . Dazu gehört:
_Rechnungsplan hinterlegen:_ Pro Projekt kann ein **individueller Rechnungsplan** mit mehreren Raten
erstellt werden (Standard z. B. _3 Raten: 30 % bei Auftrag, 50 % vor Montage, 20 % nach Fertigstellung_ ;
anpassbar je Projekt). _Abnahmekriterium:_ Bei Erstellung eines Projekts kann ein Nutzer einen solchen
Zahlungsplan eingeben oder aus Vorlagen wählen. Das System speichert die Teilzahlungsanteile und
berechnet aus dem Projektwert die Beträge je Rate korrekt.
_Rechnungsobjekte erzeugen:_ Zu jedem Fälligkeitstermin im Plan muss ein **Rechnungs-Datensatz** im
System angelegt werden können. Dieser enthält mindestens: fortlaufende Rechnungsnummer,
Rechnungsdatum, Betrag, Fälligkeit, Verknüpfung zum Projekt und Kunden. _Idealerweise_ generiert
das System aus dem Datensatz eine **druckfähige Rechnung (PDF)** mit allen erforderlichen Angaben
(Kundenadresse, Leistungsbeschreibung, USt etc.). _Minimalanforderung:_ Die Daten können erfasst
und für den Export bereitgestellt werden, auch wenn der Druck ggf. extern erfolgt.
_Abnahmekriterium:_ Für einen Test-Projektauftrag mit definiertem Zahlungsplan werden automatisch
drei Rechnungsdatensätze erzeugt, die jeweils eine korrekte Rechnungsnummer im vorgesehenen

- 13

Format bekommen und deren PDF-Ausgabe den vorgegebenen Layout- und Inhaltsvorschriften
entspricht.
_Automatische Rechnungstermine & Aufgaben:_ Das System soll basierend auf dem Rechnungsplan
**automatisch Aufgaben/Erinnerungen** erzeugen, z. B. „Rechnung 2 stellen am [Datum]“. Diese
Aufgabe wird der Buchhaltung (oder zuständigen Person) zugewiesen, so dass niemand manuell
Termine nachhalten muss. _Abnahmekriterium:_ Nach Anlage eines Rechnungsplans erscheinen
entsprechende Aufgaben mit richtigen Fälligkeitsdaten im Aufgabenmodul der zuständigen Rolle.
_Rechnungsstatus & Zahlungseingang:_ Die Buchhaltung muss den **Zahlungseingang** einer Rechnung
im System markieren können (Eingangsdatum, ggf. Teilzahlung). Daraufhin berechnet das System
den _offenen Restbetrag_ und aktualisiert den Status (z. B. „bezahlt am DD.MM.YY“ oder „offen (X Tage
überfällig)“). Dieser Status soll **für alle Projektbeteiligten sichtbar** sein (Leserechte vorausgesetzt).
_Abnahmekriterium:_ In einer Testumgebung wird für eine offene Rechnung ein Zahlungseingang
erfasst; das System zeigt daraufhin „bezahlt“ an und entfernt die offene Posten Markierung.
_Offene-Posten-Überwachung & Mahnwesen:_ Bei überfälligen Rechnungen (z. B. _7 Tage_ nach Fälligkeit)
soll das System automatisch einen Hinweis oder eine Aufgabe generieren. Dieser kann an Vertrieb
und/oder Buchhaltung gehen, je nach Prozessdefinition (z. B. erste Zahlungserinnerung durch
Vertrieb, formale Mahnung durch Buchhaltung). Zusätzlich soll es eine Ansicht/Liste aller **Offenen**
**Posten** geben, sortierbar nach Überfälligkeitsdauer. _Abnahmekriterium:_ Eine Rechnung, die das
definierte Toleranzdatum überschreitet, erzeugt eine Benachrichtigung; es existiert ein Report
„Offene Posten“ mit korrekt ausgewiesenen überfälligen Beträgen.
_Integration/Export Buchhaltungssoftware:_ Um Doppelarbeit zu vermeiden, muss das System Daten mit
der FiBu-Software austauschen können. Mindestens ein **Export aller Rechnungsdaten** (Kundeninfo,
Rechnungsnummer, Betrag, Steuer, Kontierung) im geeigneten Format (z. B. DATEV-CSV oder via API)
ist erforderlich. Idealerweise erfolgt die Übergabe automatisiert über eine Schnittstelle in Echtzeit.
_Abnahmekriterium:_ Die im System erfassten Rechnungen lassen sich per Knopfdruck als CSV mit
vorgegebenem Aufbau exportieren. Optional: Nach Test-API-Call an Lexware erscheinen die
Rechnungen dort im System (dies kann in der Abnahme simuliert werden).

_Herkunft:_ Dieses Paket an Funktionen wurde im Gesamtkonzept als _Muss_ priorisiert
, da der
**Abschlagsrechnungsprozess integraler Bestandteil** des Geschäfts ist und im Ist unklar gehandhabt wird.
Die Anforderungen decken sich mit Persona-Needs: Buchhaltung (Rechnungsfristen, Automatisierung),
Innendienst (Zahlungspläne, Aufgaben) und GF (Transparenz der Forderungen). Abnahmekriterien ergeben
sich aus GoBD (kein Missing Link zwischen Leistung und Rechnung) und aus Geschäftsregeln (100% aller
geplanten Rechnungen werden tatsächlich erstellt und gelistet).

# (F12) Änderungslog und Nachvollziehbarkeit – Muss

- 14
- •
  Änderungen an _Rechnungen_ (Betrag, Fälligkeit, Status). Für jede solche Änderung sind Benutzername
  und Zeitstempel festzuhalten. Auch das Erstellen und Löschen relevanter Elemente soll geloggt
  werden. Ideal ist ein **Audit-Trail** , der auf Abruf alle Änderungen an einem Datensatz zeigt (z. B.
  „Rechnung #1005: Betrag am 12.11. durch User X geändert von 10.000 auf 12.000 €“). Zusätzlich
  kann ein allgemeiner Aktivitätsfeed die Zusammenarbeit erleichtern („User Y hat Datei XY
  hochgeladen“), was aber sekundär ist. _Abnahmekriterium:_ Für einen Rechnungsdatensatz wird eine
  Änderung (z. B. Markierung „bezahlt“) durchgeführt; anschließend lässt sich im Protokoll eindeutig

ablesen, _wer_ diese Änderung _wann_ vorgenommen hat. Keine Änderung an Schlüsselfeldern erfolgt,
ohne dass ein Log-Eintrag entsteht. _Herkunft:_ Diese Anforderung ist sowohl aus Compliance-Sicht
(GoBD verlangt Nachvollziehbarkeit) als auch durch die Personas motiviert (GF und Buchhaltung
wollen Änderungen nachvollziehen können). Das Konzept stuft dies als Muss-Kriterium ein, da ohne
Änderungslog weder Revisionssicherheit gegeben ist noch teamintern klar wäre, wer etwas
bearbeitet hat.

**Rechnungsdokumente archivieren (GoBD) – Muss:** Jede erstellte Rechnung muss **unveränderbar**
**archiviert** werden. D.h. das vom System generierte Rechnungs-PDF wird im System abgelegt und
kann nachträglich _nicht überschrieben oder gelöscht_ werden. Korrekturen erfolgen nur via Storno-/
Gutschriftbeleg. Außerdem sollen Rechnungsdatensätze nach Finalisierung gegen Bearbeitung
gesperrt werden (außer via definierter Korrekturaktion). _Abnahmekriterium:_ Ein Rechnungs-PDF,
einmal erzeugt, lässt sich nicht mehr ändern; auch das Rechnungsdatum und der Betrag im
Datensatz sind dann read-only (außer mit Admin-Rechten und Protokollierung). Zudem wird
sichergestellt, dass Rechnungen fortlaufende Nummern tragen und kein Nummernkreis „Lücke“ hat
ohne Dokument. _Herkunft:_ GoBD-Anforderung (Unveränderbarkeit), von Buchhaltung im Interview
betont („wenn einmal raus, darf nichts unbemerkt geändert werden“).

**Aufbewahrungsfristen und Archivstatus – Muss:** Das System muss unterstützen, Daten **10 Jahre**
**aufzubewahren** und danach geordnet zu entfernen. Konkret: Finanz- und Projektdaten erhalten
nach Abschluss ein _Archivierungsdatum_ = Abschlussdatum + 10 Jahre. Vor Erreichen dieses Datums
darf der Datensatz nicht gelöscht werden (gesperrt). Nach Ablauf sollte das System _Löschung/_
_Anonymisierung vorschlagen_ , mit Möglichkeit zur Durchführung (halbautomatisch). _Abnahmekriterium:_
Ein Testprojekt, abgeschlossen am Datum X, wird 1 Tag nach X+10 Jahren vom System als „Löschbar“
markiert; bis dahin ist ein Löschversuch geblockt mit Hinweis auf GoBD. _Herkunft:_ GoBD-
Aufbewahrungspflicht, im Konzept als Best Practice erwähnt, um Konflikt mit DSGVO zu lösen.
Buchhaltung und GF verlassen sich drauf, dass das System nichts voreilig löscht.

**DSGVO-Funktionen (Einwilligungen, Recht auf Löschung/Auskunft) – Muss:**
Da
personenbezogene Daten verarbeitet werden (Kundenkontakte, Ansprechpersonen), muss das
System DSGVO-konform sein. Fachlich heißt das:

Ein **Einwilligungs-Management** für Kontakte (z. B. Checkbox „Darf Marketing-E-Mails erhalten –
Einwilligung am [Datum]“).
Eine Funktion für **Datenauskunft** : Möglichkeit, alle Daten zu einer Person exportieren (z. B. als PDF/
Excel-Bericht).
**Datenlöschung/anonymisierung** : Möglichkeit, auf Anfrage personenbezogene Daten zu löschen,
_sofern keine Aufbewahrungspflichten dem entgegenstehen_ . Das System sollte prüfen: Falls z. B. ein
Kontakt in einer Rechnung vorkommt, kann es den Personenbezug entfernen statt den Datensatz zu
löschen (Name ersetzen durch „Entfernt“).

**Privacy by Design-Prinzipien** : Datenminimierung (nur notwendige Felder) und
Zugriffsbeschränkung (siehe Sicherheitsanforderungen). _Abnahmekriterien:_ Mindestens ein Kontakt-
Datensatz enthält Felder zur DSGVO-Einwilligung. Ein Export der persönlichen Daten des Kontakts
liefert alle zugehörigen Infos (Kontaktdaten, zugeordnete Aktivitäten etc.). Eine Löschfunktion
erlaubt es, einen Kontakt zu anonymisieren, wobei z. B. im Projekt der Personenname ersetzt wird,
die Projektdaten aber erhalten bleiben. _Herkunft:_ DSGVO-Vorgaben sind im Gesamtkonzept

beschrieben und von der GF-Persona wichtig (Datenschutz als hoher Wert). Auch hier: Muss-
Anforderung, da rechtlich zwingend.

**Reporting & Dashboard-Integration – Muss:** Die Finanzdaten müssen ins **Reporting-Modul**
einfließen, damit GF und Vertrieb die Übersicht bekommen. Konkret: Ein GF-Dashboard zeigt
Kennzahlen wie _Umsatz Ist vs. Plan, Offene Forderungen Gesamt, Anzahl überfällige Rechnungen,_
_Deckungsbeitrag pro Projekt_ usw.. Ein Vertriebs-Dashboard zeigt dem ADM seine Umsätze, ggf.
Provision, und die Pipeline (gehört teilweise zur Vertriebsdomäne, wird aber hier mit genannt, da
eng verzahnt). _Abnahmekriterium:_ Im GF-Bereich des Systems gibt es ein Dashboard, auf dem z. B.
„Umsatz dieses Quartals: 500k € (Plan: 480k)“ und „Offene Posten: 2 mit Gesamt 20k€“ angezeigt
werden – die Zahlen stammen live aus den im Finanzmodul erfassten Daten. _Herkunft:_ Persona GF
fordert KPI-Dashboard inkl. Finanz-KPIs; Konzept hat (F10) Reporting als Muss definiert.

**Kontakt- & Stammdatenverwaltung (Compliance-Aspekt) – Muss:** Alle Kunden, Lieferanten und
Kontakte müssen zentral verwaltet sein (dies ist eigentlich Domäne „Kontaktverwaltung“, aber
relevant, weil Finanzen darauf zugreifen). Wichtig: Jeder Kontakt kann einen DSGVO-Status haben
(siehe oben), und Beziehungen wie „Kunde gehört zu Konzern X“ sollten abbildbar sein.
_Abnahmekriterium:_ Beim Anlegen einer Rechnung wird aus einer einheitlichen Kundenliste der
Rechnungsempfänger ausgewählt; dieser Kunde hat einen hinterlegten DSGVO-Eintrag. _Herkunft:_ F1
Kontaktverwaltung im Konzept (Muss); DSGVO-Bezug siehe oben.

**Dokumentenmanagement – Soll:**
Finanzdokumente (Angebote, Aufträge, Rechnungen,
Lieferscheine) sollten im System hochladbar und an Projekte/Kunden anhängbar sein. Eine
Versionsverwaltung wäre wünschenswert (für Angebotsstände, wie erwähnt). _Abnahmekriterium:_ Der
Benutzer kann ein PDF-Angebot an das System anhängen; es ist für alle Beteiligten am Projekt
sichtbar und kann nicht unwiederbringlich gelöscht (nur archiviert) werden. _Herkunft:_ F7
Dokumentenmanagement im Konzept (Muss) + Persona Innendienst fordert zentrale Ablage.

**Zeiterfassungs-Integration – Soll:** Perspektivisch soll die Arbeitszeit-Erfassung ins System integriert
werden. Für die Finanzdomäne heißt das: Mitarbeiter buchen ihre Stunden auf Projekte, und diese
Daten stehen der Buchhaltung für Nachkalkulation und Lohnexport zur Verfügung.
_Abnahmekriterium (für Integration in MVP):_ Zeitdaten aus dem vorhandenen System _TimeCard_ können
importiert werden oder zumindest manuell erfasst werden, sodass die Buchhaltung im Projekt z. B.
„Ist-Stunden: 120h“ sieht. _Herkunft:_ Personas Buchhaltung und GF erwähnen die Relevanz der
Stunden für Kostenrechnung; Konzept: TimeCard soll langfristig abgelöst werden.

**Mobile App – Nice-to-have:** Eine native mobile App oder optimierte Oberfläche, die wichtigsten
Funktionen wie Kontaktdetails einsehen, Notizen erfassen, Ausgaben erfassen offline erlaubt.
Speziell: Offline-Modus (unbedingt Muss aus Außendienst-Sicht) – das System muss offline Eingaben
puffern. _Abnahmekriterium:_ Im Funkloch kann der ADM eine Besuchsnotiz speichern; nach
Wiederverbindung synchronisiert die App automatisch. (Dies ist technisch/fachlich eher Querschnitt,
aber hier genannt, da Außendienst es fordert). _Herkunft:_ NF1 Usability & Offline (Muss), Persona
Außendienst fordert Offline & mobile sehr stark.

Die obigen Anforderungen sind **dedupliziert** und decken alle fachlichen Muss-Themen der Domäne ab, wie
sie in den Materialien identifiziert wurden. Zur Priorisierung: Muss-Anforderungen (F11, F12 etc.) sind
unbedingt für den Go-Live nötig – ohne diese wäre das Kernziel (integrierte Rechnungs-/Finanzabwicklung)

verfehlt. Should-Anforderungen (z. B. Lieferantenintegration, Zeiterfassung, Spesen-App) erhöhen den
Nutzen erheblich, können aber bei Zeitdruck nachgezogen werden. Nice-to-have (Mobile App als solches,
erweiterte Features) runden die Vision ab, sind aber nicht kritisch.

**Abnahmekriterien (Zusammenfassung):** Das Finanzmodul gilt als erfolgreich implementiert, wenn z. B. im
Rahmen eines User Acceptance Tests folgendes Szenario reibungslos funktioniert: _Ein Vertriebsmitarbeiter_
_wandelt einen gewonnenen Lead in einen Auftrag um. Der Innendienst legt einen Rechnungsplan 30/50/20 % an._
_Das System erstellt drei Rechnungsvorgänge mit korrekt berechneten Beträgen. Zur Fälligkeit der ersten Rate_
_generiert es eine Aufgabe an die Buchhalterin „Rechnung stellen“. Diese öffnet den Vorgang, lässt sich ein PDF_
_erzeugen und versendet es. Das PDF wird unveränderbar archiviert. Nach einiger Zeit markiert die Buchhalterin im_
_System „Rechnung bezahlt am…“. Der Vertriebsmitarbeiter sieht daraufhin im Projektstatus „Teilzahlung 1_
_eingegangen“. Die zweite Rate wird überfällig, das System benachrichtigt automatisch Vertrieb und Buchhaltung_
_nach 7 Tagen Verzug. Außerdem kann die GF im Dashboard jederzeit sehen: Projekt X – Umsatz 100.000 €, 2. Rate_
_offen 7 Tage. Alle Änderungen (Statusänderungen, Datumverschiebungen etc.) sind protokolliert. Im Falle einer_
_Prüfung kann die Buchhalterin lückenlos nachweisen, wann welche Rechnung gestellt und bezahlt wurde. Zudem_
_kann sie per Knopfdruck alle relevanten Daten exportieren._ Wenn dieses End-to-End-Szenario erfüllt ist und die
Nutzer mit Performance und Usability zufrieden sind, sind die Kern-Abnahmekriterien erfüllt. (Weitere
Akzeptanzkriterien formulierten die GF-Persona: _100 % Übereinstimmung_ der System-Umsatzzahlen mit der
Buchhaltung und _Zeitersparnis_ in der Führung – diese dienen als Erfolgsmessung im Produktivbetrieb.)

### Nicht-Ziele (Descope):

Um den Projektrahmen klar abzustecken, wurden folgende Aspekte **ausgeschlossen (Nicht-Ziele)** – sie
werden _nicht_ im ersten Wurf umgesetzt:

**Vollständige Finanzbuchhaltung ersetzen:** Das System soll keine eigenständige Fibu mit Bilanz/
GuV, Steuer, Lohn etc. sein. Funktionen wie Doppelter Buchungssatz, USt-Voranmeldung oder
Anlagenbuchhaltung bleiben in Lexware. Wir bauen _kein zweites Lexware_ , sondern integrieren nur.
**Lagerverwaltung / Materialwirtschaft:** Obwohl im Ladenbau Material eine Rolle spielt, ist eine
Lager- oder Beschaffungsverwaltung nicht Teil des CRM/PM-Tools. Etwaige Rufe nach „Lager mit
reinnehmen“ wurden als Feature Creep identifiziert und verworfen.
**HR- oder Lohnabrechnung:** Personaldaten (über Zeiten hinaus) und Gehaltsabrechnung werden
nicht ins System integriert – dafür gibt es bestehende Lösungen.
**Automatisierte Provisionsabrechnung:** Wie oben entschieden, wird es im MVP keine
automatisierte Bonusberechnung oder Auszahlungsmodule geben. Die relevanten Daten werden
bereitgestellt, aber die Berechnung erfolgt außerhalb.
**Tiefgehendes Ressourcenmanagement:** Zwar werden Projektaufwände erfasst, aber z. B. eine
minutengenaue Auslastungsplanung jedes Mitarbeiters (Kapazitätsplanungstool) ist vorerst nicht
Ziel. Das System liefert Kennzahlen, aber ersetzt kein umfassendes PMO-Tool in dem Bereich.
**Multichannel-Marketing-Funktionen:** Abseits der DSGVO-Einwilligung verwaltet das System keine
Newsletter-Kampagnen oder ähnliches – Fokus liegt auf Vertrieb/Projekt, nicht Marketing-
Automation.
**Internationale Ausrichtung (vorerst):** Mehrsprachigkeit der UI oder Multi-Currency-Fähigkeit sind
nicht im Scope der ersten Version, da das Unternehmen primär national tätig ist. (Die GF erwähnte
es als Zukunftsgedanken
, bleibt aber ein Nice-to-have.)

# 20

---

_Page 21_

---

**Freigabe-Workflows:** Interne Freigabeprozesse (z. B. Angebotsfreigabe durch GF) werden
momentan nicht abgebildet, da im Ist nicht implementiert. Sollte Bedarf entstehen, kann dies später
ergänzt werden.
**Historische Datenmigration umfangreich:** Es ist nicht Ziel, alle Altdaten rückwirkend ins System zu
importieren (offen, siehe Offene Punkte). Ein Neustart mit Stichtag-Datenübernahme wird
favorisiert, um schnell produktiv zu gehen.

Diese Nicht-Ziele stellen sicher, dass das Projekt sich auf den **Kernnutzen konzentriert** : Eine integrierte
Lösung für CRM, Projekte und das Nötigste an Finanzsteuerung, **ohne** in eine vollständige ERP-Entwicklung
abzugleiten. Sie wurden mit den Stakeholdern abgestimmt, um spätere Begehrlichkeiten („Können wir nicht
auch…“) abwehren zu können und so den Projekterfolg nicht zu gefährden.

# 4. Produktvision & Zielbild (Finanz- & Compliance-Modul)

**Vision Statement:** _„Wir schaffen ein integriertes Finanz- und Compliance-Modul, das den Vertrieb und die_
_Projektabwicklung nahtlos mit der Buchhaltung verbindet. Es sorgt dafür, dass jeder Auftrag finanziell reibungslos_
_abgewickelt wird – pünktlich, transparent und regelkonform. Unsere Benutzer erhalten einen 360°-Blick auf_
_Kunden und Projekte, inklusive aller relevanten Finanzdaten, und können Entscheidungen auf einer verlässlichen_
_Datenbasis treffen. Das System nimmt Routinearbeiten ab, verhindert Fehler und stellt sicher, dass wir jederzeit_
_audit-ready sind. Damit steigern wir nicht nur die Effizienz, sondern auch das Vertrauen unserer Kunden,_
_Mitarbeiter und Prüfer in unsere Prozesse.“_

Diese Vision greift die Kernaspekte der Domäne auf: **Integration, Automatisierung, Transparenz und**
**Compliance** . Im folgenden Zielbild werden diese Leitgedanken konkretisiert.

**Werteversprechen:**
Das Finanzmodul liefert jedem Stakeholder klaren Mehrwert: - Für die
**Geschäftsführung** : ein zentrales Cockpit mit _aktuellen Finanzkennzahlen_ auf einen Blick (kein stundenlanges
Excel-Zusammentragen mehr). Entscheidungen werden beschleunigt und fundiert, da Umsatz, Cashflow
und offene Posten jederzeit abrufbar sind. Risiken (z. B. Zahlungsausfälle oder Budgetüberschreitungen)
sind früh erkennbar, sodass der GF gegensteuern kann, bevor Schaden entsteht. Die Vision ist, dass die GF
nie wieder sagen muss „Ich weiß gerade nicht, wie wir finanziell bei Projekt X stehen“ – das System macht
die _Unternehmenssteuerung in Echtzeit_ möglich. - Für die **Buchhaltung** : erhebliche Entlastung durch
Automatisierung und zentrale Daten. Sie muss nicht mehr hinter Informationen herrennen oder in zwei
Systemen arbeiten, sondern das Tool orchestriert den Rechnungsprozess ( _“90% der Workflows bleiben, aber_
_ohne Medienbrüche und manuelle Zurufe”_ ). Dadurch sinkt die Fehlerquote, und Routineaufgaben (Termine
überwachen, Mahnfristen) laufen systemgestützt. Das Modul verspricht auch absolute **Revisionssicherheit** :
Alle Finanzdaten sind lückenlos dokumentiert, was der Buchhaltung Sicherheit bei Prüfungen gibt (Ziel: _0_
_Beanstandungen bei der nächsten Steuerprüfung_ ). - Für den **Vertrieb/Außendienst** : das Finanzmodul
beseitigt lästige Bürokratie und erhöht die Transparenz. Außendienstler sehen ihren Umsatz und
Zahlungsstatus ihrer Kunden und können sich auf vertriebliche Tätigkeiten konzentrieren, während das
System im Hintergrund die Abrechnung sauber abwickelt. Das Versprechen an sie: _“Kein abendliches_
_Nacharbeiten von Notizen oder Spesenlisten mehr”_ – stattdessen können sie unterwegs alles Nötige im System
erledigen. Dies steigert die Zufriedenheit der Vertriebler, weil Erfolg (Provisionen, Umsätze) sichtbar und
Bürokratie minimiert wird. - Für den **Innendienst** : Das Tool ermöglicht es, aus der reaktiven Überlast in eine
geordnete, planbare Arbeitsweise zu kommen. Alle Abteilungen greifen auf dieselben Daten zu – das
verkürzt Abstimmungen enorm. Der Innendienst behält _den Überblick über alle Vorgänge_ und kann Kunden
oder Kollegen jederzeit Auskunft geben. Das Werteversprechen hier: **Weniger Chaos, mehr Kontrolle** – das

Team arbeitet mit einem gemeinsamen System statt mit „tausend Excel und E-Mails“, was Stress reduziert
und die Qualität der Arbeitsprozesse erhöht.

**Zielprozesse:** Im Zielbild laufen die Kernprozesse folgendermaßen ab (fachliche Soll-Prozesse): -
**Vertriebsprozess bis Auftrag:** Ein neuer Lead wird im CRM erfasst, qualifiziert und zur Opportunity.
Gewinnt der Vertrieb den Auftrag, wird per Knopfdruck ein Projekt/Vertrag angelegt – inkl. aller relevanten
Daten aus der Verkaufsphase (Angebot, Kunde, Preise). Der Innendienst ergänzt ggf. einen Zahlungsplan
im System. _Nahtlose Übergabe_ bedeutet: Die Informationen wandern digital vom Vertriebs- in den
Abwicklungsprozess, ohne Medienbruch. -
**Projektabwicklung & Rechnungen:**
Während der
Projektlaufzeit erstellt das System automatisch zu den Meilensteinen die erforderlichen Rechnungen
(Abschläge) oder gibt der Buchhaltung zumindest rechtzeitig den Task dafür. Die Buchhaltung erstellt die
Rechnungs-PDFs direkt aus dem System, so dass sie einheitlich formatiert sind und gleichzeitig in Lexware
verbucht werden (via Schnittstelle). Jede gestellte Rechnung ist sofort für Vertrieb und Innendienst sichtbar
– inklusive des Fälligkeitsdatums. Die Buchhaltung überwacht Zahlungen; sobald ein Zahlungseingang
erfolgt, aktualisiert sie den Status in der Anwendung. Bei Nicht-Zahlung erinnert das System automatisch
an Mahnaktionen. Der Prozess _„Verkauf -> Rechnung -> Zahlung/Mahnung“_ läuft damit systemgestützt und
transparent ab, ohne Lücken. Sobald alle Rechnungen bezahlt und Leistungen erbracht sind, markiert das
System das Projekt als „finanziell abgeschlossen“. - **Compliance & Prüfung:** Alle Unterlagen (Angebote,
Verträge, Lieferscheine, Rechnungen) sind im Projekt digital abgelegt. Sollte ein Wirtschaftsprüfer kommen,
kann die Buchhaltung per Exportfunktion alle relevanten Daten bereitstellen – z. B. sämtliche Rechnungen
inkl. Historie der Änderungen. Dank Audit-Trail ist nachvollziehbar, falls z. B. ein Rechnungsdatum mal
geändert wurde (mit Begründung). GoBD-Vorschriften wie Unveränderbarkeit werden eingehalten: Es gibt
keine „heimlichen“ Änderungen – das System verhindert sie oder zeichnet sie auf. Datenschutzprozesse
sind integriert: Ein Kundenkontakt, der Auskunft über seine gespeicherten Daten möchte, kann diese
schnell bekommen; wenn jemand die Löschung verlangt, stellt das System sicher, dass dies unter
Berücksichtigung der Aufbewahrungsfristen erfolgt. Das Unternehmen hat so die Gewissheit, **prüfsicher** zu
sein, ohne manuell in verschiedenen Systemen suchen oder dokumentieren zu müssen. - **Management &**
**Controlling:** Die Geschäftsführung und Führungskräfte nutzen das integrierte **KPI-Dashboard** , das
Vertrieb, Projekte und Finanzen zusammenführt. Ein Beispiel-Zielprozess: Jeden Montag ruft der GF das
Dashboard auf und sieht z. B.: _“Aktueller Auftragsbestand: 1,2 Mio €; davon 200k überfällig; durchschnittliche_
_Zahlungsdauer: 30 Tage; Top 5 Kunden nach Umsatz; Projekte im grünen/roten Bereich”_ . Von dort kann er in die
Details gehen, etwa ein rotes Projekt analysieren (wo liegen Kostenüberschreitungen? welche Rechnungen
sind offen?). Entscheidungen wie „Brauchen wir einen zusätzlichen Monteur?“ oder „Müssen wir bei Kunde
X das Zahlungsziel kürzen?“ werden so _datenbasiert_ gefällt, gestützt vom System, statt auf persönlicher
Erfahrung allein. Der GF hat zudem die Möglichkeit, Berichte aus dem System direkt an Gesellschafter-
Meetings zu geben, was die Transparenz gegenüber Stakeholdern erhöht. Im Zielbild wird das System
somit zum **unverzichtbaren Führungsinstrument** – es ersetzt manuelle Monatsreports durch **Echtzeit-**
**Cockpits** , was ein kultureller Wandel ist (Weg von Excel hin zu interaktiven Dashboards).

**Zielarchitektur (fachlich):** Fachlich betrachtet gliedert sich die Lösung in die definierten Domänen
(Kontakte, Vertrieb, Projekte, Finanzen), die nahtlos zusammenspielen. Für Finanzen heißt das: - Das
**Finanzmodul** hat Verknüpfungen zum **Vertriebsmodul** (übernimmt Auftragswerte aus Opportunities,
informiert über verlorene Deals Gründe für Forecast), zum **Projektmodul** (Rechnungen hängen an Projekt-
Meilensteinen) und zum **Kontaktmodul** (zieht Kundenadressen für Rechnungen, nutzt Kontakthistorie bei
Mahnungen). - An der Grenze zur externen **FiBu-Software** (Lexware) gibt es eine definierte Schnittstelle:
z. B. ein Synchronisationsdienst, der neue Rechnungen aus dem CRM in Lexware einstellt und umgekehrt
Zahlungsbuchungen zurück ins CRM spielt. - Die **Datenbasis** ist eine gemeinsame Datenbank, was

bedeutet: Ein Kunde hat _eine_ Datenkartei, auf die Vertrieb, Projekt und Buchhaltung zugreifen (früher gab
es evtl. getrennte Kundenlisten in CRM und Lexware, das entfällt). - Die _Rollen und Berechtigungen_ sind so
eingestellt, dass jeder Nutzer in seinem Dashboard genau die Infos sieht, die er braucht, ohne von
irrelevanten Daten überflutet zu werden (Beispiel: Der Vertriebsaußendienst sieht bei seinen Projekten die
Rechnungsstatus, aber keine Interna anderer Projekte; der GF sieht aggregierte Kennzahlen über alle).

Dieses fachliche Architektur-Zielbild sorgt dafür, dass die ehemals isolierten Prozesse **ineinandergreifen**
(Zitat Konzept: „Kunde -> Opportunity -> Projekt -> Rechnung -> Analyse, alles in einem System“). Eine
Besonderheit, die im Zielbild betont wird, ist unser Alleinstellungsmerkmal: **Finanzen sind voll integriert** ,
was am Markt selten ist (viele CRM+PM-Lösungen lassen Finanzielles aus und erfordern ein extra ERP).
Unsere Vision umfasst aber zumindest grundlegende Finanzinfos (Teilzahlungen etc.) innerhalb der Lösung.
Damit heben wir uns ab: _„hochintegriert statt nur angebunden“_ .

**Adressierte Zielgruppen:** Die Haupt-Zielgruppen des Moduls wurden bereits genannt: - **Buchhaltung**
(primäre Nutzerin des Finanzmoduls zur operativen Abwicklung), - **Geschäftsführung** (Konsument der
Finanzdaten für strategische Zwecke), - **Vertrieb/Außendienst** (Teilprozess-Nutzer: Übergabe von
Aufträgen, Überwachung Zahlstatus, Provisionseinblick), - **Innendienst/Kalkulation** (Prozesstreiber:
Angebots->Auftrag Übergabe, Koordination mit Buchhaltung), - sekundär **Planung/Projektteam** (die zwar
das Finanzmodul nicht aktiv bedienen, aber z. B. vom Status „Zahlung offen“ Kenntnis haben müssen, um
evtl. Lieferungen zu stoppen – siehe Regel „wenn Abschlag nicht bezahlt, Produktion nicht starten“ als
Gedankenspiel).

Jede dieser Gruppen wird im Zielbild durch dedizierte **UI-Module (Cockpits)** angesprochen: Die
Buchhalterin hat z. B. ein _Finanz-Cockpit_ mit offenen Posten, fälligen Aufgaben und einem Abschluss-
Checkliste; der GF ein _Management-Dashboard_ ; der Vertriebsmitarbeiter ein _Vertriebs-Dashboard_ mit Umsatz
und Pipeline; der Innendienst eine _Projektübersicht_ mit Ampeln und ausstehenden Aktionen. So fühlt sich
jeder _persönlich abgeholt_ und erhält **personaspezifischen Nutzen** aus dem System.

**Qualitative Ziele:** Neben den quantifizierbaren Zielen (siehe unten) gibt es qualitative Erfolgsfaktoren des
Finanzmoduls: - **Datenqualität & Vertrauenswürdigkeit:** Das System wird als „einzige Wahrheitsquelle“
akzeptiert. Mitarbeiter pflegen Daten sorgfältig, so dass Berichte stimmen. Erfolg wäre z. B., wenn die GF
nicht mehr parallel in Excel gegencheckt, sondern dem Dashboard voll vertraut. - **Benutzerakzeptanz:** Die
Nutzer empfinden das Modul als Erleichterung, nicht als Bürokratie. Das zeigt sich daran, dass z. B.
Außendienstler _freiwillig_ ihre Spesen digital erfassen, weil es einfacher ist, oder dass die Buchhaltung stolz
präsentiert, wie schnell der Monatsabschluss nun geht. Interne Umfragen könnten Zufriedenheitswerte
erheben (Ziel: >80% Zufriedenheit mit Bedienung). - **Zusammenarbeit & Transparenz:** Spürbare
Verbesserung der bereichsübergreifenden Zusammenarbeit. Indikator: Rückfragen zwischen Abteilungen
nehmen ab („Wo steht das?“), stattdessen „schau ins System“. Ein Team-Lead könnte sagen: _“Früher mussten_
_wir wöchentlich Meeting machen, nur um Zahlen abzugleichen, jetzt sehen alle alles in Echtzeit – Meetings können_
_sich auf Lösungen statt auf Datensammlung konzentrieren.”_

**Quantitative Ziele:** Einige messbare Ziele wurden im Kontext genannt: - **Beschleunigung der**
**Rechnungsstellung:** Durchschnittliche Zeit vom Leistungsabschluss bis Rechnungsversand soll auf z. B. <5
Werktage sinken (bisher oft >2 Wochen wegen Infos nachlaufen). -
**Verbesserung der**
**Zahlungseingangsquote:** Durch proaktives Mahnen soll der Anteil der >30 Tage überfälligen Forderungen
um X% reduziert werden (z. B. von 10% des Umsatzes auf <5%). - **100% Compliance-Score:** Idealziel, dass
bei der nächsten Betriebsprüfung **keine Beanstandungen** bezüglich GoBD auftreten. Das würde bedeuten:

Jeder Beleg nachvollziehbar, Archiv vollständig, Protokolle vorhanden – faktisch das Ziel „prüfungsfest“. -
**Effizienzgewinne:** z. B. _50% Zeitersparnis_ bei der Report-Erstellung für die GF (statt 8 Std. manuelles Excel-
Bauen nur noch 1-2 Std. Kontrolle der Systemauszüge). Oder Buchhaltung spart pro Rechnungsvorgang 15
Minuten (kein händisches Nummern vergeben und Word schreiben). - **Nutzerquote:** Ziel könnte sein, dass
_100% der relevanten Vorgänge im System abgebildet werden_ . D.h. kein Vertriebsmitarbeiter legt mehr einen
Kunden im Excel an oder schreibt ein Angebot extern – alles läuft über das System. Hier kann man als KPI
z. B. definieren: „Anzahl der Aufträge 2025, die komplett im System angelegt und abgerechnet wurden:
100%“. - **Reduktion von Fehlern:** Metrik: Anzahl der Rechnungsfehler (falscher Betrag, falsches Datum)
gegen Null. Ebenso Wegfall von Duplikaten (kein Kunde doppelt angelegt, etc., dank Dublettenprüfung) –
das kann man in Testimports und ersten Nutzungen prüfen.

Diese Ziele werden in einem **Measurement Plan** festgehalten und nach Einführung gemessen, um den
Erfolg des Moduls zu evaluieren. Insgesamt soll das Finanz- & Compliance-Management-Modul dazu
führen, dass das Unternehmen **finanziell „auf Schienen“ läuft** : Jeder weiß, was zu tun ist, nichts fällt
durchs Raster, und man kann sich auf inhaltliche Arbeit konzentrieren statt auf Nachtelefonieren oder
Datensuchen.

# 5. Lösungsweg: Fachlicher Lösungsansatz

Basierend auf Anforderungen und Vision wurde ein konsistenter fachlicher Lösungsansatz erarbeitet.
Dieser Abschnitt beschreibt die **Datenobjekte** , **Prozesse** , **Regeln** und **Automatisierungen** des
Finanzmoduls. Außerdem werden fachliche Alternativen beleuchtet und getroffene Projektentscheidungen
begründet.

### Zentrales Datenmodell & Objekte

Das Finanzmodul führt mehrere Datenobjekte ein (teils in Abschnitt 1 schon definiert), die in Beziehung
zueinander stehen:

**Kunde / Kontakt:** Stammdatenobjekte aus der CRM-Domäne, notwendig für Rechnungsadressaten
und DSGVO-Dokumentation. Jeder Rechnung ist ein Kunde zugeordnet. Kunden haben Attribute wie
Name, Adresse, Kundentyp und DSGVO-Einwilligungen. _Integration:_ Kundenobjekte werden auch in
anderen Modulen (Vertrieb, Projekte) verwendet; es gibt also _eine_ Kundentabelle für alle.
**Projekt:** Zentrales Objekt der Projektmanagement-Domäne, das einen Auftrag repräsentiert. Für das
Finanzmodul relevant: Jedes Projekt hat ein _Auftragsvolumen (Wert)_ , ein _Status_ (laufend,
abgeschlossen) und kann _Kosteninfos_ enthalten (z. B. geplante vs. Ist-Kosten). Wichtig: Die
**Verknüpfung Projekt – Kunde – Rechnung** . Ein Projekt kann mehrere Rechnungen haben; jede
Rechnung gehört genau zu einem Projekt. Das Projektobjekt hält auch den _Rechnungsplan_ (siehe
nächster Punkt) und kann Felder haben wie „finanziell abgeschlossen (ja/nein)“.
**Rechnungsplan:** Dieser kann als eigenständiges Objekt oder als Attribut des Projekts modelliert
werden. Wir schlagen vor: Ein Projekt hat eine _Liste von Rechnungsplan-Einträgen_ , welche jeweils
definieren: Prozent oder Betrag, Fälligkeitszeitpunkt relativ oder absolut, Typ (Abschlag/Schluss).
Beispiel: [(30%, „bei Auftrag“), (50%, „4 Wochen vor Montage“), (20%, „bei Fertigstellung“)]. Diese
Einträge dienen der Generierung der Rechnungen. Sie sind bearbeitbar solange das Projekt im
Angebotsstatus ist; nach Auftrag werden sie fixiert.
**Rechnung:** Kernobjekt des Finanzmoduls, das alle Infos einer Kundenrechnung enthält. Attribute:
Rechnungs-Nr., Datum, Betrag (Nettobetrag + Steuer, evtl. Brutto), Fälligkeit, verknüpfter

Rechnungsplan-Eintrag (welche Rate), verknüpftes Projekt, verknüpfter Kunde, Status (offen/bezahlt/
storniert). Mögliche Unterattribute: Zahlungsziel (z. B. 14 Tage netto), evtl. Rechnungs-PDF-Datei als
Anhang/Pfad. Eine Rechnung kann auch Felder haben wie „Storno-Bezug“ (falls Gutschrift).
**Zahlung:** Evtl. als eigenes Objekt modelliert, das eine oder mehrere Zahlungen zu einer Rechnung
abbildet (z. B. Teilzahlungen). Mindestens aber als attributiver Datensatz: Zahlungseingang mit
Datum, Betrag, Verweis auf Rechnung. Kann mehrere pro Rechnung geben (dann wird offener Rest
berechnet).
**Offener Posten (Derived):** Eigentlich kein eigenes Objekt, sondern eine _Berechnung aus Rechnung_
_minus Zahlungen_ . Könnte aber als View z. B. für das Mahnwesen bereitgestellt werden.
**Beleg (Dokument):** Gemeint sind hier gescannte oder erzeugte Dokumente, die mit Projekten/
Belegen verknüpft sind. Z. B. das vom Kunden unterschriebene Angebot (PDF), die Rechnung selbst
(PDF), Lieferscheine, Abnahmeprotokolle etc. Diese werden im Dokumentenmanagement
gespeichert, mit Meta-Infos: Dateiname, Typ, verknüpftes Objekt (Projekt/Rechnung), Upload-
Datum. Für Compliance wichtig: Markierung „archiviert“ für manche (damit nicht mehr gelöscht).

**Änderungslog-Eintrag:** Technisches Objekt, das Änderungen protokolliert, mit Feldern: Objekt-Typ,
Objekt-ID, Feldname, alter Wert, neuer Wert, Benutzer, Zeitstempel. Dieses wird für Audit-Trail
verwendet und in einem Log-Viewer dargestellt.

**Einwilligung:** Pro Kontakt gibt es Einwilligungs-Datensätze (z. B. Marketing-Erlaubnis), inkl. Zweck,
Datum, evtl. Dokumentation (z. B. Checkbox geklickt). Dieses ist Teil der Kontaktdomäne.

**Systemrollen:** Zwar kein Datenobjekt im engeren Sinne, aber erwähnenswert: vordefinierte Rollen
(Vertrieb, Innendienst, Buchhaltung, GF, Admin) mit zugeordneten Rechten. Evtl. als
Konfigurationsdatensatz abgebildet.

**Datenbeziehungen & Regeln:** - _Projekt – Rechnung:_ 1:n Beziehung (ein Projekt hat viele Rechnungen).
Löschen: Wenn Projekt gelöscht wird (nur erlaubt vor Auftragsphase?), dann zugehörige Rechnungsobjekte
ebenfalls (sofern keine rechtsverbindlichen Rechnungen erstellt). Nach GoBD dürfen aber gebuchte
Rechnungen nicht einfach gelöscht werden – deshalb: Wird ein Projekt archiviert, bleiben Rechnungsdaten
bestehen bis Fristende. - _Rechnung – Zahlung:_ 1:n (eine Rechnung kann mehrere Zahlungseingänge haben).

Summenregel: Summe der Zahlungen ≤ Rechnungsbetrag; wenn =, dann Status bezahlt. - _Rechnung –_
_Kunde:_ n:1 (jeder Rechnung ein Kunde). Konsistenzregel: Kunde muss aktiv/nicht gelöscht sein. - _Rechnung –_
_Rechnungsplan:_ 1:1 Beziehung: Jede Rechnung (Abschlag) entspricht einem Eintrag im Rechnungsplan.
Außer Schlussrechnung evtl. deckt den Rest. - _Lieferantenrechnung – Projekt:_ (falls abgebildet) n:1, sprich
viele Lieferantenbelege pro Projekt. Diese fließen in Ist-Kosten ein. - _AuditLog – [beliebiges Objekt]:_ n:1 (viele
Log-Einträge pro Objekt). - _Kontakt – Projekt:_ n:m (ein Projekt hat oft mehrere Ansprechpartner: Kunde, evtl.
Architekt etc., und ein Kunde hat viele Projekte). Aber hier Kunde=Firma, Kontakt=Person wäre separiert.

**Schlüsselregeln & Constraints:** - **Rechnungsnummernkreis:** Muss einmalig und lückenlos sein. Regel:
Nummer = {Jahr}-{laufende Nr.}, oder ein anderer konfigurierter Pattern. Das System vergibt die Nummer
beim Erstellen finaler Rechnung automatisch. Keine zwei Rechnungen dürfen gleiche Nr. haben; keine
Nummern dürfen übersprungen sein außer stornierte. - **Pflichtfelder und Validierung:** Eine Rechnung
darf nur erstellt werden, wenn Kundendaten vollständig sind (Name, Adresse, Steuer-ID falls nötig). Das
System prüft dies. Beträge müssen plausibel sein (z. B. Summe Raten = 100%). Rechnungsdatum =
Erstellungsdatum standardmäßig, aber änderbar falls im Voraus datiert. Fälligkeitsdatum =
Rechnungsdatum + Zahlungsziel (automatisch). - **Geschäftsjahr-Abschluss:** Evtl. muss man definieren, ob

Rechnungen über Jahreswechsel besondere Behandlung brauchen (z. B. fortl. Nummern über Jahresende
weiter oder Reset – Konvention definieren). - **Berechtigungen:** Durch Regeln umgesetzt: z. B. nur Rolle
Buchhaltung oder Admin darf Rechnungsdaten ändern (Betrag, Datum). Der Vertrieb darf sie zwar sehen,
aber nicht editieren. Das System erzwingt das: Buttons „Bearbeiten“ nur für Berechtigte. - **DSGVO-Regel:**
Wenn ein Kontakt „gelöscht“ (anonymisiert) wird, muss sichergestellt sein, dass z. B. sein Name auf
Rechnungen entfernt wird, aber z. B. Kundennummer bestehen bleibt. Das System implementiert hier eine
Logik: Beim Löschauftrag an Person prüft es verknüpfte Objekte. Wenn z. B. Person = Ansprechpartner in
Projekt mit noch nicht archivierten Rechnungen -> statt komplettes Löschen, Feld „Name“ in Personendaten
durch „ENTFERNT“ ersetzen, um weiterhin eine Kartei zu haben, aber ohne personenbezogenes Datum. -
**Archivregel:** Nach 10 Jahren wird Datensatz gesperrt für Änderung. Implementierung: Ein Feld „archiviert
bis Datum X“ – sobald current date < archiv. bis, verweigern Edit/Delete außer Admin. Diese Regel gilt
systemweit für Projekte und Rechnungen.

### Wichtige Prozessflüsse & Automatisierungen

Einige Prozesse wurden bereits im Zielbild skizziert. Hier fokussiert auf **Automatisierungen und Regeln** in
den Abläufen:

**Opportunity -> Projekt Conversion:** Automatisiert werden hier das Übernehmen der Daten. Bei
Klick „Opportunity gewonnen“ fragt System: Projekt anlegen? Wenn ja, erstellt es ein Projektobjekt,
kopiert Kunde, Opportunity-Name als Projektname, Angebotssumme als Projektbudget usw. (vgl.
Konzept F4). _Entscheidung:_ Das wird implementiert, weil es Standard-CRM-Funktion ist und Fehler
vermeidet (kein doppeltes Eintippen). Hier gab es keine Alternative außer manuell anlegen, die aber
schlechter wäre.
**Automatische Rechnungserstellung:** Das System generiert _platzierte Rechnungs-Datensätze_
aufgrund des Zahlungsplans. Zwei Alternativen gab es: 1) _Vollautomatische Rechnung erstellen &_
_versenden_ (System schickt z. B. PDF an Kunden, „Lights-Out“-Verarbeitung), 2) _Teilautomatisch:_ System
erzeugt Entwurf/Aufgabe, Buchhaltung prüft und sendet. Wir entschieden uns für Variante 2
(teilautomatisch). Grund: Buchhaltung will Kontrolle behalten, v.a. in Anfangsphase, um Fehler
abzufangen und z.B. kleine Anpassungen (Leistungstext, Projekt-Ref) vorzunehmen. Best Practice
laut Konzept ist ja: System erstellt _vorgefertigte Rechnung, Buchhaltung prüft/sendet_ . Das setzen wir so
um. Somit wird automatisiert: Termin-Reminder + Entwurf generieren. Gesendet wird manuell (ggf.
per Klick). Das minimiert Risiko und erhöht Akzeptanz, da die Fachkraft sich nicht entmündigt fühlt.
**Mahnwesen-Automation:** Hier ebenfalls der Ansatz: _Proaktive Reminder_ statt vollautomatisierte
Mahn-E-Mails. Das System generiert eine Task „Zahlungserinnerung an Kunde X schicken“ an
Buchhaltung oder Vertrieb. Alternativ hätte man eine automatische Mahn-E-Mail nach x Tagen
senden können. Wir wählten die Task-Variante, weil das Mahnwesen oft ein Fingerspitzengefühl
braucht (erster Anruf statt gleich Mahnschreiben). Die Buchhaltung kann dann im System per
Template eine Mahnung erzeugen, aber der Impuls kommt vom System. Das ist ein pragmatischer
Mittelweg.
**Integration Lexware (Automatisierung):** Sobald eine Rechnung im CRM final markiert ist, soll im
Hintergrund ein Script/API-Aufruf die Rechnung in Lexware anlegen. Hier besteht eine potentielle
_Alternative:_ keine Live-Integration, sondern periodischer CSV-Export (z. B. wöchentlich) und Import in
Lexware manuell. Wir streben aber die direkte Integration an, weil Lexware eine API hat und wir
Doppeleingaben vermeiden wollen. Diese Entscheidung bringt zwar technischen Aufwand, aber
auch Nutzen: _Echtzeit-Sync_ garantiert, dass GF keine Diskrepanzen sieht (Ziel 100% Übereinstimmung

Zahlen GF-Dashboard vs. FiBu). Sollte die API-Integration zu komplex sein, stünde der CSV-Plan B
noch offen (Risiko- und Zeitabwägung).
**Zeitdatenerfassung:** Zwei Pfade:
Kurzfristig: _Kopplung_ – TimeCard exportiert CSV, das System importiert, um Ist-Stunden pro Projekt
zu aktualisieren.
Langfristig: _Ablösung_ – eigenes Zeiterfassungsmodul. Wir entschieden uns, schrittweise vorzugehen:
Zum Launch nur Kopplung, damit nichts Altbewährtes abgeschaltet wird. Die Integration kann
eventuell so aussehen, dass Buchhaltung am Monatsende auf „Stunden importieren“ klickt und CSV
einliest. Alternativ, wenn TimeCard DB-Zugriff möglich, könnte man automatisieren. Aber das ist
Nebenthema im Vergleich zu Rechnungen. Indem wir so vorgehen, riskieren wir nicht die
Datenqualität anfangs, da so ein Systemwechsel (Zeiterfassung) auch Change bedeutet. Für Phase 2
wäre dann Ziel, die _Stundenerfassung ins Portal_ zu verlegen (Mitarbeiter buchen direkt im CRM ihre
Zeiten), was die Buchhaltung noch mehr entlastet und Echtzeit-Projektkosten liefert.
**Kostenverfolgung einfach:** Da wir uns gegen umfassendes Controlling im MVP entschieden haben
(siehe Gap 2), bleibt die Automation hier gering. Wenn die Buchhaltung aber Kosten nachträgt (z. B.
Lieferantenrechnung 5.000€ dem Projekt zuordnet), könnte das System _automatisch die Marge_
_berechnen_ (Projektwert 50k – Kosten 45k => 5k Überschuss) und anzeigen. Das ist eine kleine
Berechnungsautomation, die wir vorsehen, falls Kosten erfasst werden.
**Benachrichtigungen & Eskalationen:** Über die genannten hinaus gibt es allgemeine
Automatisierungen: z. B. Notify GF, wenn ein großer Deal gewonnen (Vertriebsbereich), oder if
Projekt budget overrun >10% then highlight in Dashboard (Reporting-Funktion). Auch
_Eskalationsketten_ könnten konfiguriert werden: z. B. 2. Mahnstufe cc an GF. Solche Mechanismen
definieren wir mit den Fachbereichen. Aktuell im Fokus: Payment overdue -> Vertrieb wird involviert
(informell hieß es, Vertrieb soll nachhaken).

- •

**Fachliche Alternativen & Entscheidungen:**

Einige Alternativen wurden bereits angesprochen: - _Rechnungsstellung ins CRM vs. extern belassen:_ Wir haben
entschieden, so viel wie möglich im CRM selbst zu machen (inkl. PDF-Erstellung), statt z. B. Lexware den
Rechnungsdruck machen zu lassen. Alternative wäre: CRM generiert nur Datensatz, Buchhalter öffnet
Lexware, erstellt Rechnung, man verknüpft PDF zurück. Das wäre aber wieder Medienbruch und
fehleranfällig. Unsere Lösung: Das CRM kann Rechnungsvorschläge/PDF erstellen, Lexware wird nur noch
als „Buchungswerkzeug“ im Hintergrund gefüttert. Diese Entscheidung erhöht die Integrationstiefe und
folgt Best Practices (viele moderne ERP/CRM machen die Rechnung im System und sind GoBD-konform). -
_Komplexität Controlling:_ Alternative wäre gewesen, gleich ein volles Kostencontrolling und Profitcenter-
Rechnung einzubauen (z. B. mit _Earned Value Management_ im Projekt). Wir entschieden uns dagegen, weil
Overkill für ein mittelständisches Unternehmen – _„Best Practice in Projekt-Controlling wie Earned Value wäre_
_vermutlich Overkill“_ . Stattdessen simple Margenanzeige. - _Make or Buy:_ Strategische Alternative: Ein
Standard-CRM/PM-Tool mit Finance-Modul anzuschaffen statt Eigenkonzeption. Marktvergleich zeigte
einige Lösungen (Insightly, Dynamics 365 mit PSA, etc.), aber oft mit Abstrichen bei Finanzintegration.
Unsere Vision mit tiefer Finance-Integration und Branchenfokus (Ladenbau) schien am besten durch eine
maßgeschneiderte Lösung erreichbar. Daher fiel die Entscheidung auf Konzeption eines eigenen Prototyps.
Dies ist im Konzept festgehalten: _„Unsere Ideallösung kann sich durch Branchenfokus, Compliance-_
_Berücksichtigung und hohe Usability differenzieren. Statt generisches System aufwändig anzupassen, entwickeln_

_wir einen maßgeschneiderten Prototyp …“_ . Risiko (fehlender Support etc.) wird bewusst in Kauf genommen,
gemessen am Nutzen (kein Workaround, alles an einem Ort).

_Freigabe-Workflows:_ Hier stand zur Diskussion, ob z. B. Angebote über einem bestimmten Wert im
System durch GF freigegeben werden müssen (Kontrolle der Innendienst-Kalkulation). Aktuell
vertraut GF dem Team, braucht aber Option
. Wir entschieden: In Version 1 kein
obligatorischer Workflow (weil Kultur offen). Alternative wäre Implementierung eines
Freigabeprozesses gewesen, was zusätzlichen Entwicklungsaufwand bedeutet. Stattdessen notiert:
optional mittelfristig (Nice-to-have).
_Schnittstellen-Umfang:_ Alternative: Neben Lexware auch andere Systeme integrieren (z. B. Outlook-
Kontakte, Bank/Kontoauszüge für Auto-Abgleich Zahlung, etc.). Wir priorisierten: Lexware-Sync ist
Muss, andere sind Should/Nice (z. B. Outlook-Sync, Excel-Export). Grund: Lexware hält uns gesetzlich
den Rücken frei (Buchhaltung), das ist kritisch. Anderes erhöht Komfort, kann aber folgen.
_Usability vs. Feature-Fülle:_ Wir legten im Konzept fest, lieber das System _schlank und nutzerfreundlich_
zu halten, statt jeden Sonderfall abzubilden. So blieben einige Nice-to-haves bewusst draußen. Z. B.
könnte man jede erdenkliche Auswertung bauen – wir starten mit den wesentlichsten KPIs, um die
UI nicht zu überfrachten. Der GF-Persona sagte auch: _„zum Start muss das Wesentliche sitzen, später_
_kann man erweitern“_ . Das haben wir als Richtschnur genommen.

Zusammenfassend stützt sich der Lösungsansatz stark auf **Best Practices** : automatische Workflows statt
Zuruf, Audit-Trails, 360°-Integration. Wo immer sinnvoll, wurde die _einfachere fachliche Lösung_ bevorzugt,
um Akzeptanz und Machbarkeit sicherzustellen – z. B. Reminder statt vollautomatischer Aktionen, MVP-
Fokus auf Must-Haves und gradualer Ausbau. Dieses Vorgehen soll garantieren, dass das Finanzmodul die
Kernprobleme (Verzug, Doppelarbeit, Intransparenz) löst, ohne die Organisation mit zu viel Neuerung auf
einmal zu überfordern.

# 6. Schnittstellen zu benachbarten Domänen und Systemen

Die Domäne Finanz- & Compliance-Management steht nicht isoliert, sondern ist eng verflochten mit
anderen fachlichen Bereichen des integrierten CRM/PM-Tools. Eine klare Definition der **Schnittstellen,**
**Datenübergaben und Verantwortlichkeiten** zwischen den Domänen ist wesentlich, um einen
reibungslosen Gesamtprozess zu gewährleisten. Ebenso relevant sind Schnittstellen zu _externen Systemen_
(insb. der Finanzbuchhaltung Lexware). Im Folgenden werden die wichtigsten Schnittstellenbeziehungen
und Abläufe beschrieben – inklusive der Zuständigkeiten und Eskalationsmechanismen, falls an einer
Schnittstelle etwas schief läuft.

### Schnittstelle Vertrieb (CRM) ↔ Finanzen

**Datenübergaben:** Wenn eine Verkaufschance (Opportunity) erfolgreich abgeschlossen wird, übergibt der
Vertrieb **den Auftragswert, Kunden und Vertriebsinformationen an das Finanzmodul** . Konkret:
Statuswechsel Opportunity->“gewonnen“ triggert Projektanlage, wobei _Auftragswert, Kunde, gewonnene_
_Angebotsversion_ übernommen werden. Dabei fließt auch die Info _„Wer hat den Deal gemacht?“_ mit (wichtig
für Provisionen und Berichte). Außerdem wird ein voraussichtliches Liefer-/Montagedatum (aus dem
Vertriebsangebot) an das Projekt übergeben, das für die Rechnungsplanung genutzt wird (z. B. 4 Wochen
vor Montage 2. Rate).

**Verantwortlichkeiten:** Der **Vertrieb (Außendienst)** ist verantwortlich, die Opportunity im System richtig
zu pflegen und bei Abschluss den Übergabeprozess auszulösen. D.h. er klickt „Abschluss“ und prüft die
automatisch generierten Projektdaten. Danach liegt die Verantwortung beim **Innendienst** (bzw.
Vertriebsinnendienst), den Auftrag im System weiter zu detaillieren (Rechnungsplan eingeben,
Projektstruktur anlegen). Der Außendienst übergibt also an den Innendienst; diese Zuständigkeit soll im
Prozess klar benannt sein („ADM X markiert Opportunity gewonnen und informiert Innendienst Y – das
System erstellt Aufgabe an Y zur Projektprüfung“).

**Datenabgleich:** Informationen, die der Vertrieb während der Akquise gesammelt hat (besondere
Zahlungsbedingungen, Kundenvorgaben), müssen ins System übernommen werden – dafür kann der
Außendienst z. B. im Notizfeld vermerken „Kunde wünscht 2 Raten“ oder ein Häkchen
„Sonderzahlungsplan“ setzen, was dann vom Innendienst interpretiert wird. Idealerweise wird dies
strukturierter: z. B. als Teil des Angebots im CRM wurde Zahlungsplan bereits festgelegt, sodass beim
Gewinn dieser Plan ins Finanzmodul übernommen wird.

**Eskalationsmechanismus:** Sollte bei der Übergabe etwas fehlen oder unstimmig sein (z. B. Außendienst
schließt Deal ab, aber vergisst Zahlungsziel zu klären), greift ein definierter Mechanismus: Der Innendienst
darf das nicht ins Leere laufen lassen, sondern hat z. B. eine Checkliste „Auftrag komplett?“. Wenn ein
Eintrag fehlt, eskaliert er zurück an den Außendienst („Bitte Info X nachreichen“). Dies kann über das Tool
erfolgen (Task „Daten unvollständig: Kläre Zahlungsbedingung mit Kunde“ an ADM). Umgekehrt, wenn der
Außendienst merkt, dass nach seiner Abschlussmeldung nichts passiert (vielleicht hat Innendienst
übersehen), soll er eskalieren können: nach einem Tag ohne Projektanlage, ruft er Innendienst oder
markiert im System „Bitte um Bearbeitung“. Diese menschlichen Eskalationen werden durch klare
Verantwortlichkeiten minimiert (d.h. es wird jemand als _Projektverantwortlicher Innendienst_ automatisch
zugewiesen).

**Datenflüsse im laufenden Vertrieb:** Bereits vor Abschluss gibt es Berührungspunkte – z. B. möchte der GF
Forecasts (Vertriebs-Chancen-Werte) mit Kapazitätsplanung und Finanzplanung verzahnen. Das bedeutet,
das Finanzmodul greift auf Vertriebsdaten wie Abschlusswahrscheinlichkeiten zu, um einen _Finanzforecast_
zu berechnen (Opportunity steuert Auftragsbestand für Finanzforecast). Hier ist mehr ein Reporting-
Abgleich; verantwortl. ist, dass Vertrieb die Opportunity-Wahrscheinlichkeit pflegt. Das Finanz-Dashboard
zieht diese Daten. Keine direkte Person-Esklation, aber es wird im Prozesshandbuch vermerkt: _„Vertrieb_
_muss Pipeline aktuell halten, sonst Forecast falsch (Risiko)“_ .

**Vertriebsprovision:** Schnittstelle hier: Das Finanzmodul liefert dem Vertrieb Auswertungen über erzielten
Umsatz pro Vertriebsmitarbeiter (Datenherkunft: Rechnung bezahlt, Vertriebszuordnung). Es ist vereinbart,
dass die Buchhaltung monatlich einen Provisionsbericht aus dem System generiert und dem Vertrieb
bereitstellt. Sollte es Unstimmigkeiten geben (z. B. ein Auftrag wurde dem falschen Mitarbeiter zugeordnet),
hat der Vertrieb eine Möglichkeit zur Korrektur-Esklation: Er meldet an Buchhaltung/GF, die Änderung wird
vorgenommen (mit Audit-Trail). Diese Interaktion wird aber voraussichtlich gering sein, da das System
schon beim Anlegen Klartext anzeigt, wer Provision kriegt.

### Schnittstelle Projektmanagement ↔ Finanzen

**Datenübergaben:** Das Projektmanagement-Modul (Planung, Terminierung, Ressourcen) liefert dem
Finanzmodul vor allem **Zeitpunkte und Statusinformationen** : - Wenn ein Projektabschnitt abgeschlossen
ist (z. B. Montage fertig), könnte dies mit dem Fälligwerden einer Rechnung korrelieren (z. B.

Schlussrechnung jetzt stellen). Im System ist das so gedacht: Der Projektleiter/Innendienst markiert
Meilenstein „Montage abgeschlossen“ im Projektmodul; das Finanzmodul bzw. die Rechnungslogik erkennt:
_Schlussrechnung kann erstellt werden_ . Ggf. wird automatisch die letzte Rate fällig gesetzt oder eine Aufgabe
erzeugt. - Umgekehrt: Der Finanzstatus beeinflusst das Projekt: _“Wenn Abschlag 1 nicht bezahlt, keine_
_Produktion starten”_ – so wurde es als mögliche Regel im Konzept genannt. Dies würde bedeuten: Das
Projektmodul (z. B. die Produktionsplanung) fragt beim Finanzmodul ab: ist Rate1 bezahlt? Wenn nein, wird
eine Warnung angezeigt oder ein Prozess blockiert. Eine solche Regel ist heikel (Kundenbeziehung vs.
Zahlung), aber es ist vermerkt. Realisierungsidee: Im Projektplan ein Milestone „Zahlungseingang erhalten“
– der kann gating für „Produktion beginnen“ sein (so dass ohne den Haken der Planer gewarnt wird).
**Verantwortlichkeit:** Hier muss definiert sein, dass die Buchhaltung die Zahlung sofort einpflegt, sonst
verhindert das System evtl. zu Unrecht den Fortschritt. - Das Projektmanagement liefert dem Finanzmodul
außerdem **Kosteninformationen** , sofern vorhanden: Der Innendienst ordnet Bestellungen (Einkauf) dem
Projekt zu, Planer erfassen evtl. Fremdleistungen – diese fließen ein, um Ist-Kosten im Finanzmodul
abzubilden. Alternativ belässt man diese Daten in der FiBu und summiert nur manuell. Wenn
implementiert: Der Innendienst ist verantwortlich, alle relevanten _Eingangsrechnungen und Stunden_ ins
System einzutragen (z. B. er lädt PDFs hoch und gibt Betrag+Lieferant an). Das Finanzmodul kann aus
diesen Daten dann Projektkostenauswertungen generieren (Marge). - **Status „Projekt finanziell**
**abgeschlossen“:** Wenn alle Rechnungen bezahlt sind und evtl. alle Kosten erfasst, markiert das
Finanzmodul das Projekt als „finanziell abgeschlossen“. Dies kann als Kriterium dienen, das Projekt selbst zu
archivieren (z. B. nach Feedback vom Kunden). Diese Info geht ans Projektmanagement: Der Projektleiter
sieht „finanziell abgeschlossen = ja“, weiß also, dass ausstehende Zahlungen kein Thema mehr sind.

**Verantwortlichkeiten:** - Der **Innendienst/Projektkoordinator** verantwortet die Brücke zwischen Projekt-
und Finanzwelt. Er legt Zahlungsmeilensteine fest, informiert bei Änderungen und prüft, ob alle
Rechnungen raus sind, bevor ein Projekt final geschlossen wird. - Die **Buchhaltung** ist verantwortlich,
Zahlungseingänge zeitnah zu verbuchen, damit das Projektteam aktuelle Infos hat. (Sollte z. B. Montage
anstehen, Buchhaltung muss sofort eintragen, wenn bezahlt, um keinen falschen Alarm zu lassen – das war
ja ein Stolperstein identifiziert). - Die **Planungs-/Ausführungsabteilung** ist verantwortlich, ihre
Leistungsfertigstellungen im System zu kennzeichnen, damit die Buchhaltung weiß, wann Schlussrechnung
gestellt werden kann. So entsteht ein gegenseitiges Abhängigkeitsverhältnis: Planer braucht Info
„Rechnung gestellt/bezahlt“, Buchhalter braucht Info „Leistung erbracht“. Das System stellt beide bereit; es
braucht aber _disziplinierte Nutzung_ aller.

**Schnittstellenmechanik:** - Im UI: Das Projektmodul kann Felder anzeigen, die aus dem Finanzmodul
stammen, z. B. eine Tabelle „Rechnungen“ im Projekt-Dashboard mit Status. Das ist intern realisiert als
Query auf Finanzdaten, aber aus Nutzersicht ist es eine integrierte Oberfläche. - Im Hintergrund: Event/
Listener, z. B. on Project Milestone complete -> trigger invoice task. Oder on Payment entered -> update
project status. - Bei Abweichungen: Falls z. B. Projektumfang sich ändert (Nachtrag +5%), muss der
Innendienst auch im Finanzmodul den Rechnungsplan anpassen (z. B. neue Abschlagsrechnung) oder
zumindest dem GF melden „Margin sinkt“. Hier ist wichtig, dass _Änderungen doppelt gepflegt werden_ , oder im
System zusammenhängen. Evtl. kann man solche Änderungen via Workflow lösen: Nachtrag erfasst -> neue
Opportunity oder Änderung am Projektwert -> System fragt „Rechnungsplan anpassen?“. - **Eskalation:**
Wenn Planer bemerken, dass etwas teuer wird, und keine Rechnung geplant: Sie müssen Innendienst/
Buchhaltung involvieren (z. B. Nachtragsangebot). Umgekehrt, wenn Buchhaltung offene Zahlungen sieht,
und Projekt läuft, muss sie Planer warnen vor weiterem Einsatz. Wir definieren: In wöchentlichen
Projektmeetings bringt Innendienst diese Punkte ein („Projekt X – Rechnung 2 noch nicht bezahlt, bitte

---

_Page 31_

---

vorsichtig mit weiteren Kosten“). Das System unterstützt dies durch Ampeln/Warnungen, aber letztlich ist es
Teamarbeit.

### Schnittstelle Zeiterfassung ↔ Finanzen

**(Übergangsphase)** Aktuell läuft Zeiterfassung in TimeCard separat. Solange es so bleibt: - **Datenübergabe:**
Am Monatsende exportiert die Buchhaltung oder Teamassistenz die Stunden nach Projekt aus TimeCard
(CSV). Diese werden ins CRM/PM-System importiert, um dort z. B. dem Projekt Ist-Aufwand (Stunden) zu
aktualisieren. Buchhaltung nutzt das intern für Nachkalkulation (Excel) und Lohn. - Alternativ, falls Import
nicht initial umgesetzt: Buchhaltung pflegt händisch im Projekt ein Feld „Ist-Stunden gesamt“ nach, damit
GF zumindest Abweichungen sieht. - **Verantwortlichkeiten:** Die **Buchhaltung** hat den Hut auf, dass
Stunden erfasst und übertragen werden. **Mitarbeiter** sind in TimeCard diszipliniert. Das CRM zeigt die
Ergebnisse. - **Eskalation:** Wenn Stunden fehlen/unplausibel (z. B. Projekt A hat 0 Stunden gebucht, obwohl
fertig), fällt das der Buchhaltung oder GF im System auf – dann muss nachgeforscht werden (evtl.
Innendienst klärt mit Planern). Hier greift noch kein Automatismus, eher menschliche Kontrolle via Berichte
(KPI: Stundenaufwand pro Projekt vs. Plan).

**(Zielphase)** Integrierte Zeiterfassung: - **Datenübergabe:** Mitarbeiter buchen direkt im System auf
Aufgaben oder Projekte. Diese Daten fließen ins Finanzmodul als interne Kosten (z. B. 100 Stunden *
interner Stundensatz 50€ = 5.000€ Personalkosten). Das Buchhaltung/Controlling-Modul kann diese mit
einbeziehen in Margen. - **Verantwortlichkeit:** Jeder *Mitarbeiter* ist verantwortlich, seine Zeiten täglich oder
wöchentlich einzutragen (Kulturwandel, aber GF will das so für Transparenz). Das System wird Erinnerungen
schicken („Bitte Stunden dieser Woche eintragen“). Die **Teamleiter** oder Buchhaltung überwachen die
Vollständigkeit (z. B. wöchentlicher Report „fehlende Stundenbuchungen“). - **Eskalation:** Bei unvollständiger
Zeiterfassung droht Datenmüll (GF warnt: *„Garbage in – Garbage out“\* ). Daher haben wir Mechanismen: GF
sponsert es, es wird kommuniziert, ggf. „Ohne Stunde kein Gehalt“ (harsch, aber als Druckmittel). Wenn
trotzdem Lücken, muss der Innendienst nachfassen. Das System kann hier auch steuern: man könnte z. B.
Gehaltsabrechnung modul koppeln, aber das ist nicht vorgesehen.

### Schnittstelle Lieferanten/Einkauf ↔ Finanzen

**Interne Schnittstelle:** Diese betrifft, ob und wie wir Lieferantenrechnungen (Einkaufskosten) im System
abbilden: - Falls implementiert: Der **Innendienst** erfasst bei Projekt Bestellungen (z. B. Möbel bei
Schreinerei, 50k€) und wenn Rechnung kommt, ordnet er sie dem Projekt zu. Das System speichert diese als
_Lieferantenrechnung_ (Dokument + Betrag) mit Status bezahlt/unbezahlt. Dann fließt das in die Projektkosten.
Die Buchhaltung bucht die Rechnung natürlich in Lexware und markiert im CRM als bezahlt. - Alternative
(wahrscheinlicher im MVP): Lieferantenrechnung werden _nicht_ alle im CRM erfasst, sondern verbleiben in
Lexware. Der Innendienst könnte zumindest einen _Platzhalter-Kosteneintrag_ im Projekt machen
(„Fremdkosten 50k in etwa“), aber offizielle Daten liegen in Lexware. - Wir streben zumindest an, Belege
digital ins Projekt abzulegen, wie Persona forderte („Belege direkt digital hochladen“). Dann hat man Kopien
da, auch wenn Summen evtl. manuell addiert werden. - **Verantwortlichkeiten:** Der **Einkauf/Innendienst**
ist verantwortlich, dem Projekt alle relevanten Kosten zuzuordnen (sofern wir das tun). Die **Buchhaltung**
prüft, ob das mit Lexware übereinstimmt. Evtl. Resistenz: doppelte Pflege – daher zu entscheiden, ob wir
das doppelt wollen. - In der Idealversion nach MVP könnte Lexware-Eingangsrechnungen via API dem CRM
gemeldet werden, aber das ist sehr advanced und wohl nicht in Phase 1.

**Externe Schnittstelle Lieferanten:** - Indirekt: falls wir mal Lieferanten ins System einbinden (Portal etc.),
wäre Finanzen beteiligt, z. B. Lieferanten können ihre Rechnungen hochladen, die dann im System landen.
Aber das ist Zukunftsmusik und wurde nicht gefordert (außer als Idee im Konzept„Lieferantenperformance
auswerten über Reklamationen“ – tangiert Finanzen nur am Rande).

**Eskalation:** Wenn ein Lieferant nicht bezahlt wird (z. B. weil Kunde nicht zahlt -> Liquiditätsengpass), merkt
das der Einkauf, aber Finanzen entscheidet sowas. Das ist ein Fall, wo GF involviert wäre. Systemseitig: es
könnte Payment Plans auch richtung Lieferanten (Zahlungsausgänge) geben, aber wir tun das nicht. Eher
traditionell: Buchhaltung steuert Auszahlungen. Braucht also keine System-Eskalation hier, höchstens
Annotation im Projekt „Lieferant X offen, aber Kunde hat noch nicht gezahlt -> Risiko“.

### Schnittstelle Finanzbuchhaltung (Lexware) ↔ CRM/PM-System

**Technische Kopplung:** - Über **REST API** von Lexware (sofern verfügbar und zugänglich). Die Idee: Unser
System agiert als „Frontend“ für Rechnungen, Lexware als „Backend“ zur Verbuchung. -
**Rechnungsübergabe:** Sobald eine Rechnung im CRM finalisiert wird, sendet das System via API die
Rechnungsdaten an Lexware. Lexware erzeugt einen Beleg im FiBu-Modul (entweder Faktura oder
Buchung). Falls Lexware die Nummernvergabe machen soll, könnte unser System erst nach Antwort die
Nummer festsetzen (oder wir synchronisieren Nummernkreise im Voraus). - **Zahlungsabgleich:** Wir haben
zwei Optionen: 1) Buchhaltung verbucht Zahlung in Lexware (aus Kontoauszug) und unser System fragt
Lexware z. B. täglich nach neuen Zahlungen und matched sie zu Offenen Posten (automatisch) – hoher
Implementierungsaufwand. 2) Buchhaltung trägt Zahlungseingang direkt im CRM ein (was wir eh
vorhatten) und verbucht in Lexware analog – doppelt, aber Buchhaltung kriegt das hin und hat Kontrolle.
Evtl. minimal Variation: Buchhaltung verbucht in Lexware, dann klickt im CRM auf „sync payments“ –
woraufhin via API offene Posten geholt werden. Das _Risiko von Doppeländerungen_ (CRM vs Lexware) ist hier
relevant
, aber mitigierbar, wenn wir sagen: Rechnungen werden nur im CRM erstellt, Zahlungen
werden nur in Lexware erfasst, und die Synchronisation passiert in eine Richtung. - **Stammdatenabgleich:**
Kundenstammdaten könnten wir synchronisieren, damit Lexware Debitorenstamm gleich dem CRM-
Kundenstamm ist. Anfangs einmaliger Import (Excel aus Lexware) ins CRM oder vice versa. Danach, wer
pflegt neue Kunden? Vorschlag: im CRM angelegte Kunden (z. B. Lead -> Kunde) werden auch an Lexware
geschickt, damit Buchhaltung nicht doppelt anlegen muss. _Zuständigkeit:_ Innendienst oder Vertrieb pflegt
Kunden im CRM; Buchhaltung pflegt in Lexware nur noch Finanz-spezifisches (z. B. Debitorenkonto). -
**Dokumente:** Lexware kann wahrscheinlich Rechnungen drucken; wir wollen es aber im CRM. Daher sollten
wir PDFs im CRM generieren und in Lexware nur Buchung ohne PDF haben, oder PDF als Anhang an
Lexware-Beleg (wenn API das unterstützt). - **Kontenplan/Kostenstellen:** Falls Lexware komplexen
Kontenplan hat, müssen wir überlegen, ob CRM was davon wissen muss (wahrscheinlich nicht, wir senden
alles an ein Erlöskonto).

# Verantwortlichkeiten & Prozesse: - Die Buchhalterin ist verantwortlich, dass die Schnittstelle funktioniert:

# 32

Zahlungseingang ist, und CRM für Ausgangsrechnungen. Doppeländerungen sollen vermieden werden –
ergo: Buchhaltung soll z. B. einen Kunden nicht in Lexware umbenennen, ohne auch im CRM zu ändern,
sonst weicht es ab. Solche Dinge werden durch _organisatorische Regeln_ adressiert („Kundendaten nur im
CRM pflegen, Lexware erhält Sync“). - **Datenmigration:** Wir müssen initial eventuell bestehende offene
Projekte und Forderungen ins neue System übernehmen (Excel-Import). Offene Frage, wie viel. Aber in
Schnittstellensicht: Anfangsbestand an Kunden/Projekten wird aus Altsystemen (Ordner/Excel) erfasst. Das
ist im Offene-Punkte-Abschnitt notiert. - **DSGVO/Historie:** Lexware ist eigenständiger Datenhalter. Falls z. B.
im CRM Daten gelöscht werden, müssen wir abstimmen, dass Lexware-Daten ggf. auch gelöscht werden.
Allerdings sind Lexware-Daten oft ohnehin archiviert (Buchhaltung darf man nicht löschen vor Frist). Hier
muss man im Datenschutzkonzept angeben: Personendaten in Lexware sind „gesetzlich
aufbewahrungspflichtig, daher von Löschanfragen ausgenommen“ – so kommuniziert man das.

**Schnittstelle zu Bank (Zahlungsabgleich):** - Wäre theoretisch: Banksoftware -> Lexware (Zahlung import).
Lexware kann Kontoauszug einlesen und offene Posten matchen. Falls Buchhaltung das nutzt, dann
Payment-Status in Lexware wird aktualisiert -> wir müssten via Lexware-API ins CRM übernehmen. Das ist
sehr indirekt. - Alternativ, einige CRM/ERP bieten direkt Bankabgleich – wir tun es nicht (Non-Goal, da
Lexware diese Domäne behält).

Zusammengefasst ist Lexware-Schnittstelle die wichtigste externe: Wir minimieren Risiko dadurch, dass wir
uns an Lexware orientieren und nur ergänzen. So bleibt z. B. auch Lexware weiter für GoBD-
Datenarchivierung relevant; unser System unterstützt es.

### Zuständigkeiten & Eskalation allgemein

Um reibungslose Schnittstellen zu garantieren, definieren wir noch einmal klar: - **Wer pflegt welche Daten**
**wo?** - Kundenstamm: Vertriebsinnendienst im CRM, Sync zu Lexware. - Angebote/Aufträge: Vertrieb/
Innendienst im CRM. - Rechnungen: Buchhaltung im CRM (Erstellung/Versand), Sync zu Lexware (Buchung).

- Zahlungen: Buchhaltung in Lexware (Buchung), evtl. parallel im CRM (Markierung). - Zeiten: Mitarbeiter im
  CRM (Ziel), bis dahin in TimeCard -> Import. - Kosten: Buchhaltung/Innendienst im CRM (wenn gewünscht),
  bis dahin in Lexware. - **Bei Abweichungen** : Buchhaltung hat Monitoring-Funktion. Sie vergleicht z. B.
  monatlich Berichte aus CRM und Lexware (sollten gleich sein). Wenn Abweichung, identifiziert sie die
  Ursache (z. B. Rechnung nicht im CRM markiert). Eskalation an IT/Projektteam falls Schnittstelle bug. -
  **Fehlerkultur** : Es wird Schulungen geben, wie bei Fehlern vorzugehen: Bsp. _„Wenn du siehst, dass ein Projekt_
  _im CRM nicht auf dem aktuellen Stand ist, melde es sofort dem Projektkoordinator.“_ - **Support-Hierarchie** : Erster
  Ansprechpartner für Nutzerfragen ist der Innendienst (Key User), der intern hilft. Technische
  Schnittstellenprobleme gehen an IT oder ggf. Lexware-Experten (laut Konzept angedacht, bei Schnittstelle
  evtl. Lexware-Experte hinzuziehen)
  . - **Änderungswünsche** : Wenn im laufenden Betrieb Bedarf
  entsteht, an einer Schnittstelle was zu ändern (z. B. „Lexware soll doch Nummern vergeben“), gibt es
  Change Requests an Projektleitung.

# Durch diese Klarheit soll vermieden werden, dass z. B. beide Seiten Daten pflegen und Chaos entsteht. Jeder

# 7. Qualitätssicherung & Risiken

Neben den funktionalen Anforderungen wurden zahlreiche **Qualitätsanforderungen** definiert, um einen
erfolgreichen Betrieb des Finanz- & Compliance-Moduls sicherzustellen. Dieser Abschnitt beschreibt die
wichtigsten Qualitätsmerkmale – insbesondere im Hinblick auf **Compliance (GoBD/DSGVO)** , **Sicherheit**
und **Performance/Usability** – sowie identifizierte **Risiken** und Maßnahmen zu deren Minderung. Zudem
werden zentrale **Annahmen** festgehalten, auf denen das Lösungskonzept basiert (und die im Projektverlauf
zu überwachen sind).

### Qualitätsmerkmale und -ziele

**GoBD-Konformität:** Als Finanzmodul einer kaufmännischen Lösung muss strikte GoBD-Compliance
gewährleistet sein. Zentrale Qualitätskriterien:
_Nachvollziehbarkeit:_ Alle Geschäftsvorfälle sind lückenlos dokumentiert. Wie umgesetzt:
Änderungslog für alle relevanten Änderungen; Chronologische Ablage aller Rechnungen und Belege
mit Zeitstempel. Qualitätssicherung: Regelmäßige interne Audits durch Buchhaltung, bei denen
stichprobenartig geprüft wird, ob z. B. jede Rechnungsänderung im Log steht.
_Unveränderbarkeit:_ Einmal erzeugte finanzrelevante Daten können nicht unbemerkt geändert
werden. Umsetzung: Schreibschutz von Rechnungen nach Finalisierung, Archivmodus für Projekte
(wie beschrieben). Qualitätstest: Versuche, eine archivierte Rechnung zu ändern, müssen scheitern
bzw. protokolliert werden.
_Aufbewahrung:_ 10-jährige Archivierung ohne Datenverlust. Hier kommt auch IT-Qualität ins Spiel:
regelmäßige Backups (Qualitätsmerkmal Datensicherheit – siehe weiter unten), und Funktion zum
Archivieren. Wir definieren, dass das System eine Archivierungsfunktion hat, die alle nötigen Daten
in prüfungssicherer Form ausgeben kann.
_Exportierbarkeit für Prüfer:_ Ein Prüfer muss Daten in gängigem Format erhalten können. Deshalb
Qualitätsanforderung: CSV/PDF-Exporte funktionieren zuverlässig, enthalten konsistente Daten und
Meta-Infos (z. B. auch, welche Dokumente dazugehören). Wir können vor Livegang eine Simulation
einer Betriebsprüfung durchführen (Quality Gate).
Um sicherzugehen, könnte man sogar eine **GoBD-Zertifizierung** des Systems anstreben (einige
Softwareanbieter lassen das prüfen). Das ist meist aufwändig, aber unser Ziel ist es, so qualitativ zu
sein, dass wir diese Hürde grundsätzlich nehmen könnten.
**DSGVO-Konformität & Datensicherheit:**
_Datenminimierung:_ Das System speichert nur notwendige personenbezogene Daten. Im Design
wurde überflüssige Erfassung vermieden (z. B. keine Geburtsdaten der Kunden, wenn nicht nötig).
_Zweckbindung:_ Daten werden nur für definierte Zwecke genutzt (Vertragsabwicklung, Marketing nur
mit Consent). Das bedeutet qualitativ: klare Kenzeichnung der Daten (Flags „nur für Projekt“ vs. „für
Marketing erlaubt“).
_Rechte der Betroffenen:_ Implementiert (Auskunft, Löschung – siehe Anforderungen). Quali: Diese
Funktionen müssen nicht nur existieren, sondern praktikabel sein (Test: In einem Dummy-System
alle Daten einer Person exportieren – ist es vollständig?; Person löschen – sind wirklich alle
identifizierenden Merkmale weg?).
_Datenschutz intern:_ Need-to-know-Prinzip umgesetzt über Berechtigungen. Qualitätsziel: Keine
sensiblen Daten sollten unautorisiert sichtbar sein. Das testen wir, indem wir mit verschiedenen
Rollen einloggen und prüfen, ob z. B. ein Vertriebsuser Gehaltsinfos sehen kann (soll nicht).

- •

_Auftragsdatenverarbeitung & Hosting:_ Annahme: Es wird Cloud-Hosting geben (z. B. in EU-
Serverzentrum). Qualitätspunkt: Der Hosting-Anbieter muss Sicherheitsstandards erfüllen (ISO
27001 etc.) und DSGVO-konforme AV-Verträge vorliegen haben.
**IT-Sicherheit:**
_Zugriffsschutz:_ Verpflichtend ist verschlüsselte Datenübertragung (HTTPS) und sichere
Authentifizierung. Qualitativ heißt das: Das System erzwingt starke Passwörter, ideal 2-Faktor-Auth
(zumindest für externe Zugriffe). Wir definieren das als Muss: Kein Login ohne https,
Kennwortrichtlinie.
_Rechtemanagement:_ Wie erwähnt, Rollen und Berechtigungen müssen konfigurierbar und wirksam
sein. Quali-Test: Nutzer mit Rolle X darf/darf nicht Y machen; an möglichst vielen Stellen muss das
korrekt greifen.
_Datenspeicherung:_ Sensible Felder (bspw. Kunden-Bankdaten falls überhaupt erfasst) sollten
verschlüsselt gespeichert sein. Wir haben keine IBAN oder so im Projekt, aber sollten wir mal
Kontodaten speichern, dann verschlüsselt in DB.
_Systemsicherheit:_ Wir nehmen an, die Software wird modern entwickelt, wir werden sie vor
Auslieferung einem **Penetrationstest** unterziehen (wäre Best Practice, gerade wenn Cloud). Das
reduziert Risiko von Data Breach.
_Geräte/Offline-Sicherheit:_ Wenn Offline-Daten auf Laptops/Phones liegen, gibt es ein

- •

**Sicherheitsrisiko bei Geräteverlust** 【 5†L108- L116 】 . Mit MDM o.Ä. kann man dem begegnen. Wir
definieren qualitativ: Die Mobile-App speichert Offline-Daten verschlüsselt und erfordert App-PIN,
um Fremdzugriff zu erschweren.
_Backups & Verfügbarkeit:_ Das System muss ausfallsicher sein, insbesondere um keine Daten zu
verlieren (Backup täglich etc.). Performance-SLAs: wir streben ~99% Uptime an, offline-Fähigkeit
fängt manches auf.
**Performance & Skalierbarkeit:**
_Performance:_ GF fordert „Echtzeit-Gefühl“. Konkret: Seiten/Liste laden <2 Sekunden, Dashboard-
Refresh in Sekunden. Das ist qualitativ zu messen, aber wir definieren im NF-Req: Standardabfragen
<2s (bei derzeit <1000 Kunden, <100 Projekte pro Jahr).
_Stresstest:_ Zwar kleine User-Zahl (<50?), aber wir wollen Spielraum. Also muss das System auch mit
10x Daten noch flüssig laufen (Skalierbarkeit). Architektonisch: Cloud-basiert, modular. Wir stellen
sicher, dass es keine hart codierten Limits gibt (z. B. dass nur 5 Planer angenommen werden).
_Mobile/Offline Performance:_ Offline-Fähigkeit war ein Muss – qualitativ messen wir, ob
Datensynchronisation schnell und zuverlässig klappt, wenn Verbindung wieder da ist.
**Usability & Benutzerfreundlichkeit:**
Der Erfolg steht und fällt mit Akzeptanz, also ist _Usability ein kritisches Qualitätsmerkmal_ .
_Intuitive UI:_ Module klar gegliedert (Kunden, Projekte, Finanzen etc.) – im Konzept als Muss
festgehalten. Wir orientieren uns an modernen CRM-UI-Standards.
_Wenige Klicks:_ Wir werden User Stories testen: z. B. „Als Buchhalter in 3 Klicks zur Offene-Posten-
Liste“ oder „Als Vertriebsleiter in 2 Klicks vom Dashboard zur Kundenhistorie“.
_Konsistentes Design:_ Einheitliche Buttons, Terminologie (z. B. „Abschlagsrechnung“ überall gleich
bezeichnet). Wir vermeiden Fachchinesisch für Endnutzer – das Wording wird mit Key-Usern
abgestimmt.
_Schulung & Hilfen:_ Obwohl kein direktes Systemfeature, hat doch Auswirkung: Wir planen Schulungen
und evtl. In-App-Hilfen (Tooltips, Doku).
_Barrierefreiheit:_ Als Should (nicht höchste Priorität, interne Anwendung), aber wir achten auf
Lesbarkeit, Kontraste etc.

- •

- •

Alle diese Qualitätsziele werden in einem **Test- und Abnahmeplan** berücksichtigt. Z.B.: - Compliance-
Checkliste (Anforderungen an Logs, Archiv etc. getestet). - Security-Review (evtl. externer Pentest
beauftragt). - Performance-Benchmark mit realistischen Datenvolumina. - Usability-Test mit echten
Anwendern (Key-User führen Kernaufgaben durch, Feedback sammeln).

### Risiken und Maßnahmen

Mehrere Risiken wurden in Konzept und Persona-Analysen identifiziert. Hier eine strukturierte Liste der
wichtigsten **Risiken** und jeweils unsere **Maßnahmen zu deren Minimierung** :

**Akzeptanzrisiko (Nutzeradoption):** _CRMs werden oft schlecht angenommen, wenn sie als_
_bürokratische Last empfunden werden_
. Bei uns: Außendienst könnte das Tool ignorieren,
Innendienst evtl. weiter mit Excel arbeiten, etc. **Maßnahmen:**
Frühe Einbindung der Key-User in Entwicklung und Tests (die Personas wurden ja mit realen
Mitarbeitern erstellt – diese Menschen sollten Pilotnutzer sein, um Ownership aufzubauen).
Intensive Schulungen und begleitendes Change-Management (z. B. regelmäßige User-Feedback-
Runden in den ersten Monaten).
Quick Wins präsentieren: dem Team konkrete Vorteile schnell zeigen (z. B. im Vertrieb: „schaut, so
könnt ihr eure Kundenbesuche besser planen und Provisionsstatistik live sehen“). Das erhöht
Motivation.
Usability hoch priorisieren (wie oben beschrieben) – wenn das Tool wirklich leichter ist als bisherige
Workarounds, kommt Akzeptanz fast von selbst.
Management-Sponsoring: Der GF steht voll dahinter und verlangt Nutzung ein – er wird z. B. in
Meetings Daten aus dem System erfragen anstatt Excel-Zahlen, so entsteht leichter Druck, es auch
zu verwenden.

1.

# 2.

3.

4.

5.

6.

Erfolge kommunizieren: wenn erste Projekte erfolgreich drin abgewickelt wurden, wird das im
Unternehmen geteilt („Projekt A erstmals komplett im neuen System fakturiert – 0 Fehler, 2 Std.
schneller als früher“).

7.

**Datenqualitätsrisiko (Garbage in, Garbage out):** Wenn Mitarbeiter Daten falsch/unvollständig
eingeben, erzeugt das System falsche Ergebnisse. Z.B. ein Vertriebsmitarbeiter pflegt
Auftragswahrscheinlichkeit nicht -> Forecast ungenau; Buchhaltung vergisst Zahlung einzutragen ->
GF-Report falsch. **Maßnahmen:**

8.

**Klare Verantwortlichkeiten** festlegen, wer welche Daten bis wann pflegt (haben wir in
Schnittstellen definiert). Das muss kommuniziert und überwacht werden (z. B. Buchhaltung prüft
Pipeline-Daten monatlich mit Vertrieb).
**Plausibilitätschecks im System:** Eingaberegeln, Pflichtfelder, z. B. kann eine Opportunity nicht auf
„gewonnen“ gesetzt werden ohne Auftragswert; eine Rechnung kann nicht ohne Fälligkeitsdatum
abgespeichert werden etc. Diese Checks verhindern Lücken.
**Regelmäßige Reviews der Datenqualität:** Anfangs vllt. wöchentlich ein Data Steward (evtl.
Innendienstleitung) Berichte laufen lässt: Dubletten, fehlende Felder, etc., und Nachsteuerung
veranlasst.
“ **Single Source of Truth** ”-Mentalität fördern: Alle sollen begreifen, dass das System die Wahrheit
liefert – das motiviert, es auch sauber zu halten (Kulturwandel).

9.

10.

11.

12.

Notfalls, falls die Daten stark divergieren, **Esklation an GF** : Der GF ist bereit, einzugreifen, wenn
Abteilungen schludern. Er hat im Persona-Profil gesagt, er tritt als Sponsor auf, der Nutzung
einfordert.

13.

**Feature Creep / Scope Risk:** Gefahr, dass im Projektverlauf immer mehr Funktionen gefordert
werden („Können wir nicht auch Lager…?“). **Maßnahmen:**

14.

Klare Abgrenzung von Anfang an (siehe Nicht-Ziele in Abschnitt 3). Diese Liste kommunizieren wir
mit allen Stakeholdern schriftlich.
Change Requests werden zentral gesammelt und erst nach MVP evaluiert, außer es sind kritische
Lücken.
Projektmethodik: agile Iterationen, aber Scope per Iteration begrenzen. So sieht man schnell
Nutzen, statt ewig alles reinpacken zu wollen.
Wenn doch extrawünsche aufkommen, Kunden (hier eigene Chefs) darauf verweisen: Priorität hat
Systemeinführung, danach können Module erweitert.

15.

16.

17.

18.

Unser Marktvergleich untermauert die Notwendigkeit, sich zu fokussieren (wir sahen, umfassende
Tools sind komplex und teuer) – dieses Argument nutzen wir bei Management, falls Begehrlichkeiten
kommen.

19.

**Technisches Integrationsrisiko (Lexware-Schnittstelle):** Die Kopplung ans FiBu-System könnte
Probleme machen: Dateninkonsistenzen, Sync-Konflikte, zusätzlicher Implementierungsaufwand
. **Maßnahmen:**

20.

# Schnittstelle sorgfältig planen und früh testen mit Lexware-Dummies. Evtl. Lexware-Experten

21.

# 22.

23.

24.

Falls Offlinedaten (z. B. Mobil während kein Netz) -> bei Wiederverbindung Sync-Konflikte (selten, da
wohl niemand ändert dieselben Daten offline/online), aber die App wird vorsorgen (z. B. keine
parallelen Edits an Rechnungen offline erlaubt).

25.

**Performance-/Offline-Risiko:** Evtl. könnte die Offline-Funktion initial eingeschränkt sein (z. B. nur
Lesezugriff mobil, kein volles Editieren) – das könnte Anwender enttäuschen. Und Performance evtl.
bei vielen Daten langsam, was Frust erzeugt. **Maßnahmen:**

26.

Erwartungsmanagement: Den Nutzern klar sagen, was offline möglich ist v1 (z. B. „Kontakte und
Notizen offline, Gantt vielleicht nicht sofort“).
Schwerpunkte setzen: Wichtige Module offline (Kontakte, Aktivitäten) zuerst, optional später mehr.
Performance-Optimierungen einplanen: Indizes in DB, Caching Mechanismen für Dashboard, etc.
Wir definieren bei Entwicklung Performanceziele als Teil der DoD.
Notfalls modulweise offline: wie Konzept sagt, evtl. Gantt nicht offline erst mal.

27.

28. 29.
29.

Mobile Device Management: Falls Offline-Daten auf Geräten sind, wie erwähnt, Verschlüsselung.
Zudem: remote-wipe-Fähigkeit, falls Gerät verloren -> Minimierung Sicherheitsrisiko.

31.

**Risikofaktor Mensch (Disziplin):** Generell ist viel neu, Menschen könnten in alte Muster verfallen.
Bsp: Vertriebsleiter nutzt doch wieder Excel, weil er’s gewohnt ist – dann haben wir Silos weiter.
**Maßnahmen:**

32.

_Change-Management-Plan:_ im Konzept empfohlen, früh entwickeln. Enthält: Schulungen, Support,
vielleicht Gamification (kleine Belohnungen für konsequente Nutzung).
_Champions ernennen:_ pro Abteilung jmd., der vom Tool überzeugt ist und Kollegen mitzieht.
_Anwenderfreundlichkeit sicherstellen:_ (wiederum Usability) – je geringer die Hürde, desto eher bleiben
sie dabei.
_Iterative Einführung:_ Evtl. Step-by-Step: erst CRM-Teile, dann Projekt, dann Finance – so dass man
nicht alle vor den Kopf stößt. Für Finanzen evtl. Pilot mit ein paar Projekten, bevor alles umgestellt
wird.

33.

34. 35.
35.

_Top-down Druck:_ GF hat klargemacht, wie wichtig es ist. Er wird das im Leadership-Team immer
wieder betonen („Keine Entscheidung ohne Systemdaten“).

37.

**Projektzeit- und Budgetrisiko:** CRM-Einführungen dauern oft länger oder werden teurer als
geplant. Für uns intern: Wenn die Umsetzung ausufert, könnte Management Enthusiasmus
verlieren. **Maßnahmen:**

38.

Klare Anforderungen (wie dieses Dokument) und Meilensteine, GF will das ja methodisch angehen.
Agiles Vorgehen: in MVP schrittweise fertigstellbare Inkremente liefern, sodass Nutzen früh sichtbar
(um weiterhin Rückhalt zu haben).
Controlling im Projekt: Projektleiter überwacht Scope (verhindert unkontrolliertes Wachsen, siehe
Feature Creep).

39. 40.
40.

Puffer einplanen, falls z. B. Lexware-API länger braucht.

42.

**Strategische Änderung:** Falls sich Unternehmensstrategie ändert (neue Märkte, anderes
Geschäftsmodell), könnte das System unpassend werden. Das ist schwer planbar, aber:

43.

Wir achten auf _Flexibilität/Erweiterbarkeit_ : modulare Architektur, konfigurierbare Felder (z. B. anstatt
starr nur diese Projekttypen, offen halten), um Anpassungen zu erleichtern.
Wenn z. B. mehr internationale Geschäfte kommen, könnte Mehrsprachigkeit relevant werden – wir
haben es als im Hinterkopf notiert (NF nice).
Grundsätzlich bleibt Risiko, aber wir mindern es, indem wir _nicht hardcodieren_ , sondern z. B.
Parameter einführen.

44.

45.

46.

Zusätzlich noch erwähnenswert: - **Datenmigration (Initialrisiko):** Import von Altdaten kann zu Dubletten
oder falschen Zuordnungen führen, was Startakzeptanz schmälern könnte (“Das System hat Mist
importiert”). Maßnahme: Vor Import Datenbereinigung (Excel listen review), vielleicht MIG-Testlauf, und
Data Steward definieren für Migration. - **Externe Abhängigkeit (Lexware):** Wenn Lexware sich ändert (API
weg, neue Version), haben wir Abh. Aber da Lexware etabliert ist, eher geringes Risiko. Wir minimieren,
indem wir die Integration auf Standardmethoden bauen.

Im Risikoregister des Projekts wurden diese Punkte eingetragen, mit verantwortlichen Personen (z. B. PM,
IT-Leiter, Key-User) und Maßnahmen.

### Wichtige Annahmen

Im Projektkontext wurden einige **Annahmen** getroffen, die für Planung wichtig sind. Diese sollten
regelmäßig validiert werden, da Abweichungen neue Risiken erzeugen könnten:

**Cloud-Lösung & Mobilgeräte:** Wir nehmen an, dass die Implementierung als Cloud-Lösung erfolgt
(heißt: alle Mitarbeiter akzeptieren auch Cloud, IT Security dafür vorhanden). Sollte stattdessen On-
Premise gefordert werden, hätte das Auswirkungen (Umplanung Hosting, Offline etc.). Bisher alle
fein mit Cloud.
**Bestehende Systeme:** Es wurde angenommen, dass Lexware als FiBu bleibt und TimeCard vorerst
bleibt (Übergangsweise). Wenn z. B. herauskäme, dass die Firma stattdessen DATEV nutzt oder so,
müsste die Schnittstelle anders aussehen. Bisher Infos aus Interview: Lexware stimmt.
**Personalkapazität zur Pflege:** Wir gehen davon aus, dass kein dedizierter neuer Mitarbeiter für
Systempflege eingestellt wird, sondern bestehende Leute das stemmen (Buchhaltung, Innendienst
als Key-User). Annahme: Das ist möglich ohne Überlastung, weil System Effizienz bringt. Sollte es
anfangs haken (vielleicht mehr Aufwand durch doppelte Führung alt+neu), hat GF zugesichert,
nötigen Freiraum zu schaffen (z. B. temporär Hilfskraft).
**Unternehmenskultur:** Annahme: Die Firma hat gewisse Offenheit für Transparenz. (Es gab
Statement: „kleine Firma, flache Hierarchie, wahrscheinlich offene Kultur, aber abzustimmen wer was
sehen darf“.) Falls aus irgendeinem Grund die GF nun sehr einschränken will (z. B. niemand darf
irgendwas sehen außer GF), würde das Konzept etwas wackeln, weil es auf teamweite Transparenz
baut. Bisher passt es aber zum geäußerten Führungsstil, viel offen zu lassen, mit Option sensitives
(Gehalt) zu sperren.
**Volumen und Wachstum:** Wir nahmen an <1000 Kunden, <100 Projekte/Jahr für Skalierung. Wenn
die Firma plötzlich massiv wächst (z. B. neue Geschäftsfelder, 100 Projekte parallel), muss das System
damit umgehen. Durch modulare Cloud-Architektur haben wir Vorsorge getroffen; wir tracken aber
Firma-Entwicklung. Wenn vor Go-Live schon klar würde, es werden viel mehr Daten, können wir
Infrastruktur hochskalieren.
**Rechtliche Änderungen:** DSGVO/GoBD können sich ändern. Annahme: bis Launch keine großen
Neuerungen. Trotzdem beobachten wir regulatorische News. Konzept hat erwähnt, man braucht
Mechanismus solche Änderungen einzupflegen (Wartungskonzept).
**Stakeholder-Vorlieben:** Offene Frage war Standard vs. Neuentwicklung – wir sind auf
Neuentwicklungskurs. Annahme: Stakeholder ziehen das mit und ändern nicht plötzlich Meinung
„wir kaufen doch Salesforce“. Wir haben Marktrecherche argumentiert, hoffen es bleibt dabei. Falls
doch Umschwenk, würde dieses Konzept aber auch als Pflichtenheft für Toolauswahl dienen können.

Durch konsequentes **Risikomanagement** – regelmäßige Überprüfung dieser Annahmen, Monitoring von
Indikatoren und enge Kommunikation mit Nutzern – werden wir frühzeitig erkennen, falls ein Risiko eintritt,
und gegensteuern. Das Ziel ist, dass bei Produktivstart keine unangenehmen Überraschungen auftreten,
sondern das Finanzmodul _stabil, sicher und user-friendly_ läuft.

# 8. Offene Punkte und Klärungsbedarf

Trotz gründlicher Analyse bleiben einige Aspekte, die im Projektkontext noch nicht abschließend geklärt
wurden. Diese **offenen Punkte** werden hier explizit benannt – jeweils mit einer präzisen Rückfrage, die ans
Team/Management gestellt werden sollte, sowie einem begründeten Lösungsvorschlag auf Basis unserer
bisherigen Erkenntnisse. Die offenen Punkte sind als _Platzhalter_ im Konzept zu sehen, die möglichst früh im
weiteren Projektverlauf adressiert werden müssen, um Vollständigkeit und Konsistenz zu gewährleisten.

**Umfang des Finanzmoduls – Einkaufskosten & Margen:**
**Frage:** _Sollen im System auch interne Projektkosten (Einkaufsrechnungen, Personalkosten) und daraus_
_Margen abgebildet werden, oder beschränken wir uns auf Ausgangsrechnungen an Kunden?_ Im
Gesamtkonzept wird aktuell auf Ausgangsrechnungen fokussiert, mit dem Hinweis, dass Margen-
Controlling optional ergänzt werden könnte.

1. 2. **Lösungsvorschlag:** Für die erste Version sollten wir uns auf **Ausgangsrechnungen** und
      grundlegende Deckungsbeitrags-Betrachtungen beschränken. Das heißt: Im System werden
      standardmäßig keine detaillierten Lieferantenrechnungen erfasst, um das Modul schlank zu halten.
      Allerdings können wir ein einfaches Feld „Ist-Gesamtkosten (optional)“ pro Projekt vorsehen, das am
      Projektende von der Buchhaltung befüllt wird, um eine grobe Marge zu ermitteln. Falls das
      Management Wert auf detaillierteres Controlling legt, könnte man in Phase 2 eine Erweiterung
      implementieren, die Lieferanten/Einkaufsbelege als eigene Objekte einführt. Diese stufenweise
      Vorgehensweise hält den MVP überschaubar und erfüllt dennoch das **Ziel der GF nach Transparenz**
      („Plan-/Ist-Vergleiche pro Projekt auf Knopfdruck“
      ). Wichtig ist, dass wir ein gemeinsames
      Verständnis erzielen, um später keine Erwartungslücke zu haben. Daher sollte diese Frage früh im
      Steering Committee entschieden werden – mit Tendenz zum **MVP ohne vollständige**
      **Kostenintegration** , aber Option zum Ausbau.

2.

# Provisionsabrechnung im System:

4.

**Frage:** _Inwieweit soll die Vertriebsprovisions-Abrechnung im Tool unterstützt werden?_ Personas
erwähnen das (Markierung von Neukunden vs. Bestandskunden für Bonus), aber im
Anforderungskatalog des Konzepts taucht es nicht explizit auf.

5.

**Lösungsvorschlag:**
Das System sollte zumindest die
**relevanten Daten für die**
**Provisionsabrechnung erfassen** , sprich: jedes Projekt/Opportunity hat ein Feld „Akquise-
Art“ (Neukunde eigenständig akquiriert vs. Bestandskunde vs. zugearbeitet etc.) und eine
Zuordnung zum zuständigen Vertriebsmitarbeiter. Darüber hinaus könnten einfache Auswertungen
pro Vertriebsmitarbeiter (Umsatz, Anzahl gewonnenen Neukunden) bereitgestellt werden. Die
eigentliche Berechnung der Provisionshöhe (z. B. x% vom Umsatz, mit Staffeln) würde aber weiterhin
von der Buchhaltung extern erfolgen (z. B. in Excel oder Lexware Lohn). Hintergrund: Die
Provisionsmodelle können komplex sein und sind oft eng mit der Lohnabrechnung verknüpft – das
müsste detailliert spezifiziert werden, was bisher nicht erfolgt ist. Daher **empfehlen wir** , im MVP
darauf zu verzichten, automatisierte Provisionsberechnungen einzubauen. Stattdessen erzeugt das
System Transparenz (Vertriebs-Dashboard zeigt „Bonus-relevanter Umsatz: xy €“), und die
Buchhaltung nutzt diese Info für die manuelle Auszahlungsvorbereitung. Diese Abgrenzung sollte
mit dem Vertrieb besprochen werden, um sicherzustellen, dass keine falsche Erwartung (voller
Bonus-Abrechnung im CRM) besteht. Falls das Vertriebs-Team hier unbedingt mehr Automatisierung

6.

---

_Page 41_

---

will, könnte man z. B. in einem späteren Sprint einen simplen Provisionsreport implementieren. Aber
zunächst gilt: **Daten ja, Berechnung nein** – das minimiert Komplexität und Fehlerquellen.

**Detailtiefe des Rollen- & Rechtekonzepts:**

7.

**Frage:** _Wie granular soll das Berechtigungssystem gesteuert werden, und gibt es spezielle_
_Freigabeprozesse oder Einschränkungen, die implementiert werden müssen?_ Im Konzept wurde
angemerkt, dass diese Details offen sind (z. B. darf Innendienst Preise ändern ohne GF-Freigabe? Soll
Vertrieb nur „seine“ Projekte sehen? etc.).

8.

**Lösungsvorschlag:** Basierend auf der aktuellen Firmenkultur (viel Vertrauen, kleine Teams) schlage
ich ein **pragmatisches Rechtemodell** vor:

9.

Vertriebsmitarbeiter sehen grundsätzlich alle Kunden und Projekte, um
bereichsübergreifende Transparenz zu fördern – außer vielleicht Finanzdetails wie Margen.
Die Buchhaltung und GF können alles sehen und bearbeiten (Admin-ähnliche Rechte für
Finanzen).
Innendienst/Planer können Projektdetails und Dokumente bearbeiten, aber keine rein
finanzadministrativen Felder (z. B. Rechnungsbeträge) ändern.
Für bestimmte Aktionen, wo Kontrolle sinnvoll ist (z. B. Gewährung hoher Rabatte, Änderung
eines Auftragswertes nachdem schon Teilrechnung gestellt wurde), könnte das System
Warnungen ausgeben oder eine Bestätigung durch GF verlangen. Allerdings würde ich auf
_formale Freigabe-Workflows_ in Version 1 verzichten, solange GF Vertrauen hat und Mitarbeiter
geschult sind, weil jeder zusätzliche Genehmigungsschritt den Prozess verlangsamt.
Wenn das Management jedoch bestimmte Limits wünscht (z. B. Rabatt >10% nur mit GF-
Okay), sollte das konkret entschieden werden, damit wir das ggf. als Regel hinterlegen
können. Kurz: **Standard-Rollen** (Vertrieb, Innendienst, Buchhaltung, GF) mit den im Konzept
umrissenen Lese/Schreib-Rechten sollten genügen. Freigabeprozesse können wir „auf Zuruf“
organisieren (GF wird ja sowieso informiert über Dashboards). Diese Annahme müssen wir
mit GF und Abteilungsleitern einmal durchgehen, um sicher zu sein, dass keine strengere
Kontrolle gewünscht ist. Sollte z. B. der GF sagen „Innendienst darf Angebote nicht final
versenden ohne meine Freigabe“, müssten wir das einbauen – solche Anforderungen wurden
aber im Interview nicht explizit genannt. Ich empfehle einen Termin mit GF und Vertrieb/
Innendienst-Leitung, um das Berechtigungskonzept anhand von Beispielen (Wer sieht was?
Wer darf was?) abzuklären und dann verbindlich festzulegen.

**Integrationstiefe Lexware – Synchronisationsmodus:**

10.

**Frage:** _Wie soll die technische Integration mit Lexware konkret ablaufen – Echtzeit-API-Synchronisation bei_
_jeder Buchung, periodische Imports/Exports, oder Hybrid?_ Und: _Wer (CRM oder Lexware) ist führend für_
_die Vergabe der Rechnungsnummern?_
**Lösungsvorschlag:** Auf Basis der Machbarkeit und Minimierung von Fehlerquellen schlage ich vor:
Wir implementieren eine **stapelweise Synchronisation via Export/Import** zumindest für den
Anfang. Konkret könnte das so aussehen: Die Buchhaltung erstellt Rechnungen im CRM (das CRM
vergibt eine vorläufige Nummer oder interne ID). Am Tagesende (oder manuell direkt nach
Erstellung) werden die neuen Rechnungsdatensätze per Klick oder automatisch an Lexware
übertragen (über die API oder notfalls via CSV-Import). Lexware generiert dann offizielle
Belegnummern und Bestätigt die Buchung. Diese Belegnummer könnte zurück ins CRM gespiegelt

11.

12.

werden, um die vorläufige Nummer zu ersetzen. Für Zahlungseingänge ähnlich: Buchhaltung bucht
in Lexware, und z. B. einmal täglich werden die Offene-Posten-Stati ins CRM importiert, damit dort
„bezahlt“ markiert wird.
**Begründung:** Eine völlig _transaktionale Echtzeit-Kopplung_ (d.h. jedes Speichern im CRM ruft
sofort API von Lexware und umgekehrt) ist zwar elegant, aber fehleranfälliger und schwerer
zu testen – vor allem weil Lexware evtl. nicht jede Kleinigkeit via API zurückmelden kann. Ein
tagesaktueller Abgleich hingegen ist meist ausreichend und einfacher zu kontrollieren (man
könnte z. B. jeden Morgen einen Report „Sync abgeschlossen, 5 Rechnungen übertragen“
generieren).
**Rechnungsnummern:** Ich würde vorschlagen, dass das CRM die Rechnungen mit einer
_eigenen Nummer_ erstellt, die aber am Ende mit der Lexware-Nummer übereinstimmt oder
diese übernimmt. Eine Variante: Im CRM wird zunächst eine „Temp-Nummer“ vergeben (z. B.
R-ENTW-123), nach Export nach Lexware erhält man die echte Nr. (z. B. 2025-1001), die dann
ins CRM zurückgeschrieben wird. Das erfordert, dass wir die Lexware-API hierfür nutzen
können. Alternativ – falls API sehr zuverlässig – könnte das CRM beim Erstellen einer
Rechnung direkt eine Nummer von Lexware anfordern (d.h. Lexware ist führend für den
Nummernkreis). Dieser Punkt sollte mit der Buchhalterin besprochen werden, was ihr lieber
ist und wie Lexware es erlaubt. Erfahrung sagt: Oft lässt man das ERP (Lexware) die
Nummern machen, um 100% sicher zu sein, dass keine Diskrepanz mit steuerlichem Journal
entsteht.
**Klärung:** Daher sollten wir konkret klären: Hat Lexware eine API-Endpunkt „Beleg anlegen“?
(Ja, wohl laut Info). Können wir darüber Nummern reservieren? Wenn nein, Plan B wie oben
(Nachträgliches Mapping).

**Zusammenfassend** : Wir holen hier am besten noch einmal den Lexware-Dienstleister oder -
Handbuch zu Rate und erstellen einen Mini-Integrationsplan. Diese Rückfrage geht an die IT: _„Was_
_erlaubt die Lexware-API konkret und wie machen wir’s am einfachsten? Echtzeit push/pull vs. batch?“_
Sobald wir das haben, können wir das endgültige Vorgehen festzurren. Meine Empfehlung: **Batch-**
**Sync mehrmals täglich** , CRM initial führend, Lexware gibt Nummern, CRM aktualisiert. Das ist
robust und erfüllt das Ziel, dass letztlich beide Systeme dieselben Daten haben.

13.

**Datenmigration historischer Daten:**

14.

**Frage:** _Welche bestehenden Daten (Kunden, alte Projekte, offene Rechnungen) sollen in das neue System_
_übernommen werden?_ Im Kontext wissen wir nur von vielen Excel-Listen und Ordnern im Ist. Offen ist:
Will man alte Projekte nachpflegen (für 360°-Historie) oder beginnt man mit laufenden/neuen
Projekten?
**Lösungsvorschlag:** Da eine aufwendige Migration das Projekt verzögern und das System
„verunreinigen“ könnte (Stichwort Dubletten/Fehler bei Import), schlage ich vor:
**Kundenstammdaten** werden einmalig aus den bestehenden Quellen (z. B. Lexware
Debitorenliste oder CRM-Alt wenn vorhanden) importiert, um nicht zig Kunden neu anlegen
zu müssen. Das können wir bereinigen (Dubletten checken) und ins System laden –
Buchhaltung/Vertrieb sollte dabei helfen.
**Projekt- und Belegdaten:** Hier würde ich **keine vollumfängliche Migration der**
**Vergangenheit** vornehmen. Stattdessen: Wir starten zum Stichtag X, und alle neuen Projekte
und Angebote werden im System angelegt. Laufende Projekte könnte man teilweise
übernehmen, wenn sie noch länger laufen, aber abgeschlossene Projekte von früher würde

15.

16.

ich als PDF-Dokumentation vielleicht ablegen (z. B. alte Angebote/Rechnungen als Dateien an
den Kunden dranhängen für Historie), aber nicht als strukturierte Datensätze rekonstruieren.
Grund: Der Nutzen alter Projekte ins System zu tippen ist gering im Verhältnis zum Aufwand/
Fehlerpotenzial. Besser: Wir behalten die alten Ablagen für Altprojekte bei (oder exportieren
sie ins DMS), und nutzen das neue System für alles Zukünftige.
Offene Rechnungen zum Stichtag: Die muss man beachten – entweder noch im alten Prozess
abwickeln oder initial ins System einpflegen. Ich würde tendieren, alle **offenen Posten** zum
Start zu erfassen, damit man nicht in zwei Systemen mahnen muss. Das heißt, die
Buchhaltung würde einmal die Liste offener Kundenrechnungen (aus Lexware z. B.) im CRM
als „Eröffnungs-OPs“ eintragen (vielleicht als Dummy-Projekte „Altes Projekt XY –
Restzahlung“). Das ist handhabbar, wenn es nicht Hunderte sind.
Diese Entscheidungen müssen mit Buchhaltung und GF abgestimmt werden. Ich empfehle
hier klar: **Neustart mit Stichtag** , keine vollständige Rückmigration. Aber wir brauchen das
Commitment: falls GF erwartet, in neuem System gleich alle letzten 5 Jahre Projekt-Historie zu
sehen, müssten wir einen Kompromiss finden (z. B. nur Top-10-Kundenprojekte historisch
nachpflegen).

**Rückfrage formuliert:** _„Welche Altdaten (Kunden, Projekte, Rechnungen) benötigen wir im neuen System_
_für einen sinnvollen 360°-Blick, und was können wir als abgeschlossen betrachten und in Altsystemen_
_belassen?_ “ – Mit dem Vorschlag, Kunden zu übernehmen, offene Posten zu übernehmen, aber
abgeschlossene Projekte nur als Dateien beizulegen.

17.

**Offline-Funktionalität – Umfang in erster Version:**

18.

**Frage:** _Welche Module/Funktionen müssen zwingend offline verfügbar sein?_ (Kontakte, Aktivitäten,
Angebots erstellen?) und _Akzeptiert der Außendienst Einschränkungen beim Offline-Modus der ersten_
_Version?_
**Lösungsvorschlag:** Im MVP sollten die **Kernbedürfnisse des Außendienstes offline** abgedeckt
sein: Zugriff auf Kunden- und Kontaktdaten, Anlegen von Kontakten/Notizen, eventuell das Erstellen
einfacher Aktivitäten (Follow-ups). Komplexere Funktionen wie das vollwertige Gantt-Chart oder
Berichtsgrafiken müssen offline nicht sofort funktionieren – das wurde im Konzept als tolerierbar
identifiziert. Für Finanzen bedeutet offline: Ein Außendienstler kann auch ohne Netz z. B. eine
Spesen-Notiz eingeben oder prüfen, ob Kunde X offen hat (Stand letzter Sync). Er wird aber z.B. keine
Rechnung generieren können offline – das halte ich auch nicht für erforderlich.
Ich schlage vor: _Offline-Lesemodus_ für alle wichtigen Entitäten (Kunden, Projekte, letzte Status)
und _Offline-Erfassungsmodus_ für Kernaktionen (Notiz, neuer Kontakt, Spesen erfassen). Sobald
Verbindung da ist, synchronisiert es.
Diese Annahme sollten wir mit den Außendienst-Vertretern validieren: Sind sie einverstanden, dass
z. B. Projektplanänderungen oder Dashboards offline nicht verfügbar sind initial? In der Persona
wurde betont, dass offline v.a. für die täglichen Sales-Aktivitäten nötig ist – was wir mit obigem
Umfang erschlagen würden.
**Rückfrage:** _„Welche konkreten Informationen/Funktionen benötigt der Außendienst in Funklöchern_
_unbedingt?_ “ – Daraus ergibt sich das Pflichtenheft für Offline. Unser Vorschlag ist, den _Kern_
_(Kundeninfos, Termine, Notizen) offline-fähig_ zu machen und darauf zu kommunizieren. Wenn es

19.

20.

21.

22.

spezielle Wünsche gibt (z. B. Routenplanung offline – wobei Routen mit Online Maps eh besser),
können wir schauen.
_Eskalationserwartung:_ Persona deutete an, offline ist kritisch. Um nicht zu enttäuschen, sollten
wir zusichern was geht und was nicht. Evtl. kann man kommunizieren „in Version 1 Offline-
Funktion für X und Y, weitere Funktionen folgen“. Das mindert das Risiko (#5 in Risiken).

Wichtig: Early Adopter im Außendienst sollten die Beta testen, um zu sehen, ob Offline-Erlebnis
passt.

23.

**Zukünftige Erweiterungen (z. B. internationalisierung):**

24.

**Frage:** _Gibt es bereits absehbare zukünftige Anforderungen, die wir zumindest im Design berücksichtigen_
_sollten?_ (z. B. Mehrsprachigkeit der Oberfläche oder Dokumente, da GF sowas erwähnte
).
**Lösungsvorschlag:** Derzeit sind alle Nutzer deutschsprachig, also bleibt die UI Deutsch im MVP. Falls
Internationalisierung in den nächsten 1-2 Jahren realistisch sein sollte (z. B. Tochtergesellschaft im
Ausland), sollten wir die Software-Architektur schon darauf auslegen (Trennung von Text und Code
etc.).
**Rückfrage:** _„Gibt es Pläne, das System mittelfristig in anderen Sprachen oder Ländern einzusetzen?“_ –
Wenn nein, können wir dies als niedrige Priorität belassen. Wenn ja, planen wir dafür zumindest
Grundlagen (UTF-8, keine harten deutschen Labels).
Ebenso z. B. _Skalierung zu größerer Firma:_ Wird es mehr User oder viel mehr Daten geben, weil evtl.
Wachstumsschub? GF in Persona deutete Marktexpansion an. Unsere Annahmen decken moderate
Expansion ab, aber falls z.B. Zukauf einer anderen Firma ansteht, muss man an Migration denken.
Insgesamt sind dies Punkte, die man im Steering Committee diskutieren kann unter „Roadmap
Vision 2+“.

25.

# 26.

27.

28.

29.

Diese offenen Punkte sind bewusst festgehalten, damit sie im nächsten Projektschritt (Umsetzungsplanung
und Feinspezifikation) gezielt adressiert werden. Es empfiehlt sich, für jeden Punkt einen Verantwortlichen
und ein Zieldatum zur Klärung zu definieren. Mit den hier vorgeschlagenen Lösungen haben wir bereits
einen Richtungsentwurf, der auf dem bisherigen Projektkontext basiert – die endgültige Entscheidung sollte
jedoch durch das Projektgremium erfolgen, um sicherzustellen, dass alle Stakeholderbedürfnisse
berücksichtigt sind.

**Executive Summary** : Das Dokument hat die Domäne „Finanz- & Compliance-Management“ im geplanten
CRM/PM-Tool umfassend analysiert – von Herausforderungen über Persona-Anforderungen bis zur Vision,
Lösungsskizze und Risiken. Alle Inhalte beruhen ausschließlich auf den bereitgestellten Materialien:
insbesondere dem Interview-Transkript („SG Interview“ vom 31.10.2025), dem Gesamtkonzept-Dokument
des CRM/PM-Tools sowie den detaillierten Persona-Profilen (Buchhaltung, Geschäftsführer, Außendienst,
Innendienst). Durch Querverweise (z. B. „Persona Buchhaltung“, „Gesamtkonzept“) wurde sichergestellt,
dass jede Aussage im Projektkontext verankert ist.

Im Ergebnis liegt eine **widerspruchsfreie, druckreife Produktvision** für das Finanz- & Compliance-Modul
vor, die sowohl die strategischen Ziele (360°-Sicht, Datenintegrität, Effizienz) als auch die Bedürfnisse der
täglichen Nutzer (einfachere Arbeit, zuverlässige Prozesse) adressiert. Die nächsten Schritte bestehen darin,
die offenen Punkte mit den Stakeholdern zu klären und dann in die iterative Implementierung zu gehen –
gut gerüstet mit diesem fachlichen Fundament.

# Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf

file://file-FbKUtfPLzdQxRsRczADzbb

### Referenzpersona\_ Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte) (1).pdf

## file://file-3aJSWKjPEsdKNjLGcaRgEm

### 45
