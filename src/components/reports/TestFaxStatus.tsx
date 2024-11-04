// Update the canResend condition to allow resending even after delivery
const canResend = (status === 'failed' || status === 'delivered') && resendCount < MAX_RESEND_ATTEMPTS;