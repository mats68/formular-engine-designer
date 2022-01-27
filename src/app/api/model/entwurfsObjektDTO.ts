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
import { ProjektEntwurfDTO } from './projektEntwurfDTO';
import { AnlageEntwurfDTO } from './anlageEntwurfDTO';
import { GeraetEntwurfDTO } from './geraetEntwurfDTO';


/**
 * Diese Klasse repräsentiert eine Basisklasse eines Entwurfs.
 */
export interface EntwurfsObjektDTO { 
    projektEntwurf?: ProjektEntwurfDTO;
    anlageEntwurf?: AnlageEntwurfDTO;
    geraetEntwurf?: GeraetEntwurfDTO;
}

