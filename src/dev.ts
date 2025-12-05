/* eslint-disable no-console */
import { buscarCotacaoCooabriel } from './index.js';

async function main() {
  try {
    const cotacoes = await buscarCotacaoCooabriel();
    console.log('Cotação atual da Cooabriel:');
    console.table(cotacoes);
  } catch (erro) {
    console.error('Erro ao buscar cotação:', erro);
  }
}

main();
