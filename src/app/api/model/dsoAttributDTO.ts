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
 * Diese Klasse repräsentiert ein Data-Transfer-Object eines Dokumentattributes für Dokumente aus der Elektro Sparte.
 */
export interface DsoAttributDTO { 
    /**
     * Die eindeutige <see cref=\"P:BrunnerInformatik.NextGen.App.ViewModel.DsoAttributDTO.Guid\">GUID</see> dieses Dokumentattributes.
     */
    guid: string;
    /**
     * Der eindeutige Bezeichner dieses Dokumentattributes.
     */
    name?: string | null;
    /**
     * Die URL des Schemas für den Wert dieses Dokumentattributes.
     */
    schemaUrl?: string | null;
}
