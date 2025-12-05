/*
 * @Author: yilaisai
 * @Date: 2024-08-26 10:59:30
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-09-14 10:50:21
 */
import { defineStore } from 'pinia'
import { getUploadLimit } from '@api/common'

const commonStore = defineStore('common', {
    state: () => {
        return {
            fileType: {
                image: {},
                video: {},
                audio: {},
            },
            merchantDetailShow: false,
            merchantId: '',
            country:localStorage.getItem('country') || '0',
            activeMerchantId: '',
        }
    },
    actions: {
        getFileType() {
            getUploadLimit({ bizType: 'image' }).then((res) => {
                this.fileType.image = res.data || {}
            })
            getUploadLimit({ bizType: 'video' }).then((res) => {
                this.fileType.video = res.data || {}
            })
            getUploadLimit({ bizType: 'audio' }).then((res) => {
                this.fileType.audio = res.data || {}
            })
        },

        showMerchantDetail(id) {
            this.merchantId = id
            this.merchantDetailShow = true
        },
    },
})

export default commonStore
