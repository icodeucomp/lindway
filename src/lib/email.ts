import { EmailContextSchema, EmailRequestSchema, RequestDataForEmail } from "@/types";

export const sendMembershipInvitation = async (recipientEmail: string, guestData: RequestDataForEmail) => {
  const validatedGuestData = EmailContextSchema.parse(guestData);

  const emailPayload = {
    to: recipientEmail,
    subject: "Payment success! Thankyou for your purchasing 🙌",
    template: "external/lindway/send-membership-invitation",
    context: validatedGuestData,
  };

  const validatedPayload = EmailRequestSchema.parse(emailPayload);

  try {
    const response = await fetch(`${process.env.NEXT_EMAIL_URL}/external-gateway/v1/mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    throw error;
  }
};
