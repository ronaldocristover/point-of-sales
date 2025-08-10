<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
    <!-- Product Image Placeholder -->
    <ImagePlaceholder :content="product.image" class="mb-3" />
    
    <!-- Product Info -->
    <div class="mb-3">
      <h3 class="font-bold text-gray-900 text-base mb-1 line-clamp-2">{{ product.name }}</h3>
      <p class="text-xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</p>
    </div>
    
    <!-- Add to Order Button -->
    <button
      @click="$emit('show-modal', product)"
      class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-bold text-base"
    >
      Add to Order
    </button>
  </div>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['show-modal'])
</script>
