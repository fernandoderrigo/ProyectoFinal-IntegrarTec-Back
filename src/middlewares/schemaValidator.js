export const schemaValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
};