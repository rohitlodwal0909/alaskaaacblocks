const cron = require("node-cron");
const { Op } = require("sequelize");
const { Lead, LeadNote , Notification } = require("../models");

function startFollowUpReminder() {
  cron.schedule("0 9 * * *", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const leadsToday = await Lead.findAll({
      where: {
        date: {
          [Op.eq]: today
        }
      }
    });
    const notesToday = await LeadNote.findAll({
      where: {
        follow_up_date: {
          [Op.eq]: today
        }
      },
      include: [
        {
          model: Lead,
          attributes: ["name"]
        }
      ]
    });
    for (const lead of leadsToday) {
      const title = "Today's Follow-up Reminder";
      const message = `You have to talk to ${lead.name} today (based on Lead entry date).`;

      console.log("🔔", message);

      await Notification.create({
        lead_id: lead.id,
        title,
        message,
        status: "pending"
      });
    }
    for (const note of notesToday) {
      const leadName = note.Lead?.name || "Unknown";

      const title = "Follow-up Reminder from Notes";
      const message = `You need to follow up with ${leadName} today (based on note).`;

      await Notification.create({
        title,
        message
      });
    }
  });

  console.log("✅ Follow-Up Cron Started");
}

module.exports = startFollowUpReminder;
