export enum Role {
  'admin' = 'admin',
  'vendor' = 'vendor',
  'user' = 'user',
  'affiliate_user' = 'affiliate_user',
}

export enum UploadFolderEnum {
  'admin' = 'admin',
  'vendor' = 'vendor',
  'video' = 'video',
  'homePageBanner' = 'homePageBanner',
  'user' = 'user',
  'city' = 'city',
  'category' = 'category',
  'service' = 'service',
  'subCategory' = 'subCategory',
  'subService' = 'subService',
  'bookingRequest' = 'bookingRequest',
  'jsonImage' = 'jsonImage',
  'cityJson' = 'cityJson',
  'serviceJson' = 'serviceJson',
  'metaJson' = 'metaJson',
  'cmsJson' = 'cmsJson',
  'logo' = 'logo',
  'staticJson' = 'staticJson',
  'cms' = 'cms',
  'excelFile' = 'excelFile',
  'pdfFile' = 'pdfFile',
}

export enum CommonFolderEnum {
  'tmp' = 'tmp',
  'media' = 'media',
}

export enum AddressType {
  HOME = 'home',
  OFFICE = 'work',
  OTHER = 'other',
}

export enum PaymentMethod {
  UPI = 'UPI',
  CASH = 'CASH',
  OTHER = 'OTHER',
}

export enum BookingType {
  INSTANT = 'INSTANT',
  SCHEDULE = 'SCHEDULE',
}

export enum MicroServices {
  OTHER_MODULE_CLIENT = 'OTHER_MODULE_CLIENT',
  BOOKING_MODULE_CLIENT = 'BOOKING_MODULE_CLIENT',
  CHAT_TRACKING_MODULE_CLIENT = 'CHAT_TRACKING_MODULE_CLIENT',
}

export enum BookingRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accept',
  COMPLETE = 'complete',
  CANCEL = 'cancel',
  VENDOR_NOT_FOUND = 'vendor_not_found',
}

export enum BookingRequestPaymentStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}

export enum VendorBookingRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accept',
  MISSED = 'miss',
  CANCEL = 'cancel',
  COMPLETE = 'complete',
}

export enum BookingRequestVendorStatus {
  PENDING = 'pending',
  ACCEPTED = 'accept',
  START = 'start',
  DIRECTION = 'direction',
  REACHED = 'reached',
  COMPLETE = 'complete',
  CANCEL = 'cancel',
  VENDOR_NOT_FOUND = 'vendor_not_found',
}

export enum SubAdminRole {
  ALL = 'ALL',
  DASHBOARD = 'DASHBOARD',
  SERVICE = 'SERVICE',
  CITY = 'CITY',
  SEO = 'SEO',
  CMS = 'CMS',
  REVIEW = 'REVIEW',
  COUPON = 'COUPON',
  BOOKING = 'BOOKING',
  VENDOR = 'VENDOR',
  SUPPORT_TICKET = 'SUPPORT_TICKET',
  CUSTOMER = 'CUSTOMER',
  VENDOR_PAYMENT = 'VENDOR_PAYMENT',
  PAYMENT_HISTORY = 'PAYMENT_HISTORY',
  PINCODE = 'PINCODE',
  BANNER = 'BANNER',
  NOTIFICATION = 'NOTIFICATION',
  AFFILIATEUSERS = 'AFFILIATEUSERS',
  KITS = 'KITS',
  VENDOR_KITS = 'VENDOR_KITS',
  ANALYTICS = 'ANALYTICS',
}

export enum ExcelGenerateName {
  VENDOR = 'vendor',
  BOOKING = 'Booking',
  PINCODE = 'Pincode',
  PAYMENT_HISTORY = 'payment-history',
  VENDOR_PAYMENT = 'vendor-payment',
  BOOKING_ANALYSIS = 'booking-analysis',
  LEAD_ANALYSIS = 'lead-analysis',
}
