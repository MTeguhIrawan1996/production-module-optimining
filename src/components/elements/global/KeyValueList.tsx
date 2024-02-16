import {
  Flex,
  FlexProps,
  Grid,
  GridProps,
  Text,
  TextProps,
} from '@mantine/core';
import * as React from 'react';

interface IGridTypeProps extends Omit<GridProps, 'children'> {
  type: 'grid';
  keySpan?: number;
  valueSpan?: number;
}
interface IFlexTypeProps extends Omit<FlexProps, 'children'> {
  type: 'flex';
}
export interface IKeyValueItemProps {
  dataKey: string;
  value?: string | null | React.ReactNode;
  keyStyleText?: TextProps;
  valueStyleText?: TextProps;
}

type IKeyValueListProps = {
  data: Pick<IKeyValueItemProps, 'dataKey' | 'value'>[];
} & Pick<IKeyValueItemProps, 'keyStyleText' | 'valueStyleText'> &
  (IGridTypeProps | IFlexTypeProps);

const GridItem: React.FC<IKeyValueItemProps & IGridTypeProps> = ({
  dataKey,
  keySpan,
  keyStyleText,
  valueStyleText,
  valueSpan,
  value,
  ...rest
}) => (
  <Grid align="center" {...rest}>
    <Grid.Col span={keySpan ?? 6}>
      <Text span fw={400} fz={18} color="dark.6" {...keyStyleText}>
        {dataKey}
      </Text>
    </Grid.Col>
    <Grid.Col span={valueSpan ?? 6}>
      <Text span fw={400} fz={18} color="dark.7" {...valueStyleText}>
        {value ?? '-'}
      </Text>
    </Grid.Col>
  </Grid>
);

const FlexItem: React.FC<IKeyValueItemProps & IFlexTypeProps> = ({
  keyStyleText,
  dataKey,
  value,
  valueStyleText,
  ...rest
}) => (
  <Flex {...rest}>
    <Text span fw={400} fz={18} color="dark.6" {...keyStyleText}>
      {dataKey}
    </Text>
    <Text span fw={400} fz={18} color="dark.7" {...valueStyleText}>
      {value ?? '-'}
    </Text>
  </Flex>
);

const KeyValueList: React.FC<IKeyValueListProps> = ({ data, ...props }) => {
  return (
    <>
      {props.type === 'grid' &&
        data.map((item, i) => <GridItem key={i} {...item} {...props} />)}
      {props.type === 'flex' &&
        data.map((item, i) => <FlexItem key={i} {...item} {...props} />)}
    </>
  );
};

export default KeyValueList;
