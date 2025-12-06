#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * CLI para consultar cotações de café da Cooabriel
 * @module cli
 */
import chalk from 'chalk';
import Table from 'cli-table3';
import asciichart from 'asciichart';
import { buscarCotacaoCooabriel, buscarHistoricoMensal } from './index.js';

async function main() {
  try {
    console.log(
      chalk.bold.cyan('\n╔═══════════════════════════════════════════╗')
    );
    console.log(
      chalk.bold.cyan('║   Cotação do Café - Cooabriel             ║')
    );
    console.log(
      chalk.bold.cyan('╚═══════════════════════════════════════════╝\n')
    );

    console.log(chalk.bold.yellow('📊 Cotação do Dia\n'));

    try {
      const cotacoes = await buscarCotacaoCooabriel();
      const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const table = new Table({
        head: [
          chalk.cyan('Tipo'),
          chalk.cyan('Data'),
          chalk.cyan('Hora'),
          chalk.cyan('Preço'),
        ],
        style: {
          head: [],
          border: ['dim'],
        },
      });

      cotacoes.forEach((c) => {
        table.push([
          chalk.yellow(c.tipo),
          c.data,
          c.hora,
          chalk.green.bold(formatador.format(c.preco)),
        ]);
      });

      console.log(table.toString());
    } catch {
      console.log(chalk.dim('  Não disponível no momento\n'));
    }

    console.log(chalk.bold.yellow('\n📈 Histórico Mensal\n'));
    const mensais = await buscarHistoricoMensal();
    console.log(
      `  ${chalk.dim('Total de cotações:')} ${chalk.bold.white(mensais.length)}\n`
    );

    // Agrupar por tipo
    const porTipo = mensais.reduce(
      (acc, c) => {
        if (!acc[c.tipo]) acc[c.tipo] = [];
        acc[c.tipo].push(c);
        return acc;
      },
      {} as Record<string, typeof mensais>
    );

    // Gráfico para cada tipo (exceto Escolha)
    const tipos = ['Conilon 7', 'Conilon 7/8', 'Conilon 8'];

    for (const tipo of tipos) {
      const dados = porTipo[tipo];
      if (!dados || dados.length === 0) continue;

      const precos = dados.map((c) => c.preco);
      const min = Math.min(...precos);
      const max = Math.max(...precos);

      console.log(chalk.bold.green(`\n${tipo}`));
      console.log(
        chalk.dim(
          `  Período: ${dados[0].data} a ${dados[dados.length - 1].data}`
        )
      );
      console.log(
        chalk.dim(`  Variação: R$ ${min.toFixed(2)} - R$ ${max.toFixed(2)}\n`)
      );

      const grafico = asciichart.plot(precos, {
        height: 8,
        colors: [asciichart.green],
        format: (x: number) => `R$ ${x.toFixed(0).padStart(6)}`,
      });

      console.log(chalk.green(grafico));
    }

    // Tabela com últimas 10 cotações
    const formatador = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    console.log(chalk.bold.yellow('\n📋 Últimas Cotações\n'));

    const table = new Table({
      head: [
        chalk.cyan('Tipo'),
        chalk.cyan('Data'),
        chalk.cyan('Hora'),
        chalk.cyan('Preço'),
      ],
      style: {
        head: [],
        border: ['dim'],
      },
    });

    const ultimas = mensais.slice(-10);
    ultimas.forEach((c) => {
      table.push([
        chalk.yellow(c.tipo),
        c.data,
        c.hora,
        chalk.green.bold(formatador.format(c.preco)),
      ]);
    });

    console.log(table.toString());
    console.log(chalk.dim('\n  (Mostrando últimas 10 de 88 cotações)\n'));
  } catch (erro) {
    console.error(chalk.red('\n❌ Erro:'), erro);
    process.exit(1);
  }
}

main();
