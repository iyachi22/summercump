
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkshopCardProps {
  title: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
  isSelected: boolean;
  onClick: () => void;
}

const WorkshopCard = ({ title, description, icon, level, duration, isSelected, onClick }: WorkshopCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' : 'hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">{level}</Badge>
              <Badge variant="outline" className="text-xs">{duration}</Badge>
            </div>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
