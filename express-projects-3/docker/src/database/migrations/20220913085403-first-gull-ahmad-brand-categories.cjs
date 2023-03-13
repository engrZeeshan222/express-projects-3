'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    try{
      await queryInterface.createTable('GulAhmedCategories', { 
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          },
        Sale: {
          type: Sequelize.DataTypes.INTEGER
        },
        Unstitched: {
          type: Sequelize.DataTypes.INTEGER
      
        },
        Women : {
          type: Sequelize.DataTypes.INTEGER
      
        },
        Men : {
          type: Sequelize.DataTypes.INTEGER
      
        },
        IdeasHome : {
          type: Sequelize.DataTypes.INTEGER
      
        },
        Shoes : {
          type: Sequelize.DataTypes.INTEGER

        },
        Bags : {
          type: Sequelize.DataTypes.INTEGER
      
        },
        Kids : {
          type: Sequelize.DataTypes.INTEGER
      
        },
        Fragrances : {
          type: Sequelize.DataTypes.INTEGER
      
        }
      });
      return Promise.resolve();
    }catch(error){
      return Promise.reject(error);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     try{
      await queryInterface.dropTable('GulAhmedCategories');
      return Promise.resolve();
    }catch(error){
      return Promise.reject(error);
    }
  }
};
