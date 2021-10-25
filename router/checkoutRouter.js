require('dotenv').config()
const stripe=require('stripe')(process.env.stripe_secret)
const express=require('express')
const endPointSecret='whsec_G2nJNMFVmpCn275FSbScXynzCytZxtJX'
class CheckoutRouter{
    constructor(checkoutService)
    {
        this.checkoutService=checkoutService
    }
    route() {
        let router = express.Router();
        router.post("/", this.postCheckout.bind(this));
        router.post("/webhook", this.postWebhook.bind(this));
        
        return router;
      }
      async postCheckout (req,res)
      {
        console.log(req.body)
        let userItem=JSON.parse(req.body.order)
        let discount=JSON.parse(req.body.discount)
        let userId=req.user.id
        console.log(userItem)
        console.log(discount)
        let testCoupon
        let discountItem
        if(Object.keys(discount).length!=0)
        {
          testCoupon = await stripe.coupons.create(discount);
          discountItem=[{coupon:testCoupon.id}]
        }else{
          discountItem=[]
        }
          const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: userItem,
              discounts: discountItem,
              metadata:{user_id:userId,specialRequest:req.body.specialRequest,rest_id:Number(req.body.restaurant)},
              mode: 'payment',
              success_url: `https://localhost:8080/success/${req.body.restaurant}`,
              cancel_url: `https://localhost:8080/order/${req.body.restaurant}`,
              locale:'en'
            });
            res.redirect(303, session.url);
      
      }
   async  postWebhook (req,res){
         console.log(this, 'before if statement')
         let classInstance = this
    
      let event=req.body
      if(event.type==='checkout.session.completed')
      {
        console.log(classInstance, 'after if statement')

        console.log('it is a successful payment')
        console.log(event.data.object.metadata)
        let specialRequest=event.data.object.metadata.specialRequest
        let restId=event.data.object.metadata.rest_id
        let userId=event.data.object.metadata.user_id;
        let sessionId=event.data.object.id
        let totalAmount=event.data.object.amount_total/100
        let products=[]
        stripe.checkout.sessions.listLineItems(
          sessionId,
          { limit: 10 },
          async function(err, lineItems) {
       console.log(lineItems)
       console.log(classInstance, 'tjisd')
       console.log(classInstance.checkoutService, 'before forloop')
       for(let i=0;i<lineItems.data.length;i++)
       {
        console.log(classInstance.checkoutService)
         let menuId=await classInstance.checkoutService.getMenuId(lineItems.data[i].description)
         menuId=menuId[0].id
         console.log(menuId)
         products.push({quantity:lineItems.data[i].quantity,menu_id:menuId})
    
       }
      
       console.log(products)
       classInstance.checkoutService.insertDelivery(restId,userId,'Preparing',specialRequest,totalAmount).then(async(deliveryId)=>{
        for(let i=0;i<products.length;i++)
         {
          await classInstance.checkoutService.insertOrderDetail(deliveryId[0],products[i].menu_id,products[i].quantity)
         }
       })
      
      res.status(200);
    })

      }
    
    }
    
      
}

module.exports=CheckoutRouter