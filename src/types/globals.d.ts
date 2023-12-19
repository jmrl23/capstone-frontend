export declare global {
  export declare interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userAuthId: string;
    userInformationId: string;
    UserAuth: {
      username: string;
    };
    UserInformation: {
      imageUrl: string | null;
      displayName: string | null;
    };
  }

  export declare interface Device {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    device_key: string;
    userId: string;
    deviceId: string;
    DeviceData: {
      isRinging: boolean;
      DeviceDataPress: {
        createdAt: Date;
      }[];
    };
  }
}
