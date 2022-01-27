import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { translate } from '@ngneat/transloco';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import * as moment from 'moment';
import { FileUploader } from 'ng2-file-upload';
import { EAuftragDokumentPoolDTO, DokumentBeilageLinkDTO, DokumentDTO, DokumentTransferHistoryDTO, TransferTyp } from 'src/app/api';
import { DokumentTypGuids, getDateiNamePrint } from 'src/app/services';
import { Formular } from 'src/app/services/formulare-service/Formular';
import { IFormularSavedEvent, IFormularSavedEventData } from 'src/app/services/formulare-service/formulare-service.service';
import { BeilageWrapper, ProjektBeilagen } from 'src/app/tools';
import { asGuid, Guid } from 'src/app/tools/Guid';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

interface FileNameInfo {
	originalName: string
	longName: string
	shortName: string
}

@Component({
	selector: 'mt-file-uploader',
	templateUrl: './mt-file-uploader.component.html',
	styleUrls: ['./mt-file-uploader.component.scss']
})
export class MtFileUploaderComponent extends MtBaseComponent implements OnInit, OnChanges, OnDestroy {
	uploaderdd: FileUploader = new FileUploader({});
	uploader: FileUploader = new FileUploader({});
	@ViewChild('fileInput') fileInput: any;
	beilage: DokumentDTO
	pool_beilage: DokumentDTO
	isAttached: boolean
	fileNameInfo: FileNameInfo

	clr_primary = '#348e7a'
	clr_grau = '#dde1e5'
	saving: boolean;

	ngOnInit(): void {
		if (!this.comp.fileUploaderProps?.uploadOnly)
			this.sm.service.registerLinkBeilage(this.onLinkBeilage)
	}

	ngOnDestroy() {
		if (!this.comp.fileUploaderProps?.uploadOnly)
			this.sm.service.unRegisterLinkBeilage(this.onLinkBeilage)
	}

	ngOnChanges() {
		if (!this.comp.fileUploaderProps) return
		const props = this.comp.fileUploaderProps
		this.beilage = null
		this.pool_beilage = null
		this.fileNameInfo = null
		if (!this.sm.projekt) return
		if (!this.sm.dokumentDTO) return
		this.beilage = this.sm.dokumentDTO?.beilagen?.find(b => Guid.equals(b.dokumentDef.guid, props.dokumentDefGuid))
		if (!this.beilage) {
			const pool_beilage_ad = this.sm.projekt?.auftrag?.dokumente?.find(d => Guid.equals(d?.dokumentDef?.guid, props.dokumentDefGuid));
			if (pool_beilage_ad) {
				this.pool_beilage = pool_beilage_ad
			}
		}


		if (!props.uploadOnly && this.sm.dokumentDTO && this.sm.dokumentDTO.dso) {
			if (props.uploadType === 'Formular') {
				if (this.beilage && this.sm.dokumentDTO.dso.originalName && this.sm.dokumentDTO.dokumentDef) {
					this.fileNameInfo = {
						originalName: getDateiNamePrint(this.beilage.dso.originalName),
						longName: this.sm.dokumentDTO.dokumentDef.longName,
						shortName: this.sm.dokumentDTO.dokumentDef.shortName,
					}
				}
			} else {
				if (this.beilage && this.beilage.dso && this.beilage.dokumentDef) {
					this.fileNameInfo = {
						originalName: getDateiNamePrint(this.beilage.dso.originalName),
						longName: this.beilage.dokumentDef.longName,
						shortName: '',
					}
					this.isAttached = true
				} else if (this.pool_beilage && props.uploadType === 'Beilage') {
					this.fileNameInfo = {
						originalName: getDateiNamePrint(this.pool_beilage.dso.originalName),
						longName: this.pool_beilage.dokumentDef.longName,
						shortName: '',
					}
				}
			}
		}
	}

	onFileSelected() {
		if (this.uploader.queue && this.uploader.queue.length > 0) {
			this.uploadFile(this.uploader.queue[0]._file)
			this.uploader.queue[0].remove()
			this.fileInput.nativeElement.value = '';
		}
	}

	onFileDropped(file: File[]) {
		if (file && file.length > 0) {
			this.uploadFile(file[0])
			this.uploaderdd.queue[0].remove()
		}
	}

	getAllowedFileType(): string {
		return this.comp.fileUploaderProps.documentTypes.map(e => '.' + e).join(', ')
	}

	async uploadUnboundFile(file: File) {
		if (file && file.name) {
     		const props = this.comp.fileUploaderProps
			const beilageDef = await BeilageWrapper.newBeilage(file);
			if (beilageDef.beilage) {
				if (props?.onBeforeLinkBeilage) {
					props.onBeforeLinkBeilage(this.sm, beilageDef.beilage)
				}
			}
		}
	}

	async uploadFile(file: File) {
		if (!this.sm.dokumentDTO) {
			alert('Bitte zuerst Formular speichern!')
			return
		}
		let error = ''
		const seterror = (err: string) => `uploadFile: ${err} nicht definiert!`
		const props = this.comp.fileUploaderProps
		if (!this.sm.projekt) error = seterror('projekt')
		if (!this.sm.dokumentDTO) error = seterror('formular')
		// if (!props.dokumentDefGuid) error = seterror('dokumentDefGuid')
		if (!this.sm.service) error = seterror('projektService')
		const aktion_guid = this.sm.service.GetCurAktion_Guid()
		if (!aktion_guid) error = seterror('aktion_guid')

		if (error !== '') {
			console.error(error)
			return
		}

		const extension = file.name.split('.').pop();

		const d = props.documentTypes as string[]
		const ind = d.indexOf(extension)

		if (ind === -1) {
			alert('Datei-Typ nicht erlaubt.')
			return
		}
		if (this.sm.service) {
			// var stack = new Error().stack;
			// console.assert(false, 'not implemented');
			this.saving = true
			let dokument = this.sm.dokumentDTO;
			if (!props.dokumentDefGuid) {
				await this.uploadUnboundFile(file)
				this.saving = false
				return
			}

			let beilageDTO = await this.sm.service.SaveFormular(Guid.create().toString(), props.dokumentDefGuid);
			await this.sm.service.SavePDF(beilageDTO.dso.guid, file);
			beilageDTO = await this.sm.service.LoadFormular(beilageDTO.guid, false);


			let fdp: DokumentBeilageLinkDTO = {
				mandant: dokument.mandant,
				guidBeilage: beilageDTO.guid,
				guidDokument: dokument.guid
			}

			if (props.uploadType !== 'Formular') {

				const dokumentPool: EAuftragDokumentPoolDTO = {
					guidAuftrag: this.sm.projekt.auftrag?.guid,
					guidBeilage: beilageDTO.guid
				}
				await this.sm.service.Save_Dokument_Pool(dokumentPool);
				this.sm.projekt.auftrag.dokumente.push(beilageDTO);
			}

			if (props.onBeforeLinkBeilage) {
				props.onBeforeLinkBeilage(this.sm, beilageDTO)
			}
			else {
				this.sm.formular.addBeilage(beilageDTO);
				if (props.uploadType === 'Antwort') { // Wenn Antwort, TransferHistory schreiben
					const th: DokumentTransferHistoryDTO = {
						mandant: this.sm.dokumentDTO.mandant,
						dokument: beilageDTO.guid,
						typ: TransferTyp.Empfang,
						kanal: this.sm.dokumentDTO.antwortKanal,
						absender: this.sm.Schema.empfaenger?.guid,
						empfaenger: this.sm.service.CurIdentity.holding,
						timestamp: moment.utc().toISOString(),
					}
					if(!beilageDTO.transferHistory)
						beilageDTO.transferHistory = [];
					beilageDTO.transferHistory.push(th);
					await this.sm.service.SaveDokument(beilageDTO);
				}

				this.sm.formular.addBeilage(beilageDTO);
			}

			if (!props.uploadOnly) {
				this.fileNameInfo = {
					originalName: getDateiNamePrint(file.name),
					longName: beilageDTO.dokumentDef.longName,
					shortName: '',
				}
			}

			this.sm.service.emitLinkBeilage(fdp, true);

			let parent = this.sm.getParentAbschnitt(this.comp);// his.comp.parentComp; // suche übergeordmnete Komponente mit Namen
			// while( parent && !parent.name)
			// 	parent = parent.parentComp;

				if(parent)
					this.sm.Schema.defaultAbschnitt = parent.name;

			const reloadFormular = async () => {
				// Weil die globale Variable wegen eines anderen asynchronen Reload Vorgangs hier gerade null sein kann ...
				if (!this.sm.service.CurProjekt) {
					setTimeout(() => { reloadFormular(); });
					return;
				}

				this.sm.service.emitFormularLoadingSpinner();
				await this.sm.service.LoadProjekt(this.sm.service.CurProjekt.auftrag.guid);
				// await ProjektBeilagen.instance.Init();
				this.sm.service.emitReloadFormular();
			};

			setTimeout(() => { reloadFormular(); });

			this.saving = false;
		}
	}

	clickZone() {
		this.fileInput.nativeElement.click()
	}

	onPDFClick() {
		const props = this.comp.fileUploaderProps
		let guid = null
		if (props.uploadType === 'Formular') {
			guid = this.sm.dokumentDTO.dso.guid
		} else {
			guid = this.beilage && this.beilage.dso ? this.beilage.dso.guid : null
		}
		const aktion_guid = this.sm.service.GetCurAktion_Guid()
		if (guid && aktion_guid) {
			// this.sm.service.CurDokument = this.sm.dokumentDTO
			const wrapper = new BeilageWrapper();
			wrapper.beilage = this.beilage;
			wrapper.viewBeilage();
		}
	}

	async changeBeilageAttached(event: any) {
		const formular = this.sm.dokumentDTO;
		if (!formular.beilagen)
			formular.beilagen = [];

		const props = this.comp.fileUploaderProps;
		const beilageDTO = this.beilage ? this.beilage : this.sm.projekt?.auftrag?.dokumente?.find(d => Guid.equals(d?.dokumentDef?.guid, props.dokumentDefGuid));
		if (!beilageDTO)
			throw new Error(`Keine Beilage im Pool`);

		if (event.checked) {
			this.sm.formular.addBeilage(beilageDTO);
		}
		else {
			this.sm.formular.removeBeilage(beilageDTO);
		}

		const linkDTO: DokumentBeilageLinkDTO = {
			mandant: formular.mandant,
			guidDokument: formular.guid,
			guidBeilage: beilageDTO.guid,
		}
		this.sm.service.emitLinkBeilage(linkDTO, event.checked);
		this.isAttached = event.checked
	}

	onLinkBeilage = (linkDTO: DokumentBeilageLinkDTO, insert: boolean, deleted: boolean) => {
		const props = this.comp.fileUploaderProps
		// const guidBeilage = this.beilage?.guid;
		this.beilage = this.sm.dokumentDTO?.beilagen?.find(b => Guid.equals(b.dokumentDef.guid, props.dokumentDefGuid))
		this.isAttached = this.beilage !== undefined;
		if (deleted && !this.beilage) {
			this.fileNameInfo = undefined;
		}
		else if (!this.fileNameInfo) {
			const beilage = this.beilage ? this.beilage : this.sm.projekt.auftrag.dokumente.find(d => Guid.equals(d.guid, linkDTO.guidBeilage));
			if (beilage && Guid.equals(beilage.dokumentDef.guid, props.dokumentDefGuid)) {
				this.fileNameInfo = {
					originalName: beilage.dso.originalName,
					longName: beilage.dokumentDef.longName,
					shortName: '',
				}
			}
		}
	}

	getBackground(): string {
		return `flex mat-elevation-z1 outline-none p-4 mb-4 bg-white`
	}

	getVerknuepfenText(): string {
		return this.isAttached ? translate(marker('formular_beilage.verknüpft')) : translate(marker('formular_beilage.verknüpfen'));
	}

	async deleteBeilage() {
		if (this.beilage) {
			if (this.beilage) {
				const formulareService = this.sm.formulareService;
				const deleter: IFormularSavedEvent = (eventData: IFormularSavedEventData) => {
					formulareService.afterSaving.remove(deleter);
					this.sm.service.Delete_Dokument_Pool_Beilage(this.beilage.guid, this.sm.projekt);
				};
				formulareService.afterSaving.add(deleter);

				const dokumentBeilage: DokumentBeilageLinkDTO = {
					mandant: this.beilage.mandant,
					guidDokument: this.sm.dokumentDTO.guid,
					guidBeilage: this.beilage.guid,
				}
				this.sm.formular.removeBeilage(this.beilage);
				this.fileNameInfo = null;
				await this.changeBeilageAttached({ checked: false });
			}
			else {
				await this.sm.service.Delete_Dokument_Pool_Beilage(this.beilage.guid, this.sm.projekt);
			}
		}
	}

	isAntwortBeilage(): boolean {
		return this.beilage && this.comp.fileUploaderProps.uploadType === 'Antwort'
	}
}
