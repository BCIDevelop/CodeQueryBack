'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "subscription_user" to table "users"
 *
 **/

var info = {
    "revision": 7,
    "name": "noname",
    "created": "2024-10-24T06:21:16.456Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "users",
        "subscription_user",
        {
            "type": Sequelize.STRING,
            "field": "subscription_user",
            "unique": true,
            "allowNull": true
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
