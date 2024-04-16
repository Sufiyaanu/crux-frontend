import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError, timeout } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private _httpClient: HttpClient) { }

    fetchData(dataObj: any): Observable<any> {
        let url = dataObj.api_url;
        let data = dataObj.param_data;
        switch (dataObj.method) {
            case 'post':
                return this._httpClient.post<any>(url, data).pipe(
                    timeout(1000), catchError(this.handleError)
                );
            case 'get':
                return this._httpClient.get<any>(url, data).pipe(
                    timeout(1000), catchError(this.handleError)
                );
            default:
                return this._httpClient.post<any>(url, data).pipe(
                    timeout(1000), catchError(this.handleError)
                );
        }
    }

    handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            return throwError(() => new Error('Connection Refused!'))
        } else if (error.status === 400) {
            return throwError(() => new Error('Bad Request.'));
        } else if (error.status === 401) {
            return throwError(() => new Error('Unauthorised User.'));
        } else if (error.status === 403) {
            return throwError(() => new Error('Forbidden Error'));
        } else if (error.status === 404) {
            return throwError(() => new Error('Data not available.'));
        } else if (error.message == 'Timeout has occurred') {
            return throwError(() => new Error('API connection timeout.'));
        }
        return throwError(() => new Error('Something went wrong, please try again later.'));
    }
}
