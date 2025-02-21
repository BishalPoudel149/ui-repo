import { sendEmail } from "../services/emailService.js";

export const sendNotification = async (req, res) => {
  const { email, threshold, price } = req.body;

  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  if (price >= threshold) {
    const message = `Alert! The price has reached ${price}, exceeding your threshold of ${threshold}.`;
    await sendEmail(email, "Threshold Breached Alert!", message);
    return res.json({ success: true, message: "Email sent successfully!" });
  }

  res.json({ success: false, message: "Threshold not reached." });
};