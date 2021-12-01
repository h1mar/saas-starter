import { getSession } from 'next-auth/client';
import prisma from '../lib/prisma';
import Link from 'next/link';
import { createPortalSession } from '@lib/stripe';

export default function Account({ user }) {
	return (
		<div>
			<Link href="/">go back</Link>
			<h1>account settings</h1>
			<ul>
				<li>email: {user.email}</li>
				<form action="/api/user" method="POST">
					<li>
						name: {user.name}
						<input type="text" name="name" />
						<button type="submit">submit new name</button>
					</li>
				</form>
				<li>
					plan: {user?.subscription?.name ? user.subscription.name : 'FREE'}
					{!user.subscription || user.subscription.name === 'FREE' ? (
						<Link href="/plans">
							<button>choose plan</button>
						</Link>
					) : null}
				</li>
				<button onClick={createPortalSession}>manage billing</button>
			</ul>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/signin',
				permanent: false,
			},
		};
	}

	let user = await prisma.user.findFirst({
		where: {
			email: session.user.email,
		},
		select: {
			createdAt: false,
			email: true,
			name: true,
			subscription: {
				select: {
					id: true,
					name: true,
					priceId: true,
					status: true,
				},
			},
		},
	});

	return {
		props: { user },
	};
}
