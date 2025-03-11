import * as React from 'react';
import { Pressable, View } from 'react-native';
import * as Slot from '~/components/primitives/slot';
const Root = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component role='table' ref={ref} {...props}/>;
});
Root.displayName = 'RootTable';
const Header = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component role='rowheader' ref={ref} {...props}/>;
});
Header.displayName = 'HeaderTable';
const Row = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return <Component ref={ref} role='row' {...props}/>;
});
Row.displayName = 'RowTable';
const Head = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='columnheader' {...props}/>;
});
Head.displayName = 'HeadTable';
const Body = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='rowgroup' {...props}/>;
});
Body.displayName = 'BodyTable';
const Cell = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='cell' {...props}/>;
});
Cell.displayName = 'CellTable';
const Footer = React.forwardRef(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return <Component ref={ref} role='rowgroup' {...props}/>;
});
Footer.displayName = 'FooterTable';
export { Body, Cell, Footer, Head, Header, Root, Row };
