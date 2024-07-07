// src/hooks/react-query/queryKeys.js
export const queryKeys = {
  userData: 'userData',
  portalData: portalId => ['portalData', portalId],
  portalTeamMember: portalId => ['portalTeamMember', portalId],
  clientPortalData: url => ['clientPortalData', url],
  portalClients: portal_id => ['portalClients', portal_id],
  app: appId => ['app', appId],
};
