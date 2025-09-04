import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswer } from "../middlewares/validation.mjs";

const answerRouter = Router();

// Create an answer for a question
answerRouter.post("/:questionId/answers", validateCreateAnswer, async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
      [questionId, content]
    );

    return res.status(201).json({ message: "Answer created successfully." });

  } catch (err) {
    return res.status(500).json({ message: "Unable to create answers." });
  }
});

// Get answers for a question
answerRouter.get("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const answersResult = await connectionPool.query(
      "SELECT id, content FROM answers WHERE question_id = $1",
      [questionId]
    );

    return res.status(200).json({ data: answersResult.rows });

  } catch (err) {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

// Delete answers for a question
answerRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;

  try {
    const questionResult = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    await connectionPool.query(
      "DELETE FROM answers WHERE question_id = $1",
      [questionId]
    );

    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });

  } catch (err) {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default answerRouter;
