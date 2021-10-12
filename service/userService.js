class UserService{
    constructor(knex)
    {
        this.knex=knex
    }
    getUserInfo(userId)
    {
        return this.knex.select('firstname','surname','username','address','phone_no').from('account').where('id',userId)
    }
    getUserBooking(userId)
    {
        return this.knex('booking').join('account','account_id','account.id').join('restaurant','rest_id','restaurant.id').select('restaurant.name','restaurant.address','booking.id','no_of_ppl','booking_date','booking_time','booking_status').where({account_id:userId})
    }
    getUserOrder(userId)
    {
        return this.knex('delivery').join('account','account_id','account.id').join('restaurant','rest_id','restaurant.id').select('restaurant.name','restaurant.address').where({account_id:userId})
    }
    getUserBookmark(userId)
    {
        return this.knex('bookmark').join('account','account_id','account.id').join('restaurant','rest_id','restaurant.id').select('restaurant.name','restaurant.address','opening_time','closing_time').where({account_id:userId})
    }
}
module.exports=UserService

