import { ControllerGroup } from '@/types/global';

const exampleField: ControllerGroup[] = [
  {
    group: 'Domisili',
    enableGroupLabel: true,
    formControllers: [
      {
        control: 'text-input',
        name: 'exampleTextInput',
        label: 'Example Text Input',
        withAsterisk: true,
        colSpan: 6,
      },
      {
        control: 'number-input',
        name: 'exampleNumberInput',
        label: 'Example Number Input',
        withAsterisk: true,
        colSpan: 6,
      },
      {
        control: 'date-input',
        name: 'exampleDateInput',
        label: 'Date Example',
        withAsterisk: true,
        colSpan: 6,
      },
      {
        control: 'select-input',
        name: 'exampleSelectInput',
        label: 'Example Select Input',
        withAsterisk: true,
        colSpan: 6,
        data: [
          {
            label: 'example1',
            value: 'example1',
          },
          {
            label: 'example2',
            value: 'example2',
          },
        ],
      },
      {
        control: 'radio-input',
        name: 'exampleRadioInput',
        label: 'Radio Example',
        withAsterisk: true,
        radioComponent: [
          {
            label: 'Laki-laki',
            value: 'laki-laki',
          },
          {
            label: 'Perempuan',
            value: 'perempuan',
          },
        ],
      },
    ],
    groupCheckbox: {
      // eslint-disable-next-line no-console
      onChange: () => console.log('groupCheckBox'),
      label: 'Alamat Domisili sesuai dengan Kartu Identitas (KTP/KTA/Paspor)',
    },
    actionGroup: {
      addButton: {
        label: 'Tambah Domisili',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Tambah Domisili'),
      },
      deleteButton: {
        label: 'Hapus',
        // eslint-disable-next-line no-console
        onClick: () => console.log('Hapus Domisili'),
      },
    },
  },
  {
    group: 'GroupB',
    formControllers: [
      {
        control: 'select-input',
        name: 'exampleSelectInput',
        label: 'Example Select Input',
        withAsterisk: true,
        colSpan: 6,
        data: [
          {
            label: 'example1',
            value: 'example1',
          },
          {
            label: 'example2',
            value: 'example2',
          },
        ],
      },
    ],
    enableGroupLabel: true,
  },
];

export default exampleField;
