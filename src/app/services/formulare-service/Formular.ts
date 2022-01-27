import { Subject } from "rxjs";
import { SignaturDTO } from "src/app/api";
import { DokumentTransferHistoryDTO } from "src/app/api";
import { DokumentDTO, DokumentStatus } from "src/app/api";
import { Guid } from "src/app/tools/Guid";
import { FormularBase, FormularBaseChangeNotifierType, FormularState, IFormularBase } from "./FormularBase";
import { FormularBeilage, IFormularBeilage } from "./FormularBeilage";
import { asGuid } from './FormularUtils';
import * as _ from "lodash-es";

export interface IFormular extends IFormularBase {
	readonly dokumentDef: Guid;
	readonly beilagen: IFormularBeilage[];

	getBeilagen(guid: string|Guid): IFormularBeilage[];
	addBeilage(beilage: DokumentDTO): DokumentDTO;
	removeBeilage(beilage: DokumentDTO): DokumentDTO;
	addTransferHistory(transferHistory: DokumentTransferHistoryDTO): DokumentTransferHistoryDTO;
	removeTransferHistory(transferHistory: DokumentTransferHistoryDTO): DokumentTransferHistoryDTO;
	addSignature(signatur: SignaturDTO): SignaturDTO;
	removeSignature(signatur: SignaturDTO): SignaturDTO;
}

export class Formular extends FormularBase implements IFormular
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert das DTO Objekt, welches das Formular repräsentiert.
	 */
	private _dto: DokumentDTO;

	private _beilagen: { [key: string]: FormularBeilage } = { };



	//#endregion

	//#region Konstruktor.

	public constructor(
		dokument: DokumentDTO,
		isNew: boolean,
		changeNotifier: Subject<FormularBaseChangeNotifierType>,
		state: FormularState = FormularState.Unchanged
	)
	{
		super(dokument.guid, dokument.dokumentDef.guid, dokument.dso, isNew, changeNotifier, state);

		this._dto = dokument;
		this.status = dokument.status;
	}

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode lädt die Formulardaten aus der spezifizierten Formular-DTO Instanz in diese `Formular` Instanz.
	 *
	 * @param dokument
	 * 	Die Formular-DTO Instanz aus welcher die Formulardaten ausgelesen werden sollen.
	 *
	 * @param force
	 * 	`true` um alle ungesicherten Änderungen zu verwerfen, ansonsten `false`.
	 *
	 * @throws {Error}
	 * 	Das Formular oder eine der Formular-Beilagen hat ungesicherte Änderungen und der `force` Parameter war
	 * 	`false`!
	 */
	public load(dokument: DokumentDTO, force: boolean = false): void
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
		this._dto = dokument;

		// Ladet den volatilen Status aus dem DTO.
		this._status = this._dto.status;

		// Aktualisiere nun zuerst die Formularbeilagen. Iteriere über alle Formularbeilagen aus der DTO Instanz.
		for(let poolDto of this._dto.beilagen)
		{
			// Rufe als erstes die GUID der Formularbeilage aus der DTO Instanz ab und speichere diese normalisiert in
			// einer lokalen Variable ab.
			let guid = ''
			if (poolDto) {
				guid = Guid.parse(poolDto.guid).toString();
			}

			// Prüfe ob wir bereits eine `FormularBeilage` Instanz für dieses Formularbeilage instanziiert haben.
			// Speichere diese Instanz in einer lokalen Variable.
			let formBeilage: FormularBeilage = this._beilagen[guid];

			// Haben wir eine entsprechende `FormularBeilage` Instanz gefunden?
			if(formBeilage)
			{
				// Ja, also lade die Formularbeilage-DTO Instanz in die bestehende Instanz.
				formBeilage.load(poolDto, force);
			}
			else
			{
				// Nein, also erstelle eine neue `FormularBeilage` Instanz anhand der Formularbeilage-DTO Instanz.
				if (poolDto) {
					formBeilage = new FormularBeilage(poolDto, false, this.changeNotifier$, FormularState.Unchanged);
					// Und füge diese nun in unsere Sammlung der Formularbeilagen hinzu.
					this._beilagen[guid] = formBeilage;
				}

			}
		}

		// Aktualisiere nun noch die Formular-Werte anhand der spezifizierten DTO Instanz.
		super.loadDocument(this._dto.dso, force);

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
		this._dto.status = this._status ?? DokumentStatus.Undefiniert;

		if(!this._dto.beilagen)
			this._dto.beilagen = [];

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
		return Object.values(this._beilagen).filter(
			(beilage) => Guid.equals(beilage.dokumentDef, guid)
		);
	}

	addBeilage(dokumentBeilage: DokumentDTO): DokumentDTO{
		if(!this._dto.beilagen)
			this._dto.beilagen = [];

		let beilage : DokumentDTO = this._dto.beilagen.find((b)=> Guid.equals(b.guid, dokumentBeilage.guid));
		if(!beilage){
			this._dto.beilagen.push(dokumentBeilage);
		}

		const guid = Guid.parse(dokumentBeilage.guid).toString();
		const formBeilage = new FormularBeilage(dokumentBeilage, false, this.changeNotifier$, FormularState.Unchanged);
		this._beilagen[guid] = formBeilage;
		this.setState(FormularState.Modified);

		return dokumentBeilage;
	}

	removeBeilage(dokumentBeilage: DokumentDTO): DokumentDTO{
		if(this._dto.beilagen){
			this._dto.beilagen = this._dto.beilagen.filter((b)=> !Guid.equals(b.guid, dokumentBeilage.guid));
		}
		const guid = Guid.parse(dokumentBeilage.guid).toString();
		delete this._beilagen[guid];
		this.setState(FormularState.Modified);

		return dokumentBeilage;
	}

	addTransferHistory(transferHistory: DokumentTransferHistoryDTO): DokumentTransferHistoryDTO{
		if(!this._dto.transferHistory)
			this._dto.transferHistory = [];
		this._dto.transferHistory.push(transferHistory);
		this.setState(FormularState.Modified);
		return transferHistory;
	}

	removeTransferHistory(transferHistory: DokumentTransferHistoryDTO): DokumentTransferHistoryDTO{
		if(this._dto.transferHistory){
			this._dto.transferHistory = this._dto.transferHistory.filter((th)=> !_.isEqual(th, transferHistory));
		}
		this.setState(FormularState.Modified);
		return transferHistory;
	}

	addSignature(signatur: SignaturDTO): SignaturDTO{
		if(!this._dto.signaturen)
			this._dto.signaturen = [];
		this._dto.signaturen.push(signatur);
		this.setState(FormularState.Modified);
		return signatur;
	}

	removeSignature(signatur: SignaturDTO): SignaturDTO{
		if(this._dto.signaturen){
			this._dto.signaturen = this._dto.signaturen.filter((s)=> !_.isEqual(s, signatur));
		}
		this.setState(FormularState.Modified);
		return signatur;
	}

	setUnchanged(){
		this.setState(FormularState.Unchanged);
	}

	removeIsNew(){
		this._isNew = false;
	}

	//#endregion

	//#region Öffentliche Eigenschaften.

	public get dokumentDTO(): DokumentDTO {
		return this._dto;
	}

	public get dokumentDef(): Guid {
		return asGuid(this._dto.dokumentDef.guid);
	}

	public get beilagen(): IFormularBeilage[]
	{
		return Object.values(this._beilagen);
	}

	private _status: DokumentStatus;

	public get status(): DokumentStatus {
		return this._status;
	}

	public set status(newStatus: DokumentStatus) {
		let current: DokumentStatus = this.dokumentDTO.status;

		this._status = newStatus;
		this.dokumentDTO.status = newStatus;

		if (current !== this.dokumentDTO.status) {
			this.setState(FormularState.Modified);
		}
	}



	//#endregion
}
