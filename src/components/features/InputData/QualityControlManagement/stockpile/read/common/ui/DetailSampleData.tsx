import { Divider } from '@mantine/core';
import * as React from 'react';

import RitageSampleDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/RitageSampleDataTable';
import SampleDataTable from '@/components/features/InputData/QualityControlManagement/stockpile/read/common/elements/SampleDataTable';

import { useReadAllElementMaster } from '@/services/graphql/query/element/useReadAllElementMaster';

const DetailSampleData = () => {
  const { elementsData } = useReadAllElementMaster({
    variables: {
      limit: null,
    },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <SampleDataTable elementsData={elementsData} />
      <Divider my="md" />
      <RitageSampleDataTable elementsData={elementsData} />
    </>
  );
};

export default DetailSampleData;
