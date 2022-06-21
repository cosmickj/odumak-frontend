interface BaseResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}

export const response = ({ isSuccess, code, message }: BaseResponse, result: any) => {
  return {
    isSuccess,
    code,
    message,
    result,
  };
};

export const errResponse = ({ isSuccess, code, message }: BaseResponse) => {
  return {
    isSuccess,
    code,
    message,
  };
};
