const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authentication/AuthRoutes");
const userRoutes = require("./routes/usermanagment/UserRoutes");
const leadRoutes = require("./routes/leadmanagment/LeadRoutes");
const NotificationRouter = require("./routes/notification/NotificationRoutes");
const startLeadReminderJob = require("./cron/leadReminder");

dotenv.config();
const app = express();

//  Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(userRoutes);
app.use(leadRoutes);
app.use(NotificationRouter)
//  DB connection and start

// Start cron

startLeadReminderJob();

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Backend server running on port 5000")
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
