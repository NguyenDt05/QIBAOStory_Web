export const USER_ROLES = {
  admin:  { value: 'admin',  label: 'Quản trị viên' },
  member: { value: 'member', label: 'Thành viên' },
};

export function getRoleLabel(role) {
  return USER_ROLES[role]?.label ?? 'Thành viên';
}
