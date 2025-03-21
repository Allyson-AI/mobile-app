import * as React from 'react';
import { View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const RootContext = React.createContext(null);
const Root = React.forwardRef(({ asChild, value, disabled, min, max, dir: _dir, inverted: _inverted, step: _step, onValueChange: _onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<RootContext.Provider value={{ value, disabled, min, max }}>
        <Component ref={ref} role='group' {...props}/>
      </RootContext.Provider>);
});
Root.displayName = 'RootNativeSlider';
function useSliderContext() {
    const context = React.useContext(RootContext);
    if (context === null) {
        throw new Error('Slider compound components cannot be rendered outside the Slider component');
    }
    return context;
}
const Track = React.forwardRef(({ asChild, ...props }, ref) => {
    const { value, min, max, disabled } = useSliderContext();
    const Component = asChild ? Slot.View : View;
    return (<Component ref={ref} aria-disabled={disabled} role='slider' aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} accessibilityValue={{ max, min, now: value }} {...props}/>);
});
Track.displayName = 'TrackNativeSlider';
const Range = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='presentation' {...props}/>;
});
Range.displayName = 'RangeNativeSlider';
const Thumb = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component accessibilityRole='adjustable' ref={ref} {...props}/>;
});
Thumb.displayName = 'ThumbNativeSlider';
export { Range, Root, Thumb, Track };
