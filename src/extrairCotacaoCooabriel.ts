import * as cheerio from 'cheerio';
import type { CotacaoCafe } from './index.js';

export function extrairCotacaoCooabriel(html: string): CotacaoCafe[] {
  const $ = cheerio.load(html);

  // Encontrar a primeira tabela que tenha cabeçalho com "Tipo" e "Preço"
  const tabela = $('table')
    .filter((_, el) => {
      const cabecalho = $(el)
        .find('thead tr th')
        .map((__, th) => $(th).text().trim().toLowerCase())
        .get();
      return (
        cabecalho.includes('tipo') && cabecalho.some((t) => t.includes('preço'))
      );
    })
    .first();

  if (!tabela || tabela.length === 0) {
    throw new Error(
      'Não foi possível encontrar a tabela de cotação do café na página da Cooabriel.'
    );
  }

  const linhas = tabela.find('tbody tr');
  const cotacoes: CotacaoCafe[] = [];

  linhas.each((_, tr) => {
    const colunas = $(tr)
      .find('td')
      .map((__, td) => $(td).text().trim())
      .get();

    if (colunas.length < 4) {
      return;
    }

    const [tipo, data, hora, precoTexto] = colunas;

    const precoNormalizado = precoTexto
      .replace(/\./g, '') // remove separador de milhar
      .replace(',', '.'); // converte vírgula decimal em ponto

    const preco = Number.parseFloat(precoNormalizado);

    if (!Number.isNaN(preco)) {
      cotacoes.push({
        tipo,
        data,
        hora,
        preco,
      });
    }
  });

  return cotacoes;
}
