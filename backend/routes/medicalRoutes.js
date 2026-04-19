import express from "express";
import { medicalQuery } from "../controllers/medicalController.js";
import authUser from '../middleware/authUser.js';

const router = express.Router();

router.post("/medical-query", authUser, medicalQuery);

export default router; 