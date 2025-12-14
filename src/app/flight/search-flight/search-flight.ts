import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-flight.html',
})
export class FlightSearchComponent {

  origin = '';
  destination = '';
  travelDate = '';

  flights: any[] = [];
  loading = false;
  errorMessage = '';

  // 🔹 API URL (via Gateway)
  private apiUrl = 'http://localhost:8087/flight-service/api/flight/search';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  searchFlights() {
    this.loading = true;
    this.errorMessage = '';
    this.flights = [];

    const body = {
      origin: this.origin,
      destination: this.destination,
      travelDate: this.travelDate
    };

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.post<any[]>(this.apiUrl, body, { headers })
      .subscribe({
        next: (res) => {
          this.flights = res;
          this.loading = false;

          // 🔁 Manually trigger change detection if needed
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to search flights';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}