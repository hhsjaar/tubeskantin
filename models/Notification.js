import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
