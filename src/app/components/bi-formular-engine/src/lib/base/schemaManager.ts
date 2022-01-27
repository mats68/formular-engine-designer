import { Inject, Injectable } from '@angular/core';
import { strings } from './strings';
import { ISchema, IComponent, ComponentType, ISelectOptionItems, DataType, IScreenSize, IAppearance, SchemaKeys, ComponentKeys, IMussfelder, IComponentString, ITranslatableString } from './types';
import { err_schema, err_notype, err_typewrong, err_noChild, err_zeroChild, err_noField, err_doubleField, err_doubleName, err_noOptions, err_OptionsArray, err_zeroOptions, err_wrongOptions, err_OptionsDoubleValues, err_noIcon, err_noDataTableInDataTable, err_noDataTableNoField, err_unn } from './constants'
import { Subject } from 'rxjs';
import { cloneDeep, merge, get, set } from 'lodash-es';

import * as moment_ from 'moment';
import { FormulareService } from 'src/app/services/formulare-service/formulare-service.service';
import { Formular } from 'src/app/services/formulare-service/Formular';
import { DokumentDTO, DokumentStatus, EProjektDTO } from 'src/app/api';
import { ProjektService } from 'src/app/services';
// changed-designer import { AuthorizationService } from 'src/app/modules/auth/authorization.service';
import { FormularState } from 'src/app/services/formulare-service/FormularBase';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { Guid } from 'src/app/tools/Guid';
const moment = moment_;


/**
 * Diese Konstante stellt die Standardeinstellungen für Schema Manager Instanzen bereit.
 */
export const SCHEMA_MANAGER_DEFAULT_SETTINGS: ISettings = {
	date: {
		parse: {
			dateInput: 'DD.MM.YYYY',
		},
		display: {
			dateInput: 'DD.MM.YYYY',
			monthYearLabel: 'MMM YYYY'
		}
	},
	language: 'de',
	requiredSuffix: ''
} as ISettings;

/**
 * Diese Schnittstelle definiert die Basis für Schema Manager Instanzeinstellungen.
 */
export interface ISettings {
	requiredSuffix: string;
	language: string;
	date: {
		parse: {
			dateInput: string,
		},
		display: {
			dateInput: string,
			monthYearLabel: string,
		},
	}
}

/**
 * Diese Schnittstelle definiert die Basis für einen Dienst/Service, welcher Texte die innerhalb der Brunner Informatik
 * AG Formular Engine verwendet werden, übersetzt in die konfigurierte Sprache.
 */
export interface ISchemaManagerTranslator {
	translate(
		language: string,
		key: string,
		values: { [key: string]: any },
		options: any,
		system: boolean
	): string;
}

export class DefaultSchemaManagerTranslator
	implements ISchemaManagerTranslator {
	public translate(
		language: string,
		key: string,
		values: { [key: string]: any },
		options: any,
		system: boolean
	): string {
		const languageStrings = strings[language];
		const keyString = (languageStrings ? languageStrings[key] : undefined);

		if (keyString as string) {
			return keyString as string;
		}
		else {
			return `${key}/${language}`;
		}
	}
}

export interface IError {
	comp: IComponent;
	arrayInd: number; //index of array in data-table
	error: string;
}

export type ITraverseCallback = (comp: IComponent, parent?: IComponent, options?: ITraverseOptions) => void;

export interface ITraverseOptions {
	done?: boolean;
	fullTraverse?: boolean;
}


export interface IHighlight {
	comp: IComponent;
	arrayInd: number;
}


export enum ISchemaErrorType {
	error = 'error',
	warning = 'warning',
}

export enum IValueType {
	undefined = 'undefined',
	null = 'null',
	string = 'string',
	number = 'number',
	boolean = 'boolean',
	function = 'function',
	array = 'array',
	object = 'object',
	component = 'component',
}

export interface ISchemaError {
	error: string;
	type: ISchemaErrorType;
	comp: IComponent;
}

/**
 * Diese Schnittstelle stellt eine namensbasierte indexierte Sammlung für Schema Manager Dienste/Services bereit.
 */
export interface ISchemaManagerServices {
	[name: string]: any;
}

/**
 * Diese Schnittstelle definiert die Basis für einen Schema Manager Context.
 */
export interface ISchemaManagerContext {
	/**
	 * Ruft die Einstellungen der Schema Manager Instanz ab oder setzt diese.
	 */
	settings: ISettings;

	/**
	 * Ruft die Sammlung and Diensten/Services für die verwendung innerhalb der Schema Manager Instanz ab oder setzt
	 * diese.
	 */
	services?: ISchemaManagerServices;

	/**
	 * Ruft dei Implementierung des Übersetzers zu verwendung innerhalb der Schema Manager Instanz ab oder setzt diese.
	 */
	translator?: ISchemaManagerTranslator;

	/**
	 * Ruft die benutzerdefinierten Daten für die Verwendung innerhalb der Schema Manager Instanz ab oder setzt diese.
	 */
	userData?: any;
}

@Injectable({ providedIn: 'root' })
export class SchemaManagerProvider
	implements ISchemaManagerContext {
   constructor(@Inject('context') private context: ISchemaManagerContext) {  // changed-designer 
		if (!context) {
			context = {} as ISchemaManagerContext;
		}

		if (!context.settings) {
			context.settings = Object.assign({}, SCHEMA_MANAGER_DEFAULT_SETTINGS);
		}

		if (!context.services) {
			context.services = {} as ISchemaManagerServices;
		}

		if (!context.translator) {
			context.translator = new DefaultSchemaManagerTranslator();
		}

		Object.assign(this, context);

		return;
	}

	public createSchemaManager(): SchemaManager {
		return __schemaManagerConstructor(this);
	}

	public settings: ISettings;
	public services: ISchemaManagerServices;
	public translator: ISchemaManagerTranslator;
	public userData: any;
}

/**
 * Diese Modul-Variable speichert die Funktion, welche zum Konstruieren neuer `SchemaManager` Instanzen benötigt wird.
 *
 * Für weitere Details siehe `SchemaManager._initialize()`.
 */
let __schemaManagerConstructor: { (ISchemaManagerContext): SchemaManager };

export class SchemaManager {
	/**
	 * Dieser statische Konstruktor nach JavaScript/TypeScript Art übernimmt die initialisierung der
	 * `__schemaManagerConstructor` Modul-Variable. Diese Funktion wird von der `SchemaManagerProvider` Klasse benötigt,
	 * um neue `SchemaManager` Instanzen zu konstruieren.
	 *
	 * Dies ist so gelöst, damit `new SchemaManager()` nicht möglich ist und somit verwirrung vorgebeugt wird.
	 */
	private static _initialize = (() => {
		// "this" cannot be used here
		__schemaManagerConstructor = (context: ISchemaManagerContext) => new SchemaManager(context);
	})();

	/**
	 * Dieses Feld speichert den Kontext dieser Schema Manager Instanz, welche die Einstellungen sowie die benötigten
	 * Dienste/Services bereitstellt.
	 */
	private readonly _context: ISchemaManagerContext;

	get dokumentDTO(): DokumentDTO {
		// changed-designer 
		return {} as DokumentDTO
	}

	get formularStatus(): DokumentStatus {
		// changed-designer 
		return DokumentStatus.InArbeit
	}

	get formular(): Formular {
		// changed-designer 
		//@ts-ignore
		return {}

		// if (this.formulareService?.formular) {
		// 	return (this.formulareService.formular as Formular);
		// }
	}

	get formulareService(): FormulareService {
		return this.getService('formulare-service') as FormulareService;
	}

	// changed-designer get autorisierungsService(): AuthorizationService {
	// 	return this.getService('authorisierung-service') as AuthorizationService;
	// }

	get service(): ProjektService {
		return this.getService('projekt-service') as ProjektService;
	}

	get projekt(): EProjektDTO {
		return this.service.CurProjekt
	}


	Schema: ISchema;
	private _Values: any;

	get Values(): any {
		return this._Values
	}

	set Values(values: any) {
		this.createValuesProxy(values || {});
		// console.log(new Error().stack);
		// console.log('Values object set: ', this._Values)
	}

	private createValuesProxy(values: any) {
		this._Values = new Proxy(values, {
			set: function (target: any, property: string, value: any) {
				// console.log(`Values property set: ${property} value: ${value}`)
				target[property] = value;
				return true;
			}
		});
	}

	public readonly beilageError = '_beilage-error'

	// DruckValues: any;
	DiffValues: any;
	MemValues: any = {};
	ValuesChanged: boolean;
	FormularInitialised: boolean;
	Strings: any;
	disCounter: number = 0

	Errors: IError[];
	public get hasError() { return this.Errors && this.Errors.length > 0 }
	SchemaErrors: ISchemaError[];
	highlightedFields: IHighlight[];
	AllValidating: boolean;
	AllValidated: boolean;

	OnFocus: Subject<IComponent>;
	OnChange: Subject<IComponent>;
	OnNextStep: Subject<IComponent>;
	OnAutocompleteClose: Subject<IComponent>;

	AllDisabled: boolean;

	DisableAll(disabled: boolean = true) {
		if (this.AllDisabled !== disabled) {
			this.AllDisabled = disabled;
		}
		this.disCounter++
	}

	public setDisabled(comp: IComponent, disable: boolean) {
		comp.disabled = disable
		this.disCounter++
	}

	private _ScreenSize: IScreenSize;
	get ScreenSize(): IScreenSize {
		return this._ScreenSize;
	}

	set ScreenSize(val: IScreenSize) {
		if (this._ScreenSize !== val) {
			this._ScreenSize = val;
			if (this.Schema?.onResize) {
				this.Schema.onResize(this)
			}
		}
	}


	private _NeedsRefreshUI: boolean = false;
	get NeedsRefreshUI(): boolean {
		return this._NeedsRefreshUI;
	}
	refresh_UI() {
		setTimeout(() => this._NeedsRefreshUI = true);
		setTimeout(() => this._NeedsRefreshUI = false);
	}

	/**
	 * Initialisierte eine neue `SchemaManager` Instanz mit dem spezifizierten Kontext.
	 *
	 * Diesen Konstruktor unbedingt private belassen, neue Instanzen mittels einer Instanz der  `SchemaManagerProvider`
	 * Klasse erstellen!
	 *
	 * @param context
	 *		Der zu verwendende Schema Manager Kontext.
	 *
	 * @returns
	 * 	Die neu konstruierte `SchemaManager` Instanz.
	 */
	private constructor(context: ISchemaManagerContext) {
		// Wurde ein gültiger Schema Manager Kontext spezifiziert?
		if (!context || !context.settings || !context.settings.date) {
			// Nein, wirf eine entsprechende Ausnahme!
			throw Error('An invalid Schema Manager Context has been specified!');
		}

		// Wurde die optionale 'Services' Sammlung initialisiert?
		if (!context.services) {
			// Nein, initialisiere die optionale 'Services' Sammlung nun.
			context.services = {} as ISchemaManagerServices;
		}

		// Speichere die Kontext Instanz nun intern.
		this._context = context;

		// Initialisiere nun die Einstellungen dieser Schema Manager Instanz.
		this.InitSettings();

		this.createValuesProxy({});

		// Initialisiere als nächstes diese Schema Manager Instanz für die aktuelle Grösse des Browser-Fensters.
		this.InitScreenSize();

		// Initialisiere die observierbaren Sammlungen der Komponenten welche das 'onFocus' sowie das 'onCahnge' Event
		// erhalten sollen.
		this.OnFocus = new Subject<IComponent>();
		this.OnChange = new Subject<IComponent>();
		this.OnNextStep = new Subject<IComponent>();
		this.OnAutocompleteClose = new Subject<IComponent>();

		setTimeout(() => this.checkForValueChangesTimeout(), 500);
	}

	private async checkForValueChangesTimeout() {
		try {
			this.checkForValueChanges();
		}
		finally{
			setTimeout(() => this.checkForValueChangesTimeout(), 500);
		}
	}

	public async checkForValueChanges() {
		try {
			// Nur machen wenn wirklich ein Formular angezeigt wird
			if (this.Schema && this.Schema.guid) {
				// if (this.formular && this.formularStatus <= DokumentStatus.InArbeit) {
					if (Guid.equals(this.formular?.dokumentDef, this.Schema?.guid)) {
						if (this.formular && this.ValuesChanged) {
							this.formular.setFieldSetValue(this.Schema.attribut, 0, JSON.stringify(this.Values));
							this.ValuesChanged = false;
						}
					// }
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	public static create(context?: ISchemaManagerContext): SchemaManager {
		return new SchemaManagerProvider(context).createSchemaManager();
	}

	public get Context(): ISchemaManagerContext {
		// Gib den intern gespeicherten Kontext zurück.
		return this._context;
	}

	public get Settings(): ISettings {
		return this.Context.settings;
	}

	public get Services(): ISchemaManagerServices {
		return this.Context.services;
	}

	public get Translator(): ISchemaManagerTranslator {
		return this.Context.translator;
	}

	public getService<TService>(name: string): TService {
		const service = this.Context.services[name];

		return service as TService || null;
	}

	public translate(
		key: string | ITranslatableString,
		values?: { [key: string]: any },
		options?: any
	): string {
		if (
			typeof (key) === 'object' &&
			typeof (key.key) === 'string'
		) {
			const ts: ITranslatableString = key as ITranslatableString;

			return this.translate(ts.key, ts.values, ts.options);
		}
		else {
			return this.Translator?.translate(
				this.Settings.language,
				<string>key,
				values,
				options,
				false
			) || <string>key;
		}
	}

	InitSchema(schema: ISchema) {

		this.SchemaErrors = []
		if (SchemaManager.checkValueType(schema) !== IValueType.component) {
			this.SchemaErrors.push({ type: ISchemaErrorType.error, error: err_schema, comp: this.Schema })
			return;
		}

		this.Schema = cloneDeep(schema);
		if (this.Schema.inheritFrom) this.InitInherits();
		this.Errors = [];
		this.AllValidated = false;
		if (this.Schema.onInitSchema) this.Schema.onInitSchema(this);
		this.traverseSchema((c, p) => {
			c.parentComp = p;
		});
		this.InitValues(this.Values);

	}

	private InitInherits() {
		const getComp = (CompArray: IComponent[], name: string, field: string = ''): IComponent | undefined => {
			if (name) {
				return CompArray.find(c => c.name === name);
			} else if (field) {
				return CompArray.find(c => c.field === field);
			}
			return undefined;
		}

		if (this.Schema.inheritFrom.inheritFrom) {
			console.error('inherits schema should not have a inherits schema himself !');
			return;
		}

		const updateArray = (schema: ISchema): IComponent[] => {
			let arr: IComponent[] = [];
			const o: ITraverseOptions = { fullTraverse: true };
			this.traverseSchema((c, p) => {
				c.parentComp = p;
				arr.push(c);
			}, o, schema);
			return arr;
		}

		const baseSchema: ISchema = cloneDeep(this.Schema.inheritFrom);
		baseSchema.name = this.Schema.name;


		let compsBase = updateArray(baseSchema);
		let compsExt = updateArray(this.Schema);

		// neue Komponenten hinzufügen
		compsExt.forEach(ec => {
			compsBase = updateArray(baseSchema);
			let bc = getComp(compsBase, ec.name, ec.field);
			if (!bc && ec.parentComp) {
				bc = getComp(compsBase, ec.name, ec.field);
				if (bc && bc.children) {
					bc.children.push(ec);
				}
			}
		})


		compsExt.forEach(ec => {
			var bc = getComp(compsBase, ec.name, ec.field);
			if (bc) {
				merge(bc, ec);
			}
		})
		this.Schema = baseSchema;

	}

	InitValues(values: any) {
		if (values && Object.keys(values).length > 0) {
			this.Values = values;
		} else {
			this.Values = {};
			this.traverseSchema(c => {
				if (c.field && (typeof c.default !== 'undefined')) {
					if (c.type !== ComponentType.datatable && !this.fieldIsInDataTable(c)) {
						const val = this.getPropValue(c, 'default');
						set(this.Values, c.field, val);
					}
				}
			});
		}
		this.traverseSchema(c => {
			if (c.onInit)
				c.onInit(this, c, this.Values[c.field])
		});
		this.Errors = [];
		this.AllValidated = false;
		this.ValuesChanged = false;

		if (this.Schema.onInitValues) this.Schema.onInitValues(this);
	}

	static formatDate(date: Date, format: string = 'DD.MM.YYYY'): string {
		return moment(date).format(format)
	}


	InitValuesArray(comp: IComponent, Values: any) {
		if (comp.type !== ComponentType.datatable) return;
		comp.detailComponent.children.forEach(c => {
			if (c.field && c.default) {
				const val = this.getPropValue(c, 'default');
				set(Values, c.field, val);
			}
		});
	}

	InitSettings() {
		this.Strings = strings[this.Settings.language];
	}

	InitScreenSize() {
		if (screen.width >= 1200) {
			this.ScreenSize = 'lg';
		} else if (screen.width >= 992) {
			this.ScreenSize = 'md';
		} else if (screen.width >= 768) {
			this.ScreenSize = 'sm';
		} else {
			this.ScreenSize = 'xs';
		}
	}

	resolveValue(value: any, methodResolver?: { (Function): any }): any {
		// Rufe den  Typ des spezifizierten Wertes ab und speichere diese dann in einer lokalen Variable.
		const type: string = typeof (value);

		// Undefinierter Wert.
		if (type === 'undefined') {
			// Gib den Wert 'undefiniert' zurück.
			return undefined;
		}
		// Der Wert ist eine Funktion.
		else if (type === 'function') {
			// Rufe die Funktion mittels der spezifizierten `Methoden`-Resolve Funktion auf und gib deren Wert zurück.
			// Wurde keine spezielle Methode spezifiziert, rufe die Methode nur mit dem Schema-Manager auf.
			return methodResolver ? methodResolver(value) : value(this, null);
		}
		// Der Wert ist ein Objekt und es ist eine `TranslatableString` Instanz.
		else if (type === 'object') {
			// Interpretiere das spezifizierte Objekt als `IComponentString`-Objekt und speichere dieses in einer lokalen
			// Variable.
			const componentString: IComponentString = value as IComponentString;

			// Wurde eine Funktion zum ermitteln des Textes spezifiziert?
			if (typeof (componentString.function) === 'function') {
				// Ja, also rufe die Funktion mittels der spezifizierten `Methoden`-Resolve Funktion auf und gib deren Wert
				// zurück. Wurde keine spezielle Methode spezifiziert, rufe die Methode nur mit dem Schema-Manager auf.
				return methodResolver ? methodResolver(componentString.value) : componentString.function(this, null);
			}
			// Wurde ein Übersetzungsschlüssel spezifiziert, sowie allfällige Parameterwerte zum ersetzen?
			else if (typeof (componentString.translation) === 'object') {
				// Ja, also übersetze den Text und gib diesen dann zurück.
				return this.translate(componentString.translation as ITranslatableString);
			}
			// Wurde ein explizierter Wert spezifiziert?
			else if (typeof (componentString.value) !== 'undefined') {
				// Ja, also gib diesen zurück als text.
				return componentString.value as string;
			}
		}

		// Kein spezieller Wert, gib den Wert zurück so wie er ist.
		return value;
	}

	getPropValue(comp: IComponent, prop: string): any {
		// Rufe den Wert der spezifizierten Komponenteneigenschaft ab und ermittle dan deren Wert. Gib diesen dann
		// zurück.
		const val = comp ? comp[prop] : undefined;
		return this.resolveValue(
			val,
			(f) => f(this, comp)
		);
	}

	getLabel(comp: IComponent): string {
		if (comp.type === 'label' && comp.field && this.Values) {
			let val = this.Values[comp.field]
			// if (comp.isDiffComp) {
			// 	val = this.DiffValues[comp.field]
			// }

			if (SchemaManager.hasNoValue(val) === false) {
				if (comp.dataType === 'date') {
					// const momentDT = moment.parseZone(val, moment.ISO_8601, true);
					const momentDT = moment(val);
					const d = momentDT.format('DD.MM.YYYY');
					return d;
				}
				return val
			}
		}

		return this.getPropValue(comp, 'label') + (comp.required ? this.Settings.requiredSuffix : '');
	}

	static hasNoValue(value: any): boolean {
		const typ = SchemaManager.checkValueType(value);
		let noVal = false;

		if (typ === IValueType.undefined || typ === IValueType.null) {
			noVal = true;
		} else if (typ === IValueType.string && value === '') {
			noVal = true;
		} else if (typ === IValueType.array && value.length === 0) {
			noVal = true;
		}

		return noVal;
	}

	getParentValues(comp: IComponent, values: any, arrayInd: number = -1): any {
		const pcomp = this.getParentDataTable(comp)
		if (pcomp && pcomp.type === ComponentType.datatable) {
			let ind = arrayInd;
			if (ind === -1) {
				const typ = SchemaManager.checkValueType(pcomp.curRowInd);
				if (typ === IValueType.number) {
					ind = pcomp.curRowInd;
				}
			}
			if (ind > -1) {
				const a = get(values, pcomp.field)
				if (a) return a[ind]
				// return values[pcomp.field][ind];
			}
			return null;
		}
		return values;
	}

	getValue(comp: IComponent, values: any = null, arrayInd: number = -1): any {  //values could be diff-values
		if (!comp.field) {
			console.error('field not specified ! name: ', comp.name, 'type: ', comp.type);
			return undefined;
		}
		let Values = values ? values : comp.unbound ? this.MemValues : this.Values
		Values = this.getParentValues(comp, Values, arrayInd);
		const val = get(Values, comp.field);

		if (SchemaManager.hasNoValue(val)) {
			if (comp.type === 'checkbox') {
				return false;
			}
			if (comp.type === ComponentType.datatable || comp.type === ComponentType.checklistbox) {
				return [];
			}
			return '';
		}
		return val;
	}
	async loadValuesFromDB(DokumentGuid: string) {
		// this.formulareService.unloadFormular(true)
		await this.formulareService.loadFormularAsync(DokumentGuid)
		const setValues = (doc: DokumentDTO, diffValues?: boolean) => {
			if (doc?.dso?.data?.length > 0) {
				if (diffValues) {
					this.DiffValues = JSON.parse(doc.dso.data[0].daten)
					console.log('this.DiffValues', this.DiffValues)
				} else {
					this.Values = JSON.parse(doc.dso.data[0].daten)
					console.log('this.Values', this.Values)
				}
			}
		}

		this.DiffValues = null
		// Rückantwort vom vnb
		if (this.formular?.dokumentDTO?.antwort) {
			setValues(this.formular.dokumentDTO.antwort)
			setValues(this.formular.dokumentDTO, true)
		} else {
			setValues(this.formular?.dokumentDTO)
		}
		this.service.CurDokument = this.formular?.dokumentDTO
		this.InitDiff()

		this.disable_from_status()

	}

	compareDiffVal(comp: IComponent, arrayInd?: number): boolean {
		const val = this.getValue(comp, null, arrayInd)
		const diffval = this.getValue(comp, this.DiffValues, arrayInd)
		if (comp.type === 'date' || comp.dataType == 'date') {
			if(!val && !diffval){
				return true;
			}
			else{
				return moment(val).isSame(moment(diffval));
			}
		} else {
			return val == diffval;
		}
	}

	compareDiffObjVal(comp: IComponent, arrayInd: number): void {
		const val = this.getValue(comp)
		const diffval = this.getValue(comp, this.DiffValues)
		let array_val = val as any[]
		let array_diffval = null
		if (SchemaManager.checkValueType(diffval) === IValueType.array) {
			array_diffval = diffval as any[]
		}
		if (!array_diffval) {
			return
		}
		if (!(array_diffval.length > arrayInd)) {
			return
		}
		const arr_val = array_val[arrayInd]
		let hasdiff = false
		Object.keys(arr_val).forEach(k => {
			const sub_field = this.getCompByField(k)
			if (sub_field) {
				if (!this.compareDiffVal(sub_field, arrayInd)) {
					set(sub_field, 'diff.showDiffBtn', true)
					if (!sub_field.diff.arrayInds) {
						sub_field.diff.arrayInds = []
					}
					sub_field.diff.arrayInds.push(arrayInd)

					hasdiff = true
				}
			}
		})
		if (hasdiff) {
			comp.diff.arrayInds.push(arrayInd)
		}
	}


	private InitDiff() {
		if (!this.DiffValues) {
			return
		}
		this.traverseSchema(c => {
			if (c.diff) {
				c.diff.showDiffBtn = false;
			}
		});

		this.traverseSchema(c => {
			if (c.field && c.type !== 'datatable' && !this.fieldIsInDataTable(c)) {
				if (!this.compareDiffVal(c)) {
					let diffcomp = c
					if (c.diff) {
						if (c.diff.diff_comp_name) {
							diffcomp = this.getCompByName(c.diff.diff_comp_name)
							if (!diffcomp) console.error(`diff comp not found name:${c.diff.diff_comp_name} !`)
						}
						if (c.diff.diff_comp_field) {
							diffcomp = this.getCompByField(c.diff.diff_comp_field)
							if (!diffcomp) console.error(`diff comp not found field:${c.diff.diff_comp_field} !`)
						}
					}
					if (diffcomp) {
						set(diffcomp, 'diff.showDiffBtn', true)
					}
				}
			}

			if (c.field && c.type === 'datatable') {
				const val = this.getValue(c)
				set(c, 'diff.showDiffBtn', true)
				c.diff.arrayInds = []
				if (SchemaManager.checkValueType(val) === IValueType.array) {
					const arr_val = val as any[]
					for (let ind = 0; ind < arr_val.length; ind++) {
						this.compareDiffObjVal(c, ind)
					}

				}
			}
		});

	}

	GetDiffValueAsText(comp: IComponent, showEmptyText: boolean, css?: string): string {
		let res = ''
		const css_class = css || ''
		let val: any = ''
		if (comp.field) {
			val = this.getValue(comp, this.DiffValues)
		}
		let emptyTextSet = false;
		if (!val) {
			if (showEmptyText) {
				val = this.translate(marker('comp_input.diff_kein_wert'));
				emptyTextSet = true;
			} else {
				val = ''
			}
		}

		if (comp.type === 'checkbox') {
			const cb = (val === true) ? '2611' : '2610'
			res = `<span class='${css_class}'>&#x${cb}</span><span class='${css_class}'>${this.getLabel(comp)}</span>`
		}
		else if (comp.type === 'label') {
			if (comp.dataType === 'date' && !emptyTextSet) {
				const datum = val ? moment(val).format('DD.MM.YYYY') : '';	// Wert ist nicht leer => Versuche Datum zu konvertieren
				res = `<span class='${css_class}'>${datum}</span>`
			}
			else{
				res = `<span class='${css_class}'>${val}</span>`			// Wert ist leer => Text für kein Wert wird gesetzt
			}
		}
		else if (comp.type === 'date' && !emptyTextSet) {
			const datum = val ? moment(val).format('DD.MM.YYYY') : '';		// Wert ist nicht leer => Versuche Datum zu konvertieren
			res = `<span class='${css_class}'>${datum}</span>`
		} else if (comp.type === 'input' || comp.type === 'radiogroup' || comp.type === 'date') {
			res = `<span class='${css_class}'>${val}</span>`				// Wert ist leer => Text für kein Wert wird gesetzt
		}
		else if (comp.type === 'panel' && comp.diff?.showDiffBtn) {
			this.traverseSchema(f => {
				if (f !== comp) res = res + this.GetDiffValueAsText(f, false, 'mr-2')
			}, undefined, comp)

		}
		return res

	}


	async saveStatus(status: DokumentStatus) {
		if (this.formular) {
			if(this.dokumentDTO.status == DokumentStatus.Undefiniert && status === DokumentStatus.InArbeit){
				this.formular.status = status as DokumentStatus;
				this.service.emitFormularStatusChange(this.formular.status)
				return;
			}

			if(this.formular.state === FormularState.Modified) {
				setTimeout(() => {this.saveStatus(status) }, 200)
			}
			else {
				this.formular.status = status as DokumentStatus;
				this.service.emitFormularStatusChange(this.formular.status)
				this.disable_from_status()
			}
		}
	}

	disable_from_status() {
		if (this.formular.status >= DokumentStatus.SigniertGesperrt) {
			this.DisableAll(true)
		} else {
			this.DisableAll(false)
		}
	}

	setValue(field: string, value: any, arrayInd: number = -1): boolean {
		const comp = this.getCompByField(field)
		if (!comp) {
			console.warn('component for field not specified ! field: ', field);
			return false;
		}
		this.updateValue(comp, value, arrayInd)
		return true

	}

	setValues(fields: string[], values: any[], arrayInd: number = -1): boolean {
		if (fields.length !== values.length) {
			console.error('setValues array not the same length!')
			return false
		}

		let err = false
		fields.forEach((feld, ind) => {
			if (!this.setValue(feld, values[ind], arrayInd)) err = true
		})
		return err

	}

	updateValue(comp: IComponent, val: any, arrayInd: number = -1): void {

		if (!comp.field) {
			console.error('field not specified ! name: ', comp.name, 'type: ', comp.type);
			return;
		}

		let Values = comp.unbound ? this.MemValues : this.Values
		Values = this.getParentValues(comp, Values, arrayInd);

		if (comp.dataType === DataType.float) {
			val = parseFloat(val);
			if (isNaN(val)) val = null;

		} else if (comp.dataType === DataType.int) {
			val = parseInt(val);
			if (isNaN(val)) val = null;
		}

		const curVal = get(Values, comp.field);
		if (curVal === val) return;
		set(Values, comp.field, val);

		// this.UpdateDruckValue(comp)

		this.validate(comp, val, arrayInd)
		// this.checkRemoveRequiredError(comp, val);

		if (comp.onChange) {
			comp.onChange(this, comp, val);
		}


		if (this.Schema.onChange) {
			this.Schema.onChange(this, comp, val);
			this.OnChange.next(comp);
		}

		this.ValuesChanged = true;
	}

	validate(comp: IComponent, value: any, arrayInd: number = -1): void {

		if (arrayInd === -1 && this.fieldIsInDataTable(comp)) {
			const pd = this.getParentDataTable(comp)
			arrayInd = pd.curRowInd;
		}
		this.removeErrors(comp, arrayInd);
		if (comp.required && comp.type !== 'panel') {
			if (SchemaManager.hasNoValue(value)) {
				if (this.AllValidating || this.AllValidated) {
					this.addErrors(comp, this.translate(marker('page_projekt_wizard.error_input_required')), arrayInd);
				}
			}
		}
		if (comp.validate) {
			const errs = comp.validate(this, comp, value);
			if (errs) {
				//Fehler erst einfügen und anzeigen, nachdem einmal validateAll() aufgerufen wurde (z.B. beim Signieren)
				if (this.AllValidating || this.AllValidated) {
					this.addErrors(comp, errs, arrayInd);
				}
			} else {
				this.removeErrors(comp, arrayInd);
			}
		}
		if (comp.dataType === 'int') {
			if (!SchemaManager.hasNoValue(value)) {
				if (typeof comp.min !== 'undefined') {
					if (value < comp.min) {
						this.addErrors(comp, this.translate(marker('comp_input.min_wert_error')), arrayInd)
					 }
				}
				if (typeof comp.max !== 'undefined') {
					if (value > comp.max) {
						this.addErrors(comp, this.translate(marker('comp_input.max_wert_error')), arrayInd)
					 }
				}
				// Maximaler Int-Wert auf DB
				if (value > 2147483647) {

					this.addErrors(comp, this.translate(marker('comp_input.max_int_wert_error')), arrayInd)
				}
			}
		}
	}

	validateAll(panel?: IComponent) {
		const _panel = panel || this.Schema
		const validate_full_schema: boolean = !panel 
		this.Errors = []
		this.AllValidating = true;
		this.validate(this.Schema, '');
		this.traverseSchema(c => {
			if (c.field) {
				if (c.type === ComponentType.datatable) {
					const arrVal = get(this.Values, c.field);
					this.validate(c, arrVal);
					const typ = SchemaManager.checkValueType(arrVal);
					if (typ === IValueType.array) {
						arrVal.forEach((obj, ind) => {
							this.traverseSchema(comp => {
								if (comp.field) {
									const value = get(obj, comp.field);
									this.validate(comp, value, ind);
								}

							}, undefined, c)
						})
					}
				} else if (!this.fieldIsInDataTable(c)) {
					const value = this.getValue(c);
					this.validate(c, value);
				}
			}
		}, undefined, _panel);
		if (validate_full_schema && this.Schema.validate) {
			const errs = this.Schema.validate(this, this.Schema, null);
			if (errs) {
				this.addErrors(this.Schema, errs);
			}
		}

		// Required Beilagen valdieren
		if (validate_full_schema && this.Schema.beilagen) {
			// console.log('beilagen def: ', this.Schema.beilagen)
			// console.log('beilagen erstellt: ', this.dokumentDTO.beilagen)
			let hasBeilageRequiredError = false

			this.Schema.beilagen.forEach(def_b => {
				if (def_b.required) {
					const beilage_erstellt = this.dokumentDTO.beilagen.find(dok_b => Guid.equals(dok_b.dokumentDef.guid, def_b.guid))
					if (!beilage_erstellt) {
						hasBeilageRequiredError = true
						// this.addErrors(this.Schema, 'Beilage');
						// alert('Beilage nicht erstellt')
					}
				}
			})

			if (hasBeilageRequiredError) {
				let comp: IComponent = this.getCompByName(this.beilageError)
				if (!comp) {
					comp = {
						type: 'panel',
						name: this.beilageError,
						istAbschnitt: true,
						label: this.translate('page_formular.title_attachments')
					}
					this.Schema.children.push(comp)
				}
				this.addErrors(comp, this.beilageError);
			}
		}
		this.AllValidating = false;
		this.AllValidated = true;
	}

	private addErrors(comp: IComponent, errors?: string | string[], arrayInd?: number) {
		if (SchemaManager.hasNoValue(errors)) return;
		if (this.AllValidating || this.AllValidated) {
			if (typeof errors === 'string') errors = [errors];
			const errs: IError[] = errors.map(error => {
				return { comp, arrayInd, error };
			});
			this.Errors = this.Errors.concat(errs);
		}
	}

	public getParentAbschnitt(comp: IComponent): IComponent | null {

		let p = comp;
		while (p) {
			if (p.istAbschnitt || !p.parentComp) {
				return p;
			}
			p = p.parentComp;
		}
		return this.Schema;
	}

	public ScrollToParentAbschnitt(comp: IComponent) {
		if (comp.name === this.beilageError) {
			window.scrollTo({top: 0})
			return
		}
		const p = this.getParentAbschnitt(comp)
		document.querySelector('#' + p?.name).scrollIntoView();
	}


	public getErrorAbschnitte(): IComponent[] {
		let res: IComponent[] = []
		this.Errors.forEach(e => {
			const ab = this.getParentAbschnitt(e.comp)
			const vorh = res.find(c => c === ab)
			if (!vorh) {
				res.push(ab)
			}
		})
		return res
	}



	private removeErrors(comp: IComponent, arrayInd: number) {
		this.Errors = this.Errors.filter(e => !(e.comp === comp && e.arrayInd === arrayInd))
		// const ind = this.Errors.findIndex(e => e.comp === comp && e.arrayInd === arrayInd);
		// if (ind > -1) {
		//   this.Errors.splice(ind, 1);
		// }
	}

	removeAllErrors() {
		this.Errors = [];
	}

	// private checkRemoveRequiredError(comp: IComponent, val: any) {
	// 	if (comp.required && !SchemaManager.hasNoValue(val)) {
	// 		const ind = this.Errors.findIndex(e => e.comp === comp);
	// 		if (ind > -1) {
	// 			this.Errors = this.Errors.filter(e => !(e.comp === comp))
	// 		}
	// 	}
	// }


	getError(comp: IComponent) {
		const pd = this.getParentDataTable(comp)

		const arrayInd = pd && typeof pd.curRowInd !== 'undefined' ? pd.curRowInd : -1;
		const error = this.Errors.find(e => e.comp === comp && e.arrayInd === arrayInd);
		return error ? error.error : '';
	}

	rowHasError(comp: IComponent, arrayInd: number): boolean {
		let hasError = false
		if (comp?.type === 'datatable' && typeof arrayInd !== 'undefined')  {
			this.Errors.forEach(e => {
				if (e.arrayInd === arrayInd && !hasError) {
					const pd = this.getParentDataTable(e.comp)
					if (pd && pd === comp)
					{
						hasError = true
					}
				}
			});
		}
		return hasError
	}

	getClass(comp: IComponent, defaultClass: string, className: string): string {
		defaultClass = `${defaultClass} ${this.getPropValue(comp, 'class')}`;
		if (comp.onGetClass) // neues Verhalten mit Callback in Komponente
			return comp.onGetClass(this, comp, defaultClass, className) + (comp.required ? ' required' : '');
		else                 // bisheriges  Verhalten mit Auslesen von 'class' Property der Komponente
			return defaultClass + (comp.required ? ' required' : '');
	}

	getStyle(comp: IComponent, stylename: string): string {
		if (stylename === '') {
			const width = comp.width ? `width: ${comp.width};` : '';
			const style = comp.style ?? '';
			return `${width}${style}`;
		} else {
			if (comp.styles && comp.styles[stylename]) {
				return comp.styles[stylename];
			}
		}
	}

	getName(comp: IComponent): string {
		return comp.name;
	}

	getCompByName(name: string): IComponent | undefined {
		let comp;
		const o: ITraverseOptions = { done: false, fullTraverse: true };
		this.traverseSchema(c => {
			if (c.name === name) {
				o.done = true;
				comp = c;
			}
		}, o);
		return comp;
	}

	getCompByField(field: string): IComponent | undefined {
		let comp;
		const o: ITraverseOptions = { done: false };
		this.traverseSchema(c => {
			if (c.field === field) {
				o.done = true;
				comp = c
			};
		});
		return comp;
	}

	selectOptionsAsObjects(comp: IComponent): ISelectOptionItems {
		const val = this.getPropValue(comp, 'options');
		if (!val || !Array.isArray(val) || val.length === 0) return [];
		let ret: ISelectOptionItems = [];
		if (typeof val[0] === "string") {
			val.forEach(item => ret.push({ value: item, text: item }));
			return ret;
		} else {
			return val;
		}
	}

	selectOptionsAsStrings(comp: IComponent): string[] {
		const val = this.getPropValue(comp, 'options');
		if (!val || !Array.isArray(val) || val.length === 0) return [];
		let ret: string[] = [];
		if (typeof val[0] === "object") {
			val.forEach(item => ret.push(item.text));
			return ret;
		} else {
			return val;
		}
	}

	getColsClass(comp: IComponent, prop: string = 'cols'): string {
		let ret: string = this.getPropValue(comp, prop) || '';
		let xs = ret.indexOf('xs') > -1 ? ret.substr(ret.indexOf('xs') + 3, 2) : '16';
		let sm = ret.indexOf('sm') > -1 ? ret.substr(ret.indexOf('sm') + 3, 2) : xs;
		let md = ret.indexOf('md') > -1 ? ret.substr(ret.indexOf('md') + 3, 2) : sm;
		let lg = ret.indexOf('lg') > -1 ? ret.substr(ret.indexOf('lg') + 3, 2) : md;
		return `col-xs-${xs} col-sm-${sm} col-md-${md} col-lg-${lg}`
	}

	getAppearance(comp: IComponent): IAppearance {
		if (comp.appearance) return comp.appearance;
		if (this.Schema.appearance) return this.Schema.appearance;
		return 'standard';
	}

	usesGrid(comp: IComponent): boolean {
		if (!comp.children) return false;
		const hasGrid = comp.children.find(f => f.cols);
		return !!hasGrid;
	}

	private arrayHasDuplicates(arr: any[]): boolean {
		let valuesAlreadySeen = []
		for (let i = 0; i < arr.length; i++) {
			let value = arr[i]
			if (valuesAlreadySeen.indexOf(value) !== -1) {
				return true
			}
			valuesAlreadySeen.push(value)
		}
		return false

	}

	DoFocus(comp: IComponent, arrayInd: number = -1) {
		const ok = this.MakeVisible(comp, arrayInd);
		if (ok) setTimeout(() => {
			this.OnFocus.next(comp)
			if (comp.type === 'input' && comp.options) {
				this.OnAutocompleteClose.next(comp)
			}
		}, 100);
	}

	DoCloseAutocomplete(comp: IComponent) {
		setTimeout(() => this.OnAutocompleteClose.next(comp), 100);
	}


	DoNextStep(comp: IComponent) {
		if (comp.type !== 'stepper') return
		setTimeout(() => this.OnNextStep.next(comp), 100);
	}

	MakeVisible(comp: IComponent, arrayInd: number): boolean {
		let curTab: IComponent = null;
		let cur = comp;
		let ok = true;

		while (cur && cur.parentComp && ok) {
			if (this.Schema.onMakeVisible) this.Schema.onMakeVisible(this, cur);
			if (cur.parentComp.type == ComponentType.expansionspanel) {
				ok = !cur.parentComp.disabled;
				if (ok) cur.parentComp.expanded = true;
			} else if (cur.parentComp.type == ComponentType.tab) {
				curTab = cur.parentComp;
			} else if (cur.parentComp.type == ComponentType.tabs) {
				if (curTab && cur.parentComp.children && Array.isArray(cur.parentComp.children)) {
					ok = !curTab.disabled;
					if (ok) {
						const ind = cur.parentComp.children.indexOf(curTab);
						cur.parentComp.selectedTabIndex = ind;
					}
				}
			}
			// } else if (this.fieldIsInDataTable(cur)) {
			//   let p = cur.parentComp;
			//   while (p && p.type !== ComponentType.datatable) {
			//     p = p.parentComp;
			//   }
			//   if (p && p.type === ComponentType.datatable) p.curRowInd = arrayInd;
			// }
			cur = cur.parentComp;
		}
		return ok;

	}

	getDisabled(comp: IComponent): boolean {
		if (typeof comp['disabled'] === 'function')
			return this.getPropValue(comp, 'disabled');

		if (this.AllDisabled || this.dokumentDTO?.status >= DokumentStatus.SigniertGesperrt)
			return true;

		return this.getPropValue(comp, 'disabled');
	}

	appendChild(parentComp: IComponent, childComp: IComponent) {
		parentComp.children.push(childComp);

		const setParent = (c: IComponent, p: IComponent) => {
			c.parentComp = p;
		};
		SchemaManager.TraverseSchema(setParent, { fullTraverse: true }, childComp, parentComp);
	}

	static TraverseSchema(fn: ITraverseCallback, options: ITraverseOptions, comp: IComponent, parentComp?: IComponent) {
		if (options && options.done) return;

		fn(comp, parentComp, options);

		if (comp.children) {
			comp.children.forEach(c => SchemaManager.TraverseSchema(fn, options, c, comp));
		}
		if (comp.menu) {
			comp.menu.forEach(c => SchemaManager.TraverseSchema(fn, options, c, comp));
		}
		if (comp.detailComponent) {
			comp.detailComponent.children.forEach(c => SchemaManager.TraverseSchema(fn, options, c, comp));
		}

	}

	traverseSchema(fn: ITraverseCallback, options?: ITraverseOptions, comp?: IComponent) {
		const o = options || {}
		const c = comp || this.Schema
		SchemaManager.TraverseSchema(fn, o, c);
	}

	static fieldIsInSchema(field: string, schema: ISchema): boolean {
		const o = {}
		let found = false
		SchemaManager.TraverseSchema(comp => {
			if (comp.field && comp.field === field) {
				found = true
			}
		}, o, schema)
		return found

	}

	getParentDataTable(comp: IComponent): IComponent | null {
		let p = comp.parentComp;
		while (p) {
			if (p.type === ComponentType.datatable) {
				return p;
			}
			p = p.parentComp;
		}
		return null;
	}

	datatable_getCurRow(comp: IComponent) {
		const tbl = comp.type === 'datatable' ? comp : this.getParentDataTable(comp)
		if (tbl) {
			const arr: any[] = get(this.Values, tbl.field)
			if (arr && tbl.curRowInd > -1 && arr.length > tbl.curRowInd) {
				return arr[tbl.curRowInd]
			}

		}
		return null

	}


	datatable_addrow(tbl: IComponent) {
		const row = {};
		const data = this.getValue(tbl)
		if (data) {
			const len = data.push(row);
			this.updateValue(tbl, data);
			this.InitValuesArray(tbl, data[len - 1]);
			this.InitCurRow(tbl, len - 1);
		}
	}

	private InitCurRow(tbl: IComponent, rowInd: number) {
		if (rowInd === -1) {
			tbl.curRowInd = -1;
		} else {
			if (tbl.curRowInd !== rowInd) tbl.curRowInd = rowInd;
			let firstInput: IComponent
			tbl.detailComponent.children.forEach(c => {
				if (c.field && !firstInput) firstInput = c
			})
			if (firstInput) {
				this.DoFocus(firstInput, tbl.curRowInd)
			}
		}
	}



	fieldIsInDataTable(comp: IComponent): boolean {
		const c = this.getParentDataTable(comp)
		return (c !== null)
	}

	static checkValueType(val: any): IValueType {
		if (typeof val === 'undefined') {
			return IValueType.undefined;
		} else if (val === null) {
			return IValueType.null;
		} else if (typeof val === 'string') {
			return IValueType.string;
		} else if (typeof val === 'number') {
			return IValueType.number;
		} else if (typeof val === 'boolean') {
			return IValueType.boolean;
		} else if (typeof val === 'function') {
			return IValueType.function;
		} else if (Array.isArray(val)) {
			return IValueType.array;
		} else if (typeof val === 'object') {
			if (val.type) {
				return IValueType.component;
			} else {
				return IValueType.object;
			}
		}
	}

	checkOptionsValueType(val: any[]): boolean {
		if (SchemaManager.checkValueType(val) !== IValueType.array) return false
		if (val.length === 0) return true
		const typ = SchemaManager.checkValueType(val[0]);
		if (!(typ === IValueType.string || typ === IValueType.object)) return false
		let ok = true
		if (typ === IValueType.string) {
			const nok = !!val.find(o => SchemaManager.checkValueType(o) !== IValueType.string)
			ok = !nok
		} else {
			let nok = !!val.find(o => SchemaManager.checkValueType(o) !== IValueType.object)
			ok = !nok
			if (ok) nok = !!val.find(o => (SchemaManager.checkValueType(o.value) === IValueType.undefined || SchemaManager.checkValueType(o.text) === IValueType.undefined))
			ok = !nok
		}
		return ok
	}


	CheckSchema(): void {
		//todo
		// check type in keys
		// datatable not in datatable

		this.SchemaErrors = []

		// const err = (msg: string, comp: IComponent): string => `${msg}${comp.name ? ', name: "' + comp.name + '"' : ''}${comp.field ? ', field: "' + comp.field + '"' : ''}`;
		const AddErr = (comp: IComponent, error: string, isError: boolean) => { const type = isError ? ISchemaErrorType.error : ISchemaErrorType.warning; this.SchemaErrors.push({ type, comp, error }) }

		const containers: ComponentType[] = [ComponentType.form, ComponentType.card, ComponentType.panel, ComponentType.expansionspanel, ComponentType.tabs, ComponentType.tab, ComponentType.toolbar];
		const fields: ComponentType[] = [ComponentType.input, ComponentType.select, ComponentType.date, ComponentType.checkbox, ComponentType.switch, ComponentType.radiogroup, ComponentType.slider, ComponentType.datatable];
		const noLabels: ComponentType[] = [ComponentType.divider, ComponentType.tabs, ComponentType.panel, ComponentType.html, ComponentType.errorpanel, ComponentType.icon, ComponentType.form, ComponentType.button, ComponentType.icon];

		const ck = Object.keys(ComponentKeys);
		const sk = Object.keys(SchemaKeys).concat(ck);
		const tk = Object.values(ComponentType);
		const duplicateFields = [];
		const duplicateNames = [];

		//Check components
		const o: ITraverseOptions = { fullTraverse: true };
		this.traverseSchema(c => {
			if (!c.type) {
				AddErr(c, err_notype, true);
			} else {
				// @ts-ignore
				if (tk.indexOf(c.type) === -1) {
					AddErr(c, err_typewrong, true);
				}
				if (containers.indexOf(c.type as ComponentType) >= 0) {
					if (!c.children) {
						AddErr(c, err_noChild, true);
					} else {
						const typ = SchemaManager.checkValueType(c.children);
						if (typ !== IValueType.array || c.children.length === 0) {
							AddErr(c, err_zeroChild, true);
						}
					}
				}

				if (fields.indexOf(c.type as ComponentType) >= 0 && (!c.field)) AddErr(c, err_noField, true);
				// if (noLabels.indexOf(c.type as ComponentType) === -1 && (SchemaManager.checkValueType(c.label) === IValueType.undefined)) AddErr(c, err_noLabel, false);

				if ((c.type === ComponentType.select || c.type === ComponentType.radiogroup) && !c.options) AddErr(c, err_noOptions, true);
				if (c.options) {
					if (SchemaManager.checkValueType(c.options) !== IValueType.array) {
						AddErr(c, err_OptionsArray, true);
					} else {
						if (c.options.length === 0) {
							AddErr(c, err_zeroOptions, false);
						} else {
							// @ts-ignore
							if (!this.checkOptionsValueType(c.options)) {
								AddErr(c, err_wrongOptions, true);
							} else {
								const o = this.selectOptionsAsObjects(c);
								if (this.arrayHasDuplicates(o.map(i => i.value))) AddErr(c, err_OptionsDoubleValues, true);
							}
						}
					}
				}
				if (c.type === ComponentType.datatable) {
					let hasField = false;
					let DtInDt = false;
					this.traverseSchema((f) => {
						if (f.field) hasField = true
						if (f.type === 'datatable' && f !== c) DtInDt = true
					}, null, c)
					if (!hasField) AddErr(c, err_noDataTableNoField, true);
					if (DtInDt) AddErr(c, err_noDataTableInDataTable, true);
				}
				if ((c.type === ComponentType.icon) && !c.icon) AddErr(c, err_noIcon, true);
			}

			if (c.field) {
				let field = c.field
				if (c.parentComp && c.type === ComponentType.datatable) {
					field = c.parentComp.field + '.' + field;
				}
				duplicateFields[field] ? AddErr(c, err_doubleField, true) : duplicateFields[field] = true;
			}

			if (c.name) {
				let name = c.name
				if (c.parentComp) {
					let pname = c.parentComp.name ? c.parentComp.name : (c.parentComp.field ? c.parentComp.field : '');
					name = pname + '.' + name;
				}
				duplicateNames[name] ? AddErr(c, err_doubleName, true) : duplicateNames[name] = true;
			}

			const propKeys = c.parentComp ? ck : sk;
			Object.keys(c).forEach(k => {
				if (propKeys.indexOf(k) === -1) AddErr(c, err_unn(k), false);
			});
		}, o);
	}

	//Gibt die  Mussfelder und ob ausgefüllten zurück
	GetFormularMussfelder(mussfelder: IMussfelder): void {
		if (!this.Values) return
		this.traverseSchema(comp => {
			if (comp.field && comp.required) {
				// Fall Untertabellen
				if (this.fieldIsInDataTable(comp)) {
					const dt = this.getParentDataTable(comp)
					if (dt && this.Values[dt.field] && Array.isArray(this.Values[dt.field])) {
						mussfelder.anzahl += this.Values[dt.field].length
						this.Values[dt.field].forEach(v => {
							if (false === SchemaManager.hasNoValue(v[comp.field])) {
								mussfelder.filled++
							}
						});
					}
				}
				// Normalfall
				else {
					mussfelder.anzahl++

					// Fall Checkbox-Gruppe
					if(comp.type === 'panel'){
						const checkBoxes = comp.children.filter(c => c.type === 'checkbox');
						const filledCheckbox = checkBoxes.find(cb=> this.Values[cb.field] === true);
						if(filledCheckbox)
							mussfelder.filled++
					}
					// Der gewöhnlichste Fall
					else if (false === SchemaManager.hasNoValue(this.Values[comp.field])) {
						mussfelder.filled++
					}
				}
			}
		})
	}



}

