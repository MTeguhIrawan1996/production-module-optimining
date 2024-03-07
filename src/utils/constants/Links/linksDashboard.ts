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
        access: ['read-company'],
      },
      {
        label: 'humanResources',
        href: '/master-data/human-resources',
        access: ['read-human-resource'],
      },
      {
        label: 'heavyEquipment',
        href: '/master-data/heavy-equipment',
        access: ['read-heavy-equipment'],
      },
      {
        label: 'location',
        href: '/master-data/location',
        access: ['read-location'],
      },
      {
        label: 'block',
        href: '/master-data/block',
        access: ['read-block'],
      },
      {
        label: 'stockpile',
        href: '/master-data/stockpile',
        access: ['read-stockpile'],
      },
      {
        label: 'material',
        href: '/master-data/material',
        access: ['read-material'],
      },
      {
        label: 'workingHoursPlan',
        href: '/master-data/working-hours-plan',
        access: ['read-working-hour-plan'],
      },
      {
        label: 'activityPlan',
        href: '/master-data/activity-plan',
        access: ['read-activity-plan'],
      },
      {
        label: 'element',
        href: '/master-data/element',
        access: ['read-element'],
      },
      {
        label: 'shift',
        href: '/master-data/shift',
        access: ['read-shift'],
      },
      {
        label: 'factory',
        href: '/master-data/factory',
        access: ['read-factory'],
      },
      {
        label: 'activityCategory',
        href: '/master-data/activity-category',
        access: [
          'read-working-hour-plan-category',
          'read-heavy-equipment-data-formula',
        ],
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
        access: ['read-company-type'],
      },
      {
        label: 'heavyEquipmentClass',
        href: '/reference/heavy-equipment-class',
        access: ['read-heavy-equipment-class'],
      },
      {
        label: 'heavyEquipment',
        href: '/reference/heavy-equipment',
        access: ['read-heavy-equipment-reference'],
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
              'read-ore-ritage',
              'read-overburden-ritage',
              'read-quarry-ritage',
              'read-barging-ritage',
              'read-moving-ritage',
              'read-topsoil-ritage',
            ],
          },
          {
            label: 'dataHeavyEquipment',
            href: '/input-data/production/data-heavy-equipment',
            access: ['read-heavy-equipment-data'],
          },
          {
            label: 'dataWeather',
            href: '/input-data/production/data-weather',
            access: ['read-weather-data'],
          },
          {
            label: 'dataFront',
            href: '/input-data/production/data-front',
            access: ['read-front-data'],
          },
          {
            label: 'map',
            href: '/input-data/production/map',
            access: ['all'],
          },
        ],
      },
      {
        label: 'qualityControlManagement',
        subMenu: [
          {
            label: 'sampleHouseLab',
            href: '/input-data/quality-control-management/sample-house-lab',
            access: ['read-house-sample-and-lab'],
          },
          {
            label: 'stockpileMonitoring',
            href: '/input-data/quality-control-management/stockpile-monitoring',
            access: ['read-monitoring-stockpile'],
          },
          {
            label: 'shippingMonitoring',
            href: '/input-data/quality-control-management/shipping-monitoring',
            access: ['read-monitoring-barging'],
          },
        ],
      },
    ],
  },
  {
    label: 'plan',
    icon: 'tabler:calendar-event',
    subMenu: [
      {
        label: 'weekly',
        href: '/plan/weekly',
        access: ['read-weekly-plan'],
      },
      {
        label: 'monthly',
        href: '/plan/monthly',
        access: ['read-monthly-plan'],
      },
    ],
  },
];
