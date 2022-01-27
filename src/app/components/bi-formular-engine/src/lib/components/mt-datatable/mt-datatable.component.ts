import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { IValueType, SchemaManager } from '../../base/schemaManager';
import { Ausrichtung, ColDef, IComponent } from '../../base/types';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'mt-datatable',
  templateUrl: './mt-datatable.component.html',
  styleUrls: ['./mt-datatable.component.scss']
})
export class MtDatatableComponent extends MtBaseComponent implements OnInit, OnChanges {
  readonly KeyInsertRecord = marker('comp_data_table.tooltip_insert_record');
  readonly KeyCopyRecord = marker('comp_data_table.tooltip_copy_record');
  readonly KeyDeleteRecord = marker('comp_data_table.tooltip_delete_record');

  @Input() curRowInd: number;
  @Input() data: any[];
  currow: any;
  firstInput: IComponent
  addRowLabel: string;
  gridClass: string
  gridClassLastColumn: string
  notExpand: boolean = false;
  @ViewChild('actionsMenuTrigger') actionsMenuTrigger: MatMenuTrigger;

  ngOnInit(): void {

    this.addRowLabel = this.sm.getPropValue(this.comp, 'addRowLabel') || this.sm.translate('comp_data_table.tooltip_insert_record')
    this.gridClass = this.comp.gridClass || 'grid-cols-dt'
    this.gridClassLastColumn = this.comp.gridClass || 'col-start-17'


    this.sm.traverseSchema(c => {
      if (c.autofocus) {
        this.firstInput = c
      }
    }, null, this.comp);
  }

  ngOnChanges() {
    const typ = SchemaManager.checkValueType(this.curRowInd);
    if (typ === IValueType.number && this.data.length > this.curRowInd) {
      this.InitCurRow(this.curRowInd);
    }
  }

  isCheckBox(colDef: ColDef): boolean {
    const cmp = this.sm?.getCompByField(colDef.field)
    if (cmp?.type === 'checkbox' || cmp?.type === 'switch') {
      return true
    }
    return false

  }

  isNormalRow(colDef: ColDef): boolean {
    return (!(this.isCheckBox(colDef) || colDef.htmlContent))
  }

  isHTMLRow(colDef: ColDef): boolean {
    return (colDef.htmlContent)
  }


  getCellText(row: any, colDef: ColDef): string {
    if (colDef.expression) {
      return colDef.expression(row);
    }

    return row[colDef.field];
  }

  getCb(row: any, colDef: ColDef) {
    return row[colDef.field] === true ? '/assets/icons/icon-toggle-check_box_checked.svg' : '/assets/icons/icon-toggle-check_box_unchecked.svg'
  }
  
  getAusrichtungTitle(colDef: ColDef): string {
    const ausrichtung: Ausrichtung = colDef.ausrichtungTitle || Ausrichtung.left
    if (ausrichtung === Ausrichtung.center) {
      return 'justify-center'
    }
    if (ausrichtung === Ausrichtung.right) {
      return 'justify-end'
    }

    return 'justify-start'
  }


  getAusrichtungContent(colDef: ColDef): string {
    const ausrichtung: Ausrichtung = colDef.ausrichtungContent || Ausrichtung.left
    if (ausrichtung === Ausrichtung.center) {
      return 'justify-center'
    }
    if (ausrichtung === Ausrichtung.right) {
      return 'justify-end'
    }

    return 'justify-start'
  }



  showInsertRow(): boolean {
    return !(this.comp.hideAddBtn || this.disabled)
  }



  Insert(): void {
    const row = {};
    const len = this.data.push(row);
    this.sm.updateValue(this.comp, this.data);
    this.sm.InitValuesArray(this.comp, this.data[len - 1]);
    this.InitCurRow(len - 1);
  }

  CopyRow(ind: number): void {
    this.actionsMenuTrigger.closeMenu()
    if (this.disabled) {
      return
    }
    if (!(this.data.length > ind)) {
      return
    }
    const row = this.data[ind];
    if (!row) return;
    const newrow = JSON.parse(JSON.stringify(row));
    if (this.comp.onAfterCopyRow) {
      this.comp.onAfterCopyRow(this.sm, this.comp, newrow)
    }
    this.data.splice(ind + 1, 0, newrow)
    this.data = [...this.data]
    this.sm.updateValue(this.comp, this.data);
  }

  DeleteRow(ind: number): void {
    this.actionsMenuTrigger.closeMenu()
    if (this.disabled) {
      return
    }
    if (!(this.data.length > ind)) {
      return
    }
    const row = this.data[ind];
    if (!row) return;
    this.data = this.data.filter(r => r !== row);
    this.sm.updateValue(this.comp, this.data);
    this.sm.removeAllErrors();
  }

  toggleExpand(ind: number) {
    if (this.notExpand) {
      this.notExpand = false
      return
    }
    
    if (this.comp.curRowInd === ind) ind = -1;
    this.InitCurRow(ind);
  }

  getExpandIcon(ind: number): string {
    return this.comp.curRowInd === ind ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
  }

  rowHasError(arrayInd: number): boolean {
    return this.sm.rowHasError(this.comp, arrayInd)
  }

  InitCurRow(rowInd: number) {
    if (rowInd === -1) {
      this.currow = null;
      this.comp.curRowInd = -1;
    } else {
      if (this.comp.curRowInd !== rowInd) this.comp.curRowInd = rowInd;
      this.currow = this.data[rowInd];
      if (this.firstInput) {
        setTimeout(() => this.sm.DoFocus(this.firstInput), 100);
      }
    }
  }

  hasData(): boolean {
    let has = false;
    const typ = SchemaManager.checkValueType(this.data);
    if (typ === IValueType.array && this.data.length > 0) {
      has = true;
    }
    return has;
  }


  drop(event: CdkDragDrop<string[]>) {
    if (this.disabled) {
      return
    }
    if (this.comp.dragdrop) {
      const data = [...this.data]
      moveItemInArray(data, event.previousIndex, event.currentIndex);
      this.sm.updateValue(this.comp, data);
    }
  }
}
