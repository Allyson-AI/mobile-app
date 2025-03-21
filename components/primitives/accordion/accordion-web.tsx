import * as Accordion from '@radix-ui/react-accordion';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks';
import * as Slot from '~/components/primitives/slot';
function useIsomorphicLayoutEffect(effect, dependencies) {
    if (typeof window === 'undefined') {
        React.useEffect(effect, dependencies);
    }
    else {
        React.useLayoutEffect(effect, dependencies);
    }
}
const AccordionContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, onValueChange, type, disabled, dir, orientation = 'vertical', collapsible, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<AccordionContext.Provider value={{
            value,
            onValueChange,
            type,
            disabled,
            dir,
            orientation,
        }}>
        <Accordion.Root asChild value={value} onValueChange={onValueChange} type={type} disabled={disabled} dir={dir} orientation={orientation} collapsible={collapsible}>
          <Component ref={ref} {...props}/>
        </Accordion.Root>
      </AccordionContext.Provider>);
});
Root.displayName = 'RootWebAccordion';
function useAccordionContext() {
    const context = React.useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion compound components cannot be rendered outside the Accordion component');
    }
    return context;
}
const AccordionItemContext = React.createContext(null);
const Item = React.forwardRef(({ asChild, value: itemValue, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { value, orientation, disabled: disabledRoot, } = useAccordionContext();
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            const isExpanded = Array.isArray(value)
                ? value.includes(itemValue)
                : value === itemValue;
            augRef.dataset.state = isExpanded ? 'open' : 'closed';
        }
    }, [value, itemValue]);
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.orientation = orientation;
            if (disabled || disabledRoot) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [orientation, disabled, disabledRoot]);
    const Component = asChild ? Slot.View : View;
    return (<AccordionItemContext.Provider value={{
            value: itemValue,
            disabled,
            isExpanded: isItemExpanded(value, itemValue),
        }}>
        <Accordion.Item value={itemValue} disabled={disabled} asChild>
          <Component ref={augmentedRef} {...props}/>
        </Accordion.Item>
      </AccordionItemContext.Provider>);
});
Item.displayName = 'ItemWebAccordion';
function useAccordionItemContext() {
    const context = React.useContext(AccordionItemContext);
    if (!context) {
        throw new Error('AccordionItem compound components cannot be rendered outside the AccordionItem component');
    }
    return context;
}
const Header = React.forwardRef(({ asChild, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { disabled, isExpanded } = useAccordionItemContext();
    const { orientation, disabled: disabledRoot } = useAccordionContext();
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = isExpanded ? 'open' : 'closed';
        }
    }, [isExpanded]);
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.orientation = orientation;
            if (disabled || disabledRoot) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [orientation, disabled, disabledRoot]);
    const Component = asChild ? Slot.View : View;
    return (<Accordion.Header asChild>
        <Component ref={augmentedRef} {...props}/>
      </Accordion.Header>);
});
Header.displayName = 'HeaderWebAccordion';
const HIDDEN_STYLE = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -999999,
    opacity: 0,
};
const Trigger = React.forwardRef(({ asChild, disabled: disabledProp, ...props }, ref) => {
    const { disabled: disabledRoot } = useAccordionContext();
    const { disabled, isExpanded } = useAccordionItemContext();
    const triggerRef = React.useRef(null);
    const augmentedRef = useAugmentedRef({ ref });
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = isExpanded ? 'expanded' : 'closed';
        }
    }, [isExpanded]);
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            if (disabled || disabledRoot || disabledProp) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [disabled, disabledRoot, disabledProp]);
    useIsomorphicLayoutEffect(() => {
        if (triggerRef.current) {
            triggerRef.current.disabled = true;
        }
    }, []);
    const isDisabled = disabledProp ?? disabledRoot ?? disabled;
    const Component = asChild ? Slot.Pressable : Pressable;
    return (<>
        <Accordion.Trigger ref={triggerRef} aria-hidden tabIndex={-1} style={HIDDEN_STYLE}/>
        <Accordion.Trigger disabled={isDisabled} asChild>
          <Component ref={augmentedRef} role='button' disabled={isDisabled} {...props} onPress={() => {
            if (triggerRef.current && !isDisabled) {
                triggerRef.current.disabled = false;
                triggerRef.current.click();
                triggerRef.current.disabled = true;
            }
        }}/>
        </Accordion.Trigger>
      </>);
});
Trigger.displayName = 'TriggerWebAccordion';
const Content = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { orientation, disabled: disabledRoot } = useAccordionContext();
    const { disabled, isExpanded } = useAccordionItemContext();
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = isExpanded ? 'expanded' : 'closed';
        }
    }, [isExpanded]);
    useIsomorphicLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.orientation = orientation;
            if (disabled || disabledRoot) {
                augRef.dataset.disabled = 'true';
            }
            else {
                augRef.dataset.disabled = undefined;
            }
        }
    }, [orientation, disabled, disabledRoot]);
    const Component = asChild ? Slot.View : View;
    return (<Accordion.Content forceMount={forceMount} asChild>
      <Component ref={augmentedRef} {...props}/>
    </Accordion.Content>);
});
Content.displayName = 'ContentWebAccordion';
export { Content, Header, Item, Root, Trigger, useAccordionContext, useAccordionItemContext, };
function isItemExpanded(rootValue, value) {
    return Array.isArray(rootValue)
        ? rootValue.includes(value)
        : rootValue === value;
}
