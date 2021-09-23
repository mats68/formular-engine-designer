import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { EAuftragDokumentPoolDTO, EFormularDokumentPoolDTO, EFormularDTO } from 'src/app/api';
import { EFormularBeilageDTO } from 'src/app/api/model/eFormularBeilageDTO';
import { getDateiNamePrint } from 'src/app/services';
import { IFormularSavedEvent, IFormularSavedEventData } from 'src/app/services/formulare-service/formulare-service.service';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

interface FileNameProps {
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
	beilage: EFormularBeilageDTO
	pool_beilage: EFormularBeilageDTO
	isAttached: boolean
	fnp: FileNameProps

	clr_primary = '#348e7a'
	clr_grau = '#dde1e5'
	saving: boolean;

	ngOnInit(): void {
		this.sm.service.registerLinkBeilage(this.onLinkBeilage)
	}

	ngOnDestroy() {
		this.sm.service.unRegisterLinkBeilage(this.onLinkBeilage)
	}

	ngOnChanges() {
		if (!this.comp.fileUploaderProps) return
		const props = this.comp.fileUploaderProps
		this.beilage = null
		this.pool_beilage = null
		this.fnp = null
		if (!this.sm.projekt) return
		if (!this.sm.formularDTO) return
		const dokumentPool: EFormularDokumentPoolDTO = this.sm.formularDTO?.formularDokumentPool?.find(b => b.formularBeilage?.formularTyp.guid === props.formularTypGuid)
		this.beilage = dokumentPool?.formularBeilage
		if (!this.beilage) {
			const pool_beilage_ad = this.sm.projekt?.auftrag?.dokumente?.find(d => d.eformularBeilagen_IdFormularBeilagen?.formularTyp?.guid === props.formularTypGuid)
			if (pool_beilage_ad) {
				this.pool_beilage = pool_beilage_ad.eformularBeilagen_IdFormularBeilagen
			}
		}


		if (this.sm.formularDTO && this.sm.formularDTO.dokument && !props.hideLink) {
			if (props.uploadType === 'Formular') {
				if (this.beilage && this.sm.formularDTO.dokument.originalName && this.sm.formularDTO.formularTyp) {
					this.fnp = {
						originalName: getDateiNamePrint(this.beilage.dokument.originalName),
						longName: this.sm.formularDTO.formularTyp.longName,
						shortName: this.sm.formularDTO.formularTyp.shortName,
					}
				}
			} else {
				if (this.beilage && this.beilage.dokument && this.beilage.formularTyp) {
					this.fnp = {
						originalName: getDateiNamePrint(this.beilage.dokument.originalName),
						longName: this.beilage.formularTyp.longName,
						shortName: '',
					}
					this.isAttached = true
				} else if (this.pool_beilage && props.uploadType === 'Beilage') {
					this.fnp = {
						originalName: getDateiNamePrint(this.pool_beilage.dokument.originalName),
						longName: this.pool_beilage.formularTyp.longName,
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

	async uploadFile(file: File) {
		if (!this.sm.formularDTO) {
			alert('Bitte zuerst Formular speichern!')
			return
		}
		let error = ''
		const seterror = (err: string) => `uploadFile: ${err} nicht definiert!`
		const props = this.comp.fileUploaderProps
		if (!this.sm.projekt) error = seterror('projekt')
		if (!this.sm.formularDTO) error = seterror('formular')
		if (!props.formularTypGuid) error = seterror('formularTypGuid')
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
			this.saving = true
			let formular = this.sm.formularDTO;
			const beilage: EFormularBeilageDTO = await this.sm.service.SavePDFAttachment(formular, props.formularTypGuid);
			const doc = await this.sm.service.SavePDF(beilage.dokument.guid, file);

			if (props.uploadType !== 'Formular') {
				const dokumentPool: EAuftragDokumentPoolDTO = {
					guidAuftrag: this.sm.projekt.auftrag?.guid,
					guidBeilage: beilage.guid
				}
				await this.sm.service.Save_Dokument_Pool(dokumentPool);
			}

			const fdp : EFormularDokumentPoolDTO = this.sm.formular.addBeilage(beilage);
			this.fnp = {
				originalName: getDateiNamePrint(file.name),
				longName: beilage.formularTyp.longName,
				shortName: '',
			}

			if(fdp)
				this.sm.service.emitLinkBeilage(fdp);
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
			guid = this.sm.formularDTO.dokument.guid
		} else {
			guid = this.beilage && this.beilage.dokument ? this.beilage.dokument.guid : null
		}
		const aktion_guid = this.sm.service.GetCurAktion_Guid()
		if (guid && aktion_guid) {
			this.sm.service.curFormular = this.sm.formularDTO
			props.router.navigate(['/pdf-viewer'], { queryParams: { guid, typ: props.formularTypGuid, guidauftrag: this.sm.projekt.auftrag?.guid, aktion: aktion_guid } });
		}
	}

	async changeBeilageAttached(event: any) {
		const formular = this.sm.formularDTO;
		if (!formular.formularDokumentPool)
			formular.formularDokumentPool = [];


		const formularDokumentPool: EFormularDokumentPoolDTO = {
			mandant: formular.mandant,
			guidFormular: formular.guid,
			guidFormularBeilagen: this.pool_beilage?.guid ? this.pool_beilage.guid : '',
			formularBeilage: this.pool_beilage,
			linkRemoved: !event.checked,
		}

		if (event.checked) {
			formular.formularDokumentPool.push(formularDokumentPool);
		}
		else {
			formular.formularDokumentPool = formular.formularDokumentPool.filter(fdp => fdp.guidFormularBeilagen != formularDokumentPool.guidFormularBeilagen);
		}

		this.sm.service.emitLinkBeilage(formularDokumentPool);
		this.isAttached = event.checked
	}

	onLinkBeilage = (formularPool: EFormularDokumentPoolDTO) => {
		const props = this.comp.fileUploaderProps
		const dokumentPool: EFormularDokumentPoolDTO = this.sm.formularDTO?.formularDokumentPool?.find(b => b.formularBeilage?.formularTyp.guid === props.formularTypGuid)
		this.beilage = dokumentPool?.formularBeilage

		this.isAttached = this.beilage !== undefined;
	}

	getBackground(): string {
		return `flex mat-elevation-z1 outline-none p-4 mb-4 bg-white`
	}

	getVerknuepfenText(): string {
		return this.isAttached ? 'verknüpft' : 'verknüpfen'
	}

	async deleteBeilage() {
		if (this.beilage) {
			const attached_beilage = this.sm.formularDTO.formularDokumentPool.find(pool => pool.guidFormularBeilagen === this.beilage.guid);
			if (attached_beilage) {
				const formulareService = this.sm.formulareService;
				const deleter: IFormularSavedEvent = (eventData: IFormularSavedEventData) => {
					formulareService.afterSaving.remove(deleter);
					this.sm.service.Delete_Dokument_Pool_Beilage(this.beilage.guid, this.sm.projekt);
				};
				formulareService.afterSaving.add(deleter);
				this.sm.formular.removeBeilage(attached_beilage.formularBeilage);
				this.fnp = null;
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
