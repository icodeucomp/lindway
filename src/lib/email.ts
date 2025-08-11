import { RequestDataForEmailSchema, EmailRequestSchema, RequestDataForEmail } from "@/types";

export const sendMembershipInvitation = async (recipientEmail: string, guestData: RequestDataForEmail, subject: string = "Welcome to Lind Society!") => {
  const validatedGuestData = RequestDataForEmailSchema.parse(guestData);

  const emailPayload = {
    to: recipientEmail,
    subject: subject,
    template: "external/lindway/send-membership-invitation",
    context: validatedGuestData,
  };

  const validatedPayload = EmailRequestSchema.parse(emailPayload);

  try {
    const response = await fetch("http://34.101.133.26:3002/external-gateway/v1/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
