import { ApolloError, gql, useQuery } from '@apollo/client';

export const READ_ONE_SHIFT_MASTER = gql`
  query ReadOneShiftMaster($id: String!) {
    shift(id: $id) {
      id
      name
      startHour
      endHour
    }
  }
`;

interface IReadOneShiftMaster {
  id: string;
  name: string;
  startHour: string;
  endHour: string;
}

interface IReadOneShiftMasterResponse {
  shift: IReadOneShiftMaster;
}

interface IReadOneShiftMasterRequest {
  id: string;
}

export const useReadOneShiftMaster = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneShiftMasterRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneShiftMasterResponse) => void;
}) => {
  const { data: shiftMaster, loading: shiftMasterLoading } = useQuery<
    IReadOneShiftMasterResponse,
    IReadOneShiftMasterRequest
  >(READ_ONE_SHIFT_MASTER, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    shiftMaster: shiftMaster?.shift,
    shiftMasterLoading,
  };
};
