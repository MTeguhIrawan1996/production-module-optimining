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
        access: ['create-company'],
      },
      {
        label: 'humanResources',
        href: '/master-data/human-resources',
        access: ['create-human-resource'],
      },
      {
        label: 'heavyEquipment',
        href: '/master-data/heavy-equipment',
        access: ['create-heavy-equipment'],
      },
      {
        label: 'location',
        href: '/master-data/location',
        access: ['create-location'],
      },
      {
        label: 'block',
        href: '/master-data/block',
        access: ['create-block'],
      },
      {
        label: 'stockpile',
        href: '/master-data/stockpile',
        access: ['create-stockpile'],
      },
      {
        label: 'material',
        href: '/master-data/material',
        access: ['create-material'],
      },
      {
        label: 'workingHoursPlan',
        href: '/master-data/working-hours-plan',
        access: ['create-working-hour-plan'],
      },
      {
        label: 'activityPlan',
        href: '/master-data/activity-plan',
        access: ['create-activity-plan'],
      },
      {
        label: 'element',
        href: '/master-data/element',
        access: ['create-element'],
      },
      {
        label: 'shift',
        href: '/master-data/shift',
        access: ['create-shift'],
      },
      {
        label: 'factory',
        href: '/master-data/factory',
        access: ['create-factory'],
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
        access: ['create-company-type'],
      },
      {
        label: 'heavyEquipmentClass',
        href: '/reference/heavy-equipment-class',
        access: ['create-heavy-equipment-class'],
      },
      {
        label: 'heavyEquipment',
        href: '/reference/heavy-equipment',
        access: ['create-heavy-equipment-reference'],
      },
    ],
  },
  {
    label: 'inputData',
    icon: 'tabler:file-symlink',
    subMenu: [
      {
        label: 'production',
        subMenu: [
          {
            label: 'dataRitage',
            href: '/input-data/production/data-ritage',
            access: [
              'create-ore-ritage',
              'create-overburden-ritage',
              'create-quarry-ritage',
              'create-barging-ritage',
              'create-moving-ritage',
              'create-topsoil-ritage',
            ],
          },
          {
            label: 'dataHeavyEquipment',
            href: '/input-data/production/data-heavy-equipment',
            access: ['create-heavy-equipment-data'],
          },
          {
            label: 'dataWeather',
            href: '/input-data/production/data-weather',
            access: ['create-weather-data'],
          },
          {
            label: 'dataFront',
            href: '/input-data/production/data-front',
            access: ['create-front-data'],
          },
        ],
      },
      {
        label: 'qualityControlManagement',
        subMenu: [
          {
            label: 'sampleHouseLab',
            href: '/input-data/quality-control-management/sample-house-lab',
            access: ['create-house-sample-and-lab'],
          },
          {
            label: 'stockpileMonitoring',
            href: '/input-data/quality-control-management/stockpile-monitoring',
            access: ['create-monitoring-stockpile'],
          },
          {
            label: 'shippingMonitoring',
            href: '/input-data/quality-control-management/shipping-monitoring',
            access: ['create-monitoring-barging'],
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
        access: ['create-role'],
      },
      {
        label: 'user',
        href: '/setting/user',
        access: ['create-user'],
      },
    ],
  },
];
