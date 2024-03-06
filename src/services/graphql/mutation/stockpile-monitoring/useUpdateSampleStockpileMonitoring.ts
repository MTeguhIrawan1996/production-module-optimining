import { ApolloError, gql, useMutation } from '@apollo/client';

export const UPDATE_SAMPLE_STOCKPILE_MONITORING = gql`
  mutation UpdateSampleStockpileMonitoring(
    $id: String!
    $samples: [CreateSampleDto!]
  ) {
    updateSampleMonitoringStockpile(
      updateSampleMonitoringStockpileInput: { id: $id, samples: $samples }
    ) {
      id
    }
  }
`;

export interface IMutationUpdateSampleMonitoringStockpileValues {
  sampleNumber: string;
}

type IUpdateSampleStockpileMonitoringRequest = {
  id: string;
  samples: IMutationUpdateSampleMonitoringStockpileValues[];
};

interface IUpdateSampleStockpileMonitoringResponse {
  updateSampleMonitoringStockpile: {
    id: string;
  };
}

export const useUpdateSampleStockpileMonitoring = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IUpdateSampleStockpileMonitoringResponse) => void;
}) => {
  return useMutation<
    IUpdateSampleStockpileMonitoringResponse,
    IUpdateSampleStockpileMonitoringRequest
  >(UPDATE_SAMPLE_STOCKPILE_MONITORING, {
    onError,
    onCompleted,
  });
};
