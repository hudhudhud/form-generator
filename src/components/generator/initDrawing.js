export default undefined
let a = {
	"params": [
        {
			"type": "hidden",
            "key": "hidden",
            "value":"123"
		},{
			"type": "addressBook",
			"key": "book",
			"label": "addressBook用户",
			"fromDepartmentId": 0,
			"mode": "multi",
			"chooseType": ["user"],
			"require": false,
			"callback": "bookChange"
		},{
			"type": "addressBook",
			"key": "department",
			"label": "addressBook部门",
			"fromDepartmentId": 0,
			"mode": "single",
			"chooseType": ["department"],
			"require": false,
			"callback": "bookChange"
		}, 
		{
			"type": "deptSelect",
			"key": "department_customer",
			"label": "deptSelect自定义部门",
			"chooseMutiple": true,
			"require": false,
			"options":"getDeptData",
			"labelKey":"deptName",
			"valueKey":"deptId",
			"callback": "deptChange"
		}, 
		{
			"type": "input",
			"key": "name",
			"label": "姓名",
			"require": true,
			"attributes": [{
				"name": "id",
				"value": "name"
      }],
      "events": [ 
          {
              "name": "blur",
              "handler": "inputclick"
          }
      ]
		}, {
			"type": "input",
			"key": "age",
            "label": "年龄",
            "require": false,
			"rules": [{
				"regexp": "^[0-9]*$",
				"message": "年龄请输入整数"
			}]
		}, {
			"type": "dateTimePicker",
			"key": "time",
			"label": "生日",
			"pickerType": "date",
            "callback": "change",
            "require": false
		},{
			"type": "dateTimePicker",
			"key": "time2",
			"label": "时间",
			"pickerType": "date",
            "callback": "change",
            "require": false,
            "startDate":"2019-01-01"
		}, {
			"type": "textarea",
			"label": "自我介绍",
			"key": "intro",
			"autoSize": true,
            "disableClear": true,
            "require": false
		}, {
			"type": "radio",
			"label": "性别",
			"key": "sex",
			"options": [{
				"value": 0,
				"label": "男"
			}, {
				"value": 1,
				"label": "女"
			}],
			"labelKey": "label",
			"valueKey": "value",
			"direction": "row"
		},{
			"type": "radio",
			"label": "性别1",
			"key": "sex1",
			"options": [{
				"value": 0,
				"label": "男"
			}, {
				"value": 1,
				"label": "女"
			}],
			"labelKey": "label",
			"valueKey": "value",
			"direction": "row"
		}, {
			"type": "checkboxGroup",
			"label": "兴趣爱好",
			"value": "0,1",
            "key": "love",
            "require": false,
			"options": [{
				"value": "0",
				"name": "足球"
			}, {
				"value": "1",
				"name": "篮球"
			}, {
				"value": "2",
				"name": "羽毛球"
			}, {
				"value": "3",
				"name": "毛球"
			}],
			"labelKey": "name",
			"valueKey": "value",
			"direction": "column",
			"callback": "change"
		}, {
			"type": "checkbox",
			"label": "是否参加",
			"value": false,
			"key": "attend",
			"optionLabel": "是",
            "callback": "change",
            "require": false
		}, {
			"type": "picker",
			"label": "异步值选择",
			"key": "number",
			"options": "getNumber",
            "attributes": [{
                "name": "class",
                "value": ["cls-init","a","b"]
              },
              {
                "name": "style",
                "value": {
                  "color":"red",
                  "font-size":"12px"
                }
              }],
			"require": false,
			"callback":"change"
		}, 
		{
			"type": "picker",
			"label": "上个picker联动",
			"key": "select2",
			"options": [],
			"labelKey": "name",
            "valueKey": "id",
            "require": false
		}, 
		{
			"type": "cascaderselect",
			"label": "级联选择",
			"key": "address",
			"options": [{
				"label": "省",
				"key": "province",
				"func": "getProvince",
				"changeFunc": "getCity",
				"changeKey": "city"
			}, {
				"label": "市",
				"key": "city",
				"changeFunc": "getArea",
				"changeKey": "area"
			}, {
				"label": "区",
				"key": "area"
			}],
			"showValueSplit": "-",
			"callback": "change",
			"labelKey": "name",
			"valueKey": "id",
			"require": false,
			"value":"1,11"
		},
		{
			"type": "searchSelect",
			"label": "搜索选择",
			"key": "friends",
			"options": "searchFunc",
			"labelKey": "name",
			"valueKey": "id",
			"labelKey1": "txt",
			"labelKey2": "label2",
			"searchPlaceHolder": "搜索关键字啦啦啦",
			"searchFunc": "searchFunc",
			"showSearchInput":false,
			"chooseMutiple": true,
			"require": false,
            "callback": "searchselectChange"
        },
        {
			"type": "searchSelect",
			"label": "搜索选择(值数组)",
			"key": "friends2",
			"options": [1,2,3,4],
			"searchPlaceHolder": "",
			"searchFunc": "searchFunc",
			"showSearchInput":false,
			"chooseMutiple": true,
			"require": false
		},
		{
			"type": "searchSelect",
			"label": "搜索选择分页",
			"key": "friends1",
			"options": "pageFunc",
			"labelKey": "name",
			"valueKey": "name",
			"labelKey1": "txt",
			"labelKey2": "label2",
			"searchPlaceHolder": "搜索关键字啦啦啦",
			"searchFunc": "pageFunc",
			"chooseMutiple": false,
			"pagenble": true,
            "pageSize": 10,
			"require": false,
			"callback":"searchselectChange2",
			"show":false
		},
		{
			"type": "detail",
			"key": "oneDetail",
			"title": "1个字段",
            "mode": "simple",
            "require": false,
			"params": [{
				"key": "school",
				"type": "input",
				"label": "学校",
				"value": ""
			}]
		},
		{
			"type": "detail",
			"key": "twoDetail",
			"title": "多个字段",
            "mode": "mutiple",
            "require": false,
			"params": [{
					"key": "school",
					"type": "input",
					"label": "学校",
					"require": false,
					"value": "123"
				}, {
					"type": "radio",
					"label": "性别",
					"key": "sex",
					"options": [{
						"value": 0,
						"label": "男"
					}, {
						"value": 1,
						"label": "女"
					}],
					"labelKey": "label",
					"valueKey": "value",
					"direction": "row",
					"callback": "change1"
				}, {
					"key": "class",
					"type": "input",
					"label": "专业"
				},
				{
					"type": "fileUpload",
					"key": "filesmx",
					"label": "文件上传",
					"multiple": true,
					"accept": "*",
					"maxNum": 6
				},
				{
					"type": "searchSelect",
					"label": "搜索选择",
					"key": "friendsdetail",
					"options": "searchFunc",
					"labelKey": "name",
					"valueKey": "id",
					"labelKey1": "txt",
					"labelKey2": "label2",
					"searchPlaceHolder": "搜索关键字啦啦啦",
					"searchFunc": "searchFunc",
					"chooseMutiple": true
				}
			]
		}, {
			"type": "detail",
			"key": "threeDetail",
			"title": "复杂pop",
            "mode": "pop",
            "beforeSave":"beforeSave",
			"params": [{
					"key": "school",
					"type": "input",
					"label": "学校",
					"require": true
				}, {
					"type": "radio",
					"label": "性别",
					"value": 1,
					"key": "sex",
					"options": [{
						"value": 0,
						"label": "男"
					}, {
						"value": 1,
						"label": "女"
					}],
					"labelKey": "label",
					"valueKey": "value",
					"direction": "row",
					"callback": "change1"
				}, {
					"type": "checkbox",
					"label": "是否参加",
					"value": false,
					"key": "attend",
					"optionLabel": "是"
				}, {
					"type": "searchSelect",
					"label": "搜索选择",
					"key": "friendsdetail",
					"options": "searchFunc",
					"labelKey": "name",
					"valueKey": "id",
					"labelKey1": "txt",
					"labelKey2": "label2",
					"searchPlaceHolder": "搜索关键字啦啦啦",
					"searchFunc": "searchFunc",
					"chooseMutiple": true,
					"value": "10,11",
					"showValue": "1,2"
				},
				{
					"type": "cascaderselect",
					"label": "级联选择",
					"key": "address",
					"options": [{
						"label": "省",
						"key": "province",
						"func": "getProvince",
						"changeFunc": "getCity",
						"changeKey": "city"
					}, {
						"label": "市",
						"key": "city",
						"changeFunc": "getArea",
						"changeKey": "area"
					}, {
						"label": "区",
						"key": "area"
					}],
					"value": "1,11,110",
					"showValueSplit": "-",
					"callback": "change",
					"labelKey": "name",
					"valueKey": "id",
					"require": false
				}, {
					"type": "picker",
					"label": "异步值选择",
					"key": "number",
					"options": "getNumber",
					"attributes": [{
						"name": "class",
						"value": ["cls-init"]
					}],
					"value": 3,
					"callback": "change"
				},
				{
					"type": "fileUpload",
					"key": "files",
					"label": "文件上传",
					"multiple": true,
					"accept": "*"
				}
			]
		}, {
			"type": "fileUpload",
			"key": "files",
			"label": "文件上传",
			"multiple": true,
			"accept": "*",
			"maxNum": 8,
            "maxSize": 1024,
            "require": false,
            "callback":"fileChange"
		}, {
			"type": "fileUpload",
			"key": "files1",
			"label": "文件上传",
			"multiple": true,
			"accept": "*",
			"maxNum": 2,
			"maxSize": 1024
		}
	],
	"init": "init",
	"editInit": "editInit",
    "beforeSubmit": "beforeSubmit",
    "descHtml":"<p style='color:red;height:50px'>我是说明<a href='https://www.baidu.com/'>百度</></p>",
    "showDescPop":true,
    "descPopSetting":{
        "title":"test",
        "popHeight":"300",
        "popBtnTitle":"说明",
        "content":"<p style='color:red;height:50px'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero veniam, esse ratione optio asperiores consequuntur sapiente nobis eaque ipsa praesentium magnam incidunt facere repudiandae vel quis molestias sint! Dolore quaerat facilis nemo. Numquam quam officiis doloribus natus commodi. Maxime at ratione, minima praesentium doloribus voluptates eligendi dolorem rerum quidem? Eum, perspiciatis. Accusamus et ab ducimus. Porro veniam veritatis quae tenetur dolore aut! Similique at aspernatur magni amet tenetur illum voluptate aperiam quos perspiciatis ratione quibusdam aliquid, magnam dicta assumenda omnis odit repellat vel, consectetur suscipit modi! Hic magnam nostrum, cupiditate cum, voluptatem illum necessitatibus eum odio unde libero harum atque.</p>"
    },
    "customerBtns":[
        {
            "title":"测试",
            "type":"cancel",
            "showState":["add","edit"],
            "style":"background-color:green;color:#fff"
        }        
    ]
}