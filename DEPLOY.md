# Deploy estatico com Docker Swarm

Este projeto nao usa mais WordPress, MySQL nem volume persistente. Agora o deploy e um container Nginx servindo `index.html` e `assets/`.

## 1. Baixar o repositorio no servidor

```bash
git clone https://github.com/queziajesuinod/cassiamarylp.git
cd cassiamarylp
```

## 2. Buildar a imagem localmente no manager

O `Dockerfile` agora baixa o projeto do GitHub durante o build.
Por padrao ele usa:

- `REPO_URL=https://github.com/queziajesuinod/cassiamarylp.git`
- `REPO_REF=main`

```bash
docker build \
  --build-arg REPO_URL=https://github.com/queziajesuinod/cassiamarylp.git \
  --build-arg REPO_REF=main \
  -t cassiamarylp:latest .
```

## 3. Publicar no Swarm

```bash
docker stack deploy --resolve-image never -c docker-stack.yml cassiamarylima
```

## 4. Atualizar depois de novas mudancas

```bash
git pull
docker build \
  --build-arg REPO_URL=https://github.com/queziajesuinod/cassiamarylp.git \
  --build-arg REPO_REF=main \
  -t cassiamarylp:latest .
docker stack deploy --resolve-image never -c docker-stack.yml cassiamarylima
```

## 5. Se ainda existir o stack antigo do WordPress

Primeiro remova o stack antigo para evitar conflito de router/service no Traefik:

```bash
docker stack rm cassiamarylima
```

Depois rode o deploy novo.

## Observacoes

- O arquivo de stack novo esta em `docker-stack.yml`.
- O servidor web agora e Nginx, sem banco e sem volume do WordPress.
- A rede `network_public` continua externa, igual ao ambiente anterior.
- O redirect de `www.cassiamarylima.com.br` para `cassiamarylima.com.br` foi mantido.
- O build agora pega o que estiver publicado no GitHub nessa branch/ref. Se houver mudancas locais, faca `git push` antes de buildar.
- Se o seu Traefik nao faz redirect global de HTTP para HTTPS, adicione esse middleware no proprio Traefik ou crie routers `web` separados.
