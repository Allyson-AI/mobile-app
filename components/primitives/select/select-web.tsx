import * as Select from '@radix-ui/react-select';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks';
import * as Slot from '~/components/primitives/slot';
const SelectContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange: onValueChangeProp, open, onOpenChange, ...viewProps }, ref) => {
    function onValueChange(val) {
        onValueChangeProp({ value: val, label: val });
    }
    const Component = asChild ? Slot.View : View;
    return (<SelectContext.Provider value={{ value, onValueChange: onValueChangeProp, open, onOpenChange }}>
        <Select.Root value={value?.value} onValueChange={onValueChange} open={open} onOpenChange={onOpenChange}>
          <Component ref={ref} {...viewProps}/>
        </Select.Root>
      </SelectContext.Provider>);
});
Root.displayName = 'RootWebSelect';
function useSelectContext() {
    const context = React.useContext(SelectContext);
    if (!context) {
        throw new Error('Select compound components cannot be rendered outside the Select component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, role: _role, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { open } = useSelectContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
            augRef.type = 'button';
        }
    }, [open]);
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Select.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} role='button' disabled={disabled} {...props}/>
      </Select.Trigger>);
});
Trigger.displayName = 'TriggerWebSelect';
const Value = React.forwardRef(({ asChild, placeholder, children, ...props }, ref) => {
    return (<Slot.Text ref={ref} {...props}>
        <Select.Value placeholder={placeholder}>{children}</Select.Value>
      </Slot.Text>);
});
Value.displayName = 'ValueWebSelect';
function Portal({ container, children }) {
    return <Select.Portal children={children} container={container}/>;
}
const Overlay = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} {...props}/>;
});
Overlay.displayName = 'OverlayWebSelect';
const Content = React.forwardRef(({ asChild = false, forceMount: _forceMount, align = 'start', side = 'bottom', position = 'popper', sideOffset = 0, alignOffset = 0, avoidCollisions = true, disablePositioningStyle: _disablePositioningStyle, onCloseAutoFocus, onEscapeKeyDown, onInteractOutside: _onInteractOutside, onPointerDownOutside, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Select.Content onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} onPointerDownOutside={onPointerDownOutside} align={align} side={side} sideOffset={sideOffset} alignOffset={alignOffset} avoidCollisions={avoidCollisions} position={position}>
        <Component ref={ref} {...props}/>
      </Select.Content>);
});
Content.displayName = 'ContentWebSelect';
const ItemContext = React.createContext(null);
const Item = React.forwardRef(({ asChild, closeOnPress = true, label, value, children, ...props }, ref) => {
    return (<ItemContext.Provider value={{ itemValue: value, label: label }}>
      <Slot.Pressable ref={ref} {...props}>
        <Select.Item textValue={label} value={value} disabled={props.disabled ?? undefined}>
          <>{children}</>
        </Select.Item>
      </Slot.Pressable>
    </ItemContext.Provider>);
});
Item.displayName = 'ItemWebSelect';
function useItemContext() {
    const context = React.useContext(ItemContext);
    if (!context) {
        throw new Error('Item compound components cannot be rendered outside of an Item component');
    }
    return context;
}
const ItemText = React.forwardRef(({ asChild, ...props }, ref) => {
    const { label } = useItemContext();
    const Component = asChild ? Slot.Text : Text;
    return (<Select.ItemText asChild>
      <Component ref={ref} {...props}>
        {label}
      </Component>
    </Select.ItemText>);
});
ItemText.displayName = 'ItemTextWebSelect';
const ItemIndicator = React.forwardRef(({ asChild, forceMount: _forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Select.ItemIndicator asChild>
      <Component ref={ref} {...props}/>
    </Select.ItemIndicator>);
});
ItemIndicator.displayName = 'ItemIndicatorWebSelect';
const Group = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Select.Group asChild>
        <Component ref={ref} {...props}/>
      </Select.Group>);
});
Group.displayName = 'GroupWebSelect';
const Label = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return (<Select.Label asChild>
        <Component ref={ref} {...props}/>
      </Select.Label>);
});
Label.displayName = 'LabelWebSelect';
const Separator = React.forwardRef(({ asChild, decorative, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Select.Separator asChild>
      <Component ref={ref} {...props}/>
    </Select.Separator>);
});
Separator.displayName = 'SeparatorWebSelect';
const ScrollUpButton = (props) => {
    return <Select.ScrollUpButton {...props}/>;
};
const ScrollDownButton = (props) => {
    return <Select.ScrollDownButton {...props}/>;
};
const Viewport = (props) => {
    return <Select.Viewport {...props}/>;
};
export { Content, Group, Item, ItemIndicator, ItemText, Label, Overlay, Portal, Root, ScrollDownButton, ScrollUpButton, Separator, Trigger, Value, Viewport, useItemContext, useSelectContext, };
