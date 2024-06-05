import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { sendGAEvent } from '@next/third-parties/google';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import { IMutationLocationValues } from '@/services/graphql/mutation/location/useCreateLocationMaster';
import { useUpdateLocationMaster } from '@/services/graphql/mutation/location/useUpdateLocationMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import { useReadOneLocationMaster } from '@/services/graphql/query/location/useReadOneLocationMaster';
import {
  globalText,
  locationCategorySelect,
} from '@/utils/constants/Field/global-field';
import { locationMutationValidation } from '@/utils/form-validation/location/location-mutation-validation';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';

import { ControllerGroup } from '@/types/global';

const UpdateLocationMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const id = router.query.id as string;
  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });
  const methods = useForm<IMutationLocationValues>({
    resolver: zodResolver(locationMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
      categoryId: '',
    },
    mode: 'onBlur',
  });

  const { locationMaster, locationMasterLoading } = useReadOneLocationMaster({
    variables: {
      id,
    },
    skip: !router.isReady,
    onCompleted: ({ location }) => {
      methods.setValue('name', location.name);
      methods.setValue('handBookId', location.handBookId);
      methods.setValue('categoryId', location.category?.id ?? '');
    },
  });

  const [executeUpdate, { loading }] = useUpdateLocationMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Edit',
        params: {
          category: 'Pra Rencana',
          subSubCategory: '',
          subCategory: 'Pra Rencana - Lokasi',
          account: userAuthData?.email ?? '',
        },
      });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('location.successUpdateMessage'),
        icon: <IconCheck />,
      });
      router.push('/master-data/location');
    },
    onError: (error) => {
      if (error.graphQLErrors) {
        const errorArry = errorBadRequestField<IMutationLocationValues>(error);
        if (errorArry.length) {
          errorArry.forEach(({ name, type, message }) => {
            methods.setError(name, { type, message });
          });
          return;
        }
        notifications.show({
          color: 'red',
          title: 'Gagal',
          message: error.message,
          icon: <IconX />,
        });
      }
    },
  });

  const fieldItem = React.useMemo(() => {
    const locationId = globalText({
      name: 'handBookId',
      label: 'locationId',
      colSpan: 6,
    });
    const locationName = globalText({
      name: 'name',
      label: 'locationName',
      colSpan: 6,
    });
    const locationCategoryItem = locationCategorySelect({
      clearable: true,
      defaultValue: locationMaster?.category?.id,
      labelValue: locationMaster?.category?.name,
      excludeIds: [
        `${process.env.NEXT_PUBLIC_OTHER_LOCATION_ID}`,
        `${process.env.NEXT_PUBLIC_DOME_ID}`,
        `${process.env.NEXT_PUBLIC_BLOCK_ID}`,
        `${process.env.NEXT_PUBLIC_STOCKPILE_ID}`,
        `${process.env.NEXT_PUBLIC_PIT_ID}`,
      ],
    });

    const field: ControllerGroup[] = [
      {
        group: t('commonTypography.location'),
        enableGroupLabel: true,
        formControllers: [locationId, locationCategoryItem, locationName],
      },
    ];

    return field;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationMaster]);

  const handleSubmitForm: SubmitHandler<IMutationLocationValues> = async (
    data
  ) => {
    const { name, categoryId, handBookId } = data;
    await executeUpdate({
      variables: {
        id,
        name,
        categoryId,
        handBookId,
      },
    });
  };
  return (
    <DashboardCard p={0} isLoading={locationMasterLoading}>
      <GlobalFormGroup
        field={fieldItem}
        methods={methods}
        submitForm={handleSubmitForm}
        submitButton={{
          label: t('commonTypography.save'),
          loading: loading,
        }}
        backButton={{
          onClick: () => router.push('/master-data/location'),
        }}
      />
    </DashboardCard>
  );
};

export default UpdateLocationMasterBook;
