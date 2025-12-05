import { toRefs, reactive, ref, computed } from "vue";

export const useIndexHook = (props,emits) => {
  const state = reactive({
    editFormRef: ref(),
    rules: {
      day: [{ required: true, message: "不可为空", trigger: "blur" }],
      desc: [{ required: true, message: "不可为空", trigger: "blur" }],
      content: [{ required: true, message: "不可为空", trigger: "blur" }],
    },
  });

  const typeLabelCom = computed(() => {
    switch (props.editForm.type) {
      case 1:
        return "生成月账单";
        break;
      case 2:
        return "为最晚核对时间";
        break;
      case 3:
        return "为最晚付U时间";
        break;
      default:
        return "";
    }
  });

  const handleConfirm=()=>{
    if (!state.editFormRef) return;
    state.editFormRef.validate((valid, fields) => {
      if (valid) {
        emits("update:editForm",props.editForm)
        emits("confirm")
      } else {
        console.log("error submit!", fields);
      }
    });
  }

  return {
    ...toRefs(state),
    typeLabelCom,
    handleConfirm,
  };
};
