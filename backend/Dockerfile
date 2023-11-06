# Use an official Python runtime as the base image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .
RUN apt-get update && apt-get install -y libpq-dev gcc python3-dev # Install libpq-dev for pg_config
# Install Python dependencies
RUN pip install --no-cache-dir wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code
COPY . .

# Expose port 8000 (the default Gunicorn port)
EXPOSE 8080

# Set the command to run the app with Gunicorn
CMD ["gunicorn", "-c", "app/gunicorn.conf.py", "runner:core_app", "--access-logfile", "-"]
