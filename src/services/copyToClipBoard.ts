import useToaster from '@/services/Toaster'

const toaster = useToaster()

export default () => {
  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('copied!')
        toaster.showToaster('コピーしました。', 'success')
      }).catch(e => {
        console.error(e)
        toaster.showToaster('コピーに失敗しました。', 'error')
      })
  }

  return {
    copyToClipBoard
  }
}
