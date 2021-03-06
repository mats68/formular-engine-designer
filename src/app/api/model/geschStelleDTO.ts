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


export interface GeschStelleDTO { 
    id?: number | null;
    mandant?: string | null;
    guid?: string | null;
    holdingGUID?: string;
    stichwort?: string | null;
    firma1?: string | null;
    firma2?: string | null;
    adresse?: string | null;
    adrzusatz?: string | null;
    landKennz?: string | null;
    plz?: string | null;
    ort?: string | null;
    telefonG?: string | null;
    email?: string | null;
    aktiv?: boolean;
    bemerkungen?: string | null;
    rolleEinst?: boolean;
    iNummer?: string | null;
    rolleEkontr?: boolean;
    kNummer?: string | null;
    creaDate?: string | null;
    creaUser?: string | null;
    modDate?: string | null;
    modUser?: string | null;
}

