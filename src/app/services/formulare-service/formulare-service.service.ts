import { Injectable } from '@angular/core';
import { Guid } from 'src/app/tools/Guid';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, first, map, timeout } from 'rxjs/operators';
import { DokumentBeilageLinkDTO, DokumentDTO, DokumenteService } from 'src/app/api';
import { FormularFieldSet, IFormularFieldSet } from './FormularFieldSet';
import * as Utilities from "./FormularUtils";
import { EventProperty, IEventProperty } from 'src/app/tools/EventProperty';
import { FormularBase, FormularState, IFormularBase } from './FormularBase';
import { Formular, IFormular } from './Formular';
import { IFormularHeaderData } from './FormularHeader';
import * as _ from "lodash-es";
import { ProjektService } from '../projekt/projekt.service';

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Ablaufverfolgungsmeldungen der `FormularService` Klasse
 * in der Browser Konsole.
 */
const TRACE_FORMULARE_SERVICE: boolean = true;

/**
 * Diese Konstante aktiviert oder deaktiviert die Ausgabe von Debug-Meldungen der `FormularService` Klasse in der
 * Browser Konsole.
 */
const DEBUG_FORMULARE_SERVICE: boolean = true;

/**
 * Diese Methode gibt eine Ablaufverfolgungsmeldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `TRACE_FORMULARE_SERVICE` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
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
	if(true === TRACE_FORMULARE_SERVICE) Utilities.log_trace(identifier, mode, ...optionalParams);
}

/**
 * Diese Methode gibt eine 'DEBUG'-Meldung in der Browser Konsole aus, sofern diese Ausgabe mittels der
 * `DEBUG_FORMULARE_SERVICE` Konstanten aktiviert wurde und die Anwendung nicht in der Produktiven Umgebung ausgeführt
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
	if(true === DEBUG_FORMULARE_SERVICE) Utilities.log_debug(message, ...optionalParams);
}

export interface IFormulareAPI
{

}

export interface IFormularChangedEvent {
	(eventData: IFormularChangedEventData): void;
};

export interface IFormularChangedEventData {
	formular: IFormularBase,
	value: IFormularFieldSet
};

export interface IFormularLoadingEvent {
	(eventData: IFormularLoadingEventData): void;
};

export interface IFormularLoadingEventData {
	dokument: DokumentDTO;
	isNew: boolean;
};

export interface IFormularLoadedEvent {
	(eventData: IFormularLoadedEventData): void;
};

export interface IFormularLoadedEventData {
	formular: IFormular;
	isNew: boolean;
};

export interface IFormularSavingEvent {
	(eventData: IFormularSavingEventData): void;
};

export interface IFormularSavingEventData {
	formular: IFormular;
};

export interface IFormularSavedEvent {
	(eventData: IFormularSavedEventData): void;
};

export interface IFormularSavedEventData {
	formular: IFormular;
};

export interface IFormularUnloadingEvent {
	(eventData: IFormularUnloadingEventData): void;
};

export interface IFormularUnloadingEventData {
	formular: IFormular;
};

export interface IFormularUnloadedEvent {
	(eventData: IFormularUnloadedEventData): void;
};

export interface IFormularUnloadedEventData {
	formular: IFormular;
};

/**
 * Diese Klasse stellt alle notwendigen Funktionen und Informationen zur sinnvollen Interaktion mit Formularen bereit.
 */
@Injectable({
	providedIn: 'root'
})
export class FormulareService implements IFormulareAPI
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert das aktuell geladene Formular als `Formular`-Instanz.
	 */
	private _formular: Formular = null;

	/**
	 * Diese `BehaviorSubject` Instanz speichert die aktuelle `IFormularHeaderData ` Instanz und benachrichtigt alle
	 * Observatoren bei einer Änderung.
	 */
	private readonly _formularHeader$: BehaviorSubject<IFormularHeaderData> =
		new BehaviorSubject<IFormularHeaderData>( {
			title: '',
			code: '',
			progress: 0,
			continuousProgress: false,
			statusProgress: false,
			statusText: '',
			canDownload: false,
			isDownloading: false,
			canSave: false,
			isSaving: false,
			canSend: false,
			isSending: false
		});

	private readonly _formularChanged$: Subject<{ formular: FormularBase, value: FormularFieldSet }> =
		new Subject<{ formular: FormularBase, value: FormularFieldSet }>();

	private readonly _onChanged: EventProperty<IFormularChangedEvent> = new EventProperty<IFormularChangedEvent>();

	private readonly _onLoading: EventProperty<IFormularLoadingEvent> = new EventProperty<IFormularLoadingEvent>();
	private readonly _onLoaded: EventProperty<IFormularLoadedEvent> = new EventProperty<IFormularLoadedEvent>();

	private readonly _onSaving: EventProperty<IFormularSavingEvent> = new EventProperty<IFormularSavingEvent>();
	private readonly _onSaved: EventProperty<IFormularSavedEvent> = new EventProperty<IFormularSavedEvent>();

	private readonly _onUnloading: EventProperty<IFormularUnloadingEvent> = new EventProperty<IFormularUnloadingEvent>();
	private readonly _onUnloaded: EventProperty<IFormularUnloadedEvent> = new EventProperty<IFormularUnloadedEvent>();

	private _error: any;

	//#endregion

	constructor(
		private readonly _formulareService: DokumenteService,
		private readonly _projektService: ProjektService
	)
	{
		this._formularChanged$.subscribe(
			(data: { formular: FormularBase, value: FormularFieldSet }) =>
			{
				this.onChanged(data.formular, data.value);
			}
		);

		setTimeout(()=>this.checkForSaveToDB(), 500);
	}

	//#region Private Methoden.

	private async checkForSaveToDB(){
		try {
			// console.trace(`checkForSaveToDB: ${this.formular?.state}`);
			if(this._formular == null || ( !this._formular.isNew && this._formular.state === FormularState.Unchanged))
				return;

			// Rufe unsere aktuell geladene Formular Instanz ab und speichere diese dann in einer lokalen Variable.
			let formular: Formular = this._formular;

			// Rufe alle Event-Handler des 'bevor speichern' Events auf.
			this.onBeforeSave(formular);

			// Rufe nun die `save` Methode des Formulars auf, um dessen intern gespeichertes DTO Objekt zu aktualisieren.
			formular.save();

			// Extrahiere nun die Formular-DTO Instanz aus unserem Formular und speichere diese dann in einer lokalen
			// Variable.
			let sentFormDto: DokumentDTO = _.cloneDeep(formular.dokumentDTO);

			// Gib eine Meldung auf der Konsole aus, dass wir das Formular mit der spezifizierten GUID auf dem Server
			// speichern.
			console.debug(`Saving Formular to server: ${formular.guid}`, formular);

			// Sende nun die Formular-DTO Instanz, welche das gespeicherte Formular darstellt an den Server.
			(this.formular as Formular).setUnchanged();
			let receivedFormDTO: DokumentDTO = await this._formulareService.apiV1DokumentePost(sentFormDto).toPromise();

			this.onAfterSave(this._formular);
			(this.formular as Formular).removeIsNew();

			if (!_.isEqual(receivedFormDTO, sentFormDto)) {
				let sentData = JSON.parse(sentFormDto.dso.data[0].daten ?? '{}');
				let receivedData = JSON.parse(receivedFormDTO.dso.data[0].daten ?? '{}');
				// let currentData = JSON.parse(this._formular.dokumentDTO.dokument.werte[0].daten ?? '{}');
				if (!_.isEqual(sentData, receivedData)) {
					console.error(`Received formular-data is different from sent one!`)
				}
				// if (!_.isEqual(sentFormDto.dokumentBeilagen, receivedFormDTO.dokumentBeilagen)) {
				// 	console.error(`Received attachements are different from sent one!`)
				// }
			}
		} catch (error) {
			console.error(error);
		}
		finally{
			setTimeout(()=>this.checkForSaveToDB(), 500);
		}
	}

	private onFormularLoad(formularDto: DokumentDTO, isNew: boolean): void
	{
		this.onBeforeLoad(formularDto, isNew);

		this._formular =
			new Formular(
				formularDto,
				isNew,
				this._formularChanged$,
				FormularState.Unchanged
			);

		this.onAfterLoad(this._formular, isNew);

		return;
	}

	private onBeforeLoad(formularDto: DokumentDTO, isNew: boolean): void
	{
		for(let callback of this._onLoading.callbacks)
		{
			try
			{
				callback({ dokument: formularDto, isNew: isNew });
			}
			catch(error)
			{
				console.error(
					'FormularService::BeforeLoad callback error!',
					callback,
					error
				);
			}
		}

		return;
	}

	private onAfterLoad(formular: Formular, isNew: boolean): void
	{
		for(let callback of this._onLoaded.callbacks)
		{
			try
			{
				callback({ formular: formular, isNew: isNew });
			}
			catch(error)
			{
				console.error(
					'FormularService::AfterLoad callback error!',
					{
						instance: this,
						callback: callback,
						error: error
					}
				);
			}
		}

		return;
	}

	private onBeforeSave(formular: Formular): void
	{
		for(let callback of this._onSaving.callbacks)
		{
			try
			{
				callback({ formular: formular });
			}
			catch(error)
			{
				console.error(
					'FormularService::BeforeSave callback error!',
					callback,
					error
				);
			}
		}

		return;
	}

	private onAfterSave(formular: Formular): void
	{
		for(let callback of this._onSaved.callbacks)
		{
			try
			{
				callback({ formular: formular });
			}
			catch(error)
			{
				console.error(
					'FormularService::AfterSave callback error!',
					callback,
					error
				);
			}
		}

		return;
	}

	private onBeforeUnload(formular: Formular): void
	{
		for(let callback of this._onUnloading.callbacks)
		{
			try
			{
				callback({ formular: formular });
			}
			catch(error)
			{
				console.error(
					'FormularService::BeforeUnload callback error!',
					callback,
					error
				);
			}
		}

		return;
	}

	private onAfterUnload(formular: Formular): void
	{
		for(let callback of this._onUnloaded.callbacks)
		{
			try
			{
				callback({ formular: formular });
			}
			catch(error)
			{
				console.error(
					'FormularService::AfterUnload callback error!',
					callback,
					error
				);
			}
		}

		return;
	}

	private onChanged(formular: FormularBase, value: FormularFieldSet): void
	{
		// Ablaufverfolgung: Logge den Beginn der Ausführung dieser Methode.
		log_trace('FormularService::onChanged', true, { formular: formular, value: value });

		// Iteriere nun über alle registrierten Callback Funktionen.
		for(let callback of this._onChanged.callbacks)
		{
			try
			{
				// Rufe die aktuell iterierte Callback Funktion nun auf.
				callback({ formular: formular, value: value });
			}
			catch(error)
			{
				// Es ist ein Fehler in der Callback Funktion aufgetreten, protokolliere diesen Fehler in der Browser
				// Konsole.
				console.error(
					'FormularService::changed callback error!',
					{
						callback: callback,
						error: error
					}
				);
			}
		}

		// TODO: Move to separate function!
		let fh: IFormularHeaderData = this.formularHeader;

		fh.canSave = formular.state != FormularState.Unchanged;
		fh.statusText = `${formular.state}`;

		this.formularHeader = fh;

		// Ablaufverfolgung: Logge das Ende der Ausführung dieser Methode.
		log_trace('FormularService::onChanged', false);

		// Alles erledigt, kehre nun zurück.
		return;
	}


	//#endregion

	//#region Öffentliche Methoden.

	public async loadFormularAsync(
		formular: string | Guid | DokumentDTO,
		isNew: boolean = null,
		timeout: number = 30000
	): Promise<void>
	{
		// Prüfe ob eine GUID als Text spezifiziert wurde.
		if(typeof(formular) === 'string')
		{
			try
			{
				// Ja, also versuche diesen Text als eine GUID zu interpretieren.
				formular = Guid.parse(formular);
			}
			catch
			{
				// Es wurde eine ungültige GUID spezifiziert, wird eine Ausnahme!
				throw new Error('Invalid value for the `formular` parameter!');
			}
		}
		// Nein, prüfe ob eine `Guid` Instanz oder ein `DokumentDTO` Instanz spezifiziert wurden.
		else if(false == (formular instanceof Guid) && typeof(formular) !== 'object')
		{
			// Es wurde weder eine `Guid` Instanz noch ein `DokumentDTO` Instanz spezifiziert, wirf eine Ausnahme!
			throw new Error('Invalid value for the `formular` parameter!');
		}

		// Wurde eine GUID spezifiziert?
		if(formular instanceof Guid)
		{
			// Ja, also sollen wir das Formular mit der entsprechenden GUID laden. Gib nun eine Meldung auf der Konsole
			// aus, dass wir das Formular mit der spezifizierten GUID vom Server abrufen und laden.
			console.debug(`Loading Formular from server: ${formular.toString()}`);

			// Rufe nun das Formular vom Server ab anhand der spezifizierten GUID.
			return this._formulareService.apiV1DokumenteGuidGet(formular.toString()).pipe(
				catchError(
					(error) =>
					{
						// Gib nun den originalen Fehler zurück.
						return throwError(error);
					}
				),
				map(
					(dokument: DokumentDTO) =>
					{
						try
						{
							// Wir konnten das Formular erfolgreich abrufen, speichere dieses Formular nun intern und
							// benachrichtige dann die entsprechenden Observatoren.
							this.onFormularLoad(dokument, isNew);

							// Gib als letztes eine Meldung auf der Konsole aus, dass wir das Formular mit der spezifizierten
							// GUID vom Server abgerufen und geladen haben.
							console.debug(`Loaded Formular from server: ${this._formular.guid}`);
						}
						catch(error)
						{
							// Es ist ein Fehler Aufgetreten, gib eine Fehlermeldung auf der Konsole aus.
							console.error(
								`An error occurred while loading the Formular: ${dokument.toString()} from server!`,
								error
							);

							// Wirf nun die originale Ausnahme erneut.
							throw error;
						}
					}
				)
			).toPromise();
		}
		else
		{
			// Nein, also wurde eine `DokumentDTO` Instanz spezifiziert. Gib nun eine Meldung auf der Konsole aus, dass
			// wir das Formular aus der DTO Instanz laden.
			console.debug(`Loading Formular from DTO: ${formular.guid?.toUpperCase() ?? '(new)'}`, formular);

			try
			{
				// Lade das Formular nun aus dem DTO Objekt und speichere dieses dann intern. Benachrichtige danach die
				// entsprechenden Observatoren.
				this.onFormularLoad(formular, isNew);


				// Gib als letztes eine Meldung auf der Konsole aus, dass wir das Formular aus der DTO Instanz geladen
				// haben.
				console.debug(`Loaded Formular from DTO: ${this._formular.guid?.toString() ?? '(new)'}`);
			}
			catch(error)
			{
				// Es ist ein Fehler Aufgetreten, gib eine Fehlermeldung auf der Konsole aus.
				console.error(
					`An error occurred while loading the Formular: ${formular.guid?.toUpperCase() ?? '(new)'} from DTO!`,
					error
				);

				// Wirf nun die originale Ausnahme erneut.
				throw error;
			}

			// Wir sind fertig, kehre nun zurück.
			return;
		}
	}

	public async unloadFormularAsync(force: boolean = false, timeout: number = 30000): Promise<void>
	{
		// Prüfe ob wir aktuell ein Formular geladen haben.
		if(this._formular == null) {
			// Nein, also kehre direkt zurück.
			return;
		}

		// Hat das aktuell geladene Formular Änderungen welche noch nicht gesichert wurden? Falls ja, prüfe ob wir die
		// Änderungen verwerfen sollen.
		if(this._formular.state !== FormularState.Unchanged && force === true) {
			// await this.saveFormularAsync();
			// // Das Formular hat ungesicherte Änderungen welche nicht verworfen werden sollen, wirf deshalb eine Ausnahme!
			// throw new Error(
			// 	"The currently loaded Formular has unsaved changes and force unloading was not specified!"
			// );
		}

		// Speichere nun die Referenz des aktuell geladenen Formulars in einer lokalen Variable.
		const formular: Formular = this._formular;


		// Rufe alle Event-Handler des 'bevor entladen' Events auf.
		this.onBeforeUnload(formular);

		// Lösche nun die intern gespeicherte Formular-Instanz.
		this._formular = null;

		// Und nun rufe alle Event-Handler des 'nach dem Entladen' Events auf.
		this.onAfterUnload(formular);
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	public get beforeLoaded(): IEventProperty<IFormularLoadingEvent>
	{
		return this._onLoading;
	}

	public get afterLoaded(): IEventProperty<IFormularLoadedEvent>
	{
		return this._onLoaded;
	}

	public get beforeSaving(): IEventProperty<IFormularSavingEvent>
	{
		return this._onSaving;
	}

	public get afterSaving(): IEventProperty<IFormularSavedEvent>
	{
		return this._onSaved;
	}

	public get afterChanged(): IEventProperty<IFormularChangedEvent>
	{
		return this._onChanged;
	}

	public get beforeUnloading(): IEventProperty<IFormularUnloadingEvent>
	{
		return this._onUnloading;
	}

	public get afterUnloaded(): IEventProperty<IFormularUnloadedEvent>
	{
		return this._onUnloaded;
	}


	public get formular(): IFormular {
		return this._formular;
	}

	/**
	 * Diese Eigenschaft ruft eine Kopie der aktuellen `IFormularHeaderData` Instanz ab, welche die Daten für die
	 * Formular Header Komponente bereitstellt.
	 */
	public get formularHeader(): IFormularHeaderData {
		// Gib eine Kopie der aktuelle intern gespeicherte Formular Header Dateninstanz zurück.
		return Object.assign({ }, this._formularHeader$.value);
	}

	/**
	 * Diese Eigenschaft speichert eine Kopie der spezifizierten `IFormularHeaderData` Instanz ab, welche die Daten für
	 * die Formular Header Komponente bereitstellt und benachrichtigt alle entsprechenden Observatoren.
	 */
	public set formularHeader(formularHeader: IFormularHeaderData) {
		// Speichere eine Kopie der spezifizierten Formular Header Dateninstanz interna ab und benachrichtige alle
		// Observatoren über die Änderung.
		this._formularHeader$.next(Object.assign({ }, formularHeader))

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	/**
	 * Diese Eigenschaft ruft die observierbare `IFormularHeaderData` Instanz ab, welche die Daten für die Formular
	 * Header Komponente bereitstellt.
	 */
	public get formularHeaderObservable(): Observable<IFormularHeaderData> {
		// Gib einen neuen Observer zurück, welcher eine Kopie der effektiven Formular Header Dateninstanz zurückgibt.
		return this._formularHeader$.pipe(map((d) => Object.assign({ }, d)));
	}

	//#endregion
}
