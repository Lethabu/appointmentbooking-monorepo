import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Button,
  Section,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
  name: string;
  scheduledTime: string;
  serviceName: string;
  tenantName: string;
}

export const BookingConfirmationEmail = ({
  name,
  scheduledTime,
  serviceName,
  tenantName,
}: BookingConfirmationEmailProps) => {

  const formattedDate = new Date(scheduledTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Preview>Your booking with ${tenantName} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your booking for the <strong>{serviceName}</strong> service at{" "}
            <strong>{tenantName}</strong> has been successfully confirmed.
          </Text>
          <Section style={box}>
            <Text style={strong}>Appointment Details:</Text>
            <Text style={text}><strong>Date:</strong> {formattedDate}</Text>
          </Section>
          <Text style={text}>
            If you need to reschedule, please contact us directly.
          </Text>
          <Button
            style={button}
            href="https://appointmentbooking.co.za" // Placeholder URL
          >
            Visit our Website
          </Button>
          <Text style={text}>We look forward to seeing you!</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "20px",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  borderRadius: "5px",
  padding: "40px",
  margin: "0 auto",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "30px",
};

const strong = {
  fontWeight: "bold",
}

const box = {
    border: '1px solid #eee',
    borderRadius: '5px',
    padding: '20px',
    margin: '20px 0',
}

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "20px",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "15px",
};
