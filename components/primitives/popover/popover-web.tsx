import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{ open, onOpenChange }}>
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <Component ref={ref} {...viewProps}/>
        </Popover.Root>
      </RootContext.Provider>);
});
Root.displayName = 'RootWebPopover';
function usePopoverContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('Popover compound components cannot be rendered outside the Popover component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, role: _role, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { onOpenChange, open } = usePopoverContext();
    function onPress(ev) {
        if (onPressProp) {
            onPressProp(ev);
        }
        onOpenChange(!open);
    }
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
            augRef.type = 'button';
        }
    }, [open]);
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Popover.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} onPress={onPress} role='button' disabled={disabled} {...props}/>
      </Popover.Trigger>);
});
Trigger.displayName = 'TriggerWebPopover';
function Portal({ forceMount, container, children }) {
    return (<Popover.Portal forceMount={forceMount} children={children} container={container}/>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props}/>;
});
Overlay.displayName = 'OverlayWebPopover';
const Content = React.forwardRef(({ asChild = false, forceMount, align = 'start', side = 'bottom', sideOffset = 0, alignOffset = 0, avoidCollisions = true, insets: _insets, disablePositioningStyle: _disablePositioningStyle, onCloseAutoFocus, onEscapeKeyDown, onInteractOutside, onPointerDownOutside, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Popover.Content onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onInteractOutside={onInteractOutside} onPointerDownOutside={onPointerDownOutside} forceMount={forceMount} align={align} side={side} sideOffset={sideOffset} alignOffset={alignOffset} avoidCollisions={avoidCollisions}>
        <Component ref={ref} {...props}/>
      </Popover.Content>);
});
Content.displayName = 'ContentWebPopover';
const Close = React.forwardRef(({ asChild, onPress: onPressProp, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { onOpenChange, open } = usePopoverContext();
    function onPress(ev) {
        if (onPressProp) {
            onPressProp(ev);
        }
        onOpenChange(!open);
    }
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.type = 'button';
        }
    }, []);
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<>
        <Popover.Close disabled={disabled ?? undefined} asChild>
          <Component ref={augmentedRef} onPress={onPress} role='button' disabled={disabled} {...props}/>
        </Popover.Close>
      </>);
});
Close.displayName = 'CloseWebPopover';
export { Close, Content, Overlay, Portal, Root, Trigger, usePopoverContext };
