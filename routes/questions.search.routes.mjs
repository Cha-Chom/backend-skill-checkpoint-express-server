import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateSearchQuery } from "../middlewares/validation.mjs";

const questionsSearchRouter = Router()

questionsSearchRouter.get("/search", validateSearchQuery, async (req, res) => {
    const { title, category } = req.query;
  
    try {
      let query = `SELECT * FROM questions WHERE 1=1`;
      const values = [];
      let index = 1;
  
      if (title) {
        query += ` AND title ILIKE $${index}`;
        values.push(`%${title}%`);
        index++;
      }
  
      if (category) {
        query += ` AND category ILIKE $${index}`;
        values.push(`%${category}%`);
        index++;
      }
  
      const results = await connectionPool.query(query, values);
  
      return res.status(200).json({
        data: results.rows,
      });
  
    } catch (err) {
      return res.status(500).json({
        message: "Unable to fetch a question.",
      });
    }
  });

  export default questionsSearchRouter;
  