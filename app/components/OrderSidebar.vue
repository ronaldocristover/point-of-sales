<template>
  <div class="bg-white shadow-lg h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900">Order Details</h2>
    </div>
    
    <!-- Order Items List -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="orderItems.length === 0" class="text-center text-gray-500 py-8">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <p>No items in order</p>
        <p class="text-sm">Add products to get started</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="item in orderItems"
          :key="item.orderId || item.id"
          class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <!-- Thumbnail -->
          <ImagePlaceholder :content="item.image" size="small" class="flex-shrink-0" />
          
                     <!-- Item Details -->
           <div class="flex-1 min-w-0">
             <h4 class="font-medium text-gray-900 text-sm truncate">{{ item.name }}</h4>
             <p class="text-sm text-gray-600">${{ item.totalPrice ? item.totalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2) }}</p>
             <p v-if="item.size" class="text-xs text-gray-500">{{ item.size }}</p>
             <p v-if="item.specialInstructions" class="text-xs text-gray-500 italic">{{ item.specialInstructions }}</p>
           </div>
          
          <!-- Quantity Controls -->
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('update-quantity', item.orderId || item.id, item.quantity - 1)"
              class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
              </svg>
            </button>
            <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
            <button
              @click="$emit('update-quantity', item.orderId || item.id, item.quantity + 1)"
              class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
          
          <!-- Remove Button -->
          <button
            @click="$emit('remove-item', item.orderId || item.id)"
            class="w-8 h-8 bg-red-100 text-red-600 rounded-md flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Order Summary -->
    <div class="border-t border-gray-200 p-4 bg-gray-50">
      <!-- Member & Voucher Section -->
      <div class="space-y-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
        <h3 class="font-bold text-gray-900 text-base">Customer & Discount</h3>

        <!-- Member Section -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Member</label>
          <div class="flex space-x-2">
            <button
              @click="$emit('add-member')"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold text-sm"
            >
              Add Member
            </button>
            <div v-if="memberPhone" class="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm font-medium">
              {{ memberName || memberPhone }}
            </div>
          </div>
        </div>

        <!-- Voucher Section -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Voucher</label>
          <div class="flex space-x-2">
            <button
              @click="$emit('add-voucher')"
              class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-bold text-sm"
            >
              Add Voucher
            </button>
            <div v-if="voucherCode" class="flex-1 px-3 py-2 bg-purple-50 border border-purple-200 rounded-md text-purple-700 text-sm font-medium">
              {{ voucherCode }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal:</span>
          <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Discount:</span>
          <span class="font-medium text-green-600">-${{ discount.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Sales Tax (8%):</span>
          <span class="font-medium">${{ salesTax.toFixed(2) }}</span>
        </div>
        <div class="border-t border-gray-300 pt-2">
          <div class="flex justify-between">
            <span class="text-lg font-bold text-gray-900">Total:</span>
            <span class="text-lg font-bold text-gray-900">${{ total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Pay Now Button -->
      <button
        @click="$emit('pay-now')"
        :disabled="orderItems.length === 0"
        class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Pay Now
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

defineEmits(['remove-item', 'update-quantity', 'pay-now', 'update-voucher', 'update-member-phone', 'add-member', 'add-voucher'])

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
