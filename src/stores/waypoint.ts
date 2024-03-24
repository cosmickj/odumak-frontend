import { defineStore } from 'pinia';
import type { Role } from '@/types';

export interface WaypointState {
  name: string;
  church: string;
  role: Role;
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
    role: {
      system: 'user',
      teacher: 'common',
    },
  }),
});
