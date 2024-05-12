export interface IMenuItem {
  label: string;
  icon?: any;
  style?: { [key: string]: any };
  command?: (...args: any[]) => any;
}
