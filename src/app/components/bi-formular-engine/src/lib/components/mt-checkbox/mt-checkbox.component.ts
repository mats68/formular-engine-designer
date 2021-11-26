import { Component, OnDestroy, OnInit } from '@angular/core';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-checkbox',
  templateUrl: './mt-checkbox.component.html',
  styleUrls: ['./mt-checkbox.component.scss']
})
export class MtCheckboxComponent extends MtBaseComponent implements OnInit, OnDestroy {
  pflichtfeld_hint: string;

  ngOnInit(): void {
    if (this.comp.tag === 99) {
      this.pflichtfeld_hint =  this.sm.translate(marker('comp_input.pflichtfeld'))
    } else {
      this.pflichtfeld_hint = ''
    }
    this.registerFocus();
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }

  _getClass(): string {
    const c = this.getClass()
    if (this.pflichtfeld_hint) {
      return `${c} top-cb`
    }
    return c
  }



}
