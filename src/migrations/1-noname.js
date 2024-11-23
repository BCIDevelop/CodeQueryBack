'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "roles", deps: []
 * createTable "subscriptions", deps: []
 * createTable "tags", deps: []
 * createTable "users", deps: [roles, subscriptions]
 * createTable "classrooms", deps: [users]
 * createTable "chats", deps: [users, users]
 * createTable "questions", deps: [users, classrooms]
 * createTable "messages", deps: [chats, users]
 * createTable "question_tags", deps: [questions, tags, questions, tags]
 * createTable "answers", deps: [questions, users, classrooms]
 * createTable "student_classrooms", deps: [users, classrooms, classrooms, users]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2024-11-23T00:03:15.528Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "roles",
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
            "subscriptions",
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
                    "field": "name",
                    "unique": true
                },
                "product_id": {
                    "type": Sequelize.STRING,
                    "field": "product_id",
                    "unique": true
                },
                "price_id": {
                    "type": Sequelize.STRING,
                    "field": "price_id"
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
                    "field": "name",
                    "unique": true
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
            "users",
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
                "last_name": {
                    "type": Sequelize.STRING,
                    "field": "last_name"
                },
                "email": {
                    "type": Sequelize.STRING,
                    "field": "email",
                    "unique": true
                },
                "password": {
                    "type": Sequelize.STRING,
                    "field": "password"
                },
                "avatar": {
                    "type": Sequelize.STRING,
                    "field": "avatar",
                    "allowNull": true
                },
                "token": {
                    "type": Sequelize.STRING,
                    "field": "token",
                    "allowNull": true
                },
                "rol_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "rol_id"
                },
                "active_status": {
                    "type": Sequelize.BOOLEAN,
                    "field": "active_status",
                    "defaultValue": false
                },
                "last_message": {
                    "type": Sequelize.STRING,
                    "field": "last_message",
                    "allowNull": true
                },
                "customer_id": {
                    "type": Sequelize.STRING,
                    "field": "customer_id",
                    "unique": true,
                    "allowNull": true
                },
                "subscription_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "subscriptions",
                        "key": "id"
                    },
                    "field": "subscription_id",
                    "allowNull": true
                },
                "subscription_user": {
                    "type": Sequelize.STRING,
                    "field": "subscription_user",
                    "unique": true,
                    "allowNull": true
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
            "classrooms",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "classroom_name": {
                    "type": Sequelize.STRING,
                    "field": "classroom_name"
                },
                "description": {
                    "type": Sequelize.STRING,
                    "field": "description"
                },
                "owner_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "owner_id"
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
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "sender_id"
                },
                "receiver_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
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
                    "field": "title",
                    "unique": true
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
                "owner_id": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true,
                    "field": "owner_id"
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
                    "onDelete": "CASCADE",
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
