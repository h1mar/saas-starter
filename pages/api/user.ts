import type { NextApiRequest, NextApiResponse } from 'next';
import stripe from '@lib/stripe';
import { getSession } from 'next-auth/client';
import prisma from '@lib/prisma';
import FindOrCreateCustomer from '@lib/mutations/FindOrCreateCustomer';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ message: 'Not authenticated' });
	}

	if (req.body?.name) {
		await prisma.user.update({
			where: {
				email: session.user.email,
			},
			data: {
				name: req.body.name,
			},
			select: {
				name: true,
				email: true,
			},
		});

		res.status(200).redirect('/account');
	} else {
		return res.status(400).json({ message: 'Bad request' });
	}
}
