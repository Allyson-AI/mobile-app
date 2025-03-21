import * as Menubar from '@radix-ui/react-menubar';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks';
import * as Slot from '~/components/primitives/slot';
import { EmptyGestureResponderEvent } from '~/components/primitives/utils';
const MenubarContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<MenubarContext.Provider value={{ value, onValueChange }}>
        <Menubar.Root value={value} onValueChange={onValueChange}>
          <Component ref={ref} {...viewProps}/>
        </Menubar.Root>
      </MenubarContext.Provider>);
});
Root.displayName = 'RootWebMenubar';
function useMenubarContext() {
    const context = React.useContext(MenubarContext);
    if (!context) {
        throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
    }
    return context;
}
const MenubarMenuContext = React.createContext(null);
const Menu = React.forwardRef(({ asChild, value, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<MenubarMenuContext.Provider value={{ value }}>
        <Menubar.Menu value={value}>
          <Component ref={ref} {...viewProps}/>
        </Menubar.Menu>
      </MenubarMenuContext.Provider>);
});
Menu.displayName = 'MenuWebMenubar';
function useMenubarMenuContext() {
    const context = React.useContext(MenubarMenuContext);
    if (!context) {
        throw new Error('Menubar compound components cannot be rendered outside the Menubar component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, disabled = false, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { value: menuValue } = useMenubarMenuContext();
    const { value } = useMenubarContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = value && menuValue === value ? 'open' : 'closed';
        }
    }, [open]);
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            if (disabled) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [disabled]);
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Menubar.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} disabled={disabled} {...props}/>
      </Menubar.Trigger>);
});
Trigger.displayName = 'TriggerWebMenubar';
function Portal({ forceMount, container, children }) {
    return (<Menubar.Portal forceMount={forceMount} container={container} children={children}/>);
}
const Overlay = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props}/>;
});
Overlay.displayName = 'OverlayWebMenubar';
const MenubarContentContext = React.createContext(null);
const Content = React.forwardRef(({ asChild = false, forceMount, align, side, sideOffset, alignOffset = 0, avoidCollisions = true, insets, loop, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, collisionBoundary, sticky, hideWhenDetached, ...props }, ref) => {
    const itemRef = React.useRef(null);
    function close() {
        itemRef.current?.click();
    }
    const Component = asChild ? Slot.View : View;
    return (<MenubarContentContext.Provider value={{ close }}>
        <Menubar.Content forceMount={forceMount} alignOffset={alignOffset} avoidCollisions={avoidCollisions} collisionPadding={insets} loop={loop} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside} collisionBoundary={collisionBoundary} sticky={sticky} hideWhenDetached={hideWhenDetached} align={align} side={side} sideOffset={sideOffset}>
          <Component ref={ref} {...props}/>
          <Menubar.Item ref={itemRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }} aria-disabled tabIndex={-1} hidden/>
        </Menubar.Content>
      </MenubarContentContext.Provider>);
});
Content.displayName = 'ContentWebMenubar';
function useMenubarContentContext() {
    const context = React.useContext(MenubarContentContext);
    if (!context) {
        throw new Error('MenubarContent compound components cannot be rendered outside the MenubarContent component');
    }
    return context;
}
const Item = React.forwardRef(({ asChild, textValue, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { close } = useMenubarContentContext();
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === 'Enter' || ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent);
            if (closeOnPress) {
                close();
            }
        }
    }
    function onPress(ev) {
        onPressProp?.(ev);
        if (closeOnPress) {
            close();
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Menubar.Item textValue={textValue} disabled={props.disabled ?? undefined} onSelect={closeOnPress ? undefined : onSelected} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </Menubar.Item>);
});
Item.displayName = 'ItemWebMenubar';
const Group = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Menubar.Group asChild>
        <Component ref={ref} {...props}/>
      </Menubar.Group>);
});
Group.displayName = 'GroupWebMenubar';
const Label = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return (<Menubar.Label asChild>
        <Component ref={ref} {...props}/>
      </Menubar.Label>);
});
Label.displayName = 'LabelWebMenubar';
const CheckboxItem = React.forwardRef(({ asChild, checked, onCheckedChange, textValue, disabled = false, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === 'Enter' || ev.key === ' ') {
            onPressProp?.(EmptyGestureResponderEvent);
            onCheckedChange?.(!checked);
            if (closeOnPress) {
                close();
            }
        }
    }
    function onPress(ev) {
        onPressProp?.(ev);
        onCheckedChange?.(!checked);
        if (closeOnPress) {
            close();
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Menubar.CheckboxItem textValue={textValue} checked={checked} onCheckedChange={onCheckedChange} onSelect={closeOnPress ? undefined : onSelected} disabled={disabled ?? undefined} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} role='button' {...props}/>
      </Menubar.CheckboxItem>);
});
CheckboxItem.displayName = 'CheckboxItemWebMenubar';
const MenubarRadioGroupContext = React.createContext(null);
const RadioGroup = React.forwardRef(({ asChild, value, onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<MenubarRadioGroupContext.Provider value={{ value, onValueChange }}>
      <Menubar.RadioGroup value={value} onValueChange={onValueChange} asChild>
        <Component ref={ref} {...props}/>
      </Menubar.RadioGroup>
    </MenubarRadioGroupContext.Provider>);
});
RadioGroup.displayName = 'RadioGroupWebMenubar';
function useMenubarRadioGroupContext() {
    const context = React.useContext(MenubarRadioGroupContext);
    if (!context) {
        throw new Error('MenubarRadioGroup compound components cannot be rendered outside the MenubarRadioGroup component');
    }
    return context;
}
const RadioItem = React.forwardRef(({ asChild, value, textValue, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { onValueChange } = useMenubarRadioGroupContext();
    const { close } = useMenubarContentContext();
    function onKeyDown(ev) {
        onKeyDownProp?.(ev);
        if (ev.key === 'Enter' || ev.key === ' ') {
            onValueChange?.(value);
            onPressProp?.(EmptyGestureResponderEvent);
            if (closeOnPress) {
                close();
            }
        }
    }
    function onPress(ev) {
        onValueChange?.(value);
        onPressProp?.(ev);
        if (closeOnPress) {
            close();
        }
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Menubar.RadioItem value={value} textValue={textValue} disabled={props.disabled ?? undefined} onSelect={closeOnPress ? undefined : onSelected} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </Menubar.RadioItem>);
});
RadioItem.displayName = 'RadioItemWebMenubar';
const ItemIndicator = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Menubar.ItemIndicator forceMount={forceMount} asChild>
      <Component ref={ref} {...props}/>
    </Menubar.ItemIndicator>);
});
ItemIndicator.displayName = 'ItemIndicatorWebMenubar';
const Separator = React.forwardRef(({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Menubar.Separator asChild>
      <Component ref={ref} {...props}/>
    </Menubar.Separator>);
});
Separator.displayName = 'SeparatorWebMenubar';
const MenubarSubContext = React.createContext(null);
const Sub = React.forwardRef(({ asChild, open, onOpenChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<MenubarSubContext.Provider value={{ open, onOpenChange }}>
        <Menubar.Sub open={open} onOpenChange={onOpenChange}>
          <Component ref={ref} {...props}/>
        </Menubar.Sub>
      </MenubarSubContext.Provider>);
});
Sub.displayName = 'SubWebMenubar';
function useSubContext() {
    const context = React.useContext(MenubarSubContext);
    if (!context) {
        throw new Error('MenubarSub compound components cannot be rendered outside the MenubarSub component');
    }
    return context;
}
const SubTrigger = React.forwardRef(({ asChild, textValue, disabled = false, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Menubar.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
      <Component ref={ref} {...props}/>
    </Menubar.SubTrigger>);
});
SubTrigger.displayName = 'SubTriggerWebMenubar';
const SubContent = React.forwardRef(({ asChild = false, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Menubar.Portal>
      <Menubar.SubContent forceMount={forceMount}>
        <Component ref={ref} {...props}/>
      </Menubar.SubContent>
    </Menubar.Portal>);
});
Content.displayName = 'ContentWebMenubar';
export { CheckboxItem, Content, Group, Item, ItemIndicator, Label, Menu, Overlay, Portal, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger, useMenubarContext, useMenubarMenuContext, useSubContext, };
function onSelected(ev) {
    ev.preventDefault();
}
