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
import { EfoLanguageCode } from './efoLanguageCode';


/**
 * This data transfer object (DTO) represents an address within an ElektroForm electric project.
 */
export interface EfoAddressDTO { 
    /**
     * The GUID of the tenant, in which this address is stored.
     */
    tenant: string;
    /**
     * The GUID of this address as soon as the address has been created, otherwise the `null` value.
     */
    guid?: string | null;
    correspondenceLanguage?: EfoLanguageCode;
    /**
     * An optional internal keyword for this address.
     */
    keyword?: string | null;
    /**
     * The first line of the company name.
     */
    companyNameFirstLine?: string | null;
    /**
     * The second line of the company name.
     */
    companyNameSecondLine?: string | null;
    /**
     * The title of the person addressed.
     */
    title?: string | null;
    /**
     * The academic title of the person addresed.
     */
    academicTitle?: string | null;
    /**
     * The first name of the person addressed.
     */
    firstName?: string | null;
    /**
     * The last name of the person addressed.
     */
    lastName?: string | null;
    /**
     * The name affix of the person addressed.
     */
    nameAffix?: string | null;
    /**
     * The street of the address.
     */
    street?: string | null;
    /**
     * Additional details regarding the street of this address.
     */
    streetExtras?: string | null;
    /**
     * Two letter ISO 3166-1 aApha-2 country code or `null` for `CH`.
     */
    country?: string | null;
    /**
     * The postal code.
     */
    postalCode?: string | null;
    /**
     * The city name.
     */
    city?: string | null;
    /**
     * The direct E-Mail address.
     */
    eMailAddress?: string | null;
    /**
     * The direct phone number.
     */
    directPhoneNumber?: string | null;
    /**
     * The office phone number.
     */
    officePhoneNumber?: string | null;
    /**
     * The mobile phone number.
     */
    mobilePhoneNumber?: string | null;
    /**
     * The private phone number.
     */
    privatePhoneNumber?: string | null;
    /**
     * The URL of the web site.
     */
    website?: string | null;
    /**
     * An optional reference number, that can be used to identify this address in external systems.
     */
    referenceNumber?: string | null;
}
