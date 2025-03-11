import * as RadioGroup from '@radix-ui/react-radio-group';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const RadioGroupContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, disabled = false, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<RadioGroupContext.Provider value={{
            value,
            disabled,
            onValueChange,
        }}>
      <RadioGroup.Root value={value} onValueChange={onValueChange} disabled={disabled} asChild>
        <Component ref={ref} {...viewProps}/>
      </RadioGroup.Root>
    </RadioGroupContext.Provider>);
});
Root.displayName = 'RootRadioGroup';
function useRadioGroupContext() {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
        throw new Error('RadioGroup compound components cannot be rendered outside the RadioGroup component');
    }
    return context;
}
const Item = React.forwardRef(({ asChild, value, onPress: onPressProps, ...props }, ref) => {
    const { onValueChange } = useRadioGroupContext();
    function onPress(ev) {
        if (onPressProps) {
            onPressProps(ev);
        }
        onValueChange(value);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<RadioGroup.Item value={value} asChild>
      <Component ref={ref} onPress={onPress} {...props}/>
    </RadioGroup.Item>);
});
Item.displayName = 'ItemRadioGroup';
const Indicator = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<RadioGroup.Indicator asChild>
      <Component ref={ref} {...props}/>
    </RadioGroup.Indicator>);
});
Indicator.displayName = 'IndicatorRadioGroup';
export { Indicator, Item, Root };
