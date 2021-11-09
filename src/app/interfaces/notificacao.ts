export interface Notificacao {
    notificacao(message: string, title: string): Promise<void>;
};