import * as React from 'react';
import { View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, ratio = 1, style, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} style={[style, { aspectRatio: ratio }]} {...props}/>);
});
Root.displayName = 'RootAspectRatio';
export { Root };
