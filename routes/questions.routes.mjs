import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateQuestion, validateUpdateQuestion } from "../middlewares/validation.mjs";

const questionsRouter = Router()

// Create a new question
questionsRouter.post("/", validateCreateQuestion, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    await connectionPool.query(
      `INSERT INTO questions (title, description, category) 
       VALUES ($1, $2, $3)`,
      [title, description, category ?? null]
    );

    return res.status(201).json({ message: "Question created successfully." });

  } catch (err) {
    return res.status(500).json({ message: "Unable to create question." });
  }
});

// Get all questions
questionsRouter.get("/", async (req, res) => {
    
    let results;
    
    try {
      results = await connectionPool.query("select * from questions");
      return res.status(200).json({ 
        data: results.rows,
     });

    } catch (err) {
      return res.status(500).json({ 
        message: "Unable to fetch questions.",
        });
    }
  });

// Get a question by ID
  questionsRouter.get("/:questionId", async (req, res) => {
    const questionsIdFromClient = req.params.questionId;
  
    try {
      const results = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [questionsIdFromClient]
      );
  
      if (results.rows.length === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }
  
      return res.status(200).json({
        data: results.rows[0],
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Unable to fetch questions.",
      });
    }
  });

// Update a question by ID 
  questionsRouter.put("/:questionId", validateUpdateQuestion, async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const { title, description, category } = req.body;

    const fields = [];
    const values = [];
    let index = 1;

    if (typeof title === "string") {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (typeof description === "string") {
      fields.push(`description = $${index++}`);
      values.push(description);
    }
    if (typeof category === "string" || category === null) {
      fields.push(`category = $${index++}`);
      values.push(category ?? null);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "Invalid request data.",
      });
    }

    try {
      const query = `UPDATE questions SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;
      values.push(questionIdFromClient);

      const result = await connectionPool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Question not found.",
        });
      }

      return res.status(200).json({
        message: "Question updated successfully.",
      });

    } catch (err) {
      return res.status(500).json({
        message: "Unable to fetch questions.",
      });
    }
  });

// Delete a question by ID
questionsRouter.delete("/:questionId", async (req, res) => {
  const questionIdFromClient = req.params.questionId;

  const client = await connectionPool.connect();
  try {
    await client.query("BEGIN");

    const questionResult = await client.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionIdFromClient]
    );

    if (questionResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    await client.query(
      `DELETE FROM answers WHERE question_id = $1`,
      [questionIdFromClient]
    );

    await client.query(
      `DELETE FROM questions WHERE id = $1`,
      [questionIdFromClient]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  } finally {
    client.release();
  }
});

  export default questionsRouter;