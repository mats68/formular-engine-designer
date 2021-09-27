import { ISchema, IComponent, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { EFormularStatus, IdentityContextDTO } from '../api/model/models';
import { inputGroup, inputGroupCL, label, w_full, card_panel, card_hint_panel, switch_hint_panel, checkBoxGroup, textZusammensetzen, hasAllRequired } from './schema-utils';
import * as moment from 'moment';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { MELDEFORMULAR_SOLAR_AR_attr, MELDEFORMULAR_SOLAR_AR_form } from './schema-guid-def';

const FORMULAR_TYP_MELDEFORMULAR_SOLAR_AR = "MELDEFORMULAR_SOLAR_AR";
const FORMULAR_TYP_SITUATIONSPLAN = "SITUATIONSPLAN";
const FORMULAR_TYP_GRUNDRISSPLAN = "GRUNDRISSPLAN"; //nur bei Flachdach
const FORMULAR_TYP_FASSADENPLAN = "FASSADENPLAN";

const MELDEFORMULAR_SOLAR_AR_AnlageStandort: IComponent = card_panel('Anlage-Standort', 'MELDEFORMULAR_SOLAR_AR_AnlageStandort', [
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

const MELDEFORMULAR_SOLAR_AR_Adressen: IComponent = card_panel('Adressen / Geschäftspartner', '', [
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
               inputGroup([
                  { type: 'label', field: 'U_NAME1', },
                  { type: 'label', field: 'U_NAME2', },
               ]),
               { type: 'label', field: 'U_ADR1', },
               { type: 'label', field: 'U_ADR2', },
               inputGroup([
                  { type: 'label', field: 'U_PLZ', },
                  { type: 'label', field: 'U_ORT', },
               ]),
               { type: 'label', field: 'U_EMAIL', },
               { type: 'label', field: 'U_TELNR', },
            ]
         },
      ],
   }
]);

const MELDEFORMULAR_SOLAR_AR_ThSolaranlage: IComponent = switch_hint_panel('Thermische Solaranlage', 'MELDEFORMULAR_SOLAR_AR_ThSolaranlage', 'TH_ANLAGE', false, '(Warmwasser)', [
   // label('', true),
   checkBoxGroup([
      { label: 'Flachkollektoren', field: 'TH_FLACHKOLLEKTOREN' },
      { label: 'Röhrenkollektoren', field: 'TH_ROEHRENKOLLEKTOREN' },
   ], { required: false }),
]);

const MELDEFORMULAR_SOLAR_AR_PvSolaranlage: IComponent = switch_hint_panel('Photovoltaikanlage', 'MELDEFORMULAR_SOLAR_AR_PvSolaranlage', 'PV_ANLAGE', false, '(Elektrizität)', [
   label('keine weiteren Eingaben erforderlich'),
]);

const MELDEFORMULAR_SOLAR_AR_AnlageAuausfuehrung: IComponent = card_panel('Anlage-Ausführung', 'MELDEFORMULAR_SOLAR_AR_AnlageAuausfuehrung', [
   checkBoxGroup([
      { label: 'Innerhalb der Bauzone', field: 'AA_INNERHALB' }, //Platzhalter
      { label: 'Ausserhalb der Bauzone', field: 'AA_AUSSERHALB' }, //Platzhalter
   ], { required: false, multipleSelection: true }),

   checkBoxGroup([
   { label: 'Indach', field: 'AA_INDACH' }, //Platzhalter
   { label: 'Aufdach', field: 'AA_AUFDACH' }, //Platzhalter
   { label: 'Fassade', field: 'AA_FASSADE' }, //Platzhalter
   { label: 'freistehend', field: 'AA_FREI' }, //Platzhalter
   { label: 'Aufständerung', field: 'AA_TRAEGER' }, //Platzhalter
   { label: 'andere', field: 'AA_ANDERE' }, //Platzhalter
   ], { required: false }),

   label('Gesamtfläche der Anlage'),
   {
      type: 'input',
      dataType: 'float',
      field: 'AA_ABSORBERFLAECHE',
      suffix: 'm²',
      max: 10,
   },
   label('Fabrikat / Typ'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_TYP', //Platzhalter
      max: 40,
   },
   label('Materialisierung / Farbe'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_FARBE', //Platzhalter
      max: 20,
   },
   label('Assekuranznummer'),
   {
      type: 'input',
      field: 'ASSEK', //Platzhalter
      max: 10,
   },
   label('Voraussichtliche Inbetriebnahme'),
   {
      type: 'date',
      field: 'AA_INBETRIEBNAHME', //Platzhalter
   },
]);

const MELDEFORMULAR_SOLAR_AR_Unterschriften: IComponent = card_hint_panel('Signieren', 'MELDEFORMULAR_SOLAR_AR_Unterschriften', '(Gesuchsteller)', []);
const MELDEFORMULAR_SOLAR_AR_Senden: IComponent = card_panel('Senden', 'MELDEFORMULAR_SOLAR_AR_Senden', []);
const MELDEFORMULAR_SOLAR_AR_Antwort: IComponent = card_panel('Antwort', 'MELDEFORMULAR_SOLAR_AR_Antwort', []);

export const MELDEFORMULAR_SOLAR_AR: ISchema = {
   type: 'panel',
   name: 'MELDEFORMULAR_SOLAR_AR',
   label: 'Meldeformular Solar (AR)',
   iconText: 'MAR',
   pdfTemplate: '9c727adf-17a6-4f59-8e3a-28385e82c04a',
   pdfFileName: 'MELDEFORMULAR_SOLAR_AR.pdf',
   guid: MELDEFORMULAR_SOLAR_AR_form,
   attribut: MELDEFORMULAR_SOLAR_AR_attr,
   // beilagen: [
   //    { guid: FORMULAR_TYP_SITUATIONSPLAN, titel: 'Situationsplan' },
   //    { guid: FORMULAR_TYP_GRUNDRISSPLAN, titel: 'Grundrissplan' }, //zusätzlich bei AR
   //    { guid: FORMULAR_TYP_FASSADENPLAN, titel: 'Fassadenplan' },
   // ],
   // steps: [
   //    { step: 1, titel: 'Sperren', status: MELDEFORMULAR_SOLAR_AR_Status.Sperren, target: 'MELDEFORMULAR_SOLAR_AR_Unterschriften' },
   //    { step: 2, titel: 'Senden', status: MELDEFORMULAR_SOLAR_AR_Status.Senden, target: 'MELDEFORMULAR_SOLAR_AR_Unterschriften' },
   //    { step: 3, titel: 'Antwort erhalten', status: MELDEFORMULAR_SOLAR_AR_Status.Gesendet, target: 'MELDEFORMULAR_SOLAR_AR_Unterschriften' },
   // ],
   steps: [
      { step: 1, titel: 'Ausfüllen', status: EFormularStatus.InBearbeitung, target: MELDEFORMULAR_SOLAR_AR_AnlageStandort.name },
      { step: 2, titel: 'Signieren', status: EFormularStatus.MussFelderKomplett, target: MELDEFORMULAR_SOLAR_AR_Unterschriften.name },
      { step: 3, titel: 'Senden', status: EFormularStatus.Signiert, target: MELDEFORMULAR_SOLAR_AR_Senden.name },
      { step: 4, titel: 'Auf Antwort warten', status: EFormularStatus.Verschickt, target: MELDEFORMULAR_SOLAR_AR_Antwort.name },
   ],
   classLayout: 'w-full',
   children: [
      MELDEFORMULAR_SOLAR_AR_AnlageStandort,
      MELDEFORMULAR_SOLAR_AR_Adressen,
      // MELDEFORMULAR_SOLAR_AR_Gesuchsteller,
      // MELDEFORMULAR_SOLAR_AR_Grundeigentümer,
      MELDEFORMULAR_SOLAR_AR_ThSolaranlage,
      MELDEFORMULAR_SOLAR_AR_PvSolaranlage,
      MELDEFORMULAR_SOLAR_AR_AnlageAuausfuehrung,
      // MELDEFORMULAR_SOLAR_AR_Unterlagen,
      // MELDEFORMULAR_SOLAR_AR_Unterschriften,
   ],
   async initFormular(sm: SchemaManager) {
      const service = sm.service;
      sm.getCompByName('einreicher_spinner').loading = true;
      try {
         const gs = await service.GetCurrentGeschStelle()
         sm.setValues(
            [
               'I_KONZESS',
               'I_NAME1',
               'I_NAME2',
               'I_ADRESSE1',
               'I_ADRESSE2',
               'I_PLZ',
               'I_ORT']
            ,
            [
               gs.iNummer,
               gs.firma1,
               gs.firma2,
               gs.adresse,
               gs.adrzusatz,
               gs.plz,
               gs.ort]
         )
         sm.getCompByName('einreicher_spinner').loading = false;
         sm.getCompByName('sachb_spinner').loading = true;
         const ma = await service.GetCurrentMitarbeiter()
         sm.setValues(
            [
               'I_SACHB',
               'I_EMAIL',
               'I_TELNRD',
               'I_TELNRM'
            ]
            ,
            [
               `${ma.vorname} ${ma.name}`,
               ma.eMailD,
               ma.telefonD,
               ma.telefonM
            ]
         )
         sm.getCompByName('sachb_spinner').loading = false;
         if (sm.projekt.gebaeude?.guid_Inhaber) {
            sm.getCompByName('eigent_spinner').loading = true;
            const a = await service.GetAdressse(sm.projekt.gebaeude.guid_Inhaber)
            sm.setValues(
               [
                  'U_NAME1',
                  'U_NAME2',
                  'U_ADRESSE1',
                  'U_ADRESSE2',
                  'U_PLZ',
                  'U_ORT',
                  'U_TELNR',
                  'U_EMAIL'
               ],
               [
                  a.vorname,
                  a.name,
                  a.adresse1,
                  a.adresse2,
                  a.plz,
                  a.ort,
                  a.telefonD,
                  a.eMailD
               ]
            )
            sm.getCompByName('eigent_spinner').loading = false;

         }

         sm.setValues(
            [
               'O_STRASSE',
               'O_HAUSNR',
               'O_PLZ',
               'O_ORT',
               'GEMEINDE',
               'PARZELLE',
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
               sm.projekt.gebaeude?.egid,
               sm.projekt.auftrag?.bemerkungen,
               sm.projekt.auftrag?.datumInbetrieb
            ]
         )

         let flaeche = 0;
         let leistung = 0;
         let fabrikatTyp = '';
         let pvJa = false;
         sm.projekt.gebaeude?.geraete?.filter(g => g.typ === 'PV-Modul').forEach(g => {
            let data = JSON.parse(g.daten);
            if (data.stk_RISO && data.area_m2)
               flaeche += data.stk_RISO * data.area_m2;
            if (data.stk_RISO && data.peak_power_w)
               leistung += data.stk_RISO * data.peak_power_w;
            if (data.brand_name || data.model)
            {
               if(data.brand_name && data.model)
                  fabrikatTyp = textZusammensetzen(data.brand_name, " / ", data.model);
               else if(data.brand_name)
                  fabrikatTyp = data.brand_name;
               else if(data.model)
                  fabrikatTyp = data.model;

               pvJa = true;
            }
         });
         if (flaeche)
            sm.setValue('AA_ABSORBERFLAECHE', flaeche);
         if (leistung)
            sm.setValue('PV_GESAMTLEISTUNG', leistung);
         if(fabrikatTyp !== '')
            sm.setValue('AA_TYP', fabrikatTyp);
         if (pvJa)
            sm.Values.PV_ANLAGE = true;


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

			updateStatus(sm);
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
		updateStatus(sm);
   },
	getStepLinkData(sm: SchemaManager, step: any): any {
		if (step.status === sm.formularStatus) {
			return {
				icon: '/assets/icons/link_phase_in_progress.svg',
				class: 'fill-in-progress'
			};
		}
		if (step.status < sm.formularStatus) {
			return {
				icon: '/assets/icons/link_phase_done.svg',
				class: 'fill-done'
			};
		}

		return {
			icon: '/assets/icons/link_phase_empty.svg',
			class: 'fill-empty'
		};
	},
   onAfterSave(sm, formular) {
      console.log('Called from schema onAfterSave: ', formular)
   },
   onAfterReload(sm, formular) {
      console.log('Called from schema onAfterReload: ', formular)
   },
}

const updateStatus = (sm: SchemaManager) => {
	if(istGesendet(sm)){
		sm.saveStatus(EFormularStatus.Verschickt);
		sm.DisableAll(true);
	}
	else if(istSigniert(sm)){
		sm.saveStatus(EFormularStatus.Signiert);
	}
	else if(hasAllRequired(sm)){
		sm.saveStatus(EFormularStatus.MussFelderKomplett);
	}
	else {
		sm.saveStatus(EFormularStatus.InBearbeitung);
	}
}

const istSigniert = (sm : SchemaManager) : boolean => {
	return sm.Values.UX_DATUM;
}

const istGesendet = (sm : SchemaManager) : boolean => {
	return sm.Values.MELDEFORMULAR_GESENDET;
}
