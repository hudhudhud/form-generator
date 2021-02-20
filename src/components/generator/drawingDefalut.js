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

export const drawingDefalutFlow = 
{
  "modules": [
      {
          "module": "申请信息",
          "active": true,
          "style": "background-color:#fff;color:#999",
          "params": [
              {
                  "label": "申请人",
                  "type": "label",
                  "key": "user",
                  "value": ""
              },
              {
                "show": true,
                "label": "当前环节",
                "type": "label",
                "key": "current"
              },
              // {
              //     "mode": "mutiple",
              //     "type": "detail",
              //     "title": "申请明细",
              //     "addDisable": true,
              //     "delDisable": true,
              //     "editDisable": false,
              //     "params": [
              //         {
              //             "show": true,
              //             "label": "所在部门",
              //             "type": "label",
              //             "key": "department"
              //         },
              //         {
              //             "show": true,
              //             "label": "附件",
              //             "type": "fileUpload",
              //             "key": "file",
              //             "readonly": true
              //         }
              //     ],
              //     "key": "oldDetail"
              // }
          ]
      },
      {
          "module": "审批表单",
          "active": true,
          "params": [
              {
                  "show": true,
                  "label": "审批意见",
                  "type": "textarea",
                  "key": "approveInfo"
              },
          ]
      }
  ],
  "fixBtns": {
    "agree": {
        "type": "Agree",
        "show": true,
        "title": "同意",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-check"
    },
    "reject": {
        "type": "Reject",
        "show": true,
        "title": "驳回",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-close"
    },
    "transfer": {
        "type": "Transfer",
        "show": true,
        "title": "转办",
        "needValid": true,
        "beforeSubmit": "",
        "icon":"el-icon-right"
    }
  },
  "customerBtns": [],
  "init": "init",
  "descHtml": "",
  "showDescPop": false,
  "onlySaveValue": true,
  "showAsModule": true,
}