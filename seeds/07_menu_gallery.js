exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("menu_gallery")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("menu_gallery").insert([
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 1 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 2 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 3 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 4 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 5 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 6 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 7 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 8 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 9 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 10 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 11 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 12 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 13 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 14 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 15 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 16 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 17 },
        { photo_path: "/menu_gallery/placeholder.png", menu_id: 18 },
      ]);
    });
};
