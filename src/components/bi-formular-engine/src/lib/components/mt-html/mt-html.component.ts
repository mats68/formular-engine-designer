import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';

@Component({
  selector: 'mt-html',
  templateUrl: './mt-html.component.html',
  styleUrls: ['./mt-html.component.scss']
})
export class MtHtmlComponent extends MtBaseComponent implements OnInit {

  constructor(private readonly _sanitizer: DomSanitizer){
    super();
  }
  
  ngOnInit(): void {

  }

  public get sanitizer(): DomSanitizer { return this._sanitizer; }

}
