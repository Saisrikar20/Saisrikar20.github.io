import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (apiKey && audienceId) {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: cleanEmail,
          unsubscribed: false,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Resend audience error:', errData);
        // If already subscribed, return friendly success
        if (errData?.message?.toLowerCase().includes('already exists')) {
          return NextResponse.json({
            message: "You're already subscribed to the newsletter!",
            alreadySubscribed: true,
          });
        }
      }
    } else {
      console.log(`[Newsletter Subscription] New subscriber: ${cleanEmail}`);
    }

    return NextResponse.json({
      message: 'Thank you for subscribing! You will receive new post notifications.',
      email: cleanEmail,
    });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
