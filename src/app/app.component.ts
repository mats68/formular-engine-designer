import { Component } from '@angular/core';
import { ISchema, ISelectOptionItems, SchemaManager, SchemaManagerProvider } from 'src/bi-formular-engine/src/public-api';
import * as schemas from 'src/app/schemas';
import { initInputWidths, initLabels } from './schema-utils';

let _schema: ISchema
let _SchemaManager: SchemaManager

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'formular-engine-designer';
  get schemaManager() {return _SchemaManager}
  get schema() {return _schema}

  schemaManagerSelect: SchemaManager = this._schemaManagerProvider.createSchemaManager();
  schemaSelect: ISchema = {
    type: 'panel',
    children: [
      {
        type: 'select',
        options() {
          return Object.values(schemas).map(s => s.label as string)
        },
        field: 'cs',
        label: '',
        hint: 'Schema wählen',
        onChange (_, __, value) {
          console.log(value)
          const s = Object.values(schemas).find(s => s.label === value)
          if (s) {
            _schema = s
            _SchemaManager.InitSchema(s)
            _SchemaManager.Schema.whiteBackground = true
            initLabels(_SchemaManager)
            initInputWidths(_SchemaManager)
          }
    
        },
      },
      {
        type: 'checkbox',
        field: 'v',
        label: 'Werte anzeigen',
        style: 'margin-bottom: 10px'
      },
      {
        type: 'divider',
        style: 'margin-bottom: 10px'
      }
    
    ]
  }

  constructor(
    private readonly _schemaManagerProvider: SchemaManagerProvider,
  ) {
    _SchemaManager = this._schemaManagerProvider.createSchemaManager();


  }

  werte_anzeigen(): boolean {
    return this.schema && this.schemaManagerSelect?.Values?.v
  }

  werte(): string {
    return JSON.stringify(this.schemaManager?.Values, null, 2)
  }
}
