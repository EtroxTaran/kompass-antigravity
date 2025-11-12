# Persona-Bericht_ Buchhaltung (Integriertes CRM- und PM-Tool)

*Converted from: Persona-Bericht_ Buchhaltung (Integriertes CRM- und PM-Tool).pdf*  
*Document Version: 2.0*  
*Last Updated: 2025-11-10*

**⚡ Relevante Spezifikationen für Buchhaltung-Rolle:**
- **Offline-Speicher:** 25 MB ✅ (unter iOS 50MB-Limit) – Alle Kunden (1000×2KB=2MB), Angebote/Verträge (150×50KB=7.5MB), Files (2×10MB=20MB)
- **RBAC-Berechtigungen (RISK-JOURNEY-001):** Siehe RBAC_PERMISSION_MATRIX.md §4
  - Alle Kunden: Lesezugriff (Basis-Daten), keine Edit-Rechte
  - Alle Projekte: Lesezugriff (für Finanztracking)
  - Alle Angebote/Verträge: Lesezugriff (für Kalkulationen und Budgetübersichten)
  - Finanzdaten: Exklusiver Zugriff auf creditLimit, accountBalance, profitMargin, paymentMethod
  - **Konflikt-Resolution:** Buchhaltung sieht Projektstatus, aber ADM sieht keine Detail-Margen (nur Status)
- **User Journeys:** Siehe USER_JOURNEY_MAPS.md
  - Journey 2: Projekt → Angebot/Vertrag → Abrechnung in Lexware (BUCH-Hauptrolle: Finanztracking, Budgetkontrolle, Zahlungsüberwachung)
- **GoBD-Compliance:** Siehe DATA_MODEL_SPECIFICATION.md §7
  - Vertrags-Archivierung (immutable nach Unterzeichnung)
  - 10-Jahres-Aufbewahrung mit Dokumentation
  - DSGVO/GoBD-Konflikt gelöst: Pseudonymisierung nach Löschantrag
- **Lexware Integration:** Siehe Finanz- und Compliance-Management Produktvision
  - Phase 1: KOMPASS verwaltet Angebote/Verträge, Lexware erstellt Rechnungen
  - Phase 2 (Optional): Read-only API-Zugriff auf Lexware für Rechnungsstatus-Tracking

---

# Persona-Bericht: Buchhaltung (Integriertes CRM-

### Einleitung

Die **Persona „Buchhaltung“** repräsentiert die Finanz- und Rechnungswesen-Verantwortliche eines
mittelständischen Projektunternehmens. In der Firma werden kundenspezifische Projekte abgewickelt; die
Buchhaltung sorgt dafür, dass finanzielle Prozesse reibungslos ablaufen und eng mit Kunden- und
Projektmanagement verzahnt sind. Dieser Bericht beschreibt Aufgaben, Anforderungen und Ziele der
Buchhaltungsrolle in Bezug auf ein integriertes **CRM- und Projektmanagement-Tool** , basierend auf dem
vorliegenden Gesamtkonzept und einem Interview mit einem Vertriebsmitarbeiter. Zudem werden **Best**
**Practices** und **Industriestandards** vergleichbarer Rollen aus ähnlich aufgestellten Unternehmen
einbezogen. Die Persona dient als Referenz für die Produktstrategie, Konzeptentwicklung und Definition
von Qualitätskriterien des geplanten Tools.

# Rollenbeschreibung und Kontext

Die Buchhaltung in diesem Unternehmen ist für sämtliche Finanzvorgänge zuständig und fungiert als
Bindeglied zwischen Projektmanagement und Unternehmensführung. Typischerweise handelt es sich um
eine erfahrene Buchhalterin, die allein oder im kleinen Team arbeitet. Sie nutzt bisher separate Software
(z. B. Lexware für Finanzbuchhaltung und Lohn) und manuelle Prozesse, die nun durch ein integriertes
System abgelöst bzw. vernetzt werden sollen. Neben dem Projektgeschäft betreut die Buchhaltung auch
klassische Finanzaufgaben des Tagesgeschäfts. Wichtig ist, dass **alle Einnahmen und Ausgaben im Blick**
sind – von Kundenrechnungen über Zahlungen bis zu Kosten – und ordnungsgemäß verbucht werden
.
Die Buchhaltung gewährleistet somit die finanzielle Stabilität des Betriebs und die Einhaltung gesetzlicher
Vorgaben.

# Hauptaufgaben und Verantwortlichkeiten

Die **Kernaufgaben** der Buchhaltung umfassen vor allem das **Rechnungswesen im Projektgeschäft** sowie
allgemeine finanzwirtschaftliche Tätigkeiten:

**Angebots- und Vertragserfassung**: Die Buchhalterin benötigt Zugriff auf Angebote und Verträge für Finanzplanung und Budgetüberwachung. Im KOMPASS-System werden Angebote und Auftragsbestätigungen als PDF hochgeladen oder als Formular erfasst, inklusive Gesamtkosten und Zahlungsplänen. Diese Daten dienen als Grundlage für Projektkalkulationen und finanzielle Berichte. Die **tatsächliche Rechnungsstellung** erfolgt jedoch in Lexware – KOMPASS ist nur für die Übersicht und Budgetverwaltung zuständig. Im aktuellen Prozess gibt der Außendienst oft per Zuruf Bescheid, wann eine Rechnung in Lexware erstellt werden soll, was inkonsistent ist. Ziel ist es, dass Angebote und Verträge im System dokumentiert sind, sodass die Buchhaltung diese Informationen für Finanzplanung nutzen kann.


**Zahlungseingang und Mahnwesen** : Die Buchhaltung überwacht eingehende Zahlungen zu Rechnungen, die in Lexware erstellt wurden. Sie registriert, **ob und wann Kunden zahlen** , und informiert bei Verzögerungen den Vertrieb, damit dieser beim Kunden nachhaken kann. Bleibt eine Zahlung aus, ist sie für das **Mahnwesen** verantwortlich – vom freundlichen Zahlungserinnern bis zur formalen Mahnung. Dieses **Forderungsmanagement** gehört zu den Kernaufgaben vieler Buchhalter und erfolgt vollständig in Lexware. In Zukunft könnte KOMPASS optional (Phase 2+) den Zahlungsstatus aus Lexware via API abrufen, um im Projekt-Dashboard anzuzeigen, ob Rechnungen bezahlt wurden.

# Projektbezogene Kostenverwaltung : In der Buchhaltung laufen auch die Kosten eines Projekts

# Provisions- und Umsatzabrechnung : Da das Unternehmen seinen Vertriebsmitarbeitern

# Zeitnachweise und Leistungserfassung : Das Unternehmen nutzt derzeit ein Programm namens

# Allgemeine Buchhaltungsaufgaben : Neben den projektspezifischen Tätigkeiten verantwortet die


**Angebote und Verträge müssen vollständig dokumentiert sein**
, damit die Buchhalterin sie für Finanzplanung und Budgetverfolgung nutzen kann. Die Buchhaltung stellt sicher, dass das
Unternehmen jederzeit auskunftsfähig ist über **Einnahmen, Ausgaben, Projektbudgets und**
**Vertragswerte** – Informationen, die im integrierten Tool idealerweise jederzeit abrufbar sind für
die Geschäftsführung und andere Berechtigte. Die eigentliche Rechnungsstellung geschieht in Lexware.

# Zusammengefasst sorgt die Buchhaltung dafür, dass Angebote/Verträge dokumentiert sind und Projektkosten überwacht werden,

# Typische Pain Points (Schmerzpunkte)

Aktuell bestehen mehrere Problemstellen im Arbeitsalltag der Buchhaltung, die durch ein integriertes
System adressiert werden sollen:

**Manuelle und inkonsistente Abläufe** : Viele Prozesse erfolgen noch per Zuruf, E-Mail oder Excel.
Beispielsweise gibt es keine systematische Dokumentation von Angeboten und Verträgen – der Vertrieb meldet sich
irgendwann bei der Buchhaltung mit Auftragsdaten, oft unvollständig oder verspätet. Ohne zentrale Erfassung von Angebots- und Vertragswerten im System kann die Buchhaltung keine zuverlässigen Finanzprognosen erstellen. Dieser
händische Informationsfluss ist ineffizient und fehleranfällig. Gleiches gilt für Projektkosten:
Ohne Integration muss die Buchhalterin verschiedene Datenquellen zusammenführen, um Budget vs. Ist-Kosten zu vergleichen. Es fehlt ein **klarer, systemgestützter Prozess** für Angebots-/Vertragsdokumentation, was zu Unklarheiten
und Mehraufwand führt.

# Informationssilos & doppelte Datenhaltung : Wichtige Daten liegen in getrennten Systemen.

# Fehlende Verknüpfung mit Lexware : Aktuell ist KOMPASS nicht mit Lexware verbunden. Die Buchhaltung arbeitet primär in Lexware für Rechnungserstellung und Mahnwesen. Optional könnte in Zukunft (Phase 2+) eine API-Integration den Zahlungsstatus aus Lexware ins KOMPASS-System übernehmen, um Projektmanagern anzuzeigen, ob Rechnungen bezahlt wurden. Diese Integration ist jedoch nachrangig und nicht MVP-kritisch.


**Intransparenz**
**bei**
**Projektfinanzen** :
Für
die
Projekt-Nachkalkulation
oder
Geschäftsführungsauswertungen muss die Buchhalterin aktuell einiges manuell aufbereiten. Da das
CRM/PM-Tool noch nicht alle Finanzdaten enthält, fehlt dort z. B. eine **laufende Budgetübersicht** je
Projekt (Soll-Ist-Vergleich). Die Geschäftsführung wünscht sich jederzeit einen Gesamtüberblick –
momentan erfordert dies Nachfragen bei Buchhaltung und Projektleitung, um aktuelle Zahlen zu
erhalten
. Dieses Auseinanderfallen der Systeme erschwert schnelle Entscheidungen. Fehler
können unentdeckt bleiben, etwa wenn ein Projekt deutlich über Budget läuft, aber im CRM
niemand die echten Kosten sieht. Die Buchhaltung empfindet es als Schmerzpunkt, dass
**Entscheidungen ohne vollständige Kostensicht** getroffen werden (z. B. Projektleiter verspricht
extra Leistungen, ohne die Auswirkung auf Marge zu kennen).

# Hohes manuelles Kontrollaufkommen : Ohne integrierte Workflows muss die Buchhalterin


**Datenqualität und Doppelerfassung** : Durch die Mehrfacherfassung in verschiedenen Tools
entstehen Fehler (Zahlenübertragungsfehler, Zahlendreher) und Inkonsistenzen. Beispiel: Einmal
erfasste Kundendaten aus dem CRM müssen für die Rechnung in Lexware erneut eingegeben
werden, was zu Abweichungen führen kann. Das neue System sollte diese **Redundanzen abbauen** ,
um Qualität zu verbessern. Aktuell besteht hier ein Pain Point in Form von **unnötiger Tipparbeit**
und dem Risiko, dass z. B. eine Adresse unterschiedlich gepflegt ist in CRM und FiBu.


**Technische Medienbrüche** : Einige Prozesse sind schlicht unbequem: Eingehende **PDF-Rechnungen**
von Lieferanten müssen aus E-Mails gezogen und in Lexware eingebucht werden; es gibt keinen
direkten Bezug zum Projekt im CRM, außer man trägt Referenzen händisch nach. Genauso werden
Angebote im Vertrieb (z. B. in Word/Excel) erstellt und nicht nahtlos in eine Auftrags- oder
Rechnungsstellung übernommen. Diese Brüche verzögern Abläufe und sind fehleranfällig. Die
Buchhaltung wünscht sich hier durchgängige digitale Workflows („vom Angebot zur Rechnung ohne
doppelte Arbeit“
).

# Zusammengefasst leidet die Buchhaltung derzeit unter Ineffizienz durch fehlende Integration . Die Folge

# Funktionale Anforderungen an das CRM/PM-Tool

Um die genannten Aufgaben zu erfüllen und Pain Points zu eliminieren, benötigt die Buchhaltung **konkrete**
**Funktionen** im integrierten System:

**Rechnungsmodul mit Teilzahlungs-Logik** : Das Tool muss die Erstellung von Rechnungen
unterstützen, insbesondere **projektbezogene Abschlags- und Schlussrechnungen** . Für jedes
Projekt sollen standardisierte Zahlungspläne hinterlegt werden können (etwa Prozentsätze oder


feste Beträge zu definierten Meilensteinen). Das System sollte **automatisch Erinnerungen oder**
**Aufgaben erzeugen** , wenn der nächste Rechnungstermin naht – idealerweise gemäß
vorgegebenem Prozess (z. B. 16 Wochen vor Einbau, etc.). Eine direkte **Erstellung von**
**Rechnungsdokumenten**
aus dem System ist wünschenswert: Kundendaten und
Leistungspositionen sollen aus dem Projekt konvertiert werden können („Vom Angebot zur
Rechnung – ohne doppelte Arbeit“
). Damit entfällt das manuelle Neuerfassen jeder Rechnung.
**Vorlagen** mit Firmenlogo, MwSt-Satz, IBAN etc. beschleunigen die Rechnungsstellung. Zudem muss
das Modul
**Rechnungsnummern und Datum**
automatisch vergeben (Fortlaufung zur
Gewährleistung der GoBD-Konformität).

# Zahlungseingangs-Tracking und Mahnwesen : Eine zentrale Anforderung ist, den Status jeder

# Projektkosten- und Budgetverwaltung : Das System sollte Projektbudgets (angebotener Preis


**Provisionserfassung** : Zur Unterstützung der Provisionsabrechnung muss das CRM die
**Vertriebsaktivität pro Auftrag** dokumentieren. Konkret sollte bei jedem Kundenauftrag hinterlegt
sein, auf welche Quelle er zurückgeht (Kaltakquise durch welchen Mitarbeiter, Messekontakt,
bestehender Kunde etc.). Das System könnte z. B. beim Anlegen des Projekts vom Vertrieb
verlangen: „Akquiseart/Quelle wählen“. Die Buchhaltung benötigt später einen **Bericht** , der für jede
Faktura ausweist, welcher Mitarbeiter welche Provision erhält. Eine einfache Variante: Im
Projektstamm Felder für „Provision %“ und „Verkäufer“ – daraus generiert das System eine Liste oder


sogar Buchungsdatei für die Lohnabrechnung. Mindestens aber muss die Info im System vorhanden
sein, **damit die Buchhaltung nicht manuell Listen führen muss** . Zusätzlich wäre es nützlich, wenn
Außendienstler im Tool ihren aktuellen Provisionsstand einsehen könnten (Motivation), aber die
Abrechnung selbst muss korrekt von der Buchhaltung gezogen werden können
.

# Zeiterfassungsschnittstelle : Das neue System sollte idealerweise die Projektarbeitszeiten der


**Reporting und Dashboard** : Für ihren eigenen Überblick und für die Geschäftsführung benötigt die
Buchhaltung **Auswertungen auf Knopfdruck** . Das Tool sollte Berichte bereitstellen wie: *Offene-*
*Posten-Liste* , *Umsatz pro Monat/Quartal* , *Projektübersicht mit Soll-Ist* , *Erfolgreichste Kunden oder Projekte* ,
*Provisionen pro Mitarbeiter* , etc. Ein **Dashboard** für die Buchhaltung könnte z. B. zeigen: *Summe offene*
*Forderungen* , *Überfällige Zahlungen (Anzahl/Betrag)* , *Rechnungen diesen Monat* , *Deckungsbeitrag je*
*Projekt in Prozent* , usw. Solche Kennzahlen helfen, **Rückschlüsse und Entscheidungen zu treffen**
. Wichtig ist, dass die Daten aus allen Bereichen zusammenfließen – etwa dass ein Projekt als
„erfolgreich“ markiert wird, wenn die Marge über X% liegt, oder dass man filtern kann nach Branche
des Kunden, Projektgröße, um profitable Segmente zu identifizieren. Die Buchhaltung braucht also
**flexible Analysemöglichkeiten** aus den integrierten Daten, ohne erst alles in Excel kopieren zu
müssen. Das entlastet sie in ihrer Controlling-Funktion.

# Schnittstelle zur Finanzbuchhaltung (Lexware/Datev)

Da das Unternehmen Lexware für die Finanzbuchhaltung nutzt, ist eine Schnittstelle zum neuen CRM/PM-Tool essentiell, um **doppelte Dateneingabe** zu vermeiden. 

**⚡ Wichtig: Phasenweise Implementierung (Update 2025-11-10)**

Die Lexware-Integration wird in einem **zweiphasigen Ansatz** umgesetzt:

**Phase 1 (MVP - 0-6 Monate):**
- **Manueller Export/Import-Workflow**
- Buchhaltung erstellt Rechnungen komplett im KOMPASS-System
- Export-Funktion generiert Lexware-kompatible CSV-Datei mit allen relevanten Daten (Kundendaten, Rechnungspositionen, Beträge, Steuern)
- Buchhaltung importiert CSV manuell in Lexware (wöchentlich oder bei Bedarf)
- Zahlungsstatus wird manuell zwischen den Systemen abgeglichen (Buchhaltung markiert Rechnungen als "bezahlt" im KOMPASS nach Prüfung in Lexware)
- **Vorteil:** Schneller MVP-Start, bewährte Lexware-Prozesse bleiben erhalten
- **Aufwand:** Wöchentlich ca. 30-60 Minuten für Export/Import/Abgleich

**Phase 2 (Nach MVP-Validierung, ca. 3-6 Monate nach Go-Live):**
- **Automatische bidirektionale Synchronisation via Lexware REST API**
- Kundendaten werden automatisch von KOMPASS nach Lexware übertragen
- Rechnungsnummern und Zahlungsstatus kommen automatisch von Lexware zurück ins KOMPASS
- Nächtliche Synchronisation (täglich um 00:00-02:00 Uhr)
- Konfliktlösung: KOMPASS ist führend für Kundendaten; Lexware ist führend für Finanztransaktionen
- **Vorteil:** Vollständig automatisiert, "keine Doppelarbeit" wie im Nordstern-Vision beschrieben
- **Voraussetzung:** Lexware REST API-Zugang (bereits untersucht und dokumentiert - verfügbar für Lexware Office/Pro)

**Technische Details (für Phase 2):**
Die technische Machbarkeit ist gesichert: Lexware bietet eine REST API mit vollständigem Zugriff auf Kontakte, Rechnungen und Zahlungen. Die API unterstützt OAuth 2.0-Authentifizierung und bidirektionale Synchronisation. Alternative Optionen wie DATEV-Format-Export oder CSV-Batch-Automation stehen ebenfalls zur Verfügung, falls erforderlich.

**Für die Buchhaltung bedeutet das konkret:**
- **MVP (Phase 1):** Teilautomatisierung - Rechnung im KOMPASS erstellen, wöchentlich per Knopfdruck nach Lexware exportieren, manuell importieren. Deutlich besser als aktueller Zuruf-Prozess, aber noch ein Handgriff nötig.
- **Phase 2:** Vollautomatisierung - System synchronisiert automatisch, Buchhaltung arbeitet hauptsächlich im KOMPASS, Lexware läuft im Hintergrund für gesetzliche FiBu-Pflichten.

Diese phasenweise Herangehensweise ermöglicht einen schnelleren Start mit dem Kernsystem und stellt sicher, dass die Buchhaltungsprozesse im echten Betrieb validiert werden, bevor die komplexe Integration implementiert wird.

---

**Dokumentenmanagement & Belegarchivierung** : Funktional muss das Tool erlauben, **Dokumente**
**zu hinterlegen** – insbesondere Angebote, Verträge, Ausgangsrechnungen und Eingangsbelege. Für
jede Kundenrechnung sollte das PDF der Rechnung im System gespeichert sein (idealerweise
automatisch generiert, wie oben beschrieben). Auch relevante E-Mails oder Kontaktnotizen können
angehängt werden. Damit hat die Buchhaltung **alle Belege an einer Stelle verfügbar** und erfüllt
zugleich die Pflicht zur Aufbewahrung. Ein besonderes Anliegen ist die **GoBD-konforme**


**Archivierung** : Das System sollte Änderungen an Rechnungen protokollieren und sicherstellen, dass
archivierte Belege nicht mehr unbemerkt veränderbar sind (bzw. jede Änderung dokumentiert
bleibt)
. So können Betriebsprüfer oder Steuerberater benötigte Unterlagen direkt im System
finden. Ein gutes DMS spart der Buchhaltung Zeit bei der Suche und gewährleistet
**Revisionssicherheit** .

# Benutzer- und Rechteverwaltung : Das System muss berücksichtigen, dass Finanzdaten vertraulich


Die obigen Funktionen sind essenziell, um die **Effizienz der Buchhaltung** im integrierten CRM/PM-Tool zu
gewährleisten. Durch Automatisierung (z. B. Mahnungen), zentrale Datenhaltung (Projekte, Kosten,
Zahlungen) und Anbindung an die FiBu wird die Buchhaltung spürbar entlastet und das Unternehmen
behält dennoch die finanzielle Kontrolle über jedes Projekt.

# Nicht-funktionale Anforderungen

Neben den konkreten Features muss das System bestimmte
**Qualitätsmerkmale**
und
Rahmenbedingungen erfüllen, damit es aus Sicht der Buchhaltung akzeptiert und zuverlässig eingesetzt
werden kann:

**Zuverlässigkeit und Datenintegrität** : Finanzdaten müssen absolut korrekt und verlässlich sein.
Das System darf keine Buchung „verlieren“ oder Zahlendreher verursachen. Eine robuste Datenbank
im Hintergrund ist nötig, die Transaktionen sicher speichert.
**Backups**
und
Wiederherstellungsmechanismen sind ein Muss, da der Verlust von Rechnungsdaten gravierende
Folgen hätte. Außerdem muss das Tool **stabil** laufen – insbesondere zum Monats- und Quartalsende
(wenn Abschlussarbeiten anstehen) sind Ausfälle inakzeptabel.


**Sicherheit und Zugriffsrechte** : Da vertrauliche Finanzinformationen enthalten sind (Umsätze,
Gewinne, Personaldaten für Provisionen etc.), ist hoher Wert auf **IT-Sicherheit** zu legen. Zugriffe
müssen per Login und Rollenrechten strikt geregelt sein (siehe funktionale Rechteverwaltung).
Ebenso müssen Daten verschlüsselt übertragen und gespeichert werden (gerade wenn Cloud-
Lösung). Externe Zugriffe (z. B. übers Internet) sind nur mit sicheren Protokollen erlaubt.
**Datenschutz** spielt eine Rolle, da auch personenbezogene Daten (Kunden, Mitarbeiter) verarbeitet
werden – DSGVO-Konformität ist Pflicht.


**Compliance und Gesetzeskonformität** : Das System muss die **gesetzlichen Anforderungen des**
**Rechnungswesens**
erfüllen. In Deutschland heißt das: GoBD-konforme Buchführung
(Nachvollziehbarkeit, Unveränderbarkeit von Aufzeichnungen), konforme Rechnungsstellung (alle
Pflichtangaben
wie
Steuernummer,
fortlaufende
Rechnungsnummer,
korrekte
Umsatzsteuerberechnung). Zudem sollte es neue gesetzliche Entwicklungen berücksichtigen, z. B. **E-**
**Rechnung-Standards** (XRechnung, ZUGFeRD)
, die für öffentliche Aufträge mittlerweile Pflicht


sind (Stand 2025). Auch das Thema **Aufbewahrungsfristen** (10 Jahre Archiv) fällt hierunter. Nicht-
funktional heißt das: Das System muss **Updates** ermöglichen, falls sich Gesetze ändern (z. B.
Steuersätze) – also auf lange Sicht wartbar und anpassbar sein.

**Benutzerfreundlichkeit (Usability)** : Die Buchhalterin ist keine Entwicklering, d.h. das Tool muss
trotz komplexer Daten einfach bedienbar sein. **Übersichtliche Oberflächen** für Rechnungen, eine
klare Aufbereitung von Zahlen (z. B. Summenbildung, Filter für offene Posten) und **intuitive**
**Workflows** (z. B. „Rechnung erstellen“ Wizard) sind wichtig. Kurze, selbsterklärende Klickwege
sparen Zeit. Schulungsaufwand sollte minimal sein – im Idealfall orientiert sich die UI an bekannten
Mustern oder bisherigen Prozessen. Für die Buchhaltung besonders wichtig: **Konsistente und**
**vollständige Datenanzeige** . Sie sollte auf einen Blick sehen können, was sie braucht (z. B. im
Kundenkonto alle Rechnungen, Zahlungen und Mahnungen). Performance ist Teil der Usability: auch
bei vielen Datensätzen darf es keine langen Ladezeiten geben, wenn sie z. B. eine Liste aller offenen
Posten zieht.


**Performance und Skalierbarkeit** : Finanzdaten können mit der Zeit stark anwachsen (viele Projekte,
tausende Rechnungen). Das System muss **mit zunehmendem Datenvolumen umgehen** können,
ohne spürbar langsamer zu werden. Abfragen wie „zeige alle Rechnungen dieses Jahres“ oder
„Export aller Buchungen“ sollten zügig erfolgen. Gerade Auswertungen (Pivot über zig Projekte)
können rechenintensiv sein – hier ist ggf. eine gute Indexierung oder ein separates Reporting-Modul
sinnvoll. Auch **gleichzeitige Zugriffe** mehrerer Nutzer (Buchhaltung, Geschäftsführung, Vertrieb)
dürfen nicht zu Konflikten führen. Beispielsweise wenn die Buchhaltung eine Rechnung bucht,
während der Vertrieb im selben Datensatz Notizen editiert, muss das System Transaktionen sauber
abwickeln (Locking oder Live-Update der Sicht).


**Interoperabilität** : Nicht-funktional, aber strategisch: Das Tool sollte sich gut in die bestehende
**Systemlandschaft integrieren** . Dazu gehört die erwähnte FiBu-Schnittstelle, aber auch ggf.
Anbindung ans **CRM für Kundenkontakte** (falls separat) oder ans **Projektmanagement-Tool** (falls
Module entkoppelt). In diesem Fall ist es ein integriertes CRM/PM, was intern schon Silos abbaut.
Dennoch könnten weitere Schnittstellen gefragt sein, z. B. zur Zeiterfassung, zu E-Mail/CRM für
Mahnversand, oder zu BI-Tools für erweiterte Analysen. Offene APIs oder Standardexporte (CSV,
Excel) sind ein Qualitätsmerkmal, weil sie künftige Anpassungen erleichtern.


**Wartbarkeit und Weiterentwicklung** : Aus Buchhaltungssicht bedeutet das, dass das System
**zuverlässig supportet** wird. Wenn es z. B. Änderungen in den steuerlichen Vorschriften gibt, muss
der Hersteller Updates liefern (z. B. neue Formate für Umsatzsteuervoranmeldung oder E-
Rechnung). Auch sollte es **konfigurierbar** sein, sodass spezielle betriebsinterne Regeln ohne
Programmieraufwand umgesetzt werden können (z. B. andere Zahlungsziele für bestimmte Kunden,
zusätzliche Felder für interne Kontierungszwecke). Die Buchhaltung sollte nicht bei jeder kleinen
Änderung (z. B. neuer Steuersatz) an ihre Grenzen stoßen – das System muss flexibel genug sein.


**Audit-Trail und Nachvollziehbarkeit** : Jede finanzielle Transaktion sollte im System protokolliert
sein. Wer hat wann welche Rechnung erstellt, geändert oder gelöscht? Für die Buchhaltung ist diese
**Revisionsspur** wichtig, um im Zweifel Änderungen erklären zu können. Das System sollte Logs
bieten, die im Rahmen von Prüfungen vorzeigbar sind (z. B. Änderungshistorie einer Rechnung:
storniert am Datum X durch User Y, mit Verweis auf Stornobeleg). Dies unterstützt die **interne**
**Kontrolle** und erschwert Betrug oder Fehler.


**Mehrsprachigkeit/Währung (bei Bedarf)** : Falls das Unternehmen international tätig ist, müsste
das System fremdsprachige Rechnungen oder andere Währungen beherrschen. Im gegebenen
Kontext scheint das Unternehmen aber national zu agieren, daher ist dies optional.


In Summe lauten die nicht-funktionalen Hauptanforderungen: **verlässlich, sicher, rechtskonform,**
**benutzerfreundlich und zukunftssicher** . Nur wenn das gegeben ist, kann die Buchhaltung dem System
vollständig vertrauen – was unerlässlich ist, da es um finanzielle Kernprozesse geht.

# Best Practices und Industriestandards

Für die Rolle Buchhaltung in einem projektorientierten Mittelstandsunternehmen gibt es etablierte
**Branchenstandards** , an denen sich das neue System orientieren sollte:

**Projektbuchhaltung als Bindeglied** : In vielen projektbasierten Betrieben wird ein
**Projektbuchhalter** eingesetzt, der Aufträge von Anfang bis Ende finanziell begleitet
. Diese Rolle
– die hier von der Buchhalterin mit übernommen wird – sorgt dafür, dass **Budgetplanung, laufende**
**Kostenverfolgung und Abrechnung** verzahnt ablaufen. Best Practice ist, dass bereits bei
Projektstart ein **Budget** und ein **Kostenplan** vorliegen, gegen die gebucht wird
. Erfolgreiche
Unternehmen stellen sicher, dass die Buchhaltung früh in Projekte eingebunden ist (z. B. bei der
Auftragskalkulation) und nicht erst am Ende Rechnungen schreibt. Das integrierte Tool sollte diese
Verzahnung fördern, etwa durch gemeinsame Datenbasis für Vertrieb/PM und Buchhaltung. So
können **Rentabilitätsprognosen** genauer erstellt und überwacht werden
.

# Teilzahlungen und Liquiditätsmanagement : Im Projektgeschäft gilt es als Standard, nicht erst am

# Automatisiertes Mahnwesen : Standard in der Debitorenbuchhaltung ist ein dreistufiges

# Digitale Belegverwaltung : Ein anerkannter Standard ist die möglichst digitale Verarbeitung von


**Scan** eingebracht. Dies entspricht den Grundsätzen moderner Buchhaltung, in der Papier
zunehmend verschwindet. Zudem fordern die GoBD die unveränderte Aufbewahrung digitaler
Belege – was das System durch Zugriffssperren nach Verbuchung oder durch
Archivierungsfunktionen sicherstellen sollte
. Unternehmen im Mittelstand setzen vermehrt
auf *cloudbasierte Archivsysteme* oder on-premise DMS, um jederzeit Belege griffbereit zu haben. Das
integrierte System sollte hier ansetzen und der Buchhaltung ermöglichen, **Dokumente zentral**
**abzulegen und zu finden** , am besten verknüpft mit den jeweiligen Vorgängen (Kunde, Projekt,
Rechnung).

# Integration statt Insellösungen : Ein wichtiger Branchentrend ist die Vermeidung von


**Kontinuierliches Controlling** : In projektorientierten Firmen wird empfohlen, **laufend den**
**Projektfortschritt finanziell zu verfolgen** . Das heißt, nicht erst nach Projektende die
Wirtschaftlichkeit zu prüfen, sondern während des Projekts Abweichungen zu erkennen. Dazu dient
zum einen das erwähnte Zeit- und Kostentracking, zum anderen **regelmäßige Soll-Ist-Vergleiche** .
Ein Best Practice ist z. B. monatliche Project-Review-Meetings, wo Buchhaltung und Projektleitung
zusammen die Zahlen durchgehen. Ein gutes System liefert hierfür die Grundlage: Echtzeit-Daten zu
Kosten, erbrachter Leistung (% abgeschlossen) und noch erwarteten Ausgaben. So können
Gegenmaßnahmen früh getroffen werden (z. B. zusätzliche Anzahlungsrechnung vereinbaren, wenn
Projekt sich verlängert). Insgesamt sollte das Tool also **transparente Projektergebnisse** liefern,
damit die Buchhaltung ihre beratende Funktion wahrnehmen kann, anstatt nur ex-post zu buchen.


**Kunden- und auftragsbezogene Auswertungen** : Zur strategischen Steuerung schaut die
Buchhaltung (bzw. das Management) oft auf Kennzahlen pro Kunde oder Segment.
Industriestandard ist es, z. B. die **Umsatzverteilung nach Kundengruppen** zu kennen,
**Wiederkaufraten** oder die **Erfolgsquote von Angeboten** . Diese Informationen entstehen im
Zusammenspiel von Vertrieb und Buchhaltung. Das CRM sollte daher Felder wie Umsatzklasse,
Zahlungszuverlässigkeit oder ähnliches führen. In vielen CRM-Systemen kann man Kunden filtern
nach Kriterien wie „Umsatz > 50k€/Jahr“ oder „Kunde hat offene Posten > 90 Tage“ – solche
Funktionen helfen, Risiken zu managen (z. B. bei Kunden mit schlechter Zahlerhistorie vielleicht
kürzere Zahlungsziele oder Vorkasse festlegen). Ein **integriertes Rating** oder zumindest Notizfeld
für Zahlungsverhalten wäre daher hilfreich. Dies spiegelt best practice wider, Kreditrisiken schon im
Vertriebsgespräch zu berücksichtigen („Wie wahrscheinlich ist es, mit dem Kunden Geld zu machen?“
wurde im Interview als Frage genannt)
.

# Standardsoftware und Erweiterbarkeit : Aus IT-Sicht gilt im Mittelstand zunehmend die Devise,


---

*Page 11*

---

entsprechen – es soll robust und erprobt sein, mit Standardfunktionen, die für 80% der
Buchhaltungsbedürfnisse passen. Für die restlichen 20% (spezielle Berichte, einzigartige Prozesse)
sollte es anpassbar sein (z. B. eigene Felder, Auswertungsdesigner, API für Spezialanwendungen).
Dies ist kein direkter Benutzerwunsch, aber ein impliziter Standard, um nachhaltig zu sein.

Zusammenfassend fließen diese Best Practices in die Konzeption für die Buchhaltungs-Persona ein:
**Transparente Teilzahlungssysteme** , **automatisierte Workflows für Mahnung/Zahlung** , **digitale,**
**integrierte Datenhaltung** und **laufendes Projektcontrolling** sind Schlüsselfaktoren, die erfolgreiche
Unternehmen einsetzen
. Das integrierte Tool sollte die Buchhaltung in die Lage versetzen, nach diesen
Standards zu arbeiten, um die Effizienz und Qualität der Finanzprozesse zu steigern.

# Schnittstellen zu anderen Personas und Prozessen

Die Buchhaltung ist eng verflochten mit anderen Abteilungen. Im CRM/PM-Kontext ergeben sich **zahlreiche**
**Schnittstellen** , die bei dieser Persona berücksichtigt werden:

**Außendienst (ADM / Vertrieb)** : Mit dem Vertrieb besteht eine der wichtigsten Schnittstellen. Der
Außendienstmitarbeiter initiiert Projekte und pflegt den Kundenkontakt, während die Buchhaltung
die finanzielle Abwicklung übernimmt. Konkret: Sobald der Außendienst einen Auftrag reinholt,
muss er das **Projekt im System anlegen** und idealerweise Eckdaten für die Fakturierung
(Zahlungsplan, Kundensonderwünsche in der Zahlungsabwicklung) hinterlegen. Er liefert der
Buchhaltung also die Grundlage. Umgekehrt informiert die Buchhaltung den Vertrieb über
**Zahlungsstände** – z. B. „Kunde X hat die Anzahlung geleistet, du kannst weitermachen“ oder „Kunde
Y ist im Verzug, bitte nachfassen“
. Im bisherigen Prozess passiert Letzteres per Zuruf; im neuen
System könnte der Vertrieb selber den Status einsehen (z. B. Ampelsystem: **Grün** =alles bezahlt,
**Gelb** =Zahlung fällig bald, **Rot** =überfällig) und wird ggf. automatisch benachrichtigt, wenn
Handlungsbedarf besteht. Auch bei der **Provision** arbeiten beide Rollen zusammen: Der Vertrieb
erfasst die nötigen Infos (Kundenquelle, Deals) und die Buchhaltung rechnet ab
. Das System
muss diese Zusammenarbeit unterstützen, etwa durch geteilte Sicht auf Kunden- und
Zahlungshistorie. Eine weitere Schnittstelle ist die **Angebotskalkulation** – der Vertrieb gibt Preise
raus, aber die Buchhaltung achtet im Hintergrund auf die Profitabilität. In einem integrierten Tool
könnte z. B. ein Ampel-Indikator zeigen, ob ein Angebot unter Mindestmarge fällt, damit der Vertrieb
Rücksprache hält mit der Buchhaltung/Geschäftsführung, bevor es rausgeht. Generell braucht der
**Außendienst eine schnelle Kundensicht** , inkl. Zahlungshistorie
, und die Buchhaltung stellt
sicher, dass diese Daten stimmen.

# Innendienst / Projektleitung : Diese Rolle (oft technischer Innendienst oder PM) koordiniert die


**Ist-Daten** : Er bestätigt z. B., wenn ein Projekt fertiggestellt ist – das ist das Signal für die
Buchhaltung, die Schlussrechnung zu schreiben. Umgekehrt kann die Buchhaltung dem Innendienst
Hinweise geben, etwa „Projekt Y ist über Budget – Kosten prüfen“ (Controlling-Aspekt). Zudem sind
Innendienst-Mitarbeiter oft unterwegs beim Kunden (wie beschrieben, springen sie auch mal als
Monteur ein)
. Dann generieren sie vielleicht Spesen oder Extra-Kosten, die ins Projekt
einfließen müssen. Das System sollte diese **Vor-Ort-Ereignisse** erfassbar machen (z. B.
Montagebericht mit Materialverbrauch und Zeit – das geht ans Projekt und damit an die
Buchhaltung). Somit ist die Buchhaltung eng in die **operativen Abläufe** eingebunden.

# Geschäftsführung : Die Geschäftsleitung benötigt aus der Buchhaltung konsolidierte Finanzdaten

# Marketing : Direkt mit Marketing gibt es wenige Überschneidungen, aber indirekt schon: Das

# Weitere interne Rollen : Je nach Unternehmensstruktur interagiert die Buchhaltung auch mit


**Abteilung** gäbe, wäre die Buchhaltung mit dieser eng verzahnt, wobei in KMU oft Buchhaltung und
Controlling in Personalunion sind. Sollte es einen separaten
**Projektleiter**
geben
(Planungsabteilung), hat die Buchhaltung Berührungspunkte in Form von Projektfreigaben oder
Änderungsmanagement: z. B. wenn der Projektleiter zusätzliche Leistungen vereinbart, muss die
Buchhaltung wissen, ob nachverrechnet werden kann. Hier wäre im System ideal ein **Change-**
**Request-Prozess** , der sowohl PM als auch Buchhaltung einbezieht (Freigabe ggf. durch GF/
Buchhaltung falls kostenrelevant). Zudem arbeitet die Buchhaltung mit externen Partnern wie dem
**Steuerberater** oder **Wirtschaftsprüfer** zusammen – hierfür muss das System Datenexport (z. B.
fürs Prüferpaket) bereitstellen, was eher indirekt über die FiBu-Schnittstelle passiert.

Insgesamt spielt die Buchhaltung eine **zentrale, abteilungsübergreifende Rolle** . Viele Prozesse sind
bereichsübergreifend, z. B. Auftragsabwicklung (Vertrieb, PM, Buchhaltung) oder Lieferantenmanagement
(Einkauf/Innendienst, Buchhaltung). Das CRM- und PM-System muss diese Schnittstellen unterstützen,
damit Informationen *im System* fließen statt über Umwege. Jeder Beteiligte sollte auf seinen Bereich
fokussiert arbeiten können, während die Buchhaltung im Hintergrund die **finanzielle Klammer** bildet. Ein
gelungenes Zusammenspiel äußert sich z. B. darin, dass der **Vertrieb keine Aufträge mehr „schwarz“**
**starten** kann ohne Anlage im System (und damit automatische Info an Buchhaltung), oder dass der
Innendienst Lieferanten nur auslösen kann, wenn eine Bestellanforderung im System erfasst ist
(Budgetkontrolle). So greifen die Zahnräder ineinander, und die Buchhaltung hat letztlich weniger manuelle
Nacharbeit.

# Rollenziele

Die Persona Buchhaltung verfolgt mehrere **übergeordnete Ziele** , die sowohl ihre persönliche
Arbeitszufriedenheit als auch den Unternehmenserfolg betreffen:

**Finanzielle Stabilität sichern** : Oberstes Ziel ist, die **Liquidität des Unternehmens** sicherzustellen.
Das bedeutet, **schnelle Rechnungsstellung** und **geringe Außenstände** . Die Buchhalterin möchte,
dass kein Umsatz liegenbleibt und Kunden pünktlich zahlen, damit genügend Cash für
Verbindlichkeiten da ist. Das Tool soll sie dabei unterstützen, indem es keine Rechnungstermine
vergisst und säumige Zahler identifiziert. Ein KPI wäre z. B. *DSO (Days Sales Outstanding)* zu senken –
also die Zeit zwischen Rechnungsstellung und Zahlungseingang zu minimieren.


**Vollständige und korrekte Buchführung** : Ein zentrales Ziel ist die **Ordnungsmäßigkeit** aller
finanziellen Aufzeichnungen. Die Buchhaltung will am Monats- und Jahresende **abschlusssichere**
**Bücher** haben, d.h. vollständig, korrekt und prüfungssicher. Das Tool soll dazu beitragen, indem es
**Daten vollständig erfasst und Fehler reduziert** . Die Buchhalterin strebt an, dass bei einer
Betriebsprüfung sämtliche Belege sofort vorliegen und konsistent sind. Dieses Ziel umfasst auch die
Einhaltung aller gesetzlichen Pflichten (Steuerfristen, Dokumentationspflichten). Erfolg heißt hier:
keine Beanstandungen vom Steuerprüfer, keine Versäumnisgebühren, weil Voranmeldungen korrekt
und pünktlich sind.


**Effizienzsteigerung und Zeitgewinn** : Persönlich wünscht sich die Buchhalterin, **weniger Zeit mit**
**monotoner Dateneingabe und Nachverfolgung** zu verbringen und mehr Zeit für wertschöpfende
Analysen oder strategische Aufgaben zu haben. Ein Ziel ist also, **Routineaufgaben zu**
**automatisieren** , um Kapazitäten freizuspielen. Beispielsweise soll das Mahnwesen „von selbst“
laufen oder das Sammeln von Projektzeiten nicht mehr jeden Monat manuell erfragt werden


müssen. Wenn das System gut implementiert ist, könnte die Buchhalterin pro Woche etliche
Stunden sparen, die bisher für manuelle Checks draufgingen. Diese gewonnene Zeit kann sie
nutzen, um **finanzielle Beratung** intern zu leisten (z. B. Auswertungen für die Geschäftsführung,
Kostenoptimierungen). Erfolg wäre hier spürbar: Das Unternehmen könnte evtl. wachsen, ohne dass
die Buchhaltungsstelle personell aufgestockt werden muss, weil das Tool skaliert.

**Transparenz und Kontrolle** : Die Buchhalterin möchte die **Kontrolle über alle finanziellen**
**Vorgänge** behalten. Ein Ziel ist daher, **Transparenz** über Projekte und Finanzen herzustellen. Sie
möchte jederzeit beantworten können: *„Wie ist der Stand bei Projekt X? Haben wir alle Abschläge*
*erhalten? Wie viel haben wir schon ausgegeben?“* Dafür muss das System ihr die nötige Übersicht
bieten. Das Ziel ist, dass *nichts* unbemerkt durchrutscht – kein offener Posten bleibt liegen, kein
Kostenlimit wird überschritten, ohne dass sie es sieht. Dieser 360°-Überblick soll sie auch in die Lage
versetzen, die Geschäftsführung früh zu warnen, falls etwas aus dem Ruder läuft (z. B. massiv
überschrittenes Budget, drohende Liquiditätsengpässe). Die Buchhaltung will als **verlässliche**
**Informationsquelle** gelten – das System muss ihre Datenbasis dafür sein.


**Verbesserte bereichsübergreifende Zusammenarbeit** : Ein weiches, aber wichtiges Ziel: Die
Buchhalterin möchte, dass die Zusammenarbeit mit Vertrieb, Innendienst & Co. harmonischer und
effektiver wird. Bisher war sie oft der „Mahner“, der hinter Infos her sein muss. Mit dem System als
gemeinsamer Plattform soll sich die Kommunikation **versachlichen** . Idealerweise sind alle im selben
Tool und sehen Teilaspekte der Arbeit der anderen – so versteht der Vertrieb vielleicht besser, warum
Buchhaltung bestimmte Daten braucht (weil es im System als Pflichtfeld auftaucht). Die Buchhalterin
hofft, dass durch das integrierte System ein **Teamgefühl** entsteht: jeder trägt seinen Part bei, und
das gemeinsame Ziel ist erfolgreiche Projekte und zufriedene Kunden **und** ein stimmiges
Zahlenwerk. Ihr persönliches Ziel ist es also auch, **Wertschätzung** für die finanzielle Disziplin zu
fördern. Wenn durch das Tool z. B. sichtbar wird, wie Provisionen und Umsätze zusammenhängen,
sehen andere Abteilungen auch den Mehrwert der Buchhaltungsarbeit.


**Qualität der Kundenbeziehung aus Finanzsicht** : Auch wenn sie keinen direkten Kundenkontakt
hat, beeinflusst die Buchhaltung die Kundenzufriedenheit (Stichwort: korrekte Rechnungen, schnelle
Klärung bei Unstimmigkeiten, keine Fehler). Ein Ziel ist daher, dass **Rechnungen fehlerfrei und**
**verständlich** beim Kunden ankommen – das System soll z. B. klare Rechnungsdokumente erzeugen,
um Rückfragen zu minimieren. Sollte ein Kunde doch mal eine Unklarheit haben („Welche Rate ist
offen?“), will die Buchhalterin das sofort beantworten können. Ein Nebenziel ist also, dass das
Unternehmen durch professionelle Abwicklung
**vertrauenswürdig**
auf Kunden wirkt.
Zahlungsprozesse sollen so glatt laufen, dass Kunden pünktlich zahlen und sich fair behandelt
fühlen (kein zu frühes Mahnen etwa).


**Persönliche Entlastung und Weiterentwicklung** : Auf Persona-Ebene darf man auch anführen,
dass die Buchhalterin ein Interesse hat, **Stress zu reduzieren** (z. B. zum Monatsende) und modernen
Arbeitsweisen zu folgen. Sie möchte nicht in Papierkram ersticken, sondern mit einem zeitgemäßen
Tool arbeiten, das ihr Routinejobs abnimmt. Ihr Ziel ist es, in der Organisation als **kompetente**
**Ansprechpartnerin** für alle finanznahen Fragen zu gelten, nicht bloß als „Verwalterin“. Durch das
System hat sie die Chance, mehr **analytische Aufgaben** zu übernehmen (Auswertungen fahren,
Verbesserungspotential entdecken), was beruflich erfüllender sein kann als Formulare abzutippen.
Erfolg in diesem Sinne wäre, dass sie sich stärker in strategische Entscheidungen einbringen kann,


z. B. bei der Beurteilung von Kundenprojekten oder Investitionen, weil sie dank System die
Zahlenlage jederzeit parat hat.

Zusammengefasst drehen sich die Rollenziele um das Motto **„Zahlen im Griff“** : Die Buchhaltung will dafür
sorgen, dass das Unternehmen finanziell gesund bleibt und dass ihre Arbeit effizient, präzise und
wertschöpfend ist. Das integrierte CRM/PM-System ist dafür ein Werkzeug, mit dem diese Ziele besser
erreicht werden können. Eine erfolgreiche Umsetzung würde bedeuten, dass am Ende **alle Rechnungen**
**stimmen, alle Zahlungen kommen und alle im Team die finanziellen Auswirkungen ihres Handelns**
**verstehen** – ein ambitioniertes, aber erreichbares Zielbild.

# Qualitätskriterien aus Sicht der Buchhaltung

Abschließend lassen sich zentrale **Qualitätskriterien** formulieren, die das integrierte System aus

Buchhaltungssicht erfüllen muss. Diese bestimmen, ob die Buchhalterin das Tool als Erfolg wahrnimmt:

**Datenvollständigkeit und -konsistenz** : Das System muss gewährleisten, dass *alle* für die
Buchhaltung relevanten Informationen vollständig und konsistent vorliegen. Beispielsweise sollten
im Kundenprofil **sämtliche zugehörigen Projekte und Rechnungen** aufgelistet sein. Es darf keinen
Fall geben, wo ein Projekt im PM-Modul existiert, aber keine Faktura im Finanzmodul – solche Brüche
wären Qualitätsmängel. Konsistenz bedeutet auch: Änderungen in einem Modul (z. B. Adresse im
CRM) spiegeln sich überall korrekt wider (Rechnungsempfänger). Die Buchhaltung misst die Qualität
daran, wie selten sie noch „hinterherrennen“ muss, um fehlende Infos zu bekommen. Ziel ist eine
**Single Source of Truth** , insbesondere für Geldflüsse.


**Genauigkeit und Fehlerfreiheit** : Finanzzahlen müssen zu 100% stimmen. Das schließt
Rechenoperationen (Summen, Steuern) ebenso ein wie die richtige Zuordnung von Buchungen. Das
Tool sollte gängige Fehlerquellen eliminieren – z. B. durch **automatische Berechnung von MwSt,**
**Rabatten und Summen**
, sodass Tippfehler vermieden werden. Auch die Übernahme von
Angeboten in Rechnungen ohne Copy-Paste reduziert Fehler. Ein Qualitätsindikator ist hier:
**Fehlerfreiheit der Ausgaben** (keine falschen Rechnungen mehr, keine doppelten/fehlenden
Rechnungsnummern, etc.). Die Buchhalterin wird sehr darauf achten, dass das System rigoros
validiert (z. B. kein Speichern einer Rechnung ohne Betrag oder Datum) und damit
Qualitätsprüfungen, die sie sonst manuell machte, integriert.

# Nachvollziehbarkeit (Transparenz) : Jeder Vorgang muss im System nachvollziehbar sein. Qualität


**Zeitnahe Aktualität** : Ein qualitativ hochwertiges System arbeitet **in Echtzeit oder nah dran** . Das
heißt, sobald z. B. ein Zahlungseingang vom Bankkonto vorliegt, sollte dieser im System zeitnah
sichtbar sein. Oder wenn der Vertrieb ein Projektstatus ändert, sollten alle Folgevorgänge (Tasks,


Auswertungen) sofort aktualisiert sein. Die Buchhaltung bewertet positiv, wenn sie **jederzeit**
**aktuelle Zahlen** abrufen kann, ohne erst Daten aus dem Vortag konsolidieren zu müssen. Latenzen
(z. B. wöchentliche Datenupdates) wären schlechter Qualität. Insbesondere für Liquiditäts- und
Umsatzübersichten ist *Echtzeit-Qualität* ein Vorteil – man stelle sich ein Dashboard vor, das am 31.
des Monats um 18:00 bereits den Umsatz des Monats zeigt, weil alle bis dahin erstellten
Rechnungen drin sind. Das ist der Anspruch.

**Benutzerakzeptanz & Ergonomie** : Ein System ist qualitativ nur so gut, wie es von den Nutzern
angenommen wird. Für die Buchhalterin heißt das: Das Tool muss *ihr* Arbeit erleichtern, aber auch
die Kollegen müssen ihre Aufgaben darin erledigen, damit sie davon profitiert. Qualitätskriterium ist
also auch, dass **andere Abteilungen das System mittragen** . Wenn z. B. der Vertrieb widerwillig das
CRM füllt, hat die Buchhaltung wieder unvollständige Infos. Daher zählt als Erfolg, wenn die Nutzer
insgesamt die Plattform als hilfreich empfinden – was auf gutes UX-Design und Performance
zurückzuführen ist. Aus Buchhaltungssicht besonders wichtig: **Klare, übersichtliche Darstellungen**
von Zahlen (keine kryptischen Kürzel, sondern z.B. „offen 30 Tage“ statt Status „OP/30“) und ein
**fehlertolerantes Design** (Warnungen, bevor etwas Kritisches passiert). Eine hohe Akzeptanz zeigt
sich z.B. daran, dass die Mitarbeiter ihre Zeiten konsequent eintragen, Belege hochladen etc., weil
das System es ihnen einfach macht. Das wiederum stellt die Buchhaltung zufrieden, denn es
garantiert ihr vollständige Daten.


**Schnelligkeit und Performance** : Gerade Massenoperationen (z. B. 100 Rechnungen auf einmal
erzeugen, oder ein Report über 1000 Projekte) müssen flott laufen. Qualität heißt hier, die
Buchhalterin muss **nicht warten oder Workarounds nutzen** , weil das System langsam ist. Wenn
Abfragen zu lange dauern, tendieren Nutzer dazu, Daten extern zu ziehen (Excel-Exporte etc.), was
wieder Silos schafft. Deshalb ist eine **performante Architektur** essentiell. Indikator: Das System
sollte bei Standardaktionen (eine Buchung anlegen, eine Liste filtern) in Sekundenbruchteilen
reagieren, und auch komplexe Auswertungen in annehmbarer Zeit liefern (< einige Sekunden bis
wenige Minuten für sehr große Jobs).


**Flexibilität und Anpassbarkeit** : Die Buchhaltung schätzt, wenn das System **an ihre Prozesse**
**anpassbar** ist, statt umgekehrt. Das bedeutet, es sollen z. B. **benutzerdefinierte Felder** oder
**Regeln** definiert werden können, ohne Programmierung. Ein Qualitätskriterium ist, dass das Tool
auch Sonderfälle abbilden kann: z. B. mal eine **Gutschrift** oder **Storno** einfach durchzuführen, ohne
Dateninkonsistenz, oder abweichende Zahlungsziele je Kunde einstellbar. Je weniger „geht nicht“ sie
vom System hört, desto besser. Besonders im Finanzbereich gibt es oft Ausnahmen (z. B. Kunde darf
in zwei Teilbeträgen zahlen statt üblich drei, oder Projekt hat Sonderbudget, das intern nicht
berechnet wird etc.). Ein starres System würde hier Punkte kosten. Flexibilität zeigt sich auch in der
**Skalierbarkeit** – falls das Unternehmen wächst (mehr Projekte, internationale Kunden), sollte die
Software nicht ersetzt werden müssen, sondern mitwachsen (z.B. Fremdwährungen aktivierbar,
weitere Benutzerrollen ergänzbar). Für die Buchhalterin bedeutet das Zukunftssicherheit und Schutz
der Investition in das System.


**Support und Zuverlässigkeit des Anbieters** : Aus Nutzersicht gehört zur Qualität auch, dass bei
Problemen schnelle Hilfe kommt. Wenn z. B. ein technisches Problem auftritt (Rechnungslayout
kaputt, Export geht nicht), muss der Anbieter (oder IT) rasch reagieren, da finanzkritische Prozesse
dran hängen. Die Buchhalterin braucht im Zweifel einen **Ansprechpartner** , der ihr hilft, damit sie
ihre Deadlines einhalten kann. Ein qualitativ hochwertiges Produkt zeichnet sich daher durch **guten**


**Support** und regelmäßige Updates aus. Zwar nicht direkt eine Softwareeigenschaft, fließt dies aber
in die Gesamtbeurteilung der Lösung durch die Buchhaltung mit ein.

Wenn all diese Qualitätskriterien erfüllt sind, resultiert das in greifbaren Vorteilen: **weniger Fehler, weniger**
**Verzögerungen, mehr Transparenz und Vertrauen** in die Zahlen. Die Buchhaltung hätte mit dem neuen
System ein Werkzeug, das ihren Arbeitsstandard hebt und als Rückgrat der integrierten CRM- und PM-
Lösung dient.

# Ergänzende tabellarische Übersicht der Kernerkenntnisse

**Aspekt**
**Kernerkenntnisse für die Persona "Buchhaltung"**

Finanz-/Rechnungswesen in mittelständischer Projektfirma; verantwortlich für

**Rollenprofil &**
**Kontext**

komplette Buchführung und Projektfinanzen. Arbeitet bisher mit separater FiBu-
Software (z. B. Lexware) und manuellen Prozessen. Rolle als Bindeglied zwischen
Projekten und Geschäftsführung.

*Rechnungsstellung:* Erstellen von Anzahlungs-, Abschlags- und
Schlussrechnungen für Projekte, fristgerechte Fakturierung gemäß Projektplan
.<br> *Zahlungsüberwachung:* Prüfen von Zahlungseingängen, Verbuchen
offener Posten, Einleiten von Mahnungen bei Verzug
.<br> *Kostenkontrolle:* Erfassen von Eingangsrechnungen und Ausgaben pro
Projekt (Material, Dienstleistungen), Zuordnung zu Projekten für Soll-Ist-
Vergleiche
.<br> *Provisionen:* Berechnen/Überprüfen von
Vertriebsprovisionen basierend auf Auftragsquellen (Nachweis aus CRM)
.<br> *Reporting:* Erstellen von Auswertungen (Umsatz, Projektmargen, offene
Posten) für Management; Monats-/Jahresabschluss vorbereiten.<br> *Lohn &*
*Steuern:* (Außerhalb CRM) Lohnabrechnung und Steuerdeklaration durchführen,
aber relevante Daten (Zeiten, Reisekosten) aus dem System entnehmen.

# Hauptaufgaben

# Manuelle Prozesse: Viele Abläufe per Zuruf/Excel, Risiko vergessener Rechnungen

# Pain Points

# 17

**Aspekt**
**Kernerkenntnisse für die Persona "Buchhaltung"**

*Rechnungsmodul:* Teilrechnungen/Abschlagszahlungen nach Plan automatisch
anstoßen; Rechnung aus Angebot/Projekt per Klick generieren (kein
Doppelinput)
; fortlaufende Nummern, MwSt-Berechnung
automatisch.<br> *Zahlungsmanagement:* Anzeige offener Posten;
Bankintegration oder Import für Zahlausgleich; **automatische**
**Zahlungserinnerungen und Mahnungen** mit individuell einstellbaren
Mahnstufen
.<br> *Projektkosten-Tracking:* Ausgaben/Belege uploaden und
Projekten zuordnen; Echtzeit-Budget vs. Ist-Kosten Übersicht;
Projektdeckungsbeiträge berechnen.<br> *Provisionserfassung:* Feld für
Akquisequelle/Verkäufer je Auftrag; automatische Provisionsberechnung oder
Berichtsfunktion für Bonusabrechnung
.<br> *Zeiterfassung:* Integration oder
Schnittstelle zu Timecard; Projektarbeitszeiten sammeln, Kosten bewerten;
Export für Lohnbuchhaltung.<br> *Reporting:* Dashboards und Berichte (Umsatz,
offene Forderungen, Profitabilität je Projekt/Kunde) per Knopfdruck; Filter und
Drill-down bis Belegebene.<br> *FiBu-Schnittstelle:* Export von Buchungsdaten
(Debitoren/Kreditoren) ins Finanzsystem (z. B. DATEV-Format) zur
Weiterverarbeitung in Lexware; Vermeidung doppelter
Dateneingabe.<br> *Dokumentenmanagement:* Zentralablage aller Rechnungen,
Angebote, Belege an Kunden- oder Projektakte; GoBD-konforme Archivierung
(Änderungsprotokoll, 10-Jahres-Aufbewahrung)
.<br> *Berechtigungen:*
Rollenbasierter Zugriff, Finanzdaten nur für Berechtigte (Buchhaltung/GF) voll
sichtbar; Freigabeprozesse (z. B. für große Ausgaben oder Gutschriften)
integrierbar.

# Funktionale

# Zuverlässigkeit: Stabile Performance, keine Datenverluste; finanzkritische

**Nicht-funktionale**
**Anforderungen**


**Aspekt**
**Kernerkenntnisse für die Persona "Buchhaltung"**

*Vertrieb (Außendienst):* Übergibt Auftragsdetails (Zahlungsplan, Konditionen) an
Buchhaltung; erhält von Buchhaltung Infos zu Zahlungseingängen und
Kundenzahlungsverhalten
. System: gemeinsamer Kunden-/
Projektdatensatz, Status- und Hinweisfunktionen (z. B. Zahlungsverzug
Ampel).<br> *Innendienst/PM:* Koordiniert mit Buchhaltung die
Lieferantenaufträge und Kosten; meldet Projektfortschritt für Faktura; System:
Bestellungen/Lieferantenrechnungen im Projekt verknüpft, automatische Tasks
„Rechnung stellen“ bei Meilensteinen.<br> *Geschäftsführung:* Empfängt Berichte/
KPI von Buchhaltung; gibt Ziele vor (Cashflow, Budgeteinhaltung). System:
Management-Dashboard mit Finanzkennzahlen, Auswertungen aufbereitbar für
GF-Entscheidungen
.<br> *Marketing:* Indirekte Schnittstelle – Nutzung von
Umsatzdaten für Kampagnenerfolg; Buchhaltung stellt Segmente/
Umsatzstatistiken bereit (z. B. Umsatz nach Kundengruppe). System: Tags für
Kundenakquisewege, Filter für Umsatz je Kampagne
.<br> *Steuerberater/WP:*
Externe Partner, erhalten Daten (Export) aus System für Abschlüsse/Prüfungen;
Buchhaltung sorgt für vollständige Übergabe (kein direkter Zugriff, aber
Schnittstelle via FiBu-Software).

# Schnittstellen

# Liquidität & Umsatzrealisierung: Sicherstellen, dass alle erbrachten Leistungen

**Rollenziele**


**Aspekt**
**Kernerkenntnisse für die Persona "Buchhaltung"**

*Datenqualität:* Vollständige, konsistente Daten ohne manuelle Lücken; korrekte
Berechnungen (MwSt, Summen) und valide Daten (keine Buchung ohne Projekt
etc.)
.<br> *Transparenz & Nachvollziehbarkeit:* Alle Vorgänge (Rechnungen,
Zahlungen, Änderungen) sind lückenlos dokumentiert und für Berechtigte
einsehbar; Historienspeicher für Änderungen gewährleistet
Revisionssicherheit.<br> *Aktualität:* Daten werden in Echtzeit oder sehr zeitnah
aktualisiert – Berichte und Übersichten zeigen den echten aktuellen Stand, keine
veralteten Zahlen.<br> *Usability & Akzeptanz:* Hohe Benutzerfreundlichkeit führt
dazu, dass alle Abteilungen das System korrekt pflegen (z. B. Vertrieb pflegt
Aufträge vollständig ein), was der Buchhaltung zugutekommt. Intuitive
Oberfläche reduziert Fehlerbedienung.<br> *Performance:* Schnelle Abfragen und
Verarbeitung, auch bei großem Datenvolumen (tausende Datensätze); keine
Wartezeiten, die zu Workarounds verleiten.<br> *Flexibilität:* System kann
Sonderfälle abbilden (abweichende Zahlungsbedingungen, Stornos, Währungen
bei Bedarf); anpassbar an zukünftige Anforderungen, wächst mit dem
Unternehmen.<br> *Support & Zuverlässigkeit:* Technische Stabilität, schnelle
Fehlerbehebung und regelmäßige Updates vom Anbieter sichern langfristig
reibungslose Nutzung; Buchhaltung kann sich darauf verlassen, dass das
Werkzeug funktioniert, wenn es gebraucht wird (keine Ausfälle am Stichtag).

# Qualitätskriterien

# Quellen

Interview (Transkript) vom 31.10.2025 – **Integriertes CRM/PM Tool – Anforderungsanalyse**
**Vertrieb/Buchhaltung** (interne Quelle)
Fido Bürosysteme – *Unser Team: Buchhaltung/Personal* (Unternehmenswebseite) –
Aufgabenbeschreibung Buchhaltung
OrgaMAX Produktwebsite – *Rechnungen online schreiben – schnell, fehlerfrei & einfach* (Funktionen für
Teilzahlungen & Mahnwesen) – orgamax.de
Haufe X360 Blog – *Projektbuchhaltung: Vermeiden Sie diese fünf Fehler* (06.11.2024) – haufe-x360.de

# StepStone Karriereblog – Berufsbild Buchhalter (29.04.2025) – stepstone.de

- 24
Über fido

## https://www.fido-buerosysteme.de/ueber-fido

# sg_interview_31.10.25_deu.txt

## file://file-X2N7Fg6zoo5PYBYJFQ9SaR

### Rechnungen online schreiben – schnell, fehlerfrei & einfach

## https://www.orgamax.de/orgamax-buchhaltung/funktionen/rechnung-online/

### Buchhalter – Aufgaben, Ausbildung, Gehalt - StepStone

## https://www.stepstone.de/magazin/berufe/berufsbild-buchhalter

### 20


---

*Page 21*

---

Projektbuchhaltung: Digitalisieren und Effizienz steigern

## https://www.haufe-x360.de/blog/projektbuchhaltung-digitalisieren

---

# Erweiterungen 2025: Financial Intelligence & Predictive Cash Management

Die folgenden Funktionen erweitern die Finanzwerkzeuge der Buchhaltung um **vorausschauende Liquiditätsplanung, BI-Dashboards und KI-gestützte Analyse** für proaktives Finanzmanagement.

## 💰 Finanzprognosen & Liquiditätssteuerung

### Cash Flow Forecasting & Working Capital Management

Die Buchhaltung benötigt **präzise Liquiditätsprognosen** um Zahlungsfähigkeit sicherzustellen und finanzielle Risiken frühzeitig zu erkennen.

**Kernanforderungen:**

**Rolling 6-Month Cash Flow Forecast:**
- **Erwartete Zahlungseingänge**[^1]:
  - **Invoice Aging Analysis**: Offene Rechnungen kategorisiert nach Fälligkeit
    - Fällig diese Woche: €42.000 (12 Rechnungen)
    - Fällig nächste Woche: €28.500 (8 Rechnungen)
    - Überfällig 1-30 Tage: €18.200 (Warnung: 5 Kunden)
    - Überfällig >30 Tage: €12.800 (Kritisch: 3 Kunden)
  - **ML-basierte Zahlungswahrscheinlichkeit**[^2]:
    - Kunde A: Zahlt zu 95% pünktlich (Historie: 12/12 Zahlungen on-time)
    - Kunde B: Zahlt zu 70% mit 5-10 Tagen Verzögerung (Historie: 8/12 verzögert)
    - Kunde C: Risiko! Zahlt zu 40% >30 Tage verspätet (Historie: 5/12 stark verzögert)
  - **Payment Pattern Recognition**: System lernt Zahlungsverhalten pro Kunde
    - "Kunde X zahlt typischerweise dienstags nach Monatsende → Erwartung: 3. Februar"

**Geplante Ausgaben & Forecasting:**
- **Recurring Expenses**: Gehälter (€85K/Monat), Miete (€12K), Versicherungen (€3K)
- **Project Costs**: Material-Bestellungen für laufende Projekte
  - Projekt A: €25K fällig KW 15 (Lieferant X)
  - Projekt B: €18K fällig KW 17 (Lieferant Y)
- **Variable Costs**: Subunternehmer, Sondermaterialien (geschätzt aus Projektplänen)
- **One-Time Expenses**: Investitionen, Sonderausgaben

**Liquiditätskurve-Visualisierung:**
```
€ Kontostand
100K ┤     ╭─╮
 80K ┤   ╭╯ ╰╮╭──╮
 60K ┤ ╭╯    ╰╯  ╰╮
 40K ┤─╯──────────╰─── Minimum-Schwelle €50K
 20K ┤  KRITISCH!
  0K └─────────────────────────
     Jan Feb Mär Apr Mai Jun
```
- **Kritische Schwellenwerte**:
  - Warnung bei <€60K (gelb): "Liquiditätspuffer schwindet"
  - Kritisch bei <€50K (orange): "Gefahr Zahlungsunfähigkeit – Maßnahmen prüfen"
  - Alert bei <€40K (rot): "DRINGEND: Liquiditätsengpass! GF informieren, Kredit aktivieren?"

**Szenario-Analysen:**
- **What-If-Simulationen**[^3]:
  - "Was passiert wenn Kunde X Zahlung um 4 Wochen verzögert?" → Liquidität sinkt auf €38K (unter Kritisch-Schwelle)
  - "Was passiert wenn wir Projekt Y um 2 Wochen vorziehen?" → Materialkos

ten früher fällig, Liquidität -€18K
  - "Best Case (alle pünktlich)": Liquidität bleibt bei ~€85K
  - "Worst Case (3 große Zahlungen verzögert)": Liquidität fällt auf €32K (Kreditlinie aktivieren!)

**Technische Umsetzung**:
- **Invoice Aging**: Automatische Kategorisierung basierend auf Fälligkeitsdaten[^1]
- **Payment Prediction ML**: Random Forest Modell trainiert auf historischen Zahlungsdaten[^2]
- **Monte Carlo Simulation**: Konfidenzintervalle für Liquiditätsprognosen[^3]

[^1]: Quelle: Research "Cash Flow Prediction" – Invoice Aging & Payment Pattern Analysis
[^2]: Quelle: Research "ML Models" – Payment Probability Prediction via Random Forest
[^3]: Quelle: Research "Forecasting Methods" – Monte Carlo für Financial Scenarios

**DSO (Days Sales Outstanding) Tracking:**
- **KPI**: Durchschnittliche Zeit von Rechnung bis Zahlung
  - Aktuell: 28 Tage (Ziel: <25 Tage)
  - Trend: +3 Tage vs. Vorquartal (Warnung: Kunden zahlen langsamer!)
- **Per-Customer DSO**: Ranking der langsamsten Zahler
  - Kunde C: Ø 45 Tage (rote Flagge, Mahnung intensivieren)
  - Kunde A: Ø 18 Tage (grün, verlässlicher Zahler)
- **Impact-Berechnung**: "Wenn alle Kunden wie Kunde A zahlen würden: +€35K durchschnittliche Liquidität"

**Debitorenrisiko-Scoring:**
- **Risiko-Klassifikation** pro Kunde[^4]:
  - **Grün (Low Risk)**: Pünktlicher Zahler, stabiler Historie, gute Bonität
  - **Gelb (Medium Risk)**: Gelegentliche Verzögerungen, aber zahlt letztlich
  - **Rot (High Risk)**: Häufige Verzögerungen, mehrere Mahnungen, Bonität unklar
- **Auto-Actions**:
  - High-Risk-Kunde → Automatisch Vorauskasse verlangen bei neuem Projekt
  - Medium-Risk-Kunde → Intensivere Zahlungs-Erinnerungen
- **External Credit Check Integration**: API zu Creditreform/Schufa für Bonitätsprüfung[^5]
  - Warnung: "Kunde X Bonität gesunken von A auf C → Vorsicht bei neuem Projekt!"

[^4]: Quelle: Research "Forecasting Methods" – Customer Credit Risk Scoring
[^5]: Quelle: Research "BI Solutions" – External Data Integration für Credit Scoring

## 📊 BI-Dashboards & Finanz-KPIs

### Interactive Financial Dashboards

Die Buchhaltung erhält **Echtzeit-Einblicke** in Finanzkennzahlen über intuitive, interaktive Dashboards[^6].

**Dashboard-Struktur:**

**Top-Level Financial KPIs (Always Visible):**
- **Aktuelle Liquidität**: €87.000 (grün, Puffer: €37K über Minimum)
- **Offene Forderungen**: €102.500 (18 Rechnungen, davon 5 überfällig)
- **Überfällige Zahlungen**: €30.800 (rot, >€25K Schwelle)
- **DSO (Days Sales Outstanding)**: 28 Tage (gelb, Ziel: <25)
- **Umsatz MTD/QTD/YTD**: €145K / €420K / €1,85M (↗ +12% YoY)

**Forderungsmanagement-Dashboard:**
- **Aging Breakdown** (Kuchendiagramm):
  - Fällig 0-7 Tage: €42K (41%)
  - Fällig 8-30 Tage: €40K (39%)
  - Überfällig 1-30 Tage: €18K (18%)
  - Überfällig >30 Tage: €12K (12%, kritisch!)
- **Top 5 Überfällige Kunden** (Liste):
  - Kunde C: €8.500 (42 Tage überfällig) 🔴 Mahnstufe 2
  - Kunde F: €6.200 (35 Tage überfällig) 🔴 Mahnstufe 1
  - Kunde H: €4.800 (22 Tage überfällig) 🟡 Zahlungserinnerung
- **Quick Actions**: "Mahnung generieren", "Außendienst informieren", "Zahlungsplan anbieten"

**Drill-Down-Funktionalität:**
```
Offene Forderungen €102,5K
  └─> Nach Kunde:
       ├─ Kunde A: €22K (on-time)
       ├─ Kunde C: €18K (3 Rechnungen überfällig)
       └─> Kunde C Details:
            ├─ Rechnung R-2024-0123: €8.500 (42 Tage überfällig)
            ├─ Rechnung R-2024-0156: €6.200 (12 Tage überfällig)
            └─> Rechnung R-2024-0123:
                 ├─ Status: Mahnstufe 2 versendet (12.01.2025)
                 ├─ Historie: Zahlungserinnerung (02.01), Mahnung 1 (08.01)
                 ├─ Next Action: Mahnstufe 3 oder Inkasso (ab 15.01)
```

**Projekt-Finanzen-Overview:**
- **Projektmargen-Übersicht**:
  - Projekt A: €85K Umsatz, €52K Kosten → 38,8% Marge (grün)
  - Projekt B: €120K Umsatz, €105K Kosten → 12,5% Marge (gelb, unter Ziel)
  - Projekt C: Budget-Überschreitung! €48K Kosten bei €40K Budget (rot)
- **Budget vs. Actual**: Vergleich geplante vs. tatsächliche Kosten
- **Revenue Recognition**: Umsatzrealisierung nach Projektfortschritt (Percentage of Completion)[^7]
  - Projekt A: 85% fertig → €72K von €85K Umsatz realisiert
- **Unbilled Revenue**: Geleistete Arbeit noch nicht in Rechnung gestellt
  - Projekt D: €15K Leistung erbracht, aber noch nicht abgerechnet → "Rechnung erstellen empfohlen"

[^6]: Quelle: Research "BI Solutions" – Metabase/Grafana für Financial Dashboards
[^7]: Quelle: Research "BI Solutions" – Revenue Recognition via Percentage of Completion

**Umsatz- & Rentabilitäts-Analyse:**
- **Revenue-Breakdown** (nach Branche, Produkt, Verkäufer):
  - Branche: Hofläden €180K (56%), Vinotheken €85K (27%), Floristen €55K (17%)
  - Produkt: Regalsysteme €140K, Kühltheken €95K, Beleuchtung €85K
  - Verkäufer: Markus M. €140K, Julia S. €110K, Peter K. €90K
- **Margin-Trends**: Durchschnittliche Marge pro Quartal
  - Q1 2025: 27,5% (leicht unter Ziel 30%)
  - Q4 2024: 29,2% (nahe Ziel)
  - **Ursachen-Analyse**: "Materialkosten +15% YoY → Margen-Druck"
- **Profit & Loss (P&L) Summary**: Echtzeit-GuV-Übersicht
  - Umsatz: €145K (MTD)
  - Kosten: €105K (Material: €65K, Personal: €30K, Overhead: €10K)
  - EBITDA: €40K (27,6% Marge)

**Payment Compliance Dashboard:**
- **On-Time-Payment-Rate**: 78% (Ziel: >85%)
  - Trend: -5% vs. Vormonat (Warnung: Zahlungsmoral sinkt!)
- **Mahnquote**: 12% aller Rechnungen erhalten Mahnung (Ziel: <8%)
- **Inkasso-Rate**: 2% eskalieren zu Inkasso (Ziel: <1%)
- **Benchmark**: Vergleich mit Branchen-Durchschnitt (via externe Daten)[^8]
  - Ihre On-Time-Rate 78% vs. Branchen-Ø 82% → Leicht unterdurchschnittlich

[^8]: Quelle: Research "BI Solutions" – Industry Benchmark Integration

**Export & Reporting:**
- **One-Click-Excel-Export**: Alle Dashboards exportierbar für Steuerberater, GF
- **Scheduled Reports**: Automatischer E-Mail-Versand
  - Montagmorgen 8 Uhr: Wochen-Finanzübersicht
  - Monatsende: Komplette P&L + Liquiditätsbericht
- **GoBD-konforme Archivierung**: Alle Reports versioniert & immutable gespeichert

**Real-Time-Updates:**
- **Change Data Capture (CDC)**: Neue Zahlungen/Rechnungen triggern sofort Dashboard-Update[^9]
- **WebSocket-Push**: Buchhaltung sieht neue Zahlungseingänge innerhalb <5 Sekunden
- **Live-Indikator**: "● Live" oben rechts zeigt Echtzeit-Daten

[^9]: Quelle: Research "Real-Time Dashboards" – CDC & WebSocket für Live-Updates

## 🚨 Frühwarnsysteme & Automated Alerts

### Proactive Financial Risk Detection

Automatisierte **Frühwarnindikatoren** erkennen finanzielle Risiken, bevor sie kritisch werden[^10].

**Liquiditäts-Alerts:**

**Stufe 1 (Gelb – Warnung):**
- Trigger: Liquidität fällt unter €60K
- Alert: "⚠️ Liquiditätspuffer schwindet: €58K (Ziel: >€60K) – Empfehlung: Offene Forderungen intensiv verfolgen"
- Actions: Auto-Eskalation von Zahlungserinnerungen, Mahnstufe beschleunigen

**Stufe 2 (Orange – Kritisch):**
- Trigger: Liquidität fällt unter €50K
- Alert: "🔴 KRITISCH: Liquidität bei €48K – Zahlungsfähigkeit gefährdet! GF informiert."
- Actions: Automatische Benachrichtigung an GF, Empfehlung Kreditlinie aktivieren

**Stufe 3 (Rot – Notfall):**
- Trigger: Liquidität fällt unter €40K
- Alert: "🚨 NOTFALL: Liquidität €38K – Sofortmaßnahmen erforderlich!"
- Actions: Notfall-Meeting mit GF, Zahlungsstopp für nicht-kritische Ausgaben, Kreditgespräch

**Zahlungsverzugs-Alerts:**

**Überfällige Rechnungen:**
- **Tag 1**: System markiert Rechnung als "überfällig" (keine Aktion noch)
- **Tag 3**: Auto-Benachrichtigung an Buchhaltung: "Kunde X Rechnung €8.500 3 Tage überfällig"
- **Tag 7**: System schlägt vor: "Freundliche Zahlungserinnerung versenden?"
- **Tag 14**: **Mahnstufe 1**: Automatische Mahnung generiert (nach Review durch Buchhaltung)
- **Tag 30**: **Mahnstufe 2**: Dringendere Mahnung + Androhung Mahngebühren
- **Tag 45**: **Eskalation**: Vorschlag Inkasso-Einleitung oder rechtliche Schritte

**Kundenspezifische Alerts:**
- **High-Risk-Kunden**: Wenn Kunde mit Historie von Zahlungsverzug neue Rechnung erhält
  - "⚠️ Kunde C hat neue Rechnung €12K erhalten – Historie: Ø 45 Tage Zahlungsverzug. Empfehlung: Intensivere Überwachung"
- **Credit Limit Warnings**: Wenn Kunde Kreditlimit überschreitet
  - "🔴 Kunde X: Offene Forderungen €35K, Kreditlimit €30K (+16%) → Keine neuen Projekte ohne Vorauskasse!"

**Budget-Überschreitungs-Warnings:**

**Projekt-Ebene:**
- **80% Budget verbraucht**: "🟡 Projekt B: €32K von €40K Budget (80%), aber erst 60% fertig → Warnung: Überschreitung wahrscheinlich"
- **90% Budget verbraucht**: "🔴 Projekt C: €36K von €40K Budget (90%) → Hochrechnung: €44K Endkosten (-10% Überschreitung)"
- **Budget überschritten**: "🚨 KRITISCH: Projekt D: Budget um €8K überschritten (20%) → GF-Freigabe & Kunden-Nachverhandlung erforderlich"

**Aggregierte Alerts:**
- "⚠️ Portfolio-Warnung: 3 von 8 aktiven Projekten zeigen Budget-Überschreitungen → Gesamt-Impact: -€22K Marge"

**Compliance-Alerts:**

**GoBD-Verstöße:**
- "🔴 Rechnung R-2024-0089: Finalisiert vor 48h, aber noch nicht archiviert → GoBD-Verstoß!"
- "⚠️ 5 Rechnungen ohne immutableHash → GoBD-Konformität gefährdet"

**DSGVO-Verstöße:**
- "🔴 Kunde X: Löschantrag vor 25 Tagen gestellt, noch nicht bearbeitet (Frist: 30 Tage)"
- "⚠️ 12 Kunden mit abgelaufenem Marketing-Consent → Datenschutzprüfung erforderlich"

**Technische Umsetzung**:
- **n8n Monitoring Agents**: Stündliche Prüfung von Schwellenwerten[^10]
- **Rule Engine**: Drools oder ähnlich für komplexe Business Rules[^11]
- **Alert Delivery**: Slack/E-Mail/In-App/SMS (konfigurierbar)
- **Escalation Workflows**: Bei kritischen Alerts automatische Eskalation an GF

[^10]: Quelle: Research "n8n Automation" – Monitoring Agents für Financial Alerts
[^11]: Quelle: Research "n8n Automation" – Business Rules Engine Integration

**Trend-Based Anomaly Detection:**
- **ML-gestützte Anomalie-Erkennung**[^12]:
  - "Ungewöhnlich: Mahnquote in KW 14 plötzlich 22% (Ø: 12%) → Ursache untersuchen"
  - "Positiv: DSO gesunken von 28 auf 24 Tage in letztem Monat → Was lief besser?"
  - "Warnung: Materialkosten +25% in Q1 vs. Q4 → Lieferanten überprüfen"
- **Seasonal Patterns**: "Q4 historisch +15% Zahlungsverzug (Weihnachtsgeschäft) → Erwartung: DSO steigt"

[^12]: Quelle: Research "ML Models" – Time-Series Anomaly Detection für Financial Metrics

## 🤖 KI-gestützte Finanzanalyse

### AI-Powered Financial Intelligence

Künstliche Intelligenz unterstützt die Buchhaltung mit **automatisierten Analysen und Insights**[^13].

**RAG-basiertes Finanz-Q&A:**

**Natural Language Queries:**
- Buchhaltung fragt: **"Welche Kunden haben im letzten Jahr am häufigsten Mahnungen erhalten?"**
- **RAG-System** (LlamaIndex)[^14]:
  1. Vector Search findet relevante Rechnungs- & Mahnungs-Datensätze
  2. Aggregation & Ranking
  3. **LLM-Antwort**: "Im Jahr 2024 erhielten folgende Kunden die meisten Mahnungen:
     1. Kunde C: 8 Mahnungen (von 12 Rechnungen = 67%)
     2. Kunde F: 5 Mahnungen (von 8 Rechnungen = 63%)
     3. Kunde H: 4 Mahnungen (von 10 Rechnungen = 40%)
     **Empfehlung**: Bei Kunden C & F künftig Vorauskasse verlangen oder Kreditlimit reduzieren.
     **Quelle**: Rechnungs-Datenbank 2024 [Links zu CRM]"

**Weitere Beispiel-Queries:**
- "Warum ist unsere Liquidität in Q1 gesunken?" → KI analysiert Cashflow + liefert Ursachen
- "Welche Projekte hatten Budget-Überschreitungen >10%?" → Automatische Auswertung mit Begründungen
- "Zeige mir alle Zahlungen von Kunde X im letzten Jahr" → Liste + Statistiken
- "Wann sollte ich Mahnung für Rechnung R-2024-0123 versenden?" → Empfehlung basierend auf Kundenverhalten

**Quellenangaben & Verifikation:**
- **Immer mit Quellen**: Jede KI-Antwort referenziert Ursprungsdokumente (Rechnungs-IDs, Projekt-Nummern)
- **Confidence Scores**: "Diese Antwort basiert auf 24 Datenpunkten (Konfidenz: 94%)"
- **Explainability**: "So kam ich zur Antwort: [Reasoning-Trace]"

[^13]: Quelle: Research "RAG Architecture" – Conversational AI für Business Queries
[^14]: Quelle: Research "LlamaIndex" – Optimiert für Financial Data Retrieval

**Automated Invoice Matching:**

**PO-Invoice Matching (Kreditorenbuchhaltung)**:
- **Challenge**: Eingangsrechnungen mit Bestellungen abgleichen
- **KI-Lösung**[^15]:
  1. OCR extrahiert Daten aus Lieferanten-Rechnung (PDF/E-Mail)
  2. LLM matched Rechnungspositionen mit Bestellpositionen
  3. **Drei-Wege-Abgleich**: Bestellung ↔ Lieferung ↔ Rechnung
     - Bestellung: "50× Regalsystem Typ A, €2.500"
     - Lieferung: "50× geliefert am 12.01.2025"
     - Rechnung: "50× Regalsystem Typ A, €2.500" ✅ Match!
  4. Bei Diskrepanzen: Alert an Buchhaltung
     - "⚠️ Rechnung Lieferant X: Rechnet €2.800 statt €2.500 ab → Prüfung erforderlich"
- **Time Savings**: Manuelle Prüfung 15 Min/Rechnung → Automatisch <2 Min

**Expense Categorization:**
- **Auto-Categorization** von Ausgaben via LLM[^16]
  - "Rechnung 'HORNBACH Baustoffe' → Kategorie: Material"
  - "Rechnung 'Telekom Mobilfunk' → Kategorie: Kommunikation"
  - "Rechnung 'Schreinerei Müller GmbH' → Kategorie: Subunternehmer"
- **Learning from Feedback**: Buchhaltung korrigiert Fehler → System lernt

[^15]: Quelle: Research "LLM Integration" – Invoice-to-PO Matching via NLP
[^16]: Quelle: Research "RAG Architecture" – Semantic Classification für Expenses

**Predictive Collections Management:**

**Next-Best-Action-Empfehlungen**:
- System analysiert Kundenverhalten und schlägt optimale Collection-Strategie vor[^17]
  - Kunde A (pünktlicher Zahler): "Keine Aktion nötig, zahlt erfahrungsgemäß am 15. d.M."
  - Kunde B (gelegentliche Verzögerungen): "Freundliche Erinnerung am Tag 10 empfohlen (historisch effektiv)"
  - Kunde C (häufige Verzögerungen): "Sofortige Mahnung bei Überfälligkeit + Außendienst informieren"
- **Channel Optimization**: Welcher Kontaktweg ist am effektivsten?
  - Kunde X: E-Mail-Mahnung ignoriert (0% Response) → Empfehlung: Telefonischer Kontakt
  - Kunde Y: Reagiert gut auf SMS-Reminder (85% zahlt innerhalb 3 Tagen)

**Payment Propensity Scoring**:
- ML-Modell berechnet "Wird Kunde pünktlich zahlen?"[^18]
  - Kunde A: 95% Wahrscheinlichkeit pünktliche Zahlung (grün, low-touch)
  - Kunde C: 40% Wahrscheinlichkeit >30 Tage Verzug (rot, high-touch monitoring)
- **Feature Engineering**: Modell berücksichtigt
  - Historisches Zahlungsverhalten
  - Branche (Hofläden zahlen Ø schneller als Vinotheken?)
  - Auftragsgröße (kleine Aufträge schneller bezahlt?)
  - Saisonalität (Q4 längere Zahlungszeiten?)
  - Externe Bonitätsdaten

[^17]: Quelle: Research "ML Models" – Next-Best-Action for Collections
[^18]: Quelle: Research "ML Opportunity Scoring" – Payment Propensity via Random Forest

**Automated Report Generation:**

**Monthly Financial Summary**:
- **Trigger**: Jeden Monatsende (letzter Tag, 18 Uhr)
- **n8n Workflow** aggregiert Monatsdaten:
  - Umsatz, Kosten, Margen
  - Offene Forderungen, DSO, Mahnquote
  - Liquidität, Cashflow
  - Top 5 Kunden, Top 5 Projekte
- **LLM-generierte Zusammenfassung**[^19]:
  - "Januar 2025: Umsatz €145K (+8% vs. Dezember), Marge 27,5% (-2% vs. Ziel). Offene Forderungen €102K, DSO 28 Tage (leicht über Ziel). **Highlights**: 3 neue Projekte gewonnen. **Risiken**: Kunde C weiterhin säumig (€18K offen). **Empfehlung**: Mahnprozess intensivieren, Kreditlimit überprüfen."
- **Export**: PDF + Excel-Anhang via E-Mail an GF + Buchhaltung

**Tax Preparation Reports**:
- **Quartalsweise**: Automatische UStVA-Vorbereitung (Umsatzsteuer-Voranmeldung)
  - Alle steuerpflichtigen Umsätze aggregiert
  - Vorsteuer aus Eingangsrechnungen extrahiert
  - **One-Click-Export** für ELSTER oder Steuerberater

[^19]: Quelle: Research "n8n Automation" – Automated Report Generation via LLM

**DSGVO-Konformität & Security:**

**Datenschutz-Maßnahmen:**
- **On-Premise LLM Option**: Lokales Llama 70B für 100% datenschutzkonforme Analyse[^20]
- **Data Filtering**: Nur aggregierte, nicht-personenbezogene Daten an Cloud-LLMs
- **Audit Trails**: Jede KI-Query wird geloggt (Wer hat was gefragt? Welche Daten wurden abgerufen?)
- **Field-Level Encryption**: Sensitive Finanzdaten verschlüsselt at-rest & in-transit

**Explainability & Trust:**
- **Reasoning Traces**: Buchhaltung kann nachvollziehen wie KI zur Empfehlung kam
- **Human-in-the-Loop**: Bei kritischen Finanzentscheidungen (>€10K Forderung) → Buchhaltung muss manuell bestätigen
- **Hallucination Detection**: System warnt wenn Antwort-Konfidenz <75% ("Antwort unsicher, manuelle Prüfung empfohlen")

[^20]: Quelle: Research "DSGVO Compliance for LLMs" – On-Premise Hosting für Financial Data

**Benchmark & Best Practice Suggestions:**

**Industry Benchmarking:**
- **Externe Datenquellen**: Vergleich mit Branchen-KPIs (via Creditreform, Statista)[^21]
  - Ihre DSO: 28 Tage vs. Branchen-Ø: 32 Tage (gut, Sie sind schneller!)
  - Ihre Mahnquote: 12% vs. Branchen-Ø: 9% (Warnung: Überdurchschnittlich)
- **AI-generierte Insights**: "Ihre Mahnquote ist 33% höher als Branchendurchschnitt. Mögliche Ursachen: (1) Strengere Zahlungsbedingungen, (2) Kundenauswahl, (3) Ineffizientes Forderungsmanagement. Empfehlung: Zahlungsbedingungen überprüfen."

**Process Optimization Recommendations:**
- KI analysiert Finanz-Workflows und schlägt Verbesserungen vor:
  - "Auffällig: Rechnungen werden Ø 5 Tage nach Projektabschluss erstellt (Branchen-Best-Practice: <2 Tage). Empfehlung: Automatische Rechnungserstellung nach Meilenstein aktivieren."
  - "Ineffizienz erkannt: 40% der Mahnungen werden manuell erstellt. Empfehlung: Automatische Mahnstufen-Workflows aktivieren → Zeitersparnis 3h/Woche."

[^21]: Quelle: Research "BI Solutions" – Industry Benchmark Integration via APIs

---

# Phase 2: Observability & Automated Compliance Monitoring

**Relevant für:** Buchhaltung – Production-Ready Operations & GoBD/DSGVO-Sicherheit

## 📊 Grafana Stack Monitoring (Phase 1.5)

**Problem:** Keine Sichtbarkeit in Finanz-Prozess-Health → Probleme erst bei Steuerprüfung entdeckt.

**Lösung - Real-Time Compliance Dashboard:**
- **Metrics (Prometheus):** Rechnungs-Durchsatz, Mahnungen-Rate, Export-Performance
- **Logs (Loki):** Alle Finanz-Transaktionen logged (GoBD Audit Trail), Query: "Zeige alle Rechnungs-Stornos Q4 2025"
- **Distributed Tracing (Tempo):** End-to-End Nachvollziehbarkeit "Projekt → Rechnung → Export → Lexware"
- **Dashboards (Grafana):** Echtzeit-KPIs (Offene Forderungen, Überfällige Zahlungen, Export-Fehlerrate)

**Alerting:**
- Critical: "Export nach Lexware fehlgeschlagen 3x" → E-Mail an Buchhaltung
- Warning: "Offene Forderungen >€100K" → Slack-Notification

**Compliance-Benefits:**
- 100% Nachvollziehbarkeit für Steuerprüfung (Distributed Traces)
- Automatische Anomalie-Detection ("Rechnungs-Storno-Rate plötzlich 3x höher")

---

## 🔐 Enhanced GoBD Compliance (Phase 2)

**Automated Compliance Checks:**
- **Immutability Validation:** Automatischer Check "Ist finalisierte Rechnung unverändert?" (Hash-Vergleich)
- **10-Jahre-Archivierungs-Alerts:** "Rechnung R-2015-00123 erreicht Mindestaufbewahrungsfrist"
- **Change-Log-Completeness:** Alert wenn Änderungslog fehlt

**Real-Time Compliance Dashboard:**
- GoBD Score: 0-100% (Wie viele Dokumente GoBD-konform?)
- DSGVO-Kennzahlen: Löschanfragen pending, abgelaufene Consents
- Audit-Readiness-Indicator: ✅ GRÜN = bereit für Steuerprüfung

**Impact:**
- Steuerprüfung in 1 Tag statt 3 Tagen (alle Daten sofort auffindbar)
- Zero GoBD-Compliance-Verstöße

---

**Siehe auch:**
- `docs/product-vision/Produktvision Finanz- und Compliance-Management.md` → Phase 2 Observability
- `docs/architectur/` → Observability & Monitoring, ADR-015

---

### 21

