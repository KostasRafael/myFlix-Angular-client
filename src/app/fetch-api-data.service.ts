import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://murmuring-ridge-94608-7a62e12e52db.herokuapp.com';
@Injectable({
    providedIn: 'root'
})

export class FetchApiDataService {
    // Inject the HttpClient module to the constructor params
    // This will provide HttpClient to the entire class, making it available via this.http
    constructor(private http: HttpClient) {
    }

    private getToken(): string {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).token : '';
    }

    private handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            console.error('Some error occurred:', error.error.message);
        } else {
            console.error(
                `Error Status code ${error.status}, ` +
                `Error body is: ${error.error}`
            );
        }
        return throwError('Something bad happened; please try again later.');
    }

    /**
     * create new user
     * @param {Object} userDetails must include username, password and password. Optional: birthday
     * @returns 
     */
    public userRegistration(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + '/users', userDetails)
            .pipe(catchError(this.handleError));
    }

    /**
     * login
     * @param {Object} userDetails must include username and password
     * @returns 
     */
    public userLogin(userDetails: any): Observable<any> {
        return this.http.post(apiUrl + `/login?Username=${userDetails.Username}&Password=${userDetails.Password}`, userDetails)
            .pipe(map(this.extractResponseData), catchError(this.handleError))
    }

    /**
     * get all movies
     * @returns if token is false, status 401 & text "unauthorized", else return array of movie object
     */
    public getAllMovies(): Observable<any> {
        return this.http.get(apiUrl + '/movies', {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * get movie with specific id
     * @param {string} id 
     * @returns if token is false, status 401 & text "unauthorized". if movie exists, status 200 & movie object. if movie doesn't exist, status 400 & text "No such movie"
     */
    public getMovieWithID(id: string): Observable<any> {
        let t = JSON.parse(localStorage.getItem("user") || "").token
        return this.http.get(apiUrl + `/movieid/${id}`, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * get movie with title
     * @param {string} title Movie's title
     * @returns if token is false, status 401 & text "unauthorized". if movie exists, status 200 & movie object. if movie doesn't exist, status 400 & text "No such movie"
     */
    public getMovieWithTitle(title: string): Observable<any> {
        return this.http.get(apiUrl + `/movie/${title}`, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * get director with name
     * @param {string} directorName 
     * @returns if token is false, status 401 & text "unauthorized". if director exists, status 200 & director object. if director doesn't exist, status 400 & text "No such director"
     */
    public getDirector(directorName: string): Observable<any> {
        return this.http.get(apiUrl + `/director/${directorName}`, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * get all user
     * @returns if token is false, status 401 & text "unauthorized", else return array of user objects
     */
    public getUserList(): Observable<any> {
        return this.http.get(apiUrl + `/users`, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * get user with id
     * @param {string} id 
     * @returns if token is false, status 401 & text "unauthorized". if user exists, status 200 & user object. if user doesn't exist, status 400
     */
    public getUserByID(id: string): Observable<any> {
        return this.http.get(apiUrl + `/users/${id}`, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * add movie to user's favorite list
     * @param userID 
     * @param title movie's title
     * @returns if token is false, status 401 & text "unauthorized". if add movie success, status 200 & user object. if movie doesn't exist, status 400 & text "No such movie"
     */
    public addFavoriteMovie(userID: string, title: string): Observable<any> {
        return this.http.post(apiUrl + `/users/${userID}/movies/${title}`, {}, {headers: new HttpHeaders(
        {
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * delete a movie from user's favorite list
     * @param userID 
     * @param title 
     * @returns if token is false, status 401 & text "unauthorized". if delete movie success, status 200 & user object.
     */
    public deleteFavoriteMovie(userID: string, title: string): Observable<any> {
        return this.http.delete(apiUrl + `/users/${userID}/movies/${title}`,
        {headers: new HttpHeaders({
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * change user's details
     * @param userDetails must include all the fields of user object
     * @returns if token is false, status 401 & text "unauthorized". if update user's details success, status 200 & user object.
     */
    public editUser(userDetails: any): Observable<any> {
        return this.http.put(apiUrl + `/users/${userDetails.Username}`, userDetails,
        {headers: new HttpHeaders({
            Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }

    /**
     * delete user
     * @param userID 
     * @returns if token is false, status 401 & text "unauthorized". if delete user success, status 200 & text "${username} was deleted"
     */
    public deleteUser(userID: string): Observable<any> {
        const body = JSON.stringify({"id": userID});
        return this.http.delete(apiUrl + `/user`,
        {headers: new HttpHeaders({
            Authorization: `Bearer ${this.getToken()}`,
        }), body: body
        }).pipe(
            map(this.extractResponseData), catchError(this.handleError)
        );
    }
    
    // Non-typed response extraction
    private extractResponseData(res: any): any {
        const body = res;
        return body || { };
    }
}