import * as React from 'react';
import { useWindowDimensions, } from 'react-native';
const POSITION_ABSOLUTE = {
    position: 'absolute',
};
const HIDDEN_CONTENT = {
    position: 'absolute',
    opacity: 0,
    zIndex: -9999999,
};
export function useRelativePosition({ align, avoidCollisions, triggerPosition, contentLayout, alignOffset, insets, sideOffset, side, disablePositioningStyle, }) {
    const dimensions = useWindowDimensions();
    return React.useMemo(() => {
        if (disablePositioningStyle) {
            return {};
        }
        if (!triggerPosition || !contentLayout) {
            return HIDDEN_CONTENT;
        }
        return getContentStyle({
            align,
            avoidCollisions,
            contentLayout,
            side,
            triggerPosition,
            alignOffset,
            insets,
            sideOffset,
            dimensions,
        });
    }, [triggerPosition, contentLayout, dimensions.width, dimensions.height]);
}
function getSidePosition({ side, triggerPosition, contentLayout, sideOffset, insets, avoidCollisions, dimensions, }) {
    const insetTop = insets?.top ?? 0;
    const insetBottom = insets?.bottom ?? 0;
    const positionTop = triggerPosition?.pageY - sideOffset - contentLayout.height;
    const positionBottom = triggerPosition.pageY + triggerPosition.height + sideOffset;
    if (!avoidCollisions) {
        return {
            top: side === 'top' ? positionTop : positionBottom,
        };
    }
    if (side === 'top') {
        return {
            top: Math.max(insetTop, positionTop),
        };
    }
    return {
        top: Math.min(dimensions.height - insetBottom - contentLayout.height, positionBottom),
    };
}
function getAlignPosition({ align, avoidCollisions, contentLayout, triggerPosition, alignOffset, insets, dimensions, }) {
    const insetLeft = insets?.left ?? 0;
    const insetRight = insets?.right ?? 0;
    const maxContentWidth = dimensions.width - insetLeft - insetRight;
    const contentWidth = Math.min(contentLayout.width, maxContentWidth);
    let left = getLeftPosition(align, triggerPosition.pageX, triggerPosition.width, contentWidth, alignOffset, insetLeft, insetRight, dimensions);
    if (avoidCollisions) {
        const doesCollide = left < insetLeft || left + contentWidth > dimensions.width - insetRight;
        if (doesCollide) {
            const spaceLeft = left - insetLeft;
            const spaceRight = dimensions.width - insetRight - (left + contentWidth);
            if (spaceLeft > spaceRight && spaceLeft >= contentWidth) {
                left = insetLeft;
            }
            else if (spaceRight >= contentWidth) {
                left = dimensions.width - insetRight - contentWidth;
            }
            else {
                const centeredPosition = Math.max(insetLeft, (dimensions.width - contentWidth - insetRight) / 2);
                left = centeredPosition;
            }
        }
    }
    return { left, maxWidth: maxContentWidth };
}
function getLeftPosition(align, triggerPageX, triggerWidth, contentWidth, alignOffset, insetLeft, insetRight, dimensions) {
    let left = 0;
    if (align === 'start') {
        left = triggerPageX;
    }
    if (align === 'center') {
        left = triggerPageX + triggerWidth / 2 - contentWidth / 2;
    }
    if (align === 'end') {
        left = triggerPageX + triggerWidth - contentWidth;
    }
    return Math.max(insetLeft, Math.min(left + alignOffset, dimensions.width - contentWidth - insetRight));
}
function getContentStyle({ align, avoidCollisions, contentLayout, side, triggerPosition, alignOffset, insets, sideOffset, dimensions, }) {
    return Object.assign(POSITION_ABSOLUTE, getSidePosition({
        side,
        triggerPosition,
        contentLayout,
        sideOffset,
        insets,
        avoidCollisions,
        dimensions,
    }), getAlignPosition({
        align,
        avoidCollisions,
        triggerPosition,
        contentLayout,
        alignOffset,
        insets,
        dimensions,
    }));
}
