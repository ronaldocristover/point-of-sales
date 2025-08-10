<template>
  <div class="bg-white shadow-lg h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900">Order Details</h2>
    </div>
    
    <!-- Order Items List -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="orderItems.length === 0" class="text-center text-gray-500 py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <p class="text-lg">No items in order</p>
        <p class="text-base">Add products to get started</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="item in orderItems"
          :key="item.orderId || item.id"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-transparent hover:border-orange-400 transition-all cursor-pointer"
        >
          <!-- Thumbnail -->
          <ImagePlaceholder :content="item.image" size="small" class="flex-shrink-0" />
          
                     <!-- Item Details -->
           <div class="flex-1 min-w-0">
             <h4 class="font-medium text-gray-900 text-base truncate">{{ item.name }}</h4>
             <p class="text-base text-gray-600">${{ item.totalPrice ? item.totalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2) }}</p>
             <p v-if="item.size" class="text-sm text-gray-500">{{ item.size }}</p>
             <p v-if="item.specialInstructions" class="text-sm text-gray-500 italic">{{ item.specialInstructions }}</p>
           </div>
          
          <!-- Quantity Controls -->
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('update-quantity', item.orderId || item.id, item.quantity - 1)"
              class="w-9 h-9 bg-orange-400 text-white rounded-md flex items-center justify-center hover:bg-orange-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <span class="text-base font-medium w-9 text-center">{{ item.quantity }}</span>
            <button
              @click="$emit('update-quantity', item.orderId || item.id, item.quantity + 1)"
              class="w-9 h-9 bg-orange-400 text-white rounded-md flex items-center justify-center hover:bg-orange-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
          
          <!-- Remove Button -->
          <button
            @click="$emit('remove-item', item.orderId || item.id)"
            class="w-9 h-9 bg-red-100 text-red-600 rounded-md flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Order Summary -->
    <div class="border-t border-gray-200 p-4 bg-gray-50">
      <!-- Customer & Voucher Section -->
      <div class="space-y-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-900 text-lg">Customer & Discount</h3>

        <!-- Customer Section -->
        <div class="space-y-2">
          <label class="block text-base font-medium text-gray-700">Customer</label>
          <div class="flex items-center space-x-2">
            <button
              v-if="!memberPhone"
              @click="$emit('add-customer')"
              class="w-full px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-bold text-base"
            >
              Add Customer
            </button>
            <div v-else class="flex items-center justify-between w-full px-3 py-2 bg-green-100 border border-green-300 rounded-md text-green-800 text-base font-medium">
              <span>{{ memberName || memberPhone }}</span>
              <button @click="$emit('remove-member')" class="text-red-600 hover:text-red-800 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Voucher Section -->
        <div class="space-y-2">
          <label class="block text-base font-medium text-gray-700">Voucher</label>
          <div class="flex items-center space-x-2">
            <button
              v-if="!voucherCode"
              @click="$emit('add-voucher')"
              class="w-full px-4 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-bold text-base"
            >
              Add Voucher
            </button>
            <div v-else class="flex items-center justify-between w-full px-3 py-2 bg-purple-100 border border-purple-300 rounded-md text-purple-800 text-base font-medium">
              <span>{{ voucherCode }}</span>
              <button @click="$emit('remove-voucher')" class="text-red-600 hover:text-red-800 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-base">
          <span class="text-gray-600">Subtotal:</span>
          <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-base">
          <span class="text-gray-600">Discount:</span>
          <span class="font-medium text-green-600">-${{ discount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-base">
          <span class="text-gray-600">Sales Tax (8%):</span>
          <span class="font-medium">${{ salesTax.toFixed(2) }}</span>
        </div>
        <div class="border-t border-gray-300 pt-2">
          <div class="flex justify-between">
            <span class="text-xl font-bold text-gray-900">Total:</span>
            <span class="text-xl font-bold text-gray-900">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="mb-4">
        <label class="block text-base font-medium text-gray-700 mb-2">Payment method:</label>
        <div class="grid grid-cols-3 gap-3">
          <!-- Master Card -->
          <div 
            @click="selectedPaymentMethod = 'Master Card'"
            :class="[
              'border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all',
              selectedPaymentMethod === 'Master Card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            ]"
          >
            <div class="w-8 h-5 mb-2 flex items-center justify-center">
              <svg class="w-8" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img">
                <title>Mastercard</title>
                <circle cx="12" cy="12" r="12" fill="#EA001B"></circle>
                <circle cx="26" cy="12" r="12" fill="#F79E1B" fill-opacity="0.8"></circle>
              </svg>
            </div>
            <span :class="['text-sm font-medium', selectedPaymentMethod === 'Master Card' ? 'text-orange-600' : 'text-gray-600']">Master Card</span>
          </div>

          <!-- Paypal -->
          <div 
            @click="selectedPaymentMethod = 'Paypal'"
            :class="[
              'border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all',
              selectedPaymentMethod === 'Paypal' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            ]"
          >
            <div class="w-8 h-5 mb-2 flex items-center justify-center">
                <svg class="h-5" fill="#003087" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PayPal</title><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.22a.641.641 0 0 1 .633-.543h5.323c4.4 0 7.038 2.413 6.135 6.726-1.12 5.358-5.013 6.725-9.926 6.725h-1.932l-.983 6.209zm1.83-12.343c.22-.933 1.23-1.034 1.473-1.034h.28c2.445 0 3.826.64 4.45 4.16.34 1.891-1.182 2.835-2.935 2.835h-1.332l-1.936-5.96z"/></svg>
            </div>
            <span :class="['text-sm font-medium', selectedPaymentMethod === 'Paypal' ? 'text-orange-600' : 'text-gray-600']">Paypal</span>
          </div>

          <!-- Scan Code -->
          <div 
            @click="selectedPaymentMethod = 'Scan Code'"
            :class="[
              'border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all',
              selectedPaymentMethod === 'Scan Code' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            ]"
          >
            <div class="w-8 h-5 mb-2 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 3h1m-1 12v1M4 12H3m15-1h1M4 11H3m1-5V5m12 1V5M5 6V5m1-1h12a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1zm0 3h4v4H6V9zm6 0h4v4h-4V9zm-6 6h4v4H6v-4zm6 6h4v4h-4v-4z"></path>
              </svg>
            </div>
            <span :class="['text-sm font-medium', selectedPaymentMethod === 'Scan Code' ? 'text-orange-600' : 'text-gray-600']">Scan Code</span>
          </div>
        </div>
      </div>
      
      <!-- Make Order Button -->
      <button
        @click="$emit('pay-now')"
        :disabled="orderItems.length === 0"
        class="w-full bg-orange-400 text-white py-4 px-4 rounded-lg font-bold text-xl hover:bg-orange-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Make Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedPaymentMethod = ref('Master Card')

const props = defineProps({
  orderItems: {
    type: Array,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  salesTax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  voucherCode: {
    type: String,
    default: ''
  },
  memberPhone: {
    type: String,
    default: ''
  },
  memberName: {
    type: String,
    default: ''
  },
  memberEmail: {
    type: String,
    default: ''
  }
})

defineEmits(['remove-item', 'update-quantity', 'pay-now', 'update-voucher', 'update-member-phone', 'add-customer', 'add-voucher', 'remove-member', 'remove-voucher'])

// Method to register member
// const registerMember = () => {
//   if (props.memberPhone.trim()) {
//     alert(`Member registered successfully! Phone: ${props.memberPhone}`)
//     // In a real app, this would make an API call to register the member
//   } else {
//     alert('Please enter a valid phone number')
//   }
// }
</script>