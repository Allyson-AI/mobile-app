import * as React from 'react';
import { BackHandler, Pressable, Text, View, } from 'react-native';
import { useRelativePosition, } from '~/components/primitives/hooks';
import { Portal as RNPPortal } from '~/components/primitives/portal';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, relativeTo = 'longPress', ...viewProps }, ref) => {
    const nativeID = React.useId();
    const [pressPosition, setPressPosition] = React.useState(null);
    const [contentLayout, setContentLayout] = React.useState(null);
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{
            open,
            onOpenChange,
            relativeTo,
            contentLayout,
            nativeID,
            pressPosition,
            setContentLayout,
            setPressPosition,
        }}>
        <Component ref={ref} {...viewProps}/>
      </RootContext.Provider>);
});
Root.displayName = 'RootNativeContextMenu';
function useContextMenuContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('ContextMenu compound components cannot be rendered outside the ContextMenu component');
    }
    return context;
}
const accessibilityActions = [{ name: 'longpress' }];
const Trigger = React.forwardRef(({ asChild, onLongPress: onLongPressProp, disabled = false, onAccessibilityAction: onAccessibilityActionProp, ...props }, ref) => {
    const triggerRef = React.useRef(null);
    const { open, onOpenChange, relativeTo, setPressPosition } = useContextMenuContext();
    React.useImperativeHandle(ref, () => {
        if (!triggerRef.current) {
            return new View({});
        }
        return triggerRef.current;
    }, [triggerRef.current]);
    function onLongPress(ev) {
        if (disabled)
            return;
        if (relativeTo === 'longPress') {
            setPressPosition({
                width: 0,
                pageX: ev.nativeEvent.pageX,
                pageY: ev.nativeEvent.pageY,
                height: 0,
            });
        }
        if (relativeTo === 'trigger') {
            triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                setPressPosition({ width, pageX, pageY: pageY, height });
            });
        }
        onOpenChange(!open);
        onLongPressProp?.(ev);
    }
    function onAccessibilityAction(event) {
        if (disabled)
            return;
        if (event.nativeEvent.actionName === 'longpress') {
            setPressPosition({
                width: 0,
                pageX: 0,
                pageY: 0,
                height: 0,
            });
            const newValue = !open;
            onOpenChange(newValue);
        }
        onAccessibilityActionProp?.(event);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={triggerRef} aria-disabled={disabled ?? undefined} role='button' onLongPress={onLongPress} disabled={disabled ?? undefined} aria-expanded={open} accessibilityActions={accessibilityActions} onAccessibilityAction={onAccessibilityAction} {...props}/>);
});
Trigger.displayName = 'TriggerNativeContextMenu';
/**
 * @warning when using a custom `<PortalHost />`, you will have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const value = useContextMenuContext();
    if (!value.pressPosition) {
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
    const { open, onOpenChange, setContentLayout, setPressPosition } = useContextMenuContext();
    function onPress(ev) {
        if (closeOnPress) {
            setPressPosition(null);
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
Overlay.displayName = 'OverlayNativeContextMenu';
const Content = React.forwardRef(({ asChild = false, forceMount, align = 'start', side = 'bottom', sideOffset = 0, alignOffset = 0, avoidCollisions = true, onLayout: onLayoutProp, insets, style, disablePositioningStyle, ...props }, ref) => {
    const { open, onOpenChange, contentLayout, nativeID, pressPosition, setContentLayout, setPressPosition, } = useContextMenuContext();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setPressPosition(null);
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
        triggerPosition: pressPosition,
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
    return (<Component ref={ref} role='menu' nativeID={nativeID} aria-modal={true} style={[positionStyle, style]} onLayout={onLayout} onStartShouldSetResponder={onStartShouldSetResponder} {...props}/>);
});
Content.displayName = 'ContentNativeContextMenu';
const Item = React.forwardRef(({ asChild, textValue, onPress: onPressProp, disabled = false, closeOnPress = true, ...props }, ref) => {
    const { onOpenChange, setContentLayout, setPressPosition } = useContextMenuContext();
    function onPress(ev) {
        if (closeOnPress) {
            setPressPosition(null);
            setContentLayout(null);
            onOpenChange(false);
        }
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} role='menuitem' onPress={onPress} disabled={disabled} aria-valuetext={textValue} aria-disabled={!!disabled} accessibilityState={{ disabled: !!disabled }} {...props}/>);
});
Item.displayName = 'ItemNativeContextMenu';
const Group = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='group' {...props}/>;
});
Group.displayName = 'GroupNativeContextMenu';
const Label = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return <Component ref={ref} {...props}/>;
});
Label.displayName = 'LabelNativeContextMenu';
const FormItemContext = React.createContext(null);
const CheckboxItem = React.forwardRef(({ asChild, checked, onCheckedChange, textValue, onPress: onPressProp, closeOnPress = true, disabled = false, ...props }, ref) => {
    const { onOpenChange, setContentLayout, setPressPosition, nativeID } = useContextMenuContext();
    function onPress(ev) {
        onCheckedChange(!checked);
        if (closeOnPress) {
            setPressPosition(null);
            setContentLayout(null);
            onOpenChange(false);
        }
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<FormItemContext.Provider value={{ checked }}>
        <Component ref={ref} key={`checkbox-${nativeID}-${checked}`} role='checkbox' aria-checked={checked} onPress={onPress} disabled={disabled} aria-disabled={!!disabled} aria-valuetext={textValue} accessibilityState={{ disabled: !!disabled }} {...props}/>
      </FormItemContext.Provider>);
});
CheckboxItem.displayName = 'CheckboxItemNativeContextMenu';
function useFormItemContext() {
    const context = React.useContext(FormItemContext);
    if (!context) {
        throw new Error('CheckboxItem or RadioItem compound components cannot be rendered outside of a CheckboxItem or RadioItem component');
    }
    return context;
}
const RadioGroup = React.forwardRef(({ asChild, value, onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<FormItemContext.Provider value={{ value, onValueChange }}>
      <Component ref={ref} role='radiogroup' {...props}/>
    </FormItemContext.Provider>);
});
RadioGroup.displayName = 'RadioGroupNativeContextMenu';
const RadioItemContext = React.createContext({});
const RadioItem = React.forwardRef(({ asChild, value: itemValue, textValue, onPress: onPressProp, disabled = false, closeOnPress = true, ...props }, ref) => {
    const { onOpenChange, setContentLayout, setPressPosition } = useContextMenuContext();
    const { value, onValueChange } = useFormItemContext();
    function onPress(ev) {
        onValueChange(itemValue);
        if (closeOnPress) {
            setPressPosition(null);
            setContentLayout(null);
            onOpenChange(false);
        }
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<RadioItemContext.Provider value={{ itemValue }}>
        <Component ref={ref} onPress={onPress} role='radio' aria-checked={value === itemValue} disabled={disabled ?? false} accessibilityState={{
            disabled: disabled ?? false,
            checked: value === itemValue,
        }} aria-valuetext={textValue} {...props}/>
      </RadioItemContext.Provider>);
});
RadioItem.displayName = 'RadioItemNativeContextMenu';
function useItemIndicatorContext() {
    return React.useContext(RadioItemContext);
}
const ItemIndicator = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const { itemValue } = useItemIndicatorContext();
    const { checked, value } = useFormItemContext();
    if (!forceMount) {
        if (itemValue == null && !checked) {
            return null;
        }
        if (value !== itemValue) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='presentation' {...props}/>;
});
ItemIndicator.displayName = 'ItemIndicatorNativeContextMenu';
const Separator = React.forwardRef(({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Component role={decorative ? 'presentation' : 'separator'} ref={ref} {...props}/>);
});
Separator.displayName = 'SeparatorNativeContextMenu';
const SubContext = React.createContext(null);
const Sub = React.forwardRef(({ asChild, open, onOpenChange, ...props }, ref) => {
    const nativeID = React.useId();
    const Component = asChild ? Slot.View : View;
    return (<SubContext.Provider value={{
            nativeID,
            open,
            onOpenChange,
        }}>
        <Component ref={ref} {...props}/>
      </SubContext.Provider>);
});
Sub.displayName = 'SubNativeContextMenu';
function useSubContext() {
    const context = React.useContext(SubContext);
    if (!context) {
        throw new Error('Sub compound components cannot be rendered outside of a Sub component');
    }
    return context;
}
const SubTrigger = React.forwardRef(({ asChild, textValue, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { nativeID, open, onOpenChange } = useSubContext();
    function onPress(ev) {
        onOpenChange(!open);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} key={`sub-trigger-${nativeID}-${open}`} aria-valuetext={textValue} role='menuitem' aria-expanded={open} accessibilityState={{ expanded: open, disabled: !!disabled }} nativeID={nativeID} onPress={onPress} disabled={disabled} aria-disabled={!!disabled} {...props}/>);
});
SubTrigger.displayName = 'SubTriggerNativeContextMenu';
const SubContent = React.forwardRef(({ asChild = false, forceMount, ...props }, ref) => {
    const { open, nativeID } = useSubContext();
    if (!forceMount) {
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} role='group' aria-labelledby={nativeID} {...props}/>);
});
Content.displayName = 'ContentNativeContextMenu';
export { CheckboxItem, Content, Group, Item, ItemIndicator, Label, Overlay, Portal, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger, useContextMenuContext, useSubContext, };
function onStartShouldSetResponder() {
    return true;
}
