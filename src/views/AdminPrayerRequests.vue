<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Admin - Prayer Requests</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-if="!loading && !error" class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">User</th>
            <th class="py-2 px-4 border-b">Request</th>
            <th class="py-2 px-4 border-b">Public</th>
            <th class="py-2 px-4 border-b">Approved</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in prayerRequests" :key="request.id">
            <td class="py-2 px-4 border-b">{{ request.user.name }}</td>
            <td class="py-2 px-4 border-b">{{ request.request_text }}</td>
            <td class="py-2 px-4 border-b">{{ request.is_public ? 'Yes' : 'No' }}</td>
            <td class="py-2 px-4 border-b">
              <span :class="request.is_approved ? 'text-green-500' : 'text-red-500'">
                {{ request.is_approved ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="py-2 px-4 border-b">
              <button
                @click="toggleApproval(request)"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                {{ request.is_approved ? 'Unapprove' : 'Approve' }}
              </button>
              <button
                @click="deleteRequest(request.id)"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Assuming axios is configured for your API

interface User {
  id: number;
  name: string;
}

interface PrayerRequest {
  id: number;
  user: User;
  request_text: string;
  is_public: boolean;
  is_approved: boolean;
}

const prayerRequests = ref<PrayerRequest[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPrayerRequests = async () => {
  try {
    const response = await axios.get('/api/admin/prayer-requests');
    prayerRequests.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch prayer requests.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const toggleApproval = async (request: PrayerRequest) => {
  try {
    const updatedRequest = { ...request, is_approved: !request.is_approved };
    await axios.put(`/api/admin/prayer-requests/${request.id}`, {
      is_approved: updatedRequest.is_approved,
    });
    const index = prayerRequests.value.findIndex((r) => r.id === request.id);
    if (index !== -1) {
      prayerRequests.value[index] = updatedRequest;
    }
  } catch (err) {
    console.error('Failed to update prayer request', err);
    alert('Failed to update prayer request.');
  }
};

const deleteRequest = async (id: number) => {
  if (!confirm('Are you sure you want to delete this request?')) {
    return;
  }
  try {
    await axios.delete(`/api/admin/prayer-requests/${id}`);
    prayerRequests.value = prayerRequests.value.filter((r) => r.id !== id);
  } catch (err) {
    console.error('Failed to delete prayer request', err);
    alert('Failed to delete prayer request.');
  }
};

onMounted(fetchPrayerRequests);
</script>
