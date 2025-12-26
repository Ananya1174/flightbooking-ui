import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SeatMapComponent } from '../seat-map/seat-map';
import { Router } from '@angular/router';
@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SeatMapComponent],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book implements OnInit {

  flightId!: number;
  flight: any;

  bookingForm!: FormGroup;
  loading = false;
  errorMessage = '';
  bookingResponse: any = null;
  selectedSeats: string[] = [];

  private flightApi =
    'http://localhost:8087/flight-service/api/flight';

  private bookingApi =
    'http://localhost:8087/booking-service/api/flight/booking';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.initForm();
    this.loadFlight();
  }

  initForm() {
    this.bookingForm = this.fb.group({
      numSeats: [1, [Validators.required, Validators.min(1)]],
      passengers: this.fb.array([])
    });

    this.updatePassengers(1);
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  updatePassengers(count: number) {
    this.passengers.clear();

    for (let i = 0; i < count; i++) {
      this.passengers.push(
        this.fb.group({
          name: ['', Validators.required],
          age: ['', Validators.required],
          gender: ['', Validators.required],
          seatNumber: ['', Validators.required],
          mealPreference: ['', Validators.required],
        })
      );
    }
  }

  onSeatCountChange() {
    const count = this.bookingForm.get('numSeats')?.value;
    this.updatePassengers(count);
  }

  onSeatsSelected(seats: string[]) {
    this.selectedSeats = seats;

    // clear all seat numbers first
    this.passengers.controls.forEach(ctrl => {
      ctrl.patchValue({ seatNumber: '' }, { emitEvent: false });
    });

    // assign seats in order
    seats.forEach((seat, index) => {
      if (this.passengers.at(index)) {
        this.passengers.at(index).patchValue({ seatNumber: seat });
      }
    });

    this.cdr.detectChanges();
  }

  loadFlight() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http
      .get(`${this.flightApi}/${this.flightId}`, { headers })
      .subscribe({
        next: (res) => {
          this.flight = res;
          this.cdr.detectChanges();
        }
      });
  }

  confirmBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const payload = this.bookingForm.value;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });

    this.loading = true;

    this.http
      .post(`${this.bookingApi}/${this.flightId}`, payload, { headers })
      .subscribe({
        next: (res) => {
          this.bookingResponse = res;
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/bookings']);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Booking failed';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
  isConfirmDisabled(): boolean {
  const passengerCount = this.passengers.length;
  const selectedSeatCount = this.selectedSeats.length;

  return (
    this.loading ||
    this.bookingForm.invalid ||
    passengerCount === 0 ||
    selectedSeatCount !== passengerCount
  );
}
}