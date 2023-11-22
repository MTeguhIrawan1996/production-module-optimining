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
      {
        label: 'material',
        href: '/master-data/material',
        access: ['all'],
      },
      {
        label: 'workingHoursPlan',
        href: '/master-data/working-hours-plan',
        access: ['all'],
      },
      {
        label: 'activityPlan',
        href: '/master-data/activity-plan',
        access: ['all'],
      },
      {
        label: 'element',
        href: '/master-data/element',
        access: ['all'],
      },
      {
        label: 'shift',
        href: '/master-data/shift',
        access: ['all'],
      },
      {
        label: 'factory',
        href: '/master-data/factory',
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
    label: 'inputData',
    icon: 'tabler:file-symlink',
    subMenu: [
      {
        label: 'qualityControlManagement',
        subMenu: [
          {
            label: 'stockpileMonitoring',
            href: '/input-data/quality-control-management/stockpile-monitoring',
            access: ['all'],
          },
          {
            label: 'sampleHouseLab',
            href: '/input-data/quality-control-management/sample-house-lab',
            access: ['all'],
          },
        ],
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
