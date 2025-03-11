import * as Progress from '@radix-ui/react-progress';
import * as React from 'react';
import { View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const ProgressContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, max, getValueLabel, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<ProgressContext.Provider value={{ value, max }}>
        <Progress.Root value={value} max={max} getValueLabel={getValueLabel} asChild>
          <Component ref={ref} {...props}/>
        </Progress.Root>
      </ProgressContext.Provider>);
});
Root.displayName = 'RootProgress';
const Indicator = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Progress.Indicator asChild>
        <Component ref={ref} {...props}/>
      </Progress.Indicator>);
});
Indicator.displayName = 'IndicatorProgress';
export { Indicator, Root };
