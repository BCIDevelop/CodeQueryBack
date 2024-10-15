'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "classroom_id" to table "answers"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2024-10-15T03:40:45.916Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "answers",
        "classroom_id",
        {
            "type": Sequelize.INTEGER,
            "onUpdate": "CASCADE",
            "onDelete": "CASCADE",
            "references": {
                "model": "classrooms",
                "key": "id"
            },
            "allowNull": true,
            "field": "classroom_id"
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
