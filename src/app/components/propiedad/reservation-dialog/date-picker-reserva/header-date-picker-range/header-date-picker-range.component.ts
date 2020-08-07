// Customización del header que se mostrará en el datepicker range
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';

import { MatCalendar } from '@angular/material/datepicker';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//Servicios
//Importo el servicio que controlará el limpiado del calendario
import { LimpiarFechasService } from '../../../../../services/limpiar-fechas.service';

/** Custom header component for datepicker. */
@Component({
  selector: 'example-header',
  templateUrl: './header-date-picker-range.component.html',
  styleUrls: ['./header-date-picker-range.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDateRangePicker<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _limpiarFechaService: LimpiarFechasService,
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }

  limpiarFechas() {
    console.log('Limpiando fechas');
    this._limpiarFechaService.LimpiezaFecha$.emit('limpiarfecha');
  }
}
