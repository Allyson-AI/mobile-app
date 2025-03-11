import { Platform } from "react-native";
import Superwall, {
  PurchaseController,
  SubscriptionStatus,
  PurchaseResultCancelled,
  PurchaseResultFailed,
  PurchaseResultPending,
  PurchaseResultPurchased,
  PurchaseResultRestored,
} from "@superwall/react-native-superwall";
import Purchases, {
  PRODUCT_CATEGORY,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { useAuth } from "@clerk/clerk-expo";

export class RCPurchaseController extends PurchaseController {
  
  constructor(userId) {
    super();
    
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    const apiKey =
      Platform.OS === "ios"
        ? process.env.REVENUECAT_APPLE
        : process.env.REVENUECAT_GOOGLE;
    Purchases.configure({ apiKey, appUserID: userId });
  }

  syncSubscriptionStatus() {
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const hasActiveEntitlementOrSubscription =
        this.hasActiveEntitlementOrSubscription(customerInfo);
      Superwall.shared.setSubscriptionStatus(
        hasActiveEntitlementOrSubscription
          ? SubscriptionStatus.ACTIVE
          : SubscriptionStatus.INACTIVE
      );
    });
  }

  async purchaseFromAppStore(productId) {
    const products = await Promise.all([
      Purchases.getProducts([productId], PRODUCT_CATEGORY.SUBSCRIPTION),
      Purchases.getProducts([productId], PRODUCT_CATEGORY.NON_SUBSCRIPTION),
    ]).then((results) => results.flat());

    const storeProduct = products.length > 0 ? products[0] : null;

    if (!storeProduct) {
      return new PurchaseResultFailed(
        "Failed to find store product for $productId"
      );
    }

    return await this._purchaseStoreProduct(storeProduct);
  }

  async purchaseFromGooglePlay(productId, basePlanId, offerId) {
    const products = await Promise.all([
      Purchases.getProducts([productId], PRODUCT_CATEGORY.SUBSCRIPTION),
      Purchases.getProducts([productId], PRODUCT_CATEGORY.NON_SUBSCRIPTION),
    ]).then((results) => results.flat());

    const storeProductId = `${productId}:${basePlanId}`;

    let matchingProduct = null;

    for (const product of products) {
      if (product.identifier === storeProductId) {
        matchingProduct = product;
        break;
      }
    }

    let storeProduct =
      matchingProduct ??
      (products.length > 0 && typeof products[0] !== "undefined"
        ? products[0]
        : null);

    if (storeProduct === null) {
      return new PurchaseResultFailed("Product not found");
    }

    switch (storeProduct.productCategory) {
      case PRODUCT_CATEGORY.SUBSCRIPTION:
        const subscriptionOption =
          await this._fetchGooglePlaySubscriptionOption(
            storeProduct,
            basePlanId,
            offerId
          );
        if (subscriptionOption === null) {
          return new PurchaseResultFailed(
            "Valid subscription option not found for product."
          );
        }
        return await this._purchaseSubscriptionOption(subscriptionOption);
      case PRODUCT_CATEGORY.NON_SUBSCRIPTION:
        return await this._purchaseStoreProduct(storeProduct);
      default:
        return new PurchaseResultFailed("Unable to determine product category");
    }
  }

  async _purchaseStoreProduct(storeProduct) {
    const performPurchase = async () => {
      return await Purchases.purchaseStoreProduct(storeProduct);
    };
    return await this.handleSharedPurchase(performPurchase);
  }

  async _fetchGooglePlaySubscriptionOption(storeProduct, basePlanId, offerId) {
    const subscriptionOptions = storeProduct.subscriptionOptions;

    if (subscriptionOptions && subscriptionOptions.length > 0) {
      const subscriptionOptionId = this.buildSubscriptionOptionId(
        basePlanId,
        offerId
      );

      let subscriptionOption = null;

      for (const option of subscriptionOptions) {
        if (option.id === subscriptionOptionId) {
          subscriptionOption = option;
          break;
        }
      }

      subscriptionOption = subscriptionOption ?? storeProduct.defaultOption;

      return subscriptionOption;
    }

    return null;
  }

  buildSubscriptionOptionId(basePlanId, offerId) {
    let result = "";

    if (basePlanId !== null) {
      result += basePlanId;
    }

    if (offerId !== null) {
      if (basePlanId !== null) {
        result += ":";
      }
      result += offerId;
    }

    return result;
  }

  async _purchaseSubscriptionOption(subscriptionOption) {
    const performPurchase = async () => {
      return await Purchases.purchaseSubscriptionOption(subscriptionOption);
    };

    return await this.handleSharedPurchase(performPurchase);
  }

  async handleSharedPurchase(performPurchase) {
    try {
      const purchaseDate = new Date();
      const makePurchaseResult = await performPurchase();

      if (
        this.hasActiveEntitlementOrSubscription(makePurchaseResult.customerInfo)
      ) {
        const latestTransactionPurchaseDate = new Date(
          makePurchaseResult.transaction.purchaseDate
        );

        const isNewPurchase = latestTransactionPurchaseDate === null;
        const purchaseHappenedInThePast = latestTransactionPurchaseDate
          ? purchaseDate > latestTransactionPurchaseDate
          : false;

        if (!isNewPurchase && purchaseHappenedInThePast) {
          return new PurchaseResultRestored();
        } else {
          return new PurchaseResultPurchased();
        }
      } else {
        return new PurchaseResultFailed("No active subscriptions found.");
      }
    } catch (e) {
      if (e.userCancelled) {
        return new PurchaseResultCancelled();
      }
      if (e.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
        return new PurchaseResultPending();
      } else {
        return new PurchaseResultFailed(e.message);
      }
    }
  }

  async restorePurchases() {
    try {
      await Purchases.restorePurchases();
      return RestorationResult.restored();
    } catch (e) {
      return RestorationResult.failed(e.message);
    }
  }

  hasActiveEntitlementOrSubscription(customerInfo) {
    return (
      customerInfo.activeSubscriptions.length > 0 &&
      Object.keys(customerInfo.entitlements.active).length > 0
    );
  }
}
