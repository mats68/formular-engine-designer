import { NgModule } from "@angular/core";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
	MatCheckboxDefaultOptions,
	MatCheckboxModule,
	MAT_CHECKBOX_DEFAULT_OPTIONS
} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import {
	MatFormFieldDefaultOptions,
	MatFormFieldModule,
	MAT_FORM_FIELD_DEFAULT_OPTIONS
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
	MatProgressSpinnerDefaultOptions,
	MatProgressSpinnerModule,
	MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS
} from '@angular/material/progress-spinner';
import {
	MatRadioDefaultOptions,
	MatRadioModule,
	MAT_RADIO_DEFAULT_OPTIONS
} from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ResizableModule } from 'angular-resizable-element';

const MATERIAL_DESIGN_MODULES: any = [
	MatAutocompleteModule,
	MatBadgeModule,
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatDialogModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatSelectModule,
	MatSidenavModule,
	MatSlideToggleModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	ResizableModule,
	MatSnackBarModule,
];

@NgModule({
	imports: MATERIAL_DESIGN_MODULES,
	exports: MATERIAL_DESIGN_MODULES,
	providers: [
		// Standardstil der Material Design Formularfelder verwenden.
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: {
				appearance: 'standard'
			} as MatFormFieldDefaultOptions
		},
		// Primärfarbe der Radio Controls.
		{
			provide: MAT_RADIO_DEFAULT_OPTIONS,
			useValue: {
				color: 'primary'
			} as MatRadioDefaultOptions
		},
		// Primärfarbe der Checkbox Controls.
		{
			provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
			useValue: {
				color: 'primary'
			} as MatCheckboxDefaultOptions
		},
		// Primärfarbe des Progress-Spinner Controls.
		{
			provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
			useValue: {
				color: 'primary'
			} as MatProgressSpinnerDefaultOptions
		}
	]
})
export class MaterialDesignModule { }
