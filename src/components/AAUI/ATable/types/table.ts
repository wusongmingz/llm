import { ButtonProps, TableColumnCtx, TableProps } from 'element-plus';

export interface ITableAction {
  label: string;
  prop: string;
  type?: '' | 'default' | 'text' | 'success' | 'warning' | 'info' | 'primary' | 'danger';
  icon?: string;
  hidden?: boolean;
  option?: Partial<ButtonProps> & { customDisabled?: (row: any) => any };
}

export interface ITableHead extends IColumuConfig {
  label: string;
  prop: string;
  hideColumu?: boolean;
  childHead?: ITableHead[];
}

export interface ITableConfig extends Partial<TableProps<any>> {
  showIndex?: boolean;
  showSelection?: boolean;
  showFilter?: boolean;
}

export type IColumuConfig = Partial<TableColumnCtx<any>>;
