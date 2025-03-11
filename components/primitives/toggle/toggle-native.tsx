import * as React from 'react';
import { Pressable } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, pressed, onPressedChange, disabled, onPress: onPressProp, ...props }, ref) => {
    function onPress(ev) {
        if (disabled)
            return;
        const newValue = !pressed;
        onPressedChange(newValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled} role='switch' aria-selected={pressed} onPress={onPress} accessibilityState={{
            selected: pressed,
            disabled,
        }} disabled={disabled} {...props}/>);
});
Root.displayName = 'RootNativeToggle';
export { Root };
