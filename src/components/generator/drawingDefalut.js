export default [
  {
    __config__: {
     "type":"input",  //必填，组件类型
      "key":"name",     //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='name']").val()
      "label":"输入框",  //label
      "value":"",  //默认值
      "require":false,  //是否必填
      "disableClear":false,//是否禁用清除按钮，默认false
      "readonly":false,//是否只读,默认false
      "show":true,//是否显示，默认为true,
      "formId":100
    },
  },
  // {
  //   __config__:{
  //     key:"oneDetail",
  //     mode:"simple",
  //     params:{
  //     __config__:{
  //         key:"school",
  //         label:"学校",
  //         type:"input",
  //         value:"",
  //       }
  //     },
  //     require:false,
  //     title:"1个字段",
  //     type:"detail",
  //   }
  // }
]
