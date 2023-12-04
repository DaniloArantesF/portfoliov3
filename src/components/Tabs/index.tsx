import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import classes from './Tabs.module.scss';

type TabsProps = {
  title: string;
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
};

const TabsContainer: React.FC<TabsProps> = ({ title, tabs }) => {
  return (
    <Tabs.Root className={classes.root} defaultValue={tabs[0].label}>
      <Tabs.List className={classes.list} aria-label={title}>
        {tabs.map((tab, index) => (
          <Tabs.Trigger
            className={classes.trigger}
            value={tab.label}
            key={`${tab.label}-${index}`}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab, index) => (
        <Tabs.Content
          key={`${tab.label}-${index}`}
          className={classes.content}
          value={tab.label}
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default TabsContainer;
