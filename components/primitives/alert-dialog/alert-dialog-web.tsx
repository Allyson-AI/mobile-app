import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as React from 'react';
import { Pressable, Text, View, } from 'react-native';
import { useAugmentedRef } from '~/components/primitives/hooks/useAugmentedRef';
import * as Slot from '~/components/primitives/slot';
const AlertDialogContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, open, onOpenChange, ...viewProps }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<AlertDialogContext.Provider value={{ open, onOpenChange }}>
      <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <Component ref={ref} {...viewProps}/>
      </AlertDialog.Root>
    </AlertDialogContext.Provider>);
});
Root.displayName = 'RootAlertWebDialog';
function useAlertDialogContext() {
    const context = React.useContext(AlertDialogContext);
    if (!context) {
        throw new Error('AlertDialog compound components cannot be rendered outside the AlertDialog component');
    }
    return context;
}
const Trigger = React.forwardRef(({ asChild, onPress: onPressProp, role: _role, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { onOpenChange, open } = useAlertDialogContext();
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
    return (<AlertDialog.Trigger disabled={disabled ?? undefined} asChild>
        <Component ref={augmentedRef} onPress={onPress} role='button' disabled={disabled} {...props}/>
      </AlertDialog.Trigger>);
});
Trigger.displayName = 'TriggerAlertWebDialog';
function Portal({ forceMount, container, children }) {
    return (<AlertDialog.Portal forceMount={forceMount} children={children} container={container}/>);
}
const Overlay = React.forwardRef(({ asChild, forceMount, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<AlertDialog.Overlay forceMount={forceMount}>
      <Component ref={ref} {...props}/>
    </AlertDialog.Overlay>);
});
Overlay.displayName = 'OverlayAlertWebDialog';
const Content = React.forwardRef(({ asChild, forceMount, onOpenAutoFocus, onCloseAutoFocus, onEscapeKeyDown, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { open } = useAlertDialogContext();
    React.useLayoutEffect(() => {
        if (augmentedRef.current) {
            const augRef = augmentedRef.current;
            augRef.dataset.state = open ? 'open' : 'closed';
        }
    }, [open]);
    const Component = asChild ? Slot.View : View;
    return (<AlertDialog.Content onOpenAutoFocus={onOpenAutoFocus} onCloseAutoFocus={onCloseAutoFocus} onEscapeKeyDown={onEscapeKeyDown} forceMount={forceMount} asChild>
        <Component ref={augmentedRef} {...props}/>
      </AlertDialog.Content>);
});
Content.displayName = 'ContentAlertWebDialog';
const Cancel = React.forwardRef(({ asChild, onPress: onPressProp, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { onOpenChange, open } = useAlertDialogContext();
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
        <AlertDialog.Cancel disabled={disabled ?? undefined} asChild>
          <Component ref={augmentedRef} onPress={onPress} role='button' disabled={disabled} {...props}/>
        </AlertDialog.Cancel>
      </>);
});
Cancel.displayName = 'CancelAlertWebDialog';
const Action = React.forwardRef(({ asChild, onPress: onPressProp, disabled, ...props }, ref) => {
    const augmentedRef = useAugmentedRef({ ref });
    const { onOpenChange, open } = useAlertDialogContext();
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
        <AlertDialog.Action disabled={disabled ?? undefined} asChild>
          <Component ref={augmentedRef} onPress={onPress} role='button' disabled={disabled} {...props}/>
        </AlertDialog.Action>
      </>);
});
Action.displayName = 'ActionAlertWebDialog';
const Title = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return (<AlertDialog.Title asChild>
        <Component ref={ref} {...props}/>
      </AlertDialog.Title>);
});
Title.displayName = 'TitleAlertWebDialog';
const Description = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Text : Text;
    return (<AlertDialog.Description asChild>
        <Component ref={ref} {...props}/>
      </AlertDialog.Description>);
});
Description.displayName = 'DescriptionAlertWebDialog';
export { Action, Cancel, Content, Description, Overlay, Portal, Root, Title, Trigger, useAlertDialogContext, };
