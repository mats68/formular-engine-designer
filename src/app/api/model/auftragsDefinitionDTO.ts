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
import { LeistungsDefinitionDTO } from './leistungsDefinitionDTO';
import { MultiLangText } from './multiLangText';


export interface AuftragsDefinitionDTO { 
    guid?: string;
    sparte?: string | null;
    sequenzNr?: number;
    bezeichnung?: MultiLangText;
    aktiv?: boolean;
    leistungen?: Array<LeistungsDefinitionDTO> | null;
}
