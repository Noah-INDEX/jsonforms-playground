import { CommonModule } from '@angular/common'
import { Component, inject, ViewEncapsulation } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  MatDatepickerModule,
  MatDatepicker,
} from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { DateAdapter, MatNativeDateModule } from '@angular/material/core'
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular'
import {
  isDateControl,
  JsonFormsState,
  rankWith,
  StatePropsOfControl,
} from '@jsonforms/core'

@Component({
  selector: 'ix-date-control',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './date-control.html',
  styleUrl: './date-control.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class DateControl extends JsonFormsControl {
  private readonly dateAdapter = inject(DateAdapter<Date>)

  focused = false
  views: string[] = []
  startView: 'month' | 'year' | 'multi-year' = 'month'
  panelClass = ''

  constructor() {
    super(inject(JsonFormsAngularService))
    this.initializeLocale()
  }

  private initializeLocale(): void {
    const locale = navigator.language || 'en-US'
    this.dateAdapter.setLocale(locale)
  }

  override getEventValue = (event: { value?: Date } | Date): string => {
    const value = (event as { value?: Date }).value || event
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10)
    }
    return ''
  }

  protected override mapToProps(state: JsonFormsState): StatePropsOfControl {
    const props = super.mapToProps(state)

    const optionViews = this.uischema?.options?.['views']
    this.views = Array.isArray(optionViews)
      ? (optionViews as string[])
      : ['year', 'month', 'day']
    this.setViewProperties()

    let date: Date | null = null
    if (props.data) {
      if (typeof props.data === 'string') {
        const parsed = new Date(props.data)
        date = Number.isNaN(parsed.getTime()) ? null : parsed
      } else if (props.data instanceof Date) {
        date = props.data
      }
    }

    return { ...props, data: date }
  }

  yearSelected(event: Date, datepicker: MatDatepicker<Date>) {
    if (!this.views.includes('day') && !this.views.includes('month')) {
      this.onChange(event)
      datepicker.close()
    }
  }

  monthSelected(event: Date, datepicker: MatDatepicker<Date>) {
    if (!this.views.includes('day')) {
      this.onChange(event)
      datepicker.close()
    }
  }

  setViewProperties() {
    if (!this.views.includes('day')) {
      this.startView = 'multi-year'
      this.panelClass = 'no-panel-navigation'
    } else {
      this.startView = 'month'
      this.panelClass = ''
    }
  }
}

export const dateControlTester = rankWith(10, isDateControl)
