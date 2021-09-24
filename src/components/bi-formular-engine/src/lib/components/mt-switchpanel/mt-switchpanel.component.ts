import { Component, OnInit, OnDestroy,  } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-switchpanel',
  templateUrl: './mt-switchpanel.component.html',
  styleUrls: ['./mt-switchpanel.component.scss']
})
export class MtSwitchpanelComponent extends MtBaseComponent implements OnInit {
  opened: boolean = false;

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }

  // get valueSwitch(): boolean {
  //   if (this.comp.field) {
  //     return this.Value;
  //   } else {
  //     return this.opened;
  //   }
  // }

  // set valueSwitch(val: boolean) {
  //   if (this.comp.field) {
  //     this.Value = val;
  //   } 
  //   this.opened = this.Value;
  // }

  // toggle() {
  //   this.valueSwitch = !this.valueSwitch;
  // }

  // getIcon(): string {
  //   return !this.valueSwitch ? 'add' : 'remove';
  // }
  // getIconColor(): string {
  //   return !this.valueSwitch ? 'primary' : '';
  // }



}
