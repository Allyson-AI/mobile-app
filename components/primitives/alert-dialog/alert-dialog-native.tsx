import * as React from 'react';
import { BackHandler, Pressable, Text, View, } from 'react-native';
import { Portal as RNPPortal } from '~/components/primitives/portal';
import * as Slot from '~/components/primitives/slot';
const AlertDialogContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open: value, onOpenChange, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const Component = asChild ? Slot.View : View;
    return (<AlertDialogContext.Provider value={{
            open: value,
            onOpenChange,
            nativeID,
        }}>
      <Component ref={ref} {...viewProps}/>
    </AlertDialogContext.Provider>);
});
Root.displayName = 'RootNativeAlertDialog';
function useAlertDialogContext() {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error('AlertDialog compound components cannot be rendered outside the AlertDialog component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { open: value, onOpenChange } = useAlertDialogContext();
    function onPress(ev) {
        if (disabled)
            return;
        const newValue = !value;
        onOpenChange(newValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Trigger.displayName = 'TriggerNativeAlertDialog';
/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const value = useAlertDialogContext();
    if (!forceMount) {
        if (!value.open) {
            return null;
        }
    }
    return (<RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
      <AlertDialogContext.Provider value={value}>
        {children}
      </AlertDialogContext.Provider>
    </RNPPortal>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const { open: value } = useAlertDialogContext();
    if (!forceMount) {
        if (!value) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} {...props}/>;
});
Overlay.displayName = 'OverlayNativeAlertDialog';
const Content = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const { open: value, nativeID, onOpenChange } = useAlertDialogContext();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onOpenChange(false);
            return true;
        });
        return () => {
            backHandler.remove();
        };
    }, []);
    if (!forceMount) {
        if (!value) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} role='alertdialog' nativeID={nativeID} aria-labelledby={`${nativeID}_label`} aria-describedby={`${nativeID}_desc`} aria-modal={true} {...props}/>);
});
Content.displayName = 'ContentNativeAlertDialog';
const Cancel = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useAlertDialogContext();
    function onPress(ev) {
        if (disabled)
            return;
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Cancel.displayName = 'CloseNativeAlertDialog';
const Action = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useAlertDialogContext();
    function onPress(ev) {
        if (disabled)
            return;
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Action.displayName = 'ActionNativeAlertDialog';
const Title = React.forwardRef(({ asChild, ...props }, ref) => {
    const { nativeID } = useAlertDialogContext();
    const Component = asChild ? Slot.Text : Text;
    return (<Component ref={ref} role='heading' nativeID={`${nativeID}_label`} {...props}/>);
});
Title.displayName = 'TitleNativeAlertDialog';
const Description = React.forwardRef(({ asChild, ...props }, ref) => {
    const { nativeID } = useAlertDialogContext();
    const Component = asChild ? Slot.Text : Text;
    return <Component ref={ref} nativeID={`${nativeID}_desc`} {...props}/>;
});
Description.displayName = 'DescriptionNativeAlertDialog';
export { Action, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, useAlertDialogContext, };
