import type { CotacaoCafe } from './index.js';

interface CotacaoMensalRaw {
  data: string;
  hora: string;
  preco: number;
  precoSafraAntiga: number;
  precoSafraNova: number;
}

interface TipoCafeMensal {
  nomeCafe: string;
  cotacoes: CotacaoMensalRaw[];
}

interface NextData {
  props: {
    pageProps: {
      ssp: {
        mensal?: TipoCafeMensal[];
        semanal?: TipoCafeMensal[];
      };
    };
  };
}

export function extrairHistoricoMensal(html: string): CotacaoCafe[] {
  // Extrair o JSON do __NEXT_DATA__
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
  );

  if (!match || !match[1]) {
    throw new Error(
      'Não foi possível encontrar os dados do Next.js na página.'
    );
  }

  try {
    const nextData: NextData = JSON.parse(match[1]);
    const mensal = nextData.props?.pageProps?.ssp?.mensal;

    if (!mensal || !Array.isArray(mensal) || mensal.length === 0) {
      throw new Error('Não foram encontradas cotações mensais.');
    }

    // Converter para o formato CotacaoCafe
    const cotacoes: CotacaoCafe[] = [];

    for (const tipoCafe of mensal) {
      for (const cotacao of tipoCafe.cotacoes) {
        cotacoes.push({
          tipo: tipoCafe.nomeCafe,
          data: cotacao.data,
          hora: cotacao.hora,
          preco: cotacao.preco,
        });
      }
    }

    if (cotacoes.length === 0) {
      throw new Error('Nenhuma cotação mensal encontrada.');
    }

    return cotacoes;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Erro ao processar o JSON da página.');
    }
    throw error;
  }
}
