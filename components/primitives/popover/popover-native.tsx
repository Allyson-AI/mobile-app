import * as React from 'react';
import { BackHandler, Pressable, View, } from 'react-native';
import { useRelativePosition, } from '~/components/primitives/hooks';
import { Portal as RNPPortal } from '~/components/primitives/portal';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const [triggerPosition, setTriggerPosition] = React.useState(null);
    const [contentLayout, setContentLayout] = React.useState(null);
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{
            open,
            onOpenChange,
            contentLayout,
            nativeID,
            setContentLayout,
            setTriggerPosition,
            triggerPosition,
        }}>
        <Component ref={ref} {...viewProps}/>
      </RootContext.Provider>);
});
Root.displayName = 'RootNativePopover';
function usePopoverContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('Popover compound components cannot be rendered outside the Popover component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const triggerRef = React.useRef(null);
    const { open, onOpenChange, setTriggerPosition } = usePopoverContext();
    React.useImperativeHandle(ref, () => {
        if (!triggerRef.current) {
            return new View({});
        }
        return triggerRef.current;
    }, [triggerRef.current]);
    function onPress(ev) {
        if (disabled)
            return;
        triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
            setTriggerPosition({ width, pageX, pageY: pageY, height });
        });
        const newValue = !open;
        onOpenChange(newValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={triggerRef} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Trigger.displayName = 'TriggerNativePopover';
/**
 * @warning when using a custom `<PortalHost />`, you might have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const value = usePopoverContext();
    if (!value.triggerPosition) {
        return null;
    }
    if (!forceMount) {
        if (!value.open) {
            return null;
        }
    }
    return (<RNPPortal hostName={hostName} name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </RNPPortal>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, onPress: OnPressProp, closeOnPress = true, ...props }, ref) => {
    const { open, onOpenChange, setTriggerPosition, setContentLayout } = usePopoverContext();
    function onPress(ev) {
        if (closeOnPress) {
            setTriggerPosition(null);
            setContentLayout(null);
            onOpenChange(false);
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
Overlay.displayName = 'OverlayNativePopover';
/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = React.forwardRef(({ asChild = false, forceMount, align = 'start', side = 'bottom', sideOffset = 0, alignOffset = 0, avoidCollisions = true, onLayout: onLayoutProp, insets, style, disablePositioningStyle, ...props }, ref) => {
    const { open, onOpenChange, contentLayout, nativeID, setContentLayout, setTriggerPosition, triggerPosition, } = usePopoverContext();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null);
            setContentLayout(null);
            onOpenChange(false);
            return true;
        });
        return () => {
            setContentLayout(null);
            backHandler.remove();
        };
    }, []);
    const positionStyle = useRelativePosition({
        align,
        avoidCollisions,
        triggerPosition,
        contentLayout,
        alignOffset,
        insets,
        sideOffset,
        side,
        disablePositioningStyle,
    });
    function onLayout(event) {
        setContentLayout(event.nativeEvent.layout);
        onLayoutProp?.(event);
    }
    if (!forceMount) {
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} role='dialog' nativeID={nativeID} aria-modal={true} style={[positionStyle, style]} onLayout={onLayout} onStartShouldSetResponder={onStartShouldSetResponder} {...props}/>);
});
Content.displayName = 'ContentNativePopover';
const Close = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange, setContentLayout, setTriggerPosition } = usePopoverContext();
    function onPress(ev) {
        if (disabled)
            return;
        setTriggerPosition(null);
        setContentLayout(null);
        onOpenChange(false);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} {...props}/>);
});
Close.displayName = 'CloseNativePopover';
export { Close, Content, Overlay, Portal, Root, Trigger, usePopoverContext };
function onStartShouldSetResponder() {
    return true;
}
