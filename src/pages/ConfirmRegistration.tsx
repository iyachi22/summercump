import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmRegistration = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Token de confirmation manquant');
        return;
      }

      try {
        // 1. Find the registration by token
        const { data: registration, error: fetchError } = await supabase
          .from('inscriptions')
          .select('*')
          .eq('token', token)
          .single();

        if (fetchError || !registration) {
          throw new Error('Lien de confirmation invalide ou expiré');
        }


        // 2. Check if already confirmed
        if (registration.valide) {
          setStatus('success');
          setMessage('Votre inscription a déjà été confirmée précédemment.');
          return;
        }

        // 3. Update the registration to mark as verified
        const { error: updateError } = await supabase
          .from('inscriptions')
          .update({ 
            valide: true,
            updated_at: new Date().toISOString()
          })
          .eq('token', token);

        if (updateError) throw updateError;

        setStatus('success');
        setMessage('✅ Inscription confirmée avec succès !');
        
        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/'), 3000);

      } catch (error) {
        console.error('Confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Erreur lors de la confirmation');
      }
    };

    confirmRegistration();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">
          {status === 'loading' ? 'Traitement...' : 
           status === 'success' ? 'Confirmation réussie' : 'Erreur'}
        </h2>
        <p className="text-lg">
          {message}
        </p>
        {status === 'success' && (
          <p className="text-sm text-gray-600 mt-4">
            Redirection en cours...
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmRegistration;
