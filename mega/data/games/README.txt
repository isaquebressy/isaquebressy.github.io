Como adicionar um jogo
======================

1. Crie um arquivo .json nesta pasta (ex.: timemania.json), copiando a estrutura de mega-sena.json.

2. Campos obrigatórios:
   - id           — identificador único (ex.: "timemania")
   - nomeMenu     — texto exibido no menu e no título (ex.: "TIMEMANIA")
   - classeCss    — classe para ícone/cor no menu (defina em mega/style.css se for novo)
   - cor, min, max, sorteioQtd, apostaMin, apostaMax
   - premioAcertosMin, premioAcertosMax
   - tipoTextoPremio — "faixa" (texto padrão) ou "lotomania" (texto especial 0 / 15–20)
   - formatoBolas — "padrao" ou "lotomania" (dezenas 01–99 e 00)

3. Edite index.json e acrescente o nome do arquivo no array "games", na ordem do menu.

Obs.: em hospedagem estática (GitHub Pages) não dá para “listar” arquivos da pasta; por isso o index.json é necessário.
