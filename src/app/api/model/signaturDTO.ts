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


export interface SignaturDTO { 
    /**
     * Die <see cref=\"T:System.Guid\">GUID</see> des Mandanten, in welchem sich das betroffene Formular befindet.
     */
    mandant: string;
    /**
     * Die <see cref=\"T:System.Guid\">GUID</see> des Dokuments.
     */
    dokument: string;
    /**
     * Die Mitarbeiter<see cref=\"T:System.Guid\">GUID</see> des Unterzeichenrs
     */
    mitarbeiter?: string;
    /**
     * Die Geschäftsstelle<see cref=\"T:System.Guid\">GUID</see> des Unterzeichenrs
     */
    geschStelle?: string;
    /**
     * Der Zeitpunkt des Unterschreibens
     */
    timestamp?: string;
    /**
     * Der Schlüssel der Signatur auf dem Dokument, damit immer klar ist welche Signatur zu welchem GUI-Element gehört.  Maximal 16 Zeichen.
     */
    signaturKey?: string | null;
    /**
     * Der Ort wo unterzeichent wurde
     */
    ort?: string | null;
    /**
     * Ein SHA256 Hash über die Daten zum Zeitpunkt des Unterzeichnens
     */
    dokumentHash?: string | null;
    /**
     * ???
     */
    signaturePlainText?: string | null;
    /**
     * ???
     */
    signatureCypherBase64?: string | null;
}

