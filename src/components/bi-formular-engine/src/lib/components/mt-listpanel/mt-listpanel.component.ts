import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-listpanel',
  templateUrl: './mt-listpanel.component.html',
  styleUrls: ['./mt-listpanel.component.scss']
})
export class MtListpanelComponent extends MtBaseComponent  implements OnInit, OnChanges {
  @Input() listitems: any[]
  curpage = 0
  totalpages = 0

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.curpage = 0
    if (this.listitems) {
      this.totalpages = Math.trunc(this.listitems.length /  this.comp.listitems_pagecount)
    } else {
      this.totalpages = 0
    }
  }

  clickListItem(item: any) {
    this.comp.listitem_click(this.sm, this.comp, item)
  }

  getItems(): any[] {
    if (!this.listitems) return []
    const start = this.curpage * this.comp.listitems_pagecount
    return this.comp.listitems.slice(start, start + this.comp.listitems_pagecount)
  }



  nextPage() {
    this.curpage++
  }

  previousPage() {
    this.curpage-- 

  }

  haspages(): boolean {
    return true

  }




}
