import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Flight {
  private baseUrl = 'http://localhost:8087';

  constructor(private http: HttpClient) { }

  searchFlights(data: any) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any[]>(
      `${this.baseUrl}/flight-service/api/flight/search`,
      data,
      { headers }
    );
  }
}
