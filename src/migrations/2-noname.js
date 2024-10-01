'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "chats", deps: []
 * createTable "tags", deps: []
 * createTable "questions", deps: [users, classrooms]
 * createTable "messages", deps: [chats]
 * createTable "answers", deps: [questions, users]
 * changeColumn "active_status" on table "users"
 *
 **/

var info = {
    "revision": 2,
    "name": "noname",
    "created": "2024-10-01T06:17:45.690Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "chats",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "sender_id": {
                    "type": Sequelize.INTEGER,
                    "field": "sender_id"
                },
                "receiver_id": {
                    "type": Sequelize.INTEGER,
                    "field": "receiver_id"
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
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "tags",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": Sequelize.STRING,
                    "field": "name"
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
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "questions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING,
                    "field": "title"
                },
                "body": {
                    "type": Sequelize.TEXT,
                    "field": "body"
                },
                "image": {
                    "type": Sequelize.STRING,
                    "field": "image",
                    "allowNull": true
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
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
                "status": {
                    "type": Sequelize.STRING,
                    "field": "status",
                    "defaultValue": "PENDING"
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
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "messages",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "message": {
                    "type": Sequelize.TEXT,
                    "field": "message"
                },
                "chat_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "chats",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "chat_id"
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
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "answers",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "body": {
                    "type": Sequelize.TEXT,
                    "field": "body"
                },
                "image": {
                    "type": Sequelize.STRING,
                    "field": "image",
                    "allowNull": true
                },
                "question_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "questions",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "question_id"
                },
                "user_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "user_id"
                },
                "is_accepted": {
                    "type": Sequelize.BOOLEAN,
                    "field": "is_accepted",
                    "defaultValue": false
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
                }
            },
            {}
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "active_status",
            {
                "type": Sequelize.BOOLEAN,
                "field": "active_status",
                "defaultValue": false
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
