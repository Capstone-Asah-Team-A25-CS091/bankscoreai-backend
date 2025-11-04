import { Server } from '@hapi/hapi';
declare module '@hapi/hapi' {
    interface AuthCredentials {
        id: number;
    }
}
export declare const authPlugin: {
    name: string;
    version: string;
    register: (server: Server) => Promise<void>;
};
