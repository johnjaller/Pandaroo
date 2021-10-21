exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tag")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tag").insert([
        { id: 1, tag_name: "korean" },
        { id: 2, tag_name: "japanese" },
        { id: 3, tag_name: "western" },
      ]);
    });
};
