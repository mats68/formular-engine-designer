import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
import { BiFormModuleModule, ISchemaManagerContext, ISchemaManagerServices, ISchemaManagerTranslator, SchemaManagerProvider } from 'src/app/components/bi-formular-engine/src/public-api';
import { TranslocoPersistLangModule, TRANSLOCO_PERSIST_LANG_STORAGE } from '@ngneat/transloco-persist-lang';
import { TranslocoService } from '@ngneat/transloco';

import { AppComponent } from './app.component';

import { ApiModule, BASE_PATH } from './api/';



import {
	ProjektService,
	TranslocoSchemaManagerTranslator,
}
	from './services';
import { FormulareService } from './services/formulare-service/formulare-service.service';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { MaterialDesignModule } from 'src/app/components/material-design/material-design.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { DatepickerComponent } from './datepicker/datepicker.component';


@NgModule({
	declarations: [
		AppComponent,
		DatepickerComponent,

	],
	imports: [
		BiFormModuleModule,
		BrowserAnimationsModule,
		BrowserModule,
		CommonModule,
		FileUploadModule,
		FormsModule,
		HttpClientModule,
		InlineSVGModule,
		MaterialDesignModule,
		ReactiveFormsModule,
		RouterModule.forRoot([]),
		TranslocoRootModule,
		TranslocoPersistLangModule.init({
			storage: {
				provide: TRANSLOCO_PERSIST_LANG_STORAGE,
				useValue: localStorage
			}
		})
	],
	providers: [
		ApiModule,
		{
			provide: BASE_PATH,
			useValue: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
		},
		{
			provide: SchemaManagerProvider,
			useFactory: () => {
				const transloco: TranslocoService = inject(TranslocoService);
				const httpClient: HttpClient = inject(HttpClient);
				const formulareService: FormulareService = inject(FormulareService);
				const projektService: ProjektService = inject(ProjektService);

				return new SchemaManagerProvider(
					{
						services: {
							"transloco": transloco,
							'http-client': httpClient,
							'formulare-service': formulareService,
							'projekt-service': projektService,
						} as ISchemaManagerServices,
						translator:
							new TranslocoSchemaManagerTranslator(transloco) as ISchemaManagerTranslator
					} as ISchemaManagerContext
				)
			}
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
	) { }
}
