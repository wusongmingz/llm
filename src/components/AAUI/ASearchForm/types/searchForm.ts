import { ButtonProps, FormProps, UploadProps } from 'element-plus';
import { Component } from 'vue';

export type ISearchConfig = Partial<FormProps>;

interface ISearchActionBase {
  label: string;
  prop: string;
  hidden?: boolean;
  option?: Partial<ButtonProps>;
}

interface ISearchActionSlot extends ISearchActionBase {
  type: 'slot';
}

interface ISearchActionButton extends ISearchActionBase {
  type: 'button';
}

interface ISearchActionUpload extends ISearchActionBase {
  type: 'upload';
  uploadOption?: Partial<UploadProps>;
}

interface ISearchActionDropdown extends ISearchActionBase {
  type: 'dropdown';
  dropList: Array<{
    prop: string;
    label: string;
    icon?: string | Component;
    disabled?: boolean;
    divided?: boolean;
  }>;
}

export type ISearchAction = ISearchActionButton | ISearchActionDropdown | ISearchActionUpload | ISearchActionSlot;

export interface ISearchForm {
  label: string;
  prop: string;
  type:
    | 'text'
    | 'select'
    | 'selectWithAll'
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
  option?: any;
  selectOption?: {
    label?: string;
    value?: string;
    options: Array<any>;
  };
  formItemClass?: string;
}
