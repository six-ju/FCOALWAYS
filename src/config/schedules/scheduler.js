const cron = require('node-cron');

// Schedule a task to run every day at midnight
let i = 1;
cron.schedule('* * * * *', () => {
    console.log(i);
    i++
    // Add your scheduled task logic here
});