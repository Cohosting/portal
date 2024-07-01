// src/hooks/react-query/queryKeys.js
export const queryKeys = {
  userData: 'userData',
  portalData: portalId => ['portalData', portalId],
  portalTeamMember: portalId => ['portalTeamMember', portalId],
};
