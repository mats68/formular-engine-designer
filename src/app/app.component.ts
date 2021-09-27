import { Component, Inject } from '@angular/core';
import { ISchema, ISelectOptionItems, SchemaManager, SchemaManagerProvider } from 'src/app/components/bi-formular-engine/src/public-api';
import * as schemas from 'src/app/schemas';
import { initInputWidths, initLabels, label, label_Input } from './schemas/schema-utils';
import { ProjektService } from './services';
import { TranslocoService } from '@ngneat/transloco';
import { DOCUMENT } from '@angular/common';

let _schema: ISchema
let _SchemaManager: SchemaManager

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'formular-engine-designer';
	constructor(
		private readonly _projektService: ProjektService,
		private readonly _translationService: TranslocoService,
		@Inject(DOCUMENT)
		private readonly _document: any,
    private readonly _schemaManagerProvider: SchemaManagerProvider,
	)
	{

		// Observiere die aktuell ausgewählte Sprache mittels dem Transloco-Service.
		this._translationService.langChanges$.subscribe(
			(selectedLanguage: string) =>
			{
				// Die Sprache wurde geändert, aktualisiere den Wert des `lang`_Attributes des `<html>` Elementes.
				this._document.documentElement.lang = selectedLanguage;
			}
		);
    _SchemaManager = this._schemaManagerProvider.createSchemaManager();

	}

  get schemaManager() {return _SchemaManager}
  get schema() {return _schema}

  schemaManagerSelect: SchemaManager = this._schemaManagerProvider.createSchemaManager();
  schemaSelect: ISchema = {
    type: 'panel',
    classLayout: 'flex items-center border-2',
    class: 'w-full',
    children: [
      label('Schema: '),
      {
        type: 'select',
        width: '300px',
        options() {
          return Object.values(schemas).map(s => s.label as string)
        },
        field: 'cs',
        label: '',
        onChange (_, __, value) {
          console.log(value)
          const s = Object.values(schemas).find(s => s.label === value)
          if (s) {
            _schema = s
            _SchemaManager.InitSchema(s)
            _SchemaManager.Schema.whiteBackground = true
            initLabels(_SchemaManager)
            initInputWidths(_SchemaManager)
            if (_SchemaManager.Schema.initFormular) {
              _SchemaManager.Schema.initFormular(_SchemaManager)
            }
          }
    
        },
      },
      {
        type: 'checkbox',
        classLayout: 'ml-2 mb-2',
        field: 'v',
        label: 'Werte anzeigen',
        style: 'margin-bottom: 10px'
      },
    
    ]
  }

  werte_anzeigen(): boolean {
    return this.schema && this.schemaManagerSelect?.Values?.v
  }

  werte(): string {
    return JSON.stringify(this.schemaManager?.Values, null, 2)
  }
}
