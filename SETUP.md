# Summer Camp Registration - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Supabase account and project
- EmailJS account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Database Setup

1. **Initial Setup**:
   ```bash
   # Install dependencies
   npm install
   
   # Run the database setup script
   npm run db:setup
   ```

2. **Running Migrations**:
   ```bash
   # Run the latest migration
   npm run db:migrate
   ```

3. **Manual Cleanup**:
   ```bash
   # Manually trigger cleanup of unverified registrations
   npm run db:cleanup
   ```

## Development

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Registration Flow

1. User fills out the registration form
2. System creates an unverified registration record
3. User receives a confirmation email
4. User clicks the verification link
5. System verifies the email and activates the registration
6. Unverified registrations older than 10 minutes are automatically cleaned up

## Database Schema

See [REGISTRATION_FLOW.md](REGISTRATION_FLOW.md) for detailed database schema and documentation.

## Troubleshooting

- **Email Not Sending**: Check the browser console for errors and verify EmailJS credentials
- **Database Connection Issues**: Verify Supabase URL and anon key
- **Cleanup Not Working**: Check the database logs for errors in the `cleanup_unverified_registrations` function

## License

This project is licensed under the MIT License - see the LICENSE file for details.
