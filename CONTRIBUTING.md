# Contribuindo para cotacao-cafe

Obrigado por considerar contribuir! 🎉

## Como Contribuir

### Reportando Bugs

1. Use a [issue tracker](https://github.com/gattifernando/cotacao-cafe/issues)
2. Verifique se o bug já não foi reportado
3. Use o template de bug report
4. Inclua código de exemplo para reproduzir
5. Inclua informações sobre o ambiente

### Sugerindo Funcionalidades

1. Abra uma issue usando o template de feature request
2. Descreva claramente a funcionalidade e a motivação
3. Forneça exemplos de uso

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** a partir de `main`:

   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/meu-bugfix
   ```

4. **Instale as dependências**:

   ```bash
   pnpm install
   ```

5. **Faça suas mudanças** seguindo o estilo do código

6. **Execute os testes**:

   ```bash
   pnpm test             # testes unitários (com fixtures)
   pnpm test:integration # testes de integração (site real)
   pnpm test:all         # todos os testes
   pnpm lint             # linting
   pnpm typecheck        # verificação de tipos
   pnpm build            # build
   ```

7. **Commit suas mudanças** usando [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: adiciona suporte para café arábica"
   git commit -m "fix: corrige parsing de data"
   git commit -m "docs: atualiza README com exemplos"
   ```

   Tipos de commit:
   - `feat`: Nova funcionalidade
   - `fix`: Correção de bug
   - `docs`: Documentação
   - `style`: Formatação (sem mudança de código)
   - `refactor`: Refatoração
   - `test`: Adição ou correção de testes
   - `chore`: Tarefas de manutenção

8. **Push para seu fork**:

   ```bash
   git push origin feature/minha-feature
   ```

9. **Abra um Pull Request** no GitHub

## Padrões de Código

### TypeScript

- Use TypeScript strict mode
- Sempre adicione tipos explícitos
- Evite `any` a todo custo
- Use interfaces para tipos públicos

### Formatação

- O projeto usa Prettier para formatação automática
- Execute `pnpm format:fix` antes de commitar
- 2 espaços para indentação
- Ponto e vírgula obrigatório
- Aspas simples

### Testes

- Todo código novo deve ter testes
- Mantenha 100% de cobertura
- Use fixtures para dados externos
- Organize testes em `describe` e `it`
- Nomes descritivos em português

**Testes Unitários:**

```typescript
describe('extrairCotacaoDoDia', () => {
  it('deve extrair cotações da tabela HTML', () => {
    // Usa fixture HTML
  });
});
```

**Testes de Integração:**

```typescript
describe('Integração - buscarCotacaoCooabriel', () => {
  it('deve buscar cotações reais do site', async () => {
    // Faz requisição real
  }, 10000); // timeout de 10s
});
```

### Documentação

- Atualize o README.md se necessário
- Use JSDoc para funções públicas
- Exemplos de código devem ser testáveis
- Mantenha CHANGELOG.md atualizado (semantic-release faz automaticamente)

## Estrutura do Projeto

```
cotacao-cafe/
├── src/
│   ├── index.ts                    # Exports públicos
│   ├── extrair-cotacao-do-dia.ts  # Extração HTML
│   ├── extrair-historico-mensal.ts # Extração JSON
│   ├── obter-pagina-cooabriel.ts  # Fetch HTML
│   ├── cli.ts                     # CLI tool
│   └── dev.ts                     # Script de desenvolvimento
├── tests/
│   ├── extrair-cotacao-do-dia.test.ts
│   ├── extrair-historico-mensal.test.ts
│   ├── cli.test.ts
│   └── fixtures/                  # HTML de exemplo
├── dist/                          # Build output (git-ignored)
└── package.json
```

## Scripts Disponíveis

```bash
pnpm dev              # Executa src/dev.ts (fetch real)
pnpm cli              # Executa CLI localmente
pnpm build            # Compila TypeScript
pnpm test             # Testes unitários (com fixtures)
pnpm test:integration # Testes de integração (site real)
pnpm test:all         # Todos os testes
pnpm test:dev         # Testes em modo watch
pnpm typecheck        # Verificação de tipos
pnpm lint             # ESLint
pnpm lint:fix         # ESLint com auto-fix
pnpm format           # Prettier check
pnpm format:fix       # Prettier auto-fix
```

## Processo de Release

O projeto usa [semantic-release](https://github.com/semantic-release/semantic-release):

1. Commits são analisados automaticamente
2. Versão é incrementada baseada nos commits:
   - `fix:` → patch (1.0.x)
   - `feat:` → minor (1.x.0)
   - `BREAKING CHANGE:` → major (x.0.0)
3. CHANGELOG.md é atualizado automaticamente
4. Tag é criada no GitHub
5. Pacote é publicado no npm

**Você não precisa se preocupar com versões!** Apenas use commits semânticos.

## Dúvidas?

Abra uma [issue](https://github.com/gattifernando/cotacao-cafe/issues) ou entre em contato com os mantenedores.
