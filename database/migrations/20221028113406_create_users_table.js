const {
    timestamps,
    onUpdateTrigger,
    ON_UPDATE_TIMESTAMP_FUNCTION,
} = require('../utility/utility');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
    await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);
    const migration = await knex.schema.createTable(
        'users',
        function (table) {
          table.bigIncrements('id');
          table.string('uuid');
          table.integer('role');
          table.string('email_id');
          table.string('password');
          table.string('first_name');
          table.string('last_name');
          table.string('phone_number');
          table.boolean('is_active');
          timestamps(knex, table);
        },
      );
      await knex.raw(onUpdateTrigger('users'));
      return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return knex.schema.dropTableIfExists('users');
};
