import prisma from '@lib/prisma';
import stripe from '@lib/stripe';
import { Session } from 'next-auth';

export default async function FindOrCreateCustomer(userSession: Session) {
	const user = await prisma.user.findFirst({
		where: {
			email: userSession.user.email,
		},
		include: {
			stripeCustomer: true,
		},
	});

	if (!user.stripeCustomer) {
		const customer = await stripe.customers.create({
			email: userSession.user.email,
			name: userSession.user.name,
		});

		await prisma.stripeCustomer.create({
			data: {
				id: customer.id,
				userId: user.id,
			},
		});

		return customer.id;
	}

	if (user.stripeCustomer) {
		return user.stripeCustomer.id;
	}
}
