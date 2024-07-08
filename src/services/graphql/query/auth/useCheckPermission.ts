import { ApolloError, gql, useQuery } from '@apollo/client';

export const CHECK_PERMISSION_USER_MIDLLEWARE = `
  query CheckPermissions(
    $moduleSlug: [ModuleSlugDto!]!
    $actionSlug: [ActionSlugDto!]
  ) {
    checkPermissions(
      findPermissionsInput: { moduleSlug: $moduleSlug, actionSlug: $actionSlug }
    ) {
      id
      name
      slug
      action {
        name
        slug
      }
    }
  }
`;

const CHECK_PERMISSION_USER = gql`
  query CheckPermissions(
    $moduleSlug: [ModuleSlugDto!]!
    $actionSlug: [ActionSlugDto!]
  ) {
    checkPermissions(
      findPermissionsInput: { moduleSlug: $moduleSlug, actionSlug: $actionSlug }
    ) {
      id
      name
      slug
      action {
        name
        slug
      }
    }
  }
`;

interface IGetCheckPermissionData {
  id: string;
  name: string;
  slug: string;
  action: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface IGetCheckPermissionResponse {
  data: {
    checkPermissions: IGetCheckPermissionData[];
  };
}

export interface IGetCheckPermissionRequest {
  moduleSlug?: {
    slug: string;
  }[];
  actionSlug?: {
    slug: string;
  }[];
}

export const useReadCheckPermissionUser = ({
  variables,
  onCompleted,
  skip,
}: {
  variables?: IGetCheckPermissionRequest;
  onCompleted?: (data: IGetCheckPermissionResponse) => void;
  skip?: boolean;
}) => {
  const { data: userPermission, loading: readPermissionLoading } = useQuery<
    IGetCheckPermissionResponse,
    IGetCheckPermissionRequest
  >(CHECK_PERMISSION_USER, {
    variables: variables,
    onError: (err: ApolloError) => {
      return err;
    },
    onCompleted,
    skip,
    fetchPolicy: 'cache-first',
  });

  return {
    userPermission: userPermission?.data,
    readPermissionLoading,
  };
};
