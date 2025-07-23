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

interface PortalInvitationEmailProps {
  clientName?: string;
  clientEmail?: string;
  portalName?: string;
  portalUrl?: string;
  inviterName?: string;
  companyName?: string;
}

export const PortalInvitationEmail = ({
  clientName = 'there',
  clientEmail = 'client@example.com',
  portalName = 'your client portal',
  portalUrl = 'https://portal.example.com',
  inviterName = 'the team',
  companyName = 'Acme Corp',
}: PortalInvitationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>You've been invited to {portalName}</title>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        You've been invited to access {portalName}. Click to get started.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header */}
          {/* <Section style={header}>
            <Row>
              <Column>
                <Text style={logo}>{companyName}</Text>
              </Column>
            </Row>
          </Section> */}

          {/* Main Content */}
          <Section style={content}>
            
            {/* Invitation Message */}
            <Row>
              <Column>
                <Heading as="h1" style={h1}>
                  You're invited to {portalName}
                </Heading>
                <Text style={paragraph}>
                  Hi <strong>{clientName}</strong>, you now have access to your dedicated client portal. 
                  You can view your invoices, documents and communicate with our team.
                </Text>
              </Column>
            </Row>

            {/* CTA */}
            <Row>
              <Column>
                <div style={buttonContainer}>
                  <Button href={portalUrl} style={button}>
                    Access portal
                  </Button>
                </div>
                <Text style={linkInfo}>
                  Or copy and paste this link in your browser:<br />
                  <Link href={portalUrl} style={link}>{portalUrl}</Link>
                </Text>
              </Column>
            </Row>

            {/* Security note */}
            <Row>
              <Column>
                <div style={securityNote}>
                  <Text style={securityText}>
                    <strong>Note:</strong> This invitation is for {clientEmail}. 
                    You may need to create a password on your first login.
                  </Text>
                </div>
              </Column>
            </Row>

            {/* Support */}
            <Row>
              <Column>
                <Text style={supportText}>
                  Need help accessing your portal? Reply to this email and we'll assist you.
                </Text>
              </Column>
            </Row>

          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Row>
              <Column>
                <Text style={footerText}>
                  — {inviterName}
                </Text>
                <Hr style={footerHr} />
                <Text style={footerLinks}>
                  <Link href={`${portalUrl}/help`} style={footerLink}>Help</Link>
                  {' • '}
                  <Link href={`${portalUrl}/contact`} style={footerLink}>Contact</Link>
                </Text>
              </Column>
            </Row>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

// Styles with black button
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

const buttonContainer = {
  margin: '0px 0 15px 0',
};

const button = {
  backgroundColor: '#000000',
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

const linkInfo = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#8898aa',
  margin: '0 0 20px 0',
};

const link = {
  color: '#635bff',
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
};

const securityNote = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  margin: '20px 0',
  border: '1px solid #e9ecef',
};

const securityText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#525252',
  margin: '0',
};

const supportText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#8898aa',
  margin: '20px 0 0 0',
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
PortalInvitationEmail.PreviewProps = {
  clientName: 'Sarah Johnson',
  clientEmail: 'sarah@company.com',
  portalName: 'Project Apollo Portal',
  portalUrl: 'https://portal.acmecorp.com/invite/abc123',
  inviterName: 'Mike from Acme Corp',
  companyName: 'Acme Corp',
} as PortalInvitationEmailProps;

export default PortalInvitationEmail;