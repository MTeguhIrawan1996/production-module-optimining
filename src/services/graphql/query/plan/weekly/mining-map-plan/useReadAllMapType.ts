import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ALL_MAP_TYPE = gql`
  query ReadAllMapType {
    miningMapTypes {
      id
      name
    }
  }
`;

export interface IMapTypeData {
  id: string;
  name: string;
}

interface IMapTypeResponse {
  miningMapTypes: IMapTypeData[];
}

export const useReadAllMapType = ({
  onCompleted,
  skip,
}: {
  onCompleted?: (data: IMapTypeResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: miningMapTypesData,
    loading: miningMapTypesDataLoading,
    refetch,
  } = useQuery<IMapTypeResponse>(READ_ALL_MAP_TYPE, {
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-first',
  });

  return {
    miningMapTypesData: miningMapTypesData?.miningMapTypes,
    miningMapTypesDataLoading,
    refetchMiningMapTypes: refetch,
  };
};
