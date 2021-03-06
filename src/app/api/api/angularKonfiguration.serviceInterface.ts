/**
 * Next-Gen App API
 * Die REST Web-Schnittstelle zu der Next-Gen App Anwendung
 *
 * The version of the OpenAPI document: v1
 * Contact: info@brunnerinformatik.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders }                                       from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { AngularKonfiguration } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface AngularKonfigurationServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Gibt die nötige Konfiguration für Angular zurück
     * 
     */
    apiV1AngularKonfigurationGet(extraHttpRequestParams?: any): Observable<AngularKonfiguration>;

}
