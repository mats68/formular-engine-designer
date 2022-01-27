import { TranslocoService } from "@ngneat/transloco";
import { marker } from "@ngneat/transloco-keys-manager/marker";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ColDef, SortSeq } from "../components/bi-formular-engine/src/public-api";

const styleInaktiv = (data: any) => {
	if (data && typeof data.aktiv !== 'undefined' && !data.aktiv) {
		return 'text-gray-400'
	}
}

export enum LoadingStatus {
	Loading = 1,
	Loaded = 2,
	AllLoaded = 3
}

export interface MenuItem {
	textFn: (data: any) => string;
	clickFn: (data: any) => void;
	disableFn: (data: any) => boolean;
}

export class DataListProps {
	private _data: any[] = []
	public error: string = '';
	public loadingFn: any;
	public loadedCallback: () => void;
	public clickRowFn: (data: any) => any;
	public skip: number = 0;
	public NewItemButtonFn: any;
	public showDelete: boolean;
	public deleteRowFn: (data: any) => any;
	public deleteText: string = marker('comp_data_list.delete_record')
	public titleMenuItems: MenuItem[] = [];
	public rowMenuItems: MenuItem[] = [];

	public loadingStatus: LoadingStatus = LoadingStatus.Loaded;

	get data(): any[] {
		return this._data
	}

	set data(val: any[]) {
		this._data = val
	}

	constructor(
		public titel: string,
		public colDefs: ColDef[],
		public defaultSortField: string = '',
		public defaultSortSeq: SortSeq = SortSeq.none,
		public loadingText: string = marker('comp_data_list.message_loading_data'),
		public canLoadMore: boolean = false,
		public canLoadAll: boolean = false,
		public limit: number = 0,
		public NewItemButtonText: string = ''
	)
	{
		this.initStyleInaktiv()
	}


	initStyleInaktiv() {
		this.colDefs.forEach(c => c.styleExpression = styleInaktiv)
	}

	loadMoreRows() {
		if (this.loadingStatus === LoadingStatus.AllLoaded) return
		this.loadingStatus = LoadingStatus.Loading
		if (this.loadingFn) {
			this.loadingFn().pipe(
				catchError(e => {
					this.error = `Fehler bei Abfrage: ${this.titel}`
					this.data = []
					console.error(this.error, e);
					this.loadingStatus = LoadingStatus.Loaded
					return throwError(e);
				})
			).subscribe(
				(data: any[] | any) => {
					if (!Array.isArray(data)) data = [data]
					if (!this.data) this.data = []
					this.data = this.data.concat(data)
					this.skip += this.limit
					if (data.length < this.limit) {
						this.loadingStatus = LoadingStatus.AllLoaded
					} else {
						this.loadingStatus = LoadingStatus.Loaded
					}
					if (this.loadedCallback) {
						this.loadedCallback()
					}
				}
			);
		}
	}

	loadAllRows() {
		this.data = []
		this.limit = 100000
		this.skip = 0
		this.loadMoreRows()
	}

	// neues Laden, z.B. nach dem Löschen
	reloadRows(anzahlRows: number) {
		this.skip = 0
		const oldLimit = this.limit
		const loadingStatus = this.loadingStatus
		this.limit = anzahlRows
		if (this.limit <= 0) {
			this.limit = 1
		}
		this.loadingStatus = LoadingStatus.Loading
		if (this.loadingFn) {
			this.loadingFn().pipe(
				catchError(e => {
					this.error = `Fehler bei Abfrage: ${this.titel}`
					this.data = []
					console.error(this.error, e);
					this.loadingStatus = LoadingStatus.Loaded
					return throwError(e);
				})
			).subscribe(
				(data: any[] | any) => {
					if (!Array.isArray(data)) data = [data]
					if (!this.data) this.data = []
					this.data = data
					this.skip = data.length
					this.limit = oldLimit
     				this.loadingStatus = loadingStatus
					if (this.loadedCallback) {
						this.loadedCallback()
					}
				}
			)
		}
	}

}
