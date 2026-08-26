# Multi-stage / Lightweight Dockerfile for Google Cloud Run
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8080 \
    HOST=0.0.0.0

# Set working directory
WORKDIR /app

# Copy all project files
COPY . /app

# Initialize SQLite database
RUN python backend/database.py

# Expose port (Cloud Run sets $PORT dynamically, default 8080)
EXPOSE 8080

# Launch server
CMD ["python", "backend/app.py"]
