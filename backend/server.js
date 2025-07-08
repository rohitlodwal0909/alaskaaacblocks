require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");
      sequelize.sync();

const authRoutes = require("./routes/authentication/AuthRoutes");
const leadRoutes = require("./routes/leadmanagment/LeadRoutes");
const NotificationRouter = require("./routes/notification/NotificationRoutes");
const startLeadReminderJob = require("./cron/leadReminder");

const app = express();

//  Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
// app.use(userRoutes);
app.use(leadRoutes);
app.use(NotificationRouter);

process.on('uncaoughtException', function (err) {
console.error('UNCOUGHT EXCEPTION:', err);

});

startLeadReminderJob();

if(process.env.NODE_ENV === "production") {

const disPath = path.join(__dirname, "../client/dist");

app.use(express.static(disPath));

app.get(/^\/(?!api).*/, (req,res) => {
  res.sendFile(path.join(disPath, "index.html"));

});

}


sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Backend server running on port 5000")
    );
  })
  .catch((err) => console.error("DB connection failed:", err));
