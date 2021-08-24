import { Component, OnInit, Input } from '@angular/core';
import { IValueType, SchemaManager } from '../../base/schemaManager';


@Component({
  selector: 'mt-item-or-text',
  templateUrl: './mt-item-or-text.component.html'
})
export class MtItemOrTextComponent implements OnInit {
  @Input() sm: SchemaManager;
  @Input() value: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  isComp(): boolean {
    return SchemaManager.checkValueType(this.value) === IValueType.component;
  }


}
