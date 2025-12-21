import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-flight.html',
  styleUrls: ['./add-flight.css']
})
export class AddFlightComponent {

  loading = false;
  errorMessage = '';
  successMessage = '';

  flightForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {

    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      airlineLogoUrl: [''],
      flightNumber: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],

      // ✅ SEPARATE DATE & TIME
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      arrivalTime: ['', Validators.required],

      totalSeats: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(1)]],
      tripType: ['ONEWAY']
    }, {
      validators: this.arrivalAfterDeparture
    });
  }

  // ✅ FORM-LEVEL VALIDATOR
  arrivalAfterDeparture(group: FormGroup) {
    const dDate = group.get('departureDate')?.value;
    const dTime = group.get('departureTime')?.value;
    const aDate = group.get('arrivalDate')?.value;
    const aTime = group.get('arrivalTime')?.value;

    if (!dDate || !dTime || !aDate || !aTime) return null;

    const departure = new Date(`${dDate}T${dTime}`);
    const arrival = new Date(`${aDate}T${aTime}`);

    return arrival > departure
      ? null
      : { arrivalBeforeDeparture: true };
  }

  submit() {
    if (this.flightForm.invalid) {
      this.flightForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const v = this.flightForm.value;

    // ✅ BACKEND PAYLOAD (LocalDateTime)
    const payload = {
      airline: v.airline,
      airlineLogoUrl: v.airlineLogoUrl,
      flightNumber: v.flightNumber,
      origin: v.origin,
      destination: v.destination,
      departure: `${v.departureDate}T${v.departureTime}`,
      arrival: `${v.arrivalDate}T${v.arrivalTime}`,
      totalSeats: v.totalSeats,
      price: v.price,
      tripType: v.tripType
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post(
      'http://localhost:8087/flight-service/api/flight/airline/inventory/add',
      payload,
      { headers }
    ).subscribe({
      next: () => {
        this.successMessage = 'Flight added successfully';
        this.flightForm.reset({ tripType: 'ONEWAY' });
        this.loading = false;
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Failed to add flight';
        this.loading = false;
      }
    });
  }
}