
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('restaurant').del()
    .then(function () {
      // Inserts seed entries
      return knex('restaurant').insert([
        {name: 'Happy restaurant',username:'happyRestaurant',password:'123',phone_no:99843206},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};
