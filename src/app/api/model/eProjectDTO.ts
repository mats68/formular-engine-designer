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
import { LanguageCode } from './languageCode';
import { EInstallationDTO } from './eInstallationDTO';
import { EProjectPhaseDTO } from './eProjectPhaseDTO';


/**
 * This data transfer object (DTO) represents an ElektroForm Electric-Project.
 */
export interface EProjectDTO { 
    /**
     * The GUID of the tenant, in which\'s database this project is created/stored.
     */
    tenant: string;
    /**
     * The project\'s type GUID.
     */
    projectType: string;
    language: LanguageCode;
    /**
     * A custom order number, assigned by the user or an external system.
     */
    orderNumber?: string | null;
    /**
     * An optional internal keyword, that is printed on this project\'s formulars.
     */
    orderKeyword?: string | null;
    /**
     * An optional custom order category, assigned by the user or an external system.
     */
    orderCategory?: string | null;
    /**
     * An optional reference number, that can be used to identify this project in external systems.
     */
    referenceNumber?: string | null;
    /**
     * Optional remark(s) for this project.
     */
    orderRemarks?: string | null;
    /**
     * Estimated date when this project is expected to be completed (Go-Live date).
     */
    comissioningDate?: string;
    /**
     * An optional custom building number, assigned by the user or an external system.
     */
    buildingNumber?: string | null;
    /**
     * The optional offical swiss building identitifcation number (Eidgenössischer Gebäudeidentifikator /  identificateur de bâtiment fédéral).
     */
    egid?: string | null;
    /**
     * The street name of this project building\'s address.
     */
    street: string;
    /**
     * The street/house number of this project building\'s address.
     */
    houseNumber: string;
    /**
     * The postal code/ZIP code of this project building\'s address.
     */
    postalCode: string;
    /**
     * The city name of this project bulding\'s address.
     */
    city?: string | null;
    /**
     * The name of the community, in which the project\'s building is located.
     */
    community?: string | null;
    /**
     * The optional type of this project\'s building.
     */
    buildingType?: string | null;
    /**
     * The optional sub or secondary type of this project\'s building.
     */
    buildingSubType?: string | null;
    /**
     * Optional classification of the building by section/region/department.
     */
    buildingSection?: string | null;
    /**
     * The optional construction year of the project\'s building.
     */
    buildingConstructionYear?: number | null;
    /**
     * The optional geographical coordinate system (e.g.: GPS, GLONASS) used by the geographical coordinate.
     */
    geoSystem?: string | null;
    /**
     * The optional geographical longitude coordinate.
     */
    geoLongitude?: string | null;
    /**
     * The optional geographical latitude coordinate.
     */
    geoLatitude?: string | null;
    /**
     * The optional building insurance number.
     */
    buildingInsuranceNumber?: string | null;
    /**
     * The optional cadastral plan number.
     */
    cadastralPlanNumber?: string | null;
    /**
     * Optional grid square.
     */
    gridSquare?: string | null;
    /**
     * The optional plot number.
     */
    plotNumber?: string | null;
    /**
     * A collection of installations that should be created initially. At least one is required!
     */
    installations: Array<EInstallationDTO>;
    /**
     * A collection of phases within the Project.
     */
    phases?: Array<EProjectPhaseDTO> | null;
    /**
     * <br>               This field allows the import of data from external systems.                <note type=\"important\">               This must be a valid JSON Object!              </note>
     */
    externalData?: any | null;
}

