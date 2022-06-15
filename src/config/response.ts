interface BaseResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}

const response = ({ isSuccess, code, message }: BaseResponse, result: any) => {
  return {
    isSuccess,
    code,
    message,
    result,
  };
};

const errResponse = ({ isSuccess, code, message }: BaseResponse) => {
  return {
    isSuccess,
    code,
    message,
  };
};

module.exports = { response, errResponse };
