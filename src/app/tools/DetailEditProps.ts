import { marker } from "@ngneat/transloco-keys-manager/marker";
import { ISchema } from "../components";
import { ProjektService } from "../services";

export class DetailEditProps {
	public entity: string
	public schema: ISchema
	private _values: any
	public dataMessage: string = '';
	public error: string = '';
	public canDelete: boolean = true
	public loading: boolean = true
	public loadingText: string = ''
	public loadingDBUpdate: boolean = false
	public loadingDBUpdateText: string =  ''
	private _projektService: ProjektService;

	constructor() {
		this._projektService = ProjektService.instance;		
	}


	get values(): any {
		return this._values
	}

	set values(val: any) {
		this._values = val
		this.loading = false
	}

	private handleError = (err: string, e: any): string => {
		this.dataMessage = err
		this.error = this.dataMessage
		this.values = null
		console.error(this.dataMessage, e);
		this.loading = false
		this.loadingDBUpdate = false
		return this.dataMessage
	}

	private handleMessage = (msg: string): string => {
		this.dataMessage = msg
		this.error = ''
		this.loading = false
		this.loadingDBUpdate = false
		return this.dataMessage
	}

	handleInsertMessage = (): string => {
		return this.handleMessage(this._projektService.translationService.translate(marker('comp_detail_edit.entity_eingefuegt'), {entity: this.entity}))
	}

    handleUpdateMessage = (): string => {
		return this.handleMessage(this._projektService.translationService.translate(marker('comp_detail_edit.entity_gespeichert'), {entity: this.entity}))
	}

	handleDeleteMessage = (): string => {
		return this.handleMessage(this._projektService.translationService.translate(marker('comp_detail_edit.entity_geloescht'), {entity: this.entity}))
	}

    handleAbfrageError = (e: any): string => {
		return this.handleError(this._projektService.translationService.translate(marker('comp_detail_edit.entity_error_abfrage'), {entity: this.entity}), e)
    }

	handleInsertError = (e: any): string => {
		return this.handleError(this._projektService.translationService.translate(marker('comp_detail_edit.entity_error_insert'), {entity: this.entity}), e)
	}

	handleUpdateError = (e: any): string => {
		return this.handleError(this._projektService.translationService.translate(marker('comp_detail_edit.entity_error_update'), {entity: this.entity}), e)
	}

	handleDeleteError = (e: any): string => {
		return this.handleError(this._projektService.translationService.translate(marker('comp_detail_edit.entity_error_delete'), {entity: this.entity}), e)
	}
}
