const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../models");
const { Lead, LeadNote, Notification } = db;

function startFollowUpReminder() {
  // Har minute chalega
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        // ✅ Always use IST (Asia/Kolkata)
        const now = new Date();
        const istString = now.toLocaleString("en-GB", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });

        // "02/08/2025, 19:47" → convert into "2025-08-02T19:47"
        const [datePart, timePart] = istString.split(", ");
        const [day, month, year] = datePart.split("/");
        const currentMinute = `${year}-${month}-${day}T${timePart.slice(0, 5)}`;

        // ---- (1) LeadNote follow-up (exact date + time check) ----
        const dueNotes = await LeadNote.findAll({
          where: db.sequelize.where(
            db.sequelize.fn(
              "DATE_FORMAT",
              db.sequelize.col("followUpDate"),
              "%Y-%m-%dT%H:%i"
            ),
            currentMinute
          ),
          include: [{ model: Lead, as: "lead", attributes: ["id", "name"] }]
        });

        for (const note of dueNotes) {
          const leadName = note?.lead?.name || "Unknown Lead";
          const title = "Follow-up Reminder";
          const message = `You need to follow up with ${leadName} now (scheduled at ${note.followUpDate}).`;

          console.log("🔔 Note Reminder:", message);

          await Notification.create({
            lead_id: note?.lead?.id,
            title,
            message,
            date_time: now,
            status: "pending"
          });
        }

        // ---- (2) Lead table follow-up (same date check, but only once per day at 9 AM IST) ----
        const hoursIST = parseInt(timePart.split(":")[0], 10);
        const minutesIST = parseInt(timePart.split(":")[1], 10);

        if (hoursIST === 9 && minutesIST === 0) {
          const startOfDay = new Date(
            now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
          );
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(startOfDay);
          endOfDay.setDate(endOfDay.getDate() + 1);

          const leadsToday = await Lead.findAll({
            where: {
              date: {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
              }
            }
          });

          for (const lead of leadsToday) {
            const alreadySent = await Notification.findOne({
              where: {
                lead_id: lead.id,
                title: "Today's Follow-up Reminder",
                date_time: {
                  [Op.gte]: startOfDay,
                  [Op.lt]: endOfDay
                }
              }
            });

            if (!alreadySent) {
              const title = "Today's Follow-up Reminder";
              const message = `You have to talk to ${lead.name} today (based on Lead entry date).`;

              console.log("🔔 Lead Reminder:", message);

              await Notification.create({
                lead_id: lead.id,
                title,
                message,
                date_time: now,
                status: "pending"
              });
            }
          }
        }
      } catch (error) {
        console.error("❌ Error in follow-up cron:", error);
      }
    },
    {
      timezone: "Asia/Kolkata" // ✅ Cron IST me chalega
    }
  );

  console.log("✅ Follow-Up Cron Started (Lead + LeadNote reminders)");
}

module.exports = startFollowUpReminder;
