import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PlakshaLogo } from '@/components/PlakshaLogo';

const DogDetection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Dog Detection</h1>
          <p className="text-muted-foreground mt-2">
            Real-time detection and tracking of dogs on campus premises
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 pb-24">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Under Development</AlertTitle>
          <AlertDescription>
            This feature is currently under development. Stream feeds and analytics will be available soon.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-2 border-dashed border-muted rounded-lg p-8 bg-muted/20">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <p className="text-muted-foreground">Stream {i} - Placeholder</p>
              </div>
              <h3 className="font-semibold text-lg mb-2">Camera Location {i}</h3>
              <p className="text-sm text-muted-foreground">Detection statistics will appear here</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/80 backdrop-blur-sm py-4 z-40">
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

export default DogDetection;
