import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular'
import {
  and,
  ControlProps,
  isNumberControl,
  isIntegerControl,
  isStringControl,
  or,
  rankWith,
  UISchemaElement,
  JsonSchema,
} from '@jsonforms/core'

@Component({
  selector: 'ix-placeholder-control',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './placeholder-control.html',
  styleUrl: './placeholder-control.scss',
})
export class PlaceholderControl extends JsonFormsControl {
  protected placeholder = ''
  protected inputType: 'text' | 'number' | 'textarea' = 'text'
  protected focused = false

  constructor() {
    super(inject(JsonFormsAngularService))
  }

  override mapAdditionalProps(props: ControlProps) {
    // Placeholder aus UISchema options holen
    this.placeholder = (props.uischema?.options?.['placeholder'] ||
      '') as string

    // Input-Typ bestimmen
    const format = props.uischema?.options?.['format'] as string | undefined
    const multi = props.uischema?.options?.['multi'] as boolean | undefined

    if (format === 'multi' || format === 'textarea' || multi === true) {
      this.inputType = 'textarea'
    } else if (
      props.schema.type === 'number' ||
      props.schema.type === 'integer'
    ) {
      this.inputType = 'number'
    } else {
      this.inputType = 'text'
    }
  }

  override shouldShowUnfocusedDescription(): boolean {
    return !!this.uischema?.options?.['showUnfocusedDescription']
  }

  override getEventValue = (event: Event): string | number | undefined => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const value = target.value

    if (this.inputType === 'number') {
      // Für Number/Integer: undefined bei leerem String, sonst Number
      return value === '' ? undefined : Number(value)
    }
    // Für String/Textarea: den String-Wert zurückgeben
    return value
  }
}

// Custom Tester: Prüft ob placeholder in options vorhanden ist
const hasPlaceholder = (
  uischema: UISchemaElement,
  _schema: JsonSchema,
): boolean => {
  if (!uischema.options) return false
  const placeholder = uischema.options['placeholder'] as string | undefined
  return !!placeholder && placeholder.trim() !== ''
}

// Tester: Greift bei Controls mit placeholder in options
export const placeholderControlTester = rankWith(
  10, // Sehr hohe Priorität, damit dieser Renderer bevorzugt wird
  and(or(isStringControl, isNumberControl, isIntegerControl), hasPlaceholder),
)
