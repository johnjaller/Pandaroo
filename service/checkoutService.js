class CheckoutService{
    constructor(knex) {
        this.knex=knex
    }
    getMenuId(requestItem)
   {
    return this.knex('menu').select('id').where('item',requestItem)
   }
   insertDelivery(restId,userId,orderStatus,specialRequest,totalAmount)
   {
    return this.knex('delivery').insert({rest_id:restId,account_id:userId,order_status:orderStatus,special_request:specialRequest,total_amount:totalAmount}).returning('id')
   }
   insertOrderDetail(deliveryId,menuId,quantity)
   {
    return this.knex('order_detail').insert({delivery_id:deliveryId,menu_id:menuId,quantity:quantity})
   }
    
}

module.exports=CheckoutService
