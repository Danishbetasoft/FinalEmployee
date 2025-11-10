<template>
  <v-container>
    <ToolbarActions @add="openAddModal" @logout="logout" />

    <DxDataGrid
      :store="employeeStore"
       ref="dataGridRef"
      @edit="editEmployee"
      @delete="handleDelete"
      @background="openProfessionalBackground"
      @update-status="handleUpdateStatus"
      
    />

    <AddEdit
      :visible="modalVisible"
      :employee="selectedEmployee"
      :isEditing="isEditing"
      @save="handleSave"
      @close="closeAddEditModal"
    />

    <ProfessionalBackground
      :visible="bgModalVisible"
      :employee="selectedEmployee"
      :empstatus="empStatus"
      @save="handleBgSave"
      @close="closeBgModal"
      @copy="copyLink"
      @mail="handleOpenMailModal"
      @accept="handleAccept"
      @reject="handleReject"
    />

    <MailModal
      :visible="mailModalVisible"
      :employee="selectedEmployee"
      :mail-form-data="mailFormData"
      @close="closeMailModal"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue'
import DxDataGrid from '@/components/Dxdatagrid.vue'
import ToolbarActions from '@/pages/ToolbarActions.vue'
import AddEdit from '@/pages/AddEdit.vue'
import ProfessionalBackground from '@/pages/ProfessionalBackground.vue'
import MailModal from '@/pages/MailModal.vue'
import useEmployee from '@/Composables/useEmployees'
import { useSnackbar } from '@/Composables/snackbar'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const empStatus = ref(false)
const {
  employeeStore,
  modalVisible,
  bgModalVisible,
  mailModalVisible,
  isEditing,
  selectedEmployee,
  saveEmployee,
  deleteEmployee,
  saveBgInfo,
  updateStatus,
  acceptedEmployee,
  rejectedEmployee,
  dataGridRef,
  refreshTable
} = useEmployee()

const { showSnackbar, snackbar } = useSnackbar()
const auth = useAuthStore()
const router = useRouter()

const mailFormData = reactive({
  to: '',
  companyName: '',
  message: '',
})

function logout() {
  auth.logout()
  router.push('/login')
}

function openAddModal() {
  Object.assign(selectedEmployee, { id: null, username: '', email: '', password: '', bgInfo: {} })
  isEditing.value = false
  modalVisible.value = true
}

function editEmployee(emp) {
  Object.assign(selectedEmployee, emp)
  isEditing.value = true
  modalVisible.value = true
}

function openProfessionalBackground(emp) {
  Object.assign(selectedEmployee, { ...emp, bgInfo: emp.bgInfo || {} })
  empStatus.value = emp.status === 'completed'
  bgModalVisible.value = true
}

function closeBgModal() {
  bgModalVisible.value = false
}

async function handleBgSave() {
  await saveBgInfo(selectedEmployee)
  closeBgModal()
}

async function handleSave(empData) {
  await saveEmployee(empData)
  isEditing.value = false
  modalVisible.value = false
}

async function handleDelete(emp) {
  await deleteEmployee(emp)
}

function closeAddEditModal() {
  modalVisible.value = false
  isEditing.value = false
  Object.assign(selectedEmployee, { id: null, username: '', email: '', password: '', bgInfo: {} })
}

function copyLink() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  navigator.clipboard.writeText(link)
    .then(() => showSnackbar('Link copied to clipboard', 'success'))
    .catch(() => showSnackbar('Copy failed', 'error'))
}

function handleOpenMailModal() {
  mailFormData.to = selectedEmployee.email || ''
  mailFormData.message = `Hi,\n\nPlease review the employee background details using the link below:`
  bgModalVisible.value = false
  mailModalVisible.value = true
}

function closeMailModal() {
  mailModalVisible.value = false
  Object.assign(selectedEmployee, { id: null, username: '', email: '', bgInfo: {} })
}

async function handleUpdateStatus({ employee, status }) {
  await updateStatus(employee, status)
}

async function handleAccept(emp) {
  try {
    const response = await updateStatus(emp, 'verified')
    await acceptedEmployee(emp)
    showSnackbar(`Employee ${emp.username} accepted`, 'success')
    bgModalVisible.value = false
    refreshTable(dataGridRef)
  } catch (err) {
    console.error(err)
    showSnackbar('Error accepting employee', 'error')
  }
}

async function handleReject({rejectReason, safeEmployee}) {
  try {
    const response = await updateStatus(safeEmployee  , 'rejected')
    console.log(rejectReason)
    console.log(safeEmployee)
    await rejectedEmployee(safeEmployee, rejectReason)
    showSnackbar(`Employee ${safeEmployee.username} rejected`, 'info')
    bgModalVisible.value = false
  } catch (err) {
    console.error(err)
    showSnackbar('Error rejecting employee', 'error')
  }
}

</script>
