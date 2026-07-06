import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { hash as argon2Hash } from '@node-rs/argon2';
import { db } from '@/lib/db/client';
import { users, accounts } from '@/lib/db/schema';

// Email/password signup. Creates a users row (tier default 'free') + a
// credentials accounts row holding the argon2 hash. The client then calls
// signIn('credentials', ...) to establish the session. Auth.js OAuth signups
// go through the adapter, not this route.

const signupSchema = z.object({
  name: z.string().min(2, 'Naam moet minstens 2 tekens zijn.'),
  email: z.string().email('Vul een geldig e-mailadres in.'),
  password: z.string().min(8, 'Wachtwoord moet minstens 8 tekens zijn.'),
});

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { name, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit e-mailadres.' },
        { status: 409 }
      );
    }

    const passwordHash = await argon2Hash(password);
    const [user] = await db.insert(users).values({ email, name }).returning();
    await db.insert(accounts).values({
      userId: user.id,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: user.id,
      passwordHash,
    });

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Er ging iets mis. Probeer het opnieuw.' }, { status: 500 });
  }
}
