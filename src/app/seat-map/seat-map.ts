import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-map.html',
  styleUrl: './seat-map.css'
})
export class SeatMapComponent implements OnChanges {

  @Input() flightId!: number;
  @Input() maxSelectableSeats = 1;

  @Output() seatsSelected = new EventEmitter<string[]>();

  seats: any[] = [];
  selectedSeats: string[] = [];

  readonly SEATS_PER_ROW = 6;

  private seatApi =
    'http://localhost:8087/flight-service/api/flight';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flightId'] && this.flightId) {
      this.loadSeats();
    }
    if (changes['maxSelectableSeats'] && !changes['maxSelectableSeats'].firstChange) {
      this.selectedSeats = [];
      this.seatsSelected.emit([]);
      this.cdr.markForCheck();
    }
  }

  loadSeats() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http
      .get<any[]>(`${this.seatApi}/${this.flightId}/seats`, { headers })
      .subscribe({
        next: res => {
          this.seats = res;
          this.cdr.markForCheck(); 
        },
        error: () => {
          this.seats = [];
          this.cdr.markForCheck();
        }
      });
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
    this.cdr.markForCheck();
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
  getLeftSeats(row: any[]) {
  return row.slice(0, 3); 
}

getRightSeats(row: any[]) {
  return row.slice(3, 6); 
}
}