import plakshaLogo from '@/assets/plaksha-logo.jpg';

export const PlakshaLogo = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <img 
        src={plakshaLogo} 
        alt="Plaksha University" 
        className="w-20 h-20 object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
};
