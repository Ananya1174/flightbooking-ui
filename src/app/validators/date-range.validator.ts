import { AbstractControl, ValidationErrors } from '@angular/forms';

export function arrivalAfterDepartureValidator(
  control: AbstractControl
): ValidationErrors | null {

  const departure = control.get('departure')?.value;
  const arrival = control.get('arrival')?.value;

  if (!departure || !arrival) return null;

  return new Date(arrival) > new Date(departure)
    ? null
    : { arrivalBeforeDeparture: true };
}