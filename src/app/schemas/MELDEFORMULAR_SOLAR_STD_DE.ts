import { ISchema, IComponent, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
// import { IdentityContextDTO } from '../api/model/models';
import { inputGroup, inputGroupCL, label, w_full, card_panel, card_hint_panel, switch_hint_panel, checkBoxGroup, unterschriften_panel, erstelleSendenPanel, erstelleAntwortSchnipsel, getBeilage, withPrecision, textZusammensetzen, abfuelleKontaktFelder, abrufeKontaktstruktur, KontaktArt, SetzePvDaten } from './schema-utils';
import * as moment from 'moment';
import { SignaturDef } from '../services';
import { SignatureRole } from '../services/projekt/signatureRole';
import { DACHAUFSICHT_form, MELDEFORMULAR_SOLAR_STD_DE_attr, MELDEFORMULAR_SOLAR_STD_DE_form, SCHNITTPLAN_form, SITUATIONSPLAN_form, TECHNISCHE_DATEN_form } from './schema-guid-def';
import { DokumentBeilageLinkDTO, DokumentStatus } from '../api';
import { ProjektBeilagen } from '../tools';
// import { marker } from '@ngneat/transloco-keys-manager/marker';

const FORMULAR_TYP_MELDEFORMULAR_SOLAR_STD = "MELDEFORMULAR_SOLAR_STD";
const FORMULAR_TYP_SITUATIONSPLAN = "SITUATIONSPLAN";
const FORMULAR_TYP_GRUNDRISSPLAN = "GRUNDRISSPLAN"; //nur bei Flachdach
const FORMULAR_TYP_FASSADENPLAN = "FASSADENPLAN";

const idPanelUnterschreiben = 'MELDEFORMULAR_SOLAR_STD_DE_Unterschriften';
const idPanelSenden = 'MELDEFORMULAR_SOLAR_STD_DE_Senden';
const idPanelAntwort = 'MELDEFORMULAR_SOLAR_STD_DE_Antwort';

// Signaturen hier initalisieren, damit Sie an den benötigten Stellen verfügbar sind
const signaturen: SignaturDef[] = []
signaturen.push({ rolle: [SignatureRole.BasisAnwender], signaturKey: 'SIGNATURE', titel: 'Projektverfasser/in', datumFeld: 'UX_DATUM', ortFeld: 'UX_ORT' })

const MELDEFORMULAR_SOLAR_STD_AnlageStandort: IComponent = card_panel('Anlage-Standort', 'MELDEFORMULAR_SOLAR_STD_AnlageStandort', [
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

const MELDEFORMULAR_SOLAR_STD_Adressen: IComponent = card_panel('Adressen / Geschäftspartner', '', [
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
            field: 'KANTON',
            max: 20,
            dataType: 'string',
         },
         {
            type: 'input',
            field: 'ASSEK',
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
            max: 20,
            field: 'I_ROLLE',
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

const MELDEFORMULAR_SOLAR_STD_ThSolaranlage: IComponent = switch_hint_panel('Thermische Solaranlage', 'MELDEFORMULAR_SOLAR_STD_ThSolaranlage', 'TH_ANLAGE', false, '(Wärmeproduktion)', [
   // label('', true),
   checkBoxGroup([
      { label: 'Flachkollektoren', field: 'TH_FLACHKOLLEKTOREN' },
      { label: 'Röhrenkollektoren', field: 'TH_ROEHRENKOLLEKTOREN' },
      { label: 'WISC-Kollektor', field: 'TH_WISC' },
   ], { required: false }),
   checkBoxGroup([
      { label: 'für Brauchwarmwasser', field: 'TH_BRAUCHWARMWASSER' },
      { label: 'mit Heizungsunterstützung', field: 'TH_HEIZUNGSUNTERSTUETZUNG' },
   ], { required: false, multipleSelection: true }),
   label('Gesamtfläche der Anlage'),
   {
      type: 'input',
      dataType: 'float',
      field: 'TH_ABSORBERFLAECHE',
      suffix: 'm²',
      max: 11,
   },
   label('Erwartete Jahresproduktion'),
   {
      type: 'input',
      dataType: 'string',
      field: 'TH_JAHRESERTRAG',
      suffix: 'kWh/Jahr',
      max: 10,
   },
]);

const MELDEFORMULAR_SOLAR_STD_PvSolaranlage: IComponent = switch_hint_panel('Photovoltaikanlage', 'MELDEFORMULAR_SOLAR_STD_PvSolaranlage', 'PV_ANLAGE', true, '(Stromproduktion)', [
   label('Gesamtleistung'),
   {
      type: 'input',
      dataType: 'string',
      field: 'PV_GESAMTLEISTUNG',
      suffix: 'kWpeak',
      max: 10,
   },
   label('Erwartete Jahresproduktion'),
   {
      type: 'input',
      dataType: 'string',
      field: 'PV_JAHRESERTRAG',
      suffix: 'kWh/Jahr',
      max: 10,
   },
]);

const MELDEFORMULAR_SOLAR_STD_AnlageAllgemein: IComponent = card_panel('Anlage-Allgemein', 'MELDEFORMULAR_SOLAR_STD_AnlageAllgemein', [
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
            name: 'pv_daten1',
            classLayout: ` col-start-1 col-span-1`,
            children: [
               { type: 'label', label: 'Voraussichtliche Inbetriebnahme', classLayout: 'text-xs mt-2', },
               { type: 'label', field: 'AA_INBETRIEBNAHME', dataType: 'date',},
            ]
         },
         {
            type: 'panel',
            name: 'hidden_controls3',
            style: 'display: none;',
            children: [
               {
                  type: 'date',
                  field: 'AA_INBETRIEBNAHME',
               },
            ]
         },
      ],
   },
   // label('Rolle des Projektverfassers'),
   // {
   //    type: 'input',
   //    field: 'I_ROLLE',
   //    max: 20,
   // },
   label('Bauherrschaft verfügt über Vollmacht', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_PRO_VOLL_JA' },
      { label: 'Nein', field: 'AA_PRO_VOLL_NEIN' },
   ]),
   label('Zonenart', true),
   checkBoxGroup([
      { label: 'Bauzone', field: 'AA_BAUZONE' },
      { label: 'Landwirtschaftszone', field: 'AA_LANDZONE' },
   ]),
   label('Gebäudevers.-Nr.'),
   {
      type: 'input',
      field: 'ASSEK',
      max: 20,
   },
]);

const MELDEFORMULAR_SOLAR_STD_AnlageAuausfuehrung: IComponent = card_panel('Anlage-Ausführung', 'MELDEFORMULAR_SOLAR_STD_AnlageAuausfuehrung', [
   label('Dachfläche im rechten Winkel um	höchstens 20 cm überragend', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_DF20CM_JA' },
      { label: 'Nein', field: 'AA_DF20CM_NEIN' },
   ]),
   label('Sie ragt von vorne und oben gesehen nicht über die Dachfläche hinaus', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_DF_HERAUSRAGEND_JA' },
      { label: 'Nein', field: 'AA_DF_HERAUSRAGEND_NEIN' },
   ]),
   label('Sie wird nach dem Stand der Technik reflexionsarm ausgeführt', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_STAND_DER_TECHNIK_JA' },
      { label: 'Nein', field: 'AA_STAND_DER_TECHNIK_NEIN' },
   ]),
   label('Sie hängt als kompakte Fläche zusammen (Aussparungen für Kamine etc. sind erlaubt)', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_KOMPAKT_JA' },
      { label: 'Nein', field: 'AA_KOMPAKT_NEIN' },
   ]),
]);

const MELDEFORMULAR_SOLAR_STD_DE_Unterschriften = (sm: SchemaManager): Promise<IComponent> => unterschriften_panel(sm, idPanelUnterschreiben, '', signaturen, true);
const MELDEFORMULAR_SOLAR_STD_DE_Senden = (sm: SchemaManager): Promise<IComponent> => erstelleSendenPanel(sm, idPanelSenden);
const MELDEFORMULAR_SOLAR_STD_DE_Antwort = (sm: SchemaManager): Promise<IComponent> => erstelleAntwortSchnipsel(sm, null, idPanelAntwort, MELDEFORMULAR_SOLAR_STD_DE_form);

export const MELDEFORMULAR_SOLAR_STD: ISchema = {
   type: 'panel',
   name: 'MELDEFORMULAR_SOLAR_STD',
   label: 'Meldeformular Solar (STD)',
   iconText: 'MST',
   pdfTemplate: '0CC2076E-C8B6-45D0-82F0-21DF339F2990',
   // pdfFileName: label,
   guid: MELDEFORMULAR_SOLAR_STD_DE_form,
   attribut: MELDEFORMULAR_SOLAR_STD_DE_attr,
   beilagen: [
      { guid: SITUATIONSPLAN_form, titel: 'Situationsplan' },
      { guid: SCHNITTPLAN_form, titel: 'Schnittplan / Dachschnitt' },
      { guid: DACHAUFSICHT_form, titel: 'Grundrissplan / Dachaufsicht' },
      { guid: TECHNISCHE_DATEN_form, titel: 'Technisches Datenblatt der Anlage' },
   ],
   steps: [
      { step: 1, titel: 'Ausfüllen', status: DokumentStatus.InArbeit, target: MELDEFORMULAR_SOLAR_STD_AnlageStandort.name },
      { step: 2, titel: 'Signieren', status: DokumentStatus.InArbeit, target: idPanelUnterschreiben },
      { step: 3, titel: 'Senden', status: DokumentStatus.SigniertGesperrt, target: idPanelSenden },
      { step: 4, titel: 'Auf Antwort warten', status: DokumentStatus.Gesendet, target: idPanelAntwort },
   ],
   signaturen: signaturen,
   classLayout: 'w-full',
   children: [
      MELDEFORMULAR_SOLAR_STD_AnlageStandort,
      MELDEFORMULAR_SOLAR_STD_Adressen,
      // MELDEFORMULAR_SOLAR_STD_Gesuchsteller,
      // MELDEFORMULAR_SOLAR_STD_Grundeigentümer,
      MELDEFORMULAR_SOLAR_STD_ThSolaranlage,
      MELDEFORMULAR_SOLAR_STD_PvSolaranlage,
      MELDEFORMULAR_SOLAR_STD_AnlageAllgemein,
      MELDEFORMULAR_SOLAR_STD_AnlageAuausfuehrung,
      // MELDEFORMULAR_SOLAR_STD_Unterlagen,
      // MELDEFORMULAR_SOLAR_STD_Unterschriften,
   ],
   async initFormular(sm: SchemaManager) {
      // Mit tag = 100 wird sichergestellt, das die nur 1x aufgerufen wird
      if (sm.Schema.tag !== 100) {
			sm.appendChild(sm.Schema, await ProjektBeilagen.instance.beilagenPanel(sm));
			sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_STD_DE_Unterschriften(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_STD_DE_Senden(sm));
         sm.appendChild(sm.Schema, await MELDEFORMULAR_SOLAR_STD_DE_Antwort(sm));
         sm.Schema.tag = 100
      }

      try {

         if (sm.formularStatus === DokumentStatus.Undefiniert)
         {
            sm.saveStatus(DokumentStatus.InArbeit);
            SetzePvDaten(sm, '', 'PV_GESAMTLEISTUNG', '', 'PV_ANLAGE');
         }
         else if (sm.formularStatus >= DokumentStatus.SigniertGesperrt)
            sm.DisableAll();

         // Nur Daten übernehmen, wenn noch nicht signiert
         if (sm.formularStatus < DokumentStatus.SigniertGesperrt) {
            const service = sm.service;

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
                  'ASSEK',
                  'AA_INBETRIEBNAHME',
                  'KANTON',
                  'I_ROLLE',                    // Speziell für das Standardformular hier fix 'Solarteur' eintragen
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
                  sm.projekt.gebaeude?.assekuranzNr,
                  sm.projekt.auftrag.datumInbetrieb,
                  sm.Schema.empfaenger?.kanton,
                  'Solarteur'
               ]
            )

            let leistung = 0;
            let pvJa = false;
            sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'pv_panel').forEach(g => {
               let data = JSON.parse(g.daten);
               if (g.anzahl && data.peak_power_w)
                  leistung += g.anzahl * data.peak_power_w;

               pvJa = true;
            });
            if (leistung)
               sm.setValue('PV_GESAMTLEISTUNG', withPrecision(leistung / 1000));
            if (pvJa)
               sm.setValue('PV_ANLAGE', true);
         }
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
