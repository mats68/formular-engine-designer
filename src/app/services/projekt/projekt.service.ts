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
	DokumentDefDTOApp,
	AktionsDefDTO,
	EntwuerfeService,
	EntwurfDTO,
	ObjektTyp,
	ProjektEntwurfDTO,
	AdresseEntwurfDTO,
} from 'src/app/api';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, merge, Observable, ObservedValueOf, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap, toArray } from 'rxjs/operators';
import { LoadingStatus } from 'src/app/tools/DataListProps';
import { AktionsWrapper, BeilageFileDef, BeilageWrapper, ProjektBeilagen, ProjektPhaseWrapper } from 'src/app/tools';
import * as EventEmitter from 'events';
import { marker } from '@ngneat/transloco-keys-manager/marker';
// import { AuthorizationService } from 'src/app/modules/auth/authorization.service';
// import { AuthenticationService } from 'src/app/modules/auth/authentication.service';
import { translate, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
// import { ProfilAnbieterDialogComponent } from 'src/app/components/profil-anbieter-dialog/profil-anbieter-dialog.component';
import { asGuid, Guid } from 'src/app/tools/Guid';
import { SignatureRole } from './signatureRole';
// import { DialogAllgemeinComponent } from 'src/app/components/dialog-allgemein/dialog-allgemein.component';
import { ISchema, ISelectOptionItems, SchemaManager } from 'src/app/components/bi-formular-engine/src/public-api';
import { ProduktLizenzGutscheinDTO } from 'src/app/api';
// import { BeilageDialogComponent } from 'src/app/components/beilagen/beilage-dialog.component';
import * as _ from "lodash-es";
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { geraete_schema, mapDatenToJSON, mapDatenToString } from 'src/app/schemas/schema-geraete';
import { cloneDeep } from 'lodash-es';
// import { NGXLogger } from 'ngx-logger';
import { DokumentKatDTO } from 'src/app/api';
// import { ProjektDetailEditDialogComponent } from 'src/app/components';
import { getuid } from 'process';
import { SendDokumentRequest } from 'src/app/api';
import { adressen, fakeProjekt, geschStelle, mitarbeiter } from './fake';
// import { EntwuerfeComponent } from 'src/app/pages';

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

export const PronovoGuid = '5ff8953c-f462-405f-9932-3f5439e4e3af';

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
				titel: translate(marker('page_projekt_wizard.label_recipient_owner')),
				items: null
			},
			"b053219c-6a38-47d4-9661-2e234b45fbff": {
				titel: translate(marker('page_projekt_wizard.label_recipient_community')),
				hasEmpfaenger: true,
				items: null
			},
			"2bf651f0-f779-4492-baf3-35b765feb351": {
				titel: translate(marker('page_projekt_wizard.label_recipient_vnb')),
				hasEmpfaenger: true,
				items: null
			},
			"22fc1591-ce09-4acb-983a-768d3f8b5e3f": {
				titel: translate(marker('page_projekt_wizard.label_recipients_einmalverguetung')),
				items: null
			},
			"8614a362-1338-4dcb-bd50-89123846924a": {
				titel: translate(marker('page_projekt_wizard.label_recipients_kanton')),
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

export type IProjektAbschnitt = 'auftrag' | 'gebaude' | 'empfaenger' | 'adressen' | 'anlage' | 'geraete'

export interface IDialogBoxDataProjektAbschnitt {
	okClicked?: boolean
	abschnitt: IProjektAbschnitt
	anlage?: EAnlageDTO
	values?: any
}


export const DokumentTypGuids = {
	pdf: '23ABACF4-ECF1-4EA3-98C5-DDC2A74E0767',
	jpg: '99FBFE2F-6FBD-4E77-ACB2-9F8FEDB6D942',
	png: 'F418973A-AF13-4CC1-B374-967B9D4048C4',
	svg: 'CAAEF2CA-72CB-4A82-ABD1-93B4C80FEB1B',
}

export interface SchemaBeilageDef {
	guid?: string
	titel: string
	translateTitel?: boolean
	required?: boolean
	schemaKey?: number
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
	titel: marker('comp_nav_bar.label_projekts'),
	routerLink: '/projekt-liste',
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

const EntwuerfeItem: INavbarItem = {
	titel: marker('comp_nav_bar.label_entwuerfe'),
	routerLink: '/entwuerfe',
	icon: '/assets/icons/nav-entwuerfe.svg'
}


export enum OriginUrl {
	dashboard = '/dashboard',
	verwaltung = '/bi-verwaltung',
	projekt_liste = '/projekt-liste',
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


export const getEmpfaengerLabel = (empfaenger: EmpfaengerDTO): string => {
	let vals: string[] = []
	if (empfaenger?.stichwort) vals.push(empfaenger.stichwort)
	if (empfaenger?.ort) vals.push(empfaenger.ort)
	return vals.join(', ')
}

export const getAdressLabel = (adresse: AdresseDTO | AdresseEntwurfDTO): string => {
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
		res = `${dateiname}`
	} else {
		res = originalName
	}
	return res
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
		// **changed-designer** 
		return fakeProjekt as EProjektDTO

	}

	private _projektBeilagen: ProjektBeilagen = null;
	public get projektBeilagen(): ProjektBeilagen {
		return this._projektBeilagen;
	}
	public set projektBeilagen(b: ProjektBeilagen) {
		this._projektBeilagen = b;
	}


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
		// **changed-designer** 
		// private readonly _logger: NGXLogger,
		private mitarbeiterService: MitarbeiterService,
		// **changed-designer** 
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
		private entwuerfeService: EntwuerfeService,
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

	// **changed-designer** 
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

	registerLinkBeilage(fn: (linkDTO: DokumentBeilageLinkDTO, insert: boolean, deleted: boolean) => void) {
		this.Emitter.on('linkBeilage', fn)
	}

	unRegisterLinkBeilage(fn: (linkDTO: DokumentBeilageLinkDTO, insert: boolean, deleted: boolean) => void) {
		this.Emitter.removeListener('linkBeilage', fn)
	}

	emitLinkBeilage(beilageDTO: DokumentBeilageLinkDTO, insert: boolean, deleted: boolean = false) {
		this.Emitter.emit('linkBeilage', beilageDTO, insert, deleted);
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

	registerFormularLoadingSpinner(fn: any) {
		this.Emitter.on('formularLoadingSpinner', fn)
	}

	unRegisterFormularLoadingSpinner(fn: any) {
		this.Emitter.removeListener('formularLoadingSpinner', fn)
	}

	emitFormularLoadingSpinner() {
		this.Emitter.emit('formularLoadingSpinner');
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

	getProjektTitel(projekt: EProjektDTO | ProjektEntwurfDTO): string {
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
		return (url === OriginUrl.dashboard || url === OriginUrl.geschaeftsstellen || url === OriginUrl.projekt_liste|| url === OriginUrl.verwaltung)
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

		// **changed-designer** 
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


	// **changed-designer** 
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

			case 'Entwuerfe':
				return EntwuerfeItem;

			default:
				return null;
		}
	}

	// **changed-designer** 
	// public async LoadProjektDTO(auftragGuid: string): Promise<EProjektDTO> {
		// return await this.projekteService.apiV1EProjekteGuidGet(auftragGuid).pipe(
		// 	catchError((error) => {
		// 		console.error('Fehler beim Laden des Projekts', error);
		// 		return throwError(error);
		// 	}),
		// ).toPromise();
	// }

	public async LoadProjekt(guidauftrag: string) {
		// **changed-designer** 
		if (!this.projektBeilagen) {
			this.projektBeilagen = new ProjektBeilagen()
		}

		// const oldAuftrag = this.CurProjekt?.auftrag?.guid
		// this.CurProjekt = null
		// this.CurAuftragDef = null
		// this.ResetCurEmpfaenger()
		// this._curDokumentChoice$ = null
		// if(this.projektBeilagen)
		// 	this.projektBeilagen.beilagen = null;

		// const projekt = await this.LoadProjektDTO(guidauftrag);
		// this.CurProjekt = projekt
		// console.log('Projekt', projekt)
		// console.log('Empfänger', await this.GetCurEmpfaenger())


		// if (!this.CurAuftragDef || projekt.auftrag?.guid !== oldAuftrag) {
		// 	this.CurAuftragDef = await this.GetAuftragsDef(projekt.auftrag.guiD_AuftragDef)

		// }
		// console.log('AuftragDef', this.CurAuftragDef)

		// if (!this.projektBeilagen) {
		// 	this.projektBeilagen = new ProjektBeilagen()
		// }
		// await this.projektBeilagen.Init()
		// console.log('projektBeilagen', this.projektBeilagen)

	}

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

	public async DeleteDokument(dto: DokumentDTO, force: boolean = false): Promise<DokumentDTO> {
		return this.dokumenteService.apiV1DokumenteGuidDelete(dto.guid, force).toPromise();
	}

	public async DeleteAktion(aw: AktionsWrapper): Promise<void> {
		return this.dokumenteService.apiV1DokumenteGuidDelete(aw.aktion.guid).toPromise();
	}

	public async DownloadFormular(dokument: DokumentDTO, pdfFileName?: string) {
		this.dokumenteService.apiV1DokumentePrintPost(null, dokument)
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

		if(!auftrag.dokumente?.find(d=>Guid.equals(d.guid, guidBeilage))){
			const dokumentPool: EAuftragDokumentPoolDTO = {
				mandant: auftrag.mandant,
				guidAuftrag: auftrag.guid,
				guidBeilage: beilage.guid
			}

			await this.Save_Dokument_Pool(dokumentPool);
		}

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
				projekt.auftrag.dokumente = projekt.auftrag.dokumente.filter(b => !Guid.equals(b.guid, beilage_guid));
				return data;
			}),
			catchError(e => {
				const poolBeilage = projekt.auftrag.dokumente.filter(b => Guid.equals(b.guid, beilage_guid))
				if (poolBeilage.length > 0) {
					const msg = translate(marker('comp_projekt_detail.msg_linked'))
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

		// **changed-designer** 
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

		// **changed-designer** 
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

		// **changed-designer** 
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
		const sendDokumentRequest :  SendDokumentRequest = {
			aktion: this.GetCurAktion(),
			dokument: dokument,
			empfaenger: receiver,
		};
		return this.dokumenteService.apiV1DokumenteSendPost(sendDokumentRequest).pipe(map(
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

	// public GetEmpfaenger_pro_Kategorie = (kat: string): Promise<EmpfaengerDTO[]> => {
	// 	return this.empfaengerService.apiV1EmpfaengerKategorieGet(kat, 0, 650).pipe(map(
	// 		(data) => {
	// 			return data;
	// 		}),
	// 		catchError(e => {
	// 			console.error('Fehler bei der Abfrage Empfänger suchen', e);
	// 			return throwError(e);
	// 		})).toPromise() as Promise<EmpfaengerDTO[]>
	// }

	public GetEmpfaenger_Suchen = (text: string, kat_guid?: string): Promise<EmpfaengerDTO[]> => {
		return this.empfaengerService.apiV1EmpfaengerSuchenGet(text).pipe(map(
			(data) => {
				if (data && kat_guid) {
					data = data.filter(e => Guid.equals(e.kategorie?.guid, kat_guid))
				}
				// console.log('suche', data)
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Empfänger pro Kategorie', e);
				return throwError(e);
			})).toPromise() as Promise<EmpfaengerDTO[]>
	}

	protected InternalGetEmpfaenger_Guid(guid: string): Observable<EmpfaengerDTO> {
		return this.empfaengerService.apiV1EmpfaengerGuidGet(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler bei der Abfragen Empfänger pro Guid', e);
				return of(null);
			}));
	}

	public async GetEmpfaenger_Guid(guid: string): Promise<EmpfaengerDTO> {
		const empfaenger = (await this.GetCurEmpfaenger()).find(e=>Guid.equals(e?.guid, guid));
		if(empfaenger)
			return empfaenger;
		else
			return this.InternalGetEmpfaenger_Guid(guid).toPromise() as Promise<EmpfaengerDTO>;
	}

	public async GetEmpfaenger_Leistung(leistung: ELeistungDTO): Promise<EmpfaengerDTO> {
		if (!this.CurAuftragDef) {
			console.error('CurAuftragDef nicht vorhanden')
			return
		}
		let res: EmpfaengerDTO = null
		let aktionsDef: AktionsDefDTO = null
		this.CurAuftragDef.leistungsDefs.forEach(ld => {
			ld.aktionsDefs.forEach(ad => {
				if (Guid.equals(ad.guid,leistung.guiD_LeistungDef)) {
					aktionsDef = ad
				}
			})
		})
		if (aktionsDef && aktionsDef.aktionsDoksDefs?.length > 0 && aktionsDef.aktionsDoksDefs[0].dokumentKat) {
			const empfaenger = await this.GetCurEmpfaenger()
			res = empfaenger?.find(e=>Guid.equals(e?.kategorie?.guid, aktionsDef.aktionsDoksDefs[0].dokumentKat?.empfaengerKat?.guid));
		}
		if (!res) {
			console.error('Empfaenger für Leistung nicht gefunden!', leistung.id)
		}
		return res
	}


	public GetEmpfaengerVonCurLeistung = (): Promise<EmpfaengerDTO> => {
		return this.GetEmpfaenger_Leistung(this.GetCurLeistung())
	}

	public async GetEmpfaenger_cur_Projekt(): Promise<IEmpfaengerKategorienItem[]> {

		if (!this.CurProjekt) return null
		const empfaengerKategorienItems = EmpfaengerKategorienItems()

		const res: IEmpfaengerKategorienItem[] = []
		const empfaenger = await this.GetCurEmpfaenger()
		empfaenger.forEach(e => {
			const item = empfaengerKategorienItems[e?.kategorie?.guid?.toLowerCase()]
			if (item && item.hasEmpfaenger) {
				res.push({
					titel: item.titel,
					guid: e.guid,
					items: null,
				})
			}
		})

		// this.CurProjekt?.auftrag?.phasen.forEach(p => p.leistungen.forEach(l => {
		// 	if (l.empfaenger && l.empfaengerKategorie) {
		// 		const item = empfaengerKategorienItems[l.empfaengerKategorie.toLowerCase()]
		// 		if (item && item.hasEmpfaenger) {
		// 			if (res.findIndex(i => i.guid === l.empfaenger) === -1) {
		// 				res.push({
		// 					titel: item.titel,
		// 					guid: l.empfaenger,
		// 					items: null,
		// 				})
		// 			}
		// 		}
		// 	}
		// }))
		for (let item of res) {
			const empf = await this.GetEmpfaenger_Guid(item.guid)
			item.label = getEmpfaengerLabel(empf)
		}
		return res
	}

	public GetEmpfaengerKategorien_AuftragsDef(auftragsDef: AuftragsDefDTO): string[] {
		const empf: Guid[] = []
		auftragsDef.leistungsDefs.forEach(l => {
			l.aktionsDefs.forEach(a => {
				a.aktionsDoksDefs.forEach(ad => {
					const guid = Guid.parse(ad.dokumentKat.empfaengerKat.guid)
					if(!empf.find(g=>g.equals(guid)))
						empf.push(guid);
				})
			})
		})
		return empf.map(g=>g.toString());
	}

	// public GetEmpfaengerKategorien_Projekt(auftrag: EAuftragDTO): string[] {
	// 	let kat_guids = []
	// 	this.GetCurEmpfaenger().then(empf => {
	// 		kat_guids = empf.map(e => e.guid)
	// 		return kat_guids
	// 	})
	// 	// const kat_guids = []

	// 	// // TODO: Empfänger nur noch im Auftrag speichern
	// 	// // empfängerkategorien, die im Projekt definiert sind, holen
	// 	// auftrag?.phasen?.forEach(p => p.leistungen?.forEach(async l => {
	// 	// 	const kat = l.empfaengerKategorie?.toLowerCase()
	// 	// 	if (kat_guids.indexOf(kat) === -1) {
	// 	// 		kat_guids.push(kat)
	// 	// 	}
	// 	// }))

	// 	// return kat_guids
	// }

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

	// public Lizenz_Decrement_Project = (): Promise<ProduktLizenzDTO> => {
	// 	if (!this.CurIdentity || !this.CurIdentity.holding) {
	// 		return Promise.resolve(null)
	// 	}

	// 	return this.produktLizenzenService.apiV1ProduktLizenzenDecrementPut(this.CurIdentity.holding).pipe(map(
	// 		(data) => {
	// 			return data;
	// 		}),
	// 		catchError(e => {
	// 			console.error('Fehler beim Dekrementieren des Projektes in der Lizenz', e);
	// 			return throwError(e);
	// 		})).toPromise() as Promise<ProduktLizenzDTO>
	// }


	public geoApiStrasse = (suchtext: string): Promise<any[]> => {
		return this.http.get(`https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.swisstopo.amtliches-strassenverzeichnis&searchText=${suchtext}&searchField=label&returnGeometry=false`).pipe(map(
			(data: any) => {
				console.info(`Request: https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.swisstopo.amtliches-strassenverzeichnis&searchText=${suchtext}&searchField=label&returnGeometry=false`)
				console.info(`Result: `, data)
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


	// **changed-designer** 
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

	private _curEmpfaenger$: Observable<EmpfaengerDTO[]> = null;

	public async GetCurEmpfaenger(): Promise<EmpfaengerDTO[]> {
		if (!this.CurProjekt) {
			console.error('CurProjekt nicht definiert');
			return
		}

		if (this._curEmpfaenger$ == null) {
			const observables: Observable<EmpfaengerDTO>[] = [];

			if (this.CurProjekt.auftrag.guidEmpfaengerGemeinde) {
				observables.push(this.InternalGetEmpfaenger_Guid(this.CurProjekt.auftrag.guidEmpfaengerGemeinde))
			}
			if (this.CurProjekt.auftrag.guidEmpfaengerVnb) {
				observables.push(this.InternalGetEmpfaenger_Guid(this.CurProjekt.auftrag.guidEmpfaengerVnb))
			}
			if (this.CurProjekt.auftrag.guidEmpfaengerPronovo) {
				observables.push(this.InternalGetEmpfaenger_Guid(this.CurProjekt.auftrag.guidEmpfaengerPronovo))
			}

			this._curEmpfaenger$ = merge(...observables).pipe(
				// tap(x => console.log('Before toArray:', x)),
				toArray(),
				// tap(x => console.log('After toArray:', x)),
				shareReplay(1)
			);
		}

		return this._curEmpfaenger$.toPromise();
	}

	public ResetCurEmpfaenger()  {
		this._curEmpfaenger$ = null;
	}

	public ResetCurDocChoice()  {
		this._curDokumentChoice$ = null;
	}


	private _curDokumentChoice$: Observable<DokumentChoiceDTO> = null;

	public async GetCurDocChoiceDef(): Promise<DokumentChoiceDTO> {
		if (!this.CurProjekt) {
			console.error('CurProjekt nicht definiert');
			return
		}
		if (!this.CurAuftragDef) {
			console.error('CurAuftragDef nicht definiert');
			return
		}

		if(this._curDokumentChoice$ == null){

			// const empfaenger = await this.GetCurEmpfaenger()
			// const empfaenger_guid = empfaenger.map(e => e.guid)

			// this._curDokumentChoice = await this.GetDocChoiceDef(this.CurAuftragDef.guid, empfaenger_guid)

			// const empfGuids = await (await this.GetCurEmpfaenger()).map(e => e.guid);
			// this._curDokumentChoice$ = from(this.InternalGetDocChoiceDef(this.CurAuftragDef.guid, empfGuids)).pipe(shareReplay(1));

			this._curDokumentChoice$ =
				from(this.GetCurEmpfaenger()).pipe(
					switchMap(x => this.InternalGetDocChoiceDef(this.CurAuftragDef.guid, x.map(e => e?.guid))),
					shareReplay(1)
				);
		}

		return this._curDokumentChoice$.toPromise();
	}

	protected InternalGetDocChoiceDef(auftragdef: string, empfaenger: string|string[]): Observable<DokumentChoiceDTO> {
		// Übergib Empfänger-Arrays wie sie sind, einzelne Empfänger werden in ein Array verpackt.
		empfaenger = <string[]>(Array.isArray(empfaenger) ? empfaenger : [ empfaenger ]);

		return this.definitionenService.apiV1DefinitionenDocChoicesGet(auftragdef, empfaenger).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Abfragen der Doc-Choice', e);
				return of(null);
			}));
	}

	public GetDocChoiceDef(auftragdef: string, empfaenger: string|string[]): Promise<DokumentChoiceDTO> {
		return this.InternalGetDocChoiceDef(auftragdef, empfaenger).toPromise();
	}

	private _dokumentDefs$: Observable<DokumentDefDTO[]> = null;

	public GetDocDefs(): Promise<DokumentDefDTO[]> {
		if (this._dokumentDefs$ == null) {
			this._dokumentDefs$ = this.definitionenService.apiV1DefinitionenDocDefsGet().pipe(
					catchError(e => {
						console.error('Fehler beim Abfragen der Doc-Choice', e);
						return of(null);
					}),
					shareReplay(1)
				);
		}

		return this._dokumentDefs$.toPromise();
	}

	public async getDokumentBeilageSchemaKey(dokumentGuid: string, beilageGuid: string ) : Promise<number> {
		return await this.dokumenteService.apiV1DokumenteAttachmentsSchemakeyGet(dokumentGuid, beilageGuid).toPromise();
	}

	public async GetDokumentDefApp(guid: string): Promise<DokumentDefDTOApp> {
		const zentralDokDefs = await this.GetDocDefs();
		const zentralDokDef = zentralDokDefs.find(dd=>Guid.equals(dd.guid, guid));
		if(zentralDokDef){
			const appDokDef: DokumentDefDTOApp = {
				guid: zentralDokDef.guid,
				baseGUID: zentralDokDef.parent,
				category: zentralDokDef.category.guid,
				description: zentralDokDef.description,
				issuer: zentralDokDef.issuer,
				languageCode: zentralDokDef.languageCode,
				longName: zentralDokDef.longName,
				name: zentralDokDef.name,
				shortName: zentralDokDef.shortName,
			}
			return appDokDef;
		}
		return undefined;
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

	public GetDokKat(guid: string){
		return this._allDokumentKats.find(dk=>Guid.equals(dk.guid, guid));
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

		return this.translationService.translate(marker('page_projekt_detail.geraete_label'), {modell, anzahl: geraet.anzahl.toString(), hersteller: geraet.hersteller, geraet: geraet.bezeichnung})
	}

	private edit_Project(data: IDialogBoxDataProjektAbschnitt, width: string, height: string, cbAfterSave?: any) {

		// const dialogRef = this.dialog.open(
		// 	ProjektDetailEditDialogComponent, {
		// 	width,
		// 	height,
		// 	maxHeight: '80vh',
		// 	maxWidth: '90vw',
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
		this.edit_Project(data, '1200px', '550px', cbAfterSave)
	}

	public editDialogGebaeude(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'gebaude',
		}
		this.edit_Project(data, '1200px', '1000px', cbAfterSave)
	}

	public editDialogAdressen(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'adressen',
		}
		this.edit_Project(data, '1200px',  '1000px', cbAfterSave)
	}

	public editDialogEmpfaenger(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'empfaenger',
		}
		this.edit_Project(data, '1200px', '450px', cbAfterSave)
	}

	public editDialogAnlage(cbAfterSave?: any, anlage?: EAnlageDTO) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'anlage',
			anlage
		}
		this.edit_Project(data, '1200px', '640px', cbAfterSave)

	}


	public editDialogGeraete(cbAfterSave?: any) {
		const data: IDialogBoxDataProjektAbschnitt = {
			abschnitt: 'geraete',
		}
		this.edit_Project(data, '1200px', '1000px', cbAfterSave)
	}


	public Show_DialogBox(data: IDialogBoxData, cb?: any) {
		// **changed-designer** const dialogRef = this.dialog.open(DialogAllgemeinComponent, {
		// 	maxHeight: '90vh',
		// 	data: data
		// });
		// dialogRef.afterClosed().subscribe(() => {
		// 	if (cb) cb(data)
		// });
	}

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

	public getObjektTypLabel(objektTyp: ObjektTyp) :string {
		if (objektTyp === ObjektTyp.Projekt) {
			return tr_key(marker('enum_entwuerfe.projekt'))
		}
		return ''
	}


	public LoadEntwurfsListe = (limit: number, skip: number): Observable<Array<EntwurfDTO>> => {
		return this.entwuerfeService.apiV1EntwuerfeListGet(limit, skip)
	}

	public LoadEntwurf = (guid: string): Promise<EntwurfDTO> => {
		return this.entwuerfeService.apiV1EntwuerfeEntwurfGuidGet(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Laden des Entwurfs', e);
				return throwError(e);
			})).toPromise() as Promise<EntwurfDTO>
	}

	public SaveEntwurf = (entwurfDTO: EntwurfDTO): Promise<EntwurfDTO> => {
		return this.entwuerfeService.apiV1EntwuerfeEntwurfPost(entwurfDTO).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Speichern des Entwurfs', e);
				return throwError(e);
			})).toPromise() as Promise<EntwurfDTO>
	}


	public DeleteEntwurf = (guid: string): Promise<EntwurfDTO> => {
		return this.entwuerfeService.apiV1EntwuerfeEntwurfGuidDelete(guid).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Löschen des Entwurfs', e);
				return throwError(e);
			})).toPromise() as Promise<EntwurfDTO>
	}

	public ErstelleProjektAusEntwurf = (entwurfDTO: EntwurfDTO): Promise<EProjektDTO> => {
		return this.entwuerfeService.apiV1EntwuerfeProjektPost(entwurfDTO).pipe(map(
			(data) => {
				return data;
			}),
			catchError(e => {
				console.error('Fehler beim Speichern des Projekts aus Entwurf', e);
				return throwError(e);
			})).toPromise() as Promise<EProjektDTO>
	}




}
