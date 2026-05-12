import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const Stripe = (await import("stripe")).default
    const { createClient } = await import("@supabase/supabase-js")
    const { Resend } = await import("resend")

    const stripeKey = process.env.STRIPE_SECRET_KEY
    const resendKey = process.env.RESEND_API_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (
      !stripeKey ||
      !supabaseUrl ||
      !supabaseKey ||
      !webhookSecret
    ) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeKey)

    const resend = resendKey
      ? new Resend(resendKey)
      : null

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    )

    const body = await req.text()

    const headersList = await headers()

    const signature =
      headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const email =
        session.customer_details?.email

      if (!email) {
        return NextResponse.json(
          { error: "No customer email" },
          { status: 400 }
        )
      }

      const password =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-4)

      const {
        data: userData,
        error: createUserError,
      } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createUserError) {
        console.error(createUserError)

        return NextResponse.json(
          { error: createUserError.message },
          { status: 500 }
        )
      }

      await supabase.from("profiles").upsert({
        id: userData.user.id,
        email,
        has_access: true,
      })

      if (resend) {
        await resend.emails.send({
          from: "GoalPhaleo <contact@goalphaleo.fr>",
          to: email,
          subject: "Vos accès Formation GoalPhaleo",
          html: `
            <h1>Bienvenue sur GoalPhaleo</h1>

            <p>Votre accès à la formation est maintenant actif.</p>

            <p><strong>Email :</strong> ${email}</p>

            <p><strong>Mot de passe :</strong> ${password}</p>
          `,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}
