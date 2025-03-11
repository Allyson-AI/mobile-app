import * as React from 'react';
import { Pressable, Text, View, } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const ToastContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, type = 'foreground', open, onOpenChange, portalHostName, ...viewProps }, ref) => {
    const nativeID = React.useId();
    if (!open) {
        return null;
    }
    const Component = asChild ? Slot.View : View;
    return (<ToastContext.Provider value={{
            open,
            onOpenChange,
            type,
            nativeID,
        }}>
        <Component ref={ref} role='status' aria-live={type === 'foreground' ? 'assertive' : 'polite'} {...viewProps}/>
      </ToastContext.Provider>);
});
Root.displayName = 'RootToast';
function useToastContext() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('Toast compound components cannot be rendered outside the Toast component');
    }
    return context;
}
const Close = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useToastContext();
    function onPress(ev) {
        if (disabled)
            return;
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Close.displayName = 'CloseToast';
const Action = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useToastContext();
    function onPress(ev) {
        if (disabled)
            return;
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Action.displayName = 'ActionToast';
const Title = React.forwardRef(({ asChild, ...props }, ref) => {
    const { nativeID } = useToastContext();
    const Component = asChild ? Slot.Text : Text;
    return (<Component ref={ref} role='heading' nativeID={`${nativeID}_label`} {...props}/>);
});
Title.displayName = 'TitleToast';
const Description = React.forwardRef(({ asChild, ...props }, ref) => {
    const { nativeID } = useToastContext();
    const Component = asChild ? Slot.Text : Text;
    return <Component ref={ref} nativeID={`${nativeID}_desc`} {...props}/>;
});
Description.displayName = 'DescriptionToast';
export { Action, Close, Description, Root, Title };
