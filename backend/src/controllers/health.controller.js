exports.healthCheck = (req, res) => {
  res.json({
    status: "successfull connection of frontend and backend established",
    environment: process.env.NODE_ENV
  });
};
