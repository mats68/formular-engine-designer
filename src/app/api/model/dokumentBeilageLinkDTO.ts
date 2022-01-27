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


/**
 * Diese Klasse repräsentiert ein Datentransferobjekt für Elektro-Aufträge Dokumentenpool Entitäten.
 */
export interface DokumentBeilageLinkDTO { 
    /**
     * GUID des Mandanten.
     */
    mandant?: string;
    /**
     * GuId des Formulars.
     */
    guidDokument?: string;
    /**
     * Guid der Beilage.
     */
    guidBeilage?: string;
    /**
     * Der Key aus der Schema Beilagen-Definition
     */
    schemaKey?: number | null;
}

