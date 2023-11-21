export interface ICommonMenu {
  label: string;
  href?: string;
  access?: string[];
}

export interface ISubMenu extends ICommonMenu {
  subMenu?: ICommonMenu[] | undefined;
}

export interface IMenuItem extends ICommonMenu {
  subMenu?: ISubMenu[] | undefined;
  icon?: string;
}
