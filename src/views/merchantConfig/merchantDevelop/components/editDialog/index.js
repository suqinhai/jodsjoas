
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
