FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# We use --import-headers to help with routing
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT --proxy-headers
