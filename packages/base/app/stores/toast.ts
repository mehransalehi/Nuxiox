import { defineStore } from "pinia";

export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<ToastMessage[]>([]);

  const push = (message: any, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, 4000);
  };

  const remove = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const showZodError = (data: any) => {
    if (!data.data?.data) {
      if(data.data?.statusMessage){
        push(data.data?.statusMessage, "error");
      }
      console.log(data);
    } else {
      const err = data.data?.data?.data;
      for (const property in err.properties) {
        const errors = err.properties[property].errors;
        const message = `${property} : ${errors.join("\n")}`;

        push(message, "error");
      }
    }
  };

  return { toasts, push, remove, showZodError };
});
