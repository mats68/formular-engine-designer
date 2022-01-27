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
 * Dieses Objekt kapselt einen Namen/Bezeichner/Text, der in eine oder mehrere der folgenden Sprachen übersetzt ist:  Detusch, Frazösisch und/oder Italienisch.
 */
export interface MultiLangText { 
    /**
     * Der Text auf deutsch sofern verfügbar, ansonsten `null`.
     */
    german?: string | null;
    /**
     * Der Text auf französisch sofern verfügbar, ansonsten `null`.
     */
    french?: string | null;
    /**
     * Der Text auf italienisch sofern verfügbar, ansonsten `null`.
     */
    italian?: string | null;
}

