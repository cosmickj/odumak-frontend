/// <reference types="vite/client" />

interface Window {
  readonly naver_id_login: any;
  readonly Kakao: any;
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_FIREBASE_COLL_ATTENDANCES: string;
  readonly VITE_FIREBASE_COLL_MEMBERS: string;
  readonly VITE_FIREBASE_COLL_USERS: string;
  readonly VITE_OAUTH_GATEWAY_URL: string;
  readonly VITE_NAVER_CLIENT_ID: string;
  readonly VITE_NAVER_CALLBACK_URL: string;
  readonly VITE_KAKAO_CLIENT_ID: string;
  readonly VITE_KAKAO_CALLBACK_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
