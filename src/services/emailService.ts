import emailjs from '@emailjs/browser';
import { env } from '@/utils/env';

// Access environment variables through our env utility
const SERVICE_ID = env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = env.EMAILJS_PUBLIC_KEY;

// Simple email validation
const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const sendConfirmationEmail = async (email: string, confirmationLink: string, selectedWorkshops: string) => {
  console.log('[EmailService] Sending confirmation email to:', email);
  
  // Log all environment variables (without sensitive data)
  console.log('[EmailService] Environment:', {
    nodeEnv: process.env.NODE_ENV,
    serviceId: SERVICE_ID ? '***' + SERVICE_ID.slice(-4) : 'Not set',
    templateId: TEMPLATE_ID ? '***' + TEMPLATE_ID.slice(-4) : 'Not set',
    hasPublicKey: !!PUBLIC_KEY,
    isClient: typeof window !== 'undefined'
  });
  
  // Validate email parameter
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    const errorMsg = `Invalid email address: ${email}`;
    console.error('[EmailService]', errorMsg);
    throw new Error(errorMsg);
  }
  
  // Validate selected workshops
  if (!selectedWorkshops || typeof selectedWorkshops !== 'string') {
    const errorMsg = 'Selected workshops information is missing or invalid';
    console.error('[EmailService]', errorMsg);
    throw new Error(errorMsg);
  }

  // Validate confirmation link
  if (!confirmationLink || typeof confirmationLink !== 'string') {
    const errorMsg = 'Invalid confirmation link';
    console.error('[EmailService]', errorMsg);
    throw new Error(errorMsg);
  }

  // Log configuration (without sensitive data)
  console.log('[EmailService] Configuration:', { 
    serviceId: SERVICE_ID ? '***' + SERVICE_ID.slice(-4) : 'Not set',
    templateId: TEMPLATE_ID ? '***' + TEMPLATE_ID.slice(-4) : 'Not set',
    hasPublicKey: !!PUBLIC_KEY
  });
  
  // Check required environment variables
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    const errorMsg = 'EmailJS environment variables are not properly configured';
    console.error('[EmailService]', errorMsg, {
      hasServiceId: !!SERVICE_ID,
      hasTemplateId: !!TEMPLATE_ID,
      hasPublicKey: !!PUBLIC_KEY
    });
    throw new Error(errorMsg);
  }

  try {
    console.log('[EmailService] Attempting to send email...');
    
    const templateParams = {
      to_email: email,
      from_name: "Équipe du Camp d'Été",
      reply_to: "contact@votresite.com",
      subject: "Confirmez votre inscription au Camp d'Été",
      message: `Vous vous êtes inscrit aux ateliers suivants : ${selectedWorkshops}
    
Veuillez confirmer votre inscription en cliquant sur le lien ci-dessous :`,
      confirmation_link: confirmationLink,
      selected_workshops: selectedWorkshops
    };
    
    console.log('[EmailService] Sending with parameters:', {
      serviceId: SERVICE_ID,
      templateId: TEMPLATE_ID,
      publicKey: PUBLIC_KEY ? '***' + PUBLIC_KEY.slice(-4) : 'Not set',
      templateParams: {
        ...templateParams,
        confirmation_link: templateParams.confirmation_link ? '***' : 'Missing',
        to_email: templateParams.to_email ? '***' + templateParams.to_email.split('@')[1] : 'Missing'
      }
    });
    
    // Ensure we're using the correct format for EmailJS
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('[EmailService] Email sent successfully!', {
      status: result.status,
      text: result.text
    });
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[EmailService] Failed to send email:', {
      error: errorMessage,
      status: (error as any)?.status,
      response: (error as any)?.text
    });
    
    throw new Error(`Failed to send confirmation email: ${errorMessage}`);
  }
};
