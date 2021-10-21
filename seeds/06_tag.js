exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("tag")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("tag").insert([
        { id: 1, tag_name: "hongKongStyle" },
        { id: 2, tag_name: "chinese" },
        { id: 3, tag_name: "taiwanese" },
        { id: 4, tag_name: "japanese" },
        { id: 5, tag_name: "korean" },
        { id: 6, tag_name: "western" },
        { id: 7, tag_name: "petFriendly" },
        { id: 8, tag_name: "liveBroadcast" },
        { id: 9, tag_name: "parking" },
      ]);
    });
};
