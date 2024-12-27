import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { UserInvitationEmail } from '@/emails/UserInvitationEmail';

// Configure email transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendInvitationEmail(
  to: string, 
  inviteToken: string, 
  invitedBy: string,
  organizationName: string
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/setup-account?token=${inviteToken}`;
  
  const emailHtml = render(
    UserInvitationEmail({
      inviteUrl,
      invitedBy,
      organizationName,
    })
  );

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: `Join ${organizationName} on Arborra`,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
}
