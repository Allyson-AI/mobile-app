import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
import { ToggleGroupUtils } from '~/components/primitives/utils';
const Root = React.forwardRef(({ asChild, orientation: _orientation, dir: _dir, loop: _loop, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='toolbar' {...props}/>;
});
Root.displayName = 'RootNativeToolbar';
const ToggleGroupContext = React.createContext(null);
const ToggleGroup = React.forwardRef(({ asChild, type, value, onValueChange, disabled = false, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<ToggleGroupContext.Provider value={{
            type,
            value,
            disabled,
            onValueChange,
        }}>
        <Component ref={ref} role='group' {...viewProps}/>
      </ToggleGroupContext.Provider>);
});
ToggleGroup.displayName = 'ToggleGroupNativeToolbar';
function useToggleGroupContext() {
    const context = React.useContext(ToggleGroupContext);
    if (!context) {
        throw new Error('ToggleGroup compound components cannot be rendered outside the ToggleGroup component');
    }
    return context;
}
const ToggleItem = React.forwardRef(({ asChild, value: itemValue, disabled: disabledProp = false, onPress: onPressProp, ...props }, ref) => {
    const { type, disabled, value, onValueChange } = useToggleGroupContext();
    function onPress(ev) {
        if (disabled || disabledProp)
            return;
        if (type === 'single') {
            onValueChange(ToggleGroupUtils.getNewSingleValue(value, itemValue));
        }
        if (type === 'multiple') {
            onValueChange(ToggleGroupUtils.getNewMultipleValue(value, itemValue));
        }
        onPressProp?.(ev);
    }
    const isChecked = type === 'single'
        ? ToggleGroupUtils.getIsSelected(value, itemValue)
        : undefined;
    const isSelected = type === 'multiple'
        ? ToggleGroupUtils.getIsSelected(value, itemValue)
        : undefined;
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled} role={type === 'single' ? 'radio' : 'checkbox'} onPress={onPress} aria-checked={isChecked} aria-selected={isSelected} disabled={(disabled || disabledProp) ?? false} accessibilityState={{
            disabled: (disabled || disabledProp) ?? false,
            checked: isChecked,
            selected: isSelected,
        }} {...props}/>);
});
ToggleItem.displayName = 'ToggleItemNativeToolbar';
const Separator = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component role={'separator'} ref={ref} {...props}/>;
});
Separator.displayName = 'SeparatorNativeToolbar';
const Link = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} role='link' {...props}/>;
});
Link.displayName = 'LinkNativeToolbar';
const Button = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} role='button' {...props}/>;
});
export { Button, Link, Root, Separator, ToggleGroup, ToggleItem };
