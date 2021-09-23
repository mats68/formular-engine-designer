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

import { AuftragsDefinitionDTO } from '../model/models';
import { EProjectDTO } from '../model/models';
import { EProjektDTO } from '../model/models';
import { EProjektViewDTO } from '../model/models';
import { IdentityContextDTO } from '../model/models';
import { ProblemDetails } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface EFOnlineApiServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Gibt eine Auflistung aller gültigen Identitätskontexte des authentifizierten Benutzers zurück.
     * 
     */
    apiV1EFOnlineApiIdentityGet(extraHttpRequestParams?: any): Observable<Array<IdentityContextDTO>>;

    /**
     * 
     * 
     * @param eProjectDTO 
     */
    apiV1EFOnlineApiProjectPost(eProjectDTO?: EProjectDTO, extraHttpRequestParams?: any): Observable<EProjectDTO>;

    /**
     * 
     * 
     * @param skip 
     * @param limit 
     * @param branches 
     */
    apiV1EFOnlineApiProjectTypesGet(skip?: number, limit?: number, branches?: Array<string>, extraHttpRequestParams?: any): Observable<Array<AuftragsDefinitionDTO>>;

    /**
     * Ruft alle Elektro-Projekte aus dem im Identitätskontext des Benutzers spezifizierten Mandanten ab.
     * 
     * @param limit Die maximale Anzahl der Elektro-Projekte, welche abgerufen werden sollen.
     * @param skip Die Anzahl der Elektro-Projekte, welche übersprungen werden sollen.
     */
    apiV1EFOnlineApiProjekteGet(limit?: number, skip?: number, extraHttpRequestParams?: any): Observable<Array<EProjektViewDTO>>;

    /**
     * Gibt das Projekt mit der spezifizierten GUID aus dem im Identitätskontext des Benutzers spezifizierten Mandanten  zurück.
     * 
     * @param guid Die GUID des Projektes.
     */
    apiV1EFOnlineApiProjekteGuidGet(guid: string, extraHttpRequestParams?: any): Observable<EProjektDTO>;

    /**
     * Erstellt ein neues Elektro-Projekt.
     * 
     * @param eProjektDTO Das Elektro-Projekt DTO Objekt, welches die Daten des zu erstellenden Projektes enthält.
     */
    apiV1EFOnlineApiProjektePost(eProjektDTO?: EProjektDTO, extraHttpRequestParams?: any): Observable<EProjektDTO>;

}