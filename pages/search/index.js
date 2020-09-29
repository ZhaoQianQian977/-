import regeneratorRuntime from "../../lib/runtime/runtime"
import {request} from "../../request/index.js"

Page({

  data: {
    goods:[],
    isFoucs:false,
    inputValue:''
  },

  TimeId:-1,
  handleInput(e){
    const {value}=e.detail
    if(!value.trim()){
      this.setData({
        goods:[],
        isFoucs:false
      })
      return;
    }
    this.setData({
      isFoucs:true
    })
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
  },
  handleCancel(){
    this.setData({
      goods:[],
      isFoucs:false,
      inputValue:''
    })
  },
  async qsearch(query){
    const res= await request({url:"/goods/qsearch",data:{query}})
    this.setData({
      goods:res
    })
  }
})