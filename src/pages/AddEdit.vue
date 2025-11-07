<template>
  <v-dialog 
    :model-value="visible" 
    @update:model-value="$emit('close')" 
    max-width="600" 
    transition="dialog-bottom-transition" 
    persistent
  >
    <v-card class="rounded-xl elevation-8 modern-card">
      <v-toolbar flat class="modern-toolbar">
        <v-toolbar-title class="text-white text-h6 font-weight-medium">
          {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="$emit('close')">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <Form :validation-schema="schema" :initial-values="employee" @submit="saveInfo">
          <v-row dense>
            <v-col cols="12">
              <Field name="username" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Username"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-circle-outline"
                  color="primary"
                  class="rounded-lg"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.username"
                />
              </Field>
            </v-col>

            <v-col cols="12">
              <Field name="email" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email-outline"
                  color="primary"
                  class="rounded-lg"
                  type="email"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.email"
                />
              </Field>
            </v-col>
            <v-col cols="12">
              <Field name="password" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Password"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-outline"
                  color="primary"
                  class="rounded-lg"
                  type="password"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.password"
                />
              </Field>
            </v-col>
          </v-row>

          <div class="text-end mt-6">
            <v-btn variant="tonal" color="grey" class="text-none mr-3 rounded-lg" @click="$emit('close')">
              <v-icon start>mdi-cancel</v-icon> Cancel
            </v-btn>
            <v-btn color="primary" class="text-none elevation-2 rounded-lg" type="submit">
              <v-icon start>mdi-content-save-outline</v-icon>
              {{ isEditing ? 'Save Changes' : 'Add Employee' }}
            </v-btn>
          </div>
        </Form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
  employee: Object,
  isEditing: Boolean,
  visible: Boolean,
})

const emit = defineEmits(['save', 'close'])

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

function saveInfo(values) {
  emit('save', values) 
}
</script>
<style scoped>

.modern-card {
  background: #ffffff;
  border-radius: 16px !important;
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modern-toolbar {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: #fff;
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.3);
}

.modern-toolbar .v-toolbar-title {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

.v-text-field {
  margin-bottom: 1rem;
}

.v-text-field input {
  font-size: 0.95rem;
}

.v-text-field .v-field__overlay {
  border-radius: 10px;
}

.v-text-field .v-field__outline {
  border-radius: 10px !important;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 10px !important;
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

.v-btn[color='grey'] {
  background-color: #f5f5f5;
  color: #424242;
}

.v-btn[color='grey']:hover {
  background-color: #e0e0e0;
}

.v-btn[color='primary'] {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: #fff;
}

.v-btn[color='primary']:hover {
  background: linear-gradient(135deg, #1565c0, #64b5f6);
}

.v-dialog {
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.v-card-text {
  padding: 2rem !important;
}

.v-icon {
  margin-right: 6px;
}

@media (max-width: 600px) {
  .v-card-text {
    padding: 1.25rem !important;
  }

  .modern-toolbar .v-toolbar-title {
    font-size: 1rem;
  }

  .v-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .text-end {
    text-align: center !important;
  }
}
</style>
