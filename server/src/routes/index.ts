import { Router, Request, Response } from "express";
import {
  login,
  myPets,
  feedPets,
  playPets,
  sleepPets,
  educatePets,
} from "../controllers/index.js";

const router = Router();

router.route("/login").post(login);
router.route("/pets/my").get(myPets);
router.route("/pets/feed").post(feedPets);
router.route("/pets/play").post(playPets);
router.route("/pets/sleep").post(sleepPets);
router.route("/pets/educate").post(educatePets);

export default router;
