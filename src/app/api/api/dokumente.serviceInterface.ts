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

import { DokumentBeilageLinkDTO } from '../model/models';
import { DokumentDTO } from '../model/models';
import { SendDokumentRequest } from '../model/models';


import { Configuration }                                     from '../configuration';



export interface DokumenteServiceInterface {
    defaultHeaders: HttpHeaders;
    configuration: Configuration;

    /**
     * Entfernt eine Dokumentbeilage Verknüpfung.
     * 
     * @param mandant GUID des Mandanten.
     * @param guidDokument GuId des Formulars.
     * @param guidBeilage Guid der Beilage.
     * @param schemaKey Der Key aus der Schema Beilagen-Definition
     */
    apiV1DokumenteAttachmentsDelete(mandant?: string, guidDokument?: string, guidBeilage?: string, schemaKey?: number, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Löscht eine Dokumentbeilage.
     * TODO: Nur mit Status xyz möglich!
     * @param guid Die GUID der zu löschenden Dokumentbeilage.
     */
    apiV1DokumenteAttachmentsGuidDelete(guid: string, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * 
     * 
     * @param guid 
     */
    apiV1DokumenteAttachmentsGuidObjectGet(guid: string, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Erstellt oder speichert ein Dokument.
     * 
     * @param fileName OriginalName des Dokuments
     * @param parcelNr Grundstück-Nr.
     * @param bfsNr Gemeinde-Nr.
     * @param egrid Eidg. Grundstück-ID (EGRID)
     * @param dokumentDTO Das Dokumentbeilage DTO Objekt, welches die Daten der zu erstellenden/speichernden Dokumentbeilage enthält.
     */
    apiV1DokumenteAttachmentsParcelPost(fileName?: string, parcelNr?: number, bfsNr?: number, egrid?: string, dokumentDTO?: DokumentDTO, extraHttpRequestParams?: any): Observable<DokumentDTO>;

    /**
     * Speichert eine Verknüpfung zu einer Dokumentbeilage.
     * 
     * @param dokumentBeilageLinkDTO Das Dokumentbeilage DTO Objekt, welches die Daten der Verknüpfung enthält.
     */
    apiV1DokumenteAttachmentsPost(dokumentBeilageLinkDTO?: DokumentBeilageLinkDTO, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Findet den SchemaKey einer Beilage
     * 
     * @param dokumentGuid 
     * @param beilageGuid 
     */
    apiV1DokumenteAttachmentsSchemakeyGet(dokumentGuid?: string, beilageGuid?: string, extraHttpRequestParams?: any): Observable<number>;

    /**
     * Löscht ein Dokument.
     * TODO: Nur mit Status xyz möglich!
     * @param guid Die GUID des zu löschenden Formulars.
     * @param force 
     */
    apiV1DokumenteGuidDelete(guid: string, force?: boolean, extraHttpRequestParams?: any): Observable<{}>;

    /**
     * Ruft ein Dokument aus der Elektro-Sparte ab.
     * 
     * @param guid Die GUID des abzurufenden Formulars.
     */
    apiV1DokumenteGuidGet(guid: string, extraHttpRequestParams?: any): Observable<DokumentDTO>;

    /**
     * Erstellt oder speichert ein Dokument.
     * 
     * @param dokumentDTO Das Dokument DTO Objekt, welches die Daten des zu erstellenden/speichernden Formulars enthält.
     */
    apiV1DokumentePost(dokumentDTO?: DokumentDTO, extraHttpRequestParams?: any): Observable<DokumentDTO>;

    /**
     * Druckt ein Dokument aus der Elektro-Sparte aus.
     * 
     * @param empfaenger GUID des empfängers an den das Dokument gesendet wird
     * @param dokumentDTO Das Dokument DTO Objekt welches das gespeicherte und zu druckende Dokument referenziert, oder eine komplettes  Dokument DTO Objekt mit den zu druckenden Daten.
     */
    apiV1DokumentePrintPost(empfaenger?: string, dokumentDTO?: DokumentDTO, extraHttpRequestParams?: any): Observable<Blob>;

    /**
     * Sendet ein Dokument an den angegebenen Empfänger
     * 
     * @param sendDokumentRequest Ein &#x60;SendDokumentRequest&#x60; Objekt, welches die Elektro-Aktion, dass eigentliche zu sendende Dokument sowie einen  optionalen konkreten Empfänger anhand dessen GUID spezifiziert.  Das Dokument DTO Objekt welches das gespeicherte und zu sendende Dokument referenziert, oder eine komplettes  Dokument DTO Objekt mit den zu sendenden Daten.
     */
    apiV1DokumenteSendPost(sendDokumentRequest?: SendDokumentRequest, extraHttpRequestParams?: any): Observable<DokumentDTO>;

    /**
     * Überprüft, ob das Dokument zu versendet werden kann.
     * 
     * @param receiver Die Guid des konkreten Empfängers.
     * @param dokumentDTO Das Dokument DTO Objekt welches das gespeicherte und zu sendende Dokument referenziert, oder eine komplettes  Dokument DTO Objekt mit den zu sendenden Daten.
     */
    apiV1DokumenteValidatePost(receiver?: string, dokumentDTO?: DokumentDTO, extraHttpRequestParams?: any): Observable<DokumentDTO>;

}
