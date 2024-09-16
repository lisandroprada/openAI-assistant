import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let assistant;
let threads = [];

export const createAssistant = async (req, res) => {
  try {
    assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions:
        "You are a personal math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    res
      .status(200)
      .json({ message: "Assistant created successfully", assistant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createThread = async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    threads.push(thread);
    res.status(200).json({ message: "Thread created successfully", thread });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { content, threadId } = req.body;
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant.id,
    });

    res.status(200).json({ message: "Message sent successfully", run });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRunStatus = async (req, res) => {
  const { threadId, runId } = req.params;
  try {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (runStatus.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessageForRun = messages.data
      .filter(
        (message) => message.run_id === runId && message.role === "assistant",
      )
      .pop();

    res.status(200).json({
      message: lastMessageForRun.content[0].text.value,
      status: runStatus.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listThreads = async (req, res) => {
  try {
    res.status(200).json({ threads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getThreadMessages = async (req, res) => {
  const { threadId } = req.params;
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    res.status(200).json({ messages: messages.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
