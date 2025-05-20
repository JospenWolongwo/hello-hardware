export const quoteConfirmationTemplate = {
  subject: `Your Quote Request - Confirmation`,
  text: function (quoteId: string, companyName?: string) {
    return `Hi${companyName ? ` ${companyName}` : ' there'},\n\n
            Thank you for requesting a quote with us. Your quote ID is ${quoteId.slice(0, 8)}.
            We will review your request and get back to you shortly.
            \n\n
            Best regards,
            HERMES Team`;
  },
  html: function (quoteId: string, companyName?: string) {
    return `<p>Hi${companyName ? ` ${companyName}` : ' there'},</p>
            <p>Thank you for requesting a quote with us. Your quote ID is <strong>${quoteId.slice(0, 8)}</strong>.</p>
            <p>We will review your request and get back to you shortly.</p>
            <p>Best regards,<br/>HERMES Team</p>`;
  },
};
