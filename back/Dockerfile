# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอกไฟล์ package ทั้งหมด
COPY package*.json ./

# ติดตั้ง dependencies ทั้งหมดเพื่อใช้ในการ build
RUN npm ci || npm install

# คัดลอก source code ทั้งหมด
COPY . .

# สร้างไฟล์ Production Build (dist/)
RUN npm run build


# --- Stage 2: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# คัดลอกเฉพาะ package.json เพื่อติดตั้งเฉพาะ production dependencies
COPY package*.json ./

# ติดตั้งเฉพาะ production dependencies เพื่อลดขนาด image
RUN npm ci --only=production || npm install --omit=dev

# คัดลอกไฟล์ build artifacts จาก builder stage
COPY --from=builder /app/dist ./dist

# หมายเหตุ: ไม่จำเป็นต้อง COPY src หรือ tsconfig ใน production runner สเตจนี้ครับ

EXPOSE 3000

# รันคำสั่งเรียงตามลำดับเมื่อ container เริ่มทำงาน
CMD ["sh", "-c", "npm run migration:run && npm run seed:admin && npm run start:prod"]