import { Component, OnInit } from '@angular/core';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-diff-btn',
  templateUrl: './mt-diff-btn.component.html',
  styleUrls: ['./mt-diff-btn.component.scss']
})
export class MtDiffBtnComponent extends MtBaseComponent implements OnInit {
  showDiffValue: boolean = false
  diffValue: string = undefined
  titel: string
  ngOnInit(): void {
    this.titel = this.sm.translate(marker('comp_input.diff_wert_changed'))
  }

  onDiffBtnClick() {
    if (this.comp.type === 'datatable') {
      return
    }
    this.showDiffValue = true
    if (!this.diffValue) {
      if (this.comp.diff?.diff_expression) {
        this.diffValue = this.comp.diff?.diff_expression(this.sm, this.sm.DiffValues)
      } else {
        this.diffValue = this.sm.GetDiffValueAsText(this.comp, true)
      }
    }
  }

  closeDiff() {
    this.showDiffValue = false
  }


}
