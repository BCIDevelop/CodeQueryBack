'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "subscriptions", deps: []
 * addColumn "customer_id" to table "users"
 * addColumn "subscription_id" to table "users"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2024-10-22T16:41:37.152Z",
    "comment": ""
};

var migrationCommands = [{
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
        fn: "addColumn",
        params: [
            "users",
            "customer_id",
            {
                "type": Sequelize.STRING,
                "field": "customer_id",
                "unique": true,
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "subscription_id",
            {
                "type": Sequelize.INTEGER,
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
