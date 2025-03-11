import * as Tabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const TabsContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, orientation, dir, activationMode, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<TabsContext.Provider value={{
            value,
            onValueChange,
        }}>
        <Tabs.Root value={value} onValueChange={onValueChange} orientation={orientation} dir={dir} activationMode={activationMode} asChild>
          <Component ref={ref} {...viewProps}/>
        </Tabs.Root>
      </TabsContext.Provider>);
});
Root.displayName = 'RootWebTabs';
function useTabsContext() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs compound components cannot be rendered outside the Tabs component');
    }
    return context;
}
const List = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Tabs.List asChild>
        <Component ref={ref} {...props}/>
      </Tabs.List>);
});
List.displayName = 'ListWebTabs';
const TriggerContext = React.createContext(null);
const Trigger = React.forwardRef(({ asChild, value: tabValue, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<TriggerContext.Provider value={{ value: tabValue }}>
      <Tabs.Trigger value={tabValue} asChild>
        <Component ref={ref} {...props}/>
      </Tabs.Trigger>
    </TriggerContext.Provider>);
});
Trigger.displayName = 'TriggerWebTabs';
function useTriggerContext() {
    const context = React.useContext(TriggerContext);
    if (!context) {
        throw new Error('Tabs.Trigger compound components cannot be rendered outside the Tabs.Trigger component');
    }
    return context;
}
const Content = React.forwardRef(({ asChild, forceMount, value, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Tabs.Content value={value} asChild>
      <Component ref={ref} {...props}/>
    </Tabs.Content>);
});
Content.displayName = 'ContentWebTabs';
export { Content, List, Root, Trigger, useTabsContext, useTriggerContext };
