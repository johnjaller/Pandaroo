let shoppingCart = {};
let requestId;
//shoppingCart setup
$(document).ready(function () {
    let ratingArr=$('.rating')
    console.log(ratingArr.length)
    for(let i=0;i<ratingArr.length;i++)
    {
        let rating=$('.rating').eq(i).html()
        console.log(rating)
        switch(rating)
        {
        case '1'||1:
        $('.rating').eq(i).html('')
        console.log( $('.rating').eq(i).html())
      $('.rating').eq(i).append('<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>');
        break
        case '2'||2:
        $('.rating').eq(i).html('')
        $('.rating').eq(i).append('<i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star">');
        break
        case '3'||3:
        $('.rating').eq(i).html('')
        $('.rating').eq(i).append(`<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star"><i class="far fa-star">`);
        break
        case '4'||4:
        $('.rating').eq(i).html('')
        $('.rating').eq(i).html(`<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="far fa-star">`);
        break
        case '5'||5:
        $('.rating').eq(i).html('')
        $('.rating').eq(i).html(`<i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star"><i class="fas fa-star">`);
        break;
        default:
            $('.rating').eq(i).html('')
            $('.rating').eq(i).html(`<i class="far fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star"><i class="far fa-star">`);
        break
        }
    }

    if (window.location.pathname.includes("/order/")) {
  
      if (!localStorage.hasOwnProperty("shoppingCart")) {
        localStorage.setItem("shoppingCart", "");
        shoppingCart = {};
      } else {
        shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
      }
      console.log(shoppingCart);
      requestId = window.location.pathname.replace(/[^\d]/g, "");
  
    console.log(requestId)
    if(shoppingCart.hasOwnProperty(requestId))
    {
      console.log(shoppingCart[requestId])
      shoppingCart[requestId].item.forEach(item=>{
        $('.orderList').append(`<tr class="dish text-center"><td>${item.name}</td><td>${item.amount}</td><td>HKD ${item.price}</td></tr>`)
      })
        let price
        if(Object.keys(shoppingCart[requestId].discount).length>0)
        {
          let coupon= shoppingCart[requestId].discount
          let discount=coupon.percent_off*100
    $('.discountList').append(`<tr class="dish text-center"><td>Discount: '${coupon.discountCode}'</td><td></td><td>-${discount}%</td></tr>`)
    $('#discountCode').prop('disabled','disabled')
    $('.couponCheck').addClass('disabled')
    price=Number((price*(1-shoppingCart[requestId].discount.percent_off)).toFixed(1))
  }else{
    price=shoppingCart[requestId].item.map(i=>i.price*i.amount).reduce((a,b)=>a+b)
  }
        $('.totalPrice').html(`HKD ${price}`)
  }
      
      else {
      return false;
    }
  
  }else if(window.location.pathname.includes('/success/'))
  {
    let deleteId=window.location.pathname.replace(/[^\d]/g,'')
    delete shoppingCart[deleteId]
  localStorage.setItem('shoppingCart',JSON.stringify(shoppingCart))
  }
  else if(window.location.pathname.includes('/user/'))
  {
      console.log(($('.orderStatus').html()))
    if($('.orderStatus').html()==='Preparing')
    {
        $('.orderStatus').attr('style','background:green !important')
    }
  }
  else{
    return false;
  }
  });

//Add to cart
$(".addToCart").on("click", (event) => {
    console.log($(event.target).parent().find(".item-name").html());
    let dishAmount;
    let dishPrice;
    let dishName;
    let dishMenuId;
    dishName = $(event.target).parent().find(".item-name").html();
    if (shoppingCart.hasOwnProperty(requestId)) {
      let cart = shoppingCart[requestId].item;
      console.log(dishName);
      let cartItemList = cart.map((item) => item.name);
      if (cartItemList.includes(dishName)) {
        dishPrice = cart[cartItemList.indexOf(dishName)].price;
        console.log(shoppingCart);
        cart[cartItemList.indexOf(dishName)].amount++;
        dishAmount = cart[cartItemList.indexOf(dishName)].amount;
        let item = $(".orderList")
          .find("tr")
          .find(`td:contains(${dishName})`)
          .parent();
        $(item).html(
          `<td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td>`
        );
      } else {
        dishAmount = 1;
        dishPrice = Number(
          $(event.target).parent().find(".item-price").html().replace("HKD ", "")
        );
        console.log(dishPrice);
        dishMenuId = Number(
          $(event.target).parent().find(".item-name").attr("id")
        );
        console.log(dishMenuId);
        let dishItem = {
          name: dishName,
          price: dishPrice,
          amount: dishAmount,
          menuId: dishMenuId,
        };
        cart.push(dishItem);
        $(".orderList").append(
          `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td></tr>`
        );
      }
    } else {
      shoppingCart[requestId] = { item: [], specialRequest: "", discount: {} };
      let cart = shoppingCart[requestId].item;
      dishAmount = 1;
      dishPrice = Number(
        $(event.target).parent().find(".item-price").html().replace("HKD ", "")
      );
      console.log(dishPrice);
      dishMenuId = Number($(event.target).parent().find(".item-name").attr("id"));
      let dishItem = {
        name: dishName,
        price: dishPrice,
        amount: dishAmount,
        menuId: dishMenuId,
      };
      cart.push(dishItem);
      $(".orderList").append(
        `<tr class="dish text-center"><td>${dishName}</td><td>${dishAmount}</td><td>HKD ${dishPrice}</td></tr>`
      );
    }
    console.log(dishPrice);
    let price = shoppingCart[requestId].item
      .map((i) => i.price * i.amount)
      .reduce((a, b) => a + b);
    if (Object.keys(shoppingCart[requestId].discount).length > 0) {
      price = Number(
        (price * (1 - shoppingCart[requestId].discount.percent_off)).toFixed(1)
      );
    }
    $(".totalPrice").html(`HKD ${price}`);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  });
  $('#userOrderForm').submit(function () { 
    let request=$('.specialRequest').val()
    shoppingCart[requestId]['specialRequest']=request
    localStorage.setItem('shoppingCart',JSON.stringify(shoppingCart))
    order=[]
    console.log('running checkout')
    
    shoppingCart[requestId].item.forEach(dish=>order.push({
      price_data: {
        currency: 'hkd',
        product_data: {
          name: dish.name,
          metadata:{menu_id:dish.menuId},
        },
        unit_amount: dish.price*100,
      },
      quantity: dish.amount,
    }))
    $('.userRest').val(requestId)
    console.log(  $('.userRest').val())
    $('.userOrder').val(JSON.stringify(order))
    if(Object.keys(shoppingCart[requestId].discount).length>0)
    {
    let discount=shoppingCart[requestId].discount.percent_off*100
    $('#discount').val(JSON.stringify({name:shoppingCart[requestId].discount.discountCode,percent_off:discount}))
    }else{
      $('#discount').val(JSON.stringify({}))
    }
    return true
  });
  
  $(".couponCheck").on("click", function (event) {
    let couponCode = $("#discountCode").val();
    $("#discountCode").val("");
    console.log(couponCode);
    $.ajax({
      type: "post",
      url: "/discount",
      data: { code: couponCode },
      dataType: "json",
      success: function (response) {
        console.log(response)
        if(response.percent_off===null)
        {
          return alert(`There is no such coupon for "${couponCode}"`)
        }else{
    $('#discountCode').prop('disabled','disabled')
    $(event.target).addClass('disabled')
          let discount=response.percent_off*100
          shoppingCart[requestId].discount=response
          $('.discountList').append(`<tr class="dish text-center"><td>Discount: '${couponCode}'</td><td></td><td>-${discount}%</td></tr>`)
  let price=shoppingCart[requestId].item.map(i=>i.price*i.amount).reduce((a,b)=>a+b)
  price=Number((price*(1-shoppingCart[requestId].discount.percent_off)).toFixed(1))
  
          $(".totalPrice").html(`HKD ${price}`);
  
          localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        }
      },
    });
  });
  $(".userLogout").on("click", function () {
    localStorage.clear();
  });
//Add to Bookmark
  $('.bookmark').on('click',(event)=>{
    let restId=$(event.target).parent().attr('id')
    let icon=$(event.target)
    if(icon.hasClass('far'))
    {
    icon.toggleClass('far fas')
    console.log(restId)
    $.ajax({
      type: "post",
      url: `/bookmark/${restId}`,
      success: function (response) {
        console.log(response)
        
      }
    });
  }else{
    icon.toggleClass('fas far')
    console.log(restId)
    $.ajax({
      type: "delete",
      url: `/bookmark/${restId}`,
      success: function (response) {
        console.log(response)
        
      }
    });
  }
  })
//Cancel order
$('.userCancelOrder').on('click', (event)=> {
    let cancelId=$(event.target).parents().closest('.userOrder').attr('id')
    $('.confirmCancelOrder').attr('id', cancelId);
});
$('.confirmCancelOrder').on('click', (event)=> {
    let canelId=$(event.target).attr('id')
    $(event.target).removeAttr('id');
    console.log(canelId)
    $.ajax({
        type: "DELETE",
        url: "/userOrder/"+canelId,
        success: function (response) {
            console.log(response)
            if(response==='success')
            {
                $(`.userOrder#${canelId}`).remove();
            }
        }
    });
});
//cancel booking

//unbookmark
$('.unbookmark').on('click', function (e) {
    let unbookmarkId=$(e.target).parents().closest('.userBookmark').attr('id')
   console.log(unbookmarkId) 
    $.ajax({
        type: "DELETE",
        url: "/bookmark/"+unbookmarkId,
        success: function (response) {
            if(response==='success')
            {
                $(`.userBookmark#${unbookmarkId}`).remove();
            }
        }
    });
});