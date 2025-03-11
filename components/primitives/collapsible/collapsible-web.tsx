import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks/useAugmentedRef';
import * as Slot from '~/components/primitives/slot';
const CollapsibleContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, disabled = false, open, onOpenChange, ...viewProps }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
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
    const Component = asChild ? Slot.View : View;
    return (<CollapsibleContext.Provider value={{
            disabled,
            open,
            onOpenChange,
        }}>
      <Collapsible.Root open={open} onOpenChange={onOpenChange} disabled={disabled}>
        <Component ref={ref} {...viewProps}/>
      </Collapsible.Root>
    </CollapsibleContext.Provider>);
});
Root.displayName = 'RootWebCollapsible';
function useCollapsibleContext() {
    const context = React.useContext(CollapsibleContext);
    if (!context) {
        throw new Error('Collapsible compound components cannot be rendered outside the Collapsible component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, disabled: disabledProp = false, ...props }, ref) => {
    const { disabled, open, onOpenChange } = useCollapsibleContext();
    const augmentedRef = useAugmentedRef({ ref });
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
        }
    }, [open]);
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.type = 'button';
            if (disabled) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [disabled]);
    function onPress(ev) {
        onPressProp?.(ev);
        onOpenChange(!open);
    }
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<Collapsible.Trigger disabled={disabled} asChild>
        <Component ref={augmentedRef} role='button' onPress={onPress} disabled={disabled} {...props}/>
      </Collapsible.Trigger>);
});
Trigger.displayName = 'TriggerWebCollapsible';
const Content = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { open } = useCollapsibleContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
        }
    }, [open]);
    const Component = asChild ? Slot.View : View;
    return (<Collapsible.Content forceMount={forceMount} asChild>
      <Component ref={augmentedRef} {...props}/>
    </Collapsible.Content>);
});
Content.displayName = 'ContentWebCollapsible';
export { Content, Root, Trigger };
