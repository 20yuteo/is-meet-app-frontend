<template>
  <v-card>
    <v-card-title
      class="headline justify-center text-h5 py-8"
    >
      新規 ルーム 情報
    </v-card-title>
    <v-card-text>
      ルーム名: {{ props.RoomDetail.name }}
    </v-card-text>
    <v-card-text>
      ルームID: {{ props.RoomDetail.token }}
    </v-card-text>
    <v-card-text
      class="py-4"
    >
      <v-row
        class="justify-center"
      >
        <v-btn
          color="grey"
          text
          @click="handleInviteCode"
        >
          招待リンクをコピー
        </v-btn>
      </v-row>
    </v-card-text>
    <v-card-text
      class="py-4"
    >
      <v-row
        class="justify-center"
      >
        <v-btn
          color="blue"
          text
          @click="handleShareToTwitter"
        >
          <v-icon
            dark
          >
            mdi-twitter
          </v-icon>
          Twitterでシェアする
        </v-btn>
      </v-row>
    </v-card-text>
    <v-card-text
      class="py-4"
    >
      <v-row
        class="justify-center"
      >
        <v-btn
          color="indigo"
          text
          @click="handleGoToRoom"
        >
          Roomへ移動
        </v-btn>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        @click="handleClose"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import useCopyToClipBoard from '@/services/copyToClipBoard'

export type RoomDetailType = {
  name: string,
  token: string,
  inviteUrl: string
}

export default defineComponent({

  name: 'RoomDetailCard',

  props: {
    RoomDetail: {
      type: Object as PropType<RoomDetailType>,
      required: true
    }
  },

  emits: ['handleClose', 'handleGoToRoom'],

  setup (props, { emit }) {
    const { copyToClipBoard } = useCopyToClipBoard()

    const handleInviteCode = async () => {
      copyToClipBoard(props.RoomDetail.inviteUrl)
    }

    const handleShareToTwitter = () => {
      const shareURL = 'https://twitter.com/intent/tweet?text=' + 'ミートアップにルームを作成しました！' + '&url=' + props.RoomDetail.inviteUrl
      window.open(shareURL, '_blank')
    }

    const handleClose = () => {
      emit('handleClose')
    }

    const handleGoToRoom = () => {
      emit('handleGoToRoom', props.RoomDetail.name, props.RoomDetail.token, false)
    }

    return {
      props,
      handleInviteCode,
      handleShareToTwitter,
      handleClose,
      handleGoToRoom
    }
  }
})
</script>
