# Cotação do Café - Cooabriel

[![pnpm](https://img.shields.io/badge/pnpm-%3E=10.23.0-brightgreen.svg)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-100%25-brightgreen.svg)](https://vitest.dev)

**Busca programaticamente a cotação diária do café Conilon da Cooabriel.**

## 🚀 Instalação

```
pnpm add cotacao-cafe
```

## 📖 Uso

```
import { buscarCotacaoCooabriel } from "cotacao-cafe";

async function main() {
const cotacoes = await buscarCotacaoCooabriel();
console.table(cotacoes);
}

main();
```

**Saída:**

```
┌─────────┬────────────┬────────────┬────────┬──────────┐
│ (index) │ tipo │ data │ hora │ preco │
├─────────┼────────────┼────────────┼────────┼──────────┤
│ 0 │ Conilon 7 │ 05/12/2025 │ 10:30 │ 1360.0 │
│ 1 │ Conilon 7/8│ 05/12/2025 │ 10:30 │ 1355.0 │
│ 2 │ Conilon 8 │ 05/12/2025 │ 10:30 │ 1350.0 │
└─────────┴────────────┴────────────┴────────┴──────────┘
```

## 🧩 Tipos

```
type CotacaoCafe = {
tipo: string; // "Conilon 7", "Conilon 7/8", etc.
data: string; // "dd/mm/aaaa"
hora: string; // "hh:mm"
preco: number; // valor em reais (1360.0)
};
```

## 🎯 Por que usar?

- **Útil**: Cotação oficial da Cooabriel é referência para produtores de café Conilon no ES [web:3]
- **Simples**: Uma única função async
- **Tipado**: TypeScript com tipos claros
- **Testado**: 100% de cobertura de testes
- **Offline**: Testes usam fixture, não depende da internet

## ⚠️ Limitações

- Depende da estrutura HTML da página da Cooabriel
- Pode quebrar se o site mudar o layout da tabela
- Rate limiting: não faça requests muito frequentes

## 🛠️ Desenvolvimento

git clone https://github.com/gattifernando/cotacao-cafe
cd cotacao-cafe
pnpm install
pnpm dev # testa contra site real
pnpm test # testes unitários

## 📄 Licença

MIT
