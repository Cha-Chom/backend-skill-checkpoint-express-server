export const validateCreateQuestion = (req, res, next) => {
  const { title, description } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ 
        message: "Invalid request data." });
  }
  next();
};

export const validateUpdateQuestion = (req, res, next) => {
  const { title, description, category } = req.body || {};

  const hasTitle = typeof title === "string";
  const hasDescription = typeof description === "string";
  const hasCategory = typeof category === "string" || category === null;

  if (!hasTitle && !hasDescription && !hasCategory) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  next();
};

export const validateSearchQuery = (req, res, next) => {
  const { title, category } = req.query || {};
  if (!title && !category) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }
  next();
};

export const validateCreateAnswer = (req, res, next) => {
  const { content } = req.body || {};

  if (!content) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  if (content.length > 300) {
    return res.status(400).json({ message: "Content must be at most 300 characters." });
  }
  next();
};
