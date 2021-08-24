import { Component, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { SchemaManager } from '../../base/schemaManager';
import { IComponent, ISelectOptionItems } from '../../base/types';

@Component({
  selector: 'mt-base',
  template: ''
})
export class MtBaseComponent {
  @ViewChild('name') nameField: any;
  @Input() sm: SchemaManager;
  @Input() comp: IComponent;
  _OptionsAsStrings: string[];
  _OptionsAsObjects: ISelectOptionItems;
  subscriptionFocus: Subscription;


  get Value(): any {
    return this.sm.getValue(this.comp);
  }

  set Value(val: any) {
    this.sm.updateValue(this.comp, val);
  }

  get label() {
    const l = this.sm.getLabel(this.comp)
    return l ? l : '';
  }

  get type(): string {
    return this.comp.type || 'button';
  }

  get style(): string {
    return this.sm.getStyle(this.comp, '');
  }

  get name(): string {
    return this.sm.getName(this.comp);
  }

  styles(stylename: string, comp?: IComponent): string {
    if (!comp) comp = this.comp;
    return this.sm.getStyle(comp, stylename);
  }

  getClass(defaultClass?: string, className?: string) {
    let bg = ''
    if (this.sm.Schema.whiteBackground && (this.comp.type === 'input' || this.comp.type === 'select' || this.comp.type === 'date')) {
      bg = 'on-white '
    }
    if (this.comp.type === 'input' && this.comp.multiline) {
      bg = 'on-white is-textarea '
    }
    return this.sm.getClass(this.comp, `${bg} ${defaultClass}`, className);
  }

  get color() {
    return this.comp.color;
  }

  get disabled(): boolean {
    if (typeof this.comp['disabled'] === 'function')
      return this.sm.getPropValue(this.comp, 'disabled');

    if (this.sm.AllDisabled)
      return true;

    return this.sm.getPropValue(this.comp, 'disabled');
  }

  get placeholder(): boolean {
    return this.sm.getPropValue(this.comp, 'placeholder');
  }

  get tooltip() {
    return this.sm.getPropValue(this.comp, 'tooltip');
  }

  get hint() {
    return this.sm.getPropValue(this.comp, 'hint');
  }

  onBlur(): void {
    if (this.sm.Schema.noValidateOnBlur) {
      return
    }
    const value = this.sm.getValue(this.comp);
    this.sm.validate(this.comp, value);
  }

  onClick() {
    if (this.comp.onClick) {
      this.comp.onClick(this.sm, this.comp);
    }
  }


  getError() {
    return this.sm.getError(this.comp);
  }

  get OptionsAsObjects(): ISelectOptionItems {
    if (!this._OptionsAsObjects) {
      this._OptionsAsObjects = this.sm.selectOptionsAsObjects(this.comp);
    }
    return this._OptionsAsObjects;
  }

  get OptionsAsStrings(): string[] {
    if (!this._OptionsAsStrings) {
      this._OptionsAsStrings = this.sm.selectOptionsAsStrings(this.comp);
    }
    return this._OptionsAsStrings;
  }

  registerFocus() {
    this.subscriptionFocus = this.sm.OnFocus.subscribe({
      next: (comp) => {
        if (comp === this.comp && this.nameField) {
          if (this.nameField.nativeElement && this.nameField.nativeElement.focus) {
            this.nameField.nativeElement.focus();
          } else if (this.nameField.focus) {
            this.nameField.focus();
          }
        }
      }
    });
  }

  unregisterFocus() {
    this.subscriptionFocus.unsubscribe();
  }


}
