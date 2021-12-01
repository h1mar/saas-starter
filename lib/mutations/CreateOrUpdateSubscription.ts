import { SubscriptionPlan, SubscriptionStatus } from '.prisma/client';
import { getPlanByPriceId } from '@lib/plans';
import prisma from '@lib/prisma';
import Stripe from 'stripe';

export default async function CreateOrUpdateSubscription(
	subscription: Stripe.Subscription
) {
	const stripeCustomer = await prisma.stripeCustomer.findFirst({
		where: {
			id: subscription.customer as string,
		},
	});

	await prisma.subscription.upsert({
		where: {
			id: subscription.id,
		},
		create: {
			id: subscription.id,
			status: subscription.status as SubscriptionStatus,
			metadata: subscription.metadata,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: new Date(subscription.canceled_at * 1000),
			cancel_at: new Date(subscription.cancel_at * 1000),
			start_date: new Date(subscription.start_date * 1000),
			ended_at: new Date(subscription.ended_at * 1000),
			trial_start: new Date(subscription.trial_start * 1000),
			trial_end: new Date(subscription.trial_end * 1000),
			user: {
				connect: {
					id: stripeCustomer.userId,
				},
			},
			name: getPlanByPriceId(
				subscription.items.data[0].price.id
			) as SubscriptionPlan,
			priceId: subscription.items.data[0].price.id,
		},
		update: {
			status: subscription.status,
			metadata: subscription.metadata,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: new Date(subscription.canceled_at * 1000),
			cancel_at: new Date(subscription.cancel_at * 1000),
			start_date: new Date(subscription.start_date * 1000),
			ended_at: new Date(subscription.ended_at * 1000),
			trial_start: new Date(subscription.trial_start * 1000),
			trial_end: new Date(subscription.trial_end * 1000),
			priceId: subscription.items.data[0].price.id,
			name: getPlanByPriceId(
				subscription.items.data[0].price.id
			) as SubscriptionPlan,
		},
	});
}
