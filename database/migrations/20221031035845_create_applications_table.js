const {
    timestamps,
    onUpdateTrigger,
} = require('../utility/utility');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    const migration = await knex.schema.createTable(
        'applications',
        function (table) {
          table.bigIncrements('id');
          table.string('uuid');
          table.integer('user_id').index();
          table.integer('job_id').index();
          timestamps(knex, table);
        },
      );
      await knex.raw(onUpdateTrigger('applications'));
      return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('applications');
};
