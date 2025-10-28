<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Bar -->
    <div class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div class="flex items-center space-x-3">
        <div class="flex-1 relative">
          <input
            type="text"
            placeholder="Search all product here..."
            class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
          />
          <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors font-bold text-base">
            Search
          </button>
        </div>
        <ExportButton @click="handleExport" title="Export Order" />
      </div>
    </div>

    <!-- Category Filters -->
    <div class="bg-white px-4 py-3 border-b border-gray-200">
      <div v-if="categoriesLoading" class="text-center py-4">Loading categories...</div>
      <div v-else class="flex space-x-3 overflow-x-auto pb-2">
        <CategoryCard
          v-for="category in categoriesWithCounts"
          :key="category.id"
          :category="category"
          @click="activeCategory = category.id"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">
      <!-- Product Area (Left) -->
      <div class="flex-1 lg:w-[70%] p-4">
        <div v-if="productsLoading" class="text-center py-10">Loading products...</div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @show-modal="showProductModal"
          />
        </div>
      </div>

      <!-- Order Details Sidebar (Right) -->
      <div class="lg:w-[30%] lg:sticky lg:top-0 lg:h-screen">
        <OrderSidebar
          :order-items="orderItems"
          :subtotal="subtotal"
          :discount="discount"
          :sales-tax="salesTax"
          :total="total"
          :voucher-code="voucherCode"
          :member-phone="memberPhone"
          :member-name="memberName"
          :member-email="memberEmail"
          @remove-item="removeFromOrder"
          @update-quantity="updateQuantity"
          @pay-now="handlePayNow"
          @add-customer="showMemberModal"
          @add-voucher="showVoucherModal"
          @remove-member="handleRemoveMember"
          @remove-voucher="handleRemoveVoucher"
        />
      </div>
    </div>

    <!-- Product Modal -->
    <ProductModal
      v-if="selectedProduct"
      :is-open="isModalOpen"
      :product="selectedProduct"
      :ingredients="ingredients"
      :product-ingredients="productIngredients"
      @close="closeProductModal"
      @add-to-order="addToOrder"
    />

    <!-- Payment Modal -->
    <PaymentModal
      :is-open="isPaymentModalOpen"
      :order-summary="{ subtotal, discount, salesTax, total }"
      @close="closePaymentModal"
      @payment-processed="handlePaymentProcessed"
    />

    <!-- Member Modal -->
    <MemberModal
      :is-open="isMemberModalOpen"
      @close="closeMemberModal"
      @member-added="handleMemberAdded"
    />

    <!-- Voucher Modal -->
    <VoucherModal
      :is-open="isVoucherModalOpen"
      @close="closeVoucherModal"
      @voucher-added="handleVoucherAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PaymentModal from '~/components/PaymentModal.vue'
import MemberModal from '~/components/MemberModal.vue'
import VoucherModal from '~/components/VoucherModal.vue'
import CategoryCard from '~/components/CategoryCard.vue'
import useApi from '~/services/api'

const api = useApi()

// Data fetching
const { data: categories, pending: categoriesLoading } = await useAsyncData('categories', () => api.getCategories(), { default: () => [] })
const { data: products, pending: productsLoading } = await useAsyncData('products', () => api.getProducts(), { default: () => [] })
const { data: ingredients, pending: ingredientsLoading } = await useAsyncData('ingredients', () => api.getIngredients(), { default: () => [] })
const { data: productIngredients, pending: productIngredientsLoading } = await useAsyncData('productIngredients', () => api.getProductIngredients(), { default: () => [] })

const orderItems = ref([])
const activeCategory = ref('all')
const isModalOpen = ref(false)
const selectedProduct = ref(null)
const isPaymentModalOpen = ref(false)
const isMemberModalOpen = ref(false)
const isVoucherModalOpen = ref(false)
const voucherCode = ref('')
const memberPhone = ref('')
const memberName = ref('')
const memberEmail = ref('')

// Computed properties
const categoriesWithCounts = computed(() => {
  if (!categories.value || !products.value) return []
  const allProductsCount = products.value.length
  
  const allCategory = {
    id: 'all',
    name: 'All',
    icon: '🌟',
    itemCount: allProductsCount,
    selected: activeCategory.value === 'all'
  }

  const otherCategories = categories.value
    .filter(c => c.id !== 'all')
    .map(cat => {
      const count = products.value.filter(p => p.category === cat.id).length
      return {
        ...cat,
        itemCount: count,
        selected: activeCategory.value === cat.id
      }
  })

  return [allCategory, ...otherCategories]
})

const filteredProducts = computed(() => {
  if (!products.value) return []
  if (activeCategory.value === 'all') return products.value
  return products.value.filter(product => product.category === activeCategory.value)
})

const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.totalPrice || (item.price * item.quantity)), 0)
})

const discount = computed(() => {
  let baseDiscount = 0;
  if (memberPhone.value) {
    baseDiscount = subtotal.value * 0.05
  }
  if (voucherCode.value.trim()) {
    const voucher = voucherCode.value.toLowerCase().trim()
    if (voucher === 'save10') {
      baseDiscount += subtotal.value * 0.10
    } else if (voucher === 'save20') {
      baseDiscount += subtotal.value * 0.20
    } else if (voucher === 'freeshipping') {
      baseDiscount += 5.00
    }
  }
  return Math.min(baseDiscount, subtotal.value)
})

const salesTax = computed(() => {
  return (subtotal.value - discount.value) * 0.08
})

const total = computed(() => {
  return subtotal.value - discount.value + salesTax.value
})

// Methods
const addToOrder = (orderItem) => {
  const existingItem = orderItems.value.find(item => 
    item.id === orderItem.id && 
    item.size === orderItem.size && 
    item.specialInstructions === orderItem.specialInstructions
  )
  
  if (existingItem) {
    existingItem.quantity += orderItem.quantity
  } else {
    orderItems.value.push({
      ...orderItem,
      orderId: Date.now()
    })
  }
}

const removeFromOrder = (orderId) => {
  const index = orderItems.value.findIndex(item => item.orderId === orderId)
  if (index > -1) {
    orderItems.value.splice(index, 1)
  }
}

const updateQuantity = (orderId, quantity) => {
  const item = orderItems.value.find(item => item.orderId === orderId)
  if (item) {
    if (quantity <= 0) {
      removeFromOrder(orderId)
    } else {
      item.quantity = quantity
    }
  }
}

const handlePayNow = () => {
  if (orderItems.value.length === 0) {
    alert('Please add items to your order first')
    return
  }
  isPaymentModalOpen.value = true
}

const showProductModal = (product) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const closeProductModal = () => {
  isModalOpen.value = false
  selectedProduct.value = null
}

const closePaymentModal = () => {
  isPaymentModalOpen.value = false
}

const handlePaymentProcessed = async (paymentMethod) => {
  const orderToCreate = {
    items: orderItems.value,
    subtotal: subtotal.value,
    discount: discount.value,
    salesTax: salesTax.value,
    total: total.value,
    paymentMethod: paymentMethod,
    customer: {
      name: memberName.value,
      phone: memberPhone.value,
      email: memberEmail.value
    },
    voucherCode: voucherCode.value,
    createdAt: new Date().toISOString()
  }

  try {
    await api.createOrder(orderToCreate)
    alert('Order completed successfully!')
    orderItems.value = []
    voucherCode.value = ''
    memberPhone.value = ''
    memberName.value = ''
    memberEmail.value = ''
  } catch (error) {
    console.error('Failed to create order:', error)
    alert('Failed to create order. Please try again.')
  }
}

const handleExport = () => {
  if (orderItems.value.length === 0) {
    alert('No items to export')
    return
  }
  
  const orderData = {
    items: orderItems.value,
    subtotal: subtotal.value,
    discount: discount.value,
    salesTax: salesTax.value,
    total: total.value,
    timestamp: new Date().toISOString()
  }
  
  const dataStr = JSON.stringify(orderData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `order-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  
  alert('Order exported successfully!')
}

const showMemberModal = () => {
  isMemberModalOpen.value = true
}

const closeMemberModal = () => {
  isMemberModalOpen.value = false
}

const handleMemberAdded = (member) => {
  memberName.value = member.name
  memberEmail.value = member.email
  memberPhone.value = member.phone
  isMemberModalOpen.value = false
}

const handleRemoveMember = () => {
  memberPhone.value = ''
  memberName.value = ''
  memberEmail.value = ''
}

const showVoucherModal = () => {
  isVoucherModalOpen.value = true
}

const closeVoucherModal = () => {
  isVoucherModalOpen.value = false
}

const handleVoucherAdded = (voucher) => {
  voucherCode.value = voucher
  isVoucherModalOpen.value = false
}

const handleRemoveVoucher = () => {
  voucherCode.value = ''
}
</script>