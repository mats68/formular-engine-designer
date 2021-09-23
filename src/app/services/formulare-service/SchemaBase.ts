import { Subject } from "rxjs";
import { FormulareService } from "src/app/services/formulare-service/formulare-service.service";
import { environment } from "src/environments/environment";
import { ISchema, SchemaManager } from "../../internal";
import { SchemaComponent } from "./SchemaComponent";
import { SchemaDataProviderBase } from "./SchemaDataProvider";
import { ISchemaField, SchemaField, SchemaFieldValue } from "./SchemaField";
import { ISchemaProps } from "./types";

const TRACE_SCHEMA_BASE: boolean = true;
const DEBUG_SCHEMA_BASE: boolean = true;

function log_trace(identifier: string, mode: boolean = null, ...optionalParams: any[]): void
{
	if(environment.production === false && true === TRACE_SCHEMA_BASE)
	{
		if(mode === null)
			identifier = `TRACE: ${identifier}`;
		else if(mode === true)
			identifier = `TRACE: Entering ${identifier}`;
		else if(mode === false)
			identifier = `TRACE: Leaving ${identifier}`;

		console.debug(identifier, ...optionalParams);
	}

	return;
}

function log_debug(message?: any, ...optionalParams: any[]): void
{
	if(environment.production === false && true === DEBUG_SCHEMA_BASE)
	{
		console.debug(`DEBUG: ${message}`, ...optionalParams);
	}

	return;
}

/**
 * Diese abstrakte Klasse stellt die Basis für alle Konkreten Schema-Implementierungen bereit.
 */
export abstract class SchemaBase implements ISchemaProps
{
	//#region Private Felder.

	private readonly _onChanged$: Subject<SchemaField> = new Subject<SchemaField>();

	private readonly _rootComponent: SchemaComponent;

	private _fields: { [key: string]: SchemaField };

	private _suppressEvents: boolean = true;

	//#endregion

	//#region Öffentliche Felder.

	// @inheritdoc
	public whiteBackground?: boolean;

	// @inheritdoc
	public noValidateOnBlur?: boolean;

	//#endregion

	//#region Geschützter Konstruktor.

	protected constructor(
		public readonly schemaManager: SchemaManager,
		private readonly _dataProvider: SchemaDataProviderBase,
		schema: ISchema
	)
	{
		//this._formValue.changed.add(this.onFormularDataChanged.bind(this));

		this._onChanged$.subscribe((field) => this.valueChanged(field));
		this._fields = this.getSchemaFields(schema);
		this._rootComponent = new SchemaComponent(this, schema);

		this._dataProvider.bindSchema(this);

		try
		{
			this.onInitialize(schema);
		}
		catch(error)
		{
			// Es ist ein Fehler in der Event Handler Funktion aufgetreten, protokolliere diesen Fehler in der Browser
			// Konsole.
			console.error(
				'Uncaught exception in `SchemaBase::onInitialize`!',
				{
					instance: this,
					error: error,
					schema: schema,
					// value: this._formValue
				}
			);
		}

		this._suppressEvents = false;

		return;
	}

	//#endregion

	//#region Private Methoden.

	private getSchemaFields(schema: ISchema): { [key: string]: SchemaField }
	{
		let fields: { [key: string]: SchemaField } = { };

		SchemaManager.TraverseSchema(
			comp =>
			{
				if(!comp.field) return;

				fields[comp.field] = new SchemaField(comp.field, comp.default, this._onChanged$);
			},
			{ },
			schema
		);

		log_debug(
			'Schema fields retrieved.',
			{
				instance: this,
				fields: fields
			}
		);

		return fields;
	}

	/**
	 * Diese Methode wird aufgerufen, wenn sich der Wert einer der `ISchemaField` Instanzen dieses Schema verändert hat,
	 * ein neuer Wert als eine `ISchemaField` Instanz hinzugefügt oder ein bestehender Wert bzw. dessen `ISchemaField`
	 * Instanz entfernt wurde.
	 *
	 * @param field
	 * 	Die `ISchemaField` Instanz dessen Wert sich verändert hat, hinzugefügt wurde oder entfernt wurde.
	 */
	private valueChanged(field: SchemaField): void
	{
		// Überspringe die Ausführung dieser Methode sollten Ereignisse unterdrückt sein.
		if(this._suppressEvents) return;

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace('SchemaBase::valueChanged', true, { schema: this, field: field });

		try
		{
			// Informiere nun den Datenprovider über den geänderten Feldwert.
			this._dataProvider.fieldChanged(field);
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace('SchemaBase::valueChanged', false);
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	//#endregion

	//#region Geschützte Methoden.

	/**
	 *
	 * @param schema
	 *
	 * @virtual
	 */
	protected onInitialize(schema: ISchema): void { }

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode iteriert über alle Unterkomponenten eines Schemas, verschachtelter Schema sowie verschachtelter
	 * Komponenten und filtert diese Komponenten dann anhand der spezifizierten Callback Funktion.
	 *
	 * @param fn
	 * 	Die Callback Funktion mittels welcher die Komponenten gefiltert werden sollen.
	 *
	 * @returns
	 * 	Ein Array aller durch die Callback Funktion gefilterten Komponenten.
	 */
	public traverseSchema(fn: (sc: SchemaComponent) => boolean, options?: ISchemaTraverseOptions): SchemaComponent[]
	{
		// Deklariere eine lokale Variable welche den Stack/die Queue aller noch zu iterierenden Schemakomponenten
		// speichert. Initialisiere dieses Array mit der Root Schemakomponente.
		let stack: SchemaComponent[] = [ this._rootComponent ];

		// Deklariere nun eine weitere Variable, welche das Array mit den gefilterten Komponenten erhält. Initialisiere
		// diese Variable mit einem leeren Array.
		let components: SchemaComponent[] = [ ];

		// Deklariere eine lokale Variable, welche die Funktion zum Abrufen der nächsten Schemakomponente erhält.
		let next: () => SchemaComponent;

		// Entscheide nun in welchem Modus dass wir über die Komponenten iterieren sollen. Speichere die entsprechende
		// Accessor-Methode dann in einer lokalen Variable.
		if(options?.mode === SchemaTraverseMode.Vertical)
		{
			// Vertikal, Baumzweig für Baumzweig. Wir rufen daher immer das letzte Element auf dem Stack ab.
			next = () => stack.pop();
		}
		else
		{
			// Horizontal, Level für Level. Wir rufen daher immer das erste Element aus der Queue ab.
			next = () => stack.shift();
		}

		// Iteriere nun solang noch ungefilterte Schemakomponente in unserem Stack/unserer Queue vorhanden sind.
		while(stack.length > 0)
		{
			// Rufe die nächste Schemakomponente ab mittels der vorher ermittelten Accessor-Funktion.
			let component: SchemaComponent = next();

			// Prüfe nun ob wir diese Komponenten filtern bzw. im Ergebnisset aufnehmen sollen.
			if(true === fn(component))
			{
				// Ja, also füge diese Komponente nun zu unserem Ergebnisset/Array hinzu.
				components.push(component);

				// Haben wir die gewünschte Anzahl an Komponenten gefunden?
				if(options.count > 0 && components.length >= options.count)
				{
					// Ja, also verlasse nun die Iterationsschleife.
					break;
				}
			}

			// Prüfe nun ob die aktuell iterierte Komponenten unterkomponenten besitzt. Falls ja, füge sie zu unserem
			// Stack/unserer Queue von Schemakomponenten hinzu.
			if(component.children?.length > 0) component.children.forEach((c) => stack.push(c));
		}

		// Wir sind fertig, gib nun das Array von gefilterten Komponenten zurück.
		return components;
	}

	public getComponentByName(name: string): SchemaComponent|null {
		let components: SchemaComponent[] =
			this.traverseSchema(
				(sc: SchemaComponent) => sc.component.field && sc.component.field === name,
				{ mode: SchemaTraverseMode.Horizontal, count: 1 }
			);

		return (components.length > 0) ? components[0] : null;
	}

	public getSchemaField(name: string): ISchemaField|undefined {
		return this._fields[name];
	}

	public updateValues(values: { [key: string]: SchemaFieldValue }): void
	{
		const __METHOD_NAME__: string = 'SchemaBase::updateValues';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { schema: this, values: values });

		try
		{
			for(let name of Object.keys(values))
			{
				let field: SchemaField = <SchemaField>this.getSchemaField(name);

				if(!field)
				{
					values[name] = undefined;
				}
				else
				{
					let value: SchemaFieldValue = values[name];

					field.update(value, value);
				}
			}
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		return;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	public get rootComponent(): SchemaComponent {
		return this._rootComponent;
	}

		public get disabled(): boolean {
		return false;
	}

	//#endregion
}








// /**
//  * Diese abstrakte Klasse stellt die Basis für alle Konkreten Schema-Implementierungen bereit.
//  */
// export abstract class SchemaBase implements ISchemaProps
// {
// 	//#region Private Felder.

// 	private readonly _onChanged$: Subject<SchemaField> = new Subject<SchemaField>();

// 	private readonly _rootComponent: SchemaComponent;

// 	private _fields: { [key: string]: SchemaField };

// 	private _suppressEvents: boolean = true;

// 	//#endregion

// 	//#region Öffentliche Felder.

// 	public whiteBackground?: boolean;

// 	public noValidateOnBlur?: boolean;

// 	//#endregion

// 	//#region Konstruktor.

// 	protected constructor(
// 		private readonly _formulareService: FormulareService,
// 		public readonly schemaManager: SchemaManager,
// 		//private readonly _formValue: IFormularFieldSet,
// 		private readonly _dataProvider: SchemaDataProviderBase,
// 		schema: ISchema
// 	)
// 	{
// 		//this._formValue.changed.add(this.onFormularDataChanged.bind(this));

// 		this._onChanged$.subscribe((field) => this.valueChanged(field));
// 		this._fields = this.getSchemaFields(schema);
// 		this._rootComponent = new SchemaComponent(this, schema);

// 		this._dataProvider.bindSchema(this);

// 		// this._formulareService.afterLoaded.add(this.onFormularLoaded.bind(this));
// 		// this._formulareService.beforeSaving.add(this.onFormularSaving.bind(this));

// 		// this._formValue.changed.add(this.onChanged.bind(this));
// 		// this._formValue.loaded.add(this.onLoaded.bind(this));
// 		// this._formValue.saving.add(this.onSaving.bind(this));

// 		//this.loadFormularData();

// 		console.log("Schema Fields", this._fields);

// 		try
// 		{
// 			// this.onInitialize(schema, this._formValue);
// 		}
// 		catch(error)
// 		{
// 			// Es ist ein Fehler in der Event Handler Funktion aufgetreten, protokolliere diesen Fehler in der Browser
// 			// Konsole.
// 			console.error(
// 				'Uncaught exception in `SchemaBase::onInitialize`!',
// 				{
// 					instance: this,
// 					error: error,
// 					schema: schema,
// 					// value: this._formValue
// 				}
// 			);
// 		}

// 		this._suppressEvents = false;

// 		return;
// 	}

// 	private onFormularLoaded(eventData: IFormularLoadedEventData): void
// 	{
// 		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
// 		log_trace('SchemaBase::onFormularLoaded', true, this);

// 		// Lade die neuen Formulardaten.
// 		this.loadFormularData();

// 		try
// 		{
// 			//this.onLoaded({ formValue: this._formValue });
// 		}
// 		catch(error)
// 		{
// 			throw error;
// 		}

// 		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
// 		log_trace('SchemaBase::onFormularLoaded', false);

// 		// Alles erledigt, kehre nun zurück.
// 		return;
// 	}

// 	private onFormularSaving(eventData: IFormularSavingEventData): void
// 	{
// 		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
// 		log_trace('SchemaBase::onFormularSaving', true, this);

// 		// Speichere die neuen Formulardaten.
// 		this.saveFormularData();

// 		try
// 		{
// 			//this.onSaving({ formValue: this._formValue });
// 		}
// 		catch(error)
// 		{
// 			throw error;
// 		}

// 		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
// 		log_trace('SchemaBase::onFormularSaving', false);

// 		// Alles erledigt, kehre nun zurück.
// 		return;
// 	}

// 	//#endregion

// 	//#region Private Methoden.

// 	private getSchemaFields(schema: ISchema): { [key: string]: SchemaField }
// 	{
// 		let fields: { [key: string]: SchemaField } = { };

// 		SchemaManager.TraverseSchema(
// 			comp =>
// 			{
// 				if(!comp.field) return;

// 				fields[comp.field] = new SchemaField(comp.field, comp.default, this._onChanged$);
// 			},
// 			{ },
// 			schema
// 		);

// 		return fields;
// 	}


// 	/**
// 	 * Diese Methode iteriert über alle Unterkomponenten eines Schemas, verschachtelter Schema sowie verschachtelter
// 	 * Komponenten und filtert diese Komponenten dann anhand der spezifizierten Callback Funktion.
// 	 *
// 	 * @param fn
// 	 * 	Die Callback Funktion mittels welcher die Komponenten gefiltert werden sollen.
// 	 *
// 	 * @returns
// 	 * 	Ein Array aller durch die Callback Funktion gefilterten Komponenten.
// 	 */
// 	public traverseSchema(fn: (sc: SchemaComponent) => boolean, options?: ISchemaTraverseOptions): SchemaComponent[]
// 	{
// 		// Deklariere eine lokale Variable welche den Stack/die Queue aller noch zu iterierenden Schemakomponenten
// 		// speichert. Initialisiere dieses Array mit der Root Schemakomponente.
// 		let stack: SchemaComponent[] = [ this._rootComponent ];

// 		// Deklariere nun eine weitere Variable, welche das Array mit den gefilterten Komponenten erhält. Initialisiere
// 		// diese Variable mit einem leeren Array.
// 		let components: SchemaComponent[] = [ ];

// 		// Deklariere eine lokale Variable, welche die Funktion zum Abrufen der nächsten Schemakomponente erhält.
// 		let next: () => SchemaComponent;

// 		// Entscheide nun in welchem Modus dass wir über die Komponenten iterieren sollen. Speichere die entsprechende
// 		// Accessor-Methode dann in einer lokalen Variable.
// 		if(options?.mode === SchemaTraverseMode.Vertical)
// 		{
// 			// Vertikal, Baumzweig für Baumzweig. Wir rufen daher immer das letzte Element auf dem Stack ab.
// 			next = () => stack.pop();
// 		}
// 		else
// 		{
// 			// Horizontal, Level für Level. Wir rufen daher immer das erste Element aus der Queue ab.
// 			next = () => stack.shift();
// 		}

// 		// Iteriere nun solang noch ungefilterte Schemakomponente in unserem Stack/unserer Queue vorhanden sind.
// 		while(stack.length > 0)
// 		{
// 			// Rufe die nächste Schemakomponente ab mittels der vorher ermittelten Accessor-Funktion.
// 			let component: SchemaComponent = next();

// 			// Prüfe nun ob wir diese Komponenten filtern bzw. im Ergebnisset aufnehmen sollen.
// 			if(true === fn(component))
// 			{
// 				// Ja, also füge diese Komponente nun zu unserem Ergebnisset/Array hinzu.
// 				components.push(component);

// 				// Haben wir die gewünschte Anzahl an Komponenten gefunden?
// 				if(options.count > 0 && components.length >= options.count)
// 				{
// 					// Ja, also verlasse nun die Iterationsschleife.
// 					break;
// 				}
// 			}

// 			// Prüfe nun ob die aktuell iterierte Komponenten unterkomponenten besitzt. Falls ja, füge sie zu unserem
// 			// Stack/unserer Queue von Schemakomponenten hinzu.
// 			if(component.children?.length > 0) component.children.forEach((c) => stack.push(c));
// 		}

// 		// Wir sind fertig, gib nun das Array von gefilterten Komponenten zurück.
// 		return components;
// 	}

// 	/**
// 	 * Diese Funktion prüft ob der spezifizierte Wert einen leeren Wert/nicht spezifizierten Wert darstellt. Optional
// 	 * kann der Typ des Wertes spezifiziert werden, welcher übereinstimmen muss.
// 	 *
// 	 * @param value
// 	 * 	Der auf einen leeren/nicht spezifizierten Wert zu prüfenden Wert.
// 	 *
// 	 * @param type
// 	 * 	Der optionale JavaScript Typennamen (typeof) mit welchem der spezifizierte Wert übereinstimmen muss.
// 	 *
// 	 * @returns
// 	 * 	`true` wenn der spezifizierte Wert nicht mit dem spezifizierten Typen übereinstimmt oder der spezifizierte
// 	 * 	Werte dem Typ entsprechend einen leeren/nicht spezifizierten Wert darstellt. In allen anderen Fällen `false`.
// 	 */
// 	public static isEmptyValue(value: SchemaFieldValue|null|undefined, type: string = null): boolean
// 	{
// 		// Die Werte: `null` sowie `undefined` sind immer leer.
// 		if(value === null || value === undefined) return true;

// 		// Wurde ein spezifischer Typ angegeben? Falls ja, stelle sicher das die Typen übereinstimmen. Ansonsten nehmen
// 		// wir an, dass der Wert leer bzw. unspezifiziert ist.
// 		if(type != null && typeof(value) !== type) return true;

// 		// Prüfe nun um welchen Typ es sich bei dem spezifizierten Wert handelt.
// 		switch(typeof(value))
// 		{
// 			// String/Text
// 			case 'string':
// 				// Prüfe ob ein Text mit einer nicht positiven Länge spezifiziert wurde. Fall ja ist der Wert leer.
// 				return value.length <= 0;

// 			// Objekt/Klasse/Array
// 			case 'object':
// 				// Prüfe ob es sich bei dem spezifizierten Wert um ein Array handelt und falls ja, ob dieses leer ist. Gib
// 				// dann das Resultat dieser Überprüfung zurück.
// 				return Array.isArray(value) && value.length <= 0;

// 			default:
// 				// In allen anderen Fällen nehmen wir an, dass der Wert nicht leer bzw. unspezifiziert ist.
// 				return false;
// 		}
// 	}

// 	private calculateProgress(): number
// 	{
// 		let data: { fields: number, filled: number } = { fields: 0, filled: 0 };

// 		this.traverseSchema(
// 			(sc: SchemaComponent): boolean =>
// 			{
// 				if(!sc.component.field || !sc.component.required)
// 					return false;

// 				data.fields++;

// 				if(false ==SchemaBase.isEmptyValue(sc.value)) data.filled++;
// 			}
// 		);

// 		if(data.fields > 0)
// 			return 1 / data.fields * data.filled;
// 		else
// 			return -1;
// 	}

// 	private valueChanged(field: SchemaField): void
// 	{
// 		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
// 		log_trace('SchemaBase::valueChanged', true, { schema: this, field: field });

// 		try
// 		{
// 			if(this._suppressEvents) return;

// 			// console.debug('SchemaBase::onValueChanged -> Before', field, this._formValue.data);

// 			// this.onValueChanged(field);
// 			// this.updateFormularHeader();

// 			// let data: object = JSON.parse(this._formValue.data);
// 			// data[field.name] = field.value;
// 			// this._formValue.data = JSON.stringify(data, null, '\t');

// 			// console.debug('SchemaBase::onValueChanged -> After', field, this._formValue.data);
// 		}
// 		finally
// 		{
// 			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
// 			log_trace('SchemaBase::valueChanged', true, { schema: this, field: field });
// 		}
// 	}

// 	private updateFormularHeader(): void
// 	{
// 		let header: IFormularHeaderData = this._formulareService.formularHeader;

// 		//header.canSave = this._formValue.state !== FormularFieldSetState.Unchanged;

// 		header.statusText = '';
// 		header.progress = 0;

// 		this.onUpdateHeader(header);

// 		this._formulareService.formularHeader = header;

// 		return;
// 	}

// 	//#endregion

// 	//#region Geschütze Methoden.

// 	/**
// 	 * Diese Methode wird aufgerufen nachdem dieses Schema Instanz instanziiert wurde und bereit für die Initialisierung
// 	 * ist.
// 	 *
// 	 * @param schema
// 	 * 	Die `ISchema` Instanz, anhand welcher diese `SchemaBase` Instanz instanziiert wird.
// 	 *
// 	 * @param value
// 	 * 	Die `IFormularFieldSet` Instanz, auf welcher dieses Schema operiert und die Werte abrufen bzw. speichern soll.
// 	 */
// 	protected onInitialize(schema: ISchema, value: IFormularFieldSet): void {
// 		/* virtual method: do nothing */
// 	}

// 	/**
// 	 * Dieses Methode wird aufgerufen wenn einer oder mehrere Werte des assoziierten Formulars verändert wurden.
// 	 *
// 	 * @param eventData
// 	 * 	Die relevanten Ereignisdaten für das 'onChanged' Ereignis.
// 	 */
// 	protected onChanged(eventData: IFormularFieldSetChangedEventData): void
// 	{
// 		/* virtual method: do nothing */
// 	}

// 	/**
// 	 * Dieses Methode wird aufgerufen wenn die Werte des assoziierten Formulars neu geladen wurden.
// 	 *
// 	 * @param eventData
// 	 * 	Die relevanten Ereignisdaten für das 'onLoaded' Ereignis.
// 	 */
// 	protected onLoaded(eventData: IFormularFieldSetLoadedEventData): void
// 	{
// 		/* virtual method: do nothing */
// 	}

// 	/**
// 	 * Diese Methode wird aufgerufen wenn die Werte das assoziierten Formulars gespeichert werden sollen.
// 	 *
// 	 * @param eventData
// 	 * 	Die relevanten Ereignisdaten für das 'onSaving' Ereignis.
// 	 */
// 	protected onSaving(eventData: IFormularFieldSetSavingEventData): void
// 	{
// 		/* virtual method: do nothing */
// 	}

// 	protected onValueChanged(field: ISchemaField): void {
// 		/* virtual method: do nothing */
// 	}

// 	protected onUpdateHeader(header: IFormularHeaderData): void {
// 		/* virtual method: do nothing */
// 	}

// 	protected onFormularDataChanged(eventData: IFormularFieldSetChangedEventData): void {
// 		/* virtual method: do nothing */
// 	}

// 	private loadFormularData(): void
// 	{
// 		let supressEvents: boolean = this._suppressEvents;

// 		try
// 		{
// 			this._suppressEvents = true;

// 			//let data: object = JSON.parse(this._formValue.data);

// 			// for(let field of Object.keys(data))
// 			// {
// 			// 	let schemaField: SchemaField = this._fields[field] || null;
// 			// 	let value: SchemaFieldValue = data[field];

// 			// 	schemaField?.update(value, value);
// 			// }
// 		}
// 		finally
// 		{
// 			this._suppressEvents = supressEvents;
// 		}
// 	}

// 	private saveFormularData(): void
// 	{

// 	}

// 	public getSchemaField(name: string): ISchemaField|undefined {
// 		return this._fields[name];
// 	}

// 	//#endregion

// 	//#region Öffentliche Funktionen.

// 	public static getValueType(value: any): IValueType
// 	{
// 		switch(typeof(value))
// 		{
// 			default:
// 			case 'undefined':
// 				return IValueType.undefined;

// 			case 'string':
// 				return IValueType.string;

// 			case 'number':
// 				return IValueType.number;

// 			case 'boolean':
// 				return IValueType.boolean;

// 			case 'function':
// 				return IValueType.function;

// 			case 'object':
// 				if(null === value)
// 				{
// 					return IValueType.null;
// 				}
// 				else if(true == Array.isArray(value))
// 				{
// 					return IValueType.array;
// 				}
// 				else if(value.type)
// 				{
// 					return IValueType.component;
// 				}
// 				else
// 				{
// 					return IValueType.object;
// 				}
// 		}
// 	}

// 	public onSubmit(sm: SchemaManager): void { /* virtual method: do nothing */ }

// 	public onInitSchema(sm: SchemaManager): void { /* virtual method: do nothing */ }

// 	public onInitValues(sm: SchemaManager): void { /* virtual method: do nothing */ }

// 	public onResize(sm: SchemaManager): void { /* virtual method: do nothing */ }

// 	public onMakeVisible(sm: SchemaManager, comp: IComponent, value?: any): void { /* virtual method: do nothing */ }

// 	//#endregion

// 	//#region Öffentliche Eigenschaften.

// 	public get inheritFrom(): ISchema {
// 		return null;
// 	}

// 	public set inheritFrom(schema: ISchema) {

// 	}

// 	public get type(): ComponentType {
// 		return ComponentType.panel;
// 	}

// 	public set type(type: ComponentType) {

// 	}

// 	//#endregion

// 	public get rootComponent(): SchemaComponent {
// 		return this._rootComponent;
// 	}

// 	public get disabled(): boolean {
// 		return false;
// 	}

// 	public getComponentByName(name: string): SchemaComponent|null {
// 		let components: SchemaComponent[] =
// 			this.traverseSchema(
// 				(sc: SchemaComponent) => sc.component.field && sc.component.field === name,
// 				{ mode: SchemaTraverseMode.Horizontal, count: 1 }
// 			);

// 		return (components.length > 0) ? components[0] : null;
// 	}
// }

export enum SchemaTraverseMode
{
	Horizontal = 0,
	Vertical = 1
}

export interface ISchemaTraverseOptions
{
	mode: SchemaTraverseMode; // 0: Horizontal, level by level | 1: Vertical, tree branch by tree branch.
	count: number; // > 0: Abort traversal after X match(es) | Always do full traversal.
}
