import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ISchema } from '../../base/types';
import { SchemaManager, ISchemaManagerContext } from '../../base/schemaManager';

@Component({
	selector: 'bi-form',
	templateUrl: './bi-form.component.html',
	styleUrls: ['./bi-form.component.scss'],
	// encapsulation: ViewEncapsulation.None,
	host: {
		'(window:resize)': 'onResize($event)'
	}
})
export class BiFormComponent implements OnInit, OnChanges {
	@Input() schema: ISchema;
	@Input() values: any;
	@Input() context: ISchemaManagerContext;
	@Input() schemaManager: SchemaManager;

	constructor() {

	}

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		if (!this.schemaManager) {
			this.schemaManager = SchemaManager.create(this.context);
		}

		if (!this.schema.name) {
			this.schema.name = Math.random().toString(36).substr(2, 5);
		}

		if (!this.schemaManager.Schema || this.schema.name !== this.schemaManager.Schema.name)
		{
			this.schemaManager.InitSchema(this.schema);

			if (this.values) {
				this.schemaManager.InitValues(this.values);
			}
		}
		else if (this.values !== this.schemaManager.Values) {
			this.schemaManager.InitValues(this.values);
		}

	}

	onResize(event) {
		this.schemaManager.InitScreenSize();
	}
}
