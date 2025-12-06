/**
 * Biblioteca para buscar cotações de café da Cooabriel
 * @packageDocumentation
 */

import { obterPaginaCooabriel } from './obter-pagina-cooabriel.js';
import { extrairCotacaoDoDia } from './extrair-cotacao-do-dia.js';
import { extrairHistoricoMensal } from './extrair-historico-mensal.js';

/**
 * Representa uma cotação de café
 */
export type CotacaoCafe = {
  /** Tipo do café (ex: "Conilon 7", "Conilon 7/8", "Conilon 8") */
  tipo: string;
  /** Data da cotação no formato dd/mm/aaaa */
  data: string;
  /** Hora da cotação no formato hh:mm */
  hora: string;
  /** Preço em reais */
  preco: number;
};

/**
 * Busca a cotação atual do café da Cooabriel
 * @returns Promise com array de cotações do dia
 * @throws {Error} Se houver erro na requisição ou parsing
 * @example
 * ```typescript
 * const cotacoes = await buscarCotacaoCooabriel();
 * console.log(cotacoes[0].preco); // 1360.00
 * ```
 */
export async function buscarCotacaoCooabriel(): Promise<CotacaoCafe[]> {
  const html = await obterPaginaCooabriel();
  return extrairCotacaoDoDia(html);
}

/**
 * Busca o histórico mensal de cotações da Cooabriel
 * @returns Promise com array de cotações do mês atual
 * @throws {Error} Se houver erro na requisição ou parsing
 * @example
 * ```typescript
 * const historico = await buscarHistoricoMensal();
 * console.log(historico.length); // 88
 * const conilon7 = historico.filter(c => c.tipo === 'Conilon 7');
 * ```
 */
export async function buscarHistoricoMensal(): Promise<CotacaoCafe[]> {
  const html = await obterPaginaCooabriel();
  return extrairHistoricoMensal(html);
}
