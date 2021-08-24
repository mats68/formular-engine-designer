import { Component, OnInit, Input } from '@angular/core';
import { IComponent } from '../../base/types';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-container',
  templateUrl: './mt-container.component.html',
  styleUrls: ['./mt-container.component.scss']
})
export class MtContainerComponent extends MtBaseComponent implements OnInit {
  usesGrid: boolean = false;

  ngOnInit(): void {
    this.usesGrid = this.sm.usesGrid(this.comp);
  }

  getHighlight(child: IComponent): string {
    return this.sm.getDiffHighlight(child) ? ' highlight' : '';
  }


}
