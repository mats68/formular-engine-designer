import { Component, OnInit, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { IComponent } from '../../base/types';


@Component({
  selector: 'mt-toolbar',
  templateUrl: './mt-toolbar.component.html',
  styleUrls: ['./mt-toolbar.component.scss']
})

export class MtToolbarComponent extends MtBaseComponent implements OnInit {
  ngOnInit(): void {
    this.comp.noLayout = true;
    this.comp.children.forEach(c => {if (!c.style) c.style = 'margin-left: 10px;';});
  }

  getMenuLabel(item: IComponent): string {
    return this.sm.getPropValue(item, 'label') || this.sm.getPropValue(item, 'tooltip');
  }
}
