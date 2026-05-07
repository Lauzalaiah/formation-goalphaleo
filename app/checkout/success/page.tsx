import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function CheckoutSuccess() {
  return (
    <div 
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/dollar-bg-bright.jpg')" }}
    >
      {/* Overlay leger pour lisibilite du texte */}
      <div className="absolute inset-0 z-0 bg-black/20" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-lg px-6 text-center">
        <div className="mb-6 inline-flex size-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="size-10 text-green-500" />
        </div>

        <h1 className="mb-4 font-serif text-3xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Paiement confirme !
        </h1>

        <p className="mb-8 font-sans font-medium text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Merci pour votre achat !
        </p>

        <div className="mb-8 rounded-xl border border-border bg-card p-6 text-left">
          <div className="mb-4 flex items-center gap-3">
            <Mail className="size-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Confirmation d&apos;achat
            </h2>
          </div>
          <ul className="space-y-3 font-sans text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
              Vous recevrez un email de confirmation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
              Pensez à vérifier vos spams si vous ne voyez rien
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 block size-1.5 shrink-0 rounded-full bg-primary" />
              Accédez à la formation directement depuis la page d&apos;accueil
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-sans text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
