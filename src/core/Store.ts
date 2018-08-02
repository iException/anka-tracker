export interface Store {
    data: any[]
    get (): Promise<any>
    update (data: any[]): Promise<any>
}