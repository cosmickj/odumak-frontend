interface BaseResponse {
  isSuccess: boolean;
  code: number;
  message: string;
}

interface ReturnResponse extends BaseResponse {
  result?: any;
}

const response = (
  { isSuccess, code, message }: BaseResponse,
  result: any
): ReturnResponse => {
  return {
    isSuccess,
    code,
    message,
    result,
  };
};

const errResponse = ({ isSuccess, code, message }: BaseResponse): ReturnResponse => {
  return {
    isSuccess,
    code,
    message,
  };
};

export { response, errResponse };
