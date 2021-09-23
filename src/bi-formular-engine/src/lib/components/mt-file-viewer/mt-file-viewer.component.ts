import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-file-viewer',
  templateUrl: './mt-file-viewer.component.html',
  styleUrls: ['./mt-file-viewer.component.scss']
})
export class MtFileVierwerComponent extends MtBaseComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  dateiURL: SafeUrl = null;
  loading: boolean;

  @ViewChild('file_viewer_frame')
  private readonly _fileViewer: ElementRef;

  private _onAfterPrint: {(this: Window, ev: Event) : void};

  ngOnInit(): void {
    this.LoadPDF()
  }

  ngOnDestroy(): void {
	  if(this._onAfterPrint){
		  window.removeEventListener('afterprint', this._onAfterPrint);
	  }
  }

  ngAfterViewInit(): void {
	  if(this._fileViewer && !this._onAfterPrint){
		  this._onAfterPrint = (ev:Event):void => {this.AfterPrint(ev);};
		  window.addEventListener('afterprint', this._onAfterPrint);
	  }
  }

  ngOnChanges() {
	  if(this.comp && this.comp.fileViewerProps)
		  this.comp.fileViewerProps.fileViewer = this;
  }

  public AfterPrint(ev:Event):void {
		console.log('Print was called');
  }

  public Print () : void {
	  this._fileViewer.nativeElement.contentWindow.print();
  }

  public LoadPDF(): Promise<any> {
    const props = this.comp.fileViewerProps
    let guid = null
    const beilage = this.sm.formularDTO?.formularDokumentPool?.find(b => b.formularBeilage?.formularTyp.guid === props.formularTypGuid)
    if (props.uploadType === 'Formular') {
      guid = this.sm.formularDTO?.dokument.guid
    } else if (props.uploadType === 'Beilage') {
      guid = beilage && beilage.formularBeilage && beilage.formularBeilage.dokument ? beilage.formularBeilage.dokument.guid : null
    }
    if (guid) {
      return this.sm.service.LoadPDF(guid).then(data => {
        if (data) {
          const objectURL = URL.createObjectURL(data)
          this.dateiURL = props.sanitizer.bypassSecurityTrustResourceUrl(objectURL)
        }

      }).catch(err => {
        this.dateiURL = null
      })
    }

  }

  getclass() {
    return ` bg-white ${this.comp.class}`

  }







}
