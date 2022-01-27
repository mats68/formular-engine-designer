import { ISchema, IComponent, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { DokumentBeilageLinkDTO, DokumentStatus, IdentityContextDTO } from '../api/model/models';
import { inputGroup, inputGroupCL, label, w_full, card_panel, card_hint_panel, switch_hint_panel, checkBoxGroup, hasAllRequired, getBeilage, senden_panel, antwort_meldefomrulare_panel, textZusammensetzen, withPrecision, erstelleUnterschriftspanel, unterschriften_panel, formatiereDatum, erstelleSendenPanel, erstelleAntwortSchnipsel, abrufeKontaktstruktur, KontaktArt, abfuelleKontaktFelder, SetzePvDaten } from './schema-utils';
import * as moment from 'moment';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { GRUNDRISSPLAN_form, MELDEFORMULAR_SOLAR_BE_DE_attr, MELDEFORMULAR_SOLAR_BE_DE_form, SITUATIONSPLAN_form } from './schema-guid-def';
import { SignatureRole } from '../services/projekt/signatureRole';
import { SignaturDef } from '../services';
import { getStepLinkDataStandard } from '.';
import { Guid } from '../tools/Guid';
import { ProjektBeilagen } from '../tools';

const FORMULAR_TYP_MELDEFORMULAR_SOLAR_BE_DE = "MELDEFORMULAR_SOLAR_BE_DE";
const FORMULAR_TYP_SITUATIONSPLAN = "SITUATIONSPLAN";
const FORMULAR_TYP_GRUNDRISSPLAN = "GRUNDRISSPLAN"; //nur bei Flachdach
const FORMULAR_TYP_FASSADENPLAN = "FASSADENPLAN";

const idPanelUnterschreiben = 'MELDEFORMULAR_SOLAR_BE_DE_Unterschriften';
const idPanelSenden = 'MELDEFORMULAR_SOLAR_BE_DE_Senden';
const idPanelAntwort = 'MELDEFORMULAR_SOLAR_BE_DE_Antwort';

// Signaturen hier initalisieren, damit Sie an den benötigten Stellen verfügbar sind
const signaturen: SignaturDef[] = []
signaturen.push({ rolle: [SignatureRole.BasisAnwender], signaturKey: 'SIGNATURE', titel: 'Vertreterin/Vertreter', datumFeld: 'UX_DATUM', ortFeld: 'UX_ORT'})

const MELDEFORMULAR_SOLAR_BE_DE_AnlageStandort: IComponent = card_panel('Anlage-Standort', 'MELDEFORMULAR_SOLAR_BE_DE_AnlageStandort', [
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
   {
      type: 'panel',
      name: 'hidden_controls',
      style: 'display: none;',
      children: [
         {
            type: 'input',
            field: 'O_STRASSE',
            max: 30,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'O_HAUSNR',
            max: 24,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'O_PLZ',
            max: 8,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'O_ORT',
            max: 30,
            dataType: 'string',
         },
         {
            type: 'input',
            dataType: 'string',
            field: 'O_KOORDINATEN',
            max: 48,
         },
         {
            type: 'input',
            field: 'GEMEINDE',
            max: 30,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'PARZELLE',
            max: 18,
            dataType: 'string',
         },
         {
            hint: 'EGID',
            type: 'input',
            field: 'EGID',
            dataType: 'int',
         },
         {
            type: 'date',
            field: 'TERMIN',
            disabled: true,
         },
      ]
   },
]);

const MELDEFORMULAR_SOLAR_BE_DE_Adressen: IComponent = card_panel('Adressen / Geschäftspartner', '', [
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
            name: 'einreicher', //Gesuchssteller
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
               { type: 'label', field: 'I_TELNR', },
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
               { type: 'label', label: 'Auftraggeber', classLayout: 'text-xs font-bold', },
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
      ]
   },
]);

const MELDEFORMULAR_SOLAR_BE_DE_ThSolaranlage: IComponent = switch_hint_panel('Thermische Solaranlage', 'MELDEFORMULAR_SOLAR_BE_DE_ThSolaranlage', 'TH_ANLAGE', false, '(Wärmeproduktion)', [
   // label('', true),
   checkBoxGroup([
      { label: 'Flachkollektoren', field: 'TH_FLACHKOLLEKTOREN' },
      { label: 'Röhrenkollektoren', field: 'TH_ROEHRENKOLLEKTOREN' },
      { label: 'Hybridkollektoren', field: 'TH_HYBRIDKOLLEKTOREN' }, //Platzhalter
   ], { required: false }),
   checkBoxGroup([
      { label: 'für Brauchwarmwasser', field: 'TH_BRAUCHWARMWASSER' },
      { label: 'mit Heizungsunterstützung', field: 'TH_HEIZUNGSUNTERSTUETZUNG' },
   ], { required: false, multipleSelection: true }),
   { type: 'label', label: 'Absorberfläche', classLayout: 'col-start-1 col-span-1' },
   {
      type: 'input',
      dataType: 'string',
      field: 'TH_ABSORBERFLAECHE',
      suffix: 'm²',
      max: 10,
      classLayout: 'col-start-2 col-span-2',
      // required: true,
   },
]);

const MELDEFORMULAR_SOLAR_BE_DE_PvSolaranlage: IComponent = switch_hint_panel('Photovoltaikanlage', 'MELDEFORMULAR_SOLAR_BE_DE_PvSolaranlage', 'PV_ANLAGE', true, '(Stromproduktion)', [
   label('Gesamtfläche der Anlage'),
   {
      type: 'input',
      dataType: 'float',
      field: 'PV_ABSORBERFLAECHE',
      hint: '(ohne Blindfläche)',
      suffix: 'm²',
      max: 10,
   },
   label('Gesamtleistung'),
   {
      type: 'input',
      dataType: 'string',
      field: 'PV_GESAMTLEISTUNG',
      suffix: 'kWpeak',
      max: 10,
   },
   label('Erwarteter Jahresertrag'),
   {
      type: 'input',
      dataType: 'string',
      field: 'PV_JAHRESERTRAG',
      suffix: 'kWh/Jahr',
      max: 10,
   },
]);

const MELDEFORMULAR_SOLAR_BE_DE_Unterschriften = (sm: SchemaManager): Promise<IComponent> => unterschriften_panel(sm, idPanelUnterschreiben, '', signaturen, true);
const MELDEFORMULAR_SOLAR_BE_DE_Senden = (sm: SchemaManager): Promise<IComponent> => erstelleSendenPanel(sm, idPanelSenden);
const MELDEFORMULAR_SOLAR_BE_DE_Antwort = (sm: SchemaManager): Promise<IComponent> => erstelleAntwortSchnipsel(sm, null, idPanelAntwort,  MELDEFORMULAR_SOLAR_BE_DE_form);

export const MELDEFORMULAR_SOLAR_BE_DE: ISchema = {
   type: 'panel',
   name: 'MELDEFORMULAR_SOLAR_BE_DE',
   label: 'Meldeformular Solar (BE)',
   iconText: 'MBE',
   pdfTemplate: '1292368f-64e1-49c6-aba4-b57dd8e13405',
   // pdfFileName: 'MELDEFORMULAR_SOLAR_BE_DE.pdf',
   guid: MELDEFORMULAR_SOLAR_BE_DE_form,
   attribut: MELDEFORMULAR_SOLAR_BE_DE_attr,
   beilagen: [
      { guid: SITUATIONSPLAN_form, titel: 'Situationsplan' },
      { guid: GRUNDRISSPLAN_form, titel: 'Grundrissplan / Dachschnitt' },
   ],
   steps: [
      { step: 1, titel: 'Ausfüllen', status: DokumentStatus.InArbeit, target: MELDEFORMULAR_SOLAR_BE_DE_AnlageStandort.name },
      { step: 2, titel: 'Signieren', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
      { step: 3, titel: 'Senden', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
      { step: 4, titel: 'Auf Antwort warten', status: DokumentStatus.Gesendet, target: idPanelAntwort },
   ],
   signaturen: signaturen,
   classLayout: 'w-full',
   children: [
      MELDEFORMULAR_SOLAR_BE_DE_AnlageStandort,
      MELDEFORMULAR_SOLAR_BE_DE_Adressen,
      // MELDEFORMULAR_SOLAR_BE_DE_Gesuchsteller,
      // MELDEFORMULAR_SOLAR_BE_DE_Grundeigentümer,
      MELDEFORMULAR_SOLAR_BE_DE_ThSolaranlage,
      MELDEFORMULAR_SOLAR_BE_DE_PvSolaranlage,
      //MELDEFORMULAR_SOLAR_BE_DE_AnlageAuausfuehrung,
      // MELDEFORMULAR_SOLAR_BE_DE_Unterlagen,
   ],
   async initFormular(sm: SchemaManager) {
      const service = sm.service;

      // Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
      if (sm.Schema.tag !== 100) {
         sm.appendChild(sm.Schema, await ProjektBeilagen.instance.beilagenPanel(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_BE_DE_Unterschriften(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_BE_DE_Senden(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_BE_DE_Antwort(sm));
         sm.Schema.tag = 100
      }

      try {

         if (sm.formularStatus === DokumentStatus.Undefiniert)
         {
            sm.saveStatus(DokumentStatus.InArbeit);
            SetzePvDaten(sm, 'PV_ABSORBERFLAECHE', 'PV_GESAMTLEISTUNG', '', 'PV_ANLAGE');
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
                  'I_TEXT',
                  'TERMIN'
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
                  sm.projekt.auftrag?.bemerkungen,
                  sm.projekt.auftrag?.datumInbetrieb,
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
