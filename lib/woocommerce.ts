import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const wcUrl = process.env.NEXT_PUBLIC_WC_URL;
const wcKey = process.env.WC_CONSUMER_KEY;
const wcSecret = process.env.WC_CONSUMER_SECRET;

if (!wcUrl || !wcKey || !wcSecret) {
    console.warn('⚠️ WooCommerce environment variables are missing. SDK initialization may fail at runtime.');
}

const WooCommerce = new WooCommerceRestApi({
    url: wcUrl || 'https://placeholder.com',
    consumerKey: wcKey || 'ck_placeholder',
    consumerSecret: wcSecret || 'cs_placeholder',
    version: "wc/v3",
    queryStringAuth: true // Required for some hosting environments
});

export default WooCommerce;
