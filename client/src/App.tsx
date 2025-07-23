import './App.css';
import ActionButtons from './components/ActionButtons';
import Background from './components/Background';
import backgroundImage from './assets/images/background.png';
import PetContainer from './components/PetContainer';
import TopPanel from './components/TopPanel';

import { useAuth } from './hook/useAuth.ts';
import { useEducatePet } from './hook/useEducatePet.ts';
import { useFeedPet } from './hook/useFeedPet.ts';
import { usePet } from './hook/usePet.ts';
import { usePlayPet } from './hook/usePlayPet.ts';
import { useSleepPet } from './hook/useSleepPet.ts';
import { useTg } from './hook/useTg.ts';

import petLevel1Image from './assets/images/pets/pet-level1.png';
import petLevel2Image from './assets/images/pets/pet-level2.png';
import petLevel3Image from './assets/images/pets/pet-level3.png';
import petLevel4Image from './assets/images/pets/pet-level4.png';

function App() {
  const { isTg, webApp } = useTg();
  const {
    data: dataAuth,
    isLoading: isLoadingAuth,
    error: errorAuth,
  } = useAuth(webApp);
  const {
    data: dataPet,
    isLoading: isLoadingPet,
    error: errorPet,
  } = usePet(dataAuth?.id);

  // Кормление питомца
  const { mutate: feedPet } = useFeedPet();
  // Игра с питомцем
  const { mutate: playPet } = usePlayPet();
  // Сон питомца
  const { mutate: sleepPet } = useSleepPet();
  // Обучение питомца
  const { mutate: educatePet } = useEducatePet();
  // Проверка на запуск в Telegram
  if (!isTg) {
    return (
      <div>
        <h1>Ошибка</h1>
        <p>Приложение работает только в TG</p>
      </div>
    );
  }

  //  isLoading
  if (isLoadingAuth) return <div>Загрузка User...</div>;
  if (isLoadingPet) return <div>Загрузка Pet...</div>;

  //  Error
  if (errorAuth)
    return (
      <div>
        <div>
          <h1>Ошибка</h1>
          <p>{errorAuth.message}</p>
        </div>
      </div>
    );

  if (errorPet)
    return (
      <div>
        <div>
          <h1>Ошибка</h1>
          <p>{errorPet.message}</p>
        </div>
      </div>
    );

  //  Data
  if (!dataAuth) return <div>Нет данных user</div>;
  if (!dataPet) return <div>Нет данных pet</div>;

  // Определение картинки питомца в зависимости от уровня
  const getPetImage = (): string => {
    // Здесь будет логика выбора разных картинок питомца
    // в зависимости от уровня эволюции
    const { level } = dataPet;
    switch (level) {
      case 1:
        return petLevel1Image;
      case 2:
        return petLevel2Image;
      case 3:
        return petLevel3Image;
      case 4:
        return petLevel4Image;
      default:
        return petLevel1Image;
    }
  };

  // Определение состояния питомца
  const getPetStatus = () => {
    const { hunger, happiness, energy, knowledge } = dataPet;
    const average = (hunger + happiness + energy + knowledge) / 4;
    if (average > 70) return 'Питомец счастлив!';
    if (average > 40) return 'Нормальное состояние';
    return 'Питомец несчастлив!';
  };

  // Определение имени следующей эволюции в зависимости от текущего уровня
  const getNextEvolutionName = (): string => {
    const { level } = dataPet;
    switch (level) {
      case 1:
        return 'малыш';
      case 2:
        return 'подросток';
      case 3:
        return 'взрослый';
      case 4:
        return 'мудрец';
      default:
        return 'суперформа';
    }
  };

  return (
    <div className="app">
      <div className="tamagotchi-container">
        <Background backgroundImage={backgroundImage} />
        <div className="top-panel-wrapper">
          <TopPanel
            level={dataPet.level}
            hunger={Math.round(dataPet.hunger)} // уменьшенное значение для демонстрации
            health={Math.round(dataPet.health)}
            energy={Math.round(dataPet.energy)}
          />
        </div>

        <PetContainer
          petImage={getPetImage()}
          status={getPetStatus()}
          knowledge={dataPet.knowledge}
          nextEvolutionName={getNextEvolutionName()}
          nextEvolutionLevel={dataPet.level + 1}
        />

        <div className="action-buttons-wrapper">
          <ActionButtons
            onFeed={() => feedPet(dataPet.id)}
            onPlay={() => playPet(dataPet.id)}
            onSleep={() => sleepPet(dataPet.id)}
            onEducate={() => educatePet(dataPet.id)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

/*
<ul>
        {Object.entries(dataPet).map(([key, value]) => (
          <li key={key}>
            {key}:{value}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          if (dataPet?.id) feedPet(dataPet.id);
        }}
        disabled={!dataPet?.id}
      >
        Кормить
      </button>
      <button
        onClick={() => {
          if (dataPet?.id) playPet(dataPet.id);
        }}
        disabled={!dataPet?.id}
      >
        Играть
      </button>
      <button
        onClick={() => {
          if (dataPet?.id) sleepPet(dataPet.id);
        }}
        disabled={!dataPet?.id}
      >
        спать
      </button>
      <button
        onClick={() => {
          if (dataPet?.id) educatePet(dataPet.id);
        }}
        disabled={!dataPet?.id}
      >
        Учиться
      </button>
 */
