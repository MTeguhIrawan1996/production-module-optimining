import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_HUMAN_RESOURCE = gql`
  query ReadOneHumanResource($id: String!) {
    humanResource(id: $id) {
      id
      name
      alias
      isWni
      identityNumber
      identityType {
        id
        name
      }
      pob
      dob
      gender
      religion {
        id
        name
      }
      educationDegree
      marriageStatus {
        id
        name
      }
      province {
        id
        name
      }
      regency {
        id
        name
      }
      district {
        id
        name
      }
      village {
        id
        name
      }
      address
      isAddressSameWithDomicile
      domicileProvince {
        id
        name
      }
      domicileRegency {
        id
        name
      }
      domicileDistrict {
        id
        name
      }
      domicileVillage {
        id
        name
      }
      domicileAddress
      phoneNumber
      email
      bloodType
      resus
      photo {
        id
        originalFileName
        url
        fileName
      }
      identityPhoto {
        id
        originalFileName
        url
        fileName
      }
    }
  }
`;

export interface IHumanResourceData {
  id: string;
  name: string;
  alias: string | null;
  isWni: boolean;
  identityNumber: string;
  identityType: {
    id: string;
    name: string;
  } | null;
  pob: string | null;
  dob: string | null;
  gender: string;
  religion: {
    id: string;
    name: string;
  } | null;
  educationDegree: string | null;
  marriageStatus: {
    id: string;
    name: string;
  } | null;
  province: {
    id: string;
    name: string;
  } | null;
  regency: {
    id: string;
    name: string;
  } | null;
  district: {
    id: string;
    name: string;
  } | null;
  village: {
    id: string;
    name: string;
  } | null;
  address: string;
  isAddressSameWithDomicile: boolean;
  domicileProvince: {
    id: string;
    name: string;
  } | null;
  domicileRegency: {
    id: string;
    name: string;
  } | null;
  domicileDistrict: {
    id: string;
    name: string;
  } | null;
  domicileVillage: {
    id: string;
    name: string;
  } | null;
  domicileAddress: string | null;
  phoneNumber: string;
  email: string;
  bloodType: string | null;
  resus: string | null;
  photo: Omit<IFile, 'mime' | 'path'> | null;
  identityPhoto: Omit<IFile, 'mime' | 'path'> | null;
}

export interface IHumanResourceResponse {
  humanResource: IHumanResourceData;
}

export interface IHumanResourceRequest {
  id: string;
}

export const useReadOneHumanResource = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IHumanResourceRequest;
  skip?: boolean;
  onCompleted?: (data: IHumanResourceResponse) => void;
}) => {
  const { data: humanResourceData, loading: humanResourceDataLoading } =
    useQuery<IHumanResourceResponse, IHumanResourceRequest>(
      READ_ONE_HUMAN_RESOURCE,
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
    humanResourceData: humanResourceData?.humanResource,
    humanResourceDataLoading,
  };
};
