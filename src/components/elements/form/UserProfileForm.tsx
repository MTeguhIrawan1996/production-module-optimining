import { FileButton, Grid, Group, Stack, Text } from '@mantine/core';
import { IconChevronLeft, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import PrimaryButton, {
  IPrimaryButtonProps,
} from '@/components/elements/button/PrimaryButton';
import FormController from '@/components/elements/form/FormController';
import NextImageFill from '@/components/elements/global/NextImageFill';

import { EmptyProfileImage } from '@/utils/constants/image';

import { ControllerProps } from '@/types/global';

interface IButtonAktifOrNonaktifUser
  extends Omit<IPrimaryButtonProps, 'label'> {
  buttonVariant: 'aktifUser' | 'nonaktifUser';
}

interface IUserProfileFormProps {
  methods: UseFormReturn<any>;
  submitForm: SubmitHandler<any>;
  photo: File | string | null;
  field: ControllerProps[];
  isDirtyPhoto?: () => void;
  enebleBackBottomInner?: boolean;
  isDirty?: boolean;
  buttonUpdatePassword: Omit<IPrimaryButtonProps, 'label'>;
  buttonAktifOrNonaktifUser?: IButtonAktifOrNonaktifUser;
  name?: string;
  role?: string;
  loadingSubmitButton?: boolean;
}

const UserProfileForm: React.FC<IUserProfileFormProps> = ({
  methods,
  submitForm,
  photo,
  field,
  buttonUpdatePassword,
  buttonAktifOrNonaktifUser,
  enebleBackBottomInner,
  isDirtyPhoto,
  isDirty = false,
  loadingSubmitButton,
  name,
  role,
}) => {
  const { buttonVariant, ...restButtonAktifOrNonaktifUser } =
    buttonAktifOrNonaktifUser || {};
  const { t } = useTranslation('default');
  const resetRef = React.useRef<() => void>(null);
  const router = useRouter();
  const clearFile = () => {
    isDirtyPhoto?.();
    methods.setValue('photo', null);
    resetRef.current?.();
  };

  const ImageMemo = React.useMemo(() => {
    const serverFile = typeof photo === 'string';
    const localImage =
      !serverFile && photo ? URL.createObjectURL(photo) : EmptyProfileImage;
    return (
      <NextImageFill
        figureProps={{
          h: 140,
          w: 140,
          radius: 'xs',
        }}
        priority
        loading="eager"
        src={
          serverFile
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${photo}`
            : localImage
        }
        alt="photo"
      />
    );
  }, [photo]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitForm)}>
        <Stack spacing={60} align="flex-start">
          {/* Profile Header */}
          <Group position="apart" w="100%">
            <Stack spacing={6}>
              <Group spacing="sm" align="flex-end">
                {ImageMemo}
                <Stack spacing={1}>
                  <Text span fw={700} fz={26}>
                    {name}
                  </Text>
                  <Text span fw={500} fz={20}>
                    {role}
                  </Text>
                </Stack>
              </Group>
              <Group spacing="xs">
                <FileButton
                  onChange={(value) => {
                    isDirtyPhoto?.();
                    methods.setValue('photo', value);
                  }}
                  resetRef={resetRef}
                  accept="image/png,image/jpeg,image/webp"
                >
                  {(props) => (
                    <PrimaryButton
                      label={t('commonTypography.edit')}
                      compact
                      variant="light"
                      {...props}
                    />
                  )}
                </FileButton>
                <PrimaryButton
                  label={t('commonTypography.delete')}
                  compact
                  variant="light"
                  color="red.6"
                  onClick={clearFile}
                  disabled={!photo}
                />
              </Group>
            </Stack>
            {buttonAktifOrNonaktifUser ? (
              <PrimaryButton
                label={t(`button.${buttonVariant}`, { ns: 'profile' })}
                type="button"
                {...restButtonAktifOrNonaktifUser}
              />
            ) : null}
          </Group>
          {/* Field */}
          <Stack spacing="md" w="100%" align="flex-start">
            {field.map((value, i) => {
              const { label, withAsterisk, ...rest } = value;
              return (
                <Grid key={i} w="100%">
                  <Grid.Col span={3}>
                    <Text
                      component="label"
                      fw={700}
                      fz={16}
                      sx={{ lineHeight: '1.55' }}
                    >
                      {t(`components.field.${label}`, { ns: 'allComponents' })}
                      {withAsterisk && (
                        <Text component="span" aria-hidden="true" color="red">
                          {' '}
                          *
                        </Text>
                      )}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={9}>
                    <FormController {...rest} />
                  </Grid.Col>
                </Grid>
              );
            })}
            <PrimaryButton
              leftIcon={<IconPencil size={20} />}
              label={t('button.updatePassword', { ns: 'profile' })}
              type="button"
              mt="xs"
              {...buttonUpdatePassword}
            />
          </Stack>
          <Group w="100%" position={enebleBackBottomInner ? 'apart' : 'right'}>
            {enebleBackBottomInner ? (
              <PrimaryButton
                type="button"
                variant="outline"
                leftIcon={<IconChevronLeft size="1rem" />}
                label={t('commonTypography.back')}
                mt="lg"
                onClick={() => router.back()}
              />
            ) : null}
            <PrimaryButton
              label={t('commonTypography.save')}
              type="submit"
              sx={{ alignSelf: 'flex-end' }}
              disabled={!isDirty}
              loading={loadingSubmitButton}
            />
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default UserProfileForm;
