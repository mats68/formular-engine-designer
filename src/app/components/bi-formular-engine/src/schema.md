# Schema
Das Schema selbst ist die Top-Level-Container-Komponente, mit einigen zusätzlichen Properties und Events, die nur beim Schema selbst verfübar sind:

### Properties
| Name | Beschreibung  | 
| ----------- | ----------- |
| guid | Guid der Formular-Definition |
| attribut | Guid  des Formular-Attributs |
| iconText | Abkürzungs-Text des Formulars |
| pdfTemplate | Guid des Pdf-Templates |
| pdfFileName | Dateiname der verwendet wird beim Erzeugen des pdf |
| steps | Definition der Formular-Schritte (wie Ausfüllen, Signieren, Senden usw.) |
| beilagen | Definition der Beilagen des Formulars |
| signaturen | Array von Signatur-Definitionen mit Rollen  |

### Events

| Name | Beschreibung  | 
| ----------- | ----------- |
| initFormular | Wird beim Initialisieren, nachdem alle Daten geladen wurden,  des Formulars ausgeführt  |
| uninitFormular | Wird beim Schliessen des Formulars ausgeführt |
| onChange | Wird beim Ändern irgendeines Eingabefeldes auf dem Formular aufgerufen.   |
| validate | Wird beim Validieren des Formulars aufgerufen.   |
| onAfterSave | Wird nach dem automatischen Speichern des Formulars ausgeführt |
| onBeforeSave | Wird vor dem automatischen Speichern des Formulars ausgeführt (um z.B. einige Feldwerte zu ändern) |
| onAfterReload | Wird nach dem Laden der Werte des Formulars ausgeführt |


Beispiel:
```
export const PDIE_IA08_FR: ISchema = {
	type: 'panel',
	name: 'FrObjektStandortVSE_18',
	guid: PDIE_IA08_FR_form,
	attribut: PDIE_IA08_FR_attr,
	label: 'Avis d\'installation unifié',
	iconText: 'AI',
	classLayout: "w-fulls",
	beilagen: [
		{ guid: SCHEMA_form, titel: 'Schema' },
		{ guid: SITUATIONSPLAN_form, titel: 'Situationsplan' },
		{ guid: BEILAGE_form, schemaKey: 1, titel: 'Disposition Hauptverteilung' },
		{ guid: BEILAGE_form, schemaKey: 2, titel: 'Zustimmung Endverbraucher/Erzeuger Steuerung durch VNB' },
		{ guid: BEILAGE_form, schemaKey: 3, titel: 'Beilage' },
	],
	steps: [
		{ step: 1, titel: 'Remplir', status: DokumentStatus.InArbeit, target: PDIE_IA08_FR3_FrInstallationsbeschriebVSE_18.name },
		{ step: 2, titel: 'Signer', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
		{ step: 3, titel: 'Envoyer', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
		{ step: 4, titel: 'Attendre la réponse', status: [DokumentStatus.Gesendet, DokumentStatus.ErhaltBestaetigt], target: idPanelAntwort },
	],
	children: [
		PDIE_IA08_FR0_FrFormularHeader,
		PDIE_IA08_FR10_Std,
		PDIE_IA08_FR2_FrAnlage,
		PDIE_IA08_FR2_FrKontakteVSE,
		PDIE_IA08_FR3_FrInstallationsbeschriebVSE_18,
		PDIE_IA08_FR8_FrInbetriebnahmeVSE,
		PDIE_IA08_FR4_FrInstallationVSE_IA18,
		// PDIE_IA08_FR10_FrBeilagenVSE_IA18,

	],
	signaturen: signaturen,
	async initFormular(sm: SchemaManager) {
		const service = sm.service;

		// Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
		if (sm.Schema.tag !== 100) {
         sm.appendChild(sm.Schema, await ProjektBeilagen.instance.beilagenPanel(sm));
			sm.appendChild(sm.Schema, await PDIE_IA08_FR_Unterschriften(sm));
			sm.appendChild(sm.Schema, await PDIE_IA08_FR_Senden(sm));
			sm.appendChild(sm.Schema, await PDIE_IA08_FR_Rueckmeldung(sm));
			sm.Schema.tag = 100
		}

		if (sm.formularStatus === DokumentStatus.Undefiniert) {
			sm.saveStatus(DokumentStatus.InArbeit);
			// Nur hier ist man sicher, dass das Formular zum ersten Mal geöffnet wird
			sm.setValue('I_TEXT', sm.projekt.auftrag?.bemerkungen);
		}
		else if (sm.formularStatus >= DokumentStatus.SigniertGesperrt)
			sm.DisableAll();


		// VNB-Empfänger auslesen
		let vnbName = '';
		let empf =  await sm.service.GetEmpfaenger_Guid(sm.projekt.auftrag.guidEmpfaengerVnb);
		if(empf)
			vnbName = empf.firma1;
			initKontakte(sm);
		}
		else {
			initKontaktAbschnitte(sm);
		}
	},
	onChange(sm, comp) {
	},
}

// Kontakte initialisiseren oder bei einer Änderung aktualisieren
const initKontakte = (sm: SchemaManager) => {
	const service = sm.service;

	initKontaktAbschnitte(sm);
	// Verwaltungsadresse laden
	if (sm.Values.VERW) {
		if (sm.projekt.gebaeude?.guid_Verwaltung) {
			abrufeKontaktstruktur(sm, KontaktArt.Verwaltung).then(verw => {
				setTimeout(() => {
					abfuelleKontaktFelder(sm, verw, "GES_");
				}, 0);
			}).catch(e => {
				console.error(e);
			}).finally(() => {
			})
		}
	}
	else if (sm.Values.EIGENT)
	{
		if (sm.projekt.gebaeude?.guid_Inhaber) {
			abrufeKontaktstruktur(sm, KontaktArt.Eigentuemer).then(eigent => {
				setTimeout(() => {
					abfuelleKontaktFelder(sm, eigent, "GES_");
				}, 0);
			}).catch(e => {
				console.error(e);
			}).finally(() => {
			})
		}
	}
}

```
