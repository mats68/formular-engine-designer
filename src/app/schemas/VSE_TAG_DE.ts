
import { IComponent, ISchema, SchemaManager } from 'src/app/components';

import { inputGroup, label, schemaClassLayout, w_full, cb_single, card_panel, checkBoxGroup, inputGroupCL, multiple_checkboxes_with_cust, hasBeilage, hasAllRequired, textZusammensetzen, normal_panel, unterschriften_panel, senden_panel, antwort_meldefomrulare_panel, senden_panel_m2, formatiereDatum, erstelleSendenPanel, erstelleAntwortSchnipsel, abrufeKontaktstruktur, KontaktArt, abfuelleKontaktFelder, card_edit_panel, withPrecision, SetzePvDaten } from './schema-utils';
import { MELDEFORMULAR_SOLAR_BE_DE_form, VSE_TAG_DE_attr, VSE_TAG_DE_form } from './schema-guid-def';
import { init_rueckmeldung_vnb, rueckmeldung_vnb } from './schnipsel_rueckmeldung';
import { style } from '@angular/animations';
import * as moment from 'moment';
import { DokumentStatus } from '../api';
import { SignaturDef } from '../services';
import { SignatureRole } from '../services/projekt/signatureRole';
import { Guid } from '../tools/Guid';
import { labelhtml } from '.';
import { ProjektBeilagen } from '../tools';

const idPanelUnterschreiben = 'VSE_TAG_DE_Unterschriften';
const idPanelSenden = 'VSE_TAG_DE_Senden';
const idPanelAntwort = 'VSE_TAG_DE_Rueckmeldung';

// Signaturen hier initalisieren, damit Sie an den benötigten Stellen verfügbar sind
const signaturen: SignaturDef[] = []
signaturen.push({ rolle: [SignatureRole.BasisAnwender], signaturKey: 'SIGNATURE', titel: 'Elektro-Installateur', datumFeld: 'UX_DATUM' })

const VSE_TAG_DE0_FrFormularHeaderVSE_TAG: IComponent = card_panel(/*'Formular'*/'', 'VSE_TAG_DE0_FrFormularHeaderVSE_TAG', [
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
					{ type: 'label', label: 'Meldungs-Nr. VNB', classLayout: 'col-start-1 text-xs mt-2', },
					{ type: 'label', field: 'EVUAUFTJAHR', classLayout: '', },
					{ type: 'label', field: 'WERK', hidden: true },
					{ type: 'label', field: 'PACKNAME', hidden: true },
				]
			},
		],
	},
]);

const VSE_TAG_DE1_FrObjektStandortVSE_TAG: IComponent = card_edit_panel('Ort der Installation', 'VSE_TAG_DE1_FrObjektStandortVSE_TAG', 'gebaude', [
	{
		type: 'panel',
		name: 'projekt_daten',
		classLayout: 'grid grid-3-cols-auto col-span-3 mb-4',
		class: 'col-span-3',
		style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
		children: [
			{ type: 'label', label: 'Standortangaben', classLayout: 'text-xs font-bold col-span-2', },
			{ type: 'label', label: 'Gebäude / Anlage', classLayout: 'text-xs font-bold col-start-3', },
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
					{ type: 'label', label: 'Gebäudeart', classLayout: 'text-xs mt-2', },
					{ type: 'label', field: 'GEBAEUDEART', classLayout: '', },
					{ type: 'label', label: 'Zähler-Nr.', classLayout: 'text-xs mt-2', },
					{ type: 'label', field: 'ZAEHLER', classLayout: '', },
				]
			},
		],
	},
	label('Gebäude'),
	{

		type: 'panel',
		classLayout: 'col-start-2 col-span-1 flex flex-wrap items-center',
		required: true,
		children: [
			multiple_checkboxes_with_cust(['G_NEUBAU', 'G_BESTEHEND', 'G_X'], ['neu', 'bestehend', ''], 'G_XTEXT', 33, undefined, false, true, true, undefined, true),
		]
	},
])

const VSE_TAG_DE2_FrAnlageVSE_TAG: IComponent = card_panel('Netzanschluss', 'FrAnlageVSE_TAG', [
	label('Netzanschluss (HAK)'),
	{
		type: 'input',
		field: 'NETZ_A',
		dataType: 'int',
		suffix: 'A',
		required: true,
		diff: {
			// changed: true
		}
	},
	checkBoxGroup([
		{ label: 'neu', field: 'NETZ_NEU' },
		{ label: 'bestehend', field: 'NETZ_BEST' },
	], { required: true }),
])

const VSE_TAG_DE3_FrKontakteVSE_TAG: IComponent = card_edit_panel('Adressen / Geschäftspartner', 'FrKontakteVSE_TAG', 'adressen', [
	{
		type: 'panel',
		classLayout: 'w_full grid grid-3-cols-auto col-span-3',
		class: 'col-span-3',
		// style:'grid-template-columns: 1fr 1fr 1fr',
		children: [
			{
				type: 'panel',
				name: 'einreicher',
				// label: 'Einreichendes Unternehmen',
				// expanded: true,
				// class: 'col-span-1',
				style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.25rem;',
				children: [
					{ type: 'label', label: 'Einreichendes Unternehmen', classLayout: 'text-xs font-bold', },
					{ type: 'spinner', name: 'einreicher_spinner', classLayout: 'mt-2' },
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
				classLayout: ` col-start-3 col-span-1`,
				children: [
					{ type: 'label', label: 'Eigentümer', classLayout: 'text-xs font-bold', },
					{ type: 'spinner', name: 'eigent_spinner', classLayout: ' mt-2' },
                  { type: 'label', field: 'U_NAME1', },
                  { type: 'label', field: 'U_NAME2', },
					{ type: 'label', field: 'U_ADRESSE1', },
					{ type: 'label', field: 'U_ADRESSE2', },
					inputGroupCL('mr-2', [
						{ type: 'label', field: 'U_PLZ', },
						{ type: 'label', field: 'U_ORT', },
					]),
					{ type: 'label', field: 'U_EMAIL', },
					{ type: 'label', field: 'U_TELNR', },
					// TODO: Sprache
				]
			},
		],
	}
])

const VSE_TAG_DE4_FrTermineVSE_TAG: IComponent = card_panel('Termine', 'VSE_TAG_DE4_FrTermineVSE_TAG', [
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
					{ type: 'label', field: 'TERMIN', dataType: 'date', classLayout: ' mt-2', },
				]
			},
			{
				type: 'panel',
				name: 'hidden_controls',
				style: 'display: none;',
				children: [
					// label('Voraussichtliche Inbetriebnahme:'),
					// {
					//    type: 'input',
					//    field: 'TERMIN',
					//    dataType: 'date'
					// },
				]
			},
		],
	}
]);

const VSE_TAG_DE_Geraete: IComponent = card_panel('Geräte', 'VSE_TAG_DE_Geraete', [
	{
		type: 'panel',
		class: '',
		classLayout: 'col-span-6',
		children: [
			{
				// type: 'expansionspanel',
				type: 'switchpanel',
				name: 'FrElektrischeWaermeVSE_TAG',
				label: 'Elektrische Wärme / Wärmepumpe (WP)',
				field: 'GERAET_EWWP',
				class: 'col-span-2',
				classLayout: `${schemaClassLayout} col-span-2 mb-4`,
				children: [
					multiple_checkboxes_with_cust(['WP_NEUANL', 'WP_AENDERW'], ['Neuanlage', 'Änderung/Erweiterung'], 'WP_NEU_AENDER', 0, undefined, true, false, true),
					label('Kantonale Genehmigung vorhanden'),
					inputGroup([
						cb_single('Ja', 'WP_GENEHMIGUNG'),
					]),
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'WP_ARTGER',
						max: 34,
						dataType: 'string'
					},
					label('Gerätehersteller'),
					{
						type: 'input',
						field: 'WP_GERHERST',
						max: 34,
						dataType: 'string'
					},
					label('Art des Betriebs'),
					multiple_checkboxes_with_cust(['WP_ARTMONO', 'WP_ARTBI'], ['monovalent', 'bivalent'], 'WP_ARTBET', 0, undefined, true, false, false),
					label('Gerätetyp'),
					{
						type: 'input',
						field: 'WP_GERTYP',
						max: 34,
						dataType: 'string'
					},
					label('Gerätedaten Seite AC', true, 'font-bold'),
					label('Anschluss'),
					multiple_checkboxes_with_cust(['WP_ANSCHL3X', 'WP_ANSCHL1X', 'WP_ANSCHLANDERE'], ['3x400V', '1x230V', 'Andere'], '', 0, undefined, false, false, true),
					label('Nennstrom Gerät'),
					{
						type: 'input',
						field: 'WP_NENNSTROM',
						dataType: 'float',
						suffix: 'A'
					},
					label('Anlaufstrom Gerät (10ms)'),
					{
						type: 'input',
						field: 'WP_ANLSTROM',
						dataType: 'float',
						suffix: 'A'
					},
					label('Anzahl Geräte'),
					{
						type: 'input',
						field: 'WP_ANZGER',
						dataType: 'int',
						suffix: 'Stk.'
					},
					label('Nennleistung Gerät'),
					{
						type: 'input',
						field: 'WP_NENNLEIST_G',
						dataType: 'float',
						suffix: 'kW/kVA'
					},
					label('Nennleistung Total'),
					{
						type: 'input',
						field: 'WP_NENNLEIST_TOT',
						dataType: 'float',
						suffix: 'kW/kVA'
					},
					label('Spitzenleistung Total'),
					{
						type: 'input',
						field: 'WP_SPITZLEIST',
						dataType: 'float',
						suffix: 'kW/kVA'
					},
					label('Spezifikationen', true, 'font-bold'),
					label('Anlaufart'),
					multiple_checkboxes_with_cust(['WP_DIREKTANL', 'WP_WIEDANL', 'WP_INVERTER', 'WP_FREQUMF', 'WP_SANFTANL'], ['Direktanlauf', 'Widerstandsanlasser', 'Inverter', 'Frequenzumformer', 'Sanftanlasser'], 'WP_ANLAUFART', 0, undefined, true, false, true),
					label('Elektrische Zusatzheizung'),
					multiple_checkboxes_with_cust(['WP_ELZUSHEIZ_NEIN', 'WP_ELZUSHEIZ_JA'], ['Nein', 'Ja'], 'WP_ELZUSAHEIZ', 0, undefined, true, false, true),
					// Hier muss normal_panel verwendet werden, da sonst die Einrückung nicht mehr stimmt
					normal_panel('PnElZusHeizJa', [label('Wenn Ja, Leistung'), { type: 'input', field: 'WP_ELZUSHEIZ_LEIST', dataType: 'float', suffix: 'kW', }]),
					label('Wärmepumpentyp'),
					multiple_checkboxes_with_cust(['WP_PUMPTYP_SW', 'WP_PUMPTYP_WW', 'WP_PUMPTYP_LL', 'WP_PUMPTYP_LW'], ['Sole / Wasser', 'Wasser / Wasser', 'Luft / Luft', 'Luft / Wasser'], '', 0, undefined, false, false, true),
					label('Art der Wassererwärmung'),
					multiple_checkboxes_with_cust(['WP_WERW_EL', 'WP_WERW_WPB', 'WP_WERW_WP', 'WP_WERW_SONNE'], ['elektrisch', 'Wärmepumpenboiler', 'Wärmepumpe', 'Sonnenkollektoren'], '', 0, undefined, false, false, true),
					label('Warmwasserspeicher', true, 'font-bold'),
					label('Anzahl'),
					{
						type: 'input',
						field: 'WP_WARMWSPEICH_ANZ',
						dataType: 'int',
						suffix: 'Stk'
					},
					label('Inhalt'),
					{
						type: 'input',
						field: 'WP_WARMWSPEICH_INH',
						dataType: 'int',
						suffix: 'l'
					},
					label('Gesamtleistung'),
					{
						type: 'input',
						field: 'WP_WARMWSPEICH_LEIST',
						dataType: 'float',
						suffix: 'kW'
					},
				],
			},
			{
				// type: 'expansionspanel',
				type: 'switchpanel',
				name: 'FrEEAVSE_TAG',
				label: 'Energieerzeugungsanlagen (EEA)',
				field: 'GERAET_EEA',
				class: 'col-span-2',
				classLayout: `${schemaClassLayout} col-span-2 mb-4`,
				children: [
					label(''),
					multiple_checkboxes_with_cust(['EEA_NEUANL', 'EEA_AENDERW'], ['Neuanlage', 'Änderung/Erweiterung'], 'EEA_NEU_AENDER', 0, undefined, true, false, true),
					label('Energieträger'),
					multiple_checkboxes_with_cust(['EEA_ENERGT_PV', 'EEA_ENERGT_WASSER', 'EEA_ENERGT_WIND', 'EEA_ENERGT_WWK', 'EEA_ENERGT_BIOGAS', 'EEA_ENERGT_X'], ['Sonne (PV)', 'Wasser', 'Wind', 'WKK Anlage / BHKW', 'Biogas', 'Andere:'], 'EEA_ENERGT_XTEXT', 18, undefined, true, true, true),
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'EEA_ARTGER',
						max: 34,
						dataType: 'string'
					},
					label('Gerätehersteller'),
					{
						type: 'input',
						field: 'EEA_GERHERST',
						max: 34,
						dataType: 'string'
					},
					label('Art des Betriebs'),
					multiple_checkboxes_with_cust(['EEA_NETZVERB', 'EEA_INSELBETR', 'EEA_NOTSTROM'], ['Netzverbund', 'Inselbetrieb', 'Notstromanlage'], '', 0, undefined, false, false, false),
					label('Gerätetyp'),
					{
						type: 'input',
						field: 'EEA_GERTYP',
						max: 34,
						dataType: 'string'
					},
					label('Eigenverbrauch'),
					multiple_checkboxes_with_cust(['EEA_EIGENVERB_NEIN', 'EEA_EIGENVERB_JA'], ['Nein', 'Ja'], 'EEA_EIGENVERB', 0, undefined, true, false, true),
					// Hier muss normal_panel verwendet werden, da sonst die Einrückung nicht mehr stimmt
					normal_panel('PnEigenverbrJa', [label('Wenn Ja'), inputGroup([label('einzel = Eigenverbrauch über einen Zählerstromkreis', false , 'text-xs', false, undefined, 'col-label-normal'), ]), inputGroup([label('mehrere = Eigenverbrauchergemeinschaft (ZEV oder Modell des Netzbetreibers)', false , 'text-xs col-label-normal', false, undefined, 'col-label-normal'),]), multiple_checkboxes_with_cust(['EEA_EIGENVERB_EINZEL', 'EEA_EIGENVERB_MEHR'], ['einzel', 'mehrere'], 'EEA_EIGENVERB_JA', 0, undefined, true, false)],),
					label('Zusammenschluss zum Eigenverbrauch (ZEV)'),
					multiple_checkboxes_with_cust(['EEA_ZEV_NEIN', 'EEA_ZEV_JA'], ['Nein', 'Ja'], 'EEA_ZEV', 0, undefined, true, false, true),
					// Hier muss normal_panel verwendet werden, da sonst die Einrückung nicht mehr stimmt
					normal_panel('PnZEVJa', [label('Wenn Ja, Vorsicherung des VNB ZEV-Zählers'), { type: 'input', field: 'EEA_VORSICH_ZEV', dataType: 'int', suffix: 'A', }]),
					normal_panel('PnNotstromZeitweise', [label('Notstromanlage zeitweise mit Netz verbunden'), multiple_checkboxes_with_cust(['EEA_NOTSTROM_NEIN', 'EEA_NOTSTROM_JA'], ['Nein', 'Ja'], 'EEA_NOTSTROM', 0, undefined, true, false, true),]),
					normal_panel('PnUmschaltungNotstrom', [label('Umschaltung Netzverbund/Notstrom und umgekehrt mit Netzunterbruch'), multiple_checkboxes_with_cust(['EEA_UMSCH_NEIN', 'EEA_UMSCH_JA'], ['Nein', 'Ja'], 'EEA_UMSCH_NOTSTROM', 0, undefined, true, false, true),]),
					label('Teilnahme an der Systemdienstleistung'),
					multiple_checkboxes_with_cust(['EEA_SYSTEMD_NEIN', 'EEA_SYSTEMD_JA'], ['Nein', 'Ja'], 'EEA_SYSTEMDIENSTLEIST', 0, undefined, true, false, true),
					// Hier muss normal_panel verwendet werden, da sonst die Einrückung nicht mehr stimmt
					normal_panel('PnTeilSystemdienstJa', [label('Anbieter'), { type: 'input', field: 'EEA_SYSTEMD_ANBIET', max: 34, dataType: 'string' }]),
					label('Gerätedaten Seite AC', true, 'font-bold'),
					label('Anschluss'),
					multiple_checkboxes_with_cust(['EEA_ANSCHL3X', 'EEA_ANSCHL1X', 'EEA_ANSCHLANDERE'], ['3x400V', '1x230V', 'Andere'], 'EEA_ANSCHL', 0, undefined, true, false, true),
					label('Anzahl Geräte'),
					{
						type: 'input',
						field: 'EEA_ANZGER',
						dataType: 'int',
						suffix: 'Stk',
					},
					label('Nennleistung Gerät'),
					{
						type: 'input',
						field: 'EEA_NENNLEIST_GER',
						dataType: 'float',
						suffix: 'kVA',
					},
					label('Nennleistung Total'),
					{
						type: 'input',
						field: 'EEA_NENNLEIST_TOT',
						dataType: 'float',
						suffix: 'kVA',
					},
					label('Max. Leistungsabgabe ans Netz'),
					inputGroup([
						label('Gesamtsystem inkl. bereits installierter Leistung und allfällig installiertem Energiespeicher mit Rückspeisung in das Verteilnetz', false , 'text-xs'),
					]),
					label(''),
					{
						type: 'input',
						field: 'EEA_MAXLEIST_NETZ',
						dataType: 'float',
						suffix: 'kVA',
					},
					label('Einspeisebegrenzung'),
					multiple_checkboxes_with_cust(['EEA_EINSPBEGR_NEIN', 'EEA_EINSPBEGR_JA'], ['Nein', 'Ja'], 'EEA_EINSPEISEBEGR', 0, undefined, true, false, true),
					label('cos Φ im Betrieb'),
					{
						type: 'input',
						field: 'EEA_MAXLEIST_COS',
						dataType: 'float',
						default: 1,
					},
					normal_panel('PnEEAIstPV', [label('Photovoltaik', true, 'font-bold'), label('Leistung DC Total'), inputGroup([label('bei einem Zubau die Angaben der Erweiterung) / Datenblätter (WR und Module) müssen nicht eingereicht werden', false , 'text-xs'),]), inputGroup([{ type: 'input', field: 'EEA_LEISTTOT', dataType: 'float', suffix: 'kWp', }]),]),
				]
			},
			{
				// type: 'expansionspanel',
				type: 'switchpanel',
				name: 'FrNetzrueckwirkungenVSE_TAG',
				label: 'Anlagen mit Netzrückwirkungen',
				field: 'GERAET_NETZR',
				class: 'col-span-2',
				classLayout: `${schemaClassLayout} col-span-2 mb-4`,
				children: [
					label(''),
					multiple_checkboxes_with_cust(['NETZ_NEUANL', 'NETZ_AENDERW'], ['Neuanlage', 'Änderung/Erweiterung'], 'NETZ_NEU_AENDER', 0, undefined, true, false, true),
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'NETZ_ARTGER',
						max: 34,
						dataType: 'string'
					},
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'NETZ_GERHERST',
						max: 34,
						dataType: 'string'
					},
					label('Gerätetyp'),
					{
						type: 'input',
						field: 'NETZ_GERTYP',
						max: 34,
						dataType: 'string'
					},
					label('Gerätedaten Seite AC', true, 'font-bold'),
					label('Anschluss'),
					multiple_checkboxes_with_cust(['NETZ_ANSCHL3X', 'NETZ_ANSCHL1X', 'NETZ_ANSCHLANDERE'], ['3x400V', '1x230V', 'Andere'], 'NETZ_ANSCHLUSS', 0, undefined, true, false, true),
					label('Nennstrom Gerät'),
					{
						type: 'input',
						field: 'NETZ_NENNSTROM',
						dataType: 'float',
						suffix: 'A',
					},
					label('Anlaufstrom Gerät (10ms)'),
					{
						type: 'input',
						field: 'NETZ_ANLSTROM',
						dataType: 'float',
						suffix: 'A',
					},
					label('Anzahl Geräte'),
					{
						type: 'input',
						field: 'NETZ_ANZGER',
						dataType: 'int',
						suffix: 'Stk',
					},
					label('Anz. Anläufe pro Min.'),
					{
						type: 'input',
						field: 'NETZ_ANZANLAUFE',
						dataType: 'int'
					},
					label('Nennleistung Gerät'),
					{
						type: 'input',
						field: 'NETZ_NENNLEIST_GER',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Nennleistung Total'),
					{
						type: 'input',
						field: 'NETZ_NENNLEIST_TOT',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Spitzenleistung Total'),
					{
						type: 'input',
						field: 'NETZ_SPITZENLESIT',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('cos Φ im Betrieb'),
					{
						type: 'input',
						field: 'NETZ_COS',
						dataType: 'float',
						default: 1
					},
					label('Spezifikationen', true, 'font-bold'),
					label('Anlaufart'),
					multiple_checkboxes_with_cust(['NETZ_DIREKTANL', 'NETZ_WIEDANL', 'NETZ_INVERTER', 'NETZ_SANFTANL', 'NETZ_FREQUMF', 'NETZ_ANLHILFEN'], ['Direktanlauf', 'Widerstandsanlasser', 'Inverter', 'Sanftanlasser', 'Frequenzumformer', 'weitere Anlaufhilfen'], '', 0, undefined, false, false, false),
					label('Blindstromkompensation'),
					multiple_checkboxes_with_cust(['NETZ_BLINDKOMP_OHNE', 'NETZ_BLINDKOMP_BEST', 'NETZ_BLINDKOMP_NEU'], ['Ohne', 'Bestehend', 'Neuanlage'], '', 0, undefined, false, false, true),
				]
			},
			{
				// type: 'expansionspanel',
				type: 'switchpanel',
				name: 'FrEnergiespeicherVSE_TAG',
				label: 'Energiespeicher',
				field: 'GERAET_BATTERIE',
				class: 'col-span-2',
				classLayout: `${schemaClassLayout} col-span-2 mb-4`,
				children: [
					label(''),
					multiple_checkboxes_with_cust(['ENSP_NEUANL', 'ENSP_AENDERW'], ['Neuanlage', 'Änderung/Erweiterung'], 'ENSP_NEU_AENDER', 0, undefined, true, false, true),
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'ENSP_ARTGER',
						max: 34,
						dataType: 'string'
					},
					label('Gerätehersteller'),
					{
						type: 'input',
						field: 'ENSP_GERHERST',
						max: 34,
						dataType: 'string'
					},
					label('Art des Betriebs'),
					multiple_checkboxes_with_cust(['ENSP_NETZVERB', 'ENSP_INSELBETR', 'ENSP_NOTSTROM'], ['Netzverbund', 'Inselbetrieb', 'Notstromfähig'], 'ENSP_ARTBET', 0, undefined, true, false, true),
					label('Gerätetyp'),
					{
						type: 'input',
						field: 'ENSP_GERTYP',
						max: 34,
						dataType: 'string'
					},
					label('Notstromanlage zeitweise mit Netz verbunden'),
					multiple_checkboxes_with_cust(['ENSP_NOTSTRNETZ_N', 'ENSP_NOTSTRNETZ_J'], ['Nein', 'Ja'], 'ENSP_NOTSTROMANL', 0, undefined, true, false, true),
					label('Umschaltung Netzverbund/Notstrom'),
					multiple_checkboxes_with_cust(['ENSP_UMSCH_N', 'ENSP_UMSCH_J'], ['Nein', 'Ja'], 'ENSP_UMSCH_NOTSTROM', 0, undefined, true, false, true),
					label('Gerätedaten Seite AC', true, 'font-bold'),
					label('Anschluss'),
					multiple_checkboxes_with_cust(['ENSP_ANSCHL3X', 'ENSP_ANSCHL1X', 'ENSP_NURDC'], ['3x400V', '1x230V', 'nur DC'], 'ENSP_ANSCHL', 0, undefined, true, false, false),
					label('Nennstrom Gerät'),
					{
						type: 'input',
						field: 'ENSP_NENNSTROM',
						dataType: 'float',
						suffix: 'A'
					},
					label('Anzahl Geräte'),
					{
						type: 'input',
						field: 'ENSP_ANZGER',
						dataType: 'int',
						suffix: 'Stk'
					},
					label('Nennleistung Gerät'),
					{
						type: 'input',
						field: 'ENSP_NENNLEIST_GER',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Nennleistung Total'),
					{
						type: 'input',
						field: 'ENSP_NENNLEIST_TOT',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Spitzenleistung Total'),
					{
						type: 'input',
						field: 'ENSP_SPITZLEIST',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('cos Φ im Betrieb'),
					{
						type: 'input',
						field: 'ENSP_COS',
						dataType: 'float',
						default: 1,
					},
					label('Spezifikationen', true, 'font-bold'),
					label('Integration des Energiespeichers'),
					multiple_checkboxes_with_cust(['ENSP_ENERGSP_AC', 'ENSP_ENERGSP_DC'], ['AC (im AC Teil der Installation)', 'DC (im DC Teil der Installation)'], 'ENSP_INTEGRATION', 0, undefined, true, false, true),
					label('Elektrische Leistung (Systemleistung)'),
					{
						type: 'input',
						field: 'ENSP_SYSTLEIST',
						dataType: 'float',
						suffix: 'kW'
					},
					label('Speicherkapazität'),
					{
						type: 'input',
						field: 'ENSP_SPEICHKAP',
						dataType: 'float',
						suffix: 'kWh'
					},
					label('Betriebsart des Speichers', true, 'font-bold'),
					label(''),
					inputGroup([
						cb_single('keine Ladung des Speichers aus dem Verteilnetz', 'ENSP_KEINELADUNG'),
					]),
					label(''),
					inputGroup([
						cb_single('keine Entladung des Speichers ins Verteilnetz', 'ENSP_KEINEENTLADUNG'),
					]),
					label(''),
					inputGroup([
						cb_single('Regelbare Leistung durch', 'ENSP_REGLEIST'),
						multiple_checkboxes_with_cust(['ENSP_REGLEIST_VNB', 'ENSP_REGLEIST_BETR'], ['VNB', 'Betreiber'], 'ENSP_REGLEIST_AUSWAHL', 0, undefined, false, false, true),
					]),
					label(''),
					inputGroup([
						cb_single('Teilnahme an der Systemdienstleistung', 'ENSP_TEILNSYST'),
						{ type: 'label', label: 'Anbieter', style: 'margin-top:3rem;' },
						// label('Anbieter', false, 'mt-8'),
						{
							type: 'input',
							field: 'ENSP_TEILNSYST_ANB',
							max: 26,
							dataType: 'string',
							classLayout: 'mt-5',
						},
					]),
					label(''),
					inputGroup([
						cb_single('Schnittstelle Speicher zum VNB vorhanden', 'ENSP_SPEICHVNB'),
					]),
					label(''),
					inputGroup([
						cb_single('andere Betriebsart > gemäss Beilage', 'ENSP_ANDBETRIEB'),
					]),
				]
			},
			{
				// type: 'expansionspanel',
				type: 'switchpanel',
				name: 'FrElektrofahrzeugeVSE_TAG',
				label: 'Ladeeinrichtungen für Elektrofahrzeuge',
				field: 'GERAET_LADEST',
				class: 'col-span-2',
				classLayout: `${schemaClassLayout} col-span-2 mb-4`,
				children: [
					label(''),
					multiple_checkboxes_with_cust(['ELFA_NEUANL', 'ELFA_AENDERW'], ['Neuanlage', 'Änderung/Erweiterung'], 'ELFA_NEU_AENDER', 0, undefined, true, false, true),
					label('Art des Gerätes/Anlage'),
					{
						type: 'input',
						field: 'ELFA_ARTGER',
						max: 34,
						dataType: 'string'
					},
					label('Gerätehersteller'),
					{
						type: 'input',
						field: 'ELFA_GERHERST',
						max: 34,
						dataType: 'string'
					},
					label('Art des Betriebs'),
					inputGroup([
						cb_single('Ladung Kabel', 'ELFA_LADKABEL'),
						cb_single('Ladung induktiv', 'ELFA_LADINDUKTIV'),
					]),
					label('Gerätetyp'),
					{
						type: 'input',
						field: 'ELFA_GERTYP',
						max: 34,
						dataType: 'string'
					},
					label('Gerätedaten Seite AC', true, 'font-bold'),
					label('Anschluss'),
					multiple_checkboxes_with_cust(['ELFA_ANSCHL3X', 'ELFA_ANSCHL1X'], ['3x400V', '1x230V'], 'ELFA_ANSCHL', 0, undefined, true, false, true),
					label('Nennstrom Gerät'),
					{
						type: 'input',
						field: 'ELFA_NENNSTROM',
						dataType: 'float',
						suffix: 'A'
					},
					label('Anzahl Geräte'),
					{
						type: 'input',
						field: 'ELFA_ANZGER',
						dataType: 'int',
						suffix: 'Stk'
					},
					label('Nennleistung Gerät'),
					{
						type: 'input',
						field: 'ELFA_NENNLEIST_GER',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Nennleistung Total'),
					{
						type: 'input',
						field: 'ELFA_NENNLEIST_TOT',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Spitzenleistung Total'),
					{
						type: 'input',
						field: 'ELFA_SPITZLEIST',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('cos Φ im Betrieb'),
					{
						type: 'input',
						field: 'ELFA_COS',
						dataType: 'float',
						default: 1,
					},
					label('Spezifikationen', true, 'font-bold'),
					label(''),
					multiple_checkboxes_with_cust(['ELFA_ACLADUNG', 'ELFA_DCLADUNG'], ['AC Ladung des Fahrzeuges', 'DC Ladung des Fahrzeuges'], 'ELFA_ACDCLADUNG', 0, undefined, true, false, true),
					label('Max. Netzentnahmeleistung'),
					{
						type: 'input',
						field: 'ELFA_MAXENTLEIST',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Max. Netzeinspeiseleistung'),
					{
						type: 'input',
						field: 'ELFA_MAXEINSPLEIST',
						dataType: 'float',
						suffix: 'kVA'
					},
					label('Regelbare Leistung durch VNB'),
					inputGroup([
						{
							type: 'input',
							field: 'ELFA_REGLEISTVNB_VON',
							dataType: 'float',
							suffix: 'kVA'
						},
						label('bis'),
						{
							type: 'input',
							field: 'ELFA_REGLEISTVNB_BIS',
							dataType: 'float',
							suffix: 'kVA'
						},
					]),
					label('Regelbare Leistung durch Betreiber'),
					inputGroup([
						{
							type: 'input',
							field: 'ELFA_REGLEISTBET_VON',
							dataType: 'float',
							suffix: 'kVA'
						},
						label('bis'),
						{
							type: 'input',
							field: 'ELFA_REGLEISTBET_BIS',
							dataType: 'float',
							suffix: 'kVA'
						},
					]),
					label('Wirkleistung steuerbar'),
					multiple_checkboxes_with_cust(['ELFA_WIRKSTEUER_N', 'ELFA_WIRKSTEUER_J'], ['Nein', 'Ja'], 'ELFA_WIRKLEISTUNG', 0, undefined, true, false, true),
					label('Schnittstelle Ladesäule zu VNB vorhanden'),
					multiple_checkboxes_with_cust(['ELFA_SCHNITTLADE_N', 'ELFA_SCHNITTLADE_J'], ['Nein', 'Ja'], 'ELFA_SCHNITTST_LADES', 0, undefined, true, false, true),
				]
			},
		],
	}
]);

const VSE_TAG_DE11_FrAllgemeineAngabenVSE_TAG: IComponent = {
	type: 'card',
	name: 'FrAllgemeineAngabenVSE_TAG',
	label: 'Weitere allgemeine Angaben',
	classLayout: 'w_full mt-5',
	children: [
		{
			type: 'panel',
			class: 'col-span-2',
			classLayout: schemaClassLayout,
			children: [
				label('Bemerkungen des einreichenden Unternehmens'),
				{
					type: 'input',
					field: 'BEMERKUNGEN',
					multiline: true,
					width: w_full,
					rows: 7,
					dataType: 'string'
				},

			],
		}
	]
}

const VSE_TAG_DE_Unterschriften = (sm: SchemaManager): Promise<IComponent> => unterschriften_panel(sm, idPanelUnterschreiben, '', signaturen, false);
const VSE_TAG_DE_Senden = (sm: SchemaManager): Promise<IComponent> => erstelleSendenPanel(sm, idPanelSenden);
const VSE_TAG_DE_Rueckmeldung = (sm: SchemaManager): Promise<IComponent> => erstelleAntwortSchnipsel(sm, VSE_TAG_DE_RueckmeldungVNB, VSE_TAG_DE_RueckmeldungVNB.name, VSE_TAG_DE_form);

const VSE_TAG_DE_RueckmeldungVNB: IComponent = card_panel('Entscheid VNB', idPanelAntwort, [
	{
		type: 'panel',
		class: 'w-full col-start-1 col-span-2',
		classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
		hidden(sm) { return !sm.Values.GERAET_EWWP },
		children: [
			label('Elektrische Wärme / WP', true, 'font-bold'),
			multiple_checkboxes_with_cust(['EW_WPBEWILLIGT', 'EW_WPBEWILLIGM'], ['Anlage bewilligt', 'Anlage bewilligt mit Massnahmen'], '', 0, undefined, false, false, false),
			label('Bemerkungen'),
			{
				type: 'input',
				field: 'EW_WPBEMERK',
				multiline: true,
				width: w_full,
				rows: 3,
				dataType: 'string'
			},
		],
	},
	{
		type: 'panel',
		class: 'w-full col-start-1 col-span-2',
		classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
		hidden(sm) { return !sm.Values.GERAET_EEA },
		children: [
			label('EEA', true, 'font-bold'),
			multiple_checkboxes_with_cust(['EW_EEABEWILLIGT', 'EW_EEABEWILLIGTM'], ['Anlage bewilligt', 'Anlage bewilligt mit Massnahmen'], '', 0, undefined, false, false, false),
			label('Bemerkungen'),
			{
				type: 'input',
				field: 'EW_EEABEMERK',
				multiline: true,
				width: w_full,
				rows: 3,
				dataType: 'string'
			},
			label('cos Φ'),
			{
				type: 'input',
				field: 'EW_EEACOS',
				max: 10,
				dataType: 'string',
				default: 1,
			},
			label('Andere'),
			{
				type: 'input',
				field: 'EW_EEAANDERE',
				max: 25,
				dataType: 'string'
			},
		],
	},
	{
		type: 'panel',
		class: 'w-full col-start-1 col-span-2',
		classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
		hidden(sm) { return !sm.Values.GERAET_NETZR },
		children: [
			label('Anlagen mit Netzrückwirkungen', true, 'font-bold'),
			multiple_checkboxes_with_cust(['EW_NETZBEWILLIGT', 'EW_NETZBEWILLIGTM'], ['Anlage bewilligt', 'Anlage bewilligt mit Massnahmen'], '', 0, undefined, false, false, false),
			label('Bemerkungen'),
			{
				type: 'input',
				field: 'EW_NETZBEMERK',
				multiline: true,
				width: w_full,
				rows: 3,
				dataType: 'string'
			},
		],
	},
	{
		type: 'panel',
		class: 'w-full col-start-1 col-span-2',
		classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
		hidden(sm) { return !sm.Values.GERAET_BATTERIE },
		children: [
			label('Energiespeicher', true, 'font-bold'),
			multiple_checkboxes_with_cust(['EW_ENSPBEWILLIGT', 'EW_ENSPBEWILLIGTM'], ['Anlage bewilligt', 'Anlage bewilligt mit Massnahmen'], '', 0, undefined, false, false, false),
			label('Bemerkungen'),
			{
				type: 'input',
				field: 'EW_ENSPBEMERK',
				multiline: true,
				width: w_full,
				rows: 3,
				dataType: 'string'
			},
		],
	},
	{
		type: 'panel',
		class: 'w-full col-start-1 col-span-2',
		classLayout: 'w-full col-start-1 col-span-2 ' + schemaClassLayout,
		hidden(sm) { return !sm.Values.GERAET_LADEST },
		children: [
			label('Ladestationen für Elektrofahrzeuge', true, 'font-bold'),
			multiple_checkboxes_with_cust(['EW_ELFABEWILLIGT', 'EW_ELFABEWILLIGTM'], ['Anlage bewilligt', 'Anlage bewilligt mit Massnahmen'], '', 0, undefined, false, false, false),
			label('Bemerkungen'),
			{
				type: 'input',
				field: 'EW_ELFABEMERK',
				multiline: true,
				width: w_full,
				rows: 3,
				dataType: 'string'
			},
		],
	},
	label('Weitere Bemerkungen des VNB', true, 'font-bold'),
	label('Rundsteuerfrequenz VNB'),
	{
		type: 'input',
		field: 'EW_RUNDSTEUERFREQ',
		max: 10,
		dataType: 'string',
	},
	labelhtml('Kurzschlussleistung am Verknüpfungspunkt S<sub>KV</sub>'),
	{
		type: 'input',
		field: 'EW_KURZSCHLLEIST',
		max: 10,
		dataType: 'string',
	},
	labelhtml('Anlagenleistung S<sub>A</sub>'),
	{
		type: 'input',
		field: 'EW_ANLEIST',
		max: 10,
		dataType: 'string',
	},
	label('Bemerkungen'),
	{
		type: 'input',
		field: 'EW_BEM',
		multiline: true,
		width: w_full,
		rows: 3,
		dataType: 'string'
	},
	label('Die "Werkvorschriften WV CH" und die "Technischen Regeln zur Beurteilung von Netzrückwirkungen DACHCZ" müssen am Verknüpfungspunkt eingehalten werden. Das Anschlussgesuch hat eine Gültigkeit für 1 Jahr.', true),
	label('Unterschrift VNB', true, 'font-bold'),
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

export const VSE_TAG_DE: ISchema = {
	type: 'panel',
	name: 'VSE_TAG_DE',
	label: 'Technisches Anschlussgesuch',
	iconText: 'TAG',
	guid: VSE_TAG_DE_form,
	attribut: VSE_TAG_DE_attr,
	pdfFileName: '.pdf',
	classLayout: "w_full ",
	children: [
		VSE_TAG_DE0_FrFormularHeaderVSE_TAG,
		VSE_TAG_DE1_FrObjektStandortVSE_TAG,
		VSE_TAG_DE2_FrAnlageVSE_TAG,
		VSE_TAG_DE3_FrKontakteVSE_TAG,
		VSE_TAG_DE4_FrTermineVSE_TAG,
		VSE_TAG_DE_Geraete,
		VSE_TAG_DE11_FrAllgemeineAngabenVSE_TAG,
	],
	// beilagen: [
   //    { guid: MELDEFORMULAR_SOLAR_BE_DE_form, titel: 'Meldeformular', required: false },
	// ],
	steps: [
		{ step: 1, titel: 'Ausfüllen', status: DokumentStatus.InArbeit, target: VSE_TAG_DE1_FrObjektStandortVSE_TAG.name },
		{ step: 2, titel: 'Signieren', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
		{ step: 3, titel: 'Senden', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
		{ step: 4, titel: 'auf Antwort warten', status: [DokumentStatus.Gesendet, DokumentStatus.ErhaltBestaetigt], target: idPanelAntwort },
	],
	signaturen: signaturen,
	async initFormular(sm: SchemaManager) {
		const service = sm.service;

		// Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
		if (sm.Schema.tag !== 100) {
         sm.appendChild(sm.Schema, await ProjektBeilagen.instance.beilagenPanel(sm));
			sm.appendChild(sm.Schema, await VSE_TAG_DE_Unterschriften(sm));
			sm.appendChild(sm.Schema, await VSE_TAG_DE_Senden(sm));
			sm.appendChild(sm.Schema, await VSE_TAG_DE_Rueckmeldung(sm));
			sm.Schema.tag = 100
		}

		if (sm.formularStatus === DokumentStatus.Undefiniert) {
			sm.saveStatus(DokumentStatus.InArbeit);

			// Defaultwerte insbesondere von CHeckboxen setzen, da diese sonst nicht angegeben werden können
			sm.setValues(
				[
					'EEA_NETZVERB',
					'EEA_EIGENVERB_JA',
					'EEA_SYSTEMD_NEIN',
					'EEA_NOTSTROM_NEIN'
				],
				[
					true,
					true,
					true,
					true,
				]
			)

			// Daten aus Geräten übernehmen

         // Wechselrichter übernehmen
			let anzWechselrichter = 0;
			let leistungTot = 0;
			let herst = '';
			let artGer = '';
			let typ = '';
			sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'inverter').forEach(g => {
				let data = JSON.parse(g.daten);
				if (g.hersteller) {
					if (herst === '')
						herst = g.hersteller;   // Nur beim ersten Gerät den Hersteller setzen
					else if (herst != g.hersteller)
						herst = 'Diverse';
				}
				if (g.bezeichnung) {
					if (typ === '')
						typ = g.bezeichnung;    // Nur beim ersten Gerät den Typ setzen
					else if (typ != g.bezeichnung)
						typ = 'Diverse';
				}
				if (data.output_ac_nominal_power_kw && g.anzahl) {
					leistungTot += g.anzahl * data.output_ac_nominal_power_kw;
				}

				artGer = 'PV-Anlage'
				anzWechselrichter = anzWechselrichter + g.anzahl;
			});
			if (anzWechselrichter > 0) {
				sm.setValue('GERAET_EEA', true);
				sm.setValue('EEA_ENERGT_PV', true);
			}
			if (artGer !== '')
				sm.setValue('EEA_ARTGER', artGer);
			if (herst !== '')
				sm.setValue('EEA_GERHERST', herst);
			if (typ !== '')
				sm.setValue('EEA_GERTYP', typ);
			if (leistungTot) {
				sm.setValue('EEA_NENNLEIST_GER', withPrecision(leistungTot / anzWechselrichter, 3));
				sm.setValue('EEA_NENNLEIST_TOT', withPrecision(leistungTot));
			}
			if (anzWechselrichter)
				sm.setValue('EEA_ANZGER', anzWechselrichter);

			// Daten der PV-Anlagen übernehmen
			SetzePvDaten(sm, '', 'EEA_LEISTTOT', '', '');

			// Daten der Energiespeicher übernehmen (TODO: Hier kommt noch kein Hersteller und kein Typ daher)
			let artGerENSP = '';
			let herstENSP = '';
			let typENSP = '';
			let enspJa = false;
			let anzENSP = 0;
			sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'storage').forEach(g => {
				let data = JSON.parse(g.daten);
				// if(data.brand_name && herst === '')


				enspJa = true;
				artGerENSP = 'Energiespeicher';
				anzENSP = 1;
			});
			if (enspJa) {
				sm.setValue('GERAET_BATTERIE', true);
			}
			if (artGer !== '')
				sm.setValue('ENSP_ARTGER', artGerENSP);
			if (herst !== '')
				sm.setValue('ENSP_GERHERST', herstENSP);
			if (typ !== '')
				sm.setValue('ENSP_GERTYP', typENSP);
			if (anzENSP)
				sm.setValue('ENSP_ANZGER', anzENSP);

			// Daten der Ladestationen übernehmen (TODO: Hier kommt noch kein Hersteller und kein Typ daher)
			let artGerELFA = '';
			let herstELFA = '';
			let typELFA = '';
			let elfaJa = false;
			let anzELFA = 0;
			sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'electromobility').forEach(g => {
				let data = JSON.parse(g.daten);
				// if(data.brand_name && herst === '')


				elfaJa = true;
				artGerELFA = 'Elektromobilität';
				anzELFA = 1;
			});
			if (elfaJa)
				sm.setValue('GERAET_LADEST', true);
			if (artGerELFA !== '')
				sm.setValue('ELFA_ARTGER', artGerELFA);
			if (herstELFA !== '')
				sm.setValue('ELFA_GERHERST', herstELFA);
			if (typELFA !== '')
				sm.setValue('ELFA_GERTYP', typELFA);
			if (anzELFA)
				sm.setValue('ELFA_ANZGER', anzELFA);
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
					'GEBAEUDEART',
					'TERMIN'
				],

				[
					sm.projekt.gebaeude?.strasse,
					sm.projekt.gebaeude?.hausNr,
					sm.projekt.gebaeude?.plz,
					sm.projekt.gebaeude?.postOrt,
					sm.projekt.gebaeude?.gemeinde,
					sm.projekt.gebaeude?.parzelleNr,
					sm.projekt.gebaeude?.gebaeudeArt1,
					sm.projekt.auftrag?.datumInbetrieb
				]
			)

			sm.getCompByName('sachb_spinner').loading = true;
			sm.getCompByName('einreicher_spinner').loading = true;

			const gs = await abrufeKontaktstruktur(sm, KontaktArt.Solateur);
			abfuelleKontaktFelder(sm, gs, "I_", true, true);

			sm.getCompByName('sachb_spinner').loading = false;
			sm.getCompByName('einreicher_spinner').loading = false;

			if (sm.projekt.gebaeude?.guid_Inhaber) {
				sm.getCompByName('eigent_spinner').loading = true;

				const gs = await abrufeKontaktstruktur(sm, KontaktArt.Eigentuemer);
				abfuelleKontaktFelder(sm, gs, "U_");

            sm.getCompByName('eigent_spinner').loading = false;
			}

			// Nummern-Panel ausblenden wenn leer damit kein Paltz verschwendet wird
			sm.getCompByName(VSE_TAG_DE0_FrFormularHeaderVSE_TAG.name).hidden = !sm.Values.ABONR && !sm.Values.EVUAUFTJAHR;


			// Nur Speichern, wenn dass Formular noch keine GUID hat, da sonst die Anlage nicht ermittelt werden kann
			let formularGuid: string = sm.dokumentDTO?.guid;

			sm.setValue('ZAEHLER', sm.service.GetAnlage(sm.projekt, formularGuid).zaehlerNr1);

			sm.setValue('WERK', sm.Schema.empfaenger?.werkName);
			sm.setValue('PACKNAME', sm.Schema.empfaenger?.packName);

			initMussfelder(sm);
		}
	},
	onChange(sm: SchemaManager, comp, value) {
		// Init Mussfelder in geschaltetem Bereich
		if ((comp.field === 'GERAET_EWWP')
			|| (comp.field === 'GERAET_EEA')
			|| (comp.field === 'GERAET_NETZR')
			|| (comp.field === 'GERAET_BATTERIE')
			|| (comp.field === 'GERAET_LADEST')
			|| (comp.field === 'EEA_EIGENVERB_JA')
			|| (comp.field === 'EEA_EIGENVERB_NEIN')
			|| (comp.field === 'EEA_ZEV_JA')
			|| (comp.field === 'EEA_ZEV_NEIN')
			|| (comp.field === 'EEA_SYSTEMD_NEIN')
			|| (comp.field === 'EEA_SYSTEMD_JA')
			|| (comp.field === 'WP_ELZUSHEIZ_NEIN')
			|| (comp.field === 'WP_ELZUSHEIZ_JA')
			|| (comp.field === 'EEA_ENERGT_PV')
			|| (comp.field === 'EEA_NOTSTROM')
			|| (comp.field === 'EEA_NETZVERB')) {

			if(sm.Values.EEA_NETZVERB && sm.Values.EEA_NOTSTROM)
			{
				sm.setValue('EEA_UMSCH_JA', true);
			}
			else
			{
				sm.setValue('EEA_UMSCH_NEIN', true);
			}

			initMussfelder(sm);
		}

		if ((comp.field === 'ENSP_REGLEIST')) {
			if (!sm.Values.ENSP_REGLEIST)
				sm.setValues(['ENSP_REGLEIST_VNB', 'ENSP_REGLEIST_BETR'], [false, false]);

			initMussfelder(sm);
			sm.validateAll(); // Weiss nicht wie ich dies machen soll dass es richtig funktioniert, ausser so
		}

		if ((comp.field === 'ENSP_TEILNSYST')) {
			initMussfelder(sm);
			if (!sm.Values.ENSP_TEILNSYST)
				sm.setValue('ENSP_TEILNSYST_ANB', '');
		}

		if ((comp.field === 'EEA_NEUANL' || comp.field === 'EEA_AENDERW'))
		{
			if(		sm.Values.EEA_NEUANL
				&&	sm.Values.EEA_NENNLEIST_TOT
				&& 	!sm.Values.EEA_MAXLEIST_NETZ)
			{
				sm.setValue('EEA_MAXLEIST_NETZ', sm.Values.EEA_NENNLEIST_TOT);
			}
		}

		if ((comp.field === 'EEA_EIGENVERB_JA' || comp.field === 'EEA_EIGENVERB_NEIN'))
		{
			if (sm.Values.EEA_EIGENVERB_JA)
				sm.setValue('EEA_EIGENVERB_EINZEL', true)
			else if(sm.Values.EEA_EIGENVERB_NEIN)
			{
				sm.setValues(
					[
						'EEA_EIGENVERB_EINZEL',
						'EEA_EIGENVERB_MEHR',
					],
					[
						false,
						false,
					]
				)
			}
		}
	},
	validate(sm: SchemaManager) {
		// if (!sm.Values.G_NEUBAU && !sm.Values.G_BESTEHEND)
		// 	return "Entweder Neubau oder Bestehend muss es schon sein!"
		return "";
	}
}

const initMussfelder = (sm: SchemaManager) => {
	const service = sm.service;

	// Abschnitt Wärmepumpe
	sm.getCompByField('panel_WP_NEU_AENDER').required = sm.Values.GERAET_EWWP;
	sm.getCompByField('panel_WP_ARTBET').required = sm.Values.GERAET_EWWP;
	sm.getCompByField('panel_WP_ELZUSAHEIZ').required = sm.Values.GERAET_EWWP;
	sm.getCompByName('PnElZusHeizJa').hidden = !sm.Values.WP_ELZUSHEIZ_JA || !sm.Values.GERAET_EWWP;
	sm.getCompByField('WP_ELZUSHEIZ_LEIST').required = sm.Values.WP_ELZUSHEIZ_JA && sm.Values.GERAET_EWWP;
	sm.getCompByField('WP_NENNSTROM').required = sm.Values.GERAET_EWWP;
	sm.getCompByField('WP_ANLSTROM').required = sm.Values.GERAET_EWWP;
	sm.getCompByField('WP_NENNLEIST_TOT').required = sm.Values.GERAET_EWWP;
	sm.getCompByField('panel_WP_ANLAUFART').required = sm.Values.GERAET_EWWP;

	// Abschnitt Energierzeugungsanlagen
	sm.getCompByName('PnEEAIstPV').hidden = !sm.Values.EEA_ENERGT_PV;
	sm.getCompByField('panel_EEA_NEU_AENDER').required = sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_EIGENVERB').required = sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_ZEV').required = sm.Values.GERAET_EEA;
	sm.getCompByName('PnNotstromZeitweise').hidden = !sm.Values.GERAET_EEA || !sm.Values.EEA_NOTSTROM;
	sm.getCompByField('panel_EEA_NOTSTROM').required = sm.Values.GERAET_EEA && sm.Values.EEA_NOTSTROM;
	sm.getCompByName('PnUmschaltungNotstrom').hidden = !sm.Values.GERAET_EEA || !(sm.Values.EEA_NOTSTROM && sm.Values.EEA_NETZVERB);
	sm.getCompByField('panel_EEA_UMSCH_NOTSTROM').required = sm.Values.GERAET_EEA && (sm.Values.EEA_NOTSTROM && sm.Values.EEA_NETZVERB);
	sm.getCompByField('panel_EEA_SYSTEMDIENSTLEIST').required = sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_EINSPEISEBEGR').required = sm.Values.GERAET_EEA;
	sm.getCompByName('PnEigenverbrJa').hidden = !sm.Values.EEA_EIGENVERB_JA || !sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_EIGENVERB_JA').required = sm.Values.EEA_EIGENVERB_JA && sm.Values.GERAET_EEA;
	sm.getCompByName('PnZEVJa').hidden = !sm.Values.EEA_ZEV_JA || !sm.Values.GERAET_EEA;
	sm.getCompByField('EEA_VORSICH_ZEV').required = sm.Values.EEA_ZEV_JA && sm.Values.GERAET_EEA;
	sm.getCompByName('PnTeilSystemdienstJa').hidden = !sm.Values.EEA_SYSTEMD_JA || !sm.Values.GERAET_EEA;
	sm.getCompByField('EEA_SYSTEMD_ANBIET').required = sm.Values.EEA_SYSTEMD_JA && sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_ENERGT_XTEXT').required = sm.Values.GERAET_EEA;
	sm.getCompByField('EEA_NENNLEIST_TOT').required = sm.Values.GERAET_EEA;
	sm.getCompByField('EEA_MAXLEIST_NETZ').required = sm.Values.GERAET_EEA;
	sm.getCompByField('panel_EEA_ANSCHL').required = sm.Values.GERAET_EEA;

	// Abschnitt Netzrückwirkungen
	sm.getCompByField('panel_NETZ_NEU_AENDER').required = sm.Values.GERAET_NETZR;
	sm.getCompByField('panel_NETZ_ANSCHLUSS').required = sm.Values.GERAET_NETZR;
	sm.getCompByField('NETZ_NENNSTROM').required = sm.Values.GERAET_NETZR;
	sm.getCompByField('NETZ_ANLSTROM').required = sm.Values.GERAET_NETZR;
	sm.getCompByField('NETZ_NENNLEIST_GER').required = sm.Values.GERAET_NETZR;

	// Abschnitt Energiespeicher
	sm.getCompByField('panel_ENSP_NEU_AENDER').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('panel_ENSP_NOTSTROMANL').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('panel_ENSP_UMSCH_NOTSTROM').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('panel_ENSP_INTEGRATION').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('panel_ENSP_REGLEIST_AUSWAHL').required = sm.Values.GERAET_BATTERIE && sm.Values.ENSP_REGLEIST;
	sm.getCompByField('ENSP_REGLEIST_VNB').disabled = !sm.Values.ENSP_REGLEIST;
	sm.getCompByField('ENSP_REGLEIST_BETR').disabled = !sm.Values.ENSP_REGLEIST;
	sm.getCompByField('ENSP_TEILNSYST_ANB').disabled = !sm.Values.ENSP_TEILNSYST;
	sm.getCompByField('panel_ENSP_ARTBET').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('panel_ENSP_ANSCHL').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('ENSP_SYSTLEIST').required = sm.Values.GERAET_BATTERIE;
	sm.getCompByField('ENSP_SPEICHKAP').required = sm.Values.GERAET_BATTERIE;

	// Abschnitt Ladestation
	sm.getCompByField('panel_ELFA_NEU_AENDER').required = sm.Values.GERAET_LADEST;
	sm.getCompByField('panel_ELFA_WIRKLEISTUNG').required = sm.Values.GERAET_LADEST;
	sm.getCompByField('panel_ELFA_SCHNITTST_LADES').required = sm.Values.GERAET_LADEST;
	sm.getCompByField('panel_ELFA_ACDCLADUNG').required = sm.Values.GERAET_LADEST;
	sm.getCompByField('panel_ELFA_ANSCHL').required = sm.Values.GERAET_LADEST;
	sm.getCompByField('ELFA_NENNLEIST_TOT').required = sm.Values.GERAET_LADEST;
}
