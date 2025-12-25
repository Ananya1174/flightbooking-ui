import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.css'
})
export class SeatMapComponent implements OnInit {

  @Input() flightId!: number;
  @Input() maxSelectableSeats = 1;

  @Output() seatsSelected = new EventEmitter<string[]>();

  seats: any[] = [];
  selectedSeats: string[] = [];

  readonly SEATS_PER_ROW = 6;

  private seatApi =
    'http://localhost:8087/flight-service/api/flight';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSeats();
  }

  loadSeats() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http
      .get<any[]>(`${this.seatApi}/${this.flightId}/seats`, { headers })
      .subscribe(res => this.seats = res);
  }

  toggleSeat(seat: any) {
    if (seat.status !== 'AVAILABLE') return;

    const index = this.selectedSeats.indexOf(seat.seatNumber);

    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else {
      if (this.selectedSeats.length >= this.maxSelectableSeats) return;
      this.selectedSeats.push(seat.seatNumber);
    }

    this.seatsSelected.emit([...this.selectedSeats]);
  }

  isSelected(seatNo: string) {
    return this.selectedSeats.includes(seatNo);
  }

  getSeatRows() {
    const rows = [];
    for (let i = 0; i < this.seats.length; i += this.SEATS_PER_ROW) {
      rows.push(this.seats.slice(i, i + this.SEATS_PER_ROW));
    }
    return rows;
  }
}