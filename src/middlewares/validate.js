const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const issues = err.issues || err.errors || [];
    const errors = issues.map((e) => ({
      field: e.path?.join(".") || "unknown",
      error: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors,
    });
  }
};

module.exports = validate;
