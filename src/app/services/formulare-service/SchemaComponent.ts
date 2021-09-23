import { SchemaBase } from "./SchemaBase";
import { ISchemaField, SchemaFieldValue } from "./SchemaField";
import { ComponentType, IAppearance, IComponent, IComponentString, ITranslatableString } from "./types";

/**
 * Diese Klasse repräsentiert eine Komponente eines Schemas innerhalb der Brunner Informatik AG Formular Engine.
 */
export class SchemaComponent
{
	//#region Private Felder.

	private readonly _schema: SchemaBase;
	private readonly _component: IComponent;
	private readonly _children: SchemaComponent[];
	private _field: ISchemaField;

	//#endregion

	constructor(
		schema: SchemaBase,
		component: IComponent
	)
	{
		this._schema = schema;
		this._component = component;
		this._children = [ ];

		if(Array.isArray(component?.children)) {
			for(let comp of component.children) {
				this._children.push(new SchemaComponent(schema, comp));
			}
		}

		Object.assign(this, component);

		for(let prop of Object.values(this))
		{

		}

		return;
	}

	public get schema(): SchemaBase {
		return this._schema;
	}

	public get component(): IComponent {
		return this._component;
	}

	public get children(): SchemaComponent[] {
		return Object.assign([ ], this._children);
	}

	//#region Öffentliche Funktionen.

	/**
	 * Diese Methode ruft die `ISchemaField` Instanz ab, welche mit dieser Komponente über die `field` Eigenschaft
	 * assoziiert ist. Hat diese Komponente keine assoziierte `ISchemaField` Instaz, gibt diese Methode stattdessen den
	 * `undefined` Wert zurück.
	 *
	 * @returns
	 * 	Die mit dieser Komponente assoziierte `ISchemaField` Instanz sofern vorhanden, ansonsten der `undefined` Wert.
	 */
	public getSchemaField(): ISchemaField|undefined
	{
		// Rufe den Wert der `Field` Eigenschaft ab.
		const field: string = this.getStringPropertyValue('field', '');

		// Wurde ein Feldnamen spezifiziert?
		if(field.length > 0)
		{
			// Ja, also versuche die assoziierte `ISchemaField` Instanz aus dem Schema abzurufen und gib diese dann
			// zurück.
			return this.schema.getSchemaField(field);
		}
		else
		{
			// Nein, also gib den `undefined` Wert zurück.
			return undefined;
		}
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	/**
	 * Diese Eigenschaft ruf einen Indikator ab, welcher anzeigt ob diese Komponente ein Muss-Feld/Muss-Wert
	 * repräsentiert oder nicht, oder setzt diesen.
	 */
	public get required(): boolean
	{
		// Rufe die 'required' Eigenschaft der darunterliegenden Komponente als booleschen Wert ab. Falls dieser Wert
		// nicht gesetzt ist oder ungültig, gib `false` zurück.
		return this.getBooleanPropertyValue('required', false);
	}

	/**
	 * Diese Eigenschaft ruf einen Indikator ab, welcher anzeigt ob diese Komponente ein Muss-Feld/Muss-Wert
	 * repräsentiert oder nicht, oder setzt diesen.
	 */
	public set required(required: boolean)
	{
		// Speichere den neuen Wert für die 'required' Eigenschaft der darunterliegenden Komponente.
		this.component.required = required;
	}

	//#endregion









	public isComponentOfType(type: string|ComponentType)
	{
		return this._component.type == type;
	}

	public get type(): ComponentType {
		return this._component.type as ComponentType;
	}

	public get hidden(): boolean {
		return true === this.getPropertyValue('hidden');
	}

	public get class(): string {
		return this.getStringPropertyValue('class', '');
	}

	public get classLayout(): string {
		return this.getStringPropertyValue('classLayout', '');
	}

	public get usesGrid(): boolean {
		return -1 !== this._component.children.findIndex(f => f.cols);
	}


	// getValue(comp: IComponent, values: any = null, arrayInd: number = -1): any {  //values could be diff-values
	// 	if (!comp.field) {
	// 	  console.error('field not specified ! name: ', comp.name, 'type: ', comp.type);
	// 	  return undefined;
	// 	}
	// 	let Values = values ? values : comp.unbound ? this.MemValues : this.Values
	// 	Values = this.getParentValues(comp, Values, arrayInd);
	// 	const val = get(Values, comp.field);

	// 	if (SchemaManager.hasNoValue(val)) {
	// 	  if (comp.type === 'checkbox') {
	// 		 return false;
	// 	  }
	// 	  if (comp.type === ComponentType.datatable || comp.type === ComponentType.checklistbox) {
	// 		 return [];
	// 	  }
	// 	  return '';
	// 	}
	// 	return val;
	//  }


	resolveValue(value: any, methodResolver?: { (Function): any }): any {
		// Rufe den  Typ des spezifizierten Wertes ab und speichere diese dann in einer lokalen Variable.
		const type: string = typeof(value);

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
		else if (type === 'object')
		{
			// Interpretiere das spezifizierte Objekt als `IComponentString`-Objekt und speichere dieses in einer lokalen
			// Variable.
			const componentString: IComponentString = value as IComponentString;

			// Wurde eine Funktion zum ermitteln des Textes spezifiziert?
			if(typeof(componentString.function) === 'function')
			{
				// Ja, also rufe die Funktion mittels der spezifizierten `Methoden`-Resolve Funktion auf und gib deren Wert
				// zurück. Wurde keine spezielle Methode spezifiziert, rufe die Methode nur mit dem Schema-Manager auf.
				//return methodResolver ? methodResolver(componentString.value) : componentString.function(this, null);
				throw Error("TODO!");
			}
			// Wurde ein Übersetzungsschlüssel spezifiziert, sowie allfällige Parameterwerte zum ersetzen?
			else if(typeof(componentString.translation) === 'object')
			{
				// Ja, also übersetze den Text und gib diesen dann zurück.
				return this.schema.schemaManager.translate(componentString.translation as ITranslatableString);
			}
			// Wurde ein explizierter Wert spezifiziert?
			else if(typeof(componentString.value) !== 'undefined')
			{
				// Ja, also gib diesen zurück als text.
				return componentString.value as string;
			}
		}

		// Kein spezieller Wert, gib den Wert zurück so wie er ist.
		return value;
	}

	private static readonly _error = { };

	private getPropertyValueInternal(
		property: string,
		valueType: string|null,
		fallbackValue: any|null|undefined
	)
		: any|null|undefined
	{
		// Versuche die spezifizierte Komponenteneigenschaft abzurufen und speichere den Wert dann in einer lokalen
		// Variable.
		let value = this._component[property];
		let type: string = typeof(value);

		// Prüfe ob eine Funktion als Wert spezifiziert wurde.
		if(type === 'function')
		{
			// Ja, also evaluiere den Wert mittels der spezifizierten Funktion und speichere den evaluierten Wert dann in
			// unserer lokalen Variable.
			value = value(this._schema, this._component);
		}
		// Oder wurde ein Objekt als Wert spezifiziert?
		else if(type === 'object')
		{
			// Interpretiere das spezifizierte Objekt als `IComponentString`-Objekt und speichere dieses in einer lokalen
			// Variable.
			const componentString: IComponentString = value as IComponentString;

			// Wurde eine Funktion zum Ermitteln des Textes spezifiziert?
			if(typeof(componentString.function) === 'function')
			{
				// Ja, also evaluiere den Wert mittels der spezifizierten Funktion und speichere den evaluierten Wert dann
				// in unserer lokalen Variable.
				value = value(this._schema, this._component);
			}
			// Wurde ein Übersetzungsschlüssel spezifiziert, sowie allfällige Parameterwerte zum ersetzen?
			else if(typeof(componentString.translation) === 'object')
			{
				// Ja, also übersetze den Text und speichere diesen dann in unserer lokalen Variable.
				value =
					this._schema.schemaManager.translate(
						componentString.translation.key,
						componentString.translation.values,
						componentString.translation.options
					);
			}
			// Wurde ein explizierter Wert spezifiziert?
			else if(typeof(componentString.value) !== 'undefined')
			{
				// Ja, also speichere diesen Wert in unserer lokalen Variable.
				value = value.value;
			}
		}

		// Wurde ein erwarteter Werttyp spezifiziert?
		if(!valueType) {
			// Nein, also gib den Wert so zurück wie er ist.
			return value;
		}

		// Prüfe nun was für ein Typ der evaluierte Wert hat und prüfe ob dieser dem erwarteten Typ entspricht.
		if(typeof(value) !== valueType)
		{
			// Der Typ entspricht nicht dem erwarteten Typ, wurde ein Fallback-Wert spezifiziert?
			if(fallbackValue !== undefined) {
				// Ja, also gib den Fallback-Wert zurück.
				return fallbackValue;
			}

			// Prüfe nun welcher Typ erwartet wird.
			switch(type)
			{
				case 'boolean':
					// Versuche den Wert als `boolean` zu interpretieren und gib diesen Wert zurück.
					return Boolean(value);

				case 'number':
					// Versuche den Wert als `number` zu interpretieren und gib diesen Wert zurück.
					return Number(value);

				case 'string':
					// Versuche den Wert als `string` zu interpretieren und gib diesen Wert zurück.
					return String(value);

				default:
					// Wir können den Wert nicht konvertieren, wirf eine Ausnahme!
					throw new Error(`Unexpected value for property: ${property}!`);
			}
		}

		// Der Typ des Wertes entspricht dem erwarteten Typen, gib diesen Wert nun zurück.
		return value;
	}

	public getPropertyValue(property: string, fallbackValue?: any|null|undefined): any|null|undefined
	{
		return this.getPropertyValueInternal(property, null, fallbackValue);
	}

	public getBooleanPropertyValue(property: string, fallbackValue: boolean = false): boolean {
		return this.getPropertyValueInternal(property, 'boolean', fallbackValue);
	}

	public getNumberPropertyValue(property: string, fallbackValue: number = 0): number {
		return this.getPropertyValueInternal(property, 'number', fallbackValue);
	}

	public getStringPropertyValue(property: string, fallbackValue: string = ''): string {
		return this.getPropertyValueInternal(property, 'string', fallbackValue);
	}

	public getFunctionPropertyValue(property: string, fallbackValue: Function = null): Function|null {
		return this.getPropertyValueInternal(property, 'function', fallbackValue);
	}

	protected get schemaField(): ISchemaField|undefined {
		if(this.component.field && this._field === undefined) {
			this._field = this.schema.getSchemaField(this.component.field);
		}

		return this._field;
	}

	public get value(): SchemaFieldValue
	{
		return this.schemaField?.value ?? undefined;
	}

	public set value(value: SchemaFieldValue)
	{
		this.schemaField.value = value;

		return;
	}
}
