<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Add Voucher</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Voucher Form -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Voucher Code Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Voucher Code</label>
            <input
              v-model="voucherCode"
              type="text"
              placeholder="Enter voucher code"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          <!-- Voucher Info -->
          <div class="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 class="font-bold text-purple-900 mb-2">Available Vouchers:</h4>
            <div class="space-y-2 text-sm text-purple-700">
              <div class="flex justify-between">
                <span>SAVE10:</span>
                <span>10% additional discount</span>
              </div>
              <div class="flex justify-between">
                <span>SAVE20:</span>
                <span>20% additional discount</span>
              </div>
              <div class="flex justify-between">
                <span>FREESHIPPING:</span>
                <span>$5 off for shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="p-6 border-t border-gray-200 flex space-x-3">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-bold text-base"
        >
          Cancel
        </button>
        <button
          @click="addVoucher"
          :disabled="!voucherCode.trim()"
          class="flex-1 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Voucher
        </button>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Voucher Added Successfully!</h3>
          <p class="text-gray-600 mb-6">
            Voucher code <strong>{{ voucherCode.toUpperCase() }}</strong> has been applied to your order.
          </p>
          <button
            @click="closeSuccessModal"
            class="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold text-base"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'voucher-added'])

const voucherCode = ref('')
const showSuccessModal = ref(false)

const addVoucher = () => {
  if (voucherCode.value.trim()) {
    // In a real app, this would validate the voucher code
    showSuccessModal.value = true
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  emit('voucher-added', voucherCode.value.trim())
  emit('close')
  
  // Reset form
  voucherCode.value = ''
}
</script>
