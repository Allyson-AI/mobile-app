import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks';
import * as Slot from '~/components/primitives/slot';
import { EmptyGestureResponderEvent } from '~/components/primitives/utils';
const NavigationMenuContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, delayDuration, skipDelayDuration, dir, orientation, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<NavigationMenuContext.Provider value={{ value, onValueChange, orientation }}>
        <NavigationMenu.Root value={value} onValueChange={onValueChange} delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} dir={dir} orientation={orientation}>
          <Component ref={ref} {...viewProps}/>
        </NavigationMenu.Root>
      </NavigationMenuContext.Provider>);
});
Root.displayName = 'RootWebNavigationMenu';
function useNavigationMenuContext() {
    const context = React.useContext(NavigationMenuContext);
    if (!context) {
        throw new Error('NavigationMenu compound components cannot be rendered outside the NavigationMenu component');
    }
    return context;
}
const List = React.forwardRef(({ asChild, ...viewProps }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { orientation } = useNavigationMenuContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.orientation = orientation;
        }
    }, [orientation]);
    const Component = asChild ? Slot.View : View;
    return (<NavigationMenu.List asChild>
        <Component ref={ref} {...viewProps}/>
      </NavigationMenu.List>);
});
List.displayName = 'ListWebNavigationMenu';
const ItemContext = React.createContext(null);
const Item = React.forwardRef(({ asChild, value, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<ItemContext.Provider value={{ value }}>
      <NavigationMenu.Item value={value} asChild>
        <Component ref={ref} {...props}/>
      </NavigationMenu.Item>
    </ItemContext.Provider>);
});
Item.displayName = 'ItemWebNavigationMenu';
function useItemContext() {
    const context = React.useContext(ItemContext);
    if (!context) {
        throw new Error('NavigationMenu compound components cannot be rendered outside the NavigationMenu component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled = false, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { value: rootValue, onValueChange } = useNavigationMenuContext();
    const { value } = useItemContext();
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent);
            onValueChange(value === rootValue ? '' : value);
        }
    }
    function onPress(ev) {
        onPressProp?.(ev);
        onValueChange(value === rootValue ? '' : value);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<NavigationMenu.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </NavigationMenu.Trigger>);
});
Trigger.displayName = 'TriggerWebNavigationMenu';
function Portal({ children }) {
    return <>{children}</>;
}
const Content = React.forwardRef(({ asChild = false, forceMount, align: _align, side: _side, sideOffset: _sideOffset, alignOffset: _alignOffset, avoidCollisions: _avoidCollisions, onLayout: onLayoutProp, insets: _insets, disablePositioningStyle: _disablePositioningStyle, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<NavigationMenu.Content forceMount={forceMount} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside}>
        <Component ref={ref} {...props}/>
      </NavigationMenu.Content>);
});
Content.displayName = 'ContentWebNavigationMenu';
const Link = React.forwardRef(({ asChild, active, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { onValueChange } = useNavigationMenuContext();
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === 'Enter' || ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent);
            onValueChange('');
        }
    }
    function onPress(ev) {
        onPressProp?.(ev);
        onValueChange('');
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<NavigationMenu.Link active={active} asChild>
        <Component ref={ref} role='link' 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </NavigationMenu.Link>);
});
Link.displayName = 'LinkWebNavigationMenu';
const Viewport = React.forwardRef((props, ref) => {
    return (<Slot.View ref={ref} {...props}>
      <NavigationMenu.Viewport />
    </Slot.View>);
});
Viewport.displayName = 'ViewportWebNavigationMenu';
const Indicator = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<NavigationMenu.Indicator asChild>
        <Component ref={ref} {...props}/>
      </NavigationMenu.Indicator>);
});
Indicator.displayName = 'IndicatorWebNavigationMenu';
export { Content, Indicator, Item, Link, List, Portal, Root, Trigger, Viewport, useItemContext, useNavigationMenuContext, };
