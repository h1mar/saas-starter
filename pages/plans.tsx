import plans from '@lib/plans';
import { createCheckoutSession } from '@lib/stripe';

export default function Plans() {
	return (
		<div>
			<button onClick={() => createCheckoutSession(plans.PRO)}>pro</button>
			<button onClick={() => createCheckoutSession(plans.BUSINESS)}>
				business
			</button>
			<button onClick={() => createCheckoutSession(plans.ENTERPRISE)}>
				enterprise
			</button>
		</div>
	);
}
