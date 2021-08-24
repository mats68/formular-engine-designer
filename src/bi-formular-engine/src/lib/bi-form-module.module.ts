import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxDefaultOptions, MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatRadioDefaultOptions, MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { FileUploadModule } from 'ng2-file-upload';
import { MatProgressSpinnerDefaultOptions, MatProgressSpinnerModule, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';

import { MtInputComponent } from './components/mt-input/mt-input.component';
import { MtLookupComponent } from './components/mt-lookup/mt-lookup.component';
import { MtInputRawComponent } from './components/mt-input-raw/mt-input-raw.component';
import { MtCheckboxComponent } from './components/mt-checkbox/mt-checkbox.component';
import { MtItemComponent } from './base/mt-item/mt-item.component';
import { MtFormComponent } from './components/mt-form/mt-form.component';
import { MtExpComponent } from './components/mt-exp/mt-exp.component';
import { MtBtnComponent } from './components/mt-btn/mt-btn.component';
import { MtDividerComponent } from './components/mt-divider/mt-divider.component';
import { MtSpinnerComponent } from './components/mt-spinner/mt-spinner.component';
import { MtContainerComponent } from './base/mt-container/mt-container.component';
import { MtToolbarComponent } from './components/mt-toolbar/mt-toolbar.component';
import { MtDatatableComponent } from './components/mt-datatable/mt-datatable.component';
import { MtErrorpanelComponent } from './components/mt-errorpanel/mt-errorpanel.component';
import { MtListpanelComponent } from './components/mt-listpanel/mt-listpanel.component';
import { MtTabsComponent } from './components/mt-tabs/mt-tabs.component';
import { MtStepperComponent } from './components/mt-stepper/mt-stepper.component';
import { MtRadioComponent } from './components/mt-radio/mt-radio.component';
import { MtChecklistboxComponent } from './components/mt-checklistbox/mt-checklistbox.component';
import { MtLblComponent } from './components/mt-lbl/mt-lbl.component';
import { MtPanelComponent } from './components/mt-panel/mt-panel.component';
import { MtCardComponent } from './components/mt-card/mt-card.component';
import { MtHtmlComponent } from './components/mt-html/mt-html.component';
import { MtBaseComponent } from './base/mt-base/mt-base.component';
import { MtLinkComponent } from './components/mt-link/mt-link.component';
import { MtSwitchComponent } from './components/mt-switch/mt-switch.component';
import { MtSwitchpanelComponent } from './components/mt-switchpanel/mt-switchpanel.component';
import { MtDateComponent } from './components/mt-date/mt-date.component';
import { MtIconComponent } from './components/mt-icon/mt-icon.component';
import { MtSliderComponent } from './components/mt-slider/mt-slider.component';
import { MtSidenavComponent } from './components/mt-sidenav/mt-sidenav.component';
import { MtItemOrTextComponent } from './base/mt-item-or-text/mt-item-or-text.component';
import { BiDiffComponent } from './base/bi-diff/bi-diff.component';
import { BiFormComponent } from './base/bi-form/bi-form.component';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [
    MtInputComponent,
    MtLookupComponent,
    MtInputRawComponent,
    MtCheckboxComponent,
    MtItemComponent,
    MtFormComponent,
    MtExpComponent,
    MtBtnComponent,
    MtDividerComponent,
    MtSpinnerComponent,
    MtContainerComponent,
    MtToolbarComponent,
    MtDatatableComponent,
    MtErrorpanelComponent,
    MtListpanelComponent,
    MtTabsComponent,
    MtStepperComponent,
    MtRadioComponent,
    MtChecklistboxComponent,
    MtLblComponent,
    MtPanelComponent,
    MtCardComponent,
    BiDiffComponent,
    MtHtmlComponent,
    MtBaseComponent,
    MtLinkComponent,
    MtSwitchComponent,
    MtSwitchpanelComponent,
    MtDateComponent,
    MtIconComponent,
    MtSliderComponent,
    MtSidenavComponent,
    MtItemOrTextComponent,
    BiFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatExpansionModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatStepperModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    OverlayModule,
    FileUploadModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  exports: [
    BiFormComponent,
  ],
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
export class BiFormModuleModule { }
