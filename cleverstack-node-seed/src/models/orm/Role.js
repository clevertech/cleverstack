module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [ 2, 32 ]
            }
        },
        description : {
            type: DataTypes.STRING,
            allowNull : true
        }
    },
    {
        paranoid: true
    });
};
