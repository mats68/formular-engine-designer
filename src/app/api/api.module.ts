import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { AdressenService } from './api/adressen.service';
import { AngularKonfigurationService } from './api/angularKonfiguration.service';
import { AppSettingsService } from './api/appSettings.service';
import { DefinitionenService } from './api/definitionen.service';
import { DokumenteService } from './api/dokumente.service';
import { DsoService } from './api/dso.service';
import { EAktionenService } from './api/eAktionen.service';
import { EAnlagenService } from './api/eAnlagen.service';
import { EAuftraegeService } from './api/eAuftraege.service';
import { EFOnlineApiService } from './api/eFOnlineApi.service';
import { ELeistungenService } from './api/eLeistungen.service';
import { EProjekteService } from './api/eProjekte.service';
import { EmpfaengerService } from './api/empfaenger.service';
import { GebaeudeService } from './api/gebaeude.service';
import { GeschStellenService } from './api/geschStellen.service';
import { HoldingsService } from './api/holdings.service';
import { KompoDBApiService } from './api/kompoDBApi.service';
import { M2HubService } from './api/m2Hub.service';
import { MitarbeiterService } from './api/mitarbeiter.service';
import { PermissionsService } from './api/permissions.service';
import { PostleitzahlenService } from './api/postleitzahlen.service';
import { ProduktLizenzenService } from './api/produktLizenzen.service';
import { RegistrierungService } from './api/registrierung.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
