export default async function handler(req, res) {
  // Simple PayFast IPN stub for Vercel deployment.
  // For production, validate the signature/passphrase and verify fields with PayFast.
  try {
    const body = req.method === 'POST' ? req.body : req.query;
    console.log('PayFast notify received', body);

    // Basic handling: if payment_status indicates completion, respond 200.
    const status = (body.payment_status || body.payment_state || body.status || '').toString().toLowerCase();
    if (status.includes('complete') || status.includes('paid')) {
      // In a real backend update your booking record here (database).
      console.log('Payment complete for', body.m_payment_id || body['m_payment_id']);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('notify error', err);
    res.status(500).send('error');
  }
}
