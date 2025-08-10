<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Select Payment Method</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Cash -->
          <div
            @click="selectPaymentMethod('cash')"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedMethod === 'cash'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                <div v-if="selectedMethod === 'cash'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Cash</h3>
                <p class="text-sm text-gray-600">Pay with cash at counter</p>
              </div>
            </div>
          </div>

          <!-- Credit Card -->
          <div
            @click="selectPaymentMethod('credit-card')"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedMethod === 'credit-card'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                <div v-if="selectedMethod === 'credit-card'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Credit/Debit Card</h3>
                <p class="text-sm text-gray-600">Pay with card</p>
              </div>
            </div>
          </div>

          <!-- Mobile Payment -->
          <div
            @click="selectPaymentMethod('mobile')"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedMethod === 'mobile'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                <div v-if="selectedMethod === 'mobile'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Mobile Payment</h3>
                <p class="text-sm text-gray-600">Pay with mobile wallet</p>
              </div>
            </div>
          </div>

          <!-- Bank Transfer -->
          <div
            @click="selectPaymentMethod('bank-transfer')"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedMethod === 'bank-transfer'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                <div v-if="selectedMethod === 'bank-transfer'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Bank Transfer</h3>
                <p class="text-sm text-gray-600">Pay via bank transfer</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="font-bold text-gray-900 mb-3">Order Summary</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">${{ orderSummary.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Discount:</span>
              <span class="font-medium text-green-600">-${{ orderSummary.discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Sales Tax:</span>
              <span class="font-medium">${{ orderSummary.salesTax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-300 pt-2">
              <div class="flex justify-between">
                <span class="font-bold text-gray-900">Total:</span>
                <span class="font-bold text-gray-900">${{ orderSummary.total.toFixed(2) }}</span>
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
          @click="showConfirmation"
          :disabled="!selectedMethod"
          class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Process Payment
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Confirm Payment</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to process payment via <strong>{{ selectedMethod }}</strong> for <strong>${{ orderSummary.total.toFixed(2) }}</strong>?
          </p>
          <div class="flex space-x-3">
            <button
              @click="showConfirmModal = false"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-bold text-base"
            >
              Cancel
            </button>
            <button
              @click="processPayment"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold text-base"
            >
              Confirm Payment
            </button>
          </div>
        </div>
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
          <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p class="text-gray-600 mb-6">
            Your payment of <strong>${{ orderSummary.total.toFixed(2) }}</strong> has been processed successfully via <strong>{{ selectedMethod }}</strong>.
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

    <!-- Failure Modal -->
    <div v-if="showFailureModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
          <p class="text-gray-600 mb-6">
            Sorry, your payment could not be processed. Please try again or choose a different payment method.
          </p>
          <button
            @click="closeFailureModal"
            class="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-bold text-base"
          >
            Try Again
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
  },
  orderSummary: {
    type: Object,
    required: true,
    default: () => ({
      subtotal: 0,
      discount: 0,
      salesTax: 0,
      total: 0
    })
  }
})

const emit = defineEmits(['close', 'payment-processed'])

const selectedMethod = ref('')
const showConfirmModal = ref(false)
const showSuccessModal = ref(false)
const showFailureModal = ref(false)

const selectPaymentMethod = (method) => {
  selectedMethod.value = method
}

const showConfirmation = () => {
  if (selectedMethod.value) {
    showConfirmModal.value = true
  }
}

const processPayment = () => {
  if (selectedMethod.value) {
    showConfirmModal.value = false
    
    // Simulate payment processing with random success/failure
    const isSuccess = Math.random() > 0.3 // 70% success rate
    
    if (isSuccess) {
      showSuccessModal.value = true
    } else {
      showFailureModal.value = true
    }
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  emit('payment-processed', selectedMethod.value)
  emit('close')
  selectedMethod.value = ''
}

const closeFailureModal = () => {
  showFailureModal.value = false
  showConfirmModal.value = false
}
</script>
