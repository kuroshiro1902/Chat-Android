export interface IMenuItem {
  label: string;
  style?: { [key: string]: any };
  command?: (...args: any[]) => any;
}
