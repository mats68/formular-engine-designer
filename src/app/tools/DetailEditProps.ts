import { marker } from "@ngneat/transloco-keys-manager/marker";
import { ISchema } from 'src/app/components/bi-formular-engine/src/public-api';

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
		return this.handleMessage(`${this.entity} wurde eingefügt.`)
	}

    handleUpdateMessage = (): string => {
		return this.handleMessage(`${this.entity} wurde geändert.`)
	}

	handleDeleteMessage = (): string => {
		return this.handleMessage(`${this.entity} wurde gelöscht.`)
	}

    handleAbfrageError = (e: any): string => {
		return this.handleError(`Fehler bei Abfrage: ${this.entity}`, e)
    }

	handleInsertError = (e: any): string => {
		return this.handleError(`Fehler beim Einfügen: ${this.entity}`, e)
	}

	handleUpdateError = (e: any): string => {
		return this.handleError(`Fehler beim Ändern: ${this.entity}`, e)
	}

	handleDeleteError = (e: any): string => {
		return this.handleError(`Fehler beim Löschen: ${this.entity}`, e)
	}
}
