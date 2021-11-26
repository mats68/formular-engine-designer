import { Subject } from "rxjs";
import { DokumentBeilageLinkDTO, DokumentDTO } from "src/app/api";
import { Guid } from "src/app/tools/Guid";
import { FormularBase, FormularBaseChangeNotifierType, FormularState, IFormularBase } from "./FormularBase";
import { asGuid } from './FormularUtils';

export interface IFormularBeilage extends IFormularBase
{
	readonly dokumentDef: Guid;
}

export class FormularBeilage extends FormularBase implements IFormularBeilage
{
	//#region Private Felder.

	/**
	 * Dieses Feld speichert das DTO Objekt, welches die Formularbeilage repräsentiert.
	 */
	 private _dto: DokumentDTO;

	 //#endregion

	 //#region Konstruktor.

	public constructor(
		beilage: DokumentDTO,
		isNew: boolean,
		changeNotifier: Subject<FormularBaseChangeNotifierType>,
		state: FormularState = FormularState.Unchanged
	)
	{
		super(beilage.guid, beilage.dokumentDef.guid, beilage, isNew, changeNotifier);

		this._dto = beilage;
	}

	//#endregion

	//#region Öffentliche Methoden.

	/**
	 * Diese Methode lädt die Formularbeilagedaten aus der spezifizierten Formularbeilage-DTO Instanz in diese
	 * `FormularBeilage` Instanz.
	 *
	 * @param formularBeilage
	 * 	Die Formularbeilage-DTO Instanz aus welcher die Formularbeilagedaten ausgelesen werden sollen.
	 *
	 * @param force
	 * 	`true` um alle ungesicherten Änderungen zu verwerfen, ansonsten `false`.
	 *
	 * @throws {Error}
	 * 	Die Formularbeilage hat ungesicherte Änderungen und der `force` Parameter war `false`!
	 */
	 public load(beilage: DokumentDTO, force: boolean = false): void
	 {
		// Prüfe ob wir ungesicherte Änderungen haben und ob wir diese allenfalls verwerfen sollen.
		if(this.state !== FormularState.Unchanged && force === false) {
			// Wir haben Änderungen welche nicht verworfen werden sollen, wirf eine Ausnahme!
			throw new Error(
				'This `FormularBeilage` instance has unsaved changes and force loading was not specified!'
			);
		}

		// Alles bereit, ersetze nun die intern gespeicherte DTO Instanz.
		this._dto = beilage;

		// Aktualisiere nun die Formularbeilage-Werte anhand der spezifizierten DTO Instanz.
		super.loadDocument(this._dto, force);

		// Wir haben die Formularbeilage komplett initialisiert, kehre nun zurück.
		return;
	}

	/**
	 * Diese Methode übernimmt alle Änderungen an dieser Formularbeilage in die intern gespeicherte DTO Instanz.
	 */
	public save(): void
	{
		// Rufe die Methode der Basisklasse auf um unsere Änderungen zu speichern.
		super.saveDocument();

		// Wir sind fertig, kehre nun zurück.
		return;
	}

	//#endregion

	public get dokumentDef(): Guid {
		return asGuid(this._dto.dokumentDef.guid);
	}
}
