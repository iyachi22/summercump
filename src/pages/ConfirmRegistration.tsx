import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  console.log('Current URL:', window.location.href);
  console.log('Search params:', Object.fromEntries(searchParams.entries()));

  useEffect(() => {
    const confirmRegistration = async () => {
      const token = searchParams.get('token');
      console.log('Token from URL:', token);
      
      if (!token) {
        const errorMsg = 'Token de confirmation manquant dans l\'URL';
        console.error(errorMsg);
        setStatus('error');
        setMessage(errorMsg);
        return;
      }

      try {
        setStatus('loading');
        setMessage('Vérification de votre inscription...');
        
        // 1. Find the registration by token
        console.log('Fetching registration with token:', token);
        const { data: registration, error: fetchError } = await supabase
          .from('inscriptions')
          .select('*')
          .eq('token', token)
          .single();

        console.log('Registration fetch result:', { registration, error: fetchError });

        if (fetchError || !registration) {
          const errorMsg = 'Lien de confirmation invalide ou expiré';
          console.error(errorMsg, { fetchError, registration });
          throw new Error(errorMsg);
        }

        // 2. Check if already confirmed
        if (registration.valide) {
          const msg = 'Votre inscription a déjà été confirmée précédemment.';
          console.log(msg);
          setStatus('success');
          setMessage(msg);
          return;
        }

        // 3. Update the registration to mark as verified
        console.log('Updating registration to mark as verified');
        const { error: updateError } = await supabase
          .from('inscriptions')
          .update({ 
            valide: true,
            updated_at: new Date().toISOString()
          })
          .eq('token', token);

        if (updateError) {
          console.error('Error updating registration:', updateError);
          throw updateError;
        }

        const successMsg = '✅ Inscription confirmée avec succès !';
        console.log(successMsg);
        setStatus('success');
        setMessage(successMsg);
        
        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/'), 3000);

      } catch (error) {
        const errorMsg = error.message || 'Erreur lors de la confirmation';
        console.error('Confirmation error:', { error, errorMsg });
        setStatus('error');
        setMessage(errorMsg);
      }
    };

    confirmRegistration();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <h2 className="text-2xl font-bold">Traitement en cours...</h2>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600">Confirmation réussie</h2>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600">Erreur</h2>
          </div>
        )}
        
        <p className="text-lg">
          {message}
        </p>
        
        {status === 'success' && (
          <p className="text-sm text-gray-600 mt-4">
            Redirection en cours...
          </p>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmRegistration;
