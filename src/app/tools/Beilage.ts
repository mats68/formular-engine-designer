import { MatDialog } from "@angular/material/dialog";
import { translate, TranslocoService } from "@ngneat/transloco";
import { marker } from "@ngneat/transloco-keys-manager/marker";
import { DokumentDTO, ELeistungDTO, DokumentStatus, TransferTyp, EProjektDTO, DokumentChoiceDTO, DokumentDefDTO, EmpfaengerDTO, DokumentBeilageLinkDTO, EAuftragDokumentPoolDTO, DokumentTransferHistoryDTO, DokumentDefDTOApp, DokumentKatDTO, EAktionDTO, EmpfaengerTransferKanal, DsoDTO } from "../api";
// import { BeilageDialogComponent } from "../components/beilagen/beilage-dialog.component";
import { SchemaBeilageDef, ProjektService, getDateiNamePrint, getEmpfaengerLabel } from "../services";
import { Guid } from "./Guid";
import { last, first, eq, cloneDeep } from "lodash-es";
import * as schemas from 'src/app/schemas';
import { IComponent, ISchema, SchemaManager } from "../components/bi-formular-engine/src/public-api";
import { AktionsWrapper, IUploadFile } from "./ProjektPhase";
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { card_panel, inputGroupCL } from "src/app/schemas";

interface IFormularEmpf {
	dokument: DokumentDTO
	empfaenger: string
}

export class ProjektBeilagen {
	public beilagen: BeilageWrapper[]
	private _projektService: ProjektService;
	private projekt: EProjektDTO;
	private _dokChoice: DokumentChoiceDTO;
	private _dokDefs: DokumentDefDTO[];
	private _dokKats: DokumentKatDTO[];
	private _projektEmpfaenger: EmpfaengerDTO[];

	constructor(
	) {
		ProjektBeilagen._instance = this;
		this._projektService = ProjektService.instance;
	}

	private _schemaManager: SchemaManager = null;
	public get schemaManager(): SchemaManager { return this._schemaManager; }
	public set schemaManager(sm: SchemaManager) {
		this._schemaManager = sm;
	}
	private static _instance: ProjektBeilagen;
	public static get instance(): ProjektBeilagen {
		return ProjektBeilagen._instance;
	}

	public get inProjektSicht(): boolean {
		return !this.schemaManager;
	}

	public getEmpfaengerByDokDef(dokDefGuid: string): EmpfaengerDTO {
		const dokDef = this.getDokumentDef(dokDefGuid);
		return this.getEmpfaengerByDokKat(dokDef?.category?.guid);
	}

	public getEmpfaengerByDokKat(dokKatGuid: string): EmpfaengerDTO {
		const dokKat = this.getDokumentKat(dokKatGuid);
		const empfaenger = this._projektEmpfaenger?.find(e => Guid.equals(e?.kategorie.guid, dokKat?.empfaengerKat?.guid));
		return empfaenger;
	}

	public getDokumentKat(dokKatGuid: string): DokumentKatDTO {
		const dokKat = this._dokKats?.find(dk => Guid.equals(dk.guid, dokKatGuid));
		return dokKat;
	}

	public getDokumentDef(dokDefGuid: string): DokumentDefDTO {
		const dokDef = this._dokDefs.find(dd => Guid.equals(dd.guid, dokDefGuid));
		return dokDef;
	}

	public getDokumentDefByDokKat(dokKatGuid: string): DokumentDefDTO {
		const empfaenger = this.getEmpfaengerByDokKat(dokKatGuid);
		const dokDefs = this._dokChoice.dokumentDefs[empfaenger?.guid];
		const dokDef = dokDefs.find(dd => Guid.equals(dd.category.guid, dokKatGuid));
		return dokDef;
	}

	public async Init(): Promise<void> {
		/**
		 * 1. Alle Beilagen des Projektes durchlaufen
		 * -- Zu welchen Formularen ist die Beilage verknüpft (BeilageFormular)
		 * 	-- Mit keinem Formular verknüpft
		 * 	-- Mit genau einem Formuar verknüpft
		 * 	-- Mit mehreren Formularen verknüpft
		 *
		 * 2. Alle SchemaBeilageDefs laden
		 * 	-- Für jede Beilage ermitteln, zu welchen Formular-Schemas sie passt
		 * 	-- Für jede Beilage ermitteln, zu welchen SchemaBeilageDefs von welchen Formular-Schemas sie passt
		 *
		 * 3. Alle Empfänger der Beilage ermitteln
		 * 	TODO:
		 * 	-- Es sollte nur je ein Formular eines Empfängers verknüpft sein -> sonst Fehler anzeigen | werfen ...
		 */
		this.beilagen = []
		this._beilageWrappers = [];
		this.projekt = this._projektService.CurProjekt
		if (!this.projekt) {
			console.error('Beilagen: Projekt nicht definiert.')
			return
		}

		// Alle DokumentDefs, Kats und DocChoices vom Zentral abrufen
		this._dokDefs = await this._projektService.GetDocDefs();
		this._dokKats = await this._projektService.GetDocKats();
		this._dokChoice = await this._projektService.GetCurDocChoiceDef();
		this._projektEmpfaenger = await this._projektService.GetCurEmpfaenger();

		// Alle Hauptformulare des Projekts zusammensuchen
		// const formulare = this.getProjektFormulare();

		const aktionen = this.getProjektAktionen();
		//  Alle Empfänger, welche im Projekt konfiguriert sind

		// Alle beteiligten DokumentDef Guids sammeln
		// Zuerst alle von den Formularen
		const dokumentDefGuids = new Set<string>(aktionen.filter(a => a.dokument).map(a => Guid.parse(a.dokument.dokumentDef.guid).toString()));
		// Dann alle von DocChoice
		Object.values(this._dokChoice.dokumentDefs)
			.forEach(
				dds => dds.forEach(
					dd => {
						if (dd.languageCode.indexOf(this.projekt.auftrag.sprache) === 0)
							dokumentDefGuids.add(Guid.parse(dd.guid).toString())
					}
				)
			);

		// Alle benötigten Schemas laden
		const neededSchemas = Object.values(schemas)
			.filter(o => typeof o === 'object')
			.map(o => o as ISchema)
			.filter(s => s.guid && dokumentDefGuids.has(Guid.parse(s.guid).toString()));

		// Map mit allen benötigten Schemas und dokumentDef.guid als  Schlüssel
		const schemaMap = new Map<string, ISchema>();
		for (let s of neededSchemas) {
			schemaMap.set(Guid.parse(s.guid).toString(), s);
		}

		// hier werden alle verwendeteten Schemas eingefügt
		const usedSchemas = new Set<ISchema>();

		// Alle Beilagen vom Projekt-Pool aufbauen
		for (let poolBeilage of this.projekt.auftrag.dokumente) {
			let bw = this.beilagen.find(bw => Guid.equals(bw.beilageDokumentDefGuid, poolBeilage.dokumentDef.guid));
			if (bw && !bw.beilage) {
				bw.beilage = poolBeilage;
				await initBeilageFormulare(bw, poolBeilage);
				initSchemas(bw);
				continue;
			}
			else {
				bw = new BeilageWrapper(poolBeilage);
				bw.beilageDokumentDefGuid = Guid.parse(poolBeilage.dokumentDef.guid).toString();
				await initBeilageFormulare(bw, poolBeilage);
				initSchemas(bw);
			}


			this.beilagen.push(bw);

			// Alle Beilagen von den Schemas dieses Wrappers erstellen
			initWrappersFromSchemas(bw.schemas, this.beilagen);
			// Zu den verwendeten Schemas hinzufügen
			bw.schemas.forEach(s => usedSchemas.add(s));
		}

		const unusedSchemas = new Set<ISchema>(
			[...neededSchemas].filter(x => !usedSchemas.has(x)));

		// Alle Beilagen aus Schemas welche bisher nicht berücksichtigt wurden
		initWrappersFromSchemas(Array.from(unusedSchemas), this.beilagen);

		// lade den SchemaKey asynchron in den Cache
		for (let bw of this.beilagen) {
			for (let bf of bw.beilageFormulare) {
				await bf.getSchemaKey();
			}
		}

		async function initWrappersFromSchemas(schemas: ISchema[], beilagen: BeilageWrapper[]): Promise<void> {
			for (let s of schemas) {
				if (s.beilagen) {
					for (let bd of s.beilagen) {
						// Gleiches Schema, gleiche BeilagenDef schon vorhanden
						if (
							beilagen.find(bw => Guid.equals(bw.beilageDokumentDefGuid, bd.guid)
								&& bw.schemaguids.find(g => Guid.equals(g, s.guid))
								&& eq(bw.beilageDefs.get(Guid.parse(s.guid).toString()), bd))
						)
							continue;

						const bw = new BeilageWrapper();
						if (bd.guid) {
							bw.beilageDokumentDefGuid = Guid.parse(bd.guid).toString();
						}
						await initBeilageFormulare(bw);
						initSchemas(bw);
						beilagen.push(bw);
					}
				}
			}
		}

		async function initBeilageFormulare(bw: BeilageWrapper, pb?: DokumentDTO): Promise<void> {
			bw.beilageFormulare = aktionen
				.filter(a => a.dokument)
				.filter(a =>
					// Entweder bereits als Beilage verknüpft
					a.dokument?.beilagen?.find(b => Guid.equals(b.guid, pb?.guid))
					||
					// oder als Beilage im zugehörigen Schema definiert
					schemaMap.get(Guid.parse(a.dokument?.dokumentDef.guid).toString())?.beilagen?.find(bd => Guid.equals(bd.guid, bw.beilageDokumentDefGuid))
				)
				.map(a => {
					const bf = new BeilageFormular(bw, a.dokument);
					return bf;
				});
		}

		function initSchemas(wrapper: BeilageWrapper) {
			// Zuerst in Set abspitzen, um doppelte Vorkommen zu eliminieren
			// Erst alle schemas mit den verknüpften Formularen einfügen
			const schemas = new Set<ISchema>(wrapper.beilageFormulare
				.map(bf => schemaMap.get(Guid.parse(bf.dokumentDef.guid).toString()))
				// .filter(s => s) // Das entstehende undefined entfernen
			);
			// Dann aus den benötigten Schemas all die einfügen, welche diese Beilage-DokumentDef referenezieren
			neededSchemas.filter(s => s.beilagen?.find(bd => Guid.equals(bd.guid, wrapper.beilageDokumentDefGuid))
			)?.forEach(s => {
				schemas.add(s);
			});

			wrapper.schemas = Array.from(schemas);
			wrapper.schemas.forEach(s => {
				s.beilagen?.filter(bd => Guid.equals(bd.guid, wrapper.beilageDokumentDefGuid))
					.forEach(bd => wrapper.beilageDefs.set(Guid.parse(s.guid).toString(), bd))
			});
		}
	}

	private _beilageWrappers = [];
	public getProjektListe(): BeilageWrapper[] {
		if (this._beilageWrappers.length == 0) {
			this._beilageWrappers = this.beilagen?.filter(b => b.beilage) ?? [];
			this.sortieren(this._beilageWrappers);
		}
		return this._beilageWrappers
	}

	public getFormularListe(formular: DokumentDTO, schema: ISchema, schemaManager?: SchemaManager): BeilageWrapper[] {
		this.schemaManager = schemaManager

		// Ein Set abspitzen, um doppelte Einträge zu vermeiden
		const wrapperSet = new Set<BeilageWrapper>(
			(schema && schema.beilagen) ? this.beilagen?.filter(b => b.schemaguids?.find(g => Guid.equals(g, schema.guid))) : []
		);

		if (formular && formular.beilagen) {
			formular.beilagen.forEach(b => {
				const beilageWrapper = this.beilagen?.find(bl => Guid.equals(bl.beilage?.guid, b.guid))
				if (beilageWrapper && beilageWrapper.beilage)
					wrapperSet.add(beilageWrapper);
			});
		}
		let beilageWrappers = Array.from(wrapperSet);

		// auf Projekt (kein SchemaManager) werden nur required Beilagen angezeigt und auch keine Antworten (dokDef von Formular und Beilage gleich)
		if (this.inProjektSicht) {
			// Antwort-Beilagen entfernen (gleicher Typ wie  Haupt-Formular)
			// beilageWrappers = beilageWrappers.filter(bw => !bw.beilage || !Guid.equals(bw.beilage.dokumentDef.guid, formular?.dokumentDef.guid));

			// Beilagen entfernen, welche bereits an den Empfänger des Haupt-Forulars geschickt
			// wurden, oder die von dort stammen. Aber nicht wenn sie mit dem Formular verknüpft sind.
			beilageWrappers = beilageWrappers.filter(bw => {
				// Die Beilage des Haupt-Formulars belassen
				if (formular?.beilagen?.find(b => Guid.equals(b.guid, bw.beilage?.guid)))
					return true;

				// Es gibt einen History-Eintrag vom oder zum gleichen Empfänger -> entfernen
				const bf = bw.beilageFormulare.find(bf => Guid.equals(bf.formular?.guid, formular?.guid));
				if (bf && bw.letzterTransferHistoryEintrag(bf))
					return false;

				const dokDef = this._dokDefs.find(dd => Guid.equals(dd.guid, schema.guid));
				const dokKat = this._dokKats.find(dk => Guid.equals(dk.guid, dokDef.category.guid));
				// TODO: von versendeten Hauptformularen den Empfänger aus der TransferHistory ermitteln
				const empfaenger = this._projektEmpfaenger.find(e => Guid.equals(e?.kategorie.guid, dokKat.empfaengerKat.guid));

				return true;
			});

			// Alle 'leeren' SchemaBeilageDefs entfernen, welche nicht required sind
			beilageWrappers = beilageWrappers.filter(bw => {
				const ws = bw.schemas.find(s => Guid.equals(s.guid, schema.guid));
				const bd = ws?.beilagen?.find(bd => Guid.equals(bd.guid, bw.beilageDokumentDefGuid));
				if (bw.beilage)
					return true;
				const existingBd = beilageWrappers.find(bw => bw.beilage && eq(bw.beilageDefs.get(Guid.parse(ws.guid).toString()), bd));
				return bd?.required && !existingBd;
				// return bw.beilage || (bd?.required && (!formular && !beilageWrappers.find(bw=>Guid.equals(bw.beilage?.dokumentDef.guid, bw.beilageDokumentDefGuid))));
			});
		}
		// Bei signiert nur solche mit Dokumente
		if (formular && formular.status >= DokumentStatus.SigniertGesperrt) {
			beilageWrappers = beilageWrappers.filter(b => !!b.beilage)
		}

		this.sortieren(beilageWrappers)
		return beilageWrappers
	}


	private sortieren(liste: BeilageWrapper[]) {
		liste.sort((item1: BeilageWrapper, item2: BeilageWrapper) => {
			let res = 0
			if (item1.beilage && !item2.beilage) {
				res = -1
			} else if (!item1.beilage && item2.beilage) {
				res = 1
			}
			if (res === 0) {
				if (item1.schemaBeilageDef?.required && !item2.schemaBeilageDef?.required) {
					res = -1
				} else if (!item1.schemaBeilageDef?.required && item2.schemaBeilageDef?.required) {
					res = 1
				}

			}
			return res
		})
	}

	getProjektAktionen(): EAktionDTO[] {
		const aktionen: EAktionDTO[] = [];
		this.projekt.auftrag.phasen.forEach(p => p.leistungen.forEach(l => l.aktionen.forEach(a => aktionen.push(a))));
		return aktionen;
	}

	/**
	 * Erstellt einen Beilage-Abschnitt für dieses Formular.
	 * Zuerst wird ein Hinweis eingeblendet.
	 * Dann werden alle im Schema definierten Beilagen aufgelistet, falls vorhanden.
	 * Dazu werden vom Typ her passende Beilagen im Projeket-Pool gesucht. Für jede passende Beilage
	 * wird eine Checkbox angeboten.
	 * Wenn mehrere Beilagen auf mehrere Beilagen-Definitionen passen, wird die Beilage mehrfach angeboten,
	 * bis sie konkret ausgewählt wird.
	 * In einem weiteren Abschnitt werden alle Beilagen aus dem Projekt-Pool angeboten.
	 * @param sm der SchemaManger
	 * @returns
	 */
	async beilagenPanel(sm: SchemaManager): Promise<IComponent> {
		// changed-designer 
		const card = card_panel(sm.translate(marker('page_formular.title_attachments')), 'BEILAGEN', [
		]);
		return card;
	}

}

// die Definition eines zur Beilage zugehörigen Formulares oder Formulardefinition
export class BeilageFormular {

	private _projektService: ProjektService;
	private _dokumentDef: DokumentDefDTO;
	private _empfaenger: EmpfaengerDTO;
	private _schemaKey: number = -1;

	constructor(
		private beilageWrapper: BeilageWrapper,
		public formular: DokumentDTO,
	) {
		this._projektService = ProjektService.instance;
		this._dokumentDef = ProjektBeilagen.instance.getDokumentDef(formular?.dokumentDef?.guid);
		this._empfaenger = ProjektBeilagen.instance.getEmpfaengerByDokDef(formular?.dokumentDef?.guid);

	}

	public get dokumentDef(): DokumentDefDTO {
		return this._dokumentDef;
	}

	public get empfaenger(): EmpfaengerDTO {
		return this._empfaenger;
	}

	public get inFormular(): boolean {
		return !!this._projektService.projektBeilagen.schemaManager;
	}

	public async getSchemaKey(): Promise<number> {
		// if(this._schemaKey > -1)
		// 	return this._schemaKey;

		// ist mit diesem Formular verknüpft
		if (this.formular.beilagen?.find(b => Guid.equals(b.guid, this.beilageWrapper.beilage?.guid))) {
			this._schemaKey = await this._projektService.getDokumentBeilageSchemaKey(this.formular.guid, this.beilageWrapper.beilage.guid);
			return this._schemaKey;
		}

		return -1;
	}

	public get schemaKey(): number {
		return this._schemaKey;
	}

	public viewFormular() {
		const service = ProjektService.instance;
		const auftrag = service.CurProjekt.auftrag;

		let aktion: EAktionDTO = null;
		for (let p of auftrag.phasen) {
			for (let l of p.leistungen) {
				for (let a of l.aktionen) {
					if (Guid.equals(a.dokument?.guid, this.formular?.guid)) {
						aktion = a;
						break;
					}
				}
			}
		}
		if (aktion) {
			let success = service.Router.navigate(['/formular'], {
				queryParams: {
					guidauftrag: auftrag.guid,
					aktion: aktion.guid
				}
			});
		}
	}
}

export class BeilageEmpfaenger {

	private _translationService: TranslocoService;

	constructor(
		private _beilageWrapper: BeilageWrapper,
		public dto: EmpfaengerDTO,
	) {
		this._translationService = ProjektService.instance.translationService;
	}

	public get titel(): string {
		return getEmpfaengerLabel(this.dto);
	}

	public get beilageFormulare(): BeilageFormular[] {
		return this._beilageWrapper.beilageFormulare?.filter(bf => Guid.equals(bf.empfaenger.guid, this.dto.guid)) ?? [];
	}


	public get beilageFormular(): BeilageFormular {
		if (this.beilageFormulare.length === 1)
			return first(this.beilageFormulare);

		const beilageFormulareVerknuepft = this.beilageFormulare?.filter(
			bf => bf.formular.beilagen?.find(b => Guid.equals(b.guid, this._beilageWrapper.beilage?.guid))
		);
		if (beilageFormulareVerknuepft.length === 1)
			return first(beilageFormulareVerknuepft);

		return undefined;
	}
	public istCheckboxDisabled(schema?: ISchema, beilageFormular?: BeilageFormular): boolean {
		if (this.beilageFormular)
			return this._beilageWrapper.istCheckboxDisabled(schema, this.beilageFormular);
		return true;
	}

	public istCheckboxSichtbar(schema?: ISchema, beilageFormular?: BeilageFormular): boolean {
		if (this.beilageFormular)
			return this._beilageWrapper.istCheckboxSichtbar(schema, this.beilageFormular);
		return false;
	}

	public getIcon(schema?: ISchema, beilageFormular?: BeilageFormular): string {
		return this._beilageWrapper.getIconByEmpfaenger(this.dto);
	}

	public getIconClass(schema?: ISchema, beilageFormular?: BeilageFormular): string {
		return this._beilageWrapper.getIconClassByEmpfaenger(this.dto);
	}

	public statusText(schema?: ISchema, beilageFormular?: BeilageFormular): string {
		if (this.beilageFormular) {
			return this._beilageWrapper.statusText(schema, this.beilageFormular);
		}
		else {
			return this._translationService.translate(marker('formular_beilage.mehrere_formulare_moeglich'));
		}
	}

	public get istAttached(): boolean {
		if (this.beilageFormular) {
			return this._beilageWrapper.isAttached(this.beilageFormular);
		}
		else {
			return false;
		}
	}

	async updateIstAttached(checked: boolean) {
		if (this.beilageFormular) {
			this._beilageWrapper.updateAttached(this.beilageFormular, checked);
		}
		else {
		}
	}

	public viewFormular() {
		if (this.beilageFormular)
			this.beilageFormular.viewFormular();
	}
}
export class BeilageWrapper {
	get debugData(): any {
		return {
			this: this.thisCounter,
			titel: `${this.titel} | ${this.schemaBeilageDef?.titel}`,
			schemaDef: this.schemaBeilageDef,
			beilage: this._beilage,
			formulare: this._beilageFormulare.map(bf => { return { dokument: bf.formular, dokumentDef: bf.dokumentDef } }),
			schemas: this._schemas,
		}
	}

	isSending: boolean = false;

	constructor(
		beilage: DokumentDTO = undefined,
	) {
		this.beilage = beilage;
		this.thisCounter = ++BeilageWrapper.counter;
		this._projektBeilagen = ProjektBeilagen.instance;
		this._projektService = ProjektService.instance;
		this._dialog = this._projektService.dialog;
	}

	private static counter = 0;
	private thisCounter = 0;

	private _projektBeilagen: ProjektBeilagen;
	private _projektService: ProjektService;
	private _dialog: MatDialog;

	// Die Formulare, die mit dieser Beilage verknüpft sind
	private _beilageFormulare: BeilageFormular[] = [];
	public get beilageFormulare(): BeilageFormular[] {
		return this._beilageFormulare;
	}
	public set beilageFormulare(f: BeilageFormular[]) {
		this._beilageFormulare = f;
		const empfaengerSet = new Set<EmpfaengerDTO>(this.beilageFormulare.map(bf => bf.empfaenger));
		const empfaenger = Array.from(empfaengerSet).map(e => new BeilageEmpfaenger(this, e));
		// empfaenger.sort((a,b)=>a.dto.kategorie.)
		this._beilageEmpfaenger$.next(empfaenger);
	}

	public get currentBeilageFormular(): BeilageFormular {
		const sm = this._projektBeilagen.schemaManager;
		const bw = this;
		if (sm) {
			let bf = bw.beilageFormulare.find(bf => Guid.equals(bf.formular?.guid, sm.dokumentDTO.guid));
			if (!bf) {
				bf = new BeilageFormular(bw, sm.dokumentDTO);
				bw.beilageFormulare.push(bf);
			}
			return bf;
		}
		return null;
	}

	private _beilageEmpfaenger$: BehaviorSubject<BeilageEmpfaenger[]> = new BehaviorSubject<BeilageEmpfaenger[]>(null);
	public get beilageEmpfenger$(): Observable<BeilageEmpfaenger[]> {
		return this._beilageEmpfaenger$;
	}

	// Die Schemas welche diese Beilage verwenden
	private _schemas: ISchema[] = [];
	public get schemas(): ISchema[] {
		return this._schemas;
	}
	public set schemas(s: ISchema[]) {
		this._schemas = s;
	}
	public get schemaguids(): string[] {
		return this._schemas.map(s => s.guid);
	}
	public get schemaBeilageDef(): SchemaBeilageDef {
		for (let s of this.schemas) {
			const bd = s.beilagen?.find(bd => Guid.equals(bd.guid, this.beilageDokumentDefGuid));
			if (bd)
				return bd;
		}
		return undefined;
	}

	private _beilageDefs = new Map<string, SchemaBeilageDef>();
	public get beilageDefs(): Map<string, SchemaBeilageDef> {
		return this._beilageDefs;
	}

	private _beilage: DokumentDTO;
	public get beilage(): DokumentDTO {
		return this._beilage;
	}
	public set beilage(b: DokumentDTO) {
		this._beilage = b;
		this._dokumentDef$.next(this.beilage?.dokumentDef);
	}

	private _beilageDokumentDefGuid: string;
	public get beilageDokumentDefGuid(): string {
		return this._beilageDokumentDefGuid;
	}
	public set beilageDokumentDefGuid(guid: string) {
		this._beilageDokumentDefGuid = Guid.parse(guid).toString();
		this._projektService.GetDokumentDefApp(this._beilageDokumentDefGuid).then(
			x => this._dokumentDef$.next(x)
		);
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

	private _dokumentDef$: BehaviorSubject<DokumentDefDTOApp> = new BehaviorSubject<DokumentDefDTOApp>(null);
	public get dokumentDef$(): Observable<DokumentDefDTOApp> {
		return this._dokumentDef$;
	}

	public istBeilageVonEmpfaenger(schema: ISchema, bf?: BeilageFormular): boolean {
		// ohne Hauptformular unnd ohne Beilage kann nicht ermittelt werden ob die Beilage vom Empfänger stammt
		if (this.beilage) {
			const empfaenger = bf?.formular.dokumentDef.category //im Fall von neuem Formular, ist die category noch nicht initialisiert
				? this._projektBeilagen.getEmpfaengerByDokKat(bf.formular.dokumentDef.category)
				: this._projektBeilagen.getEmpfaengerByDokDef(schema.guid);

			const th: DokumentTransferHistoryDTO = last(this.beilage?.transferHistory?.filter(
				th => Guid.equals(th.absender, empfaenger.guid)));
			if (th)
				return true;

		}

		return false;
	}

	public istBeilageImProjektSichtbar(schema: ISchema, bf?: BeilageFormular): boolean {

		const empfaenger = bf
			? this._projektBeilagen.getEmpfaengerByDokKat(bf.formular.dokumentDef.category)
			: this._projektBeilagen.getEmpfaengerByDokDef(schema.guid);

		// Verbergen, wenn noch kein Formular exisitiert, aber die Beilage schon an den Empfänger gesendet oder vom Empfänger empfangen wurde
		if (!bf && this.beilage) {
			const th: DokumentTransferHistoryDTO = last(this.beilage?.transferHistory?.filter(
				th => Guid.equals(th.empfaenger, empfaenger.guid) || Guid.equals(th.absender, empfaenger.guid)));
			if (th)
				return false;
		}

		// Zugeordnetes Formular mit gleichem Empfänger suchen
		const attachedFormular = this.beilageFormulare.find(bf => {
			if (bf.formular?.beilagen?.find(b => Guid.equals(b?.guid, this.beilage?.guid))) {
				const attachedEmpf = this._projektBeilagen.getEmpfaengerByDokKat(bf.formular.dokumentDef.category)
				if (Guid.equals(empfaenger.guid, attachedEmpf.guid))
					return true;
			}
			return false;
		});

		// Zugeordnetes Formular ist nicht aktuelles Formular -> verbergen
		if (attachedFormular && !Guid.equals(attachedFormular.formular.guid, bf?.formular.guid))
			return false;

		// Zugeordnetes Formular ist aktuelles Formular -> anzeigen
		if (attachedFormular && Guid.equals(attachedFormular.formular.guid, bf?.formular.guid))
			return true;

		// Wenn das Formular bereits gesendet wurde, Beilagen ausblenden welche nicht an den Empfänger gesendet wurden
		if (bf && bf.formular.status >= DokumentStatus.Gesendet) {
			if (this.beilage) {
				const th: DokumentTransferHistoryDTO = last(this.beilage?.transferHistory?.filter(
					th => Guid.equals(th.empfaenger, empfaenger.guid)));
				if (!th)
					return false;
			}
			const th: DokumentTransferHistoryDTO = last(this.beilage?.transferHistory?.filter(
				th => Guid.equals(th.empfaenger, empfaenger.guid)));
			if (!th)
				return false;
		}

		// Wenn die Beilage bereits zum Empfänger geschickt wurde oder von diesem stammt und nicht mit diesem Formular verknüpft ist -> ausblenden
		const th = this.letzterTransferHistoryEintrag(bf);
		if (th)
			return false;

		return true;
	}

	public isAttached(beilageFormular?: BeilageFormular): boolean {
		if (beilageFormular?.formular && this.beilage) {
			return !!beilageFormular.formular.beilagen?.find(b => Guid.equals(b.guid, this.beilage.guid));
		}
		return false;
	}

	public async updateAttached(beilageFormular: BeilageFormular, checked: boolean, bd?: SchemaBeilageDef): Promise<void> {
		if (!beilageFormular.formular || !this.beilage) {
			return
		}
		if (!beilageFormular.formular.beilagen) {
			beilageFormular.formular.beilagen = [];
		}

		const linkDTO: DokumentBeilageLinkDTO = {
			mandant: beilageFormular.formular.mandant,
			guidDokument: beilageFormular.formular.guid,
			guidBeilage: this.beilage.guid,
			schemaKey: bd && bd.schemaKey ? bd.schemaKey : 0,
		}

		if (checked) {
			await this._projektService.LinkDokumentBeilage(linkDTO);
		}
		else {
			await this._projektService.UnlinkDokumentBeilage(linkDTO);
		}

		const sm = this._projektBeilagen.schemaManager;

		// Den lokalen Instanzen des DTO die Beilage hinzufügen, damit kein Neuladen des Formulars notwendig wird
		if (checked) {
			// zuerst die BeilageFormular instanz
			if (!beilageFormular.formular.beilagen.find(b => Guid.equals(b.guid, this.beilage.guid)))
				beilageFormular.formular.beilagen.push(this.beilage);

			// Dann die Instanz im Formulare-Service, wenn notwendig
			if (sm && sm.dokumentDTO !== beilageFormular.formular) {
				sm.formular.addBeilage(this.beilage);
			}
		}

		if (!checked) {
			// zuerst die BeilageFormular instanz
			beilageFormular.formular.beilagen = beilageFormular.formular.beilagen.filter(b => !Guid.equals(b.guid, this.beilage.guid));

			// Dann die Instanz im Formulare-Service, wenn notwendig
			if (sm && sm.dokumentDTO !== beilageFormular.formular) {
				sm.formular.removeBeilage(this.beilage);
			}
		}

		this._projektService.emitLinkBeilage(linkDTO, checked);
	}


	public letzterTransferHistoryEintrag(beilageFormular?: BeilageFormular): DokumentTransferHistoryDTO {
		if (!beilageFormular)
			return null;

		const empfaenger = this._projektBeilagen.getEmpfaengerByDokKat(beilageFormular?.formular?.dokumentDef.category);
		if (empfaenger)
			return this.letzterTransferHistoryEintragByEmpfaenger(empfaenger);

		return null;
	}

	public letzterTransferHistoryEintragByEmpfaenger(empfaenger: EmpfaengerDTO): DokumentTransferHistoryDTO {
		const th: DokumentTransferHistoryDTO = last(this.beilage?.transferHistory?.filter(
			th => Guid.equals(th.empfaenger, empfaenger.guid) || Guid.equals(th.absender, empfaenger.guid)));
		return th;
	}

	public get titel(): string {
		if (this.beilage && this.beilage.dso) {
			return getDateiNamePrint(this.beilage.dso.originalName)
		} else {
			return this.titelTyp
		}
	}

	public get titelTyp(): string {
		if (this.schemaBeilageDef?.translateTitel) {
			// return this.dokumentDef.titel
			return this._projektService.translationService.translate(this.schemaBeilageDef?.titel)
		} else {
			return this.schemaBeilageDef?.titel
		}
	}

	public statusText(schema?: ISchema, bf?: BeilageFormular): string {
		if (bf?.formular) {
			const th = this.letzterTransferHistoryEintrag(bf);
			if (th) {
				if (th.typ === TransferTyp.Versand) {
					return this._projektService.translationService.translate('formular_beilage.gesendet', { name: bf.dokumentDef?.longName });
				}
				if (th.typ === TransferTyp.Empfang) {
					return this._projektService.translationService.translate('formular_beilage.erhalten', { name: bf.dokumentDef?.longName });
				}
			}
			if (this.isAttached(bf)) {
				return this._projektService.translationService.translate(marker('formular_beilage.verknüpfen_linked'), { name: bf.dokumentDef?.longName })
			} else {
				return this._projektService.translationService.translate(marker('formular_beilage.verknüpfen_unlinked'), { name: bf.dokumentDef?.longName })
			}
		} else {
			return bf?.dokumentDef?.longName
		}
	}

	public beilageTextHint(schema?: ISchema, bf?: BeilageFormular): string {
		if (this.beilage) {
			const sm = this._projektBeilagen.schemaManager;

			if (this.istCheckboxSichtbar(schema, bf)) {

				const vbf = this.verknuepftesFormularMitGleichemEmpfaenger(bf);
				// Ist mit anderem Formular des gleichen Empfängers verknüpft -> disable
				if (vbf && !Guid.equals(bf.formular.guid, vbf.formular.guid))
					return translate(marker('formular_beilage.verknüpft_mit_anderem'));

				return '';
			}
			else {
				const th = this.letzterTransferHistoryEintrag(bf);
				if (th) {
					// nicht parseZone verwenden um korrekten, lokalen Zeitsttempel für die Anzeige zu erhalten
					const ts = moment(th.timestamp);
					let zusatz = '';
					if (sm) {
						const beilage = sm?.dokumentDTO?.beilagen?.find(b => Guid.equals(b.guid, this.beilage?.guid));
						if (beilage)
							zusatz = translate(marker('formular_beilage.mit_diesem'));
						else
							zusatz = translate(marker('formular_beilage.mit_anderem'));
					}
					const params = {
						datum: ts.format('DD.MM.YYYY HH:mm'),
						zusatz: zusatz,
					};

					if (th.typ === TransferTyp.Versand) {
						const hint = translate(marker('formular_beilage.gesendet_am'), params);
						return hint;
					}
					if (th.typ === TransferTyp.Empfang) {
						const hint = translate(marker('formular_beilage.erhalten_am'), params);
						return hint;
					}
				}
			}
		}
		return '';
	}

	public get verknuepfenText(): string {

		return this.isAttached ? translate(marker('formular_beilage.verknüpft')) : translate(marker('formular_beilage.verknüpfen'));
	}

	public get empfangeneBeilage(): boolean {
		return this.beilage?.transferHistory?.findIndex(th => th.typ == TransferTyp.Empfang) > -1;
	}

	public get beilageVerfuegbarText(): string {
		if (this.isAttached)
			return '';

		return this.beilage ? translate(marker('formular_beilage.verfügbar')) : translate(marker('formular_beilage.nicht_verfügbar'));
	}

	public istCheckboxDisabled(schema?: ISchema, bf?: BeilageFormular): boolean {
		if (!bf?.formular || !this.beilage)
			return true

		if (bf.formular?.status > DokumentStatus.Gesendet)
			return true

		const vbf = this.verknuepftesFormularMitGleichemEmpfaenger(bf);
		// Ist mit anderem Formular des gleichen Empfängers verknüpft -> disable
		if (vbf && !Guid.equals(bf.formular.guid, vbf.formular.guid))
			return true;

		// 	const bf1 = this.beilageFormulare?.find(bf1 => Guid.equals(bf1.formular.guid, bf.formular.guid));
		// if(bf1 && !Guid.equals(bf.formular.guid, bf1.formular.guid))
		// 	return true;

		return false;
	}

	private verknuepftesFormularMitGleichemEmpfaenger(bf: BeilageFormular) {
		const pb = this._projektBeilagen;
		const empfaenger = pb.getEmpfaengerByDokKat(bf.dokumentDef.category.guid);
		const vbf = // verknüpftes Beilage-Formular vom gleichen Empfänger
			this.beilageFormulare?.filter(bf_ => {
				const ef = pb.getEmpfaengerByDokKat(bf_.dokumentDef.category.guid);
				return Guid.equals(ef.guid, empfaenger.guid);
			})?.find(bf_ => {
				return bf_.formular.beilagen?.find(b => Guid.equals(b.guid, this.beilage.guid));
			});
		return vbf;
	}

	public istBereitZumSenden(schema?: ISchema, bf?: BeilageFormular): boolean {
		if (bf?.formular?.status === DokumentStatus.Gesendet) {
			const empfaenger = this._projektBeilagen.getEmpfaengerByDokKat(bf.dokumentDef.category.guid);
			// if (this.isAttached(bf) && !this.beilage.transferHistory?.find(th => Guid.equals(th.empfaenger, empfaenger.guid))) {
			if (this.isAttached(bf) && !this.letzterTransferHistoryEintrag(bf)) {
				return true;
			}
		}
		return false;
	}

	public istCheckboxSichtbar(schema?: ISchema, bf?: BeilageFormular): boolean {

		if (this.beilage && !bf)
			return true;

		if (!this.beilage)
			return true;

		if (!bf)
			return false;

		const empfaenger = this._projektBeilagen.getEmpfaengerByDokKat(bf.dokumentDef.category.guid);
		const th = last(this.beilage?.transferHistory?.filter(th => Guid.equals(th.empfaenger, empfaenger.guid) || Guid.equals(th.absender, empfaenger.guid)));
		if (th)
			return false;

		return true;
	}

	public getIcon(schema?: ISchema, bf?: BeilageFormular): string {
		if (!schema && !bf)
			return '/assets/icons/beilage_empty.svg';

		const empfaenger = this._projektBeilagen.getEmpfaengerByDokDef(schema.guid);
		return this.getIconByEmpfaenger(empfaenger);
	}

	public getIconByEmpfaenger(empfaenger: EmpfaengerDTO): string {

		if (this.beilage) {
			{
				// Bereits gesendete Beilage
				{
					const th = last(this.beilage.transferHistory?.filter(th => Guid.equals(th.empfaenger, empfaenger.guid) && [TransferTyp.Versand].indexOf(th.typ) > -1));
					if (th)
						return '/assets/icons/beilage_ok.svg';
				}
				// Empfangene Beilage
				{
					const th = last(this.beilage.transferHistory?.filter(th => Guid.equals(th.absender, empfaenger.guid) && [TransferTyp.Empfang].indexOf(th.typ) > -1));
					if (th)
						return '/assets/icons/beilage_antwort.svg';
				}
			}
		}

		return '/assets/icons/beilage_empty.svg';
	}

	public getIconClass(schema?: ISchema, bf?: BeilageFormular): string {
		if (!schema && !bf)
			return 'mt-s invisible';

		const empfaenger = this._projektBeilagen.getEmpfaengerByDokDef(schema.guid);
		return this.getIconClassByEmpfaenger(empfaenger);
	}

	public getIconClassByEmpfaenger(empfaenger: EmpfaengerDTO): string {
		const icon = this.getIconByEmpfaenger(empfaenger);
		if (icon === '/assets/icons/beilage_empty.svg')
			return 'mt-s invisible';

		return 'mt-2';
	}

	public istUploaderSichtbar(schema?: ISchema, bf?: BeilageFormular): boolean {
		if (this.beilage)
			return false;
		return true;
	}

	get isDeletable(): boolean {
		if (!this.beilage)
			return false;

		// Die Beilage wurde gesendet oder empfangen
		if (this.beilage.transferHistory && this.beilage.transferHistory.filter(th => [TransferTyp.Versand, TransferTyp.Empfang].indexOf(th.typ) > -1).length > 0)
			return false;

		const hatVerknuepfung = this.beilageFormulare.find(bf => this.isAttached(bf));
		return !hatVerknuepfung;
	}

	get iconBackgroundClass(): string {
		// {
		// 	const th = _.last(this.beilage?.transferHistory?.filter(th => Guid.equals(th.empfaenger, this.empfaenger) && [TransferTyp.Versand].indexOf(th.typ) > -1));
		// 	if (th)
		// 		return 'bg-tertiary-color-2';
		// }
		// {
		// 	const th = _.last(this.beilage?.transferHistory?.filter(th => Guid.equals(th.absender, this.empfaenger) && [TransferTyp.Empfang].indexOf(th.typ) > -1));
		// 	if (th)
		// 		return 'bg-tertiary-color-5';
		// }

		return 'bg-secondary-color-2'
	}

	async sendBeilage(sm: SchemaManager, empfaenger: EmpfaengerDTO) {
		// var answer = window.confirm(translate(marker('comp_projekt_phase.beilage_nachsenden')));
		// if (answer) {
		console.trace('Sende jetzt Beilage: ', this.beilage);

		this.isSending = true;

		if (empfaenger.transferKanal === EmpfaengerTransferKanal.M20) {
			const beilage = await sm.service.SendFormular(empfaenger.guid, this.beilage);
			this.beilage = beilage;
			this.isSending = false;
			console.trace('Beilage ist gesendet: ', this.beilage);
			sm.service.emitFormularLoadingSpinner();
			await sm.service.LoadProjekt(sm.service.CurProjekt.auftrag.guid);
			await ProjektBeilagen.instance.Init();
			sm.Schema.defaultAbschnitt = 'BEILAGEN';
			sm.service.emitReloadFormular();
		}
		else {
			const th: DokumentTransferHistoryDTO = {
				mandant: this.beilage.mandant,
				dokument: this.beilage.guid,
				absender: this._projektService.CurIdentity.holding,
				empfaenger: empfaenger.guid,
				kanal: empfaenger.transferKanal,
				typ: TransferTyp.Versand,
				timestamp: moment.utc().toISOString(),
			};

			setTimeout(async () => {
				this.beilage.transferHistory.push(th);
				await this._projektService.SaveDokument(this.beilage);

				this.isSending = false;
				console.trace('Beilage ist gesendet: ', this.beilage);

				sm.service.emitFormularLoadingSpinner();
				await sm.service.LoadProjekt(sm.service.CurProjekt.auftrag.guid);
				await ProjektBeilagen.instance.Init();
				sm.Schema.defaultAbschnitt = 'BEILAGEN';
				sm.service.emitReloadFormular();
			}, 2000);
		}
	}

	async uploadFileSelected(uploadFile: IUploadFile, bw: BeilageWrapper) {
		let beilageDTO = await this._projektService.SaveFormular(Guid.create().toString(), bw.schemaBeilageDef?.guid);
		await this._projektService.SavePDF(beilageDTO.dso.guid, uploadFile.file);
		beilageDTO = await this._projektService.LoadFormular(beilageDTO.guid, false);
		bw.beilage = beilageDTO

		const dokumentPool: EAuftragDokumentPoolDTO = {
			guidAuftrag: this._projektService.CurProjekt.auftrag?.guid,
			guidBeilage: beilageDTO.guid
		}
		await this._projektService.Save_Dokument_Pool(dokumentPool);

		const sm = this._projektService.projektBeilagen.schemaManager;
		const bf = bw.beilageFormulare.find(bf => Guid.equals(bf.formular?.guid, sm.dokumentDTO?.guid));
		this.updateAttached(bf, true);

		await this.reloadObjects()
	}


	async downloadBeilage(): Promise<void> {
		await this._projektService.DownloadFormular(this.beilage);
	}

	async deleteBeilage(): Promise<void> {
		await this._projektService.Delete_Dokument_Pool_Beilage(this.beilage.guid, this._projektService.CurProjekt);
		await this.reloadObjects()
	}

	async reloadObjects() {
		if (this._projektService.projektBeilagen.schemaManager) {
			//Innerhalb Formular
			await this._projektService.LoadProjekt(this._projektService.CurProjekt.auftrag.guid)
			this._projektService.emitReloadFormular()
		} else {
			//Innerhalb Projekt
			this._projektService.emitReloadProjekt()
		}
	}

	private async showDialog(bfd: BeilageFileDef): Promise<BeilageWrapper> {

	// 	const dialogRef = this._dialog.open(BeilageDialogComponent, { width: '80vw', height: '95vh', data: bfd, });
	// 	dialogRef.componentInstance.loading = true;
	// 	const dokDefs = await this._projektService.GetDocDefs();
	// 	dialogRef.componentInstance.loading = false;
	// 	dialogRef.componentInstance.showList(dokDefs);

	// 	return new Promise(async (resolve) => {

	// 		dialogRef.afterClosed().toPromise().then(async () => {
	// 			if (bfd.okClicked && bfd.isValid() && bfd.hasChanged()) {
	// 				let reload_ui = false
	// 				if (this.beilage) { // bestehende Beilage ändern
	// 					const dto = cloneDeep(this.beilage) as DokumentDTO;
	// 					if (!Guid.equals(bfd.dokumentDefGuid, bfd.oldDokumentDefGuid)) {
	// 						dto.dokumentDef = await this._projektService.GetDokumentDefApp(bfd.dokumentDefGuid);
	// 						reload_ui = true
	// 					}
	// 					if (bfd.fileName != bfd.oldfileName) {
	// 						dto.dso = cloneDeep(this.beilage.dso) as DsoDTO;
	// 						dto.dso.originalName = bfd.fileName;
	// 					}
	// 					this.beilage = await this._projektService.SaveDokument(dto);
	// 				}
	// 				else { // neue Beilage erstellen
	// 					const auftrag = this._projektService.CurProjekt.auftrag;
	// 					this.beilage = await this._projektService.SavePDF_as_PoolBeilage(auftrag, bfd.file, bfd.dokumentDefGuid, bfd.beilageGuid);
	// 					reload_ui = true
	// 				}
	// 				if (reload_ui) {
	// 					if (this._projektService.CurProjekt) {
	// 						await this._projektService.LoadProjekt(this._projektService.CurProjekt?.auftrag?.guid)
	// 					}
	// 					if (this._projektService.CurDokument) {
	// 						this._projektService.emitReloadFormular()
	// 					}
	// 				}
	// 			}
	// 			return resolve(this);
	// 		});
	// 	});
	return null;
	}

	static async newBeilage(file: File): Promise<BeilageWrapper> {
		const bfd = new BeilageFileDef
		bfd.file = file
		bfd.fileName = file.name
		const wrapper = new BeilageWrapper();
		bfd.beilageWrapper = wrapper
		return await wrapper.showDialog(bfd);
	}

	viewBeilage() {
		if (this.beilage?.dso && this.beilage?.dokumentDef) {
			const bfd = new BeilageFileDef
			bfd.beilageGuid = this.beilage.guid
			bfd.beilageDsoGuid = this.beilage.dso.guid
			bfd.fileName = this.beilage.dso.originalName
			bfd.oldfileName = this.beilage.dso.originalName
			bfd.dokumentDefGuid = this.beilage.dokumentDef.guid
			bfd.oldDokumentDefGuid = this.beilage.dokumentDef.guid
			bfd.beilageWrapper = this

			this.showDialog(bfd);
		}
	}

	hasError(): boolean {
		let showError = false
		if (this.schemaBeilageDef?.required && this._projektService.projektBeilagen.schemaManager) {
			if (this._projektService.projektBeilagen.schemaManager.Errors.findIndex(e => e.error === this._projektService.projektBeilagen.schemaManager.beilageError) > -1) {
				if (!this.beilage || !this.isAttached) showError = true
			}
		}
		return showError
	}

}

export class BeilageFileDef {
	public beilageGuid: string;
	public beilageDsoGuid: string;
	public file: File;
	public fileName: string;
	public dokumentDefGuid: string;
	public oldfileName: string;
	public oldDokumentDefGuid: string;
	public beilageWrapper: BeilageWrapper;
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
