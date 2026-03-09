import {
  Html,
  Head,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Hr,
  Img,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({
  username = "Alex",
  otp = "483921",
}: VerificationEmailProps) {
  const digits = otp.split("");

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Your Verification Code</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');
        `}</style>
      </Head>

      <Preview>Your verification code: {otp} — expires in 10 minutes</Preview>

      <Section style={main}>
        <Container style={container}>
          {/* Header bar */}
          <Section style={headerBar}>
            <Text style={brandMark}>✦ secure verify</Text>
          </Section>

          {/* Body */}
          <Section style={body}>
            <Text style={eyebrow}>Email Verification</Text>
            <Heading style={heading}>
              One quick step,{"\n"}
              <em>then you're in.</em>
            </Heading>

            <Text style={text}>
              Hey <strong style={nameStyle}>{username}</strong> — we need to
              confirm it's really you. Enter the code below to continue.
            </Text>

            {/* OTP Block */}
            <Section style={otpWrapper}>
              <Row>
                {digits.map((d, i) => (
                  <td key={i} style={digitCell}>
                    <Text style={digit}>{d}</Text>
                  </td>
                ))}
              </Row>
              <Text style={otpCaption}>⏱ Valid for 10 minutes</Text>
            </Section>

            <Hr style={divider} />

            <Text style={smallText}>
              Didn't request this? No worries — you can safely ignore this
              email. Your account remains secure.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Sent with care by <strong>The Team</strong> · You're receiving
              this because you signed up.
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

/* ─── Styles ─────────────────────────────────────────────── */

const fontStack = "'DM Sans', 'Helvetica Neue', Arial, sans-serif";
const monoStack = "'DM Mono', 'Courier New', monospace";

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

const otpWrapper: React.CSSProperties = {
  backgroundColor: "#f7f4f0",
  borderRadius: "12px",
  padding: "24px 20px 16px",
  textAlign: "center" as const,
  marginBottom: "28px",
  border: "1px solid #e8e2d9",
};

const digitCell: React.CSSProperties = {
  padding: "0 5px",
};

const digit: React.CSSProperties = {
  fontFamily: monoStack,
  fontSize: "34px",
  fontWeight: "500",
  color: "#111",
  backgroundColor: "#ffffff",
  border: "1.5px solid #e0dbd2",
  borderRadius: "8px",
  width: "44px",
  height: "52px",
  lineHeight: "52px",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const otpCaption: React.CSSProperties = {
  fontFamily: fontStack,
  fontSize: "12px",
  color: "#999",
  margin: "12px 0 0",
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
  margin: "0",
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
