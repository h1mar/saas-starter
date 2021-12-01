import prisma from '@lib/prisma';
import Stripe from 'stripe';

export default async function DeleteSubscription(
	subscription: Stripe.Subscription
) {
	const stripeCustomer = await prisma.stripeCustomer.findFirst({
		where: {
			id: subscription.customer as string,
		},
	});

	if (stripeCustomer) {
		const updatedUser = await prisma.subscription.delete({
			where: {
				userId: stripeCustomer.userId,
			},
		});
	}
}
