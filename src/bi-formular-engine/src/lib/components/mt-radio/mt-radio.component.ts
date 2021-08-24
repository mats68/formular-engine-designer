import { Component, OnInit, OnDestroy  } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-radio',
  templateUrl: './mt-radio.component.html',
  styleUrls: ['./mt-radio.component.scss']
})
export class MtRadioComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }
  ngOnDestroy() {
    this.unregisterFocus();
  }


}
