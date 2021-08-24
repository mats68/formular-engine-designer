import { Component, OnInit, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-card',
  templateUrl: './mt-card.component.html',
  styleUrls: ['./mt-card.component.scss']
})
export class MtCardComponent extends MtBaseComponent implements OnInit {

  ngOnInit(): void {
  }

}
