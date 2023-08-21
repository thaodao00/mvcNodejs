'use strict'

const { Model } = require('sequelize');
const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    class Note extends Model {
        static associate(models) {
            Note.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE'
            });
        }
    }
    Note.init({
        id: {
            type: DataTypes.STRING(191),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => nanoid(21)
        },
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
       
        description: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        delete: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Note',
        tableName: 'note',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })
    return Note;
}