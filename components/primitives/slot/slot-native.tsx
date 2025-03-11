import * as React from 'react';
import { StyleSheet, } from 'react-native';
const Pressable = React.forwardRef((props, forwardedRef) => {
    const { children, ...pressableslotProps } = props;
    if (!React.isValidElement(children)) {
        console.log('Slot.Pressable - Invalid asChild element', children);
        return null;
    }
    return React.cloneElement(isTextChildren(children) ? <></> : children, {
        ...mergeProps(pressableslotProps, children.props),
        ref: forwardedRef
            ? composeRefs(forwardedRef, children.ref)
            : children.ref,
    });
});
Pressable.displayName = 'SlotPressable';
const View = React.forwardRef((props, forwardedRef) => {
    const { children, ...viewSlotProps } = props;
    if (!React.isValidElement(children)) {
        console.log('Slot.View - Invalid asChild element', children);
        return null;
    }
    return React.cloneElement(isTextChildren(children) ? <></> : children, {
        ...mergeProps(viewSlotProps, children.props),
        ref: forwardedRef
            ? composeRefs(forwardedRef, children.ref)
            : children.ref,
    });
});
View.displayName = 'SlotView';
const Text = React.forwardRef((props, forwardedRef) => {
    const { children, ...textSlotProps } = props;
    if (!React.isValidElement(children)) {
        console.log('Slot.Text - Invalid asChild element', children);
        return null;
    }
    return React.cloneElement(isTextChildren(children) ? <></> : children, {
        ...mergeProps(textSlotProps, children.props),
        ref: forwardedRef
            ? composeRefs(forwardedRef, children.ref)
            : children.ref,
    });
});
Text.displayName = 'SlotText';
const Image = React.forwardRef((props, forwardedRef) => {
    const { children, ...imageSlotProps } = props;
    if (!React.isValidElement(children)) {
        console.log('Slot.Image - Invalid asChild element', children);
        return null;
    }
    return React.cloneElement(isTextChildren(children) ? <></> : children, {
        ...mergeProps(imageSlotProps, children.props),
        ref: forwardedRef
            ? composeRefs(forwardedRef, children.ref)
            : children.ref,
    });
});
Image.displayName = 'SlotImage';
export { Image, Pressable, Text, View };
// This project uses code from WorkOS/Radix Primitives.
// The code is licensed under the MIT License.
// https://github.com/radix-ui/primitives/tree/main
function composeRefs(...refs) {
    return (node) => refs.forEach((ref) => {
        if (typeof ref === 'function') {
            ref(node);
        }
        else if (ref != null) {
            ref.current = node;
        }
    });
}
function mergeProps(slotProps, childProps) {
    // all child props should override
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            // if the handler exists on both, we compose them
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = (...args) => {
                    childPropValue(...args);
                    slotPropValue(...args);
                };
            }
            // but if it exists only on the slot, we use only this one
            else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        }
        // if it's `style`, we merge them
        else if (propName === 'style') {
            overrideProps[propName] = combineStyles(slotPropValue, childPropValue);
        }
        else if (propName === 'className') {
            overrideProps[propName] = [slotPropValue, childPropValue]
                .filter(Boolean)
                .join(' ');
        }
    }
    return { ...slotProps, ...overrideProps };
}
function combineStyles(slotStyle, childValue) {
    if (typeof slotStyle === 'function' && typeof childValue === 'function') {
        return (state) => {
            return StyleSheet.flatten([slotStyle(state), childValue(state)]);
        };
    }
    if (typeof slotStyle === 'function') {
        return (state) => {
            return childValue
                ? StyleSheet.flatten([slotStyle(state), childValue])
                : slotStyle(state);
        };
    }
    if (typeof childValue === 'function') {
        return (state) => {
            return slotStyle
                ? StyleSheet.flatten([slotStyle, childValue(state)])
                : childValue(state);
        };
    }
    return StyleSheet.flatten([slotStyle, childValue].filter(Boolean));
}
export function isTextChildren(children) {
    return Array.isArray(children)
        ? children.every((child) => typeof child === 'string')
        : typeof children === 'string';
}
