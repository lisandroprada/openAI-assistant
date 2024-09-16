document.addEventListener("DOMContentLoaded", () => {
  const createAssistantButton = document.getElementById(
    "createAssistantButton",
  );
  const createThreadButton = document.getElementById("createThreadButton");
  const showThreadsButton = document.getElementById("showThreadsButton");
  const sendButton = document.getElementById("sendButton");
  const userInput = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");
  const statusDiv = document.getElementById("status");
  const assistantStatusDiv = document.getElementById("assistantStatus");
  const threadsList = document.getElementById("threadsList");

  let threadId;
  let runId;

  const createAssistant = async () => {
    const response = await fetch("/api/assistant/create", { method: "POST" });
    const data = await response.json();
    assistantStatusDiv.textContent = data.message;
  };

  const createThread = async () => {
    const response = await fetch("/api/assistant/thread", { method: "POST" });
    const data = await response.json();
    threadId = data.thread.id;
    console.log(data.message);
    showThreads(); // Refresh the thread list
  };

  const sendMessage = async (content) => {
    const response = await fetch("/api/assistant/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, threadId }),
    });
    const data = await response.json();
    runId = data.run.id;
    console.log(data.message);
    checkRunStatus();
  };

  const checkRunStatus = async () => {
    const response = await fetch(`/api/assistant/run/${threadId}/${runId}`);
    const data = await response.json();
    const message = document.createElement("div");
    message.classList.add("message", "assistant");
    message.textContent = `Assistant: ${data.message}`;
    messagesDiv.appendChild(message);
    statusDiv.textContent = `Run Status: ${data.status}`;
  };

  const showThreads = async () => {
    const response = await fetch("/api/assistant/threads");
    const data = await response.json();
    threadsList.innerHTML = "";
    data.threads.forEach((thread) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = `Thread ID: ${thread.id}`;
      link.addEventListener("click", () => {
        threadId = thread.id;
        getThreadMessages(thread.id);
      });
      listItem.appendChild(link);
      threadsList.appendChild(listItem);
    });
  };

  const getThreadMessages = async (threadId) => {
    const response = await fetch(`/api/assistant/thread/${threadId}/messages`);
    const data = await response.json();
    messagesDiv.innerHTML = "";
    data.messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", message.role);
      messageDiv.textContent = `${message.role.charAt(0).toUpperCase() + message.role.slice(1)}: ${message.content[0].text.value}`;
      messagesDiv.appendChild(messageDiv);
    });
  };

  createAssistantButton.addEventListener("click", () => {
    createAssistant();
  });

  createThreadButton.addEventListener("click", () => {
    createThread();
  });

  showThreadsButton.addEventListener("click", () => {
    showThreads();
  });

  sendButton.addEventListener("click", () => {
    const userMessage = userInput.value;
    const message = document.createElement("div");
    message.classList.add("message", "user");
    message.textContent = `User: ${userMessage}`;
    messagesDiv.appendChild(message);
    sendMessage(userMessage);
    userInput.value = "";
  });
});
