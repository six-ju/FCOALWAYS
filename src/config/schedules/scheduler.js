const cron = require('node-cron');

// Schedule a task to run every day at midnight
cron.schedule('* * * * *', () => {
    console.log('Task running at midnight');
    // Add your scheduled task logic here
});