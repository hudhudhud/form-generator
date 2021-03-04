export const GET_DEPT = process.env.VUE_APP_PUB_URL + '/yq/dept/info' //获取一级部门列表
export const GET_JSON = process.env.VUE_APP_CONFIG_URL+ '/h3c/free/html_json' 
export const SAVE_JSON = process.env.VUE_APP_WORKFLOW_URL+ '/rest/ws/p/S008/GetWF/api/form/configFormJson' 

export const GET_JSON_PUBLIC = process.env.VUE_APP_CONFIG_URL+ "/h3c/free/iflowService/getPublicForm" // 获取公共表单 formJson
export const SAVE_JSON_PUBLIC = process.env.VUE_APP_CONFIG_URL+ "/h3c/free/iflowService/savePublicForm" //保存公共表单
export const SELECT_PUBLIC_FORM = process.env.VUE_APP_CONFIG_URL+ "/h3c/free/iflowService/selectPublicForm " //获取公共组件下拉数据源


