# Cotação do Café - Cooabriel

[![pnpm](https://img.shields.io/badge/pnpm-%3E=10.23.0-brightgreen.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-100%25-brightgreen.svg)](https://vitest.dev)

**Busca programaticamente a cotação diária do café Conilon da Cooabriel.**

## 🚀 Instalação

```bash
pnpm add cotacao-cafe
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
pnpm dev   # testa contra site real
pnpm test  # testes unitários
```

## 📄 Licença

MIT
