import * as React from 'react';
import { BackHandler, Pressable, Text, View, } from 'react-native';
import { useRelativePosition, } from '~/components/primitives/hooks';
import { Portal as RNPPortal } from '~/components/primitives/portal';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const [triggerPosition, setTriggerPosition] = React.useState(null);
    const [contentLayout, setContentLayout] = React.useState(null);
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{
            value,
            onValueChange,
            nativeID,
            contentLayout,
            setContentLayout,
            setTriggerPosition,
            triggerPosition,
        }}>
        <Component ref={ref} {...viewProps}/>
      </RootContext.Provider>);
});
Root.displayName = 'RootMenubar';
function useMenubarContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
    }
    return context;
}
const MenuContext = React.createContext(null);
const Menu = React.forwardRef(({ asChild, value, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<MenuContext.Provider value={{
            value,
        }}>
        <Component ref={ref} role='menubar' {...viewProps}/>
      </MenuContext.Provider>);
});
Menu.displayName = 'MenuMenubar';
function useMenuContext() {
    const context = React.useContext(MenuContext);
    if (!context) {
        throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const triggerRef = React.useRef(null);
    const { value, onValueChange, setTriggerPosition } = useMenubarContext();
    const { value: menuValue } = useMenuContext();
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
            setTriggerPosition({ width, pageX, pageY, height });
        });
        onValueChange(menuValue === value ? undefined : menuValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={triggerRef} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} aria-expanded={value === menuValue} {...props}/>);
});
Trigger.displayName = 'TriggerMenubar';
/**
 * @warning when using a custom `<PortalHost />`, you will have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const menubar = useMenubarContext();
    const menu = useMenuContext();
    if (!menubar.triggerPosition) {
        return null;
    }
    if (!forceMount) {
        if (menubar.value !== menu.value) {
            return null;
        }
    }
    return (<RNPPortal hostName={hostName} name={`${menubar.nativeID}_portal`}>
      <RootContext.Provider value={menubar} key={`RootContext_${menubar.nativeID}_portal_provider`}>
        <MenuContext.Provider value={menu} key={`MenuContext_${menubar.nativeID}_portal_provider`}>
          {children}
        </MenuContext.Provider>
      </RootContext.Provider>
    </RNPPortal>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, onPress: OnPressProp, closeOnPress = true, ...props }, ref) => {
    const { value, onValueChange, setContentLayout, setTriggerPosition } = useMenubarContext();
    function onPress(ev) {
        if (closeOnPress) {
            setTriggerPosition(null);
            setContentLayout(null);
            onValueChange(undefined);
        }
        OnPressProp?.(ev);
    }
    if (!forceMount) {
        if (!value) {
            return null;
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} onPress={onPress} {...props}/>;
});
Overlay.displayName = 'OverlayMenubar';
/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = React.forwardRef(({ asChild = false, forceMount, align = 'start', side = 'bottom', sideOffset = 0, alignOffset = 0, avoidCollisions = true, onLayout: onLayoutProp, insets, style, disablePositioningStyle, ...props }, ref) => {
    const { value, onValueChange, triggerPosition, contentLayout, setContentLayout, nativeID, setTriggerPosition, } = useMenubarContext();
    const { value: menuValue } = useMenuContext();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null);
            setContentLayout(null);
            onValueChange(undefined);
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
        if (value !== menuValue) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} role='menu' nativeID={nativeID} aria-modal={true} style={[positionStyle, style]} onLayout={onLayout} onStartShouldSetResponder={onStartShouldSetResponder} {...props}/>);
});
Content.displayName = 'ContentMenubar';
const Item = React.forwardRef(({ asChild, textValue, onPress: onPressProp, disabled = false, closeOnPress = true, ...props }, ref) => {
    const { onValueChange, setContentLayout, setTriggerPosition } = useMenubarContext();
    function onPress(ev) {
        if (closeOnPress) {
            setTriggerPosition(null);
            setContentLayout(null);
            onValueChange(undefined);
        }
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={ref} role='menuitem' onPress={onPress} disabled={disabled} aria-valuetext={textValue} aria-disabled={!!disabled} accessibilityState={{ disabled: !!disabled }} {...props}/>);
});
Item.displayName = 'ItemMenubar';
const Group = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='group' {...props}/>;
});
Group.displayName = 'GroupMenubar';
const Label = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return <Component ref={ref} {...props}/>;
});
Label.displayName = 'LabelMenubar';
const FormItemContext = React.createContext(null);
const CheckboxItem = React.forwardRef(({ asChild, checked, onCheckedChange, textValue, onPress: onPressProp, closeOnPress = true, disabled = false, ...props }, ref) => {
    const { onValueChange, setTriggerPosition, setContentLayout, nativeID } = useMenubarContext();
    function onPress(ev) {
        onCheckedChange(!checked);
        if (closeOnPress) {
            setTriggerPosition(null);
            setContentLayout(null);
            onValueChange(undefined);
        }
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<FormItemContext.Provider value={{ checked }}>
        <Component ref={ref} key={`checkbox-${nativeID}-${checked}`} role='checkbox' aria-checked={checked} onPress={onPress} disabled={disabled} aria-disabled={!!disabled} aria-valuetext={textValue} accessibilityState={{ disabled: !!disabled }} {...props}/>
      </FormItemContext.Provider>);
});
CheckboxItem.displayName = 'CheckboxItemMenubar';
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
RadioGroup.displayName = 'RadioGroupMenubar';
const RadioItemContext = React.createContext({});
const RadioItem = React.forwardRef(({ asChild, value: itemValue, textValue, onPress: onPressProp, disabled = false, closeOnPress = true, ...props }, ref) => {
    const { onValueChange: onRootValueChange, setTriggerPosition, setContentLayout, } = useMenubarContext();
    const { value, onValueChange } = useFormItemContext();
    function onPress(ev) {
        onValueChange(itemValue);
        if (closeOnPress) {
            setTriggerPosition(null);
            setContentLayout(null);
            onRootValueChange(undefined);
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
RadioItem.displayName = 'RadioItemMenubar';
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
ItemIndicator.displayName = 'ItemIndicatorMenubar';
const Separator = React.forwardRef(({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Component role={decorative ? 'presentation' : 'separator'} ref={ref} {...props}/>);
});
Separator.displayName = 'SeparatorMenubar';
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
Sub.displayName = 'SubMenubar';
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
    return (<Component ref={ref} aria-valuetext={textValue} role='menuitem' aria-expanded={open} accessibilityState={{ expanded: open, disabled: !!disabled }} nativeID={nativeID} onPress={onPress} disabled={disabled} aria-disabled={!!disabled} {...props}/>);
});
SubTrigger.displayName = 'SubTriggerMenubar';
const SubContent = React.forwardRef(({ asChild = false, forceMount, ...props }, ref) => {
    const { open, nativeID } = useSubContext();
    if (!forceMount) {
        if (!open) {
            return null;
        }
    }
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} role='group' aria-labelledby={nativeID} {...props}/>);
});
SubContent.displayName = 'SubContentMenubar';
export { CheckboxItem, Content, Group, Item, ItemIndicator, Label, Menu, Overlay, Portal, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger, useMenuContext, useMenubarContext, useSubContext, };
function onStartShouldSetResponder() {
    return true;
}
