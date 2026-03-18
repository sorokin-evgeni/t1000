export interface BaseFieldProps {
  name: string
  label?: string
  fieldId?: string
  hint?: string
  required?: boolean
  readonly?: boolean
}

export interface DisableableFieldProps extends BaseFieldProps {
  disabled?: boolean
}
