import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, checked, onCheckedChange, disabled, onPress: onPressProp, 'aria-valuetext': ariaValueText, ...props }, ref) => {
    function onPress(ev) {
        if (disabled)
            return;
        onCheckedChange(!checked);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled} role='switch' aria-checked={checked} aria-valuetext={ariaValueText ?? checked ? 'on' : 'off'} onPress={onPress} accessibilityState={{
            checked,
            disabled,
        }} disabled={disabled} {...props}/>);
});
Root.displayName = 'RootNativeSwitch';
const Thumb = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='presentation' {...props}/>;
});
Root.displayName = 'RootNativeSwitch';
export { Root, Thumb };
