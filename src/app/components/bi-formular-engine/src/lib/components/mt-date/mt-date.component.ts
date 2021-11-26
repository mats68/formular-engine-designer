import { Component, ViewChild, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment_ from 'moment';
const moment = moment_;

const ISO_Date_Format = 'YYYY-MM-DD[T]HH:mm:ss'

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
  @Input() disCounter: number;
  @ViewChild('dp') picker: any;

  _DateValue: moment.Moment
  get DateValue(): moment.Moment {
    return this._DateValue
  }

  set DateValue(val: moment.Moment) {
    this._DateValue = val
    if (val && val.isValid()) {
      this.Value = moment(val).format(ISO_Date_Format);
    } else {
      this.Value = ''
    }
  }

  constructor(private dateAdapter: DateAdapter<Date>) {
    super();
  }

  ngOnInit(): void {
		this.sm.service.registerFormularStatusChange(this.statusChange)
    this.date = new FormControl(moment());
    if (this.Value) {
      this._DateValue = moment(this.Value, ISO_Date_Format)
    }
    this.updateDisabled();
    this.registerFocus();
  }

  ngOnChanges() {
    this.updateFormat();
    this.updateDisabled();
  }


  statusChange = () => {
    this.updateDisabled()
	}


  updateDisabled() {
    if (this.disabled) {
      this.date?.disable()
    } else {
      this.date?.enable()
    }

  }


  updateFormat() {
    const lang = this.sm?.service?.translationService?.getActiveLang() || 'de'
    this.dateAdapter.setLocale(lang);
  }

  ngOnDestroy() {
    this.unregisterFocus();
    this.sm.service.unRegisterFormularStatusChange(this.statusChange)
  }


}
