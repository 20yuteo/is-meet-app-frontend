import { createToaster } from '@meforma/vue-toaster'

const toaster = createToaster({})

type ToasterType = 'success' | 'info' | 'warning' | 'error' | 'default'

export default () => {
  const showToaster = (text: string, type: ToasterType) => {
    toaster.show(text, {
      type: type,
      position: 'top',
      duration: 5000
    })
  }

  return {
    showToaster
  }
}
