import { describe, expect, it } from 'vitest';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('CLI', () => {
  const cliPath = join(__dirname, '..', 'src', 'cli.ts');

  it('deve executar sem erros', async () => {
    const output = await executeCli(cliPath);

    expect(output).toBeTruthy();
    expect(output).toContain('Cotação do Café');
  }, 30000);

  it('deve exibir o cabeçalho com box', async () => {
    const output = await executeCli(cliPath);

    expect(output).toContain('╔═══════════════════════════════════════════╗');
    expect(output).toContain('║   Cotação do Café - Cooabriel');
    expect(output).toContain('╚═══════════════════════════════════════════╝');
  });

  it('deve exibir seção de histórico mensal', async () => {
    const output = await executeCli(cliPath);

    expect(output).toContain('📈 Histórico Mensal');
    expect(output).toContain('Total de cotações:');
  });

  it('deve exibir gráficos para cada tipo de café', async () => {
    const output = await executeCli(cliPath);

    expect(output).toContain('Conilon 7');
    expect(output).toContain('Conilon 7/8');
    expect(output).toContain('Conilon 8');
    expect(output).toContain('Período:');
    expect(output).toContain('Variação:');
  });

  it('deve exibir tabela de últimas cotações', async () => {
    const output = await executeCli(cliPath);

    expect(output).toContain('📋 Últimas Cotações');
    expect(output).toContain('Tipo');
    expect(output).toContain('Data');
    expect(output).toContain('Hora');
    expect(output).toContain('Preço');
  });

  it('deve exibir caracteres de gráfico ASCII', async () => {
    const output = await executeCli(cliPath);

    // Verifica se há caracteres típicos de gráficos ASCII
    const hasAsciiChars =
      output.includes('┼') ||
      output.includes('─') ||
      output.includes('│') ||
      output.includes('╭') ||
      output.includes('╮') ||
      output.includes('╰') ||
      output.includes('╯');

    expect(hasAsciiChars).toBe(true);
  });

  it('deve exibir valores monetários formatados', async () => {
    const output = await executeCli(cliPath);

    // Verifica se há valores em R$
    expect(output).toMatch(/R\$\s*\d+[.,]\d{2}/);
  });

  it('deve lidar com erro de rede graciosamente', async () => {
    // Este teste verifica se o CLI não quebra completamente em caso de erro
    const output = await executeCli(cliPath);

    // Se houver erro, deve mostrar a mensagem apropriada
    const hasError =
      output.includes('Não disponível no momento') ||
      output.includes('❌ Erro');
    const hasSuccess =
      output.includes('📈 Histórico Mensal') ||
      output.includes('📋 Últimas Cotações');

    // Deve ter pelo menos uma das duas: erro ou sucesso
    expect(hasError || hasSuccess).toBe(true);
  });
});

/**
 * Função auxiliar para executar o CLI e capturar a saída
 */
function executeCli(cliPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('tsx', [cliPath], {
      cwd: join(__dirname, '..'),
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0 || stdout.length > 0) {
        resolve(stdout + stderr);
      } else {
        reject(new Error(`CLI exited with code ${code}\nstderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}
