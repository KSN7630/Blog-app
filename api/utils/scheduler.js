import cron from 'node-cron';
import { Leet_User } from '../models/LeetCode_User.js';


const testing='* * * * *'
const prod='50 23 * * *'
cron.schedule(prod, async () => {
    const currentDate = new Date();
    console.log(`fetching and updating data for all users at ${currentDate}...`);

    try {

        const users = await Leet_User.find({});

        if (users.length === 0) {
            console.log('No users found in the leet_user database.');
            return;
        }

        

        // Create an array of Promises for fetching and updating each user
        const userPromises = users.map(async (user) => {
            const leetUserName = user.leetUsername;
            try {
                const response = await fetch(`https://leetcode-express-api.vercel.app/api/dataForSubmissionStats/${leetUserName}`);
                const userData = await response.json();

                if (userData) {
                    const timeSeriesData = user.timeSeriesData; // Current time series data
                    const prevEntry = timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1] : null; // Get the last entry

                    // Construct the new time series entry
                    const newEntry = {
                        date: currentDate,
                        data: {
                            easy: userData.data.matchedUser.submitStats.acSubmissionNum[1].count || 0,
                            medium: userData.data.matchedUser.submitStats.acSubmissionNum[2].count || 0,
                            hard: userData.data.matchedUser.submitStats.acSubmissionNum[3].count || 0,
                        },
                        solved: {
                            easy: 0, // Placeholder for difference
                            medium: 0, // Placeholder for difference
                            hard: 0 // Placeholder for difference
                        }
                    };

                    if (prevEntry) {
                        newEntry.solved.easy = userData.data.matchedUser.submitStats.acSubmissionNum[1].count - prevEntry.data.easy || 0;
                        newEntry.solved.medium = userData.data.matchedUser.submitStats.acSubmissionNum[2].count - prevEntry.solved.medium || 0;
                        newEntry.solved.hard = userData.data.matchedUser.submitStats.acSubmissionNum[3].count - prevEntry.solved.hard || 0;

                        //  console.log(`Differences for ${leetUserName} - Easy: ${newEntry.solved.easy}, Medium: ${newEntry.solved.medium}, Hard: ${newEntry.solved.hard}`);
                    } else {
                        // console.log(`No previous entry found for ${leetUserName}. This is the first entry.`);
                
                        newEntry.solved.easy = userData.data.matchedUser.submitStats.acSubmissionNum[1].count || 0;
                        newEntry.solved.medium = userData.data.matchedUser.submitStats.acSubmissionNum[2].count || 0;
                        newEntry.solved.hard = userData.data.matchedUser.submitStats.acSubmissionNum[3].count || 0;
                    }

                    // Push new data into the user's timeSeriesData array
                    user.timeSeriesData.push(newEntry);

                    // Save the updated user back to the database
                    await user.save();

                    console.log(`Data updated for ${leetUserName}`);
                }
            } catch (error) {
                console.error(`Error fetching or saving data for ${leetUserName}:`, error);
            }
        });

        // Wait for all user fetch and save operations to complete
        await Promise.all(userPromises);

        // console.log('Data fetching and update process completed for all users.');

    } catch (dbError) {
        console.error('Error fetching users from the database:', dbError);
    }
});

