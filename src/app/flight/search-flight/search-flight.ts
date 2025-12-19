import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-flight.html',
  styleUrl: './search-flight.css',
})
export class FlightSearchComponent {

  searchForm: FormGroup;
  flights: any[] = [];
  loading = false;
  errorMessage = '';
  minDate!: string;

  airports = [
    { code: 'HYD', name: 'Hyderabad' },
    { code: 'DEL', name: 'Delhi' },
    { code: 'BLR', name: 'Bangalore' },
    { code: 'MUM', name: 'Mumbai' },
    { code: 'CHN', name: 'Chennai' },
    { code: 'GOI', name: 'Goa' },
    { code: 'PJB', name: 'Punjab' }
  ];

  private apiUrl = 'http://localhost:8087/flight-service/api/flight/search';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      travelDate: ['', Validators.required],
    });
    const today = new Date();
  this.minDate = today.toISOString().split('T')[0];
  }

  isDestinationDisabled(code: string): boolean {
    return this.searchForm.get('origin')?.value === code;
  }
  goToBooking(flight: any) {
    console.log('FLIGHT OBJECT:', flight);
  console.log('ID:', flight.id, 'FLIGHT_ID:', flight.flightId);
  this.router.navigate(['/book', flight.flightId]);
}

  searchFlights() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.flights = [];

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http.post<any[]>(
      this.apiUrl,
      this.searchForm.value,
      { headers }
    ).subscribe({
      next: (res) => {
        this.flights = res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch flights';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}