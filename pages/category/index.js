// pages/category/index.js
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
/**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList:[],
    //右侧商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    scrollTop:0
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates=wx.getStorageSync("cates");
    if(!Cates){
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*10){
      this.getCates();
      }else{
        this.Cates=Cates.data;
          let leftMenuList=this.Cates.map(v=>v.cat_name)
          let rightContent=this.Cates[0].children
          this.setData({
            leftMenuList,
            rightContent
        })
      }
    }
      
  },
  //获取分类数据
  async getCates(){
  
    const result=await request({url:"/categories"})
      this.Cates=result;
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
      //构造左侧的大菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name)
      
      //构造右侧的商品数据
      let rightContent=this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    // console.log(e)
    const { index }=e.currentTarget.dataset
    
    let rightContent=this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})