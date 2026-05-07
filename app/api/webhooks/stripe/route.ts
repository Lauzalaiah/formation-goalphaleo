import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const resend = new Resend(process.env.RESEND_API_KEY!)

  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Webhook signature verification failed:", message)
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const customerEmail = session.customer_details?.email

    if (!customerEmail) {
      return NextResponse.json(
        { error: "No customer email" },
        { status: 400 }
      )
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Formation Fansly <noreply@goalphaleo.fr>",
        to: customerEmail,
        subject: "Confirmation de votre achat",
        html: `<p>Merci pour votre achat! Vous pouvez accéder à la formation directement depuis notre site.</p>`,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return NextResponse.json({ received: true })
}
