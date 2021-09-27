import { ISchema, IComponent, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { EFormularStatus, IdentityContextDTO } from '../api/model/models';
import { inputGroup, inputGroupCL, label, w_full, card_panel, card_hint_panel, switch_hint_panel, checkBoxGroup, textZusammensetzen, hasAllRequired } from './schema-utils';
import * as moment from 'moment';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { MELDEFORMULAR_SOLAR_AI_attr, MELDEFORMULAR_SOLAR_AI_form } from './schema-guid-def';

const FORMULAR_TYP_MELDEFORMULAR_SOLAR_AI = "MELDEFORMULAR_SOLAR_AI";
const FORMULAR_TYP_SITUATIONSPLAN = "SITUATIONSPLAN";
const FORMULAR_TYP_GRUNDRISSPLAN = "GRUNDRISSPLAN"; //nur bei Flachdach
const FORMULAR_TYP_FASSADENPLAN = "FASSADENPLAN";

const MELDEFORMULAR_SOLAR_AI_AnlageStandort: IComponent = card_panel('Anlage-Standort', 'MELDEFORMULAR_SOLAR_AI_AnlageStandort', [
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

const MELDEFORMULAR_SOLAR_AI_Adressen: IComponent = card_panel('Adressen / Geschäftspartner', '', [
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

const MELDEFORMULAR_SOLAR_AI_Standortbezirk: IComponent = card_panel('Standortbezirk', 'MELDEFORMULAR_SOLAR_AI_STANDORTBEZIRK', [
   // label('', true),
   checkBoxGroup([
      { label: 'Appenzell', field: 'ST_APPENZELL' }, //Platzhalter
      { label: 'Rüte', field: 'ST_RUETE' }, //Platzhalter
      { label: 'Gonten', field: 'ST_GONTEN' }, //Platzhalter
      { label: 'Schwende', field: 'ST_SCHWENDE' }, //Platzhalter
      { label: 'Schlatt-Haslen', field: 'ST_SCHLATTHASLEN' }, //Platzhalter
      { label: 'Oberegg', field: 'ST_OBEREGG' }, //Platzhalter
   ], { required: true }),
]);

const MELDEFORMULAR_SOLAR_AI_ThSolaranlage: IComponent = switch_hint_panel('Thermische Solaranlage', 'MELDEFORMULAR_SOLAR_AI_ThSolaranlage', 'TH_ANLAGE', false, '(Warmwasser)', [
   // label('', true),
   checkBoxGroup([
      { label: 'Flachkollektoren', field: 'TH_FLACHKOLLEKTOREN' },
      { label: 'Röhrenkollektoren', field: 'TH_ROEHRENKOLLEKTOREN' },
   ], { required: false }),
]);

const MELDEFORMULAR_SOLAR_AI_PvSolaranlage: IComponent = switch_hint_panel('Photovoltaikanlage', 'MELDEFORMULAR_SOLAR_AI_PvSolaranlage', 'PV_ANLAGE', false, '(Elektrizität)', [
   label('Gesamtleistung'),
   {
      type: 'input',
      dataType: 'string',
      field: 'PV_GESAMTLEISTUNG',
      suffix: 'kWpeak',
      max: 10,
   },
]);

const MELDEFORMULAR_SOLAR_AI_AnlageAuausfuehrung: IComponent = card_panel('Anlage-Ausführung', 'MELDEFORMULAR_SOLAR_AI_AnlageAuausfuehrung', [
   checkBoxGroup([
      { label: 'Indach', field: 'AA_INDACH' }, //Platzhalter
      { label: 'Aufdach', field: 'AA_AUFDACH' }, //Platzhalter
      { label: 'Fassade', field: 'AA_FASSADE' }, //Platzhalter
      { label: 'Brüstung', field: 'AA_BRUESTUNG' }, //Platzhalter
      { label: 'parallel zum Träger', field: 'AA_TRAEGER' }, //Platzhalter
      { label: 'schräg aufgeständert', field: 'AA_SCHRAEG' }, //Platzhalter
   ], { required: false }),
   label('Blitzschutzpflicht', true),
   checkBoxGroup([
      { label: 'Ja', field: 'AA_BLITZSCHUTZPFLICH_JA' }, //Platzhalter
      { label: 'Nein', field: 'AA_BLITZSCHUTZPFLICH_NEIN' }, //Platzhalter
   ]),
   label('Gesamtfläche der Anlage'),
   {
      type: 'input',
      dataType: 'float',
      field: 'AA_ABSORBERFLAECHE',
      suffix: 'm²',
      max: 14,
   },
   label('Fabrikat / Typ'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_TYP', //Platzhalter
      max: 40,
   },
   label('SPF-Nr.'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_SPF', //Platzhalter
      max: 18,
   },
   label('Baukosten'),
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_BAUKOSTEN', //PV oder allgemein?
      suffix: 'CHF',
      max: 13,
   },
   { type: 'label', label: 'Bemerkung', classLayout: 'col-start-1 col-span-1' },
   {
      type: 'input',
      dataType: 'string',
      field: 'AA_BEMERKUNG', //Platzhalter
      max: 30,
      classLayout: 'col-start-2 col-span-2',
   },
]);

const MELDEFORMULAR_SOLAR_AI_Unterschriften: IComponent = card_hint_panel('Signieren', 'MELDEFORMULAR_SOLAR_AI_Unterschriften', '(Gesuchsteller)', []);
const MELDEFORMULAR_SOLAR_AI_Senden: IComponent = card_panel('Senden', 'MELDEFORMULAR_SOLAR_AI_Senden', []);
const MELDEFORMULAR_SOLAR_AI_Antwort: IComponent = card_panel('Antwort', 'MELDEFORMULAR_SOLAR_AI_Antwort', []);

export const MELDEFORMULAR_SOLAR_AI: ISchema = {
   type: 'panel',
   name: 'MELDEFORMULAR_SOLAR_AI',
   label: 'Meldeformular Solar (AI)',
   iconText: 'MAI',
   pdfTemplate: 'bb3090bf-d342-43f1-b588-5c60f20a1b77',
   pdfFileName: 'MELDEFORMULAR_SOLAR_AI.pdf',
   guid: MELDEFORMULAR_SOLAR_AI_form,
   attribut: MELDEFORMULAR_SOLAR_AI_attr,
   // beilagen: [
   //    { guid: FORMULAR_TYP_SITUATIONSPLAN, titel: 'Situationsplan' },
   //    { guid: FORMULAR_TYP_GRUNDRISSPLAN, titel: 'Grundrissplan' }, //zusätzlich bei AI
   //    { guid: FORMULAR_TYP_FASSADENPLAN, titel: 'Fassadenplan' },
   // ],
   // steps: [
   //    { step: 1, titel: 'Sperren', status: MELDEFORMULAR_SOLAR_AI_Status.Sperren, target: 'MELDEFORMULAR_SOLAR_AI_Unterschriften' },
   //    { step: 2, titel: 'Senden', status: MELDEFORMULAR_SOLAR_AI_Status.Senden, target: 'MELDEFORMULAR_SOLAR_AI_Unterschriften' },
   //    { step: 3, titel: 'Antwort erhalten', status: MELDEFORMULAR_SOLAR_AI_Status.Gesendet, target: 'MELDEFORMULAR_SOLAR_AI_Unterschriften' },
   // ],
   steps: [
      { step: 1, titel: 'Ausfüllen', status: EFormularStatus.InBearbeitung, target: MELDEFORMULAR_SOLAR_AI_AnlageStandort.name },
      { step: 2, titel: 'Signieren', status: EFormularStatus.MussFelderKomplett, target: MELDEFORMULAR_SOLAR_AI_Unterschriften.name },
      { step: 3, titel: 'Senden', status: EFormularStatus.Signiert, target: MELDEFORMULAR_SOLAR_AI_Senden.name },
      { step: 4, titel: 'Auf Antwort warten', status: EFormularStatus.Verschickt, target: MELDEFORMULAR_SOLAR_AI_Antwort.name },
   ],
   classLayout: 'w-full',
   children: [
      MELDEFORMULAR_SOLAR_AI_AnlageStandort,
      MELDEFORMULAR_SOLAR_AI_Adressen,
      MELDEFORMULAR_SOLAR_AI_Standortbezirk,
      // MELDEFORMULAR_SOLAR_AI_Gesuchsteller,
      // MELDEFORMULAR_SOLAR_AI_Grundeigentümer,
      MELDEFORMULAR_SOLAR_AI_ThSolaranlage,
      MELDEFORMULAR_SOLAR_AI_PvSolaranlage,
      MELDEFORMULAR_SOLAR_AI_AnlageAuausfuehrung,
      // MELDEFORMULAR_SOLAR_AI_Unterlagen,
      //MELDEFORMULAR_SOLAR_AI_Unterschriften,
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

      sm.getCompByField('TH_FLACHKOLLEKTOREN_TH_ROEHRENKOLLEKTOREN').required = sm.Values.TH_ANLAGE;
      sm.getCompByField('PV_GESAMTLEISTUNG').required = sm.Values.PV_ANLAGE;
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
