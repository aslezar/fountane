export interface LoginType {
  email: string
  password: string
}

export interface SignUpType {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNo: string | undefined
  isVendor: boolean
}

export interface ForgotPasswordType {
  email: string
  otp: string
  password: string
}

export interface ServiceType {
  _id: string
  serviceName: string
  serviceDescription: string
  price: number
  items: { _id: string; name: string; description: string }[]
}

export interface VendorProfileType {
  //this is vendorProfileId
  _id: string
  user: OtherUserType
  services: ServiceType[]
  createdAt: string
}

export interface EventShortType {
  _id: string
  name: string
  startDate: string
  endDate: string
  host: OtherUserType
  eventType: string
  budget: number
  createdAt: string
  updatedAt: string
}

export interface OtherUserType {
  _id: string
  name: string
  email: string
  profileImage: string
  phoneNo: string
}

export interface ChannelType {
  _id: string
  name: string
  allowedUsers: OtherUserType[]
}

export interface SubEventType {
  _id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  channels: ChannelType[]
  createdAt: string
}

export interface UserListType {
  _id: string
  user: OtherUserType
  // role: string
  // permission: [string]
  subEvents: [string]
  createdAt: string
  status: string
}

export interface ServiceListType {
  _id: string
  vendorProfile: Omit<VendorProfileType, "services">
  // permission: [string]
  subEvent: Omit<SubEventType, "channels">
  status: string
  servicesOffering: ServiceType
  amount: number
  paymentStatus: string
  createdAt: string
}

export interface EventFull extends EventShortType {
  budget: number
  venue: string
  subEvents: SubEventType[]
  userList: UserListType[]
  serviceList: ServiceListType[]
}

export interface VendorSearchType {
  //_id is vendorProfile id here
  _id: string
  name: string
  email: string
  profileImage: string
  phoneNo: string
  userId: string
  servicesData: ServiceType[]
}

export interface UserType {
  userId: string
  name: string
  email: string
  profileImage?: string
  isVendor: boolean
  vendorProfile: VendorProfileType | null
  phoneNo: string | undefined
  socketToken: string
  events: EventShortType[]
  notifications: NotificationsType[]
  createdAt: string
  updatedAt: string
}

export interface SubEventShort {
  _id: string
  name: string
  startDate: string
  endDate: string
  venue: string
}

export interface ServiceTypeNotifications {
  _id: string
  amount: number
  paymentStatus: string
  vendorProfile: string
  subEvent: SubEventShort
  status: string
  servicesOffering: ServiceType
  createdAt: string
  updatedAt: string
}
export interface NotificationsType {
  _id: string
  name: string
  host: OtherUserType
  startDate: string
  endDate: string
  userList: {
    _id: string
    user: string
    subEvents: SubEventShort[]
    status: string
    createdAt: string
    updatedAt: string
  }
  serviceList: ServiceTypeNotifications[]
}
export interface VendorSaveType {
  vendorUserId: string
  vendorProfileId: string
  vendorName: string
  vendorProfileImage: string
  vendorEmail: string
  vendorPhoneNo: string
  servicesOffering: ServiceType
}
