import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import prisma from '@lib/prisma';

export default NextAuth({
	adapter: Adapters.Prisma.Adapter({
		prisma,
	}),
	// Configure one or more authentication providers
	providers: [
		Providers.Email({
			server: {
				host: process.env.SMTP_HOST,
				port: process.env.SMTP_PORT,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			},
			from: process.env.SMTP_FROM,
		}),
		// ...add more providers here
	],
	pages: {
		signIn: '/signin',
		signOut: '/auth/signout',
		error: '/error', // Error code passed in query string as ?error=
		verifyRequest: '/verify-request', // (used for check email message)
		newUser: null, // If set, new users will be directed here on first sign in
	},
	secret: process.env.NEXT_AUTH_SECRET,
});
