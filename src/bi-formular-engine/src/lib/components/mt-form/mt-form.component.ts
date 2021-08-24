import { Component, OnInit, Input } from '@angular/core';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-form',
  templateUrl: './mt-form.component.html',
  styleUrls: ['./mt-form.component.scss']
})
export class MtFormComponent extends MtBaseComponent implements OnInit {

  ngOnInit(): void {
  }
  onSubmit() {
    if (this.sm.Schema.onSubmit) this.sm.Schema.onSubmit(this.sm);
  }

}
