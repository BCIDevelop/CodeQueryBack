'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "status" to table "student_classrooms"
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2024-10-16T04:22:33.665Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "student_classrooms",
        "status",
        {
            "type": Sequelize.STRING,
            "field": "status",
            "defaultValue": "PENDING"
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
