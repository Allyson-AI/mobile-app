import * as React from 'react';
import { BackHandler, Pressable, Text, View, } from 'react-native';
import { Portal as RNPPortal } from '~/components/primitives/portal';
import * as Slot from '~/components/primitives/slot';
const DialogContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const Component = asChild ? Slot.View : View;
    return (<DialogContext.Provider value={{
            open,
            onOpenChange,
            nativeID,
        }}>
        <Component ref={ref} {...viewProps}/>
      </DialogContext.Provider>);
});
Root.displayName = 'RootNativeDialog';
function useDialogContext() {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('Dialog compound components cannot be rendered outside the Dialog component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { open, onOpenChange } = useDialogContext();
    function onPress(ev) {
        if (disabled)
            return;
        const newValue = !open;
        onOpenChange(newValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Trigger.displayName = 'TriggerNativeDialog';
/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const value = useDialogContext();
    if (!forceMount) {
        if (!value.open) {
            return null;
        }
    }
    return (<RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
      <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
    </RNPPortal>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, closeOnPress = true, onPress: OnPressProp, ...props }, ref) => {
    const { open, onOpenChange } = useDialogContext();
    function onPress(ev) {
        if (closeOnPress) {
            onOpenChange(!open);
        }
        OnPressProp?.(ev);
    }
    if (!forceMount) {
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} onPress={onPress} {...props}/>;
});
Overlay.displayName = 'OverlayNativeDialog';
const Content = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const { open, nativeID, onOpenChange } = useDialogContext();
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
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} role='dialog' nativeID={nativeID} aria-labelledby={`${nativeID}_label`} aria-describedby={`${nativeID}_desc`} aria-modal={true} onStartShouldSetResponder={onStartShouldSetResponder} {...props}/>);
});
Content.displayName = 'ContentNativeDialog';
const Close = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useDialogContext();
    function onPress(ev) {
        if (disabled)
            return;
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Close.displayName = 'CloseNativeDialog';
const Title = React.forwardRef((props, ref) => {
    const { nativeID } = useDialogContext();
    return (<Text ref={ref} role='heading' nativeID={`${nativeID}_label`} {...props}/>);
});
Title.displayName = 'TitleNativeDialog';
const Description = React.forwardRef((props, ref) => {
    const { nativeID } = useDialogContext();
    return <Text ref={ref} nativeID={`${nativeID}_desc`} {...props}/>;
});
Description.displayName = 'DescriptionNativeDialog';
export { Close, Content, Description, Overlay, Portal, Root, Title, Trigger, useDialogContext, };
function onStartShouldSetResponder() {
    return true;
}
