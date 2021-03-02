<template>
  <div class="right-board" >
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box" v-if='activeData&&activeData.__config__'>
      <a
        class="document-link"
        target="_blank"
        :href="`http://mobileproxy.h3c.com:8000/dev/work-flow/formConfigDoc.html#${activeData.__config__.type}`"
        title="查看组件文档"
      >
        <i class="el-icon-link" />
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField &&activeData.__config__.type!='detail'" size="small" label-width="150px">
          <!-- <el-form-item v-if="activeData.__config__.changeTag" label="组件类型">
            <el-select
              v-model="activeData.__config__.type"
              placeholder="请选择组件类型"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <el-option-group v-for="(group,i) in tagList" :key="i" :label="group.label">
                <el-option
                  v-for="(item,index) in group.options"
                  :key="index"
                  :label="item.__config__.label"
                  :value="item.__config__.type"
                >
                  <svg-icon class="node-icon" :icon-class="item.__config__.type" />
                  <span> {{ item.__config__.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item> -->
          <el-divider>基本属性</el-divider>
          <el-form-item  label="组件类型">
            <el-input v-model="activeData.__config__.type" readonly />
          </el-form-item>
          <el-form-item  label="字段名">
            <el-input v-model="activeData.__config__.key" placeholder="请输入字段名" />
          </el-form-item>
          <el-form-item label="标题" v-if='["hidden"].indexOf(activeData.__config__.type)==-1'>
            <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
          </el-form-item>
          <!-- 默认值 -->
          <el-form-item  label="默认值" v-if='activeData.__config__.type=="checkbox"'>
            <el-switch v-model="activeData.__config__.value" />
          </el-form-item>
          <el-form-item  label="描述值" v-if='activeData.__config__.type=="html"'>
            <el-input type='textarea' :rows="5" v-model="activeData.__config__.value" placeholder="请输入描述" />
          </el-form-item>
          <template v-else-if='["picker","searchSelect","addressBook","deptSelect","cascaderselect"].indexOf(activeData.__config__.type)>-1'>
              <el-form-item  label="默认值类型">
                <el-radio-group v-model="activeData.defaultValueType" @change='defaultValueTypeChange'>
                  <el-radio label="value" >值</el-radio>
                  <el-radio label="object">对象</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item  label="默认值" v-if='activeData.defaultValueType=="value"'>
                <el-input v-model="activeData.__config__.value" placeholder="请输入字段名" />
              </el-form-item>
              <el-form-item  label="" v-else-if='activeData.defaultValueType=="object"'>
                值：<el-input v-model="activeData.__config__.value.value" placeholder="请输入值" size='small'/>
                显示值：<el-input v-model="activeData.__config__.value.showValue" placeholder="请输入显示值" size='small'/>
              </el-form-item>
          </template>
          <el-form-item  label="默认值" v-else-if='["fileUpload"].indexOf(activeData.__config__.type)==-1'>
            <el-input v-model="activeData.__config__.value" placeholder="请输入默认值"  />
          </el-form-item>
          <!-- <el-form-item v-if="activeData.__config__.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.__config__.placeholder" placeholder="请输入占位提示"  />
          </el-form-item> -->
          <el-form-item  label="是否必填" v-if='["hidden","html","label"].indexOf(activeData.__config__.type)==-1'>
            <el-switch v-model="activeData.__config__.require"  />
          </el-form-item>
          <el-form-item  label="必填提示信息" v-if='["hidden","html","label"].indexOf(activeData.__config__.type)==-1&&activeData.__config__.require'>
            <el-input v-model="activeData.__config__.message" placeholder="必填提示信息" />
          </el-form-item>
          <el-form-item  label="是否禁用清除按钮" v-if='["fileUpload","textarea","hidden","html","label"].indexOf(activeData.__config__.type)==-1' >
            <el-switch v-model="activeData.__config__.disableClear" />
          </el-form-item>
          <el-form-item  label="是否只读" v-if='["hidden","html","label"].indexOf(activeData.__config__.type)==-1'>
            <el-switch v-model="activeData.__config__.readonly" />
          </el-form-item>
          <el-form-item  label="是否显示" v-if='["hidden"].indexOf(activeData.__config__.type)==-1'>
            <el-switch v-model="activeData.__config__.show" />
          </el-form-item> 
          <el-form-item  label="回调函数名称" v-if='["hidden","fileUpload","cascaderselect","html","label"].indexOf(activeData.__config__.type)==-1'>
            <el-input v-model="activeData.__config__.callback" placeholder="请输入回调函数名称" />
          </el-form-item>
          <!-- 搜索框属性 -->
          <template v-if='activeData.__config__.type=="searchSelect"'>
            <el-divider>搜索选择属性</el-divider>
            <el-form-item  label="是否显示搜索框">
               <el-switch v-model="activeData.__config__.showSearchInput" />
            </el-form-item>
            <el-form-item  label="搜索框placeholder" v-if='activeData.__config__.showSearchInput'>
              <el-input v-model="activeData.__config__.searchPlaceHolder" placeholder="搜索框placeholder" />
            </el-form-item>
            <el-form-item  label="搜索函数名">
              <el-input v-model="activeData.__config__.searchFunc" placeholder="搜索函数名" />
            </el-form-item>
            <el-form-item  label="是否多选">
               <el-switch v-model="activeData.__config__.chooseMutiple" />
            </el-form-item>
            <el-form-item  label="是否分页">
               <el-switch v-model="activeData.__config__.pagenble" />
            </el-form-item>
            <el-form-item  label="每页数量" v-if='activeData.__config__.pagenble'>
                <el-input v-model="activeData.__config__.pageSize" placeholder="每页数量" />
            </el-form-item>
          </template>
          <!-- 通讯录属性 -->
          <template  v-if='activeData.__config__.type=="addressBook"'>
            <el-divider>通讯录属性</el-divider>
            <el-form-item  label="选择模式">
              <el-radio-group v-model="activeData.__config__.mode">
                  <el-radio label="single" >单选</el-radio>
                  <el-radio label="multi">多选</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item  label="通讯录类型">
              <el-checkbox-group v-model="activeData.__config__.chooseType"  :max="1" >
                <el-checkbox label="user">人员</el-checkbox>
                <el-checkbox label="department">部门</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <template v-if='activeData.__config__.chooseType.indexOf("user")>-1'>
              <el-form-item  label="开始部门">
                <el-radio-group v-model="activeData.__config__.fromDepartmentId">
                  <el-radio :label="-1">自己部门</el-radio>
                  <el-radio :label="0" >最上层部门</el-radio>
                </el-radio-group>
              </el-form-item>
              <template>
                <el-divider>默认选中人员域账号</el-divider>
                <div v-for="(item, index) in activeData.__config__.selectedUserIds" :key="index" class="select-item">
                    <el-input placeholder="域账号" size="small" v-model='activeData.__config__.selectedUserIds[index]'/>
                    <div class="close-btn select-line-icon" @click="activeData.__config__.selectedUserIds.splice(index, 1)">
                      <i class="el-icon-remove-outline" />
                    </div>
                </div>
                <div style="margin-left: 20px;">
                  <el-button style="padding-bottom: 0"  icon="el-icon-circle-plus-outline" type="text" @click="addAddressBookSelectUser">
                    添加人员
                  </el-button>
                </div>
              </template>
            </template>
          </template> 
           <!-- 自定义部门 -->
          <template  v-if='activeData.__config__.type=="deptSelect"'>
            <el-divider>自定义部门属性</el-divider>
            <el-form-item  label="是否多选">
              <el-switch v-model="activeData.__config__.chooseMutiple" />
            </el-form-item>
            <el-form-item  label="对象显示字段">
              <el-input v-model="activeData.__config__.labelKey" placeholder="对象labelKey" />
            </el-form-item>
            <el-form-item  label="对象值字段">
              <el-input v-model="activeData.__config__.valueKey" placeholder="对象valueKey" />
            </el-form-item>
            <el-form-item  label="获取数据源函数名称" >
              <el-input v-model="activeData.__config__.options" placeholder="请输入函数名称" />
            </el-form-item>
          </template>
          <template v-if='activeData.__config__.type=="fileUpload"'>
            <el-divider>文件上传属性</el-divider>
            <el-form-item  label="是否多选">
               <el-switch v-model="activeData.__config__.multiple" />
            </el-form-item>
            <el-form-item  label="上传最多文件个数">
               <el-input type='number' v-model="activeData.__config__.maxNum"  placeholder="上传最多文件个数" />
            </el-form-item>
            <el-form-item  label="限制上传文件大小(KB)">
               <el-input type='number' v-model="activeData.__config__.maxSize"  placeholder="限制上传文件大小" />
            </el-form-item>
            <el-form-item label="文件类型accpet">
              <el-input v-model="activeData.__config__.accept"  placeholder="文件类型accpet" />
            </el-form-item>
          </template>
          <!-- input正则 -->
          <section v-if="activeData.__config__.type=='input'">
            <el-divider>正则校验</el-divider>
            <div v-for="(item, index) in activeData.__config__.rules"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.rules.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.regexp" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                添加规则
              </el-button>
            </div>
          </section>
          <!-- 多文本框 -->
          <template v-if="activeData.__config__.type=='textarea'">
            <el-form-item label="最多输入">
              <el-input v-model="activeData.__config__.maxLen" placeholder="请输入字符长度">
                <template slot="append">
                  个字符
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="输入框高度自动" v-if='!activeData.settingAutoSize'>
             <el-switch v-model="activeData.__config__.autoSize" />
            </el-form-item>
            <el-form-item label="设置输入框高度">
             <el-switch v-model="activeData.settingAutoSize" @change='settingAutoSizeChange' />
            </el-form-item>
            <el-form-item label="输入框最小高度" v-if='activeData.settingAutoSize'>
              <el-input-number v-model="activeData.__config__.autoSize.minHeight"  placeholder="最小高度" />
            </el-form-item>
            <el-form-item  label="输入框最大高度" v-if='activeData.settingAutoSize'>
              <el-input-number v-model="activeData.__config__.autoSize.maxHeight"  placeholder="最大高度" />
            </el-form-item>
          </template>
          <!-- 时间选择 -->
          <template v-if='activeData.__config__.type=="dateTimePicker"'>
            <el-form-item  label="时间选择类型">
              <el-radio-group v-model="activeData.__config__.pickerType" @change='timePickerTypeChange'>
                <el-radio-button label="date" />
                <el-radio-button label="datetime" />
                <el-radio-button label="time" />
              </el-radio-group>
            </el-form-item>
            <el-form-item  label="时间格式">
              <el-input v-model="activeData.__config__.formatStr" placeholder="请输入时间格式" />
            </el-form-item>
            <template v-if='activeData.__config__.pickerType!=="time"'>
              <el-form-item  label="可选开始日期">
                <el-date-picker
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'
                  v-model="activeData.__config__.startDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item  label="可选结束日期">
                <el-date-picker
                  format='yyyy-MM-dd'
                  value-format='yyyy-MM-dd'
                  v-model="activeData.__config__.endDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </template>
          </template>
          <!-- 展示方式 -->
          <template v-if='["radio","checkboxGroup"].indexOf(activeData.__config__.type)>-1'>
            <el-form-item  label="展示方式">
              <el-radio-group v-model="activeData.__config__.direction">
                <el-radio-button label="row" />
                <el-radio-button label="column" />
              </el-radio-group>
            </el-form-item>
          </template>
          <!-- 值类型 / 对象类型 -->
          <template v-if='["radio","checkboxGroup","picker","searchSelect"].indexOf(activeData.__config__.type)>-1'>
              <el-divider>数据源</el-divider>
              <el-form-item  label="数据项类型">
                <el-radio-group v-model="activeData.optionsType" @change='optionsTypeChange'>
                  <el-radio label="value" >值数组</el-radio>
                  <el-radio label="object">对象数组</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if='activeData.optionsType=="object"'>
                <el-form-item  label="对象显示字段">
                <el-input v-model="activeData.__config__.labelKey" placeholder="对象labelKey" />
                </el-form-item>
                <el-form-item  label="对象值字段">
                  <el-input v-model="activeData.__config__.valueKey" placeholder="对象valueKey" />
                </el-form-item>
                <template v-if='activeData.__config__.type=="searchSelect"'>
                    <el-form-item  label="labelKey1" >
                        <el-input v-model="activeData.__config__.labelKey1" placeholder="labelKey1" />
                    </el-form-item>
                    <el-form-item  label="labelKey2" >
                        <el-input v-model="activeData.__config__.labelKey2" placeholder="labelKey2" />
                    </el-form-item>
                </template>
              </template>
          </template>
          <!-- 数据源配置 -->
          <template v-if='["radio","checkboxGroup","picker","searchSelect"].indexOf(activeData.__config__.type) > -1'>
              <template v-if='["checkboxGroup","picker","searchSelect"].indexOf(activeData.__config__.type) > -1'>
                <el-form-item  label="动态获取数据源">
                  <el-switch v-model="activeData.jsGetOptions" @change='jsGetOptionsChange'/>
                </el-form-item>
                <el-form-item  label="函数名称" v-if='activeData.jsGetOptions'>
                  <el-input v-model="activeData.__config__.options" placeholder="请输入函数名称" />
                </el-form-item>
              </template>
              <template v-if='!activeData.jsGetOptions'>
                <el-divider>数据项</el-divider>
                <draggable 
                  :list="activeData.__config__.options"
                  :animation="340"
                  group="selectItem"
                  handle=".option-drag">
                    <div v-for="(item, index) in activeData.__config__.options" :key="index" class="select-item">
                      <div class="select-line-icon option-drag">
                        <i class="el-icon-s-operation" />
                      </div>
                      <template v-if='activeData.optionsType=="object"'>
                        <p>{{activeData.__config__.labelKey}}：<el-input v-model="item[activeData.__config__.labelKey]" placeholder="选项名" size="small"  /></p>
                        <p>{{activeData.__config__.valueKey}}：<el-input v-model="item[activeData.__config__.valueKey]" placeholder="选项值" size="small" /></p>
                         <template v-if='activeData.__config__.type=="searchSelect"'>
                          <p>{{activeData.__config__.labelKey1}}：<el-input v-model="item[activeData.__config__.labelKey1]" placeholder="显示名1" size="small"  /></p>
                          <p>{{activeData.__config__.labelKey2}}：<el-input v-model="item[activeData.__config__.labelKey2]" placeholder="显示名2" size="small" /></p>
                        </template>
                      </template>
                      <template v-else>
                        <el-input placeholder="选项值" size="small" v-model='activeData.__config__.options[index]'/>
                      </template>
                      
                      <div class="close-btn select-line-icon" @click="activeData.__config__.options.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                    </div>
                </draggable>
                <div style="margin-left: 20px;">
                  <el-button
                    style="padding-bottom: 0"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    @click="addSelectItem"
                  >
                    添加选项
                  </el-button>
                </div>
              </template>
          </template>
          <!-- 级联数据源配置 -->
          <template v-if='["cascaderselect"].indexOf(activeData.__config__.type) > -1'>
              <template>
                <el-divider>级联项</el-divider>
                  <div v-for="(item, index) in activeData.__config__.options" :key="index" class="casca-select-item">
                      <el-divider>级联项 {{index+1}}</el-divider>
                      <div class="close-btn select-line-icon" @click="activeData.__config__.options.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                      </div>
                      <div>
                        <el-form-item  label="名称" required>
                          <el-input v-model="item.label" placeholder="请输入名称" />
                        </el-form-item>
                        <el-form-item  label="key值" required>
                          <el-input v-model="item.key" placeholder="key值" />
                        </el-form-item>
                        <el-form-item  label="第一项获取数据函数名称" v-if='index==0' required>
                          <el-input v-model="item.func" placeholder="key值" />
                        </el-form-item>
                        <el-form-item  label="选项改变时触发的项的key" >
                          <el-input v-model="item.changeKey" placeholder="key值" />
                        </el-form-item>
                        <el-form-item  label="选项改变时触发的函数名称" >
                          <el-input v-model="item.changeFunc" placeholder="key值" />
                        </el-form-item>
                      </div>    
                </div>
                <div style="margin-left: 20px;">
                  <el-button
                    style="padding-bottom: 0"
                    icon="el-icon-circle-plus-outline"
                    type="text"
                    @click="addCascaderselectItem"
                  >
                    添加选项
                  </el-button>
                </div>
              </template>
          </template>
          <template v-if='activeData.__config__.type=="checkbox"'>
            <el-form-item label="显示的文字">
              <el-input v-model="activeData.__config__.optionLabel" placeholder="请输入显示的文字" />
            </el-form-item>
          </template>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="至少应选">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="最多可选">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="文件类型">
            <el-select
              v-model="activeData.accept"
              placeholder="请选择文件类型"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option label="图片" value="image/*" />
              <el-option label="视频" value="video/*" />
              <el-option label="音频" value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="文件大小">
            <el-input v-model.number="activeData.__config__.fileSize" placeholder="请输入文件大小">
              <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.optionType !== undefined" label="选项样式">
            <el-radio-group v-model="activeData.__config__.optionType">
              <el-radio-button label="default">
                默认
              </el-radio-button>
              <el-radio-button label="button">
                按钮
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <section v-if='["html","hidden"].indexOf(activeData.__config__.type) == -1'>
            <el-divider>input属性</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.attributes"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.attributes.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="属性名称">
                <!-- <el-input v-model="item.name" placeholder="请输入属性名称" /> -->
                <el-select v-model="item.name" placeholder="请选择">
                  <el-option  key="placeholder" label="placeholder" value="placeholder"> </el-option>
                  <el-option  key="style" label="style（作用于最外层）" value="style"> </el-option>
                  <el-option  key="class" label="class（作用于最外层）" value="class"> </el-option>
                  <el-option  key="id" label="id" value="id"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值" style="margin-bottom:0">
                <el-input v-model="item.value" placeholder="请输入属性值" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addAttr">
                添加属性
              </el-button>
            </div>
          </section>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="150px">
          <el-form-item label="初始化函数">
            <el-input v-model="formConf.init" placeholder="请输入初始化函数名称" />
          </el-form-item>
          <template v-if="!isFlow">
            <el-form-item label="回写函数">
              <el-input v-model="formConf.editInit" placeholder="请输入回写函数名称" />
            </el-form-item>
            <el-form-item label="提交前校验函数">
              <el-input v-model="formConf.beforeSubmit" placeholder="请输入提交前校验函数名称" />
            </el-form-item>
          </template>
          <el-form-item label="表单描述(html)">
            <el-input type='textarea' :rows="5" v-model="formConf.descHtml" placeholder="请输入表单描述（表单顶部）" />
          </el-form-item>
          <el-form-item label="是否启用描述弹框">
            <el-switch v-model="formConf.showDescPop" @change='showDescPopChange' />
          </el-form-item>
          <template v-if='formConf.showDescPop'>
            <el-form-item label="弹框标题">
              <el-input v-model="formConf.descPopSetting.title" placeholder="请输入按钮文字" />
            </el-form-item> 
            <el-form-item label="弹框隐藏时按钮文字">
              <el-input v-model="formConf.descPopSetting.popBtnTitle" placeholder="请输入弹框隐藏时按钮文字" />
            </el-form-item> 
            <el-form-item label="弹窗高度">
              <el-input v-model="formConf.descPopSetting.popHeight" placeholder="请输入弹窗高度" />
            </el-form-item> 
            <el-form-item label="弹框内容(html)">
              <el-input type='textarea' :rows="5" v-model="formConf.descPopSetting.content" placeholder="请输入弹框内容" />
            </el-form-item>
          </template>
          <el-form-item label="表单只提交value值">
            <el-switch v-model="formConf.onlySaveValue" />
          </el-form-item>
          <section v-if="isFlow">
            <el-divider>固定按钮</el-divider>
            <div v-for="(item, index) in formConf.fixBtns" :key="index" class="reg-item" >
              <el-form-item label="是否显示">
                <el-switch v-model="item.show" />
              </el-form-item>
              <el-form-item label="按钮名称">
                <el-input v-model="item.title" placeholder="请输入属性名称" />
              </el-form-item>
              <el-form-item label="按钮图标">
                <!-- <el-input v-model="item.icon" placeholder="按钮图标" /> -->
                  <el-input v-model="item.icon" placeholder="请输入按钮图标" >
                    <el-button
                      slot="append"
                      icon="el-icon-thumb"
                      @click="openIconsDialog(item)"
                    >
                      选择
                    </el-button>
                  </el-input>
              </el-form-item>
              <el-form-item label="按钮值" style="margin-bottom:0">
                {{item.type}}
              </el-form-item>
              <el-form-item label="提交时是否需要校验">
                <el-switch v-model="item.needValid" />
              </el-form-item>
              <el-form-item label="点击前事件">
                <el-input v-model="item.beforeSubmit" placeholder="请输入点击前事件方法名称" />
              </el-form-item>
            </div>
          </section>
          <section>
            <el-divider>自定义按钮</el-divider>
            <div
              v-for="(item, index) in formConf.customerBtns"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="formConf.customerBtns.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="按钮名称">
                <el-input v-model="item.title" placeholder="请输入属性名称" />
              </el-form-item>
                <el-form-item label="按钮图标">
                <!-- <el-input v-model="item.icon" placeholder="按钮图标" /> -->
                  <el-input v-model="item.icon" placeholder="请输入按钮图标" >
                    <el-button
                      slot="append"
                      icon="el-icon-thumb"
                      @click="openIconsDialog(item)"
                    >
                      选择
                    </el-button>
                  </el-input>
              </el-form-item>
              <el-form-item label="按钮值" style="margin-bottom:0">
                <el-input v-model="item.type" placeholder="请输入属性值" />
              </el-form-item>
              <template v-if="!isFlow">
                <el-form-item label="按钮显示场景">
                  <el-checkbox-group v-model="item.showState">
                    <el-checkbox label="add" value=''>新增时</el-checkbox>
                    <el-checkbox label="edit" value=''>回写时</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="表单提交时是否需要校验">
                  <el-switch v-model="item.needValid" />
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="点击事件">
                  <el-input v-model="item.clickFunc" placeholder="请输入事件方法名称" />
                </el-form-item>
              </template>
              <el-form-item label="按钮样式style">
                <el-input type='textarea' :row='4' v-model="item.style" placeholder="请输入按钮样式" />
              </el-form-item> 
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addCustomerBtn">
                添加自定义按钮
              </el-button>
            </div>
          </section>
          <!-- 模块化结构 -->
          <el-divider>模块化结构</el-divider>
             <el-form-item label="是否启用模块化结构">
              <el-switch v-model="formConf.showAsModule" @change='showAsModuleChange' />
          </el-form-item>
           <section v-if='formConf.showAsModule'>
            <div
              v-for="(moduleItem, index) in drawListObj.list"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="drawListObj.list.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="模块名称">
                <el-input v-model="moduleItem.module" placeholder="请输入模块名称" />
              </el-form-item>
              <el-form-item label="是否默认展开">
                <el-switch v-model="moduleItem.active" />
              </el-form-item>
              <el-form-item label="模块样式（class）">
                <el-input type='textarea' :row='4' v-model="moduleItem.class" placeholder="请输入模块样式" />
              </el-form-item> 
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addModuleBtn">
                添加模块
              </el-button>
            </div>
          </section>
        </el-form>
        <!-- 明细表单属性 -->
        <el-form v-show="currentTab==='field' && showField && activeData.__config__.type=='detail'" size="small" label-width="150px">
          <el-form-item  label="组件类型">
            <el-input v-model="activeData.__config__.type" readonly />
          </el-form-item>
          <el-form-item  label="明细模式">
            <el-input v-model="activeData.__config__.mode" readonly />
          </el-form-item>
          <el-form-item  label="字段名">
            <el-input v-model="activeData.__config__.key" placeholder="请输入字段名" />
          </el-form-item>
          <el-form-item label="明细标题" >
            <el-input v-model="activeData.__config__.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label='明细项标题' v-if="activeData.__config__.mode!=='simple'">
            <el-input v-model="activeData.__config__.detailTitle"  placeholder="请输入明细项标题" />
            <span style="font-size:12px;color:#ED5E1D;">如"明细{i}"，“{i}”为明细项序号占位符，默认为明细标题加序号</span>
          </el-form-item>
          <!-- 默认值 -->
          <!-- <el-form-item  label="默认值" v-if='activeData.__config__.type=="checkbox"'>
            <el-switch v-model="activeData.__config__.value" />
          </el-form-item> -->
          <el-form-item  label="提交前调用函数名称" v-if='activeData.__config__.mode=="pop"'>
           <el-input v-model="activeData.__config__.beforeSave" placeholder="请输入提交函数" />
          </el-form-item>
          <el-form-item label="是否禁止明细新增">
            <el-switch v-model="activeData.__config__.addDisable" />
          </el-form-item>
          <el-form-item label="是否禁止明细删除">
            <el-switch v-model="activeData.__config__.delDisable" />
          </el-form-item>
           <el-form-item label="是否禁止明细编辑" v-if="activeData.__config__.mode=='pop'">
            <el-switch v-model="activeData.__config__.editDisable" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="currentIconModel.icon" @select="setIcon" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { isArray } from 'util'
import TreeNodeDialog from '@/views/index/TreeNodeDialog'
import { isNumberStr } from '@/utils/index'
import IconsDialog from '@/components/IconsDialog'
import {
  inputComponents, selectComponents
} from '@/components/generator/config'
import { saveFormConf } from '@/utils/db'
import drawingDefalut from '@/components/generator/drawingDefalut'

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce']

export default {
  components: {
    TreeNodeDialog,
    IconsDialog,
    draggable
  },
  props: ['showField', 'activeData', 'formConf','drawListObj'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: {}
    }
  },
  computed: {
    isFlow(){
      let res = this.$route.name=='flow'
      if(res){
        if(!this.formConf.fixBtns){
          this.$set(this.formConf,'fixBtns',{
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
                "needValid": false,
                "beforeSubmit": "",
                "icon":"el-icon-close"
            },
            "transfer": {
                "type": "Transfer",
                "show": true,
                "title": "转办",
                "needValid": false,
                "beforeSubmit": "",
                "icon":"el-icon-right"
            }
          })
        }
      }
      return res
    },
    // documentLink() {
    //   return (
    //     this.activeData.__config__.document
    //     || 'https://element.eleme.cn/#/zh-CN/component/installation'
    //   )
    // },
    // dateOptions() {
    //   if (
    //     this.activeData.type !== undefined
    //     && this.activeData.__config__.tag === 'el-date-picker'
    //   ) {
    //     if (this.activeData['start-placeholder'] === undefined) {
    //       return this.dateTypeOptions
    //     }
    //     return this.dateRangeTypeOptions
    //   }
    //   return []
    // },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponents
        },
        {
          label: '选择型组件',
          options: selectComponents
        }
      ]
    },
  },
  watch: {
    formConf: {
      handler(val) {
        //saveFormConf(val)
      },
      deep: true
    },
    // 'activeData.defaultValueType':{
    //   handler(v){
    //     this.defaultValueTypeChange(v)
    //   },
    //   // immediate:true,
    // },
    // 'activeData.jsGetOptions':{
    //   handler(v){
    //     this.jsGetOptionsChange(v)
    //   },
    //   // immediate:true,
    // },
    // 'activeData.optionsType':{
    //   handler(v){
    //     this.optionsTypeChange(v)
    //   },
    //   // immediate:true,
    // }
  },
  methods: {
    setIcon(val) {
      this.currentIconModel.icon = val
    },
    openIconsDialog(item) {
      this.iconsVisible = true
      this.currentIconModel = item
    },
    addReg() {
      if(!Array.isArray(this.activeData.__config__.rules)){
        this.$set(this.activeData.__config__,'rules',[])
      }
      this.activeData.__config__.rules.push({
        regexp: '',
        message: ''
      })
    },
    addAttr(){
      if(!Array.isArray(this.activeData.__config__.attributes)){
        this.$set(this.activeData.__config__,'attributes',[])
      }
      this.activeData.__config__.attributes.push({
        name: '',
        value: ''
      })
    },
    addSelectItem() {
      if(!Array.isArray(this.activeData.__config__.options)){
        this.$set(this.activeData.__config__,'options',[])
      }
      if(this.activeData.optionsType=='value'){
        this.activeData.__config__.options.push('')
      }
      else if(this.activeData.optionsType=='object'){
        this.activeData.__config__.options.push({
          [this.activeData.__config__.labelKey]: '',
          [this.activeData.__config__.valueKey]: ''
        })
      }
    },
    addAddressBookSelectUser(){
      if(!this.activeData.__config__.selectedUserIds||!Array.isArray(this.activeData.__config__.selectedUserIds)){
        this.$set(this.activeData.__config__,'selectedUserIds',[])
      }
      this.activeData.__config__.selectedUserIds.push('')
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date()
      }
    },
    settingAutoSizeChange(val){
      if(val){
        this.$set(this.activeData.__config__,'autoSize',{minHeight:48,maxHeight:''})
      }
      else{
        this.$set(this.activeData.__config__,'autoSize',true)
      }
    },
    timePickerTypeChange(val){
      if(val==='date'){
        this.$set(this.activeData.__config__,'formatStr','YYYY-MM-DD')
      }
      else if(val=='datetime'){
        this.$set(this.activeData.__config__,'formatStr','YYYY-MM-DD HH:mm')
      }
      else if(val=='time'){
        this.$set(this.activeData.__config__,'formatStr','HH:mm')
      }
    },
    optionsTypeChange(val){
      if(this.activeData.jsGetOptions){
        this.$set(this.activeData.__config__,'options','')
      }
      else{
        this.$set(this.activeData.__config__,'options',[])
      }
    },
    defaultValueTypeChange(val){
      if(val=='value'){
        this.$set(this.activeData.__config__,'value','')
      }
      else{
        this.$set(this.activeData.__config__,'value',{showValue:'',value:''})
      }
    },
    jsGetOptionsChange(val){
      if(val){
        this.$set(this.activeData.__config__,'options','')
      }
      else{
        this.$set(this.activeData.__config__,'options',[])
      }
    },
    addCascaderselectItem(){
      if(!Array.isArray(this.activeData.__config__.options)){
       this.$set(this.activeData.__config__,'options',[])
      }
      this.activeData.__config__.options.push({})
    },
    showDescPopChange(val){
      if(val){
        if(!this.formConf.descPopSetting){
          this.$set(this.formConf,'descPopSetting',{})
        }
        this.$set(this.formConf.descPopSetting,'popBtnTitle','注意事项')
        this.$set(this.formConf.descPopSetting,'title','')
        this.$set(this.formConf.descPopSetting,'popHeight','')
        this.$set(this.formConf.descPopSetting,'content','')
      }
      else{
        delete this.formConf.descPopSetting
      }
    },
    addCustomerBtn(){
      if(!Array.isArray(this.formConf.customerBtns)){
       this.$set(this.formConf,'customerBtns',[])
      }
      if(!this.isFlow){
        this.formConf.customerBtns.push({
            "title":"", //按钮标题
            "type":"", //按钮类型，点击按钮时提交的操作类型
            "showState":[],//显示场景：add 新增，edit 修改
            "needValid":false,//表单是否需要校验，默认为false
            "style":"" //自定义按钮样式
        })
      }
      else{
        this.formConf.customerBtns.push({
            "title":"", //按钮标题
            "type":"", //按钮类型，点击按钮时提交的操作类型
            "clickFunc":"",//点击事件
            "style":"" ,//自定义按钮样式
            "icon":""
        })
      }
    },
    addModuleBtn(){
      // if(!Array.isArray(this.drawList)){
      //  this.drawList=[]
      // }
      this.drawListObj.list.push({
          "module":"模块信息",
          "active": true, 
          "class":"",
          "params":[]
      })
    },
    async showAsModuleChange(val){
      try{
        if(this.drawListObj.list&&this.drawListObj.list.length){
          await this.$confirm('此操作将丢失已有设计, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
        }
        if(val){
            this.drawListObj.list=[]
            this.drawListObj.list.push({
                "module":"模块信息",
                "active": true, 
                "class":"",
                "params":[]
            })
        }
        else{
            this.drawListObj.list=drawingDefalut
        }
      }
      catch(e){
        this.formConf.showAsModule=!this.formConf.showAsModule
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  // width: 400px;
  // margin-left:860px;
  position: absolute;
  left:860px;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
.casca-select-item{
  margin-top:10px;
  background-color:#CFD6DF;
  padding:10px;
  padding-top:40px;
  position:relative;
  .close-btn{
    position:absolute;
    right:5px;
    top:5px;
  }
}
</style>
