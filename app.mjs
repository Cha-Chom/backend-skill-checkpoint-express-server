import express from "express";

import questionsRouter from "./routes/questions.routes.mjs";
import questionsSearchRouter from "./routes/questions.search.routes.mjs";
import answerRouter from "./routes/answer.routes.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.use("/questions", questionsSearchRouter);

app.use("/questions", questionsRouter);

app.use("/questions", answerRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
