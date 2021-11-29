import { Injectable, Type } from '@angular/core';
import {
	AdresseDTO,
	AdressenService,
	EAktionDTO,
	EAktionenService,
	EAnlageDTO,
	EAuftraegeService,
	EAuftragDokumentPoolDTO,
	EAuftragDTO,
	EAuftragPhaseDTO,
	DsoService,
	DokumentBeilageLinkDTO,
	DokumentDTO,
	DokumenteService,
	DokumentStatus,
	EmpfaengerDTO,
	EmpfaengerService,
	EProjektDTO,
	EProjekteService,
	GebaeudeDTO,
	GebaeudeService,
	GeschStelleDTO,
	GeschStellenService,
	IdentityContextDTO,
	MitarbeiterDTO,
	MitarbeiterService,
	PermissionSetDTO,
	PostleitzahlenDTO,
	PostleitzahlenService,
	AppSettingsService,
	ProduktLizenzDTO,
	ProduktLizenzenService,
	EFOnlineApiService,
	ELeistungDTO,
	KompoDbDTO,
	KompoDBApiService,
	DefinitionenService,
	AuftragsDefDTO,
	DokumentChoiceDTO,
	DokumentDefDTO,
	EGeraetDTO,
	TransferTyp,
	DokumentTransferHistoryDTO,
} from 'src/app/api';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { LoadingStatus } from 'src/app/tools/DataListProps';
import { ProjektPhaseWrapper } from 'src/app/tools';
import * as EventEmitter from 'events';
import { marker } from '@ngneat/transloco-keys-manager/marker';
// import { AuthorizationService } from 'src/app/modules/auth/authorization.service';
// import { AuthenticationService } from 'src/app/modules/auth/authentication.service';
import { translate, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { asGuid, Guid } from 'src/app/tools/Guid';
import { SignatureRole } from './signatureRole';
import { ISchema, ISelectOptionItems, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { ProduktLizenzGutscheinDTO } from 'src/app/api';
import * as _ from "lodash-es";
import * as moment from 'moment';
// import { ProjectAnlageAnlageEditDialogComponent, ProjectDetailEditDialogComponent } from 'src/app/components';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash-es';
// import { NGXLogger } from 'ngx-logger';
import { DokumentKatDTO } from 'src/app/api';
import { adressen, fakeProjekt, geschStelle, mitarbeiter } from './fake';

export interface INavbarItem {
	titel: string,
	routerLink: string,
	icon: string,
}

export const EmpfaengerKategorienGuids = {
	eigentuemer: "c92cb2d8-de94-4c0d-8a21-42ddfa7f80b8",
	gemeinde: "b053219c-6a38-47d4-9661-2e234b45fbff",
	vnb: "2bf651f0-f779-4492-baf3-35b765feb351",
	einmalverguetung: "22fc1591-ce09-4acb-983a-768d3f8b5e3f",
	kanton: "8614a362-1338-4dcb-bd50-89123846924a"
}

export interface IEmpfaengerKategorienItem {
	titel: string
	hasEmpfaenger?: boolean
	items: EmpfaengerDTO[]
	guid?: string
	label?: string
}
let _EmpfaengerKategorienItems = null
export const EmpfaengerKategorienItems = (): { [key: string]: IEmpfaengerKategorienItem } => {
	if (!_EmpfaengerKategorienItems) {
		_EmpfaengerKategorienItems = {
			"c92cb2d8-de94-4c0d-8a21-42ddfa7f80b8": {
				titel: translate(marker('page_project_wizard.label_recipient_owner')),
				items: null
			},
			"b053219c-6a38-47d4-9661-2e234b45fbff": {
				titel: translate(marker('page_project_wizard.label_recipient_community')),
				hasEmpfaenger: true,
				items: null
			},
			"2bf651f0-f779-4492-baf3-35b765feb351": {
				titel: translate(marker('page_project_wizard.label_recipient_vnb')),
				hasEmpfaenger: true,
				items: null
			},
			"22fc1591-ce09-4acb-983a-768d3f8b5e3f": {
				titel: translate(marker('page_project_wizard.label_recipients_einmalverguetung')),
				items: null
			},
			"8614a362-1338-4dcb-bd50-89123846924a": {
				titel: translate(marker('page_project_wizard.label_recipients_kanton')),
				items: null
			}
		}
	}
	return _EmpfaengerKategorienItems
}


export const PhasenKomponenteGuids = {
	gesuche_baustart: "5155be1f-13d6-4087-9068-613f6578af36",
	apparate_kontrolle: "a774cb79-c119-4c33-bac1-45fdf19f011b",
	pronovo: "3bacbd8d-bdf7-40e5-9e6f-c8d238d5f70e",
}

/**
 * Definition eines Unterschrift Abschnittes auf diesem Dokument
 */
export interface SignaturDef {
	rolle: SignatureRole[],
	signaturKey: string,
	titel: string,
	datumFeld: string,
	ortFeld?: string,
	gruppe?: string,
	fakultativ?: boolean,
}

export interface IDialogBoxData {
	titel?: string
	text?: string
	showOkButton?: boolean
	showCancelButton?: boolean
	okClicked?: boolean
	okBtnText?: string
	schema?: ISchema
	schemaManager?: SchemaManager
	values?: any
	close?: () => void
}

export type IProjektAbschnitt = 'auftrag' | 'gebaude' | 'empfaenger' | 'adressen' | 'anlage'

export interface IDialogBoxDataProjektAbschnitt {
	okClicked?: boolean
	abschnitt: IProjektAbschnitt
	values?: any
}


export const DokumentTypGuids = {
	pdf: '23ABACF4-ECF1-4EA3-98C5-DDC2A74E0767',
	jpg: '99FBFE2F-6FBD-4E77-ACB2-9F8FEDB6D942',
	png: 'F418973A-AF13-4CC1-B374-967B9D4048C4',
	svg: 'CAAEF2CA-72CB-4A82-ABD1-93B4C80FEB1B',
}

export interface DokumentDef {
	guid: string
	titel: string
	translateTitel?: boolean
	reqiered?: boolean
}

export interface DokumentDefs {
	[key: string]: DokumentDef
}


export const FormularTypenGuids: DokumentDefs = {
	MF: { guid: '3aa1f096-7508-4258-8aa1-b4ca3da4e89e', titel: 'Meldeformular FR' },
	FAS_PLAN: { guid: '60f61104-9d07-4e92-bfae-886e625fea0b', titel: 'Fassadenplan' },
	SIT_PLAN: { guid: '2f5ccbbc-db19-4ce7-a1a3-b8ac7a6435e4', titel: 'Situationsplan' },
	PRN_VLMT: { guid: 'ce5d2d30-8dd0-4e88-be51-f2956389fb26', titel: 'Pronovo Vollmacht' },
	GRND_ASZ: { guid: 'b1585bec-ffce-44db-904c-ed7e02261e05', titel: 'Grundbuch Auszug' },
	BE: { guid: '817f136e-58d6-4254-86ba-408fc4907814', titel: 'Beilage' },
	BG: { guid: 'a4ea2ae1-43a2-4da6-acce-d4f0b77bfa48', titel: 'Baugesuch' },
	PG: { guid: 'fd07a456-e95e-4cbb-9f1f-fe148c7aa250', titel: 'Pronovo Gesuch' },
	TAG: { guid: '0e502284-436b-4e2b-a566-177919e13dee', titel: 'Technisches Anschlussgesuch' },
	IA: { guid: '72faa42b-4c3b-41bb-a747-cd4e846c991e', titel: 'Installationsanzeige' },
	MPP: { guid: '4d0159cf-f16d-4322-9e7f-3adc6f02d27f', titel: 'Mess- und Prüfprotokoll' },
	PV: { guid: 'ec24c264-f634-41a0-9730-0b81b0115ecb', titel: 'MPP	Mess- und Prüfprotokoll Photovoltaik' },
	SiNa: { guid: '7ec9736c-d24e-4252-b0fc-941c8a3fc028', titel: 'Sicherheitsnachweis' },
	MS: { guid: 'e0ea8cd1-a4ef-418d-b3db-e6b66fc42fc4', titel: 'Meldeformular Solar SZ' },
}


type FormularStatusInterface = Record<number, string>
export const FormularStatusText = (): FormularStatusInterface => ({
	[DokumentStatus.Undefiniert]: '',
	[DokumentStatus.Importiert]: '',
	[DokumentStatus.InArbeit]: translate(marker('form_status.in_arbeit')),
	[DokumentStatus.SigniertGesperrt]: translate(marker('form_status.unterzeichnet')),
	[DokumentStatus.TeilSigniert]: translate(marker('form_status.teil_unterzeichnet')),
	[DokumentStatus.Gesendet]: translate(marker('form_status.gesendet')),
	[DokumentStatus.AntwortErhalten]: translate(marker('form_status.antwort_erhalten')),
	[DokumentStatus.ErhaltBestaetigt]: translate(marker('form_status.erhalt_bestaetigt')),
	[DokumentStatus.Bewilligt]: translate(marker('form_status.bewilligt')),
	[DokumentStatus.BewilligtMassnahmen]: translate(marker('form_status.bewilligt_massnahmen')),
	[DokumentStatus.ErledigtOhneAntwort]: translate(marker('form_status.erledigt_ohne_antwort')),
	[DokumentStatus.Abgelehnt]: translate(marker('form_status.abgelehnt')),
})

export const FormularGaugeText = (): FormularStatusInterface => ({
	[DokumentStatus.Undefiniert]: '',
	[DokumentStatus.Importiert]: '',
	[DokumentStatus.InArbeit]: translate(marker('form_gauge.in_arbeit')),
	[DokumentStatus.SigniertGesperrt]: translate(marker('form_gauge.unterzeichnet')),
	[DokumentStatus.TeilSigniert]: translate(marker('form_gauge.teil_unterzeichnet')),
	[DokumentStatus.Gesendet]: translate(marker('form_gauge.gesendet')),
	[DokumentStatus.AntwortErhalten]: translate(marker('form_gauge.antwort_erhalten')),
	[DokumentStatus.ErhaltBestaetigt]: translate(marker('form_gauge.erhalt_bestaetigt')),
	[DokumentStatus.Bewilligt]: translate(marker('form_gauge.bewilligt')),
	[DokumentStatus.BewilligtMassnahmen]: translate(marker('form_gauge.bewilligt_massnahmen')),
	[DokumentStatus.ErledigtOhneAntwort]: translate(marker('form_gauge.erledigt_ohne_antwort')),
	[DokumentStatus.Abgelehnt]: translate(marker('form_gauge.abgelehnt')),
})

export interface FormularStatusSteps {
	step: number
	titel: string
	translateTitel?: boolean
	status: number | number[] //FormularStatus
	target: string
}

const StartseiteItem: INavbarItem = {
	titel: marker('comp_nav_bar.label_dashboard'),
	routerLink: '/dashboard',
	icon: '/assets/icons/nav-dashboard.svg'
}

const ProjekteItem: INavbarItem = {
	titel: marker('comp_nav_bar.label_projects'),
	routerLink: '/projects',
	icon: '/assets/icons/nav-projects.svg'
}

const GeschStellenItem: INavbarItem = {
	titel: marker('comp_nav_bar.label_manage'),
	routerLink: '/geschaeftsstellen',
	icon: '/assets/icons/nav-manage.svg'
}

const ProduktLizenzenItem: INavbarItem = {
	titel: marker('comp_nav_bar.label_produkt_lizenzen'),
	routerLink: '/produktlizenzen',
	icon: '/assets/icons/nav-lizenzen.svg'
}


export enum OriginUrl {
	dashboard = '/dashboard',
	verwaltung = '/bi-verwaltung',
	projects = '/projects',
	geschaeftsstellen = '/geschaeftsstellen',
	search = '/search',
}

export const isRoute = (originUrl: OriginUrl, url: string): boolean => {
	return url.indexOf(originUrl) === 0
}

export interface ISaveData {
	name: string
	values: any
}

export interface ISearchData {
	searchText?: string
	originUrl?: string
	old_searchText?: string
	old_originUrl?: string
	overlay?: boolean
	holdingData?: any[]
	holdingData_LoadingStatus?: LoadingStatus
	geschStellenData?: any[]
	geschStellenData_LoadingStatus?: LoadingStatus
	mitarbeiterData?: any[]
	mitarbeiterData_LoadingStatus?: LoadingStatus
	projekteData?: any[]
	projekteData_LoadingStatus?: LoadingStatus
}

export const formStatusField = '_form_status_'

export const randomNummer = (): string => {
	return Math.floor(Math.random() * 9000000).toString();
}

export interface BreadCrumbItem {
	titel: string
	url?: string
	queryParams?: Params
}

export const tr_key = (key_tr: string): string => {
	return translate(marker(key_tr))
}


export enum ProgressStatus {
	Leer = 0,
	InArbeit = 1,
	Erledigt = 2,
}

export interface PdfDokument {
	formular?: DokumentDTO
	beilage?: DokumentBeilageLinkDTO
}

export class BeilageWrapper {
	dokumentDef: DokumentDef;
	isAttached: boolean;
	isSending: boolean = false;

	constructor(
		dokumentDef: DokumentDef = undefined,
		beilage: DokumentDTO = undefined,
	) {
		this._projektService = ProjektService.instance;
		this._dialog = this._projektService.dialog;
		this.dokumentDef = dokumentDef;
		this._beilage = beilage;
	}
	private _projektService: ProjektService;
	private _dialog: MatDialog;

	private _beilage: DokumentDTO;
	public get beilage(): DokumentDTO {
		return this._beilage;
	}
	public set beilage(b: DokumentDTO) {
		this._beilage = b;
	}

	private _dokument: DokumentDTO;
	public get dokument(): DokumentDTO {
		// if (!this._dokument)
		// 	this._dokument = this._projektService.findeDokumentVonBeilage(this.beilage);
		return this._dokument;
	}
	public set dokument(d: DokumentDTO) {
		this._dokument = d;
	}

	private _leistung: ELeistungDTO;
	public get leistung(): ELeistungDTO {
		if (!this._leistung)
			this._leistung = this._projektService.findeLeistung(this.dokument);
		return this._leistung;
	}

	public get empfaenger(): string {
		return this.leistung?.empfaenger;
	}

	get titel(): string {
		if (this.beilage && this.beilage.dso) {
			return getDateiNamePrint(this.beilage.dso.originalName)
		} else {
			return this.titelTyp
		}
	}

	get titelTyp(): string {
		if (this.dokumentDef.translateTitel) {
			// return this.dokumentDef.titel
			return this._projektService.translationService.translate(this.dokumentDef.titel)
		} else {
			return this.dokumentDef.titel
		}
	}

	get verknuepfenText(): string {

		return this.isAttached ? translate(marker('formular_beilage.verknüpft')) : translate(marker('formular_beilage.verknüpfen'));
	}

	get beilageVerfuegbarText(): string {
		if (this.isAttached)
			return '';

		return this.beilage ? translate(marker('formular_beilage.verfügbar')) : translate(marker('formular_beilage.nicht_verfügbar'));
	}

	get istCheckboxSichtbar(): boolean {
		if (!this.beilage)
			return true;

		if(!this.dokument)
			return false;

		if (this.dokument.status < DokumentStatus.Gesendet)
			return true;

		if ([DokumentStatus.Undefiniert, DokumentStatus.InArbeit].indexOf(this.beilage.status) > -1) {
			const empfaenger = this.leistung.empfaenger;
			const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.empfaenger, empfaenger) && [TransferTyp.Empfang, TransferTyp.Versand].indexOf(th.typ) > -1));
			return !th;
		}

		return false;
	}

	get isDeletable(): boolean {
		if (!this.beilage)
			return false;

		// Die Beilage wurde gesendet oder empfangen
		if (this.beilage.transferHistory && this.beilage.transferHistory.filter(th => [TransferTyp.Versand, TransferTyp.Empfang].indexOf(th.typ) > -1).length > 0)
			return false;

		// Die Beilage ist mit einem Haupddokument verknüpft
		if (this._projektService.findeDokumentVonBeilage(this.beilage))
			return false;

		return true;
	}

	get icon(): string {
		if (this.beilage) {
			// if (this.beilage.status == DokumentStatus.Gesendet)
			// 	return 'check_circle_outline';
			// else if (this.beilage.status == DokumentStatus.Importiert)
			// 	return 'reply';
			{
				const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.empfaenger, this.empfaenger) && [TransferTyp.Versand].indexOf(th.typ) > -1));
				if (th)
					return 'check_circle_outline';

			}
			{
				const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.absender, this.empfaenger) && [TransferTyp.Empfang].indexOf(th.typ) > -1));
				if (th)
					return 'reply';
			}
		}

		return 'warning'
	}
	get iconBackgroundClass(): string {
		// if (this.beilage?.status === DokumentStatus.Importiert)
		// 	return 'bg-tertiary-color-5';
		{
			const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.empfaenger, this.empfaenger) && [TransferTyp.Versand].indexOf(th.typ) > -1));
			if (th)
				return 'bg-tertiary-color-2';
		}
		{
			const th = _.last(this.beilage?.transferHistory?.filter(th => Guid.equals(th.absender, this.empfaenger) && [TransferTyp.Empfang].indexOf(th.typ) > -1));
			if (th)
				return 'bg-tertiary-color-5';
		}

		return 'bg-secondary-color-2'
	}

	get iconClass(): string {
		if (this.beilage) {
			// if (this.beilage.status == DokumentStatus.Gesendet)
			// 	return 'tertiary-color-2';
			// else if (this.beilage.status == DokumentStatus.Importiert)
			// 	return 'tertiary-color-5';
			{
				const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.empfaenger, this.empfaenger) && [TransferTyp.Versand].indexOf(th.typ) > -1));
				if (th)
					return 'tertiary-color-2';
			}
			{
				const th = _.last(this.beilage.transferHistory?.filter(th => Guid.equals(th.absender, this.empfaenger) && [TransferTyp.Empfang].indexOf(th.typ) > -1));
				if (th)
					return 'tertiary-color-5';
			}
		}

		return 'tertiary-color-3'
	}

	sendBeilage(): boolean {
		// var answer = window.confirm(translate(marker('comp_projekt_phase.beilage_nachsenden')));
		// if (answer) {
		// 	this.isSending = true;

		// 	setTimeout(async () => {
		// 		this.beilage.status = DokumentStatus.Gesendet;
		// 		const em: EmpfaengerDTO = await this._projektService.GetEmpfaenger_Guid(this.empfaenger);
		// 		const th: DokumentTransferHistoryDTO = {
		// 			mandant: this.beilage.mandant,
		// 			dokument: this.beilage.guid,
		// 			absender: this._projektService.CurIdentity.holding,
		// 			empfaenger: this.empfaenger,
		// 			kanal: em.transferKanal,
		// 			typ: TransferTyp.Versand,
		// 			timestamp: moment.utc().toISOString(),
		// 		};
		// 		this.beilage.transferHistory.push(th);

		// 		await this._projektService.SaveDokument(this.beilage);

		// 		this.isSending = false;
		// 	}, 2000);

		// 	return true;
		// }
		return false;
	}

	async downloadBeilage(): Promise<void> {
		await this._projektService.DownloadFormular(this.beilage);
	}

	async deleteBeilage(): Promise<void> {
		await this._projektService.Delete_Dokument_Pool_Beilage(this.beilage.guid, this._projektService.CurProjekt);
	}

	// private async showDialog(bfd: BeilageFileDef): Promise<BeilageWrapper> {

		// const dialogRef = this._dialog.open(BeilageDialogComponent, { width: '80vw', height: '95vh', data: bfd, });

		// return new Promise((resolve) => {
		// 	if (!bfd.readonly) {

		// 		if (this._projektService.allDokumentDefs) {
		// 			dialogRef.componentInstance.showList(this._projektService.allDokumentDefs);
		// 		}
		// 		else {
		// 			dialogRef.componentInstance.loading = true;
		// 			this._projektService.GetDocDefs()
		// 				.then((dokumentDefs) => {
		// 					dialogRef.componentInstance.showList(dokumentDefs);
		// 				})
		// 				.finally(() => {
		// 					dialogRef.componentInstance.loading = false;
		// 				});
		// 		}
		// 	}

		// 	dialogRef.afterClosed().toPromise().then(async () => {
		// 		if (bfd.okClicked && bfd.isValid() && bfd.hasChanged()) {
		// 			const auftrag = this._projektService.CurProjekt.auftrag;
		// 			this.beilage = await this._projektService.SavePDF_as_PoolBeilage(auftrag, bfd.file, bfd.dokumentDefGuid, bfd.beilageGuid);
		// 		}
		// 		return resolve(this);
		// 	});
		// });
	// }

	// static async newBeilage(file: File): Promise<BeilageWrapper> {
	// 	const bfd = new BeilageFileDef
	// 	bfd.file = file
	// 	bfd.fileName = file.name
	// 	const wrapper = new BeilageWrapper();
	// 	return await wrapper.showDialog(bfd);
	// }

	editBeilage() {
		if (this.beilage?.dso && this.beilage?.dokumentDef) {
			const bfd = new BeilageFileDef
			bfd.beilageGuid = this.beilage.dso.guid
			bfd.fileName = this.beilage.dso.originalName
			bfd.oldfileName = this.beilage.dso.originalName
			bfd.dokumentDefGuid = this.beilage.dokumentDef.guid
			bfd.oldDokumentDefGuid = this.beilage.dokumentDef.guid

			// this.showDialog(bfd);
		}
	}

	viewBeilage() {
		if (this.beilage?.dso && this.beilage?.dokumentDef) {
			const bfd = new BeilageFileDef
			bfd.beilageGuid = this.beilage.dso.guid
			bfd.fileName = this.beilage.dso.originalName
			bfd.oldfileName = this.beilage.dso.originalName
			bfd.dokumentDefGuid = this.beilage.dokumentDef.guid
			bfd.oldDokumentDefGuid = this.beilage.dokumentDef.guid
			bfd.readonly = true
			// this.showDialog(bfd);
		}
	}

}

export class BeilageFileDef {
	public beilageGuid: string;
	public file: File;
	public fileName: string;
	public dokumentDefGuid: string;
	public oldfileName: string;
	public oldDokumentDefGuid: string;
	public okClicked: boolean;
	public readonly: boolean;
	isValid(): boolean {
		return !!this.file && !!this.dokumentDefGuid;
	}
	hasChanged(): boolean {
		if (!this.file) return true;
		if (this.fileName !== this.oldfileName) {
			this.file = new File([this.file], this.fileName, {
				type: this.file.type,
				lastModified: this.file.lastModified,
			});
		}
		return (this.fileName !== this.oldfileName || this.dokumentDefGuid !== this.oldDokumentDefGuid);
	}
}


export const getEmpfaengerLabel = (empfaenger: EmpfaengerDTO): string => {
	let vals: string[] = []
	if (empfaenger.stichwort) vals.push(empfaenger.stichwort)
	if (empfaenger.ort) vals.push(empfaenger.ort)
	return vals.join(', ')
}

export const getAdressLabel = (adresse: AdresseDTO): string => {
	let vals: string[] = []
	if (adresse.firma1) vals.push(adresse.firma1)
	if (adresse.firma2) vals.push(adresse.firma2)
	if (adresse.name) {
		if (vals.length > 0) {
			vals.push(', ')
		}
		vals.push(adresse.name)
	}
	if (adresse.vorname) vals.push(adresse.vorname)
	if (adresse.plz) vals.push(', ' + adresse.plz)
	if (adresse.ort) vals.push(adresse.ort)
	return vals.join(' ')
}

export const getAnlageLabel = (anlage: EAnlageDTO): string => {
	if (!anlage) {
		return ''
	}
	let vals: string[] = []
	if (anlage.gebaeudeTeil) vals.push(anlage.gebaeudeTeil)
	if (anlage.zaehlerNr1) vals.push(anlage.zaehlerNr1)
	if (anlage.zaehlerNr2) vals.push(anlage.zaehlerNr2)
	return vals.join(', ')
}


export const getDateiNamePrint = (originalName: string): string => {
	if (!originalName) return ''
	const arr = originalName.split('.')
	let dateiname: string = ''
	let extension: string = ''
	let res: string = ''
	if (arr.length > 0) {
		extension = arr.pop()
		dateiname = arr.join('.')
		res = `${dateiname} (${extension})`
	} else {
		res = originalName
	}
	return res
}

export const getFormularTypBeilagenDefs = (dokumentDef: DokumentDef, projekt: EProjektDTO, dokument: DokumentDTO, projektService: ProjektService): BeilageWrapper[] => {
	const res: BeilageWrapper[] = [];
	const projektPool: DokumentDTO[] = projekt.auftrag?.dokumente?.filter(b => Guid.equals(b?.dokumentDef?.guid, dokumentDef.guid));
	const dokumentBeilagen: DokumentDTO[] = dokument?.beilagen?.filter(b => Guid.equals(b?.dokumentDef?.guid, dokumentDef.guid));

	if (dokumentBeilagen) {
		dokumentBeilagen.forEach(fp => {
			const beilageDef: BeilageWrapper = new BeilageWrapper();
			beilageDef.dokumentDef = dokumentDef;
			beilageDef.beilage = fp;
			beilageDef.isAttached = true;
			beilageDef.dokument = dokument;
			res.push(beilageDef);
		})
	}
	if (projektPool) {
		projektPool.forEach(p => {
			const vorhanden = res.find(r => Guid.equals(r.beilage.guid, p.guid));
			if (!vorhanden) {
				const beilageDef: BeilageWrapper = new BeilageWrapper();
				beilageDef.dokumentDef = dokumentDef;
				beilageDef.beilage = p;
				beilageDef.isAttached = false;
				beilageDef.dokument = dokument;
				res.push(beilageDef);
			}
		})
	}
	// Nur leere Vorgabe hinzufügen wenn keine gefunden und muss ist
	if (res.length === 0) {
		const beilageDef: BeilageWrapper = new BeilageWrapper();
		beilageDef.dokumentDef = dokumentDef;
		res.push(beilageDef);
	}

	return res;

}
export const getWeitereBeilagenDefs = (projektService: ProjektService, dokument: DokumentDTO, beilageDefs: BeilageWrapper[]): BeilageWrapper[] => {
	const res: BeilageWrapper[] = [];

	const dok: DokumentDTO = dokument;
	if (dok) {
		const weitereBeilagen = dok.beilagen?.filter(b => !beilageDefs.find(r => Guid.equals(r.beilage?.guid, b.guid)) && !Guid.equals(b.dokumentDef.guid, dok.dokumentDef.guid));
		// const attachments = dok.beilagen.filter(b=> Guid.equals(b.dokumentDef.guid, guid_attachment));
		weitereBeilagen?.forEach(wb => {
			const bd = new BeilageWrapper();
			bd.dokumentDef = { guid: wb.dokumentDef.guid, titel: wb.dokumentDef.longName };
			bd.beilage = wb;
			bd.isAttached = true;
			bd.dokument = dok;

			res.push(bd);
		});
	}

	return res;
}

/**
 * Dieser Aufzählungstyp definiert Konstanten für die jeweiligen Systemumgebungen.
 */
 export enum System
 {
	 /**
	  * Entwicklungsumgebung Debug/Develop.
	  *
	  * https://localhost:44301
	  */
	 Debug,

	 /**
	  * Internes Testsystem.
	  *
	  * https://next-gen-app.srv-test01.brunnerinfo.local
	  */
	 Test,

	 /**
	  * Integrationssystem.
	  *
	  * https://int-webapp.elektroform.ch
	  */
	 Integration,

	 /**
	  * Produktivsystem.
	  *
	  * https://solar.elektroform.ch
	  */
	 Produktion
 }

@Injectable({
	providedIn: 'root'
})
export class ProjektService
{
	//#region Private Felder.

	/**
	 * Diese Variable speichert das Promise, welches die ermittelte Systemumgebung zurück gibt.
	 */
	private readonly _system$ : Promise<System>;

	private _showBreadcrumb: boolean = true;

	//#endregion

	breakPoint_FullHD: number = 1920;
	navbarItems$: BehaviorSubject<INavbarItem[]> = new BehaviorSubject([]);
	NavbarExpanded: boolean = false;
	NotificationbarExpanded: boolean = false;

	CurAuftragDef: AuftragsDefDTO = null;

	private _curProjekt: EProjektDTO = null;
	public get CurProjekt(): EProjektDTO {
		// return this._curProjekt;
		return fakeProjekt as EProjektDTO

	}
	// public set CurProjekt(projekt: EProjektDTO) {
	// 	// try
	// 	// {
	// 	// 	throw new TypeError("Debugging reasons!");
	// 	// }
	// 	// catch(e)
	// 	// {
	// 	// 	console.log("Setting ProjekteService::CurProjekt", projekt, e);
	// 	// }

	// 	this._curProjekt = projekt;
	// }
	private _curGeschStelle: GeschStelleDTO = null
	public async CurGeschStelle(): Promise<GeschStelleDTO> {
		if (!this._curGeschStelle) {
			this._curGeschStelle = await this.GetCurrentGeschStelle();
		}
		return this._curGeschStelle
	}

	private _curMitarbeiter: MitarbeiterDTO = null
	public async CurMitarbeiter(): Promise<MitarbeiterDTO> {
		if (!this._curMitarbeiter) {
			this._curMitarbeiter = await this.GetCurrentMitarbeiter();
		}
		return this._curMitarbeiter
	}

	private _curDokument: DokumentDTO = null;
	public get CurDokument(): DokumentDTO {
		return this._curDokument;
	}
	public set CurDokument(dokument: DokumentDTO) {
		// try
		// {
		// 	throw new TypeError("Debugging reasons!");
		// }
		// catch(e)
		// {
		// 	console.log("Setting ProjekteService::CurDokument", dokument, e);
		// }

		this._curDokument = dokument;
	}

	// CurBeilageFileDef: BeilageFileDef = null
	BreadCrumbData: BreadCrumbItem[] = []
	BreadCrumbInSearch: boolean = false
	Identities: IdentityContextDTO[] = []
	CurIdentity: IdentityContextDTO = null
	permissionSetDTO: PermissionSetDTO = null
	SearchData: ISearchData = {}
	Emitter = new EventEmitter.EventEmitter();

	constructor(
		// private readonly _logger: NGXLogger,
		private mitarbeiterService: MitarbeiterService,
		// private _authenticationService: AuthenticationService,
		// private authorizationService: AuthorizationService,
		private projekteService: EProjekteService,
		private aktionenService: EAktionenService,
		private dsoService: DsoService,
		private dokumenteService: DokumenteService,
		private geschStellenService: GeschStellenService,
		private adressenService: AdressenService,
		private gebaeudeService: GebaeudeService,
		private plzService: PostleitzahlenService,
		private empfaengerService: EmpfaengerService,
		private auftraegeService: EAuftraegeService,
		private appSettingsService: AppSettingsService,
		private produktLizenzenService: ProduktLizenzenService,
		private kompoDBApiService: KompoDBApiService,
		private definitionenService: DefinitionenService,
		private efOnlineApiService: EFOnlineApiService,
		private _translationService: TranslocoService,
		private http: HttpClient,
		private router: Router,
		private readonly _activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private _dialog: MatDialog,
	) {
		// Reagiere auf Ereignisse des Angular Router.
		this.router.events.subscribe(
			(event) => {
				// Es wird von der aktuellen Seite weg navigiert.
				if (event instanceof NavigationEnd) {
					// Entferne den Seitenhintergrund.
					this.setPageBackground(null);
				}
			}
		);

		// this.Emitter.setMaxListeners(0)

		ProjektService._instance = this;

		// Initialisiere das Promise zum Abfragen der Systemumgebung.
		this._system$ = this.getSystemPromise();

		// Wir sind fertig, verlasse die Konstruktor-Funktion.
		return;
	}

	public get dialog(): MatDialog{
		return this._dialog;
	}

	private getSystemPromise(): Promise<System>
	{
		return this.appSettingsService.apiV1AppSettingsSystemGet().pipe(
			catchError(
				error => {
					// this._logger.error(
					// 	"An error occurred while determining the system, assuming productive!",
					// 	error
					// );

					return of('Produktion');
				}
			),
			map(
				s =>
				{
					let system: System;

					switch(s)
					{
						default:
						case 'Debug':
							system = System.Debug;
							break;

						case 'Test':
							system = System.Test;
							break;

						case 'Integration':
							system = System.Integration;
							break;

						case 'Produktion':
							system = System.Produktion;
							break;
					}

					// this._logger.trace(
					// 	"Next-Gen App System queried from server.",
					// 	{
					// 		configuration: s,
					// 		system: `${system}: ${System[system]}`
					// 	}
					// );

					return system;
				}
			),
			shareReplay(1)
		)
		.toPromise();
	}

	/**
	 * Ruft ein Promise ab mit welchem die aktuelle Systemumgebung ermittelt werden kann.
	 */
	public get system(): Promise<System>
	{
		return this._system$;
	}

	private static _instance: ProjektService;
	public static get instance() {
		return ProjektService._instance;
	}

	public get Router() { return this.router; }

	// public Load_Identity_Berechtigungen(): Promise<string> {
	// 	return new Promise((resolve, reject) => {
	// 		var navItems: INavbarItem[] = [StartseiteItem, ProjekteItem]
	// 		this.navbarItems$.next(navItems);
	// 		this.LoadIdentityContext()
	// 			.then(s => this.LoadBerechtigungenSet())
	// 			.then(s => this.IsHoldingAdmin())
	// 			.then(h => {
	// 				if (h === true) {
	// 					navItems.push(GeschStellenItem);
	// 					navItems.push(ProduktLizenzenItem);
	// 					this.navbarItems$.next(navItems);
	// 				}
	// 				resolve('')
	// 			})
	// 			.catch(error => {
	// 				reject(error)
	// 			})
	// 	});
	// }


	// public IsBIAdmin(): Promise<boolean> {
	// 	return this.authorizationService.isBiAdministrator();
	// }

	// public IsHoldingAdmin(): Promise<boolean> {
	// 	return this.authorizationService.isHoldingAdministrator();
	// }

	// public LoadBerechtigungenSet(): Promise<string> {
	// 	return this.authorizationService.getGlobalIdentityPermissionsSet().toPromise()
	// 		.then(t => '')
	// 		.catch(error => {
	// 			const err = 'No roles for user defined'
	// 			console.error(err, error)
	// 			this.permissionSetDTO = undefined
	// 			return err
	// 		});
	// }

	// private LoadIdentityContext(): Promise<string> {
	// 	return new Promise((resolve, reject) => {
	// 		if (this.CurIdentity && this.Identities) {
	// 			resolve('')
	// 			return
	// 		}
	// 		this.mitarbeiterService.apiV1MitarbeiterApiV1MitarbeiterIdentityGet().pipe(catchError(e => {
	// 			const error = 'Fehler bei Abfrage des Identity Contexts'
	// 			console.error(error)
	// 			reject(error)
	// 			return throwError(e);
	// 		})).subscribe(
	// 			(data) => {
	// 				data = data ?? [];
	// 				this.Identities = data;
	// 				if (data.length === 1) {
	// 					this.SwitchIdentityContext(data[0])
	// 					resolve('')
	// 				} else if (data.length > 1) {
	// 					resolve('')
	// 				} else {
	// 					const error = 'Identity Context: Keine Identitäten gefunden!'
	// 					console.error(error)
	// 					reject(error)
	// 				}
	// 			})
	// 	}
	// 	)
	// }

	// SwitchIdentityContext(identity: IdentityContextDTO) {
	// 	this.permissionSetDTO = undefined
	// 	this.CurIdentity = identity
	// 	this.authorizationService.purgePermissionsSetCache()
	// 	this.authorizationService.switchContext(identity.mandant, identity.holding, identity.geschaeftsstelle, identity.mitarbeiter)
	// }

	registerReloadProjekt(fn: any) {
		this.Emitter.on('reloadProjekt', fn)
	}

	unRegisterReloadProjekt(fn: any) {
		this.Emitter.removeListener('reloadProjekt', fn)
	}

	emitReloadProjekt() {
		this.Emitter.emit('reloadProjekt')
	}

	registerLinkBeilage(fn: (linkDTO: DokumentBeilageLinkDTO, insert: boolean) => void) {
		this.Emitter.on('linkBeilage', fn)
	}

	unRegisterLinkBeilage(fn: (linkDTO: DokumentBeilageLinkDTO, insert: boolean) => void) {
		this.Emitter.removeListener('linkBeilage', fn)
	}

	emitLinkBeilage(beilageDTO: DokumentBeilageLinkDTO, insert: boolean) {
		this.Emitter.emit('linkBeilage', beilageDTO, insert);
	}

	registerReloadFormular(fn: any) {
		this.Emitter.on('reloadFormular', fn)
	}

	unRegisterReloadFormular(fn: any) {
		this.Emitter.removeListener('reloadFormular', fn)
	}

	emitReloadFormular() {
		this.Emitter.removeAllListeners('linkBeilage');
		this.Emitter.emit('reloadFormular');
	}

	registerFormularReloaded(fn: any) {
		this.Emitter.on('formularReloaded', fn)
	}

	unRegisterFormularReloaded(fn: any) {
		this.Emitter.removeListener('formularReloaded', fn)
	}

	emitFormularReloaded() {
		this.Emitter.emit('formularReloaded')
	}


	registerExpandPhase(fn: (projektPhase: ProjektPhaseWrapper) => void) {
		this.Emitter.on('expandPhase', fn)
	}

	unRegisterExpandPhase(fn: (projektPhase: ProjektPhaseWrapper) => void) {
		this.Emitter.removeListener('expandPhase', fn)
	}

	emitReloadExpandPhase(projektPhase: ProjektPhaseWrapper) {
		this.Emitter.emit('expandPhase', projektPhase)
	}

	registerFormularStatusChange(fn: (status: DokumentStatus) => void) {
		this.Emitter.on('formularStatusChange', fn)
	}

	unRegisterFormularStatusChange(fn: (status: DokumentStatus) => void) {
		this.Emitter.removeListener('formularStatusChange', fn)
	}

	emitFormularStatusChange(status: DokumentStatus) {
		this.Emitter.emit('formularStatusChange', status)
	}




	onResize() {
		this.NavbarExpanded = window.innerWidth >= this.breakPoint_FullHD;
	}

	showNotification() {
		this.NotificationbarExpanded = !this.NotificationbarExpanded
	}

	getProjektTitel(projekt: EProjektDTO): string {
		if (!projekt || !projekt.gebaeude) return ''
		const g = projekt.gebaeude
		let res = ''
		if (g.strasse || g.hausNr) {
			res = `${g.strasse}${g.hausNr ? ' ' + g.hausNr : ''}`
			if (g.postOrt) {
				res = `${res}, ${g.postOrt}`
			}
		}
		if (!res && g.postOrt) {
			res = `${g.postOrt}`
		}

		return res
	}

	computePhasenFortschritt(phase: EAuftragPhaseDTO): number {
		let total = 0
		let percent = 0

		phase.leistungen.forEach(l => {
			l.aktionen.forEach(a => {
				total++
				const p = a.dokument ? a.dokument.fortschritt : 0
				percent += p
			});
		})

		if (total === 0) return 0
		const res = Math.round(percent / total)
		return res
	}

	private isMainUrl(): boolean {
		const url = this.router.url
		return (url === OriginUrl.dashboard || url === OriginUrl.geschaeftsstellen || url === OriginUrl.projects || url === OriginUrl.verwaltung)
	}

	isSearchUrl(): boolean {
		const url = this.router.url
		return url.indexOf(OriginUrl.search) === 0
	}


	fillBreadCrumb(items: BreadCrumbItem[]) {
		if (this.isMainUrl()) {
			this.BreadCrumbInSearch = false
		} else if (isRoute(OriginUrl.search, this.router.url)) {
			this.BreadCrumbInSearch = true
		}

		let startItems: BreadCrumbItem[] = []

		// das zweite BreadCrumb Item mit such-item ersetzen / erg�nzen falls in einer Suche war
		// if (this.BreadCrumbInSearch && this.SearchData.searchText) {
		// 	const searchText = this.SearchData.searchText.split(' ').filter(s => s !== ' ' && s !== '').map(s => '"' + s + '"').join(' und ')
		// 	startItems.push({ titel: `Suche nach ${searchText}`, url: '/search', queryParams: { search: this.SearchData.searchText, originurl: this.SearchData.originUrl } })
		// 	if (items.length === 1) {
		// 		startItems.push(items[0])
		// 	} else if (items.length === 2) {
		// 		startItems.push(items[1])
		// 	}
		// } else {
		// 	startItems.push(...items)
		// }
		this.BreadCrumbData = startItems
		// if (this.BreadCrumbData.length === 0) {
		// 	this.BreadCrumbData = [{ titel: 'Startseite', url: '/dashboard' }]
		// }
	}


	// CurIdentityBenutzerName(): string {
	// 	if (this.CurIdentity) {
	// 		return `${this.CurIdentity.mitarbeiterVorname} ${this.CurIdentity.mitarbeiterNachname}`
	// 	} else {
	// 		return this._authenticationService.userName;
	// 	}
	// }

	/**
	 * Diese Methode setzt den Seiten-Hintergrund auf die angegebene Bild-URL.
	 *
	 * @param imageUrl
	 * 	Die URL des Hintegrundbildes.
	 */
	public setPageBackground(imageUrl: string): void {
		// Diese Konstante speichert den Namen der CSS Variable, mittels welcher das Hintergrundbild der Seite
		// spezifiziert werden kann.
		const cssProperty: string = '--app-layout-background-image';

		// Wurde eine Bild-URL spezifiziert?
		if (imageUrl && imageUrl.length > 0) {
			// Ja, also setzte die spezifizierte URL in der entsprechenden CSS Variable.
			document.documentElement.style.setProperty(cssProperty, `url('${imageUrl}')`);
		}
		else {
			// Nein, also lösche das aktuelle Hintergrundbild.
			document.documentElement.style.setProperty(cssProperty, 'none');
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Eigenschaft ruft einen Indikator ab, welcher anzeigt ob der Breadcrumb angezeigt werden soll oder nicht.
	 */
	public get showBreadcrumb(): boolean {
		// Gib den intern gespeicherten Indikator zurück.
		return this._showBreadcrumb;
	}

	/**
	 * Diese Eigenschaft setzt den Indikator zum Anzeigen der Breadcrumb oder löscht diesen.
	 *
	 * @param {boolean} show
	 * 	`true` zum Anzeigen der Breadcrumb, ansonsten `false`.
	 *
	 * @default true
	 */
	public set showBreadcrumb(show: boolean) {
		// Speichere den neuen Indikatorwert intern.
		this._showBreadcrumb = show;

		// Und kehre nun zurück.
		return;
	}

	/**
	 * Diese Funktion gibt den Type der Komponente zurück, welche anhand der aktuellen Route aktiviert wurde. Optional
	 * kann vorausgesetzt werden, dass die Route durch eine der Layout-Komponenten aktiviert wurde.
	 *
	 * @param layout
	 * 	`true` um die Aktivierung der Route über eine Layout Komponente vorauszusetzen, ansonsten `false`.
	 *
	 * @return
	 * 	Der Typnamen der aktivierten Komponente oder der `null`-Wert wenn keine Komponente aktiviert wurde.
	 */
	public getRouteComponentName(layout: boolean = true): string {
		// Stelle sicher, dass eine Komponentenroute aktiviert wurde.
		if (this._activatedRoute?.children.length != 1) {
			// Es wurde keine Komponentenroute aktiviert, gib deshalb den `null` Wert zurück.
			return null;
		}

		// Speichere nun die aktivierte Route in einer lokalen Variable.
		let activatedRoute: ActivatedRoute = this._activatedRoute.firstChild;

		// Prüfe ob die Aktivierung einer Komponentenroute via Layout-Komponente vorausgesetzt wird.
		if (true == layout) {
			// Ja, also speichere den Typ der ersten aktivierten Komponente in einer lokalen Variable.
			let component: string | Type<any> = activatedRoute.component;

			// Wurde ein Komponententyp abgerufen?
			if (typeof (component) !== 'string') {
				// Ja, also rufe dessen Klassennamen ab und speichere diesen stattdessen.
				component = component.name;
			}

			// Stelle nun sicher, dass die Route entweder über die Bare-Layout Komponente oder die App-Layout Komponente
			// aktiviert wurde.
			if (
				component != 'AppLayoutComponent' &&
				component != 'BareLayoutComponent'
			) {
				// Die Route wurde nicht über eine der Layout-Komponenten aktiviert, gib deshalb den `null` Wert zurück.
				return null;
			}
		}

		// Iteriere nun über alle weitere aktivierte Sub-Routen.
		do {
			// Ist dies aktuell iterierte Route die letzte aktivierte Komponentenroute?
			if (activatedRoute.children.length == 0) {
				// Ja, also speichere die Komponente in einer lokalen Variable.
				let component: string | Type<any> = activatedRoute.component;

				// Wurde ein Komponententyp abgerufen?
				if (typeof (component) !== 'string') {
					// Ja, also rufe dessen Klassennamen ab und speichere diesen stattdessen.
					component = component.name;
				}

				// Gib nun den Komponentennamen zurück.
				return <string>component;
			}
			// Nein, aktiviert die aktuell iterierte Route mehr als eine weitere Komponente?
			else if (activatedRoute.children.length > 1) {
				// Ja, also können wir keine Komponente eindeutig bestimmen. Gib deshalb den `null` Wert zurück.
				return null;
			}

			// Die aktuell iterierte Route aktiviert genau eine weitere Komponentenroute, iteriere über diese als
			// nächstes.
			activatedRoute = activatedRoute.firstChild;
		}
		// Iteriere solang wir eine aktivierte Route haben.
		while (activatedRoute);

		// Wir konnten keine eindeutig aktivierte Komponente ermitteln, gib deshalb den `null` Wert zurück.
		return null;
	}

	public get activeNavItem(): INavbarItem {
		// Ermittle die Komponente der aktivierten Route.
		switch (this.getRouteComponentName()) {
			case 'DashboardComponent':
				return StartseiteItem;

			case 'ProjectsComponent':
				return ProjekteItem;

			case 'GeschaeftsstellenComponent':
				return GeschStellenItem;

			case 'ProduktlizenzenComponent':
				return ProduktLizenzenItem;

			default:
				return null;
		}
	}

	// public async LoadProjekt(guidauftrag: string) {
	// 	this.CurProjekt = null
	// 	this.CurAuftragDef = null

	// 	const projekt = await this.projekteService.apiV1EProjekteGuidGet(guidauftrag).pipe(
	// 		catchError((error) => {
	// 			console.error('Fehler beim Laden des Projekts', error);
	// 			return throwError(error);
	// 		}),
	// 	).toPromise()
	// 	this.CurProjekt = projekt
	// 	console.log('Projekt', projekt)

	// 	const auftragdef = await this.GetAuftragsDef(projekt.auftrag.guiD_AuftragDef)
	// 	this.CurAuftragDef = auftragdef
	// 	console.log('AuftragDef', auftragdef)
	// }

	public async SaveAuftrag(auftrag: EAuftragDTO): Promise<EAuftragDTO> {
		return this.auftraegeService.apiV1EAuftraegePut(auftrag).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Updateen des Auftrages', e);
				return throwError(e);
			})).toPromise() as Promise<EAuftragDTO>
	}

	public LoadAktion(aktion_guid: string): Promise<EAktionDTO> {
		return this.aktionenService.apiV1EAktionenGuidGet(aktion_guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Aktion', e);
				return throwError(e);
			})).toPromise() as Promise<EAktionDTO>
	}

	public SaveAktion(aktion: EAktionDTO): Promise<EAktionDTO> {
		return this.aktionenService.apiV1EAktionenPost(aktion).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Einfügen der Aktion')
				return throwError(e);
			})).toPromise() as Promise<EAktionDTO>
	}

	public GetCurLeistung(): ELeistungDTO {
		if (!this.CurDokument || !this.CurProjekt) return null
		let leistung: ELeistungDTO = null
		this.CurProjekt.auftrag?.phasen?.forEach(p => p.leistungen?.forEach(l => l.aktionen?.forEach(a => {
			if (a.dokument?.guid === this.CurDokument.guid) {
				leistung = l
			}
		})))
		return leistung
	}

	public GetCurAktion(): EAktionDTO {
		if (!this.CurDokument || !this.CurProjekt) return null
		let aktion: EAktionDTO = null
		this.CurProjekt.auftrag?.phasen?.forEach(p => p.leistungen?.forEach(l => l.aktionen?.forEach(a => {
			if (Guid.equals(a.dokument?.guid, this.CurDokument.guid)) {
				aktion = a
			}
		})))
		return aktion
	}

	public GetCurAktion_Guid(): string {
		const aktion: EAktionDTO = this.GetCurAktion()
		if (aktion) {
			return aktion.guid
		} else {
			return null
		}
	}



	public LoadFormular(guid: string, notSetCurFormular?: boolean): Promise<DokumentDTO> {
		return this.dokumenteService.apiV1DokumenteGuidGet(guid)
			.pipe(
				catchError(e => {
					console.error('Fehler beim Laden des Dokuments', e);
					return throwError(e);
				}),
			).toPromise();
	}

	public async SaveFormular(guid: string, dokumentDefGuid: string): Promise<DokumentDTO> {
		// Neues dokument definieren, dazu das passende Schema suchen
		// const schema = Object.values(schemas).find(s => typeof s === 'object' && Guid.equals(s['guid'], dokumentDefGuid)) as ISchema;
		let dto: DokumentDTO = {
			mandant: this.CurIdentity.mandant,
			guid: guid ?? Guid.create().toString(),
			dokumentDef: {
				guid: dokumentDefGuid,
			},
			// dso: {
			// 	guid: Guid.create().toString(),
			// },
		}
		dto = await this.dokumenteService.apiV1DokumentePost(dto)
			.pipe(
				catchError(e => {
					console.error('Fehler beim Speichern des Dokuments', e);
					return throwError(e);
				}),
			).toPromise();

		return dto;
	}

	public async SaveDokument(dto: DokumentDTO): Promise<DokumentDTO> {
		dto = await this.dokumenteService.apiV1DokumentePost(dto)
			.pipe(
				catchError(e => {
					console.error('Fehler beim Speichern des Dokuments', e);
					return throwError(e);
				}),
			).toPromise();
		return dto;
	}

	public async DownloadFormular(dokument: DokumentDTO, pdfFileName?: string) {
		this.dokumenteService.apiV1DokumentePrintPost(dokument)
			.toPromise()
			.then((value) => {
				const file = window.URL.createObjectURL(value);

				var downloadLink = document.createElement("a");
				downloadLink.href = file;

				if (!pdfFileName)
					pdfFileName = dokument.dso?.originalName;

				if (!pdfFileName)
					pdfFileName = this.getProjektTitel(this.CurProjekt).trim() + ', ' + dokument.dokumentDef?.shortName + '.pdf';

				downloadLink.download = pdfFileName;

				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			})
			.catch((error) => {
				console.error('ERROR while printing formular!', error);
			});
	}

	public LoadPDF(guid: string): Promise<Blob> {
		return this.dsoService.apiV1DsoGuidGet(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Laden des Datei-Dokuments', e);
				return throwError(e);
			})).toPromise() as Promise<Blob>
	}

	public SavePDF(guid: string, file: File): Promise<any> {
		const extension = file.name.split('.').pop();
		let dokumentTypGuid = ''
		if (extension === 'pdf') {
			dokumentTypGuid = DokumentTypGuids.pdf
		} else if (extension === 'jpg' || extension === 'jpeg') {
			dokumentTypGuid = DokumentTypGuids.jpg
		} else if (extension === 'png') {
			dokumentTypGuid = DokumentTypGuids.png
		} else if (extension === 'svg') {
			dokumentTypGuid = DokumentTypGuids.svg
		}
		if (!dokumentTypGuid) {
			console.error(`Dokument-Typ ${extension} nicht unterstützt!`)
			return
		}

		return this.dsoService.apiV1DsoGuidPost(
			guid,
			file,
			dokumentTypGuid,
			true
		).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Speichern des Dokuments', e);
				return throwError(e);
			})).toPromise() as Promise<any>
	}



	// public async SavePDFBeilage(dokumentDTO: DokumentDTO, dokumentDefGuid: string, file: File): Promise<DokumentDTO> {
	// 	let beilageDTO = dokumentDTO.beilagen?.find(b => Guid.equals(b.dokumentDef.guid, dokumentDefGuid))
	// 	if (beilageDTO) {
	// 		if (!confirm(`Vorhandene Beilage "${beilageDTO.dso.originalName}" ersetzen ?`)) {
	// 			return
	// 		}
	// 	}
	// 	else{
	// 		// Neues dokument definieren, dazu das passende Schema suchen
	// 		const beilageSchema = Object.values(schemas).find(s => typeof s === 'object' && Guid.equals(s['guid'], dokumentDefGuid)) as ISchema;
	// 		let dto: DokumentDTO = {
	// 			mandant: dokumentDTO.mandant,
	// 			guid: Guid.create().toString(),
	// 			dokumentDef: {
	// 				guid: dokumentDefGuid,
	// 			},
	// 			dso: {
	// 				data: [
	// 					{
	// 						attribut: beilageSchema.attribut,
	// 						index: 0,
	// 					}
	// 				]
	// 			},
	// 		}
	// 		beilageDTO = dto;

	// 		// Beilage-Dokument erstellen
	// 		beilageDTO = await this.dokumenteService.apiV1DokumentePost(beilageDTO)
	// 		.pipe(
	// 			catchError(e => {
	// 					console.error('Fehler beim Speichern des Beilage-Dokuments', e);
	// 				return throwError(e);
	// 			}),
	// 		).toPromise();
	// 	}

	// 	// Das PDF effektiv hochladen
	// 	await this.dsoService.apiV1DsoGuidPost(beilageDTO.dso.guid, file, DokumentTypGuids.pdf)
	// 		.pipe(
	// 			catchError(e => {
	// 				console.error('Fehler beim Speichern des PDF', e);
	// 				return throwError(e);
	// 			}),
	// 		).toPromise();

	// 	// // Den Verknüpfungsdatensatz anlegen
	// 	// const linkDto: DokumentBeilageLinkDTO = {
	// 	// 	mandant: dokumentDTO.mandant,
	// 	// 	guidDokument: dokumentDTO.guid,
	// 	// 	guidBeilage: beilageDTO.guid
	// 	// }
	// 	// await this.LinkDokumentBeilage(linkDto);
	// 	// return linkDto;
	// }

	// public DeletePDFAttachment(guid: string): Promise<any> {
	// 	return this.dokumenteService.apiV1DokumenteAttachmentsGuidDelete(
	// 		guid
	// 	).pipe(map(
	// 		(data) => {
	// 			return data;
	// 		}),
	// 		catchError(e => {
	// 			console.error('Fehler beim Löschen des Attachments', e);
	// 			return throwError(e);
	// 		})).toPromise() as Promise<any>
	// }



	async SavePDF_as_Formular(file: File, dokumentGuid: string, aktionGuid: string, formularTypGuid: string): Promise<any> {
		let dokument: DokumentDTO
		if (dokumentGuid) {
			dokument = await this.LoadFormular(dokumentGuid)
		} else {
			dokument = await this.SaveFormular(null, formularTypGuid)
			const aktion = await this.LoadAktion(aktionGuid)
			aktion.dokument = dokument
			await this.SaveAktion(aktion)
		}
		if (dokument.dso.originalName) {
			if (!confirm(`Vorhandenes Dokument "${dokument.dso.originalName}" ersetzen ?`)) {
				return
			}

		}

		await this.SavePDF(dokument.dso.guid, file)
	}

	// async SavePDF_as_Beilage(file: File, auftragsGuid: string, dokumentGuid: string, formularTypGuid: string): Promise<any> {
	// 	if (dokumentGuid) {
	// 		let formular = await this.LoadFormular(dokumentGuid)
	// 		const doc = await this.SavePDFAttachment(formular, formularTypGuid);
	// 		await this.SavePDF(doc.dokument.guid, file);

	// 		const dokumentPool: EAuftragDokumentPoolDTO = {
	// 			guidAuftrag: auftragsGuid,
	// 			guidBeilage: doc.guid
	// 		}
	// 		await this.Save_Dokument_Pool(dokumentPool)

	// 		const dokumentBeilagen: DokumentBeilageLinkDTO = {
	// 			guidFormular: formular.guid,
	// 			guidFormularBeilagen: doc.guid
	// 		}

	// 		let result = await this.Insert_Remove_FormularDokumentPool(true, dokumentBeilagen);
	// 		// Formular noch mal vom Server laden, damit die Beilagen nun wirklich komplett sind
	// 		formular = await this.LoadFormular(dokumentGuid);
	// 		const beilage = formular.dokumentBeilagen.find(fdp=>fdp.formularBeilage.guid == doc.guid);
	// 		return beilage;
	// 	}
	// }

	get_PoolBeilage_FromTyp(projekt: EProjektDTO, guidBeilageTyp: string): string | null {
		if (projekt && projekt.auftrag && projekt.auftrag.dokumente) {
			const poolbeilage = projekt.auftrag.dokumente.find(d => {
				if (d.dokumentDef) {
					return asGuid(d.dokumentDef.guid) === asGuid(guidBeilageTyp)
				}
			})
			if (poolbeilage) {
				return poolbeilage.guid
			}
		}
		return null
	}


	async LinkDokumentBeilage(beilageLinkDTO: DokumentBeilageLinkDTO): Promise<DokumentBeilageLinkDTO> {
		await this.dokumenteService.apiV1DokumenteAttachmentsPost(beilageLinkDTO)
			.pipe(
				catchError(e => {
					console.error('Fehler beim Einfügen der Verknüpfung', e);
					return throwError(e);
				}),
			).toPromise();

		this.emitLinkBeilage(beilageLinkDTO, true);
		return beilageLinkDTO;
	}

	async UnlinkDokumentBeilage(dto: DokumentBeilageLinkDTO): Promise<DokumentBeilageLinkDTO> {
		await this.dokumenteService.apiV1DokumenteAttachmentsDelete(dto.mandant, dto.guidDokument, dto.guidBeilage).pipe(
			catchError(e => {
				console.error('Fehler beim Entfernen der Verknüpfung', e);
				return throwError(e);
			}),
		).toPromise();

		this.emitLinkBeilage(dto, false);
		return dto;
	}

	// Insert_Remove_FormularDokumentPool_1(insert: boolean, dokumentBeilagen: DokumentBeilageLinkDTO): Promise<DokumentBeilageLinkDTO> {
	// 	if (insert) {
	// 		return this.dokumenteService.apiV1DokumenteAttachmentsPost(dokumentBeilagen).pipe(map(
	// 			(data) => {
	// 				return data;
	// 			}),
	// 			catchError(e => {
	// 				console.error('Fehler beim Einfügen in den Formular-Dokumenten-Pool', e);
	// 				return throwError(e);
	// 			})).toPromise() as Promise<DokumentBeilageLinkDTO>
	// 	} else {
	// 		return this.auftraegeService.apiV1EAuftraegelinkDTODelete(dokumentBeilagen.guidFormular, dokumentBeilagen.guidFormularBeilagen).pipe(map(
	// 			(data) => {
	// 				return data;
	// 			}),
	// 			catchError(e => {
	// 				console.error('Fehler beim Entfernen aus dem Formular-Dokumenten-Pool', e);
	// 				return throwError(e);
	// 			})).toPromise() as Promise<DokumentBeilageLinkDTO>
	// 	}
	// }

	async SavePDF_as_PoolBeilage(auftrag: EAuftragDTO, file: File, guidFormularTyp: string, guidBeilage: string): Promise<DokumentDTO> {
		let beilage: DokumentDTO = {
			mandant: auftrag.mandant,
			guid: guidBeilage ? guidBeilage : Guid.create().toString(),
			dokumentDef: {
				guid: guidFormularTyp,
			},
		}

		beilage = await this.dokumenteService.apiV1DokumentePost(beilage).pipe(
			catchError((error) => {
				console.error('Fehler beim Speichern der Pool-Beilage', error);
				return throwError(error);
			}),
		).toPromise();

		if (!guidBeilage) {
			await this.SavePDF(beilage.dso.guid, file);
		}

		const dokumentPool: EAuftragDokumentPoolDTO = {
			mandant: auftrag.mandant,
			guidAuftrag: auftrag.guid,
			guidBeilage: beilage.guid
		}

		await this.Save_Dokument_Pool(dokumentPool);

		beilage = await this.LoadFormular(beilage.guid, true);

		return beilage;
	}
	// async SavePDF_as_PoolBeilage(auftrag: EAuftragDTO, file: File, guidFormularTyp: string, guidBeilage: string): Promise<any> {
	// 	const beilage: DokumentBeilageLinkDTO = {
	// 		mandant: auftrag.mandant,
	// 		guid: guidBeilage ? guidBeilage : null,
	// 		formularTyp: {
	// 			guid: guidFormularTyp,
	// 		},
	// 	}
	// 	let dokBeil : DokumentBeilageLinkDTO =  await (this.dokumenteService.apiV1DokumenteAttachmentsPost(beilage).pipe(
	// 		catchError((error)=>{
	// 			console.error('Fehler beim Speichern der Pool-Beilage', error);
	// 			return throwError(error);
	// 		}),
	// 	).toPromise() as Promise<DokumentBeilageLinkDTO>);

	// 	if (!guidBeilage) {
	// 		await this.SavePDF(dokBeil.dokument.guid, file)
	// 	}

	// 	beilage.guid = dokBeil.guid
	// 	beilage.dokument = dokBeil.dokument
	// 	const dokumentPool: EAuftragDokumentPoolDTO = {
	// 		mandant: auftrag.mandant,
	// 		guidAuftrag: auftrag.guid,
	// 		guidBeilage: dokBeil.guid
	// 	}

	// 	await this.Save_Dokument_Pool(dokumentPool);
	// }

	public Save_Dokument_Pool(dokumentPool: EAuftragDokumentPoolDTO): Promise<EAuftragDokumentPoolDTO> {
		return this.auftraegeService.apiV1EAuftraegeDokumentenpoolPost(dokumentPool).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Einfügen in den Dokumenten-Pool', e);
				return throwError(e);
			})).toPromise() as Promise<EAuftragDokumentPoolDTO>

	}

	public Delete_Dokument_Pool_Beilage(beilage_guid: string, projekt: EProjektDTO): Promise<EAuftragDokumentPoolDTO> {
		return this.auftraegeService.apiV1EAuftraegeDokumentenpoolBeilageGuidDelete(beilage_guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				const linked = projekt.auftrag.dokumente.filter(b => b.guid === beilage_guid)
				if (linked.length > 0) {
					const msg = translate(marker('comp_project_detail.msg_linked'))
					alert(msg)
					return
				}
				console.error('Fehler beim Löschen aus dem Dokumenten-Pool', e);
				return throwError(e);
			})).toPromise() as Promise<EAuftragDokumentPoolDTO>

	}


	private GetCurrentMitarbeiter(): Promise<MitarbeiterDTO> {
		// return this.mitarbeiterService.apiV1MitarbeiterQueryGet(this.CurIdentity.mandant, this.CurIdentity.mitarbeiter).pipe(map(
		// 	(data) => {
		// 		return data;
		// 	}),
		// 	catchError(e => {
		// 		console.error('Fehler beim Abfragen des Mitarbeiters', e);
		// 		return throwError(e);
		// 	})).toPromise() as Promise<MitarbeiterDTO>
		return new Promise(r => r(mitarbeiter as MitarbeiterDTO))
	}

	public GetMitarbeiter(maGuid: string): Promise<MitarbeiterDTO> {
		return this.mitarbeiterService.apiV1MitarbeiterQueryGet(this.CurIdentity.mandant, maGuid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen des Mitarbeiters', e);
				return throwError(e);
			})).toPromise() as Promise<MitarbeiterDTO>
	}

	private GetCurrentGeschStelle(): Promise<GeschStelleDTO> {

		// return this.geschStellenService.apiV1GeschStellenGuidGet(this.CurIdentity.geschaeftsstelle).pipe(map(
		// 	(data) => {
		// 		return data;
		// 	}),
		// 	catchError(e => {
		// 		console.error('Fehler beim Abfragen des Mitarbeiters', e);
		// 		return throwError(e);
		// 	})).toPromise() as Promise<GeschStelleDTO>
		return new Promise(r => r(geschStelle as GeschStelleDTO))
	}

	public GetAdressse(guid: string): Promise<AdresseDTO> {
		// return this.adressenService.apiV1AdressenGuidGet(guid).pipe(map(
		// 	(data) => {
		// 		return data;
		// 	}),
		// 	catchError(e => {
		// 		console.error('Fehler beim Abfragen der Adresse', e);
		// 		return throwError(e);
		// 	})).toPromise() as Promise<AdresseDTO>

    	return new Promise(r => r(adressen[guid] as AdresseDTO))			
	}

	public ValidateFormular(receiver: string, dokument: DokumentDTO): Promise<DokumentDTO> {
		return this.dokumenteService.apiV1DokumenteValidatePost(receiver, dokument).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Validieren des Formulares', e);
				return throwError(e);
			})).toPromise() as Promise<DokumentDTO>
	}

	public SendFormular(receiver: string, dokument: DokumentDTO): Promise<DokumentDTO> {
		console.trace(receiver)
		console.trace(JSON.stringify(dokument))
		return this.dokumenteService.apiV1DokumenteSendPost(receiver, dokument).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Senden des Formulares', e);
				return throwError(e);
			})).toPromise() as Promise<DokumentDTO>
	}

	// public SaveFormularBeilage(beilage: DokumentBeilageLinkDTO): Promise<DokumentBeilageLinkDTO> {
	// 	return this.dokumenteService.apiV1DokumenteAttachmentsPost(beilage).pipe(map(
	// 		(data) => {
	// 			return data;
	// 		}),
	// 		catchError(e => {
	// 			console.error('Fehler beim Senden des Formulares', e);
	// 			return throwError(e);
	// 		})).toPromise() as Promise<DokumentBeilageLinkDTO>
	// }

	public SaveGrundbuchauszugBeilage(dokument: DokumentDTO, fileName: string, egrid: string, bfsNr: number, parcelNr: number, gebNr: number): Promise<DokumentDTO> {
		// assert(true, 'not implemented');
		// throwError('');
		return this.dokumenteService.apiV1DokumenteAttachmentsParcelPost(fileName, parcelNr, bfsNr, egrid, dokument).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Senden des Formulares', e);
				return throwError(e);
			})).toPromise() as Promise<DokumentDTO>
	}

	public SaveGeraete(gebaeude: GebaeudeDTO): Promise<void> {
		return this.gebaeudeService.apiV1GebaeudeGeraetePut(gebaeude).pipe(map(
			() => {
				return
			}),
			catchError(e => {
				console.error('Fehler beim Einfügen der Geräte')
				return throwError(e);
			})).toPromise() as Promise<void>
	}

	public DeleteGeraet(guid: string): Promise<void> {
		return this.efOnlineApiService.apiV1EfoProjectsDevicesGuidDelete(guid).pipe(map(
			() => {
				return
			}),
			catchError(e => {
				console.error('Fehler beim Löschen des Geräts')
				return throwError(e);
			})).toPromise() as Promise<void>
	}

	public GetEmpfaenger_pro_PLZ = (plz: string): Promise<EmpfaengerDTO[]> => {
		return this.empfaengerService.apiV1EmpfaengerPlzGet(plz).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Empfänger', e);
				return throwError(e);
			})).toPromise() as Promise<EmpfaengerDTO[]>
	}

	public GetEmpfaenger_pro_Kategorie = (kat: string): Promise<EmpfaengerDTO[]> => {
		return this.empfaengerService.apiV1EmpfaengerKategorieGet(kat).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Empfänger pro Kategorie', e);
				return throwError(e);
			})).toPromise() as Promise<EmpfaengerDTO[]>
	}

	public GetEmpfaenger_Guid = (guid: string): Promise<EmpfaengerDTO> => {
		return this.empfaengerService.apiV1EmpfaengerGuidGet(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler bei der Abfragen Empfänger pro Guid', e);
				return throwError(e);
			})).toPromise() as Promise<EmpfaengerDTO>
	}


	public GetEmpfaengerVonCurLeistung = (): Promise<EmpfaengerDTO> => {
		const leistung: ELeistungDTO = this.GetCurLeistung()
		if (leistung) {
			return this.GetEmpfaenger_Guid(leistung?.empfaenger)
		}
	}

	public async GetEmpfaenger_cur_Projekt(): Promise<IEmpfaengerKategorienItem[]> {

		if (!this.CurProjekt) return null
		const empfaengerKategorienItems = EmpfaengerKategorienItems()

		const res: IEmpfaengerKategorienItem[] = []
		this.CurProjekt?.auftrag?.phasen.forEach(p => p.leistungen.forEach(l => {
			if (l.empfaenger && l.empfaengerKategorie) {
				const item = empfaengerKategorienItems[l.empfaengerKategorie.toLowerCase()]
				if (item && item.hasEmpfaenger) {
					if (res.findIndex(i => i.guid === l.empfaenger) === -1) {
						res.push({
							titel: item.titel,
							guid: l.empfaenger,
							items: null,
						})
					}
				}
			}
		}))
		for (let item of res) {
			const empf = await this.GetEmpfaenger_Guid(item.guid)
			item.label = getEmpfaengerLabel(empf)
		}
		return res
	}

	public GetEmpfaengerKategorien_AuftragsDef(auftragsDef: AuftragsDefDTO): string[] {
		const empf: string[] = []
		auftragsDef.leistungsDefs.forEach(l => {
			l.aktionsDefs.forEach(a => {
				a.aktionsDoksDefs.forEach(ad => {
					if (empf.indexOf(ad.empfaengerKat) === -1) {
						empf.push(ad.empfaengerKat)
					}
				})
			})
		})
		return empf
	}

	public GetEmpfaengerKategorien_Projekt(auftrag: EAuftragDTO): string[] {
		const kat_guids = []

		// empfängerkategorien, die im Projekt definiert sind, holen
		auftrag?.phasen?.forEach(p => p.leistungen?.forEach(async l => {
			const kat = l.empfaengerKategorie?.toLowerCase()
			if (kat_guids.indexOf(kat) === -1) {
				kat_guids.push(kat)
			}
		}))

		return kat_guids
	}

	public EmpfaengerKategorie2Empfaenger(empfaengerKategorie: string): string {
		if (!this.CurProjekt) return ''
		if (empfaengerKategorie === EmpfaengerKategorienGuids.gemeinde) {
			return this.CurProjekt.auftrag?.guidEmpfaengerGemeinde
		}
		if (empfaengerKategorie === EmpfaengerKategorienGuids.vnb) {
			return this.CurProjekt.auftrag?.guidEmpfaengerVnb
		}
		if (empfaengerKategorie === EmpfaengerKategorienGuids.einmalverguetung) {
			return this.CurProjekt.auftrag?.guidEmpfaengerPronovo
		}
		return ''
	}


	public EmpfaengerKategorie2Empfaenger_update(auftrag: EAuftragDTO, empfaengerKategorie: string, guid: string) {
		if (!auftrag) return
		if (empfaengerKategorie === EmpfaengerKategorienGuids.gemeinde) {
			auftrag.guidEmpfaengerGemeinde = guid
		}
		if (empfaengerKategorie === EmpfaengerKategorienGuids.vnb) {
			auftrag.guidEmpfaengerVnb = guid
		}
		if (empfaengerKategorie === EmpfaengerKategorienGuids.einmalverguetung) {
			auftrag.guidEmpfaengerPronovo = guid
		}
		return ''
	}


	public GetAnlage = (projekt: EProjektDTO, formularguid: string): EAnlageDTO => {
		let anlageguid: string = ''
		let anlage: EAnlageDTO
		projekt?.auftrag?.phasen.forEach(p => p.leistungen.forEach(l => l.aktionen.forEach(a => {
			if (a.dokument?.guid === formularguid) {
				anlageguid = l.anlage
			}
		})))
		if (anlageguid) {
			projekt?.gebaeude?.anlagen?.forEach(a => {
				if (a.guid === anlageguid) {
					anlage = a
				}
			})

		}
		return anlage
	}

	public GetFirstAnlage = (projekt: EProjektDTO): EAnlageDTO => {
		if (projekt?.gebaeude?.anlagen) {
			return projekt.gebaeude.anlagen[0]
		}
	}



	public LoadPLZ = (plz: string): Promise<PostleitzahlenDTO[]> => {
		return this.plzService.apiV1PostleitzahlenPlzGet(plz).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen PLZ', e);
				return throwError(e);
			})).toPromise() as Promise<PostleitzahlenDTO[]>
	}

	public Lizenz_Insert_Demo = (produktLizenzDTO: ProduktLizenzDTO, isBeta?: boolean): Promise<ProduktLizenzDTO> => {
		if (isBeta) {
			produktLizenzDTO.bezeichnungDe = 'beta'
		}
		return this.produktLizenzenService.apiV1ProduktLizenzenPost(produktLizenzDTO).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Einfügen der Lizenz', e);
				return throwError(e);
			})).toPromise() as Promise<ProduktLizenzDTO>
	}

	public Lizenz_Insert_From_Gutschein = (holdingguid: string, gutschein: string): Promise<ProduktLizenzGutscheinDTO> => {
		return this.produktLizenzenService.apiV1ProduktLizenzenGutscheinPut(holdingguid, gutschein).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error(`Fehler beim Einfügen der Lizenz. Gutschein: ${gutschein}`, e);
				return throwError(e);
			})).toPromise() as Promise<ProduktLizenzGutscheinDTO>
	}

	public Lizenz_Verfuegbare_abfragen = (): Promise<number> => {
		if (!this.CurIdentity || !this.CurIdentity.holding) {
			return Promise.resolve(0)
		}


		return this.produktLizenzenService.apiV1ProduktLizenzenAvailableGet(this.CurIdentity.holding).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der verfügbaren Lizenzen', e);
				return throwError(e);
			})).toPromise() as Promise<number>
	}

	public Lizenz_Decrement_Project = (): Promise<ProduktLizenzDTO> => {
		if (!this.CurIdentity || !this.CurIdentity.holding) {
			return Promise.resolve(null)
		}

		return this.produktLizenzenService.apiV1ProduktLizenzenDecrementPut(this.CurIdentity.holding).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Dekrementieren des Projektes in der Lizenz', e);
				return throwError(e);
			})).toPromise() as Promise<ProduktLizenzDTO>
	}


	public geoApiStrasse = (suchtext: string): Promise<any[]> => {
		return this.http.get(`https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.swisstopo.amtliches-strassenverzeichnis&searchText=${suchtext}&searchField=label&returnGeometry=false`).pipe(map(
			(data: any) => {
				return data.results;
			}),
			catchError(e => {
				console.error('Fehler beim Abfrage api3.geo.admin.ch', e);
				return throwError(e);
			})).toPromise() as Promise<any[]>
	}

	public kompoDBApi_demo = (): Promise<any[]> => {
		return this.http.get(`https://a12aed51-772b-47db-ab86-2fd6028fa855.mock.pstmn.io/component/?component_type=pv_panel&name=TSM`).pipe(map(
			(data: any) => {
				return data.results;
			}),
			catchError(e => {
				console.error('Fehler bei Abfrage Komponenten Datenbank', e);
				return throwError(e);
			})).toPromise() as Promise<any[]>
	}

	public kompoDBModulApi_demo = (type: string, component_id: string): Promise<any> => {
		// https://a12aed51-772b-47db-ab86-2fd6028fa855.mock.pstmn.io/products/pv_modules/c72ea53a-d440-11eb-b8bc-0242ac130003/details
		// https://a12aed51-772b-47db-ab86-2fd6028fa855.mock.pstmn.io/products/inverters/76bbce85-df92-4e39-bf7e-7778674e7bd6/details
		// https://a12aed51-772b-47db-ab86-2fd6028fa855.mock.pstmn.io/products/storage/d4966a16-a892-4c6d-ba0f-485ca806d1e6/details

		return this.http.get(`https://a12aed51-772b-47db-ab86-2fd6028fa855.mock.pstmn.io/products/${type}/${component_id}/details`).pipe(map(
			(data: any) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler bei Abfrage Komponenten Modul Datenbank', e);
				return throwError(e);
			})).toPromise() as Promise<any[]>
	}

	public kompoDBApi_Brands = (type: string): Promise<KompoDbDTO> => {
		return this.kompoDBApiService.apiV1KompoDBApiBrandsFilteredTypGet(type).pipe(map(
			(raw) => {
				const data = JSON.parse(raw.data)
				// console.log('brands', data.results)
				return data.results;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Komponenten Datenbank (Brands)', e);
				return throwError(e);
			})).toPromise() as Promise<KompoDbDTO>
	}

	public kompoDBApi_Components_List = (type: string, brand: string, model: string): Promise<KompoDbDTO> => {
		return this.kompoDBApiService.apiV1KompoDBApiComponentsFilteredGet(type, brand, model).pipe(map(
			(raw) => {
				const data = JSON.parse(raw.data)
				// console.log('Components', data.results)
				return data.results;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Komponenten Datenbank (Components)', e);
				return throwError(e);
			})).toPromise() as Promise<KompoDbDTO>
	}

	public kompoDBApi_Product_Detail = (type: string, uuid: string): Promise<KompoDbDTO> => {
		return this.kompoDBApiService.apiV1KompoDBApiDetailTypUuidGet(type, uuid).pipe(map(
			(raw) => {
				const data = JSON.parse(raw.data)
				console.log('detail', data)
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Komponenten Datenbank (Detail)', e);
				return throwError(e);
			})).toPromise() as Promise<KompoDbDTO>
	}


	public GetPronovoUrl = (): Promise<string> => {
		return this.appSettingsService.apiV1AppSettingsPronovourlGet().pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Pronovo-Url', e);
				return throwError(e);
			})).toPromise() as Promise<string>
	}

	public GetEnvironment = (): Promise<string> => {
		return this.appSettingsService.apiV1AppSettingsSystemGet().pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen des Environments', e);
				return throwError(e);
			})).toPromise() as Promise<string>
	}


	// public Show_Anbieter_Dialog(): Promise<string | void> {
	// 	return new Promise<string>(
	// 		async (resolve) => {
	// 			const dialogRef = this.dialog.open(ProfilAnbieterDialogComponent, {
	// 				width: '50vw',
	// 				height: '75vh',
	// 			});
	// 			dialogRef.afterClosed().subscribe(async () => {
	// 				// mitarbeiter.pronovoRestKey = this.CurMitarbeiter.pronovoRestKey;
	// 				const ma = await this.CurMitarbeiter()
	// 				resolve(ma.pronovoRestKey);
	// 			});

	// 		}).catch((reason) => console.error("Fehler beim updaten der Anlage", reason));
	// }

	// public ShowViewBeilageDialog(beilageFileDef: BeilageFileDef) {
	// 	const dialogRef = this.dialog.open(BeilageDialogComponent, {
	// 		width: '80vw',
	// 		height: '95vh',
	// 		data: beilageFileDef
	// 	});

	// 	dialogRef.afterClosed().subscribe(() => {
	// 		if (beilageFileDef.okClicked && beilageFileDef.isValid() && beilageFileDef.hasChanged()) {
	// 			this.SavePDF_as_PoolBeilage(this.CurProjekt.auftrag, beilageFileDef.file, beilageFileDef.dokumentDefGuid, beilageFileDef.beilageGuid).then(() => {
	// 				this.emitReloadProjekt()
	// 			})
	// 		}
	// 	});
	// }

	// public ShowEditBeilageDialog(beilageFileDef: BeilageFileDef) {
	// 	const dialogRef = this.dialog.open(BeilageDialogComponent, {
	// 		width: '80vw',
	// 		height: '95vh',
	// 		data: beilageFileDef
	// 	});

	// 	dialogRef.afterClosed().subscribe(() => {
	// 		if (beilageFileDef.okClicked && beilageFileDef.isValid() && beilageFileDef.hasChanged()) {
	// 			this.SavePDF_as_PoolBeilage(this.CurProjekt.auftrag, beilageFileDef.file, beilageFileDef.dokumentDefGuid, beilageFileDef.beilageGuid).then(() => {
	// 				this.emitReloadProjekt()
	// 			})
	// 		}
	// 	});
	// }

	public SaveProfil(mitarbeiter: MitarbeiterDTO) {
		this.mitarbeiterService.apiV1MitarbeiterPut(mitarbeiter).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Speichern des Profils', e);
				return throwError(e);
			})).toPromise() as Promise<MitarbeiterDTO>
	}

	public GetAuftragsDefs(): Promise<AuftragsDefDTO[]> {
		return this.definitionenService.apiV1DefinitionenOrderDefsListGet().pipe(map(
			(data) => {

				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Auftrags-Definitionen', e);
				return throwError(e);
			})).toPromise() as Promise<AuftragsDefDTO[]>
	}

	public GetAuftragsDef(guid: string): Promise<AuftragsDefDTO> {
		return this.definitionenService.apiV1DefinitionenOrderDefsGetGuidGet(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Auftrags-Definition', e);
				return throwError(e);
			})).toPromise() as Promise<AuftragsDefDTO>
	}

	public GetDocChoiceDef(auftragdef: string, empfaenger: string|string[]): Promise<DokumentChoiceDTO> {
		// Übergib Empfänger-Arrays wie sie sind, einzelne Empfänger werden in ein Array verpackt.
		empfaenger = <string[]>(Array.isArray(empfaenger) ? empfaenger : [ empfaenger ]);

		return this.definitionenService.apiV1DefinitionenDocChoicesGet(auftragdef, empfaenger).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Doc-Choice', e);
				return throwError(e);
			})).toPromise() as Promise<DokumentChoiceDTO>
	}

	private _allDokumentDefs: DokumentDefDTO[];
	public get allDokumentDefs(): DokumentDefDTO[] {
		return this._allDokumentDefs;
	}

	public GetDocDefs(): Promise<DokumentDefDTO[]> {
		return this.definitionenService.apiV1DefinitionenDocDefsGet().pipe(map(
			(data) => {
				this._allDokumentDefs = data;
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Doc-Choice', e);
				return throwError(e);
			})).toPromise() as Promise<DokumentDefDTO[]>
	}

	private _allDokumentKats: DokumentKatDTO[];
	public get allDokumentKats(): DokumentKatDTO[] {
		return this._allDokumentKats;
	}

	public GetDocKats(refresh: boolean = false): Promise<DokumentKatDTO[]>
	{
		if(!this._allDokumentKats || refresh)
		{
			return this.definitionenService
				.apiV1DefinitionenDocCatsListGet([], 0, 1000).pipe(
					catchError(
						error =>
						{
							// this._logger.error(
							// 	"Failed to retrieve the document categories due to an error!",
							// 	error
							// );

							return throwError(error);
						}
					),
					tap(data => this._allDokumentKats = data)
				)
				.toPromise();
		}
		else
		{
			return Promise.resolve(this._allDokumentKats);
		}
	}

	get DefLanguage(): string {
		const lang = this._translationService.getActiveLang();
		if (lang === 'de') return 'german'
		if (lang === 'fr') return 'french'
		if (lang === 'it') return 'italian'
		return 'german'
	}

	get BezLanguage(): string {
		const lang = this._translationService.getActiveLang();
		if (lang === 'de') return 'bezeichnungDe'
		if (lang === 'fr') return 'bezeichnungFr'
		if (lang === 'it') return 'bezeichnungIt'
		return 'bezeichnungDe'
	}


	get translationService(): TranslocoService {
		return this._translationService
	}

	getGeraeteLabel(geraet: EGeraetDTO, geraete_typen: ISelectOptionItems): string {
		if (!geraet) {
			return ''
		}
		let modell = ''
		if (geraet.typ) {
			const opt = geraete_typen.find(o => o.value === geraet.typ)
			if (opt) {
				modell = opt.text
			} else {
				modell = geraet.typ
			}
		}

		return this.translationService.translate(marker('page_project_detail.geraete_label'), {modell, anzahl: geraet.anzahl.toString(), hersteller: geraet.hersteller, geraet: geraet.bezeichnung}) 
	}

	private edit_Project(data: IDialogBoxDataProjektAbschnitt,  height: string, cbAfterSave?: any) {

		// const dialogRef = this.dialog.open(
		// 	ProjectDetailEditDialogComponent, {
		// 	height,
		// 	maxHeight: '80vh',
		// 	minWidth: '50vw',
		// 	position: {
		// 		top: '9em',
		// 	},
		// 	data: data
		// }
		// );

		// dialogRef.afterClosed().subscribe(() => {
		// 	if (data.okClicked) {
		// 		if (cbAfterSave) {
		// 			cbAfterSave()
		// 		}
		// 	}
		// });

	}

	public editDialogAuftrag(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'auftrag',
		}
		this.edit_Project(data, '600px', cbAfterSave)
	}

	public editDialogGebaeude(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'gebaude',
		}
		this.edit_Project(data, '1000px', cbAfterSave)
	}

	public editDialogAdressen(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'adressen',
		}
		this.edit_Project(data, '1000px', cbAfterSave)
	}

	public editDialogEmpfaenger(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'empfaenger',
		}
		this.edit_Project(data, '500px', cbAfterSave)
	}

	// public editDialogAnlage(cbAfterSave?: any, anlage?: EAnlageDTO) {
	// 	const data: IDialogBoxData = {
	// 		// abschnitt: 'anlage',
	// 		values: anlage,
	// 	}

	// 	const dialogRef = this.dialog.open(ProjectAnlageAnlageEditDialogComponent, {
	// 		width: '1200px',
	// 		height: '750px',
	// 		data: data
	// 	});

	// 	dialogRef.afterClosed().subscribe(() => {
	// 		if (data.okClicked) {
	// 			const msg = this._translationService.translate(
	// 				'comp_detail_edit.gespeichert', {
	// 				name: this._translationService.translate(marker('comp_anlage_panel.title_anlagen'))
	// 			});
	// 			this.snackBar.open(msg, 'OK', {
	// 				duration: 2000,
	// 			});
	// 			if (cbAfterSave) {
	// 				cbAfterSave()
	// 			}
	// 		}
	// 	});
	// }


	// public editDialogGeraete(cbAfterSave?: any) {
	// 	if (!this.CurProjekt) {
	// 		console.error('CurProjekt nicht definiert!')
	// 		return
	// 	}
	// 	mapDatenToJSON(this.CurProjekt.gebaeude);
	// 	const copyGebaeude: GebaeudeDTO = cloneDeep(this.CurProjekt.gebaeude)


	// 	const data: IDialogBoxData = {
	// 		// titel: marker('comp_edit_device.title_edit_devices'),
	// 		schema: geraete_schema('geraete'),
	// 		values: copyGebaeude,
	// 		showOkButton: true,
	// 		showCancelButton: true
	// 	}

	// 	this.Show_DialogBox(data, async (data: IDialogBoxData) => {
	// 		if (data.okClicked) {
	// 			try {
	// 				//Geräte speichern
	// 				if (copyGebaeude.geraete) {
	// 					mapDatenToString(copyGebaeude);
	// 					await this.SaveGeraete(copyGebaeude);
	// 				}

	// 				//Geräte löschen
	// 				for (let geraet of this.CurProjekt.gebaeude.geraete) {
	// 					const vorh = copyGebaeude.geraete.find(g => g.guid === geraet.guid)
	// 					if (!vorh) {
	// 						await this.DeleteGeraet(geraet.guid);
	// 					}
	// 				}
	// 				const msg = this._translationService.translate(
	// 					'comp_detail_edit.gespeichert', {
	// 					name: this._translationService.translate('comp_project_detail_edit.title_devices')
	// 				})

	// 				this.snackBar.open(msg, 'OK', {
	// 					duration: 2000,
	// 				});
	// 				if (cbAfterSave) {
	// 					cbAfterSave()
	// 				}
	// 			} catch (error) {
	// 				console.error('Fehler beim speichern der Geräte', error)
	// 			}
	// 		}
	// 	})

	// }


	// public Show_DialogBox(data: IDialogBoxData, cb?: any) {
	// 	const dialogRef = this.dialog.open(DialogAllgemeinComponent, {
	// 		maxHeight: '90vh',
	// 		data: data
	// 	});
	// 	dialogRef.afterClosed().subscribe(() => {
	// 		if (cb) cb(data)
	// 	});
	// }

	public findePhase(dokument: DokumentDTO): EAuftragPhaseDTO {
		if (!this.CurProjekt)
			return undefined;

		let phase = this.CurProjekt.auftrag.phasen.find(ph => ph.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.guid, dokument?.guid))));
		return phase;
	}

	public findeLeistung(dokument: DokumentDTO): ELeistungDTO {
		const phase = this.findePhase(dokument);
		if (!phase)
			return undefined;

		const leistung = phase?.leistungen.find(l => l.aktionen.find(a => Guid.equals(a.dokument?.guid, dokument?.guid)));
		return leistung;
	}

	public findeAktion(dokument: DokumentDTO): EAktionDTO {

		// let phaseX
		// let leistungX
		// let aktionX

		// phaseX = sm.projekt.auftrag.phasen.find(
		// 	(ph) =>
		// 	{
		// 		leistungX = ph.leistungen.find(
		// 			(l) =>
		// 			{
		// 				aktionX = l.aktionen.find(
		// 					(a) => Guid.equals(a.dokument?.dokumentDef?.guid, formTyp)
		// 				)

		// 				return aktionX != undefined
		// 			}
		// 		)

		// 		return leistungX != undefined
		// 	}
		// );

		let leistung = this.findeLeistung(dokument);
		if (!leistung)
			return undefined;
		let aktion = leistung?.aktionen.find(a => Guid.equals(a.dokument?.guid, dokument?.guid));
		return aktion;
	}

	public sammeleHauptdokumente(projekt: EProjektDTO = null): DokumentDTO[] {
		const res: DokumentDTO[] = [];
		if (!projekt)
			projekt = this.CurProjekt;
		if (!projekt)
			return res;

		projekt.auftrag?.phasen.forEach(phase => {
			phase.leistungen?.forEach(leistung => {
				leistung.aktionen?.forEach(aktion => {
					if (aktion.dokument)
						res.push(aktion.dokument);
				});
			});
		});

		return res;
	}

	public findeDokumentVonBeilage(beilage: DokumentDTO): DokumentDTO {
		const doks = this.sammeleHauptdokumente();
		const dok = doks.find(d => d.beilagen?.find(b => Guid.equals(b?.guid, beilage?.guid)));
		return dok;
	}
}
