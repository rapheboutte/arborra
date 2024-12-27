import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface UserInvitationEmailProps {
  inviteUrl: string;
  invitedBy: string;
  organizationName: string;
}

export const UserInvitationEmail = ({
  inviteUrl,
  invitedBy,
  organizationName,
}: UserInvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Join {organizationName} on Arborra</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {organizationName}</Heading>
          <Text style={text}>
            You've been invited by {invitedBy} to join {organizationName} on Arborra, 
            your compliance management platform.
          </Text>
          <Text style={text}>
            To get started, click the button below to set up your account:
          </Text>
          <Section style={buttonContainer}>
            <Button
              pX={20}
              pY={12}
              style={button}
              href={inviteUrl}
            >
              Set Up Your Account
            </Button>
          </Section>
          <Text style={text}>
            This link will expire in 24 hours. If you need a new invitation,
            please contact your administrator.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you did not expect this invitation, you can safely ignore this email.
            This invitation was intended for use with {organizationName}'s Arborra account.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const buttonContainer = {
  margin: '30px 0',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

export default UserInvitationEmail;
