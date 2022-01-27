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
import { EmpfaengerKatDTO } from './empfaengerKatDTO';
import { MultiLangText } from './multiLangText';


/**
 * Diese Klasse repräsentiert ein Datentransferobjekt für Dokumentkategorien.
 */
export interface DokumentKatDTO { 
    /**
     * Die eindeutige GUID dieser Dokumentkategorie.
     */
    guid: string;
    /**
     * Die Sparte dieser Dokumentkategorie.
     */
    sparte?: string;
    empfaengerKat?: EmpfaengerKatDTO;
    kuerzel?: MultiLangText;
    bezeichnung?: MultiLangText;
    /**
     * Der Legacy-Typ dieser Dokumentkategorie, sofern vorhanden.
     */
    legacyTyp?: string | null;
    /**
     * Ein Indikator der anzeigt, ob diese Dokumentkategorie eine Beilage repräsentiert oder nicht.
     */
    istBeilage?: boolean;
    /**
     * Eine Sequenz-Nummer, welche die Sortierreihenfolge innerhalb gleicher Empfängerkategorien regelt.
     */
    sequenzNummer?: number;
}

