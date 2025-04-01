import Stripe from "stripe"
import express from "express"
import cors from "cors"
import { UserSchema } from "@repo/db/index"
import { initializeApp, applicationDefault } from "firebase-admin/app"
import db from "@repo/db/index"
import { generateObject } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod"
import { Keyv } from "keyv"
import keyvFirestore from "keyv-firestore"

if (!process.env.GCLOUD_PROJECT) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    "/Users/caleb/downloads/ll-dev-key.json"
  initializeApp({
    credential: applicationDefault()
  })
} else {
  initializeApp()
}

// @ts-ignore
const stripe = new Stripe(
  "sk_test_51M3InLGH8Cu8EiYM1RpH1zjjjgzeZRUvDLa5Z9rLttBtd51v8OuypuCoct8hLZ7E6dMtLzbhxUCOcLQNT7enutz900OEtmRvIM",
  // @ts-ignore
  { apiVersion: "2024-04-10" }
)
const webhookSecret: string = "whsec_V2YEl9fCkDtGhjWXA9hHFub9LK0qEsoO"

export const app = express()

app.use(cors())

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/webhooks") {
      next()
    } else {
      express.json()(req, res, next)
    }
  }
)

app.post(
  "/webhooks",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const sig = req.headers["stripe-signature"]

    let event: Stripe.Event

    try {
      // RawBody is a firebase thing runnong locally it might be different and could need an if statement
      event = stripe.webhooks.constructEvent(req["rawBody"], sig, webhookSecret)
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    console.log("✅ Success:", event.id)

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session

        if (!session.client_reference_id) {
          console.error("No reference ID found in checkout session")
          res.sendStatus(400)
          return
        }

        const id = db.customers.id(session.client_reference_id)
        const customer = await db.customers.get(id)

        if (customer) {
          await customer.update({
            pro: true,
            email: session.customer_email,
            stripeId: session.customer.toString()
          })

          await stripe.customers.update(session.customer.toString(), {
            metadata: {
              firebaseId: session.client_reference_id
            }
          })
        } else {
          console.error("No customer found for reference ID")
          res.sendStatus(400)
          return
        }
        break

      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomer = await stripe.customers.retrieve(
          subscription.customer as string
        )

        if (stripeCustomer.deleted) {
          console.log("Customer deleted")
        } else {
          if (!stripeCustomer.metadata.firebaseId) {
            console.error("No firebase id found")
            res.sendStatus(400)
            return
          }

          console.log("Cancelling subscription")
          const userId = db.customers.id(stripeCustomer.metadata.firebaseId)
          const user = await db.customers.get(userId)

          if (user) {
            await user.update({
              pro: false
            })
          } else {
            console.error("No user found")
            res.sendStatus(400)
            return
          }
        }
        break

      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  }
)

app.get("/portal", async (req: express.Request, res: express.Response) => {
  if ("customerId" in req.query) {
    const session = await stripe.billingPortal.sessions.create({
      customer: req.query.customerId as string,
      return_url: "https://example.com/success"
    })
    res.json({ url: session.url })
  } else {
    res.sendStatus(500)
  }
})
