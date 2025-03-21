import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const CollapsibleContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, disabled = false, open, onOpenChange, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const Component = asChild ? Slot.View : View;
    return (<CollapsibleContext.Provider value={{
            disabled,
            open,
            onOpenChange,
            nativeID,
        }}>
      <Component ref={ref} {...viewProps}/>
    </CollapsibleContext.Provider>);
});
Root.displayName = 'RootNativeCollapsible';
function useCollapsibleContext() {
    const context = React.useContext(CollapsibleContext);
    if (!context) {
        throw new Error('Collapsible compound components cannot be rendered outside the Collapsible component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled: disabledProp = false, ...props }, ref) => {
    const { disabled, open, onOpenChange, nativeID } = useCollapsibleContext();
    function onPress(ev) {
        if (disabled || disabledProp)
            return;
        onOpenChange(!open);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component key={`trigger-${nativeID}-${open}`} ref={ref} nativeID={nativeID} aria-disabled={(disabled || disabledProp) ?? undefined} role='button' onPress={onPress} accessibilityState={{
            expanded: open,
            disabled: (disabled || disabledProp) ?? undefined,
        }} disabled={disabled || disabledProp} {...props}/>);
});
Trigger.displayName = 'TriggerNativeCollapsible';
const Content = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const { nativeID, open } = useCollapsibleContext();
    if (!forceMount) {
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} aria-hidden={!(forceMount || open)} aria-labelledby={nativeID} role={'region'} {...props}/>);
});
Content.displayName = 'ContentNativeCollapsible';
export { Content, Root, Trigger };
