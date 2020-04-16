import express from "express";

import {
  getAll,
  addCandidate,
  searchCandidates,
  getByID,
} from "../controllers/candidatesController";

const router = express.Router();

// Candidates
router.get("/", getAll);
router.get("/id/:id", getByID);
router.get("/filter", searchCandidates);
router.post("/", addCandidate);

export default router;
