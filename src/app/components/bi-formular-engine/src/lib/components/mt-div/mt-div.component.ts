import { Component, OnInit, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-div',
  templateUrl: './mt-div.component.html',
  styleUrls: ['./mt-div.component.scss']
})
export class MtDivComponent extends MtBaseComponent implements OnInit {
  
  ngOnInit(): void {
  }


}
