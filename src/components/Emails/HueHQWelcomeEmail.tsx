import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Link,
  Preview,
  Font,
  Hr,
} from '@react-email/components';

interface HueHQWelcomeEmailProps {
  portalUrl?: string;
  userName?: string;
}

export const HueHQWelcomeEmail = ({
  portalUrl = 'https://app.huehq.com',
}: HueHQWelcomeEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Welcome to HueHQ</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Welcome to HueHQ. Your account is ready and here's how to get started.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Text style={logo}>HueHQ</Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            
            {/* Welcome Message */}
            <Row>
              <Column>
                <Heading as="h1" style={h1}>
                  Welcome to HueHQ
                </Heading>
                <Text style={paragraph}>
                  Thanks for signing up. Your account is ready and you can start managing clients and creating invoices right away.
                </Text>
              </Column>
            </Row>

            {/* Getting Started */}
            <Row>
              <Column>
                <Text style={sectionTitle}>
                  Getting started
                </Text>
                
                <div style={listItem}>
                  <Text style={listText}>
                    <strong>Add your first client</strong> — Start building your client database with contact information and project details.
                  </Text>
                  <Link href={`${portalUrl}/clients`} style={listLink}>
                    Go to Clients
                  </Link>
                </div>

                <div style={listItem}>
                  <Text style={listText}>
                    <strong>Create your first invoice</strong> — Generate professional invoices and send them directly to your clients.
                  </Text>
                  <Link href={`${portalUrl}/billing`} style={listLink}>
                    Create invoice
                  </Link>
                </div>

                <div style={listItem}>
                  <Text style={listText}>
                    <strong>Customize your portal</strong> — Upload your logo and set brand colors to make your portal uniquely yours.
                  </Text>
                  <Link href={`${portalUrl}/customize`} style={listLink}>
                    Customize portal
                  </Link>
                </div>

                <div style={listItem}>
                  <Text style={listText}>
                    <strong>Upload files</strong> — Store and share contracts, proposals, and project files securely with your clients.
                  </Text>
                  <Link href={`${portalUrl}/files`} style={listLink}>
                    Manage files
                  </Link>
                </div>
              </Column>
            </Row>

            {/* CTA */}
            <Row>
              <Column>
                <div style={buttonContainer}>
                  <Button href={`${portalUrl}/dashboard`} style={button}>
                    Go to dashboard
                  </Button>
                </div>
              </Column>
            </Row>

            {/* Support */}
            <Row>
              <Column>
                <Text style={supportText}>
                  Questions? Visit our <Link href={`${portalUrl}/help`} style={link}>help center</Link> or reply to this email.
                </Text>
              </Column>
            </Row>

          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Row>
              <Column>
                <Text style={footerText}>
                  — The HueHQ team
                </Text>
                <Hr style={footerHr} />
                <Text style={footerLinks}>
                  <Link href={`${portalUrl}/help`} style={footerLink}>Help</Link>
                  {' • '}
                  <Link href={`${portalUrl}/contact`} style={footerLink}>Contact</Link>
                  {' • '}
                  <Link href={`${portalUrl}/unsubscribe`} style={footerLink}>Unsubscribe</Link>
                </Text>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// Stripe-inspired minimalist styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a1a',
};

const container = {
  maxWidth: '580px',
  margin: '0 auto',
  padding: '0 20px',
};

const header = {
  paddingTop: '50px',
  paddingBottom: '25px',
};

const logo = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#000000',
  margin: '0',
  letterSpacing: '-0.5px',
};

const content = {
  paddingBottom: '50px',
};

const h1 = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#000000',
  margin: '30px 0 15px 0',
  lineHeight: '30px',
  letterSpacing: '-0.5px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0 0 30px 0',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  margin: '30px 0 20px 0',
};

const listItem = {
  marginBottom: '20px',
  paddingBottom: '20px',
  borderBottom: '1px solid #f6f6f6',
};

const listText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0 0 8px 0',
};

const listLink = {
  fontSize: '14px',
  color: '#635bff',
  textDecoration: 'none',
  fontWeight: '500',
};

const buttonContainer = {
  margin: '30px 0',
};

const button = {
  backgroundColor: '#635bff',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  lineHeight: '1.25',
  margin: '0',
};

const supportText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#8898aa',
  margin: '30px 0 0 0',
};

const link = {
  color: '#635bff',
  textDecoration: 'none',
};

const footer = {
  paddingTop: '20px',
  paddingBottom: '50px',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#8898aa',
  margin: '0 0 20px 0',
};

const footerHr = {
  borderColor: '#f6f6f6',
  margin: '20px 0',
};

const footerLinks = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#8898aa',
  margin: '0',
};

const footerLink = {
  color: '#8898aa',
  textDecoration: 'none',
};

// Preview Props for development
HueHQWelcomeEmail.PreviewProps = {
  portalUrl: 'https://app.huehq.com',
  userName: 'Alex',
} as HueHQWelcomeEmailProps;

export default HueHQWelcomeEmail;