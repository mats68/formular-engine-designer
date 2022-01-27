import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { IValueType, SchemaManager } from '../../base/schemaManager';
import { IMaskOptions } from '../../base/types';
import { Subscription } from 'rxjs';

enum InpTyp {
  normal,
  autocomplete,
  chips,
  textarea,
  select
}

@Component({
  selector: 'mt-input',
  templateUrl: './mt-input.component.html',
  styleUrls: ['./mt-input.component.scss']
})

export class MtInputComponent extends MtBaseComponent implements OnInit, OnDestroy {
  @Input() isSelect: boolean;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredOptions: string[];
  maskOptions: IMaskOptions;
  inpTyp = InpTyp;
  Typ: InpTyp;
	@ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  subscriptionAutocompleteClose: Subscription;

  ngOnInit(): void {
    this.registerFocus();
    this.registerAutocompleteClose();

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
      if (this.comp.filterOptions) {
        const filterValue = value.toLowerCase();
        this.filteredOptions = this.OptionsAsStrings.filter(option => option.toLowerCase().includes(filterValue));
        if (this.filteredOptions.length === 0) {
          this.filteredOptions = this.OptionsAsStrings
        }
        if (this.filteredOptions.length === 1 && this.filteredOptions[0] === value) {
          this.filteredOptions = this.OptionsAsStrings
        }
      } else {
        this.filteredOptions = this.OptionsAsStrings
      }
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

  haslabel(): boolean {
    const l = this.label
    return (typeof l !== 'undefined')
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
    this.unregisterCloseAutocomplete()
  }

  options_icon(): boolean {
    return this.comp.type === 'input' && typeof this.comp.options !== 'undefined'

  }

  registerAutocompleteClose() {
    this.subscriptionAutocompleteClose = this.sm.OnAutocompleteClose.subscribe({
      next: (comp) => {
        if (comp === this.comp) {
          this.autocomplete.closePanel()
        }
      }
    });
  }

  unregisterCloseAutocomplete() {
    this.subscriptionAutocompleteClose.unsubscribe();
  }





}
