class UserService{
    constructor(knex)
    {
        this.knex=knex
    }
    getUser(user)
    {
        return this.knex.select('*').from('account').where('username',user)
    }
}
module.exports=UserService