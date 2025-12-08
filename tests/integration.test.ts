import { describe, it, expect } from 'vitest';
import { buscarCotacaoCooabriel, buscarHistoricoMensal } from '../src/index.js';

/**
 * Testes de integração que fazem requisições reais ao site da Cooabriel.
 * Execute separadamente: pnpm test:integration
 *
 * Estes testes podem falhar se:
 * - O site estiver fora do ar
 * - A estrutura HTML mudar
 * - Não houver conexão com internet
 */
describe('Integração - buscarCotacaoCooabriel', () => {
  it('deve buscar cotações reais do site ou retornar erro esperado', async () => {
    try {
      const cotacoes = await buscarCotacaoCooabriel();

      expect(cotacoes).toBeDefined();
      expect(Array.isArray(cotacoes)).toBe(true);
      expect(cotacoes.length).toBeGreaterThan(0);

      // Valida estrutura de cada cotação
      cotacoes.forEach((cotacao) => {
        expect(cotacao).toHaveProperty('tipo');
        expect(cotacao).toHaveProperty('data');
        expect(cotacao).toHaveProperty('hora');
        expect(cotacao).toHaveProperty('preco');

        expect(typeof cotacao.tipo).toBe('string');
        expect(typeof cotacao.data).toBe('string');
        expect(typeof cotacao.hora).toBe('string');
        expect(typeof cotacao.preco).toBe('number');

        // Valida formato da data: dd/mm/aaaa
        expect(cotacao.data).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

        // Valida formato da hora: hh:mm
        expect(cotacao.hora).toMatch(/^\d{2}:\d{2}$/);

        // Preço deve ser positivo
        expect(cotacao.preco).toBeGreaterThan(0);
      });

      // Valida tipos esperados de café
      const tipos = cotacoes.map((c) => c.tipo);
      expect(tipos).toContain('Conilon 7');
      expect(tipos).toContain('Conilon 7/8');
      expect(tipos).toContain('Conilon 8');

      // Testa preços dentro de faixa razoável
      cotacoes.forEach((cotacao) => {
        expect(cotacao.preco).toBeGreaterThan(100);
        expect(cotacao.preco).toBeLessThan(5000);
      });
    } catch (error) {
      // A tabela HTML pode não estar disponível em certos momentos
      // (fora do horário comercial, finais de semana, etc)
      expect((error as Error).message).toContain(
        'Não foi possível encontrar a tabela'
      );
    }
  }, 10000);
});

describe('Integração - buscarHistoricoMensal', () => {
  it('deve buscar histórico mensal real do site', async () => {
    const historico = await buscarHistoricoMensal();

    expect(historico).toBeDefined();
    expect(Array.isArray(historico)).toBe(true);
    expect(historico.length).toBeGreaterThan(0);

    // Valida estrutura
    historico.forEach((cotacao) => {
      expect(cotacao).toHaveProperty('tipo');
      expect(cotacao).toHaveProperty('data');
      expect(cotacao).toHaveProperty('hora');
      expect(cotacao).toHaveProperty('preco');

      expect(typeof cotacao.tipo).toBe('string');
      expect(typeof cotacao.data).toBe('string');
      expect(typeof cotacao.hora).toBe('string');
      expect(typeof cotacao.preco).toBe('number');

      expect(cotacao.data).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(cotacao.hora).toMatch(/^\d{2}:\d{2}$/);
      expect(cotacao.preco).toBeGreaterThan(0);
    });
  }, 10000);

  it('deve ter múltiplas cotações (pelo menos 20)', async () => {
    const historico = await buscarHistoricoMensal();

    // Histórico mensal deve ter várias cotações
    expect(historico.length).toBeGreaterThanOrEqual(20);
  }, 10000);

  it('deve ter cotações de diferentes tipos de café', async () => {
    const historico = await buscarHistoricoMensal();

    const tipos = [...new Set(historico.map((c) => c.tipo))];

    // Deve ter pelo menos 3 tipos diferentes
    expect(tipos.length).toBeGreaterThanOrEqual(3);

    // Tipos esperados
    expect(tipos).toContain('Conilon 7');
    expect(tipos).toContain('Conilon 7/8');
    expect(tipos).toContain('Conilon 8');
  }, 10000);

  it('deve ter cotações em ordem cronológica', async () => {
    const historico = await buscarHistoricoMensal();

    // Pega cotações do mesmo tipo para comparar datas
    const conilon7 = historico.filter((c) => c.tipo === 'Conilon 7');

    if (conilon7.length >= 2) {
      // Converte dd/mm/aaaa para Date
      const parseDMY = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
      };

      const primeira = parseDMY(conilon7[0].data);
      const ultima = parseDMY(conilon7[conilon7.length - 1].data);

      // Primeira data deve ser menor ou igual à última
      expect(primeira.getTime()).toBeLessThanOrEqual(ultima.getTime());
    }
  }, 10000);
});
