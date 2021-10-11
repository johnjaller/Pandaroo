const express=require('express')
class UserRouter{
    constructor(userService)
    {
        this.userService=userService
    }
    route()
    {
        let router=express.Router()
        router.get('/',this.get.bind(this))
        router.get('/order',this.getOrder.bind(this))
        return router
    }
    async get(req,res)
    {
    try {
        let userInfo= await this.userService.getUserInfo(1)
        let userBooking=await this.userService.getUserBooking(1)
        console.log(userBooking)
        let date=userBooking[0].booking_date.toDateString()
        userBooking[0].booking_date=date
        return res.render("userInfo", { layout: "user" ,
    info:userInfo,
    booking:userBooking
    })
    } catch (error) {
        console.log(error)
    }
    
    }
    async getOrder(req,res)
    {
    try {
        let userInfo= await this.userService.getUserInfo(1)
        let userBooking=await this.userService.getUserBooking(1)
        console.log(userBooking)
        let date=userBooking[0].booking_date.toDateString()
        userBooking[0].booking_date=date
        return res.render("userInfo", { layout: "user" ,
    info:userInfo,
    booking:userBooking
    })
    } catch (error) {
        console.log(error)
    }
    
    }
}

module.exports=UserRouter