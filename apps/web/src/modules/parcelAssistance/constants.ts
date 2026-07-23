/** Discriminator value stored on generic `requests` docs owned by this module. */
export const PARCEL_ASSISTANCE_SERVICE_TYPE = 'parcelAssistance' as const;

/** Real-time query page size for the Browse tab; "Load more" fetches subsequent pages. */
export const PARCEL_REQUESTS_PAGE_SIZE = 20;

/** Cap on the "My Requests" list — generous enough that pagination isn't needed yet. */
export const MY_REQUESTS_LIMIT = 50;

/** Credits awarded to the helper when a request is marked completed. */
export const CREDITS_PER_COMPLETED_REQUEST = 10;
