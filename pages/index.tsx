import { getSession, signIn, signOut } from 'next-auth/client';
import Link from 'next/link';

export default function Home({ session }) {
	if (session) {
		return (
			<>
				Signed in as {session.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
				<Link href="/account">
					<button>account settings</button>
				</Link>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (session) {
		// add user data to props to render pricing plan
		return {
			props: { session: session.user },
		};
	} else return { props: { session: null } };
}
