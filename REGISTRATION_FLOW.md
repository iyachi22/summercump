# Registration Flow Documentation

## Overview

This document describes the registration and email verification flow implemented in the application.

## Database Schema

### Table: `inscriptions`

```sql
CREATE TABLE public.inscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  atelier TEXT NOT NULL,
  preuve_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  valide BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_inscriptions_token ON public.inscriptions(token);
CREATE INDEX idx_inscriptions_email ON public.inscriptions(email);
CREATE INDEX idx_inscriptions_valide_created_at ON public.inscriptions(valide, created_at);
```

### Function: `cleanup_unverified_registrations()`

This function deletes unverified registrations older than 10 minutes.

## Registration Flow

1. **User Submits Registration Form**
   - Form data is validated
   - File is uploaded to storage
   - A unique token is generated
   - Data is saved to `inscriptions` table with `valide = false`
   - Confirmation email is sent with verification link

2. **Email Verification**
   - User clicks verification link in email
   - System validates the token
   - If valid, updates `valide = true` for the registration
   - If invalid or expired, shows error message

3. **Automatic Cleanup**
   - A background job runs every 5 minutes
   - Deletes unverified registrations older than 10 minutes
   - Prevents database bloat from unverified registrations

## API Endpoints

### POST `/api/register`
- Creates a new registration
- Returns: `{ success: boolean, message: string }`

### GET `/confirm?token=<verification_token>`
- Verifies the registration
- Returns: Success or error page

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Error Handling

- Invalid email format
- Missing required fields
- File upload failures
- Email sending failures
- Expired or invalid verification tokens
- Database errors

## Security Considerations

- All database operations use Row Level Security (RLS)
- File uploads are restricted to specific MIME types
- Tokens are securely generated using UUIDv4
- Email addresses are validated before sending
- Sensitive operations are logged

## Monitoring and Maintenance

- Check application logs for errors
- Monitor database size and performance
- Review unverified registration counts periodically
- Update dependencies regularly
