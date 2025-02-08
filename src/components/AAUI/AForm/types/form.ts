export interface IForm {
  label: string;
  prop: string;
  type:
    | 'text'
    | 'select'
    | 'switch'
    | 'input'
    | 'number'
    | 'cascader'
    | 'treeSelect'
    | 'datePicker'
    | 'timePicker'
    | 'timeSelect'
    | 'radioGroup'
    | 'rate'
    | 'slider'
    | 'upload'
    | 'slot';
  column?: number;
  option?: any;
  selectOption?: {
    label?: string;
    value?: string;
    options: Array<any>;
  };
}
