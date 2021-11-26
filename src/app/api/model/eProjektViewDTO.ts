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
 * Diese Klasse repräsentiert ein Data-Transfer-Object für Elektro-Aufträge Entitäten.
 */
export interface EProjektViewDTO { 
    /**
     * Primärschlüssel: GUID des Mandanten.
     */
    mandant: string;
    /**
     * AuftragsId
     */
    idEAuftrag: number;
    /**
     * Gebäude-GUID
     */
    guidEAuftrag: string;
    /**
     * GebäudesId
     */
    idGebaeude: number;
    /**
     * Gebäude-GUID
     */
    guidGebaeude: string;
    /**
     * Auftragsnummer vergeben vom Anwender.
     */
    auftragsNr: string;
    /**
     * Gebäudenummer.
     */
    nummer?: string | null;
    /**
     * Stichwort.
     */
    stichwort?: string | null;
    /**
     * Strassenname.
     */
    strasse?: string | null;
    /**
     * Hausnummer / Hausname.
     */
    hausNr?: string | null;
    /**
     * Postleitzahl.
     */
    plz?: string | null;
    /**
     * Ortsname passend zur Postleitzahl.
     */
    postOrt?: string | null;
    anzLeistungen?: number;
    fortschritte?: Array<number> | null;
    phasen?: Array<string> | null;
    phasenNamen?: Array<string> | null;
    idWerk?: number | null;
    vnb_Firma?: string | null;
    vnb_Adresse?: string | null;
    vnb_PLZ?: string | null;
    vnb_Ort?: string | null;
}

