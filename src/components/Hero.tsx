
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

const Hero = ({ onScrollToForm }: { onScrollToForm: () => void }) => {
  return (
    <div className="relative min-h-screen bg-hero-gradient flex items-center justify-center overflow-hidden">
      {/* Floating elements for animation */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 text-center text-white relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Summer Camp 2025
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto leading-relaxed">
          Rejoignez une expérience inoubliable d'apprentissage et de découverte avec nos ateliers innovants
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 mb-10 text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span>Été 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <span>France</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span>8 Ateliers</span>
          </div>
        </div>
        
        <Button 
          onClick={onScrollToForm}
          size="lg" 
          className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          S'inscrire maintenant
        </Button>
      </div>
    </div>
  );
};

export default Hero;
