'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "subscription_id" on table "users"
 * changeColumn "subscription_id" on table "users"
 * changeColumn "subscription_id" on table "users"
 * changeColumn "subscription_id" on table "users"
 * changeColumn "subscription_id" on table "users"
 *
 **/

var info = {
    "revision": 5,
    "name": "noname",
    "created": "2024-10-22T18:19:07.632Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "subscriptions",
                    "key": "id"
                },
                "field": "subscription_id",
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "subscriptions",
                    "key": "id"
                },
                "field": "subscription_id",
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "subscriptions",
                    "key": "id"
                },
                "field": "subscription_id",
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "subscriptions",
                    "key": "id"
                },
                "field": "subscription_id",
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "subscriptions",
                    "key": "id"
                },
                "field": "subscription_id",
                "allowNull": true
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
