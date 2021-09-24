import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


//Lookup-Komponente mit Nachschlageliste mittels asynchrone API Call

@Component({
  selector: 'mt-lookup',
  templateUrl: './mt-lookup.component.html',
  styleUrls: ['./mt-lookup.component.scss']
})
export class MtLookupComponent extends MtBaseComponent implements OnInit, OnDestroy {
  items$: Observable<any[]>;
  itemsdata: any[];
  old_suchtext: string = ''
  loading = false
  suchTextModelChanged: Subject<string> = new Subject<string>();
  suchTextModelChangeSubscription: Subscription

  filteredOptions: string[];

  ngOnInit(): void {
    const waittime = this.comp.lookup_waittime || 300
    let minlength = 3
    if (typeof this.comp.lookup_minlength !== 'undefined') {
      minlength = this.comp.lookup_minlength
    }
    this.registerFocus();
    this.suchTextModelChangeSubscription = this.suchTextModelChanged
      .pipe(
        debounceTime(waittime),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        if (typeof newText !== 'string') {
          this.items$ = of([])
          return
        }
        this.Value = newText
        const text = newText.trim()

        if (text === this.old_suchtext) {
          this.items$ = of(this.itemsdata)
          return
        }

        if ((text && text.length >= minlength) || (minlength === 0)) {
          if (!this.comp.lookup_fn) {
            this.items$ = of([])
            return
          }

          if (this.comp.lookup_cb && this.itemsdata) {
            const items = this.comp.lookup_cb(this.sm, this.comp, text, this.old_suchtext, this.itemsdata)
            if (items) {
              this.items$ = of(items)
              return
            }
          }
          this.old_suchtext = text
          this.loading = true
          this.comp.lookup_fn(this.sm, this.comp, newText).then((data: any) => {
            this.itemsdata = data
            if (this.comp.lookup_cb) {
              const items = this.comp.lookup_cb(this.sm, this.comp, text, this.old_suchtext, this.itemsdata) 
              if (items) {
                this.loading = false
                this.items$ = of(items)
                return
              }
            }
  
            this.items$ = of(data)
            this.loading = false
          }).catch(err => {
            this.resetItems()
          })
        } else {
          this.resetItems()
        }

      });

  }
  resetItems() {
    this.itemsdata = null
    this.items$ = of([])
    this.loading = false
  }

  itemText(item: any): string {
    return this.comp.lookup_expression(item)
  }

  itemSelected(event: MatAutocompleteSelectedEvent): void {
    // if ()
    this.comp.lookup_ItemSelected(this.sm, this.comp, event.option.value)
  }

  ngOnDestroy() {
    this.unregisterFocus();
  }




}
