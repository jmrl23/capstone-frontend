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
    deviceKey: string;
    userId: string;
    deviceId: string;
    DeviceData: {
      isRinging: boolean;
      DeviceDataPress: Array<{ createdAt: Date }>;
    };
  }

  export declare interface MqttMessage {
    timestamp: number;
    message: string;
    topic: {
      parsed: string;
      raw: string;
    };
    device: Device;
  }
}
