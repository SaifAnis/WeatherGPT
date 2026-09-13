from fastapi import FastAPI
app = FastAPI(title='WeatherGPT API')

@app.get('/health')
def health_check():
    return {'status': 'ok'}
