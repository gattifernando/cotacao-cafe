import { describe, it, expect } from 'vitest';
import { extrairCotacaoCooabriel } from '../src/extrairCotacaoCooabriel.js';
import fs from 'node:fs';
import path from 'node:path';
const fixturesDir = path.resolve('tests', 'fixtures');
const htmlFixture = fs.readFileSync(path.join(fixturesDir, 'cotacao-cooabriel.html'), 'utf-8');
describe('extrairCotacaoCooabriel', () => {
    it('deve extrair todas as linhas da tabela de cotação', () => {
        const cotacoes = extrairCotacaoCooabriel(htmlFixture);
        expect(cotacoes).toHaveLength(3);
        expect(cotacoes[0]).toEqual({
            tipo: 'Conilon 7',
            data: '05/12/2025',
            hora: '10:30',
            preco: 1360.0,
        });
    });
    it('deve converter preço brasileiro para número corretamente', () => {
        const cotacoes = extrairCotacaoCooabriel(htmlFixture);
        expect(cotacoes.map((c) => c.preco)).toEqual([1360.0, 1355.0, 1350.0]);
    });
    it('deve lançar erro se a tabela de cotação não existir', () => {
        const htmlVazio = '<html></html>';
        expect(() => extrairCotacaoCooabriel(htmlVazio)).toThrow('Não foi possível encontrar a tabela de cotação do café na página da Cooabriel');
    });
});
