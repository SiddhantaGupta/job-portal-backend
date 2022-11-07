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
        'resumes',
        function (table) {
          table.bigIncrements('id');
          table.integer('user_id');
          table.integer('experience_duration');
          table.string('field_of_work');
          table.string('skills');
          timestamps(knex, table);
        },
      );
      await knex.raw(onUpdateTrigger('resumes'));
      return migration;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('resumes');
};
