import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK, {
	// https://github.com/stripe/stripe-node#configuration
	apiVersion: '2020-08-27',
	// Register this as an official Stripe plugin.
	// https://stripe.com/docs/building-plugins#setappinfo
	appInfo: {
		name: 'Next.js Subscription Starter',
		version: '0.1.0',
	},
});

export async function createPortalSession() {
	const res = await fetch('/api/payments/create-portal-session', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		credentials: 'same-origin',
	});
	const json = await res.json();
	window.location.assign(json.url);
}

export async function createCheckoutSession(priceId: string) {
	const res = await fetch('/api/payments/create-checkout-session', {
		method: 'POST',
		headers: new Headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({ priceId }),
		credentials: 'same-origin',
	});
	const json = await res.json();
	window.location.assign(json.url);
}

export default stripe;
