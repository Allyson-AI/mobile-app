import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks/useAugmentedRef';
import * as Slot from '~/components/primitives/slot';
import { EmptyGestureResponderEvent } from '~/components/primitives/utils';
const DropdownMenuContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenuContext.Provider value={{ open, onOpenChange }}>
      <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
        <Component ref={ref} {...viewProps}/>
      </DropdownMenu.Root>
    </DropdownMenuContext.Provider>);
});
Root.displayName = 'RootWebDropdownMenu';
function useDropdownMenuContext() {
    const context = React.useContext(DropdownMenuContext);
    if (!context) {
        throw new Error('DropdownMenu compound components cannot be rendered outside the DropdownMenu component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, disabled = false, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { open } = useDropdownMenuContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
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
    return (<DropdownMenu.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} {...props}/>
      </DropdownMenu.Trigger>);
});
Trigger.displayName = 'TriggerWebDropdownMenu';
function Portal({ forceMount, container, children }) {
    return (<DropdownMenu.Portal forceMount={forceMount} container={container} children={children}/>);
}
const Overlay = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props}/>;
});
Overlay.displayName = 'OverlayWebDropdownMenu';
const DropdownMenuContentContext = React.createContext(null);
const Content = React.forwardRef(({ asChild = false, forceMount, align, side, sideOffset, alignOffset = 0, avoidCollisions = true, insets, loop, onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, collisionBoundary, sticky, hideWhenDetached, ...props }, ref) => {
    const itemRef = React.useRef(null);
    function close() {
        itemRef.current?.click();
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<DropdownMenuContentContext.Provider value={{ close }}>
        <DropdownMenu.Content forceMount={forceMount} alignOffset={alignOffset} avoidCollisions={avoidCollisions} collisionPadding={insets} loop={loop} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} onFocusOutside={onFocusOutside} onInteractOutside={onInteractOutside} collisionBoundary={collisionBoundary} sticky={sticky} hideWhenDetached={hideWhenDetached} align={align} side={side} sideOffset={sideOffset}>
          <Component ref={ref} {...props}/>
          <DropdownMenu.Item ref={itemRef} aria-hidden style={{ position: 'fixed', top: 0, left: 0, zIndex: -999999999 }} aria-disabled tabIndex={-1} hidden/>
        </DropdownMenu.Content>
      </DropdownMenuContentContext.Provider>);
});
Content.displayName = 'ContentWebDropdownMenu';
function useDropdownMenuContentContext() {
    const context = React.useContext(DropdownMenuContentContext);
    if (!context) {
        throw new Error('DropdownMenu compound components cannot be rendered outside the DropdownMenu component');
    }
    return context;
}
const Item = React.forwardRef(({ asChild, textValue, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { close } = useDropdownMenuContentContext();
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
    return (<DropdownMenu.Item textValue={textValue} disabled={props.disabled ?? undefined} onSelect={closeOnPress ? undefined : onSelected} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </DropdownMenu.Item>);
});
Item.displayName = 'ItemWebDropdownMenu';
const Group = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenu.Group asChild>
        <Component ref={ref} {...props}/>
      </DropdownMenu.Group>);
});
Group.displayName = 'GroupWebDropdownMenu';
const Label = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return (<DropdownMenu.Label asChild>
        <Component ref={ref} {...props}/>
      </DropdownMenu.Label>);
});
Label.displayName = 'LabelWebDropdownMenu';
const CheckboxItem = React.forwardRef(({ asChild, checked, onCheckedChange, textValue, disabled = false, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { close } = useDropdownMenuContentContext();
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
    return (<DropdownMenu.CheckboxItem textValue={textValue} checked={checked} onCheckedChange={onCheckedChange} onSelect={closeOnPress ? undefined : onSelected} disabled={disabled ?? undefined} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} role='button' {...props}/>
      </DropdownMenu.CheckboxItem>);
});
CheckboxItem.displayName = 'CheckboxItemWebDropdownMenu';
const DropdownMenuRadioGroupContext = React.createContext(null);
const RadioGroup = React.forwardRef(({ asChild, value, onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange} asChild>
        <Component ref={ref} {...props}/>
      </DropdownMenu.RadioGroup>
    </DropdownMenuRadioGroupContext.Provider>);
});
RadioGroup.displayName = 'RadioGroupWebDropdownMenu';
function useDropdownMenuRadioGroupContext() {
    const context = React.useContext(DropdownMenuRadioGroupContext);
    if (!context) {
        throw new Error('DropdownMenuRadioGroup compound components cannot be rendered outside the DropdownMenuRadioGroup component');
    }
    return context;
}
const RadioItem = React.forwardRef(({ asChild, value, textValue, closeOnPress = true, onPress: onPressProp, onKeyDown: onKeyDownProp, ...props }, ref) => {
    const { onValueChange } = useDropdownMenuRadioGroupContext();
    const { close } = useDropdownMenuContentContext();
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
    return (<DropdownMenu.RadioItem value={value} textValue={textValue} disabled={props.disabled ?? undefined} onSelect={closeOnPress ? undefined : onSelected} asChild>
        <Component ref={ref} 
    // @ts-expect-error web only
    onKeyDown={onKeyDown} onPress={onPress} {...props}/>
      </DropdownMenu.RadioItem>);
});
RadioItem.displayName = 'RadioItemWebDropdownMenu';
const ItemIndicator = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenu.ItemIndicator forceMount={forceMount} asChild>
      <Component ref={ref} {...props}/>
    </DropdownMenu.ItemIndicator>);
});
ItemIndicator.displayName = 'ItemIndicatorWebDropdownMenu';
const Separator = React.forwardRef(({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenu.Separator asChild>
      <Component ref={ref} {...props}/>
    </DropdownMenu.Separator>);
});
Separator.displayName = 'SeparatorWebDropdownMenu';
const DropdownMenuSubContext = React.createContext(null);
const Sub = React.forwardRef(({ asChild, open, onOpenChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<DropdownMenuSubContext.Provider value={{ open, onOpenChange }}>
      <DropdownMenu.Sub open={open} onOpenChange={onOpenChange}>
        <Component ref={ref} {...props}/>
      </DropdownMenu.Sub>
    </DropdownMenuSubContext.Provider>);
});
Sub.displayName = 'SubWebDropdownMenu';
function useSubContext() {
    const context = React.useContext(DropdownMenuSubContext);
    if (!context) {
        throw new Error('DropdownMenu compound components cannot be rendered outside the DropdownMenu component');
    }
    return context;
}
const SubTrigger = React.forwardRef(({ asChild, textValue, disabled = false, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<DropdownMenu.SubTrigger disabled={disabled ?? undefined} textValue={textValue} asChild>
      <Component ref={ref} {...props}/>
    </DropdownMenu.SubTrigger>);
});
SubTrigger.displayName = 'SubTriggerWebDropdownMenu';
const SubContent = React.forwardRef(({ asChild = false, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<DropdownMenu.Portal>
      <DropdownMenu.SubContent forceMount={forceMount}>
        <Component ref={ref} {...props}/>
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>);
});
Content.displayName = 'ContentWebDropdownMenu';
export { CheckboxItem, Content, Group, Item, ItemIndicator, Label, Overlay, Portal, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger, useDropdownMenuContext, useSubContext, };
function onSelected(ev) {
    ev.preventDefault();
}
