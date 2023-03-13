const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {

const GulAhmedCategories = sequelize.define('GulAhmedCategories', {
  // Model attributes are defined here
  Sale: {
    type: Sequelize.INTEGER
  },
  Unstitched: {
    type: Sequelize.INTEGER

  },
  Women : {
    type: Sequelize.INTEGER

  },
  Men : {
    type: Sequelize.INTEGER

  },
  IdeasHome : {
    type: Sequelize.INTEGER

  },
  Shoes : {
  },
  Bags : {
    type: Sequelize.INTEGER

  },
  Kids : {
    type: Sequelize.INTEGER

  },
  Fragrances : {
    type: Sequelize.INTEGER

  }

}, 



{
  // Other model options go here
});

// `sequelize.define` also returns the model
console.log(GulAhmedCategories === sequelize.models.GulAhmedCategories); // true

return GulAhmedCategories
};