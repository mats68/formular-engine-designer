import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-exp',
  templateUrl: './mt-exp.component.html',
  styleUrls: ['./mt-exp.component.scss']
})
export class MtExpComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }

  afterExpand() {
    if (!this.comp.expanded) this.comp.expanded = true;
    if (this.comp.onChange) {
      this.comp.onChange(this.sm, this.comp, this.comp.expanded);
    }
  }
 
  afterCollapse() {
    if (this.comp.expanded) this.comp.expanded = false;
    if (this.comp.onChange) {
      this.comp.onChange(this.sm, this.comp, this.comp.expanded);
    }
  }
}
