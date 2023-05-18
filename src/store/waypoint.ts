import { defineStore } from 'pinia';
import type { UserRole } from '@/types';

export interface WaypointState {
  name: string;
  church: string;
  role: UserRole;
  department: string;
  grade: string;
  group: string;
}

export const useWaypointStore = defineStore('waypoint', {
  state: (): WaypointState => ({
    church: '',
    department: '',
    grade: '',
    group: '',
    name: '',
    role: 'common',
  }),
});
