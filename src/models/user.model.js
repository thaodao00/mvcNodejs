'use strict'

const { Model } = require('sequelize');
const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        }
    }
    User.init({
        id: {
            type: DataTypes.STRING(191),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => nanoid(21)
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: "1: User, 2: Admin"
        },
        name: {
            type: DataTypes.STRING(191),
        },
        email: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false,

        },
        secretKey: {
            type: DataTypes.STRING(191),
            allowNull: true,
            defaultValue: () => nanoid(31)
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
    return User;
}