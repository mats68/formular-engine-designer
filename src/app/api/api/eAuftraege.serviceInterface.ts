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

import { EAuftragDTO } from '../model/models';
import { EAuftragDokumentPoolDTO } from '../model/models';
import { EFormularDokumentPoolDTO } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface EAuftraegeServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Löscht eine Beilage aus dem Dokumentenpool.
     * 
     * @param beilageGuid Guid der Formularbeilage
     */
    apiV1EAuftraegeDokumentenpoolBeilageGuidDelete(beilageGuid: string, extraHttpRequestParams?: any): Observable<EAuftragDokumentPoolDTO>;

    /**
     * Fügt eine Beilage in den Dokumentenpool ein.
     * 
     * @param eAuftragDokumentPoolDTO Daten für den DokumentPool
     */
    apiV1EAuftraegeDokumentenpoolPost(eAuftragDokumentPoolDTO?: EAuftragDokumentPoolDTO, extraHttpRequestParams?: any): Observable<EAuftragDokumentPoolDTO>;

    /**
     * Entfernen einer Formular-Beilage aus dem Dokumentenpool.
     * 
     * @param guidFormular Guid des Formulars
     * @param guidFormularBeilage Guid der Formular-Beilage
     */
    apiV1EAuftraegeFormularpoolDelete(guidFormular?: string, guidFormularBeilage?: string, extraHttpRequestParams?: any): Observable<EFormularDokumentPoolDTO>;

    /**
     * Einfügen einer Formular-Beilage in den Dokumentenpool.
     * 
     * @param eFormularDokumentPoolDTO EFormularDokumentPoolDTO der Beilage
     */
    apiV1EAuftraegeFormularpoolPost(eFormularDokumentPoolDTO?: EFormularDokumentPoolDTO, extraHttpRequestParams?: any): Observable<EFormularDokumentPoolDTO>;

    /**
     * Gibt eine Liste mit Elektro-Aufträgen zurück.
     * 
     */
    apiV1EAuftraegeGet(extraHttpRequestParams?: any): Observable<EAuftragDTO>;

    /**
     * Gibt einen Elektro-Auftrag zurück.
     * 
     * @param guid GUID eines Elektro-Auftrages.
     */
    apiV1EAuftraegeGuidGet(guid: string, extraHttpRequestParams?: any): Observable<EAuftragDTO>;

    /**
     * Aktualisiert die Daten eines Auftrags der Elektro-Sparte.
     * 
     * @param eAuftragDTO Das Elektro-Auftrag DTO Objekt, welches die zu sichernden Daten des Elektro-Auftrages enthält.
     */
    apiV1EAuftraegePut(eAuftragDTO?: EAuftragDTO, extraHttpRequestParams?: any): Observable<EAuftragDTO>;

}
