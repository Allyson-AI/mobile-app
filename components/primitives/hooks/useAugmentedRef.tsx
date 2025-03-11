import * as React from 'react';
export function useAugmentedRef({ ref, methods, deps = [], }) {
    const augmentedRef = React.useRef(null);
    React.useImperativeHandle(ref, () => {
        if (typeof augmentedRef === 'function' || !augmentedRef?.current) {
            return {};
        }
        return {
            ...augmentedRef.current,
            ...methods,
        };
    }, deps);
    return augmentedRef;
}
