<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Product Details</h2>
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Product Content -->
      <div class="p-6">
        <!-- Product Image -->
        <div class="mb-6">
          <ImagePlaceholder :content="product.image" class="w-full h-48" />
        </div>

        <!-- Product Info -->
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
          <p class="text-2xl font-bold text-orange-500">${{ product.price.toFixed(2) }}</p>
        </div>

        <!-- Product Options -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Options</h4>
          
          <!-- Size Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="size in product.sizes || ['Small', 'Medium', 'Large']"
                :key="size"
                @click="selectedSize = size"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md border-2 transition-colors',
                  selectedSize === size
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Quantity Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div class="flex items-center space-x-3">
              <button
                @click="quantity > 1 && quantity--"
                class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="text-lg font-bold w-12 text-center">{{ quantity }}</span>
              <button
                @click="quantity++"
                class="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Special Instructions -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              v-model="specialInstructions"
              placeholder="Any special requests?"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="2"
            ></textarea>
          </div>
        </div>

        <!-- Total Price -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-900">Total:</span>
            <span class="text-2xl font-bold text-orange-500">${{ (product.price * quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="addToOrder"
            class="flex-1 px-6 py-3 bg-orange-400 text-white font-semibold rounded-md hover:bg-orange-500 transition-colors"
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-order'])

const selectedSize = ref('Medium')
const quantity = ref(1)
const specialInstructions = ref('')

const addToOrder = () => {
  const orderItem = {
    ...props.product,
    quantity: quantity.value,
    size: selectedSize.value,
    specialInstructions: specialInstructions.value,
    totalPrice: props.product.price * quantity.value
  }
  
  emit('add-to-order', orderItem)
  emit('close')
  
  // Reset form
  selectedSize.value = 'Medium'
  quantity.value = 1
  specialInstructions.value = ''
}
</script>
