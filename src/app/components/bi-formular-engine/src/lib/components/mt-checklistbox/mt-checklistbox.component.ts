import { Component, OnInit, OnDestroy  } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { ISelectOptionItem } from '../../base/types';

@Component({
  selector: 'mt-checklistbox',
  templateUrl: './mt-checklistbox.component.html',
  styleUrls: ['./mt-checklistbox.component.scss']
})
export class MtChecklistboxComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }
  ngOnDestroy() {
    this.unregisterFocus();
  }

  getChecked(item: ISelectOptionItem): boolean {
    if (!this.Value) {
       return false
    }
    const ind = this.Value.findIndex(i => i === item.value)
    return ind > -1
  }

  updateValue(event: MatCheckboxChange, item: ISelectOptionItem) {
    if (!this.Value || this.comp.singleselect) {
      if (event.source.checked) {
        this.Value = [item.value]
      } else {
        this.Value = []
      }
    } else {
      if (event.source.checked) {
        this.Value = [...this.Value, item.value]
      } else {
        this.Value = this.Value.filter(i => i !== item.value)
      }
    }
    

    
  }


}
