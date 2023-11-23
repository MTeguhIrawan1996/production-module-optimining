import { ApolloError, gql, useQuery } from '@apollo/client';

import { IReadOneMaterialMaster } from '@/services/graphql/query/material/useReadOneMaterialMaster';
import { IHouseSampleAndLabsData } from '@/services/graphql/query/sample-house-lab/useReadAllSampleHouseLab';

import { IFile } from '@/types/global';

export const READ_ONE_SAMPLE_HOUSE_LAB = gql`
  query ReadOneSampleHouseLab($id: String!) {
    houseSampleAndLab(id: $id) {
      id
      laboratoriumName
      sampleDate
      shift {
        id
        name
      }
      sampleNumber
      sampleName
      sampleType {
        id
        name
      }
      material {
        id
        name
        parent {
          id
          name
        }
      }
      sampler {
        id
        humanResource {
          id
          name
        }
      }
      gradeControl {
        id
        humanResource {
          id
          name
        }
      }
      location
      sampleEnterLabAt
      gradeControlElements {
        value
        element {
          id
          name
        }
      }
      elements {
        value
        element {
          id
          name
        }
      }
      status {
        id
        name
        color
      }
      photo {
        id
        originalFileName
        url
        fileName
      }
    }
  }
`;

interface IReadOneSampleHouseLab extends IHouseSampleAndLabsData {
  photo: Omit<IFile, 'mime' | 'path'> | null;
  material: IReadOneMaterialMaster;
}

interface IReadOneSampleHouseLabResponse {
  houseSampleAndLab: IReadOneSampleHouseLab;
}

interface IReadOneSampleHouseLabRequest {
  id: string;
}

export const useReadOneSampleHouseLab = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IReadOneSampleHouseLabRequest;
  skip?: boolean;
  onCompleted?: (data: IReadOneSampleHouseLabResponse) => void;
}) => {
  const {
    data: houseSampleAndLabMaster,
    loading: houseSampleAndLabMasterLoading,
  } = useQuery<IReadOneSampleHouseLabResponse, IReadOneSampleHouseLabRequest>(
    READ_ONE_SAMPLE_HOUSE_LAB,
    {
      variables,
      onError: (err: ApolloError) => {
        return err;
      },
      onCompleted: onCompleted,
      skip,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    houseSampleAndLabMaster: houseSampleAndLabMaster?.houseSampleAndLab,
    houseSampleAndLabMasterLoading,
  };
};
