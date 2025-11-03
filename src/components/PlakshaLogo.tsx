import plakshaLogo from '@/assets/plaksha-logo.jpg';

export const PlakshaLogo = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <img 
          src={plakshaLogo} 
          alt="Plaksha University" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
