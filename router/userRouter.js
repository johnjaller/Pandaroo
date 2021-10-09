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
        return router
    }
    get(req,res)
    {
    return  this.userService.getUser('sam@gmail.com').then((data)=>{
        console.log(data[0])
        res.render('user',{
            info:data[0]
        })
    })
    }
}

module.exports=UserRouter