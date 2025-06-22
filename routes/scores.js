import express from "express";
import { getScores } from "../controllers/scores.js";
import { getScoresByUser } from "../controllers/scores.js";
import { getScoresByUserAndSubject } from "../controllers/scores.js";
import { getScoresByUserAndType } from "../controllers/scores.js";
import { createScore } from "../controllers/scores.js";
import { deleteScore } from "../controllers/scores.js";


const router = express.Router({ mergeParams: true });

router.route("/").get( getScores ).post( createScore );
router.route("/:id").delete( deleteScore );
router.route("/:email").get( getScoresByUser);
router.route("/:email/:subject").get( getScoresByUserAndSubject);
router.route("/:email/:type").get( getScoresByUserAndType);

export default router;