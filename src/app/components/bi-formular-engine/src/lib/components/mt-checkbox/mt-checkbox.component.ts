import { Component, OnDestroy, OnInit } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-checkbox',
  templateUrl: './mt-checkbox.component.html',
  styleUrls: ['./mt-checkbox.component.scss']
})
export class MtCheckboxComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }

}
