import React from 'react';
import { Radio } from 'lucide-react';
import headerImage from '../assets/img/header.png';

const Header: React.FC = () => {
  return (
    <header 
      className="relative text-white shadow-2xl"
      style={{
        backgroundImage: `url(${headerImage})`,
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '250px', // Altura mínima para mobile
        height: '40vh' // Altura responsiva para desktop
      }}
    >
      {/* Overlay com gradiente para melhor contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center"> {/* Centralizado verticalmente */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Ícone responsivo */}
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3 md:p-4">
            <Radio className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          
          {/* Conteúdo de texto */}
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Online Radios
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mt-2">
              Suas estações favoritas em um só lugar
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;