<template>
  <div 
    :class="[
      'bg-gray-100 rounded-lg flex items-center justify-center',
      size === 'small' ? 'w-12 h-12' : 'w-full h-32'
    ]"
  >
    <span 
      :class="[
        size === 'small' ? 'text-xl' : 'text-4xl'
      ]"
    >
      {{ content }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['small', 'large'].includes(value)
  }
})
</script>
