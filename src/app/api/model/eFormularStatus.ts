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


export type EFormularStatus = 0 | 10 | 20 | 30 | 35 | 50 | 51 | 52 | 70 | 71 | 100 | 101 | 105 | 120;

export const EFormularStatus = {
    Undefiniert: 0 as EFormularStatus,
    Importiert: 10 as EFormularStatus,
    InBearbeitung: 20 as EFormularStatus,
    MussFelderKomplett: 30 as EFormularStatus,
    AlleFelderKomplett: 35 as EFormularStatus,
    Signiert: 50 as EFormularStatus,
    TeilSigniert: 51 as EFormularStatus,
    Gedruckt: 52 as EFormularStatus,
    Verschickt: 70 as EFormularStatus,
    ErhaltBestaetigt: 71 as EFormularStatus,
    Bewilligt: 100 as EFormularStatus,
    BewilligtMitMassnahmen: 101 as EFormularStatus,
    Erledigt: 105 as EFormularStatus,
    Abgelehnt: 120 as EFormularStatus
};
