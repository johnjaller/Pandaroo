const express=require('express')
class UserRouter{
    constructor(userService)
    {
        this.userService=userService
    }
    route()
    {
        let router=express.Router()
        router.get('/',this.getBooking.bind(this))
        router.get('/order',this.getOrder.bind(this))
        router.get('/bookmark',this.getBookmark.bind(this))
        return router
    }
    async getBooking(req,res)
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
        let userOrder=await this.userService.getUserOrder(1)
        console.log(userOrder)
        return res.render("userInfo", { layout: "user" ,
    info:userInfo,
    order:userOrder
    })
    } catch (error) {
        console.log(error)
    }
    
    }
    async getBookmark(req,res)
    {
    try {
        let userInfo= await this.userService.getUserInfo(1)
        let userBookmark=await this.userService.getUserBookmark(1)
        return res.render("userInfo", { layout: "user" ,
    info:userInfo,
    bookmark:userBookmark
    })
    } catch (error) {
        console.log(error)
    }
    
    }
}

module.exports=UserRouter