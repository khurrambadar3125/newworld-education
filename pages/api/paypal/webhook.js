// pages/api/paypal/webhook.js
// Handles PayPal subscription webhooks

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;
  const eventType = event?.event_type;

  console.log('[PayPal Webhook] Event:', eventType);

  try {
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.RENEWED': {
        const subscriptionId = event.resource?.id;
        const planId = event.resource?.plan_id;
        const subscriberEmail = event.resource?.subscriber?.email_address;

        console.log(`[PayPal Webhook] Subscription active: ${subscriptionId}, plan: ${planId}, email: ${subscriberEmail}`);

        // Map PayPal Plan ID to our plan name
        const planMap = {
          'P-94P5336054823460NNGS5MIY': 'starter',
          'P-8FYS0096MF117684FNGS5QKA': 'scholar',
          'P-0PS81623HP313672PNGS5SWA': 'family',
          'P-4C972623LC808300XNGS5XDY': 'special-needs',
        };

        const planName = planMap[planId] || 'starter';

        // Store in Redis if needed (optional - client handles via localStorage)
        // You could store subscriptionId -> planName mapping here for server-side verification

        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED':
      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        const subscriptionId = event.resource?.id;
        console.log(`[PayPal Webhook] Subscription ended: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`[PayPal Webhook] Unhandled event: ${eventType}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[PayPal Webhook] Error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
