<template>
  <div
    class="skyway-video d-flex align-start flex-column mb-6 justify-end"
  >
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
          justify="center"
          align-content="center"
        >
          <v-col
            xs="12"
            sm="8"
            md="8"
            lg="6"
            xl="6"
          >
            <v-card
              class="pa-8 ma-8"
            >
              <div>
                <v-row
                  align="center"
                  class="spacer"
                  no-gutters
                >
                  <v-col
                    cols="6"
                  >
                    <v-avatar>
                      <v-icon dark>
                        mdi-account-circle
                      </v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col
                    class="hidden-xs-only text-h5"
                    cols="6"
                  >
                    <strong>
                      {{ remoteStream.peerId }}
                    </strong>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    <v-row
      class="local-stream"
      justify="center"
      align-content="center"
    >
      <v-col
        xs="12"
        sm="8"
        md="8"
        lg="6"
        xl="6"
      >
        <v-card
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
      </v-col>
    </v-row>
  </div>
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

  emits: ['disconnect'],

  setup (props, { emit }) {
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
        emit('disconnect')
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

        peer.value = await new Peer(props.userName, {
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
<style lang="scss" scoped>
.skyway-video {
  height: 100%;
}
.remote-streams {
  width: 100%;
}
.local-stream {
  width: 100%;
}
</style>
