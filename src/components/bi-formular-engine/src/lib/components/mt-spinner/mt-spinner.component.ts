import { Component, OnInit, Input } from '@angular/core';
import { SchemaManager } from '../../base/schemaManager';
import { IComponent } from '../../base/types';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-spinner',
  templateUrl: './mt-spinner.component.html',
  styleUrls: ['./mt-spinner.component.scss']
})
export class MtSpinnerComponent extends MtBaseComponent implements OnInit {
  
  ngOnInit(): void {
  }


}
