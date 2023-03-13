const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres::memory:');

const GulAhmedSale = sequelize.define('GulAhmedSale', {
  // Model attributes are defined here
  Sale: {
  },
  Unstitched: {
  },
  Women : {},
  Men : {},
  IdeasHome : {
  },
  Shoes : {
  },
  Bags : {},
  Kids : {},
  Fragrances : {}
}, 



{
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(GulAhmedSale === sequelize.models.Sale); // true