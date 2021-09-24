import { Component, OnDestroy, OnInit  } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-slider',
  templateUrl: './mt-slider.component.html',
  styleUrls: ['./mt-slider.component.scss']
})
export class MtSliderComponent extends MtBaseComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
}

}
