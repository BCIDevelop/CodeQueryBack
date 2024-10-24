'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "price_id" to table "subscriptions"
 *
 **/

var info = {
    "revision": 6,
    "name": "noname",
    "created": "2024-10-23T04:43:06.391Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "subscriptions",
        "price_id",
        {
            "type": Sequelize.STRING,
            "field": "price_id"
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
