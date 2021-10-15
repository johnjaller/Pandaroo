require('dotenv').config()
const stripe=require('stripe')(process.env.stripe_secret)

async function stripePayment (req,res)
{
    const testCoupon = await stripe.coupons.create({
        percent_off: 25.5,
        duration: 'repeating',
        duration_in_months: 3,
      });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'hkd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },{
              price_data: {
                currency: 'hkd',
                product_data: {
                  name: 'noodles',
                },
                unit_amount: 4000,
              },
              quantity: 1,
            },
        ],
        discounts: [{
            coupon: testCoupon.id,
          }],
        mode: 'payment',
        success_url: 'https://localhost:8080/success',
        cancel_url: 'https://localhost:8080/cancel',
      });
    
      res.redirect(303, session.url);
}

module.exports=stripePayment