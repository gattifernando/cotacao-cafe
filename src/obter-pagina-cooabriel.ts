const URL_COTACAO_COOABRIEL = 'https://cooabriel.coop.br/cotacao-do-dia';

export async function obterPaginaCooabriel(): Promise<string> {
  const resposta = await fetch(URL_COTACAO_COOABRIEL);

  if (!resposta.ok) {
    throw new Error(
      `Não foi possível obter a página de cotação da Cooabriel (status ${resposta.status}).`
    );
  }

  const html = await resposta.text();
  return html;
}
