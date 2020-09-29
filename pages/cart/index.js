// pages/cart/index.js
import { getSetting, chooseAddress, openSetting,showModal,showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    address:[],
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address=wx.getStorageSync('address');
    const cart=wx.getStorageSync('cart')||[];
    // const allChecked=cart.length?cart.every(v=>v.checked):false
    this.setData({
      address
    })
    this.setCart(cart);
    
  },
  async handleChooseAddress() {
    // //1.获取 权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     //2.获取权限状态
    //     const scopeAddress= result.authSetting['scope.address']
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         }
    //       });
    //     }else{
    //       //用户曾经拒绝过授予权限 先诱导用户重新打开授权页面
    //       wx.openSetting({
    //         success: (result2) => {
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             }
    //           });
    //         }
    //       });
            
    //     }
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
   try {
    const res1= await getSetting()
    const scopeAddress= res1.authSetting['scope.address']
    if(scopeAddress===false){
      await openSetting()
    }
    let address=await chooseAddress()
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
    wx.setStorageSync('address', address);
      
   } catch (error) {
     console.log(error)
   }
  },
  handleItemChange(e){
    const goods_id=e.currentTarget.dataset.id
    let {cart} =this.data
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    cart[index].checked=!cart[index].checked

    this.setCart(cart);
  },
  handleItemAllChange(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked)
    this.setCart(cart)
  },
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id)
    if(cart[index].num==1&&operation===-1){
      
      const res = await showModal({content:"您是否要删除该商品？"})
      if(res.confirm){
        cart.splice(index,1)
        this.setCart(cart)
      }
    }else{
      cart[index].num+=operation
    this.setCart(cart)
    }
    
  },
  async handlePay(){
    const { address,totalNum}=this.data
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return ;
    }
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"})
      return ;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  },
  setCart(cart){
    let allChecked=true
    let totalPrice=0
    let totalNum=0
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false
      }
    })
    allChecked=cart.length!=0?allChecked:false
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);

  }  

})