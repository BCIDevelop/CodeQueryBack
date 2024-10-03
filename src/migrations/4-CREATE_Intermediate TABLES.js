'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "question_id" on table "answers"
 * changeColumn "title" on table "questions"
 *
 **/

var info = {
    "revision": 4,
    "name": "CREATE Intermediate TABLES",
    "created": "2024-10-03T00:23:30.664Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "answers",
            "question_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "questions",
                    "key": "id"
                },
                "allowNull": true,
                "field": "question_id"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "questions",
            "title",
            {
                "type": Sequelize.STRING,
                "field": "title",
                "unique": true
            }
        ]
    }
];

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
