import {
    SuperwallDelegate,
    EventType,
} from '@superwall/react-native-superwall';

export class MySuperwallDelegate extends SuperwallDelegate {
    subscriptionStatusDidChange(newValue) {
        // console.log('Subscription status changed to', newValue);
    }

    handleSuperwallEvent(eventInfo) {
        // console.log('Handling Superwall event:', eventInfo);

        switch (eventInfo.event.type) {
            case EventType.appOpen:
                // console.log("appOpen event");
                break;
            case EventType.deviceAttributes:
                // console.log(`deviceAttributes event: ${eventInfo.event.deviceAttributes}`);
                break;
            case EventType.paywallOpen:
                const paywallInfo = eventInfo.event.paywallInfo;
                // console.log(`paywallOpen event: ${paywallInfo}`);

                if (paywallInfo !== null) {
                    // console.log(`paywallInfo.identifier: ${paywallInfo.identifier}`);
                    // console.log(`paywallInfo.productIds: ${paywallInfo.productIds}`);
                }
                break;
            default:
                break;
        }
    }

    handleCustomPaywallAction(name) {
        // console.log('Handling custom paywall action:', name);
    }

    willDismissPaywall(paywallInfo) {
        // console.log('Paywall will dismiss:', paywallInfo);
    }

    willPresentPaywall(paywallInfo) {
        // console.log('Paywall will present:', paywallInfo);
    }

    didDismissPaywall(paywallInfo) {
        // console.log('Paywall did dismiss:', paywallInfo);
    }

    didPresentPaywall(paywallInfo) {
        // console.log('Paywall did present:', paywallInfo);
    }

    paywallWillOpenURL(url) {
        // console.log('Paywall will open URL:', url);
    }

    paywallWillOpenDeepLink(url) {
        // console.log('Paywall will open Deep Link:', url);
    }

    handleLog(level, scope, message, info, error) {
        // console.log(`[${level}] ${scope}: ${message}`, info, error);
    }
}