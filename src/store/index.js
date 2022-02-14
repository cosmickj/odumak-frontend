import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [
      // 서버에서 값을 넘겨줄 때 색깔 값을 계산해서 넣어서 넘겨주자.
      {
        class: "3-1",
        teacher: "강경환",
        student: "박주하",
        attendance: "온라인",
        _rowVariant: "success",
      },
      {
        class: "3-1",
        teacher: "강경환",
        student: "전지훈",
        attendance: "미참여",
        _rowVariant: "secondary",
      },
      {
        class: "3-1",
        teacher: "강경환",
        student: "윤서후",
        attendance: "현장예배",
        _rowVariant: "info",
      },
      {
        class: "3-1",
        teacher: "강경환",
        student: "김동률",
        attendance: "현장예배",
      },
      {
        class: "3-2",
        teacher: "안정임",
        student: "신윤솔",
        attendance: "온라인",
      },
      {
        class: "3-2",
        teacher: "안정임",
        student: "오한율",
        attendance: "온라인",
      },
      {
        class: "3-2",
        teacher: "안정임",
        student: "이초은",
        attendance: "온라인",
      },
      {
        class: "3-2",
        teacher: "안정임",
        student: "전예은",
        attendance: "온라인",
      },
      {
        class: "3-2",
        teacher: "안정임",
        student: "전주은",
        attendance: "온라인",
      },
      {
        class: "3-3",
        teacher: "이유빈",
        student: "이아인",
        attendance: "온라인",
      },
      {
        class: "3-3",
        teacher: "이유빈",
        student: "손지호",
        attendance: "온라인",
      },
      {
        class: "3-3",
        teacher: "강경환",
        student: "박주하",
        attendance: "온라인",
      },
      {
        class: "3-3",
        teacher: "강경환",
        student: "전지훈",
        attendance: "미참여",
      },
      {
        class: "3-3",
        teacher: "강경환",
        student: "윤서후",
        attendance: "현장예배",
      },
      {
        class: "3-1",
        teacher: "강경환",
        student: "김동률",
        attendance: "현장예배",
      },
      {
        class: "3-1",
        teacher: "안정임",
        student: "신윤솔",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "안정임",
        student: "오한율",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "안정임",
        student: "이초은",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "안정임",
        student: "전예은",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "안정임",
        student: "전주은",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "이유빈",
        student: "이아인",
        attendance: "온라인",
      },
      {
        class: "3-1",
        teacher: "이유빈",
        student: "손지호",
        attendance: "온라인",
      },
    ],
  },
  mutations: {},
  actions: {},
  modules: {},
});
