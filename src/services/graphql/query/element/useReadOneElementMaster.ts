import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_ELEMENT_MASTER = gql`
  query ReadOneElementMaster($id: String!) {
    element(id: $id) {
      id
      name
    }
  }
`;

interface IReadOneElementMaster {
  id: string;
  name: string;
}

interface IReadOneElementMasterResponse {
  element: IReadOneElementMaster;
}

interface IReadOneElementMasterRequest {
  id: string;
}

export const useReadOneElementMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneElementMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneElementMasterResponse) => void;
}) => {
  const { data: elementMaster, loading: elementMasterLoading } = useQuery<
    IReadOneElementMasterResponse,
    IReadOneElementMasterRequest
  >(READ_ONE_ELEMENT_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    elementMaster: elementMaster?.element,
    elementMasterLoading,
  };
};
