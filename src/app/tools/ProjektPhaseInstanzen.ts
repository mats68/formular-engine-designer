import { ProjektPhaseWrapper, AnlageWrapper, AktionsWrapper, AktionsTyp, EmpfaengerWrapper } from "./ProjektPhase"
import { EAktionDTO, EAnlageDTO, EAuftragPhaseDTO, DokumentDTO, DokumentStatus, ELeistungDTO, EProjektDTO, LeistungsDefDTO, AktionsDefDTO, EmpfaengerDTO, DokumentChoiceDTO } from "../api"
import { ProjektService } from "../services";
import { Guid } from "./Guid";
import { getSchemaFromDokDef, getSchemaFromDokKat } from "src/app/schemas";
import * as schemas from 'src/app/schemas';
import { ISchema } from "../components";


export const addProjektEmpfaengerPhase = (projektService: ProjektService, projekt: EProjektDTO, phase: EAuftragPhaseDTO, leistungsDef: LeistungsDefDTO, docChoice: DokumentChoiceDTO): Promise<ProjektPhaseWrapper> => {
	const p = new ProjektPhaseWrapper();
	p.phase = phase;
	p.projekt = projekt;
	p.titel = leistungsDef.bezeichnung[projektService.DefLanguage]
	p.empfaenger = [];
	phase.leistungen.forEach(leistung => {
		leistung.aktionen.forEach(aktion => {
			const aktionDef: AktionsDefDTO = leistungsDef.aktionsDefs.find(a => Guid.equals(a.guid, aktion.guiD_AktionDef))
			if (aktionDef) {
				const empfaengerKat = aktionDef.aktionsDoksDefs[0]?.dokumentKat.empfaengerKat;
				let empfWrapper = p.empfaenger.find(e => Guid.equals(e.empfaengerKat.guid, empfaengerKat?.guid));
				if(!empfWrapper){
					empfWrapper = new EmpfaengerWrapper()
					empfWrapper.empfaengerKat = empfaengerKat;
					p.empfaenger.push(empfWrapper)
				}

				addProjektPhaseAktion(projektService, empfWrapper, projekt, leistung, aktion, aktionDef, docChoice)
			} else {
				console.error(`AktionsDefDTO not found for: ${aktion.guiD_AktionDef}`)
			}
		});
	});
	p.empfaenger.sort((a, b) => a.empfaengerKat.bezeichnung.german < b.empfaengerKat.bezeichnung.german ? -1 : a.empfaengerKat.bezeichnung.german > b.empfaengerKat.bezeichnung.german ? 1 : 0);

	return new Promise(resolve => resolve(p))
};

export const addProjektAnlagenPhase = (projektService: ProjektService, projekt: EProjektDTO, phase: EAuftragPhaseDTO, leistungsDef: LeistungsDefDTO, docChoice: DokumentChoiceDTO): ProjektPhaseWrapper => {
	const p = new ProjektPhaseWrapper();
	p.phase = phase;
	p.projekt = projekt;
	p.anlagen = [];
	p.titel = leistungsDef.bezeichnung[projektService.DefLanguage]

	phase.anlagen.forEach(a => {
		let anlagedto = projekt.gebaeude.anlagen.find(an => Guid.equals(an.guid, a))
		if (anlagedto) {
			let anlage = addProjektPhaseAnlage(p, anlagedto.bezeichnung, anlagedto)
			const leistungen = phase.leistungen.filter(l => Guid.equals(l.anlage, anlagedto.guid))
			if (!leistungen) {
				console.error('Keinse Leistungen gefunden für ', anlagedto.guid)
				return
			}

			leistungen.forEach(leistung => {
				leistung.aktionen.forEach(async aktion => {
					const aktionDef: AktionsDefDTO = leistungsDef.aktionsDefs.find(a => Guid.equals(a.guid, aktion.guiD_AktionDef))
					if (aktionDef) {
						await addProjektPhaseAktion(projektService, anlage, projekt, leistung, aktion, aktionDef, docChoice)
					} else {
						console.error(`AktionsDefDTO not found for: ${aktion.guiD_AktionDef}`)
					}
				})
			})

		}
	})

	return p
}

const addProjektPhaseAktion = async (
	projektService: ProjektService,
	item: EmpfaengerWrapper | AnlageWrapper,
	projekt: EProjektDTO,
	leistung: ELeistungDTO,
	aktion: EAktionDTO,
	aktionDef: AktionsDefDTO,
	docChoice: DokumentChoiceDTO,
): Promise<AktionsWrapper> => {

	return new Promise( async (resolve) => {

		const aktionsWrapper = new AktionsWrapper()
		aktionsWrapper.projekt = projekt
		aktionsWrapper.leistung = leistung
		aktionsWrapper.aktion = aktion
		aktionsWrapper.aktionDef = aktionDef
		aktionsWrapper.dateititel = aktion.bezeichnung;// aktionDef.bezeichnung[projektService.DefLanguage]
		aktionsWrapper.aktionsDefGuid = aktion.guiD_AktionDef

		if (aktion.dokument) {
			aktionsWrapper.status = DokumentStatus.InArbeit
		}
		else {
			aktionsWrapper.status = DokumentStatus.Undefiniert
		}

		aktionsWrapper.typ = AktionsTyp.pdf

		if (aktion.guiD_AktionDef) {
			aktionsWrapper.typ = AktionsTyp.Formular
		}

		if (aktionsWrapper.typ === AktionsTyp.pdf) {
			// todo datei.dateiname =
			// datei.dateiname = aktion.bezeichnung + '.pdf'
		}
		else if (aktion.dokument) {
			// let values = JSON.parse(aktion.dokument?.dokument.werte[0].daten);
			if (aktion.dokument.status > 0) {
				aktionsWrapper.status = aktion.dokument.status;
			}
		}

		// aktionsWrapper.sendeDatum = new Date()

		// const schema = Object.values(schemas).find(s => typeof s === 'object' && Guid.equals(s['guid'], aktion.dokument?.dokumentDef?.guid)) as ISchema;
		const schema = aktion.dokument
			? await getSchemaFromDokDef(aktion.dokument.dokumentDef.guid)
			: aktion.bemerkung2
				? await getSchemaFromDokDef(aktion.bemerkung2)
				: await getSchemaFromDokKat(aktion.dokumentKategorie, projekt)
			;
		if (schema) {
			aktionsWrapper.beilageDefs = projektService.projektBeilagen.getFormularListe(aktion.dokument, schema);
			item.aktionen.push(aktionsWrapper)
		}
		return aktionsWrapper;
	});
}


const addProjektPhaseAnlage = (projektPhase: ProjektPhaseWrapper, titel: string, anlage: EAnlageDTO): AnlageWrapper => {
	const Anlage = new AnlageWrapper()
	Anlage.anlage = anlage
	Anlage.titel = titel
	projektPhase.anlagen.push(Anlage)
	return Anlage
}
