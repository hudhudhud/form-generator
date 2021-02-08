// 新建表单 表单属性【右面板】
export const formConf = {
  // formRef: 'elForm',
  // formModel: 'formData',
  // size: 'medium',
  // labelPosition: 'right',
  // labelWidth: 100,
  // formRules: 'rules',
  // gutter: 15,
  // disabled: false,
  // span: 24,
  // formBtns: true,

  init:"",//初始化时执行，如需带入员工域账号等信息需要在此操作，适合赋初始值操作,注只在表单是新增状态时执行
  editInit:"",//同init,区别是在表单是修改状态时执行
  beforeSubmit:'', //字符串函数名称或函数，提交前执行
  descHtml:"", //放在表单顶部的说明文字
  showDescPop:false, //是否显示说明弹窗，为true则进入页面时自动弹出
  // descPopSetting:{ //showDescPop为true是，弹窗的设置信息
  //     popBtnTitle:"",//关闭弹窗时，显示在界面上按钮的文字，默认为"注意事项"
  //     title:"", //弹窗标题
  //     popHeight:"",//弹窗高度，默认400
  //     //弹窗内容，支持html文本
  //     content:""
  // },
  onlySaveValue:false,
  // customerBtns:[ //自定义按钮数组
  //     // {
  //     //     "title":"测试", //按钮标题
  //     //     "type":"cancel", //按钮类型，点击按钮时提交的操作类型
  //     //     "showState":["add","edit"],//显示场景：add 新增，edit 修改
  //     //     "needValid":false,//表单是否需要校验，默认为false
  //     //     "style":"background-color:green;color:#fff" //自定义按钮样式
  //     // }        
  // ]
  showAsModule:false,
  syncToWorkFlow:true
}

// 流程审批 表单属性【右面板】
export const formFlowConf = {
  init:"",//初始化时执行，如需带入员工域账号等信息需要在此操作，适合赋初始值操作,注只在表单是新增状态时执行
  editInit:"",//同init,区别是在表单是修改状态时执行
  beforeSubmit:'', //字符串函数名称或函数，提交前执行
  descHtml:"", //放在表单顶部的说明文字
  showDescPop:false, //是否显示说明弹窗，为true则进入页面时自动弹出
  // descPopSetting:{ //showDescPop为true是，弹窗的设置信息
  //     popBtnTitle:"",//关闭弹窗时，显示在界面上按钮的文字，默认为"注意事项"
  //     title:"", //弹窗标题
  //     popHeight:"",//弹窗高度，默认400
  //     //弹窗内容，支持html文本
  //     content:""
  // },
  onlySaveValue:true,
  // 固定按钮
  "fixBtns": {
    "agree": {
        "type": "agree",
        "show": true,
        "title": "同意",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-check"
    },
    "refuse": {
        "type": "refuse",
        "show": true,
        "title": "驳回",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-close"
    },
    "transfer": {
        "type": "transfer",
        "show": true,
        "title": "转办",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-right"
    }
},
// "customerBtns": [
//   {
//       "style": "background-color:green;color:#fff",
//       "title": "测试",
//       "type": "test",
//       "clickFunc": "customerClick",
//       "icon":""
//   }
// ],
  showAsModule:true,
}


// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      "type":"input",  //必填，组件类型
      "key":"",     //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='name']").val()
      "label":"输入框",  //label
      "value":"",  //默认值
      "require":false,  //是否必填
      "disableClear":false,//是否禁用清除按钮，默认false
      "readonly":false,//是否只读,默认false
      "show":true,//是否显示，默认为true
      "callback":"",
    },
  },
  {
    // 组件的自定义配置
    __config__: {
      "type":"input",  //必填，组件类型
      "key":"",     //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='name']").val()
      "label":"数字输入框",  //label
      "value":"",  //默认值
      "require":false,  //是否必填
      "disableClear":false,//是否禁用清除按钮，默认false
      "readonly":false,//是否只读,默认false
      "show":true,//是否显示，默认为true
      "callback":"",
      "rules":[ //正则规则
          {
              "regexp":"^[0-9]*$",
              "message":"请输入数字"
          }
      ],
      "attributes": [  //作用于input的属性
          {
              "name": "placeholder",
              "value": "请输入数字"
          }
      ],
    },
  },
  {
    __config__: {
      "type": "textarea",//必填，组件类型
      "key":"",  //必填，字段名称；且为textarea元素上data-key属性值，获取值方法 $("textarea[data-key='intro']").val()
      "label":"多行文本",
      "value":"",    //默认值，非必填
      "readonly":false,
      "require":true,
      "show":true,//是否显示，默认为true
      "autoSize":true,//true,false或者{minHeight:60,maxHeight:100} 输入框高度根据输入内容自动调整
      "maxLen":"",//限制输入内容最大长度,
      "callback":""
    },
    settingAutoSize:false
  },
]

export const selectComponents = [
  {
    __config__:{
      "type":"dateTimePicker",//必填，组件类型
      "key":"",//必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='time']").val()
      "label":"时间日期选择" ,
      "pickerType":"date",// 选择类型 'date','datetime', 'time' 
      "require":true,
      "show":true,//是否显示，默认为true
      "value":"", //默认值
      "startDate":"",//限制可选开始时间
      "endDate":"",//限制可选结束时间
      "formatStr":"YYYY-MM-DD",//显示格式，date默认'YYYY-MM-DD',datetime默认'YYYY-MM-DD HH:mm',time格式'HH:mm',
      "callback":""
    }
  },
  {
    __config__:{
      "type": "radio",//必填，组件类型
      "key":"",//必填，字段名称;且为input元素上data-key属性值，获取值方法$("input[data-key='sex']:checked").val()
      "label":"单选框",
      "value":"",
      "require":true,
      "show":true,//是否显示，默认为true
      "readonly":false,//是否只读,默认false
      "options":[    //必填，值数组或对象数组
          {"value":0,"label":"男"},
          {"value":1,"label":"女"}
      ],
      "labelKey":"label",//在界面上显示的字段值，为对象数组时必填，默认label
      "valueKey":"value",//保存的字段值，为对象数组时必填，默认value
      "direction":"row", //展示方式，按行或列，row,column ，默认row
  
      //以下配置项同input，作用于radio
      "attributes": [],//如果是class或style，作用到组件最外层
      "callback":"change"
    },
    optionsType:'object',
  },
  {
    __config__:{
      "type": "checkboxGroup",//必填，组件类型
      "key":"",//必填，字段名称
      "label":"多选框",
      "value":"0,1,2",
      "require":true,
      "show":true,//是否显示，默认为true
      "readonly":false,//是否只读,默认false
      "options":[  //必填，字符串（函数名称）或数组[5,6,7,8,9]或对象数组[{"name":"张三",id:"1"}]
                  {"value":"0","name":"足球"},
                  {"value":"1","name":"篮球"},
                  {"value":"2","name":"羽毛球"},
                  {"value":"3","name":"毛球"}],
      "labelKey":"name",//在界面上显示的字段值，options为对象数组时必填，默认label
      "valueKey":"value",//保存的字段值，options为对象数组时必填，默认value，
      "direction":"column", //展示方式，按行或列，row,column 默认row
  
      //以下配置项同input，作用于checkbox
      "attributes": [],//如果是class或style，作用到组件最外层
      "events": [],
      "callback":"",
    },
    optionsType:'object',
    jsGetOptions:false
  },
  {
    __config__:{
      "type": "picker",//必填，组件类型
      "key":"",//必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='number']").val()
      "label":"下拉选择",
      "options":[1,2,3,4],//必填，字符串（函数名称）或数组[5,6,7,8,9]或对象数组[{"name":"张三","id":"1"}]
      "require":true,
      "show":true,//是否显示，默认为true
      "labelKey":"label",//在界面上显示的字段值，options为对象数组时必填
      "valueKey":"value",//保存的字段值，options为对象数组时必填
      
      //默认值,值类型，或者对象类型(显示值与保存值不一样时)，如下，原showValue属性已去掉 
      "value":1,
      // "value":{"value":1,"showValue":"one"},//默认值，包含两个属性，一个值，一个显示在界面上的值
      //以下配置项同input，作用于input,
      "callback":""
    },
    optionsType:'value',
    jsGetOptions:false,
    defaultValueType:'value'
  },
  {
    __config__:{
        "type": "cascaderselect",//必填，组件类型
        "key":"", //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='address']").val()
        "label":"级联选择",
        "require":true,
        "show":true,//是否显示，默认为true,
        "options":[    //必填,该options与其他组件不同，options里的每一项都是需要联动的信息
            //如下第一项中：
            //func为第一项数据的初始化函数，changeFunc为选择发生变化后要触发的函数，changeKey为需要触发的项的字段名称
            //其余项同上
            {"label":"省","key":"province","func":"getProvince","changeFunc":"getCity","changeKey":"city"},
            {"label":"市","key":"city","changeFunc":"getArea","changeKey":"area"},
            {"label":"区","key":"area"}],
        "value": {"value":"1,11,110","showValue":"浙江-杭州-滨江"},//默认值，包含两个属性，一个值，一个显示在界面上的值
        "labelKey":"name",  //必填，显示的字段值
        "valueKey":"id",    //必填，保存的字段值
        "showValueSplit":"-",//显示格式，默认无，如浙江-杭州-滨江
        //以下配置项同input，作用于input
        "attributes": [],//如果是class或style，作用到组件最外层
        "events": [],
        "callback":"change"
    },
    defaultValueType:'object'
  },
  {
    __config__:{
        "type": "searchSelect", //必填，组件类型
        "key":"", //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key="friends"]").val()
        "label":"搜索选择",
        "options":[   //必填，字符串（函数名称）或数组[5,6,7,8,9]或对象数组[{"name":"张三","id":"1"}]
            {"label":"1","value":"11","label1":"one","label2":"two"},
            {"label":"2","value":"22","label1":"one","label2":"two"},
            {"label":"3","value":"33","label1":"one","label2":"two"}
        ],
        
        //默认值,值类型，或者对象类型(显示值与保存值不一样时)，如下，原showValue属性已去掉
        "value":"11,22,33",//值类型
        // "value":{"value":"11,22,33","showValue":"1,2,3"}, //对象类型，包含两个属性，一个值，一个显示在界面上的值
        "labelKey":"label", //在界面上显示的字段值，options为对象数组时必填，默认label，也是在弹出的选择界面上展示的第一项信息
        "valueKey":"value", //真正保存的字段值，options为对象数组时必填，默认value，
        "labelKey1":"label1",//options为对象数组时，需要在界面上展示的第二项信息，显示多项文本
        "labelKey2":"label2",//options为对象数组时,需要在界面上展示的第三项信息，显示多项文本
        
        "showSearchInput":true,//是否显示搜索框，默认为true
        "searchPlaceHolder":"搜索关键字",//搜索框placeholder
        "searchFunc":"searchFunc",//搜索时触发的函数名称
        "chooseMutiple":true, //是否为多选
        "require":true,
        "show":true,//是否显示，默认为true,
        "pagenble":true,//是否分页
        "pageSize":"10",//分页条数，默认一页20条
    
        //以下配置项同input，作用于input
        "attributes": [],//如果是class或style，作用到组件最外层
        "events": [],
        "callback":"change"
    },
    optionsType:'object',
    jsGetOptions:false,
    defaultValueType:'value'
  },
  {
    __config__: {
        "type":"addressBook",//必填，组件类型
        "key":"",   //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='book']").val()
        "label":"通讯录选择",
        "fromDepartmentId": 0,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
        "mode":"multi",// 必填，选择模式，single表示单选，multi表示多选
        "chooseType": [],// 必填，选择限制类型，指定department、user中的一个
        // "selectedUserIds": [],// 非必填，已选用户ID(域账号)列表。用于多次选人时可重入，single模式下请勿填入多个id
        "callback":"bookChange",
        // "show":true,
        //默认值,值类型，或者对象类型(显示值与保存值不一样时)，如下，原showValue属性已去掉
        "value":"hys3032,lys8937",//值类型
        //对象类型，包含两个属性，一个值，一个显示在界面上的值
        // "value":{"value":"hys3032,lys8937","showValue":"李四 hys3032,张三 lys8937"}
        //注：value或value.value值跟企业微信返回的id值一致时，操作时才会默认勾上已选项，否则不会默认勾上
        
    },
    defaultValueType:'value'
  },
  {
    __config__: {
        "type": "deptSelect", //必填，组件类型
        "key":"", //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key="department"]").val()
        "label":"自定义部门",                           
        "require": false,
        "chooseMutiple": false, //是否为多选
        "options":"",//必填，字符串（函数名称）,
        "labelKey":"label", //非必填，默认label
        "valueKey":"value",//非必填，默认value
    
        //以下配置项同input，作用于input
        "attributes": [],//如果是class或style，作用到组件最外层
        "events": [],
        "callback":""
    }
  }
]


export const otherComponents =[
  {
    __config__: {
        "type":"label",//必填，组件类型
        "value":"",
        "key":"",      //必填，字段名称
        "label":"label显示组件" ,
        "show":true,//是否显示，默认为true,
    },
  },
  {
    __config__: {
        "type":"fileUpload",//必填，组件类型
        "key":"",      //必填，字段名称
        "label":"文件上传" ,
        "multiple":false,//是否多文件上传，默认false
        "accept":"*",//上传文件类型
        "maxNum":'',//上传最多文件个数,
        "maxSize":'',//限制文件大小kb
        "show":true,//是否显示，默认为true,
        "require":true
    },
  },
  {
    __config__:{
      "type": "checkbox",//必填，组件类型
      "key":"",//必填，字段名称
      "label":"是否开关",
      "value":false,//默认值
      "optionLabel":"是",//checkbox右侧显示的文字
      "require":true,
      "show":true,//是否显示，默认为true
      "readonly":false,//是否只读,默认false
  
      //以下配置项同input，作用于checkbox
      "attributes": [],//如果是class或style，作用到组件最外层
      "events": [],
      "callback":"change"
    }
  },
  {
    __config__:{
      "type":"hidden", //必填，组件类型
      "key":"", //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='hidden-name']").val()
      // "label":"hidden组件",
      "value":""//非必填，默认值
    },
  },
  {
    __config__:{
      "type":"html", //必填，组件类型
      "key":"", //必填，字段名称；且为input元素上data-key属性值，获取值方法$("input[data-key='hidden-name']").val()
      "label":"html备注组件",
      "value":"html备注组件",//非必填，默认值
      "show":true,
    },
  }
]

export const detailComponents =[
  {
    __config__: {
      "type":"detail",   //必填，组件类型
      "key":"", //必填，字段名称
      "title":"单个字段明细", //显示的label
      "mode":"simple",//必填，明细模式： simple:1个字段，mutiple:多个字段，pop:弹出页面,
      "params": [],
      // "defaultValue":[]
    },
    modeType:'单个字段明细',
    layout: 'rowFormItem',
    // gutter: 8,
  },
  {
    __config__: {
      "type":"detail",   //必填，组件类型
      "key":"", //必填，组件类型
      "title":"多个字段明细",
      "mode":"mutiple",// 必填，simple:1个字段，mutiple:多个字段，pop:弹出页面,
      "params":[],
      // "defaultValue":[]
    },
    modeType:'多个字段明细',
    layout: "rowFormItem",
  },
  {
    __config__: {
      "type":"detail", //必填，组件类型
      "key":"", //必填，字段名称
      "title":"复杂弹框明细",
      "mode":"pop",//必填，simple:1个字段，mutiple:多个字段，pop:弹出页面,
      "beforeSave":"beforeSave", //保存前执行该函数，返回true或false，返回true才会继续往下执行（只支持同步） 
      "params":[],
      // "defaultValue":[], 
    },
    modeType:'复杂弹框明细',
    layout: "rowFormItem",
  }
]

// // 选择型组件 【左面板】
// export const selectComponents = [
//   {
//     __config__: {
//       label: '下拉选择',
//       showLabel: true,
//       labelWidth: null,
//       tag: 'el-select',
//       tagIcon: 'select',
//       layout: 'colFormItem',
//       span: 24,
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/select'
//     },
//     __slot__: {
//       options: [{
//         label: '选项一',
//         value: 1
//       }, {
//         label: '选项二',
//         value: 2
//       }]
//     },
//     placeholder: '请选择',
//     style: { width: '100%' },
//     clearable: true,
//     disabled: false,
//     filterable: false,
//     multiple: false
//   },
//   {
//     __config__: {
//       label: '级联选择',
//       showLabel: true,
//       labelWidth: null,
//       tag: 'el-cascader',
//       tagIcon: 'cascader',
//       layout: 'colFormItem',
//       defaultValue: [],
//       dataType: 'dynamic',
//       span: 24,
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
//     },
//     options: [{
//       id: 1,
//       value: 1,
//       label: '选项1',
//       children: [{
//         id: 2,
//         value: 2,
//         label: '选项1-1'
//       }]
//     }],
//     placeholder: '请选择',
//     style: { width: '100%' },
//     props: {
//       props: {
//         multiple: false,
//         label: 'label',
//         value: 'value',
//         children: 'children'
//       }
//     },
//     'show-all-levels': true,
//     disabled: false,
//     clearable: true,
//     filterable: false,
//     separator: '/'
//   },
//   {
//     __config__: {
//       label: '单选框组',
//       labelWidth: null,
//       showLabel: true,
//       tag: 'el-radio-group',
//       tagIcon: 'radio',
//       changeTag: true,
//       defaultValue: undefined,
//       layout: 'colFormItem',
//       span: 24,
//       optionType: 'default',
//       regList: [],
//       required: true,
//       border: false,
//       document: 'https://element.eleme.cn/#/zh-CN/component/radio'
//     },
//     __slot__: {
//       options: [{
//         label: '选项一',
//         value: 1
//       }, {
//         label: '选项二',
//         value: 2
//       }]
//     },
//     style: {},
//     size: 'medium',
//     disabled: false
//   },
//   {
//     __config__: {
//       label: '多选框组',
//       tag: 'el-checkbox-group',
//       tagIcon: 'checkbox',
//       defaultValue: [],
//       span: 24,
//       showLabel: true,
//       labelWidth: null,
//       layout: 'colFormItem',
//       optionType: 'default',
//       required: true,
//       regList: [],
//       changeTag: true,
//       border: false,
//       document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
//     },
//     __slot__: {
//       options: [{
//         label: '选项一',
//         value: 1
//       }, {
//         label: '选项二',
//         value: 2
//       }]
//     },
//     style: {},
//     size: 'medium',
//     min: null,
//     max: null,
//     disabled: false
//   },
//   {
//     __config__: {
//       label: '开关',
//       tag: 'el-switch',
//       tagIcon: 'switch',
//       defaultValue: false,
//       span: 24,
//       showLabel: true,
//       labelWidth: null,
//       layout: 'colFormItem',
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/switch'
//     },
//     style: {},
//     disabled: false,
//     'active-text': '',
//     'inactive-text': '',
//     'active-color': null,
//     'inactive-color': null,
//     'active-value': true,
//     'inactive-value': false
//   },
//   {
//     __config__: {
//       label: '滑块',
//       tag: 'el-slider',
//       tagIcon: 'slider',
//       defaultValue: null,
//       span: 24,
//       showLabel: true,
//       layout: 'colFormItem',
//       labelWidth: null,
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/slider'
//     },
//     disabled: false,
//     min: 0,
//     max: 100,
//     step: 1,
//     'show-stops': false,
//     range: false
//   },
//   {
//     __config__: {
//       label: '时间选择',
//       tag: 'el-time-picker',
//       tagIcon: 'time',
//       defaultValue: null,
//       span: 24,
//       showLabel: true,
//       layout: 'colFormItem',
//       labelWidth: null,
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
//     },
//     placeholder: '请选择',
//     style: { width: '100%' },
//     disabled: false,
//     clearable: true,
//     'picker-options': {
//       selectableRange: '00:00:00-23:59:59'
//     },
//     format: 'HH:mm:ss',
//     'value-format': 'HH:mm:ss'
//   },
//   {
//     __config__: {
//       label: '时间范围',
//       tag: 'el-time-picker',
//       tagIcon: 'time-range',
//       span: 24,
//       showLabel: true,
//       labelWidth: null,
//       layout: 'colFormItem',
//       defaultValue: null,
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/time-picker'
//     },
//     style: { width: '100%' },
//     disabled: false,
//     clearable: true,
//     'is-range': true,
//     'range-separator': '至',
//     'start-placeholder': '开始时间',
//     'end-placeholder': '结束时间',
//     format: 'HH:mm:ss',
//     'value-format': 'HH:mm:ss'
//   },
//   {
//     __config__: {
//       label: '日期选择',
//       tag: 'el-date-picker',
//       tagIcon: 'date',
//       defaultValue: null,
//       showLabel: true,
//       labelWidth: null,
//       span: 24,
//       layout: 'colFormItem',
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
//     },
//     placeholder: '请选择',
//     type: 'date',
//     style: { width: '100%' },
//     disabled: false,
//     clearable: true,
//     format: 'yyyy-MM-dd',
//     'value-format': 'yyyy-MM-dd',
//     readonly: false
//   },
//   {
//     __config__: {
//       label: '日期范围',
//       tag: 'el-date-picker',
//       tagIcon: 'date-range',
//       defaultValue: null,
//       span: 24,
//       showLabel: true,
//       labelWidth: null,
//       required: true,
//       layout: 'colFormItem',
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
//     },
//     style: { width: '100%' },
//     type: 'daterange',
//     'range-separator': '至',
//     'start-placeholder': '开始日期',
//     'end-placeholder': '结束日期',
//     disabled: false,
//     clearable: true,
//     format: 'yyyy-MM-dd',
//     'value-format': 'yyyy-MM-dd',
//     readonly: false
//   },
//   {
//     __config__: {
//       label: '评分',
//       tag: 'el-rate',
//       tagIcon: 'rate',
//       defaultValue: 0,
//       span: 24,
//       showLabel: true,
//       labelWidth: null,
//       layout: 'colFormItem',
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/rate'
//     },
//     style: {},
//     max: 5,
//     'allow-half': false,
//     'show-text': false,
//     'show-score': false,
//     disabled: false
//   },
//   {
//     __config__: {
//       label: '颜色选择',
//       tag: 'el-color-picker',
//       tagIcon: 'color',
//       span: 24,
//       defaultValue: null,
//       showLabel: true,
//       labelWidth: null,
//       layout: 'colFormItem',
//       required: true,
//       regList: [],
//       changeTag: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/color-picker'
//     },
//     'show-alpha': false,
//     'color-format': '',
//     disabled: false,
//     size: 'medium'
//   },
//   {
//     __config__: {
//       label: '上传',
//       tag: 'el-upload',
//       tagIcon: 'upload',
//       layout: 'colFormItem',
//       defaultValue: null,
//       showLabel: true,
//       labelWidth: null,
//       required: true,
//       span: 24,
//       showTip: false,
//       buttonText: '点击上传',
//       regList: [],
//       changeTag: true,
//       fileSize: 2,
//       sizeUnit: 'MB',
//       document: 'https://element.eleme.cn/#/zh-CN/component/upload'
//     },
//     __slot__: {
//       'list-type': true
//     },
//     action: 'https://jsonplaceholder.typicode.com/posts/',
//     disabled: false,
//     accept: '',
//     name: 'file',
//     'auto-upload': true,
//     'list-type': 'text',
//     multiple: false
//   }
// ]

// // 布局型组件 【左面板】
// export const layoutComponents = [
//   {
//     __config__: {
//       layout: 'rowFormItem',
//       tagIcon: 'row',
//       label: '行容器',
//       layoutTree: true,
//       document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes'
//     },
//     type: 'default',
//     justify: 'start',
//     align: 'top'
//   },
//   {
//     __config__: {
//       label: '按钮',
//       showLabel: true,
//       changeTag: true,
//       labelWidth: null,
//       tag: 'el-button',
//       tagIcon: 'button',
//       span: 24,
//       layout: 'colFormItem',
//       document: 'https://element.eleme.cn/#/zh-CN/component/button'
//     },
//     __slot__: {
//       default: '主要按钮'
//     },
//     type: 'primary',
//     icon: 'el-icon-search',
//     round: false,
//     size: 'medium',
//     plain: false,
//     circle: false,
//     disabled: false
//   },
//   {
//     __config__: {
//       layout: 'colFormItem',
//       tagIcon: 'table',
//       tag: 'el-table',
//       document: 'https://element.eleme.cn/#/zh-CN/component/table',
//       span: 24,
//       formId: 101,
//       renderKey: 1595761764203,
//       componentName: 'row101',
//       showLabel: true,
//       changeTag: true,
//       labelWidth: null,
//       label: '表格[开发中]',
//       children: [{
//         __config__: {
//           layout: 'raw',
//           tag: 'el-table-column',
//           renderKey: 15957617660153
//         },
//         prop: 'date',
//         label: '日期'
//       }, {
//         __config__: {
//           layout: 'raw',
//           tag: 'el-table-column',
//           renderKey: 15957617660152
//         },
//         prop: 'address',
//         label: '地址'
//       }, {
//         __config__: {
//           layout: 'raw',
//           tag: 'el-table-column',
//           renderKey: 15957617660151
//         },
//         prop: 'name',
//         label: '名称'
//       }, {
//         __config__: {
//           layout: 'raw',
//           tag: 'el-table-column',
//           renderKey: 1595774496335,
//           children: [
//             {
//               __config__: {
//                 label: '按钮',
//                 tag: 'el-button',
//                 tagIcon: 'button',
//                 layout: 'raw',
//                 renderKey: 1595779809901
//               },
//               __slot__: {
//                 default: '主要按钮'
//               },
//               type: 'primary',
//               icon: 'el-icon-search',
//               round: false,
//               size: 'medium'
//             }
//           ]
//         },
//         label: '操作'
//       }]
//     },
//     data: [{
//       date: '2016-05-02',
//       name: '王小虎',
//       address: '上海市普陀区金沙江路 1518 弄'
//     }],
//     border: true,
//     type: 'default',
//     justify: 'start',
//     align: 'top'
//   }
// ]
