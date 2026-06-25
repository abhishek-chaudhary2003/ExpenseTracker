import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

await initDB();
await initBudgetDB();
app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`));

export default app;
