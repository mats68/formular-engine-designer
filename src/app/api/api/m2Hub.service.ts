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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { M2HubAGBDTO } from '../model/models';
import { M2HubBuildingDTO } from '../model/models';
import { M2HubSearchParamsDTO } from '../model/models';
import { M2HubUserAGBDTO } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import {
    M2HubServiceInterface
} from './m2Hub.serviceInterface';



@Injectable({
  providedIn: 'root'
})
export class M2HubService implements M2HubServiceInterface {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Gibt die AGB für einen Empfänger (VNB) zurück
     * @param vnb GUID des Empfängers (VNB)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1M2HubAgbVnbGet(vnb: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<M2HubAGBDTO>;
    public apiV1M2HubAgbVnbGet(vnb: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<M2HubAGBDTO>>;
    public apiV1M2HubAgbVnbGet(vnb: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<M2HubAGBDTO>>;
    public apiV1M2HubAgbVnbGet(vnb: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (vnb === null || vnb === undefined) {
            throw new Error('Required parameter vnb was null or undefined when calling apiV1M2HubAgbVnbGet.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (Brunner Informatik AG Cloud-Login) required
        credential = this.configuration.lookupCredential('Brunner Informatik AG Cloud-Login');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<M2HubAGBDTO>(`${this.configuration.basePath}/api/v1/M2Hub/agb/${encodeURIComponent(String(vnb))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Gibt Gebäude eines bestimmten VNB’s zurück.
     * @param vnb GUID des Empfängers (VNB)
     * @param strasse Strasse des Gebäudes, kann Platzhalter enthalten (*, ?)
     * @param plz PLZ des Gebäudes
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1M2HubBuildingsVnbStrassePlzGet(vnb: string, strasse: string, plz: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<Array<M2HubBuildingDTO>>;
    public apiV1M2HubBuildingsVnbStrassePlzGet(vnb: string, strasse: string, plz: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<Array<M2HubBuildingDTO>>>;
    public apiV1M2HubBuildingsVnbStrassePlzGet(vnb: string, strasse: string, plz: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<Array<M2HubBuildingDTO>>>;
    public apiV1M2HubBuildingsVnbStrassePlzGet(vnb: string, strasse: string, plz: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (vnb === null || vnb === undefined) {
            throw new Error('Required parameter vnb was null or undefined when calling apiV1M2HubBuildingsVnbStrassePlzGet.');
        }
        if (strasse === null || strasse === undefined) {
            throw new Error('Required parameter strasse was null or undefined when calling apiV1M2HubBuildingsVnbStrassePlzGet.');
        }
        if (plz === null || plz === undefined) {
            throw new Error('Required parameter plz was null or undefined when calling apiV1M2HubBuildingsVnbStrassePlzGet.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (Brunner Informatik AG Cloud-Login) required
        credential = this.configuration.lookupCredential('Brunner Informatik AG Cloud-Login');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<Array<M2HubBuildingDTO>>(`${this.configuration.basePath}/api/v1/M2Hub/buildings/${encodeURIComponent(String(vnb))}/${encodeURIComponent(String(strasse))}/${encodeURIComponent(String(plz))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Gibt die unterstützten Suchkriterien für einenb Empfänger (VNB) zurück
     * @param vnb GUID des Empfängers (VNB)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1M2HubSearchparamsVnbGet(vnb: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<M2HubSearchParamsDTO>;
    public apiV1M2HubSearchparamsVnbGet(vnb: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<M2HubSearchParamsDTO>>;
    public apiV1M2HubSearchparamsVnbGet(vnb: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<M2HubSearchParamsDTO>>;
    public apiV1M2HubSearchparamsVnbGet(vnb: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (vnb === null || vnb === undefined) {
            throw new Error('Required parameter vnb was null or undefined when calling apiV1M2HubSearchparamsVnbGet.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (Brunner Informatik AG Cloud-Login) required
        credential = this.configuration.lookupCredential('Brunner Informatik AG Cloud-Login');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<M2HubSearchParamsDTO>(`${this.configuration.basePath}/api/v1/M2Hub/searchparams/${encodeURIComponent(String(vnb))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Gibt zurück, ob die AGB für ein VNB von einem bestimmten Mitarbeiter bereits gelesen wurden.
     * @param vnb GUID des Empfängers (VNB)
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1M2HubUserAgbVnbGet(vnb: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<M2HubUserAGBDTO>;
    public apiV1M2HubUserAgbVnbGet(vnb: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<M2HubUserAGBDTO>>;
    public apiV1M2HubUserAgbVnbGet(vnb: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<M2HubUserAGBDTO>>;
    public apiV1M2HubUserAgbVnbGet(vnb: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (vnb === null || vnb === undefined) {
            throw new Error('Required parameter vnb was null or undefined when calling apiV1M2HubUserAgbVnbGet.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (Brunner Informatik AG Cloud-Login) required
        credential = this.configuration.lookupCredential('Brunner Informatik AG Cloud-Login');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.get<M2HubUserAGBDTO>(`${this.configuration.basePath}/api/v1/M2Hub/user-agb/${encodeURIComponent(String(vnb))}`,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Setzt, dass der Mitarbeiter die AGB des VNB’s gelesen hat oder setzt diesen Wert zurück.
     * @param vnb GUID des Empfängers (VNB)
     * @param wert 1 &#x3D; User hat AGB gelesen, 0 &#x3D; User hat AGB nicht gelesen
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public apiV1M2HubUserAgbVnbWertPut(vnb: string, wert: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<M2HubUserAGBDTO>;
    public apiV1M2HubUserAgbVnbWertPut(vnb: string, wert: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpResponse<M2HubUserAGBDTO>>;
    public apiV1M2HubUserAgbVnbWertPut(vnb: string, wert: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<HttpEvent<M2HubUserAGBDTO>>;
    public apiV1M2HubUserAgbVnbWertPut(vnb: string, wert: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'text/plain' | 'application/json' | 'text/json'}): Observable<any> {
        if (vnb === null || vnb === undefined) {
            throw new Error('Required parameter vnb was null or undefined when calling apiV1M2HubUserAgbVnbWertPut.');
        }
        if (wert === null || wert === undefined) {
            throw new Error('Required parameter wert was null or undefined when calling apiV1M2HubUserAgbVnbWertPut.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (Brunner Informatik AG Cloud-Login) required
        credential = this.configuration.lookupCredential('Brunner Informatik AG Cloud-Login');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'text/plain',
                'application/json',
                'text/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType = 'text';
        }

        return this.httpClient.put<M2HubUserAGBDTO>(`${this.configuration.basePath}/api/v1/M2Hub/user-agb/${encodeURIComponent(String(vnb))}/${encodeURIComponent(String(wert))}`,
            null,
            {
                responseType: <any>responseType,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}