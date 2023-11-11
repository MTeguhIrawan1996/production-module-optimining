import { ApolloError, gql, useQuery } from '@apollo/client';

import { IHumanResourceData } from '@/services/graphql/query/master-data-human-resources/useReadOneHumanResource';

export const READ_ONE_COMPANY_HUMAN_RESOURCE = gql`
  query ReadOneCompanyHumanResource($id: String!) {
    employee(id: $id) {
      id
      entryDate
      quitDate
      nip
      isStillWorking
      humanResource {
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
      position {
        id
        name
        slug
      }
      division {
        id
        name
        slug
      }
      status {
        id
        name
        slug
      }
      positionHistories {
        id
        position {
          id
          name
        }
        division {
          id
          name
        }
        startDate
        isStill
        endDate
      }
    }
  }
`;

export interface IEmployee {
  id: string;
  nip: string | null;
  isStillWorking: boolean | null;
  entryDate: string;
  quitDate: string;
  position: {
    id: string;
    name: string;
  } | null;
  division: {
    id: string;
    name: string;
  } | null;
  status: {
    id: string;
    name: string;
  } | null;
  positionHistories: {
    id: string;
    position: {
      id: string;
      name: string;
    };
    division: {
      id: string;
      name: string;
    };
    startDate: string;
    isStill: boolean;
    endDate: string;
  }[];
}

export interface IEmployeeData extends IEmployee {
  humanResource: IHumanResourceData;
}

export interface IEmployeeResponse {
  employee: IEmployeeData;
}

export interface IEmployeeRequest {
  id: string;
}

export const useReadOneEmployee = ({
  variables,
  skip,
  onCompleted,
}: {
  variables: IEmployeeRequest;
  skip?: boolean;
  onCompleted?: (data: IEmployeeResponse) => void;
}) => {
  const { data: employeeData, loading: employeeDataLoading } = useQuery<
    IEmployeeResponse,
    IEmployeeRequest
  >(READ_ONE_COMPANY_HUMAN_RESOURCE, {
    variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted: onCompleted,
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    employeeData: employeeData?.employee,
    employeeDataLoading,
  };
};
