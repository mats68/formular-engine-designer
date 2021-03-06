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
 * Diese Aufzählung definiert die unterschiedlichen verfügbaren Transferkanälen für Empfänger.
 */
export type EmpfaengerTransferKanal = 0 | 1 | 2 | 1024 | 1025;

export const EmpfaengerTransferKanal = {
    Undefiniert: 0 as EmpfaengerTransferKanal,
    Papier: 1 as EmpfaengerTransferKanal,
    EMail: 2 as EmpfaengerTransferKanal,
    M20: 1024 as EmpfaengerTransferKanal,
    Pronovo: 1025 as EmpfaengerTransferKanal
};

