import { ControllerProps } from '@/types/global';

const authField: ControllerProps[] = [
  {
    control: 'text-input',
    name: 'usernameOrEmail',
    label: 'usernameOrEmail',
    withAsterisk: true,
  },
  {
    control: 'password-input',
    name: 'password',
    label: 'password',
    withAsterisk: true,
  },
];

export default authField;
