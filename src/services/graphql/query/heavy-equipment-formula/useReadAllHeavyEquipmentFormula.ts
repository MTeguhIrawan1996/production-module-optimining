import { ApolloError, gql, useQuery } from '@apollo/client';

import { simpleOtherColumn } from '@/utils/helper/simpleOtherColumn';

import { GResponse, IGlobalMetaRequest } from '@/types/global';

export const READ_ALL_HEAVY_EQUIPMENT_FORMULA = gql`
  query ReadAllHeavyEquipmentFormula(
    $page: Int
    $limit: Int
    $search: String
    $orderBy: String
    $orderDir: String
  ) {
    heavyEquipmentDataFormulas(
      findAllHeavyEquipmentDataFormulaInput: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        orderDir: $orderDir
      }
    ) {
      meta {
        currentPage
        totalPage
        totalData
        totalAllData
      }
      data {
        id
        name
        desc
        topFormula {
          id
          parameters {
            id
            order
            operator
            category {
              id
              name
              type
              countFormula {
                id
                parameters {
                  id
                  order
                  operator
                  category {
                    id
                    name
                    type
                    countFormula {
                      id
                    }
                  }
                }
              }
            }
          }
        }
        bottomFormula {
          id
          parameters {
            id
            order
            operator
            category {
              id
              name
              type
              countFormula {
                id
                parameters {
                  id
                  order
                  operator
                  category {
                    id
                    name
                    type
                    countFormula {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface IParameters<T> {
  id: string;
  order: number;
  operator: string | null;
  category: {
    id: string;
    name: string;
    type: string;
    countFormula: T | null;
  };
}

interface IFormula {
  id: string;
  parameters: IParameters<IFormula>[];
}

export interface IReadAllHeavyEquipmentFormulaData {
  id: string;
  name: string;
  desc: string | null;
  topFormula: IFormula;
}

interface IReadAllHeavyEquipmentFormulaResponse {
  heavyEquipmentDataFormulas: GResponse<IReadAllHeavyEquipmentFormulaData>;
}

interface ISimpleKeyType {
  id: string;
  formula: string | null;
}

export const useReadAllHeavyEquipmentFormula = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: Partial<IGlobalMetaRequest>;
  onCompleted?: (data: IReadAllHeavyEquipmentFormulaResponse) => void;
  skip?: boolean;
}) => {
  const {
    data: readAllHeavyEquipmentFormulaData,
    loading: readAllHeavyEquipmentFormulaDataLoading,
    refetch,
  } = useQuery<
    IReadAllHeavyEquipmentFormulaResponse,
    Partial<IGlobalMetaRequest>
  >(READ_ALL_HEAVY_EQUIPMENT_FORMULA, {
    variables: variables,
    skip: skip,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    fetchPolicy: 'cache-and-network',
  });

  const simplifiedData: ISimpleKeyType[] | undefined =
    readAllHeavyEquipmentFormulaData?.heavyEquipmentDataFormulas.data.map(
      (item) => ({
        id: item.id,
        formula: `${item.desc ?? ''} ${
          item.desc ? `(${item.name ?? null})` : item.name
        }`,
      })
    );
  const excludeAccessor = ['id'];

  const otherColumn = simpleOtherColumn({
    data: simplifiedData,
    exclude: excludeAccessor,
  });

  return {
    readAllHeavyEquipmentFormulaData: simplifiedData,
    readAllHeavyEquipmentFormulaDataPure:
      readAllHeavyEquipmentFormulaData?.heavyEquipmentDataFormulas.data,
    readAllHeavyEquipmentFormulaDataColumn: otherColumn,
    readAllHeavyEquipmentFormulaDataMeta:
      readAllHeavyEquipmentFormulaData?.heavyEquipmentDataFormulas.meta,
    readAllHeavyEquipmentFormulaDataLoading,
    refetchReadAllHeavyEquipmentFormulaData: refetch,
  };
};
