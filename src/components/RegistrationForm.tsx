
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Check } from "lucide-react";
import WorkshopCard from "./WorkshopCard";

interface FormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  atelier: string;
  preuveFile: File | null;
}

const workshops = [
  {
    id: "web",
    title: "Développement Web",
    description: "Apprenez à créer des sites web modernes avec HTML, CSS, JavaScript et React",
    icon: "💻",
    level: "Débutant",
    duration: "2 semaines"
  },
  {
    id: "ai",
    title: "Intelligence Artificielle",
    description: "Découvrez les fondamentaux de l'IA et créez vos premiers modèles",
    icon: "🤖",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "design",
    title: "Infographie",
    description: "Maîtrisez les outils de design graphique et créez des visuels époustouflants",
    icon: "🎨",
    level: "Débutant",
    duration: "2 semaines"
  },
  {
    id: "content",
    title: "Création de Contenu",
    description: "Apprenez à créer du contenu engageant pour les réseaux sociaux",
    icon: "📝",
    level: "Débutant",
    duration: "1 semaine"
  },
  {
    id: "photo",
    title: "Photographie",
    description: "Perfectionnez vos techniques photo et développez votre œil artistique",
    icon: "📸",
    level: "Débutant",
    duration: "1 semaine"
  },
  {
    id: "video",
    title: "Montage Vidéo",
    description: "Créez des vidéos professionnelles avec les derniers outils de montage",
    icon: "🎬",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "entrepreneur",
    title: "Entrepreneuriat",
    description: "Développez votre esprit d'entreprise et lancez votre startup",
    icon: "💼",
    level: "Intermédiaire",
    duration: "2 semaines"
  },
  {
    id: "entrepreneur-en",
    title: "Entrepreneuriat (Anglais)",
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
    atelier: "",
    preuveFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    
    if (!formData.atelier) {
      toast({
        title: "Atelier requis",
        description: "Veuillez sélectionner un atelier.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.preuveFile) {
      toast({
        title: "Preuve de paiement requise",
        description: "Veuillez téléverser votre preuve de paiement.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez un email de confirmation sous peu.",
      });
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        dateNaissance: "",
        email: "",
        telephone: "",
        atelier: "",
        preuveFile: null
      });
    }, 2000);
  };

  const selectedWorkshop = workshops.find(w => w.id === formData.atelier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Inscription Summer Camp 2025</h2>
          <p className="text-xl text-gray-600">Remplissez le formulaire ci-dessous pour rejoindre l'aventure</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                👤 Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  required
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Adresse e-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Numéro de téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sélection d'atelier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                🎯 Choisissez votre atelier
              </CardTitle>
              <p className="text-gray-600">Sélectionnez l'atelier qui vous intéresse le plus</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    title={workshop.title}
                    description={workshop.description}
                    icon={workshop.icon}
                    level={workshop.level}
                    duration={workshop.duration}
                    isSelected={formData.atelier === workshop.id}
                    onClick={() => handleInputChange("atelier", workshop.id)}
                  />
                ))}
              </div>
              
              {selectedWorkshop && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800">
                    <strong>Atelier sélectionné :</strong> {selectedWorkshop.title}
                  </p>
                </div>
              )}
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
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-summer-gradient text-white px-12 py-4 text-lg rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? "Inscription en cours..." : "Confirmer l'inscription"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
