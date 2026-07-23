/**
 * Single-campus default, used until the Campus/Service Catalog bootstrap
 * phase introduces real multi-tenant campus selection (see the approved
 * Firestore design doc — `campuses` / `serviceCatalog` collections).
 * Every write that needs a campusId uses this constant for now; swapping
 * it for the signed-in user's real campus later is a one-line change
 * here, not a refactor of every module that writes to Firestore.
 */
export const DEFAULT_CAMPUS_ID = 'default-campus';
