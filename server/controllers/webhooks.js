// Stripe webhook handler removed; keep a stub to return 410 if accidentally called.
export const stripeWebhooks = async (request, response) => {
  return response.status(410).json({ success: false, message: 'Stripe webhooks removed' });
}