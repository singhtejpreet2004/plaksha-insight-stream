import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout, getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, User, Users, Dog, DoorOpen } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { PlakshaLogo } from './PlakshaLogo';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  const handleCardClick = (cardName: string) => {
    if (cardName === 'Head Count') {
      navigate('/streams');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Plaksha Monitoring
              </h1>
              <p className="text-sm text-muted-foreground">Living Lab Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-muted-foreground">
            Monitor real-time camera feeds and analytics from Plaksha University
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <DashboardCard
            title="Dog Detection"
            description="Real-time detection and tracking of dogs on campus premises"
            icon={<Dog className="w-10 h-10" />}
            isActive={false}
            onClick={() => handleCardClick('Dog Detection')}
          />

          <DashboardCard
            title="Head Count"
            description="Live people counting and crowd analytics across all gates"
            icon={<Users className="w-10 h-10" />}
            isActive={true}
            variant="primary"
            onClick={() => handleCardClick('Head Count')}
          />

          <DashboardCard
            title="Entry/Exit"
            description="Track entry and exit patterns with intelligent flow analysis"
            icon={<DoorOpen className="w-10 h-10" />}
            isActive={false}
            onClick={() => handleCardClick('Entry/Exit')}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            Made by <span className="text-primary font-bold">Dixon IoT Lab</span>
          </p>
        </div>
      </footer>
      
      <PlakshaLogo />
    </div>
  );
};

export default Dashboard;
