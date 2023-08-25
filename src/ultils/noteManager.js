const schedule = require('node-schedule');

const jobs = [];

function addJob(job) {
    jobs.push(job);
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
    startJobs:startJobs
};