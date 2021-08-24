import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { SchemaManager, IError } from '../../base/schemaManager';
import { IComponent } from '../../base/types';

@Component({
  selector: 'mt-errorpanel',
  templateUrl: './mt-errorpanel.component.html',
  styleUrls: ['./mt-errorpanel.component.scss']
})
export class MtErrorpanelComponent implements OnInit, OnChanges {
  @Input() sm: SchemaManager;
  @Input() comp: IComponent;
  @Input() Errors: IError[];
  @Input() ErrorCount: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  clickError(error: IError) {
    this.sm.DoFocus(error.comp, error.arrayInd);
  }

  hidePanel() {
    this.sm.AllValidated = false;
  }

  panelVisible(): boolean {
    return (this.Errors && this.Errors.length > 0 && this.sm.AllValidated);
  }

getErrorLabel(error: IError): string {
    let lb = '';
    if (!error.comp) return lb;
    lb = this.sm.getPropValue(error.comp, 'label');
    if (!lb) return '';
    const suff = error.arrayInd !== -1 ? ` ${this.sm.Strings.row} [${error.arrayInd+1}]` : '';
    return `${lb}${suff}`;
  }



}
