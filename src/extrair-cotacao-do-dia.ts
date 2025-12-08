import * as cheerio from 'cheerio';
import type { CotacaoCafe } from './index.js';

export function extrairCotacaoDoDia(html: string): CotacaoCafe[] {
  const $ = cheerio.load(html);

  // Buscar QUALQUER tabela com 4 colunas no thead
  const tabela = $('table:has(thead tr th)')
    .filter((_, el) => {
      const cabecalhos = $(el).find('thead tr th').length;
      return cabecalhos >= 4; // Tabela com pelo menos 4 colunas
    })
    .first();

  if (tabela.length === 0) {
    throw new Error(
      'Não foi possível encontrar a tabela de cotação do café na página da Cooabriel.'
    );
  }

  const linhas = tabela.find('tbody tr, tr:not(thead tr)');
  const cotacoes: CotacaoCafe[] = [];

  linhas.each((_, tr) => {
    const colunas = $(tr)
      .find('td')
      .map((__, td) => $(td).text().trim())
      .get();

    if (colunas.length >= 4) {
      const [tipo, data, hora, precoTexto] = colunas;

      // Normalizar preço: R$ 1.360,00 -> 1360.00
      const precoNormalizado = precoTexto
        .replace(/[^\d,]/g, '') // remove tudo exceto números e vírgula
        .replace(',', '.'); // vírgula -> ponto

      const preco = Number.parseFloat(precoNormalizado);

      if (!Number.isNaN(preco) && preco > 0) {
        cotacoes.push({
          tipo: tipo || 'Desconhecido',
          data: data || '',
          hora: hora || '',
          preco,
        });
      }
    }
  });

  if (cotacoes.length === 0) {
    throw new Error('Tabela encontrada, mas sem linhas de cotação válidas.');
  }

  return cotacoes;
}
