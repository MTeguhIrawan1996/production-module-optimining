import { ApolloError, gql, useMutation } from '@apollo/client';

export const DELETE_SAMPLE_HOUSE_LAB = gql`
  mutation DeleteSampleHouseLab($id: String!) {
    deleteHouseSampleAndLab(id: $id)
  }
`;

export interface IDeleteSampleHouseLabRequest {
  id: string;
}

interface IDeleteSampleHouseLabResponse {
  deleteHouseSampleAndLab: boolean;
}

export const useDeleteSampleHouseLab = ({
  onError,
  onCompleted,
}: {
  onError?: ({ graphQLErrors }: ApolloError) => void;
  onCompleted?: (data: IDeleteSampleHouseLabResponse) => void;
}) => {
  return useMutation<
    IDeleteSampleHouseLabResponse,
    IDeleteSampleHouseLabRequest
  >(DELETE_SAMPLE_HOUSE_LAB, {
    onError,
    onCompleted,
  });
};
