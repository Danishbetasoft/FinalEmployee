<template>
  <v-row class="mb-6 align-center toolbar-row">
    <v-col cols="12" md="6">
      <h1 class="text-h4 font-weight-bold text-primary mb-1">Employee Directory</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Manage Employees</p>
    </v-col>

    <v-col cols="12" md="6" class="d-flex justify-end align-center button-group">
      <v-btn color="primary" large @click="$emit('add')">
        <v-icon start>mdi-account-plus</v-icon>
        Add New Employee
      </v-btn>
      <v-btn color="error" large @click="$emit('logout')">
        <v-icon start>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-col>
  </v-row>
</template>
<style scoped>
.toolbar-row {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  align-items: center;
}
h1.text-h4 {
  color: #1976d2;
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.text-subtitle-1 {
  color: #607d8b;
  font-weight: 400;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem; 
}

.v-btn {
  text-transform: none;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
}

.v-btn[color='primary'] {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  color: #fff;
}

.v-btn[color='primary']:hover {
  background: linear-gradient(135deg, #1565c0, #64b5f6);
}

.v-btn[color='error'] {
  background: linear-gradient(135deg, #e53935, #ef5350);
  color: #fff;
}

.v-btn[color='error']:hover {
  background: linear-gradient(135deg, #d32f2f, #f0625f);
}

@media (max-width: 960px) {
  .toolbar-row {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .button-group {
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  h1.text-h4 {
    font-size: 1.5rem;
  }

  .text-subtitle-1 {
    font-size: 0.95rem;
  }

  .v-btn {
    width: 100%;
    max-width: 240px;
  }
}
</style>
