FROM node:18-alpine

WORKDIR /app

# 安裝依賴
COPY package.json package-lock.json ./
RUN npm ci --only=production=false

# 複製原始碼
COPY . .

# Build
RUN npx next build

# 資料目錄
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
