import { getSession } from 'next-auth/client';

export default function VerifyRequest() {
	return (
		<div>
			<h1>Check your email</h1>
			<p>A sign in link has been sent to your email address.</p>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (session) {
		return {
			redirect: {
				destination: '/account',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
