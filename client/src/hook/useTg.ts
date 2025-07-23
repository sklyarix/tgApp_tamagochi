import { useEffect, useState } from 'react';

export const useTg = () => {
  const [isTg, setIsTg] = useState<boolean>(false);
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  //const [user, setUser] = useState<WebAppUser | null>(null);

  useEffect(() => {
    const initUser = () => {
      const tg = window.Telegram.WebApp;
      console.log('TGG =', tg.initDataUnsafe);
      if (tg) {
        setWebApp(tg);
        const isValidTgData =
          tg &&
          tg.initDataUnsafe &&
          Object.keys(tg.initDataUnsafe).length > 0 &&
          tg.initDataUnsafe.user;

        if (isValidTgData) {
          setIsTg(true);
          //setUser(tg.initDataUnsafe.user!);
          tg.ready();
          tg.expand();
          tg.disableVerticalSwipes();
        }
      } else {
        setWebApp(null);
      }
    };

    initUser();
  }, []);

  return { webApp, isTg };
};
