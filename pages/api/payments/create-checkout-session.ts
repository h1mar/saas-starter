import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@lib/stripe';
import { getSession } from 'next-auth/client';
import FindOrCreateCustomer from '@lib/mutations/FindOrCreateCustomer';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const userSession = await getSession({ req });

	if (!userSession) {
		return res.status(401).json({ message: 'Not authenticated' });
	}

	// The price ID passed from the client
	const { priceId } = req.body;

	if (!priceId) {
		return res.status(400).json({ message: 'Bad request' });
	}

	let customerId;

	if (userSession.user.email) {
		customerId = await FindOrCreateCustomer(userSession);
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer: customerId,
		line_items: [
			{
				price: priceId,
				// For metered billing, do not pass quantity
				quantity: 1,
			},
		],
		success_url: 'https://saas-starter-h1mar.vercel.app/account',
		cancel_url: 'https://saas-starter-h1mar.vercel.app/account',
	});

	return res.status(200).json({ url: session.url });
}
