module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        confirmed : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        active : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        hasAdminRight : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        accessedAt : {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        paranoid: true
    });
};
