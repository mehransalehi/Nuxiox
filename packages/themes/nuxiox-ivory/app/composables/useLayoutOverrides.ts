import { ref } from 'vue';

const layoutOverrides = ref({
  hideNavbar: false,
  hideFooter: false,
});

export function useLayoutOverrides() {
  return layoutOverrides;
}
