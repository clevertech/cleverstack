module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Permission", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [ 2, 50 ]
            }
        }
    },
    {
        paranoid: true
    });
};
