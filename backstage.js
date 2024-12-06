// API資訊
const api_path ='shao';
const token = 'rZ8VjGbKD7QPep6jCc3swzUZsp83';

//變數
const orderPageTable = document.querySelector('.orderPage-table');
const discardAllBtn = document.querySelector('.discardAllBtn');

// 訂單列表初始化
function init(){
    getOrderList();
}

init();

// 取得訂單列表API
function getOrderList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
        headers: {
          'Authorization': token
        }
      })
    .then(function(response){
        const orderList = response.data.orders;
        console.log(orderList);
        insertOrderHTML(orderList);
        resetC3(orderList);
        changePaid(orderList);
        deleteTargetOrder(orderList);
    
    }).catch(function(error){
        console.log(error);
        console.log('取得訂單列表失敗');
    }).finally(function(){
        console.log('取得訂單列表執行完畢');
    })
}


//組出訂單品項
function getOrderItem(order){
    let orderProducts = order.products;
    let orderProductList = [];

    orderProducts.forEach(function(item){
        let productTitle = item.title;
        let productNum = item.quantity;

        orderProductList.push([productTitle,productNum]);
    })

    let orderItem = '';
    orderProductList.forEach(function(item,index){
        if(index === 0){
            orderItem = orderItem + `<p>${item[0]} x ${item[1]}</p>`
        }else{
            orderItem = orderItem + `<br><p>${item[0]} x ${item[1]}</p>`
        }        
    })
    
    return orderItem;
}

// 判斷訂單狀態
function getPaid(order){
    let paidStatus = '未付款';
    if(order.paid === true){
        paidStatus = '已付款';
    }

    return paidStatus;
}

// 寫入訂單資訊HTML
function insertOrderHTML(orderList){
    let tableHeader = `<thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
</thead>`;
let tableContent = ``;

orderList.forEach(function(item){
tableContent = tableContent + `<tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
        ${getOrderItem(item)}
    </td>
    <td>2021/03/08</td>
    <td class="orderStatus">
      <a href="#">${getPaid(item)}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" value="刪除">
    </td>
</tr>`
})

orderPageTable.innerHTML = tableHeader + tableContent;
}

// 計算類別數量
function countCategoryNum(orderList){
    let category = {
        '床架': 0,
        '收納': 0,
        '窗簾': 0,
        '其他': 0
    }
    orderList.forEach(function(item){
        orderProducts = item.products;
        orderProducts.forEach(function(item){
            if(item.category === '床架'){
                category['床架'] = category['床架'] + item.quantity;
            }else if (item.category === '收納'){
                category['收納'] = category['收納'] + item.quantity;
            }else if (item.category === '窗簾'){
                category['窗簾'] = category['窗簾'] + item.quantity;
            }else{
                category['其他'] = category['其他'] + item.quantity;
            }
        })
    })
    console.log(category);
    return Object.entries(category);
}

// C3.js
function resetC3(orderList){
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: countCategoryNum(orderList),
            colors:{
                "床架":"#DACBFF",
                "收納":"#9D7FEA",
                "窗簾": "#5434A7",
            }
        },
    });
}

// 改變訂單狀態
function changePaid(orderList){
    const orderStatus = document.querySelectorAll('.orderStatus a');

    let changeOrder = {
        id: '',
        paid: false,
    }

    orderStatus.forEach(function(item,index){
        item.addEventListener('click',function(e){
            e.preventDefault();
            changeOrder.id = orderList[index].id;
            if(orderList[index].paid === false){
                changeOrder.paid = true;
            }else{
                changeOrder.paid = false;
            }
            changePaidAPI(changeOrder);
        })
    })
}

// 執行改變訂單狀態API
function changePaidAPI(changeOrder){
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            data: changeOrder
          },{
        headers: {
          'Authorization': token
        }}
        
    )
    .then(function(response){
        const orderList = response.data.orders;
        console.log(orderList);
        init();
    }).catch(function(error){
        console.log(error);
        console.log('修改訂單狀態失敗');
    }).finally(function(){
        console.log('修改訂單狀態執行完畢');
    })
}

// 刪除指定訂單
function deleteTargetOrder(orderList){
    const delSingleOrderBtn = document.querySelectorAll('.delSingleOrder-Btn');
    let deleteOrderID = '';
    delSingleOrderBtn.forEach(function(item,index){
        item.addEventListener('click',function(e){
            deleteOrderID = orderList[index].id;
            deleteTargetOrderAPI(deleteOrderID);
        })
    })
    
}

// 執行刪除指定訂單API
function deleteTargetOrderAPI(deleteOrderID){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${deleteOrderID}`,{
        headers:{
            'Authorization': token
        }
    })
    .then(function(response){
        console.log(response.data.orders);
        init();
    }).catch(function(error){
        console.log(error);
        console.log('刪除特定訂單失敗');
    }).finally(function(){
        console.log('刪除特定訂單執行完畢');
    })
}

// 刪除全部訂單
function deleteAllOrder(){

    discardAllBtn.addEventListener('click',function(e){
        axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
            headers:{
                'Authorization': token
            }
        })
        .then(function(response){
            console.log(response.data.orders);
            init();
        }).catch(function(error){
            console.log(error.response.data);
            console.log('刪除全部訂單失敗');
        }).finally(function(){
            console.log('刪除全部訂單執行完畢');
        })
    })
    
}

deleteAllOrder();

// 原始API
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