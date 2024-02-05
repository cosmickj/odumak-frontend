// Keep it simple, stupid
type Authority = 'superadmin' | 'admin' | 'manager' | 'common' | 'guest';
type Presence = 'offline' | 'online' | 'absence' | undefined;
type Status = 'active' | 'pending' | 'inactive';

// 1번 조직을 등록한다.
interface organizations {
  uid: string;
  originName: string; // 영은교회
  systemName: string; // 영은교회A
  address: string;
  contact: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

// 2번 해당 조직에 속해있는 인원들을 입력한다.
interface tenants {
  uid: string;
  organization: {
    uid: string;
    name: string; // originName을 사용한다.
    status: Status;
  };
  originName: string; // 이경준
  systemName: string; // 이경준A, 이미 부여 받은것이 있다면 그것으로, 없다면 새로히
  birth: string;
  address: string;
  contact: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

// 3번 조직에 부서를 추가한다.
interface departments {
  uid: string;
  organization: {
    uid: string;
    name: string; // originName을 사용한다.
    status: Status;
  };
  name: string; // 초등부, 청년부
  description: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

// 4번 부서에 팀을 추가한다.
// 팀을 처음 만들 때, 해당 조직에 포함되어 있는
// 성도 중 한 명을 지목해서 admin 리더를 추가한다.
interface teams {
  uid: string;
  department: {
    uid: string;
    name: string; // 청년부
  };
  name: string; // 1부, 2부, 오이코스, 테루아, 여호수아, 영청 FC, 혹은 department와 동일.
  description: string;
  domain: {
    options: string[]; // [3, 4], [이경준, 박초아, 김현기, 홍세영]
    suffix: string; // 학년, 목장
  };
  cluster: {
    options: string[] | null; // [1,2,3,4,5....]
    suffix: string | null; // 반
  };
  leaderAlias: string; // 목자, 마을장, 팀장 ...
  leaderRoles: {
    aliasKr: string; // ex) 담임, 부담임, 일반
    aliasEn: string; // ex) mainTeacher, subTeacher, commonTeacher
    authority: Authority;
  }[];
  followerAlias: string; // 목원, 마을원, 팀원 ...
  nextGrade: {
    aliasKr: string; // 등반, 수료 ...
    options:
      | {
          team: {
            uid: string;
            name: string; // 1부, 2부, 더누림, 어울림
          };
        }[]
      | null;
  };
}

// [departments_hierarchy]
// parentDepartment
// childDepartment

// 5-1번 위에서 지정된 admin 리더가 팀의 팔러워들을 등록한다. (리더 또한 일단 팔로워로 등록)
// TODO: followers 중에서 리더로 올리는 기능이 필요하다.
interface followers {
  uid: string;
  tenant: {
    uid: string;
    name: string; // system_name을 사용한다. (사용자들도 구분해야해서)
    birth: string;
  };
  team: {
    uid: string;
    name: string;
    domain: {
      granted: string;
      suffix: string;
    };
    cluster: {
      granted: string;
      suffix: string;
    };
  };
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 5-2번 위에서 저장된 followers 중에서 admin 리더가 팀의 리더들을 등록한다.
// TODO: 등반을 할 때 리더에서 follower로 보낸다.
interface leaders {
  uid: string;
  tenant: {
    uid: string;
    name: string; // system_name을 사용한다. (사용자들도 구분해야해서)
    birth: string;
  };
  team: {
    uid: string;
    name: string;
    domain: {
      granted: string;
      suffix: string;
    };
    cluster: {
      granted: string;
      suffix: string;
    };
  };
  roles: {
    aliasKr: string; // ex) 담임, 부담임, 일반
    aliasEn: string; // ex) mainTeacher, subTeacher, commonTeacher
    authority: Authority;
  }[];
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// *** 유저의 등장...!!!
// 네이버 혹은 카카오로 가입할 수 있어...! 이때 필수적으로 유저의 이름과 생년월일을 가져올 수 있는지 확인하자.
// 무엇으로 가입하더라도 tenant와 연결되게 하고 싶어....
// 유저가 신청을 해야해.
interface users {
  uid: string;
  tenant: {
    uid: string;
  };
}

// *** 각 기능들을 플러그인 형식으로 만들자!
// 리더들에 대한 출석 체크 가능 또한 플러그인으로 하자
// 예를 들어 달란트 기능을 만들고 해당 기능은 등록된 팀만 사용할 수 있게 하자.
// 또한 기목제목 기능도 그렇다! 더 나아가 기도제목 기능은 디폴트로 다 넣는 것이다.

interface attendances {
  uid: string;
  date: Date;
  presence: Presence;
  team: {
    uid: string;
    name: string;
    domain: {
      granted: string;
      suffix: string;
    };
    cluster: {
      granted: string;
      suffix: string;
    };
  };
  donor: {
    uid: string;
    name: string;
  };
  recipient: {
    uid: string;
    name: string;
    joinedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// 참고 자료
// - https://cloud.google.com/firestore/docs/best-practices
