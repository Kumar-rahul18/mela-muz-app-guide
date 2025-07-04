
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface FacilityIconProps {
  icon: React.ReactNode;
  label: string;
  type?: string;
  onClick?: () => void;
  index?: number;
}

const FacilityIcon: React.FC<FacilityIconProps> = ({ icon, label, type, onClick, index = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (type === 'lost-found') {
      navigate('/lost-found');
    } else if (type) {
      navigate(`/facility/${type}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center space-y-2 cursor-pointer transform transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <div className="icon-3d bg-gradient-to-br from-orange-300 via-orange-500 to-red-600 w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-orange-200">
        <div className={`icon-3d-container ${index % 2 === 0 ? 'animate-dice-3d-odd' : 'animate-dice-3d-even'} text-white text-2xl relative z-10`}>
          <span className="relative z-20 drop-shadow-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{icon}</span>
        </div>
      </div>
      <span className="text-xs text-orange-800 text-center font-medium leading-tight">
        {label}
      </span>
    </div>
  );
};

export default FacilityIcon;
