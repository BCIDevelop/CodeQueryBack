import { Console } from "console";

export type SandBoxType={
    Math: Math;
    console: {log: (args_0?: any, ...args: any[]) => void};
    Function:Function|undefined;
    global:typeof global|undefined;
    process:typeof process|undefined;
}