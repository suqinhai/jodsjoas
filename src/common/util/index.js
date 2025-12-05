
import XEUtils from 'xe-utils'
import { Decimal } from 'decimal.js'

/**
 * 获取对象类型
 * @param target
 * @returns
 */
export function type(target) {
    return Object.prototype.toString
        .call(target)
        .replace(/.*\s|\]/g, '')
        .toLowerCase()
}

export function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        // 判断是否为对象或数组
        return obj
    }

    let newObj
    if (Array.isArray(obj)) {
        // 处理数组
        newObj = []
        for (const item of obj) {
            newObj.push(deepCopy(item)) // 递归拷贝数组元素
        }
    } else {
        // 处理对象
        newObj = {}
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = deepCopy(obj[key]) // 递归拷贝对象属性值
            }
        }
    }

    return newObj // 返回拷贝后的对象或数组
}

//获取本机时区
export function getTimezone() {
    var offsetInMinutes = new Date().getTimezoneOffset()
    var offsetInHours = Math.abs(offsetInMinutes / 60)
    var sign = offsetInMinutes > 0 ? '-' : ''
    var timezone = sign + addZero(offsetInHours)
    return timezone + ':00'
}

function addZero(number) {
    return number < 10 ? +number : number
}

// 导出excel
export function excelFileExport(res) {
    const blob = new Blob([res.data])
    // const url = window.URL.createObjectURL(blob)
    const fileName = decodeURI(
        res.headers['content-disposition']
            .split('filename="')[1]
            .split('";')[0],
    )
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    // 完成下载后释放 URL 对象
    window.URL.revokeObjectURL(url)
}

/**
 * 格式化日期
 * @param date
 * @param formatStr
 * @returns
 * @example yyyy-mm-dd HH:ii:ss' w W
 */
export function dateFormat(date, formatStr = 'yyyy-MM-DD HH:II:SS') {
    if (type(date) !== 'date') {
        if (/^\d+$/.test(date?.toString())) {
            date = new Date(+date)
        } else {
            // 兼容Safari日期带有 / 导致的格式化异常问题
            date =
                (date && new Date(date.toString().replace(/\//g, '-'))) ||
                new Date()
        }
    }
    const addZero = (v, size) => {
        for (let i = 0, len = size - (v + '').length; i < len; i++) v = '0' + v
        return v + ''
    }
    const D = date
    const arrWeek = ['日', '一', '二', '三', '四', '五', '六']
    return formatStr
        .replace(/yyyy|YYYY/, D.getFullYear() + '')
        .replace(/yy|YY/, addZero(D.getFullYear() % 100, 2))
        .replace(/mm|MM/, addZero(D.getMonth() + 1, 2))
        .replace(/m|M/g, D.getMonth() + 1 + '')
        .replace(/dd|DD/, addZero(D.getDate(), 2))
        .replace(/d|D/g, D.getDate() + '')
        .replace(/hh|HH/, addZero(D.getHours(), 2))
        .replace(/h|H/g, D.getHours() + '')
        .replace(/ii|II/, addZero(D.getMinutes(), 2))
        .replace(/i|I/g, D.getMinutes() + '')
        .replace(/ss|SS/, addZero(D.getSeconds(), 2))
        .replace(/s|S/g, D.getSeconds() + '')
        .replace(/w/g, D.getDay() + '')
        .replace(/W/g, arrWeek[D.getDay()])
}

/**
 * 时间选择器禁止选择当前时间之后的时间
 * @returns
 * @example
 */
export const disabledCurrentDateAfter = (time) => {
    return time.getTime() > Date.now()
}

/**
 * 解析地址的search参数
 * @param
 */
export function getQueryStringArgs(path) {
    return XEUtils.parseUrl(path || location.href).searchQuery
}

/**
 * 格式化数字，保留小数点decimal位
 * @param
 * @num 数值
 * @decimal 截取位数
 */
export function toDecimal(num, decimal = 2) {
    return num.toFixed(decimal, Decimal.ROUND_DOWN)
}

/**
 * 截取指定小数点位数
 * @param
 * @total 金额
 * @num 位数
 */
export function toolPoint(total, num = 2) {
    if (!total.toString()) {
        return total
    }
    total = total.toString()
    if (total.indexOf('.') != -1) {
        let point = total.split('.')
        if (point[1].length >= num) {
            total = point[0] + '.' + point[1].substring(0, num)
            return total * 1
        } else {
            return total * 1
        }
    } else {
        return total * 1
    }
}

/**
 * 格式化数据，逗号分开
 * @param num
 * @returns
 */
export function formatNum(num) {
    if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num.toString())) {
        return num.toString()
    }
    const a = RegExp.$1
    let b = RegExp.$2
    const c = RegExp.$3
    const re = new RegExp('(\\d)(\\d{3})(,|$)')
    while (re.test(b)) b = b.replace(re, '$1,$2$3')
    return `${a}${b}${c}`
}

/**
 * 加法
 */
export function add(...args) {
    let result = new Decimal(args[0])
    for (let i = 1; i < args.length; i++) {
        result = result.add(new Decimal(args[i]))
    }
    return result.toNumber()
}

/**
 * 减法
 */
export function sub(...args) {
    let result = new Decimal(args[0])
    for (let i = 1; i < args.length; i++) {
        result = result.sub(new Decimal(args[i]))
    }
    return result.toNumber()
}

/**
 * 乘法
 */
export function mul(...args) {
    let result = new Decimal(args[0])
    for (let i = 1; i < args.length; i++) {
        result = result.mul(new Decimal(args[i]))
    }
    return result.toNumber()
}

/**
 * 除法
 */
export function div(...args) {
    let result = new Decimal(args[0])
    for (let i = 1; i < args.length; i++) {
        result = result.div(new Decimal(args[i]))
    }
    return result.toNumber()
}

/**
 * token
 * @returns
 */
export function token(auth) {
    const tk = 'token'
    if (auth) {
        localStorage.setItem(tk, JSON.stringify(auth))
    } else if (auth === null) {
        localStorage.removeItem(tk)
    } else {
        try {
            const parse = JSON.parse(localStorage.getItem(tk))
            return parse
        } catch (e) {
            /** */
        }
    }
    return null
}

// 日期选择快捷方式
export function getShortcuts() {
    const date = new Date()
    let arr = [
        {
            text: '本日',
            value: () => {
                const start = date.setTime(
                    XEUtils.getWhatDay(new Date(), 0, 'first').getTime(),
                )
                const end = date.setTime(
                    XEUtils.getWhatDay(new Date(), 0, 'last').getTime(),
                )
                return [start, end]
            },
        },
        {
            text: '本周',
            value: () => {
                const start = date.setTime(
                    XEUtils.getWhatWeek(
                        XEUtils.getWhatDay(new Date(), 0, 'first'),
                        0,
                        1,
                    ).getTime(),
                )
                const end = date.setTime(
                    XEUtils.getWhatWeek(
                        XEUtils.getWhatDay(new Date(), 0, 'last'),
                        0,
                        7,
                    ).getTime(),
                )
                return [start, end]
            },
        },
        {
            text: '本月',
            value: () => {
                const start = date.setTime(
                    XEUtils.getWhatMonth(
                        XEUtils.getWhatDay(new Date(), 0, 'first'),
                        0,
                        'first',
                    ).getTime(),
                )
                const end = date.setTime(
                    XEUtils.getWhatMonth(
                        XEUtils.getWhatDay(new Date(), 0, 'first'),
                        0,
                        'last',
                    ).getTime(),
                )
                return [start, end]
            },
        },
    ]
    return arr
}

/**
 * 处理请求头时区
 */
export function getHeaderTimeZone() {
    let timeZone = 0 - new Date().getTimezoneOffset()
    let hour = Math.ceil(timeZone / 60)
    if (hour >= 0) {
        if (hour < 10) {
            hour = '+0' + hour
        } else {
            hour = '+' + hour
        }
    } else {
        if (hour > -10) {
            hour = '-0' + Math.abs(hour)
        }
    }
    let minute = timeZone % 60
    if (minute == 0) {
        return hour
    } else {
        minute =
            Math.abs(minute) > 10 ? Math.abs(minute) : '0' + Math.abs(minute)
        return hour + ':' + minute
    }
}

/**
 * 数字输入只能输入小数点后两位
 * @param
 * @val 输入的内容
 * @n 小数点截至位数，默认截至两位
 * @allFloat 是否不限制小数点截至位数
 */
export function numberInput(val, allFloat = false, n = 2) {
    let checkPlan = '' + val
    checkPlan = checkPlan
        .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        .replace(/^\./g, '') // 保证第一个为数字而不是.
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
    if (checkPlan.indexOf('.') < 0 && checkPlan !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        checkPlan = parseFloat(checkPlan) + ''
    } else if (checkPlan.indexOf('.') >= 0) {
        if (!allFloat) {
            // 限制小数点截至 n 位
            let floatString = ''
            for (var i = 0; i < n; i++) {
                floatString += '\\d'
            }
            let reg = new RegExp('^()*(\\d+)\\.(' + floatString + ').*$')
            checkPlan = checkPlan.replace(reg, '$1$2.$3')
            // checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
        }
    }
    return checkPlan
}

/**
 * 判断目标对象是不是未定义undefined
 * @param target
 * @returns
 */
export function isUndefined(target) {
    return typeof target === 'undefined'
}

/**
 * 将数据整理成树形结构
 * @param target 目标对象，数组或者对象
 * @param childId 后代和父节点对应的key
 * @param parentId 父代和字节的对应的key
 * @param root 根的判断条件，当parentId与该参数全等时，判定为根节点
 * @param ck 存放子代的的名字，默认children
 * @param condition 判定条件
 * @returns 返回target的引用
 */
export function fetchTree(target, childId, pId) {
    if (!Array.isArray(target) || !pId || !childId) return target
    const isChildKeys = []
    for (const i in target) {
        const v = target[i]
        const pv = v[pId]
        if (isUndefined(pv) || null === pv || pv === '') continue
        // eslint-disable-next-line eqeqeq
        const find = target.find((el) => el[childId] == v[pId])
        if (find) {
            isChildKeys.push(v[childId])
            find.children = find.children || []
            find.children.push(v)
        }
    }
    return target.filter((el) => !isChildKeys.includes(el[childId]))
}

/**
 * 设置路由路径
 * @param data 目标数组
 * @returns
 */
export function setPath(data) {
    data.forEach((item) => {
        // if (MENU_PATH[item.path]) {
        //     item.path = MENU_PATH[item.path];
        // }
        if (item.path === '#') {
            item.path = item.id.toString()
        }
        // if (!item.parentId) {
        //     item.icon = FIRST_MENU_ICON[item.name];
        // }
        // if (item.name === "首页") {
        //     item.path = "/dashboard";
        // }
        if (item.children) {
            setPath(item.children)
        }
    })
}

/**
 * 检查目标路由是否在菜单列表中
 * @param
 * @list 菜单列表
 * @currentPath 当前路由路径
 */
export function findPathInList(list, currentPath) {
    let pathInList = false
    let stop = false
    list.forEach((item) => {
        if (stop) return
        if (item.path === currentPath) {
            pathInList = true
            stop = true
        } else if (item.children && item.children.length) {
            if (findPathInList(item.children, currentPath)) {
                pathInList = true
                stop = true
            }
        }
    })
    return pathInList
}

/**
 * 查找菜单第一个路由路径
 * @param
 * @list 菜单列表
 */
export function findFirstMenuPage(list) {
    let path
    let stop = false
    list.forEach((item) => {
        if (stop) return
        if (item.path.indexOf('/') > -1) {
            path = item.path
            stop = true
        } else if (item.children && item.children.length) {
            if (findFirstMenuPage(item.children)) {
                path = findFirstMenuPage(item.children)
                stop = true
            }
        }
    })
    return path || null
}

/**
 * 将Blob转换成Json
 * @param
 * @blob Blob对象
 */
export function blobToJson(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        // 当文件加载完成时调用 onload 事件处理函数
        reader.onloadend = function () {
            try {
                resolve(JSON.parse(reader.result))
            } catch (error) {
                reject('无法解析 Blob 对象')
            }
        }

        // 开始读取文件内容
        reader.readAsText(blob)
    })
}

/**
 * 获取浏览器可视窗口宽高
 * @returns
 * @value 要复制的文本
 */
export function copyText(value = '') {
    if (!value) return
    // 创建一个隐藏的文本框
    const hiddenInput = document.createElement('input')
    hiddenInput.value = value
    // hiddenInput.style.display = 'none'
    hiddenInput.style.position = 'fixed'
    hiddenInput.style.opacity = 0

    // 将文本框添加到页面中
    document.body.appendChild(hiddenInput)

    // 选择文本框中的文本
    hiddenInput.select()

    // 复制文本到剪贴板
    document.execCommand('copy')

    // 从页面中移除文本框
    document.body.removeChild(hiddenInput)
    ElMessage.success('复制成功！')
}

/**
 * 获取今天以前的特定范围时间（YYYY-MM-DD格式）
 * @param
 * @start 开始时间距离今天几天
 * @end 结束始时间距离今天几天
 * start 必须大于 end
 */
export function getTimeRange(start = 0, end = 0) {
    let nowTime = Date.now()
    return [
        dateFormat(nowTime - start * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
        dateFormat(nowTime - end * 24 * 60 * 60 * 1000, 'YYYY-MM-DD'),
    ]
}

/**
 * 获取接口数据菜单标题
 * @param
 * @route 当前路由信息
 */
export function apiRouteName(route) {
    if (route.meta.permiss == 1) return route.meta.title
    let obj = {}
    let menuList = !localStorage.getItem('menu_list')
        ? []
        : JSON.parse(localStorage.getItem('menu_list'))
    menuList.forEach((item) => {
        if (item.path === route.path) {
            obj = item
        }
        item.children?.forEach((its) => {
            if (its.path === route.path) {
                obj = its
            }
            its.children?.forEach((ims) => {
                if (ims.path === route.path) {
                    obj = ims
                }
            })
        })
    })
    return obj.name || route.meta.title
}
