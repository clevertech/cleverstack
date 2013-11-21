module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Account", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                len: [ 2, 50 ]
            }
        },
        subdomain: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [ 3, 16 ]
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        logo : {
            type: DataTypes.STRING,
            allowNull: true
        },
        themeColor : {
            type: DataTypes.STRING,
            allowNull: true
        },
        email : {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        emailFwd : {
            type: DataTypes.STRING,
            allowNull: true
        },
        info: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        instanceMethods: {
            toJSON: function () {
                var values = this.values;
                delete values.createdAt;
                delete values.updatedAt;
                return values;
            }
        }
    });
};
