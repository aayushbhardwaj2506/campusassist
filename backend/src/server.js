const app = require("./app");

// Import Firebase (just to initialize it)
const { db } = require("./config/firebase");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Firebase connected successfully");
});