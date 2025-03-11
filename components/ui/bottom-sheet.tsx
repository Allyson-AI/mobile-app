import { BottomSheetFlatList as GBottomSheetFlatList, BottomSheetFooter as GBottomSheetFooter, BottomSheetTextInput as GBottomSheetTextInput, BottomSheetView as GBottomSheetView, useBottomSheetModal, } from '@gorhom/bottom-sheet';
import { X } from '~/components/Icons';
import React, { useCallback } from 'react';
import { Keyboard, Pressable, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Slot from '~/components/primitives/slot/slot-native';
import { Button } from '~/components/deprecated-ui/button';
import { cn } from '~/lib/utils';
const BottomSheetContext = React.createContext({});
const BottomSheet = React.forwardRef(({ ...props }, ref) => {
    return <View ref={ref} {...props}/>;
});
const BottomSheetContent = React.forwardRef(() => {
    return null;
});
const BottomSheetOpenTrigger = React.forwardRef(({ onPress, asChild = false, ...props }, ref) => {
    function handleOnPress() {
        window.alert('Not implemented for web yet. Check `bottom-sheet.tsx` for more info.');
    }
    const Trigger = asChild ? Slot.Pressable : Pressable;
    return <Trigger ref={ref} onPress={handleOnPress} {...props}/>;
});
const BottomSheetCloseTrigger = React.forwardRef(({ onPress, asChild = false, ...props }, ref) => {
    const { dismiss } = useBottomSheetModal();
    function handleOnPress(ev) {
        dismiss();
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
        onPress?.(ev);
    }
    const Trigger = asChild ? Slot.Pressable : Pressable;
    return <Trigger ref={ref} onPress={handleOnPress} {...props}/>;
});
const BOTTOM_SHEET_HEADER_HEIGHT = 60; // BottomSheetHeader height
function BottomSheetView({ className, children, hadHeader = true, style, ...props }) {
    const insets = useSafeAreaInsets();
    return (<GBottomSheetView style={[
            {
                paddingBottom: insets.bottom + (hadHeader ? BOTTOM_SHEET_HEADER_HEIGHT : 0),
            },
            style,
        ]} className={cn(`px-4`, className)} {...props}>
      {children}
    </GBottomSheetView>);
}
const BottomSheetTextInput = React.forwardRef(({ className, placeholderClassName, ...props }, ref) => {
    return (<GBottomSheetTextInput ref={ref} className={cn('rounded-md border border-input bg-background px-3 text-xl h-14 leading-[1.25] text-foreground items-center  placeholder:text-muted-foreground disabled:opacity-50', className)} placeholderClassName={cn('text-muted-foreground', placeholderClassName)} {...props}/>);
});
const BottomSheetFlatList = React.forwardRef(({ className, ...props }, ref) => {
    const insets = useSafeAreaInsets();
    return (<GBottomSheetFlatList ref={ref} contentContainerStyle={[{ paddingBottom: insets.bottom }]} className={cn('py-4', className)} keyboardShouldPersistTaps='handled' {...props}/>);
});
const BottomSheetHeader = React.forwardRef(({ className, children, ...props }, ref) => {
    const { dismiss } = useBottomSheetModal();
    function close() {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
        dismiss();
    }
    return (<View ref={ref} className={cn('border-b border-border flex-row items-center justify-between pl-4', className)} {...props}>
      {children}
      <Button onPress={close} variant='ghost' className='pr-4'>
        <X className='text-muted-foreground' size={24}/>
      </Button>
    </View>);
});
/**
 * To be used in a useCallback function as a props to BottomSheetContent
 */
const BottomSheetFooter = React.forwardRef(({ bottomSheetFooterProps, children, className, style, ...props }, ref) => {
    const insets = useSafeAreaInsets();
    return (<GBottomSheetFooter {...bottomSheetFooterProps}>
      <View ref={ref} style={[{ paddingBottom: insets.bottom + 6 }, style]} className={cn('px-4 pt-1.5', className)} {...props}>
        {children}
      </View>
    </GBottomSheetFooter>);
});
function useBottomSheet() {
    const ref = React.useRef(null);
    const open = useCallback(() => {
        ref.current?.present();
    }, []);
    const close = useCallback(() => {
        ref.current?.dismiss();
    }, []);
    return { ref, open, close };
}
export { BottomSheet, BottomSheetCloseTrigger, BottomSheetContent, BottomSheetFlatList, BottomSheetFooter, BottomSheetHeader, BottomSheetOpenTrigger, BottomSheetTextInput, BottomSheetView, useBottomSheet, };
