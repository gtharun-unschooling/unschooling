FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements_minimal.txt .
RUN pip install --no-cache-dir -r requirements_minimal.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main_agents:app", "--host", "0.0.0.0", "--port", "8080"] 