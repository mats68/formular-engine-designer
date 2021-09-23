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
 * Diese Klasse repräsentiert ein Data-Transfer-Object für eine Formulartypen-Entität der Elektro-Sparte.
 */
export interface EFormularTypDTO { 
    /**
     * Die eindeutige <see cref=\"T:System.Guid\">GUID</see> dieses Dokumenttyps.
     */
    guid?: string | null;
    /**
     * Die optionale <see cref=\"T:System.Guid\">GUID</see> des Basisdokumenttyps welcher durch diesen spezialisiert wird.
     */
    baseGUID?: string | null;
    /**
     * Die ID des Formularsets zu dem dieses Formular gehört.
     */
    formSetID?: number;
    /**
     * Die Formular-Kategorie zu welchem dieser Formulartyp gehört.
     */
    category?: string | null;
    /**
     * Eindeutiger Name dieses Formulartyps.   Verbindung zu DataDic und Schema
     */
    name?: string | null;
    /**
     * Der Kurzname/Anzeigename dieses Formulartyps.
     */
    shortName?: string | null;
    /**
     * Der lange bzw. vollständige Name dieses Formulartyps.
     */
    longName?: string | null;
    /**
     * Der Name des Herausgebers dieses Formulars.
     */
    issuer?: string | null;
    /**
     * Der optionale vollständige Name dieses Formulartyps wie er vom Herausgeber spezifiziert wurde.
     */
    nameByIssuer?: string | null;
    /**
     * Eine optionale Beschreibung für diesen Formulartyp.
     */
    description?: string | null;
    /**
     * Eine LCID welche die Sprache des durch diesen Formulartyp definierten Formulars angibt.
     */
    languageCode?: number;
    /**
     * Dies Version dieses Formulars.
     */
    version?: number;
}
