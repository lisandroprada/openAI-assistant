import express from "express";
import {
  createAssistant,
  createThread,
  sendMessage,
  getRunStatus,
  listThreads,
  getThreadMessages,
} from "../controllers/assistantController.js";

const router = express.Router();

router.post("/create", createAssistant);
router.post("/thread", createThread);
router.post("/message", sendMessage);
router.get("/run/:threadId/:runId", getRunStatus);
router.get("/threads", listThreads);
router.get("/thread/:threadId/messages", getThreadMessages);

export default router;
