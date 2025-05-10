const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API aktif");
});

// Menghubungkan endpoint ke Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/jurusan", require("./routes/jurusan"));
// app.use("/api/prodi", require("./routes/prodi"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
