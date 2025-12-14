import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private apiUrl = 'http://localhost:8087/flight-service/api/flight/search';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      travelDate: ['', Validators.required],
    });
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