import type { Pet } from "@prisma/client";
import { isValid, parse } from "@telegram-apps/init-data-node";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma.js";

// @desc Обновить и создать пользователя
// @route post /api/login
// @access Public
export const login = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { initData } = req.body;
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return res.status(400).send({ error: "invalid token" });
    }

    // Валидируем initData с помощью токена бота
    const isInitDataValid = isValid(initData, process.env.TELEGRAM_BOT_TOKEN);

    // Ошибка, если initData некорректна
    if (!isInitDataValid) {
      return res.status(400).send({ error: "AUTH__INVALID_INITDATA" });
    }

    // Парсим initData и достаем Telegram ID пользователя
    const user = parse(initData).user;

    // Ошибка, tgId
    if (!user) {
      return res.status(400).send({ error: "AUTH__INVALID_INITDATA" });
    }

    const userData = await prisma.user.upsert({
      where: {
        telegramId: user.id.toString(),
      },
      update: {
        lastActive: new Date(),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        language: user.language_code,
        isPremium: user.is_premium,
      },
      create: {
        telegramId: user.id.toString(),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        photoUrl: user.photo_url,
        language: user.language_code,
        isPremium: user.is_premium,
      },
    });

    return res.json(userData);
  } catch (error) {
    console.log("error =", error);
    throw error;
  }
};

// @desc Получение данных питомца
// @route get /api/pets/my?userId=123
// @access Public
export const myPets = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Найти питомца по userId
    let pet = await prisma.pet.findFirst({
      where: { ownerId: userId },
    });

    // Если нет создать
    if (!pet) {
      pet = await prisma.pet.create({
        data: {
          ownerId: userId,
        },
      });
    }

    const updatedPet = await updatePetStatus(pet);

    return res.json(updatedPet);
  } catch (error) {
    console.log("error =", error);
    throw error;
  }
};

// @desc  Кормление питомца
// @route post /api/pets/feed
// @body { petId: string }
// @access Public
export const feedPets = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ message: "petId is required" });
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    //Использовать перед любым действием с питомцем.
    await updatePetStatus(pet);

    // Вычисления
    const uptatedHunger = Math.min(pet.hunger + 20 + pet.feedBonus, 100);
    const uptatedEnergy = Math.min(pet.energy + 5, 100);

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        hunger: uptatedHunger,
        energy: uptatedEnergy,
        lastFeed: new Date(),
      },
    });
    return res.json(updatedPet);
  } catch (error) {
    console.log("error =", error);
  }
};

// @desc  Игра с питомцем
// @route post /api/pets/play
// @body { petId: string }
// @access Public
export const playPets = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ message: "petId is required" });
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    //Использовать перед любым действием с питомцем.
    await updatePetStatus(pet);

    // Вычисления
    const uptatedHappiness = Math.min(pet.happiness + pet.happyBonus + 20, 100);
    const uptatedKnowledge = Math.min(pet.knowledge + 5, 100);
    const uptatedHunger = pet.hunger - 5;
    const uptatedEnergy = pet.energy - 10;

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        happiness: uptatedHappiness,
        knowledge: uptatedKnowledge,
        hunger: uptatedHunger,
        energy: uptatedEnergy,
        lastPlay: new Date(),
      },
    });
    return res.json(updatedPet);
  } catch (error) {
    console.log("error =", error);
  }
};

// @desc  Сон питомца
// @route post /api/pets/sleep
// @body { petId: string }
// @access Public
export const sleepPets = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ message: "petId is required" });
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    //Использовать перед любым действием с питомцем.
    await updatePetStatus(pet);

    //Вычисления
    const updatedHunger = pet.hunger - 5;

    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        hunger: updatedHunger,
        energy: 100,
        lastSleep: new Date(),
      },
    });

    return res.json(updatedPet);
  } catch (error) {
    console.log("error =", error);
    throw error;
  }
};

// @desc  Обучение питомца
// @route post /api/pets/educate
// @body { petId: string }
// @access Public
export const educatePets = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ message: "petId is required" });
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      return res.status(404).json({ message: "Питомец не найден" });
    }

    //Использовать перед любым действием с питомцем.
    await updatePetStatus(pet);

    //Вычисления

    let updatedKnowledge;
    let updatedLevel;
    if (pet.knowledge + 15 > 95) {
      updatedKnowledge = 0;
      updatedLevel = Math.min(pet.level + 1, 10);
    } else {
      updatedKnowledge = pet.knowledge + 15;
      updatedLevel = pet.level;
    }

    const updatedHappiness = pet.happiness - 5;
    const updatedEnergy = pet.energy - 5;

    const updatedPet = await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        knowledge: updatedKnowledge,
        level: updatedLevel,
        happiness: updatedHappiness,
        energy: updatedEnergy,
        lastEducate: new Date(),
      },
    });

    return res.json(updatedPet);
  } catch (error) {
    console.log("error =", error);
    throw error;
  }
};

/** --------------------------------------------------- **/
export const updatePetStatus = async (pet: Pet): Promise<Pet> => {
  try {
    const nowTimestamp = Date.now();
    const {
      knowledge,
      energy,
      happiness,
      hunger,
      lastFeed,
      lastPlay,
      lastSleep,
      lastEducate,
    } = pet;

    if (lastFeed && nowTimestamp - lastFeed.getTime() > 5_000) {
      pet.hunger = Math.max(0, hunger - 2);
    }

    if (lastPlay && nowTimestamp - lastPlay.getTime() > 5_000) {
      pet.happiness = Math.max(0, happiness - 1);
    }

    if (lastSleep && nowTimestamp - lastSleep.getTime() > 5_000) {
      pet.energy = Math.max(0, energy - 1.5);
    }

    if (lastEducate && nowTimestamp - lastEducate.getTime() > 5_000) {
      pet.knowledge = Math.max(0, knowledge - 0.5);
    }

    const averageStats = (hunger + happiness + energy) / 3;
    pet.health = averageStats;

    // если с updatedAt
    return prisma.pet.update({
      where: {
        id: pet.id,
      },
      data: {
        ...pet,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.log("error =", error);
    throw error;
  }
};
