import { Component, OnDestroy, OnInit } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-switch',
  templateUrl: './mt-switch.component.html',
  styleUrls: ['./mt-switch.component.scss']
})
export class MtSwitchComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
}

}
