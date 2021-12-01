const plans = {
	PRO: 'price_1JbWZMH8KueOim9E9s24naVk',
	BUSINESS: 'price_1JbWZtH8KueOim9EWfUd0Myp',
	ENTERPRISE: 'price_1JbWaEH8KueOim9EHtIHLTIR',
};

export function getPlanByPriceId(priceId) {
	return Object.keys(plans).find((key) => plans[key] === priceId);
}

export default plans;
