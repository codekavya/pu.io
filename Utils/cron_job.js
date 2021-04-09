import corn from "node-cron";

import apiCounts from "../models/apiModels.js";

export default async function job() {
  //Corn job to update the database at the midnight everyday
  corn.schedule("0 0 * * *", async () => {
    //Get all the user's api Model from the database
    const allUsers = await apiCounts.find({});

    allUsers.forEach(async (every) => {
      //Set every User's today hit to zero at the end of the day
      every.TodayHits = 0;
      //save the  updated field
      await every.save();
    });
    console.log(`Updated Completed for ${new Date.toString()}`);
  });
}
