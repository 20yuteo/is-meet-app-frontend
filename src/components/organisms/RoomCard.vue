<template>
  <v-card
    class="py-8"
    outlined
    tile
  >
    <v-card-title
      class="headline justify-center text-h5"
    >
      {{ props.cardTitle }}
    </v-card-title>
    <v-card-text
      class="text-center"
    >
      <v-form
        @submit.prevent="handleSubmit"
      >
        <text-input
          :label="props.label"
          @changeValue="changeValue"
          @handleSubmit="handleSubmit"
        />
        <div>
          <v-btn
            color="grey"
            class="white--text text-h6"
            @click="handleSubmit"
          >
            SUBMIT
          </v-btn>
        </div>
      </v-form>
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

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import TextInput from '@/components/atomic/TextInput.vue'

export default defineComponent({
  name: 'RoomCard',

  components: {
    'text-input': TextInput
  },

  props: {
    cardTitle: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },

  emits: ['handleSubmit', 'handleClose'],

  setup (props, { emit }) {
    const text = ref<string>('')

    const textError = ref<string | undefined>(undefined)

    const changeValue = (value: string, error: string | undefined) => {
      text.value = value
      textError.value = error
    }

    const handleClose = () => {
      emit('handleClose')
    }

    const handleSubmit = () => {
      emit('handleSubmit', text.value, textError.value)
    }

    return {
      props,
      changeValue,
      handleClose,
      handleSubmit
    }
  }
})
</script>
