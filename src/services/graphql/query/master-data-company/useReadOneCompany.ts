import { ApolloError, gql, useQuery } from '@apollo/client';

import { IFile, IProvinceDetail } from '@/types/global';

export const READ_ONE_COMPANY = gql`
  query ReadOneCompany($id: String!) {
    company(id: $id) {
      id
      name
      alias
      nib
      phoneNumber1
      email1
      phoneNumber2
      email2
      address
      faxNumber
      code
      type {
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
      businessType {
        id
        name
      }
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
      permissionTypeDocument {
        id
        originalFileName
        url
        fileName
      }
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

interface ICompanyData extends IProvinceDetail {
  id: string;
  name: string;
  alias: string | null;
  nib: string;
  phoneNumber1: string;
  email1: string;
  phoneNumber2: string;
  email2: string | null;
  faxNumber: string | null;
  code: string | null;
  type: {
    id: string;
    name: string;
  } | null;
  businessType: {
    id: string;
    name: string;
  } | null;
  logo: Omit<IFile, 'mime' | 'path'> | null;
  permissionType: {
    id: string;
    name: string;
  } | null;
  permissionTypeNumber: string;
  permissionTypeDate: string;
  permissionTypeDocument: Omit<IFile, 'mime' | 'path'> | null;
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
