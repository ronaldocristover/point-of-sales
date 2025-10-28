<template>
  <div class="bg-white shadow-lg h-full flex flex-col">
    <!-- Header -->
    <div class="p-4">
      <h3 class="text-xl font-bold text-gray-800">Your order:</h3>
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
          class="flex items-start p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <!-- Image -->
          <ImagePlaceholder :content="item.image" size="small" class="flex-shrink-0 rounded-md w-16 h-16 object-cover" />

          <!-- Details -->
          <div class="flex-1 ml-4">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-gray-800 text-base">{{ item.name }}</h4>
              <span class="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">{{ item.quantity }}x</span>
            </div>

            <!-- Show selected extra components -->
            <div v-if="item.selectedIngredients && item.selectedIngredients.length > 0" class="mt-2 p-2 bg-gray-50 rounded border text-xs">
              <div class="flex items-center space-x-1 mb-1">
                <svg class="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
                </svg>
                <span class="font-semibold text-orange-600">Extra Components:</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span v-for="ingredient in item.selectedIngredients" :key="ingredient.id" class="bg-white px-2 py-1 rounded border text-gray-700">
                  {{ ingredient.name }}{{ ingredient.quantity > 1 ? ` (${ingredient.quantity}x)` : '' }}
                </span>
              </div>
            </div>

            <!-- Show selected custom components -->
            <div v-if="item.selectedCustomComponents && item.selectedCustomComponents.length > 0" class="mt-2 p-2 bg-purple-50 rounded border border-purple-200 text-xs">
              <div class="flex items-center space-x-1 mb-1">
                <svg class="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                <span class="font-semibold text-purple-600">Custom Additions:</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span v-for="customComp in item.selectedCustomComponents" :key="customComp.id" class="bg-white px-2 py-1 rounded border text-purple-700">
                  {{ customComp.name }}{{ customComp.quantity > 1 ? ` (${customComp.quantity}x)` : '' }}
                </span>
              </div>
            </div>

            <!-- Special Instructions -->
            <div v-if="item.specialInstructions" class="mt-2 text-xs text-gray-500 italic">
              "Note: {{ item.specialInstructions }}"
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center mt-3 space-x-2">
              <button
                @click.stop="$emit('update-quantity', item.orderId || item.id, item.quantity - 1)"
                class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
              </button>
              <span class="text-sm font-bold text-orange-600">{{ item.quantity }}</span>
              <button
                @click.stop="$emit('update-quantity', item.orderId || item.id, item.quantity + 1)"
                class="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </button>
            </div>
          </div>

          <!-- Price and Remove -->
          <div class="text-right ml-4">
            <button
              @click.stop="$emit('remove-item', item.orderId || item.id)"
              class="text-gray-400 hover:text-red-500 mb-2 transition-colors p-1"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd"></path></svg>
            </button>
            <p class="font-bold text-gray-800 text-base">${{ (item.totalPrice || item.price * item.quantity).toFixed(2) }}</p>
            <div class="text-xs text-gray-500">
              <span v-if="item.basePrice">Base: ${{ item.basePrice.toFixed(2) }}</span>
              <span v-if="item.ingredientCost && item.ingredientCost > 0" class="block text-orange-600 font-medium">+${{ item.ingredientCost.toFixed(2) }} extras</span>
              <span v-if="item.customComponentCost && item.customComponentCost > 0" class="block text-purple-600 font-medium">+${{ item.customComponentCost.toFixed(2) }} custom</span>
            </div>
          </div>
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