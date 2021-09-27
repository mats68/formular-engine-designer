import { Component, OnInit, Input } from '@angular/core';

import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-tabs',
  templateUrl: './mt-tabs.component.html',
  styleUrls: ['./mt-tabs.component.scss']
})
export class MtTabsComponent extends MtBaseComponent implements OnInit {

  ngOnInit(): void {
  }

  selectedIndexChange(num: number) {
    if (this.comp.selectedTabIndex !== num) this.comp.selectedTabIndex = num;
  }

}
