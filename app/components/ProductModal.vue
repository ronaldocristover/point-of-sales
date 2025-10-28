<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Customize Your Order</h2>
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
        <!-- Progress Steps -->
        <div class="mb-6">
          <div class="flex items-center justify-center space-x-4">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <span class="ml-2 text-sm font-medium text-gray-700">Select Product</span>
            </div>
            <div class="w-12 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm', availableIngredients.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600']">2</div>
              <span class="ml-2 text-sm font-medium text-gray-700">Choose Extras</span>
            </div>
            <div class="w-12 h-0.5 bg-gray-300"></div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <span class="ml-2 text-sm font-medium text-gray-700">Submit Order</span>
            </div>
          </div>
        </div>

        <!-- Product Image -->
        <div class="mb-6">
          <ImagePlaceholder :content="product.image" class="w-full h-48" />
        </div>

        <!-- Product Info -->
        <div class="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
          <p v-if="product.description" class="text-gray-600 mb-2">{{ product.description }}</p>
          <p class="text-lg font-semibold text-orange-600">
            Base Price: ${{ (product.basePrice || product.price || 0).toFixed(2) }}
          </p>
        </div>

        <!-- Ingredients Selection -->
        <div v-if="availableIngredients.length > 0" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Choose Extra Components</h4>
          <div class="space-y-3">
            <div
              v-for="ingredient in availableIngredients"
              :key="ingredient.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :id="`ingredient-${ingredient.id}`"
                  v-model="selectedIngredients[ingredient.id]"
                  @change="calculateTotal"
                  class="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label :for="`ingredient-${ingredient.id}`" class="flex-1 cursor-pointer">
                  <span class="font-medium text-gray-900">{{ ingredient.name }}</span>
                  <span class="text-sm text-gray-500 ml-2">(${{ ingredient.cost.toFixed(2) }})</span>
                </label>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="selectedIngredients[ingredient.id]"
                  @click="decreaseIngredientQuantity(ingredient.id)"
                  class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span v-if="selectedIngredients[ingredient.id]" class="w-8 text-center font-semibold">
                  {{ ingredientQuantities[ingredient.id] }}
                </span>
                <button
                  v-if="selectedIngredients[ingredient.id]"
                  @click="increaseIngredientQuantity(ingredient.id)"
                  class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Components Selection -->
        <div v-if="globalCustomComponents.length > 0" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Custom Additions (Optional)</h4>
          <div class="space-y-3">
            <div
              v-for="customComponent in globalCustomComponents"
              :key="customComponent.id"
              class="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50"
            >
              <div class="flex items-center space-x-3">
                <input
                  type="checkbox"
                  :id="`custom-${customComponent.id}`"
                  v-model="selectedCustomComponents[customComponent.id]"
                  @change="calculateTotal"
                  class="w-4 h-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label :for="`custom-${customComponent.id}`" class="flex-1 cursor-pointer">
                  <span class="font-medium text-gray-900">{{ customComponent.name }}</span>
                  <span class="text-sm text-gray-500 ml-2">(${{ customComponent.cost.toFixed(2) }})</span>
                </label>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="selectedCustomComponents[customComponent.id]"
                  @click="decreaseCustomComponentQuantity(customComponent.id)"
                  class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span v-if="selectedCustomComponents[customComponent.id]" class="w-8 text-center font-semibold">
                  {{ customComponentQuantities[customComponent.id] }}
                </span>
                <button
                  v-if="selectedCustomComponents[customComponent.id]"
                  @click="increaseCustomComponentQuantity(customComponent.id)"
                  class="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quantity Selection -->
        <div class="mb-6">
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
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
          <textarea
            v-model="specialInstructions"
            placeholder="Any special requests?"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            rows="2"
          ></textarea>
        </div>

        <!-- Price Breakdown -->
        <div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">Final Order Summary</h4>

          <!-- Selected extras preview -->
          <div v-if="Object.keys(selectedIngredients).filter(key => selectedIngredients[key]).length > 0 || Object.keys(selectedCustomComponents).filter(key => selectedCustomComponents[key]).length > 0" class="mb-3 p-3 bg-white rounded border">
            <p class="text-xs font-semibold text-green-600 mb-1">Your Selection:</p>
            <p class="text-sm text-gray-700">
              <span class="font-medium">{{ product.name }}</span>
              <span v-if="Object.keys(selectedIngredients).filter(key => selectedIngredients[key]).length > 0" class="text-gray-600">
                +
                <span v-for="(ingredient, index) in availableIngredients.filter(i => selectedIngredients[i.id])" :key="ingredient.id">
                  {{ ingredient.name }}{{ ingredientQuantities[ingredient.id] > 1 ? ` (${ingredientQuantities[ingredient.id]}x)` : '' }}<span v-if="index < availableIngredients.filter(i => selectedIngredients[i.id]).length - 1">, </span>
                </span>
              </span>
              <span v-if="Object.keys(selectedCustomComponents).filter(key => selectedCustomComponents[key]).length > 0" class="text-purple-600">
                +
                <span v-for="(customComp, index) in globalCustomComponents.filter(c => selectedCustomComponents[c.id])" :key="customComp.id">
                  {{ customComp.name }}{{ customComponentQuantities[customComp.id] > 1 ? ` (${customComponentQuantities[customComp.id]}x)` : '' }}<span v-if="index < globalCustomComponents.filter(c => selectedCustomComponents[c.id]).length - 1">, </span>
                </span>
              </span>
              <span class="ml-2 text-orange-600 font-medium">× {{ quantity }}</span>
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Base Product:</span>
              <span>${{ (product.basePrice || product.price || 0).toFixed(2) }}</span>
            </div>
            <div v-if="totalIngredientCost > 0" class="flex justify-between text-sm">
              <span>Extra Components:</span>
              <span>${{ totalIngredientCost.toFixed(2) }}</span>
            </div>
            <div v-if="totalCustomComponentCost > 0" class="flex justify-between text-sm">
              <span>Custom Additions:</span>
              <span>${{ totalCustomComponentCost.toFixed(2) }}</span>
            </div>
            <div v-if="quantity > 1" class="flex justify-between text-sm">
              <span>Quantity Multiplier:</span>
              <span>× {{ quantity }}</span>
            </div>
            <div class="border-t pt-2 flex justify-between">
              <span class="text-lg font-semibold text-gray-900">Final Total:</span>
              <span class="text-2xl font-bold text-orange-500">${{ totalPrice.toFixed(2) }}</span>
            </div>
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
            Submit Order
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
  },
  ingredients: {
    type: Array,
    default: () => []
  },
  productIngredients: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'add-to-order'])

const quantity = ref(1)
const specialInstructions = ref('')
const selectedIngredients = ref({})
const ingredientQuantities = ref({})
const selectedCustomComponents = ref({})
const customComponentQuantities = ref({})

const availableIngredients = computed(() => {
  if (!props.ingredients.length || !props.productIngredients.length) return []

  const productIngredientIds = props.productIngredients
    .filter(pi => pi.productId === props.product.id)
    .map(pi => pi.ingredientId)

  return props.ingredients.filter(ingredient => productIngredientIds.includes(ingredient.id))
})

const globalCustomComponents = computed(() => {
  if (!props.ingredients.length) return []
  
  return props.ingredients.filter(ing => 
    ['sauce', 'spicy', 'addon'].includes(ing.category)
  )
})

const totalIngredientCost = computed(() => {
  return Object.entries(selectedIngredients.value).reduce((total, [ingredientId, isSelected]) => {
    if (!isSelected) return total
    const ingredient = availableIngredients.value.find(i => i.id === parseInt(ingredientId))
    const quantity = ingredientQuantities.value[ingredientId] || 1
    return total + (ingredient ? ingredient.cost * quantity : 0)
  }, 0)
})

const totalCustomComponentCost = computed(() => {
  return Object.entries(selectedCustomComponents.value).reduce((total, [componentId, isSelected]) => {
    if (!isSelected) return total
    const component = globalCustomComponents.value.find(c => c.id === parseInt(componentId))
    const quantity = customComponentQuantities.value[componentId] || 1
    return total + (component ? component.cost * quantity : 0)
  }, 0)
})

const totalPrice = computed(() => {
  const basePrice = props.product.basePrice || props.product.price || 0
  return (basePrice + totalIngredientCost.value + totalCustomComponentCost.value) * quantity.value
})

const calculateTotal = () => {
  // This triggers the computed property updates
  nextTick()
}

const increaseIngredientQuantity = (ingredientId) => {
  if (!ingredientQuantities.value[ingredientId]) {
    ingredientQuantities.value[ingredientId] = 1
  } else {
    ingredientQuantities.value[ingredientId]++
  }
}

const decreaseIngredientQuantity = (ingredientId) => {
  if (ingredientQuantities.value[ingredientId] > 1) {
    ingredientQuantities.value[ingredientId]--
  } else {
    // Uncheck if quantity would go to 0
    selectedIngredients.value[ingredientId] = false
    delete ingredientQuantities.value[ingredientId]
  }
}

const increaseCustomComponentQuantity = (componentId) => {
  if (!customComponentQuantities.value[componentId]) {
    customComponentQuantities.value[componentId] = 1
  } else {
    customComponentQuantities.value[componentId]++
  }
}

const decreaseCustomComponentQuantity = (componentId) => {
  if (customComponentQuantities.value[componentId] > 1) {
    customComponentQuantities.value[componentId]--
  } else {
    // Uncheck if quantity would go to 0
    selectedCustomComponents.value[componentId] = false
    delete customComponentQuantities.value[componentId]
  }
}

const addToOrder = () => {
  const selectedIngredientsList = Object.entries(selectedIngredients.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([ingredientId, _]) => {
      const ingredient = availableIngredients.value.find(i => i.id === parseInt(ingredientId))
      return {
        ...ingredient,
        quantity: ingredientQuantities.value[ingredientId] || 1
      }
    })

  const selectedCustomComponentsList = Object.entries(selectedCustomComponents.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([componentId, _]) => {
      const component = globalCustomComponents.value.find(c => c.id === parseInt(componentId))
      return {
        ...component,
        quantity: customComponentQuantities.value[componentId] || 1
      }
    })

  const orderItem = {
    ...props.product,
    quantity: quantity.value,
    specialInstructions: specialInstructions.value,
    selectedIngredients: selectedIngredientsList,
    ingredientCost: totalIngredientCost.value,
    selectedCustomComponents: selectedCustomComponentsList,
    customComponentCost: totalCustomComponentCost.value,
    basePrice: props.product.basePrice || props.product.price || 0,
    totalPrice: totalPrice.value
  }

  emit('add-to-order', orderItem)
  emit('close')

  // Reset form
  quantity.value = 1
  specialInstructions.value = ''
  selectedIngredients.value = {}
  ingredientQuantities.value = {}
  selectedCustomComponents.value = {}
  customComponentQuantities.value = {}
}

// Initialize ingredient quantities when dialog opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && availableIngredients.value.length > 0) {
    // Set required ingredients as selected by default
    availableIngredients.value.forEach(ingredient => {
      const productIngredient = props.productIngredients.find(
        pi => pi.productId === props.product.id && pi.ingredientId === ingredient.id
      )
      if (productIngredient && productIngredient.required) {
        selectedIngredients.value[ingredient.id] = true
        ingredientQuantities.value[ingredient.id] = productIngredient.defaultQuantity || 1
      }
    })
  }
})
</script>
