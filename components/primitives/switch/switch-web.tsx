import * as Switch from '@radix-ui/react-switch';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot/slot-native';
const Root = React.forwardRef(({ asChild, checked, onCheckedChange, disabled, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    function onPress(ev) {
        onCheckedChange(!checked);
        onPressProp?.(ev);
    }
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === ' ') {
            onCheckedChange(!checked);
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Switch.Root checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} asChild>
        <Component ref={ref} disabled={disabled} onPress={onPress} 
    // @ts-expect-error Web only
    onKeyDown={onKeyDown} {...props}/>
      </Switch.Root>);
});
Root.displayName = 'RootWebSwitch';
const Thumb = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Switch.Thumb asChild>
        <Component ref={ref} {...props}/>
      </Switch.Thumb>);
});
Root.displayName = 'RootWebSwitch';
export { Root, Thumb };
