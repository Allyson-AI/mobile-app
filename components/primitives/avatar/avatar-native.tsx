import * as React from 'react';
import { Image as RNImage, View, } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, alt, ...viewProps }, ref) => {
    const [status, setStatus] = React.useState('loading');
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{ alt, status, setStatus }}>
        <Component ref={ref} {...viewProps}/>
      </RootContext.Provider>);
});
Root.displayName = 'RootAvatar';
function useRootContext() {
    const context = React.useContext(RootContext);
    if (!context) {
        throw new Error('Avatar compound components cannot be rendered outside the Avatar component');
    }
    return context;
}
const Image = React.forwardRef(({ asChild, onLoad: onLoadProps, onError: onErrorProps, onLoadingStatusChange, ...props }, ref) => {
    const { alt, setStatus, status } = useRootContext();
    const onLoad = React.useCallback((e) => {
        setStatus('loaded');
        onLoadingStatusChange?.('loaded');
        onLoadProps?.(e);
    }, [onLoadProps]);
    const onError = React.useCallback((e) => {
        setStatus('error');
        onLoadingStatusChange?.('error');
        onErrorProps?.(e);
    }, [onErrorProps]);
    if (status === 'error') {
        return null;
    }
    const Component = asChild ? Slot.Image : RNImage;
    return (<Component ref={ref} alt={alt} onLoad={onLoad} onError={onError} {...props}/>);
});
Image.displayName = 'ImageAvatar';
const Fallback = React.forwardRef(({ asChild, ...props }, ref) => {
    const { alt, status } = useRootContext();
    if (status !== 'error') {
        return null;
    }
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role={'img'} aria-label={alt} {...props}/>;
});
Fallback.displayName = 'FallbackAvatar';
export { Fallback, Image, Root };
