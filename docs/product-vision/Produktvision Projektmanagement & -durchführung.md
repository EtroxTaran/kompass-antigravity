# Produktvision Projektmanagement & -durchführung

_Converted from: Produktvision Projektmanagement & -durchführung.pdf_  
_Last Updated: 2025-11-10 – Vollständig integriert mit allen Spezifikationen_  
_Document Version: 2.0_

**⚡ Verknüpfte Spezifikationen:**

- **NFRs:** `docs/reviews/NFR_SPECIFICATION.md` – Performance, Skalierung, Verfügbarkeit, Monitoring
- **Datenmodell:** `docs/specifications/data-model.md` – Project/Task/Milestone-Entities, GoBD-Konformität, Änderungsverfolgung
- **RBAC:** `docs/reviews/RBAC_PERMISSION_MATRIX.md` – Planning (zugewiesene Projekte voll, andere read-only), Innendienst (alle Projekte read)
- **Journeys:** `docs/reviews/USER_JOURNEY_MAPS.md` – Journey 2 (Projekt→Rechnung), Journey 3 (Änderungsanfrage), Journey 4 (GF-Review)
- **Tests:** `docs/reviews/TEST_STRATEGY_DOCUMENT.md` – E2E-PM-001 bis E2E-PM-010, Projekt-Workflows, Kapazitätsplanung
- **API:** `docs/reviews/API_SPECIFICATION.md` – /projects, /tasks, /milestones Endpoints, Projekt-Konvertierung
- **Lieferplan:** `docs/reviews/DELIVERY_PLAN.md` – Phase 3 (Weeks 9-12): Opportunity/Project-Features

---

# 0. Executive Summary (Vision, Ziele,

**Vision:** Die Domäne „Projektmanagement & -durchführung“ soll durch ein **integriertes CRM- und**
**Projektmanagement-System** nahtlos unterstützt werden. Alle projektbezogenen Informationen – von
Kundendaten bis Aufgaben – sind **zentral verfügbar** , um jedem Beteiligten eine **360°-Sicht** auf Kunden
und Projekte zu bieten. Vertriebsprozesse und Projektabwicklung gehen **in einem System** ineinander über,
sodass die Übergabe vom Verkauf in die Umsetzung reibungslos funktioniert und **Doppelarbeit** sowie
**Medienbrüche** entfallen.

**Ziele:** Kernziel ist es, **Projekte effizient und transparent durchzuführen** , von der Auftragsannahme bis
zur Fertigstellung. Wichtige Unterziele sind u.a.: - **Zentrale Projektakte & Datenbasis:** Alle relevanten
Projektdaten, Dokumente und Kommunikationsverläufe werden in einer gemeinsamen Projektakte
gepflegt (Single Source of Truth). Jede Abteilung arbeitet mit demselben aktuellen Informationsstand. -
**Automatisierte Workflows & Aufgabenmanagement:** Wiederkehrende Schritte (z.B. Bestellungen,
Meilenstein-Termine, Rechnungsstellungen) werden automatisiert als Aufgaben angelegt. **Erinnerungen**
verhindern vergessene To-Dos. Dies steigert Effizienz und stellt die fristgerechte Umsetzung sicher. -
**Rollenorientierte Benutzeroberfläche:** Jede Persona erhält einen **personalisierten Überblick** über für sie
relevante Projekte, Aufgaben und Kennzahlen. Beispielsweise sieht der Außendienst unterwegs den
Projektstatus in Echtzeit; die Geschäftsführung erhält ein KPI-Dashboard über Pipeline, Projekte und
Finanzen. - **Mobilität & Offline-Fähigkeit:** Das System ist für mobile Nutzung optimiert (Smartphone/
Tablet) und funktioniert auch offline, damit der Außendienst **ohne Netzabdeckung weiterarbeiten** kann.
Eingaben werden bei Verbindung synchronisiert – ein Muss für die Arbeit in ländlichen Gebieten. - **Qualität**
**& Compliance:** Alle Projektschritte und -dokumente sind lückenlos und revisionssicher dokumentiert
(GoBD). **DSGVO-konforme** Datenhaltung wird gewährleistet, u.a. durch rollenbasierten Zugriffsschutz und
Archivierungsmechanismen. Dies minimiert rechtliche Risiken. -
**Integrität der Finanzdaten:**
Projektbezogene Finanzvorgänge (Rechnungsplanung, Zahlungsverfolgung) sind konsistent im System
abgebildet. **Abschlags- und Schlussrechnungen** werden termingerecht geplant und verbucht
. Offene
Posten und Zahlungsfristen sind für Buchhaltung und Vertrieb transparent (Mahnwesen integriert).

# Kernergebnisse/Änderungen: Basierend auf der Analyse werden etwa 90% der bestehenden Prozesse

(z.B. „Planer hat neuen Entwurf hochgeladen“). Entscheidungen und Abstimmungen bleiben so
nachvollziehbar im Kontext gespeichert. - **Reporting & Dashboards:** Für jede Rolle gibt es übersichtliche
**Dashboards** mit den wichtigsten Kennzahlen. Ampel-Status für Projekte, Umsatz vs. Plan, offene Angebote
etc. sind auf einen Blick erkennbar. Dies ermöglicht der Geschäftsführung schnellere, faktenbasierte
Entscheidungen.

**Risiken:** Größte Risiken liegen in der **Datenqualität und Akzeptanz** . Das beste System nützt wenig, wenn
es nicht konsequent genutzt wird. Daher ist Change Management kritisch: Alle Nutzer müssen den
Mehrwert sehen und geschult werden. Ein **Usability-Risiko** besteht, falls die Software zu komplex wird –
dann drohen Umgehungen (Excel, alte Gewohnheiten). Ebenso könnte **Mehrarbeit durch doppelte**
**Datenpflege** entstehen, falls bestehende Tools (z.B. Finanzbuchhaltung, Zeiterfassung) nicht sauber
integriert sind. Außerdem sind **rechtliche Risiken** (GoBD, DSGVO) zu beachten – das System muss von
Anfang an prüfungssicher sein, um späteren Mehraufwand oder Beanstandungen zu vermeiden.

**Entscheidungen:** Im Projekt wurden bereits wichtige Weichen gestellt: - **Eigenentwicklung vs.**
**Standardsoftware:** Ein Marktvergleich hat gezeigt, dass Standard-Lösungen viele Kernfunktionen
abdecken, aber in Schlüsselpunkten Lücken aufweisen (z.B. Offline-Fähigkeit, spezielle Abrechnungslogik).
Daher fiel die Entscheidung zugunsten einer **eigenen Entwicklung** (bzw. tiefen Individualisierung) als
integrierte Gesamtlösung, um alle Anforderungen passgenau umzusetzen. - **Fokus der MVP-Umsetzung:**
Zunächst werden die **funktionalen Muss-Anforderungen** umgesetzt (Projektakte, Angebots-zu-Projekt
Übergabe, Aufgaben-/Terminmanagement, Reporting-Dashboard, Rechnungsplanung etc.). Erweiterte
Features (Detail-Ressourcenplanung, tiefe CAD-Integration, Marketing-Module) sind als **Should/Nice-to-**
**have** priorisiert und können in späteren Phasen folgen, um das Projekt nicht zu überfrachten. -
**Beibehaltung der Prozesse & Rollenverteilung:** Es wurde beschlossen, an der bestehenden
Rollenverteilung festzuhalten – _kein_ neuer Projektmanager, sondern der **Innendienst übernimmt**
**koordinierende PM-Aufgaben** (gemeinsam mit dem Vertrieb). Dieses Vorgehen gewährleistet, dass das
Tool sich an den realen Arbeitsablauf anpasst. Gleichzeitig sollen klarere Verantwortlichkeiten im System
abgebildet werden (z.B. ein Projektleiter-Feld in jedem Projekt), um Transparenz zu schaffen – hierzu folgt
noch Feinkonzeption. - **Compliance & IT-Governance:** Früh wurde entschieden, dass das System **GoBD-**
**konforme Archivierung** unterstützen muss und ein Berechtigungskonzept nach Rollen erhält. Sensible
Finanzdaten werden zugriffsbeschränkt, Änderungen protokolliert. Diese Anforderungen stehen nicht zur
Disposition, da sie für Auditierbarkeit und Datenschutz zwingend sind. - **Integration externer Systeme:**
Anstatt die bestehende Finanzbuchhaltung (Lexware) und Zeiterfassung sofort abzulösen, wurde
entschieden, diese **vorerst anzubinden** (Schnittstellen/Exporte). Das CRM/PM-System konzentriert sich auf
Angebote, Projekte und Rechnungsplanung, aber fungiert **nicht als vollständige Fibu-Software** . Dies
minimiert Projektrisiken – ggf. kann in Zukunft eine engere Integration oder Ablösung erfolgen, sobald das
Grundsystem stabil läuft.

Zusammenfassend adressiert die Produktvision alle identifizierten Pain Points und vereint die
Anforderungen aller relevanten Personas in einem konsistenten Zielbild. Die Entscheidungen stellen sicher,
dass **schnell ein einsatzfähiges Kernsystem (MVP)** entsteht, das bereits enorme Verbesserungen bringt,
während für spezielle Erweiterungen (Detailplanung, Marketing etc.) bewusst **Platzhalter** vorgesehen
wurden, um diese bedarfsgerecht nachziehen zu können.

# 1. Kontext & Abgrenzung der Domäne

**Domänenbeschreibung:** Die Domäne _Projektmanagement & -durchführung_ umfasst die **operative**
**Umsetzung von Projekten** in dem Ladenbau-/Innenausbau-Unternehmen. Sie beginnt mit dem Moment,
in dem ein Verkaufsprojekt in einen Auftrag mündet (d.h. ein Angebot vom Kunden angenommen wird),
und deckt alle Phasen bis zum Projektabschluss und der Nachbetreuung ab. Konkret fallen darunter:
**Projektplanung, -steuerung und -kontrolle** , die Koordination von internen Teams (Planung, Innendienst,
Montage) und externen Partnern (Lieferanten, Subunternehmer), das
**Aufgaben- und**
**Terminmanagement** innerhalb des Projekts, sowie die **projektspezifische Finanzabwicklung** (Abschlags-
und Schlussrechnungen, Kostenverfolgung). Die Domäne wird im Gesamtkonzept als zentrales Modul
beschrieben, „das die operative Umsetzung der Aufträge abbildet“.

**Prozesskontext:** Ist ein Projekt (z.B. Ladenbau für einen neuen Hofladen) beauftragt, legt der Innendienst
eine **Projektakte im System** an. Darin werden sämtliche Stammdaten und Informationen aus der
Verkaufsphase übernommen (Kundendaten, Angebotsspezifika, Vertragswert, geplante Termine,
zuständiges Team etc.) – manuelle Doppeleingaben entfallen. Ab diesem Punkt unterstützt die Domäne alle
Schritte der Durchführung: - **Detailplanung & Vorbereitung:** Die Planungsabteilung verfeinert Entwürfe zu
ausführungsreifen Plänen (Innenarchitektur, technische Zeichnungen). Externe Fachplaner (Statik, Elektro)
können eingebunden werden – die Planung koordiniert das und stellt sicher, dass Lösungen praktikabel und
vollständig sind. Alle Planstände, Zeichnungen und Stücklisten werden im Projekt hinterlegt. -
**Aufgabensteuerung & Monitoring:** Das System stellt eine **Projektstruktur mit Phasen und Aufgaben**
bereit. Typische Phasen (Planung, Fertigung, Montage, Nachbereitung) sind mit _Standard-Aufgabenpaketen_
hinterlegt (z.B. „Werkplanung erstellen“, „Material bestellen“, „Montage durchführen“). Diese Vorlagen
können projektspezifisch angepasst werden. **Jede Aufgabe hat einen Verantwortlichen und eine**
**Fälligkeit** ; Abhängigkeiten zwischen Aufgaben sind modellierbar (z.B. „Möbel bestellen“ muss 8 Wochen
vor Montage erledigt sein). Das System überwacht Abhängigkeiten und warnt den Projektleiter, falls
Termine kollidieren oder Verzögerungen drohen („Ampelstatus“ bzw. Warnmeldungen). Der
Projektfortschritt wird kontinuierlich getrackt – erledigte Tasks werden abgehakt, überfällige rot markiert
und erscheinen im Dashboard der Verantwortlichen. - **Kollaboration & Kommunikation:** Alle
Projektbeteiligten (Innendienst, Außendienst, Planer, Monteure, ggf. Grafiker, Lieferanten) greifen auf die
gemeinsame Plattform zu. Es gibt **Möglichkeiten zur Zusammenarbeit in Kontext des Projekts** , etwa
Kommentarfunktionen an Aufgaben oder einen Projekt-Chat. So können Rückfragen zwischen Vertrieb,
Planung und Kalkulation direkt am Vorgang geklärt werden, statt per verstreuter E-Mail. Entscheidungen
und Änderungswünsche werden transparent dokumentiert. - **Dokumentenmanagement:** Die Domäne
beinhaltet ein _zentrales Dokumenten-Repository_ pro Projekt. Alle projektbezogenen Dateien – Pläne,
Angebote, Fotos (z.B. Vorher/Nachher), Abnahmeprotokolle – werden dort **versioniert** gespeichert. Damit
entfällt die bisher übliche Verteilung auf Netzlaufwerke oder persönliche Ordner. Jede Abteilung hat Zugriff
auf die aktuellen Versionen, historische Änderungen bleiben nachvollziehbar gespeichert
(Änderungshistorie). - **Durchführung & Steuerung vor Ort:** Während der Fertigung (in Werkstatt oder bei
Lieferanten) und der Montage vor Ort behält der Innendienst/Projektleiter die Übersicht über Termine und
Qualitätskontrollen. Das System ermöglicht einen **Blick auf beteiligte Ressourcen** : Man sieht, welche
Mitarbeiter und Teams dem Projekt zugeteilt sind und in welchem Zeitraum. Eine grobe
Kapazitätsauslastung kann so abgeschätzt werden (z.B. ob das Montageteam zum gewünschten Termin
verfügbar ist). Für das MVP wird eine einfache Übersicht (Kalender oder Gantt) angestrebt; eine

tiefergehende Ressourcenplanung (mit Auslastungsdiagrammen je Mitarbeiter) ist als _optionale Erweiterung_
vorgemerkt. - **Lieferanten- & Bestellmanagement:** Ein wichtiger Aspekt der Projektabwicklung ist das
**Beschaffen von Materialien und Fremdleistungen** . Die Domäne grenzt sich hier zum separaten
Lieferantenmanagement-Modul zwar ab, _interagiert_ damit aber eng: Innerhalb eines Projekts können
Bestellungen an Lieferanten erfasst und deren Liefertermine verwaltet werden. So wird z.B. dokumentiert,
dass für Projekt X bei Schreiner Y Thekenmöbel bestellt wurden, Lieferung zugesagt bis Datum Z. Diese
Daten fließen ins Terminmanagement ein – wenn ein Liefertermin überschritten wird, sieht der Projektleiter
dies und kann nachhaken. Auch _Reklamationen_ werden projektspezifisch erfasst und dem betreffenden
Lieferanten zugeordnet, um die Lieferantenleistung zu bewerten (dies gehört formal zur
Lieferantenmanagement-Domäne, wird aber aus dem Projekt heraus angestoßen). - **Finanzielle**
**Projektabwicklung:**
Die Domäne beinhaltet
**keine vollumfängliche Buchhaltung** , aber die
projektrelevante Finanzsteuerung. Das heißt, _Rechnungen und Zahlungen zu Projekten_ werden geplant und
verfolgt. Typischerweise werden im Ladenbau **drei Teilrechnungen** pro Projekt gestellt (Anzahlung weit vor
Montage, Teilzahlung kurz vor Montage, Schlussrechnung nach Fertigstellung). Diese Meilensteine sind im
System hinterlegt: z.B. generiert das System 16 Wochen vor Einbau eine Aufgaben-/Terminerinnerung „1.
Abschlagsrechnung stellen“. Die Buchhaltung erstellt daraufhin die Rechnung und versendet sie.
Zahlungseingänge können im Projekt erfasst oder aus der Fibu importiert werden. Bleibt eine Zahlung aus,
startet das _Mahnwesen_ mit einer Erinnerung im System (die Buchhaltung versendet dann manuell
Mahnungen, bis ggf. zukünftig automatisierte Mahnstufen implementiert sind). Alle Einnahmen und
Ausgaben werden dem Projekt zugeordnet, um **Projektmargen** auswerten zu können. **GoBD-Konformität**
wird sichergestellt, indem Rechnungen und Belege unveränderbar archiviert werden (Änderungen nur mit
Protokollierung)
. Vollständige Finanzbuchhaltung (z.B. Gewinn- und Verlustrechnung, USt-
Voranmeldung) bleibt _außerhalb_ dieser Domäne – dafür wird auf das bestehende System (Lexware)
zurückgegriffen.

# Abgrenzung & Schnittstellen: Die Domäne grenzt sich klar gegenüber vorgelagerten und

**Ressourcenoptimierung** (Feinplanung auf Mitarbeiter-Minutenbasis) ist ausdrücklich _ausgeklammert_ in der
ersten Ausbaustufe. Und wie erwähnt, ist auch die **Finanzbuchhaltung** (Hauptbuch, Jahresabschluss,
Steuer) nicht Teil der Domäne – hier erfolgt lediglich eine Überlappung bei der Rechnungsstellung und -
verfolgung.

**Branchenspezifischer Kontext:** In der Ladenbau-Branche zeichnen sich Projekte durch **hohe**
**Individualisierung** und enge Zeitrahmen aus. Projekte laufen oft über mehrere Monate, mit intensiven
Phasen (Planung, Produktion, Einbau) und Leerlauf dazwischen (z.B. Wartezeit auf Ladenmöbel). Die
Domäne muss diese **dynamischen Abläufe** abbilden können – etwa mehrere **Iterationsschleifen** zwischen
Planung, Kalkulation und Kunde, bevor ein Auftrag final freigegeben wird. Anders als in rein intern
getriebenen Projekten ist hier der **Kunde stark involviert** , gibt Feedback und wünscht Änderungen, die
wiederum intern verteilt werden müssen. Die Domäne „Projektmanagement & -durchführung“ trägt dem
Rechnung, indem sie _flexible Anpassungen_ von Angeboten/Planungen ermöglicht (Versionierung,
Änderungsdokumentation) und alle Beteiligten stets synchron hält. Damit fungiert das PM-Modul als
**Drehscheibe zwischen allen Abteilungen** (Vertrieb, Planung, Innendienst, Produktion, Buchhaltung) – hier
laufen alle Fäden des Projektgeschäfts zusammen.

# 2. Domänen-Challenge (Annahmen, Lücken,

In der Analyse des Projektkontexts wurden mehrere Herausforderungen und kritische Erfolgsfaktoren für
die Domäne identifiziert:

**Annahmen & Voraussetzungen:** - **Workflows bleiben bestehen:** Es wird **davon ausgegangen** , dass die
heutigen Hauptprozesse im Projektgeschäft sinnvoll sind und beibehalten werden können. ~90% der
Abläufe sollen unverändert bleiben (von Erstkontakt über Angebot bis Projektabschluss). Diese Stabilität ist
eine Grundlage: Die Nutzer sollen im neuen System ihre vertrauten Schritte wiederfinden, nur effizienter.
Wo Verbesserungen möglich sind (siehe Best Practices), wurden _geringe Eingriffe_ angenommen (z.B.
**digitale statt manuelle Dokumentation** , automatische Wiedervorlagen). Diese Annahme minimiert das
Change-Management-Risiko – es muss jedoch bestätigt werden, dass keine größeren Prozessänderungen
(z.B. neue Freigabeschritte oder Rollen) nötig sind. - **Rollenverteilung bleibt vorerst gleich:** Im Interview
wurde deutlich, dass es _keine separate Projektmanager-Rolle_ gibt; der **Innendienst übernimmt die**
**Projektkoordination** ab Auftragseingang, in Zusammenarbeit mit dem Außendienst. Wir nehmen an, dass
dieses Modell fortgeführt wird. D.h. das System wird so konzipiert, dass Innendienstmitarbeiter als
„Projektleiter“ fungieren können (Übersicht über alle Projekte, Zuweisung von Aufgaben,
Terminverwaltung), ohne eine neue Person dafür einzustellen. _Geschlossene Entscheidung:_ Vor Einführung
des Tools wird **kein zusätzliches PM-Personal** geschaffen – das wurde vom Management so bestätigt.
Allerdings müssen Verantwortlichkeiten im Tool klar zugewiesen werden (Platzhalter für evtl. Rollenfeld
„Projektleiter“ – siehe offene Punkte). - **Integration statt Ablösung externer Systeme:** Eine weitere
Prämisse ist, dass bestehende Systeme wie die Finanzbuchhaltung (Lexware) und die Zeiterfassung
(„Timecard“) **nicht sofort abgelöst** , sondern angebunden werden. Das PM-Tool soll _Rechnungsstellung und_
_Zahlungskontrolle_ abbilden, aber keine eigenständige Buchhaltungssoftware ersetzen. Ebenso sollen
erfasste Stunden aus Timecard für Projektauswertungen genutzt werden können. Diese Annahme erlaubt
es, den Scope in der ersten Phase zu begrenzen (Focus auf Kern-PM-Funktionen) – birgt aber die
Herausforderung, saubere **Schnittstellen** zu definieren, damit keine Medienbrüche entstehen (siehe

Risiken). - **Technische Infrastruktur:** Es wird angenommen, dass alle Nutzer Zugriff auf geeignete
Hardware haben (Außendienst: Smartphone/Tablet; Innendienst/Planung: PCs mit Internet) und dass eine
zentrale Serverlösung (cloudbasiert oder on-premise) zur Verfügung steht. Offline-Fähigkeit des Tools wird
als Muss betrachtet, d.h. es wird davon ausgegangen, dass die technische Umsetzung (z.B. via App oder
PWA mit Sync) machbar ist. Diese Annahme basiert auf Marktbeobachtung: Viele mobile CRM-Lösungen
ermöglichen Offline-Modus, wir schließen uns diesem Standard an. - **Datenqualität als Prämisse:** Ein
zentrales **Paradigma (Annahme)** ist, dass _alle relevanten Informationen ins System eingegeben werden_ . Nur
dann entsteht der volle Nutzen einer 360°-Plattform. Insbesondere müssen die Mitarbeiter bereit sein,
Notizen, Aufgaben, Termine konsequent im Tool zu pflegen. Im Interview wurde das als **Kulturwandel**
beschrieben: bisher werden viele Dinge informell oder in persönlichen Files gehandhabt. Die Einführung
geht nur dann glatt, wenn von vornherein klar ist: „ **Das System ist unsere einzige Quelle** – wenn es nicht
im System steht, ist es nicht passiert.“ Diese Annahme erfordert Change-Management (siehe Risiken:
Akzeptanz).

**Identifizierte Lücken & Pain Points:** (Wo stehen heute Defizite, die das Konzept schließen muss?) -
**Medienbrüche & Insellösungen:** Der Status Quo ist geprägt von getrennten Tools (Excel-Listen, E-Mail,
lokale Ordner). Dies führt zu **Dateninseln, Doppelpflege und Inkonsistenzen** . Ein zentrales Ziel ist, diese
Lücke zu schließen durch eine einheitliche Plattform. Das bedeutet: Das neue System muss mindestens den
Funktionsumfang der bisherigen „Toolkette“ abdecken, damit niemand mehr Gründe hat, auf alte Mittel
zurückzugreifen. _Gefahr:_ Ist das System in einer Hinsicht schwächer als ein alter Weg (z.B.
Angebotschreibung zu unflexibel, Berichtsauswertung zu starr), drohen Schattenprozesse in Excel. Diese
Lücke wurde erkannt – daher liegt großer Fokus auf **Flexibilität** (z.B. Angebotsmodul kann auch komplexe
Fälle abbilden, siehe Persona Innendienst). -
**Offline-Fähigkeit bisher Fehlanzeige:**
Außendienstmitarbeiter haben aktuell offline keinen Zugang zu CRM-Daten – Papiernotizen sind ein
Notbehelf. Standard-CRM/PM-Tools bieten Offline oft nur eingeschränkt. Unsere _Lösung schließt diese Lücke_
_explizit_ : **Vollständige Offline-Fähigkeit** wurde als Alleinstellungsmerkmal herausgearbeitet. Damit das
funktioniert, müssen Daten lokal zwischengespeichert werden und Konflikte bei der Synchronisation gelöst
werden. Hier liegt eine technische Herausforderung, aber auch ein wesentliches Verkaufsargument intern:
Der Außendienst **kann überall arbeiten** , was vorher nicht möglich war (und was viele Standardlösungen
nicht bieten). - **Vertrauenslücke in Daten und Versionen:** Aktuell gibt es oft Unklarheit: _Welche_
_Angebotsversion ist die aktuelle? Wurde die neueste Planungsänderung berücksichtigt?_ Solche Lücken in der
Nachvollziehbarkeit führen intern zu viel Abstimmungsaufwand. Das neue System muss **Versionierung**
**und lückenlose Protokollierung** bieten – jede Änderung an Angebot, Plan oder Termin muss
dokumentiert sein. Diese Lücke wurde im Konzept adressiert, indem z.B. Angebotsversionen vergleichbar
gespeichert werden und Projekthistorien (Änderungslogbuch) vorgesehen sind. - **Transparenz für GF und**
**abteilungsübergreifend:** Eine Schmerzstelle war die **mangelnde Übersicht auf Management-Ebene** : Der
GF bekam Infos nur zeitverzögert und fragmentiert. Das Tool muss diese Lücke füllen, indem es **Echtzeit-**
**Dashboards** bereitstellt, die Pipeline, Auftragsstand und Projektfortschritt vereinen. Identifiziert wurde z.B.,
dass bisher Projektkosten vs. Budget kaum sichtbar sind, bis das Projekt vorbei ist. Die GF-Persona fordert
hier ein Frühwarnsystem (Abweichungen, Verzögerungen). Unser Konzept sieht entsprechende
Ampelindikatoren und Alerts vor – eine Lücke, die es zu schließen gilt, um proaktives Management zu
ermöglichen. - **Spezifische Anforderungen vs. Standardsoftware:** Eine Analyse der verfügbaren Lösungen
zeigte, dass **Kernfunktionen meist abgedeckt** werden (Kontaktverwaltung, Pipeline, Task-Management).
Allerdings wurden einige Domänen- **Spezifika als Lücken** identifiziert, die Standardtools nicht ohne
weiteres abbilden: z.B. **automatische Teilrechnungs-Terminierung** nach individuellem Zeitplan (16/4
Wochen etc.), oder **deutsche GoBD-Anforderungen** an Unveränderbarkeit, oder der bereits genannte

Offline-Modus. Auch das verzahnte Zusammenspiel aller Abteilungen in _einem_ Tool (Vertrieb ↔ Planung ↔

Kalkulation ↔ Buchhaltung) ist bei vielen Lösungen in separaten Modulen gelöst, was zu Integrationslücken
führt. Diese Erkenntnis stützt die Entscheidung pro Eigenentwicklung, um genau diese Lücken zu
adressieren.

**Risiken & Herausforderungen:** - **Akzeptanzrisiko & Bedienbarkeit:** Mehrfach betont wurde: _Die beste_
_Lösung bringt nichts, wenn die Anwender sie ablehnen._ Das Risiko besteht, dass Mitarbeiter, gerade wenn sie
unter Zeitdruck stehen, das neue System umgehen, falls es nicht klaren Mehrwert bringt oder umständlich
ist. Beispielsweise könnte ein Außendienstler weiterhin handschriftliche Notizen machen, wenn die mobile
App zu langsam oder kompliziert ist – damit wäre der Single Source of Truth gebrochen. **Mitigation:** Das
Konzept priorisiert daher hohe **Usability** (einfaches, intuitives UI) und **Performance** . Zudem ist das
Management in der Pflicht, die Nutzung verbindlich vorzugeben (Kulturwandel). Schulungen und eine
Pilotphase sollen helfen, Hemmschwellen abzubauen. Das **UX-Design wird gemeinsam mit Endusern**
**getestet** , um sicherzustellen, dass typische Aufgaben (z.B. ein Besuchsbericht erfassen, eine Aufgabe an
Kollegen delegieren) mit wenigen Klicks erledigt sind. - **Datenintegrität & -pflege:** Ein zentrales Risiko ist
die **Datenqualität** . Wenn Informationen unvollständig oder falsch eingepflegt werden, laufen die schönen
Dashboards ins Leere und Entscheidungen basieren auf falschen Annahmen. Bisher wurden z.B. Kontakte
nicht immer konsistent gepflegt, was zu lückenhaften CRM-Daten führte. Das neue System erzwingt teils
Pflichtfelder und bietet Plausibilitätschecks, aber letztlich muss das Team den Wert vollständiger Daten
verstehen. **Mitigation:** Klare Prozesse (z.B. jeder Kundenbesuch _muss_ als Kontaktbericht im System landen,
sonst kein Angebot), Monitoring durch Teamleiter, und ggf. Gamification/Feedback („Dashboard
Sauberkeit“) können helfen. Technisch sorgt ein Berechtigungskonzept dafür, dass niemand versehentlich
kritische Daten löscht, und ein **Änderungsprotokoll** stellt Nachvollziehbarkeit her. - **Schattenprozesse bei**
**fehlender Flexibilität:** Sollte die Lösung in bestimmten Fällen zu unflexibel sein, drohen _Workarounds_ . Ein
konkretes Risiko: Wenn das Angebotsmodul komplexe Angebote nicht abbilden kann, könnten Kalkulatoren
wieder in Excel arbeiten, wodurch die Versionierung und Pipeline-Transparenz verloren ginge. **Mitigation:**
Wir haben bei den Anforderungen darauf geachtet, dass z.B. hierarchische Angebotspositionen,
Alternativen und Versionen unterstützt werden. Dennoch bleibt ein Risiko, dass bestimmte Spezialfälle (z.B.
zwei parallele Angebote für denselben Kunden, die miteinander verknüpft sind) nicht bedacht wurden.
Daher wird empfohlen, in einer _Testphase mit echten Projekten_ frühzeitig mögliche Lücken aufzudecken und
das System iterativ nachzubessern. - **Projektumfang & Komplexität:** Die Integration _aller_ Funktionen in ein
System ist anspruchsvoll. Es besteht das Risiko der **Überfrachtung** – sowohl für Nutzer (zu viele Features
auf einmal) als auch für die Entwicklung (Zeit- und Budgetüberschreitung). **Entscheidung zur**
**Risikominimierung:** Klare Fokussierung auf MVP-Kernfunktionen, Priorisierung in Must/Should/Nice.
Nicht-Kernfunktionen (CAD-Integration, detaillierte Ressourcenplanung, Marketing-Features) bleiben
zunächst außen vor, mit Platzhaltern für zukünftige Erweiterungen. Dadurch sinkt das
Implementierungsrisiko kurzfristig – allerdings muss man im Auge behalten, dass fehlende Nice-to-haves
mittelfristig eingefordert werden könnten (Scope Creep in späteren Phasen). - **Integration &**
**Schnittstellenrisiko:** Die Entscheidung, bestehende Systeme anzubinden, birgt Abhängigkeiten. Wenn z.B.
die **Schnittstelle zur Fibu** nicht rechtzeitig oder nur unvollständig gelingt, könnte die Buchhaltung doppelt
arbeiten müssen (Rechnungen im PM-System erstellen _und_ in Lexware nachbuchen). Das wäre
kontraproduktiv. **Mitigation:** Schnittstellenanforderungen wurden früh spezifiziert (Exportformate, API-
Nutzung). Als Fallback können zur Not CSV-Exporte gezogen werden, um Daten ins alte System zu
importieren. Ähnlich bei der Zeiterfassung: Hier ist zu klären, ob die Stundensätze/Projektzeiten via Export
rüberkommen oder ob wir sie manuell einpflegen müssen – das ist ein offener Punkt. Insgesamt ist ein
etappenweises Vorgehen geplant: Erst Kernfunktionen in Betrieb nehmen, dann Schnittstellen
implementieren, um den Go-Live nicht zu gefährden. - **Technische Risiken (Performance, Offline,**
**Sicherheit):** Die Menge an Daten (viele große CAD-Dateien, Fotos) könnte Performance-Probleme

verursachen, wenn das System nicht optimiert ist. Auch der **Offline-Modus** ist technisch herausfordernd
(Synchronisationskonflikte). Zudem hat Sicherheit hohe Priorität, da Kundendaten und interne
Kalkulationen schutzbedürftig sind – ein Datenleck wäre gravierend. Diese Risiken sind erkannt. **Mitigation:**
Einsatz moderner Web-Technologien und ggf. einer hybriden App für Offline, Lasttests mit realistischen
Datenmengen, und Implementation von Role-Based-Access-Control, Verschlüsselung und Audit-Logs. Nicht-
funktionale Anforderungen wie Performance (Ladezeiten, Reaktionsfähigkeit) und Security (Penetration
Testing) fließen explizit ins Pflichtenheft ein, um diese Risiken zu managen.

**Geschlossene Entscheidungen:** (zusammenfassend) - Es wird **eine integrierte Eigenlösung** gebaut,
anstatt mehrere Tools zu kombinieren – Beschluss basierend auf dem erkannten Bedarf an
branchenspezifischen Funktionen und Offline-Betrieb. - Die **Personas und ihre Anforderungen** wurden
vollumfänglich berücksichtigt und Prioritäten festgelegt (Außendienst & Innendienst im MVP besonders
berücksichtigt, Marketing zunächst nachrangig). - **Prozesse** : Kernprozesse werden nicht neu erfunden,
sondern digital abgebildet; wo sinnvoll, werden Best Practices implementiert (automatisierte Workflows,
360°-Sicht etc.). - **Rollenkonzept** : Es bleibt bei vorhandenen Rollen, aber diese werden im System mit
Rechten abgebildet. Innendienst wird faktisch als Projektleitung angesehen (kein dedizierter PM eingestellt)
– das wurde mit der Geschäftsführung abgestimmt. -
**Scope-Begrenzung** : MVP umfasst
Projektmanagement-Kern und Angebote; **nicht enthalten** sind eigenständige CAD-Funktionalität,
komplette Finanzbuchhaltung, ausführliche Personalplanung etc. Dies ist konsensual so festgelegt, um
Fokus zu halten. - **Compliance-First** : Das System muss ab Tag 1 Audit-Anforderungen erfüllen (GoBD,
DSGVO). Keine Aufweichung dieser Vorgaben – entsprechende Features (Protokollierung, Zugriffsrechte,
Archiv) sind in der Muss-Liste verbindlich. - **Weiteres Vorgehen** : Nach Implementierung des MVP wird eine
Pilotphase mit ausgewählten Projekten durchgeführt, um Restlücken aufzudecken (Testentscheidung). Erst
danach erfolgt der Rollout an alle Nutzer. Ein begleitendes Change Management (Schulungen, Feedback-
Runden) wurde eingeplant, um die genannten Akzeptanzrisiken zu minimieren.

# 3. Personas-Mapping (Persona → Anforderungen/

# Use-Cases → Konzeptfit/Gaps → Entscheidung)

Im Folgenden werden die relevanten **Personas** der Domäne betrachtet. Für jede Persona werden die
wichtigsten Anforderungen bzw. Use Cases bezogen auf _Projektmanagement & -durchführung_ aufgeführt,
bewertet, wie gut das Konzept diese adressiert ( **Fit** oder **Gap** ), und ob daraus Entscheidungen oder offene
Punkte resultieren.

**➔** **Außendienstmitarbeiter (Vertrieb)** – _Markus (Außendienst) betreut Projekte von Akquise bis Abschluss,_

_meist unterwegs (Auto, beim Kunden)._

- **Anforderungen/Use Cases: Mobil & offline arbeiten:** Markus muss auch ohne Internet auf Kunden- und
  Projektdaten zugreifen und Notizen erfassen können. **Kunden- und Projektstatus einsehen:** Er möchte
  jederzeit wissen, in welcher Phase sich seine Projekte befinden (z.B. „Planung läuft“, „Montage
  abgeschlossen“). **To-Dos verwalten & delegieren:** Markus erstellt Aufgaben, etwa „Kunde anrufen für
  Feedback“ oder gibt Bitten ans Team („Bitte Skizze bis Freitag updaten“). Diese sollen im System erfasst,
  zugewiesen und mit Erinnerungen versehen werden. **Integrierte Kommunikation:** Er wünscht einen
  kurzen Draht zu Innendienst/Planung, idealerweise durch Kommentare direkt am Projekt statt langen E-
  Mail-Schleifen. **Dokumente vor Ort präsentieren:** Angebote, Pläne, Fotos möchte er dem Kunden auf
  Tablet zeigen können – also braucht er Zugriff auf aktuelle Dateien im Projekt. Zudem wäre eine

**Angebotserstellung vor Ort** hilfreich, zumindest die Möglichkeit, Modul-Angebote oder Preise mobil
anzupassen (auch wenn Abschluss meist nachträglich erfolgt). **Spesen und Berichte unterwegs erfassen:**
Idealerweise kann er Reisekosten, Kilometer und Besuchsberichte sofort digital eingeben, statt am
Monatsende.

- **Konzept-Fit:** Der **Offline-Modus** ist ein zentrales Feature der Lösung – damit wird Markus’ Kernproblem
  gelöst. Die Anwendung speichert alle wichtigen Daten lokal und synchronisiert automatisch, sobald wieder
  Netz da ist. Das **Projekt-Dashboard** wird ihm mobil zeigen, welche Phase/Status das Projekt hat (Ampel
  oder Timeline). Aufgabenmanagement ist integriert: Markus kann Aufgaben erstellen, Teammitglieder
  taggen und Deadlines setzen; das System versendet Benachrichtigungen, sodass alle informiert sind. Er
  erhält Erinnerungen für seine eigenen To-Dos (z.B. „In 3 Tagen beim Kunden nachfassen“). Die
  **Kollaboration** wird erheblich verbessert: Statt WhatsApp oder Anrufe gibt es Projekt-Kommentare – wenn
  Markus z.B. schreibt „@Planer bitte neuen Grundriss hochladen“, bekommt der Planer das als Notification.
  Die **Dokumentenablage** stellt sicher, dass Markus immer die aktuelle Version des Angebots und der
  Visualisierung dabei hat – kein mühsames Suchen mehr. Unklar war vorab, ob eine **Routenplanung** für
  Markus relevant ist: Tatsächlich hat die Persona das als Wunsch geäußert (Tourenoptimierung für
  Kundenbesuche). Das fällt eher in die CRM-Domäne; im PM-Tool selbst ist höchstens die Integration mit
  Kalender/Mapping vorgesehen (geplante Termine pro Kunde). Hier gibt es einen **Gap** : Tourenplanung wird
  in Phase 1 nicht speziell implementiert (Entscheidung: CRM-Funktion, nachrangig). Markus’ Anforderung
  nach **mobiler Angebotserstellung** wird teilweise erfüllt: Das System erlaubt Angebotsentwürfe mit
  hinterlegten Produkten; digital unterschreiben vor Ort ist perspektivisch denkbar, aber im MVP nicht
  oberste Priorität. Insgesamt ist der **Fit hoch** : Die größten Pain Points (Offline-Zugriff, zerstreute Infos, kein
  Überblick) werden behoben. **Entscheidung:** Offline-Fähigkeit ist als Muss bestätigt und umgesetzt. Der Gap
  Tourenplanung bleibt vorerst offen (Platzhalter im CRM-Konzept, mit externen Tools zu lösen).

**➔** **Vertriebsinnendienst & Kalkulation** – _Sabine (Innendienst) erstellt Angebote, unterstützt den Vertrieb_

_administrativ und koordiniert nach Auftragseingang die Auftragsabwicklung._

- **Anforderungen/Use Cases: 360°-Datenbasis:** Sabine braucht alle kunden- und projektbezogenen Infos
  **auf einen Blick** , statt in zig Dateien. Sie pflegt zentrale Stammdaten und will, dass jeder dieselbe aktuelle
  Info sieht. **Effizientes Angebotswesen:** Sie erstellt detaillierte Angebote aus Planer- und ADM-Infos.
  Erwartet wird, dass das System aus einer Verkaufschance direkt ein Angebot generieren kann, mit
  **Artikeldatenbank, Preislisten und Versionierung** . Sie möchte Angebote schneller schreiben
  (automatische Summen, Steuern, keine Excel-Rechenfehler) und bei Änderungen Vergleichsmöglichkeiten
  zwischen Versionen haben. **Automatisierte Workflows:** Nach „Auftrag erteilt“ soll das System _automatisch_
  _eine To-Do-Liste_ erzeugen: z.B. „Bestellung bei Lieferant A auslösen“, „Montagetermin mit Kunde
  abstimmen“, „16 Wochen vor Montage: Rechnung 1 stellen“. So muss Sabine nicht manuell an alles denken

– nichts wird vergessen. **Nahtlose Übergabe Verkauf** **→** **Projekt:** Mit einem Klick muss aus dem Angebot
ein Projekt werden, inkl. aller Daten (Kunde, Angebotspositionen, Notizen). **Lieferantenmanagement &**
**Bestellungen:** Sabine will im System Lieferanten hinterlegen und direkt Bestellungen erzeugen können.
Optimal: Das System erlaubt das Erstellen einer Bestellliste pro Projekt und verfolgt Liefertermine. Auch
**Reklamationen** sollen erfasst werden (z.B. „Lieferant hat mangelhaft geliefert“), um später auszuwerten,
welcher Lieferant problematisch war. **Projektüberwachung & Kollaboration:** Sabine behält den Überblick
über alle laufenden Projekte, muss auf Statusänderungen reagieren können (z.B. Plan fertig – Angebot kann
raus). Sie möchte **sofort sehen, wenn ein Planer etwas hochlädt oder ein Status wechselt** , anstatt auf E-
Mails zu warten. Und sie will Rückfragen direkt im System stellen können (@mention an Planer/Kollegen).
**Ressourcen/Kapazität:** Bei der Terminplanung muss sie wissen, ob z.B. Monteure zu dem Termin frei sind –
also eine Übersicht „wer ist wann verplant“ auf hoher Ebene. **Reporting:** Sabine wird oft Zahlen für den
Vertrieb oder GF aufbereiten müssen: offene Angebote, Auftragsbestand, Lieferantenperformance etc. Sie

benötigt daher Auswertungsmöglichkeiten (ggf. Standardreports) und ein Dashboard für den Innendienst
(OP-Liste, nächste Meilensteine).

- **Konzept-Fit:** Der **Single-Source-of-Truth** -Ansatz trifft den Kern: Alle Daten werden im System vereint,
  wodurch Sabine und ihr Team **abteilungsübergreifend auf dem gleichen Stand** sind. Das Angebotstool
  im CRM-Modul ermöglicht Angebote direkt aus Opportunities heraus – mit hinterlegbaren Preislisten und
  automatischer Kalkulation. Das Konzept betont **Versionierung** : Mehrere Angebotsversionen pro
  Opportunity können verwaltet und verglichen werden, sodass Sabine iterative Änderungen sauber
  nachvollziehen kann. **Workflows:** Ein Highlight der Lösung: Bei Auftragsbestätigung erzeugt das System
  automatisiert vordefinierte Aufgaben (per Template). Konkret umgesetzt werden To-Dos wie „Lieferant X
  bestellen“ etc., basierend auf branchenspezifischen Best Practices. Das nimmt Sabine Routinearbeit ab und

schließt die „Erinnerungs-Lücke“. Die **Verkaufs** **→** **Projekt-Übergabe** ist vollständig integriert: Alle
relevanten Verkaufsdaten fließen per Klick ins Projekt, **kein Abtippen mehr** . Das war ein ausdrücklicher
Wunsch (Übertragungsfehler vermeiden) und wird erfüllt. **Lieferanten & Bestellungen:** Hier zeigt sich der
modulare Aufbau: Das System enthält ein Lieferantenmodul – im Projekt kann Sabine Lieferanten
auswählen und Bestellungen dokumentieren. Vollautomatisierte Bestellprozesse (mit Bestellschein-
Generierung) sind perspektivisch möglich; zunächst ist vorgesehen, dass sie im Projekt eine „Bestellung
anlegen“ kann, mit Feldern für Artikel, Menge, Lieferant, Liefertermin. Das System warnt, wenn ein
Liefertermin überschritten ist. **Kollaboration & Status:** Da alle im selben System arbeiten, sieht Sabine _in_
_Echtzeit_ , wenn z.B. der Planungsstatus auf „Entwurf fertig“ springt oder ein Kollege einen Kommentar
hinterlässt. Das erhöht die Transparenz massiv. Der Innendienst bekommt ein **eigenes Dashboard** mit für
ihn relevanten Kennzahlen (z.B. Anzahl offene Angebote älter 14 Tage, heute fällige Aufgaben,
Liefertermine diese Woche). **Kapazitätsübersicht:** Das Konzept adressiert dies mit einer einfachen Team-
Auslastungsansicht – Sabine kann z.B. sehen, ob in KW 12 bereits 3 Montagen parallel geplant sind. Das hilft
ihr, Termine realistischer zu koordinieren. _Gaps:_ Ein möglicher Gap ist die **Anpassbarkeit des**
**Angebotsmoduls** – Sabine hat spezielle Anforderungen (Unterpositionen, Rabattstaffeln). Hier wurde im
Konzept Flexibilität betont, aber es bleibt ein Risiko (s.o.), das in der Umsetzung geprüft werden muss. Ein
weiterer Punkt: **Reklamationsmanagement** – vorgesehen ist die Erfassung im Projekt, aber ob daraus
direkt ein Prozess resultiert (z.B. Lieferant informieren, Ersatzlieferung tracken) ist offen. Dies könnte eine
Lücke sein, die im Pilotfeedback geprüft wird. Insgesamt ist der Konzept-Fit für den Innendienst exzellent;
viele Anforderungen dieser Persona haben das Design direkt beeinflusst. **Entscheidungen:** Die
Projektgruppe hat beschlossen, dem Innendienst-User besonders Rechnung zu tragen, da hier viel
Koordination zusammenläuft. Daher wurden z.B. das
**Aufgaben-Template** -Konzept und das
**Angebotsmodul mit Versionierung** als Muss aufgenommen. Auch die **Lieferantenverwaltung** bekam
Priorität (kein späteres Add-on, sondern integraler Bestandteil), weil ohne diese Sabine weiter Excel-Listen
pflegen müsste. Der Gap der Angebotsflexibilität wird bewusst beobachtet – notfalls ist eingeplant, dass in
Phase 2 Nachjustierungen erfolgen, falls Workarounds erkennbar werden.

**➔** **Planungsabteilung (Innenarchitekten/Planer)** – _Das Planungsteam übernimmt nach der Akquise die_

_Gestaltungskonzepte und Ausführungsplanung des Projekts. Es übersetzt Kundenwünsche in Entwürfe und_
_koordiniert die Umsetzungsvorbereitung._

- **Anforderungen/Use Cases:**
  **Zentraler Projektbriefing-Input:**
  Die Planer wollen alle
  Kundenanforderungen, Maße, Fotos etc., die der Vertrieb gesammelt hat, **gebündelt im Projekt** vorfinden,
  statt in E-Mails und Notizen suchen zu müssen. **Aufgaben und Fristen im Blick:** Aus Vertriebsaktivitäten
  sollen automatisch Aufgaben für die Planung entstehen – z.B. wenn der ADM im Kundengespräch notiert
  „Layout zeichnen bis nächste Woche“, soll diese Aufgabe im System bei der Planung auftauchen. Generell
  braucht die Planungsabteilung eine **To-Do-Liste** aller ihrer Projekte mit Prioritäten und Abhängigkeiten (z.B.
  „Plan fertig **vor** Angebotserstellung“). **Status-Updates statt Nachfragen:** Aktuell schickt Planung dem

  ***

  _Page 11_

  ***

Vertrieb per E-Mail Zwischenstände („Grundriss v1 fertig“). Künftig soll der Vertriebsstatus _selbst_ im System
abrufbar sein, damit Planer nicht abends noch Mails schreiben müssen. **Kollaboration im Team:** Planer
arbeiten eng mit Kalkulatoren, Grafikern und teils externen Fachplanern zusammen. Sie wünschen sich
einen _Projekt-Chat_ oder Kommentarbereich, um Fragen und Änderungen direkt dort zu diskutieren (z.B.
Planer fragt Kalkulator: „Kosten für Material X berücksichtigen?“) und Entscheidungen festzuhalten. **Datei-**
**und Versionsmanagement:** Da Planung viele Zeichnungen und Visualisierungen erzeugt, braucht es eine
**versionierte Ablage** im Projekt. Alle Beteiligten (auch Kalkulation, Grafik) sollen immer die aktuelle Plan-
Version finden. **CAD-Schnittstelle:** Ideal wäre, Planungsdaten (z.B. DWG-Grundrisse) direkt aus AutoCAD/
Revit ins System exportieren zu können. Mindestens muss das System gängige Formate (PDF, JPG, DWG)
speichern können. **Termin- und Kapazitätsplanung:** Planer betreuen oft mehrere Projekte parallel; sie
brauchen Übersicht über ihre Meilensteine und wer im Team woran arbeitet. Ein **Gantt-Chart oder Kanban**
für Planungsschritte wäre hilfreich. Die Abteilungsleitung möchte sehen können, wie ausgelastet die Planer
sind, um neue Projekte realistisch einzuplanen. **Anbindung an Kalkulation/Buchhaltung:** Wenn ein
Entwurf fertig ist, geht er an die Kalkulation. Planer erwarten, dass sie im System sehen können, wenn das
Angebot fertig ist oder wenn Rechnungen rausgehen (um den Projektstatus nachzuverfolgen). Umgekehrt
sollte die Planung Info bekommen, wenn der Kunde zahlt oder Änderungen wünscht. Kurzum, die
**Bereichsgrenzen** (Planung – Kalkulation – Buchhaltung) sollen im Tool fließend sein, damit Planung nicht
im Blindflug arbeitet.

- **Konzept-Fit:** Die **360°-Projektsicht** garantiert, dass Planer bei Projektstart alles parat haben, was der
  Vertrieb erfasst hat – vom Kundenbriefing bis zu Fotos. Keine Zettelwirtschaft mehr: Das **digitale Briefing**
  ersetzt die Mappe. **Aufgaben & Workflows:** Hier glänzt das System: Wenn der ADM To-Dos eingibt („Layout
  bis 15.03. zeichnen“), werden diese als Aufgabe an die Planung weitergeleitet. Zusätzlich generiert das
  System standardmäßige Aufgaben pro Phase (z.B. in Phase „Entwurf“ eine Aufgabe „Entwurfspräsentation
  vorbereiten“) – Planer können diese ergänzen oder anpassen. Alle Aufgaben haben Deadlines und
  Verantwortliche; in der Team-Ansicht sehen Planer und Leitung, wer was bis wann erledigen muss. **Status-**
  **Updates:** Das System bietet eine **Status-/Fortschrittsfunktion** , mit der Planer Meilensteine markieren
  können („Entwurf fertiggestellt am 10.03., liegt bei Kalkulation“). Der Vertrieb sieht dies live im
  Kundenprofil/Projekt, ohne Rückfrage. Das reduziert Nachtelefonieren und erhöht Transparenz.
  **Kollaboration:** Die **Kommentarfunktion** ermöglicht genau die gewünschten Kontext-Diskussionen. z.B.
  Planer schreibt im Projekt: „@Kalkulator: Bitte Materialkosten für Alternative B prüfen“ – der Kalkulator sieht
  das und antwortet im selben Thread. Alle Absprachen sind später nachvollziehbar, was Entscheider
  entlastet. **Dokumentenmanagement:** Die Projektakte erfüllt den Wunsch der Planer: Alle Dateien sind
  versioniert abgelegt. Ein Planer kann die neuste DWG hochladen, das System speichert sie und behält die
  ältere Version im Hintergrund. Andere sehen sofort die neue Datei. **CAD-Integration:** Hier gibt es (noch)
  einen **Gap** : Eine direkte technische Integration (Export aus AutoCAD per API) ist im MVP nicht vorgesehen,
  nur der Upload. Das System **kann aber DWG/PDF/JPG verwalten** , sodass zumindest die Datenhaltung
  gelöst ist. Der Bedarf, hier in Zukunft eine engere Kopplung (z.B. automatische PDF-Erstellung aus DWG) zu
  schaffen, ist erkannt – aber als Nice-to-have eingestuft. **Terminplanung & Kapazität:** Das Konzept sieht
  **Planungs-Gantts und/oder Kanban-Boards** als Option vor. Im MVP wird voraussichtlich ein simpler Gantt
  je Projekt realisiert, wo Planer ihre Phasen sehen. Die Kapazitätsübersicht (wer arbeitet parallel woran) ist
  rudimentär möglich: Im Ressourcen-Modul sieht man Projektzuordnungen je Person. Für eine detaillierte
  Auslastungsanzeige bräuchte es eine Erweiterung (im Blick für später). **Bereichsübergreifende**
  **Integration:** Planer werden spüren, dass Kalkulation und Buchhaltung im selben System sind: Sobald
  Kalkulation ein Angebot fertigstellt, kann der Planer das PDF einsehen; sobald Buchhaltung eine Rechnung
  stellt, sieht die Planung den Meilenstein „Rechnung 1 gestellt am…“. Diese Infos waren früher oft
  intransparent, jetzt sind sie da. Summa summarum: Das Konzept erfüllt die meisten Wünsche der Planer.
  **Entscheidung:** Die Projektgruppe hat für Planung viele Best Practices aus Architektursoftware
  übernommen (Phasen, Meilensteine, Versionierung) – beschlossene Sache ist z.B., _kein_ eigenes CAD zu

entwickeln, sondern lieber bestehende Tools einzubinden (eine Schnittstelle wird langfristig in Betracht
gezogen, aber nicht initial). Das war wichtig, um Scope Creep zu vermeiden. Stattdessen konzentriert man
sich darauf, den Planern administrativ den Rücken freizuhalten (durch zentrale Infos, automatische
Aufgaben). Ein noch zu beobachtender Punkt ist, ob die Planer den Wechsel zu konsequenter Systempflege
mittragen – hier wurde klar vereinbart, dass die Geschäftsführung dahintersteht und bei Bedarf
Schulungen und Regeln etabliert (z.B. „Kein Freigabemeeting ohne Statusaktualisierung im System“). Diese
**Change-Unterstützung** ist Chefsache, um die Planer zur Nutzung zu motivieren.

**➔** **Buchhaltung** – _Anna (Buchhalterin) sorgt für korrekte Rechnungsstellung, Zahlungseingang und_

_Kostenverbuchung in Projekten. Sie stellt Abschlags- und Schlussrechnungen aus und überwacht die Finanzen._

- **Anforderungen/Use Cases: Rechnungsstellung zum richtigen Zeitpunkt:** Anna will nicht länger darauf
  angewiesen sein, dass der Vertrieb ihr „zuruft“, wann zu fakturieren ist. Das System soll **automatisch**
  **Rechnungstermine einplanen** : typischerweise drei Raten – z.B. 16 Wochen vor Montage, 4 Wochen davor,
  und nach Abschluss. Sie möchte rechtzeitig erinnert werden, diese Rechnungen zu erstellen, damit keine
  Umsatzchance liegenbleibt. **Abbildung der Abschlagsrechnungen:** Das System muss ermöglichen, pro
  Projekt mehrere Teilrechnungen und eine Schlussrechnung zu verwalten, inkl. deren Beträge und
  Fälligkeiten. **Zahlungseingang & Mahnwesen:** Anna überwacht, ob Kunden fristgerecht zahlen. Bisher
  macht sie das manuell und informiert den Vertrieb bei Zahlungsverzug. Das neue Tool soll ihr anzeigen,
  welche Rechnungen überfällig sind, und ggf. standardisierte Mahnstufen unterstützen (z.B. automatische
  Erinnerung nach 7 Tagen, Mahnbrief nach 14 Tagen). **Projektkosten erfassen:** Alle Eingangsrechnungen
  von Lieferanten sowie Auslagen der Mitarbeiter müssen dem jeweiligen Projekt zugeordnet werden. Anna
  will im System z.B. sehen, welche Kosten bisher für Projekt X angefallen sind, um den Deckungsbeitrag zu
  ermitteln. Dazu gehört auch, dass Mitarbeiter unterwegs Belege (Quittungen) direkt ins Projekt hochladen
  können, anstatt Papier einzureichen. **Provisionen & Umsatzberichte:** Die Buchhaltung berechnet
  Provisionen für den Vertrieb. Dazu muss im CRM ersichtlich sein, wer welchen Auftrag hereingeholt hat
  (ggf. mit Herkunftsmarkierung)
  . Anna möchte, dass das System Provisionsansprüche nachvollziehbar
  macht – das ist eher eine CRM-Funktion, aber sie stellt die Anforderung sicher. **Compliance & Audit:** Für
  Anna als Buchhalterin wichtig: Alles Finanzrelevante muss **revisionssicher** sein. Das heißt, **lückenlose**
  **Dokumentation** aller Rechnungen/Belege, Unveränderbarkeit (keine Manipulation ohne Protokoll), und
  Einhaltung von Aufbewahrungsfristen (GoBD). Sie will sicherstellen, dass im System ein Prüfer Jahre später
  alle relevanten Belege findet, komplett und unverfälscht.
- **Konzept-Fit:** Die **Rechnungsplanung** ist integraler Bestandteil: Das Konzept nennt explizit
  „Rechnungsplanung gemäß GoBD“ als Muss-Anforderung. Praktisch bedeutet das: Beim Anlegen eines
  Projekts (oder beim Setzen des Montagedatums) erstellt das System automatisch **drei Rechnungs-**
  **Meilensteine** (oder so viele, wie im Projekt definiert) und terminiert sie: z.B. „Abschlagsrechnung 1 am
  [Datum]“ etc.. Diese erscheinen als Aufgaben in Annas Liste. So wird sichergestellt, dass **keine Rechnung**
  **vergessen** wird. Anna wird also nicht mehr vom Vertrieb abhängig sein, sondern das System „sagt ihr“,
  wann zu fakturieren ist. Das **Mahnwesen** wird ebenfalls unterstützt: Überfällige Rechnungen werden rot
  markiert; das System kann automatisch eine „freundliche Zahlungserinnerung“-Aufgabe generieren.
  Vollständig automatisierte Mahnschreiben sind als mögliche Erweiterung in Betracht gezogen.
  **Kostenverfolgung:** Das System ermöglicht es, Ausgaben dem Projekt zuzuordnen. Z.B. kann der
  Innendienst einen Lieferantenrechnungsposten ins Projekt einpflegen („Rechnung Lieferant Y, Betrag X €“).
  Mitarbeiter können über die mobile App **Belegfotos hochladen** und einer Kostenart zuordnen
  („Hotelkosten“, „Materialeinkauf“), was dann im Projekt hinterlegt wird. Anna sieht in einer
  Projektkostenübersicht Plan-Kosten vs. Ist-Kosten. Dies zahlt auch auf die GF-Anforderung
  (Deckungsbeitrag) ein. **Provisionen:** Das CRM-Teil des Systems markiert Kunden nach Akquisequelle; diese
  Info kann genutzt werden, um Provisionen zu berechnen (z.B. x% auf Eigenakquise). Das System wird hier

# 12

zumindest Daten liefern (Angebot gewonnen von MA Y) – die Berechnung selbst könnte weiterhin in Excel
erfolgen, aber es ist geplant, auch simple Provisionsreports ins Reporting aufzunehmen (als Buchhaltung-
Dashboard KPI). **Compliance:** GoBD-Konformität ist gewährleistet, indem z.B. Rechnungen als PDF im
System **unveränderbar** gespeichert werden (eine Änderung würde als neue Version erscheinen, alte
Version bleibt). Außerdem gibt es ein **Änderungsprotokoll** für finanzrelevante Felder: z.B. wenn jemand ein
Rechnungsdatum ändert, wird festgehalten wer das wann tat. DSGVO: Kundendaten und Belege werden
nur intern verwendet; das System unterstützt im Zweifel auch das Löschen personenbezogener Daten nach
Frist (offener Punkt: genaue Umsetzung). Insgesamt sind Annas Kernbedürfnisse erfüllt: **richtige Beträge**
**zum richtigen Zeitpunkt in Rechnung stellen**
und **über Zahlungen im Bilde sein** . Ein potenzieller
Gap könnte sein, ob die Integration mit Lexware reibungslos läuft – Anna braucht letztlich die Buchungen
auch in der Fibu. Aktuell ist vorgesehen, dass Rechnungen im PM-System erzeugt werden und dann als
Buchungsexport ins Fibu-System fließen (CSV-Import). Hier muss die Praxis zeigen, ob das gut funktioniert.
**Entscheidungen:** Es wurde früh entschieden, dass **GoBD/DSGVO absolute Priorität** haben – also alles, was
Anna für Audit-Sicherheit braucht, wurde ins Muss aufgenommen (z.B. revisionssichere Archivierung).
Ebenfalls beschlossen: Das System wird **kein eigenes Hauptbuch führen** , um Doppelarbeit zu vermeiden;
stattdessen werden relevante Felder mit der FiBu synchronisiert (ggf. über Schnittstelle). Für Anna heißt
das: Sie nutzt weiter ihr Buchhaltungsprogramm für USt-Voranmeldungen etc., aber alle
**Projektrechnungen entstehen im PM-System** (damit Vertrieb & PM-Team die Info haben). Das war ein
bewusster _Scope Cut_ , um nicht die gesamte Buchhaltung digital neu zu erfinden, sondern nur die
projektbezogene Seite – was Anna begrüßt hat, da sie an ihrer Finanzsoftware hängt.

# ➔ Geschäftsführung (CEO) – Herr Müller (GF) will jederzeit den Gesamtüberblick über Vertriebspipeline,

_laufende Projekte und Geschäftszahlen. Er trifft Entscheidungen auf Basis dieser Kennzahlen._

- **Anforderungen/Use Cases: Echtzeit-Management-Dashboard:** Der GF benötigt **auf Knopfdruck** einen
  Überblick: Wie viele Angebote sind offen? Wie ist der Auftragsbestand? Umsatz IST vs. Plan? Welche
  Projekte sind kritisch (Verzug, Budgetüberschreitung)?. Das Dashboard soll **alle relevanten KPIs bündeln** –
  Vertrieb, Projekte, Finanzen. **Drill-Down und Filter:** Er möchte nach Vertriebsmitarbeiter filtern können
  („Wer hat wie viel Pipeline?“), Top-Kunden nach Umsatz anzeigen, oder Projekte nach Status sortieren. Auch
  historische Trends (z.B. Umsatz nach Quartal als Chart) sind gewünscht. **Projektportfolio-Übersicht:** Eine
  Liste aller laufenden (und geplanten) Projekte mit Kerninfos: Kunde, Volumen, Start/Ende, Status (Ampel),
  Fertigstellungsgrad, verantwortlicher Projektleiter. So erkennt der GF, wo Engpässe sind. **Frühwarnsystem:**
  Er will **Alerts** bei definierten Ereignissen: „Projekt A zwei Wochen Verzug“, „Kosten in Projekt B bei 90% des
  Budgets“, „Deadline Bestellung C in 5 Tagen“. Insbesondere will er sofort informiert werden, wenn ein
  Problem auftritt, das den Unternehmenserfolg gefährden könnte (z.B. drohende Verzögerung bei
  Eröffnung). **Zeit- und Kostenerfassung:** Der GF interessiert sich dafür, wie viel _unbezahlte_ Arbeit in
  Angeboten oder Projekten steckt (Stunden und Vorleistungen). Da es eine separate Zeiterfassung gibt,
  erwartet er, dass deren Daten im PM-System sichtbar sind, sodass er sehen kann: „Projekt X – y Stunden
  investiert, z% fertig“. So kann er unrentable Projekte erkennen. **Vertriebskennzahlen & Conversion:** Er
  möchte wissen, aus wie vielen Leads Angebote werden und aus wie vielen Angeboten Aufträge
  (Angebotsquote, Auftragsquote). Ablehnungsgründe von Angeboten sollen erfasst sein (z.B. „zu teuer“,
  „Budget verschoben“), um strategische Maßnahmen abzuleiten. **Forecasting:** Der GF plant voraus – er will
  im System eine **Forecast-Ansicht** : Welche Projekte stehen in den nächsten 6-12 Monaten an (fest
  beauftragt vs. in Aussicht mit Wahrscheinlichkeit). Daraus möchte er ableiten, ob genügend Aufträge
  kommen oder ob das Vertriebsteam mehr akquirieren muss. **Benutzerrechte & Datensicherheit:** Er will
  zwar Zugang zu allen Details, aber das System soll sicherstellen, dass vertrauliche Infos (Gesamtfinanzen,
  Gehälter, Margen) nur für ihn sichtbar sind. **Berichtsexporte:** Für Gesellschafter-Meetings will der GF
  Berichte (PDF/PowerPoint) aus dem System generieren können – Monatsreport, Quartalsbericht – ohne

manuell Excel-Charts basteln zu müssen. Diese Berichte müssen mit den Zahlen der Buchhaltung
übereinstimmen (kein Zahlendschungel). **Usability:** Da der GF das System nur sporadisch nutzt, muss das
Management-Cockpit extrem einfach, visuell und selbsterklärend sein.

- **Konzept-Fit:** Für die GF-Persona wird ein **Management-Dashboard** entwickelt, das alle gewünschten KPIs
  vereint. Im Konzept ist das als Muss vorgesehen („Reporting-Dashboards pro Rolle inkl. GF“). Das
  Dashboard zeigt z.B.: _Pipeline-Gesamtwert_ , _Angebotsanzahl und -quote_ , _Auftragseingang vs. Plan_ , _Umsatz dieses_
  _Jahr vs. Plan_ , _Anzahl laufende Projekte (grün/gelb/rot)_ , _durchschnittlicher Projekt-Fertigstellungsgrad_ , _Offene_
  _Posten in €_ , etc. Grafiken wie Umsatztrend und Sales Funnel visualisieren das. Der GF kann in diesem
  Dashboard filtern (z.B. nach Vertriebler oder Region) und per Klick in Detailansichten springen.
  **Projektportfolio:** Es wird eine **Projektliste** geben, die der GF einsehen kann, mit Spalten für die genannten
  Felder (Kunde, Budget, Status...). Diese ist sortier- und filterbar (z.B. alle gelben/roten Projekte oben). So
  erkennt er schnell Problembereiche. **Alerts:** Das System hat eine **Alert-Engine** : bei Eintreten definierter
  Events generiert es eine Benachrichtigung. Der GF kann sogenannte _Watchlists_ definieren, etwa „alle
  Projekte >€100k beobachten“ oder „Projekt Meilenstein geplatzt“. Er erhält dann (im System und optional

per E-Mail) eine Meldung, z.B. „ ⚠ Projekt ALPHA: Fertigstellung verzögert (neuer Termin 2 Wochen später)“.
Dieses Frühwarnsystem setzt voraus, dass die Teams Statusänderungen pflegen – was wiederum durch die
integrierten Prozesse gefördert wird. **Zeit/Kosten:** Die Integration der Zeiterfassung ist im Konzept als
Wunsch enthalten. Konkret soll das System Summen der geleisteten Stunden pro Projekt anzeigen (Import
aus Timecard). So sieht der GF z.B.: Projekt X – 120 Stunden investiert, geplante Stunden 100, also droht
Überzug. Kosten von Lieferanten fließen ebenfalls ein, sodass er im Dashboard _Budget vs. Ist-Kosten_ je
Projekt sehen kann. Diese Funktion hängt an der Datenübergabe aus FiBu/ERP – wir planen es vorzusehen,
aber das exakte Vorgehen ist offen (siehe offene Punkte). **Conversion & Sales-Stats:** Durch die lückenlose

Abbildung von Lead → Angebot → Auftrag kann das System diese Quoten berechnen. Der GF bekommt z.B.
angezeigt: „Y Angebote wurden aus X Leads erstellt (Conversion 20%)“ und „Z Aufträge aus Y Angeboten
(Quote 50%)“. Auch kann er häufige Ablehnungsgründe aus einer Liste auswerten (sofern der Vertrieb diese
erfasst). **Forecast:** Das Opportunity-Modul erlaubt es, Abschlüsse mit Wahrscheinlichkeiten zu versehen.
Aus allen offenen Opportunities extrapoliert das System eine **Forecast-Liste** z.B. pro Quartal. Die GF-Sicht
könnte z.B. sagen: „Q3: €500k abgeschlossen + €200k in Verhandlung (Ø Wahrscheinlichkeit 60%)“. Das hilft
bei Kapazitäts- und Umsatzplanung. **Benutzerrechte:** Das Konzept implementiert eine **feingranulare**
**Rechteverwaltung** . Standardnutzer sehen nur ihre eigenen Kunden/Projekte oder aggregierte Zahlen
ohne Personendetails. Der GF hat eine Rolle mit globalen Leserechten. Außerdem werden sensible Felder
(wie Rohertrag) nur GF angezeigt. Ein **Audit-Trail** ist ebenfalls da, was GF für Revision schätzt.
**Berichtsexporte:** Es wird Standard-Reportvorlagen geben (Monatsreport). Der GF kann per Klick ein PDF
mit den aktuellen Zahlen generieren. Diese sind durch die gemeinsame Datenbasis konsistent mit der
Buchhaltung (da Buchhaltung selbst das System füttert bzw. daraus nimmt). **Usability:** Das GF-Dashboard
wird nach _KISS-Prinzip_ gestaltet: klare Kennzahlen, Ampeln, Graphen – wenig Drill-down nötig. Der GF soll
das auf Tablet im Meeting zeigen können. Dank mobiler Optimierung hat er auch unterwegs Zugriff.
Insgesamt erfüllt das Konzept die GF-Forderungen nach Transparenz und Steuerungsmöglichkeiten
**vollständig** . **Entscheidung:** Von Anfang an wurde die GF-Perspektive als strategisch wichtig priorisiert.
Daher flossen entsprechende Anforderungen in alle Module ein (z.B. Kennzahlen, Protokollierung).
Beschlossene Sache ist, dass **kein separater Excel-Report** mehr nötig sein soll – das System wird zur
„Single Source of Truth“ auch für Management-Entscheidungen. Dies fordert alle anderen Nutzer implizit
auf, ihre Daten aktuell zu halten (denn GF schaut zu!). Die Einführung des Tools hat die Rückendeckung des
GF – das wurde im Interview deutlich: Er erwartet, dass mit dem System ein Kulturwechsel hin zu mehr
Datenorientierung stattfindet. Diese Top-Down-Unterstützung ist ein Glücksfall, mindert aber auch nicht die
Notwendigkeit, das System für die operativen Nutzer attraktiv zu machen (denn nur wenn diese es nutzen,
bekommt GF seine Daten). Der GF ist ferner bereit, in die Integration der Zeit- und Finanzdaten zu

investieren, da ihm bewusst ist, dass isolierte Systeme Blindflug bedeuten. Hier wurde also entschieden:
falls nötig, wird eine BI-Lösung oder ein Datenexport aufgesetzt, um temporär die Zahlen aus FiBu/
Timecard ins Dashboard zu bringen – _die Perfektion der Integration darf den Nutzen nicht verzögern_ .

**➔** **Marketing/Grafik** – _Frau Schulz (Marketing) unterstützt Vertrieb und Außendarstellung, z.B. durch_

_Präsentationsunterlagen und Referenzen. Sie ist nicht in jedem Projekt involviert, aber nutzt Projektdaten für_
_Marketingzwecke._

- **Anforderungen/Use Cases: Angebots-Präsentationen:** Bisher erstellt Marketing oft separat aufbereitete
  Angebotsmappen (Layout, Bilder, Texte). Wunsch ist, dass das System _automatisch_ ansprechendere
  Angebots-PDFs generiert, sodass Marketing nur noch in Sonderfällen eingreifen muss. **Zugriff auf**
  **Projektdetails:** Marketing möchte fertige Projekte als Referenzen nutzen, braucht aber dafür Fotos,
  Beschreibungen etc. ohne großen Recherche-Aufwand. **Kampagnen/Newsletter:** Marketing könnte
  Kundendaten (z.B. nach Branche) für Mailings nutzen – daher sollten Kontaktdaten aus dem CRM
  exportierbar sein (gehört eher zur CRM-Domäne). **CI-Konformität:** Marketing achtet auf einheitliche
  Außendarstellung; das System sollte z.B. Vorlagen für Dokumente bieten, damit Berichte und Angebote
  konsistent gestaltet sind. - **Konzept-Fit:** Die Marketing-Persona ist weniger im Tagesgeschäft des PM
  involviert, aber profitiert von der zentralen Datenhaltung: Sie kann sich im CRM/PM-System einen
  **Überblick über Projekte** verschaffen, z.B. um Referenzen zu sammeln. Projekt **dokumente** (Fotos,
  Abschlussberichte) sind zentral hinterlegt, was ihre Arbeit erleichtert. Die Lösung sieht vor, dass **Angebote**
  **als gut formatierte PDF** aus dem System kommen, inkl. Firmenlogo und Standarddesign – damit muss die
  Grafikabteilung seltener manuell ran. Das war als Best Practice empfohlen und wird umgesetzt. Für
  Newsletter/Kampagnen wird es eine Exportfunktion der Kundendaten geben (DSGVO-konform, Opt-outs
  beachtend). Marketing hat **Leserechte** auf Projektdaten, kann aber nichts verändern – das sichert, dass sie
  immer aktuelle Infos haben (kein nachträgliches Zusammensuchen wie früher). **Entscheidung:** Marketing
  wurde als Stakeholder berücksichtigt, aber aus Kapazitätsgründen sind ihre speziellen Anforderungen
  niedriger priorisiert. Im Projektkontext war man sich einig, dass Vertrieb und Projektabwicklung Vorrang
  haben. Allerdings ist **eine konsistente CI** wichtig – daher Entscheidung: Angebotstemplates im Tool
  werden in Abstimmung mit Marketing gestaltet, sodass am Ende professionell wirkende Outputs
  entstehen. Frau Schulz weiß: Sollte Marketing perspektivisch mehr CRM-Funktionalität brauchen
  (Kampagnenmodul o.ä.), kann das später ergänzt werden. Sie ist einverstanden, dass vorerst der Fokus auf
  den operativen Projektprozess liegt.

# 4. Fachliche Anforderungen (Liste, Priorisierung,

Im Rahmen des Konzepts wurde eine vollständige **Anforderungsübersicht** für die Domäne erarbeitet und
nach Must/Should/Nice priorisiert. Nachfolgend sind die **fachlichen Anforderungen** aufgeführt – unterteilt
in **Muss-Kriterien (Must)** , **Soll-Kriterien (Should)** und **Optionale (Nice-to-have)** . Zudem werden
**Abnahmekriterien** skizziert, die definieren, wann eine Anforderung als erfüllt gilt. Abschließend werden
**Nicht-Ziele** benannt, um die Abgrenzung klarzustellen.

**Muss-Anforderungen (Priorität Hoch – essenziell für MVP):**

**Zentrale Projektakte & 360°-Sicht** – _Alle projektrelevanten Daten an einem Ort._
_Details:_ Ein neues Projekt kann manuell oder automatisch (aus gewonnenem Angebot) angelegt

1.

werden. Es enthält Stammdaten (Projektname, Kunde, Standort, Vertragswert, Start-/Enddatum,
Status) und Verknüpfungen (zugehöriges Angebot, verantwortliche Mitarbeiter, beteiligte
Lieferanten etc.). **Abnahmekriterium:** Wird ein Angebot als „gewonnen“ markiert, entsteht ein
Projekt mit allen relevanten Feldern **vorgefüllt** (Kundendaten, Angebotstitel, Summe, etc.). Tester
legt ein Angebot an, markiert es als gewonnen – das System erstellt Projekt #123 mit korrekten
Kundendaten und verknüpft das Angebot. Alle relevanten Informationen aus dem Verkaufskontext
sind ohne manuelle Nachpflege im Projekt sichtbar (Check: Kunde, Ansprechpartner, Produkte,
Notizen übernommen). **Nicht erfüllt** , wenn z.B. Felder fehlen oder neu eingegeben werden müssen.

**Projektphasen & Meilensteine definieren** – _Strukturierung des Projekts nach Phasen/Meilensteinen._
_Details:_ Das System bietet bei Projekteröffnung **Phasen-Vorlagen** (anpassbar). Standard: Planung,
Fertigung, Montage, Nachbereitung. In jeder Phase können **Meilensteine** definiert werden (z.B.
„Entwurf freigegeben“, „Montage fertig“). **Abnahmekriterium:** Projekt #123 anlegen, Phasen
erscheinen standardmäßig. Nutzer fügt einen Meilenstein „Entwurf fertig“ hinzu mit Datum. System
zeigt diesen im Projektzeitplan an. Projektstatus (Ampel) kann per Dropdown auf grün/gelb/rot
gesetzt werden; Auswahl testweise auf „Gelb“ – erscheint entsprechend im Projektportfolioübersicht
und GF-Dashboard. Erfolgreich, wenn Phasen/Meilensteine speicher- und editierbar sind und
Berichte (Status) korrekt beeinflussen.

2.

**Aufgabenmanagement & Workflows** – _To-Do-Listen mit Verantwortlichen, Fristen, Abhängigkeiten._
_Details:_ Es gibt eine **integrierte Aufgabenliste** je Projekt. Aufgaben haben Attribute: Titel,
Beschreibung, Verantwortlicher (Person/Rolle), Fälligkeitsdatum, Status (offen/in Bearb./erledigt),
Priorität, verknüpfte Phase/Meilenstein. **Abhängigkeiten** können konfiguriert werden (Task B kann
erst starten, wenn Task A erledigt, oder Deadline B = Deadline A + 14 Tage). Automatische Aufgaben-
Generierung bei bestimmten Events (siehe nächster Punkt) gehört dazu. **Abnahmekriterium:** In
Projekt #123 erzeugt System initial Aufgaben aus Template (z.B. „Kundenbriefing prüfen“). Tester
fügt manuell Aufgabe „Montage planen“ hinzu, weist Person X zu, setzt Fälligkeit 01.06.,
Abhängigkeit „nach Aufgabe ‘Produktion abschließen’“. System warnt, falls versucht wird, Enddatum
vor Start der Abhängigkeitsaufgabe zu setzen. Markiert man die vorgängige Aufgabe als erledigt,
wird Folge-Aufgabe fällig. **Erfolgreich** , wenn Aufgaben übersichtlich im Projekt angezeigt werden,
dem Verantwortlichen in seiner persönlichen Liste auftauchen und Abhängigkeiten funktionieren
(kein Erledigen möglich, solange Vorgänger offen; Warnhinweise korrekt).

**⚡ AKTUALISIERUNG 2025-01-28 - Vollständige Task Management Integration (Phase 1 MVP):**

Das System unterstützt nun **zwei Task-Typen** für unterschiedliche Anwendungsfälle:

**A) UserTask (Persönliche Aufgaben):** Verfügbar für alle Rollen. Schnelle Erstellung persönlicher To-Dos (z.B. "Kunde zurückrufen in 3 Tagen"), optional verknüpfbar mit Kunde/Opportunity/Projekt. Status: Open, In Progress, Completed, Cancelled. Priorität: Low/Medium/High/Urgent. Mobile-optimiert mit Offline-Unterstützung und Swipe-Gesten.

**B) ProjectTask (Projekt-Arbeitsaufgaben):** Für GF/PLAN/INNEN/KALK. Immer an Projekt gebunden, mit Phasenzuordnung (Planning/Execution/Delivery/Closure) und Meilenstein-Verknüpfung. Erweiterte Status: Todo, In Progress, Review, Done, Blocked (Blockierungsgrund erforderlich). Priorität: Low/Medium/High/Critical. Team-Sichtbarkeit für alle Projektteilnehmer.

**Dashboards:** Rollenspezifische Ansichten - "Meine Aufgaben" (persönlicher Überblick), "Team-Aufgaben" (GF/PLAN Management-Sicht), Projekt-Board (Kanban-Ansicht in Phase 2). Automatische Warnungen für Überfällige Aufgaben.

**RBAC-Integration:** GF sieht/ändert alle Aufgaben. PLAN: eigene + zugewiesene Projekte. ADM: nur eigene UserTasks + Lesezugriff auf eigene Kundenprojekte. INNEN/KALK: eigene UserTasks + ProjectTask-Zugriff auf alle Projekte. BUCH: eigene UserTasks + Lesezugriff auf alle ProjectTasks.

**Phase 2+ Features (architektonisch vorbereitet, nicht MVP):** Aufgaben-Abhängigkeiten, Subtasks, Zeiterfassung, wiederkehrende Aufgaben, Gantt-Chart, Ressourcen-Auslastung.

**Siehe vollständige Spezifikationen:** data-model.md (Entities), api-specification.md (Endpoints), rbac-permissions.md (Permissions), ui-ux/ (UI-Komponenten, Forms, Dashboards, Mobile).

3.

**Automatisierte Workflow-Trigger** – _Automatisches Anlegen von Aufgaben/Terminen bei definierten_
_Ereignissen._
_Details:_ Bestimmte Statuswechsel oder Eingaben lösen vordefinierte Aktionen aus. Beispiele: Beim
Status „Auftrag erteilt“ generiert das System eine Aufgabenliste (Bestellungen auslösen,
Montagetermin koordinieren, Abschlagsrechnungstermine). Beim Erreichen eines Meilensteins
„Montagetermin gesetzt“ legt es 16 und 4 Wochen vorher je eine Aufgabe „Abschlagsrechnung
stellen“ an. Wenn der Außendienst einen „Kontaktbericht“ mit To-Do „Layout zeichnen“ speichert,
wird im verknüpften Projekt eine Aufgabe für Planung erstellt. **Abnahmekriterium:** a) Ändert man
in Projekt #123 den Status von „Verhandeln“ zu „Beauftragt“, tauchen automatisch definierte
Aufgaben auf (z.B. „Projekt anlegen Innendienst“ – in unserem System wird Projekt ja schon
existieren, also andere: „Materialdisposition prüfen“, „Montage planen“ etc., gem. Template). b) Setzt
man im Projekt den Montagebeginn = 01.09., erzeugt System Abschlagsrechnungs-Aufgaben für
01.05. und 01.08. (16 und 4 Wochen vorher). c) Speichert Außendienst in CRM-Aktivität: „Besuch
Kunde X – ToDo: Grundriss anpassen bis 15.04. (Planer)“, so erscheint im entsprechenden Projekt

4.

(oder allgemeiner Aufgabenliste der Planung) eine Aufgabe „Grundriss anpassen“ mit Fälligkeit
15.04., Verantwortlicher Planung. **Erfolg** , wenn alle drei Szenarien korrekt abgebildet werden, und
die Aufgaben wie erwartet im System erscheinen (und bei den richtigen Personen sichtbar sind).

**Dokumentenmanagement & Versionierung**
–
_Zentrale Ablage aller Projektdateien mit_
_Versionshistorie._
_Details:_
Jedes Projekt hat einen Dokumenten-Bereich. Dateien können hochgeladen,
heruntergeladen, und in Ordnern organisiert werden. **Versionierung:** Lädt man eine Datei gleichen
Namens erneut hoch, fragt das System, ob es eine neue Version ist. Alte Versionen bleiben erhalten
(mit Änderungsdatum/User). **Meta-Daten:** Dateien können kategorisiert werden (Plan, Angebot,
Abnahmeprotokoll etc.). **Abnahmekriterium:** In Projekt #123 lädt Planer eine Datei „Grundriss.pdf“
hoch. Später lädt er eine aktualisierte Datei gleichen Namens hoch -> System speichert als Version 2,
zeigt bei Datei „Grundriss.pdf (v2)“ an. Benutzer kann ältere Version (v1) einsehen und vergleichen
(z.B. Dateigröße/Datum). Mehrere Dateien (PDF, JPG, DOCX, DWG) hochladen: alle sind anzeigbar
oder zumindest downloadbar. Zugriffstest: Innendienst und Vertrieb mit Zugriffsrecht können Datei
öffnen. Versuch, 100MB-Datei hochzuladen, funktioniert (Performance im Rahmen). **Bestanden** ,
wenn Dateien zuverlässig gespeichert werden, Versionsverlauf einsehbar, Berechtigungen
respektiert (z.B. externer Partner sieht nur freigegebene Dateien – falls Berechtigungskonzept es
vorsieht).

5.

**Berichts- und Dashboard-Funktion** – _Echtzeit-Reporting je Rolle (GF, Vertrieb, Innendienst, etc.)._
_Details:_ Das System stellt vordefinierte Dashboards bereit: **GF-Dashboard** (KPIs zu Pipeline, Umsatz,
Projekte), **Vertriebsdashboard** (eigene Leads, Angebotsquote, Top-Kunden), **Projektdashboard** (für
Innendienst/PM: z.B. Anzahl offene Aufgaben, fällige Bestellungen, Projekte im Verzug). **Drill-down:**

6.

Von einer Zahl kann man in die Liste dahinter springen (z.B. Klick auf „5 überfällige Aufgaben“ →
Anzeige dieser 5 Aufgaben). **Berichte:** Neben Live-Dashboards sind Standardberichte (PDF/Excel)
generierbar, z.B. Monatsreport. **Abnahmekriterium:** a) Anmeldung als GF: Dashboard zeigt
definierte KPIs (ggf. mit Dummy-Daten im Test). Plausibilitätscheck: Summen stimmen mit den in
Test angelegten Daten überein (z.B. 2 Angebote offen mit Gesamtwert X, entspricht den tatsächlich
erfassten Opportunities). b) Klick auf „Offene Projekte“ führt zu Projektliste. c) Wechsel zu Benutzer
Innendienst: dessen Dashboard enthält andere Widgets (OP-Liste, kommende Meilensteine etc.). d)
Berichtsexport: System erzeugt aus GF-Sicht einen PDF-Bericht – Prüfer kontrolliert, ob die Zahlen
den Dashboard-Werten entsprechen und das Layout wie vordefiniert ist (Logo, Datum, Titel
stimmen). **Erfolgreich** , wenn Dashboards rollenabhängig korrekte Inhalte zeigen und Berichte auf
Abruf erstellt werden können.

**Rechnungs- und Zahlungsmanagement (projektspezifisch)** – _Planung, Erstellung und Tracking von_
_(Teil-)Rechnungen im Projekt._
_Details:_ Pro Projekt können eine oder mehrere Kundenrechnungen angelegt werden. Es gibt
Templates für Abschlags- und Schlussrechnung. Eine Rechnung enthält Positionen (idealerweise
automatisch aus Angebot generiert, aber auch manuell editierbar), Rechnungsdatum,
Fälligkeitsdatum, Status (entwurf/gesendet/bezahlt/etc.). **Zahlungsüberwachung:** Man kann einen
Zahlungseingang dokumentieren (Datum, Betrag; falls Teilzahlung, Rest offen wird angezeigt).
Überfällige Rechnungen werden markiert. **Integration:** Exportmöglichkeit an Fibu (z.B. als
Buchungssatz).
**Abnahmekriterium:**
a) In Projekt #123 erzeugt Innendienst eine
Abschlagsrechnung über €10.000, Fälligkeit 01.08. System vergibt Rechnungsnummer, listet
Angebotspositionen und PDF kann erzeugt werden. b) Buchhalter markiert Rechnung am 05.08. als

7.

„gezahlt“ – Payment-Date erfasst. c) Zweite Rechnung (Schlussrechnung) erstellt, bleibt unbezahlt →
nach Fälligkeit + 1 Tag erscheint im System ein Warnhinweis „Rechnung überfällig“ und eine Aufgabe
„Zahlungserinnerung schicken“. d) Rechnungsjournal im System zeigt beide Rechnungen mit Status
und ermöglicht Export (z.B. CSV), der mit Lexware kompatibel ist (Prüfung des Formats). **Bestanden** ,
wenn Rechnungen korrekt erstellt, summiert (MwSt-Berechnung etc.) und ihr Status im Projekt
ersichtlich ist, inklusive Überfälligkeitslogik.

**Lieferanten- und Bestellverwaltung (light)** – _Verknüpfung von Lieferanten und Bestellungen mit_
_Projekten._
_Details:_ Das System verwaltet Lieferantenstammdaten (Name, Kontakt, Kategorie/Gewerk, Verträge).
Innerhalb des Projekts kann der Innendienst **Bestellungen** erfassen: Lieferant auswählen,
Bestelltext (oder Artikel aus Katalog auswählen), Bestellwert, erwartetes Lieferdatum. **Status**
(bestellt/geliefert/beanstandet). **Reklamationen:** Möglichkeit, einen Mangel zu vermerken (incl.
Beschreibung, Datum, Status „in Klärung/behoben“). Später Auswertung: z.B. Lieferant XY – 5
Bestellungen, 2x verspätet, 1x Mangel. **Abnahmekriterium:** a) Anlegen eines neuen Lieferanten im
Adressbuch – erscheint in Lieferantenauswahl. b) In Projekt #123 erstellt Innendienst Bestellung
„Möbelpaket“ bei Lieferant Müller, Wert €15.000, Lieferdatum 10.05. eingetragen. Diese Bestellung
wird unter Projekt->Bestellungen angezeigt. c) Wird das Datum 10.05. überschritten
(Simulationsweise Systemdatum vorspulen oder manuell als „nicht erhalten“ markieren), erscheint
Warnhinweis im Projekt und im Innendienst-Dashboard („Lieferung Müller verspätet“). d) Markieren
als erhalten am 15.05., dann „Reklamation hinzufügen“ (z.B. „Kratzer an Theke“). Diese Reklamation
wird beim Lieferanten Müller gespeichert. e) Im Lieferantenmodul sieht man bei Müller eine Liste
aller Projekte/Bestellungen inkl. Status. **Erfolg** , wenn Bestellungen projektspezifisch erfasst und
getrackt werden können, Datenkonsistenz gewahrt (Lieferantendaten zentral) und einfache Reports
zur Lieferantenperformance möglich sind (z.B. manuell via Export oder im UI ersichtlich).

8.

**Berechtigungs- und Rollenkonzept** – _Geregelter Zugriff auf Daten nach Rolle._
_Details:_
Das System muss flexibel einstellen lassen, wer was sehen/bearbeiten darf.
Mindestanforderungen: **Vertrieb** darf nur „seine“ Kunden/Projekte bearbeiten (bei KMU evtl. offener,
aber generell), **Planung** sieht alle Projekte, aber ggf. keine vertraulichen Finanzdetails, **Buchhaltung**
sieht alle Finanzen, aber könnte Verkaufschancen ausblenden, **GF** sieht alles. Mitarbeiter ohne PM-
Bezug (z.B. Grafik) haben nur Lesezugriff auf Projekte. Änderungen an kritischen Feldern (Preise,
Rechnungen) sollen nur berechtigte Rollen vornehmen dürfen. **Audit-Trail:** Das System protokolliert
Änderungen an Schlüsseldaten (Wer hat wann Status geändert, Angebotssumme geändert etc.).
**Abnahmekriterium:** a) Erstellen von Usern mit Rolle Außendienst, Innendienst, Planung,
Buchhaltung, GF. b) Einloggen als Außendienst: Versuch, ein Projekt eines Kollegen zu öffnen ->
entweder nicht sichtbar oder schreibgeschützt (je nach Policy). Kann aber _seine eigenen_ Projekte voll
einsehen und Notizen hinzufügen. c) Außendienst sieht keine internen Kalkulationsspalten (z.B.
Marge). d) Planung-User sieht Projektdetails und Aufgaben, aber Finanzsektion (Rechnungen,
Deckungsbeitrag) ist entweder nicht sichtbar oder read-only. e) Buchhalter-User sieht Finanzdaten
aller Projekte, darf aber z.B. Vertriebs-Chancenmodul nicht editieren. f) GF-User sieht alles. g)
Änderungstest: Planung ändert ein Meilenstein-Datum -> im Audit-Log erscheint Eintrag mit User,
Zeit, alter vs. neuer Wert. **Erfüllt** , wenn die Rechte in typischen Szenarien greifen (keine unbefugten
Zugriffe möglich) und der Änderungsnachweis vollständig ist.

9.

**Nicht-funktionale Muss-Kriterien:** _(Querschnitt, aber hier zusammengefasst)_

10.

**Usability & Performance:** Intuitive Bedienung (UI orientiert sich an gängigen Web-
Standards, klare Navigation pro Rolle). Mobile Optimierung (responsive Design für
Smartphone). **Quantifizierte Reaktionszeiten (NFR_SPECIFICATION.md):** API-Antworten P50 ≤400ms / P95 ≤1,5s / P99 ≤2,5s; Dashboard-Laden P95 ≤3s (GF-Dashboard ≤4s); Suchanfragen P95 ≤500ms; keine spürbare Verzögerung bei Eingabe (<50ms clientseitig). **Abnahme:**
Usability-Test mit repräsentativen Usern; Performance-Lasttest mit 20 gleichzeitigen Nutzern (getestet bei 25) und realistischem Datenvolumen (1.500 Kunden, 120 Projekte, 5.000 Aufgaben) – System erfüllt alle NFR-Ziele mit <5% Fehlerrate.
**Offline-Fähigkeit Außendienst:** Kernmodule (Kunden, Projekte, Aufgaben, Kontakte)
müssen offline lesbar und editierbar sein. Abgleich erfolgt automatisch bei
Netzverfügbarkeit. **Abnahme:** Netz aus -> Dateneingabe vornehmen -> Netz an -> Daten sind
serverseitig aktualisiert, kein Verlust.
**Compliance (DSGVO, GoBD):** DSGVO: Personenbezogene Datenfelder kennzeichnen,
Löschkonzept (z.B. Kunde archivieren -> auf Anfrage löschbar). GoBD: Unveränderbarkeit (z.B.
durch Versionsarchiv oder Logging sichergestellt), maschinelle Auswertbarkeit (Exports
vorhanden), Aufbewahrung (Datensicherung mind. 10 Jahre). **Abnahme:** Audit-Szenario:
Prüfer erhält Auswertungen aller Rechnungen eines Jahres, alle mit Zeitstempel und ohne
Lücken; Test, ob eine Rechnung nachträglich geändert werden kann (soll nicht ohne
Nachweis gehen).
**Sicherheit:** Rollenkonzept (s.o.), Verschlüsselung der Datenbank (bes. Kundendaten),
regelmäßige Backups. **Abnahme:** Pentest/Code-Review durch IT, Test: Benutzer ohne Rechte
versucht, URL einer fremden Projekt-ID aufzurufen -> Zugriff verweigert.

**Soll-Anforderungen (Priorität Mittel – wünschenswert, aber nicht kritisch für MVP):**

**Erweiterte Kapazitätsplanung:** Grafische Darstellung der Auslastung je Mitarbeiter (z.B. Balken pro
Projekt in einem Teamkalender). MVP bietet Grundfunktionen, aber als Soll gilt: Einführung einer
Planer-Matrix, wo Projekte vs. Planer über Zeit abgebildet sind, um Überlast zu erkennen.
_Abnahmekriterium:_ Entwurf eines Kapazitäts-Dashlets, das mind. pro Woche die Zuordnung je Person
zeigt (kann initial auch via Export nach Excel gelöst werden, um Feedback einzuholen).

1.

**Schnittstelle Zeiterfassung:** Automatischer Import der geleisteten Stunden pro Projekt aus dem
vorhandenen Tool. _Kriterium:_ Stunden werden 1x täglich synchronisiert und im Projekt als „Ist-
Aufwand“ angezeigt. (Notwendig für exakte Margenberechnung; falls nicht MVP, dann manuelle
Eingabe als Übergang.)

2.

**Outlook-Integration:** Synchronisierung von Terminen (Kundentermine, Projekttermine) mit
Outlook/Exchange. _Kriterium:_ Wenn der Innendienst einen Montagetermin im System einträgt,
erscheint dieser im Outlook-Kalender der Beteiligten als Termin (und umgekehrt optional).

3.

**Erweiterte Angebotserstellung mobil:** Außendienst kann über Tablet ein Angebot konfigurieren
(Positionen hinzufügen aus Produktkatalog, Preise kalkulieren) und dem Kunden als PDF schicken,
ggf. mit elektronischer Unterschrift. (Im MVP rudimentär möglich, aber als Soll die komfortable
mobile UX). _Kriterium:_ Markus erstellt auf dem iPad ein Angebot und kann es dem Kunden mailen,
ohne PC.

4.

**Erinnerungsfunktionen Vertrieb:** Z.B. automatischer Reminder an ADM 3 Monate nach
Projektabschluss, den Kunden für Zufriedenheits-Check anzurufen (Nachbetreuung). _Kriterium:_
Solche Wiedervorlagen konfigurierbar.

5.

**Grafische Auswertung Lieferantenleistung:** Ampel pro Lieferant auf Basis On-Time-Delivery und
Mängelquote. (Aus den erfassten Bestelldaten berechnet). _Kriterium:_ Bericht „Lieferantenranking“
vorhanden.

6.

**Mehrsprachigkeit & Internationalisierung:** Falls das Unternehmen expandiert (nicht akut), soll das
System mehrsprachig ausgebaut werden können. _Kriterium:_ Konzeptnachweis, dass Strings
separiert, Datum/Währung einstellbar.

7.

**Nice-to-have (Priorität Niedrig – optional, Zukunftsmusik):**

**CAD/BIM-Integration:** Direkter Import/Export von Planungsdaten (z.B. .dwg Upload wandelt in
Vorschau um; oder Plugin für AutoCAD). Dies wäre eine Arbeitserleichterung, aber kein Kern des PM-
Systems.
**KI-gestützte Analysen:** Z.B. automatische Risikoerkennung („Projekt mit vielen Aufgaben überfällig
– Risiko hoch“) oder Prognosen (Machine Learning auf Projektdaten).
**Modul für Service/Nachbetreuung:** Ticketing für Gewährleistungsfälle, das aus abgeschlossenen
Projekten generiert wird.
**Erweiterte Provisionsabrechnung:** Automatische Berechnung der Vertriebsprovision pro Auftrag
und Integration ins Payroll.
**Mobile App als native App:** Aktuell vsl. Web-App; als Nice eine native Smartphone-App mit Push-
Notifications, Offline-Fähigkeit, Kamera-Integration (für Belegfoto direkt hochladen etc.).

**Abnahmekriterien allgemein:** Für alle Muss-Anforderungen wird ein **User-Acceptance-Test** mit den Key-
Usern (aus jeder Abteilung mindestens einer) durchgeführt. Die Abnahme gilt als erfolgreich, wenn jede
Muss-Anforderung in einem realitätsnahen Szenario demonstriert wird und die Key-User bestätigen, dass
die Funktion ihren Anforderungen entspricht. Etwaige kleinere Abweichungen werden dokumentiert und in
einer Nachbesserungsrunde behoben.

**Nicht-Ziele (Expliziter Ausschluss):** Um Klarheit zu schaffen, wurden folgende Punkte als _nicht im Scope_
definiert: - **Eigenständiges CAD/Grafik-Modul:** Das System wird **kein Zeichenprogramm** sein. Es ersetzt
nicht AutoCAD, Photoshop o.ä., sondern dient als Management-Plattform für die daraus resultierenden
Dateien. (Planer nutzen weiterhin ihre Tools; das PM-System sorgt für Orga drumherum.) - **Komplette**
**Finanzbuchhaltung:** Weder Hauptbuchhaltung noch Anlagenbuchhaltung oder Lohnabrechnung sind Teil
des Systems. Die Lösung konzentriert sich auf **projektbezogene Finanzprozesse** (Rechnungen,
Budgetkontrolle). Finanzdaten werden für Reporting zusammengeführt, aber es findet **keine Buchhaltung**
**im rechtlichen Sinne** statt (dafür bleibt das ERP/FiBu-System zuständig). - **HR-Management/**
**Personaleinsatzplanung:** Abwesenheitsverwaltung, Urlaubsplanung, Stundenabrechnung etc. sind kein
Ziel. Die Ressourcensicht bezieht sich nur auf grobe Projektplanung. - **Eigenes ERP für Produktion:** Falls
das Unternehmen ein Fertigungssystem oder Warenwirtschaft hat, wird dieses angebunden, aber nicht
durch das PM-Tool ersetzt. Das Tool plant Termine und speichert Stücklisten, aber **Produktionssteuerung**
(Maschinenplanung, Lager) ist nicht inkludiert. -
**Marketing-Automation:**
Newsletter-Versand,
Kampagnenmanagement o.ä. ist nicht Teil des Kernsystems. Das CRM deckt Grunddaten ab; darüber
hinausgehende Marketingfeatures gelten als später mögliche Erweiterung. - **Hardware/IoT-Integration:** Es

---

_Page 21_

---

ist kein Ziel, IoT-Geräte oder Sensoren (z.B. RFID zur Bautagebuchführung) anzubinden – solche Ideen
wurden verworfen, da Overkill im Kontext. - **Multi-Kunden-Fähigkeit (Produktgeschäft):** Das System wird
für dieses eine Unternehmen maßgeschneidert; eine Vermarktung als Standardsoftware ist kein
unmittelbares Ziel, daher keine besonderen Funktionen für Mandantenfähigkeit o.ä. (Dennoch wird eine
gewisse Generik angestrebt, falls Firma wächst, aber primär Fokus auf aktuelle Strukturen).

Diese Nicht-Ziele sichern, dass das Projekt fokussiert bleibt und liefern allen Beteiligten Klarheit, was sie
_nicht_ vom System erwarten sollten.

# 5. Produktvision & Zielbild (Statement,

**Produktvision (Statement):**
_„Unsere integrierte CRM- und Projektmanagement-Lösung schafft eine_
_durchgängige Plattform, die Vertrieb und Projektabwicklung vereint. Sie ermöglicht eine 360°-Sicht auf Kunden_
_und Projekte für alle Rollen, beseitigt Medienbrüche und stellt sicher, dass Ladenbauprojekte effizient, transparent_
_und zu voller Kundenzufriedenheit umgesetzt werden.“_

Diese Vision betont das **Wertversprechen** : ein _einziges System_ als **„Single Source of Truth“** für das gesamte
Projektgeschäft. Es verspricht: - **Nahtlose bereichsübergreifende Prozesse:** Vom ersten Kundenkontakt
bis zur Montage sind alle Schritte digital verknüpft – kein Informationsverlust an Abteilungsgrenzen. Die
Übergabe vom Verkauf an die Umsetzung verläuft reibungslos, da das System alle nötigen Daten
übernimmt und weiterführt. - **Steigerung von Effizienz & Qualität:** Automatisierte Workflows und zentrale
Daten reduzieren manuelle Doppelarbeit drastisch. Das führt zu schnelleren Durchlaufzeiten (z.B. Angebots-

> Auftragswandlung auf Knopfdruck, keine Neuerfassung) und weniger Fehlern (kein falsches Datum
> abgetippt, keine veraltete Version genutzt). Gleichzeitig erhöht es die Qualität der Arbeitsergebnisse:
> Angebote sind präziser, Projekte laufen im Plan, Kunden werden zur richtigen Zeit informiert. - **Transparenz**
> **& Entscheidungsgrundlage:** Jeder Beteiligte – vom Außendienst bis zur Geschäftsführung – erhält
> **realtime Einblick** in den Projektstatus und relevante Kennzahlen. Führungskräfte können auf Basis
> aktueller Zahlen steuern; das Bauchgefühl wird durch Daten untermauert. Probleme werden früh sichtbar
> (Ampel, Alerts) und können proaktiv gelöst werden. -
> **Verbesserte Zusammenarbeit &**
> **Kundenzufriedenheit:** Durch das integrierte Kommunikations- und Aufgabenwesen arbeitet das Team
> koordinierter zusammen. Nichts „fällt durchs Raster“, weil Aufgaben klar zugewiesen und getrackt werden.
> Für den Kunden bedeutet dies: konsistente Betreuung (er muss nicht jedem neuen Ansprechpartner alles
> erneut erklären), verlässliche Termine, und ein professioneller Auftritt – was die Kundenzufriedenheit und
> Wiederkaufsrate steigert.

**Zielbild fachliche Architektur:** Auf fachlicher Ebene besteht das System aus mehreren **Domänenmodulen**
(vgl. Abschnitt Domänen-Kontext). Für das Projektmanagement-Zielbild besonders relevant ist das
harmonische Zusammenwirken folgender Module: - **CRM-Modul (Kontakt & Vertrieb):** Hier werden
Kunden, Leads und Opportunities verwaltet. **Zielbild-Prozess:** Ein Vertriebler legt einen Lead an, pflegt
Kontakthistorie, wandelt ihn ggf. in eine Opportunity (Verkaufschance) um. Er erstellt darin ein Angebot mit
Hilfe des integrierten Kalkulations-Werkzeugs. Sobald der Kunde „Ja“ sagt, klickt der Vertriebler auf _„Projekt_
_erstellen“_ – und das System erzeugt aus der Opportunity ein Projekt in der PM-Domäne. Alle relevanten

Daten fließen über (Kundendaten, Angebot als Anhang, gewonnene Summe, Notizen etc.). Die
Verkaufschance wird als „gewonnen“ markiert, was ins Vertriebsreporting einfließt, und die
Projektumsetzung startet. - **Projektmanagement-Modul:** Dieses erhält den neuen Projekt-Datensatz und
ist von da an federführend. **Zielbild-Prozess:** Der Innendienst (Projektkoordinator) wird automatisch
benachrichtigt über den neuen Auftrag und ergänzt ggf. weitere Infos (internes Projektkürzel, zuständige
Planer etc.). Das System generiert eine _Projektstruktur_ mit Standardphasen und Aufgaben (konfigurierbar je
nach Auftragsart). Die Planungsabteilung wird durch das Zuweisen erster Aufgaben ins Boot geholt

(„Detailplanung erstellen bis XY“). Ab dann läuft der Projektlebenszyklus: Planung ↔ Kunde

(Entwurfsphasen), Kalkulation ↔ Planer (Angebotsanpassungen), Freigabe, Ausführungsplanung,
Bestellung, Fertigung, Montage, Abnahme. Das Tool unterstützt jeden dieser Schritte (siehe unten: fachliche
Zielprozesse), z.B. indem es Meilensteine zur Abnahme setzt oder Checklisten für die Montage bereitstellt.
Ist das Projekt fertig, dokumentiert der Planer dies (Projektstatus auf „abgeschlossen“) und das System
archiviert das Projekt (schreibgeschützt, aber weiter einsehbar für Referenzen und Audits). - **Lieferanten/**
**Bestell-Modul:** Parallell dazu interagiert das PM-Modul mit dem Lieferantenmodul. **Zielbild:** Während der
Planungs-/Kalkulationsphase werden benötigte Zukaufteile identifiziert. Der Innendienst erstellt daraus
Bestellungen im System, die dem Lieferantenmodul einen neuen Eintrag hinzufügen („Bestellung offen“).
Das Lieferantenmodul verwaltet zentrale Infos (z.B. welcher Lieferant wurde wie oft genutzt, Bewertung).
Sobald Bestellungen markiert als geliefert/erledigt, fließt die Info zurück ins Projekt (Aufgabe „Material
eingetroffen“ wird automatisch abgehakt). - **Finanz-Modul (Billing/Controlling):** Dieses Modul umfasst die
Rechnungs- und Zahlungskontrolle. **Zielbild:** Im Projekt sind im Reiter „Finanzen“ alle vorgesehenen
Teilzahlungen aufgelistet (ggf. vom Angebot generiert: z.B. 30%/50%/20% Meilensteine). Die Buchhalterin
erstellt aus diesen geplanten Zahlungen tatsächliche Rechnungsdokumente per Klick (System füllt
Kundenadresse, Projektbezug, Betrag aus). Diese Rechnungen werden dem Kunden gesendet (außerhalb
System oder via E-Mail-Versand im System, je nach Implementierung). Das Finanz-Modul verfolgt, ob
Zahlung eingegangen (ggf. via Bankupload oder manuell) und ändert den Status. Bei Überfälligkeit
generiert es Mahn-Hinweise. Für den GF stellt das Finanz-Modul in Zusammenarbeit mit dem Reporting-
Modul Kennzahlen wie Umsatz, offene Forderungen etc. bereit. Wichtig: Das Finanz-Modul synchronisiert
relevante Buchhaltungsdaten mit dem externen Buchhaltungssystem, damit kein manueller
Buchungsaufwand entsteht. - **Reporting & Dashboard-Modul:** Querschnittlich aggregiert dieses Modul
Daten aus CRM, PM, Lieferanten und Finance. **Zielbild:** Es gibt einen Bereich „Auswertungen“, in dem
Benutzer je nach Rolle vordefinierte Dashboards sehen (wie oben beschrieben). Hier laufen die Fäden aus
allen Modulen zusammen, um ein **integriertes Bild** zu liefern. Beispielsweise summiert es aus CRM: Anzahl
Opportunities, aus PM: Anzahl laufende Projekte, aus Finance: Umsatz realisiert. Es erlaubt aber auch Ad-
hoc-Reports (Pivot-ähnlich: z.B. Liste aller Projekte > €50k mit Enddatum im nächsten Quartal).

**Fachliche Zielprozesse:** Im angestrebten Soll-Zustand gestalten sich die **End-to-End-Prozesse** deutlich

schlanker und transparenter als im Ist: - _Beispiel 1: Angebotsphase_ _→_ _Auftragsstart:_ Heute: Außendienst
schickt interne Mail an Innendienst mit Notizen; Planung beginnt unabhängig, Excel-Listen... Zukünftig: Der
ADM pflegt alles in der Opportunity. Sobald er auf „Angebot freigegeben“ klickt, sind seine Notizen
(Kundenwünsche, Maße, Fotos) bereits in der Datenbank verfügbar. Der Planer schaut ins System, sieht
unter „Offene Aufgaben“: „Layout erstellen für Kunde X“ und hat Zugriff auf alle Infos dort. Wenn das
Angebot final vom Kunden angenommen wird, muss der Innendienst nicht händisch Projektmappen
kopieren – er klickt _„Projekt erstellen“_ , und das System macht aus der Verkaufsakte eine Projektakte. Er prüft
kurz die übernommenen Daten, ergänzt Teammitglieder – fertig. In einem Kickoff-Meeting (das System
hätte sogar das Meeting als Aufgabe anstoßen können) sehen alle Beteiligten im Projekt die historischen
Aktivitäten (Kundenmeetings, Angebote) und starten mit vollem Kontext. -
_Beispiel 2:_
_Änderungsmanagement:_ In Ladenbau-Projekten sind Änderungen häufig. Heute: Wenn der Kunde nach der

Präsentation eine Änderung will, muss der Planer das intern kommunizieren, neuer Plan, neuer Preis, etc.,
oft verwirrend welche Version aktuell ist. Im Soll-Prozess: Der Planer aktualisiert den Entwurf und lädt neue
Dateien hoch (die alten bleiben als V1 erhalten). Er setzt den Projektstatus zurück auf „In Überarbeitung“
oder fügt einen Kommentar „Kunde wünscht Änderung A, neue Version in Arbeit“. Der Innendienst sieht
diese Statusänderung und weiß, dass kein Angebot rausgeht bis zur Freigabe. Die Kalkulation wird
automatisch informiert („Planer hat Entwurf V2 hochgeladen“) und passt die Kosten an. Über das System
wird die neue Angebotsversion erstellt (Version 2, mit Änderungsmarkierung zum alten Angebot). Der
Außendienst kann dem Kunden über das Kundenportal (optional) die aktualisierten Unterlagen schicken
oder vor Ort präsentieren, mit der Gewissheit, dass es die _richtige_ Version ist. Jede Änderungsschleife ist
damit nachvollziehbar dokumentiert (Zeitpunkt, wer hat was geändert). Das minimiert Missverständnisse
und Fehler (z.B. versehentlich mit alter Planversion gearbeitet). - _Beispiel 3: Umsetzung & Montage:_ Heute:
Projektleiter (Innendienst) pflegt einen Excel-Zeitplan, ruft Lieferanten an, E-Mails wegen Terminen – viel
persönliches Gedächtnis. Im Zielprozess: Sobald der Auftrag fix ist, generiert das System den
Projektzeitplan mit Standard-To-Dos. Sabine (Innendienst) sieht im Projekt #123 z.B. „T.-Nr.5: Montagetermin
mit Kunde vereinbaren (fällig bis 01.08.)“ und „T.-Nr.7: Montage-Team einplanen (bis 15.08.)“. Sie trägt den
vom Kunden gewünschten Termin 01.09. ein – das System prüft im Ressourcenplan kurz, ob Monteure
verfügbar sind (grünes Signal, da frei). Sie bestellt rechtzeitig die Möbel beim Lieferanten via System, was
ihr gleich ermöglicht, den Liefertermin einzutragen (z.B. 25.08.). Das Team vor Ort nutzt evtl. mobile Zugriff:
Der Montageleiter kann im Projekt per Tablet das Abnahmeprotokoll ausfüllen. Nach Fertigstellung setzt er
den Meilenstein „Montage fertig am 02.09.“. Sofort werden die nachgelagerten Aufgaben aktiv:
Buchhaltung sieht „Schlussrechnung stellen“ als fällig, Vertrieb sieht „Kunden nach Feedback
fragen“ (Nachbetreuung) in 2 Wochen. Der GF-Dashboard-Indikator für Projekt #123 springt auf
„Grün“ (erfolgreich abgeschlossen). **So verzahnt greifen alle Schritte ineinander** , was früher manuell
nachgehalten wurde.

Im **Zielbild** arbeitet die gesamte Firma also mit **einer gemeinsamen Anwendung** – jeder in seiner
spezifischen Oberfläche, aber alle auf derselben Datenbasis. Ein plakatives Bild: Morgens öffnet jeder
Mitarbeiter das Tool als erstes: - Der **Außendienst** sieht auf seinem Tablet seine heutigen Termine und die
Projekt-Updates: „Projekt Aldi Süd: Montage abgeschlossen gestern (Foto ansehen)“. Er fährt beruhigt zum
nächsten Kunden, weil er genau weiß, wie der Status aller laufenden Projekte ist. - Der **Innendienst** sieht
eine Ampelliste aller Projekte: 5 grüne, 1 gelb (Lieferverzug), 1 rot (Budget überzogen). Für das gelbe hat er
bereits automatische Erinnerungen an den Lieferanten geschickt, für rot setzt er sofort ein Meeting an. -
Die **Planer** sehen ihre Aufgaben: „Projekt X – Entwurf bis Freitag“, „Projekt Y – Feedback von Kunde
bearbeiten“. Alle nötigen Infos (Briefe, Fotos) sind an den Aufgaben dran, kein Suchen mehr. - Die
**Buchhalterin** sieht im Dashboard: „Heute Zahlungseingang prüfen für Rechnung #1003“. Sie checkt es ab,
das System markiert Rechnung als bezahlt, wodurch beim Vertrieb im Kundenprofil „bezahlt“ erscheint –
kein Telefon nötig. - Der **Geschäftsführer** klickt aufs Dashboard und sieht: Umsatz Q3 on track, aber zwei
Projekte haben Terminrisiko. Er fragt den Projektleiter (Innendienst) im System via Kommentar, was Plan B
ist – der reagiert direkt dort. Im Meeting mit Gesellschaftern zeigt er einen aktuellen Projektstatusbericht
als PDF, alle sind beeindruckt von der Klarheit und Aktualität der Zahlen.

**Kultureller Wandel im Zielbild:** Das System unterstützt nicht nur Prozesse, es fordert auch einen gewissen
Wandel: _Transparenz_ und _Verantwortungsteilung_ nehmen zu. Jeder weiß, dass andere auf seine Eingaben
angewiesen sind (z.B. Planer müssen Status pflegen, damit Vertrieb informiert ist). Dieser Wandel wurde
von allen mitgetragen, weil das **Warum** klar ist: Weniger Stress, weniger Chaos, mehr Erfolg für alle. Die
Vision beinhaltet daher auch den Slogan: _„Eine Anwendung statt Ordnerchaos – für uns alle der einfachere_
_Weg.“_ (Zitat aus Interview: „eine Applikation statt Ordnerstruktur“).

Insgesamt zeichnet das **Zielbild** eine Organisation, die digital **vernetzt** und **proaktiv** arbeitet: Das
Projektmanagement-Tool fungiert dabei als _digitaler Projektleitstand_ , der jederzeit Auskunft geben kann: _Wer_
_macht was bis wann? Wo stehen wir? Was kommt als Nächstes?_ – sowohl für den kleinsten Task als auch auf
Gesamtportfolio-Sicht. Dieses Bild gilt es durch die Umsetzung Realität werden zu lassen.

# 6. Lösungsweg (fachliches Design, Alternativen,

Die Realisierung der Vision erfolgt durch ein sorgfältig abgestimmtes **fachliches Lösungsdesign** , das sich
an den Anforderungen und Rahmenbedingungen orientiert. Dabei wurden verschiedene
**Lösungsalternativen** abgewogen und **Trade-offs** bewusst entschieden.

**Fachliches Design – Überblick:**
Wir entwickeln ein **modulares integriertes System** , das alle benötigten Funktionsbereiche umfasst (CRM,
PM, Lieferanten, Finance, Reporting) – jedoch logisch getrennt nach Domänen, um Komplexität zu
managen. Es handelt sich um eine **Web-Anwendung** (zugänglich über Browser, ggf. ergänzt um mobile App
für Offline). Die Architektur ist rollenbasiert: nach Login sieht der User ein **rollen-spezifisches UI** (z.B.
Außendienst bekommt mobile-optimierte Oberfläche mit Kundennavigation und Offline-Sync, Innendienst
eine Desktop-Oberfläche mit Projektlisten und Detailmasken).

**Domain-Driven Design:** Jede fachliche Domäne (Vertrieb, Projektmanagement, etc.) wird als **Modul** oder
Kontext umgesetzt, mit klar definierten Schnittstellen dazwischen. So können wir z.B. das CRM-Modul
separat testen/entwickeln vom PM-Modul, obwohl sie im Betrieb integriert sind. Datenmodell und
Geschäftslogik orientieren sich an den Domänenerkenntnissen: z.B. Entität _Projekt_ mit Aggregat _Aufgaben_ ,
Entität _Angebot_ mit Kind _Angebotspositionen_ , usw. Diese Struktur folgt den in den Anforderungen
identifizierten Objekten.

**Benutzeroberfläche & UX-Design:** Wir verfolgen ein **kontextsensitives UI-Design** : Das System zeigt dem
Nutzer stets das, was er in seiner Rolle am häufigsten benötigt (z.B. Startseite Außendienst = Kalender +
Kundensuche; Startseite Planer = Aufgabenliste + Projektübersicht). In Workshops mit Endanwendern
wurden Click-Dummies geprüft, um sicherzustellen, dass die Navigation intuitiv ist. **Design-Prinzipien:**
Weniger ist mehr – gerade für GF und Außendienst werden komplexe Daten in einfacher Visualisierung
geboten (Graphen statt Tabellen, Ampeln statt langer Listen). Für den Innendienst, der detailliert arbeitet,
gibt es hingegen tabellarische Ansichten, Filter und Massenbearbeitungsoptionen (ähnlich Excel, um
Vertrautheit zu schaffen). **Mobile vs Desktop:** Das UI wird responsive gestaltet. Kernfunktionen
(Kundeninfo, Aufgaben abhaken, Notizen diktieren) funktionieren auf Smartphone. Umfangreiche
Funktionen (z.B. Angebotskalkulation mit vielen Positionen) sind primär für Desktop vorgesehen – hier ist
ein _Trade-off_ : mobile Angebotserstellung wurde als nice-to-have eingestuft, um das mobile UI schlank zu
halten (Entscheidung: zuerst Fokus auf mobile Nutzung für CRM/Projekt-Status, nicht für komplexe
Dateneingaben).

**Workflow-Engine:** Herzstück der Lösung ist eine flexible Workflow-Engine, die definierte Regeln umsetzt
(z.B. Trigger bei Statuswechseln). Anstatt starre Abläufe zu codieren, setzen wir auf **regelbasierte**
**Workflows** , die auch angepasst werden können, falls Prozesse sich ändern. Trade-off hier: Eine voll
konfigurierbare BPM-Engine wäre zu aufwendig; wir implementieren die wichtigsten Workflows hartcodiert

(z.B. To-Do-Erstellung bei Auftragsbestätigung), aber designen das System so, dass zukünftige Änderungen
relativ leicht implementierbar sind (z.B. Parametertabellen für Fristen). So halten wir Balance zwischen
Flexibilität und Entwicklungsaufwand.

**Datenhaltung & Integrität:** Wir streben ein zentrales relationales Datenmodell an, um Konsistenz zu
sichern (ein Kunde – eine Kundentabelle; Projekt mit Fremdschlüsseln auf Kunde, Angebot etc.). Gleichzeitig
nutzen wir Caching/Indexing für Performance (Trade-off: etwas komplexere Technik, aber nötig für schnelle
Abfragen bei Dashboard). Business Rules sorgen für Datenintegrität: z.B. ein Projekt kann erst
„abgeschlossen“ werden, wenn alle Aufgaben erledigt und Rechnungen gestellt sind (oder es gibt
Warnhinweis). Wir haben uns gegen “dirty hacks” entschieden, stattdessen sind solche Regeln formal im
System hinterlegt.

**Alternativen & Erwägungen:** - _Alternative 1: Standard-Software vs. Eigenentwicklung_ : Das Team evaluierte
vorhandene Software (Insightly, Salesforce + Project-Module, vTiger, Monday.com). **Ergebnis:** Diese Tools
decken tatsächlich ~80% der Anforderungen ab (bes. CRM, Task-Management, Pipeline). Jedoch gab es
**Differenzierungsmerkmale** : keine Standard-Lösung bot out-of-the-box die gewünschte _Offline-Funktion_ ,
die spezifische _deutsche Abschlagsrechnungslogik_ oder die _komplette Integration aller Abteilungen_ in einem
System. Anpassungen wären nötig gewesen. Man stand vor dem Trade-off: _Eine bestehende Lösung anpassen_
(weniger Entwicklungsaufwand, aber möglicherweise Workarounds und Lizenzkosten) vs. _Eigenentwicklung_
(maßgeschneidert, dafür mehr initialer Aufwand). **Entscheidung:** Aufgrund der genannten Lücken (Offline,
GoBD, branchenspezifische Workflows) und weil man keine Abhängigkeit von einem Hersteller wollte,
wählte man **Eigenentwicklung** . Hier war ausschlaggebend, dass die Kernprozesse als _USP_ des
Unternehmens betrachtet werden – diese wollte man nicht an ein Standardtool angleichen, sondern
umgekehrt das Tool an die Prozesse. Zudem versprach man sich langfristig _Wettbewerbsvorteile_ , wenn das
System genau zum Unternehmen passt (und evtl. sogar als Produkt angeboten werden könnte, falls es sehr
erfolgreich ist). Der Trade-off ist natürlich: höherer Entwicklungsaufwand, benötigte Kompetenzen in-house,
und das Rad in Teilen neu erfinden. Dies hat man durch eine gute Planung und modulares Vorgehen
abgefedert. - _Alternative 2: Separate Spezialtools für jede Abteilung vs. integriertes System:_ Vor Projektstart gab
es Überlegungen, ob man z.B. ein spezielles Planungstool (für Architekten) plus ein Vertriebstool plus eine
Schnittstelle nutzen sollte. Vorteil: Jede Abteilung hätte ihr optimales Werkzeug. Nachteil: Silos bleiben,
Integrationsaufwand. **Entscheidung:** Ganz klar pro _integrierte Lösung_ (One-App-Strategy). Der Trend am
Markt geht auch dorthin (CRM+PM in einem). Der Mehrwert, den die GF-Persona fordert –
bereichsübergreifende Transparenz – wäre mit separaten Tools kaum erreichbar. Also nehmen wir in Kauf,
dass manche Module nicht alle Finessen einer Spezialsoftware haben (Trade-off: z.B. hat unser Planungsteil
keine CAD-Funktion, aber das nehmen die Planer in Kauf, weil sie weiter ihr AutoCAD nutzen dürfen). Wir
fokussieren darauf, **Schnittstellen zu Spezialsoftware** offen zu halten (z.B. Imports/Exports), um das Beste
aus beiden Welten zu ermöglichen. - _Alternative 3: Sofort vollständige Lösung vs. iteratives Vorgehen:_ Es stand
im Raum, alles auf einmal zu entwickeln und „Big Bang“ einzuführen, vs. schrittweise Module ausrollen.
**Entscheidung:** Ein _phasenweises, agiles Vorgehen_ wurde gewählt. Zuerst werden CRM (Vertrieb) und PM-
Kern entwickelt und pilotiert, dann Lieferanten+Finance Module, dann Reporting und Feinschliff. Trade-off:
In der Übergangszeit muss evtl. noch altes Excel für Reports herhalten, bis das Reporting-Modul fertig ist.
Man nimmt diese **temporäre Doppelarbeit** in Kauf, um Risiken zu minimieren und schneller einen MVP
nutzen zu können. Der Vorteil: Frühfeedback der Nutzer im echten Einsatz, worauf iterativ aufgebaut wird. -
_Alternative 4: Offline-Fähigkeit über native App vs. Web mit Cache:_ Für Offline hätte man eine native App
(Android/iOS) entwickeln können. Vorteil: bessere Performance offline, Zugriff auf Device-Features. Nachteil:
Doppelter Entwicklungsaufwand, da neben Web. **Entscheidung/Trade-off:** Start mit einer **Progressive Web**
**App (PWA)** , die offline-fähig ist (via Browser Cache, Service Worker) – damit kann der Außendienst schon

mal offline arbeiten. Sollte sich herausstellen, dass native Apps gebraucht werden (z.B. Kamera-Zugriff für
Fotos, bessere Hintergrundsynchronisation), kann man in Phase 2 immer noch eine App entwickeln. So
konzentriert man sich zunächst auf eine Codebasis. - _Trade-off Usability vs. Funktionsumfang:_ Immer ein
Thema: ein System kann entweder extrem feature-reich oder extrem einfach sein – beides zusammen ist
schwer. Unser Ansatz: **„Komplexität unter der Haube, Einfachheit an der Oberfläche.“** D.h. wir gestalten
die UI so, dass Standardnutzer nur das sehen, was sie brauchen; fortgeschrittene Funktionen sind „da, aber
stören nicht“. Beispiel: Das System unterstützt komplexe Angebote mit Unterpositionen – aber der normale
Vertriebler sieht zunächst eine einfache Angebotsmaske (Standardpositionen), nur bei Bedarf kann er einen
„Expertenmodus“ aktivieren für Sonderfälle. So versuchen wir den Spagat: Die nötigen Finessen sind
implementiert, aber im Tagesgeschäft drängen sie sich nicht jedem Nutzer auf. Dieses Konzept wurde mit
den Personas abgesprochen und positiv aufgenommen („nicht jeder braucht alle Buttons“). - _Trade-off_
_Flexibilität vs. Standardisierung:_ Einerseits sollen Prozesse wie sie sind digitalisiert werden (und in manchen
Punkten flexibel bleiben, z.B. anpassbare Felder). Andererseits bietet eine gewisse Standardisierung Vorteile
(klar definierte Felder, Auswertbarkeit). Wir haben uns entschieden, **zentrale Prozesse strikt zu führen** ,
aber an den Rändern flexibel zu sein: z.B.
**Angebotsprozess** : im Tool sind die Schritte

Lead → Opportunity → Angebot → Projekt fix (so bleibt Sales Funnel auswertbar). Aber innerhalb eines
Projekts können die Nutzer relativ frei zusätzliche Aufgaben, Notizen und Dateien anlegen (um z.B.
projektspezifische Sonderprozesse abzubilden). So bleibt das System anschlussfähig an individuelle
Bedürfnisse, ohne die Kernstruktur zu verlieren. - _Trade-off Integrationen:_ Wir überlegen bei jedem externen
System: Daten ins PM-Tool holen oder dort belassen? Faustregel: **Alles, was projektrelevant ist, gehört**
**ins PM-System** . Deshalb holen wir z.B. die summierten Ist-Stunden pro Projekt aus der Zeiterfassung rein,
weil GF das zur Projektsteuerung braucht. Detaillierte Stundenzettel pro Mitarbeiter belassen wir aber im
Zeiterfassungstool (GF will nur Summen). Ähnlich bei Fibu: Offene Posten und Rechnungsstatus kommen
ins PM-System (wichtig für Vertrieb/Buchhaltung daily business); detaillierte Konten oder USt.-Themen nicht
(bleiben in Lexware). Dieser Trade-off hält die Komplexität im PM-Tool geringer, aber gibt den Nutzern alle
Infos, die sie für Projekte benötigen.

**Architekturalternativen** (technisch nur kurz angerissen, da Fokus fachlich): On-Prem vs Cloud – man
entschied sich voraussichtlich für **Cloud (Software-as-a-Service intern)** , da Mitarbeiter viel unterwegs sind
und mobil zugreifen. Zudem erleichtert das Updates und Wartung. Security wird über VPN/HTTPS gelöst.
Eine On-Prem-Lösung wäre alternativ machbar gewesen (teils sensitiv Finance-Daten), aber Cloud mit
deutschem Hosting wurde als vertretbar und agiler gesehen (Trade-off: Abhängigkeit von Internet, aber
offline-Fähigkeit als Gegenmaßnahme).

**Zusammenfassend** : Der Lösungsweg orientiert sich am Motto _„Maximum Nutzen bei vertretbarem Aufwand“_ .
Wir leiten uns an bewährten Lösungen (Marktstandard-CRM und PM-Funktionalität), passen diese aber auf
die Unternehmens- **DNA** an, statt das Unternehmen dem Tool unterzuordnen. Wo nötig, werden
Kompromisse gemacht – immer mit dem Anwendernutzen im Blick.

Durch **iterative Entwicklung** und **Einbeziehung der Endnutzer** (Key-User) ins Design wird sichergestellt,
dass die gewählte Lösung den Praxis-Test besteht. Jeder Trade-off bleibt beobachtet: wir sind bereit,
nachzusteuern, falls z.B. Usability unter Funktionsballast leidet (im Zweifel lieber ein Feature streichen oder
verschlanken, bevor die Nutzung sinkt). Die Entscheidungshoheit liegt im interdisziplinären Team (inkl.
Vertretern aller Abteilungen), sodass fachliche und technische Perspektiven gemeinsam abgewogen
werden – das hat bereits bei den obigen Entscheidungen gut funktioniert und wird fortgeführt.

In der Umsetzung wird auch auf **Change Management** als Teil des Lösungswegs gesetzt: frühzeitige
Schulungen, Pilotphasen, Feedbackschleifen. Fachlich wird so nicht nur eine Software eingeführt, sondern
auch neue Arbeitsweisen etabliert – der Lösungsweg verzahnt daher _technische Einführung_ und
_organisatorische Veränderung_ eng miteinander.

# 7. Schnittstellen (Domänen, Übergaben,

Die Domäne _Projektmanagement & -durchführung_ steht in regem Austausch mit anderen Domänen und
Systemen. Um einen reibungslosen Prozessablauf sicherzustellen, sind klare
**Schnittstellen,**
**Übergabepunkte, Verantwortlichkeiten und Abhängigkeiten** definiert:

**1. Schnittstelle Vertrieb (CRM/Opportunity)** **→** **Projektmanagement:**
**Übergabepunkt:** Wenn ein Angebot vom Kunden angenommen wird, erfolgt die Übergabe ins
Projektmanagement.
**Technische Schnittstelle:** _In-App_ -Übergabe (da Module integriert): Der Datensatz _Opportunity/Angebot_ wird
in einen _Projekt_ datensatz umgewandelt. Alle relevanten Felder (Kunde, Opportunity-ID, Angebotspositionen,
Notizen, zuständiger ADM etc.) werden übernommen.
**Verantwortlichkeiten:** _Vor_ Übergabe: Vertrieb (Außendienst) ist verantwortlich für Pflege des Angebots
und Kundendaten. _Nach_ Übergabe: Innendienst/Projektleitung übernimmt federführend das Projekt.
Trotzdem bleibt der Außendienst **Hauptansprechpartner zum Kunden** (Face to the Customer). Daher hat
der Außendienst ein berechtigtes Interesse und Zugriffsrecht auf „seine“ Projekte, um jederzeit
Kundenfragen zum Status beantworten zu können. Die Verantwortung für inhaltliche Projektsteuerung liegt
aber beim Innendienst/Planung.
**Abhängigkeiten:** Der Projektstart hängt ab vom _Vertriebsprozess_ – kein Projekt ohne gewonnenes Angebot.
Verzögert sich die Angebotserstellung oder Freigabe durch den Kunden, verschiebt das den Start aller
nachgelagerten PM-Aktivitäten. Diese Abhängigkeit wird entschärft durch: a) Statussicht im System, die
Planern anzeigt, ob ein Projekt schon „gewonnen“ ist oder noch _Opportunity_ (so verschwenden Planer keine
Zeit auf ungewisse Projekte), b) Forecast-Funktion, die Planung grob vorwarnen kann, welche Projekte mit
X% Wahrscheinlichkeit kommen. Außerdem definieren wir den _„Point of no return“_ : erst wenn der Kunde
schriftlich zusagt (Status Opportunity=gewonnen), wird das Projekt offiziell angelegt und Verantwortungen
wechseln.

**2. Schnittstelle Planung** **↔** **Innendienst/Kalkulation (interne Übergaben):**

**Übergabepunkte:** a) Nach Vertriebsbriefing → Planungsstart, b) Nach Entwurfsfertigstellung → Kalkulation

zur Angebotserstellung, c) Nach Kundenfeedback → ggf. zurück an Planung (Änderungen), d) Nach

Kundenzusage → Ausführungsplanung & Bestellung (Planung ↔ Innendienst).
**Verantwortlichkeiten:** - _Planungsstart:_ Außendienst übergibt Infos an Planung. Früher Gespräch+Ordner,
jetzt über System: Planer erhalten automatisch Task „Projektübernahme & Briefing prüfen“, mit allen CRM-
Infos angehängt. Hier ist der **Außendienst verantwortlich** , seine gesammelten Daten vollständig im
System zu haben, und der **Planer verantwortlich** , sich diese anzueignen (Häkchen an Aufgabe). - _Entwurf_

_fertig_ _→_ _Kalkulation:_ Planer setzen den Status „Entwurf fertig“ + laden Unterlagen hoch. Eine Aufgabe
„Angebot erstellen“ wird für Kalkulation aktiv. Ab dann ist **Kalkulation (Innendienst)** in der Verantwortung,
das detaillierte Angebot auszuarbeiten. Planer stehen für Rückfragen bereit (oft kurze Abstimmung inntern,
jetzt via Kommentare möglich). Sobald Kalkulation fertig, markiert sie Aufgabe als erledigt + hängt Angebot

an. - _Kundenfeedback_ _→_ _Änderungen:_ Falls Kunde noch Änderungen will, setzt Außendienst den Status
„Änderungsschleife“ und notiert Feedback im System. Das erzeugt neue Aufgaben für Planer (z.B. „Entwurf
anpassen“) und ggf. für Kalkulation („Angebotspreis anpassen“). **Verantwortung** springt wieder zur
Planungsabteilung, diesen Änderungswunsch umzusetzen, in
**Zusammenarbeit**
mit Kalkulation
(Preisanpassungen). Hier ist _gemeinsame Verantwortung_ , aber klar definierte Teilaufgaben: Planer ändern
Gestaltung, Kalkulator die Zahlen. Außendienst vermittelt bei Unklarheiten mit dem Kunden. -

_Kundenzusage_ _→_ _Ausführung:_ Wenn Kunde final zustimmt (Projekt „gewonnen“), **Verantwortung wechselt**
deutlich zum **Innendienst/Projektleiter** , die nun Ausführung steuern. Planer übergibt finalen Entwurf
(Status „Entwurf freigegeben“) und erstellt Ausführungspläne. Ab jetzt hat Planer eine _Unterstützer-Rolle_ : sie
machen Werkpläne, beantworten Rückfragen während Fertigung/Montage, sind aber dem Projektleiter
(Innendienst) unterstellt was Terminprioritäten angeht. Sprich, **Planer verantwortlich für Qualität/**
**Design** , **Innendienst verantwortlich für Termine/Kosten** . Das System spiegelt das: Innendienst wird als
_Projektleiter_ im System geführt, Planer als _Teammitglied_ . **Abhängigkeiten:** - Planung hängt von guten
Vertriebsinfos ab (Abhängigkeitsrisiko: Wenn Vertrieb unvollständige Angaben macht, leidet Planung. Mit
System: Vertrieb muss Pflichtfelder erfüllen, z.B. Raummaße, Budgetvorgabe – sonst kann er Angebot nicht
finalisieren.). - Kalkulation hängt von Planung ab: Kein Angebot ohne Entwurf. Systemabhängigkeit: erst
wenn Planungs-Task erledigt und Dokumente hochgeladen, wird die Kalkulations-Task freigegeben. -

Umgekehrt: Planung darf nicht weiter entwerfen, wenn Kunde grundlegendes ändert → hier sorgt das
System durch Versionierung und Status dafür, dass alle sehen, ob noch Schleife läuft oder final ist. -
Engpass-Personal: Planer sind oft Flaschenhals (wenig Planer, viele Projekte). Durch die Kapazitätsübersicht
Schnittstelle (Planungsboard vs. Vertriebsplanung) können Innendienst und GF sehen, wann Planer
ausgelastet sind, damit Vertrieb keine unrealistischen Versprechen gibt („Design in 2 Wochen“ obwohl
Planer voll sind). Das bedingt, dass Außendienst-Eingaben (Opportunity-Wahrscheinlichkeit, erwarteter
Auftragseingang) in den Forecast fließen, der wiederum Planungs-Auslastungsvorschau speist – im System

realisiert als Verknüpfung CRM → Ressourcenplanung (eingeplante potentielle Projekte als Schatten in
Kapazitätsplan). So greifen die Abteilungen prognostisch ineinander.

**3. Schnittstelle Projektmanagement** **→** **Buchhaltung (Rechnung & Zahlung):**
**Übergabepunkte:** a) Rechnungsstellung (wenn eine im Projekt vorgesehene Rechnung fällig wird), b)
Zahlungseingang (wenn Kunde zahlt oder nicht zahlt), c) Projektabschluss (für Finanzabschluss).
**Verantwortlichkeiten:** - _Rechnungsstellung:_ **Buchhaltung** ist verantwortlich, die Kundenrechnung zu
erstellen und zu versenden. Das System übergibt Buchhaltung alle nötigen Infos: Projekt, Betrag,
Leistungszeitraum, Zahlungsplan. Die Buchhalterin (Anna) nutzt ein Rechnungsmodul im System (falls sie es
vorzieht, könnte sie auch im Lexware fakturieren, dann aber Zahlungen ins System zurückspielen –
möglichst vermeiden). Nach Erstellen markiert sie im Projekt „Rechnung gestellt am…“ (das triggert z.B. den
Start der Zahlungsfristzählung). - _Zahlungseingang:_ **Buchhaltung** überwacht Bank und trägt im System
Zahlungseingänge ein (oder importiert aus Banksoftware). Wenn bis zum Fälligkeitsdatum keine Zahlung
markiert: System generiert Erinnerung/Mahnaufgabe. Buchhaltung hat Verantwortung für’s Mahnwesen
(Vertrieb wird aber informiert, um Kunden ggf. informell anzustupsen). - _Projektabschluss (kaufmännisch):_
Wenn Projekt fertig und letzte Rechnung bezahlt, markiert Buchhaltung das Projekt finanziell als
„abgeschlossen“ (könnte z.B. Kennziffer Deckungsbeitrag final berechnet werden). Damit gehen finanzielle
Kenndaten ins Reporting (z.B. tatsächliche Marge). GF ist mitverantwortlich, Projekt erst dann wirklich zu
schließen, wenn alles fakturiert/gezahlt ist – System unterstützt das durch z.B. Ampel rot, falls man
Projektstatus auf „Closed“ setzen will, während offene Posten bestehen. **Technische Schnittstelle:** -
_Rechnungsübergabe an Fibu:_ Je nach Integrationstiefe: Das System könnte einen Buchungssatz via XML/CSV
an Lexware übergeben (Rechnung Nr, Kunde, Netto, Steuer, Erlöskonto). Das muss noch final festgelegt
werden (Platzhalter). Minimal: Rechnungslistenexport, den Buchhaltung manuell verbucht. Optimal: API/

Automatik, aber Lexware API hat Einschränkungen – evtl. ein Trade-off: erstmal manueller Export. -
_Zahlungsimport:_ Buchhaltung könnte Kontoauszüge importieren, System ordnet Zahler zu Projekt-
Rechnungen (via Verwendungszweck). Oder manuell: Anna klickt „Zahlung erhalten“ und tippt Datum/
Betrag. **Abhängigkeiten:** - Finanzsoftware: Unsere Rechnungsnummern müssen mit Lexware abgestimmt
sein, damit keine Doppelnummern entstehen – daher Abh. von Setup in Lexware (Startnummern oder
Nummernkreis-Ausnahme). - Die **Qualität der Rechnungstermine** aus Projektplanung beeinflusst
Cashflow: Das Tool plant 16/4 Wochen, aber wenn Montage verschoben, muss Innendienst unbedingt
Termin anpassen, sonst geht Rechnungserinnerung an falschem Datum raus. Hier greifen die Module
ineinander: Änderung Montage-Datum -> System verschiebt Rechnungstermine entsprechend. - **GoBD-**
**Abhängigkeit:** Wir müssen gewährleisten, dass alle Rechnungsdaten revisionssicher sind. Das heißt z.B.,
dass Buchhaltung nicht einfach eine Rechnung löschen kann, die im Projekt war, ohne Spur. Daher ist das
Berechtigungssystem kritisch (Abhängigkeit: Konfiguration, dass Rechnungen nur storniert, aber nicht
gelöscht werden können). - **Org.-Verantwortung:** Buchhaltung und Innendienst müssen eng kooperieren:
Innendienst triggert bestimme Finanz-Ereignisse (Freigabe Teilrechnung), Buchhaltung liefert Feedback ins
Projekt (z.B. "Zahlung da"). Im alten Prozess war das manuell, jetzt übernimmt das System einen Teil.
Trotzdem definieren wir Prozesse: z.B. wenn Mahnstufe 2 erreicht, Info an Vertrieb (Verantwortung dann,
Kundenbeziehung zu pflegen). Das System leitet zwar Info, aber die Handlung selbst (Kundenanruf) liegt
beim Vertrieb – hier klar Verantwortlichkeit belassen, System nur als Vermittler.

**4. Schnittstelle Projektmanagement** **→** **Lieferanten/Partner:**
**Übergabepunkte:** a) Bestellung bei Lieferant auslösen, b) Wareneingang/Rückmeldung, c) ggf.
Reklamation.
**Verantwortlichkeiten:** Der **Innendienst/Projektleiter** ist verantwortlich für die Steuerung der Lieferanten.
D.h. er erstellt im System die Bestellung (oder generiert ein Bestell-PDF, das er dem Lieferanten mailt). Nach
Versenden wechselt Verantwortung temporär zum **Lieferanten** (in Realwelt: er muss liefern). Das System
überwacht Termin und erinnert den Innendienst, falls Lieferung ausbleibt – Innendienst muss dann
nachfassen (Verantwortung im Mahnen von Lieferanten). Bei Wareneingang erfasst Innendienst oder
Lagerist im System „erhalten“ (Verantwortung, das zeitnah zu tun, da Daten sonst unbrauchbar).
Reklamationen: wenn z.B. gelieferte Ware mangelhaft, der Projektleiter erfasst es, aber die Abarbeitung
(Ersatzlieferung organisieren) liegt auch bei ihm, in Zusammenarbeit mit Lieferant. **Technische**
**Schnittstelle:** Hier ist noch keine automatische EDI oder dergleichen geplant. Die Schnittstelle ist eher
organisatorisch: das System stellt alle Lieferanteninfos bereit, aber die Kommunikation mit dem Lieferanten
erfolgt derzeit außerhalb (Telefon/Mail). Ein Nice-to-have könnte eine Lieferantenportal-Funktion sein, aber
nicht im MVP. Stattdessen: Bestellungen können als PDF erzeugt werden, die man dem Lieferanten mailt.
Lieferant meldet sich per Mail bei Innendienst – Innendienst trägt ins System ein. **Abhängigkeiten:** -
Datenqualität Lieferant: Unser System nur so gut wie die Stammdaten. Deshalb muss Einkauf/
Lieferantenmanagement (vielleicht Marketing/GF anteilig) Lieferantendaten aktuell halten
(Ansprechperson, Konditionen). - Externe Abhängigkeit: Liefertermine können verschoben werden, was
Kettenreaktion auf Projekt hat. Daher definieren wir im System Abhängigkeiten: Eine Montage-Aufgabe
kann abhängig sein von Lieferaufgabe, um Impact zu zeigen. Aber letztlich kann Tool Verzögerung nur
anzeigen, nicht verhindern. - In Zukunft denkbar: Kopplung an Lieferanten-ERP (manche große Lieferanten
haben Portale) – aktuell nicht im Scope, aber offen halten (Schnittstellen-Architektur modular). -
**Vertragswesen:** Bei neuen Lieferanten oder wichtigen Verträgen (z.B. Wartung) könnte GF involviert sein –
unser System hält zwar Verträge als Dateien, aber verhandeln muss GF offline. Das ist akzeptiert, aber als
Hinweis: System deckt nicht Verhandlung ab, nur Dokumentation.

**5. Schnittstelle Projektmanagement** **→** **externe Produktion/Fertigung:**
Im gegebenen Kontext wird Fertigung meist an Partner (z.B. Schreinereien) vergeben. Die Schnittstelle
ähnelt der Lieferantenschnittstelle: Der Fertigungspartner ist letztlich ein Lieferant (Lieferantentyp
„Produktion“). **Übergabe:** Planungsabteilung erstellt Werkplan & Stückliste, Innendienst generiert
Bestellung „Produktion von Möbel X“ an Schreiner, inkl. CAD-Zeichnungen als Anhang. Ab dann wie normale
Bestellung. **Verantwortung:** Koordination liegt beim Innendienst/Planer. Der Partner liefert (baut Möbel,
liefert oder montiert je nachdem). Eventuell gibt es hier Zwischenschritte (Freigabe von
Produktionszeichnungen) – diese können als Meilenstein im Projekt angelegt werden („Produktion

freigegeben“), Verantwortlicher Planungsleiter z.B. Diese _interne Schnittstelle_ Planer ↔ externer Fertiger
definieren wir: Planer liefert Zeichnung an Fertiger (per E-Mail oder Plattform falls vorhanden), Fertiger
meldet Machbarkeit o.k. zurück, Planer markiert „Werkplanung freigegeben“. **Abhängigkeiten:** -
Terminlich: Fertigung muss vor Montage fertig, ergo Fertigstellungstermin Fertiger = Input für
Montageplanung. Innendienst muss diese Info vom Fertiger einholen und ins System eintragen (z.B. als
Liefertermin der Bestellung). - Qualitätsabhängig: Falls Fertiger Probleme meldet (Material nicht verfügbar),
fließt das an Planer zurück – im System würde man eine Änderung/Kommentar einstellen. Heikel, aber
systemseitig schwer automatisierbar (eher Kommunikation). - **Schnittstelle ERP:** Sollte das Unternehmen
doch ein eigenes ERP für Produktionsplanung einführen (für die Partnerkoordination), muss unser System
andocken. _Design-Vorsorge:_ Wir exportieren z.B. Stücklisten als Excel, die ein anderes System einlesen
könnte, oder bieten API-Endpunkte an, um Auftragsdaten abzurufen. Dieser Punkt ist offen, aber
architektonisch so gelöst, dass wir unsere Daten leicht zugänglich machen (z.B. REST-API pro Projekt). Ein
Partner könnte also theoretisch direkt Informationen bekommen, wenn man ihm Zugriff gewährt. Fürs
Erste bleibt es manuell.

**6. Rollen & Verantwortlichkeiten im Prozess (RACI):**
Klarheit über Verantwortungen ist erfolgskritisch, daher noch mal in RACI-Matrix-Form für Hauptphasen:

- **Lead/Opportunity (Akquise):** _Responsible:_ Außendienst, _Accountable:_ Vertriebsleiter/GF (in Mittelstand oft
  GF). _Consulted:_ Innendienst (für Standardunterlagen), _Informed:_ GF über Pipeline. - **Angebot &**
  **Vertragsabschluss:**
  _Responsible:_
  Innendienst (Kalkulation) für Angebotserstellung,
  _Accountable:_
  Außendienst für inhaltliches Angebot (da Kundenkontakt) – also beide eng verzahnt. _Consulted:_ Planer (bzgl.
  Machbarkeit/Kosteninputs), GF (bei großen Rabatten). _Informed:_ GF via Pipeline-Dashboard, Planer über
  Angebotsausgang (damit sie wissen ob Projekt kommt). - **Projektplanung (Entwurf):** _Responsible:_ Planer,
  _Accountable:_ Planungsleiter (oder GF, falls er da rein will), _Consulted:_ Außendienst (Kundenfeedback),
  _Informed:_ Innendienst (über Fortschritt, damit er Bescheid weiß wann Angebot raus kann). -
  **Projektkoordination**
  **&**
  **Ausführung:**
  _Responsible:_
  Innendienst/Projektleiter,
  _Accountable:_
  Innendienstleitung/GF (Projektziele erreichen), _Consulted:_ Planer (für Änderungen vor Ort), Außendienst (für
  Kundenkommunikation laufend),
  _Informed:_
  GF (KPI), alle Beteiligten via Statusupdates. -
  **Rechnungslegung/Zahlungsüberwachung:** _Responsible:_ Buchhaltung, _Accountable:_ CFO/GF, _Consulted:_
  Vertrieb (für Zahlungsabstimmung, z.B. falls Kunde Sonderabsprachen hat), _Informed:_ Vertrieb (wenn
  Zahlung fehlt), GF (wenn Liquiditätsthemen). - **Projektabschluss & Review:** _Responsible:_ Innendienst
  (Projektleiter) erstellt Abschlussbericht, _Accountable:_ GF (Projekt wirtschaftlich erfolgreich?), _Consulted:_ alle
  Beteiligten für Lessons Learned, _Informed:_ Vertrieb (Erfolg Story, Referenz, After-Sales).

Diese RACI-artige Verteilung spiegelt sich im Tool insofern wider, als **Workflows und Benachrichtigungen**
**an die verantwortlichen Rollen gehen** . Z.B. Ende Projekt: System schickt GF & Vertriebsleiter eine Info
„Projekt X abgeschlossen mit Y% Marge, bitte Lessons Learned kommentieren“. Oder, bei Zahlungsverzug:
Buchhaltung markiert Mahnstufe, System informiert Außendienst („dein Kunde zahlt nicht, bitte
nachhaken“). So werden Verantwortlichkeiten digital verankert.

---

_Page 31_

---

**Abhängigkeiten zu externen Faktoren:**
Neben internen Schnittstellen gibt es natürlich Abhängigkeiten, die das System nur bedingt beeinflussen
kann: - **Kunde:** Änderungen durch den Kunden (Zeit, Umfang) – System macht Auswirkungen transparent
(Verschiebung Meilenstein -> gantt aktualisiert), aber die Verhandlung muss Vertrieb führen. - **Zulieferer**
**Markt:** Preise für Materialien, Lieferzeiten – diese Faktoren fließen via Lieferantendaten ins System.
Innendienst muss z.B. Preisdaten aktuell halten, sonst kalkuliert er falsch. Hier ist teils Kopplung an
externen Datenquellen denkbar (Aktualisierung von Materialpreisen via Datei-Import). - **Behörden/**
**Genehmigungen:** Bei Filialumbauten braucht man mitunter Genehmigungen. Das wurde im Kontext nicht
groß erwähnt, aber falls relevant, könnte es Checklisten geben („Baugenehmigung erhalten?“). Das System
lässt solche Steps einplanen, aber die Abhängigkeit (Genehmigung kommt zu spät) ist ein Projektrisiko, das
nur bedingt steuerbar ist. Hier hilft das Tool indirekt, indem es an Fristen erinnert und Transparenz schafft,
falls etwa ein Genehmigungsantrag läuft. - **IT-Abhängigkeiten:** Internetverbindung ist Voraussetzung für
Online-Sync. Dank Offline-Modus kann kurze Downtime überbrückt werden, aber längere Ausfälle könnten
Problem sein (Risiko: wird in Notfallplan gepackt – z.B. tägliche Backups, offline Export wichtiger Infos vor
Montage).

**Interne Schnittstellen im Unternehmen (IT, Management):**
Die Einführung des Systems hat eine Schnittstelle zur **IT-Abteilung** (sofern vorhanden) – v.a. für
Benutzerverwaltung, Gerätemanagement. Die IT stellt sicher, dass alle Außendienstler iPads bekommen,
alle nötigen Browser aktuell sind, und übernimmt später Systemadministration (User anlegen, Rechte
verwalten). Dafür definieren wir im Projekt eine Verantwortlichkeit: IT-Admin ist als Rolle im System
angelegt. Management-Schnittstelle: GF und Abteilungsleiter erhalten durch das System direkt Einsicht in
Vorgänge – das ändert ihre Arbeitsweise (sie müssen weniger Meetings abhalten, können Berichte selbst
ziehen). Hier definieren wir, dass regelmäßig (z.B. monatlich) alle Abteilungsleiter zusammen via System die
Pipeline/Projektportfolio durchsprechen (eine neue Form der bereichsübergreifenden Kommunikation,
ermöglicht durchs System).

**Zusammenfassung der Schnittstellen:**
Das PM-Modul steht **zentral** zwischen Vertrieb, Planung, Lieferanten und Buchhaltung – es übernimmt

quasi die
_Moderationsrolle_ . Klare Datenübergaben (Opportunity → Projekt, Plan → Angebot,

Bestellung → Lieferant, Rechnung → FiBu) sind definiert, sodass jeder weiß, wann er zuständig ist.
Verantwortlichkeiten sind im System hinterlegt und werden durch automatische Benachrichtigungen
unterstützt. Abhängigkeiten werden durch das System **transparent** gemacht (jedem ist ersichtlich, wovon
seine Arbeit abhängt und wer auf ihn wartet).

Diese interne Vernetzung minimiert „stille Post“ und Missverständnisse an Schnittstellen, steigert die
**Verlässlichkeit der Übergaben** . Jeder Prozessschritt hat einen klaren Owner, und das System stellt diesem
die nötigen Infos zur Verfügung und fordert (wo nötig) Aktionen aktiv ein. Damit schaffen wir aus vormals
losen Schnittstellen einen durchgehenden, orchestrierten Prozessfluss.

# 8. Qualität, Risiken, Annahmen (inkl. Mitigations;

**Qualitätskriterien & -ziele:** Im Projekt wurden neben den funktionalen Anforderungen auch **Qualitäts-**
**und Akzeptanzkriterien** definiert, um den Erfolg der Einführung messbar zu machen. Wichtige
Qualitätsaspekte und zugehörige Ziele sind:

**Usability (Benutzerfreundlichkeit):** Das System muss _einfach verständlich und effizient nutzbar_ sein.
Indikatoren: kurze Einarbeitungszeit, wenig Supportanfragen, hohe Nutzung im Alltag. Persona-
Feedback hat gezeigt, dass z.B. Planer zwar IT-affin sind, aber keine Zeit für komplizierte Tools
haben. Außendienstler sind keine IT-Experten und oft unter Stress, sie brauchen eine schnelle, klare
UI. **Ziel:** Jeder Haupt-User soll nach max. 1-2 Schulungstagen 80% der relevanten Funktionen
bedienen können. Im laufenden Betrieb sollen Workflows _intuitiv_ sein – z.B. „Aufgabe anlegen“ in <5
Klicks. Ein qualitatives Ziel: Nutzer fühlen sich durch das System unterstützt, nicht gebremst. Wir
messen das via regelmäßige User-Zufriedenheitsbefragungen nach Einführungsphase. Bereits im
Pilottest wird auf „Aha-Effekt“ geachtet: Die Anwender sollen schnell den Nutzen erkennen („ach, so
leicht kann ich die Infos finden, die ich brauche“). **Mitigation, falls Risiko** : iterative UX-
Verbesserungen, Key-User-Feedback einholen, Nachschulungen.

**Performance & Zuverlässigkeit:** Das Tool muss **schnell und stabil** laufen, gerade in
Kundengesprächen darf es nicht hängen – das wurde besonders vom Außendienst betont. GF will in
Meetings „auf Zuruf Zahlen ziehen" können, also auch dort Schnelligkeit. **Quantifizierte Ziele (NFR_SPECIFICATION.md):**

- **Seiten-Ladezeiten:** P95 ≤2s (Listen), ≤3s (Dashboards), ≤1,5s (Detailansichten)
- **API-Performance:** P95 ≤1,5s, P99 ≤2,5s für alle Backend-Anfragen
- **Zuverlässigkeit:** 95% Verfügbarkeit (Geschäftszeiten 8x5), <1% Fehlerrate, 99% erfolgreiche Syncs
- **Lasttest-Validierung:** 20 gleichzeitige Nutzer (getestet bei 25), 30-minütige Dauerlast, Fehlerrate <5%

**Mitigation:** k6-Lasttests wöchentlich auf Staging, Bottleneck-Identifikation (z.B. Berichte über 10k+ Datensätze werden vorweg aggregiert), Indexoptimierung. **Verfügbarkeit:** RTO=4h (Wiederherstellung), RPO=24h (tägliche Backups), Auto-Restart aller Container. Ein Crash in einer wichtigen Phase (z.B. Angebotserstellung live vor Kunde)
wäre fatal für Akzeptanz – daher wird Performance als eigenständige Muss-Anforderung mit hoher
Priorität behandelt.

**Datenqualität & Aktualität:** Für Management-Entscheidungen ist korrekte Datenbasis essenziell.
Das System soll _verlässliche, vollständige Daten_ liefern. **Ziel:** Es sollen z.B. 0 „Geisterprojekte“ im
System sein (alles was in Realität läuft, ist erfasst). KPIs im Dashboard stimmen mit den manuell
nachgerechneten Zahlen überein (Differenz < 1%). Ein Testkriterium: nach Einführung soll kein Excel-
Parallelreporting mehr nötig sein – GF vertraut den Systemdaten voll. **Mitigation:** Pflichtfelder,
Plausibilitätsprüfungen (z.B. Abschlusswahrscheinlichkeit muss 100% sein für gewonnene Deals,
sonst Warnung), tägliche Konsistenzchecks (z.B. Summe aller Projektrechnungen = erwarteter
Umsatz? falls nicht, Hinweis an Admin). Außerdem _Datenverantwortliche_ je Bereich ernennen: z.B.
Vertriebsleiter prüft monatlich, ob alle Opportunities korrekt gepflegt sind; Planungsleiter checkt, ob
Projekte in ihrem Bereich aktuell sind. Das System kann Berichte dafür liefern (z.B. „Datenqualität
Score“: wie viele Felder fehlen etc.). Annahme ist, dass mit Management Commitment diese Checks
ernst genommen werden.

**Akzeptanz & Nutzungsquote:** Eine kritische Qualität ist die _Anwenderakzeptanz_ . Wir definieren als
Ziel, dass >90% der relevanten Vorgänge im System erfolgen (statt in alten Tools). Z.B.: Jeder
Kundenkontakt wird ins CRM eingetragen, jedes Angebot im Tool geschrieben, jedes Projekt im Tool

gemanagt. Wenn Nutzer ausweichen (z.B. Planer führen To-Do-Liste auf Papier weiter), deutet das
auf Probleme hin. **Mitigation:** Change Management begleiten – Early Wins sichtbar machen (z.B.
loben, wenn jemand via System etwas gut gelöst hat), kontinuierliches Training. Auch usability wie
erwähnt trägt dazu bei: **„Keine fünf Klicks für eine Info“** ist ein inoffizieller Leitsatz. Im Zweifel wird
Funktionalität reduziert, um es simpler zu halten – besser Nutzer nutzen 80% Funktionen regelmäßig
als 100% nie. GF hat klargemacht: die Nutzung wird _zur Pflicht_ , aber Zwang allein genügt nicht – wir
setzen auf _Nutzen erlebbar machen_ .

Ein Risiko: _Widerstand der „alten Hasen“_ , v.a. wenn anfangs was hakt. Mitigation: Key User in
Entwicklung einbinden, damit sie sich als Teil der Lösung sehen. Und siehe Zitat GF: _„Die beste_
_Lösung bringt nichts, wenn die Anwender sie ablehnen.“_ – dieses Bewusstsein ist im Projektteam
präsent, weshalb Akzeptanzthemen gleichrangig mit technischen behandelt werden.

**Sicherheit & Compliance:** Qualität umfasst, dass das System _sicher_ (Schutz vertraulicher Daten) und
_rechtskonform_ ist. DSGVO: Schutz personenbezogener Daten vor unbefugtem Zugriff, minimal nötig
erfassen, Löschkonzepte. GoBD: Revisionssicher, Nachvollziehbarkeit aller Änderungen. **Ziele:** Kein
Datenschutzvorfall (0 Data Breaches). Zugriffskonzept hat Audit stand (Test: interner Revisor prüft
Rechte, sollte keine Lücken finden). Rechtliche Prüfungen (z.B. Steuerprüfung) sollten dank System
ohne Beanstandung verlaufen – KPI: _keine_ Feststellungen wegen IT-Datenhaltung. **Mitigation:**
Privacy-by-Design (z.B. Maskierung sensibler Felder für Unbefugte, Logging Zugriffe). Schulung
Mitarbeiter in Umgang (z.B. keine Dummy-Datensätze mit Echtdaten in Tests anlegen). Regelmäßige
Sicherheitsupdates, Passwortrichtlinien etc. Diese Aspekte sind im Projektkontext hochgehalten
worden, da man weiß, wie kritisch z.B. ein Verstoß sein kann (Abmahnrisiko etc.). GF selbst hat
betont, dass höchste Sicherheitsstandards erwartet werden – das wird umgesetzt.

**Flexibilität & Zukunftssicherheit:** Qualität im Sinne von _Zukunftsfähigkeit._ Das System sollte
anpassbar sein, damit es nicht in 2 Jahren wieder ersetzt werden muss, wenn sich etwas ändert (z.B.
neue Produktlinie, anderer Prozess). Persona Planer erwähnte: „Ideal ist eine Lösung, die man
anpassen kann (Customizing Felder, Workflows)“.
**Ziel:**
80% der künftig auftretenden
Änderungswünsche sollen ohne Code anpassbar sein (z.B. ein neues Feld „Filialtyp“ kann Admin
selbst hinzufügen). Und Modularität: falls z.B. ein Marketing-Automation-Modul in 2 Jahren
gewünscht, lässt sich anbauen, ohne Kern zu gefährden. **Mitigation:** Bewusst modulare Entwicklung
(ggf. Microservice-Architektur). Konfigurationsmöglichkeiten vorsehen (z.B. Dropdown-Werte
pflegbar). Dies ist jedoch ein Trade-off mit Timeline – wir können nicht alles parametrisierbar
machen. Aber Felder, Reports etc. werden möglichst flexibel gehalten. Regel: harte Codierung nur
wo notwendig; ansonsten meta-datengetrieben.

**Projekt-Risiken und Gegenmaßnahmen (Mitigations):**

Die bereits in Abschnitt 2 identifizierten Risiken seien hier in Stichpunkten mit Mitigations
zusammengefasst:

**Akzeptanzrisiko (Nutzer machen nicht mit):**
_Risiko:_ Benutzer umgehen System, Daten unvollständig -> bricht Vision der Single Source.
_Mitigation:_ Starkes Change Management: Schulungen, offene Feedback-Kanäle, Quick Wins
demonstrieren. **Management-Vorbild:** GF & Leiter nutzen das System selbst aktiv (GF schaut KPIs
dort, nicht verlangt Excel). Außerdem Monitoring: Falls z.B. ein Außendienstler kaum Einträge macht,

Gespräche führen – warum? Fehlt ihm Feature (dann nachbessern) oder Gewohnheit (dann schulen)?
Gamification: möglicherweise ein Scoreboard („CRM-Champion der Woche“ für meist gepflegte
Leads) – spielerisch fördern.

**Datenmigrationsrisiko:** Wir haben bestehende Daten (Kundenlisten in Excel, laufende Projekte in
Ordnern). _Risiko:_ Verlust oder Fehler beim Überführen.
_Mitigation:_ Sorgfältige Migration planen: Kundendaten werden vorab bereinigt (Dubletten
entfernen), dann importiert. Laufende Projekte: Man könnte entscheiden, nur Neuprojekte voll im
System zu machen und alte weiter konventionell abzuwickeln – aber besser: auch laufende
importieren (sonst parallel Systeme). Dafür stellt man dediziert Personal, das Alt-Daten ins System
einpflegt (vielleicht gute Chance, Daten zu prüfen). Testmigration durchführen. Ebenso Schnittstelle
zu Altdaten so gestalten, dass histor. Daten ggf. als read-only hinterlegt werden (Archiv im System,
damit man nicht 10 Jahre Excel vorhalten muss).

**Termindruck & Scope Creep:** _Risiko:_ Projekt zieht sich oder wird überfrachtet, wenn man alles will.
_Mitigation:_ Strikte Priorisierung (MVP-Fokus auf Must). Herauslösen von Teilprojekten – z.B.
Reporting-Modul kann notfalls 1 Monat nach Kernstart kommen, ohne Gesamtinbetriebnahme zu
gefährden. Klare Meilensteine und regelmäßiges Projektcontrolling. Ebenso “Feature Freeze”
definieren nach Konzeptphase: neue Wünsche während Dev kommen auf Backlog für Phase 2, nicht
sofort rein (außer kritisch). Diese Vorgehensweise ist abgestimmt und GF wurde sensibilisiert, nicht
während Entwicklung ständig New Features zu pushen.

**Technologie-/Integrationsrisiko:** _Risiko:_ Schnittstellen funktionieren nicht wie erhofft (z.B. Lexware
lässt sich doch nicht gut ansprechen), Offline-Sync macht Probleme (Konflikte).
_Mitigation:_ Frühzeitige Machbarkeits-POCs: bereits in Prototypphase wird ein minimaler Lexware-
Export getestet, um zu sehen ob Import klappt. Offline-Sync: hier nutzen wir bewährte Techniken
(ServiceWorker etc.), testen es mit Extremfällen (zwei Nutzer ändern offline dieselbe Aufgabe ->
Konfliktlösung definieren, z.B. Last write wins + Hinweis). Im Zweifel simpler fallback: bei sehr
schwieriger Integration (z.B. Zeiterfassung hat kein Export) zunächst manueller Workaround
definieren, um das Risiko zu umschiffen bis man es besser lösen kann (z.B. Stundenzettel-CSV erst
mal).

**Aufwandsunterschätzung (Ressourcenrisiko):** Das Projekt ist ambitioniert. _Risiko:_ Team überlastet,
Deadlines platzen.
_Mitigation:_ Realistische Planung mit Puffern. Externe Unterstützung bei Bedarf (z.B. externer
Entwickler temporär). MVP klar abstecken, Usertests einplanen (nicht am Ende alles). Und: Agile
Methodik – in Sprints arbeiten, am Ende jedes Sprints potentielle Auslieferung, so sieht man früh, ob
auf Kurs. Wenn man merkt, etwas dauert länger (z.B. Lieferantenmodul komplexer), kann man ggf.
Umfang reduzieren (Trade-off: z.B. Reklamationsauswertung als Report erst später). Wichtig ist
Transparenz ggü. Stakeholdern: wir haben regelmäßige Status-Meetings mit GF, um
Erwartungsmanagement zu betreiben.

**Juristisches Risiko (GoBD/DSGVO):** _Risiko:_ Bei Prüfung stellt sich heraus, unser System protokolliert
nicht ausreichend oder Data Privacy Issue -> Strafen.
_Mitigation:_ Früh im Projekt wird ein Datenschutzbeauftragter bzw. Steuerberater (für GoBD)
konsultiert. Wir orientieren uns an Empfehlungen (z.B. _GoBD-Verfahrensdokumentation_ fürs System
erstellen). Schon im Konzept haben wir diese Punkte adressiert. Wir richten z.B. ein, dass man

Dokumente nachträglich nicht löschen kann, ohne Spur – das ist unüblich für User (könnte stören),
aber unumgänglich. Solche Dinge den Nutzern erklären („warum kann ich ein Angebot nicht
komplett löschen? – Weil Revisionssicherheit: Storniere statt löschen“). Testläufe: interne Audit-
Simulation vor Live-Schaltung.

**Risiko „Einführungsblues“:** Oft initiale Begeisterung, dann im Alltag Nachlassen.
_Mitigation:_ Kontinuierliche Betreuung: Key-User-Runde auch nach Go-Live (z.B. alle 2 Wochen
Meeting: Was läuft gut/schlecht?). Schnelle Nachbesserungen für kleine Issues (Signal: wir kümmern
uns). Erfolgsgeschichten teilen: „Durch das neue System haben wir Angebotserstellung um 30%
beschleunigt“ – so motivieren.

**Annahmen (aus Kontext, die kritisch sind):**

- _Annahme: Benutzer verfügen über nötige Hardware und Basiskompetenzen._ Wir nehmen an, jeder
  Außendienstler hat Smartphone/Tablet und kann damit umgehen (Mail, Apps etc.). Sollte das nicht überall
  der Fall sein (manche tun sich schwer), muss Schulung nachgelegt oder Gerät gestellt werden. - _Annahme:_
  _Management bleibt engagiert._ Das Projekt wurde top-down initiiert; wir gehen davon aus, dass GF und
  Leitung _weiterhin_ aktiv dahinterstehen, auch wenn’s mal hakt (keine vorschnelle Abkehr). Ohne dieses
  Commitment würde es schwer. Bisher GF stark involviert, wir planen, ihn regelmäßig über Quick Wins zu
  informieren, damit er dran bleibt. - _Annahme: 90% der Prozesse passen in Standard-Tool._ Wir haben so
  konzipiert, aber falls sich zeigt, dass doch Prozessänderung nötig (z.B. separate PM-Rolle, weil Innendienst
  überfordert), müsste Konzept adjustiert. Wir gehen davon aus, Innendienst schafft es mit Tool (die 90%-
  These). Wir behalten aber im Hinterkopf die Skalierbarkeit – wenn Firma wächst, könnte eine PM-Rolle nötig
  werden; unser System ist darauf vorbereitet (Rolle anlegbar). - _Annahme: Bereitschaft zur Stammdatenpflege._
  Ein integr. System erfordert saubere Stammdaten (Kunden, Artikel, Lieferanten...). Wir nehmen an, dass die
  Orga den initialen Aufwand leistet, diese Daten sauber zu erfassen. Tun sie das nicht, verliert System an
  Wert (z.B. Analysen unvollständig). Das wurde im Vorfeld kommuniziert, alle haben verstanden, dass initial
  Mehrarbeit (Datenpflege) nötig ist, damit danach weniger Chaos.

**Qualitätssicherungs-Maßnahmen:**

- **Testing & Pilot:** Alle Module werden einzeln getestet (Unit/UAT) und dann in einem **Pilotprojekt** mit
  echtem Team ausprobiert (z.B. ein neuer Filialbau wird komplett im neuen System abgewickelt, parallel
  dokumentiert). So identifizieren wir letzte Usability-Probleme und Fehler, die wir vor dem Rollout beheben.
  Qualität heißt hier: nicht nur keine Bugs, sondern auch reibungslose Akzeptanz – daher in Pilotphase eng
  Feedback sammeln. - **Schulungen & Doku:** Wir erstellen eine User-Dokumentation (Wiki oder PDF-
  Handbuch) und Quick Reference Guides (1-Seiter pro Persona: „Wie erfasse ich einen Kundenkontakt?“, „Wie
  erstelle ich eine Rechnung?“). Das schafft Sicherheit und erhöht Qualität der Nutzung. - **KPIs zur**
  **Erfolgsmessung:** Schon erwähnt: Nutzungsgrad, Datenqualität etc. GF will nach 6 Monaten sehen: _Hat sich_
  _was verbessert?_ Daher definieren wir im Projekt Erfolgs-KPIs, z.B.: Angebotsdurchlaufzeit um 20% reduziert,
  Nachfassquote verbessert, keine Projekte mehr ohne zugewiesenen Verantwortlichen etc. Diese werden
  getrackt. Sollte es Abweichungen geben, wird analysiert und nachjustiert.

Insgesamt haben wir aus dem Projektkontext gelernt, welche Stolpersteine möglich sind und präventiv
Gegenmaßnahmen eingeplant. Die Kombination aus technischem Fokus (Performance, Sicherheit) und
menschlichem Fokus (Usability, Change Management) in der Qualitätssicherung ist entscheidend, um **das**
**volle Potenzial der Lösung zu heben** . Mit den genannten Maßnahmen und dem Bewusstsein aller
Stakeholder für diese Themen sind wir zuversichtlich, die Risiken zu kontrollieren und ein qualitativ
hochwertiges System einzuführen, das nachhaltig von den Nutzern angenommen wird.

# 9. Offene Punkte mit Platzhaltern & präzisen

Trotz umfassender Analyse bleiben einige **offene Punkte** und Annahmen, die im weiteren Projektverlauf
konkretisiert werden müssen. Diese Lücken sind hier mit _Platzhaltern_ markiert, zusammen mit klaren
Rückfragen zur Klärung:

**Integration der Finanzbuchhaltung (Lexware):** [ *Platzhalter: Entscheidungsfindung zur Tiefe der*
*Integration steht aus.* ]
**Rückfrage:**
_Soll das neue System eigenständig Rechnungen final verbuchen, oder werden_
_Rechnungsdaten lediglich an Lexware übergeben?_ Konkret: Wünscht die Buchhaltung einen
**automatischen Export** aller Rechnungen und Zahlungen ins Buchhaltungssystem (API/
Dateiimport), oder bleibt sie vorerst beim manuellen Buchen dort? Davon hängt ab, ob wir eine
Echtzeitschnittstelle entwickeln müssen oder nur periodische Exporte. Bitte bestätigen, wie eng die
Kopplung erfolgen soll.

**Anbindung der Zeiterfassung (Timecard):** [ *Platzhalter: konkrete Umsetzung der Stunden-Integration*
*unklar.* ]
**Rückfrage:** _In welcher Form sollen die erfassten Mitarbeiterstunden ins PM-System fließen?_ Option A:
**Automatisierter Import** (z.B. Stundensummen je Projekt werden täglich importiert). Option B:
Manuelle Erfassung der Ist-Stunden pro Projekt durch Projektleiter. Hier brauchen wir eine
Entscheidung vom Management/IT: Gibt es eine Schnittstelle oder Exportmöglichkeit von
„Timecard“, die wir nutzen können? Falls nein, müssten wir die Stundenerfassung ggf. in unser
System integrieren (was Scope erhöht). Bitte klären, welche Daten aus Timecard genau benötigt
werden (nur Gesamthours pro Projekt? Auf Tagesbasis?).

**Rollenverteilung „Projektleiter“ (Innendienst/Außendienst):** [ *Platzhalter: Definition der offiziellen*
*Projektverantwortung fehlt.* ]
**Rückfrage:** _Soll im System explizit ein Projektleiter pro Projekt benannt werden?_ Bislang nehmen wir an,
der Innendienst übernimmt diese Rolle. Wäre es sinnvoll, ein Feld „Projektleiter“ einzuführen und
z.B. bei kleinen Projekten den Außendienstler einzutragen (wenn er’s eigenständig leitet)? Oder
bleibt Innendienst immer Projektleiter und der ADM nur als „Kundenansprechpartner“ hinterlegt?
Diese Feinjustierung beeinflusst Rechte und Benachrichtigungen. Bitte präzisieren, wie wir die
**Verantwortung im Tool abbilden** sollen, insbesondere für die Fälle, wo Außendienst stark
mitsteuert.

**Umfang der Ressourcenplanung im MVP:** [ *Platzhalter: Entscheidung über Detailgrad der*
*Ressourcenplanung ausstehend.* ]
**Rückfrage:** _Reicht für die erste Version eine einfache Kapazitätsübersicht oder wird eine detaillierte_
_Ressourcenplanung gewünscht?_ Unsere Annahme: grobe Übersicht (Projekt X vom 1-15.Mai durch
Planer A) reicht. Wenn jedoch eine fein granulare Planung (Stunden pro Tag und Person) gebraucht
wird, müssten wir mehr Aufwand einplanen. Bitte bestätigen, dass zunächst _keine_ minutengenaue
Einsatzplanung notwendig ist und ob ggf. **Urlaube/Abwesenheiten** berücksichtigt werden müssen
(aktuell nicht eingeplant). Falls ja, welche Abteilungen haben hier Bedarf?

**CAD/BIM-Schnittstelle:** [ *Platzhalter: Anforderungen an technische Integration von Planungssoftware*
*unklar.* ]
**Rückfrage:** _Welche Planungssoftware wird konkret eingesetzt und gibt es Anforderungen, Daten daraus_
_ins System zu übernehmen?_ Wir wissen, Planer nutzen AutoCAD (DWG-Dateien). Sollen wir eine **DWG-**
**Vorschau** im Tool ermöglichen (Nice-to-have) oder reicht Ablage der Dateien? Gibt es eventuell
bereits Schnittstellen (z.B. können Planer aus AutoCAD eine PDF auf Knopfdruck exportieren – die
könnten wir automatisiert übernehmen)? Bitte die Erwartungshaltung klären, damit wir das Feature
richtig priorisieren: Entweder „nur Datei-Upload“ (MVP ausreichend) oder „starke Integration“ (dann
Scope-Änderung). Ebenso: Wird **Revit/BIM** genutzt (Stichwort IFC-Dateien)? Aktuell nicht bekannt,
bitte angeben falls relevant.

**DSGVO-konformes Löschen/Archivieren:** [ *Platzhalter: Details zum Datenschutz-Konzept sind*
*festzulegen.* ]
**Rückfrage:** _Wie soll mit Datenlöschung und -archivierung umgegangen werden?_ Beispielsweise: Wenn
ein Kunde nach DSGVO Auskunft oder Löschung verlangt – wie setzen wir das um? Wir können
Kunden als „inaktiv“ markieren, aber vollständiges Löschen kollidiert mit Geschäftsbedarf (Historie).
Mögliche Strategie: personenbezogene Daten anonymisieren nach X Jahren ohne
Geschäftsbeziehung. Brauchen wir einen **Aufbewahrungszeitraum** definert (z.B. Projektdaten 10
Jahre, dann löschen)? Oder soll Archivierung manuell durch Admin entschieden werden? Bitte hier
Vorgaben (ggf. vom Datenschutzbeauftragten) einholen, damit wir die Mechanismen bauen (z.B.
einen „Löschen beantragen“-Workflow).

**ERP/Produktionssystem-Schnittstelle:** [ *Platzhalter: Verifizierung, ob ein separates Fertigungssystem*
*existiert.* ]
**Rückfrage:** _Gibt es bereits ein System für Produktionssteuerung oder Lager, mit dem wir Daten_
_austauschen sollten?_ Im Interview klang es so, als würden Fertigungsschritte extern vergeben, ohne
eigenes ERP. Falls jedoch z.B. ein **Lagerverwaltungstool** genutzt wird (für Materialien), müssten wir
überlegen, ob Projekt-Bedarfe dorthin gemeldet werden. Aktuell sehen wir das nicht, möchten aber
sicher sein. Bitte bestätigen: _Kein_ bestehendes ERP, oder falls doch, benennen welches und welche
Daten relevant wären (z.B. Stücklistenübergabe an Fertigung). Das beeinflusst, ob wir noch eine
Schnittstelle bauen.

**Marketing-Funktionalitäten & Newsletter:** [ *Platzhalter: Abgrenzung des Marketing-Umfangs im*
*System noch nicht final.* ]
**Rückfrage:** _Inwieweit soll das System Marketing-Aufgaben unterstützen?_ Reicht es, dass Marketing/
Grafik **Zugriff auf Projektdaten** hat (für Referenzen), oder werden Features wie Serien-E-Mails,
Kontaktsegmentierung für Mailings gewünscht (CRM-Marketingmodul)? Wir haben Letzteres als
nicht-Ziel angenommen. Bitte klarstellen, ob Marketing z.B. eine Liste aller Kunden für Newsletter-
Export erwartet (falls ja, wir würden einfache CSV-Exportfunktion bieten). Und: Soll die **Grafik-**
**Abteilung** Zugriff auf Angebotslayouts im System haben, um diese zu veredeln, oder verlassen wir
uns komplett auf automatisch generierte PDFs? Das letzte Feedback war, Standard-PDF genügt
meistens. Falls spezielle Anforderungen (z.B. Corporate Design Anpassungen, Integration von
InDesign), bitte jetzt spezifizieren.

**Benutzerlizenzierung & Zugriffsanzahl:** [ *Platzhalter: organisatorische Festlegung der Nutzergruppen*
*noch offen.* ]
**Rückfrage:** _Wer genau soll alles Zugang zum System bekommen?_ Wir gehen von allen internen

Mitarbeitern der beteiligten Abteilungen aus. Gibt es Planungen, **externe** Partner oder Kunden
Zugriff zu geben? Z.B. ein Kunde könnte Projektstatus in einem Portal einsehen oder ein Montage-
Subunternehmer seine Aufgabe abhaken. Aktuell nicht vorgesehen (Datenschutz etc.), aber wenn
das gewünscht ist, müssten wir Rollen dafür definieren (z.B. „Kunde liest nur seine Projektdaten“).
Bitte klar bestätigen, dass das System _nur für internen Gebrauch_ gedacht ist. Falls externe Zugänge
gewünscht in Zukunft, welcher Art (Kunde, Lieferant?) – dann könnten wir zumindest das Design
vorbereiten (Mandantentrennung etc.).

**Schulungs- und Rolloutplanung:** [ *Platzhalter: organisatorischer Plan zur Einführung noch zu*
*erarbeiten.* ]
**Rückfrage (organisatorisch):** _Gibt es bereits Vorstellungen, wie der Rollout erfolgen soll?_ Z.B. Pilotteam
vs Big Bang. Wer schult die Anwender – intern oder soll das Entwicklungsteam Trainings anbieten?
Wir fragen das, weil es Einfluss auf UI-Hilfestellungen hat (wenn kaum Schulung, brauchen wir mehr
In-App-Hilfe). Außerdem: sollen Altprojekte noch parallel weiterlaufen oder ab Stichtag alle ins
System? Bitte Rückmeldung vom Steuerkreis: Gewünschter **Go-Live-Termin** und Rollout-Vorgehen,
damit wir unsere Entwicklungstimeline darauf justieren können.

Diese offenen Punkte gilt es zeitnah mit den Stakeholdern (Management, IT, Key-User) zu klären. Bis zur
Entscheidung stehen oben Platzhalter, um im Konzept auf die Lücke hinzuweisen. Jede Rückfrage ist präzise
formuliert, um eine zielgerichtete Klärung zu ermöglichen. Sobald Antworten vorliegen, werden die
entsprechenden Konzeptstellen konkretisiert und die Platzhalter entfernt.

# 10. Verweise innerhalb des Projektkontexts

_(Die nachfolgenden internen Quellen wurden bei der Erarbeitung herangezogen. Alle Informationen stammen aus_
_dem vorliegenden Projektmaterial: Interviews, Konzeptdokument und Persona-Profile.)_

**Interviewtranskript “SG Interview 31.10.2025”** – Internes Gespräch mit einem Vertriebsmitarbeiter
(Außendienst) über aktuelle Prozesse und Pain Points. (Quelle für Ist-Analyse und Anforderungen
aus Usersicht, z.B. Offline-Problematik Außendienst, aktuelle Rollenverteilung).
**Gesamtkonzept “Integriertes CRM- und PM-Tool” (Final, 2025)** – Projektbericht mit Executive
Summary, Domänen-Definitionen, Best Practices und vollständiger Anforderungsliste. (Hauptquelle
für Vision, Ziele, und Integration der Personas; liefert fachliche Muss-Anforderungen,
Marktvergleich, Workflow-Vorschläge).
**Persona-Profil Außendienstmitarbeiter (Vertrieb Ladenbau-Projekte)** – Strategische Persona
“Markus” mit Motivation, Arbeitsweise, detaillierten Anforderungen (Offline, Tourenplanung, CRM-
Integration) an das neue Tool. (Verwendet für Section 3 Mapping Außendienst, Offline- und
Aufgabenanforderungen).
**Persona-Profil Vertriebsinnendienst & Kalkulation** – Referenzpersona
“Innendienst” (Angebotserstellung, Projektkoordination); enthält Aufgabenbeschreibung, Pain Points
(Excel-Listen, Übergaben), Anforderungen (360°-Sicht, Angebotsversionierung, Workflow-
Automation). (Basis für Innendienst-bezogene Anforderungen in Abschnitt 3 und 4, z.B.
automatische To-Do-Generierung bei Auftrag, Lieferantenmanagement).

**Strategische Referenzpersona Planungsabteilung** – Persona-Bericht “Planerteam” mit Prozessen
vom Entwurf bis Ausführung, inkl. Schnittstellen zu Vertrieb/Kalkulation. Enthält konkrete Wünsche
(zentrale Info, Aufgabenliste, Versionierung, CAD-Schnittstelle). (Genutzt für Domänenkontext,
Planer-Anforderungen in Mapping, z.B. Status-Updates für Vertrieb, Datei-Versionierung).
**Persona-Bericht Buchhaltung (CRM-/PM-Tool)** – Darstellung der Buchhaltungsrolle
(Rechnungsstellung, Mahnwesen, Kostenverfolgung, GoBD-Vorgaben) mit aktuellen Problemen
(Zuruf-Rechnungen) und Erwartungen (autom. Rechnungstermine, Überwachung Zahlungen).
(Herangezogen für Anforderungen an Rechnungsmodul, Compliance-Aspekte in Abschnitt 3/4, und
Risiken im Umgang mit Finanzintegration).
**Persona-Profil Geschäftsführung (CEO) im Projektgeschäft** – Ausführliches Profil der GF-Persona
mit Fokus auf Informationsbedürfnisse (Dashboard, KPI, Alerts), Pain Points (Intransparenz, Excel-
Wust) und Anforderungen (Echtzeit-Übersicht, Frühwarnsystem, Integration aller Datenquellen).
(Wesentliche Grundlage für Management-Dashboard-Konzept, Reporting-Anforderungen, sowie
Qualität/KPI-Definition in Akzeptanz).
**Projekt-Rollen- und Verantwortlichkeitskonzept (implizit in obigen Dokumenten)** –
Zusammenschau der Rollenverteilung im aktuellen Prozess (Außendienst, Innendienst, Planung,
usw.), wie aus Interview und Persona-Berichten entnehmbar, mit Best Practices zur
bereichsübergreifenden Zusammenarbeit. (Verwendet für Schnittstellenbeschreibung und RACI-
Zuordnung in Abschnitt 7).

---

# Phase 2/3 Erweiterungen: KI-gestützte Projektsteuerung & Echtzeit-Kollaboration

**Status:** ⚠️ **Deferred to Phase 2+** (Post-MVP). Vollständig spezifiziert in:

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` - Pillar 1 & 2
- `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md` - AI & Real-Time Architecture
- `docs/product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md` - Strategischer Ausblick

## 🤖 KI-gestützte Projekt-Risikoanalyse (Phase 2.1 - Q3/Q4 2025)

**Problem:** Projekte geraten "plötzlich" in Schieflage (Budget-Überschreitung, Verzögerungen) → Reaktives Firefighting statt proaktive Steuerung.

**Lösung - Predictive Project Risk Assessment:**

- **ML-Modell** (Gradient Boosting: XGBoost/LightGBM) trainiert auf historischen Projektdaten → erkennt Risk-Patterns
- **Risk Indicators:**
  - Budget-Überschreitung-Wahrscheinlichkeit (0-100% Score)
  - Verzögerungs-Risiko (Days at Risk: >5 Tage = ROT)
  - Lieferanten-Risiko (basierend auf historischer Pünktlichkeit)
  - Ressourcen-Engpass-Warnung (Planer überlastet)
- **Proaktive Alerts:** GF + Projektleiter bekommen Real-Time-Benachrichtigung (Socket.IO) bei Risk-Score >70%
- **Explainable AI:** SHAP-Werte zeigen WHY Risiko besteht ("Budget 85% verbraucht, aber erst 60% fertig")

**Erwarteter Impact:**

- -30% weniger Projekt-Überziehungen (Budget/Zeit)
- 2-3 Wochen frühere Intervention bei Problem-Projekten
- €20-50K/Jahr vermiedene Verluste

**Technische Architektur:** Siehe ADR-018 (AI Integration) + `docs/architectur/` → KI-Integrationsarchitektur

---

## 📋 Intelligente Task-Generierung aus Protokollen (Phase 2.1)

**Problem:** Planer/Innendienst müssen nach Projektstart-Meeting manuell 10-20 Tasks anlegen → 15-30 Min Aufwand.

**Lösung - AI-Powered Task Extraction:**

- **Input:** Audio-Transkription von Meeting (Whisper) → Textanalyse (GPT-4/Llama 3)
- **Output:** Automatisch generierte Task-Liste mit Assignee, Due-Date, Priority
- **Beispiel:**
  - Meeting: "Ich brauche bis nächste Woche die CAD-Zeichnungen von Schreinerei Müller"
  - KI erstellt: Task "CAD-Zeichnungen anfordern" → Assignee: Planer → Due: +7 Tage → Priority: HIGH
- **Human-in-Loop:** Nutzer reviewed generierte Tasks → 1-Click-Approval → in Projekt eingefügt

**Zeitersparnis:** 13-28 Min/Meeting = 2-3h/Woche für Planungsabteilung

---

## 🔔 Echtzeit-Kollaborations-Features (Phase 2.1 - Q3 2025)

### Activity Feed & Smart Notifications

**Problem:** Wichtige Project-Updates (Task completed, Budget changed, Design approved) gehen in E-Mail-Flut unter → Team nicht synchronisiert.

**Lösung:**

- **Echtzeit-Activity-Stream** (Socket.IO WebSocket) → Jeder Nutzer sieht LIVE was im Projekt passiert
- **Intelligent Filtering:** Nur relevante Events zeigen (Configurable per Role)
  - Planer: Design-Approvals, Task-Assignments, Lieferanten-Updates
  - GF: Budget-Änderungen, Status-Transitions, Risikowarnungen
  - Innendienst: Customer-Approvals, Rechnungs-Status
- **Push-Notifications:** @-Mentions, Critical Alerts (Delay Risk), Approvals
- **Mobile-First:** Außendienst bekommt Projekt-Updates auf Smartphone (PWA Push)

**Impact:**

- -40% weniger "Hab ich nicht mitbekommen"-Eskalationen
- 2-3x schnellere Approvals (vorher 2 Tage → jetzt <4h)

### Contextual Commenting

**Problem:** Diskussionen über spezifische Tasks/Budget-Positionen laufen in E-Mail/Slack → Kontext verloren, nicht nachvollziehbar.

**Lösung:**

- **Kommentare direkt AN Entitäten anheften:**
  - Task: "Warum dauert CAD-Erstellung 3 Tage statt 1 Tag?"
  - Budget-Position: "Können wir Holz durch günstigere Alternative ersetzen?"
  - Meilenstein: "Kunde hat Freigabe für Phase 2 verweigert - Grund: Budget"
- **Threaded Discussions:** Antworten auf Kommentare → strukturierte Threads
- **Audit Trail:** Alle Entscheidungen nachvollziehbar (GoBD-konform)
- **@-Mentions:** Direkter Hinweis an relevante Person ("@Planer: Bitte prüfen")

**Impact:**

- 100% Transparenz über Entscheidungen
- Weniger Missverständnisse (Kontext bleibt erhalten)
- GoBD-konform: Alle Änderungsrechtfertigungen dokumentiert

---

## 🎯 Presence Indicators & Conflict Avoidance (Phase 2.2)

**Problem:** Zwei Nutzer editieren gleichzeitig dasselbe Projekt → CouchDB-Konflikt → manuelle Auflösung nötig (10-15 Min Aufwand).

**Lösung:**

- **Real-Time Presence:** Nutzer sehen WHO ist gerade in welchem Projekt aktiv (Avatar-Bubble)
- **Soft-Lock-Warning:** "Planer XY editiert gerade Zeitplan - möchtest du trotzdem öffnen?"
- **Last-Active-Timestamp:** "Projekt zuletzt bearbeitet vor 5 Min von Innendienst"

**Impact:**

- -50% weniger CouchDB-Konflikte
- Bessere Teamkoordination ("Ich warte bis Planer fertig ist")

---

## 🗺️ Phase 3: Collaborative Editing & Autonomous PM (Q1-Q2 2026)

**Real-Time Collaborative Editing:**

- Google Docs-style Live-Editing von Projektdokumenten/Tasks
- CRDTs (Conflict-Free Replicated Data Types) für Offline-First Collaboration
- Mehrere Nutzer können gleichzeitig Budget/Zeitplan editieren → automatisches Merge

**Automated Project Summaries:**

- Wöchentlicher Auto-Report für GF: "Projekt X liegt im Plan, Budget 80% verbraucht, Risiko: LOW"
- LLM-generiert (GPT-4/Llama 3) basierend auf allen Projekt-Activities

**Predictive Resource Planning:**

- "Projekt Y braucht voraussichtlich 2 Planer für 3 Wochen" → automatische Kapazitätsberechnung
- ML-basiert auf ähnlichen historischen Projekten

---

**Siehe auch:**

- `Produktvision für Projekt KOMPASS (Nordstern-Direktive).md` (Pillar 1 & 2 - Vollständige Spezifikation)
- `docs/architectur/Projekt KOMPASS – Architekturdokumentation (Zielarchitektur).md` (AI-, Real-Time-, CQRS-Architektur + ADR-015 bis ADR-018)
- `docs/product-vision/Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.md` (Strategischer Ausblick Phase 2/3 mit KPIs)

---

_Hinweis:_ Alle obigen Quellen sind interne Projektdokumente oder durch das Projektteam erstellte Persona-
Analysen. Es wurden keine externen Publikationen herangezogen, außer branchentypische Best-Practice-
Hinweise, die im Konzeptdokument bereits zitiert sind. Die Referenzen dienen der Nachvollziehbarkeit im
Projektkontext und verweisen auf die jeweiligen Artefakte (Interview-Transkript, Konzeptdokument,
Persona-Reports) für detaillierte Informationen.

Gesamtkonzept_Integriertes_CRM_und_PM_Tool_final.pdf

## file://file-FbKUtfPLzdQxRsRczADzbb

### Persona-Bericht\_ Buchhaltung (Integriertes CRM- und PM-Tool).pdf

## file://file-5kxnSBcJVyuurRbCQXGsXN

### 39
