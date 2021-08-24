import { Component, ViewChild, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment_ from 'moment';
const moment = moment_;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
  },
};

@Component({
  selector: 'mt-date',
  templateUrl: './mt-date.component.html',
  styleUrls: ['./mt-date.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MtDateComponent extends MtBaseComponent implements OnInit, OnChanges, OnDestroy {
  date: FormControl;
  @ViewChild('dp') picker: any;

  constructor(private dateAdapter: DateAdapter<Date>) {
    super();
  }

  ngOnInit(): void {
    this.date = new FormControl(moment());
    this.registerFocus();
  }

  ngOnChanges() {
    this.updateFormat();
  }

  get parseDateInput(): string {
    return this.comp.dateParseFormat || this.sm.Settings.date.parse.dateInput
  }

  get DateValue(): moment.Moment {
    var date = moment(this.Value, this.parseDateInput)
    return date
  }

  set DateValue(val: moment.Moment) {
    if (val && val.isValid()) {
      this.Value = moment(val).format(this.parseDateInput);
    } else {
      this.Value = ''
    }
  }


  updateFormat() {
    this.dateAdapter.setLocale(this.sm.Settings.language);
    // Hack from here: https://github.com/angular/components/issues/8355
    setTimeout(() => {
      const d = JSON.parse(JSON.stringify(this.picker._datepickerInput._dateFormats));
      d.display.dateInput = this.sm.Settings.date.display.dateInput;
      d.display.monthYearLabel = this.sm.Settings.date.display.monthYearLabel;
      d.parse.dateInput = this.parseDateInput
      this.picker._datepickerInput._dateFormats = d;
    });

  }

  ngOnDestroy() {
    this.unregisterFocus();
  }


}
