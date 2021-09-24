import { TranslocoService } from "@ngneat/transloco"
import { marker } from '@ngneat/transloco-keys-manager/marker';
import * as moment from "moment";
import { ProduktLizenzDTO } from "../api";
import { ColDef, SchemaManager, SortSeq } from "../components/bi-formular-engine/src/public-api"
import { DataListProps } from "./DataListProps"


export const HoldingListProps = (
	translator: TranslocoService,
	canLoadMore: boolean,
	canLoadAll: boolean,
	limit: number = 0,
	newItemButton: boolean = false
): DataListProps => {
	const coldefs: ColDef[] = [];
	const transKeys: { [field: string]: string } = {
		'name': marker('comp_data_list_holdings.label_name'),
		'aktiv': marker('comp_data_list_holdings.label_active'),
	};

	const titleExpr = (field: string): string => {
		return translator?.translate(transKeys[field]) ?? field;
	};

	translator.langChanges$.subscribe(
		() => {
			for (let colDef of coldefs) {
				colDef.title = titleExpr(colDef.field);
			}
		}
	);

	coldefs.push({ field: 'name', title: titleExpr('name'), class: 'col-start-1 col-span-10' });
	coldefs.push({ field: 'aktiv', title: titleExpr('aktiv'), class: 'col-start-11' });

	return new DataListProps(
		marker('comp_data_list_holdings.title_holdings'),
		coldefs,
		'name',
		SortSeq.desc,
		marker('comp_data_list_holdings.message_loading_holdings'),
		canLoadMore,
		canLoadAll,
		limit,
		newItemButton ? marker('comp_data_list_holdings.button_new_holding') : ''
	);
}

export const GeschStellenListProps = (
	translator: TranslocoService,
	title: string,
	canLoadMore: boolean,
	canLoadAll: boolean,
	limit: number = 0,
	newItemButton: boolean = false
): DataListProps => {
	const coldefs: ColDef[] = [];
	const transKeys: { [field: string]: string } = {
		'firma1': marker('comp_data_list_offices.label_first_name'),
		'adresse': marker('comp_data_list_offices.label_street'),
		'plz': marker('comp_data_list_offices.label_postal_code'),
		'ort': marker('comp_data_list_offices.label_city'),
		'aktiv': marker('comp_data_list_offices.label_active'),
	};

	const titleExpr = (field: string): string => {
		return translator?.translate(transKeys[field]) ?? field;
	};

	translator.langChanges$.subscribe(
		() => {
			for (let colDef of coldefs) {
				colDef.title = titleExpr(colDef.field);
			}
		}
	);

	coldefs.push({ field: 'firma1', title: titleExpr('firma1'), class: 'col-start-1 col-span-2' });
	coldefs.push({ field: 'adresse', title: titleExpr('adresse'), class: 'col-start-3 col-span-2' });
	coldefs.push({ field: 'plz', title: titleExpr('plz'), class: 'col-start-5' });
	coldefs.push({ field: 'ort', title: titleExpr('ort'), class: 'col-start-6 col-span-5' });
	coldefs.push({ field: 'aktiv', title: titleExpr('aktiv'), class: 'col-start-11' });

	return new DataListProps(
		title,
		coldefs,
		'firma1',
		SortSeq.asc,
		marker('comp_data_list_offices.message_loading_offices'),
		canLoadMore,
		canLoadAll,
		limit,
		newItemButton ? marker('comp_data_list_offices.button_new_office') : ''
	);
}


export const MitarbeiterListProps = (
	translator: TranslocoService,
	canLoadMore: boolean,
	canLoadAll: boolean,
	limit: number = 0,
	newItemButton: boolean = false
): DataListProps => {
	const coldefs: ColDef[] = [];
	const transKeys: { [field: string]: string } = {
		'name': marker('comp_data_list_employees.label_family_name'),
		'vorname': marker('comp_data_list_employees.label_given_name'),
		'eMailD': marker('comp_data_list_employees.label_e_mail_address'),
		'telefonD': marker('comp_data_list_employees.label_telephone_number'),
		'aktiv': marker('comp_data_list_employees.label_active'),
	};

	const titleExpr = (field: string): string => {
		return translator?.translate(transKeys[field]) ?? field;
	};

	translator.langChanges$.subscribe(
		() => {
			for (let colDef of coldefs) {
				colDef.title = titleExpr(colDef.field);
			}
		}
	);

	coldefs.push({ field: 'name', title: titleExpr('name'), class: 'col-start-1 col-span-2' });
	coldefs.push({ field: 'vorname', title: titleExpr('vorname'), class: 'col-start-3 col-span-2' });
	coldefs.push({ field: 'eMailD', title: titleExpr('eMailD'), class: 'col-start-5 col-span-3' });
	coldefs.push({ field: 'telefonD', title: titleExpr('telefonD'), class: 'col-start-8 col-span-2' });
	coldefs.push({ field: 'aktiv', title: titleExpr('aktiv'), class: 'col-start-11' });

	return new DataListProps(
		marker('comp_data_list_employees.title_employees'),
		coldefs,
		'name',
		SortSeq.desc,
		marker('comp_data_list_employees.message_loading_employees'),
		canLoadMore,
		canLoadAll,
		limit,
		newItemButton ? marker('comp_data_list_employees.button_new_employee') : ''
	);
}

export const ProjekteListProps = (
	translator: TranslocoService,
	canLoadMore: boolean,
	canLoadAll: boolean,
	limit: number = 0,
	newItemButton: boolean = false
): DataListProps => {
	const coldefs: ColDef[] = []
	const transKeys: { [field: string]: string } = {
		'status': marker('comp_data_list_projects.label_status'),
		'auftragsNr': marker('comp_data_list_projects.label_auftragsNr'),
		'stichwort': marker('comp_data_list_projects.label_stichwort'),
		'phasen': marker('comp_data_list_projects.label_phasen'),
		'strasse': marker('comp_data_list_projects.label_street'),
		'plz': marker('comp_data_list_projects.label_postal_code'),
		'postOrt': marker('comp_data_list_projects.label_city'),
	};

	const strasseExpr = (data: any): string => {
		return `${data.strasse ? data.strasse : ''} ${data.hausNr ? data.hausNr : ''}`
	};

	const statusExpr = (data: any): number[] => {
		return data.fortschritte
	};


	const titleExpr = (field: string): string => {
		return translator?.translate(transKeys[field]) ?? field;
	};

	translator.langChanges$.subscribe(
		() => {
			for (let colDef of coldefs) {
				colDef.title = titleExpr(colDef.field);
			}
		}
	);

	coldefs.push({ field: 'auftragsNr', title: titleExpr('auftragsNr'), class: 'col-start-1 col-span-1' });
	coldefs.push({ field: 'stichwort', title: titleExpr('stichwort'), class: 'col-start-2 col-span-1' });
	coldefs.push({ field: 'status', title: titleExpr('phasen'), class: 'col-start-3 col-span-1', isPhasen: true, statusExpression: statusExpr });
	coldefs.push({ field: 'strasse', expression: strasseExpr, title: titleExpr('strasse'), class: 'col-start-4 col-span-3' });
	coldefs.push({ field: 'plz', title: titleExpr('plz'), class: 'col-start-7 col-span-1' });
	coldefs.push({ field: 'postOrt', title: titleExpr('postOrt'), class: 'col-start-8 col-span-2' });

	return new DataListProps(
		marker('comp_data_list_projects.title_projects'),
		coldefs,
		'strasse',
		SortSeq.desc,
		marker('comp_data_list_projects.message_loading_projects'),
		canLoadMore,
		canLoadAll,
		limit,
		newItemButton ? marker('comp_data_list_projects.button_new_project') : ''
	);
}

export const LizenzenListProps = (
	translator: TranslocoService,
	canLoadMore: boolean,
	canLoadAll: boolean,
	limit: number = 0,
	newItemButton: boolean = true
): DataListProps => {
	const coldefs: ColDef[] = [];
	const transKeys: { [field: string]: string } = {
		'bezeichnung': marker('comp_data_list_lizenzen.bezeichnung'),
		'verfuegbar': marker('comp_data_list_lizenzen.verfuegbar'),
		'gueltigBis': marker('comp_data_list_lizenzen.gueltigBis'),
	};

	const titleExpr = (field: string): string => {
		return translator?.translate(transKeys[field]) ?? field;
	};


	const bezField = (): string => {
		const language = translator.getActiveLang()
		if (language === 'de') return 'bezeichnungDe'
		if (language === 'fr') return 'bezeichnungFr'
		if (language === 'it') return 'bezeichnungIt'
	};

	const verfuegbarExpr = (data: ProduktLizenzDTO): string => {
		return `${data.verfuegbareGekaufteAnzahl} / ${data.gekaufteAnzahl}`
	};

	const dateExpr = (data: ProduktLizenzDTO): string => {
		return moment(data.gueltigBis).format('DD.MM.YYYY')
	};


	translator.langChanges$.subscribe(
		() => {
			for (let colDef of coldefs) {
				colDef.title = titleExpr(colDef.field);
			}
		}
	);


	coldefs.push({ field: bezField(), title: titleExpr('bezeichnung'), class: 'col-start-1 col-span-3' });
	coldefs.push({ field: 'verfuegbareGekaufteAnzahl', expression: verfuegbarExpr, title: titleExpr('verfuegbar'), class: 'col-start-4 col-span-2' });
	coldefs.push({ field: 'gueltigBis', expression: dateExpr, title: titleExpr('gueltigBis'), class: 'col-start-6 col-span-3' });

	return new DataListProps(
		marker('comp_data_list_lizenzen.title'),
		coldefs,
		bezField(),
		SortSeq.asc,
		marker('comp_data_list_lizenzen.message_loading_lizenzen'),
		canLoadMore,
		canLoadAll,
		limit,
		newItemButton ? marker('comp_data_list_lizenzen.button_demo_kaufen') : ''
	);
}
