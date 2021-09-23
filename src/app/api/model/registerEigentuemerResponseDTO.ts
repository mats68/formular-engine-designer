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
import { HoldingDTO } from './holdingDTO';
import { GeschStelleDTO } from './geschStelleDTO';
import { MitarbeiterDTO } from './mitarbeiterDTO';


export interface RegisterEigentuemerResponseDTO { 
    success?: boolean;
    holding?: HoldingDTO;
    geschaeftsStelle?: GeschStelleDTO;
    mitarbeiter?: MitarbeiterDTO;
}

