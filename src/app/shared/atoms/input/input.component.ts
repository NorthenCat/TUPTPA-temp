import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() autocomplete = '';
  @Input() ariaLabel = '';
  @Input() min = '';
  @Input() max = '';
  @Input() step = '';
  @Input() pattern = '';
  @Input() inputClass = 'form-control';
  @Input() extraClass = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() isInvalid = false;
  @Input() isValid = false;

  @Input()
  value = '';

  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  get classes(): string {
    return [
      this.inputClass,
      this.extraClass,
      this.isInvalid ? 'is-invalid' : '',
      this.isValid ? 'is-valid' : ''
    ].filter(Boolean).join(' ');
  }

  writeValue(value: string | number | null): void {
    this.value = value === null || value === undefined ? '' : `${value}`;
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.type === 'number' ? this.getNumberValue(target.value) : this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  private getNumberValue(value: string): number | null {
    return value === '' ? null : Number(value);
  }
}
