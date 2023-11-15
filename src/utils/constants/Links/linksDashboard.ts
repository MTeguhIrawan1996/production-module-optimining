import { IMenuItem } from '@/types/layout';

export const linksDashboard: IMenuItem[] = [
  {
    label: 'dashboard',
    href: '/dashboard',
    icon: 'tabler:home-2',
    access: ['all'],
  },
  {
    label: 'masterData',
    icon: 'mdi:database',
    subMenu: [
      {
        label: 'company',
        href: '/master-data/company',
        access: ['all'],
      },
      {
        label: 'humanResources',
        href: '/master-data/human-resources',
        access: ['all'],
      },
      {
        label: 'heavyEquipment',
        href: '/master-data/heavy-equipment',
        access: ['all'],
      },
      {
        label: 'location',
        href: '/master-data/location',
        access: ['all'],
      },
    ],
  },
  {
    label: 'reference',
    icon: 'tabler:file-text',
    subMenu: [
      {
        label: 'companyType',
        href: '/reference/company-type',
        access: ['all'],
      },
      {
        label: 'heavyEquipmentClass',
        href: '/reference/heavy-equipment-class',
        access: ['all'],
      },
      {
        label: 'heavyEquipment',
        href: '/reference/heavy-equipment',
        access: ['all'],
      },
    ],
  },
  {
    label: 'setting',
    icon: 'bi:gear-fill',
    subMenu: [
      {
        label: 'managementRole',
        href: '/setting/management-role',
        access: ['all'],
      },
      {
        label: 'user',
        href: '/setting/user',
        access: ['all'],
      },
    ],
  },
  // {
  //   label: 'Example',
  //   icon: 'tabler:briefcase',
  //   subMenu: [
  //     {
  //       label: 'Sub Example',
  //       subMenu: [
  //         {
  //           label: 'Sub Sub Example',
  //           href: '/example/sub-example/coba',
  //           access: ['all'],
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Data Table',
  //       href: '/example/data-table',
  //       access: ['all'],
  //     },
  //     {
  //       label: 'Form Example',
  //       href: '/example/form-example',
  //       access: ['all'],
  //     },
  //     {
  //       label: 'Components',
  //       href: '/example/c-example',
  //       access: ['all'],
  //     },
  //   ],
  // },
];
