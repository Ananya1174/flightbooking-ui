import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../services/auth';

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

  showActiveOnly = false;
  expandedPnr: string | null = null;

  cancelPnr: string | null = null;
  cancelError: string | null = null;

  private baseUrl =
    'http://localhost:8087/booking-service/api/flight/booking/history';

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) { }

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

    this.http.get<any[]>(`${this.baseUrl}/${email}`, { headers })
      .subscribe({
        next: res => {
          // 🔥 precompute canCancel ONCE
          this.allBookings = (res || []).map(b => ({
            ...b,
            canCancel: this.isWithin24Hours(b)
          }));

          this.applyFilter();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to load booking history';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private isWithin24Hours(booking: any): boolean {
    if (booking.status !== 'ACTIVE') return false;

    const createdAt = new Date(booking.createdAt).getTime();
    const now = Date.now();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  }

  applyFilter() {
    this.filteredBookings = this.showActiveOnly
      ? this.allBookings.filter(b => b.status === 'ACTIVE')
      : [...this.allBookings];

    this.cdr.detectChanges();
  }

  onToggleChange() {
    this.applyFilter();
  }

  toggleExpand(pnr: string) {
    this.expandedPnr = this.expandedPnr === pnr ? null : pnr;
  }


  openCancelDialog(pnr: string) {
    this.cancelPnr = pnr;
    this.cancelError = null;
  }

  closeCancelDialog() {
    this.cancelPnr = null;
    this.cancelError = null;
  }

  confirmCancelBooking() {
    if (!this.cancelPnr) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.delete(
      `http://localhost:8087/booking-service/api/flight/booking/cancel/${this.cancelPnr}`,
      { headers }
    ).subscribe({
      next: () => {
        const booking = this.allBookings.find(b => b.pnr === this.cancelPnr);
        if (booking) {
          booking.status = 'CANCELLED';
          booking.canCancel = false;
        }

        this.applyFilter();
        this.closeCancelDialog();
      },
      error: (err) => {
        this.cancelError =
          err?.error?.message || 'Cancellation not allowed';
      }
    });
  }
}