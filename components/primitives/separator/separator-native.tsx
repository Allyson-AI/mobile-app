import * as React from 'react';
import { View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, decorative, orientation = 'horizontal', ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (<Component role={decorative ? 'presentation' : 'separator'} aria-orientation={orientation} ref={ref} {...props}/>);
});
Root.displayName = 'RootSeparator';
export { Root };
