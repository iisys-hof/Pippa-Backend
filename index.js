// Absolutely minimal backend implementation for Pippa to serve the Json-files
// created and utilized as config files. Listens on 8000. Starts with 'node index.js'

// import/set up express framework and it's middleware to execute special tasks
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// import os library for home directory access
const os = require('os');

// import node library for filesystem access
var fs = require('fs');

//start express server
app.listen(8000, () => {
    console.log('Pippa Backend Server started!');
});

// following are route declarations that represent the api under which this server is reachable

// get the main configuration file
app.route('/api/mainConfig').get((req, res) => {

    fs.readFile(os.homedir() + '\\Desktop\\MainConfig\\mainconf.json', 'utf8', function (err, data) {
        if (err) {
            console.error('Could not send Main Configuration');
            console.error(err.stack);
            res.status(500).send();
        } else {
            res.send(data);
            console.log('Sent Main Configuration.');
        }
    });
});

// set the main configuration file
app.route('/api/mainConfig').post((req, res) => {

    fs.writeFile(os.homedir() + '\\Desktop\\MainConfig\\mainconf.json', JSON.stringify(req.body), 'utf8', function (err, data) {
        if (err) {
            console.error('Could not store Main Configuration');
            console.error(err.stack);
            res.status(500).send();
        } else {
            res.status(200).send(req.body);
            console.log('Stored Main Configuration.');
        }
    });
});

// get a list of all currently installed skills
// do so by checking in all filenames from skill config folder
app.route('/api/skills').get((req, res) => {

    fs.readdir(os.homedir() + '\\Desktop\\SkillConfig', function (err, data) {
        if (err) {
            console.error('Could not retrieve Skill Config folder content');
            console.error(err.stack);
            res.status(500).send();
        } else {

            //todo check out for real skill-names which might be a little clunky
            for (var i = 0; i < data.length; i++) {
                noFileEnding = data[i].substring(0, data[i].lastIndexOf('.'))
                fileName = noFileEnding.substring(noFileEnding.lastIndexOf('.') + 1, noFileEnding.length + 1);
                data[i] = {label: fileName, value: noFileEnding};
            }

            res.status(200).send(data);
            console.log('Sent Skill List. ' + data.length + ' entries.')
        }
    });
});

// get the config file for a single skill
app.route('/api/skills/:name').get((req, res) => {

    const requestedSkillName = req.params['name'];

    fs.readFile(os.homedir() + '\\Desktop\\SkillConfig\\' + requestedSkillName + '.json', 'utf8', function (err, data) {
        if (err) {
            console.error('Could not send Skill Config. ' + requestedSkillName);
            console.error(err.stack);
            res.status(500).send();
        } else {
            res.status(200).send(data);
            console.log('Sent Skill Config. ' + requestedSkillName)
        }
    });
});

// set the config file for a single skill
app.route('/api/skills/:name').post((req, res) => {

    const requestedSkillName = req.params['name'];

    if (requestedSkillName != null && requestedSkillName != "" && requestedSkillName != "null") {

        fs.writeFile(os.homedir() + '\\Desktop\\SkillConfig\\' + requestedSkillName + '.json', JSON.stringify(req.body), 'utf8', function (err, data) {
            if (err) {
                console.error('Could not set Skill Config. ' + requestedSkillName);
                console.error(err.stack);
                res.status(500).send();
            } else {
                res.status(200).send(req.body);
                console.log('Stored Skill Config. ' + requestedSkillName)
            }
        });
    } else {
        console.error('Could not set Skill Config. ' + requestedSkillName);
        res.status(500).send();
    }
});