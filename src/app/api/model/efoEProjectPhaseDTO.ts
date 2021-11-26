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
import { EfoDocumentDTO } from './efoDocumentDTO';


/**
 * This data transfer object (DTO) represents a phase of an ElektroForm Electric-Project.
 */
export interface EfoEProjectPhaseDTO { 
    /**
     * The GUID of the tenant, in which this electric project phase is stored.
     */
    tenant: string;
    /**
     * The GUID of this electric project phase.
     */
    guid?: string;
    /**
     * The sequence number in which a project\'s phases are to be shown.
     */
    index?: number;
    /**
     * The GUID that uniquely identifies the type of this phase.
     */
    type?: string;
    /**
     * The collection of documents for this project\'s phase.
     */
    documents?: Array<EfoDocumentDTO> | null;
}

