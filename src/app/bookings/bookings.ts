import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../services/auth';

type TripFilter = 'ALL' | 'ACTIVE' | 'CANCELLED';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class BookingsComponent implements OnInit {

  allBookings: any[] = [];
  filteredBookings: any[] = [];

  loading = false;
  errorMessage = '';

  activeFilter: TripFilter = 'ALL';
  expandedPnr: string | null = null;

  selectedBooking: any | null = null;
  cancelError: string | null = null;


  isCancelling = false;

  private baseUrl =
    'http://localhost:8087/booking-service/api/flight/booking/history';

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const email = this.auth.getUserEmail();
    if (!email) {
      this.errorMessage = 'User not logged in';
      return;
    }
    this.fetchBookings(email);
  }

  fetchBookings(email: string) {
    this.loading = true;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any[]>(`${this.baseUrl}/${email}`, { headers })
      .subscribe({
        next: (res) => {
          this.allBookings = res || [];
          this.applyFilter();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load booking history';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  setFilter(filter: TripFilter) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    switch (this.activeFilter) {
      case 'ACTIVE':
        this.filteredBookings = this.allBookings.filter(
          b => b.status === 'ACTIVE'
        );
        break;
      case 'CANCELLED':
        this.filteredBookings = this.allBookings.filter(
          b => b.status === 'CANCELLED'
        );
        break;
      default:
        this.filteredBookings = [...this.allBookings];
    }
  }

  toggleExpand(pnr: string) {
    this.expandedPnr = this.expandedPnr === pnr ? null : pnr;
  }

  openCancelDialog(booking: any) {
    if (this.isWithin24HoursOfDeparture(booking)) {
      this.cancelError =
        'Cancellation not allowed within 24 hours of departure';
      this.selectedBooking = null;
      return;
    }

    this.selectedBooking = booking;
    this.cancelError = null;
    this.isCancelling = false;
  }

  closeCancelDialog() {
    this.selectedBooking = null;
    this.cancelError = null;
    this.isCancelling = false; 
  }

  confirmCancelBooking() {
  if (!this.selectedBooking || this.isCancelling) return;

  this.isCancelling = true;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .delete(
      `http://localhost:8087/booking-service/api/flight/booking/cancel/${this.selectedBooking.pnr}`,
      { headers }
    )
    .subscribe({
      next: () => {
        // update UI state
        this.selectedBooking!.status = 'CANCELLED';
        this.applyFilter();
        Promise.resolve().then(() => {
          this.closeCancelDialog();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.cancelError =
          err?.error?.message || 'Cancellation not allowed';
        this.isCancelling = false;
      },
    });
}

  private isWithin24HoursOfDeparture(booking: any): boolean {
    if (!booking.departureTime) return true;

    const departureMs = Date.parse(booking.departureTime);
    const nowMs = Date.now();

    const hoursBeforeDeparture =
      (departureMs - nowMs) / (1000 * 60 * 60);

    return hoursBeforeDeparture < 24;
  }
}