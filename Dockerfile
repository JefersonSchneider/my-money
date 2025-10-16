# Use uma imagem base do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie os arquivos de manifesto do pacote e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Exponha a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev"]