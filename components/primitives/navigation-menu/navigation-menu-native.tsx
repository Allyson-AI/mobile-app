import * as React from 'react';
import { BackHandler, Pressable, View, } from 'react-native';
import { useRelativePosition, } from '~/components/primitives/hooks/useRelativePosition';
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
      <Component ref={ref} role='navigation' {...viewProps}/>
    </RootContext.Provider>);
});
Root.displayName = 'RootNativeNavigationMenu';
function useNavigationMenuContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('NavigationMenu compound components cannot be rendered outside the NavigationMenu component');
    }
    return context;
}
const List = React.forwardRef(({ asChild, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='menubar' {...viewProps}/>;
});
List.displayName = 'ListNativeNavigationMenu';
const ItemContext = React.createContext(null);
const Item = React.forwardRef(({ asChild, value, ...viewProps }, ref) => {
    const nativeID = React.useId();
    const Component = asChild ? Slot.View : View;
    return (<ItemContext.Provider value={{
            value,
            nativeID,
        }}>
      <Component ref={ref} role='menuitem' {...viewProps}/>
    </ItemContext.Provider>);
});
Item.displayName = 'ItemNativeNavigationMenu';
function useItemContext() {
    const context = React.useContext(ItemContext);
    if (!context) {
        throw new Error('NavigationMenu compound components cannot be rendered outside the NavigationMenu component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const triggerRef = React.useRef(null);
    const { value, onValueChange, setTriggerPosition } = useNavigationMenuContext();
    const { value: menuValue } = useItemContext();
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
        onValueChange(menuValue === value ? '' : menuValue);
        onPressProp?.(ev);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Component ref={triggerRef} aria-disabled={disabled ?? undefined} role='button' onPress={onPress} disabled={disabled ?? undefined} aria-expanded={value === menuValue} {...props}/>);
});
Trigger.displayName = 'TriggerNativeNavigationMenu';
/**
 * @warning when using a custom `<PortalHost />`, you will have to adjust the Content's sideOffset to account for nav elements like headers.
 */
function Portal({ forceMount, hostName, children }) {
    const navigationMenu = useNavigationMenuContext();
    const item = useItemContext();
    if (!navigationMenu.triggerPosition) {
        return null;
    }
    if (!forceMount) {
        if (navigationMenu.value !== item.value) {
            return null;
        }
    }
    return (<RNPPortal hostName={hostName} name={`${navigationMenu.nativeID}_portal_provider`}>
      <RootContext.Provider value={navigationMenu} key={`RootContext_${navigationMenu.nativeID}_portal_provider`}>
        <ItemContext.Provider value={item}>{children}</ItemContext.Provider>
      </RootContext.Provider>
    </RNPPortal>);
}
/**
 * @info `position`, `top`, `left`, and `maxWidth` style properties are controlled internally. Opt out of this behavior by setting `disablePositioningStyle` to `true`.
 */
const Content = React.forwardRef(({ asChild = false, forceMount, align = 'center', side = 'bottom', sideOffset = 0, alignOffset = 0, avoidCollisions = true, onLayout: onLayoutProp, insets, style, disablePositioningStyle, ...props }, ref) => {
    const { value, onValueChange, triggerPosition, setTriggerPosition, contentLayout, setContentLayout, } = useNavigationMenuContext();
    const { value: menuValue, nativeID } = useItemContext();
    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setTriggerPosition(null);
            setContentLayout(null);
            onValueChange('');
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
Content.displayName = 'ContentNativeNavigationMenu';
const Link = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} role='link' {...props}/>;
});
Link.displayName = 'LinkNativeNavigationMenu';
const Viewport = React.forwardRef((props, ref) => {
    return <View ref={ref} {...props}/>;
});
Viewport.displayName = 'ViewportNativeNavigationMenu';
const Indicator = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} {...props}/>;
});
Indicator.displayName = 'IndicatorNativeNavigationMenu';
export { Content, Indicator, Item, Link, List, Portal, Root, Trigger, Viewport, useItemContext, useNavigationMenuContext, };
function onStartShouldSetResponder() {
    return true;
}
