import { EstadoMesa } from "../enums/EstadoMesa.js";

export interface Mesa {
  idMesa: number;
  numero: number;
  capacidad: number;
  estado: EstadoMesa;
}
