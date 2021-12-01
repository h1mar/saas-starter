import { getCsrfToken, getSession } from 'next-auth/client';

export default function SignIn({ csrfToken }) {
	return (
		<form method="post" action="/api/auth/signin/email">
			<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
			<label>
				Email address
				<input type="email" id="email" name="email" />
			</label>
			<button type="submit">Sign in with Email</button>
		</form>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const csrfToken = await getCsrfToken(context);

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { csrfToken },
	};
}
