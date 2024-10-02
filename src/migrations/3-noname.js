'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "question_tags", deps: [questions, tags, questions, tags]
 * createTable "student_classrooms", deps: [users, classrooms, classrooms, users]
 *
 **/

var info = {
    "revision": 3,
    "name": "noname",
    "created": "2024-10-02T00:51:15.357Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "question_tags",
            {
                "question_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "questions",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "question_id"
                },
                "tag_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "tags",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "tag_id"
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updated_at": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                },
                "questionId": {
                    "type": Sequelize.INTEGER,
                    "field": "question_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "questions",
                        "key": "id"
                    },
                    "primaryKey": true
                },
                "tagId": {
                    "type": Sequelize.INTEGER,
                    "field": "tag_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "tags",
                        "key": "id"
                    },
                    "primaryKey": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "student_classrooms",
            {
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "user_id"
                },
                "classroom_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "classrooms",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "classroom_id"
                },
                "created_at": {
                    "type": Sequelize.DATE,
                    "field": "created_at",
                    "allowNull": false
                },
                "updated_at": {
                    "type": Sequelize.DATE,
                    "field": "updated_at",
                    "allowNull": false
                },
                "classroomId": {
                    "type": Sequelize.INTEGER,
                    "field": "classroom_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "classrooms",
                        "key": "id"
                    },
                    "primaryKey": true
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "field": "user_id",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "primaryKey": true
                }
            },
            {}
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
