import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

if (!process.env.NEXT_PUBLIC_WC_URL) {
    throw new Error('Missing NEXT_PUBLIC_WC_URL environment variable');
}

if (!process.env.WC_CONSUMER_KEY) {
    throw new Error('Missing WC_CONSUMER_KEY environment variable');
}

if (!process.env.WC_CONSUMER_SECRET) {
    throw new Error('Missing WC_CONSUMER_SECRET environment variable');
}

const WooCommerce = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WC_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3",
    queryStringAuth: true // Required for some hosting environments
});

export default WooCommerce;
