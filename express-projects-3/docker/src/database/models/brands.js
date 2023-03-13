import { DataTypes } from '@sequelize/core';
import { Sequelize } from '@sequelize';
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {

const Brands = sequelize.define('Brands', {
  // Model attributes are defined here
  BrandName: {
    type: DataTypes.STRING
  },
  locationByGlobe: {
    type: DataTypes.STRING
  }
},

{
  // Other model options go here
});
Brands.hasMany(PortfolioCategories, {
  as : "categories"
});


// `sequelize.define` also returns the model
console.log(Brands === sequelize.models.Brands); // true

return Brands
};