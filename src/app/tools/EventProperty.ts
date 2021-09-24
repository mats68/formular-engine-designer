/**
 * Diese Schnittstelle repräsentiert einen Multicast-Delegaten, welcher die dynamische registrierung und
 * de-registrierung von stark typisierten Callback Funktionen ermöglicht.
 *
 * @template T
 * 	Der Typ der Callback Funktion.
 */
export interface IEventProperty<T extends Function>
{
	removeAll(): void;

	/**
	 * Diese Methode registriert die spezifizierte Callback Funktion.
	 *
	 * @param callback
	 * 	Die Callback Funktion, welche registriert werden soll.
	 */
	add(callback: T): void;

	/**
	 * Diese Methode de-registriert die spezifizierte Callback Funktion.
	 *
	 * @param callback
	 * 	Die Callback Funktion, welche de-registriert werden soll.
	 *
	 * @returns
	 * 	`true` wenn die spezifizierte Callback Funktion de-registriert wurde, ansonsten `false`.
	 */
	remove(callback: T): boolean;
}

/**
 * Diese Klasse stellt einen Multicast-Delegaten zu verfügung, welcher die dynamische registrierung und
 * de-registrierung von stark typisierten Callback Funktionen ermöglicht.
 *
 * @template T
 * 	Der Typ der Callback Funktion.
 */
export class EventProperty<T extends Function> implements IEventProperty<T>
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert das Array aller registrierten Callback Funktionen.
	 */
	private _callbacks: T[] = [ ];

	//#endregion

	//#region Öffentliche Methoden.

	/** @inheritdoc */

	public removeAll(): void {
		this._callbacks = []
	}

	public add(callback: T): void
	{
		// Prüfe ob die spezifizierte Callback Funktion bereits registriert wurde.
		if(-1 === this._callbacks.indexOf(callback))
		{
			// Nein, also registriere diese nun.
			this._callbacks.push(callback);
		}

		// Wir sind fertig, verlasse nun diese Methode.
		return;
	}

	/** @inheritdoc */
	public remove(callback: T): boolean
	{
		// Versuche die spezifizierte Callback Funktion in unserem intern gespeicherten Array von Callback Funktionen zu
		// finden und speichere den entsprechenden Index dann in einer lokalen Variable.
		const index: number = this._callbacks.indexOf(callback);

		// Ist die spezifizierte Callback Funktion registriert?
		if(index !== -1)
		{
			// Ja, also entferne diese nun aus unserem internen Array vcn Callback Funktionen.
			this._callbacks.splice(index, 1);

			// Wir haben die Callback Funktion de-registriert, gib deshalb den Wert `true` zurück.
			return true;
		}
		else
		{
			// Die Callback Funktion ist nicht registriert, gib deshalb den Wert `false` zurück.
			return false;
		}
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	/**
	 * Diese Eigenschaft gibt Array mit allen registrierten Callback Funktionen zurück.
	 *
	 * @returns
	 * 	Ein Array aller registrierten Callback Funktionen.
	 */
	public get callbacks(): T[]
	{
		// Erstelle eine Kopie des intern gespeicherten Arrays von registrierten Callback funktionen und gib dieses dann
		// zurück.
		return Object.assign([], this._callbacks);
	}

	//#endregion
}
