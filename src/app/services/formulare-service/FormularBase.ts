import { Subject } from "rxjs";
import { EDokumentDTO, EDokumentWertDTO } from "src/app/api";
import { EventProperty, IEventProperty } from "src/app/tools/EventProperty";
import { Guid } from "src/app/tools/Guid";
import { FormularFieldSet, FormularFieldSetState, IFormularFieldSet } from "./FormularFieldSet";
import * as Utilities from "./FormularUtils";
import { asGuid } from './FormularUtils';

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Ablaufverfolgungsmeldungen der `FormularBase` Klasse in
 * der Browser Konsole.
 */
const TRACE_FORMULAR_BASE: boolean = false;

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Debug-Meldungen der `FormularBase` Klasse in der Browser
 * Konsole.
 */
const DEBUG_FORMULAR_BASE: boolean = true;

/**
 * Diese Methode gibt eine Ablaufverfolgungsmeldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `TRACE_FORMULAR_BASE` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
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
	if(true === TRACE_FORMULAR_BASE) Utilities.log_trace(identifier, mode, ...optionalParams);
}

/**
 * Diese Methode gibt eine 'DEBUG'-Meldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `DEBUG_FORMULAR_BASE` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
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
	if(true === DEBUG_FORMULAR_BASE) Utilities.log_debug(message, ...optionalParams);
}

/**
 * Dieser Aufzählungstyp definiert alle gültigen Zustände, welche ein Formular/eine Formularbeilage haben kann.
 */
export enum FormularState
{
	/**
	 * Das Formular/die Formularbeilage wurde nicht verändert.
	 */
	 Unchanged = 0,

	 /**
	  * Das Formular/die Formularbeilage wurde hinzugefügt.
	  */
	 Added = 1,

	 /**
	  * Das Formular/die Formularbeilage wurde modifiziert.
	  */
	 Modified = 2,

	 /**
	  * Das Formular/die Formularbeilage wurde gelöscht.
	  */
	 Deleted = 4
}

/**
 * Diese Schnittstelle repräsentiert die Basisschnittstelle eines Formulars/einer Formularbeilage.
 */
export interface IFormularBase
{
	//#region Methoden.

	// TODO: Add Comments!
	addFieldSetValue(attribute: string | Guid, index: number, data: string): void;
	getFieldSetValue(attribute: string | Guid, index: number): string|null|undefined;
	putFieldSetValue(attribute: string | Guid, index: number, data: string): void;
	setFieldSetValue(attribute: string | Guid, index: number, data: string): void;
	removeFieldSetValue(attribute: string | Guid, index: number): boolean;

	getFormularFieldSet(attribute: string | Guid, index: number): IFormularFieldSet|undefined;
	getFormularFieldSetState(attribute: string | Guid, index: number): FormularFieldSetState|undefined;

	//#endregion

	//#region Eigenschaften.

	/**
	 * Diese Eigenschaft ruft den aktuellen Zustand dieses Formulars/dieser Formularbeilage als Wert der `FormularState`
	 * Enumeration ab.
	 */
	readonly state: FormularState;

	/**
	 * Diese Eigenschaft ruft die GUID dieses Formulars/dieser Formularbeilage zu Identifikationszwecken als `Guid`
	 * Instanz ab.
	 */
	readonly guid: Guid;

	/**
	 * Diese Eigenschaft ruft die Formulartyp GUID dieses Formulars/dieser Formularbeilage als `Guid` Instanz ab.
	 */
	readonly type: Guid;

	/**
	 * Diese Eigenschaft ruft einen Indikator ab, welcher anzeigt ob dieses Formular/diese Formularbeilage ein neu
	 * erstelltes Formular bzw. eine neu erstellte Formularbeilage repräsentiert oder nicht.
	 *
	 * `true` wenn es sich um ein neu erstelltes Formular/eine neu erstellte Formularbeilage handelt, ansonsten `false`.
	 */
	readonly isNew: boolean;

	/**
	 * Diese Eigenschaft ruft einen Indikator ab, welcher anzeigt ob diese `IFormularBase` Instanz ein Formular
	 * repräsentiert.
	 *
	 * `true` wenn es sich um ein (Haupt-)Formular handelt, ansonsten `false`.
	 */
	readonly isFormular: boolean;

	/**
	 * Diese Eigenschaft ruft einen Indikator ab, welcher anzeigt ob diese `IFormularBase` Instanz eine Formularbeilage
	 * repräsentiert.
	 *
	 * `true` wenn es sich um eine Formularbeilage handelt, ansonsten `false`.
	 */
	readonly isFormularBeilage: boolean

	/**
	 * Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onChanged'
	 * Ereignis registriert werden können.
	 *
	 * Das 'onChanged' Ereignis wird aufgerufen wenn sich der Wert dieser `IFormularFieldSet` Instanz verändert hat.
	 */
	readonly changed: IEventProperty<FormularBaseChangedEvent>;

	/**
	* Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onLoaded'
	* Ereignis registriert werden können.
	*
	* Das 'onLoaded' Ereignis wird vom Formulare-Service ausgelöst, wenn dieser das Formular bzw. die Formularbeilagen
	* und deren Werte komplett geladen hat.
	*/
	readonly loaded: IEventProperty<FormularBaseLoadedEvent>;

	/**
	* Diese Eigenschaft ruft die Multicast-Delegate Instanz ab, mittels welcher Callback Funktionen für das 'onSaving'
	* Ereignis registriert werden können.
	*
	* Das 'onSaving' Ereignis wird vom Formulare-Service ausgelöst, wenn dieser die Daten zum speichern aufbereitet.
	*/
	readonly saving: IEventProperty<FormularBaseSavingEvent>;

	//#endregion
}

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onChanged` Ereignis der `FormularBase` Klasse.
 */
export type FormularBaseChangedEvent = (eventData:IFormularBaseChangedEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onChanged` Ereignisse der `FormularBase` Klasse.
 */
export interface IFormularBaseChangedEventData
{
	/**
	 * Dieses Feld speichert die `IFormularBase` Instanz, welche modifiziert wurde.
	 */
	formular: IFormularBase;

	/**
	 * Diese Feld speichert die `IFormularFieldSet` Instanz dessen Wert verändert wurde oder den `null` Wert wenn
	 * Eigenschaften des Formular, der Formularbeilage oder die Formularbeilagen verändert wurden.
	 */
	value: IFormularFieldSet|null;
};

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onLoaded` Ereignis der `FormularBase` Klasse.
 */
export type FormularBaseLoadedEvent = (eventData:IFormularBaseLoadedEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onLoaded` Ereignisse der `FormularBase` Klasse.
 */
export interface IFormularBaseLoadedEventData
{
	/**
	 * Dieses Feld speichert die `IFormularBase` Instanz, welche (neu) geladen wurde.
	 */
	formular: IFormularBase;

	/**
	 * Dieses Feld speichert ein Array welches alle `IFormularFieldSet` Instanzen enthält, wessen Werte verändert wurden.
	 */
	changed: IFormularFieldSet[];

	/**
	 * Dieses Feld speichert ein Array welches alle `IFormularFieldSet` Instanzen enthält, welche hinzugefügt wurden.
	 */
	added: IFormularFieldSet[];

	/**
	 * Dieses Feld speichert ein Array welches alle `IFormularFieldSet` Instanzen enthält, welche entfernt wurden.
	 */
	removed: IFormularFieldSet[];
};

/**
 * Dieser Typ definiert die Signatur der Callback Funktion für ein `onSaving` Ereignis der `FormularBase` Klasse.
 */
export type FormularBaseSavingEvent = (eventData:IFormularBaseSavingEventData) => void;

/**
 * Diese Schnittstelle definiert das Ereignisdaten-Objekt für  `onSaving` Ereignisse der `FormularBase` Klasse.
 */
export interface IFormularBaseSavingEventData
{
	/**
	 * Dieses Feld speichert die `IFormularBase` Instanz, welche gespeichert werden soll.
	 */
	formular: IFormularBase;
};

/**
 * Dieser Typ deklariert den effektiven Typen des Subjektes, welcher im Änderungsobservator für `FormularBase`
 * Instanzen verwendet wird.
 */
export type FormularBaseChangeNotifierType =
{
	/**
	 * Dieses Feld speichert die `FormularBase` Instanz, welche modifiziert wurde.
	 */
	formular: FormularBase;

	/**
	 * Diese Feld speichert die `FormularFieldSet` Instanz dessen Wert verändert wurde oder den `null` Wert wenn
	 * Eigenschaften des Formular, der Formularbeilage oder die Formularbeilagen verändert wurden.
	 */
	value: FormularFieldSet|null;
};

/**
 * Dieser Typ definiert den Typen eines `FormularFieldSet` Instanz Deskriptor wie er innerhalb der `FormularBase` Klasse
 * verwendet wird.
 */
type FormularFieldSetDescriptor =
{
	/**
	 * Dieses Feld speichert die `FormularFieldSet` Instanz dieses Deskriptor oder `null` wenn dieser Deskriptor leer ist.
	 */
	fieldSet: FormularFieldSet|null;

	/**
	 * Dieses Feld speichert den internen Index der `FormularFieldSet` Instanz oder `-1` wenn dieser Deskriptor leer ist.
	 */
	index: number;
};

/**
 * Diese Basisklasse stellt die gemeinsame Funktionalität für Formulare und Formularbeilagen bereit.
 */
export abstract class FormularBase implements IFormularBase
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert die Observer-Instanz, welche benachrichtigt werden soll, wenn sich ein Wert dieses
	 * Formulars/dieser Formularbeilage verändert hat.
	 */
	private readonly _valueChanged$: Subject<FormularFieldSet> = new Subject<FormularFieldSet>();

	/**
	 * Dieses Feld speichert die Observer-Instanz welche benachrichtigt werden soll, wenn sich der Wert dieser Instanz
	 * verändert hat.
	 */
	private readonly _changeNotifier$: Subject<FormularBaseChangeNotifierType>;

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn ein Daten-Wert dieser Instanz
	 * verändert wurde.
	 */
	private readonly _onChanged: EventProperty<FormularBaseChangedEvent> =
		new EventProperty<FormularBaseChangedEvent>();

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn diese Instanz neu geladen
	 * wurde.
	 */
	private readonly _onLoaded: EventProperty<FormularBaseLoadedEvent> =
		new EventProperty<FormularBaseLoadedEvent>();

	/**
	 * Dieses Feld speichert alle Callback-Methoden, welche aufgerufen werden sollen, wenn diese Instanz gespeichert
	 * werden soll.
	 */
	private readonly _onSaving: EventProperty<FormularBaseSavingEvent> =
		new EventProperty<FormularBaseSavingEvent>();

	/**
	 * Dieses Feld speichert die GUID dieses Formulars/dieser Formularbeilage, welche zur Identifikation benötigt wird.
	 */
	private readonly _guid: Guid;

	/**
	 * Dieses Feld speichert die Formulartyp-GUID dieses Formulars/dieser Formularbeilage.
	 */
	private readonly _typeGuid: Guid;

	/**
	 * Dieses Feld speichert die Dokument-DTO Instanz, aus welcher die Werte geladen wurden und in welche die Änderungen
	 * gespeichert werden sollen.
	 */
	private _document: EDokumentDTO;

	/**
	 * Dieses Feld speichert ein Array von `FormularFieldSet` Instanzen, welche die aktuellen Formular-Werte und den
	 * jeweiligen Status Status repräsentieren.
	 */
	private _values: FormularFieldSet[] = [ ];

	/**
	 * Dieses Feld speichert den aktuellen Zustand dieses Formulars/dieser Formularbeilage.
	 */
	private _state: FormularState;

	/**
	 * Dieses Feld speichert einen Indikator, welcher anzeigt ob das Formular/die Formularbeilage ein neues Formular /
	 * eine neue Formularbeilage ist oder nicht.
	 *
	 * `true` wenn das Formular/die Formularbeilage neu ist, ansonsten `false`.
	 */
	protected _isNew: boolean;

	//#endregion

	//#region Konstruktor.

	protected constructor(
		guid: string | Guid | null,
		typeGuid: string | Guid,
		document: EDokumentDTO,
		isNew: boolean = false,
		changeNotifier: Subject<{ formular: FormularBase, value: FormularFieldSet }>,
		state: FormularState = FormularState.Unchanged
	)
	{
		this._guid = guid ? asGuid(guid) : null;
		this._typeGuid = asGuid(typeGuid);
		this._state = state;
		this._isNew = isNew;
		this._changeNotifier$ = changeNotifier;

		this._valueChanged$.subscribe(
			(value: FormularFieldSet) => {
				this.onValueChanged(value);
			}
		);

		this.loadDocument(document, true);

		return;
	}

	//#endregion

	//#region Geschützte Methoden.

	/**
	 * Diese Methode ruft die `FormularFieldSet` Instanz sowie deren Index im intern gespeicherten Werte-Array ab, welche
	 * den Wert des spezifizierten Attributes und Index repräsentiert.
	 *
	 * @param attribute
	 * 	Die GUID des Attributes, wessen Wert abgerufen werden soll.
	 *
	 * @param index
	 * 	Der Index des Wertes, welcher abgerufen werden soll.
	 *
	 * @returns
	 * 	Ein Deskriptor, welches die `FormularFieldSet` Instanz enthält welche den spezifizierten Wert repräsentiert sowie
	 * 	den Index innerhalb des internen Werte-Arrays. Wurde das Attribute oder der spezifizierte Index nicht gefunden
	 * 	gibt diese Funktion stattdessen den `null` Wert sowie den Index -1 zurück.
	 */
	protected getFormularFieldSetDescriptor(attribute: string | Guid, index: number): FormularFieldSetDescriptor
	{
		// Prüfe ob wir überhaupt irgendwelche Werte haben.
		if(this._values.length <= 0)
		{
			// Nein, also gib den `null` Wert sowie den Index -1 zurück.
			return { fieldSet: null, index: -1 };
		}

		// Versuche nun den Index der entsprechenden `FormularFieldSet` Instanz abzurufen und speichere diesen in einer
		// lokalen Variable.
		const i: number = this._values.findIndex((v) => v.equalValue(attribute, index));

		// Haben wir den spezifizierten Wert gefunden?
		if(i === -1)
		{
			// Nein, also gib den `null` Wert sowie den Index -1 zurück.
			return { fieldSet: null, index: -1 };
		}
		else
		{
			// Ja, also rufe die entsprechende `FormValue` Instanz ab und gib diese sowie den dazugehörigen Index zurück.
			return { fieldSet: this._values[i], index: i };
		}
	}

	protected setState(value: FormularState): void {
		if (this._state !== value) {
			this._state = value;
			this._changeNotifier$.next({formular: this, value: null});
			this.onChanged(null);
		}
	}

	/**
	 * Diese Methode benachrichtigt den Änderungs-Observator, dass sich ein Wert oder dessen Zustand verändert hat und
	 * ruft die registrierten Callback Funktionen des 'onChanged' Ereignisses auf.
	 *
	 * @param value
	 * 	Der Wert, welcher verändert wurde oder dessen Zustand sich geändert hat.
	 */
	protected onValueChanged(value: FormularFieldSet): void
	{
		const __METHOD_NAME__: string = 'FormularBase::onValueChanged';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { formular: this, value: value });

		// Prüfe ob der aktuelle Zustand dieses Formulars/dieser Formularbeilage `unverändert` oder `modifiziert` ist.
		if(this._state === FormularState.Unchanged || this._state === FormularState.Modified)
		{
			// Das Formular/die Formularbeilage ist unverändert oder wurde modifiziert. Aktualisiere nun den Zustand
			// anhand der Zustände der einzelnen Feldwerte.
			this._state =
				-1 === this._values.findIndex((v) => v.state !== FormularFieldSetState.Unchanged) ?
					FormularState.Unchanged :
					FormularState.Modified;
		}

		// Benachrichtige den entsprechenden Observator das sich einer der Werte verändert hat.
		this._changeNotifier$?.next({ formular: this, value: value });

		// Löse nun das 'onChanged' Ereignis aus.
		this.onChanged(value);

		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, false);

		// Wir sind fertig, verlasse diese Methode.
		return;
	}

	/**
	 * Diese Methode wird aufgerufen, wenn sich ein Wert dieses Formulars/dieser Formularbeilage verändert hat und ruft
	 * die registrierten Callback Funktionen des 'onChanged' Ereignisses auf.
	 */
	protected onChanged(value: FormularFieldSet): void
	{
		const __METHOD_NAME__: string = 'FormularBase::onChanged';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { formular: this });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onChanged.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formular: this, value: value });
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

		// Wir sind fertig, verlasse diese Methode.
		return;
	}

	/**
	 * Diese Methode wird aufgerufen, wenn ein neues Formular/eine neue Formularbeilage geladen wurde und ruft die
	 * registrierten Callback Funktionen des 'onLoaded' Ereignisses auf.
	 *
	 * @param changed
	 * 	Ein Array mit `FormularFieldSet` Instanzen, wessen Werte sich verändert haben.
	 *
	 * @param added
	 * 	Ein Array mit `FormularFieldSet` Instanzen, welche neu im Formular/in der Formularbeilage gespeichert sind.
	 *
	 * @param removed
	 * 	Ein Array mit `FormularFieldSet` Instanzen, welche nicht länger im Formular/in der Formularbeilage gespeichert
	 * 	sind.
	 */
	protected onLoaded(changed: FormularFieldSet[], added: FormularFieldSet[], removed: FormularFieldSet[]): void
	{
		const __METHOD_NAME__: string = 'FormularBase::onLoaded';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { formular: this });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onLoaded.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({
					formular: this,
					changed: Object.assign([ ], changed),
					added: Object.assign([ ], added),
					removed: Object.assign([ ], removed)
				});
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

		// Wir sind fertig, verlasse diese Methode.
		return;
	}

	/**
	 * Diese Methode wird aufgerufen, wenn das Formular/die Formularbeilage gespeichert werden soll und ruft die
	 * registrierten Callback Funktionen des 'onSaving' Ereignisses auf.
	 */
	protected onSaving(): void
	{
		const __METHOD_NAME__: string = 'FormularBase::onSaving';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { formular: this });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onSaving.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formular: this });
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

		// Wir sind fertig, verlasse diese Methode.
		return;
	}

	/**
	 * Diese Methode speichert die spezifizierte Dokument DTO Instanz intern und aktualisiert alle `FormValue`
	 * Instanzen und löst die entsprechenden Ereignisse aus.
	 *
	 * @param document
	 * 	Die zu ladende Dokument DTO Instanz.
	 *
	 * @param force
	 * 	`true` um alle ungesicherten Änderungen zu verwerfen, ansonsten `false`.
	 */
	protected loadDocument(document: EDokumentDTO, force: boolean): void
	{
		const __METHOD_NAME__: string = 'FormularBase::loadDocument';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { instance: this, document: document, force: force });

		try
		{
			// Deklariere drei lokale Variablen, welche jeweils ein Array von `FormularFieldSet` Instanzen speichern, für neu
			// hinzugefügte, veränderte/aktualisierte sowie gelöschte Formularwerte. Initialisiere jeder dieser Variablen
			// mit einem leeren Array.
			let addedValues: FormularFieldSet[] = [ ];
			let changedValues: FormularFieldSet[] = [ ];
			let removedValues: FormularFieldSet[] = [ ];

			// Deklariere noch eine weitere lokale Variable, welche ein Array `FormularFieldSet` Instanzen speichert. Diese
			// Variable speichert alle `FormularFieldSet` Instanzen, welche im spezifizierten Dokument gespeichert sind.
			let formularValues: FormularFieldSet[] = [ ];

			// Iteriere über alle Werte des spezifizierten Dokumentes. In diesem Schritt aktualisieren wir bestehende
			// Werte und fügen neue ein.
			if (document?.werte) {
				for (let dtoValue of document?.werte) {
					// Konvertiere als erstes die Attribut-GUID des aktuell iterierten Dokumentwertes in eine `Guid` Instanz
					// und speichere diese dann in einer lokalen Variable.
					let attributGuid: Guid = asGuid(dtoValue.attribut);

					// Versuche nun eine `FormularFieldSet` Instanz für den aktuell iterierten Dokumentwert instanziiert im intern
					// gespeicherten Array von `FormularFieldSet` Instanzen zu finden. Speichere diese Instanz dann in einer
					// lokalen Variable.
					let formValue: FormularFieldSet | undefined =
						this._values.find(
							(v: FormularFieldSet) =>
								v.index === dtoValue.index &&
								v.guid.equals(attributGuid) === true
						);

					// Haben wir eine entsprechende `FormularFieldSet` Instanz gefunden? Falls ja, prüfe ob sich deren Wert
					// verändert hat.
					if (formValue !== undefined && formValue.data !== dtoValue.daten) {
						// Ja, also füge die `FormularFieldSet` Instanz in unser Array der aktualisierten Werte ein.
						changedValues.push(formValue);
					}
					// Haben wir keine entsprechende `FormularFieldSet` Instanz gefunden?
					else if (formValue === undefined) {
						// Nein, also instantiiere eine neue `FormularFieldSet` Instanz und speichere diese in unserer lokalen
						// Variable ab.
						formValue = new FormularFieldSet(attributGuid, dtoValue.index, this._valueChanged$);

						// Füge diese `FormularFieldSet` Instanz nun noch in unser Array der hinzugefügten Werte ein.
						addedValues.push(formValue);
					}

					// Aktualisiere den aktuellen Wert sowie den Originalwert der `FormularFieldSet` Instanz. Markiere diesen Wert
					// dann noch als unverändert.
					formValue.loadValue(dtoValue.daten, dtoValue.daten, FormularFieldSetState.Unchanged);

					// Fast fertig, füge die aktuelle `FormularFieldSet` Instanz noch zu unserem Array von `FormularFieldSet`
					// Instanzen hinzu.
					formularValues.push(formValue);
				}
			}

			// Iteriere nun über alle intern gespeicherten `FormularFieldSet` Instanzen. In diesem Schritt entfernen wir
			// Werte, welche nicht länger im Formular vorhanden sind.
			for(let formValue of this._values)
			{
				// Prüfe ob der Wert der aktuell iterierten `FormularFieldSet` Instanz noch benötigt wird.
				if(-1 === formularValues.indexOf(formValue))
				{
					// Nein, also ist dieser Wert nicht mehr im Formular bzw. der Formularbeilage gespeichert. Markiere
					// diesen Wert nun als gelöscht.
					formValue.markAsDeleted();

					// Füge diese Instanz nun in unser Array mit gelöschten Formularwerten ein.
					removedValues.push(formValue);
				}
			}

			// Aktualisiere nun die intern gespeicherten Werte sowie das intern gespeicherte Dokument-DTO.
			this._values = formularValues;
			this._document = document;

			// Prüfe nun noch, ob dieses Formular/diese Formularbeilage als geändert markiert ist. Falls ja, setzte den
			// Zustand zurück auf unverändert.
			if(this._state === FormularState.Modified) this._state = FormularState.Unchanged;

			// Löse nun das 'onLoaded' Ereignis aus.
			this.onLoaded(changedValues, addedValues, removedValues);

			// DEBUG; Logge die Werte, welche geladen werden.
			log_debug(
				`Saving formular: ${this.guid?.toString()}...`,
				{
					formular: this,
					dto: this._document,
					values: this._values
				}
			);
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode übernimmt alle Änderungen in die intern gespeicherte Dokument-DTO Instanz.
	 */
	protected saveDocument(): void
	{
		const __METHOD_NAME__: string = 'FormularBase::saveDocument';

		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace(__METHOD_NAME__, true, { formular: this });

		try
		{
			// Prüfe als erstes ob wir überhaupt Änderungen haben welche gesichert werden müssen.
			if(this.state === FormularState.Unchanged)
			{
				// Wir haben keine Änderungen welche gesichert werden müssen, kehre zurück.
				return;
			}

			// Wir haben Änderungen, übernimm nun alle Werte der `FormularFieldSet` Instanzen welche intern gespeichert sind
			// in das entsprechende Datentransferobjekt (DTO).
			for(let formularValue of this._values) formularValue.saveValue();

			// Löse nun das 'onSaving' Ereignis aus.
			this.onSaving();

			// Ersetze nun alle Werte in der DTO Instanz mit den aktuellen Werten dieser Instanz.
			this._document.werte =
				this._values.map(
					(v: FormularFieldSet) => {
						return {
							attribut: v.guid.toString(),
							index: v.index,
							daten: v.data
						} as EDokumentWertDTO;
					}
				);

			// DEBUG; Logge die Werte, welche gespeichert werden.
			log_debug(
				`Saving formular: ...`,
				{
					formular: this,
					dto: this._document,
					values: this._document.werte
				}
			);
		}
		finally
		{
			// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
			log_trace(__METHOD_NAME__, false);
		}

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	//#endregion

	//#region Öffentliche Methoden.

	/** @inheritdoc */
	public getFormularFieldSet(attribute: string | Guid, index: number): IFormularFieldSet
	{
		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. Falls wir diesen gefunden
		// haben, rufe dann dessen Wert ab und gib diesen zurück. Sollte der Wert nicht existieren, gib `undefined`
		// zurück.
		return this.getFormularFieldSetDescriptor(attribute, index).fieldSet ?? undefined;
	}

	/** @inheritdoc */
	public getFormularFieldSetState(attribute: string | Guid, index: number = 0): FormularFieldSetState
	{
		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. Falls wir diesen gefunden
		// haben, rufe dann dessen Status ab und gib diesen zurück. Sollte der Wert nicht existieren, gib `undefined`
		// zurück.
		return this.getFormularFieldSetDescriptor(attribute, index).fieldSet?.state ?? undefined;
	}

	/** @inheritdoc */
	public addFieldSetValue(attribute: string | Guid, index: number = 0, data: string): void
	{
		// Konvertiere die spezifizierte Attribut-GUID in eine `Guid`-Instanz falls nötig.
		attribute = asGuid(attribute);

		// Prüfe nun ob der spezifizierte Wert bereits existiert.
		if(null != this.getFormularFieldSetDescriptor(attribute, index).fieldSet)
		{
			// Der Wert existiert bereits, wirf eine Ausnahme!
			throw new TypeError(
				`The value with index: ${index} for the attribute: ${attribute.toString()} already exists!`
			);
		}

		// Der Wert existiert noch nicht, erstelle nun eine neue `FormularFieldSet` Instanz für den spezifizierten Wert und
		// speichere diese in einer lokalen Variable.
		const value: FormularFieldSet =
			new FormularFieldSet(
				attribute,
				index,
				this._valueChanged$
			);

		// Setzte nun den effektiven Wert und markiere diesen Wert dann als: 'Hinzugefügt'.
		value.loadValue(data, data, FormularFieldSetState.Added, true);

		// Füge den Wert nun zu unserem intern gespeicherten Feld von Formularwerten hinzu.
		this._values.push(value);

		// Als letztes, benachrichtige den entsprechenden Observator das sich einer der Werte verändert hat.
		this.onValueChanged(value);

		// Wir sind fertig, verlasse nun diese Methode.
		return;
	}

	/** @inheritdoc */
	public getFieldSetValue(attribute: string | Guid, index: number = 0): string|null|undefined
	{
		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. Falls wir diesen gefunden
		// haben, rufe dann dessen Wert ab und gib diesen zurück. Sollte der Wert nicht existieren, gib `undefined`
		// zurück.
		return this.getFormularFieldSetDescriptor(attribute, index).fieldSet?.data ?? undefined;
	}

	/** @inheritdoc */
	public putFieldSetValue(attribute: string | Guid, index: number = 0, data: string): void
	{
		// Konvertiere die spezifizierte Attribut-GUID in eine `Guid`-Instanz falls nötig.
		attribute = asGuid(attribute);

		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. und speichere die
		// entsprechende `FormularFieldSet` Instanz dann in einer lokalen Variable.
		let value: FormularFieldSet = this.getFormularFieldSetDescriptor(attribute, index).fieldSet;

		// Existiert der spezifizierte Wert bereits?
		if(value != null)
		{
			// Ja, also aktualisiere den Wert.
			value.data = data;
		}
		else
		{
			// Nein, also erstelle nun eine neue `FormularFieldSet` Instanz für den spezifizierten Wert und speichere diese
			// speichere diese in einer lokalen Variable.
			const value: FormularFieldSet =
				new FormularFieldSet(
					attribute,
					index,
					this._valueChanged$
				);

			// Setzte nun den effektiven Wert und markiere diesen Wert dann als: 'Hinzugefügt'.
			value.loadValue(data, data, FormularFieldSetState.Added, true);

			// Füge den Wert nun zu unserem intern gespeicherten Feld von Formularwerten hinzu.
			this._values.push(value);

			// Als letztes, benachrichtige den entsprechenden Observator das sich einer der Werte verändert hat.
			this.onValueChanged(value);
		}

		// Wir sind fertig, verlasse nun diese Methode.
		return;
	}

	/** @inheritdoc */
	public setFieldSetValue(attribute: string | Guid, index: number = 0, data: string): void
	{
		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. und speichere die
		// entsprechende `FormularFieldSet` Instanz dann in einer lokalen Variable.
		let value: FormularFieldSet = this.getFormularFieldSetDescriptor(asGuid(attribute), index).fieldSet;

		// Existiert der spezifizierte Wert?
		if(value == null)
		{
			// Nein, also wirf eine Ausnahme!
			throw new TypeError(
				`The value with index: ${index} for the attribute: ${attribute.toString()} doesn't exist!`
			);
		}

		// Der Wert existiert, aktualisiere nun dessen Wert.
		value.data = data;

		// Wir sind fertig, verlasse nun diese Methode.
		return;
	}

	/** @inheritdoc */
	public removeFieldSetValue(attribute: string | Guid, index: number = 0): boolean
	{
		// Versuche den spezifizierten Wert im intern gespeicherten Werte-Array zu finden. und speichere den
		// entsprechenden Deskriptor dann in einer lokalen Variable.
		let descriptor: FormularFieldSetDescriptor = this.getFormularFieldSetDescriptor(asGuid(attribute), index);

		// Haben wir den entsprechenden Wert gefunden?
		if(descriptor.fieldSet != null)
		{
			// Ja, prüfe nun ob der Wert bereits existiert hat oder ob dieser hinzugefügt wurde.
			if(descriptor.fieldSet.state === FormularFieldSetState.Added)
			{
				// Der Wert wurde hinzugefügt, also entferne diesen aus dem intern gespeicherten Werte-Array.
				this._values.splice(descriptor.index, 1);
			}

			// Markiere diesen Wert nun noch als entfernt.
			descriptor.fieldSet.markAsDeleted();

			// Als letztes, benachrichtige den entsprechenden Observator das sich einer der Werte verändert hat.
			this.onValueChanged(descriptor.fieldSet);

			// Kehre nun mit dem Wert `true` zurück um anzuzeigen, dass wir einen Wert entfernt haben.
			return true;
		}
		else
		{
			// Nein, also kehre mit dem wert `false` zurück.
			return false;
		}
	}

	//#endregion

	//#region Geschützte Eigenschaften.

	/**
	 * Diese Eigenschaft ruft den Observator für Änderungen an dieser `FormularBase` Instanz ab.
	 */
	protected get changeNotifier$(): Subject<FormularBaseChangeNotifierType>
	{
		// Gib die intern gespeicherte `Subject` Instanz zurück, welche Änderungen an dieser `FormularBase` Instanz
		// überwacht.
		return this._changeNotifier$;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	/** @inheritdoc */
	public get guid(): Guid
	{
		// Gib die intern gespeicherte Formular-/Formularbeilage-GUID zurück.
		return this._guid;
	}

	/** @inheritdoc */
	public get type(): Guid
	{
		// Gib die intern gespeicherte Formulartyp-GUID zurück.
		return this._typeGuid;
	}

	/** @inheritdoc */
	public get state(): FormularState
	{
		// Gib den intern gespeicherten Zustand zurück.
		return this._state;
	}

	/** @inheritdoc */
	public get isNew(): boolean
	{
		// Gib den intern gespeicherten Indikator zurück, der anzeigt ob dieses Formular/diese Formularbeilage neu
		// erstellt wurde oder nicht.
		return this._isNew;
	}

	/**
	 * @inheritdoc
	 * @virtual
	 */
	public get isFormular(): boolean
	{
		// Sofern diese Eigenschaft nicht überschrieben wird, gib immer der Wert `false` zurück.
		return false;
	}

	/**
	 * @inheritdoc
	 * @virtual
	 */
	public get isFormularBeilage(): boolean
	{
		// Sofern diese Eigenschaft nicht überschrieben wird, gib immer der Wert `false` zurück.
		return false;
	}

	/** @inheritdoc */
	public get changed(): IEventProperty<FormularBaseChangedEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onChanged' Ereignis zurück.
		return this._onChanged;
	}

	/** @inheritdoc */
	public get loaded(): IEventProperty<FormularBaseLoadedEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onLoaded' Ereignis zurück.
		return this._onLoaded;
	}

	/** @inheritdoc */
	public get saving(): IEventProperty<FormularBaseSavingEvent>
	{
		// Gib die intern gespeicherte Multicast-Delegate Instanz für das 'onSaving' Ereignis zurück.
		return this._onSaving;
	}

	//#endregion
}
