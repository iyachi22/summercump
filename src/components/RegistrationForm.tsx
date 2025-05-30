
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Check, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import WorkshopCard from "./WorkshopCard";
import { supabase } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/services/emailService";

// Function to check if table exists and is accessible
const checkTableAccess = async () => {
  try {
    const { data, error } = await supabase
      .from('inscriptions')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Table access check failed:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking table access:', error);
    return false;
  }
};

interface Atelier {
  id: string;
  nom: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
}

interface FormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  ateliers: string[]; 
  preuveFile: File | null;
}

const workshops: Atelier[] = [
  {
    id: "web",
    nom: "Développement Web",
    description: "Apprenez à créer des sites web modernes avec HTML, CSS, JavaScript et React",
    icon: "💻",
    level: "Débutant",
    duration: "2 semaines"
  },
  {
    id: "ai",
    nom: "Intelligence Artificielle",
    description: "Découvrez les fondamentaux de l'IA et créez vos premiers modèles",
    icon: "🤖",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "design",
    nom: "Infographie",
    description: "Maîtrisez les outils de design graphique et créez des visuels époustouflants",
    icon: "🎨",
    level: "Débutant",
    duration: "2 semaines"
  },
  {
    id: "content",
    nom: "Création de Contenu",
    description: "Développez votre présence en ligne avec des contenus engageants",
    icon: "✍️",
    level: "Débutant",
    duration: "1 semaine"
  },
  {
    id: "video",
    nom: "Montage Vidéo",
    description: "Créez des vidéos professionnelles avec les derniers outils de montage",
    icon: "🎬",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "entrepreneur",
    nom: "Entrepreneuriat",
    description: "Développez votre esprit d'entreprise et lancez votre startup",
    icon: "💼",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "entrepreneur-en",
    nom: "Entrepreneuriat (Anglais)",
    description: "Develop your business mindset and launch your startup in English",
    icon: "🌍",
    level: "Intermédiaire",
    duration: "2 semaines"
  }
];

const RegistrationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    ateliers: [], 
    preuveFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [tableAccessible, setTableAccessible] = useState<boolean | null>(null);
  
  // Check table access on component mount
  useEffect(() => {
    const verifyTableAccess = async () => {
      setIsCheckingAccess(true);
      try {
        const isAccessible = await checkTableAccess();
        setTableAccessible(isAccessible);
        if (!isAccessible) {
          console.error('Database table is not accessible. Check your Supabase configuration and RLS policies.');
        }
      } catch (error) {
        console.error('Error verifying table access:', error);
        setTableAccessible(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };
    
    verifyTableAccess();
  }, []);

  const handleWorkshopSelect = (workshopId: string) => {
    setFormData(prev => {
      const newAteliers = prev.ateliers.includes(workshopId)
        ? prev.ateliers.filter(id => id !== workshopId)
        : [...prev.ateliers, workshopId];
      
      return {
        ...prev,
        ateliers: newAteliers
      };
    });
  };

  const handleInputChange = (field: keyof Omit<FormData, 'ateliers' | 'preuveFile'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, preuveFile: file }));
        toast({
          title: "Fichier téléversé",
          description: `${file.name} a été ajouté avec succès.`
        });
      } else {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez choisir un fichier PDF, JPG ou PNG.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if table is accessible
    if (tableAccessible === false) {
      toast({
        title: "Erreur de base de données",
        description: "Impossible d'accéder à la base de données. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.nom || !formData.prenom || !formData.dateNaissance || 
          !formData.email || !formData.telephone || formData.ateliers.length === 0) {
        toast({
          title: "Erreur",
          description: formData.ateliers.length === 0 
            ? "Veuillez sélectionner au moins un atelier" 
            : "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.preuveFile) {
        toast({
          title: "Preuve de paiement requise",
          description: "Veuillez téléverser votre preuve de paiement.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Upload file to Supabase storage if exists
      let fileUrl = "";
      if (formData.preuveFile) {
        const fileExt = formData.preuveFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('preuves')
          .upload(fileName, formData.preuveFile);

        if (fileError) {
          console.error('File upload error:', fileError);
          throw fileError;
        }
        fileUrl = fileData.path;
      }

      // Generate a single confirmation token for all workshops
      const confirmationToken = uuidv4();
      
      // Prepare data for database with additional validation
      const inscriptionData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        date_naissance: formData.dateNaissance, // Should be in YYYY-MM-DD format
        email: formData.email.trim().toLowerCase(),
        telephone: formData.telephone.trim(),
        preuve_url: fileUrl || '',
        token: confirmationToken,
        valide: false
      };
      
      // Get selected ateliers
      const selectedAteliers = formData.ateliers
        .map(atelierId => workshops.find(w => w.id === atelierId))
        .filter((atelier): atelier is Atelier => atelier !== undefined);
        
      if (selectedAteliers.length === 0) {
        throw new Error('Aucun atelier valide sélectionné');
      }
        
      // Validate required fields
      const requiredFields = ['nom', 'prenom', 'date_naissance', 'email', 'telephone'];
      const missingFields = requiredFields.filter(field => !inscriptionData[field as keyof typeof inscriptionData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
      }

      console.log('Prepared registration data:', JSON.stringify(inscriptionData, null, 2));
      
      console.log('Inserting registration with ateliers:', {
        inscription: inscriptionData,
        ateliers: selectedAteliers.map(a => a.nom)
      });
      
      // Clean up any old unverified registrations
      try {
        const { cleanupUnverifiedRegistrations } = await import('@/services/cleanupService');
        try {
          await cleanupUnverifiedRegistrations();
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      } catch (importError) {
        console.error('Error importing cleanup service:', importError);
      }

      // Start a transaction to insert inscription and ateliers
      const { data: inscription, error: inscriptionError } = await supabase.rpc('create_inscription_with_ateliers', {
        p_inscription: inscriptionData,
        p_atelier_ids: selectedAteliers.map(a => a.id)
      }).select();
      
      if (inscriptionError) {
        console.error('Error creating inscription with ateliers:', inscriptionError);
        throw inscriptionError;
      }

      // Verify the data was inserted
      if (!inscription || inscription.length === 0) {
        throw new Error('No data returned from insert operation');
      }

      console.log('Successfully inserted inscription with ateliers:', inscription);
      
      // Get the inserted inscription ID
      const insertedInscription = inscription[0];
      console.log('Confirmed database insertion with ID:', insertedInscription.id);
      
      // Verify the atelier relationships were created
      const { data: atelierRelations, error: relationsError } = await supabase
        .from('inscription_atelier')
        .select('*')
        .eq('inscription_id', insertedInscription.id);
        
      if (relationsError) {
        console.error('Error verifying atelier relationships:', relationsError);
      } else {
        console.log('Created atelier relationships:', atelierRelations);
      }
        
      // Send confirmation email
      const confirmationLink = `${window.location.origin}/confirmer-inscription?token=${confirmationToken}`;
      await sendConfirmationEmail(formData.email, confirmationLink, formData.ateliers.join(', '));

      // Show success message
      toast({
        title: "Inscription enregistrée !",
        description: "Un email de confirmation vous a été envoyé.",
        variant: "default"
      });

      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        dateNaissance: '',
        email: '',
        telephone: '',
        ateliers: [],
        preuveFile: null
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      // More detailed error message
      let errorMessage = "Une erreur est survenue lors de l'enregistrement de votre inscription.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inscription au Camp d'Été 2024
          </h1>
          <p className="text-lg text-gray-600">
            Rejoignez-nous pour une expérience inoubliable !
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                👤 Informations Personnelles
              </CardTitle>
              <p className="text-gray-600">Renseignez vos informations de contact</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance *</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Sélection d'atelier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                🎯 Choisissez votre atelier
              </CardTitle>
              <p className="text-gray-600">Sélectionnez un ou plusieurs ateliers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sélectionnez un ou plusieurs ateliers :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.ateliers.includes(workshop.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                      onClick={() => handleWorkshopSelect(workshop.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 text-2xl">
                          {workshop.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {workshop.nom}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {workshop.level} • {workshop.duration}
                          </p>
                        </div>
                        {formData.ateliers.includes(workshop.id) && (
                          <div className="text-blue-600 dark:text-blue-400">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {formData.ateliers.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sélectionné(s): {formData.ateliers.length} atelier(s)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload de fichier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                💳 Preuve de paiement
              </CardTitle>
              <p className="text-gray-600">Téléversez votre preuve de paiement (PDF, JPG, PNG)</p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="preuveFile"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="preuveFile" className="cursor-pointer">
                  {formData.preuveFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Check className="w-6 h-6" />
                      <span className="font-medium">{formData.preuveFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600">Cliquez pour téléverser un fichier</span>
                      <span className="text-sm text-gray-400">PDF, JPG, PNG (max 10MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <div className="text-center">
            {isCheckingAccess ? (
              <div className="flex items-center justify-center gap-2 p-4 text-blue-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Vérification de la base de données...</span>
              </div>
            ) : tableAccessible === false ? (
              <div className="p-4 text-red-600 bg-red-50 rounded-lg">
                <p>Erreur: Impossible de se connecter à la base de données.</p>
                <p className="text-sm">Veuillez réessayer plus tard ou contacter le support.</p>
              </div>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || tableAccessible === null}
                className="bg-summer-gradient text-white px-12 py-4 text-lg rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Inscription en cours..." : "Confirmer l'inscription"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
