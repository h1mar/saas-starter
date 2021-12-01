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

	let customerId;

	if (userSession.user.email) {
		customerId = await FindOrCreateCustomer(userSession);
	}

	const portalSession = await stripe.billingPortal.sessions.create({
		customer: customerId,
		// This is the url to which the customer will be redirected when they are done
		// managing their billing with the portal.
		return_url: 'https://saas-starter-h1mar.vercel.app/account',
	});

	// Redirect to the URL for the session
	return res.status(200).json({ url: portalSession.url });
}
