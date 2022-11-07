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
        'jobs',
        function (table) {
          table.bigIncrements('id');
          table.string('uuid');
          table.string('title');
          table.string('description');
          table.string('location');
          table.integer('employment_type');
          table.string('company_name');
          table.integer('posted_by');
          table.boolean('is_active');
          timestamps(knex, table);
        },
      );
      await knex.raw(onUpdateTrigger('jobs'));
      return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('jobs');
};
