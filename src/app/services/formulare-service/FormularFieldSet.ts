import { Subject } from "rxjs";
import { EventProperty, IEventProperty } from "src/app/tools/EventProperty";
import { Guid } from "src/app/tools/Guid";
import * as Utilities from "./FormularUtils";
import { asGuid } from "./FormularUtils";

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Ablaufverfolgungsmeldungen der `FormularFieldSet` Klasse in
 * der Browser Konsole.
 */
const TRACE_FORMULAR_FIELD_SET: boolean = false;

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Debug-Meldungen der `FormularFieldSet` Klasse in der Browser
 * Konsole.
 */
const DEBUG_FORMULAR_FIELD_SET: boolean = true;

/**
 * Diese Methode gibt eine Ablaufverfolgungsmeldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `TRACE_FORMULAR_FIELD_SET` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
 * wird.
 *
 * @param identifier
 * 	Der Name/Identifikator des Ablaufs.
 *
 * @param mode
 * 	Der Modus der Ablaufverfolgungsmeldung: `true` => Der Ablauf hat begonnen. `false` => Der Ablauf ist
 * 	abgeschlossen. `null` oder `undefined` => Allgemeine Ablaufverfolgungsmeldung.
 *
 * @param optionalParams
 * 	Zusätzliche Werte die Protokolliert werden sollen.
 */
function log_trace(identifier: string, mode?: boolean, ...optionalParams: any[])
{
	// Prüfe ob die TRACE-Option aktiviert wurde und gib die Ablaufverfolgungsmeldung dementsprechend aus.
	if(true === TRACE_FORMULAR_FIELD_SET) Utilities.log_trace(identifier, mode, ...optionalParams);
}

/**
 * Diese Methode gibt eine 'DEBUG'-Meldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `DEBUG_FORMULAR_FIELD_SET` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
 * wird.
 *
 * @param message
 * 	Die auszugebende Meldung.
 *
 * @param optionalParams
 * 	Zusätzliche Werte die Protokolliert werden sollen.
 */
function log_debug(message: any, ...optionalParams: any[])
{
	// Prüfe ob die DEBUG-Option aktiviert wurde und gib die 'DEBUG'-Meldung dementsprechend aus.
	if(true === DEBUG_FORMULAR_FIELD_SET) Utilities.log_debug(message, ...optionalParams);
}

/**
 * Dieser Aufzählungstyp definiert alle gültigen Zustände, welche ein Formularwert haben kann.
 */
export enum FormularFieldSetState
{
	/**
	 * Der Wert wurde nicht verändert.
	 */
	Unchanged = 0,

	/**
	 * Der Wert wurde hinzugefügt.
	 */
	Added = 1,

	/**
	 * Der Wert wurde modifiziert.
	 */
	Modified = 2,

	/**
	 * Der Wert wurde gelöscht.
	 */
	Deleted = 4
}

/**
 * Diese Schnittstelle stellt die öffentliche API eines einzelnen Formularwertes/Formularbeilagenwertes zur verfügung.
 */
export interface IFormularFieldSet
{
	/**
	 * Diese Eigenschaft ruft den aktuellen Zustand dieses Formularwertes als Wert der `FormularFieldSetState` Enumeration
	 * ab.
	 */
	readonly state: FormularFieldSetState;

	/**
	 * Diese Eigenschaft ruft die Attribut-GUID dieses Formularwertes als `Guid` Instanz ab.
	 */
	readonly guid: Guid;

	/**
	 * Diese Eigenschaft ruft den Index dieses Formularwertes ab.
	 */
	readonly index: number;

	/**
	 * Diese Eigenschaft ruft den effektiven Wert dieses Formularwertes ab oder setzt diesen.
	 *
	 * Dieser Wert muss serialisiert als Text abgespeichert werden. `null` Werte sind zulässig.
	 *
	 * Wenn dieser Formularwert den Zustand `Deleted` hat, gibt diese Eigenschaft ebenfalls den Wert `null` zurück.
	 */
	data: string|null;

	/**
	 * Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onChanged'
	 * Ereignis registriert werden können.
	 *
	 * Das 'onChanged' Ereignis wird aufgerufen wenn sich der Wert dieser `IFormularFieldSet` Instanz verändert hat.
	 */
	readonly changed: IEventProperty<FormularFieldSetChangedEvent>;

	/**
	 * Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onLoaded'
	 * Ereignis registriert werden können.
	 *
	 * Das 'onLoaded' Ereignis wird vom Formulare-Service ausgelöst, wenn dieser das Formular bzw. die Formularbeilagen
	 * und deren Werte komplett geladen hat.
	 */
	readonly loaded: IEventProperty<FormularFieldSetLoadedEvent>;

	/**
	 * Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onSaving'
	 * Ereignis registriert werden können.
	 *
	 * Das 'onSaving' Ereignis wird vom Formulare-Service ausgelöst, wenn dieser die Daten zum speichern aufbereitet.
	 */
	readonly saving: IEventProperty<FormularFieldSetSavingEvent>;
}

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onChanged` Ereignis der `FormularFieldSet` Klasse.
 */
export type FormularFieldSetChangedEvent = (eventData: IFormularFieldSetChangedEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onChanged` Ereignisse der `FormularFieldSet` Klasse.
 */
export interface IFormularFieldSetChangedEventData
{
	/**
	 * Dieses Feld enthält die `IFormularFieldSet` Instanz wessen Wert verändert wurde.
	 */
	formValue: IFormularFieldSet;
};

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onLoaded` Ereignis der `FormularFieldSet` Klasse.
 */
export type FormularFieldSetLoadedEvent = (eventData: IFormularFieldSetLoadedEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onLoaded` Ereignisse der `FormularFieldSet` Klasse.
 */
export interface IFormularFieldSetLoadedEventData
{
	/**
	 * Dieses Feld enthält die `IFormularFieldSet` Instanz welche neu geladen wurde.
	 */
	formValue: IFormularFieldSet;
};

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onSaving` Ereignis der `FormularFieldSet` Klasse.
 */
export type FormularFieldSetSavingEvent = (eventData: IFormularFieldSetSavingEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onSaving` Ereignisse der `FormularFieldSet` Klasse.
 */
export interface IFormularFieldSetSavingEventData
{
	/**
	 * Dieses Feld enthält die `IFormularFieldSet` Instanz welche gespeichert werden soll.
	 */
	formValue: IFormularFieldSet;
};

/**
 * Diese Klasse speichert den Zustand sowie den wert eines Formular-Wertes.
 */
export class FormularFieldSet implements IFormularFieldSet
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert die Observer-Instanz welche benachrichtigt werden soll, wenn sich der Wert dieser Instanz
	 * verändert hat.
	 */
	private readonly _changeNotifier$: Subject<FormularFieldSet>;

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn der Daten-Wert dieser Instanz
	 * verändert wurde.
	 */
	private readonly _onChanged: EventProperty<FormularFieldSetChangedEvent> =
		new EventProperty<FormularFieldSetChangedEvent>();

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn der Daten-Wert dieser Instanz
	 * neu geladen wurde.
	 */
	private readonly _onLoaded: EventProperty<FormularFieldSetLoadedEvent> =
		new EventProperty<FormularFieldSetLoadedEvent>();

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn der Daten-Wert dieser Instanz
	 * gespeichert werden soll.
	 */
	private readonly _onSaving: EventProperty<FormularFieldSetSavingEvent> =
		new EventProperty<FormularFieldSetSavingEvent>();

	/**
	 * Dieses Feld speichert den aktuellen Zustand dieses Formular Wertes.
	 */
	private _state: FormularFieldSetState = FormularFieldSetState.Unchanged;

	/**
	 * Dieses Feld speichert die GUID des Attributes, wessen Wert diese Instanz speichert.
	 */
	private readonly _guid: Guid;

	/**
	 * Dieses Feld speichert den Index des Attributes, wessen Wert diese Instanz speichert.
	 */
	private readonly _index: number;

	/**
	 * Dieses Feld speichert den originalen Wert des Attributes, wessen Wert diese Instanz speichert.
	 */
	private _originalValue: string|undefined = undefined;

	/**
	 * Dieses Feld speichert den aktuellen Wert des Attributes, wessen Wert diese Instanz speichert.
	 */
	private _currentValue: string = '';

	//#endregion

	//#region Öffentlicher Konstruktor.

	// TODO: Add Comments!
	public constructor(
		guid: string | Guid,
		index: number = 0,
		changeNotifier: Subject<FormularFieldSet> = null
	)
	{
		this._guid = asGuid(guid);
		this._index = index;
		this._changeNotifier$ = changeNotifier;

		return;
	}

	//#endregion

	//#region Private Methoden.

	/**
	 * Diese Methode setzt den neuen Zustand dieses Formular-Wertes. Sollte sicher der Zustand verändert haben, wird
	 * auch der Änderungs-Observator benachrichtigt.
	 *
	 * @param events
	 * 	`true` um Ereignisse auszulösen, sollte sicher der Zustand dieses Formular-Wertes ändern oder `false` um diese
	 * 	Ereignisse zu unterbinden.
	 *
	 * @returns
	 * 	`true` wenn sich der Zustand dieser Formular-Wertes verändert hat, ansonsten `false`.
	 */
	private setState(state: FormularFieldSetState, events: boolean = true): boolean
	{
		// Prüfe ob sich der Zustand dieses Formular-Wertes verändert hat.
		if(this._state !== state)
		{
			// Neuer Zustand, speichere diesen intern.
			this._state = state;

			// Prüfe ob wir ein Ereignis für die Zustandsänderung auslösen sollen. Falls ja, löse diese nun aus.
			if(events === true) this.onChanged();

			// Und bin nun `true` zurück um anzuzeigen dass sich der Zustand dieses Formular-Wertes verändert hat.
			return true;
		}

		// Der Zustand hat sich nicht verändert, gib deshalb `false` zurück.
		return false;
	}

	/**
	 * Diese Methode handhabt die Rückmeldung über den geänderten Formularwert sowie das Aufrufen der registrierten
	 * Callback Funktionen.
	 */
	private onChanged(): void
	{
		const __METHOD_NAME__: string = 'FormularFieldSet::onChanged';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, this);

		// Benachrichtige den Observator über die Zustandsänderung.
		this._changeNotifier$?.next(this);

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onChanged.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formValue: this });
			}
			catch(error)
			{
				// Es ist ein Fehler in der Callback Funktion aufgetreten, protokolliere diesen Fehler in der Browser
				// Konsole.
				console.error(
					`Uncaught exception in '${__METHOD_NAME__}' callback!`,
					{
						instance: this,
						callback: callback,
						error: error
					}
				);
			}
		}

		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, false);

		// Alles erledigt, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode handhabt die Rückmeldung über den neu geladenen Formularwertes sowie das Aufrufen der registrierten
	 * Callback Funktionen.
	 */
	private onLoaded(): void
	{
		const __METHOD_NAME__: string = 'FormularFieldSet::onLoaded';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { value: this });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onLoaded.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formValue: this });
			}
			catch(error)
			{
				// Es ist ein Fehler in der Callback Funktion aufgetreten, protokolliere diesen Fehler in der Browser
				// Konsole.
				console.error(
					`Uncaught exception in '${__METHOD_NAME__}' callback!`,
					{
						instance: this,
						callback: callback,
						error: error
					}
				);
			}
		}

		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, false);

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode handhabt die Rückmeldung über den bevorstehenden Speichervorgang dieses Formularwertes sowie das
	 * Aufrufen der registrierten Callback Funktionen.
	 */
	private onSaving(): void
	{
		const __METHOD_NAME__: string = 'FormularFieldSet::onSaving';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { value: this });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onSaving.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formValue: this });
			}
			catch(error)
			{
				// Es ist ein Fehler in der Callback Funktion aufgetreten, protokolliere diesen Fehler in der Browser
				// Konsole.
				console.error(
					`Uncaught exception in '${__METHOD_NAME__}' callback!`,
					{
						instance: this,
						callback: callback,
						error: error
					}
				);
			}
		}

		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, false);

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode markiert diesen Formular-Wert als gelöscht.
	 */
	public markAsDeleted(): void
	{
		// Setze den Status dieses Formular-Wertes auf gelöscht.
		this.setState(FormularFieldSetState.Deleted, true);

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode prüft ob die spezifizierte `FormularFieldSet` Instanz den selben Wert beschreibt wie diese
	 * `FormularFieldSet` Instanz.
	 *
	 * @param value
	 * 	Die `FormularFieldSet` Instanz welche verglichen werden soll.
	 *
	 * @returns
	 * 	`true` wenn die spezifizierte `FormularFieldSet` den selben Wert beschreibt, ansonsten `false`.
	 *
	 * @throws {TypeError}
	 * 	Es wurde keine `FormularFieldSet` Instanz spezifiziert!
	 */
	public equalValue(value: FormularFieldSet): boolean;

	/**
	 * Diese Methode prüft ob der spezifizierte Index und die spezifizierte Attribut-GUID mit den entsprechenden Werten
	 * dieser `FormularFieldSet` Instanz übereinstimmt.
	 *
	 * @param attribute
	 * 	Die GUID des Attributes entweder als Zeichenkette oder als `Guid` Instanz.
	 *
	 * @param index
	 * 	Der optionale Index des Attributes. Wird dieser nicht spezifiziert wird der Index: `0` angenommen.
	 *
	 * @returns
	 * 	`true` wenn die Attribut-GUID und der Index dieser `FormularFieldSet` Instanz übereinstimmt mit den
	 * 	spezifizierten Werten, ansonsten `false`.
	 *
	 * @throws {TypeError}
	 * 	Es wurde keine `Guid` Instanz noch eine gültige GUID Zeichenkette spezifiziert!
	 */
	public equalValue(attribute: string|Guid, index?: number): boolean;

	/**
	 *	Diese Methode prüft ob diese `FormularFieldSet` Instanz die selbe Attribut-GUID und den selben Index wie die
	 * spezifizierten Werte aufweist.
	 *
	 * @param value
	 * 	Entweder eine `FormularFieldSet` Instanz welche verglichen werden soll oder die Attribut-GUID entweder als
	 * 	Zeichenkette oder als `Guid` Instanz.
	 *
	 * @param index
	 * 	Der optionale Index des Attributes. Wird dieser nicht spezifiziert wird der Index: `0` angenommen. Dieser
	 * 	Parameter wird nur berücksichtigt wenn eine Attribut-GUID spezifiziert wurde.
	 *
	 * @returns
	 * 	`true` wenn die Werte übereinstimmen, ansonsten `false`.
	 *
	 * @throws {TypeError}
	 * 	Es wurde weder eine `FormularFieldSet` Instanz, eine `Guid` Instanz noch eine gültige GUID Zeichenkette
	 * 	spezifiziert!
	 */
	public equalValue(value: string|Guid|FormularFieldSet, index: number = 0): boolean
	{
		// Wurde eine `FormularFieldSet` Instanz spezifiziert?
		if(value instanceof FormularFieldSet)
		{
			// Ja, also vergleiche die Attribut-GUID und den Index der spezifizierten `FormularFieldSet` Instanz mit den
			// in dieser Instanz gespeicherten Werten. Gib das Resultat dieser Überprüfung dann zurück.
			return (
				this.index === (<FormularFieldSet>value)._index &&
				true === this.guid.equals((<FormularFieldSet>value)._guid)
			);
		}
		else
		{
			// Nein, also vergleiche zuerst den Index mit dem in dieser Instanz gespeicherten Index. Sofern diese
			// übereinstimmen, vergleiche dann die in dieser Instanz gespeicherten Attribut-GUID mit der spezifizierten
			// Attribut-GUID. Konvertiere diese vorgäng in eine `Guid` Instanz falls nötig. Gib das Resultat dieser
			// Überprüfung dann zurück.
			return (
				this.index === index &&
				true === this.guid.equals(asGuid(value))
			);
		}
	}

	// TODO: Add comments!
	public loadValue(
		value: string,
		originalValue: string|undefined = undefined,
		valueState: FormularFieldSetState = FormularFieldSetState.Unchanged,
		suppressEvents: boolean = false
	): void
	{
		this._originalValue = originalValue;
		this._currentValue = value;
		this._state = valueState;

		if(suppressEvents !== true)
		{
			this.onLoaded();
			this.onChanged();
		}

		return;
	}

	// TODO: Add comments!
	public saveValue(): void
	{
		this.onSaving();

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	/** @inheritdoc */
	public get state(): FormularFieldSetState
	{
		// Gib den intern gespeicherten Zustand des Wertes zurück.
		return this._state;
	}

	/** @inheritdoc */
	public get guid(): Guid
	{
		// Gib die intern gespeicherte Attribut-GUID zurück.
		return this._guid;
	}

	/** @inheritdoc */
	public get index(): number
	{
		// Gib den intern gespeicherten Index dieses Wertes zurück.
		return this._index;
	}

	/** @inheritdoc */
	public get data(): string|null
	{
		// Prüfe ob der aktuelle Zustand dieses Wertes gelöscht ist.
		if(this._state == FormularFieldSetState.Deleted)
		{
			// Ja, gib deshalb den Wert `null` zurück.
			return null;
		}
		else
		{
			// Nein, also gib den aktuellen Wert zurück.
			return this._currentValue;
		}
	}

	/** @inheritdoc */
	public set data(data: string|null)
	{
		// Prüfe ob diese `FormularFieldSet` Instanz als gelöscht markiert wurde. Falls ja, tue nichts.
		if(this.state === FormularFieldSetState.Deleted) return;

		// Speichere nun den neuen Wert im internen Feld mit dem aktuellen Wert.
		this._currentValue = data;

		// Prüfe ob diese `FormularFieldSet` Instanz als hinzugefügt markiert wurde. Falls ja, tue nichts.
		if(this.state === FormularFieldSetState.Added) return;

		// Prüfe nun ob der Wert dieser `FormularFieldSet` nicht mehr dem originalen Wert entspricht. Speichere das Resultat
		// dieser Überprüfung dann in einer lokalen Variable.
		let modified: boolean = this._originalValue !== this._currentValue;

		// Setzte nun den neuen Zustand dieser `FormularFieldSet` basierend darauf ob der Wert mit dem originalen Wert
		// übereinstimmt oder nicht. Unterdrücke dabei jegliche Ereignisse. Prüfe dann ob der Wert oder der Zustand
		// verändert wurden und speichere diesen Indikator in unserer lokalen Variable.
		modified =
			this.setState(
				modified ? FormularFieldSetState.Modified : FormularFieldSetState.Unchanged,
				false
			) || modified;

		// Sofern der Wert oder der Zustand verändert wurde, löse das 'onChanged' Ereignis aus.
		if(modified) this.onChanged();

		// Wir sind fertig, verlasse nun diese Methode.
		return;
	}

	/** @inheritdoc */
	public get changed(): IEventProperty<FormularFieldSetChangedEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onChanged' Ereignis zurück.
		return this._onChanged;
	}

	/** @inheritdoc */
	public get loaded(): IEventProperty<FormularFieldSetLoadedEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onLoaded' Ereignis zurück.
		return this._onLoaded;
	}

	/** @inheritdoc */
	public get saving(): IEventProperty<FormularFieldSetSavingEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onSaving' Ereignis zurück.
		return this._onSaving;
	}

	//#endregion
}
