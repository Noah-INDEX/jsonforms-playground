import { Component, inject } from '@angular/core'
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular'
import {
  Actions,
  and,
  ControlProps,
  isEnumControl,
  optionIs,
  rankWith,
} from '@jsonforms/core'
import { MatRadioModule, MatRadioChange } from '@angular/material/radio'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ix-enum-radio-control',
  imports: [MatRadioModule, CommonModule],
  templateUrl: './enum-radio-control.html',
  styleUrl: './enum-radio-control.scss',
  standalone: true,
})
export class EnumRadioControl extends JsonFormsControl {
  options: { value: string; label: string }[] = []
  private controlPath = ''

  constructor() {
    super(inject(JsonFormsAngularService))
  }

  override mapAdditionalProps(props: ControlProps) {
    this.controlPath = props.path
    const schema = props.schema
    if (schema.enum) {
      this.options = schema.enum.map((value: string) => ({
        value,
        label: this.translateEnumValue(props.path, value),
      }))
    }
  }

  private translateEnumValue(path: string, value: string): string {
    const fieldName = path.split('.').pop() || path
    const enumKey = `${fieldName}.enum.${value}`
    const translation = this.jsonFormsService
      .getState()
      .jsonforms.i18n?.translate?.(enumKey)
    return translation && translation !== enumKey ? translation : value
  }

  override onChange(event: MatRadioChange) {
    if (this.controlPath) {
      this.jsonFormsService.updateCore(
        Actions.update(this.controlPath, () => event.value),
      )
    }
  }
}

export const enumRadioControlTester = rankWith(
  10,
  and(isEnumControl, optionIs('format', 'radio')),
)
