import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IValueType, SchemaManager } from '../../base/schemaManager';
import { ColDef, IComponent, ISummaryFunction } from '../../base/types';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
	selector: 'mt-datatable',
	templateUrl: './mt-datatable.component.html',
	styleUrls: ['./mt-datatable.component.scss']
})
export class MtDatatableComponent extends MtBaseComponent implements OnInit, OnChanges {
	// readonly KeyInsertRecord = marker('comp_data_table.tooltip_insert_record');
	// readonly KeyCopyRecord = marker('comp_data_table.tooltip_copy_record');
	// readonly KeyDeleteRecord = marker('comp_data_table.tooltip_delete_record');

	@Input() curRowInd: number;
	@Input() data: any;
	currow: any;
	firstInput: IComponent

	ngOnInit(): void {
		// this.fields = [];

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

	isCheckBox(row: any, colDef: ColDef): boolean {
		const val = row[colDef.field]
		return (typeof val === 'boolean')
	}

	getCellText(row: any, colDef: ColDef): string {
		if (colDef.expression) {
			return colDef.expression(row);
		}

		return row[colDef.field];
	}


  Insert(): void {
    const row = {};
    const len = this.data.push(row);
    this.sm.updateValue(this.comp, this.data);
    this.sm.InitValuesArray(this.comp, this.data[len - 1]);
    this.InitCurRow(len - 1);
  }

  CopyRow(): void {
    if (!this.currow) return;
    const newrow = JSON.parse(JSON.stringify(this.currow));
    const len = this.data.push(newrow);
    this.sm.updateValue(this.comp, this.data);
    this.InitCurRow(len - 1);
  }

  DeleteRow(): void {
    if (!this.currow) return;
    this.data = this.data.filter(r => r !== this.currow);
    this.sm.updateValue(this.comp, this.data);
    this.sm.removeAllErrors();
    if (this.sm.AllValidated) {
      this.sm.validateAll();
    }
    this.InitCurRow(-1);
  }

  toggleExpand(ind: number) {
    if (this.comp.curRowInd === ind) ind = -1;
    this.InitCurRow(ind);
  }

  getExpandIcon(ind: number): string {
    return this.comp.curRowInd === ind ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
  }

  hasError(ind: number): boolean {
    const error = this.sm.Errors.findIndex(e => e.arrayInd === ind);
    return error > -1
  }

  getRowClass(ind: number): string {
    return `card mat-elevation-z1 mb-2`
    // const error = this.sm.Errors.findIndex(e => e.arrayInd === ind) > -1;
    // return `card mat-elevation-z1 mb-2 ${error ? 'border-formstatus_error' : ''}`

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
    if (this.comp.dragdrop) {
      const data = [...this.data]
      moveItemInArray(data, event.previousIndex, event.currentIndex);
      this.sm.updateValue(this.comp, data);
    }
  }
}
