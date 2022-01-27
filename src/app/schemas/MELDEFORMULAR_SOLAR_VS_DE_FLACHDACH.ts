import { ISchema, IComponent, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { DokumentStatus, IdentityContextDTO } from '../api/model/models';
import { inputGroup, inputGroupCL, label, w_full, card_panel, card_hint_panel, switch_hint_panel, checkBoxGroup, textZusammensetzen, abrufeKontaktstruktur, KontaktArt, abfuelleKontaktFelder, SetzePvDaten, erstelleAntwortSchnipsel, erstelleSendenPanel, unterschriften_panel, multiple_checkboxes_with_cust } from './schema-utils';
import * as moment from 'moment';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { SignaturDef } from '../services';
import { SignatureRole } from '../services/projekt/signatureRole';
import { FOTO_form, MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_attr, MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_form, MELDEFORMULAR_SOLAR_VS_DE_SCHRAEGDACH_attr, MELDEFORMULAR_SOLAR_VS_DE_SCHRAEGDACH_form, SITUATIONSPLAN_form, VSE_IA18_DE_form } from './schema-guid-def';
import { ProjektBeilagen } from '../tools';

const idPanelUnterschreiben = 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Unterschriften';
const idPanelSenden = 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Senden';
const idPanelAntwort = 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Antwort';

// Signaturen hier initalisieren, damit Sie an den benötigten Stellen verfügbar sind
const signaturen: SignaturDef[] = []
signaturen.push({ rolle: [SignatureRole.BasisAnwender], signaturKey: 'SIGNATURE', titel: 'Fachplaner, Installateur', datumFeld: 'UX_DATUM', ortFeld: 'UX_ORT'})

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageStandort: IComponent = card_panel('Anlage-Standort', 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageStandort', [
   {
      type: 'panel',
      name: 'projekt_daten',
      classLayout: 'grid grid-3-cols-auto col-span-3',
      // class: 'col-span-3',
      onGetClass(sm, comp, def, name) {
         if (name === 'panel')
            return `${def} panel-from-superior`;
         return def;
      },
      // style: 'border-left: 4px solid rgb(252, 196, 47); padding-left: 0.5rem;',
      children: [
         { type: 'label', label: 'Standortangaben', classLayout: 'text-xs font-bold col-span-2', },
         { type: 'label', label: 'Nummern', classLayout: 'text-xs font-bold col-start-3', },
         {
            type: 'panel',
            name: 'standort_daten1',
            classLayout: ` col-start-1 col-span-1`,
            children: [
               { type: 'label', label: 'Standort', classLayout: 'text-xs mt-2', },
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
               { type: 'label', label: 'Koordinaten', classLayout: 'text-xs mt-2', hidden(sm) { return !sm.Values.O_KOORDINATEN } },
               { type: 'label', field: 'O_KOORDINATEN', classLayout: '', },
               { type: 'label', label: 'Gemeinde', classLayout: 'text-xs mt-2', },
               { type: 'label', field: 'GEMEINDE', classLayout: '', },
            ]
         },
         {
            type: 'panel',
            name: 'gebaeude_anlage_daten1',
            classLayout: ` col-start-3 col-span-1`,
            children: [
               { type: 'label', label: 'Parzelle-Nr. (KTN)', classLayout: 'text-xs mt-2', },
               { type: 'label', field: 'PARZELLE', classLayout: '', },
               { type: 'label', label: 'Gebäude-Nr. (EGID)', classLayout: 'text-xs mt-2', },
               { type: 'label', field: 'EGID', classLayout: '', },
            ]
         },
      ]
   },
]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Adressen: IComponent = card_panel('Adressen / Geschäftspartner', '', [
   {
      type: 'panel',
      classLayout: 'w-full grid grid-3-cols-auto col-span-3',
      onGetClass(sm, comp, def, name) {
         if (name === 'panel')
            return `${def} panel-from-superior`;
         return def;
      },
      children: [
         {
            type: 'panel',
            name: 'einreicher', //Gesuchssteller/Bauherrschaft
            children: [
               { type: 'label', label: 'Einreichendes Unternehmen', classLayout: 'text-xs font-bold', },
               { type: 'spinner', name: 'einreicher_spinner', classLayout: 'mt-2' },
               { type: 'label', field: 'I_KONZESS', },
               { type: 'label', label: 'Adresse', classLayout: ' text-xs mt-2', },
               inputGroupCL('mr-2', [
                  { type: 'label', field: 'I_NAME1', },
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
               { type: 'label', name: 'LB_I_NAME', },
               { type: 'label', name: 'LB_I_ADR', },
               { type: 'label', name: 'LB_PLZORT', },
            ]
         },
         {
            type: 'panel',
            name: 'sachbearbeiter', //Projektverfasser
            classLayout: ` col-start-2 col-span-1`,
            children: [
               { type: 'label', label: 'Sachbearbeiter', classLayout: 'text-xs font-bold', },
               { type: 'spinner', name: 'sachb_spinner', classLayout: ' mt-2' },
               { type: 'label', field: 'I_SACHB', },
               { type: 'label', field: 'I_EMAIL', },
               { type: 'label', field: 'I_TELNRD', },
               { type: 'label', field: 'I_TELNRM', hidden: true },
            ]
         },
         {
            type: 'panel',
            name: 'eigentuemer', //Grundeigentümer
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
            ]
         },
         {
            type: 'panel',
            name: 'auftraggeber', // Auftraggeber
            classLayout: ` col-start-1 col-span-1 mt-2`,
            children: [
               { type: 'label', label: 'Antragsteller', classLayout: 'text-xs font-bold', },
               { type: 'spinner', name: 'auftraggeber_spinner', classLayout: ' mt-2' },
               { type: 'label', field: 'GES_NAME1', },
               { type: 'label', field: 'GES_NAME2', },
               { type: 'label', field: 'GES_ADRESSE1', },
               { type: 'label', field: 'GES_ADRESSE2', },
               inputGroupCL('mr-2', [
                  { type: 'label', field: 'GES_PLZ', },
                  { type: 'label', field: 'GES_ORT', },
               ]),
               { type: 'label', field: 'GES_EMAIL', },
               { type: 'label', field: 'GES_TELNR', },
            ]
         },
      ],
   },
   {
      type: 'panel',
      name: 'hidden_controls2',
      style: 'display: none;',
      children: [
         {
            type: 'input',
            field: 'KOORD_L',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'KOORD_R',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'I_KONZESS',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'I_NAME1',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            field: 'I_NAME2',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'I_ADRESSE1',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'I_ADRESSE2',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'int',
            field: 'I_PLZ',
            max: 9999,
         },
         {
            type: 'input',
            label: 'Ort',
            max: 30,
            field: 'I_ORT',
         },
         {
            type: 'input',
            field: 'I_SACHB',
            max: 24,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'I_EMAIL',
            max: 60,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'I_TELNR',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'U_NAME1',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            field: 'U_NAME2',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'U_ADRESSE1',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'U_ADRESSE2',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'int',
            field: 'U_PLZ',
            max: 9999,
         },
         {
            type: 'input',
            max: 30,
            field: 'U_ORT',
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'U_EMAIL',
            max: 60,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'U_TELNR',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'GES_NAME1',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            field: 'GES_NAME2',
            dataType: 'string',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'GES_ADRESSE1',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'GES_ADRESSE2',
            max: 40,
         },
         {
            type: 'input',
            dataType: 'int',
            field: 'GES_PLZ',
            max: 9999,
         },
         {
            type: 'input',
            max: 30,
            field: 'GES_ORT',
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'GES_EMAIL',
            max: 60,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'GES_TELNR',
            max: 16,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'GES_TELNR_M',
            max: 16,
            dataType: 'string',
         },
      ]
   },
]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_ANLAGE: IComponent = card_panel('Thermische Solaranlage / Photovoltaikanlage / PV-T/hybrid', 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Anlage', [
   multiple_checkboxes_with_cust(['TH_ANLAGE', 'PV_ANLAGE', 'Hybrid_ANLAGE'],['Thermische Solaranlage', 'Photovoltaikanlage', 'PV-T/hybrid'], '', 0, undefined, true, false, false),
   label('Hersteller'),
   {
      type: 'input',
      field: 'AA_HERSTELLER',
      max: 20,
   },
   label('Typ'),
   {
      type: 'input',
      field: 'AA_TAP',
      max: 20,
   },
   label('Zulassungsnr.'),
   {
      type: 'input',
      field: 'AA_ZULASS_NR',
      max: 20,
   },
   label('Länge'),
   {
      type: 'input',
      field: 'AA_LAENGE',
      max: 20,
   },
   label('Breite'),
   {
      type: 'input',
      field: 'AA_BREITE',
      max: 20,
   },
   label('Dicke'),
   {
      type: 'input',
      field: 'AA_DICKE',
      max: 20,
   },
]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Kollektorenfeld: IComponent = card_panel('Kollektorenfeld', 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Kollektorenfeld', [
   label('Länge'),
   {
      type: 'input',
      dataType: 'string',
      field: 'K_LAENGE',
      max: 20,
   },
   label('Breite'),
   {
      type: 'input',
      dataType: 'string',
      field: 'K_BREITE',
      max: 20,
   },
   label('Gesamtfläche der Anlage'),
   {
      type: 'input',
      dataType: 'float',
      field: 'PV_ABSORBERFLAECHE',
      suffix: 'm²',
      max: 10,
   },
   label('Anzahl Kollektoren'),
   {
      type: 'input',
      dataType: 'string',
      field: 'K_ANZAHL',
      max: 20,
   },
   label('Orientierung (S = 0°; E = -90°)'),
   {
      type: 'input',
      dataType: 'string',
      field: 'K_ORIENTIERUNG',
      max: 20,
   },
   label('Neigung (hor.=0°; vert.=90°)'),
   {
      type: 'input',
      dataType: 'string',
      field: 'K_NEIGUNG',
      max: 20,
   },
]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageAllgemein: IComponent = card_panel('Anlage-Allgemein', 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageAllgemein', [
   label('Datum Baubeginn'),
   {
      type: 'date',
      field: 'AA_BAUBEGINN',
   },
   label('Typ und Bezeichnung Zone'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_ZONE',
      max: 20,
   },
   label('Typ des Gebäudes'),
   checkBoxGroup([
      { label: 'Einfamilienhaus', field: 'AA_EFH' },
      { label: 'Mehrfamilienhaus', field: 'AA_MFH' },
   ]),
   label('Art der Arbeiten'),
   checkBoxGroup([
      { label: 'Erste Installation auf bestehendem Gebäude oder Standort', field: 'AA_ERST_INST' },
      { label: 'Ersatz einer bestehenden Solaranlage', field: 'AA_ERSATZ' },
      { label: 'Erweiterung einer bestehenden Solaranlage, eine weitere Neuanlage', field: 'AA_ERWEITERUNG' },
   ]),
   label('Bei Erstinstallation - Baujahr Gebäude'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_BAUJAHR',
      max: 20,
   },
   label('Montage'),
   checkBoxGroup([
      { label: 'In Schrägdach montiert', field: 'AA_IN_SCHRAEG' },
      { label: 'Auf Schrägdach montiert', field: 'AA_AUF_SCHRAEG' },
   ]),
   label('Leitungen'),
   checkBoxGroup([
      { label: 'verdeckt', field: 'AA_VERDECKT' },
      { label: 'sichtbar', field: 'AA_SICHTBAR' },
   ]),
   label('Wenn sichtbar: Verlauf und Farbe angeben'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_FARBE',
      max: 20,
   },

]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH__AnlageAuausfuehrung: IComponent = card_panel('Anlage-Ausführung', 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageAuausfuehrung', [
   label('Das kommunale Recht sieht keine Bewilligungspflicht für eine Installation auf Flachdach vor', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_1' },
      { label: 'Nein', field: 'AA_VS_2' },
   ]),
   label('Gebäude ist kein Kulturdenkmal von kantonaler oder nationaler Bedeutung', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_3' },
      { label: 'Nein', field: 'AA_VS_4' },
   ]),
   label('Gebäude liegt nicht in einem Naturdenkmal von kantonaler oder nationaler Bedeutung', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_5' },
      { label: 'Nein', field: 'AA_VS_6' },
   ]),
   label('Installation: maximale Höhe über der Brüstung: 50 cm', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_7' },
      { label: 'Nein', field: 'AA_VS_8' },
   ]),
   label('Installation: Mindestabstand zum Dachrand (ohne Vordach): 50 cm', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_9' },
      { label: 'Nein', field: 'AA_VS_10' },
   ]),
   label('Installation: max. Höhe über der Brüstung bei Mindestabstand: 20 cm; und dann bei einer Neigung von 30° bis zu 50 cm', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_11' },
      { label: 'Nein', field: 'AA_VS_12' },
   ]),
   label('Kollektorfelder in parallel zu einander liegender Anordnung', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_13' },
      { label: 'Nein', field: 'AA_VS_14' },
   ]),
   label('reflexarme Ausführung nach dem Stand der Technik', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_VS_15' },
      { label: 'Nein', field: 'AA_VS_16' },
   ]),
]);

const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Unterschriften = (sm: SchemaManager): Promise<IComponent> => unterschriften_panel(sm, idPanelUnterschreiben, '', signaturen, true);
const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Senden = (sm: SchemaManager): Promise<IComponent> => erstelleSendenPanel(sm, idPanelSenden);
const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Antwort = (sm: SchemaManager): Promise<IComponent> => erstelleAntwortSchnipsel(sm, null, idPanelAntwort,  MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_form);

export const MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH: ISchema = {
   type: 'panel',
   name: 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH',
   label: 'Meldeformular Solar (VS Flachdach)',
   iconText: 'MVS',
   pdfTemplate: '6710BCC5-FFCC-4984-A151-C1F2D4540FE8',
   pdfFileName: 'MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH.pdf',
   guid: MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_form,
   attribut: MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_attr,
   beilagen: [
      { guid: SITUATIONSPLAN_form, schemaKey: 1, titel: 'Auszüge der Karte 1:25\'00' },
      { guid: SITUATIONSPLAN_form, schemaKey: 2, titel: 'Situationsplan' },
      { guid: VSE_IA18_DE_form, titel: 'Prinzipschema Installation' },
      { guid: FOTO_form, schemaKey: 3, titel: 'Fotomontage oder vermasste Zeichung' },
      { guid: FOTO_form, schemaKey: 4, titel: 'Foto Gebäude und/oder Standort' },
      { guid: FOTO_form, schemaKey: 5, titel: 'Prospekt oder Foto des Kollektors' },
   ],
   steps: [
		{ step: 1, titel: 'Ausfüllen', status: DokumentStatus.InArbeit, target: MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageStandort.name },
		{ step: 2, titel: 'Signieren', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
		{ step: 3, titel: 'Senden', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
		{ step: 4, titel: 'Auf Antwort warten', status: DokumentStatus.Gesendet, target: idPanelAntwort },
	],
   signaturen: signaturen,
   classLayout: 'w-full',
   children: [
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageStandort,
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Adressen,
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_ANLAGE,
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Kollektorenfeld,
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_AnlageAllgemein,
      MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH__AnlageAuausfuehrung,


      // MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Gesuchsteller,
      // MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Grundeigentümer,
      // MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Unterlagen,
   ],
   async initFormular(sm: SchemaManager) {
      const service = sm.service;

      // Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
      if (sm.Schema.tag !== 100) {
			sm.appendChild(sm.Schema, await ProjektBeilagen.instance.beilagenPanel(sm));
			sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Unterschriften(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Senden(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_VS_DE_FLACHDACH_Antwort(sm));
         sm.Schema.tag = 100
      }

      try {

         if (sm.formularStatus === DokumentStatus.Undefiniert)
         {
            sm.saveStatus(DokumentStatus.InArbeit);
            SetzePvDaten(sm, 'PV_ABSORBERFLAECHE', '', '', 'PV_ANLAGE', '', 'AA_HERSTELLER', 'AA_TAP');
         }
         else if (sm.formularStatus >= DokumentStatus.SigniertGesperrt)
            sm.DisableAll();

         if (sm.formularStatus < DokumentStatus.SigniertGesperrt) {
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



            if (sm.projekt.auftrag?.guidAuftraggeber) {
               sm.getCompByName('auftraggeber_spinner').loading = true;

               const gs = await abrufeKontaktstruktur(sm, KontaktArt.Auftraggeber);
               abfuelleKontaktFelder(sm, gs, "GES_", false, false, false);

               sm.getCompByName('auftraggeber_spinner').loading = false;
            }

            let koordinaten = textZusammensetzen(textZusammensetzen(sm.projekt.gebaeude?.geoSystem, ":", sm.projekt.gebaeude?.geoLaenge), " ", sm.projekt.gebaeude?.geoBreite);
            sm.setValues(
               [
                  'O_STRASSE',
                  'O_HAUSNR',
                  'O_PLZ',
                  'O_ORT',
                  'GEMEINDE',
                  'PARZELLE',
                  'O_KOORDINATEN',
                  'EGID',
               ],

               [
                  sm.projekt.gebaeude?.strasse,
                  sm.projekt.gebaeude?.hausNr,
                  sm.projekt.gebaeude?.plz,
                  sm.projekt.gebaeude?.postOrt,
                  sm.projekt.gebaeude?.gemeinde,
                  sm.projekt.gebaeude?.parzelleNr,
                  koordinaten,
                  sm.projekt.gebaeude?.egid,
               ]
            )
         }

         // if (!sm.Values.FormStatus)
         //    this.setStatus(sm, sm.Values.FormStatus);

         // if (sm.Values.UX_UNTERSCHRIFT)
         //    sm.DisableAll(true);
         // else
         //    sm.DisableAll(false);

         // //Daten speichern in DB
         // if (sm.ValuesChanged) {
         //    await sm.saveValuesToDB()
         // }
      }
      catch (err) {
         console.error(err)
      }
      finally {
         sm.getCompByName('einreicher_spinner').loading = false;
         sm.getCompByName('sachb_spinner').loading = false;
         sm.getCompByName('eigent_spinner').loading = false;
      }

   },
   onChange(sm, comp) {
   },
   onAfterSave(sm, formular) {
      console.log('Called from schema onAfterSave: ', formular)
   },
   onAfterReload(sm, formular) {
      console.log('Called from schema onAfterReload: ', formular)
   },
}

function MELDEFORMULAR_SOLAR_VD_Unterschriften(sm: SchemaManager): IComponent | PromiseLike<IComponent> {
   throw new Error('Function not implemented.');
}
function MELDEFORMULAR_SOLAR_VD_Senden(sm: SchemaManager): IComponent | PromiseLike<IComponent> {
   throw new Error('Function not implemented.');
}
