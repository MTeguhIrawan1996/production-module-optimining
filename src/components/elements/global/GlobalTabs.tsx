import { ScrollArea, Tabs, TabsProps } from '@mantine/core';
import * as React from 'react';

type ITabsItem = {
  value: string;
  label: string;
  component: React.ReactNode;
  isShowItem?: boolean;
};

interface IGlobalTabsProps {
  tabs?: Partial<TabsProps>;
  tabsData?: ITabsItem[];
}

const GlobalTabs: React.FC<IGlobalTabsProps> = ({ tabs, tabsData }) => {
  const {
    defaultValue = tabsData?.[0].value,
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
      <ScrollArea w="100%" offsetScrollbars>
        <Tabs.List>
          {tabsData?.map((val, i) => {
            if (val.isShowItem) {
              return (
                <Tabs.Tab value={val.value} fz={14} fw={500} key={i}>
                  {val.label}
                </Tabs.Tab>
              );
            }
          })}
        </Tabs.List>
      </ScrollArea>
      {tabsData?.map((obj, i) => {
        if (obj.isShowItem) {
          return (
            <Tabs.Panel value={obj.value} key={i}>
              {obj.component}
            </Tabs.Panel>
          );
        }
      })}
    </Tabs>
  );
};

export default GlobalTabs;
