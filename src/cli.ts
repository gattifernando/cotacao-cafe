#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * CLI para consultar cotações de café da Cooabriel
 * @module cli
 */
import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import asciichart from 'asciichart';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  buscarCotacaoCooabriel,
  buscarHistoricoMensal,
  type CotacaoCafe,
} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

program
  .name('cotacao-cafe')
  .description('Consulta cotações de café da Cooabriel')
  .version(packageJson.version)
  .option('-j, --json', 'Exibe saída em formato JSON')
  .option('-q, --quiet', 'Modo silencioso (apenas erros)')
  .option('--no-colors', 'Desabilita cores no output')
  .option('--no-charts', 'Desabilita gráficos ASCII')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    if (!options.quiet && !options.json) {
      console.log(
        chalk.bold.cyan('\n╔═══════════════════════════════════════════╗')
      );
      console.log(
        chalk.bold.cyan('║   Cotação do Café - Cooabriel             ║')
      );
      console.log(
        chalk.bold.cyan('╚═══════════════════════════════════════════╝\n')
      );
    }

    // Busca dados
    let cotacoes: CotacaoCafe[] = [];
    let mensais: CotacaoCafe[] = [];

    if (!options.quiet && !options.json) {
      console.log(chalk.bold.yellow('📊 Cotação do Dia\n'));
    }

    try {
      cotacoes = await buscarCotacaoCooabriel();

      if (options.json) {
        // Modo JSON: não exibe nada ainda, acumula dados
      } else {
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
      }
    } catch {
      if (!options.json && !options.quiet) {
        console.log(chalk.dim('  Não disponível no momento\n'));
      }
    }

    if (!options.quiet && !options.json) {
      console.log(chalk.bold.yellow('\n📈 Histórico Mensal\n'));
    }

    mensais = await buscarHistoricoMensal();

    // Modo JSON: retorna todos os dados
    if (options.json) {
      console.log(
        JSON.stringify(
          {
            cotacaoDoDia: cotacoes,
            historicoMensal: mensais,
          },
          null,
          2
        )
      );
      return;
    }

    if (!options.quiet) {
      console.log(
        `  ${chalk.dim('Total de cotações:')} ${chalk.bold.white(mensais.length)}\n`
      );
    }

    // Agrupar por tipo
    const porTipo = mensais.reduce(
      (acc, c) => {
        if (!acc[c.tipo]) acc[c.tipo] = [];
        acc[c.tipo].push(c);
        return acc;
      },
      {} as Record<string, CotacaoCafe[]>
    );

    // Gráfico para cada tipo (exceto Escolha)
    const tipos = ['Conilon 7', 'Conilon 7/8', 'Conilon 8'];

    if (!options.charts) {
      // Pula gráficos
    } else {
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
    }

    // Tabela com últimas 10 cotações
    if (!options.quiet && !options.json) {
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
    }
  } catch (erro) {
    if (options.json) {
      console.error(
        JSON.stringify({ error: (erro as Error).message }, null, 2)
      );
    } else {
      console.error(chalk.red('\n❌ Erro:'), erro);
    }
    process.exit(1);
  }
}

main();
