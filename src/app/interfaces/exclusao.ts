import { Usuario } from '../models/usuario';

export interface Exclusao {
    excluirUsuario(usuario: Usuario): void;
}
