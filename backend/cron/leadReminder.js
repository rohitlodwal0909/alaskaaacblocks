const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require("../models");
const { Lead, LeadNote, Notification } = db;

function startFollowUpReminder() {
  // Har minute chalega
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // ---- (1) LeadNote follow-up (exact date + time check) ----
      const start = new Date(now);
      start.setSeconds(0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 1);

      const dueNotes = await LeadNote.findAll({
        where: {
          followUpDate: {
            [Op.gte]: start,
            [Op.lt]: end
          }
        },
        include: [
          {
            model: Lead,
            as: "lead",
            attributes: ["id", "name"]
          }
        ]
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

      // ---- (2) Lead table follow-up (same date check, but only once per day) ----
      // Roz sirf ek hi baar (subah 9 baje) check karna
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
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
          // check karo agar aaj ke liye already notification bana hai ya nahi
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
  });

  console.log("✅ Follow-Up Cron Started (Lead + LeadNote reminders)");
}

module.exports = startFollowUpReminder;
