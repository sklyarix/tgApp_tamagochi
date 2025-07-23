import { FC, useState, useEffect, useRef } from 'react';
import './ActionButtons.css';
import fishIcon from '../../assets/images/fish-icon.svg';
import happinessIcon from '../../assets/images/happiness-icon.svg';
import nightIcon from '../../assets/images/night-icon.svg';
import mortarboardIcon from '../../assets/images/mortarboard-icon.svg';

interface ActionButtonProps {
  icon: string;
  onClick: () => void;
  label: string;
  cooldown: number; // Время перезарядки в секундах
}

const ActionButton: FC<ActionButtonProps> = ({ icon, onClick, label, cooldown }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    let timer: number | null = null;
    let interval: number | null = null;

    if (isInCooldown) {
      const startTime = Date.now();
      const endTime = startTime + cooldown * 1000;
      
      interval = window.setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const progressValue = 100 - (remaining / (cooldown * 1000)) * 100;
        
        setProgress(progressValue);
        
        if (progressValue >= 100) {
          setIsInCooldown(false);
          setProgress(0);
          if (interval) clearInterval(interval);
          
          // Анимация завершения кулдауна с небольшой задержкой
          // для корректного возврата кольца на место
          setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
          }, 50);
        }
      }, 50);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [isInCooldown, cooldown]);
  
  const handleClick = () => {
    if (isInCooldown) return;
    
    setIsPressed(true);
    onClick();
    
    // Визуальный эффект нажатия
    setTimeout(() => setIsPressed(false), 300);
    
    // Запуск кулдауна
    setIsInCooldown(true);
  };

  // Расчет параметров для круговой обводки
  const size = 70; // размер кнопки
  const strokeWidth = 4;
  const radius = ((size - strokeWidth) / 2) - 5; // Уменьшаем радиус еще больше (на 5px)
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="action-button-container">
      <div className="action-button-wrapper">
        <button 
          ref={buttonRef}
          className={`action-button ${isPressed ? 'pressed' : ''} ${isInCooldown ? 'in-cooldown' : ''} ${isAnimating ? 'complete-animation' : ''}`}
          onClick={handleClick}
          onMouseDown={() => !isInCooldown && setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => isPressed && setIsPressed(false)}
          onTouchStart={() => !isInCooldown && setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onTouchCancel={() => isPressed && setIsPressed(false)}
          disabled={isInCooldown}
          style={{
            animation: isAnimating ? 'pulse 0.5s ease-in-out' : ''
          }}
        >
          <img src={icon} alt={label} className="action-icon" />
        </button>
        
        <svg className="progress-ring" width={size} height={size}>
          <circle
            className="progress-ring-circle-bg"
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="transparent"
          />
          <circle
            className="progress-ring-circle"
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
      </div>
      <span className="action-label">{label}</span>
    </div>
  );
};

interface ActionButtonsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onEducate: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ 
  onFeed, 
  onPlay, 
  onSleep, 
  onEducate 
}) => {
  return (
    <div className="action-buttons">
      <ActionButton 
        icon={fishIcon} 
        onClick={onFeed} 
        label="Кормить" 
        cooldown={10}
      />
      <ActionButton 
        icon={happinessIcon} 
        onClick={onPlay} 
        label="Играть" 
        cooldown={8}
      />
      <ActionButton 
        icon={nightIcon} 
        onClick={onSleep} 
        label="Спать" 
        cooldown={15}
      />
      <ActionButton 
        icon={mortarboardIcon} 
        onClick={onEducate} 
        label="Учить" 
        cooldown={12}
      />
    </div>
  );
};

export default ActionButtons; 