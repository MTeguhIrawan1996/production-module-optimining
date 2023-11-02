import { IMenuItem } from '@/types/layout';

// export const filterMenuByAccess = (
//   menuItems: IMenuItems,
//   userRole: string
// ): IMenuItem[] => {
//   const result = menuItems
//     .filter(
//       (menuItem) =>
//         !menuItem.access ||
//         menuItem.access.includes(userRole) ||
//         menuItem.access.includes('all')
//     )
//     .map((menuItem) => {
//       // Destructuring assignment: Mengambil properti 'subMenu' dari 'menuItem' dan menyimpannya dalam variabel 'links', serta menyimpan sisa properti dalam variabel 'menuWithoutLinks'
//       const { links, ...menuWithoutLinks } = menuItem;

//       // Mengecek apakah 'links' ada atau tidak (undefined)
//       return links
//         ? // Jika 'links' ada (berarti 'menuItem' memiliki submenu)
//           {
//             ...menuWithoutLinks,
//             links: filterMenuByAccess(links, userRole),
//           }
//         : // Jika 'links' tidak ada (berarti 'menuItem' tidak memiliki submenu)
//           menuWithoutLinks;
//     });

//   return result;
// };

export const filterMenuByRole = (
  menuItems: IMenuItem[],
  userRole: string
): IMenuItem[] => {
  return menuItems.reduce<IMenuItem[]>((result, menuItem) => {
    const { subMenu, ...menuWithoutSubMenu } = menuItem;
    if (
      !menuItem.access ||
      menuItem.access.includes(userRole) ||
      menuItem.access.includes('all')
    ) {
      const filteredSubMenu =
        subMenu && subMenu.length > 0
          ? filterMenuByRole(subMenu, userRole)
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
