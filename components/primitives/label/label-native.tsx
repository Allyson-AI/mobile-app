import * as React from 'react';
import { Pressable, Text as RNText } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props}/>;
});
Root.displayName = 'RootNativeLabel';
const Text = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : RNText;
    return <Component ref={ref} {...props}/>;
});
Text.displayName = 'TextNativeLabel';
export { Root, Text };
