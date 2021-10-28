exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("restaurant")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("restaurant").insert([
        {
          username: "happyRestaurant",
          password: "123",
          name: "Happy restaurant",
          profile_path: "1e1532ae4fc9ae5a9c9f010f4686cd54",
          address:
            "3/F, Tai Hung Fai (Tsuen Wan) Centre, 55 Chung On Street, Tsuen Wan",
          district: "Tsuen Wan",
          phone_no: 99843206,
          opening_time: "11:00",
          closing_time: "22:00",
          description: "A vegetarian restaurant",
          seats: 40,
          delivery: true,
          code: "BIBEK",
          discount: 0.6,
        },
        {
          username: "middlesushi",
          password: "middle",
          name: "Middle sushi",
          profile_path: "test1.png",
          address: "Basement, Kam Fook Court, 5-11 Sai Yu Street, Yuen Long",
          district: "Yuen Long",
          phone_no: 94823396,
          opening_time: "12:00",
          closing_time: "22:00",
          description: "A middle-class japanese sushi restaurant",
          seats: 50,
          delivery: true,
          code: "SAMO",
          discount: 0.4,
        },
        {
          username: "problem",
          password: "trouble",
          name: "Problematic steakhouse",
          profile_path: "test2.png",
          address:
            "Shop 1, 1A, 2-8, G/F, Hing Tai Building, 45 Yan Oi Tong Circuit, Tuen Mun",
          district: "Tuen Mun",
          phone_no: 99420579,
          opening_time: "13:00",
          closing_time: "22:00",
          description: "A very problematic steak house",
          seats: 40,
          delivery: true,
          code: "COCOON2021",
          discount: 0.1,
        },
      ]);
    });
};
