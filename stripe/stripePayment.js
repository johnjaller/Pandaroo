require('dotenv').config()
const stripe=require('stripe')(process.env.stripe_secret)
async function stripePayment (req,res)
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
        success_url: `https://shermanw.me/success/${req.body.restaurant}`,
        cancel_url: `https://shermanw.me/order/${req.body.restaurant}`,
        locale:'en'
      });
      res.redirect(303, session.url);

}

module.exports = stripePayment;
