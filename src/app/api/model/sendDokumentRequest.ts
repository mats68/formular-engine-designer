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
import { DokumentDTO } from './dokumentDTO';
import { EAktionDTO } from './eAktionDTO';


export interface SendDokumentRequest { 
    aktion: EAktionDTO;
    dokument: DokumentDTO;
    empfaenger?: string | null;
}

