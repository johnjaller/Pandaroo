
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('account').del()
    .then(function () {
      // Inserts seed entries
      return knex('account').insert([
        {username:'sam@gmail.com',firstname:'Sam',surname:'O Shaughnessy',password:'123',address:'43 Fa Yuen Street, Mong Kok, Kwoloon, Hong Kong',district:'Yau Tsim Mong',phone_no:99648044},
        {username:'claude.anderson@hotmail.com',firstname:'Claude',surname:'Anderson',password:'789',address:'23 Heung Sze Wui Road,Tuen Mun, New Territroies',district:'Tuen Mun',phone_no:99215814},
        {username:'bibek@yahoo.com',firstname:'Bibek',surname:'Rajbhandari',password:'456',address:'28 Kimberley Road，Tsim Sha Tsui, Hong Kong',district:'Yau Tsim Mong',phone_no:58329964},
      ]);
    });
};
