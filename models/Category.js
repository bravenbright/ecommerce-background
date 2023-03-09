const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
   {
    id: {
       type: DataType.INTTEGER,
       allowNull: false,
       primaryKey: true,
       autoIncrement: true
    },
    catgory_name: {
       type: DataType.STRING,
       allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
