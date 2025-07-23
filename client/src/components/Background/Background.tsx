import { FC } from 'react';
import './Background.css';

interface BackgroundProps {
  backgroundImage: string;
}

const Background: FC<BackgroundProps> = ({ backgroundImage }) => {
  return (
    <div className="background-container">
      <img src={backgroundImage} className="background-image" alt="Фон" />
      <div className="background-gradient"></div>
    </div>
  );
};

export default Background; 