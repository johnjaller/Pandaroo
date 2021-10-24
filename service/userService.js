class UserService {
  constructor(knex) {
    this.knex = knex;
  }
  getUserInfo(userId) {
    return this.knex
      .select(
        "firstname",
        "surname",
        "username",
        "address",
        "phone_no",
        "district"
      )
      .from("account")
      .where("id", userId);
  }

  async getUserBooking(userId) {
    let booking=await this.knex("booking")
      .join("account", "account_id", "account.id")
      .join("restaurant", "rest_id", "restaurant.id")
      .select(
        "restaurant.name",'restaurant.profile_path',
        "restaurant.address",'booking.rest_id',
        "booking.id",
        "no_of_ppl",
        "booking_date",
        "booking_time",
        "booking_status","special_request"
      )
      .where({ account_id: userId });
      for(let i=0;i<booking.length;i++)
      {
        let bookingId=booking[i].id
        let restId=booking[i].rest_id
      let rating
      rating=await this.knex('review').where('rest_id',restId).select('rating')
      if(rating.length!=0)
      {
      rating=Math.round(rating.map(item=>Number(item.rating)).reduce((a,b)=>a+b)/rating.length*2)/2
      console.log(rating)
  
      }
      else{
        rating=0
      }
      booking[i]['rating']=rating
      let bookingDetail= await this.knex('booking_detail').join('booking','booking_id','booking.id').join('menu','menu_id','menu.id').select('menu.item','booking_detail.quantity','menu.price').where('booking_id',bookingId)
      console.log(bookingDetail)
      booking[i]['booking_detail']=bookingDetail
      console.log(booking[i].booking_detail)
      }
      return booking
  }

  async getUserOrder(userId) {
    let delivery=await this.knex("delivery")
      .join("account", "account_id", "account.id")
      .join("restaurant", "rest_id", "restaurant.id")
      .select('delivery.id',"restaurant.name",'delivery.rest_id', "restaurant.address",'restaurant.profile_path','delivery.order_status','delivery.total_amount','delivery.special_request')
      .where({ account_id: userId });
      for(let i=0;i<delivery.length;i++)
      {
        let deliveryId=delivery[i].id
        let restId=delivery[i].rest_id
      let rating
      rating=await this.knex('review').where('rest_id',restId).select('rating')
      if(rating.length!=0)
      {
      rating=Math.round(rating.map(item=>Number(item.rating)).reduce((a,b)=>a+b)/rating.length*2)/2
      console.log(rating)
  
      }
      else{
        rating=0
      }
      delivery[i]['rating']=rating
      let orderDetail= await this.knex('order_detail').join('delivery','delivery_id','delivery.id').join('menu','menu_id','menu.id').select('menu.item','order_detail.quantity','menu.price').where('delivery_id',deliveryId)
      console.log(orderDetail)
      delivery[i]['order_detail']=orderDetail
      console.log(delivery[i].order_detail)
      }
      return delivery
  }

  async getUserBookmark(userId) {
    let bookmark= await this.knex("bookmark")
      .join("account", "account_id", "account.id")
      .join("restaurant", "rest_id", "restaurant.id")
      .select(
        'restaurant.id',
        "restaurant.name",'bookmark.rest_id',
        "restaurant.address",
        "opening_time",
        "closing_time",'restaurant.profile_path',
      )
      .where({ account_id: userId });
      for(let i=0;i<bookmark.length;i++)
      {
      let restId=bookmark[i].id
      let rating
      rating=await this.knex('review').where('rest_id',bookmark[i].id).select('rating')
      if(rating.length!=0)
      {
      rating=Math.round(rating.map(item=>Number(item.rating)).reduce((a,b)=>a+b)/rating.length*2)/2
      console.log(rating)
  
      }
      else{
        rating=0
      }
   
      bookmark[i]['rating']=rating
      let tagName= await this.knex('tag_rest_join').join('restaurant','tag_rest_join.rest_id','restaurant.id').join('tag','tag_rest_join.tag_id','tag.id').select('tag_name').where('rest_id',restId)
      console.log(tagName)
      tagName=tagName.map(item=>item.tag_name)
        bookmark[i]['tag_name']=tagName
      }
      return bookmark
  }

  getRestTag() {
    return this.knex("tag").select("tag_name", "id");
  }

  putUserInfo(
    userID,
    email,
    givenName,
    familyName,
    LivingAddress,
    livingDistrict,
    phone
  ) {
    console.log(typeof phone);
    return this.knex("account")
      .update({
        username: email,
        firstname: givenName,
        surname: familyName,
        address: LivingAddress,
        district: livingDistrict,
        phone_no: parseInt(phone),
      })
      .where("id", userID);
  }
}

module.exports = UserService;
