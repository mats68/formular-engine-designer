import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { marker } from '@ngneat/transloco-keys-manager/marker';
import { hasAllRequired } from 'src/app/schemas';
import { MtBaseComponent } from '../../base/mt-base/mt-base.component';
import { SchemaManager, IError } from '../../base/schemaManager';
import { IComponent } from '../../base/types';

@Component({
	selector: 'mt-errorpanel',
	templateUrl: './mt-errorpanel.component.html',
	styleUrls: ['./mt-errorpanel.component.scss']
})
export class MtErrorpanelComponent extends MtBaseComponent implements OnInit, OnChanges {
	@Input() Errors: IError[];
	@Input() ErrorCount: number;
	ErrorAbschnitte: IComponent[] = []

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		
		this.ErrorAbschnitte = this.sm.getErrorAbschnitte()

	}

	hidePanel() {
		// this.sm.AllValidated = false;
	}

	// panelVisible(): boolean {
	//   return (this.Errors && this.Errors.length > 0 && this.sm.AllValidated);
	// }

	hasError(): boolean {
		hasAllRequired(this.sm); 	// diese Zeile braucht es, damit alle Schemas richtig verfügbar sind.
											// Ohne schiesst es hier und nichts geht mehr.
		return this.Errors && this.Errors.length > 0;
	}

	getBgClass(): string {
		return this.hasError() ? 'bg-error' : 'bg-gray-left'
	}

	getText(): string {
		const lb = this.sm.getPropValue(this.comp, 'label');
		if(lb)
			return lb;

		return this.hasError() ? this.sm.translate(marker('comp_errorpanel.text_nok')) : this.sm.translate(marker('comp_errorpanel.text_ok'))
	}

	getErrorLabel(comp: IComponent): string {
		const lb = this.sm.getPropValue(comp, 'label');
		return lb || 'Fehler';
	}

	clickError(comp: IComponent) {
		this.sm.ScrollToParentAbschnitt(comp)
	}

	hasVisibleChildren(comp: IComponent): boolean {
		if(!comp?.children)
			return false;

		for (let child of comp.children) {
			if(!this.sm.getPropValue(child, 'hidden'))
				return true;
		}
		return false;
	}
}
