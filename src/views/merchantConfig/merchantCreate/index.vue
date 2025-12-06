<template>
    <!-- 商户创建 -->
    <div class="enterCreate">
        <p v-if="state.merchantId">商户修改</p>
        <p v-else>商户创建</p>
        <div class="createForm">
            <el-form label-position="right" :model="state.form" ref="formRef" :rules="state.rules" label-width="250px">

                <el-form-item label="经营国家（短信区号）:" prop="countryCode">
                    <el-select style="width: 200px" v-model="state.form.countryCode" placeholder="请选择经营国家" @change="countryChange"
                        :disabled="!!state.merchantId">
                        <el-option v-for="item in state.countryList" :key="item.value" :label="`${item.value} ${item.label}`" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言选择:" prop="languages">
                    <el-checkbox-group v-model="state.form.languages" :max="state.form.countryCode == 'UZ' ? 999 : 3" :min="1"
                        :disabled="!!state.merchantId">
                        <el-checkbox v-for="item in state.languageList" :disabled="item.value == 0" :key="item.value" :label="+item.value"
                            :value="+item.value">
                            {{ item.label }}
                            <span v-if="state.countryMap[item.value]">({{ state.countryMap[item.value] }})</span>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="货币选择:" prop="languages">
                    <el-select style="width: 200px" v-model="state.form.currency" placeholder="请选择货币" @change="currencyChange"
                        :disabled="!!state.merchantId">
                        <el-option v-for="item in state.currencyList" :key="item.value" :label="(() => {
                            const match = state.curLanCountrysNew.find(i => i.labelCur === item.value);
                            return `${item.label}(${match ? match.labelCurName : ''})`;
                        })()" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="服务器（OSS厂商）:" prop="serverVendor">
                    <el-radio-group v-model="state.form.serverVendor" :disabled="!!state.merchantId">
                        <el-radio v-for="item in state.serverVendorList" :label="item.value" :value="item.value" :key="item.value">{{ item.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="支付通道配置:">
                    <el-button size="small" v-throttle type="primary" @click="editPayConfig">选择配置</el-button>
                    <div :class="{'game-select': state.form.payConfigs?.length}">
                        <div class="game-box" style="margin-bottom: 10px;" v-if="state.form.payConfigs?.length">
                            <span class="game-box-small pr" v-for="(item,index) in state.form.payConfigs">
                                {{getPayName(item)}}
                                <span class="game-box-icon pointer pa" @click="deletePay(index)">
                                    <el-icon :size="18">
                                        <CircleCloseFilled />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="登录方式配置:">
                    <el-checkbox-group v-model="state.form.loginWays">
                        <el-checkbox v-for="(item,index) in state.loginWayConfig" :value="item.value" :label="item.value"
                            :disabled="state.form.disabledLoginWays?.includes(item.value)">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="皮肤管理:">
                    <el-button size="small" v-throttle type="primary" @click="state.showSkinManageDialog = true">选择配置</el-button>
                    <span style="color: red" v-if="!state.merchantId">（注：如选择创建菲律宾商户，且勾选了定制版皮肤模版，那么商户的第一个站点的皮肤模版默认为定制版，且不可更改。）</span>
                    <div :class="{'game-select': state.form.skins?.length}">
                        <div class="game-box" style="margin-bottom: 10px;" v-if="state.form.skins?.length">
                            <span v-for="(item,index) in state.form.skins">
                                <span class="game-box-small pr" v-for="(colors,colorsIndex) in item.colors">
                                    {{getSkinsName(item,colors,item.colors)}}
                                    <span class="game-box-icon pointer pa" @click="deleteSkins(index,colorsIndex)"
                                        v-if="(!state.form.disabledSkins || (!state.form.disabledSkins[index]?.colors.includes(colors)) && state.form.disabledSkins[index]?.colors[0] !== 0)">
                                        <el-icon :size="18">
                                            <CircleCloseFilled />
                                        </el-icon>
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="活动配置:">
                    <el-button size="small" v-throttle type="primary" @click="openActivityPanel">选择配置</el-button>
                    <div :class="{'game-select': state.form.promotionTypes?.length}">
                        <div class="game-box" style="margin-bottom: 10px;" v-if="state.form.promotionTypes?.length">
                            <template v-for="(item,index) in state.form.promotionTypes">
                                <span class="game-box-small pr" v-if="getActiveName(item)">
                                    {{getActiveName(item)}}
                                    <span class="game-box-icon pointer pa" @click="deleteActive(index)">
                                        <el-icon :size="18">
                                            <CircleCloseFilled />
                                        </el-icon>
                                    </span>
                                </span>
                            </template>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="RTP抽成模式:" prop="commissionMode">
                    <el-radio-group v-model="state.form.commissionMode">
                        <el-radio :label="1" :value="1">损益模式</el-radio>
                        <el-radio :label="2" :value="2">打码模式</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="state.form.commissionMode === 2">
                    <el-form-item label="电子:">
                        <el-form-item label="rtp＞100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.PGC.rtpUpRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                        <el-form-item label="rtp＜100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.PGC.rtpDnRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="电子:">
                        <el-form-item label="rtp＞100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.NJL.rtpUpRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                        <el-form-item label="rtp＜100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.NJL.rtpDnRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="电子:">
                        <el-form-item label="rtp＞100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.NPP.rtpUpRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                        <el-form-item label="rtp＜100抽成(%):" label-width="140px">
                            <el-input-number class="inputWidth" v-model="state.form.NPP.rtpDnRate" placeholder="请输入(0-100)范围内的值" :min="0" :max="100"
                                :controls="false" :precision="4" />
                        </el-form-item>
                    </el-form-item>
                </template>
                <el-form-item label="使用经销商配置:" v-if="!state.merchantId">
                    <el-switch v-model="state.isUse" :active-value="true" :inactive-value="false" />
                </el-form-item>
                <el-form-item label="控赢开关:" v-if="state.form.commissionMode === 1">
                    <el-checkbox v-model="state.form.ctrlWinEnabled"></el-checkbox>
                    勾选开启（选择损益模式下，可勾选此开关，将可配置控赢RTP）
                </el-form-item>
                <el-form-item label="VIP余额配置">
                    <el-button size="small" v-throttle type="primary" @click="editVipConfig">选择配置</el-button>
                    <div :class="{'game-select': state.form.vipLimits?.length}">
                        <el-table :data="state.form.vipLimits" tooltip-effect="dark" border v-if="state.form.vipLimits?.length" style="width: 300px;">
                            <el-table-column prop="level" label="vip等级" align="center" />
                            <el-table-column prop="balanceLimit" label="余额上限" align="center" />
                        </el-table>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="游戏厂家:" v-if="state.vendorList.length>0 && state.form.commissionMode !== 2">
                    <div>
                        <el-table :data="state.vendorList" border fit height="400px" scrollbar-always-on table-layout="auto">
                            <el-table-column prop="id" width="100" label="ID" align="center" />
                            <el-table-column prop="name" width="100" label="游戏厂家" align="center" />
                            <el-table-column prop="type_" width="100" label="游戏类型" align="center" />
                            <el-table-column prop="shareRate" width="150" label="厂家抽成" align="center" />
                            <el-table-column prop="merchantShareRate" width="150" label="平台对商户抽成" align="center">
                                <template #default="{row}">
                                    <el-input-number v-model="row.merchantShareRate" :step="0.1" :min="row.shareRate">
                                    </el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" width="100" label="厂家开关" align="center">
                                <template #default="scoped">
                                    <el-switch v-model="scoped.row.status" :active-value="1" :inactive-value="0" :disabled="scoped.row.enable">
                                    </el-switch>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item> -->
                <el-form-item label="游戏厂家:"
                    v-if="(state.vendorListNoPGC.length>0 && state.form.commissionMode == 2) || (state.vendorList.length>0 && state.form.commissionMode !== 2)">
                    <div>
                        <el-table :data="state.form.commissionMode == 2 ? state.vendorListNoPGC : state.vendorList" border fit height="400px">
                            <el-table-column prop="id" width="100" label="ID" align="center" />
                            <el-table-column prop="name_" width="150" label="游戏厂家" align="center" />
                            <el-table-column prop="type_" width="100" label="游戏类型" align="center" />
                            <el-table-column prop="shareRate" width="100" label="厂家抽成" align="center" />
                            <el-table-column prop="merchantShareRate" width="180" label="平台对商户抽成" align="center">
                                <template #default="{row}">
                                    <el-input-number v-model="row.merchantShareRate" :step="0.1" :min="row.shareRate">
                                    </el-input-number>
                                </template>
                            </el-table-column>
                            <el-table-column prop="status" width="100" label="厂家开关" align="center">
                                <template #default="scoped">
                                    <el-switch v-model="scoped.row.status" :active-value="1" :inactive-value="0" :disabled="scoped.row.enable">
                                    </el-switch>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form-item>
                <el-form-item label="费用配置:">
                    <div class="feeBox">
                        <div class="feeBox-title">
                            <div>开版费</div>
                            <div>线路费用</div>
                            <div>月底保底额</div>
                        </div>
                        <div class="feeBox-list">
                            <div>
                                <el-input-number v-model="state.form.openFee" placeholder="请输入开版费" :controls="false" :precision="0" :min="0"
                                    :disabled="!!state.merchantId" />
                            </div>
                            <div>
                                <el-input-number v-model="state.form.lineCost" placeholder="请输入线路费用" :controls="false" :precision="0" :min="1"
                                    :disabled="!!state.merchantId" />
                            </div>
                            <div>
                                <el-input-number v-model="state.form.monthMin" placeholder="请输入月底保底额" :controls="false" :precision="0" :min="1"
                                    :disabled="!!state.merchantId" />
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="费用总计:">
                    <span>{{ totalFee  }}</span>
                </el-form-item>
                <el-form-item label="初始授信额度:">
                    <el-input-number class="inputWidth" v-model="state.form.initOverdraft" placeholder="请输入初始授信额度" :controls="false" :min="0"
                        :disabled="!!state.merchantId" />
                </el-form-item>
                <el-form-item label="导入指定商户配置:" v-if="!state.merchantId">
                    <el-radio-group style="margin-right: 10px" v-model="state.isAssign">
                        <el-radio :label="false" :value="false">不指定</el-radio>
                        <el-radio :label="true" :value="true">指定
                        </el-radio>
                    </el-radio-group>
                    <el-form-item prop="orgMerchantId" v-if="state.isAssign">
                        <el-input-number v-model="state.form.orgMerchantId" placeholder="请输入商户ID" :controls="false" :precision="0" :min="1" />
                    </el-form-item>
                </el-form-item>
                <el-form-item label="商户名称:" prop="merchantName">
                    <el-input class="inputWidth" v-model="state.form.merchantName" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item label="站点名称:" prop="name">
                    <el-input class="inputWidth" v-model="state.form.name" placeholder="请输入站点名称"></el-input>
                </el-form-item>
                <el-form-item label="商户后台登录账号:" prop="username">
                    <el-input class="inputWidth" v-model="state.form.username" placeholder="请输入商户后台登录账号" :disabled="!!state.merchantId"></el-input>
                </el-form-item>
                <el-form-item label="初始密码:" prop="password" v-if="!state.merchantId">
                    <el-input class="inputWidth" v-model="state.form.password" placeholder="请输入初始密码"></el-input>
                </el-form-item>
                <el-form-item label="允许创建子站点数量:" prop="maxMerchantNum">
                    <el-input class="inputWidth" maxlength="4" v-model="state.form.maxMerchantNum" placeholder="请输入子站点数量0~9999"></el-input>
                </el-form-item>
                <el-form-item label="额度使用结束:">
                    <div style="width: 100%;">
                        <el-radio :value="1" :label="1" v-model="state.form.quotaConfig.maintain"
                            @click.native.prevent="handleRadioChange(state.form.quotaConfig.maintain)">挂维护（勾选后,商户余额（包含授信额度）使用结束,自动变成维护状态,可勾选发送通知）
                        </el-radio>
                    </div>
                    <div>
                        <el-checkbox :disabled="!state.form.quotaConfig.maintain" :value="1" :label="1"
                            v-model="state.form.quotaConfig.notifyBusiness">通知商务tg通知</el-checkbox>
                        <el-checkbox :disabled="!state.form.quotaConfig.maintain" :value="1" :label="1"
                            v-model="state.form.quotaConfig.notifyMerchant">通知商户tg通知</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="所属商务联系昵称（telegram）">
                    <el-input class="inputWidth" v-model="state.form.quotaConfig.businessName" placeholder="请输入所属商务联系昵称"></el-input>
                </el-form-item>
                <el-form-item label="所属商务联系方式（telegram）">
                    <template #label>
                        <div @click="state.showExplainDialog = true" class="angentExplainDiv">所属商务联系方式（telegram）<el-icon class="angentExplain">
                                <QuestionFilled />
                            </el-icon>:
                        </div>
                    </template>
                    <template #default>
                        <el-input class="inputWidth" v-model="state.form.quotaConfig.businessTelegram" placeholder="请输入所属商务联系方式"></el-input>
                        （注：需要TG绑定https://t.me/MerchantsNotifyBot 机器人）
                    </template>
                </el-form-item>
                <el-form-item label="商户联系方式（telegram）">
                    <template #label>
                        <div @click="state.showExplainDialog = true" class="angentExplainDiv">商户联系方式（telegram）<el-icon class="angentExplain">
                                <QuestionFilled />
                            </el-icon>:
                        </div>
                    </template>
                    <el-input class="inputWidth" v-model="state.form.quotaConfig.merchantTelegram" placeholder="请输入商户联系方式"></el-input>
                    （注：需要TG绑定https://t.me/MerchantsNotifyBot 机器人）
                </el-form-item>
                <el-form-item label="介绍人商户ID">
                    <div style="width: 100%;">
                        <el-input class="inputWidth" v-model="state.form.invite.inviteMerchantId"
                            @input="(val) => state.form.invite.inviteMerchantId = val.replace(/\D/g,'')" placeholder="请输入介绍人商户ID"
                            :disabled="!!state.merchantId"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="介绍人所属地区">
                    <el-select style="width: 300px" v-model="state.form.invite.inviteRegion" placeholder="请选择介绍人所属地区" :disabled="!!state.merchantId"
                        clearable>
                        <el-option v-for="item in state.appRegion" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="月贡献返佣比例">
                    <el-input class="inputWidth" v-model="state.form.invite.rate" placeholder="请输入月贡献返佣比例"
                        :disabled="!!!state.form.invite.inviteMerchantId && !!state.merchantId"></el-input>
                </el-form-item>
                <el-form-item label="开版费返现金额">
                    <el-input class="inputWidth" v-model="state.form.invite.openRebate" placeholder="请输入开版费返现金额" :disabled="!!state.merchantId">
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <div class="submitBtn">
                        <el-button v-throttle type="primary" @click="handleSubmit(formRef)">{{state.merchantId ? '立即保存' : '立即创建'}}</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <ActiveConfigDialog :promotionTypes="state.form.promotionTypes" :typesData="state.typesData" v-if="state.showActiveConfigDialog"
            @close="state.showActiveConfigDialog = false" @setData="(val)=>{ state.form.promotionTypes = val}"></ActiveConfigDialog>
        <VipConfigDialog :currency="state.form.currency" :vipLimits="state.form.vipLimits" v-if="state.showVipConfigDialog"
            @close="state.showVipConfigDialog = false" @setData="(val)=>{ state.form.vipLimits = val}">
        </VipConfigDialog>
        <SkinManageDialog :skins="state.form.skins" :disabledSkins="state.form.disabledSkins" :countryCode="state.form.countryCode || ''"
            :templateType="state.templateType" v-if="state.showSkinManageDialog" @close="state.showSkinManageDialog = false"
            @setData="(val)=>{ state.form.skins = val}">
        </SkinManageDialog>
        <PaymentConfigDialog :currency="state.form.currency" :payConfigs="state.form.payConfigs" :payChannelList="state.payDataList"
            v-if="state.showPaymentConfigDialog && state.payDataList" @close="state.showPaymentConfigDialog = false"
            @setData="(val)=>{ state.form.payConfigs = val}"></PaymentConfigDialog>
        <Explain v-if="state.showExplainDialog && state.payDataList" @close="state.showExplainDialog = false"></Explain>
    </div>
</template>

<script setup name="merchantCreate">
import { reactive, ref, onMounted, computed, defineAsyncComponent, watch } from 'vue'
import { commonMetasApi, getPayChannelList } from '@/api/common.js'
import { merchantAdd, getTypesData, getMerchantConfig, editMerchantConfig, getTypesDataByCountry } from '@/api/merchantConfig.js'
import { getRiskList } from '@/api/systemSettings.js'
import { getvendorList } from '@/api/factory.js'
import { getVipLimitConfig } from '@/api/merchantConfig.js'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { add, deepCopy } from '@/common/util/index.js'
import { TEMPLATE_STYLE_DATA } from "@/common/source_map/index.js";

const ActiveConfigDialog = defineAsyncComponent(() => import("./components/ActiveConfigDialog.vue"))
const VipConfigDialog = defineAsyncComponent(() => import("./components/VipConfigDialog.vue"))
const SkinManageDialog = defineAsyncComponent(() => import("./components/SkinManageDialog.vue"))
const PaymentConfigDialog = defineAsyncComponent(() => import("./components/PaymentConfigDialog.vue"))
const Explain = defineAsyncComponent(() => import("./components/Explain.vue"))

const skinKeyTitle = {
    1: 'A样式-',
    2: 'B样式-',
    4: 'C样式-',
    5: 'D样式-'
}
const router = useRouter()
const route = useRoute()
const state = reactive({
    isAssign: false,
    isUse: false,
    form: {
        languages: [0],
        serverVendor: '1', //服务器厂商
        vendors: {},
        agentMode: '1', // 代理默认打码模式
        // ctrlMode: 0,
        dealerMode: 3,
        openFee: 0,
        commissionMode: 1,
        // rtpDnRate: '',
        // rtpUpRate: '',
        PGC: {},
        NJL: {},
        NPP: {},
        quotaConfig: {
            maintain: null,
            notifyBusiness: false,
            notifyMerchant: false
        },
        invite: {},
        countryMap: {},
        maxMerchantNum: ''
    },
    rules: {
        languages: [{ required: true, message: '请选择语言', trigger: 'change' }],
        merchantName: [{ required: true, message: '商户名称不可为空', trigger: 'change' }],
        name: [{ required: true, message: '站点名称不可为空', trigger: 'change' }],
        username: [{ required: true, message: '商户后台登录账号不可为空', trigger: 'change' }],
        // ctrlMode: [{ required: true, message: '请选择控制模式！', trigger: 'change' }],
        commissionMode: [{ required: true, message: '请选择RTP抽成模式！', trigger: 'change' }],
        password: [{ required: true, message: '初始密码不可为空', trigger: 'change' }],
        agentMode: [{ required: true, message: '未选择代理模式', trigger: 'change' }],
        countryCode: [{ required: true, message: '未选择经营国家', trigger: 'change' }],
        serverVendor: [{ required: true, message: '未选择服务器厂商', trigger: 'change' }],
        orgMerchantId: [{ required: true, message: '请输入商户ID', trigger: 'change' }],
        maxMerchantNum: {
            validator: (rule, value, callback) => {
                if (value) {
                    if (!/^\d{1,4}$/.test(value)) {
                        callback(new Error('请输入0~9999正整数'))
                        return
                    }
                }
                callback()
            },
            trigger: 'change'
        },
    },
    serverVendorList: [], //服务器厂商列表
    languageList: [], //语言列表
    currencyList: [], //货币数组
    countryList: [], //经营国家数组
    vendorList: [], //厂商列表
    vendorListNoPGC: [], //厂商列表(过滤PGC厂商)
    dealerModeList: [], //经销商模式
    templateType: [],
    typesData: [],
    loginWay: [],
    payDataList: null,
    showActiveConfigDialog: false,
    showVipConfigDialog: false,
    showSkinManageDialog: false,
    showPaymentConfigDialog: false,
    showExplainDialog: false,
    inviteMerchant: {},
    merchantConfig: {},
    merchantId: route.query.id, // 是否编辑，编辑有商户ID
    originalSkins: [],
    curLanCountrysNew: [],
})
state.newForm = deepCopy(state.form)
const formRef = ref(null)

const totalFee = computed(() => {
    if (typeof state.form.openFee === 'number' && state.form.lineCost && state.form.monthMin) {
        return add(
            state.form.openFee,
            state.form.lineCost,
            state.form.monthMin,
        )
    }
})

const promotionTypeList = computed(() => {
    return state.typesData.map(item => +item.value)
})

onMounted(async () => {
    try {
        globalVBus.$emit('globalLoading', true)
        const { code, data } = await commonMetasApi({
            types: 'language,currency,country,serverVendor,loginWayConfig,appRegion,templateType,curLanCountry',
        })
        if (!code) {
            state.languageList = data.language || []
            state.currencyList = data.currency || []
            state.countryList = data.country || []
            state.serverVendorList = data.serverVendor || []
            state.dealerModeList = data.dealerMode || []
            state.loginWayConfig = data.loginWayConfig || []
            state.appRegion = data.appRegion || []
            state.templateType = data.templateType ? data.templateType.filter(item => +item.value !== 3) : []
            state.form.loginWays = state.loginWayConfig.map((item) => {
                return item.value
            })
            if (data.curLanCountry) {
                state.curLanCountrysNew = data.curLanCountry.map(item => {
                    const labelCode = item.label.split('-')[0]
                    const labelCur = item.label.split('-')[1]
                    const labelCurName = item.label.split('-')[2]
                    return {
                        ...item,
                        labelCode,
                        labelCur,
                        labelCurName
                    }
                })
                state.languageList.forEach(item => {
                    state.curLanCountrysNew.forEach(cur => {
                        if (item.value === cur.labelCode) {
                            const match = item.label.match(/\((.*?)\)$/);
                            if (match) {
                                let newContent = item.value === '0' ? `英语${match[1] ? ', ' + match[1] : ''}` : match[1];
                                item.label = item.label.replace(/\((.*?)\)$/, `(${newContent}${newContent ? ', ' : ''}${cur.labelCurName})`);
                            } else {
                                const prefix = item.value === '0' ? '英语' : '';
                                const separator = prefix ? ', ' : '';
                                item.label += `(${prefix}${separator}${cur.labelCurName})`;
                            }
                        }
                    })
                })
                state.countryMap = data.curLanCountry
                state.countryMap = data.curLanCountry.reduce((acc, cur) => {
                    acc[cur.value] = {
                        label: cur.label,
                        labelCur: cur.label.split('-')[1]
                    }
                    return acc
                }, {})
            }
        }
        const res = await getRiskList({ level: 1 })
        if (res.code == 0) {
            state.form.initOverdraft =
                res.ext && res.ext.overdraft ? +res.ext.overdraft : undefined
        }
        // let typeData = await getTypesData()
        // state.typesData = typeData.data
        let payData = await getPayChannelList()
        state.payDataList = payData.data
        setMerchantConfigData()
    } catch (error) {
        globalVBus.$emit('globalLoading', false)
    }

})

const setMerchantConfigData = () => {
    if (state.merchantId) {
        getMerchantConfig({
            merchantId: state.merchantId
        }).then(async (res) => {
            state.merchantConfig = res.data
            state.form = {
                languages: res.data.merchant?.languages.split(',').map((item) => { return Number(item) }),
                currency: res.data.info?.currency,
                countryCode: res.data.merchant?.countryCodes,
                serverVendor: res.data.info?.serverVendor == '亚马逊' ? '1' : '2',
                payConfigs: res.data.payChannel?.map((item) => { return { l: item.setting.l, c: item.setting.c, r: item.setting.r } }),
                loginWays: res.data.attachConfig?.loginWays.map((item) => { return item.toString() }),
                skins: res.data.attachConfig?.skins,
                promotionTypes: res.data.attachConfig?.promotionTypes,
                commissionMode: res.data.merchant?.commissionMode,
                NJL: { rtpDnRate: res.data.NJL?.rtpDnRate, rtpUpRate: res.data.NJL?.rtpUpRate },
                PGC: { rtpDnRate: res.data.PGC?.rtpDnRate, rtpUpRate: res.data.PGC?.rtpUpRate },
                NPP: { rtpDnRate: res.data.NPP?.rtpDnRate, rtpUpRate: res.data.NPP?.rtpUpRate },
                ctrlWinEnabled: res.data.ctrlWinEnabled ? true : false,
                vipLimits: res.data.vipLimits?.map((item) => { return { balanceLimit: item.balanceLimit, level: item.level } }),
                openFee: res.data.info?.openFee,
                lineCost: res.data.info?.lineCost,
                monthMin: res.data.info?.monthMin,
                initOverdraft: res.data.site?.overdraftAmount,
                merchantName: res.data.merchant?.name,
                name: res.data.merchant?.siteName,
                username: res.data.empUsername,
                quotaConfig: {
                    maintain: res.data.attachConfig?.quotaConfig?.maintain,
                    notifyBusiness: res.data.attachConfig?.quotaConfig?.notifyBusiness == 1 ? true :
                        false,
                    notifyMerchant: res.data.attachConfig?.quotaConfig?.notifyBusiness == 1 ? true :
                        false,
                    businessName: res.data.attachConfig?.quotaConfig?.businessName,
                    businessTelegram: res.data.attachConfig?.quotaConfig?.businessTelegram,
                    merchantTelegram: res.data.attachConfig?.quotaConfig?.merchantTelegram,
                },
                invite: res.data.invite || {},
                maxMerchantNum: res.data.ext?.maxMerchantNum
            }
            state.form.currency = state.form.currency === 'USDT' ? 'UST' : state.form.currency
            state.form.disabledLoginWays = deepCopy(state.form.loginWays)
            state.form.disabledSkins = deepCopy(state.form.skins)
            if (!state.form.skins.some(item => item.type === 4)) {
                state.form.skins.push({ type: 4, colors: [] })
            }
            // if (state.form.skins.every(item => item.type !== 4) && state.form.countryCode === 'PH') state.form.skins.push({ type: 4, colors: [] })
            state.form.skins.forEach((item) => { if (item.colors && item.colors[0] === 0) { item.colors = TEMPLATE_STYLE_DATA[item.type].map((it) => { return it.value }) } })
            await currencyChange(state.form.currency, false, true)
            if (res.data.merchant.commissionMode == 2) {
                state.vendorListNoPGC.forEach((item) => {
                    item.status = 0
                    res.data.vendors.forEach((it) => { if (item.id === it.vendorId) { item.merchantShareRate = it.shareRate; item.enable = it.enable; item.status = 1 } })
                })
            } else {
                state.vendorList.forEach((item) => {
                    item.status = 0
                    res.data.vendors.forEach((it) => { if (item.id === it.vendorId) { item.merchantShareRate = it.shareRate; item.enable = it.enable; item.status = 1 } })
                })
            }

            getActivityByCountry(state.form.countryCode, true)
        }).catch(() => {
            globalVBus.$emit('globalLoading', false)
        })
    } else {
        state.form.promotionTypes = state.typesData.map(item => { return +item.value })
        //  let arr = Object.keys(TEMPLATE_STYLE_DATA).filter(item => +item !== 4)
        let arr = Object.keys(TEMPLATE_STYLE_DATA)
        state.form.skins = arr.map(key => {
            const colors = []
            TEMPLATE_STYLE_DATA[key].forEach((item) => {
                colors.push(item.value)
            })
            return { type: +key, colors: colors }
        })
        globalVBus.$emit('globalLoading', false)
        state.originalSkins = deepCopy(state.form.skins)
    }
}

const handleCountryCodeChange = (val) => {
    if (val === 'AR' || val === 'CO' || val === 'UZ') {
        state.form.skins = state.form.skins.filter(item => +item.type !== 4 && +item.type !== 5);
    } else {
        state.form.skins = state.originalSkins;
    }
}

// 城市变化
const countryChange = (val) => {
    const countryLanguageMap = {
        'NG': 0,
        'PH': 5,
        'ID': 4,
        'IN': 6,
        'VN': 7,
        'PK': 8,
        'BD': 9,
        'MX': 10,
        'AR': 10,
        'CO': 10,
    };

    const languageValue = countryLanguageMap[val];
    if (languageValue && state.form.languages.every((item) => item !== languageValue)) {
        state.form.languages = [0, languageValue];
    }

    if (state.form.countryCode == 'UZ') {
        state.form.loginWays = state.loginWayConfig.filter((item) => { return item.value != '0' }).map((item) => { return item.value })
        state.form.disabledLoginWays = ['0']
    } else {
        state.form.loginWays = state.loginWayConfig.map((item) => { return item.value })
        state.form.disabledLoginWays = []
    }

    getActivityByCountry(val)
    handleCountryCodeChange(val)
}

const getActivityByCountry = (country, isInit = false) => {
    state.typesData = []
    if (!isInit) {
        state.form.promotionTypes = []
    }
    getTypesDataByCountry({ country }).then(res => {
        const { code, data } = res
        if (code === 0) {
            state.typesData = data
        } else {
            state.typesData = []
        }
    }).catch(err => {
        state.typesData = []
    })
}

const openActivityPanel = () => {
    if (!state.form.countryCode) {
        return ElMessage.warning('请先选择经营国家')
    }
    state.showActiveConfigDialog = true
}

// 货币变化
const currencyChange = async (val, isClearVipLimits = true, isInit = false) => {
    if (val) {
        try {
            !isInit && globalVBus.$emit('globalLoading', true)
            let { data, code } = await getvendorList({ currency: val, _size: 200, countryFailure: false })
            if (code === 0) {
                if (isClearVipLimits) {
                    getVipLimitConfig({ currency: val }).then(({ data }) => {
                        state.form.vipLimits = data
                    })
                }
                state.vendorList = data.list?.filter(item => item.alias !== 'PP_') || []
                state.vendorListNoPGC = data.list?.filter((item) => { return item.alias != 'PGC' && item.alias != 'NJL' && item.alias != 'NPP' && item.alias != 'PP_' }) || []
                if (!state.merchantId) {
                    state.vendorList.forEach((item) => {
                        item.status = 1
                        item.merchantShareRate = item.shareRate + 2
                    })
                    state.vendorListNoPGC.forEach((item) => {
                        item.status = 1
                        item.merchantShareRate = item.shareRate + 2
                    })
                }
            }
            globalVBus.$emit('globalLoading', false)
        } catch (err) {
            globalVBus.$emit('globalLoading', false)
        }
    }
}

const editVipConfig = () => {
    if (!state.form.currency) {
        return ElMessage.warning('请先选择货币')
    }
    state.showVipConfigDialog = true
}


const editPayConfig = () => {
    if (!state.form.currency) {
        return ElMessage.warning('请先选择货币')
    }
    state.showPaymentConfigDialog = true
}

const handleRadioChange = (value) => {
    if (state.form.quotaConfig.maintain) {
        state.form.quotaConfig.maintain = null;
        state.form.quotaConfig.notifyBusiness = false
        state.form.quotaConfig.notifyMerchant = false
    } else {
        state.form.quotaConfig.maintain = 1;
    }
}

const getPayName = (item) => {
    var name = ''
    state.payDataList && state.payDataList[1]?.forEach((it) => {
        if (it.setting.l === item.l) name = it.label
    })
    state.payDataList && state.payDataList[2]?.forEach((it) => {
        if (it.setting.l === item.l) name = it.label
    })
    return name
}
const deletePay = (index) => {
    state.form.payConfigs.splice(index, 1)
}


const getSkinsName = (item, colors) => {
    var name = ''
    TEMPLATE_STYLE_DATA[item.type].forEach((it) => {
        if (it.value === colors) {
            name = skinKeyTitle[item.type] + it.title
        }
    })
    return name
}
const deleteSkins = (index, colorsIndex) => {
    state.form.skins[index].colors.splice(colorsIndex, 1)
}


const getActiveName = (item) => {
    var name = ''
    state.typesData.forEach((it) => {
        if (it.value == item) {
            name = it.label
        }
    })
    return name
}
const deleteActive = (index) => {
    state.form.promotionTypes.splice(index, 1)
}

//立即创建
const handleSubmit = (el) => {
    // if(!state.isAssign && !state.form.payConfigs?.length) return ElMessage.warning('请选择支付通道配置')
    // if(!state.isAssign && !state.form.skins?.length) return ElMessage.warning('请选择皮肤管理')
    // if(!state.isAssign && !state.form.promotionTypes?.length) return ElMessage.warning('请选择活动配置')
    // if(!state.isAssign && !state.form.vipLimits?.length) return ElMessage.warning('请选择VIP余额配置')
    if (!state.form.monthMin) return ElMessage.warning('游戏月保底费用不能为空')
    if (!state.form.lineCost) return ElMessage.warning('线路费用不能为空')
    if (typeof state.form.openFee !== 'number') return ElMessage.warning('开版费用不能为空')
    if (state.form.commissionMode === 2) {
        if (!(Number(state.form.PGC.rtpUpRate) <= 100 && Number(state.form.PGC.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
        if (!(Number(state.form.PGC.rtpDnRate) <= 100 && Number(state.form.PGC.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
        if (!(Number(state.form.NJL.rtpUpRate) <= 100 && Number(state.form.NJL.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
        if (!(Number(state.form.NJL.rtpDnRate) <= 100 && Number(state.form.NJL.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
        if (!(Number(state.form.NPP.rtpUpRate) <= 100 && Number(state.form.NPP.rtpUpRate) >= 0)) return ElMessage.warning('电子:rtp＞100抽成为(0-100)范围内的值')
        if (!(Number(state.form.NPP.rtpDnRate) <= 100 && Number(state.form.NPP.rtpDnRate) >= 0)) return ElMessage.warning('电子:rtp＜100抽成为(0-100)范围内的值')
        let next = true
        state.vendorListNoPGC.forEach((item) => {
            if (!next) return
            if (item.status == 1) {
                // if (!item.merchantShareRate) {
                //     ElMessage.warning('平台对商户抽成不能为空')
                //     next = false
                //     return
                // }
                if (item.merchantShareRate < item.shareRate) {
                    ElMessage.warning('平台对商户抽成不能低于厂家抽成')
                    next = false
                    return
                }
            }
        })
        if (!next) return
        state.form.vendors = [...state.vendorList.filter((item) => item.status == 1 && (item.alias == 'PGC' || item.alias == 'NJL' || item.alias == 'NPP')).map((item) => {
            return {
                vendorId: item.id,
                type: item.type,
                alias: item.alias,
                rtpUpRate: state.form[item.alias].rtpUpRate,
                rtpDnRate: state.form[item.alias].rtpDnRate
            }
        }), ...state.vendorListNoPGC.filter((item) => item.status == 1).map((item) => {
            return {
                vendorId: item.id,
                type: item.type,
                alias: item.alias,
                shareRate: item.merchantShareRate,
            }
        })]
    } else {
        let next = true
        state.vendorList.forEach((item) => {
            if (!next) return
            if (item.status == 1) {
                // if (!item.merchantShareRate) {
                //     ElMessage.warning('平台对商户抽成不能为空')
                //     next = false
                //     return
                // }
                if (item.merchantShareRate < item.shareRate) {
                    ElMessage.warning('平台对商户抽成不能低于厂家抽成')
                    next = false
                    return
                }
            }
        })
        if (!next) return
        state.form.vendors = state.vendorList.filter((item) => item.status == 1).map((item) => {
            return {
                vendorId: item.id,
                type: item.type,
                alias: item.alias,
                shareRate: item.merchantShareRate,
            }
        })
    }
    el.validate((valid, fields) => {
        if (valid) {
            let params = deepCopy(state.form)
            params.languages = state.form.languages.join(',')
            params.vendors = JSON.stringify(state.form.vendors)
            params.ctrlWinEnabled = params.ctrlWinEnabled ? 1 : 0
            params.quotaConfig.notifyBusiness = params.quotaConfig.notifyBusiness ? 1 : 0
            params.quotaConfig.notifyMerchant = params.quotaConfig.notifyMerchant ? 1 : 0
            params.payConfigs = JSON.stringify(params.payConfigs)
            params.quotaConfig = JSON.stringify(params.quotaConfig)
            params.vipLimits = JSON.stringify(params.vipLimits)
            if (promotionTypeList.value?.length) {
                params.promotionTypes = params.promotionTypes.filter(item => promotionTypeList.value.includes(item))
            }
            params.promotionTypes = JSON.stringify(params.promotionTypes)
            // if (params.countryCode !== 'PH') params.skins = params.skins.filter(item => item.type !== 4)
            if (params.countryCode === 'PH') {
                if (!params.loginWays) {
                    params.loginWays = ['2']
                } else if (!params.loginWays.includes('2')) {
                    params.loginWays.push('2')
                }
            }
            params.loginWays = JSON.stringify(params.loginWays)
            params.skins = JSON.stringify(params.skins)
            if (params.commissionMode === 2) { delete params.ctrlWinEnabled }
            if (params.invite) params.invite = JSON.stringify(params.invite)
            if (!state.isUse) delete params.dealerMode
            if (!state.isAssign) delete params.orgMerchantId
            if (!state.form.invite.inviteMerchantId &&
                !state.form.invite.inviteRegion &&
                !state.form.invite.openRebate &&
                !state.form.invite.rate) {
                delete params.invite
            }
            delete params.merchantShareRate
            delete params.PGC?.rtpUpRate
            delete params.PGC?.rtpDnRate
            delete params.NJL?.rtpDnRate
            delete params.NJL?.rtpUpRate
            delete params.NPP?.rtpDnRate
            delete params.NPP?.rtpUpRate
            globalVBus.$emit('globalLoading', true)

            if (state.merchantId) {
                params.id = state.merchantId
                editMerchantConfig(params).then(({ code }) => {
                    if (code == 0) {
                        setMerchantConfigData()
                        router.push('/merchant-config/merchant-site-manage?nowTime=' + Date.now())
                    }
                    globalVBus.$emit('globalLoading', false)
                }).catch(() => {
                    globalVBus.$emit('globalLoading', false)
                })
            } else {
                merchantAdd(params).then(({
                    code
                }) => {
                    if (code == 0) {
                        state.vendorList = []
                        state.vendorListNoPGC = []
                        state.form = deepCopy(state.newForm)
                        state.form.loginWays = state.loginWayConfig.map((item) => { return item.value })
                        router.push('/data-center/merchant-data')
                    }
                    globalVBus.$emit('globalLoading', false)
                }).catch(() => {
                    globalVBus.$emit('globalLoading', false)
                })
            }
        } else {
            ElMessage.warning('请完善表单内容再进行操作！')
        }
    })
}
</script>

<style lang="scss" scoped>
.enterCreate {
    height: 100%;
    .createForm {
        padding: 20px 0;
    }
    .inputWidth {
        width: 300px;
    }
    .submitBtn {
        display: flex;
        justify-content: center;
    }
    .feeBox {
        width: 600px;
        border: 1px solid rgb(235, 238, 245);
        &-title {
            width: 100%;
            display: flex;
            > div {
                flex: 1;
                text-align: center;
                border-right: 1px solid rgb(235, 238, 245);
                border-bottom: 1px solid rgb(235, 238, 245);
                &:last-of-type {
                    border-right: none;
                }
            }
        }
        &-list {
            width: 100%;
            height: 40px;
            display: flex;
            > div {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: 1px solid rgb(235, 238, 245);
                &:last-of-type {
                    border-right: none;
                }
                .el-input {
                    width: 150px;
                }
            }
        }
    }
}
.game-select {
    width: 100%;
    margin-top: 10px;
}

.game-box-small {
    width: 100%;
    margin-right: 30px;
}
.angentExplainDiv {
    cursor: pointer;
}
</style>
