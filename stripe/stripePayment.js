require('dotenv').config()
const stripe=require('stripe')(process.env.stripe_secret)
async function stripePayment (req,res)
{
  console.log(req.body)
  let userItem=JSON.parse(req.body.order)
  let discount=JSON.parse(req.body.discount)
  console.log(userItem)
  console.log(discount)
    const testCoupon = await stripe.coupons.create(discount);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: userItem,
        discounts: [{
            coupon: testCoupon.id,
          }],
        mode: 'payment',
        success_url: 'https://localhost:8080/success',
        cancel_url: 'https://localhost:8080/cancel',
        locale:'en'
      });
      res.redirect(303, session.url);

}

module.exports=stripePayment