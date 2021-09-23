import { Subject } from "rxjs";
import { EFormularBeilageDTO, EFormularDokumentPoolDTO, EFormularDTO, EFormularStatus } from "src/app/api";
import { Guid } from "src/app/tools/Guid";
import { FormularBase, FormularBaseChangeNotifierType, FormularState, IFormularBase } from "./FormularBase";
import { FormularBeilage, IFormularBeilage } from "./FormularBeilage";
import { asGuid } from './FormularUtils';

export interface IFormular extends IFormularBase {
	readonly formularTyp: Guid;
	readonly beilagen: IFormularBeilage[];

	getBeilagen(guid: string|Guid): IFormularBeilage[];
	addBeilage(beilage: EFormularBeilageDTO): EFormularDokumentPoolDTO;
	removeBeilage(beilage: EFormularBeilageDTO): EFormularDokumentPoolDTO;
}

export class Formular extends FormularBase implements IFormular
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert das DTO Objekt, welches das Formular repräsentiert.
	 */
	private _dto: EFormularDTO;

	private _beilagen: { [key: string]: FormularBeilage } = { };



	//#endregion

	//#region Konstruktor.

	public constructor(
		formular: EFormularDTO,
		isNew: boolean,
		changeNotifier: Subject<FormularBaseChangeNotifierType>,
		state: FormularState = FormularState.Unchanged
	)
	{
		super(formular.guid, formular.formularTyp.guid, formular.dokument, isNew, changeNotifier, state);

		this._dto = formular;
	}

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode lädt die Formulardaten aus der spezifizierten Formular-DTO Instanz in diese `Formular` Instanz.
	 *
	 * @param formular
	 * 	Die Formular-DTO Instanz aus welcher die Formulardaten ausgelesen werden sollen.
	 *
	 * @param force
	 * 	`true` um alle ungesicherten Änderungen zu verwerfen, ansonsten `false`.
	 *
	 * @throws {Error}
	 * 	Das Formular oder eine der Formular-Beilagen hat ungesicherte Änderungen und der `force` Parameter war
	 * 	`false`!
	 */
	public load(formular: EFormularDTO, force: boolean = false): void
	{
		// Prüfe ob wir ungesicherte Änderungen haben und ob wir diese allenfalls verwerfen sollen.
		if(this.state !== FormularState.Unchanged && force === false)
		{
			// Wir haben Änderungen welche nicht verworfen werden sollen, wirf eine Ausnahme!
			throw new Error(
				'This `Formular` instance has unsaved changes and force loading was not specified!'
			);
		}

		// Alles bereit, ersetze nun die intern gespeicherte DTO Instanz.
		this._dto = formular;

		// Ladet den volatilen Status aus dem DTO.
		this._status = this._dto.status;

		// Aktualisiere nun zuerst die Formularbeilagen. Iteriere über alle Formularbeilagen aus der DTO Instanz.
		for(let poolDto of this._dto.formularDokumentPool)
		{
			// Rufe als erstes die GUID der Formularbeilage aus der DTO Instanz ab und speichere diese normalisiert in
			// einer lokalen Variable ab.
			let guid = ''
			if (poolDto.formularBeilage) {
				guid = Guid.parse(poolDto.formularBeilage.guid).toString();
			}

			// Prüfe ob wir bereits eine `FormularBeilage` Instanz für dieses Formularbeilage instanziiert haben.
			// Speichere diese Instanz in einer lokalen Variable.
			let formBeilage: FormularBeilage = this._beilagen[guid];

			// Haben wir eine entsprechende `FormularBeilage` Instanz gefunden?
			if(formBeilage)
			{
				// Ja, also lade die Formularbeilage-DTO Instanz in die bestehende Instanz.
				formBeilage.load(poolDto.formularBeilage, force);
			}
			else
			{
				// Nein, also erstelle eine neue `FormularBeilage` Instanz anhand der Formularbeilage-DTO Instanz.
				if (poolDto.formularBeilage) {
					formBeilage = new FormularBeilage(poolDto.formularBeilage, false, this.changeNotifier$, FormularState.Unchanged);
					// Und füge diese nun in unsere Sammlung der Formularbeilagen hinzu.
					this._beilagen[guid] = formBeilage;
				}

			}
		}

		// Aktualisiere nun noch die Formular-Werte anhand der spezifizierten DTO Instanz.
		super.loadDocument(this._dto.dokument, force);

		// Wir haben das Formular komplett initialisiert, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode übernimmt alle Änderungen an diesem Formular sowie den Formularbeilagen in die intern gespeicherte
	 * DTO Instanz.
	 */
	public save(): void
	{
		// Prüfe ob wir ungesicherte Änderungen haben.
		if(this.state === FormularState.Unchanged) {
			// Wir haben keine Änderungen, kehre deshalb einfach zurück.
			return;
		}

		// Übernimmt volatilen Zustand in das DTO.
		this._dto.status = this._status ?? EFormularStatus.Undefiniert;

		if(!this._dto.formularDokumentPool)
			this._dto.formularDokumentPool = [];

		// Iteriere nun über jede unserer Formularbeilagen...
		for(let beilage of Object.values(this._beilagen)) {
			// ... und speichere diese.
			beilage.save();
		}

		// Rufe nun die Methode der Basisklasse auf um unsere Änderungen zu speichern.
		super.saveDocument();

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	public getBeilagen(guid: string|Guid): IFormularBeilage[]
	{
		const typ: Guid = asGuid(guid);

		return Object.values(this._beilagen).filter(
			(beilage) => beilage.formularTyp.equals(typ)
		);
	}

	addBeilage(beilage: EFormularBeilageDTO): EFormularDokumentPoolDTO{
		if(!this._dto.formularDokumentPool)
			this._dto.formularDokumentPool = [];

		let formularDokumentPool : EFormularDokumentPoolDTO = this._dto.formularDokumentPool.find((fdp)=>fdp.formularBeilage.guid.toLocaleLowerCase() == beilage.guid.toLocaleLowerCase());
		if(!formularDokumentPool){
			const fdp: EFormularDokumentPoolDTO = {
				mandant : this._dto.mandant,
				guidFormular : this._dto.guid,
				guidFormularBeilagen : beilage.guid,
				formularBeilage : beilage,
			}
			this._dto.formularDokumentPool.push(fdp);
			formularDokumentPool = fdp;
		}

		const guid = Guid.parse(beilage.guid).toString();
		const formBeilage = new FormularBeilage(beilage, false, this.changeNotifier$, FormularState.Unchanged);
		this._beilagen[guid] = formBeilage;
		this.setState(FormularState.Modified);

		formularDokumentPool.linkRemoved = false;
		return formularDokumentPool;
	}

	removeBeilage(beilage: EFormularBeilageDTO): EFormularDokumentPoolDTO{
		let formularDokumentPool : EFormularDokumentPoolDTO;

		if(this._dto.formularDokumentPool){
			formularDokumentPool = this._dto.formularDokumentPool.find((fdp)=>fdp.guidFormularBeilagen.toLocaleLowerCase() == beilage.guid.toLocaleLowerCase());
			this._dto.formularDokumentPool = this._dto.formularDokumentPool.filter((fdp)=>fdp !== formularDokumentPool);
		}
		const guid = Guid.parse(beilage.guid).toString();
		delete this._beilagen[guid];
		this.setState(FormularState.Modified);

		if(formularDokumentPool)
			formularDokumentPool.linkRemoved = true;
		return formularDokumentPool;
	}

	setUnchanged(){
		this.setState(FormularState.Unchanged);
	}

	removeIsNew(){
		this._isNew = false;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	public get formularDto(): EFormularDTO {
		return this._dto;
	}

	public get formularTyp(): Guid {
		return asGuid(this._dto.formularTyp.guid);
	}

	public get beilagen(): IFormularBeilage[]
	{
		return Object.values(this._beilagen);
	}

	private _status: EFormularStatus;

	public get status(): EFormularStatus {
		return this._status;
	}

	public set status(newStatus: EFormularStatus) {
		this._status = newStatus;
		if (this._status !== this.formularDto.status) {
			this.setState(FormularState.Modified);
		}
	}



	//#endregion
}
