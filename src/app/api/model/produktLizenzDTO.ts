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


export interface ProduktLizenzDTO { 
    id?: number | null;
    mandant?: string | null;
    guid?: string | null;
    holdingGUID?: string;
    bezeichnungDe?: string | null;
    bezeichnungFr?: string | null;
    bezeichnungIt?: string | null;
    einheit?: number;
    einheitTextDe?: string | null;
    einheitTextFr?: string | null;
    einheitTextIt?: string | null;
    gekaufteAnzahl?: number;
    verfuegbareGekaufteAnzahl?: number;
    gueltigBis?: string | null;
    creaDate?: string | null;
    creaUser?: string | null;
    modDate?: string | null;
    modUser?: string | null;
}

