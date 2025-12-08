import { describe, it, expect } from 'vitest';
import { extrairHistoricoMensal } from '../src/extrair-historico-mensal.js';
import fs from 'node:fs';
import path from 'node:path';

const fixturesDir = path.resolve('tests', 'fixtures');
const htmlFixture = fs.readFileSync(
  path.join(fixturesDir, 'cotacao-mensal-cooabriel.html'),
  'utf-8'
);

describe('extrairHistoricoMensal', () => {
  it('deve extrair todas as cotações mensais', () => {
    const cotacoes = extrairHistoricoMensal(htmlFixture);

    expect(cotacoes.length).toBeGreaterThan(0);
    expect(cotacoes[0]).toHaveProperty('tipo');
    expect(cotacoes[0]).toHaveProperty('data');
    expect(cotacoes[0]).toHaveProperty('hora');
    expect(cotacoes[0]).toHaveProperty('preco');
  });

  it('deve ter múltiplos tipos de café', () => {
    const cotacoes = extrairHistoricoMensal(htmlFixture);
    const tipos = [...new Set(cotacoes.map((c) => c.tipo))];

    expect(tipos.length).toBeGreaterThanOrEqual(3);
    expect(tipos).toContain('Conilon 7');
    expect(tipos).toContain('Conilon 7/8');
    expect(tipos).toContain('Conilon 8');
  });

  it('deve ter cotações de diferentes datas', () => {
    const cotacoes = extrairHistoricoMensal(htmlFixture);
    const datas = [...new Set(cotacoes.map((c) => c.data))];

    expect(datas.length).toBeGreaterThan(1);
  });

  it('deve ter preços válidos', () => {
    const cotacoes = extrairHistoricoMensal(htmlFixture);

    cotacoes.forEach((cotacao) => {
      expect(cotacao.preco).toBeTypeOf('number');
      expect(cotacao.preco).toBeGreaterThan(0);
    });
  });

  it('deve lançar erro se não encontrar dados Next.js', () => {
    const htmlVazio = '<html><body>Sem dados</body></html>';

    expect(() => extrairHistoricoMensal(htmlVazio)).toThrow(
      'Não foi possível encontrar os dados do Next.js na página'
    );
  });
});
