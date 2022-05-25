const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tenant extends Model {};

Landlord.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                // ensure is email
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // password length of 8 characters minimum
                len: [8]
            }
        },
        landlord_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'landlord',
                key: 'id'
            }
        },
        rental_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rental_unit',
                key: 'id'
            }
        }
    },
    {
        hooks: {
            // before create password functionality to encrypt password
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // configurations for table
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'tenant'
    }

);

module.exports = Tenant;