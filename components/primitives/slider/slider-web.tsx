import * as Slider from '@radix-ui/react-slider';
import * as React from 'react';
import { View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, value, disabled, min, max, dir, inverted, step = 1, onValueChange, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Slider.Root dir={dir} inverted={inverted} value={[value]} disabled={disabled} min={min} max={max} step={step} onValueChange={onValueChange} asChild>
        <Component ref={ref} {...props}/>
      </Slider.Root>);
});
Root.displayName = 'RootWebSlider';
const Track = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Slider.Track asChild>
        <Component ref={ref} {...props}/>
      </Slider.Track>);
});
Track.displayName = 'TrackWebSlider';
const Range = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Slider.Range asChild>
        <Component ref={ref} {...props}/>
      </Slider.Range>);
});
Range.displayName = 'RangeWebSlider';
const Thumb = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Slider.Thumb asChild>
        <Component ref={ref} {...props}/>
      </Slider.Thumb>);
});
Thumb.displayName = 'ThumbWebSlider';
export { Range, Root, Thumb, Track };
