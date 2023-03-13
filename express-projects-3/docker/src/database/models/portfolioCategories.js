import { DataTypes } from '@sequelize/core';
import { Sequelize } from '@sequelize';

const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {

const PortfolioCategories = sequelize.define('PortfolioCategories', {
  // Model attributes are defined here
  CategoryName: {
    type: DataTypes.STRING
  },
},

{
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(PortfolioCategories === sequelize.models.PortfolioCategories); // true

return PortfolioCategories
};