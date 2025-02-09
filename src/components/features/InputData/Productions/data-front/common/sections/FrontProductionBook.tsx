import { Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { queryTypes, useQueryStates } from 'next-usequerystate';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

import {
  DashboardCard,
  GlobalAlert,
  GlobalBadgeStatus,
  GlobalKebabButton,
  MantineDataTable,
  ModalConfirmation,
  SelectionButtonModal,
} from '@/components/elements';
import { IFilterButtonProps } from '@/components/elements/button/FilterButton';
import DownloadButtonFront from '@/components/features/InputData/Productions/data-front/common/elements/DownloadButtonFront';

import { useDeleteFrontProduction } from '@/services/graphql/mutation/front-production/useDeleteFrontProduction';
import { useReadAllFrontProduction } from '@/services/graphql/query/front-production/useReadAllFrontProduction';
import {
  globalDateNative,
  globalSelectLocationNative,
  globalSelectMaterialNative,
  globalSelectMonthNative,
  globalSelectPeriodNative,
  globalSelectShiftNative,
  globalSelectWeekNative,
  globalSelectYearNative,
} from '@/utils/constants/Field/native-field';
import { formatDate } from '@/utils/helper/dateFormat';
import dayjs from '@/utils/helper/dayjs.config';
import { newNormalizedFilterBadge } from '@/utils/helper/normalizedFilterBadge';
import useControlPanel, {
  ISliceName,
  resetAllSlices,
} from '@/utils/store/useControlPanel';
import { useFilterDataCommon } from '@/utils/store/useFilterDataCommon';
import { usePermissions } from '@/utils/store/usePermissions';
import useStore from '@/utils/store/useStore';

import { ISegmentConditional, SegmentType } from '@/types/frontProductionType';

const FrontProductionBook = () => {
  const router = useRouter();
  const [params, setParams] = useQueryStates({
    segment: queryTypes.string.withDefault('pit'),
  });
  const newParams: { segment: SegmentType } = {
    segment: params.segment as SegmentType,
  };

  const { t } = useTranslation('default');
  const [id, setId] = React.useState<string>('');
  const [filterDataCommon] = useFilterDataCommon(
    (state) => [state.filterDataCommon],
    shallow
  );
  const [
    hasHydrated,
    {
      page: pagePit,
      search: searchPit,
      filterBadgeValue,
      startDate,
      endDate,
      period,
      pitId,
      shiftId,
      materialId,
      year,
      month,
      week,
      quarter,
    },
    {
      page: pageDome,
      search: searchDome,
      filterBadgeValue: filterBadgeValueDome,
      startDate: startDateDome,
      endDate: endDateDome,
      period: periodDome,
      domeId,
      shiftId: shiftIdDome,
      year: yearDome,
      month: monthDome,
      week: weekDome,
      quarter: quarterDome,
    },
    setFrontState,
  ] = useControlPanel(
    (state) => [
      state._hasHydrated,
      state.frontPitState,
      state.frontDomeState,
      state.setFrontState,
    ],
    shallow
  );

  const [domeSearchQuery] = useDebouncedValue<string>(searchDome || '', 500);
  const [pitSearchQuery] = useDebouncedValue<string>(searchPit || '', 500);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    React.useState<boolean>(false);
  const [isOpenSelectionModal, setIsOpenSelectionModal] =
    React.useState<boolean>(false);

  const permissions = useStore(usePermissions, (state) => state.permissions);

  const isPermissionCreate = permissions?.includes('create-front-data');
  const isPermissionUpdate = permissions?.includes('update-front-data');
  const isPermissionDelete = permissions?.includes('delete-front-data');
  const isPermissionRead = permissions?.includes('read-front-data');

  const segmentConditionalFilter = React.useMemo(() => {
    const value: ISegmentConditional = {
      pit: {
        filterBadgeValue: {
          value: filterBadgeValue,
          set: (value) => {
            setFrontState({
              frontPitState: {
                filterBadgeValue: value,
              },
            });
          },
        },
        page: {
          value: pagePit,
          set: (value) => {
            setFrontState({
              frontPitState: {
                page: value,
              },
            });
          },
        },
        period: {
          value: period,
          set: (value) => {
            setFrontState({
              frontPitState: {
                period: value,
              },
            });
          },
        },
        year: {
          value: year,
          set: (value) => {
            setFrontState({
              frontPitState: {
                year: value,
              },
            });
          },
        },
        month: {
          value: month,
          set: (value) => {
            setFrontState({
              frontPitState: {
                month: value,
              },
            });
          },
        },
        week: {
          value: week,
          set: (value) => {
            setFrontState({
              frontPitState: {
                week: value,
              },
            });
          },
        },
        quarter: {
          value: quarter,
          set: (value) => {
            setFrontState({
              frontPitState: {
                quarter: value,
              },
            });
          },
        },
        startDate: {
          value: startDate,
          set: (value) => {
            setFrontState({
              frontPitState: {
                startDate: value,
              },
            });
          },
        },
        endDate: {
          value: endDate,
          set: (value) => {
            setFrontState({
              frontPitState: {
                endDate: value,
              },
            });
          },
        },
        location: {
          value: pitId,
          set: (value) => {
            setFrontState({
              frontPitState: {
                pitId: value,
              },
            });
          },
        },
        shiftId: {
          value: shiftId,
          set: (value) => {
            setFrontState({
              frontPitState: {
                shiftId: value,
              },
            });
          },
        },
        materialId: {
          value: materialId,
          set: (value) => {
            setFrontState({
              frontPitState: {
                materialId: value,
              },
            });
          },
        },
      },
      dome: {
        filterBadgeValue: {
          value: filterBadgeValueDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                filterBadgeValue: value,
              },
            });
          },
        },
        page: {
          value: pageDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                page: value,
              },
            });
          },
        },
        period: {
          value: periodDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                period: value,
              },
            });
          },
        },
        year: {
          value: yearDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                year: value,
              },
            });
          },
        },
        month: {
          value: monthDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                month: value,
              },
            });
          },
        },
        week: {
          value: weekDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                week: value,
              },
            });
          },
        },
        quarter: {
          value: quarterDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                quarter: value,
              },
            });
          },
        },
        startDate: {
          value: startDateDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                startDate: value,
              },
            });
          },
        },
        endDate: {
          value: endDateDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                endDate: value,
              },
            });
          },
        },
        location: {
          value: domeId,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                domeId: value,
              },
            });
          },
        },
        shiftId: {
          value: shiftIdDome,
          set: (value) => {
            setFrontState({
              frontDomeState: {
                shiftId: value,
              },
            });
          },
        },
      },
    };
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    domeId,
    endDate,
    endDateDome,
    filterBadgeValue,
    filterBadgeValueDome,
    materialId,
    month,
    monthDome,
    pageDome,
    pagePit,
    period,
    periodDome,
    pitId,
    quarter,
    quarterDome,
    shiftId,
    shiftIdDome,
    startDate,
    startDateDome,
    week,
    weekDome,
    year,
    yearDome,
  ]);

  const segment = segmentConditionalFilter[newParams.segment];

  /* #   /**=========== Query =========== */
  const {
    frontProductionData,
    frontProductionOtherColumn,
    frontProductionDataLoading,
    frontProductionDataMeta,
    refetchfrontProductionData,
  } = useReadAllFrontProduction({
    variables: {
      limit: 10,
      page: 1,
      orderDir: 'desc',
      type: newParams.segment,
    },
  });

  const startDateString = formatDate(
    segment.startDate.value || null,
    'YYYY-MM-DD'
  );
  const endDateString = formatDate(segment.endDate.value || null, 'YYYY-MM-DD');

  const defaultRefatch = {
    timeFilterType: segment.period.value
      ? segment.period.value === 'DATE_RANGE'
        ? segment.period.value
        : 'PERIOD'
      : undefined,
    timeFilter: {
      startDate: startDateString || undefined,
      endDate: endDateString || undefined,
      year: segment.year.value ? Number(segment.year.value) : undefined,
      week: segment.week.value ? Number(segment.week.value) : undefined,
      month: segment.month.value ? Number(segment.month.value) : undefined,
    },
    shiftId: segment.shiftId.value || undefined,
    pitId:
      newParams.segment === 'pit'
        ? segment.location.value || undefined
        : undefined,
    materialId: segmentConditionalFilter.pit.materialId.value || undefined,
    domeId:
      newParams.segment === 'dome'
        ? segment.location.value || undefined
        : undefined,
  };

  React.useEffect(() => {
    useControlPanel.persist.rehydrate();
    resetAllSlices(new Set<ISliceName>(['frontSlice'] as ISliceName[]));
  }, []);

  React.useEffect(() => {
    if (hasHydrated) {
      refetchfrontProductionData({
        page: segment.page?.value,
        ...defaultRefatch,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [executeDelete, { loading }] = useDeleteFrontProduction({
    onCompleted: () => {
      setIsOpenDeleteConfirmation((prev) => !prev);
      segment.page?.set(1);
      refetchfrontProductionData({ page: 1 });
      notifications.show({
        color: 'green',
        title: 'Selamat',
        message: t('frontProduction.successDeleteMessage'),
        icon: <IconCheck />,
      });
    },
    onError: ({ message }) => {
      notifications.show({
        color: 'red',
        title: 'Gagal',
        message: message,
        icon: <IconX />,
      });
    },
  });
  /* #endregion  /**======== Query =========== */

  const handleDelete = async () => {
    await executeDelete({
      variables: {
        id,
      },
    });
  };

  const handleSetPage = (page: number) => {
    segment.page?.set(page);
    refetchfrontProductionData({ page });
  };

  const handleChangeSegement = (value: string) => {
    setParams({
      segment: value,
    });
  };

  const filter = React.useMemo(() => {
    const maxEndDate = dayjs(segment.startDate?.value || undefined)
      .add(dayjs.duration({ days: 29 }))
      .toDate();

    const periodItem = globalSelectPeriodNative({
      label: 'period',
      name: 'period',
      clearable: true,
      onChange: (value) => {
        segment.period?.set(value || null);
        segment.startDate?.set(null);
        segment.endDate?.set(null);
        segment.year?.set(null);
        segment.month?.set(null);
        segment.week?.set(null);
        segment.location?.set(null);
        segment.shiftId?.set(null);
        if (newParams.segment === 'pit') {
          segmentConditionalFilter.pit.materialId.set(null);
        }
      },
      value: segment.period?.value,
    });

    const yearItem = globalSelectYearNative({
      name: 'year',
      withAsterisk: true,
      onChange: (value) => {
        segment.year?.set(value ? Number(value) : null);
        segment.month?.set(null);
        segment.week?.set(null);
      },
      value: segment.year.value ? `${segment.year.value}` : null,
    });

    const monthItem = globalSelectMonthNative({
      placeholder: 'month',
      label: 'month',
      name: 'month',
      withAsterisk: true,
      disabled: !segment.year?.value,
      value: segment.month.value ? `${segment.month.value}` : null,
      onChange: (value) => {
        segment.month?.set(value ? Number(value) : null);
        segment.week?.set(null);
      },
    });

    const weekItem = globalSelectWeekNative({
      placeholder: 'week',
      label: 'week',
      name: 'week',
      searchable: false,
      withAsterisk: true,
      disabled: !segment.month?.value,
      year: segment.year.value,
      month: segment.month.value,
      value: segment.week.value ? `${segment.week.value}` : null,
      onChange: (value) => {
        segment.week?.set(value ? Number(value) : null);
      },
    });

    const startDateItem = globalDateNative({
      label: 'startDate2',
      name: 'startDate',
      placeholder: 'chooseDate',
      clearable: true,
      withAsterisk: true,
      onChange: (value) => {
        segment.startDate?.set(value || null);
        segment.endDate?.set(null);
      },
      value: segment.startDate?.value,
    });
    const endDateItem = globalDateNative({
      label: 'endDate2',
      name: 'endDate',
      placeholder: 'chooseDate',
      clearable: true,
      disabled: !segment.startDate?.value,
      withAsterisk: true,
      maxDate: maxEndDate,
      minDate: segment.startDate?.value || undefined,
      onChange: (value) => {
        segment.endDate?.set(value || null);
      },
      value: segment.endDate?.value,
    });
    const locationItem = globalSelectLocationNative({
      label: newParams.segment,
      name: 'location',
      searchable: true,
      onChange: (value) => {
        segment.location?.set(value || null);
      },
      value: segment.location?.value,
      categoryIds:
        newParams.segment === 'pit'
          ? [`${process.env.NEXT_PUBLIC_PIT_ID}`]
          : [`${process.env.NEXT_PUBLIC_DOME_ID}`],
    });
    const shiftItem = globalSelectShiftNative({
      label: 'shift',
      name: 'shiftId',
      searchable: false,
      onChange: (value) => {
        segment.shiftId?.set(value || null);
      },
      value: segment.shiftId?.value,
    });
    const materialItem = globalSelectMaterialNative({
      label: 'material',
      name: 'materialId',
      value: segmentConditionalFilter.pit.materialId.value,
      onChange: (value) => {
        segmentConditionalFilter.pit.materialId.set(value || null);
      },
    });

    const periodDateRange = [
      {
        selectItem: startDateItem,
        col: 6,
      },
      {
        selectItem: endDateItem,
        col: 6,
        otherElement: () => (
          <GlobalAlert
            description={
              <Text fw={500} color="orange.4">
                Maksimal Rentang Waktu Dalam 30 Hari
              </Text>
            }
            color="orange.5"
            mt="xs"
            py={4}
          />
        ),
      },
    ];

    const periodYear = [
      {
        selectItem: yearItem,
        col: segment.period?.value === 'YEAR' ? 12 : 6,
        prefix: 'Tahun:',
      },
    ];

    const periodMoth = [
      ...periodYear,
      {
        selectItem: monthItem,
        col: 6,
      },
    ];

    const periodWeek = [
      ...periodMoth,
      {
        selectItem: weekItem,
        col: 12,
      },
    ];

    const materialFilter = [
      {
        selectItem: materialItem,
        col: 12,
      },
    ];

    const commonItem = [
      {
        selectItem: periodItem,
        col: 12,
        prefix: 'Periode:',
      },
      ...(segment.period.value === 'DATE_RANGE' ? periodDateRange : []),
      ...(segment.period.value === 'YEAR' ? periodYear : []),
      ...(segment.period.value === 'MONTH' ? periodMoth : []),
      ...(segment.period.value === 'WEEK' ? periodWeek : []),
      {
        selectItem: locationItem,
        col: 6,
        prefix: `${t(`commonTypography.${newParams.segment}`)}`,
      },
      {
        selectItem: shiftItem,
        col: 6,
      },
    ];

    const item: IFilterButtonProps = {
      filterDateWithSelect:
        newParams.segment === 'pit'
          ? [...commonItem, ...materialFilter]
          : [...commonItem],
    };
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    newParams.segment,
    segment.endDate,
    segment.location,
    segment.month,
    segment.period,
    segment.shiftId,
    segment.startDate,
    segment.week,
    segment.year,
    segmentConditionalFilter.pit.materialId,
  ]);

  /* #   /**=========== RenderTable =========== */
  const renderTable = React.useMemo(() => {
    return (
      <MantineDataTable
        tableProps={{
          records: frontProductionData,
          fetching: frontProductionDataLoading,
          highlightOnHover: true,
          columns: [
            {
              accessor: 'index',
              title: 'No',
              render: (record) =>
                frontProductionData && frontProductionData.indexOf(record) + 1,
              width: 60,
            },
            ...(frontProductionOtherColumn ?? []),
            {
              accessor: 'status',
              title: t('commonTypography.status'),
              render: ({ status }) => {
                return (
                  <GlobalBadgeStatus
                    color={status?.color}
                    label={status?.name ?? ''}
                  />
                );
              },
            },
            {
              accessor: 'action',
              title: t('commonTypography.action'),
              width: 100,
              render: ({ id, status }) => {
                const isDetermination =
                  status?.id === `${process.env.NEXT_PUBLIC_STATUS_DETERMINED}`;
                return (
                  <GlobalKebabButton
                    actionRead={
                      isPermissionRead
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/data-front/read/${id}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionUpdate={
                      isPermissionUpdate && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              router.push(
                                `/input-data/production/data-front/update/${id}?segment=${params.segment}`
                              );
                            },
                          }
                        : undefined
                    }
                    actionDelete={
                      isPermissionDelete && !isDetermination
                        ? {
                            onClick: (e) => {
                              e.stopPropagation();
                              setIsOpenDeleteConfirmation((prev) => !prev);
                              setId(id);
                            },
                          }
                        : undefined
                    }
                  />
                );
              },
            },
          ],
        }}
        emptyStateProps={{
          title: t('commonTypography.dataNotfound'),
          actionButton: isPermissionCreate
            ? {
                label: t('frontProduction.createFrontProduction'),
                onClick: () => setIsOpenSelectionModal((prev) => !prev),
              }
            : undefined,
        }}
        paginationProps={{
          setPage: handleSetPage,
          currentPage: params.segment === 'pit' ? pagePit || 1 : pageDome || 1,
          totalAllData: frontProductionDataMeta?.totalAllData ?? 0,
          totalData: frontProductionDataMeta?.totalData ?? 0,
          totalPage: frontProductionDataMeta?.totalPage ?? 0,
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageDome,
    pagePit,
    frontProductionData,
    frontProductionDataLoading,
    isPermissionDelete,
    isPermissionRead,
    isPermissionUpdate,
    isPermissionCreate,
  ]);
  /* #endregion  /**======== RenderTable =========== */

  const isDisabled = () => {
    const { period, endDate, year, month, week, shiftId, location } = segment;
    const otherValue = [
      shiftId.value,
      location.value,
      newParams.segment === 'pit'
        ? segmentConditionalFilter.pit.materialId.value
        : null,
    ];

    if (period?.value === 'DATE_RANGE') {
      return !(endDate && endDate.value);
    }
    if (period?.value === 'YEAR') {
      return !(year && year.value);
    }
    if (period?.value === 'MONTH') {
      return !(month && month.value);
    }
    if (period?.value === 'WEEK') {
      return !(week && week.value);
    }

    return !otherValue.some((v) => typeof v === 'string');
  };

  return (
    <DashboardCard
      addButton={
        isPermissionCreate
          ? {
              label: t('frontProduction.createFrontProduction'),
              onClick: () => setIsOpenSelectionModal((prev) => !prev),
            }
          : undefined
      }
      otherButton={
        <DownloadButtonFront
          params={newParams.segment}
          label="Download"
          period={segment.period.value || undefined}
          defaultValuesState={{
            period: segment.period.value || 'DATE_RANGE',
            startDate: segment.startDate.value || null,
            endDate: segment.endDate.value || null,
            year: segment.year.value ? `${segment.year.value}` : null,
            month: segment.month.value ? `${segment.month.value}` : null,
            week: segment.week.value ? `${segment.week.value}` : null,
            shiftId: segment.shiftId.value || null,
            locationId: segment.location.value || null,
            materialId:
              newParams.segment === 'pit'
                ? segmentConditionalFilter.pit.materialId.value
                : null,
          }}
        />
      }
      filterBadge={{
        resetButton: {
          onClick: () => {
            segment.page?.set(1);
            segment.period?.set(null);
            segment.startDate?.set(null);
            segment.endDate?.set(null);
            segment.shiftId?.set(null);
            segment.location?.set(null);
            segment.year?.set(null);
            segment.month?.set(null);
            segment.week?.set(null);
            segment.filterBadgeValue?.set(null);
            if (newParams.segment === 'pit') {
              segmentConditionalFilter.pit.materialId.set(null);
            }
            refetchfrontProductionData({
              page: 1,
              timeFilterType: undefined,
              timeFilter: {
                startDate: undefined,
                endDate: undefined,
                year: undefined,
                week: undefined,
                month: undefined,
              },
              shiftId: undefined,
              pitId: undefined,
              materialId: undefined,
              domeId: undefined,
            });
          },
        },
        value: segment.filterBadgeValue?.value || null,
      }}
      filter={{
        filterDateWithSelect: filter.filterDateWithSelect,
        filterButton: {
          disabled: isDisabled(),
          onClick: () => {
            refetchfrontProductionData({
              page: 1,
              ...defaultRefatch,
            });
            const badgeFilterValue = newNormalizedFilterBadge({
              filter: filter.filterDateWithSelect || [],
              data: filterDataCommon || [],
            });
            const newStartDate = formatDate(segment.startDate.value);
            const newEndDate = formatDate(segment.endDate.value);
            const dateBadgeValue = [`${newStartDate} - ${newEndDate}`];

            const rangePeriod =
              segment.period.value === 'DATE_RANGE'
                ? [
                    ...badgeFilterValue.slice(0, 1),
                    ...dateBadgeValue,
                    ...badgeFilterValue.slice(1),
                  ]
                : [];

            segment.page?.set(1);
            segment.filterBadgeValue?.set(
              rangePeriod.length >= 1 ? rangePeriod : badgeFilterValue
            );
          },
        },
      }}
      searchBar={{
        placeholder: `${t('frontProduction.searchPlaceholder')} ${
          params.segment ? params.segment.toUpperCase() : ''
        }`,
        onChange: (e) => {
          if (params.segment === 'dome') {
            setFrontState({
              frontDomeState: {
                search: e.currentTarget.value,
              },
            });
          } else {
            setFrontState({
              frontPitState: {
                search: e.currentTarget.value,
              },
            });
          }
        },
        searchQuery:
          params.segment === 'dome'
            ? domeSearchQuery || ''
            : pitSearchQuery || '',
        onSearch: () => {
          if (params.segment === 'dome') {
            setFrontState({
              frontDomeState: {
                page: 1,
              },
            });
            refetchfrontProductionData({
              search: domeSearchQuery || null,
            });
          } else {
            setFrontState({
              frontPitState: {
                page: 1,
              },
            });
            refetchfrontProductionData({
              search: pitSearchQuery || null,
            });
          }
        },
        value: params.segment === 'dome' ? searchDome : searchPit,
      }}
      segmentedControl={{
        defaultValue: 'pit',
        value: newParams.segment || 'pit',
        onChange: handleChangeSegement,
        data: [
          {
            label: 'PIT',
            value: 'pit',
          },
          {
            label: 'DOME',
            value: 'dome',
          },
        ],
      }}
    >
      {renderTable}
      <ModalConfirmation
        isOpenModalConfirmation={isOpenDeleteConfirmation}
        actionModalConfirmation={() =>
          setIsOpenDeleteConfirmation((prev) => !prev)
        }
        actionButton={{
          label: t('commonTypography.yesDelete'),
          color: 'red',
          onClick: handleDelete,
          loading: loading,
        }}
        backButton={{
          label: 'Batal',
        }}
        modalType={{
          type: 'default',
          title: t('commonTypography.alertTitleConfirmDelete'),
          description: t('commonTypography.alertDescConfirmDelete'),
        }}
        withDivider
      />
      <SelectionButtonModal
        isOpenSelectionModal={isOpenSelectionModal}
        actionSelectionModal={() => setIsOpenSelectionModal((prev) => !prev)}
        firstButton={{
          label: t('commonTypography.fromPit'),
          onClick: () =>
            router.push(`/input-data/production/data-front/create?segment=pit`),
        }}
        secondButton={{
          label: t('commonTypography.fromDome'),
          onClick: () =>
            router.push(
              `/input-data/production/data-front/create?segment=dome`
            ),
        }}
      />
    </DashboardCard>
  );
};

export default FrontProductionBook;
