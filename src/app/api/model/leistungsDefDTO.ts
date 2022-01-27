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
import { AktionsDefDTO } from './aktionsDefDTO';
import { MultiLangText } from './multiLangText';


/**
 * Diese Klasse repräsentiert ein Datentransferobjekt für Leistungsdefinitionen.
 */
export interface LeistungsDefDTO { 
    /**
     * Die eindeutige GUID dieser Leistungsdefinition.
     */
    guid: string;
    /**
     * Die optionale Sparte der Leistung welche durch diese Definition definiert wird.
     */
    sparte?: string | null;
    /**
     * Die Sequenz-Nummer für die Sortierreihenfolge.
     */
    sequenzNr?: number;
    /**
     * Ein Indikator der Anzeigt, ob diese Leistungsdefinition aktuell aktiviert ist oder nicht.
     */
    aktiv?: boolean;
    /**
     * Die optionale GUID der Auftragsdefinition zu welcher diese Leistungsdefinition gehört.
     */
    auftragsDef: string;
    bezeichnung?: MultiLangText;
    kuerzel?: MultiLangText;
    beschreibung?: MultiLangText;
    /**
     * Die GUID der Komponente, welche für die Darstellung dieser Leistung verantwortlich ist oder  \'00000000-0000-0000-0000-000000000000\' wenn keine explizite Komponente spezifiziert wurde.
     */
    guidKomponente?: string;
    /**
     * Die in diesem Auftrag enthaltenen Aktionen bzw. die entsprechenden Aktionsdefinitionen.
     */
    aktionsDefs?: Array<AktionsDefDTO> | null;
}

