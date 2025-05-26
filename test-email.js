// test-email.js
import emailjs from '@emailjs/browser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Configuration
const SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY;

// Test email parameters - UPDATED WITH YOUR EMAILS
const testEmail = 'khouaniyoussef@gmail.com'; // Your recipient email
const testParams = {
  to_email: testEmail,
  to_name: 'Test Recipient',
  from_name: 'Summer Camp Registration',
  from_email: 'iyachiyoucef23@gmail.com', // Your sender email
  reply_to: 'iyachiyoucef23@gmail.com',   // Your reply-to email
  subject: 'Test Email from Summer Camp',
  message: 'This is a test email to verify EmailJS configuration.',
  confirmation_link: 'https://summercamp.com/confirm?token=test123'
};

// Function to send test email
async function sendTestEmail() {
  console.log('Sending test email to:', testEmail);
  console.log('Using service ID:', SERVICE_ID);
  console.log('Using template ID:', TEMPLATE_ID);
  
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      testParams,
      PUBLIC_KEY
    );
    
    console.log('Email sent successfully! Response:', {
      status: response.status,
      text: response.text
    });
  } catch (error) {
    console.error('Failed to send email:', {
      status: error.status,
      text: error.text,
      message: error.message
    });
  }
}

// Run the test
sendTestEmail();