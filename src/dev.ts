/* eslint-disable no-console */
import { buscarCotacaoCooabriel, buscarHistoricoMensal } from './index.js';

async function main() {
  try {
    console.log('=== Cotação do Dia ===');
    try {
      const cotacoes = await buscarCotacaoCooabriel();
      const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const dados = cotacoes.map((c) => ({
        Tipo: c.tipo,
        Data: c.data,
        Hora: c.hora,
        Preço: formatador.format(c.preco),
      }));

      console.table(dados);
    } catch {
      console.log('Não disponível no momento');
    }

    console.log('\n=== Histórico Mensal (Últimas 10) ===');
    const mensais = await buscarHistoricoMensal();
    console.log(`Total de cotações: ${mensais.length}\n`);

    const formatador = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const dados = mensais.map((c) => ({
      Tipo: c.tipo,
      Data: c.data,
      Hora: c.hora,
      Preço: formatador.format(c.preco),
    }));

    console.table(dados);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

main();
