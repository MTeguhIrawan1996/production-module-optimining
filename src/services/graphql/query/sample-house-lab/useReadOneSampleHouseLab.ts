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
      location {
        id
        name
        category {
          id
          name
        }
      }
      locationName
      sampleEnterLabAt
      gradeControlElements {
        value
        element {
          id
          name
        }
      }
      density
      preparationStartAt
      preparationFinishAt
      analysisStartAt
      analysisFinishAt
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
      statusMessage
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
  material: IReadOneMaterialMaster | null;
  density: number;
  preparationStartAt: string | null;
  preparationFinishAt: string | null;
  analysisStartAt: string | null;
  analysisFinishAt: string | null;
  statusMessage: string | null;
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
  const { data: houseSampleAndLab, loading: houseSampleAndLabLoading } =
    useQuery<IReadOneSampleHouseLabResponse, IReadOneSampleHouseLabRequest>(
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
    houseSampleAndLab: houseSampleAndLab?.houseSampleAndLab,
    houseSampleAndLabLoading,
  };
};
