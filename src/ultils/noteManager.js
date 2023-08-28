const schedule = require('node-schedule');

const jobs = [];

function addJob(job,id) {
    jobs.push({job,id});
}

function removeJob(job) {
    const index = jobs.indexOf(job);
    if (index !== -1) {
        jobs.splice(index, 1);
    }
}

function startJobs() {
    jobs.forEach(job => job.start());
}

module.exports = {
    addJob:addJob,
    removeJob:removeJob,
    startJobs:startJobs,
    jobs:jobs
};