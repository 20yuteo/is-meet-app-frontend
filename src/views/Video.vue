<template>
  <div id="app">

    マイク:
    <select v-model="selectedAudio" @change="onChange">
        <option disabled value="">Please select one</option>
        <option v-for="(audio, key, index) in audios" v-bind:key="index" :value="audio.value">
        {{ audio.text }}
        </option>
    </select>

    カメラ:
    <select v-model="selectedVideo" @change="onChange">
        <option disabled value="">Please select one</option>
        <option v-for="(video, key, index) in videos" v-bind:key="index" :value="video.value">
        {{ video.text }}
        </option>
    </select>
  </div>
  <video id="my-video" muted="true" width="500" autoplay playsinline></video>
  <p>Your Peer ID: <span id="my-id">{{peerId}}</span></p>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted } from 'vue'
import Peer, { SfuRoom } from 'skyway-js'

type MediaDetail = {
  text: string;
  value: string;
}

export default defineComponent({
  setup () {
    const audios = ref<MediaDetail[]>([])

    const videos = ref<MediaDetail[]>([])

    const selectedAudio = ref<string>('')

    const selectedVideo = ref<string>('')

    const peerId = ref<string>('')

    const peer = ref<Peer | null>(null)

    const onChange = async () => {
      if (selectedAudio.value !== '' && selectedVideo.value !== '') {
        const constraints = {
          audio: selectedAudio.value ? { deviceId: { exact: selectedAudio.value } } : false,
          video: selectedVideo.value ? { deviceId: { exact: selectedVideo.value } } : false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        const localStream = document.getElementById('my-video') as HTMLMediaElement
        localStream.srcObject = stream

        peer.value = await new Peer({
          key: 'ef2b5f2e-5575-49e5-9a34-0756bb8a90ac',
          debug: 3
        })

        peer.value.on('open', () => {
          peerId.value = peer.value!.id
        })
      }
    }

    onMounted(async () => {
      // peer.value = await new Peer('user_id', {
      //   key: 'ef2b5f2e-5575-49e5-9a34-0756bb8a90ac',
      //   debug: 3
      // })
      const test = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      const MediaDeviceInfos = await navigator.mediaDevices.enumerateDevices()

      MediaDeviceInfos
        .filter(deviceInfo => deviceInfo.kind === 'audioinput')
        .map(audio => audios.value.push({ text: audio.label || `Microphone ${audios.value.length + 1}`, value: audio.deviceId }))

      MediaDeviceInfos
        .filter(deviceInfo => deviceInfo.kind === 'videoinput')
        .map(video => videos.value.push({ text: video.label || `Camera  ${videos.value.length - 1}`, value: video.deviceId }))

      // peer.value.on('open', () => {
      //   peerId.value = peer.value!.id
      // })
    })

    return {
      audios,
      videos,
      selectedAudio,
      selectedVideo,
      peerId,
      peer,
      onChange
    }
  }
})
</script>
