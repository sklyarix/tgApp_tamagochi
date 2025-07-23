import { FC } from 'react';
import './TopPanel.css';
import starIcon from '../../assets/images/star-icon.svg';
import fishIcon from '../../assets/images/fish-icon-small.svg';
import heartIcon from '../../assets/images/heart-icon.svg';
import flashIcon from '../../assets/images/flash-icon.svg';

interface StatItemProps {
  icon: string;
  value: string;
  bgColor?: string;
  width?: string;
}

const StatItem: FC<StatItemProps> = ({ icon, value, bgColor, width }) => {
  return (
    <div 
      className="stat-item" 
      style={{ 
        background: bgColor ? bgColor : 'white'
      }}
    >
      <div className="stat-item-content" style={{ width: width }}>
        <img src={icon} alt="Статистика" className="stat-icon" />
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
};

interface TopPanelProps {
  level: number;
  hunger: number;
  health: number;
  energy: number;
}

const TopPanel: FC<TopPanelProps> = ({ level, hunger, health, energy }) => {
  // Форматирование значений для отображения
  const formatValue = (value: number): string => {
    return `${value}%`;
  };

  return (
    <div className="top-panel">
      <StatItem 
        icon={starIcon} 
        value={`${level} лвл`} 
        bgColor="linear-gradient(90deg, #A6E713 0%, #8AB528 100%)" 
      />
      
      <div className="stats-group">
        <StatItem 
          icon={fishIcon} 
          value={formatValue(hunger)} 
          width="50px"
        />
        <StatItem 
          icon={heartIcon} 
          value={formatValue(health)} 
          width="50px"
        />
        <StatItem 
          icon={flashIcon} 
          value={formatValue(energy)}
          width="50px"
        />
      </div>
    </div>
  );
};

export default TopPanel; 