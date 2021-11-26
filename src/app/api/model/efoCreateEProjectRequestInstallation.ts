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
 * This object represents an installtion within an `EfoCreateEProjectRequest` instance.
 */
export interface EfoCreateEProjectRequestInstallation { 
    /**
     * An optional custom installation number, assigned by the user or an external system.
     */
    number?: string | null;
    /**
     * The optional offical swiss appartment identitifcation number (Eidgenössischer Wohnungsidentifikator /  identificateur de logement fédéral).
     */
    ewid?: string | null;
    /**
     * The optional usage of this installation.
     */
    usage?: string | null;
    /**
     * The optional building part in wich this installation can be found or the circuit the electricity meter is  measuring.
     */
    buildingPart?: string | null;
    /**
     * The optional control check-up periodicity specified whole in years.
     */
    periodicityYears?: number | null;
    /**
     * The optional measurement point with it\'s internationalized name.
     */
    measurementPoint?: string | null;
    /**
     * The optional identification number of the first/primary electricity meter.
     */
    meterNumber1?: string | null;
    /**
     * Optional notice(s) for the installation.
     */
    remarks?: string | null;
}

