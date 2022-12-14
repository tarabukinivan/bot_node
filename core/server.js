const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { mainRouter } = require('./routers');
const cron = require("node-cron");
const shell = require("shelljs");

cron.schedule('*/1 * * * *', async () => {
    console.log('[Core] Fetch updates');
    if (shell.exec('git pull', {silent: true}).stdout.trim() !== 'Already up to date.') {
        console.log('New version! Updating..');
        shell.exec('npm install', {silent: true});
        process.exit(0);
    }
});

function startCore(port) {
    const PORT = port|| 25566;
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(`/`, mainRouter);
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`[Core] Running: 0.0.0.0:${PORT}`);
    });
}

startCore();
