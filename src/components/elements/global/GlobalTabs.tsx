import { ScrollArea, Tabs, TabsProps } from '@mantine/core';
import * as React from 'react';

interface IGlobalTabsProps {
  tabs?: Partial<TabsProps>;
  tabsData: {
    value: string;
    label: string;
    component: React.ReactNode;
  }[];
}

const GlobalTabs: React.FC<IGlobalTabsProps> = ({ tabs, tabsData }) => {
  const {
    defaultValue = tabsData[0].value,
    radius = 4,
    ...restTabs
  } = tabs || {};
  return (
    <Tabs
      defaultValue={defaultValue}
      radius={radius}
      styles={{
        tabsList: {
          flexWrap: 'nowrap',
        },
      }}
      {...restTabs}
    >
      <ScrollArea w="100%" px={0} h={55}>
        <Tabs.List>
          {tabsData.map((val, i) => (
            <Tabs.Tab value={val.value} fz={14} fw={500} key={i}>
              {val.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </ScrollArea>
      {tabsData.map((obj, i) => (
        <Tabs.Panel value={obj.value} key={i}>
          {obj.component}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default GlobalTabs;
