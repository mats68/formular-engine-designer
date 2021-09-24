import { ProjektPhase, ProjektPhaseAnlage, ProjektPhaseDatei, ProjektPhaseDateiTyp, ProjektPhaseEmpfaenger } from "./ProjektPhase"
import { EAktionDTO, EAnlageDTO, EAuftragPhaseDTO, EFormularDTO, EFormularStatus, ELeistungDTO, EProjektDTO } from "../api"
import * as schemas from 'src/app/schemas';
import { TranslocoService } from "@ngneat/transloco";
import { marker } from "@ngneat/transloco-keys-manager/marker";
import { ISchema } from "../components";
import { getFormularTypBeilagenDefs } from "../services";
import { VSE_IA18_DE_form, VSE_TAG_DE_form } from "../schemas/schema-guid-def";

const addProjektPhaseDatei = (
	item: ProjektPhaseEmpfaenger | ProjektPhaseAnlage,
	projekt: EProjektDTO,
	leistung: ELeistungDTO,
	aktion: EAktionDTO
): ProjektPhaseDatei => {
	const datei = new ProjektPhaseDatei()
	datei.projekt = projekt
	datei.leistung = leistung
	datei.aktion = aktion
	datei.dateititel = aktion.bezeichnung
	datei.formulartyp_guid = aktion.guiD_AktionDef
	if (aktion.dokument)
	{
		datei.status = EFormularStatus.InBearbeitung
    	}
	else
	{
		datei.status = EFormularStatus.Undefiniert
	}

	datei.typ = ProjektPhaseDateiTyp.pdf

	if (aktion.guiD_AktionDef) {
		datei.typ = ProjektPhaseDateiTyp.Formular
	}

	if (datei.typ === ProjektPhaseDateiTyp.pdf) {
        	// todo datei.dateiname =
		// datei.dateiname = aktion.bezeichnung + '.pdf'
   	}
	 else if(aktion.dokument) {
		// let values = JSON.parse(aktion.dokument?.dokument.werte[0].daten);
		if(aktion.dokument.status > 0) {
			datei.status = aktion.dokument.status;
		}
	}

	datei.sendeDatum = new Date()

    const schema = Object.values(schemas).find(s => typeof s === 'object' && s['guid'] === aktion.guiD_AktionDef) as ISchema;
    if (schema && schema.beilagen) {
		let formular: EFormularDTO

        schema.beilagen.forEach(sb => {
			if (aktion.guiD_AktionDef === schema.guid) {
				formular = aktion.dokument
			}
     		const b = getFormularTypBeilagenDefs(sb, projekt, formular)
            datei.beilagen.push(...b);
        });
    }

	 // TAG und IA temporär ausblenden
	if (
		datei.formulartyp_guid != undefined && (
		datei.formulartyp_guid == VSE_IA18_DE_form
		|| datei.formulartyp_guid == VSE_TAG_DE_form
		)
	){
		return null;
	}

	item.dateien.push(datei)

	return datei
}

const addProjektPhaseAnlage = (projektPhase: ProjektPhase, titel: string, anlage: EAnlageDTO): ProjektPhaseAnlage => {
	const Anlage = new ProjektPhaseAnlage()
	Anlage.anlage = anlage
	Anlage.titel = titel
	projektPhase.anlagen.push(Anlage)
	return Anlage
}

const addProjektPhaseEmpfaenger = (projektPhase: ProjektPhase, empfaenger: string): ProjektPhaseEmpfaenger => {
	const item = new ProjektPhaseEmpfaenger()
	item.empfaenger = empfaenger
	projektPhase.empfaenger.push(item)

	return item
}


export const addProjektEmpfaengerPhase = (translationService: TranslocoService, projekt: EProjektDTO, phase: EAuftragPhaseDTO): ProjektPhase => {
	const p = new ProjektPhase();
	p.phase = phase;
	p.projekt = projekt;
	p.titel = translationService.translate(marker('page_project_wizard.title_phase_planning'));
	p.empfaenger = [];
	phase.leistungen.forEach((leistung, ind) => {
		let titel = ''
		let beilagen = []

		let empfaengerCategory: string = leistung.empfaengerKategorie.toUpperCase();

		if(empfaengerCategory === 'B053219C-6A38-47D4-9661-2E234B45FBFF') {
			titel = translationService.translate(
				marker('page_project_wizard.label_formular_to'), {
					recipient: translationService.translate(marker('page_project_wizard.label_recipient_community'))
				});
			// beilagen = ['Lageplan', 'Baugesuch']
		}
		else if(empfaengerCategory === '2BF651F0-F779-4492-BAF3-35B765FEB351') {
			titel = translationService.translate(
				marker('page_project_wizard.label_formular_to'), {
					recipient: translationService.translate(marker('page_project_wizard.label_recipient_vnb'))
				});
		}
		else {
			titel = translationService.translate(
				marker('page_project_wizard.label_formular_to'), {
					recipient: translationService.translate(marker('page_project_wizard.label_recipient_owner'))
				});
			// beilagen = ['Lageplan']
		}

		const empfaenger = addProjektPhaseEmpfaenger(p, titel)
		leistung.aktionen.forEach((aktion, a_ind) => {
			addProjektPhaseDatei(empfaenger, projekt, leistung, aktion)
		});
	});

	return p
};

export const addProjektAnlagenPhase = (translationService: TranslocoService, projekt: EProjektDTO, phase: EAuftragPhaseDTO): ProjektPhase => {
	const p = new ProjektPhase();
	p.phase = phase;
	p.projekt = projekt;
	p.anlagen = [];
	p.titel = translationService.translate(marker('page_project_wizard.title_phase_realization'));

	phase.anlagen.forEach(a => {
		let anlagedto = projekt.gebaeude.anlagen.find(an => an.guid === a)
		if (anlagedto) {
			let anlage = addProjektPhaseAnlage(p, anlagedto.bezeichnung, anlagedto)
			const leistungen = phase.leistungen.filter(l => l.anlage === anlagedto.guid)
			if (!leistungen) {
					console.error('Keinse Leistungen gefunden für ', anlagedto.guid)
					return
			}

			leistungen.forEach(leistung => {
					leistung.aktionen.forEach((aktion, ind) => {
						// let beilagen = []
						// if (ind === 0) {
						// 	beilagen = [
						// 		translationService.translate(marker('page_project_wizard.label_attachment_lageplan')),
						// 		translationService.translate(marker('page_project_wizard.label_attachment_schema'))
						// 	];
						// }
						// if (ind === 1) {
						// 	beilagen = [
						// 		translationService.translate(marker('page_project_wizard.label_attachment_apparate_bestellung'))
						// 	];
						// }
						// if (ind === 2) {
						// 	beilagen = [];
						// }
						// if (ind === 3) {
						// 	beilagen = [];
						// }
						// if (ind === 4) {
						// 	beilagen = [
						// 		translationService.translate(marker('page_project_wizard.label_attachment_form_mpp')),
						// 		translationService.translate(marker('page_project_wizard.label_attachment_form_mp'))
						// 	];
						// }
						addProjektPhaseDatei(anlage, projekt, leistung, aktion)
					})
			})

		}
	})

	return p
}

export const addProjektPronovoPhase = (translationService: TranslocoService, projekt: EProjektDTO, phase: EAuftragPhaseDTO): ProjektPhase => {
	const p = new ProjektPhase();
	p.phase = phase;
	p.projekt = projekt;
	p.titel = translationService.translate(marker('page_project_wizard.title_phase_redeem'));
	p.empfaenger = [];

	phase.leistungen.forEach((leistung, ind) => {
		let titel = '';
		let beilagen = [];

		let empfaengerCategory: string = leistung.empfaengerKategorie.toUpperCase();

		if(empfaengerCategory === '22FC1591-CE09-4ACB-983A-768D3F8B5E3F') {
			titel = translationService.translate(
				marker('page_project_wizard.label_formular_to'),
				{ recipient: 'Pronovo' }
			);

			beilagen = [
				translationService.translate(marker('page_project_wizard.label_attachment_vollmacht')),
				translationService.translate(marker('page_project_wizard.label_attachment_grundbuch_auszug')),
			];
		}
		else
		{
			titel = translationService.translate(
				marker('page_project_wizard.label_formular_to'), {
					recipient: translationService.translate(marker('page_project_wizard.label_recipient_owner'))
				});
		}

		const empfaenger = addProjektPhaseEmpfaenger(p, titel);
		leistung.aktionen.forEach((aktion, a_ind) => {
			addProjektPhaseDatei(empfaenger, projekt, leistung, aktion)
		});
	});

	return p
}

