<template>
  <div id="input-attendance">
    <!-- 학생 출석 입력폼 -->
    <b-container fluid class="input-attendance__container mt-2">
      <b-form @submit="onSubmit">
        <div class="input-attendance-date d-flex p-3">
          <b-form-datepicker
            class="w-50"
            v-model="selectedDate"
            placeholder="날짜 선택"
            :date-disabled-fn="dateDisabled"
            :date-format-options="{
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              weekday: 'narrow',
            }"
          ></b-form-datepicker>
          <div
            class="d-flex justify-content-center align-items-center flex-grow-1"
          >
            <span>3-1</span>
          </div>
          <div
            class="d-flex justify-content-center align-items-center flex-grow-1"
          >
            <span>이유빈</span>
          </div>
        </div>
        <b-row
          class="p-3 mx-2 my-1 border rounded shadow-sm"
          v-for="(student, index) in students"
          :key="index"
        >
          <!-- 학생 인적사항 -->
          <b-col cols="5" class="p-0">
            <label class="pb-1" for="remark">
              {{ student.name }} / {{ student.birth }}
            </label>
            <b-form-input
              id="remark"
              type="text"
              placeholder="비고"
            ></b-form-input>
          </b-col>
          <!-- 학생 출결입력 -->
          <b-col cols="7" class="p-0">
            <div class="d-flex justify-content-center align-items-center">
              <!-- 입력 버튼 -->
              <template v-for="(option, idx) in options">
                <input
                  type="radio"
                  :key="`input_${idx}`"
                  :id="`${student.name}_${idx}`"
                  :name="student.name"
                  :value="option.value"
                  v-model="student.check"
                />
                <label
                  :key="`label_${idx}`"
                  :for="`${student.name}_${idx}`"
                  :style="{
                    background: option.background,
                    color: option.color,
                  }"
                >
                  {{ option.text }}
                </label>
              </template>
            </div>
          </b-col>
        </b-row>

        <!-- NOTE: 입력 여부에 따라서 제출 혹은 수정 버튼 나타나게 하기 -->
        <div class="mx-2 my-4">
          <b-button
            class="btn-submit"
            type="submit"
            variant="warning"
            size="lg"
            block
          >
            제출하기
          </b-button>

          <b-button
            class="btn-submit"
            type="submit"
            variant="danger"
            size="lg"
            block
          >
            수정하기
          </b-button>
        </div>
      </b-form>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
