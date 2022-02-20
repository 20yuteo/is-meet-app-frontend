<template>
    <v-text-field
        :label="props.label"
        counter
        class="shrink"
    ></v-text-field>
    <span>{{ props.errorMessage }}</span>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TextInput',

  props: {
    label: {
      type: String,
      required: true
    },
    errorMessage: {
      value: String,
      required: true
    }
  },

  setup (props) {
    const changeValue = computed(() => {
      console.log(props.errorMessage)
      return props.errorMessage
    })

    return {
      props
    }
  }
})
</script>
