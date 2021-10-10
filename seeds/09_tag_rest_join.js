exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tag_rest_join")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tag_rest_join").insert([
        { rest_id: 1, tag_id: 1 },
        { rest_id: 2, tag_id: 3 },
        { rest_id: 3, tag_id: 2 },
      ]);
    });
};
