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
  <video id="their-video" width="200" autoplay playsinline></video>
  <video id="my-video" muted="true" width="500" autoplay playsinline></video>
  <p>Your Peer ID: <span id="my-id">{{peerId}}</span></p>
</template>

<script lang='ts'>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import Peer, { SfuRoom, MediaConnection } from 'skyway-js'

type MediaDetail = {
  text: string;
  value: string;
}

export default defineComponent({

  name: 'VideoRoom',

  props: {
    userId: {
      type: String,
      default: require
    },
    userName: {
      type: String,
      default: require
    },
    roomName: {
      type: String,
      default: require
    },
    token: {
      type: String,
      default: require
    },
    isCalling: {
      type: Boolean,
      required: true
    }
  },

  setup (props) {
    const audios = ref<MediaDetail[]>([])

    const videos = ref<MediaDetail[]>([])

    const selectedAudio = ref<string>('')

    const selectedVideo = ref<string>('')

    const peerId = ref<string>('')

    const peer = ref<Peer | null>(null)

    const localStream = ref<MediaStream | undefined>(undefined)

    const onChange = async () => {
      if (selectedAudio.value !== '' && selectedVideo.value !== '') {
        const constraints = {
          audio: selectedAudio.value ? { deviceId: { exact: selectedAudio.value } } : false,
          video: selectedVideo.value ? { deviceId: { exact: selectedVideo.value } } : false
        }

        localStream.value = await navigator.mediaDevices.getUserMedia(constraints) as MediaStream
        const localMediaElement = document.getElementById('my-video') as HTMLMediaElement
        localMediaElement.srcObject = localStream.value

        if (!props.isCalling) {
          peer.value = await new Peer(
            props.token,
            {
              key: 'ef2b5f2e-5575-49e5-9a34-0756bb8a90ac',
              debug: 3
            })
        } else {
          peer.value = await new Peer({
            key: 'ef2b5f2e-5575-49e5-9a34-0756bb8a90ac',
            debug: 3
          })
        }

        peer.value.on('open', () => {
          peerId.value = peer.value!.id
        })

        if (props.isCalling) return
        handleCall()
      }
    }

    const handleCall = () => {
      const res = peer.value?.call(props.token, localStream.value, { metadata: { user: 'test' } })
      connect(res)
    }

    const connect = (payload: MediaConnection | undefined) => {
      if (payload === undefined) return
      payload.on('stream', (stream: MediaStream) => {
        const element = document.getElementById('their-video') as HTMLMediaElement
        element.srcObject = stream
        element.play()
      })
    }

    onMounted(() => {
      nextTick(async () => {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        const MediaDeviceInfos = await navigator.mediaDevices.enumerateDevices()

        MediaDeviceInfos
          .filter(deviceInfo => deviceInfo.kind === 'audioinput')
          .map(audio => audios.value.push({ text: audio.label || `Microphone ${audios.value.length + 1}`, value: audio.deviceId }))

        MediaDeviceInfos
          .filter(deviceInfo => deviceInfo.kind === 'videoinput')
          .map(video => videos.value.push({ text: video.label || `Camera  ${videos.value.length - 1}`, value: video.deviceId }))
      })
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
