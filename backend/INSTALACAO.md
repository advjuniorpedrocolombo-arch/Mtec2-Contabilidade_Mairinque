# Implantação do backend LTP

1. Abra a planilha **LTP - Banco Central - 2º MTEC Contabilidade Mairinque**.
2. Vá em **Extensões > Apps Script**.
3. Apague o conteúdo padrão de `Code.gs`.
4. Copie o conteúdo do arquivo `backend/Code.gs` deste repositório e cole no Apps Script.
5. Salve o projeto com o nome `LTP - Portal 2º MTEC Mairinque`.
6. Clique em **Implantar > Nova implantação**.
7. Tipo: **Aplicativo da Web**.
8. Executar como: **Eu**.
9. Quem pode acessar: **Qualquer pessoa**.
10. Autorize o acesso ao Google Drive e Google Sheets quando solicitado.
11. Copie a URL terminada em `/exec`.
12. Cole essa URL no campo `apiUrl` do arquivo `config.js`.
13. Na aba `CONFIG` da planilha, registre a mesma URL na chave `WEB_APP_URL`.

## Teste rápido

Abra no navegador:

`SUA_URL_EXEC?action=ping`

O retorno esperado contém `"ok":true`.

Depois abra o Painel do Professor e cadastre uma atividade de teste como `RASCUNHO`. Quando estiver correta, altere para `PUBLICADA`.

## Estrutura usada

- Planilha central: `1nQUnqLeDb3QfI_klo_WM2mEx6Yq4K-nQyp1wjU89Ox8`
- Pasta raiz LTP: `12spWnn4ZsCz8kVg6T8aSW8lg0bDYCKxi`
- Pasta MATERIAIS: `1ebrCH2wpHShXuS5tFjUqMTkNh2lVA0KH`
- Pasta ENTREGAS: `17pk_dqe3lzwYGU9e5VkpCwnOf-iwnGfV`

O backend cria automaticamente subpastas por atividade e por aluno dentro de `ENTREGAS`.