import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
import { ToggleGroupUtils } from '~/components/primitives/utils';
const ToggleGroupContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, type, value, onValueChange, disabled = false, rovingFocus: _rovingFocus, orientation: _orientation, dir: _dir, loop: _loop, ...viewProps }, ref) => {
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
Root.displayName = 'RootToggleGroup';
function useToggleGroupContext() {
    const context = React.useContext(ToggleGroupContext);
    if (!context) {
        throw new Error('ToggleGroup compound components cannot be rendered outside the ToggleGroup component');
    }
    return context;
}
const ItemContext = React.createContext(null);
const Item = React.forwardRef(({ asChild, value: itemValue, disabled: disabledProp = false, onPress: onPressProp, ...props }, ref) => {
    const id = React.useId();
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
    return (<ItemContext.Provider value={{ value: itemValue }}>
        <Component ref={ref} key={`${id}-item-${value}`} aria-disabled={disabled} role={type === 'single' ? 'radio' : 'checkbox'} onPress={onPress} aria-checked={isChecked} aria-selected={isSelected} disabled={(disabled || disabledProp) ?? false} accessibilityState={{
            disabled: (disabled || disabledProp) ?? false,
            checked: isChecked,
            selected: isSelected,
        }} {...props}/>
      </ItemContext.Provider>);
});
Item.displayName = 'ItemToggleGroup';
function useItemContext() {
    const context = React.useContext(ItemContext);
    if (!context) {
        throw new Error('ToggleGroupItem compound components cannot be rendered outside the ToggleGroupItem component');
    }
    return context;
}
export { Item, Root, useItemContext, useToggleGroupContext };
