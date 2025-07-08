const cron = require("node-cron");
const { Op } = require("sequelize");
const db = require('../models');
const {  Lead, LeadNote , Notification }= db


function startFollowUpReminder() {
  cron.schedule("0 9 * * *", async () => {

    
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1); // next midnight

    // Convert to UTC so it matches DB values stored in UTC
    const startUTC = new Date(start.toISOString());
    const endUTC = new Date(end.toISOString());
    const leadsToday = await Lead.findAll({
      where: {
        date: {
          [Op.gte]: startUTC,
          [Op.lt]: endUTC
        }
      }
    });

    const todayString = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const notesToday = await LeadNote.findAll({
      where: {
        followUpDate: {
          [Op.eq]: todayString
        }
      },
      include: [
        {
          model: Lead,
          as: "lead",
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
        date_time:now,
         status: "pending"
      });
    }
    for (const note of notesToday) {
      const leadName = note?.lead?.name
      const title = "Follow-up Reminder from Notes";
      const message = `You need to follow up with ${leadName} today (based on note).`;

      await Notification.create({
        title,
        message,
        date_time:now,
      });
    }
  });

  console.log("✅ Follow-Up Cron Started");
}

module.exports = startFollowUpReminder;
