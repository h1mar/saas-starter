import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@lib/stripe';
import Stripe from 'stripe';
import CreateOrUpdateSubscription from '@lib/mutations/CreateOrUpdateSubscription';
import DeleteSubscription from '@lib/mutations/DeleteSubscription';

export const config = {
	api: {
		bodyParser: false,
	},
};

async function buffer(readable) {
	const chunks = [];
	for await (const chunk of readable) {
		chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
	}
	return Buffer.concat(chunks);
}

const relevantEvents = new Set([
	'checkout.session.completed',
	'customer.subscription.created',
	'customer.subscription.updated',
	'customer.subscription.deleted',
]);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'POST') {
		let data;
		let eventType;

		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

		let event;
		let signature = req.headers['stripe-signature'];
		const buf = await buffer(req);

		try {
			event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
		} catch (err) {
			console.log(`Webhook Error: ${err.message}`);
			return res.status(400).send(`Webhook Error: ${err.message}`);
		}
		// Extract the object from the event.
		data = event.data;
		eventType = event.type;

		const subscription = data.object as Stripe.Subscription;

		if (relevantEvents.has(eventType)) {
			try {
				switch (eventType) {
					case 'checkout.session.completed':
						const checkoutSession = data.object as Stripe.Checkout.Session;
						if (checkoutSession.mode === 'subscription') {
							await CreateOrUpdateSubscription(
								checkoutSession.subscription as Stripe.Subscription
							);
						}
						console.log('checkout.session.completed');
						break;
					case 'customer.subscription.created':
						console.log('customer.subscription.created');
						await CreateOrUpdateSubscription(subscription);
						break;
					case 'customer.subscription.updated':
						console.log('customer.subscription.updated');
						await CreateOrUpdateSubscription(subscription);
						break;
					case 'customer.subscription.deleted':
						console.log('customer.subscription.deleted');
						await DeleteSubscription(subscription);
						break;
					default:
						throw new Error('Unhandled relevant event!');
				}
			} catch (error) {
				console.log(error);
				return res.status(400).send(`Webhook handler failed: ${error}`);
			}
		}

		res.json({ received: true });
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
