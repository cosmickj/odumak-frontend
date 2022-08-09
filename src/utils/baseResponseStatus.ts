export default {
  SUCCESS: { isSuccess: true, code: 1000, message: "성공" },
  // 회원가입 오류 메세지
  NAME_UNKNOWN: { isSuccess: false, code: 2000, message: "등록되지 않은 이름입니다. 이름을 다시 확인하시고 관리자에게 문의해주세요." },
  NAME_DUPLICATED: { isSuccess: false, code: 2000, message: "이미 등록된 이름입니다. 이름을 다시 확인하시고 관리자에게 문의해주세요." },
  ROLE_UNMATCHED: { isSuccess: false, code: 2000, message: "담당 학급을 다시 확인하시고 관리자에게 문의해주세요." },
  CLASS_UNMATCHED: { isSuccess: false, code: 2000, message: "입력하신 학년과 반을 다시 확인하시고 관리자에게 문의해주세요." },
};