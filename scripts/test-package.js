#!/usr/bin/env node
/* eslint-disable no-console */
import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

console.log('🧪 Testando pacote como se fosse instalado do npm...\n');

// Cria diretório temporário
const testDir = mkdtempSync(join(tmpdir(), 'test-cotacao-cafe-'));
console.log(`📁 Diretório de teste: ${testDir}\n`);

// Cleanup ao finalizar
const cleanup = () => {
  console.log('\n🧹 Limpando...');
  rmSync(testDir, { recursive: true, force: true });
};
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});

try {
  // Cria package.json mínimo
  writeFileSync(
    join(testDir, 'package.json'),
    JSON.stringify({
      name: 'test-cotacao-cafe',
      version: '1.0.0',
      type: 'module',
    })
  );

  // Instala o pacote LOCAL (não do npm)
  const packageDir = process.cwd();
  console.log(`📦 Instalando pacote de: ${packageDir}`);
  execSync(`npm install "${packageDir}"`, {
    cwd: testDir,
    stdio: 'pipe',
  });
  console.log('✓ Instalação concluída\n');

  // Teste 1: CLI executa sem erros
  console.log('✅ Teste 1: CLI executa sem erros');
  try {
    execSync('npx cotacao-cafe', {
      cwd: testDir,
      stdio: 'pipe',
    });
    console.log('   ✓ CLI funcionou\n');
  } catch {
    console.error('   ❌ CLI falhou');
    process.exit(1);
  }

  // Teste 2: Import ES Module funciona
  console.log('✅ Teste 2: Import ES Module funciona');
  writeFileSync(
    join(testDir, 'test-import.mjs'),
    `
import { buscarCotacaoCooabriel, buscarHistoricoMensal } from 'cotacao-cafe';

console.log('✓ Import bem-sucedido');
console.log('✓ Funções disponíveis:', {
  buscarCotacaoCooabriel: typeof buscarCotacaoCooabriel,
  buscarHistoricoMensal: typeof buscarHistoricoMensal
});

if (typeof buscarCotacaoCooabriel !== 'function') {
  throw new Error('buscarCotacaoCooabriel não é função');
}
if (typeof buscarHistoricoMensal !== 'function') {
  throw new Error('buscarHistoricoMensal não é função');
}
`
  );

  execSync('node test-import.mjs', {
    cwd: testDir,
    stdio: 'inherit',
  });
  console.log('   ✓ Import funcionou\n');

  // Teste 3: TypeScript types disponíveis
  console.log('✅ Teste 3: TypeScript types disponíveis');
  writeFileSync(
    join(testDir, 'test-types.ts'),
    `
import type { CotacaoCafe } from 'cotacao-cafe';
import { buscarCotacaoCooabriel, buscarHistoricoMensal } from 'cotacao-cafe';

async function test() {
  const cotacoes: CotacaoCafe[] = await buscarCotacaoCooabriel();
  const historico: CotacaoCafe[] = await buscarHistoricoMensal();
  
  const primeira: CotacaoCafe = cotacoes[0];
  const tipo: string = primeira.tipo;
  const preco: number = primeira.preco;
  
  console.log('✓ Tipos TypeScript corretos');
}
`
  );

  // Instala TypeScript localmente no teste
  execSync('npm install --save-dev typescript', {
    cwd: testDir,
    stdio: 'pipe',
  });

  execSync('npx tsc --version && npx tsc --noEmit --skipLibCheck test-types.ts', {
    cwd: testDir,
    stdio: 'pipe',
  });
  console.log('   ✓ Types funcionaram\n');

  // Teste 4: CLI tem shebang correto
  console.log('✅ Teste 4: CLI tem shebang correto');
  const cliPath = join(testDir, 'node_modules', 'cotacao-cafe', 'dist', 'cli.js');
  const cliContent = readFileSync(cliPath, 'utf-8');
  const firstLine = cliContent.split('\n')[0];

  if (!firstLine.startsWith('#!/usr/bin/env')) {
    console.error(`   ❌ CLI não tem shebang correto: ${firstLine}`);
    process.exit(1);
  }
  console.log(`   ✓ Shebang correto: ${firstLine}\n`);

  // Teste 5: Arquivos essenciais existem
  console.log('✅ Teste 5: Arquivos essenciais existem');
  const essentialFiles = [
    'dist/index.js',
    'dist/index.d.ts',
    'dist/cli.js',
    'package.json',
  ];

  for (const file of essentialFiles) {
    const filePath = join(testDir, 'node_modules', 'cotacao-cafe', file);
    try {
      readFileSync(filePath);
      console.log(`   ✓ ${file} existe`);
    } catch {
      console.error(`   ❌ Arquivo faltando: ${file}`);
      process.exit(1);
    }
  }

  console.log('\n🎉 Todos os testes de pacote passaram!');
  console.log('✓ CLI funciona');
  console.log('✓ Import ES Module funciona');
  console.log('✓ TypeScript types corretos');
  console.log('✓ Estrutura de arquivos correta');
} catch (error) {
  console.error('\n❌ Erro durante os testes:', error.message);
  process.exit(1);
}
