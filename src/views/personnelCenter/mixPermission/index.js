/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-09-21 15:17:50
 * @LastEditors: yilaisai
 * @LastEditTime: 2024-01-05 11:12:02
 * @FilePath: \management-bg\src\views\manageConfig\mixPermission\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { toRefs, reactive, ref, onMounted, onActivated } from 'vue'
import { fetchTree } from '@/common/util/index'
import { roleMenusApi, empRolesApi, roleGrantApi } from '@/api/manageConfig.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash'
export const useIndexHook = () => {
    const route = useRoute()
    const roleId = ref('')
    const router = useRouter()
    const state = reactive({
        searchNames: '',
        allPermission: [],
        currentRoleIdPermission: [],
        tableRef: ref(),
        tableRefnd: ref(),
    })

    // 搜索功能，暂时隐藏不做
    const changeSearchIds = debounce((value) => {
        if (value.indexOf(' ') < 0) {
            //没有空格
            state.allPermission.forEach((item) => {
                if (item.name == state.searchNames) {
                    state.tableRef.toggleRowExpansion(item, true)
                } else {
                    state.tableRef.toggleRowExpansion(item, false)
                }
            })
        } else {
            //有空格
            value
                .trim()
                .split(' ')
                .forEach((item) => {
                    state.allPermission.forEach((it) => {
                        if (item == it.name) {
                            state.tableRef.toggleRowExpansion(it, true)
                        }
                    })
                })
        }
    }, 500)

    //获取全部权限
    const getRoleMenusApi = async (params) => {
        const res = await roleMenusApi(params)
        if (res.code == 0) {
            state.allPermission = fetchTree(res.data, 'id', 'pId').filter(
                (item) => item.pId === 0,
            )
            state.allPermission.forEach((item) => {
                if (item.children) loopAddCheckedList(item)
            })
            console.log('权限列表=', state.allPermission)
        }
    }

    onMounted(() => {
        if ((route.query.id && !roleId.value) || !route.query.id) {
            roleId.value = route.query.id
            getRoleMenusApi({ roleId: roleId.value })
        }
    })

    onActivated(async () => {
        const { query } = route
        if (query.id && roleId.value && roleId.value !== query.id) {
            roleId.value = query.id
            await getRoleMenusApi({ roleId: query.id })
        }
    })

    // 循环判断选中状态
    const loopAddCheckedList = (parentNode, level = 1) => {
        parentNode.checkedList = []
        parentNode.checkAll = false
        level += 1
        if (parentNode.children && parentNode.children.length) {
            parentNode.children.forEach((item) => {
                if (item.checked) parentNode.checkedList.push(item.id)
                if (item.isMenu && item.children) {
                    if (level < 3) loopAddCheckedList(item, level)
                    if (level > 2) {
                        item.children.forEach((its) => {
                            if (its.checked) parentNode.checkedList.push(its.id)
                            parentNode.children.push(its)
                        })
                        item.isMenu = false
                        delete item.children
                    }
                }
            })
        }
        parentNode.checkAll =
            parentNode.checkedList.length === parentNode.children.length
        if (
            !parentNode.checkAll &&
            parentNode.children.find((item) => item.checked)
        ) {
            parentNode.isIndeterminate = true
        } else {
            parentNode.isIndeterminate = false
        }
        if (!parentNode.checkAll && parentNode.checked && parentNode.pId === 0)
            parentNode.selfIndeterminate = true
    }

    //获取员工授权
    // const getEmpRolesApi = async () => {
    //   const res = await empRolesApi({ id: query.id });
    //   if (res.code == 0) {
    //     state.roleIdList = res.data;
    //     if (state.roleIdList.length > 0) {
    //       roleMenusApi({ roleId: res.data[0].roleId }).then((_res) => {
    //         state.currentRoleIdPermission = fetchTree(
    //           _res.data,
    //           "id",
    //           "pId"
    //         );
    //         state.allPermission = updatedArray(
    //           state.currentRoleIdPermission,
    //           state.allPermission
    //         );
    //         state.allPermission.forEach((item) => {
    //           if (item.checked) {
    //             //菜单表格选中
    //             state.tableRef.toggleRowSelection(item, true);
    //           }
    //         });
    //       });
    //     }
    //   }
    // };
    // getEmpRolesApi();

    //判断所有全部权限中的当前角色有的权限
    // const updatedArray = (smallArray, bigArray) => {
    //   if (!Array.isArray(smallArray) && !Array.isArray(bigArray))
    //     return smallArray;
    //   bigArray.forEach((item) => {
    //     let temp = smallArray.find((item_it) => item.id === item_it.id);
    //     if (temp) {
    //       item.checked = true;
    //     } else {
    //       item.checked = false;
    //     }
    //     if (temp && temp.children) {
    //       updatedArray(temp.children, item.children);
    //     }
    //   });
    //   return bigArray;
    // };

    //循环多层数组
    // const forNestArray = (arr) => {
    //   if (!Array.isArray(arr)) return arr;
    //   arr.forEach((item) => {
    //     if (item.children && item.children.length > 0) {
    //       forNestArray(item.children);
    //     }
    //     item.checked = !item.checked;
    //   });
    //   return arr;
    // };

    // 点击单个复选框时，轮询查找父节点，同时选中父节点
    const handleClickst = (row) => {
        // if (row.pId === 0) return
        let parentId = row.pId
        let parentItem = loopFindParentItem(state.allPermission, parentId)
        if (!parentItem) return
        parentItem.checkedList = []
        parentItem.children.forEach((item) => {
            if (item.checked) {
                parentItem.checked = true
                parentItem.checkedList.push(item.id)
            }
        })
        parentItem.checkAll =
            parentItem.checkedList.length === parentItem.children.length
        if (
            parentItem.children.find((item) => item.checked) &&
            !parentItem.checkAll
        ) {
            parentItem.isIndeterminate = true
        } else {
            parentItem.isIndeterminate = false
        }
        if (!parentItem.checkAll && parentItem.checked && parentItem.pId === 0)
            parentItem.selfIndeterminate = true
        if (parentItem.checkAll && parentItem.pId === 0)
            parentItem.selfIndeterminate = false
        if (parentItem.pId !== 0) handleClickst(parentItem)
    }

    // const findParentId = (pId) => {
    //   let parentItem = loopFindParentItem(state.allPermission, pId)
    //   return parentItem
    // }

    // 获取父节点
    const loopFindParentItem = (list, pId) => {
        let parentItem
        let stopFind = false
        list.find((item) => {
            if (stopFind) return
            if (item.id === pId) {
                parentItem = item
                stopFind = true
            } else if (
                item.isMenu &&
                item.children &&
                item.children.length &&
                item.children[0].isMenu
            ) {
                if (loopFindParentItem(item.children, pId)) {
                    parentItem = loopFindParentItem(item.children, pId)
                    stopFind = true
                }
            }
        })
        return parentItem ? parentItem : null
    }

    //取出所有已选择的权限Id;
    const getMenuIds = (arr) => {
        if (!Array.isArray(arr)) arr
        arr.forEach((item) => {
            if (item.checked) {
                menuIds.push(item.id)
            }
            if (item.children) {
                getMenuIds(item.children)
            }
        })
    }

    let menuIds = []

    const handleSubmit = async () => {
        menuIds = []
        getMenuIds(state.allPermission)
        let data = {
            id: route.query.id,
            menuIds: menuIds.join(','),
        }
        const res = await roleGrantApi(data)
        if (res.code == 0) {
            // ElMessage.success("修改权限成功");
        }
    }

    //点击取消
    const handleCancel = () => {
        router.go(-1)
    }

    // 全选
    const handleCheckAllChange = (row) => {
        if (row.checkAll) {
            row.checked = true
            row.checkedList = row.children.map((item) => item.id)
            handleClickst(row)
        } else {
            row.checkedList = []
        }
        row.isIndeterminate = false
        if (row.pId === 0) row.selfIndeterminate = row.checkAll ? false : true
        // row.children.forEach(item => item.checked = row.checkAll)
        loopChooseAllChildren(row.children, row.checkAll)
    }

    // 轮询给子节点toggle选中状态
    const loopChooseAllChildren = (list, isCheck) => {
        list.forEach((item) => {
            item.checked = isCheck
            if (item.children && item.children.length) {
                item.isIndeterminate = false
                item.checkAll = isCheck
                if (isCheck) {
                    item.checkedList = item.children.map((v) => v.id)
                } else {
                    item.checkedList = []
                }
                if (!item.checkAll) item.checkedList = []
                loopChooseAllChildren(item.children, isCheck)
            }
        })
    }

    // 子节点有选中状态时，当前节点不能取消选中状态
    const canSelected = (row, index) => {
        let show = true
        if (row.children && row.children.length) {
            let item = row.children.find((item) => item.checked)
            if (item) show = false
        }
        return show
    }

    const handleCheckTopMenu = (row) => {
        if (row.children) {
            row.selfIndeterminate = row.checked ? true : false
        }
    }

    return {
        ...toRefs(state),
        handleClickst,
        handleSubmit,
        changeSearchIds,
        handleCancel,
        handleCheckAllChange,
        canSelected,
        handleCheckTopMenu,
    }
}
