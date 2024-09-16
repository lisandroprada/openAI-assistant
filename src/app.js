import express from "express";
import dotenv from "dotenv";
import assistantRoutes from "./routes/assistantRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/assistant", assistantRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
