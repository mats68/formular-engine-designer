import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { IValueType, SchemaManager } from '../../base/schemaManager';
import { IMaskOptions } from '../../base/types';

enum InpTyp {
  normal,
  autocomplete,
  chips,
  textarea,
  select
}

@Component({
  selector: 'mt-input-raw',
  templateUrl: './mt-input-raw.component.html',
  styleUrls: ['./mt-input-raw.component.scss']
})

export class MtInputRawComponent extends MtBaseComponent implements OnInit, OnDestroy {
  @Input() isSelect: boolean;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredOptions: string[];
  maskOptions: IMaskOptions;
  inpTyp = InpTyp;
  Typ: InpTyp;

  ngOnInit(): void {
    this.registerFocus();

    this.Typ = InpTyp.normal;
    if (this.isSelect) {
      this.Typ = InpTyp.select;
    } else if (this.comp.multiline) {
      this.Typ = InpTyp.textarea;
    } else if (this.comp.multiselect) {
      this.Typ = InpTyp.chips;
    } 
    if (this.comp.options) {
      if (this.Typ === InpTyp.normal) this.Typ = InpTyp.autocomplete; 
      this.filteredOptions = this.OptionsAsStrings;
    }

    this.maskOptions = this.comp.maskOptions || {};
    if (!this.comp.mask) this.maskOptions = {};
  }

  Filter(value: string) {
    if (SchemaManager.checkValueType(value) === IValueType.string) {
      const filterValue = value.toLowerCase();
      this.filteredOptions = this.OptionsAsStrings.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      // array
    }
  }

  addChip(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this.addItemToChipArray(value);

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeChip(item: string): void {
    let Value = this.sm.getValue(this.comp);
    const typ = SchemaManager.checkValueType(Value);
    if (!(typ === IValueType.array)) Value = [];

    const index = Value.indexOf(item);

    if (index >= 0) {
      Value.splice(index, 1);
      this.sm.updateValue(this.comp, Value);
    }
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    if (this.Typ === InpTyp.chips) {
      this.addItemToChipArray(event.option.viewValue);
      this.nameField.nativeElement.value = '';
    }
  }

  addItemToChipArray(val: string) {
    let Value = this.sm.getValue(this.comp);
    const typ = SchemaManager.checkValueType(Value);
    if (!(typ === IValueType.array)) Value = [];

    // Add item
    if ((val || '').trim()) {
      Value.push(val.trim());
    }
    this.sm.updateValue(this.comp, Value);
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }




}
