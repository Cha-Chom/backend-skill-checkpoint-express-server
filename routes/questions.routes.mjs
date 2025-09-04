import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionsRouter = Router()

// Create a new question
questionsRouter.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Invalid request data." });
    }

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
  questionsRouter.put("/:questionId", async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({
      message: "Invalid request data.",
    });
  }

  try {
    const result = await connectionPool.query(
      `UPDATE questions
       SET title = $1, description = $2, category = $3
       WHERE id = $4
       RETURNING *`,
      [title, description, category, questionIdFromClient]
    );

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

  try {
    const result = await connectionPool.query(
      `DELETE FROM questions WHERE id = $1 RETURNING *`,
      [questionIdFromClient]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      message: "Question post has been deleted successfully.",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Unable to delete question.",
    });
  }
});


  export default questionsRouter