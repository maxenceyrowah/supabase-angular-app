export interface IFormStructure {
  type: string;
  label: string;
  field_name: string;
  value: string | number | boolean;
  options?: { label: string; value: number | string | boolean }[];
  validations?: {
    required: string;
    message: string;
  }[];
}
