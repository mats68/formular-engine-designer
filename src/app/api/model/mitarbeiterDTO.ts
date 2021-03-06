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
import { GeschStelleDTO } from './geschStelleDTO';


export interface MitarbeiterDTO { 
    id?: number | null;
    guidMandant?: string | null;
    guid?: string | null;
    geschStellen?: Array<GeschStelleDTO> | null;
    idHolding?: number | null;
    idGeschStelle?: number | null;
    holdingGUID?: string;
    geschaeftsstelleGUID?: string | null;
    kurzzeichen?: string | null;
    anrede?: string | null;
    name?: string | null;
    vorname?: string | null;
    telefonD?: string | null;
    telefonM?: string | null;
    telefonP?: string | null;
    telefaxD?: string | null;
    eMailD?: string | null;
    sprache?: string | null;
    pronovoRestKey?: string | null;
    terravisTnId?: string | null;
    terravisUserId?: string | null;
    funktion?: string | null;
    referenzNummer?: string | null;
    estiNummer?: string | null;
    identityServerId?: string | null;
    aktiv?: boolean;
    bestaetigt?: boolean;
    creaDate?: string | null;
    creaUser?: string | null;
    modDate?: string | null;
    modUser?: string | null;
}

