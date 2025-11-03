import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Building2 } from 'lucide-react';
import plakshaBuilding from '@/assets/plaksha-building.png';
import { PlakshaLogo } from './PlakshaLogo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome to Plaksha Monitoring System',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${plakshaBuilding})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/85 to-brown-deep/90" />
      </div>

      {/* Login Card */}
      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm animate-slide-up">
        <CardHeader className="space-y-3 text-center pb-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Plaksha
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">
            As a Living Lab
          </p>
          <CardDescription className="text-base">
            Real-time monitoring of Plaksha Camera Stream
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="transition-all focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-cream/90">
        <p className="text-sm font-medium">Made by Dixon IoT Lab</p>
      </div>
      <PlakshaLogo />
    </div>
  );
};

export default LoginPage;
