import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile } from '@/types/global';

export const READ_ONE_COMPANY = gql`
  query ReadOneCompany($id: String!) {
    company(id: $id) {
      id
      name
      alias
      nib
      phoneNumber1
      email1
      address
      logo {
        id
        originalFileName
        url
        fileName
      }
      permissionType {
        id
        name
      }
      permissionTypeNumber
      permissionTypeDate
      presidentDirector {
        id
        nip
        startDate
        humanResource {
          id
          name
          identityNumber
          photo {
            id
            originalFileName
            url
            fileName
          }
        }
      }
    }
  }
`;

interface ICompanyData {
  id: string;
  name: string;
  alias: string | null;
  nib: string;
  phoneNumber1: string;
  email1: string;
  address: string;
  logo: Omit<IFile, 'mime' | 'path'> | null;
  permissionType: {
    id: string;
    name: string;
  } | null;
  permissionTypeNumber: string;
  permissionTypeDate: string;
  presidentDirector: {
    id: string;
    nip: string | null;
    startDate: string;
    humanResource: {
      id: string;
      name: string;
      identityNumber: string;
      photo: Omit<IFile, 'mime' | 'path'> | null;
    } | null;
  } | null;
}

export interface ICompanyResponse {
  company: ICompanyData;
}

export interface ICompanyRequest {
  id: string;
}

export const useReadOneCompany = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: ICompanyRequest;
  skip?: boolean;
  onCompleted?: (data: ICompanyResponse) => void;
}) => {
  const { data: companyData, loading: companyDataLoading } = useQuery<
    ICompanyResponse,
    ICompanyRequest
  >(READ_ONE_COMPANY, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    companyData: companyData?.company,
    companyDataLoading,
  };
};
