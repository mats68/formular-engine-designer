import { Component, OnInit } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-panel',
  templateUrl: './mt-panel.component.html',
  styleUrls: ['./mt-panel.component.scss']
})
export class MtPanelComponent extends MtBaseComponent  implements OnInit {
  ngOnInit(): void {
  }

}
