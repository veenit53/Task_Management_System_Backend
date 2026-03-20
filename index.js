require("dotenv").config({ path: "./.env" });
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


// Connect MongoDB
const { dbConnect } = require("./databaseConfig/connectDatabase");
dbConnect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

const port = process.env.PORT || 8080;


// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://task-management-system-efjx.vercel.app"],
  credentials: true,
}));


//routes

const authRoutes = require("./routes/auth.routes");

const taskRoutes = require("./routes/user/task.routes");



//use routes
app.use("/users", authRoutes);
app.use("/tasks", taskRoutes);

app.get('/', (req, res) => {
  res.send(' Backend is running!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
