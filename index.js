// API資訊
const api_path ='shao';
const token = 'rZ8VjGbKD7QPep6jCc3swzUZsp83';

//變數
const productWrap = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');
const shoppingCartTable = document.querySelector('.shoppingCart-table');
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
const orderInfoInput = document.querySelectorAll('.orderInfo-input'); 
const orderInfoMessage = document.querySelectorAll('.orderInfo-message'); 


//產品列表初始化
function init(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
.then(function(response){
   const productsData = response.data.products;
    console.log(productsData);
    let str = '';
    productsData.forEach(function(item){
      str = str + `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="${item.title}">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
    })
    productWrap.innerHTML = str;

    addToCart(productsData);
}).catch(function(error){
    console.log(error.response.data);
    console.log('取得產品列表失敗');
}).finally(function(){
    console.log('取得產品列表執行完畢');
})
  
};
init();

//當被更改時執行篩選
productSelect.addEventListener('change',function(e){
  let categoryTarget = e.target.value;
   category(categoryTarget);
})

//產品列表篩選
function category(categoryTarget){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
        const productsData = response.data.products;
        const productsBeChoose = [];
        let str = '';
        productsData.forEach(function(item){
            if( item.category === categoryTarget){
                productsBeChoose.push(item);
                str = str + `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="${item.title}">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
                </li>`
            }
            else if(categoryTarget === '全部'){
                productsBeChoose.push(item);
                str = str + `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="${item.title}">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
                </li>`
            }
        });
        productWrap.innerHTML = str;
        addToCart(productsBeChoose);
    })
    .catch(function(error){
        console.log(error.response.data);
        console.log('篩選產品列表失敗');
    })
    .finally(function(){
        console.log('篩選產品列表執行完畢');
    });
};

//購物車列表初始化
function cartInit(){
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
.then(function(response){

    console.log(response.data)
    const cartTotal = response.data.finalTotal;
    const cartProductList = response.data.carts;
    
    if(cartTotal === 0){
      shoppingCartTable.innerHTML = '購物車還沒有商品唷，請努力消費';
    }
    else{
      let tableHeader = `<tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                </tr>`;
      let tableContent = ``;
      let tableFooter = `<tr>
                    <td>
                        <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>總金額</p>
                    </td>
                    <td>NT$${cartTotal}</td>
                </tr>`;
      cartProductList.forEach(function(item){
        tableContent = tableContent + `<tr>
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                    <td>NT$${item.product.price}</td>
                    <td>${item.quantity}</td>
                    <td>NT$${item.quantity*item.product.price}</td>
                    <td class="discardBtn">
                        <a href="#" class="material-icons">
                            clear
                        </a>
                    </td>
                </tr>`;
      });
      shoppingCartTable.innerHTML = tableHeader + tableContent + tableFooter;
      
      countDeleteTarget(cartProductList);
      clearCart();
    }
}).catch(function(error){
    console.log(error.response.data);
    console.log('取得購物車列表失敗');
}).finally(function(){
    console.log('取得購物車列表執行完畢');
})
}
cartInit();

//加入購物車
function addToCart(productsData){
  //綁定監聽
  const addCardBtn = document.querySelectorAll('.addCardBtn');
  addCardBtn.forEach(function(item,index){
    item.addEventListener('click',function(e){
      e.preventDefault();
      let productId = productsData[index].id;
      let productNum = 0;
      axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
.then(function(response){
    const cartProductList = response.data.carts;
        cartProductList.forEach(function(item,index){
        if(item.product.id === productId){
          productNum = item.quantity;
        }  
        });
        
        addProductToCart(productId,productNum);
        
}).catch(function(error){
    console.log(error.response.data);
    console.log('getProduct失敗');
}).finally(function(){
    console.log('getProduct執行完畢');
});
      
    })
  });
  
};
function addProductToCart(productId,productNum){
  const addProductData = {
      productId: productId,//產品ID
      quantity: productNum+1 //注意這邊的數字會是原始數值+新增數值
    };
      
      axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    data: addProductData
  })
.then(function(response){
    console.log(response.data);
    cartInit();
    alert('已加入購物車');
}).catch(function(error){
    console.log(error.response.data);
    console.log('加入購物車失敗');
}).finally(function(){
    console.log('加入購物車執行完畢');
})
}

//刪除特定產品
function countDeleteTarget(cartProductList){
  const discardBtn = document.querySelectorAll('.discardBtn');
  discardBtn.forEach(function(item,index){
    item.addEventListener('click',function(e){
        e.preventDefault();
        let deleteCart = cartProductList[index].id;
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${deleteCart}`)
        .then(function(response){
            console.log(response.data);
            cartInit();
        }).catch(function(error){
            console.log(error.response.data);
            console.log('刪除購物車內特定產品失敗');
        }).finally(function(){
            console.log('刪除購物車內特定產品執行完畢');
        })
    })
  })
}

// 清除購物車
function clearCart(){
    const discardAllBtn = document.querySelector('.discardAllBtn');
    discardAllBtn.addEventListener('click',function(e){
        e.preventDefault();
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(function(response){
            console.log(response.data);
            cartInit();
        }).catch(function(error){
            console.log(error.response.data);
            console.log('清空購物車失敗');
        }).finally(function(){
            console.log('清空購物車執行完畢');
        })
    })
}

// 送出訂單
function sendOrder(){
    orderInfoBtn.addEventListener('click',function(e){
        e.preventDefault();
        
        if(isEmpty() === false){
            let orderInfo = {
                name: customerName.value,
                tel: customerPhone.value,
                email: customerEmail.value,
                address: customerAddress.value,
                payment: tradeWay.value
              }
        
              console.log(orderInfo);
              sendOrderAPI(orderInfo);
        }

        customerName.value = '';
        customerPhone.value = '';
        customerEmail.value = '';
        customerAddress.value = '';
        tradeWay.value = '';
        
    })

}

sendOrder();

// 判斷有沒有空格沒有填
function isEmpty(){

    let empty = false;

    orderInfoInput.forEach(function(item,index){
        if (item.value === ''){
            empty = true;
            orderInfoMessage[index].classList.add('show');
            orderInfoMessage[index].classList.remove('noShow');
        }else{
            orderInfoMessage[index].classList.add('noShow');
            orderInfoMessage[index].classList.remove('show');
        }
    })

    return empty;
}

// 執行送出訂單API
function sendOrderAPI(orderInfo){
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
            "data": {
              "user": orderInfo
            }
    })
    .then(function(response){
        console.log(response.data);
        cartInit();
    })
    .catch(function(error){
        console.log(error.response.data);
        console.log('送出訂單失敗');
    })
    .finally(function(){
        console.log('送出訂單執行完畢');
    });
}

// API
// 取得產品列表API
// axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
// .then(function(response){
//     console.log(response.data.products);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('取得產品列表失敗');
// }).finally(function(){
//     console.log('取得產品列表執行完畢');
// })

// 取得購物車列表API
// axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('取得購物車列表失敗');
// }).finally(function(){
//     console.log('取得購物車列表執行完畢');
// })

// 加入購物車API
// axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
//     data: {
//       productId: 'GUaIzZSxF905B3HnnPB6',//產品ID
//       quantity: 5 //注意這邊的數字會是原始數值+新增數值
//     }
//   })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('加入購物車失敗');
// }).finally(function(){
//     console.log('加入購物車執行完畢');
// })

// 編輯購物車產品數量API
// axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
//     "data": {
//       "id": "3lTKHeA6JdOZZd8xYshE", //購物車ID
//       "quantity": 6
//     }
//   })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('編輯購物車失敗');
// }).finally(function(){
//     console.log('編輯購物車執行完畢');
// })

// 刪除購物車內特定產品API
// let deleteCart = 'gjV1cEJq58GJD9vOfUw5'; //購物車ID
// axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${deleteCart}`)
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('刪除購物車內特定產品失敗');
// }).finally(function(){
//     console.log('刪除購物車內特定產品執行完畢');
// })

// 清除購物車內全部產品API
// axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('清空購物車失敗');
// }).finally(function(){
//     console.log('清空購物車執行完畢');
// })

// // 送出訂單API
// axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
//     "data": {
//       "user": {
//         "name": "六角學院",
//         "tel": "07-5313506",
//         "email": "hexschool@hexschool.com",
//         "address": "高雄市六角學院路",
//         "payment": "Apple Pay"
//       }
//     }
//   })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('送出訂單失敗');
// }).finally(function(){
//     console.log('送出訂單執行完畢');
// })

// 取得訂單列表API
// axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
//     {
//     headers: {
//       'Authorization': token
//     }
//   })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('取得訂單列表失敗');
// }).finally(function(){
//     console.log('取得訂單列表執行完畢');
// })

// 修改訂單狀態API
// let orderID = 'ticHEN6D0JZCaKMxLgqP';//訂單ID
// axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
//     {
//         data: {
//           id: orderID,
//           paid: true
//         }
//       },{
//     headers: {
//       'Authorization': token
//     }}
    
// )
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('修改訂單狀態失敗');
// }).finally(function(){
//     console.log('修改訂單狀態執行完畢');
// })

// 刪除特定訂單API
// let deleteOrderID = 'ticHEN6D0JZCaKMxLgqP';//訂單ID
// axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${deleteOrderID}`,{
//     headers:{
//         'Authorization': token
//     }
// })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('刪除特定訂單失敗');
// }).finally(function(){
//     console.log('刪除特定訂單執行完畢');
// })

// 刪除全部訂單API
// axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
//     headers:{
//         'Authorization': token
//     }
// })
// .then(function(response){
//     console.log(response.data);
// }).catch(function(error){
//     console.log(error.response.data);
//     console.log('刪除全部訂單失敗');
// }).finally(function(){
//     console.log('刪除全部訂單執行完畢');
// })