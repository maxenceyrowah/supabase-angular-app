export interface IStep {
  name: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  created_at: string;
  schemas: ISchema[];
  question: string;
  user_id: string;
  status: string;
  category_id: string;
}

export interface ISchema {
  type: string;
  value: any;
  options: IOption[];
  field_name: string;
  validations: any[];
}

export interface IOption {
  label: string;
  value: string;
}

const steps: IStep[] = [];
