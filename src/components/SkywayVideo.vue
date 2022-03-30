<template>
  <v-row
    justify="center"
    align="center"
  >
    <div class="skyway-video">
      <div
        id="remote-streams"
        class="remote-streams"
      >
        <div
          class="video_wrapper"
          v-for="remoteStream in remoteStreams"
          :ref="remoteStream.peerId"
          :key="remoteStream.peerId"
        >
          <audio autoplay :srcObject.prop="remoteStream" playsinline></audio>
          <v-row
            class="justify-center"
          >
            <v-card
              width="240px"
              class="py-8 ma-8"
            >
              <div>
                <v-row
                  class="justify-center"
                >
                  <v-avatar>
                    <img
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                      alt="John"
                    >
                  </v-avatar>
                </v-row>
              </div>
            </v-card>
          </v-row>
        </div>
        <v-row
          class="justify-center"
        >
          <v-card
            width="240px"
            class="py-8 ma-8"
          >
            <div>
              <audio id="local-stream"></audio>
              <v-row
                class="justify-center"
              >
                <div
                  class="pa-2"
                >
                  <v-btn
                    color="primary"
                    class="white--text"
                    @click="mute"
                  >
                    {{ muteText }}
                  </v-btn>
                </div>
                <div
                  class="pa-2"
                >
                  <v-btn
                    color="error"
                    class="white--text"
                    @click="disconnect"
                  >
                    切断
                  </v-btn>
                </div>
              </v-row>
            </div>
          </v-card>
        </v-row>
      </div>
    </div>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, computed, onMounted } from 'vue'
import Peer, { SfuRoom } from 'skyway-js'
import { SkywayMediaStream } from '../../types/SkywayMediaStream'
import useToaster from '@/services/Toaster'

interface SkywayData {
  peer: Peer | null
  room: SfuRoom | null
  localStream: MediaStream | undefined
  isMute: boolean
  remoteStreams: SkywayMediaStream[]
}

// type MediaDetail = {
//   text: string;
//   value: string;
// }

export default defineComponent({
  name: 'SkywayVideo',

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
    }
  },

  setup (props) {
    const peer = ref<Peer | null>(null)

    const room = ref<SfuRoom | null>(null)

    const localStream = ref<MediaStream | undefined>(undefined)

    const isMute = ref<boolean>(false)

    const remoteStreams = ref<SkywayMediaStream[]>([])

    const audios = ref<string[]>([])

    const videos = ref<string[]>([])

    const selectedAudio = ref<string>('')

    const selectedVideo = ref<string>('')

    const toaster = useToaster()

    const muteText = computed((): string => {
      return isMute.value ? '解除' : 'ミュート'
    })

    const connect = (peerId: string) => {
      console.log({ peerId })
      if (!peer.value || !peer.value.open) {
        return
      }

      room.value = peer.value.joinRoom(props.roomName, {
        mode: 'sfu',
        stream: localStream.value
      }) as SfuRoom
      if (room.value) {
        room.value.on('stream', (stream: SkywayMediaStream): void => {
          remoteStreams.value.push(stream)
          toaster.showToaster('参加者が来ました。', 'success')
        })

        room.value.on('peerLeave', (peerId: string): void => {
          const audio = document.getElementById(peerId)
          if (audio) {
            audio.remove()
          }
        })

        room.value.on('peerJoin', (peerId: string) => {
          console.log(peerId)
        })
      }
    }

    const mute = (): void => {
      if (localStream.value) {
        const audioTrack = localStream.value.getAudioTracks()[0]
        isMute.value = !isMute.value
        audioTrack.enabled = isMute.value
      }
    }
    // 切断
    const disconnect = (): void => {
      if (room.value) {
        room.value.close()
      }
    }

    onMounted(() => {
      nextTick(async () => {
        const localVideo = document.getElementById(
          'local-stream'
        ) as HTMLMediaElement

        localStream.value = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })

        localVideo.muted = true
        localVideo.srcObject = localStream.value

        await localVideo.play()

        peer.value = await new Peer(props.userId, {
          key: 'ef2b5f2e-5575-49e5-9a34-0756bb8a90ac' || '',
          debug: 3
        })
        peer.value.on('open', connect)
      })
    })

    return {
      peer,
      room,
      localStream,
      isMute,
      remoteStreams,
      muteText,
      connect,
      mute,
      disconnect,
      audios,
      videos,
      selectedAudio,
      selectedVideo
    }
  }
})
</script>
// <style lang="scss" scoped>
// .video_wrapper {
//     position: relative;
//     width: 90vw;
//     height: 80vh;
//     overflow: hidden;
// }

// .video_wrapper > video {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translateX(-50%) translateY(-50%);
//     min-width: 80%;
//     min-height: 80%;
// }
// </style>
