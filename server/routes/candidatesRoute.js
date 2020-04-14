import express from "express";

import { getAll, addCandidate } from "../controllers/candidatesController";

const router = express.Router();

// Candidates
router.get("/", getAll);
router.post("/", addCandidate);

export default router;
