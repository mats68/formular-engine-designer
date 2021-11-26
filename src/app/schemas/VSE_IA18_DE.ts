
import { S } from '@angular/cdk/keycodes';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import * as moment from 'moment';
import { Button } from 'protractor';
import { Ausrichtung, ColDef, IComponent, ISchema, SchemaManager } from 'src/app/components';
// import { istStringLeer, rueckmeldung_vnb } from '.';
import { AngularKonfigurationService, ApiModule, DokumentStatus, EProjektDTO } from '../api';
import { FormularTypenGuids, ProjektService, SignaturDef } from '../services';
import { SignatureRole } from '../services/projekt/signatureRole';
import { Guid } from '../tools/Guid';
import { VSE_IA18_DE_form } from './schema-guid-def';
import { inputGroup, label, schemaClassLayout, w_full, cb_single, card_panel, inputGroupCL, multiple_checkboxes_with_cust, checkBoxGroup, textZusammensetzen, unterschriften_panel, senden_panel_m2, formatiereDatum, isNumber, kuerzeStockwerk, nimmNaechstesWort, erstelleSendenPanel, erstelleAntwortSchnipsel, abrufeKontaktstruktur, KontaktArt, abfuelleKontaktFelder, tableHeaderTextRotate, tableHeaderText, card_edit_panel } from './schema-utils';

// const project:ProjectDTO

const idPanelUnterschreiben = 'VSE_IA18_DE_Unterschriften';
const idPanelSenden = 'VSE_IA18_DE_Senden';
const idPanelAntwort = 'VSE_IA18_DE_Rueckmeldung';

const kundeKomb_expr = (data: any) => {
	var ret = textZusammensetzen(data.BEZUEGER, ", ", data.RECHADR);
	ret = textZusammensetzen(ret, ", ", data.GEBTEIL);
	ret = textZusammensetzen(ret, ", ", data.NUTZUNG);
	return ret;
}

const stockwKomb_expr = (data: any) => {
	var ret = textZusammensetzen(data.STOCKWERK, ", ", data.EVUANLNR);
	return ret;
}

// Signaturen hier initalisieren, damit Sie an den benötigten Stellen verfügbar sind
const signaturen: SignaturDef[] = []
signaturen.push({
	rolle: [
		SignatureRole.Anschlussbewilligung,
		SignatureRole.BesondereAnlagen,
		SignatureRole.BetriebseigenenInstallationen,
		SignatureRole.FachkundigeInEigenheim,
		SignatureRole.FachkundigerElektroInstallateur,
		SignatureRole.FachkundigerElektroKontrolleur,
		SignatureRole.BewilligungsElektroinhaberInstallateur,
		SignatureRole.BewilligungsElektroinhaberKontrolleur,
	],
	signaturKey: 'SIGNATURE', titel: 'Elektro-Installateur', datumFeld: 'UX_DATUM'
})

const colDefsMessSteuer: ColDef[] = []
colDefsMessSteuer.push({ field: 'kundeKomb', htmlTitle: true, title: tableHeaderText('Kunde/in und <br> Rechnungsadresse, Nutzung'), expression: kundeKomb_expr, class: 'col-start-1 col-span-1 truncate-text' })
colDefsMessSteuer.push({ field: 'stockwKomb', title: 'Stockwerk / Verbrauchsstelle VNB', expression: stockwKomb_expr, class: 'col-start-2 col-span-1 truncate-text' })
colDefsMessSteuer.push({ field: 'RAUM', title: 'Raum-Nr.', class: 'col-start-3 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'TARIF', title: 'VNB Tarif', class: 'col-start-4 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'SICH_IN', title: 'Sich. [A]', class: 'col-start-5 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'WERKNR', title: 'Zähler-Nr. VNB', class: 'col-start-6 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'MONT_ORT', title: 'Mont. Ort', class: 'col-start-7 col-span-1  truncate-text' })
colDefsMessSteuer.push({ field: 'ZEV', htmlTitle: true, title: tableHeaderTextRotate('ZEV'), class: 'col-start-8 col-span-1  truncate-text', ausrichtungContent: 1 })
colDefsMessSteuer.push({ field: 'ANZ_AUSSENL', htmlTitle: true, title: tableHeaderText('Anz. Aussenl. <br> (1-3)'), class: 'col-start-9 col-span-1  truncate-text', ausrichtungContent: 1 })
colDefsMessSteuer.push({ field: 'NEU', htmlTitle: true, title: tableHeaderTextRotate('neu.'), class: 'col-start-10 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'VORH', htmlTitle: true, title: tableHeaderTextRotate('vorh.'), class: 'col-start-11 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'AUSW', htmlTitle: true, title: tableHeaderTextRotate('ausw.'), class: 'col-start-12 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'DEMONT', htmlTitle: true, title: tableHeaderTextRotate('dem.'), class: 'col-start-13 col-span-1  truncate-text', ausrichtungContent: 2 })
colDefsMessSteuer.push({ field: 'UMMONT', htmlTitle: true, title: tableHeaderTextRotate('umm.'), class: 'col-start-14 col-span-1  truncate-text', ausrichtungContent: 2 })

const colDefsVerbErzSpeich: ColDef[] = []
colDefsVerbErzSpeich.push({ field: 'ANZAHL', title: 'Anzahl', class: 'col-start-1 col-span-1 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'VERBRAUCHER', title: 'Verbr.', ausrichtungContent: 1, class: 'col-start-2 col-span-1 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'ERZEUGER', title: '	Erz.', ausrichtungContent: 1, class: 'col-start-3 col-span-1 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'SPEICHER', title: 'Spei.', ausrichtungContent: 1, class: 'col-start-4 col-span-1 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'TEXT', title: 'Bezeichnung des Verbrauchers, Erzeugers, Speichers', class: 'col-start-5 col-span-4 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'GES_DATUM', title: 'techn. Anschlussgesuch (TAG) vom', expression(data) { return data.GES_DATUM ? moment(data.GES_DATUM).format('DD.MM.YYYY') : '' }, class: 'col-start-9 col-span-2 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'KVA', title: 'Leistung Bezug vom Netz [kVA]', ausrichtungContent: 2, class: 'col-start-11 col-span-2 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'KVA_ANS_NETZ', title: 'Leistung Abgabe ans Netz [kVA]', ausrichtungContent: 2, class: 'col-start-13 col-span-2 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'SPEICH_KAP', title: 'Speicher- kapazität [kWh]', ausrichtungContent: 2, class: 'col-start-15 col-span-1 truncate-text' })
colDefsVerbErzSpeich.push({ field: 'ANZ_AUSSENL', title: 'Anz. Aussen- leiter (1-3)', ausrichtungContent: 1, class: 'col-start-16 col-span-1 truncate-text' })

const VSE_IA18_DE0_FrFormularHeader: IComponent = card_panel(/*'Formular'*/'', 'FrTitelIA18_FR', [
	{
		type: 'panel',
		name: 'formular_header',
		classLayout: 'grid grid-3-cols-auto col-span-3 mb-4',
		class: 'col-span-3',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
		children: [
			//{ type: 'label', label: 'Nummern', classLayout: 'text-xs font-bold col-span-2', },
			{
				type: 'panel',
				name: 'nummern_panel',
				classLayout: ` col-start-1 col-span-1`,
				children: [
					{ type: 'label', label: 'VNB Objekt-Nr.', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', field: 'ABONR', classLayout: '', },
					{ type: 'label', label: 'IA-Nr. / Jahr', classLayout: 'col-start-1 text-xs mt-2', },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'PROJ_NR', },
						{ type: 'label', label: '/', hidden(sm) { return !sm.Values.PROJ_NR && !sm.Values.PROJ_JAHR } },
						{ type: 'label', field: 'PROJ_JAHR', },
					]),
					{ type: 'label', field: 'ABONR', classLayout: '', },
					{ type: 'label', label: 'Meldungs-Nr. VNB', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', field: 'EVUAUFTJAHR', classLayout: '', },
				]
			},
		],
	},
]);

const VSE_IA18_DE10_Std: IComponent = card_edit_panel('Standort', 'FrStdVSE_IA18', 'gebaude', [
	{
		type: 'panel',
		name: 'projekt_daten',
		classLayout: 'grid grid-3-cols-auto col-span-3 mb-4',
		class: 'col-span-3',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
		children: [
			{ type: 'label', label: 'Standortangaben', classLayout: 'text-xs font-bold col-span-3', },
			// {
			// 	type: 'div', class: 'text-xs font-bold flex-row col-span-3', children: [
			// 		{ type: 'label', label: 'Standortangaben' },
			// 		{
			// 			type: 'button', icon: 'edit', kind: 'icon', color: 'primary', class: 'scale-75', onClick(sm) { sm.service.Edit_Dialog_Gebaeude(() => { sm.Schema.initFormular(sm); }) }
			// 		},
			// 	],
			// },
			{
				type: 'panel',
				name: 'standort_daten1',
				classLayout: ` col-start-1 col-span-1`,
				children: [
					{ type: 'label', label: 'Standort', classLayout: 'col-start-1 text-xs mt-2', },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'O_STRASSE', classLayout: '', },
						{ type: 'label', field: 'O_HAUSNR', classLayout: '', },
					]),
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'O_PLZ', classLayout: '', },
						{ type: 'label', field: 'O_ORT', classLayout: '', },
					]),
				]
			},
			{
				type: 'panel',
				name: 'standort_daten2',
				classLayout: ` col-start-2 col-span-1`,
				children: [
					{ type: 'label', label: '', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', label: 'Parzelle-Nr.', classLayout: 'col-start-2 text-xs mt-2', },
					{ type: 'label', field: 'PARZELLE', classLayout: '', },
					{ type: 'label', label: 'Gemeinde', classLayout: 'col-start-2 text-xs mt-2', },
					{ type: 'label', field: 'GEMEINDE', classLayout: '', },
				]
			},
			{
				type: 'panel',
				name: 'gebaeude_anlage_daten1',
				classLayout: ` col-start-3 col-span-1`,
				children: [
					{ type: 'label', label: 'Versicherungs-Nr.', classLayout: 'col-start-2 text-xs mt-2', },
					{ type: 'label', field: 'VERSICH', classLayout: '', },
					{ type: 'label', label: 'Gebäudeart', classLayout: 'text-xs mt-2', },
					{ type: 'label', field: 'GEBAEUDEART', classLayout: '', },
				]
			},
		],
	},
	{
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		children: [
			label('Anz. Einheiten / Zähler'),
			{
				type: 'input',
				field: 'ANZWOHNG',
				dataType: 'int',
				required: false,
			},
			label('Gebäudeteil'),
			{
				type: 'input',
				field: 'GEBAEUDETEIL',
				max: 40,
				dataType: 'string',
				required: false,
				width: w_full,
			},
			label(''),
			cb_single('Zusammenschluss zum Eigenverbrauch (ZEV)', 'ZEV', false),
			// {
			// 	type: 'button',
			// 	label: 'GetAnlage',
			// 	onClick(sm) {
			// 		console.log(sm.service.GetAnlage(sm.projekt, sm.dokumentDTO.guid))
			// 	}
			// },
			// {
			// 	type: 'button',
			// 	label: 'GetEmpfaenger',
			// 	async onClick(sm) {
			// 		const a = await sm.service.GetEmpfaenger(sm.projekt, sm.dokumentDTO.guid)
			// 		console.log(a)
			// 	}
			// },
		]
	},
])

const VSE_IA18_DE2_FrKontakteVSE: IComponent = card_edit_panel('Adressen / Geschäftspartner', 'FrKontakteVSE', 'adressen', [
	{
		type: 'panel',
		classLayout: 'w_full grid grid-cols-2 col-span-3',
		class: 'col-span-3',
		// style:'grid-template-columns: 1fr 1fr 1fr',
		children: [
			{
				type: 'panel',
				name: 'installateur',
				style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
				children: [
					{ type: 'label', label: 'Installationsbetrieb', classLayout: 'text-xs font-bold', },
					{ type: 'spinner', name: 'installateur_spinner', classLayout: 'mt-2' },
					{ type: 'label', field: 'I_KONZESS', classLayout: 'mt-2', },
					{ type: 'label', label: 'Adresse', classLayout: ' text-xs mt-2', },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'I_NAME1', classLayout: 'mt-2', },
						{ type: 'label', field: 'I_NAME2', },
					]),
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'I_ADRESSE1', },
						{ type: 'label', field: 'I_ADRESSE2', },
					]),
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'I_PLZ', },
						{ type: 'label', field: 'I_ORT', },
					]),
				]
			},
			{
				type: 'panel',
				name: 'sachbearbeiter',
				classLayout: ` col-start-2 col-span-1`,
				children: [
					{ type: 'label', label: 'Sachbearbeiter', classLayout: 'text-xs font-bold', },
					{ type: 'spinner', name: 'sachb_spinner', classLayout: ' mt-2' },
					{ type: 'label', field: 'I_SACHB', classLayout: ' mt-2', },
					{ type: 'label', field: 'I_EMAIL', classLayout: '', },
					{ type: 'label', field: 'I_TELNR', classLayout: '', },
				]
			},
			{
				type: 'panel',
				name: 'eigentuemer',
				style: '',
				classLayout: `col-start-3 col-span-1`,
				children: [
					{ type: 'label', label: 'Eigentümer', classLayout: 'text-xs font-bold', },
					{ type: 'spinner', name: 'eigent_spinner', classLayout: ' mt-2' },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'U_NAME1', },
						{ type: 'label', field: 'U_NAME2', },
					]),
					{ type: 'label', field: 'U_ADRESSE1', },
					{ type: 'label', field: 'U_ADRESSE2', },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'U_PLZ', },
						{ type: 'label', field: 'U_ORT', },
					]),
					{ type: 'label', field: 'U_EMAIL', },
					{ type: 'label', field: 'U_TELNR', },
				]
			},
		]
	},
	label('', true),
	label('Zusätzliche Adresse', true, 'font-bold'),
	{
		type: 'select',
		name: 'selectZusAdresse',
		field: 'ZUS_ADR',
		classLayout: 'col-start-1',
		diff: { neverShowDiffBtn: true },
		options: [{ value: 'EMPTY', text: '<keine>' }, { value: 'VERW', text: 'Verwaltung' }, { value: 'ARCH', text: 'Architekt' }],
		//required: true,
		onChange(sm, comp, value) {
			if (sm.formularStatus < DokumentStatus.SigniertGesperrt) {
				sm.setValue('VERW', (value === 'VERW'));
				sm.setValue('ARCH', (value === 'ARCH'));

				if (sm.Values.ARCH || value === 'EMPTY') {
					sm.setValues(
						[
							'GES_NAME1',
							'GES_NAME2',
							'GES_ADR1',
							'GES_ADR2',
							'GES_PLZ',
							'GES_ORT',
							'GES_EMAIL',
							'GES_TELNR',
						],
						[
							'',
							'',
							'',
							'',
							'',
							'',
							'',
							'',
						]
					);
				}

				initKontakte(sm);
			}
		},
	},
	{
		type: 'panel',
		name: 'hidden_controls',
		style: 'display: none;',
		children: [
			cb_single('', 'VERW', false),
			cb_single('', 'ARCH', false),
		]
	},
	{
		type: 'panel',
		name: 'PN_VERW',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
		hidden: true,
		classLayout: `col-start-1 col-span-3 mt-4`,
		children: [
			{ type: 'label', label: 'Verwaltung', classLayout: 'text-xs font-bold', },
			{ type: 'spinner', name: 'verw_spinner', classLayout: 'mt-2' },
			inputGroupCL('mr-2', [
				{ type: 'label', field: 'GES_NAME1', },
				{ type: 'label', field: 'GES_NAME2', },
			]),
			inputGroupCL('mr-2', [
				{ type: 'label', field: 'GES_ADR1', },
				{ type: 'label', field: 'GES_ADR2', },
			]),
			inputGroupCL('mr-2', [
				{ type: 'label', field: 'GES_PLZ', },
				{ type: 'label', field: 'GES_ORT', },
			]),
			{ type: 'label', field: 'GES_EMAIL', },
			{ type: 'label', field: 'GES_TELNR', },
		]
	},
	{
		name: 'PN_ARCH',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label('Name'),
			{
				type: 'input',
				field: 'GES_NAME11',
				max: 40,
				width: w_full,
			},
			label(''),
			{
				type: 'input',
				field: 'GES_NAME2',
				max: 40,
				width: w_full,
			},
			label('Adresse'),
			{
				type: 'input',
				field: 'GES_ADR1',
				max: 40,
				width: w_full,
			},
			label(''),
			{
				type: 'input',
				field: 'GES_ADR2',
				max: 40,
				width: w_full,
			},
			label('PLZ / Ort'),
			inputGroup(
				[
					{
						type: 'input',
						dataType: 'int',
						field: 'GES_PLZ',
						max: 4,
					},
					{
						type: 'input',
						max: 30,
						field: 'GES_ORT',
						width: w_full,
					}
				]
			),
			label('E-Mail'),
			{
				type: 'input',
				field: 'GES_EMAIL',
				max: 60,
				width: w_full,
			},
			label('Telefon'),
			{
				type: 'input',
				field: 'GES_TELNR',
				max: 16,
			},
		]
	},
])

const VSE_IA18_DE3_FrInstallationsbeschriebVSE_18: IComponent = card_panel('Installationsbeschrieb', 'FrInstallationsbeschriebVSE_18', [
	label('Beschrieb'),
	{
		type: 'input',
		field: 'I_TEXT',
		multiline: true,
		width: w_full,
		rows: 4,
		dataType: 'string',
		required: true,
	},
	label('Art der Installation'),
	checkBoxGroup([
		{ label: 'Neuanlage', field: 'I_NEW' },
		{ label: 'Änderung/Erweiterung', field: 'I_EXTENT' },
		{ label: 'Rückbau', field: 'I_REMOVE' },
		{ label: 'Bauanschluss', field: 'I_PROV' },
		{ label: 'Temporär', field: 'I_TEMP' },
		{ label: 'Festplatz', field: 'I_AREA' },
	], { required: true, multipleSelection: false }),
])

const VSE_IA18_DE4_FrInstallationVSE_IA18: IComponent = card_panel('Netzanschluss', 'FrInstallationVSE_IA18', [
	// {
	// 	type: 'panel',
	// 	name: 'hidden_controls',
	// 	style: 'display: none;',
	// 	children: [
	// 		{
	// 			type: 'input',
	// 			field: 'HAK_IST',
	// 			dataType: 'string',
	// 			max: 1,
	// 		},
	// 		{
	// 			type: 'input',
	// 			field: 'HAK_AENDERUNG',
	// 			dataType: 'string',
	// 			max: 1,
	// 		},
	// 	]
	// },
	label('Standort'),
	{
		type: 'input',
		field: 'ANSCH_ORT',
		max: 24,
		dataType: 'string',
	},
	{
		name: 'PN_NEU_BEST',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label(''),
			{
				// label: 'Tritt die/der Anlagenbetreiber*in die Einmalvergütung an eine Drittperson/Firma ab?\n',
				type: 'radiogroup',
				options: [{ value: 'N', text: 'neu' }, { value: 'B', text: 'bestehend' }],
				// required: true,
				classLayout: 'mt-checkbox-group w-max mb-6',
				field: 'HAK_IST',
				// onChange(sm, c, v){
				// 	sm.setValue('HAK_IST', v == 'neu' ? 'N' : 'B');
				// }
			},
		]
	},
	{
		name: 'PN_NEU',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			checkBoxGroup([
				{ label: 'Kabel', field: 'ANSCH_KAB' },
				{ label: 'Freileitung', field: 'ANSCH_FREI' },
			], { required: false, multipleSelection: false }),
			label('Erforderlicher AS-Überstromunterbrecher'),
			{
				type: 'input',
				field: 'ANSCH_AS_ERF',
				dataType: 'int',
				suffix: 'A',
			},
			label('max. Netzbezugsleistung'),
			{
				type: 'input',
				field: 'ANSCH_MAXBEZ',
				dataType: 'string',
				suffix: 'kVA',
			},
			label('max. Netzeinspeiseleistung'),
			{
				type: 'input',
				field: 'ANSCH_MAXSPEIS',
				dataType: 'string',
				suffix: 'kVA',
			},
		]
	},
	{
		name: 'PN_BEST',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			checkBoxGroup([
				{ label: 'Kabel', field: 'ANSCH_KAB' },
				{ label: 'Freileitung', field: 'ANSCH_FREI' },
			], { required: false, multipleSelection: false }),
			label('Bisheriger AS-Überstromunterbrecher'),
			{
				type: 'input',
				field: 'ANSCH_AS_VOR',
				dataType: 'int',
				suffix: 'A',
			},
			label('Modell'),
			{
				type: 'input',
				field: 'ANSCH_MOD',
				max: 14,
				dataType: 'string',
			},
			cb_single('HAK integriert', 'ANSCH_HAKINT', false),
			label('', true),
			label(''),
			{
				type: 'radiogroup',
				options: [{ value: 'K', text: 'keine Änderung' }, { value: 'V', text: 'muss verstärkt werden' }, { value: 'A', text: 'muss ausgewechselt werden' }],
				// required: true,
				classLayout: 'mt-checkbox-group w-max mb-6',
				field: 'HAK_AENDERUNG',
				// onChange(sm, c, v){		// es existiert keine Komponete desshalb kann hier sm.setValue(s) nicht verwendet werden
				// 	if(v === 'keine Änderung')
				// 		sm.setValue('HAK_AENDERUNG', 'K');
				// 	else if(v === 'muss verstärkt werden')
				// 		sm.setValue('HAK_AENDERUNG', 'V');
				// 	else if(v === 'muss ausgewechselt werden')
				// 		sm.setValue('HAK_AENDERUNG', 'A');
				// }
			},
		]
	},
	{
		name: 'PN_VERST_AUSGEW',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label('Erforderlicher AS-Überstromunterbrecher'),
			{
				type: 'input',
				field: 'ANSCH_AS_ERF',
				dataType: 'int',
				suffix: 'A'
			},
			label('max. Netzbezugsleistung:'),
			{
				type: 'input',
				field: 'ANSCH_MAXBEZ',
				dataType: 'string',
				suffix: 'kVA',
			},
			label('max. Netzeinspeiseleistung:'),
			{
				type: 'input',
				field: 'ANSCH_MAXSPEIS',
				dataType: 'string',
				suffix: 'kVA',
			},
		]
	},
	{
		name: 'PN_BAUANSCHL',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label('Modell'),
			{
				type: 'input',
				field: 'ANSCH_MOD',
				max: 14,
				dataType: 'string',
			},
			cb_single('HAK integriert', 'ANSCH_HAKINT', false),
			label('(H)AK-Nr'),
			{
				type: 'input',
				field: 'ANSCH_HAKNR',
				max: 20,
				dataType: 'string',
			},
			label('max. Netzbezugsleistung'),
			{
				type: 'input',
				field: 'ANSCH_MAXBEZ',
				dataType: 'string',
				suffix: 'kVA',
			},
			label('max. Netzeinspeiseleistung:'),
			{
				type: 'input',
				field: 'ANSCH_MAXSPEIS',
				dataType: 'string',
				suffix: 'kVA',
			},
		]
	},
	{
		name: 'PN_TEMPORAER',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label('Bisheriger AS-Überstromunterbrecher:'),
			{
				type: 'input',
				field: 'ANSCH_AS_VOR',
				dataType: 'int',
				suffix: 'A',
			},
			label('Modell'),
			{
				type: 'input',
				field: 'ANSCH_MOD',
				max: 14,
				dataType: 'string',
			},
			cb_single('HAK integriert', 'ANSCH_HAKINT', false),
			label('(H)AK-Nr'),
			{
				type: 'input',
				field: 'ANSCH_HAKNR',
				max: 20,
				dataType: 'string',
			},
			label('Erforderlicher AS-Überstromunterbrecher'),
			{
				type: 'input',
				field: 'ANSCH_AS_ERF',
				dataType: 'int',
				suffix: 'A',
			},
			label('max. Netzbezugsleistung'),
			{
				type: 'input',
				field: 'ANSCH_MAXBEZ',
				dataType: 'string',
				suffix: 'kVA',
			},
			label('max. Netzeinspeiseleistung:'),
			{
				type: 'input',
				field: 'ANSCH_MAXSPEIS',
				dataType: 'string',
				suffix: 'kVA',
			},
		]
	},
	{
		name: 'PN_FESTPLATZ',
		type: 'panel',
		classLayout: `${schemaClassLayout} col-span-2 mb-4`,
		class: 'col-span-3',
		style: '',
		hidden: true,
		children: [
			label('(H)AK-Nr'),
			{
				type: 'input',
				field: 'ANSCH_HAKNR',
				max: 20,
				dataType: 'string',
			},
			label('Erforderlicher AS-Überstromunterbrecher'),
			{
				type: 'input',
				field: 'ANSCH_AS_ERF',
				dataType: 'int',
				suffix: 'A',
			},
			label('max. Netzbezugsleistung'),
			{
				type: 'input',
				field: 'ANSCH_MAXBEZ',
				dataType: 'string',
				suffix: 'kVA',
			},
			label('max. Netzeinspeiseleistung:'),
			{
				type: 'input',
				field: 'ANSCH_MAXSPEIS',
				dataType: 'string',
				suffix: 'kVA',
			},
		]
	},
])

const VSE_IA18_DE5_FrVerbraucherListeVSE_IA18: IComponent = card_panel('Liste der Verbraucher, Erzeuger, Speicher', 'FrVerbraucherListeVSE_IA18', [
	//label(''),
	//cb_single('gemäss beiliegender Liste', 'VERBLIST', false),
	{
		type: 'button', kind: 'raised', /*icon: 'lock',*/ color: 'primary', label: 'Daten von TAG übernehmen', classLayout: 'mt-2', field: '',
		onClick(sm) {
			// Aktuell noch keinen Code
			sm.getCompByName('BnDatenAusTAG').hidden = false;
		},
	},
	{ type: 'label', name: 'BnDatenAusTAG', label: 'Diese Funktion ist aktuell noch nicht verfügbar!', classLayout: 'mt-5', hidden: true },
	{
		type: 'datatable',
		field: 'VGListe',
		classLayout: 'col-start-1 col-span-2',
		dragdrop: true,
		colDefs: colDefsVerbErzSpeich,
		detailComponent: {
			type: 'panel',
			classLayout: schemaClassLayout,
			children: [
				label('Anzahl'),
				{
					type: 'input',
					field: 'ANZAHL',
					dataType: 'int',
				},
				label(''),
				checkBoxGroup([
					{ label: 'Verbr.', field: 'VERBRAUCHER' },
					{ label: 'Erzeuger', field: 'ERZEUGER' },
					{ label: 'Speicher', field: 'SPEICHER' },
				], { required: false, multipleSelection: true }),
				label('Bezeichnung des Verbrauchers, Erzeugers, Speichers'),
				{
					type: 'input',
					field: 'TEXT',
					max: 50,
					dataType: 'string',
					options: [
						'Beleuchtung',
						'Kochherd mit Backofen',
						'Kochherd ohne Backofen',
						'Backofen',
						'Geschirrspüler',
						'Waschautomat',
						'Waschautomat mit Zählerumschalter',
						'Wäschetrockner',
						'Boiler  .... l,  Aufheizzeit .... h',
						'Motoren ohne Anschlussgesuch',
						'Motoren mit Anschlussgesuch',
						'Wärmepumpe ohne Anschlussgesuch',
						'Wärmepumpe mit Anschlussgesuch',
						'Apparat Netzrückwirkungen verursachend',
					],
				},
				label('techn. Anschlussgesuch (TAG) vom'),
				{
					type: 'date',
					field: 'GES_DATUM',
				},
				label('Leistung Bezug vom Netz'),
				{
					type: 'input',
					field: 'KVA',
					dataType: 'float',
					suffix: 'kVA'
				},
				label('Leistung Abgabe ans Netz'),
				{
					type: 'input',
					field: 'KVA_ANS_NETZ',
					dataType: 'float',
					suffix: 'kVA'
				},
				label('Speicherkapazität'),
				{
					type: 'input',
					field: 'SPEICH_KAP',
					dataType: 'float',
					suffix: 'kWh'
				},
				label('Anz. Aussenleiter (1-3)'),
				{
					type: 'input',
					field: 'ANZ_AUSSENL',
					dataType: 'int',
					options: [
						'1',
						'2',
						'3',
					],
				},
			],
		},
	},
	label('Leistung Total Bezug vom Netz'),
	{
		type: 'input',
		field: 'V_LEIST_VOM',
		dataType: 'float',
		suffix: 'kVA',
		disabled: true,
	},
	label('Leistung Total Abgabe ans Netz'),
	{
		type: 'input',
		field: 'V_LEIST_AN',
		dataType: 'float',
		suffix: 'kVA',
		disabled: true,
	},
	label('Voraussichtliche Maximalbelastung Total'),
	{
		type: 'input',
		field: 'V_LEISTMAX',
		dataType: 'float',
		suffix: 'kVA'
	},
	cb_single('aktive Steuerung VNB', 'STEUER_VNB', false),
	cb_single('Teilnahme an Systemdienstleistung (Regelenergie)', 'SYSTDIENSTL', false),
	cb_single('mit Herkunftsnachweis (HKN)', 'MITHKN', false),
])

const VSE_IA18_DE6_FrTarifapparateVSE_18: IComponent =
	card_panel('Liste der Mess- und Steuereinrichtungen', 'FrTarifapparateVSE_18', [
		{
			type: 'datatable',
			field: 'TAListe',
			classLayout: 'col-start-1 col-span-2',
			dragdrop: true,
			gridClass: 'grid-cols-ta-liste',
			colDefs: colDefsMessSteuer,
			detailComponent: {
				type: 'panel',
				classLayout: schemaClassLayout,
				children: [
					label('Kunde/in'),
					{
						type: 'input',
						field: 'BEZUEGER',
						max: 40,
						dataType: 'string',
					},
					label('Rechnungsadresse'),
					{
						type: 'input',
						field: 'RECHADR',
						max: 100,
						dataType: 'string',
						width: w_full,
					},
					label('Gebäudeteil'),
					{
						type: 'input',
						field: 'GEBTEIL',
						max: 40,
						dataType: 'string',
					},
					label('Nutzung'),
					{
						type: 'input',
						field: 'NUTZUNG',
						max: 40,
						dataType: 'string',
					},
					label('Verbrauchsstelle VNB'),
					{
						type: 'input',
						field: 'EVUANLNR',
						max: 20,
						dataType: 'string',
					},
					label('Stockwerk'),
					{
						type: 'input',
						field: 'STOCKWERK',
						max: 6,
						dataType: 'string',
					},
					label('Raumnummer'),
					{
						type: 'input',
						field: 'RAUM',
						max: 6,
						dataType: 'string',
					},
					label('VNB Tarif'),
					{
						type: 'input',
						field: 'TARIF',
						max: 30,
						dataType: 'string',
					},
					label('Sich. [A]'),
					{
						type: 'input',
						field: 'SICH_IN',
						dataType: 'int',
						suffix: 'A'
					},
					label('Zählernummer VNB'),
					{
						type: 'input',
						field: 'WERKNR',
						max: 20,
						dataType: 'string',
					},
					label('Montage Ort'),
					{
						type: 'input',
						field: 'MONT_ORT',
						max: 30,
						dataType: 'string',
					},
					label(''),
					cb_single('ZEV', 'ZEV', false),
					label('Anz. Aussenleiter (1-3)'),
					{
						type: 'input',
						field: 'ANZ_AUSSENL',
						dataType: 'int',
						options: [
							'1',
							'2',
							'3',
						],
					},
					label(''),
					checkBoxGroup([
						{ label: 'neu', field: 'NEU' },
						{ label: 'vorhanden', field: 'VORH' },
						{ label: 'auswechseln', field: 'AUSW' },
						{ label: 'demontiert', field: 'DEMONT' },
						{ label: 'ummonttiert', field: 'UMMONT' },
					], { required: false, multipleSelection: true }),
				],
			},
		},
		label('', true),
		{
			type: 'expansionspanel',
			name: 'FrTRE/LSG_VSE_IA18',
			label: 'TRE/LSG',
			class: 'col-span-2',
			field: 'tmpFldTRE_LSG',
			classLayout: `${schemaClassLayout} col-span-2 mb-4`,
			onChange(sm, comp) {
				sm.getCompByField('panel_RSE_TYP').required = comp.expanded;
			},
			children: [
				label('Anzahl'),
				{
					type: 'input',
					field: 'RSEANZ',
					dataType: 'int',
				},
				label('Kommandos'),
				{
					type: 'input',
					field: 'RSEKDO',
					max: 30,
					dataType: 'string',
				},
				label('TRE-Nr.'),
				{
					type: 'input',
					field: 'RSENR',
					max: 10,
					dataType: 'string',
				},
				label('Montageort'),
				{
					type: 'input',
					field: 'RSEMONT',
					max: 16,
					dataType: 'string',
				},
				multiple_checkboxes_with_cust(['RSENEU', 'RSEVORH', 'RSEAUSW', 'RSEDEMONT', 'RSEUMMONT'], ['neu', 'vorh.', 'ausw.', 'demont.', 'ummont.'], 'RSE_TYP', 0, undefined, false, false),
			]
		},
	])

const VSE_IA18_DE8_FrInbetriebnahmeVSE: IComponent = card_panel('Termine', 'FrInbetriebnahmeVSE', [
	{
		type: 'panel',
		class: 'col-span-2',
		classLayout: schemaClassLayout,
		children: [
			{
				type: 'panel',
				name: 'einreicher',
				style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
				children: [
					{ type: 'label', label: 'Voraussichtliche Inbetriebnahme', classLayout: 'text-xs font-bold', },
					// {	type: 'label', label: 'Datum', classLayout: ' text-xs mt-2', },
					{ type: 'label', field: 'TERMIN', dataType: 'date', classLayout: ' mt-2', },
				]
			},
		],
	},
	label('Voraussichtlicher Abschluss der Arbeiten'),
	{
		type: 'date',
		field: 'ABSCHLTERMIN',
	},
	{
		type: 'panel',
		name: 'hidden_controls',
		style: 'display: none;',
		children: [
			label('Voraussichtliche Inbetriebnahme'),
			{
				type: 'input',
				field: 'TERMIN',
				dataType: 'date'
			},
		]
	},
])

const VSE_IA18_DE9_FrBemerkungenVSE_IA18: IComponent = card_panel('Bemerkungen', 'FrBemerkungenVSE_IA18', [
	label(''),
	{
		type: 'input',
		field: 'INSTBEM',
		multiline: true,
		width: w_full,
		rows: 3,
		dataType: 'string',
	},

])

// const VSE_IA18_DE10_FrBeilagenVSE_IA18: IComponent = card_panel('Beilagen', 'FrBeilagenVSE_IA18', [
// 	label(''),
// 	multiple_checkboxes_with_cust(['SCHEMA', 'PLAN', 'GESUCH'], ['Schema', 'Situationsplan', 'Anschlussgesuch TAG für'], 'GESUCHTXT', 30, []),
// 	label(''),
// 	multiple_checkboxes_with_cust(['DISP', 'VERBLIST', 'STEUER', 'BEILLEER'], ['Disposition Hauptverteilung', 'Liste der Verbraucher, Erzeuger, Speicher', 'Zustimmung Endverbraucher/Erzeuger Steuerung durch VNB', ''], 'BEILTXT', 30, []),
// ])

const VSE_IA18_DE_Unterschriften = (sm: SchemaManager): Promise<IComponent> => unterschriften_panel(sm, idPanelUnterschreiben, '', signaturen, false);
const VSE_IA18_DE_Senden = (sm: SchemaManager): Promise<IComponent> => erstelleSendenPanel(sm, idPanelSenden);
const VSE_IA18_DE_Rueckmeldung = (sm: SchemaManager): Promise<IComponent> => erstelleAntwortSchnipsel(sm, VSE_IA18_DE_RueckmeldungVNB, idPanelAntwort, VSE_IA18_DE_form);

const VSE_IA18_DE_RueckmeldungVNB: IComponent = card_panel('Netzbetreiberin', idPanelAntwort, [
	multiple_checkboxes_with_cust(['EW_BEW', 'EW_VORB', 'EW_NBEW'], ['bewilligt', 'unter Vorbehalt bewilligt', 'unvollständig Retour'], '', 0, undefined, false, false),
	inputGroupCL('', [
		cb_single('Schema beachten', 'EW_SCHEMA', false),
		{
			type: 'input',
			field: 'EW_SCHEMNR',
			max: 10,
			dataType: 'string',
		},
	]),
	label('Bemerkungen'),
	{
		type: 'input',
		field: 'EW_BEM',
		multiline: true,
		width: w_full,
		rows: 3,
		dataType: 'string',
	},
	label('VNB'),
	{
		type: 'input',
		field: 'EW_ADR',
		max: 30,
		dataType: 'string',
	},
	label('Datum'),
	{
		type: 'label',
		dataType: 'date',
		field: 'EW_SIGNDAT',
		classLayout: 'items-center'
	},
	label('Unterschrift'),
	{
		type: 'label',
		field: 'EW_SIGN',
		classLayout: 'items-center'
	},
])

export const VSE_IA18_DE: ISchema = {
	type: 'panel',
	name: 'FrObjektStandortVSE_18',
	guid: VSE_IA18_DE_form,
	attribut: 'fe82c264-c60a-4e6d-9c16-4a13b144eaa6',
	label: 'Installations-Anzeige',
	iconText: 'IA',
	classLayout: "w-fulls",
	beilagen: [
		FormularTypenGuids.SIT_PLAN,
		FormularTypenGuids.BE,
		FormularTypenGuids.TAG,
	],
	steps: [
		{ step: 1, titel: 'Ausfüllen', status: DokumentStatus.InArbeit, target: VSE_IA18_DE3_FrInstallationsbeschriebVSE_18.name },
		{ step: 2, titel: 'Signieren', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
		{ step: 3, titel: 'Senden', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
		{ step: 4, titel: 'auf Antwort warten', status: [DokumentStatus.Gesendet, DokumentStatus.ErhaltBestaetigt], target: idPanelAntwort },
	],
	children: [
		VSE_IA18_DE0_FrFormularHeader,
		VSE_IA18_DE10_Std,
		VSE_IA18_DE2_FrKontakteVSE,
		VSE_IA18_DE3_FrInstallationsbeschriebVSE_18,
		VSE_IA18_DE4_FrInstallationVSE_IA18,
		VSE_IA18_DE5_FrVerbraucherListeVSE_IA18,
		VSE_IA18_DE6_FrTarifapparateVSE_18,
		VSE_IA18_DE8_FrInbetriebnahmeVSE,
		VSE_IA18_DE9_FrBemerkungenVSE_IA18,
		// VSE_IA18_DE10_FrBeilagenVSE_IA18,

	],
	signaturen: signaturen,
	async initFormular(sm: SchemaManager) {
		const service = sm.service;

		// Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
		if (sm.Schema.tag !== 100) {
			sm.Schema.children.push(await VSE_IA18_DE_Unterschriften(sm));
			sm.Schema.children.push(await VSE_IA18_DE_Senden(sm));
			sm.Schema.children.push(await VSE_IA18_DE_Rueckmeldung(sm));
			sm.Schema.tag = 100
		}

		if (sm.formularStatus === DokumentStatus.Undefiniert) {
			sm.saveStatus(DokumentStatus.InArbeit);
			// Nur hier ist man sicher, dass das Formular zum ersten Mal geöffnet wird
			sm.setValue('I_TEXT', sm.projekt.auftrag?.bemerkungen);
			sm.setValues(
				[
					'I_TEXT',
					'STEUER_VNB',
				],
				[
					sm.projekt.auftrag?.bemerkungen,
					true,
				]
			)
		}
		else if (sm.formularStatus >= DokumentStatus.SigniertGesperrt)
			sm.DisableAll();

		if (sm.formularStatus < DokumentStatus.SigniertGesperrt) {
			sm.setValues(
				[
					'O_STRASSE',
					'O_HAUSNR',
					'O_PLZ',
					'O_ORT',
					'GEMEINDE',
					'PARZELLE',
					'VERSICH',
					'GEBAEUDEART',
					'TERMIN',
				],

				[
					sm.projekt.gebaeude?.strasse,
					sm.projekt.gebaeude?.hausNr,
					sm.projekt.gebaeude?.plz,
					sm.projekt.gebaeude?.postOrt,
					sm.projekt.gebaeude?.gemeinde,
					sm.projekt.gebaeude?.parzelleNr,
					sm.projekt.gebaeude?.assekuranzNr,
					sm.projekt.gebaeude?.gebaeudeArt1,
					sm.projekt.auftrag?.datumInbetrieb,
				]
			)

			sm.getCompByName('installateur_spinner').loading = true;
			sm.getCompByName('sachb_spinner').loading = true;

			const gs = await abrufeKontaktstruktur(sm, KontaktArt.Solateur);
			abfuelleKontaktFelder(sm, gs, "I_", true, true);

			sm.getCompByName('installateur_spinner').loading = false;
			sm.getCompByName('sachb_spinner').loading = false;

			if (sm.projekt.gebaeude?.guid_Inhaber) {
				sm.getCompByName('eigent_spinner').loading = true;

				const gs = await abrufeKontaktstruktur(sm, KontaktArt.Eigentuemer);
				abfuelleKontaktFelder(sm, gs, "U_");

				sm.getCompByName('eigent_spinner').loading = false;
			}

			initKontakte(sm);
			schalteNetzrueckwirkungen(sm);

			let formularGuid: string = sm.dokumentDTO?.guid;
			const anlage = sm.service.GetAnlage(sm.projekt, formularGuid);
			// Daten aus erster Anlage in die Tarifapparate-Liste übernehmen
			if (anlage && !sm.Values.TAListe) {
				var stromkName = anlage.stromkName;
				// Gebäudeteil speziell auftrennen falls die Begriffe "Stockwerk" und/oder "Raum" vorkommen.
				// Die Begriffe hinter Stockwerk wird ins Feld Stockwerk übernommen, gleiches gilt für den Raum.
				// Alles was dahinter noch kommt wird nicht übernommen!
				var gebteil = anlage.gebaeudeTeil;

				var stockwerk = '';
				var raum = '';
				// Nach "Stockwerk" suchen und aufteilen
				if (gebteil) {
					var splitStock = gebteil.split('Stockwerk', 1);
					if (splitStock.length == 2) {						// Stockwerk gefunden
						gebteil = splitStock[0].trim();
						var splitRaum = splitStock[1].split('Raum', 1);
						if (splitRaum.length == 2) {					// Stockwerk und Raum gefunden
							stockwerk = splitRaum[0].trim();
							raum = splitRaum[1].trim();
						}
						else {					// Stockwerk gefunden, Raum nicht
							stockwerk = splitStock[1].trim();
						}
					}
				}
				else {							// Stockwerk nicht gefunden
					var splitRaum = gebteil.split("Raum", 1);
					if (splitRaum.length == 2) {						// Stockwerk nicht gefunden, Raum gefunden
						gebteil = splitRaum[0].trim();
						raum = splitRaum[1].trim();
					}
				}

				// Wenn RAUM oder STOCKWERK länger als 6 Zeichen ist dann doch wieder zurück ins Feld Gebäudeteil schreiben
				if (stockwerk.length > 6) {
					var gebteilZusatz = "Stockwerk" + stockwerk;
					if (!gebteil)
						gebteil = gebteilZusatz;
					else
						gebteil = gebteil + " " + gebteilZusatz;
					stockwerk = "";
				}
				if (raum.length > 6) {
					var gebteilZusatz = "Raum " + raum;
					if (!gebteil)
						gebteil = gebteilZusatz;
					else
						gebteil = gebteil + " " + gebteilZusatz;
					raum = "";
				}

				if (gebteil)
					gebteil = gebteil.substring(0, 40);

				var nutzung = anlage.bezeichnung;
				if (nutzung)
					nutzung = nutzung.substring(0, 40);

				// Stockwerk aus Gebäudeteil ermitteln
				// - 1. Wort nehmen (beendet mit . oder Leerzeichen)
				// - wenn mit . beendet wird, dann auch 2. Wort dazu nehmen
				// - 1. Wort kürzen (Obergeschoss -> OG etc.)
				// - wenn nicht kürzen konnte, dann 2. Wort kürzen
				//
				// Beispiele:
				// 1. OG				--> 1. OG
				// Ganzes Gebäude		-->
				// Erdgeschoss			--> EG
				// 2.Untergeschoss		--> 2. UG
				// REZ					--> rez
				// 1ère étage			--> 1ère

				// Nur wenn stockwerk noch nicht gefunden, dann versuchen es in Gebäudeteil zu finden
				var satz = stockwerk;
				if (!satz)
					satz = gebteil;

				if (satz) {
					var wort1 = '';
					var wort2 = '';
					// Erstes Wort auslesen
					wort1 = nimmNaechstesWort(satz);
					// restlicher Satz merken
					satz = satz.substring(wort1.length, satz.length).trim();
					wort1.trim();
					// Nächstes Wort auselesen
					if (wort1.endsWith(".")) {
						wort2 = nimmNaechstesWort(satz);
					}
					// restlicher Satz merken
					satz = satz.substring(wort2.length, satz.length).trim();
					wort2.trim();

					var wort1Tmp = kuerzeStockwerk(wort1);
					if (wort1Tmp)
						wort1 = wort1Tmp;
					var wort2Tmp = kuerzeStockwerk(wort2);
					if (wort2Tmp)
						wort2 = wort2Tmp;
					if (wort1Tmp || wort2Tmp) {
						if (wort1 && wort2)
							stockwerk = wort1 + " " + wort2;
						else if (wort1)
							stockwerk = wort1;
						else if (wort2)
							stockwerk = wort2;
					}
					else if ((wort1.length >= 1 && isNumber(wort1[0]))
						|| (wort1.length >= 2 && wort1[0] === '-' && isNumber(wort1[1]))) {
						stockwerk = wort1;
					}
				}

				// Zähler
				var zaehler = anlage.zaehlerNr1;
				var vorh = zaehler ? true : undefined;

				sm.Values.TAListe = [{ BEZUEGER: stromkName, GEBTEIL: gebteil, NUTZUNG: nutzung, STOCKWERK: stockwerk, RAUM: raum, WERKNR: zaehler, VORH: vorh }];
			}
		}
		else {
			schalteNetzrueckwirkungen(sm); // Trotzdem machen auch wenn schon signiert ist
			initKontaktAbschnitte(sm);
		}
	},
	onChange(sm, comp) {
		// Schaltung für den IA Netzanschluss-Abschnitt
		if ((comp.field === 'HAK_IST')
			|| (comp.field === 'HAK_AENDERUNG')
			|| (comp.field === 'I_NEW')
			|| (comp.field === 'I_EXTENT')
			|| (comp.field === 'I_REMOVE')
			|| (comp.field === 'I_PROV')
			|| (comp.field === 'I_TEMP')
			|| (comp.field === 'I_AREA')) {
			schalteNetzrueckwirkungen(sm);
		}

		// Berechnete Felder für Unterliste "Verbaucher"
		if (comp.field === 'VGListe' || (comp.parentComp && comp.parentComp.field === 'VGListe')) {
			const arr: any[] = sm.Values.VGListe;
			let totalKvaVomNetz: number = 0;
			let totalKvaAnsNetz: number = 0;
			let totAnz: number = 0;
			if (arr && arr.length > 0) {
				for (let ind = 0; ind < arr.length; ind++) {
					let kvaVomNetz = arr[ind].KVA;
					let kvaAnsNetz = arr[ind].KVA_ANS_NETZ;
					let ANZAHL = arr[ind].ANZAHL;
					if (!kvaVomNetz) kvaVomNetz = 0;
					if (!kvaAnsNetz) kvaAnsNetz = 0;
					if (!ANZAHL) ANZAHL = 1;

					totalKvaVomNetz += kvaVomNetz * ANZAHL;
					totalKvaAnsNetz += kvaAnsNetz * ANZAHL;
					totAnz += ANZAHL;
				}
			}
			sm.setValue('V_LEIST_VOM', totalKvaVomNetz.toFixed(2));
			sm.setValue('V_LEIST_AN', totalKvaAnsNetz.toFixed(2));
			sm.setValue('PVTOT_ANZ', totAnz);
		}
	},
}

// Kontakte initialisiseren oder bei einer Änderung aktualisieren
const initKontakte = (sm: SchemaManager) => {
	const service = sm.service;

	initKontaktAbschnitte(sm);
	// Verwaltungsadresse laden
	if (sm.Values.VERW) {
		if (sm.projekt.gebaeude?.guid_Verwaltung) {
			sm.getCompByName('verw_spinner').loading = true;

			abrufeKontaktstruktur(sm, KontaktArt.Verwaltung).then(verw => {
				setTimeout(() => {
					abfuelleKontaktFelder(sm, verw, "GES_");
				}, 0);
			}).catch(e => {
				console.error(e);
			}).finally(() => {
				//    counterObj$.next(counterObj$.value + 1);
				sm.getCompByName('verw_spinner').loading = false;
			})
		}
	}
}

const initKontaktAbschnitte = (sm: SchemaManager) => {
	if (sm.Values.VERW)
		sm.Values.ZUS_ADR = 'VERW';
	else if (sm.Values.ARCH)
		sm.Values.ZUS_ADR = 'ARCH';

	sm.getCompByName('PN_VERW').hidden = sm.Values.VERW ? false : true;
	sm.getCompByName('PN_ARCH').hidden = sm.Values.ARCH ? false : true;
}

const schalteNetzrueckwirkungen = (sm: SchemaManager) => {
	var neuAenderErweit = sm.Values.I_NEW || sm.Values.I_EXTENT;
	sm.getCompByName('PN_NEU_BEST').hidden = !neuAenderErweit;
	sm.getCompByName('PN_NEU').hidden = !(sm.Values.HAK_IST === 'N') || !neuAenderErweit;
	sm.getCompByName('PN_BEST').hidden = !(sm.Values.HAK_IST === 'B') || !neuAenderErweit;
	sm.getCompByName('PN_VERST_AUSGEW').hidden = !(sm.Values.HAK_AENDERUNG === 'V' || sm.Values.HAK_AENDERUNG === 'A') || !neuAenderErweit;
	sm.getCompByName('PN_BAUANSCHL').hidden = !sm.Values.I_PROV;
	sm.getCompByName('PN_TEMPORAER').hidden = !sm.Values.I_TEMP;
	sm.getCompByName('PN_FESTPLATZ').hidden = !sm.Values.I_AREA;
}
