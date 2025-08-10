<template>
  <div
    @click="$emit('click')"
    :class="[
      'flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 min-w-[180px]',
      category.selected
        ? 'bg-orange-50 border-orange-500'
        : 'bg-white border-gray-200 hover:bg-gray-50'
    ]"
  >
    <div class="mr-3 text-2xl">
      {{ category.icon }}
    </div>
    <div>
      <h4
        :class="[
          'font-bold whitespace-nowrap',
          category.selected ? 'text-orange-600' : 'text-gray-800'
        ]"
      >
        {{ category.name }}
      </h4>
      <p class="text-sm text-gray-500">{{ category.itemCount }} items</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true
  }
})
defineEmits(['click'])
</script>
