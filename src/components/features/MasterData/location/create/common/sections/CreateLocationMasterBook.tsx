import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import { DashboardCard, GlobalFormGroup } from '@/components/elements';

import {
  IMutationLocationValues,
  useCreateLocationMaster,
} from '@/services/graphql/mutation/location/useCreateLocationMaster';
import { useReadAuthUser } from '@/services/graphql/query/auth/useReadAuthUser';
import {
  globalText,
  locationCategorySelect,
} from '@/utils/constants/Field/global-field';
import { locationMutationValidation } from '@/utils/form-validation/location/location-mutation-validation';
import { sendGAEvent } from '@/utils/helper/analytics';
import { errorBadRequestField } from '@/utils/helper/errorBadRequestField';
import useControlPanel from '@/utils/store/useControlPanel';

import { ControllerGroup } from '@/types/global';

const CreateLocationMasterBook = () => {
  const { t } = useTranslation('default');
  const router = useRouter();
  const [resetLocationState] = useControlPanel(
    (state) => [state.resetLocationState],
    shallow
  );

  const { userAuthData } = useReadAuthUser({
    fetchPolicy: 'cache-first',
  });

  /* #   /**=========== Methods =========== */
  const methods = useForm<IMutationLocationValues>({
    resolver: zodResolver(locationMutationValidation),
    defaultValues: {
      name: '',
      handBookId: '',
      categoryId: '',
    },
    mode: 'onBlur',
  });

  /* #endregion  /**======== Methods =========== */

  /* #   /**=========== Query =========== */
  const [executeCreate, { loading }] = useCreateLocationMaster({
    onCompleted: () => {
      sendGAEvent({
        event: 'Tambah',
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
        message: t('location.successCreateMessage'),
        icon: <IconCheck />,
      });
      resetLocationState();
      methods.reset();
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
  /* #endregion  /**======== Query =========== */

  /* #   /**=========== Field =========== */
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
  }, []);
  /* #endregion  /**======== Field =========== */

  /* #   /**=========== HandleSubmitFc =========== */
  const handleSubmitForm: SubmitHandler<IMutationLocationValues> = async (
    data
  ) => {
    const { name, handBookId, categoryId } = data;
    await executeCreate({
      variables: {
        name,
        categoryId,
        handBookId,
      },
    });
  };
  /* #endregion  /**======== HandleSubmitFc =========== */

  return (
    <DashboardCard p={0}>
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

export default CreateLocationMasterBook;
