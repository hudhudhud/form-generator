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
      "show":true,//是否显示，默认为true
      "rules":[ //正则规则
          {
              "regexp":"^[0-9]*$",
              "message":"年龄请输入整数"
          }
      ],
      "attributes": [  //作用于input的属性
          {
              "name": "placeholder",
              "value": "输入姓名"
          }
      ],
    },
    
    // 组件的插槽属性
    // __slot__: {
    //   prepend: '',
    //   append: ''
    // },
    // __vModel__: 'mobile',
    // placeholder: '请输入手机号',
    // style: { width: '100%' },
    // clearable: true,
    // 'prefix-icon': 'el-icon-mobile',
    // 'suffix-icon': '',
    // maxlength: 11,
    // 'show-word-limit': true,
    // readonly: false,
    // disabled: false
  }
]
