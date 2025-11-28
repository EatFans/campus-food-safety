<template>
  <Icon :icon="icon" :width="width" :height="height" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  width?: string | number
  height?: string | number
}

withDefaults(defineProps<Props>(), {
  width: '1em',
  height: '1em'
})
</script>
