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
  .option('-l, --limit <numero>', 'Limita quantidade de cotações na tabela (0 = todas)', '10')
  .option('--no-colors', 'Desabilita cores no output')
  .option('--no-charts', 'Desabilita gráficos ASCII')
  .addHelpText(
    'after',
    '\n⚠️  AVISO: Dados fornecidos "como está", sem garantias. Não nos responsabilizamos\n   por erros, indisponibilidade ou prejuízos. Valide informações antes de usar.'
  )
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

        // Adiciona linha com as datas no eixo X (apenas início e fim)
        const linhasGrafico = grafico.split('\n');
        const ultimaLinha = linhasGrafico[linhasGrafico.length - 1] || '';

        // Encontra onde começa o gráfico (após o eixo Y)
        const match = ultimaLinha.match(/^\s*R\$\s+\d+\s+/);
        const offsetEsquerda = match ? match[0].length : 11;

        // Encontra o último caractere não-espaço (fim real do gráfico)
        const conteudoGrafico = ultimaLinha.substring(offsetEsquerda);
        const ultimoCaractere = conteudoGrafico.trimEnd().length;

        const dataInicio = dados[0].data.substring(0, 5);
        const dataFim = dados[dados.length - 1].data.substring(0, 5);

        // Constrói linha: data início no começo, data fim no final real do gráfico
        let linhaData = ' '.repeat(offsetEsquerda);
        linhaData += dataInicio;

        // Calcula espaço até a data final (alinhada com o fim do gráfico)
        const espacoAteOFim = ultimoCaractere - dataInicio.length - dataFim.length;
        linhaData += ' '.repeat(Math.max(0, espacoAteOFim));
        linhaData += dataFim;

        console.log(chalk.dim(linhaData));
      }
    }

    // Tabela com últimas 10 cotações
    if (!options.quiet && !options.json) {
      const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const limit = parseInt(options.limit, 10);
      const titulo = limit === 0 ? 'Todas as Cotações' : 'Últimas Cotações';
      console.log(chalk.bold.yellow(`\n📋 ${titulo}\n`));

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

      const ultimas = limit === 0 ? mensais : mensais.slice(-limit);
      ultimas.forEach((c) => {
        table.push([
          chalk.yellow(c.tipo),
          c.data,
          c.hora,
          chalk.green.bold(formatador.format(c.preco)),
        ]);
      });

      console.log(table.toString());
      if (limit > 0 && limit < mensais.length) {
        console.log(
          chalk.dim(`\n  (Mostrando últimas ${limit} de ${mensais.length} cotações)\n`)
        );
      } else {
        console.log(
          chalk.dim(`\n  (Total: ${mensais.length} cotações)\n`)
        );
      }
    }

    // Disclaimer legal
    if (!options.quiet && !options.json) {
      console.log(chalk.dim('\n' + '─'.repeat(60)));
      console.log(
        chalk.yellow.bold('\n⚠️  AVISO LEGAL') +
          chalk.dim(
            '\nDados fornecidos "como está", sem garantias de exatidão.\n' +
              'Não nos responsabilizamos por erros ou prejuízos decorrentes do uso.\n' +
              'Valide as informações em fontes oficiais antes de utilizá-las.\n'
          )
      );
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
