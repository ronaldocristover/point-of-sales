<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Add Member</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Member Form -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              v-model="memberData.name"
              type="text"
              placeholder="Enter full name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <!-- Phone Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              v-model="memberData.phone"
              type="tel"
              placeholder="Enter phone number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              v-model="memberData.email"
              type="email"
              placeholder="Enter email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
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
          @click="addMember"
          :disabled="!isFormValid"
          class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Member
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
          <h3 class="text-xl font-bold text-gray-900 mb-2">Member Added Successfully!</h3>
          <p class="text-gray-600 mb-6">
            Member <strong>{{ memberData.name }}</strong> has been added with phone <strong>{{ memberData.phone }}</strong>.
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
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'member-added'])

const memberData = ref({
  name: '',
  phone: '',
  email: ''
})

const showSuccessModal = ref(false)

const isFormValid = computed(() => {
  return memberData.value.name.trim() && memberData.value.phone.trim()
})

const addMember = () => {
  if (isFormValid.value) {
    // In a real app, this would make an API call to add the member
    showSuccessModal.value = true
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  emit('member-added', {
    name: memberData.value.name,
    phone: memberData.value.phone,
    email: memberData.value.email
  })
  emit('close')
  
  // Reset form
  memberData.value = {
    name: '',
    phone: '',
    email: ''
  }
}
</script>
