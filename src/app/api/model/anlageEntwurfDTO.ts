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
 * Diese Klasse repräsentiert ein Datentransferobjekt für Elektro-Anlagen Entwürfe.
 */
export interface AnlageEntwurfDTO { 
    /**
     * Elektro-Anlagennummer.
     */
    nummer?: string | null;
    /**
     * Die Sequenznummer dieser Elektro-Anlage für Sortierungszwecke.
     */
    sequenzNummer?: number;
    /**
     * Eidgenössischer Wohnungsidentifikator.
     */
    ewid?: number | null;
    /**
     * Bezeichnung des Gebäudeteils (z.B.: \"1.OG links\").
     */
    gebaeudeTeil?: string | null;
    /**
     * Bezeichnung der Elektro-Anlage(z.B.: \"Wohnung\", \"Heizung\", \"Coiffeursalon\").
     */
    bezeichnung?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->RegistriertBei)!
     */
    registriertBei?: string | null;
    /**
     * Kontroll-Turnus in Jahren.
     */
    turnusJahre?: number | null;
    /**
     * Messpunkt gemäss internationaler Bezeichnung.
     */
    messpunkt?: string | null;
    /**
     * Enddatum der Gültigkeit dieser Elektro-Anlage.
     */
    gueltigBis?: string | null;
    /**
     * Bemerkungen zur Elektro-Anlage.
     */
    bemerkungen?: string | null;
    /**
     * Inhaber, Fremdschlüssel auf \'GeschPartner\', übersteuert Inhaber des referenzierten Gebäudes.
     */
    iD_Inhaber?: number | null;
    /**
     * Stromkunde, Fremdschlüssel auf GeschPartner (Früher: Rechnungsempfänger).
     */
    iD_Stromkunde?: number | null;
    /**
     * Bezüger, Fremdschlüssel auf GeschPartner wenn nicht der Stromkunde.
     */
    iD_Bezueger?: number | null;
    /**
     * Referenz-Nummer für externen Datenabgleich/Datenübernahme/Datenaustausch.
     */
    referenzNr?: string | null;
    /**
     * true = Inhaber erhält keinen Abschaltbrief.
     */
    keinAbschAvisInh?: boolean | null;
    /**
     * true = Stromkunde erhält keinen Abschaltbrief (Früher: KeinAbschAvisRepf).
     */
    keinAbschAvisStk?: boolean | null;
    /**
     * true = Bezüger erhält keinen Abschaltbrief.
     */
    keinAbschAvisBez?: boolean | null;
    /**
     * Nummer des ersten Zählers.
     */
    zaehlerNr1?: string | null;
    /**
     * Tarif für den ersten Zähler.
     */
    tarif1?: string | null;
    /**
     * Nummer des zweiten Zählers.
     */
    zaehlerNr2?: string | null;
    /**
     * Tarif für den zweiten Zähler.
     */
    tarif2?: string | null;
    /**
     * Nummer des dritten Zählers.
     */
    zaehlerNr3?: string | null;
    /**
     * Tarif für den dritten Zähler.
     */
    tarif3?: string | null;
    /**
     * Die Art, wie die Zähler ausgelesen werden.
     */
    ausleseArt?: string | null;
    /**
     * Der Ort, wo die Zähler ausgelesen werden.
     */
    ausleseOrt?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->SicherungBez)!
     */
    sicherungBez?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->VerteilungNr)!
     */
    verteilungNr?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->FeldNr)!
     */
    feldNr?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->SicherungNr)!
     */
    sicherungNr?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Sicherung)!
     */
    sicherung?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->SicherungsTyp)!
     */
    sicherungsTyp?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Ausloesung)!
     */
    ausloesung?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->LeiterTyp)!
     */
    leiterTyp?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->LeitQuersch)!
     */
    leitQuersch?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Erderart)!
     */
    erderart?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->ErdleiterQuersch)!
     */
    erdleiterQuersch?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Erderart2)!
     */
    erderart2?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->ErdleiterQuersch2)!
     */
    erdleiterQuersch2?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Erderart3)!
     */
    erderart3?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->ErdleiterQuersch3)!
     */
    erdleiterQuersch3?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Erderart4)!
     */
    erderart4?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->ErdleiterQuersch4)!
     */
    erdleiterQuersch4?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusg)!
     */
    potAusg?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusgQuersch)!
     */
    potAusgQuersch?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusg2)!
     */
    potAusg2?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusgQuersch2)!
     */
    potAusgQuersch2?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusg3)!
     */
    potAusg3?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->PotAusgQuersch3)!
     */
    potAusgQuersch3?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Schutzart)!
     */
    schutzart?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->FI)!
     */
    fi?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Blitzschutz)!
     */
    blitzschutz?: boolean | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->SicherungBemerk)!
     */
    sicherungBemerk?: string | null;
    /**
     * IK L-PE Anfang.
     */
    ik?: string | null;
    /**
     * IK L-N Anfang.
     */
    ikLN?: string | null;
    /**
     * IK L-PE Ende.
     */
    minIk?: string | null;
    /**
     * IK L-N Ende.
     */
    minIkLN?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->StandortMinIk)!
     */
    standortMinIk?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->RIso)!
     */
    rIso?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->ILeck)!
     */
    iLeck?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->Messgeraet)!
     */
    messgeraet?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->MessDatum)!
     */
    messDatum?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->MessName)!
     */
    messName?: string | null;
    /**
     * TODO: Feldbeschreibung hinzufügen (EAnlagen->SchutzErfuellt)!
     */
    schutzErfuellt?: boolean | null;
    /**
     * true = Der Name des Stromkunden ist im Feld StromkName,  false = Der Stromkunde ist im Feld ID_Stromkunde
     */
    stromkNurName?: boolean | null;
    /**
     * Name des Stromkunden, falls StromkNurName = true ist.
     */
    stromkName?: string | null;
}

