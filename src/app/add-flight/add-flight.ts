import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-flight.html',
  styleUrls: ['./add-flight.css'],
})
export class AddFlightComponent {
  loading = false;
  errorMessage = '';
  successMessage = '';

  flightForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.flightForm = this.fb.group(
      {
        airline: ['', Validators.required],

        airlineLogoUrl: [
          '',
          Validators.pattern(/^https?:\/\/.+/),
        ],

        flightNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Z]{2}[0-9]{1,4}$/),
          ],
        ],

        tripType: ['ONEWAY', Validators.required],

        origin: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Z]{3}$/),
          ],
        ],

        destination: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Z]{3}$/),
          ],
        ],

        departureDate: ['', Validators.required],
        departureTime: ['', Validators.required],
        arrivalDate: ['', Validators.required],
        arrivalTime: ['', Validators.required],

        totalSeats: [
          null,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(500),
          ],
        ],

        price: [
          null,
          [
            Validators.required,
            Validators.min(1),
          ],
        ],
      },
      {
        validators: [
          this.arrivalAfterDeparture,
          this.originDestinationDifferent,
        ],
      }
    );
  }

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

  originDestinationDifferent(group: FormGroup) {
    const o = group.get('origin')?.value;
    const d = group.get('destination')?.value;
    if (!o || !d) return null;
    return o !== d ? null : { sameRoute: true };
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
      tripType: v.tripType,
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    this.http
      .post(
        'http://localhost:8087/flight-service/api/flight/airline/inventory/add',
        payload,
        { headers }
      )
      .subscribe({
        next: () => {
          this.successMessage = '✈️ Flight added successfully';
          this.flightForm.reset({ tripType: 'ONEWAY' });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message || 'Failed to add flight';
          this.loading = false;
        },
      });
  }
}