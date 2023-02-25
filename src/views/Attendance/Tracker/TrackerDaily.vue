<template>
  <div>Hello World</div>

  <!-- <DataView
    :value="products"
    :layout="layout"
    :paginator="true"
    :rows="9"
    :sortOrder="sortOrder"
    :sortField="sortField"
  >
    <template #header>
      <div class="grid grid-nogutter">
        <div class="col-6" style="text-align: left">
          <Dropdown
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort By Price"
            @change="onSortChange($event)"
          />
        </div>
        <div class="col-6" style="text-align: right">
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </div>
    </template>

    <template #list="slotProps">
      <div class="col-12">
        <div class="product-list-item">
          <img
            src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
            :alt="slotProps.data.name"
          />
          <div class="product-list-detail">
            <div class="product-name">{{ slotProps.data.name }}</div>
            <div class="product-description">
              {{ slotProps.data.description }}
            </div>
            <Rating
              :modelValue="slotProps.data.rating"
              :readonly="true"
              :cancel="false"
            ></Rating>
            <i class="pi pi-tag product-category-icon"></i
            ><span class="product-category">{{ slotProps.data.category }}</span>
          </div>
          <div class="product-list-action">
            <span class="product-price">${{ slotProps.data.price }}</span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
            ></Button>
            <span
              :class="
                'product-badge status-' +
                slotProps.data.inventoryStatus.toLowerCase()
              "
              >{{ slotProps.data.inventoryStatus }}</span
            >
          </div>
        </div>
      </div>
    </template>

    <template #grid="slotProps">
      <div class="col-12 md:col-4">
        <div class="product-grid-item card">
          <div class="product-grid-item-top">
            <div>
              <i class="pi pi-tag product-category-icon"></i>
              <span class="product-category">{{
                slotProps.data.category
              }}</span>
            </div>
            <span
              :class="
                'product-badge status-' +
                slotProps.data.inventoryStatus.toLowerCase()
              "
              >{{ slotProps.data.inventoryStatus }}</span
            >
          </div>
          <div class="product-grid-item-content">
            <img
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              :alt="slotProps.data.name"
            />
            <div class="product-name">{{ slotProps.data.name }}</div>
            <div class="product-description">
              {{ slotProps.data.description }}
            </div>
            <Rating
              :modelValue="slotProps.data.rating"
              :readonly="true"
              :cancel="false"
            ></Rating>
          </div>
          <div class="product-grid-item-bottom">
            <span class="product-price">${{ slotProps.data.price }}</span>
            <Button
              icon="pi pi-shopping-cart"
              :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
            ></Button>
          </div>
        </div>
      </div>
    </template>
  </DataView> -->
</template>

<script setup lang="ts"></script>

<style scoped></style>
