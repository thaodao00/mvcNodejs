'use strict';
const { nanoid } = require('nanoid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('user', [
      {
        id: nanoid(21),
        role: 2,
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        active: 1,
        delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: nanoid(21),
        role: 1,
        name: 'User 1',
        email: 'user1@example.com',
        password: 'user123',
        active: 1,
        delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Thêm dữ liệu mẫu khác nếu cần
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user', null, {})
  }
};
