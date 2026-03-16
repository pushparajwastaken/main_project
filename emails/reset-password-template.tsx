import {
  Html,
  Head,
  Preview,
  Heading,
  Section,
  Text,
  Container,
  Hr,
  Button,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  username: string;
  resetLink: string;
}

export default function ResetPasswordEmail({
  username = "Alex",
  resetLink = "https://example.com/reset-password?token=abc123",
}: ResetPasswordEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        `}</style>
      </Head>

      <Preview>Reset your password — link expires in 1 hour</Preview>

      <Section style={main}>
        <Container style={container}>
          <Section style={headerBar}>
            <Text style={brandMark}>✦ secure reset</Text>
          </Section>

          <Section style={body}>
            <Text style={eyebrow}>Password Reset</Text>
            <Heading style={heading}>
              Forgot your password?{"\n"}
              <em>No worries.</em>
            </Heading>

            <Text style={text}>
              Hey <strong style={nameStyle}>{username}</strong> — we received a
              request to reset your password. Click the button below to choose a
              new one.
            </Text>

            <Section style={buttonWrapper}>
              <Button style={resetButton} href={resetLink}>
                Reset My Password
              </Button>
              <Text style={buttonCaption}>⏱ This link expires in 1 hour</Text>
            </Section>

            <Hr style={divider} />

            <Text style={smallText}>
              Or copy and paste this URL into your browser:
            </Text>
            <Text style={linkText}>{resetLink}</Text>

            <Hr style={divider} />

            <Text style={smallText}>
              Didn't request a password reset? You can safely ignore this email.
              Your password will not be changed.
            </Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              Sent with care by <strong>The Team</strong> · You're receiving
              this because you requested a password reset.
            </Text>
            <Text style={footerLinks}>
              <a href="#" style={link}>
                Privacy Policy
              </a>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="#" style={link}>
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const fontStack = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";

const main: React.CSSProperties = {
  backgroundColor: "#f0ede8",
  padding: "48px 16px",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  maxWidth: "500px",
  margin: "0 auto",
  overflow: "hidden",
  boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
  fontFamily: fontStack,
};

const headerBar: React.CSSProperties = {
  backgroundColor: "#111",
  padding: "14px 32px",
};

const brandMark: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  color: "#e8e2d9",
  margin: "0",
};

const body: React.CSSProperties = {
  padding: "36px 36px 24px",
};

const eyebrow: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "2.5px",
  textTransform: "uppercase" as const,
  color: "#c17f3d",
  margin: "0 0 12px",
};

const heading: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.25",
  color: "#111",
  margin: "0 0 20px",
  whiteSpace: "pre-line" as const,
};

const text: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#555",
  margin: "0 0 28px",
};

const nameStyle: React.CSSProperties = {
  color: "#111",
  fontWeight: "600",
};

const buttonWrapper: React.CSSProperties = {
  backgroundColor: "#f7f4f0",
  borderRadius: "12px",
  padding: "28px 20px 20px",
  textAlign: "center" as const,
  marginBottom: "28px",
  border: "1px solid #e8e2d9",
};

const resetButton: React.CSSProperties = {
  backgroundColor: "#111",
  color: "#ffffff",
  fontFamily: fontStack,
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "14px 32px",
  borderRadius: "8px",
  display: "inline-block",
};

const buttonCaption: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "12px",
  color: "#999",
  margin: "14px 0 0",
  letterSpacing: "0.3px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #ede9e4",
  margin: "0 0 20px",
};

const smallText: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#999",
  margin: "0 0 8px",
};

const linkText: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Courier New', monospace",
  fontSize: "11px",
  color: "#c17f3d",
  wordBreak: "break-all" as const,
  margin: "0 0 20px",
};

const footerSection: React.CSSProperties = {
  backgroundColor: "#f7f4f0",
  borderTop: "1px solid #ede9e4",
  padding: "20px 36px",
};

const footerText: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "12px",
  color: "#aaa",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const footerLinks: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "12px",
  color: "#bbb",
  margin: "0",
};

const link: React.CSSProperties = {
  color: "#c17f3d",
  textDecoration: "none",
};
