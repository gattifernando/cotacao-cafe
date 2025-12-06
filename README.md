# Cotação do Café - Cooabriel

[![CI](https://github.com/gattifernando/cotacao-cafe/actions/workflows/ci.yml/badge.svg)](https://github.com/gattifernando/cotacao-cafe/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/cotacao-cafe.svg)](https://www.npmjs.com/package/cotacao-cafe)
[![npm downloads](https://img.shields.io/npm/dm/cotacao-cafe.svg)](https://www.npmjs.com/package/cotacao-cafe)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Busca programaticamente a cotação diária do café Conilon da Cooabriel.**

## 🚀 Instalação

```bash
pnpm add cotacao-cafe
```

## 🖥️ CLI

Execute direto no terminal após instalação global:

```bash
npx cotacao-cafe
```

Ou instale globalmente:

```bash
npm install -g cotacao-cafe
cotacao-cafe
```

## 📖 Uso

### Cotação do dia

```typescript
import { buscarCotacaoCooabriel } from 'cotacao-cafe';

async function main() {
  const cotacoes = await buscarCotacaoCooabriel();
  console.table(cotacoes);
}

main();
```

**Saída:**

```text
┌─────────┬─────────────┬────────────┬───────┬────────┐
│ (index) │    tipo     │    data    │ hora  │ preco  │
├─────────┼─────────────┼────────────┼───────┼────────┤
│    0    │ 'Conilon 7' │ '05/12/2025'│ '10:30'│ 1360  │
│    1    │'Conilon 7/8'│ '05/12/2025'│ '10:30'│ 1355  │
│    2    │ 'Conilon 8' │ '05/12/2025'│ '10:30'│ 1350  │
└─────────┴─────────────┴────────────┴───────┴────────┘
```

### Histórico mensal

```typescript
import { buscarHistoricoMensal } from 'cotacao-cafe';

const cotacoes = await buscarHistoricoMensal();
console.log(`Total: ${cotacoes.length} cotações`);

// Filtrar por tipo
const conilon7 = cotacoes.filter((c) => c.tipo === 'Conilon 7');
console.table(conilon7.slice(-5)); // Últimas 5 cotações
```

### Formatando para exibição

```typescript
import { buscarCotacaoCooabriel } from 'cotacao-cafe';

const cotacoes = await buscarCotacaoCooabriel();
const formatador = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

cotacoes.forEach((cotacao) => {
  console.log(
    `${cotacao.tipo.padEnd(12)} | ${cotacao.data} | ${cotacao.hora} | ${formatador.format(cotacao.preco)}`
  );
});
```

**Saída formatada:**

```text
Conilon 7    | 05/12/2025 | 10:30 | R$ 1.360,00
Conilon 7/8  | 05/12/2025 | 10:30 | R$ 1.355,00
Conilon 8    | 05/12/2025 | 10:30 | R$ 1.350,00
```

## 🧩 Tipos

```typescript
type CotacaoCafe = {
  tipo: string; // "Conilon 7", "Conilon 7/8", etc.
  data: string; // "dd/mm/aaaa"
  hora: string; // "hh:mm"
  preco: number; // valor em reais (1360.0)
};
```

## 🎯 Por que usar?

- **Útil**: Cotação oficial da Cooabriel é referência para produtores de café Conilon no ES
- **Simples**: Funções async diretas
- **Completo**: Cotação do dia + histórico mensal
- **Tipado**: TypeScript com tipos claros
- **Testado**: 100% de cobertura de testes
- **Offline**: Testes usam fixture, não depende da internet

## ⚠️ Limitações

- Depende da estrutura HTML da página da Cooabriel
- Pode quebrar se o site mudar o layout da tabela
- Rate limiting: não faça requests muito frequentes

## 🛠️ Desenvolvimento

```bash
git clone https://github.com/gattifernando/cotacao-cafe
cd cotacao-cafe
pnpm install
pnpm dev              # testa contra site real
pnpm test             # testes unitários (com fixtures)
pnpm test:integration # testes de integração (requisições reais)
pnpm test:all         # todos os testes
```

### Scripts Disponíveis

- `pnpm dev` - Executa script de desenvolvimento com dados reais
- `pnpm cli` - Testa CLI localmente
- `pnpm build` - Compila TypeScript
- `pnpm test` - Testes unitários (offline, com fixtures)
- `pnpm test:integration` - Testes de integração (online, contra site real)
- `pnpm test:all` - Todos os testes (unitários + integração)
- `pnpm test:dev` - Testes em modo watch
- `pnpm typecheck` - Verificação de tipos
- `pnpm lint` - ESLint
- `pnpm format` - Prettier

## 🧪 Testes

O projeto possui dois tipos de testes:

### Testes Unitários (offline)

- Usam fixtures HTML salvos
- Rápidos e confiáveis
- Não dependem do site estar no ar
- Executam no CI a cada commit

### Testes de Integração (online)

- Fazem requisições reais ao site
- Validam se o scraping ainda funciona
- Detectam mudanças na estrutura do site
- Execute manualmente: `pnpm test:integration`
- **Executam automaticamente todos os dias às 9h** via GitHub Actions
- Criam uma issue automaticamente se detectarem falha

## ⚠️ Limitações

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças usando [Conventional Commits](https://www.conventionalcommits.org/)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT - veja [LICENSE](LICENSE) para detalhes.

## 📧 Contato

- Fernando Gatti - [GitHub](https://github.com/gattifernando) - [LinkedIn](https://www.linkedin.com/in/gattifernando/)
- Repositório: [github.com/gattifernando/cotacao-cafe](https://github.com/gattifernando/cotacao-cafe)
