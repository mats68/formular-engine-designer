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

import { M2HubAGBDTO } from '../model/models';
import { M2HubBuildingDTO } from '../model/models';
import { M2HubSearchParamsDTO } from '../model/models';
import { M2HubUserAGBDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface M2HubServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Gibt die AGB für einen Empfänger (VNB) zurück
     * 
     * @param vnb GUID des Empfängers (VNB)
     */
    apiV1M2HubAgbVnbGet(vnb: string, extraHttpRequestParams?: any): Observable<M2HubAGBDTO>;

    /**
     * Gibt Gebäude eines bestimmten VNB’s zurück.
     * 
     * @param vnb GUID des Empfängers (VNB)
     * @param strasse Strasse des Gebäudes, kann Platzhalter enthalten (*, ?)
     * @param plz PLZ des Gebäudes
     */
    apiV1M2HubBuildingsVnbStrassePlzGet(vnb: string, strasse: string, plz: string, extraHttpRequestParams?: any): Observable<Array<M2HubBuildingDTO>>;

    /**
     * Gibt die unterstützten Suchkriterien für einenb Empfänger (VNB) zurück
     * 
     * @param vnb GUID des Empfängers (VNB)
     */
    apiV1M2HubSearchparamsVnbGet(vnb: string, extraHttpRequestParams?: any): Observable<M2HubSearchParamsDTO>;

    /**
     * Gibt zurück, ob die AGB für ein VNB von einem bestimmten Mitarbeiter bereits gelesen wurden.
     * 
     * @param vnb GUID des Empfängers (VNB)
     */
    apiV1M2HubUserAgbVnbGet(vnb: string, extraHttpRequestParams?: any): Observable<M2HubUserAGBDTO>;

    /**
     * Setzt, dass der Mitarbeiter die AGB des VNB’s gelesen hat oder setzt diesen Wert zurück.
     * 
     * @param vnb GUID des Empfängers (VNB)
     * @param wert 1 &#x3D; User hat AGB gelesen, 0 &#x3D; User hat AGB nicht gelesen
     */
    apiV1M2HubUserAgbVnbWertPut(vnb: string, wert: string, extraHttpRequestParams?: any): Observable<M2HubUserAGBDTO>;

}
