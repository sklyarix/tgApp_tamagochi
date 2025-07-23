import { FC, useEffect, useState, useRef } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // значение от 0 до 100
  nextEvolutionName: string;
  nextEvolutionLevel: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ 
  progress, 
  nextEvolutionName,
  nextEvolutionLevel 
}) => {
  // Состояние для плавной анимации
  const [displayedProgress, setDisplayedProgress] = useState<number>(progress);
  const prevProgressRef = useRef<number>(progress);
  
  // Ограничиваем прогресс от 0 до 100
  const clampedProgress = Math.min(100, Math.max(0, displayedProgress));
  
  // Обновляем отображаемый прогресс когда меняется progress из пропсов
  useEffect(() => {
    // Если прогресс уменьшился до 0 (после эволюции), мгновенно обновляем
    if (progress === 0 && prevProgressRef.current > 90) {
      setDisplayedProgress(0);
    } else {
      // Иначе делаем плавную анимацию
      const animationFrame = requestAnimationFrame(() => {
        // Пошаговое приближение к целевому значению
        if (Math.abs(displayedProgress - progress) < 0.5) {
          setDisplayedProgress(progress);
        } else {
          setDisplayedProgress((prev: number) => 
            progress > prev 
              ? prev + Math.min(1, (progress - prev) / 10)
              : prev - Math.min(1, (prev - progress) / 10)
          );
        }
      });
      
      return () => cancelAnimationFrame(animationFrame);
    }
    
    prevProgressRef.current = progress;
  }, [progress, displayedProgress]);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-background">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${clampedProgress}%` }}
        ></div>
        <div className="progress-bar-text">
          следующая эволюция: {nextEvolutionName} (уровень {nextEvolutionLevel})
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 