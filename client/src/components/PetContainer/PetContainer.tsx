import { FC } from 'react';
import './PetContainer.css';
import ProgressBar from '../ProgressBar';

interface PetContainerProps {
  petImage: string;
  status: string;
  knowledge: number;
  nextEvolutionName: string;
  nextEvolutionLevel: number;
  onDoubleClick?: () => void;
}

const PetContainer: FC<PetContainerProps> = ({ 
  petImage, 
  status, 
  knowledge,
  nextEvolutionName,
  nextEvolutionLevel,
  onDoubleClick
}) => {
  return (
    <div className="pet-container">
      <img 
        src={petImage} 
        className="pet-image" 
        alt="Тамагочи" 
        onDoubleClick={onDoubleClick}
        title="Двойной клик для сброса данных"
      />
      
      <div className="pet-status-text">{status}</div>
      
      <div className="pet-progress-bar">
        <ProgressBar 
          progress={knowledge}
          nextEvolutionName={nextEvolutionName}
          nextEvolutionLevel={nextEvolutionLevel}
        />
      </div>
    </div>
  );
};

export default PetContainer; 