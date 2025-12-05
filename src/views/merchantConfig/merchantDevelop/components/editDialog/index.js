/*
 * @Author: liqijiang 3045273238@qq.com
 * @Date: 2023-11-20 10:02:26
 * @LastEditors: yilaisai
 * @LastEditTime: 2023-12-12 20:30:30
 * @FilePath: \management-bg\src\views\enterConfig\enterDevelop\components\editDialog\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { toRefs, reactive, ref } from "vue";

export const useIndexHook = (props, emits) => {
  const state = reactive({
    editFormRef: ref(),
    rules: {
      totalRecharge: {
        required: false,
        pattern: /^\d+$/,
        message: "请输入非负正整数",
        trigger: "blur",
      }
    },
  });

  const handleConfirm = () => {
    if (!state.editFormRef) return false;
    state.editFormRef.validate((valid, fields) => {
      if (valid) {
        emits("update:editForm", props.editForm);
        emits("confirm");
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  return {
    ...toRefs(state),
    handleConfirm,
  };
};
