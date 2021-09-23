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
import { EFormularBeilageDTO } from './eFormularBeilageDTO';


/**
 * Diese Klasse repräsentiert ein Data-Transfer-Object für Elektro-Aufträge Doumentenpool Entitäten.
 */
export interface EFormularDokumentPoolDTO { 
    /**
     * GUID des Mandanten.
     */
    mandant?: string;
    /**
     * Id des Formulars.
     */
    idFormular?: number | null;
    /**
     * ID der Beilage.
     */
    idFormularBeilagen?: number | null;
    /**
     * GuId des Formulars.
     */
    guidFormular?: string | null;
    /**
     * Guid der Beilage.
     */
    guidFormularBeilagen?: string;
    formularBeilage?: EFormularBeilageDTO;
    /**
     * Wurde die Beilage entfernt.
     */
    linkRemoved?: boolean;
}

