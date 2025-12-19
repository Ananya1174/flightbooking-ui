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

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  private flightApi =
    'http://localhost:8087/flight-service/api/flight';

  private bookingApi =
    'http://localhost:8087/booking-service/api/flight/booking';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

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
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Booking failed';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
}