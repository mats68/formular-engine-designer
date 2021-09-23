import { Subject } from "rxjs";

/**
 * Diese Enumeration definiert alle Zustände, in welchem sich eine `ISchemaField` Instanz befinden kann.
 */
export enum SchemaFieldState
{
	/**
	 * Der Wert dieser `ISchemaField` Instanz ist unverändert.
	 */
	Unchanged = 0,

	/**
	 * Der Wert dieser `ISchemaField` Instanz wurde hinzugefügt zu den bestehenden Werten.
	 */
	Added = 1,

	/**
	 * Der Wert dieser `ISchemaField` Instanz wurde verändert.
	 */
	Modified = 2,

	/**
	 * Der Wert dieser `ISchemaField` Instanz wurde von den bestehenden Werten entfernt.
	 */
	Removed = 3
}

/**
 * Dieser Typ definiert alle gültigen Typen, welche als Wert einer `ISchemaField` Instanz gespeichert werden können.
 */
export type SchemaFieldValue = boolean|number|string|object|null;

/**
 * Diese Schnittstelle definiert die API mittels welcher mit einem Schemafeld interagiert werden kann.
 *
 * Ein Schemafeld repräsentiert im Normalfall ein Eingabefeld oder einen einzelnen Wert.
 *
 * ACHTUNG: Dieses Interface exponiert die öffentliche API und kann deshalb nicht ausserhalb implementiert werden!
 */
export interface ISchemaField {
	/**
	 * Diese Eigenschaft ruft den Namen/die Identifikation dieses Schemafeldes ab.
	 */
	readonly name: string;

	/**
	 * Diese Eigenschaft ruft den aktuellen Zustand dieses Schemafeldes als Wert der `SchemaFieldState` Enumeration ab.
	 */
	readonly state: SchemaFieldState

	/**
	 * Diese Eigenschaft ruft den Wert dieses Schemafeldes ab oder setzt diesen.
	 */
	value: SchemaFieldValue|undefined;
}

/**
 * Diese Klasse stellt die implementierung der `ISchemaField` Schnittstelle bereit und wird innerhalb der Brunner
 * Informatik Formular Engine verwendet.
 */
export class SchemaField implements ISchemaField
{
	//#region Private fields.

	/**
	 * Dieses Feld speichert die Observer-Instanz welche benachrichtigt werden soll, wenn sich der Wert/Zustand dieser
	 * Instanz verändert hat.
	 */
	private readonly _changeNotifier$: Subject<SchemaFieldValue>;

	/**
	 * Dieses Feld speichert den Namen dieses Feldes.
	 */
	private readonly _name: string;

	/**
	 * Dieses Feld speichert den aktuellen Feldzustand.
	 */
	private _state: SchemaFieldState;

	/**
	 * Dieses Feld speichert den Originalwert dieses Feldes.
	 */
	private _originalValue: SchemaFieldValue | undefined;

	/**
	 * Dieses Feld speichert den Standardwert/Initialwert.
	 */
	private readonly _defaultValue: SchemaFieldValue | undefined;

	/**
	 * Dieses Feld speichert den aktuellen Wert dieses Feldes.
	 */
	private _value: SchemaFieldValue;

	//#endregion

	//#region Konstruktor.

	public constructor(
		name: string,
		defaultValue: SchemaFieldValue|undefined,
		changeNotifier: Subject<SchemaField> = null
	)
	{
		this._name = name;
		this._defaultValue = defaultValue;
		this._originalValue = undefined;
		this._value = this._defaultValue;
		this._state = SchemaFieldState.Unchanged;

		this._changeNotifier$ = changeNotifier;

		return;
	}

	//#endregion

	//#region Private Methoden.

	/**
	 * Diese Methode setzt den neuen Zustand dieses Schemafeldes. Sollte sicher der Zustand verändert haben, wird auch
	 * der Änderungs-Observator benachrichtigt.
	 *
	 * @param events
	 * 	`true` um Ereignisse auszulösen, sollte sicher der Zustand dieses Formular-Wertes ändern oder `false` um diese
	 * 	Ereignisse zu unterbinden.
	 *
	 * @returns
	 * 	`true` wenn sich der Zustand dieser Formular-Wertes verändert hat, ansonsten `false`.
	 */
	private setState(state: SchemaFieldState, events: boolean = true): boolean
	{
		// Prüfe ob sich der Zustand dieses Schemafeldes verändert hat.
		if(this._state !== state)
		{
			// Neuer Zustand, speichere diesen intern.
			this._state = state;

			// Und benachrichtige nun den Observator über die Zustandsänderung.
			this.onChanged(events);
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	private onChanged(events: boolean): void
	{
		if(events)
		{
			this._changeNotifier$?.next(this);
		}

		return;
	}

	//#endregion

	//#region Öffentliche Methoden.

	public update(
		value: SchemaFieldValue | undefined,
		originalValue: SchemaFieldValue | undefined
	): void
	{
		this._originalValue = originalValue;
		this.value = value;

		return;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	/**
	 * Diese Eigenschaft ruft den Namen dieses Schemafeldes ab.
	 */
	public get name(): string
	{
		// Gib den intern gespeicherten Feldnamen zurück.
		return this._name;
	}

	public get state(): SchemaFieldState
	{
		// Gib den intern gespeicherten Feldzustand zurück.
		return this._state;
	}

	public get value(): SchemaFieldValue
	{
		return this._value;
	}

	public set value(value: SchemaFieldValue|undefined)
	{
		let state: SchemaFieldState;

		if(this._originalValue !== undefined && value === undefined)
			value = this._defaultValue;

		if(value === 'undefined')
		{
			state = SchemaFieldState.Removed;
		}
		else if(typeof(this._originalValue) === 'undefined')
		{
			state = SchemaFieldState.Added;
		}
		else if(this._originalValue === value)
		{
			state = SchemaFieldState.Unchanged;
		}
		else
		{
			state = SchemaFieldState.Modified;
		}

		let modified: boolean = this._value !== value;

		this._value = value;

		if(this.setState(state, false) || modified) this.onChanged(true);

		return;
	}

	public get default(): SchemaFieldValue | undefined
	{
		return this._defaultValue;
	}

	//#endregion
}
