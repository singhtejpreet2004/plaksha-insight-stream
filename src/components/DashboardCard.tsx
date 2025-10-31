import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon, 
  isActive, 
  variant = 'default',
  onClick 
}: DashboardCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-500 border-2",
        "hover:shadow-2xl hover:scale-105 hover:-translate-y-2",
        isActive 
          ? "hover:border-primary cursor-pointer" 
          : "opacity-75 cursor-not-allowed hover:border-muted",
        variant === 'primary' && "border-primary/30"
      )}
      onClick={isActive ? onClick : undefined}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        variant === 'primary' 
          ? "bg-gradient-to-br from-primary/20 to-secondary/20"
          : "bg-gradient-to-br from-primary/10 to-secondary/10"
      )} />

      <CardContent className="relative p-8 flex flex-col items-center justify-center min-h-[250px] space-y-4">
        {/* Icon Container */}
        <div className={cn(
          "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
          "group-hover:scale-110 group-hover:rotate-6",
          variant === 'primary'
            ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description - only visible on hover */}
        <p className={cn(
          "text-sm text-center text-muted-foreground transition-all duration-500",
          "opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0",
          "max-w-[200px]"
        )}>
          {description}
        </p>

        {/* Status Badge */}
        {!isActive && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            Coming Soon
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
