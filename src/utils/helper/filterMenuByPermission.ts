import { IMenuItem } from '@/types/layout';

export const filterMenuByPermission = (
  menuItems: IMenuItem[],
  userPermission: string[] | undefined
) => {
  return menuItems.reduce<IMenuItem[]>((result, menuItem) => {
    const { subMenu, ...menuWithoutSubMenu } = menuItem;
    if (
      !menuItem.access ||
      menuItem?.access?.some((access) => {
        const permissionWithAll = [...(userPermission ?? []), 'all'];
        return permissionWithAll.some((permission) => access === permission);
      })
    ) {
      const filteredSubMenu =
        subMenu && subMenu.length > 0
          ? filterMenuByPermission(subMenu, userPermission)
          : undefined;

      if (!subMenu || (filteredSubMenu && filteredSubMenu.length > 0)) {
        result.push({
          ...menuWithoutSubMenu,
          ...(filteredSubMenu && { subMenu: filteredSubMenu }),
        });
      }
    }

    return result;
  }, []);
};
