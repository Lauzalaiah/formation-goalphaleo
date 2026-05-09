import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const resend = new Resend(process.env.RESEND_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.text()

    const headersList = await headers()

    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const email = session.customer_details?.email

      if (!email) {
        return NextResponse.json(
          { error: "No customer email" },
          { status: 400 }
        )
      }

      const password =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-4)

      const { data: userData, error: createUserError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
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
        has_access: true
      })

      await resend.emails.send({
        from: "GoalPhaleo <onboarding@resend.dev>",
        to: email,
        subject: "Vos accès Formation GoalPhaleo",
        html: `
          <h1>Bienvenue sur GoalPhaleo</h1>

          <p>Votre accès à la formation est maintenant actif.</p>

          <p><strong>Email :</strong> ${email}</p>

          <p><strong>Mot de passe :</strong> ${password}</p>

          <p>
            Connexion :
            <a href="https://formation.goalphaleo.fr/auth/login">
              https://formation.goalphaleo.fr/auth/login
            </a>
          </p>
        `
      })

      console.log("Utilisateur créé :", email)
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
