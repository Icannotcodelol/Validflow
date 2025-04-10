import { Resend } from 'resend';

// Declare resend but initialize lazily
let resend: Resend | null = null;

// Helper function to get/initialize the client
function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      // Throw a more informative error at runtime if the key is still missing
      throw new Error('RESEND_API_KEY environment variable is not set.');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

type EmailTemplateProps = {
  customerName: string;
  customerEmail: string;
  credits?: number;
  amount?: number;
  subscriptionEnd?: string;
  isSubscription?: boolean;
};

export async function sendPurchaseConfirmation({
  customerName,
  customerEmail,
  credits,
  amount,
  subscriptionEnd,
  isSubscription
}: EmailTemplateProps) {
  try {
    const client = getResendClient(); // Get client instance
    const subject = isSubscription 
      ? 'Your ValiNow Unlimited Subscription is Active!'
      : 'Your ValiNow Credits Purchase Confirmation';

    const message = isSubscription
      ? `
        <h1>Welcome to ValiNow Unlimited!</h1>
        <p>Hi ${customerName},</p>
        <p>Your unlimited subscription is now active. You have access to all ValiNow features until ${subscriptionEnd}.</p>
        <p>You can now:</p>
        <ul>
          <li>Validate unlimited business ideas</li>
          <li>Access all premium features</li>
          <li>Get detailed analysis and reports</li>
        </ul>
        <p>If you have any questions, just reply to this email.</p>
        <p>Best regards,<br>The ValiNow Team</p>
      `
      : `
        <h1>Thanks for Your Purchase!</h1>
        <p>Hi ${customerName},</p>
        <p>We've successfully added ${credits} credits to your ValiNow account.</p>
        <p>Your purchase details:</p>
        <ul>
          <li>Credits: ${credits}</li>
          <li>Amount: €${(amount! / 100).toFixed(2)}</li>
        </ul>
        <p>You can start using your credits right away to validate your business ideas.</p>
        <p>If you have any questions, just reply to this email.</p>
        <p>Best regards,<br>The ValiNow Team</p>
      `;

    await client.emails.send({
      from: 'ValiNow <onboarding@resend.dev>',
      to: [customerEmail],
      subject: subject,
      html: message,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

export async function sendSubscriptionCancelledEmail({
  customerName,
  customerEmail
}: EmailTemplateProps) {
  try {
    const client = getResendClient(); // Get client instance
    await client.emails.send({
      from: 'ValiNow <onboarding@resend.dev>',
      to: [customerEmail],
      subject: 'Your ValiNow Subscription Has Been Cancelled',
      html: `
        <h1>Subscription Cancelled</h1>
        <p>Hi ${customerName},</p>
        <p>Your ValiNow unlimited subscription has been cancelled. You'll continue to have access until the end of your current billing period.</p>
        <p>We're sorry to see you go. If you'd like to share any feedback about your experience, please reply to this email.</p>
        <p>You can still use ValiNow with credits or reactivate your subscription at any time.</p>
        <p>Best regards,<br>The ValiNow Team</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }
}

export async function sendPaymentFailedEmail({
  customerName,
  customerEmail
}: EmailTemplateProps) {
  try {
    const client = getResendClient(); // Get client instance
    await client.emails.send({
      from: 'ValiNow <onboarding@resend.dev>',
      to: [customerEmail],
      subject: 'Action Required: Payment Failed for ValiNow Subscription',
      html: `
        <h1>Payment Failed</h1>
        <p>Hi ${customerName},</p>
        <p>We weren't able to process your latest payment for your ValiNow subscription.</p>
        <p>To keep your unlimited access:</p>
        <ul>
          <li>Please check your payment method</li>
          <li>Ensure your card details are up to date</li>
          <li>We'll try the payment again in 24 hours</li>
        </ul>
        <p>Need help? Just reply to this email.</p>
        <p>Best regards,<br>The ValiNow Team</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send payment failed email:', error);
  }
}