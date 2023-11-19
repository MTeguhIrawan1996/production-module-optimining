import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_FACTORY_MASTER = gql`
  query ReadOneFactoryMaster($id: String!) {
    factory(id: $id) {
      id
      name
    }
  }
`;

interface IReadOneFactoryMaster {
  id: string;
  name: string;
}

interface IReadOneFactoryMasterResponse {
  factory: IReadOneFactoryMaster;
}

interface IReadOneFactoryMasterRequest {
  id: string;
}

export const useReadOneFactoryMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneFactoryMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneFactoryMasterResponse) => void;
}) => {
  const { data: factoryMaster, loading: factoryMasterLoading } = useQuery<
    IReadOneFactoryMasterResponse,
    IReadOneFactoryMasterRequest
  >(READ_ONE_FACTORY_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    factoryMaster: factoryMaster?.factory,
    factoryMasterLoading,
  };
};
