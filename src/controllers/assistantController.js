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
    const assistant = await openai.beta.assistants.create({
      name: "Inmobiliario",
      instructions:
        "Eres un asistente inmobiliario que ayuda a los usuarios a encontrar propiedades en alquiler o venta. Cuando el usuario proporciona información sobre el tipo de operación, la ubicación y el presupuesto, debes extraer esos parámetros y llamar a la función 'buscarPropiedad' con ellos. Si te faltan datos, pregúntale al usuario específicamente por el parámetro faltante.",
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

export const listAssistants = async (req, res) => {
  try {
    const myAssistants = await openai.beta.assistants.list({
      order: "desc",
      limit: 20,
    });
    res.status(200).json({ assistants: myAssistants.data });
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
  const { content, threadId, assistantId } = req.body;
  try {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    checkRunStatus(res, threadId, run.id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkRunStatus = async (res, threadId, runId) => {
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  console.log({ runStatus });

  while (runStatus.status !== "completed") {
    if (runStatus.status === "requires_action") {
      const toolCalls =
        runStatus.required_action.submit_tool_outputs.tool_calls;
      const parsedArgs = JSON.parse(toolCalls[0].function.arguments);
      const { tipo, ubicacion } = parsedArgs;

      const inmuebles = buscarInmuebles(tipo, ubicacion);

      await openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: [
          {
            tool_call_id: toolCalls[0].id,
            output: JSON.stringify(inmuebles),
          },
        ],
      });
    }

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

// Simulación de búsqueda de inmuebles
const buscarInmuebles = (tipo, ubicacion) => {
  console.log({ tipo, ubicacion });
  // Aquí puedes agregar lógica para buscar inmuebles en una base de datos o API externa
  // Por ahora, devolveremos una lista simulada de inmuebles
  return [
    { id: 1, tipo, ubicacion, descripcion: "Inmueble 1", precio: 1000 },
    { id: 2, tipo, ubicacion, descripcion: "Inmueble 2", precio: 2000 },
  ];
};
