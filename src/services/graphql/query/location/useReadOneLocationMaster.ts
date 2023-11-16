import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_LOCATION_MASTER = gql`
  query ReadOneLocationMaster($id: String!) {
    location(id: $id) {
      id
      handBookId
      name
      category {
        id
        name
      }
    }
  }
`;

export interface IReadOneLocationMaster {
  id: string;
  handBookId: string;
  name: string;
  category: {
    id: string;
    name: string;
  } | null;
}

export interface IReadOneLocationMasterResponse {
  location: IReadOneLocationMaster;
}

export interface IReadOneLocationMasterRequest {
  id: string;
}

export const useReadOneLocationMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneLocationMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneLocationMasterResponse) => void;
}) => {
  const { data: locationMaster, loading: locationMasterLoading } = useQuery<
    IReadOneLocationMasterResponse,
    IReadOneLocationMasterRequest
  >(READ_ONE_LOCATION_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    locationMaster: locationMaster?.location,
    locationMasterLoading,
  };
};
