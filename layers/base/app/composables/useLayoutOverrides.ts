type LayoutOverrides = {
  hideNavbar: boolean
  hideFooter: boolean
}

export const useLayoutOverrides = () =>
  useState<LayoutOverrides>('layout-overrides', () => ({
    hideNavbar: false,
    hideFooter: false,
  }))
