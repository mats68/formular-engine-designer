import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { SchemaManager, IError } from '../../base/schemaManager';
import { IComponent } from '../../base/types';

@Component({
  selector: 'mt-errorpanel',
  templateUrl: './mt-errorpanel.component.html',
  styleUrls: ['./mt-errorpanel.component.scss']
})
export class MtErrorpanelComponent extends MtBaseComponent implements OnInit, OnChanges {
  @Input() Errors: IError[];
  @Input() ErrorCount: number;
  ErrorAbschnitte: IComponent[] = []

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.ErrorAbschnitte = this.sm.getErrorAbschnitte()

  }

  hidePanel() {
    // this.sm.AllValidated = false;
  }

  // panelVisible(): boolean {
  //   return (this.Errors && this.Errors.length > 0 && this.sm.AllValidated);
  // }

  hasError(): boolean {
    return this.Errors && this.Errors.length > 0
  }

  getBgClass(): string {
    return  this.hasError() ? 'bg-error' : 'bg-gray-left'
  }
  
  getText(): string {
    return this.hasError() ?  this.sm.translate('comp_errorpanel.text_nok') : this.sm.translate('comp_errorpanel.text_ok')
  }



  getErrorLabel(comp: IComponent): string {
    const lb = this.sm.getPropValue(comp, 'label');
    return lb || 'Fehler';
  }

  clickError(comp: IComponent) {
    this.sm.ScrollToParentAbschnitt(comp)
  }



}
