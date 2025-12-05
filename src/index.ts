import { obterHtmlCooabriel } from './obterHtmlCooabriel.js';
import { extrairCotacaoCooabriel } from './extrairCotacaoCooabriel.js';

export type CotacaoCafe = {
  tipo: string;
  data: string; // dd/mm/aaaa
  hora: string; // hh:mm
  preco: number; // valor em reais
};

export async function buscarCotacaoCooabriel(): Promise<CotacaoCafe[]> {
  const html = await obterHtmlCooabriel();
  return extrairCotacaoCooabriel(html);
}
